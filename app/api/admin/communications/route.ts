import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  loadEmailStore,
  saveEmailStore,
  getGmailStatus,
  sendWeeklyCampaign,
  WeeklyResource,
} from '@/lib/emailService';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const clean = key.trim().toUpperCase();
  return VALID_KEYS.includes(clean);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = req.headers.get('x-admin-key') || searchParams.get('accessKey');

    if (!isAuthorized(key)) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const [store, gmailStatus, usersRes, resourcesRes] = await Promise.all([
      loadEmailStore(),
      Promise.resolve(getGmailStatus()),
      supabase.auth.admin.listUsers({ perPage: 1000 }),
      supabase.from('resources').select('*').order('created_at', { ascending: false }).limit(6),
    ]);

    const allUsers = usersRes.data?.users || [];
    const unsubscribedSet = new Set(store.unsubscribedEmails.map((e) => e.toLowerCase()));

    const realEmailUsers = allUsers.filter((u) => u.email && !u.email.endsWith('@polytech.rp'));
    const eligibleCount = realEmailUsers.filter((u) => !unsubscribedSet.has(u.email!.toLowerCase())).length;

    // Métriques agrégées de consentement
    const metrics = {
      totalRegistered: allUsers.length,
      realEmailsCount: realEmailUsers.length,
      newsletterEligible: eligibleCount,
      unsubscribedCount: store.unsubscribedEmails.length,
      totalSent: store.logs.filter((l) => l.status === 'sent').length,
      totalSimulated: store.logs.filter((l) => l.status === 'simulated').length,
      totalFailed: store.logs.filter((l) => l.status === 'failed').length,
    };

    // Suggestions de ressources réelles pour composer la lettre
    const suggestedResources: WeeklyResource[] = (resourcesRes.data || []).map((r) => ({
      title: r.title || 'Document pédagogique',
      subject: r.subject_id?.toUpperCase() || 'MTH',
      type: r.type || 'Polycopié',
      url: r.file_url || 'https://reussirpolytech.vercel.app/msp2',
    }));

    return NextResponse.json({
      success: true,
      gmailStatus,
      settings: store.settings,
      metrics,
      logs: store.logs.slice(0, 50),
      unsubscribedEmails: store.unsubscribedEmails,
      suggestedResources,
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

    const { action } = body;
    const store = await loadEmailStore();

    if (action === 'update_settings') {
      if (typeof body.isGlobalPaused === 'boolean') {
        store.settings.isGlobalPaused = body.isGlobalPaused;
      }
      if (typeof body.welcomeEmailActive === 'boolean') {
        store.settings.welcomeEmailActive = body.welcomeEmailActive;
      }
      if (typeof body.weeklyEmailActive === 'boolean') {
        store.settings.weeklyEmailActive = body.weeklyEmailActive;
      }
      if (typeof body.maxDailySends === 'number' && body.maxDailySends > 0) {
        store.settings.maxDailySends = body.maxDailySends;
      }

      await saveEmailStore(store);
      return NextResponse.json({ success: true, settings: store.settings });
    }

    if (action === 'send_weekly_campaign') {
      const { resources, customMessage, targetLevel } = body;
      const result = await sendWeeklyCampaign({
        resources: Array.isArray(resources) && resources.length > 0 ? resources : [],
        customMessage,
        targetLevel,
      });

      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: 'Action non reconnue.' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne lors du traitement';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
