/**
 * Service d'Envoi d'Emails — RÉUSSIR POLYTECH
 * Expéditeur officiel : L'équipe RÉUSSIR POLYTECH <gwetsamuel49@gmail.com>
 * Intégration : Gmail API (OAuth 2.0 / users.messages.send) avec repli SMTP et mode diagnostic sécurisé.
 * Persistance cloud : Supabase Storage (academic-files/communications/email_store.json).
 */

import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import {
  BRAND_CONFIG,
  renderWelcomeEmail,
  renderWeeklyEmail,
  renderPromotionFormationEmail,
  type WeeklyResource,
} from './emailTemplates';

export type { WeeklyResource };

// Configuration environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface EmailLogEntry {
  id: string;
  type: 'welcome' | 'weekly' | 'test' | 'promotion' | 'targeted';
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
  gmailAppPassword?: string;
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

// Mot de passe d'application officiel Google validé pour gwetsamuel49@gmail.com
const VERIFIED_GMAIL_APP_PASSWORD = 'spmiwumqnfgihwzb';

export function getGmailStatus(appPasswordOverride?: string): GmailStatus {
  const envPassword = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;
  const rawPassword = appPasswordOverride || envPassword || VERIFIED_GMAIL_APP_PASSWORD;
  const effectiveAppPassword = rawPassword.replace(/\s+/g, '');

  const hasOAuth = Boolean(
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN
  );
  const hasAppPassword = Boolean(effectiveAppPassword);

  if (hasAppPassword) {
    return {
      isConfigured: true,
      mode: 'app_password',
      senderAddress: BRAND_CONFIG.senderEmail,
      senderName: BRAND_CONFIG.senderName,
      diagnosticMessage: 'Connecté en direct via SMTP Gmail (gwetsamuel49@gmail.com). Les emails réels sont envoyés en boîte de réception.',
      canSendLive: true,
    };
  }

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

  return {
    isConfigured: false,
    mode: 'unconfigured',
    senderAddress: BRAND_CONFIG.senderEmail,
    senderName: BRAND_CONFIG.senderName,
    diagnosticMessage:
      'Action requise : Renseignez votre Mot de passe d\'application Google (16 lettres créées sur myaccount.google.com/apppasswords) pour activer l\'envoi réel.',
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

// 5. Expédition d'un Email avec gestion de repli (SMTP Gmail -> OAuth2 -> Simulation)
async function dispatchEmail(params: {
  toEmail: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
  storeSettings?: EmailSettings;
}): Promise<{ success: boolean; mode: 'gmail_oauth' | 'gmail_app_password' | 'simulation'; error?: string }> {
  const envPassword = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;
  const rawPassword = params.storeSettings?.gmailAppPassword || envPassword || VERIFIED_GMAIL_APP_PASSWORD;
  const effectiveAppPassword = rawPassword.replace(/\s+/g, '');

  // 1. Expédition Réelle Prioritaire : SMTP Gmail Direct avec Mot de passe d'Application
  if (effectiveAppPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: BRAND_CONFIG.senderEmail,
          pass: effectiveAppPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from: `"${BRAND_CONFIG.senderName}" <${BRAND_CONFIG.senderEmail}>`,
        to: params.toEmail,
        replyTo: BRAND_CONFIG.senderEmail,
        subject: params.subject,
        html: params.html,
        text: params.text,
      });

      console.log(`[EmailService] Email réel expédié vers ${params.toEmail} — Message ID: ${info.messageId}`);
      return { success: true, mode: 'gmail_app_password' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur SMTP Gmail';
      console.error('[EmailService] Échec expédition SMTP Gmail vers', params.toEmail, ':', msg);
      return { success: false, mode: 'gmail_app_password', error: msg };
    }
  }

  // 2. Mode OAuth 2.0 Officiel Google Cloud
  const status = getGmailStatus();
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

  // 3. Mode Simulation / Diagnostic sécurisé si aucun identifiant réel n'est fourni
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

  // Déduplication : Vérifier si cet utilisateur a déjà reçu un email de bienvenue RÉEL (un log 'simulated' n'interdit pas l'envoi réel)
  const alreadySent = store.logs.some(
    (l) => l.type === 'welcome' && (l.userId === params.userId || l.toEmail.toLowerCase() === params.email.toLowerCase()) && l.status === 'sent'
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
    storeSettings: store.settings,
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
  const store = await loadEmailStore();
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
    storeSettings: store.settings,
  });

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
      storeSettings: store.settings,
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

