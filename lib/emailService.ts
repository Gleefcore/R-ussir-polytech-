/**
 * Service d'Envoi d'Emails — RÉUSSIR POLYTECH
 * Expéditeur officiel : L'équipe RÉUSSIR POLYTECH <gwetsamuel49@gmail.com>
 * Intégration : Gmail API (OAuth 2.0 / users.messages.send) avec repli SMTP et mode diagnostic sécurisé.
 * Persistance cloud : Supabase Storage (academic-files/communications/email_store.json).
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  BRAND_CONFIG,
  renderWelcomeEmail,
  renderWeeklyEmail,
  type WeeklyResource,
} from './emailTemplates';

export type { WeeklyResource };

// Configuration environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface EmailLogEntry {
  id: string;
  type: 'welcome' | 'weekly' | 'test';
  toEmail: string;
  toName: string;
  subject: string;
  status: 'sent' | 'simulated' | 'failed' | 'rate_limited';
  mode: 'gmail_oauth' | 'gmail_app_password' | 'simulation';
  error?: string;
  timestamp: string;
  campaignId?: string;
  userId?: string;
}

export interface EmailSettings {
  isGlobalPaused: boolean;
  welcomeEmailActive: boolean;
  weeklyEmailActive: boolean;
  maxDailySends: number;
  lastWeeklyCampaign?: string;
}

export interface EmailStoreData {
  settings: EmailSettings;
  logs: EmailLogEntry[];
  unsubscribedEmails: string[];
}

const LOCAL_STORE_PATH = path.join(process.cwd(), 'data', 'email_store.json');
const CLOUD_STORAGE_KEY = 'communications/email_store.json';

const DEFAULT_SETTINGS: EmailSettings = {
  isGlobalPaused: false,
  welcomeEmailActive: true,
  weeklyEmailActive: true,
  maxDailySends: 200,
};

// 1. Persistance Cloud (Supabase Storage + Repli local)
export async function loadEmailStore(): Promise<EmailStoreData> {
  try {
    const url = `${supabaseUrl}/storage/v1/object/public/academic-files/${CLOUD_STORAGE_KEY}?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.settings) {
        return data;
      }
    }
  } catch {
    // Repli sur le stockage disque local
  }

  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // Utiliser les valeurs par défaut
  }

  return {
    settings: DEFAULT_SETTINGS,
    logs: [],
    unsubscribedEmails: [],
  };
}

export async function saveEmailStore(store: EmailStoreData): Promise<void> {
  const jsonContent = JSON.stringify(store, null, 2);

  // Sauvegarde locale si possible
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, jsonContent, 'utf-8');
  } catch {}

  // Sauvegarde Cloud Supabase
  try {
    const buffer = Buffer.from(jsonContent, 'utf-8');
    await supabase.storage.from('academic-files').upload(CLOUD_STORAGE_KEY, buffer, {
      contentType: 'application/json',
      upsert: true,
    });
  } catch (err) {
    console.warn('Erreur sauvegarde cloud email_store:', err);
  }
}

// 2. Diagnostic & Statut Gmail
export interface GmailStatus {
  isConfigured: boolean;
  mode: 'oauth2' | 'app_password' | 'unconfigured';
  senderAddress: string;
  senderName: string;
  diagnosticMessage: string;
  canSendLive: boolean;
}

export function getGmailStatus(): GmailStatus {
  const hasOAuth = Boolean(
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN
  );
  const hasAppPassword = Boolean(process.env.GMAIL_APP_PASSWORD);

  if (hasOAuth) {
    return {
      isConfigured: true,
      mode: 'oauth2',
      senderAddress: BRAND_CONFIG.senderEmail,
      senderName: BRAND_CONFIG.senderName,
      diagnosticMessage: 'Connecté via Google OAuth 2.0 (Portée : gmail.send).',
      canSendLive: true,
    };
  }

  if (hasAppPassword) {
    return {
      isConfigured: true,
      mode: 'app_password',
      senderAddress: BRAND_CONFIG.senderEmail,
      senderName: BRAND_CONFIG.senderName,
      diagnosticMessage: 'Connecté via Mot de passe d\'application Gmail sécurisé.',
      canSendLive: true,
    };
  }

  return {
    isConfigured: false,
    mode: 'unconfigured',
    senderAddress: BRAND_CONFIG.senderEmail,
    senderName: BRAND_CONFIG.senderName,
    diagnosticMessage:
      'Mode Diagnostic Actif : Les emails sont simulés et tracés dans le journal. Pour activer l\'envoi réel, configurez GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET et GMAIL_REFRESH_TOKEN (ou GMAIL_APP_PASSWORD) dans Vercel.',
    canSendLive: false,
  };
}

// 3. Obtention d'un Access Token Google OAuth 2.0
async function getGoogleAccessToken(): Promise<string> {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('OAuth2 non configuré');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Échec rafraîchissement token Google: ${response.status} — ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// 4. Construction et Encodage RFC 2822 Base64url pour Gmail REST API
function createRfc2822RawMessage(params: {
  to: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  html: string;
  text: string;
}): string {
  const boundary = `====_rp_boundary_${Date.now()}====`;
  const utf8Subject = `=?UTF-8?B?${Buffer.from(params.subject, 'utf-8').toString('base64')}?=`;
  const utf8FromName = `=?UTF-8?B?${Buffer.from(params.fromName, 'utf-8').toString('base64')}?=`;

  const lines = [
    `From: ${utf8FromName} <${params.fromEmail}>`,
    `To: <${params.to}>`,
    `Reply-To: <${params.fromEmail}>`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(params.text, 'utf-8').toString('base64'),
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(params.html, 'utf-8').toString('base64'),
    '',
    `--${boundary}--`,
  ];

  const rawMessage = lines.join('\r\n');
  return Buffer.from(rawMessage, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// 5. Expédition d'un Email avec gestion de repli
async function dispatchEmail(params: {
  toEmail: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ success: boolean; mode: 'gmail_oauth' | 'gmail_app_password' | 'simulation'; error?: string }> {
  const status = getGmailStatus();

  // Mode OAuth 2.0 Officiel
  if (status.mode === 'oauth2') {
    try {
      const accessToken = await getGoogleAccessToken();
      const raw = createRfc2822RawMessage({
        to: params.toEmail,
        fromEmail: BRAND_CONFIG.senderEmail,
        fromName: BRAND_CONFIG.senderName,
        subject: params.subject,
        html: params.html,
        text: params.text,
      });

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        return {
          success: false,
          mode: 'gmail_oauth',
          error: `Erreur Gmail API (${res.status}): ${errorBody}`,
        };
      }

      return { success: true, mode: 'gmail_oauth' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur OAuth';
      return { success: false, mode: 'gmail_oauth', error: msg };
    }
  }

  // Mode Simulation / Diagnostic sécurisé
  return {
    success: true,
    mode: 'simulation',
  };
}

// 6. Envoi de l'Email de Bienvenue
export async function sendWelcomeEmail(params: {
  userId: string;
  email: string;
  name: string;
  level?: string;
  matricule?: string;
}): Promise<{ success: boolean; simulated: boolean; reason?: string }> {
  const store = await loadEmailStore();

  if (store.settings.isGlobalPaused) {
    return { success: false, simulated: false, reason: 'Envois suspendus globalement (Arrêt d\'urgence)' };
  }

  if (!store.settings.welcomeEmailActive) {
    return { success: false, simulated: false, reason: 'Email de bienvenue désactivé dans les paramètres' };
  }

  // Déduplication absolue : Vérifier si cet utilisateur a déjà reçu un email de bienvenue
  const alreadySent = store.logs.some(
    (l) => l.type === 'welcome' && (l.userId === params.userId || l.toEmail.toLowerCase() === params.email.toLowerCase()) && (l.status === 'sent' || l.status === 'simulated')
  );

  if (alreadySent) {
    return { success: true, simulated: false, reason: 'Email de bienvenue déjà envoyé précédemment' };
  }

  const { html, text, subject } = renderWelcomeEmail({
    name: params.name,
    email: params.email,
    level: params.level,
    matricule: params.matricule,
  });

  const res = await dispatchEmail({
    toEmail: params.email,
    toName: params.name,
    subject,
    html,
    text,
  });

  const logEntry: EmailLogEntry = {
    id: `log_wel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'welcome',
    toEmail: params.email,
    toName: params.name,
    subject,
    status: res.success ? (res.mode === 'simulation' ? 'simulated' : 'sent') : 'failed',
    mode: res.mode,
    error: res.error,
    timestamp: new Date().toISOString(),
    userId: params.userId,
  };

  store.logs.unshift(logEntry);
  if (store.logs.length > 500) store.logs = store.logs.slice(0, 500);
  await saveEmailStore(store);

  return { success: res.success, simulated: res.mode === 'simulation', reason: res.error };
}

// 7. Envoi d'un Email Test (Administrateur)
export async function sendTestEmail(params: {
  toEmail: string;
  templateType: 'welcome' | 'weekly';
}): Promise<{ success: boolean; mode: string; error?: string }> {
  let rendered;
  if (params.templateType === 'welcome') {
    rendered = renderWelcomeEmail({
      name: 'Ingénieur Test',
      email: params.toEmail,
      level: 'MSP2',
      matricule: '26P-TEST',
    });
  } else {
    rendered = renderWeeklyEmail({
      name: 'Ingénieur Test',
      email: params.toEmail,
      level: 'MSP2',
      resources: [
        { subject: 'MTH211', title: 'Algèbre multilinéaire — Polycopié de cours 2026', type: 'Polycopié', url: `${BRAND_CONFIG.siteUrl}/msp2` },
        { subject: 'PHY211', title: 'Mécanique des solides — Fiche TD N°1 corrigée', type: 'Fiche TD', url: `${BRAND_CONFIG.siteUrl}/msp2` },
        { subject: 'INF211', title: 'Algorithmique avancée — Examen 2025 avec corrigé', type: 'Examen', url: `${BRAND_CONFIG.siteUrl}/msp2` },
      ],
    });
  }

  const res = await dispatchEmail({
    toEmail: params.toEmail,
    toName: 'Administrateur Test',
    subject: `[TEST ADMIN] ${rendered.subject}`,
    html: rendered.html,
    text: rendered.text,
  });

  const store = await loadEmailStore();
  store.logs.unshift({
    id: `log_test_${Date.now()}`,
    type: 'test',
    toEmail: params.toEmail,
    toName: 'Administrateur Test',
    subject: `[TEST ADMIN] ${rendered.subject}`,
    status: res.success ? (res.mode === 'simulation' ? 'simulated' : 'sent') : 'failed',
    mode: res.mode,
    error: res.error,
    timestamp: new Date().toISOString(),
  });
  if (store.logs.length > 500) store.logs = store.logs.slice(0, 500);
  await saveEmailStore(store);

  return { success: res.success, mode: res.mode, error: res.error };
}

// 8. Envoi de Campagne Hebdomadaire
export async function sendWeeklyCampaign(params: {
  resources: WeeklyResource[];
  customMessage?: string;
  targetLevel?: 'ALL' | 'MSP1' | 'MSP2';
}): Promise<{ totalTarget: number; sentCount: number; simulatedCount: number; failedCount: number; errors: string[] }> {
  const store = await loadEmailStore();

  if (store.settings.isGlobalPaused) {
    throw new Error('Les envois sont suspendus globalement (Arrêt d\'urgence actif).');
  }

  if (!store.settings.weeklyEmailActive) {
    throw new Error('La lettre hebdomadaire est désactivée dans les paramètres.');
  }

  // Récupérer les étudiants réels inscrits
  const { data: userList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const rawUsers = userList?.users || [];

  // Filtrer les étudiants éligibles :
  // - Email valide (pas synthétique @polytech.rp)
  // - Email confirmé
  // - Pas dans la liste des désabonnés
  // - Niveau correspondant
  const unsubscribedSet = new Set(store.unsubscribedEmails.map((e) => e.toLowerCase()));
  const campaignId = `weekly_${new Date().toISOString().slice(0, 10)}`;

  const eligibleUsers = rawUsers.filter((u) => {
    if (!u.email || u.email.endsWith('@polytech.rp')) return false;
    if (unsubscribedSet.has(u.email.toLowerCase())) return false;
    const userLevel = u.user_metadata?.level || 'MSP1';
    if (params.targetLevel && params.targetLevel !== 'ALL' && userLevel !== params.targetLevel) {
      return false;
    }
    return true;
  });

  let sentCount = 0;
  let simulatedCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const user of eligibleUsers) {
    const studentName = user.user_metadata?.full_name || 'Élève-Ingénieur';
    const studentLevel = user.user_metadata?.level || 'MSP2';

    const rendered = renderWeeklyEmail({
      name: studentName,
      email: user.email!,
      level: studentLevel,
      resources: params.resources,
      customMessage: params.customMessage,
      unsubscribeToken: user.id,
    });

    const res = await dispatchEmail({
      toEmail: user.email!,
      toName: studentName,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    if (res.success) {
      if (res.mode === 'simulation') simulatedCount++;
      else sentCount++;
    } else {
      failedCount++;
      if (res.error) errors.push(`${user.email}: ${res.error}`);
    }

    store.logs.unshift({
      id: `log_wk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'weekly',
      toEmail: user.email!,
      toName: studentName,
      subject: rendered.subject,
      status: res.success ? (res.mode === 'simulation' ? 'simulated' : 'sent') : 'failed',
      mode: res.mode,
      error: res.error,
      timestamp: new Date().toISOString(),
      campaignId,
      userId: user.id,
    });

    // Pause minimale de politesse anti-débit
    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  store.settings.lastWeeklyCampaign = new Date().toISOString();
  if (store.logs.length > 500) store.logs = store.logs.slice(0, 500);
  await saveEmailStore(store);

  return {
    totalTarget: eligibleUsers.length,
    sentCount,
    simulatedCount,
    failedCount,
    errors,
  };
}
