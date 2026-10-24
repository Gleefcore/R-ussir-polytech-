import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BIBL1ZYu_0FtmsLWPaPQhIr8yb-bOBHsZLzIpmLV-uqIyzXh0jymKuz87r8af-750IJ_cWV978KA65pJnmDNevM';

export const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || '80Strc9eW17yMwt2zIaCSo8WsDfPNSQZSA3hme4wdLM';

export const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || 'mailto:gwetsamuel49@gmail.com';

// Initialisation VAPID
try {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} catch (e) {
  console.warn('[PushService] Avertissement init VAPID:', e);
}

const LOCAL_STORE = path.join(process.cwd(), 'data', 'push_subscriptions.json');
const CLOUD_KEY = 'push/push_store.json';

export interface PushSubscriptionItem {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  userEmail?: string;
  userName?: string;
  level?: string;
  userAgent?: string;
  createdAt: string;
  lastActiveAt?: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  badge?: string;
  icon?: string;
  level?: 'ALL' | 'MSP1' | 'MSP2';
}

export async function loadPushSubscriptions(): Promise<PushSubscriptionItem[]> {
  try {
    const url = `${supabaseUrl}/storage/v1/object/public/academic-files/${CLOUD_KEY}?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch {}

  try {
    if (fs.existsSync(LOCAL_STORE)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE, 'utf-8'));
    }
  } catch {}

  return [];
}

export async function savePushSubscriptions(list: PushSubscriptionItem[]): Promise<void> {
  const json = JSON.stringify(list, null, 2);
  try {
    const dir = path.dirname(LOCAL_STORE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_STORE, json, 'utf-8');
  } catch {}

  try {
    const buffer = Buffer.from(json, 'utf-8');
    await supabase.storage.from('academic-files').upload(CLOUD_KEY, buffer, {
      contentType: 'application/json',
      upsert: true,
    });
  } catch (e) {
    console.warn('[PushService] Erreur sauvegarde push store:', e);
  }
}

export async function registerPushSubscription(sub: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userId?: string;
  userEmail?: string;
  userName?: string;
  level?: string;
  userAgent?: string;
}): Promise<{ count: number }> {
  const list = await loadPushSubscriptions();
  const idx = list.findIndex((item) => item.endpoint === sub.endpoint);

  const entry: PushSubscriptionItem = {
    endpoint: sub.endpoint,
    keys: sub.keys,
    userId: sub.userId,
    userEmail: sub.userEmail,
    userName: sub.userName,
    level: sub.level ? sub.level.toUpperCase() : undefined,
    userAgent: sub.userAgent,
    createdAt: idx >= 0 ? list[idx].createdAt : new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entry };
  } else {
    list.push(entry);
  }

  await savePushSubscriptions(list);
  return { count: list.length };
}

export async function unregisterPushSubscription(endpoint: string): Promise<void> {
  const list = await loadPushSubscriptions();
  const filtered = list.filter((item) => item.endpoint !== endpoint);
  if (filtered.length !== list.length) {
    await savePushSubscriptions(filtered);
  }
}

/**
 * Envoi d'une Notification Web Push réelle en arrière-plan à tous les téléphones / appareils inscrits.
 * Fonctionne même lorsque le navigateur ou l'application est fermé(e) !
 */
export async function broadcastPushNotification(payload: PushPayload): Promise<{
  totalTargets: number;
  sentCount: number;
  failedCount: number;
  prunedCount: number;
}> {
  const list = await loadPushSubscriptions();
  if (list.length === 0) {
    return { totalTargets: 0, sentCount: 0, failedCount: 0, prunedCount: 0 };
  }

  // Filtrer par niveau si requis
  const targets = list.filter((item) => {
    if (!payload.level || payload.level === 'ALL') return true;
    if (!item.level) return true; // Pas de niveau spécifié => reçoit toutes les notifications
    return item.level.toUpperCase() === payload.level.toUpperCase();
  });

  const notificationPayload = JSON.stringify({
    title: payload.title || 'RÉUSSIR POLYTECH',
    body: payload.body,
    url: payload.url || '/',
    tag: payload.tag || `rp_alert_${Date.now()}`,
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: payload.badge || '/icons/icon-192x192.png',
    sound: '/sounds/notification.wav',
    timestamp: Date.now(),
  });

  let sentCount = 0;
  let failedCount = 0;
  const deadEndpoints = new Set<string>();

  for (const item of targets) {
    try {
      await webpush.sendNotification(
        {
          endpoint: item.endpoint,
          keys: item.keys,
        },
        notificationPayload,
        {
          TTL: 60 * 60 * 24, // 24 heures de rétention pour réveil à la reconnexion
          urgency: 'high',
        }
      );
      sentCount++;
    } catch (err: unknown) {
      failedCount++;
      const statusCode = (err as { statusCode?: number })?.statusCode;
      // 404 (Not Found) ou 410 (Gone) = l'utilisateur a désinstallé ou révoqué la permission
      if (statusCode === 404 || statusCode === 410) {
        deadEndpoints.add(item.endpoint);
      }
    }
  }

  // Nettoyage automatique des abonnements morts
  if (deadEndpoints.size > 0) {
    const cleaned = list.filter((s) => !deadEndpoints.has(s.endpoint));
    await savePushSubscriptions(cleaned);
  }

  return {
    totalTargets: targets.length,
    sentCount,
    failedCount,
    prunedCount: deadEndpoints.size,
  };
}

/**
 * Enregistrement d'une notification réelle dans l'espace notifications des étudiants
 */
export async function createStudentNotifications(params: {
  title: string;
  message: string;
  type?: 'academic' | 'general' | 'announcement' | 'system';
  targetLevel?: 'ALL' | 'MSP1' | 'MSP2';
  targetUserId?: string;
  url?: string;
}): Promise<{ count: number }> {
  try {
    let targetUserIds: string[] = [];

    if (params.targetUserId && params.targetUserId !== 'ALL') {
      targetUserIds = [params.targetUserId];
    } else {
      // Récupérer la liste des étudiants réels
      const { data: userList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      const rawUsers = userList?.users || [];

      targetUserIds = rawUsers
        .filter((u) => {
          if (params.targetLevel && params.targetLevel !== 'ALL') {
            const lvl = (u.user_metadata?.level || '').toUpperCase();
            return lvl === params.targetLevel;
          }
          return true;
        })
        .map((u) => u.id);
    }

    if (targetUserIds.length === 0) return { count: 0 };

    // Format du message avec lien optionnel
    const fullMessage = params.url ? `${params.message}\n\n[Lien] : ${params.url}` : params.message;

    // Insertion par paquets dans la table Supabase `notifications`
    const rows = targetUserIds.map((userId) => ({
      user_id: userId,
      title: params.title,
      message: fullMessage,
      type: params.type || 'general',
      read: false,
    }));

    // Insérer par lots de 50
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      await supabase.from('notifications').insert(batch);
    }

    return { count: rows.length };
  } catch (err) {
    console.warn('[PushService] Erreur insertion notifications Supabase:', err);
    return { count: 0 };
  }
}
