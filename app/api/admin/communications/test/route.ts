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

    let message = '';
    if (result.success) {
      if (result.mode === 'gmail_app_password') {
        message = `✅ Email test réel expédié avec succès via SMTP Gmail vers ${toEmail} ! Consultez votre boîte de réception (et vos spams si besoin).`;
      } else if (result.mode === 'gmail_oauth') {
        message = `✅ Email test réel expédié avec succès via Google OAuth2 vers ${toEmail} !`;
      } else {
        message = `⚠️ Attention : Mode Simulation Actif. Aucun mot de passe d'application Google n'est configuré. Pour recevoir de vrais emails, saisissez votre Mot de Passe d'Application de 16 lettres (généré sur myaccount.google.com/apppasswords) dans les paramètres ci-dessus.`;
      }
    } else {
      message = `❌ Échec d'envoi Gmail : ${result.error || 'Erreur d\'authentification'}. Vérifiez que votre mot de passe d'application Google (16 lettres) est correct.`;
    }

    return NextResponse.json({
      success: result.success,
      mode: result.mode,
      error: result.error,
      message,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne lors de l\'envoi test';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
