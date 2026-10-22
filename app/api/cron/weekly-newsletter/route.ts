import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWeeklyCampaign, loadEmailStore, WeeklyResource } from '@/lib/emailService';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  try {
    // Vérification de sécurité Vercel Cron Header
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const store = await loadEmailStore();
    if (store.settings.isGlobalPaused || !store.settings.weeklyEmailActive) {
      return NextResponse.json({ message: 'Campagne hebdomadaire suspendue ou désactivée' });
    }

    // Récupération des 3 ressources les plus récentes
    const { data: recentDocs } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    const resources: WeeklyResource[] = (recentDocs || []).map((d) => ({
      title: d.title || 'Support académique',
      subject: d.subject_id?.toUpperCase() || 'MSP',
      type: d.type || 'Polycopié',
      url: d.file_url || 'https://reussirpolytech.vercel.app/msp2',
    }));

    const result = await sendWeeklyCampaign({
      resources,
      customMessage: 'Votre synthèse académique de la semaine est disponible pour guider vos révisions.',
    });

    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur Cron';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
