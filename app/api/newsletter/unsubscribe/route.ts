import { NextRequest, NextResponse } from 'next/server';
import { loadEmailStore, saveEmailStore } from '@/lib/emailService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email || !email.includes('@')) {
    return new NextResponse('Adresse email manquante ou invalide.', { status: 400 });
  }

  const cleanEmail = email.trim().toLowerCase();
  const store = await loadEmailStore();

  if (!store.unsubscribedEmails.includes(cleanEmail)) {
    store.unsubscribedEmails.push(cleanEmail);
    await saveEmailStore(store);
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Désabonnement confirmé — Réussir Polytech</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #050B14; color: #F1F5F9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { max-width: 480px; width: 100%; background: #0B1528; border: 1px solid #1E293B; border-radius: 20px; padding: 36px 30px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
    .badge { display: inline-block; padding: 6px 14px; background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.4); color: #D4AF37; font-size: 12px; font-weight: 800; border-radius: 9999px; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; }
    h1 { font-size: 22px; font-weight: 800; margin: 0 0 14px; color: #FFFFFF; }
    p { font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0 0 24px; }
    .btn { display: inline-block; padding: 12px 24px; background: #0284C7; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 10px; transition: background 0.2s; }
    .btn:hover { background: #0369A1; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Préférences Mises à Jour</div>
    <h1>Désabonnement Confirmé</h1>
    <p>L'adresse <strong>${cleanEmail}</strong> a bien été retirée de la liste des communications périodiques de Réussir Polytech. Vous ne recevrez plus la lettre hebdomadaire.</p>
    <a href="https://reussirpolytech.vercel.app" class="btn">Retourner sur Réussir Polytech &rarr;</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
