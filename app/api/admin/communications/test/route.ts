import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/emailService';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';

const VALID_KEYS = [
  'RP-ADMIN-EXCELLENCE-2026',
  'POLYTECH2026',
  ...(process.env.ADMIN_ACCESS_KEY ? [process.env.ADMIN_ACCESS_KEY.trim().toUpperCase()] : []),
];

function isAuthorized(key: string | null): boolean {
  if (!key) return false;
  return VALID_KEYS.includes(key.trim().toUpperCase());
}

export async function POST(req: NextRequest) {
  try {
    const key = req.headers.get('x-admin-key');
    const body = await req.json();
    const accessKey = key || body.accessKey;

    if (!isAuthorized(accessKey)) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const { toEmail, templateType } = body;

    if (!toEmail || !toEmail.includes('@')) {
      return NextResponse.json({ error: 'Adresse email de test invalide.' }, { status: 400 });
    }

    const type = templateType === 'weekly' ? 'weekly' : 'welcome';
    const result = await sendTestEmail({ toEmail: toEmail.trim(), templateType: type });

    return NextResponse.json({
      success: result.success,
      mode: result.mode,
      error: result.error,
      message: result.mode === 'simulation'
        ? `[SIMULATION] Email test généré et consigné dans le journal pour ${toEmail}. Configurez OAuth2 pour l'envoi réel en boîte de réception.`
        : `Email test envoyé avec succès via Gmail API vers ${toEmail} !`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne lors de l\'envoi test';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