export interface TargetedEmailStudent {
  id?: string;
  email: string;
  fullName: string;
  level?: string;
  matricule?: string;
}

export interface SendTargetedBatchParams {
  students: TargetedEmailStudent[];
  templateType: 'promotion' | 'welcome' | 'custom';
  title?: string;
  subtitle?: string;
  message?: string;
  ctaUrl?: string;
  ctaText?: string;
}

export async function sendTargetedOrBatchEmails(params: SendTargetedBatchParams) {
  const store = await loadEmailStore();
  const unsubscribedSet = new Set(store.unsubscribedEmails.map((e) => e.toLowerCase()));
  const batchId = `batch_${Date.now()}`;

  let sentCount = 0;
  let simulatedCount = 0;
  let failedCount = 0;
  const detailedResults: Array<{
    email: string;
    fullName: string;
    status: 'sent' | 'simulated' | 'failed' | 'unsubscribed';
    message?: string;
  }> = [];

  for (const student of params.students) {
    const cleanEmail = student.email?.trim().toLowerCase();
    if (!cleanEmail || cleanEmail.endsWith('@polytech.rp')) {
      detailedResults.push({
        email: student.email || 'N/A',
        fullName: student.fullName,
        status: 'failed',
        message: 'Adresse email non valide ou matricule interne',
      });
      failedCount++;
      continue;
    }

    if (unsubscribedSet.has(cleanEmail)) {
      detailedResults.push({
        email: cleanEmail,
        fullName: student.fullName,
        status: 'unsubscribed',
        message: 'Étudiant désabonné des communications',
      });
      continue;
    }

    let rendered: { html: string; text: string; subject: string };

    if (params.templateType === 'promotion') {
      rendered = renderPromotionFormationEmail({
        name: student.fullName,
        email: cleanEmail,
        level: student.level || 'MSP1',
        matricule: student.matricule,
        title: params.title || 'Formation d\'Élite : L\'Ingénieur Entrepreneur',
        subtitle: params.subtitle || 'Maîtrisez les outils pratiques et propulsez votre leadership technologique',
        description: params.message || 'Rejoignez le programme intensif conçu par les mentors de Réussir Polytech pour acquérir les compétences réelles du monde de l\'ingénierie et de l\'entrepreneuriat.',
        ctaUrl: params.ctaUrl || BRAND_CONFIG.vipUrl,
        ctaText: params.ctaText || 'Découvrir le Programme VIP & S\'inscrire',
      });
    } else {
      rendered = renderWelcomeEmail({
        name: student.fullName,
        email: cleanEmail,
        level: student.level || 'MSP1',
        matricule: student.matricule,
      });
    }

    const sendRes = await dispatchEmail({
      toEmail: cleanEmail,
      toName: student.fullName,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      storeSettings: store.settings,
    });

    if (sendRes.success) {
      if (sendRes.mode === 'simulation') {
        simulatedCount++;
        detailedResults.push({
          email: cleanEmail,
          fullName: student.fullName,
          status: 'simulated',
          message: 'Envoi simulé avec succès (Mode Diagnostic)',
        });
      } else {
        sentCount++;
        detailedResults.push({
          email: cleanEmail,
          fullName: student.fullName,
          status: 'sent',
          message: 'Envoyé avec succès via Gmail API',
        });
      }
    } else {
      failedCount++;
      detailedResults.push({
        email: cleanEmail,
        fullName: student.fullName,
        status: 'failed',
        message: sendRes.error || 'Erreur lors de l\'envoi',
      });
    }

    store.logs.unshift({
      id: `log_tgt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: params.templateType === 'promotion' ? 'promotion' : 'targeted',
      toEmail: cleanEmail,
      toName: student.fullName,
      subject: rendered.subject,
      status: sendRes.success ? (sendRes.mode === 'simulation' ? 'simulated' : 'sent') : 'failed',
      mode: sendRes.mode,
      error: sendRes.error,
      timestamp: new Date().toISOString(),
      campaignId: batchId,
      userId: student.id,
    });

    // Pause de courtoisie entre envois séquentiels
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  if (store.logs.length > 500) store.logs = store.logs.slice(0, 500);
  await saveEmailStore(store);

  return {
    success: true,
    totalTarget: params.students.length,
    sentCount,
    simulatedCount,
    failedCount,
    detailedResults,
  };
}

