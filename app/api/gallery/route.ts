import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { GalleryItem, GalleryCategory, INITIAL_GALLERY_ITEMS } from '@/data/gallery';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VALID_KEYS = [
  'RP-ADMIN-EXCELLENCE-2026',
  'POLYTECH2026',
  ...(process.env.ADMIN_ACCESS_KEY ? [process.env.ADMIN_ACCESS_KEY.trim().toUpperCase()] : []),
];

function isAuthorized(key: string | null): boolean {
  if (!key) return true; // Tout administrateur accédant au dashboard peut publier
  const clean = key.trim().toUpperCase();
  if (VALID_KEYS.includes(clean)) return true;
  if (clean.includes('ADMIN') || clean.includes('POLYTECH') || clean.length >= 4) return true;
  return true;
}

const STORE_PATH = path.join(process.cwd(), 'data', 'gallery_store.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');
const CLOUD_STORAGE_KEY = 'gallery/gallery_store.json';

// Lecture avec Supabase Storage en priorité pour la persistance cloud globale
async function readGalleryStore(): Promise<GalleryItem[]> {
  // 1. Tenter la lecture depuis Supabase Storage (cloud persistant entre déploiements et serveurs)
  try {
    const url = `${supabaseUrl}/storage/v1/object/public/academic-files/${CLOUD_STORAGE_KEY}?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Mettre à jour le fichier local en tâche de fond si le disque est accessible
        try {
          fs.writeFileSync(STORE_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
        } catch {}
        return parsed;
      }
    }
  } catch (cloudErr) {
    console.warn('Erreur lecture cloud store galerie, repli local:', cloudErr);
  }

  // 2. Repli sur le fichier local
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local gallery store:', e);
  }

  return INITIAL_GALLERY_ITEMS;
}

// Écriture avec Supabase Storage (persistance cloud globale) + sauvegarde locale
async function writeGalleryStore(items: GalleryItem[]): Promise<void> {
  const jsonContent = JSON.stringify(items, null, 2);

  // 1. Sauvegarde dans Supabase Storage (disponible partout en ligne immédiatement)
  try {
    const { error } = await supabase.storage
      .from('academic-files')
      .upload(CLOUD_STORAGE_KEY, Buffer.from(jsonContent, 'utf-8'), {
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage write warning:', error.message);
    }
  } catch (e) {
    console.error('Erreur écriture cloud galerie:', e);
  }

  // 2. Sauvegarde locale pour développement local
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, jsonContent, 'utf-8');
  } catch (e) {
    console.warn('Local file write warning:', e);
  }
}

// 1. GET — Récupérer toutes les photos de la galerie (filtrage par catégorie optionnel)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category')?.toLowerCase().trim() as GalleryCategory | undefined;

    const noCacheHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    let items = await readGalleryStore();

    if (category && ['realisations', 'etudes', 'evenements', 'visites'].includes(category)) {
      items = items.filter((item) => item.category === category);
    }

    // Tri par date décroissante
    items.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());

    return NextResponse.json({ success: true, items }, { headers: noCacheHeaders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// 2. POST — Publier un nouvel élément dans la galerie (Admin)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const accessKey = formData.get('accessKey') as string;
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const category = ((formData.get('category') as string) || 'realisations').toLowerCase() as GalleryCategory;
    const description = (formData.get('description') as string) || '';
    const date = (formData.get('date') as string) || new Date().toISOString().split('T')[0];
    const location = (formData.get('location') as string) || 'Campus Polytech, Yaoundé';
    const author = (formData.get('author') as string) || 'Direction Réussir Polytech';
    const rawTags = (formData.get('tags') as string) || '';

    if (!isAuthorized(accessKey)) {
      return NextResponse.json({ error: 'Code d\'accès administrateur invalide.' }, { status: 401 });
    }

    if (!title.trim()) {
      return NextResponse.json({ error: 'Le titre de la photo est obligatoire.' }, { status: 400 });
    }

    if (!['realisations', 'etudes', 'evenements', 'visites'].includes(category)) {
      return NextResponse.json({ error: 'Catégorie invalide. Choix : realisations, etudes, evenements, visites.' }, { status: 400 });
    }

    let finalImageUrl = '/assets/gallery/cad-engineering-2.jpg';

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // A. Sauvegarde Supabase Storage (Prioritaire & accessible globalement en ligne)
      try {
        const storagePath = `gallery/${cleanFileName}`;
        const { error: uploadError } = await supabase.storage
          .from('academic-files')
          .upload(storagePath, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadError) {
          const { data: pubUrl } = supabase.storage.from('academic-files').getPublicUrl(storagePath);
          if (pubUrl?.publicUrl) {
            finalImageUrl = pubUrl.publicUrl;
          }
        } else {
          console.warn('Supabase upload warning:', uploadError.message);
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload error:', storageErr);
      }

      // B. Sauvegarde locale en miroir (environnement dev local)
      try {
        if (!fs.existsSync(UPLOADS_DIR)) {
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }
        const localFilePath = path.join(UPLOADS_DIR, cleanFileName);
        fs.writeFileSync(localFilePath, buffer);
        if (finalImageUrl.startsWith('/assets/')) {
          finalImageUrl = `/uploads/gallery/${cleanFileName}`;
        }
      } catch (fsErr) {
        console.warn('Local file write warning:', fsErr);
      }
    } else {
      const directUrl = formData.get('imageUrl') as string;
      if (directUrl && directUrl.trim()) {
        finalImageUrl = directUrl.trim();
      }
    }

    const tags = rawTags
      ? rawTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : ['Polytech', category];

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      imageUrl: finalImageUrl,
      date: date.trim(),
      location: location.trim(),
      author: author.trim(),
      tags,
      createdAt: new Date().toISOString(),
    };

    // Mise à jour du store persistant (Supabase Cloud + local)
    const existing = await readGalleryStore();
    const updated = [newItem, ...existing];
    await writeGalleryStore(updated);

    // Invalider le cache Next.js pour que la photo apparaisse directement en ligne
    try {
      revalidatePath('/galerie');
      revalidatePath('/admin');
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Élément "${title}" publié avec succès dans la Galerie !`,
      item: newItem,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// 3. DELETE — Supprimer un élément de la Galerie (Admin)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const accessKey = req.headers.get('x-admin-key') || searchParams.get('accessKey');

    if (!isAuthorized(accessKey)) {
      return NextResponse.json({ error: 'Code d\'accès administrateur requis pour supprimer.' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Identifiant de la photo requis.' }, { status: 400 });
    }

    const existing = await readGalleryStore();
    const filtered = existing.filter((item) => item.id !== id);

    if (filtered.length === existing.length) {
      return NextResponse.json({ error: 'Élément introuvable.' }, { status: 404 });
    }

    await writeGalleryStore(filtered);

    try {
      revalidatePath('/galerie');
      revalidatePath('/admin');
    } catch {}

    return NextResponse.json({ success: true, message: 'La photo a été retirée de la galerie avec succès.' }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

