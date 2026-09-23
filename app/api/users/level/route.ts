import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level')?.toUpperCase();

    if (!level) {
      return NextResponse.json({ error: 'Niveau requis (ex: MSP1, MSP2).' }, { status: 400 });
    }

    const { data: userList, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    if (error) {
      throw error;
    }

    const students = (userList?.users || [])
      .filter((u) => u.user_metadata?.level === level)
      .map((u) => ({
        id: u.id,
        fullName: u.user_metadata?.full_name || 'Élève',
        avatarUrl: u.user_metadata?.avatar_url || null,
      }));

    return NextResponse.json({
      success: true,
      students,
      count: students.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
