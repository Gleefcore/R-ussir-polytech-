import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const LOCAL_STORE = path.join(process.cwd(), 'data', 'push_subscriptions.json');
const CLOUD_KEY = 'push/push_store.json';

interface PushSubscriptionData {
  endpoint: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
  userId?: string;
  userAgent?: string;
  createdAt: string;
}

async function loadPushStore(): Promise<PushSubscriptionData[]> {
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

async function savePushStore(list: PushSubscriptionData[]): Promise<void> {
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
    console.warn('Erreur sauvegarde push store:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { subscription, userId } = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Abonnement Push invalide' }, { status: 400 });
    }

    const list = await loadPushStore();
    const existingIndex = list.findIndex((s) => s.endpoint === subscription.endpoint);

    const entry: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      userId: userId || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = entry;
    } else {
      list.push(entry);
    }

    await savePushStore(list);

    return NextResponse.json({ success: true, count: list.length });
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

    let list = await loadPushStore();
    list = list.filter((s) => s.endpoint !== endpoint);
    await savePushStore(list);

    return NextResponse.json({ success: true, count: list.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
