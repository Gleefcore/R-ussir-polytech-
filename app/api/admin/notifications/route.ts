import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  broadcastPushNotification,
  createStudentNotifications,
  loadPushSubscriptions,
} from '@/lib/pushService';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VALID_KEYS = [
  'RP-ADMIN-EXCELLENCE-2026',
  'POLYTECH2026',
  ...(process.env.ADMIN_ACCESS_KEY ? [process.env.ADMIN_ACCESS_KEY.trim().toUpperCase()] : []),
];

function isAuthorized(key: string | null): boolean {
  if (!key) return false;
  return VALID_KEYS.includes(key.trim().toUpperCase());
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = req.headers.get('x-admin-key') || searchParams.get('accessKey');

    if (!isAuthorized(key)) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const [subs, notifsRes] = await Promise.all([
      loadPushSubscriptions(),
      supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30),
    ]);

    return NextResponse.json({
      success: true,
      subscriptionsCount: subs.length,
      subscriptions: subs.slice(0, 50),
      recentNotifications: notifsRes.data || [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const key = req.headers.get('x-admin-key');
    const body = await req.json();
    const accessKey = key || body.accessKey;

    if (!isAuthorized(accessKey)) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const {
      title,
      message,
      targetLevel = 'ALL',
      url = '/notifications',
      type = 'announcement',
      imageUrl,
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Le titre et le message de la notification sont obligatoires.' },
        { status: 400 }
      );
    }

    const cleanImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0 ? imageUrl.trim() : undefined;

    // 1. Enregistrement dans la base de données Supabase pour l'espace étudiant
    const notifResult = await createStudentNotifications({
      title,
      message,
      type: type || 'announcement',
      targetLevel: targetLevel === 'ALL' ? undefined : targetLevel,
      url,
      imageUrl: cleanImageUrl,
    });

    // 2. Envoi de la Notification Web Push réelle aux téléphones inscrits avec photo
    const pushResult = await broadcastPushNotification({
      title: `🔔 ${title}`,
      body: message,
      url: url || '/notifications',
      level: targetLevel === 'ALL' ? undefined : targetLevel,
      image: cleanImageUrl,
    });

    return NextResponse.json({
      success: true,
      notifResult,
      pushResult,
      message: `Notification diffusée avec succès : ${pushResult.sentCount} appareil(s) notifié(s), ${notifResult.count} compte(s) étudiant(s) mis à jour.${cleanImageUrl ? ' (Photo jointe incluse)' : ''}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne lors de la diffusion';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
