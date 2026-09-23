import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Résilience réseau proxy/local
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = req.headers.get('x-admin-key') || searchParams.get('accessKey');
    const id = searchParams.get('id');

    if (!isAuthorized(key)) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Identifiant utilisateur requis.' }, { status: 400 });
    }

    // Attempt to delete user via Supabase Admin API
    const { data, error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Utilisateur supprimé avec succès.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne lors de la suppression';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
