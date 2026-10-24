import { NextRequest, NextResponse } from 'next/server';
import {
  registerPushSubscription,
  unregisterPushSubscription,
  VAPID_PUBLIC_KEY,
} from '@/lib/pushService';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    vapidPublicKey: VAPID_PUBLIC_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { subscription, userId, userEmail, userName, level } = await req.json();

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Abonnement Push invalide' }, { status: 400 });
    }

    const result = await registerPushSubscription({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      userId,
      userEmail,
      userName,
      level,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint manquant' }, { status: 400 });
    }

    await unregisterPushSubscription(endpoint);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
