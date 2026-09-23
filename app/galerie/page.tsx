'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  BookOpen,
  Sparkles,
  Compass,
  Search,
  Calendar,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Layers,
  Images,
} from 'lucide-react';
import { GalleryItem, GalleryCategory, GALLERY_CATEGORIES, INITIAL_GALLERY_ITEMS } from '@/data/gallery';

export default function GaleriePage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Charger les photos en direct avec contournement de tout cache
  const fetchGalleryItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/gallery?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      }
    } catch (e) {
      console.warn('Erreur chargement galerie:', e);
    }
  }, []);

  useEffect(() => {
    fetchGalleryItems();

    // 1. Polling haute fréquence (toutes les 6 secondes) pour afficher toute nouvelle photo instantanément
    const interval = setInterval(fetchGalleryItems, 6000);

    // 2. Rafraîchissement immédiat quand la fenêtre/onglet reprend le focus
    const onFocus = () => fetchGalleryItems();
    window.addEventListener('focus', onFocus);

    // 3. Écoute temps réel cross-onglets (BroadcastChannel & storage)
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('rp_gallery_sync');
      channel.onmessage = () => {
        fetchGalleryItems();
      };
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'rp_gallery_updated') {
        fetchGalleryItems();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      if (channel) channel.close();
    };
  }, [fetchGalleryItems]);

  // Filtrage
  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [items, selectedCategory, searchQuery]);

  // Lightbox navigation
  const activeItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handlePrev = () => {
    if (activeLightboxIndex !== null && activeLightboxIndex > 0) {
      setActiveLightboxIndex(activeLightboxIndex - 1);
    } else if (activeLightboxIndex === 0) {
      setActiveLightboxIndex(filteredItems.length - 1);
    }
  };

  const handleNext = () => {
    if (activeLightboxIndex !== null && activeLightboxIndex < filteredItems.length - 1) {
      setActiveLightboxIndex(activeLightboxIndex + 1);
    } else if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#050B14] transition-colors duration-300">
      {/* En-tête sobre & sans texte superflu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tight mb-3">
          Galerie{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
            Polytech
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium max-w-xl mx-auto">
          Nos réalisations, études, événements &amp; formations, et visites.
        </p>
      </div>

      {/* Barre de navigation & filtres */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#050B14]/95 backdrop-blur-md border-y border-slate-200 dark:border-white/10 shadow-sm py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Onglets de catégories */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Toutes ({items.length})</span>
              </button>

              <button
                onClick={() => setSelectedCategory('realisations')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'realisations'
                    ? 'bg-[#D4AF37] text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>1. Nos Réalisations</span>
              </button>

              <button
                onClick={() => setSelectedCategory('etudes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'etudes'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Études</span>
              </button>

              <button
                onClick={() => setSelectedCategory('evenements')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'evenements'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Événements &amp; Formations</span>
              </button>

              <button
                onClick={() => setSelectedCategory('visites')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'visites'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>4. Visites</span>
              </button>
            </div>

            {/* Barre de recherche sobre */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grille de photos épurée */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl p-6 border border-dashed border-slate-300 dark:border-white/10 max-w-md mx-auto">
            <Images className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">Aucune photo dans cette sélection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item, index) => {
              const catMeta = GALLERY_CATEGORIES[item.category] || GALLERY_CATEGORIES.realisations;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => setActiveLightboxIndex(index)}
                  className="group cursor-pointer glass-card overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-[#D4AF37]/50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  {/* Photo Frame */}
                  <div className="relative w-full h-56 bg-slate-900 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      unoptimized={item.imageUrl.startsWith('http')}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    {/* Badge Catégorie */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${catMeta.color.badgeBg}`}>
                        {catMeta.label}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="absolute bottom-2.5 right-2.5 z-10 text-[10px] font-mono font-bold text-white/90 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded">
                      {item.date}
                    </div>
                  </div>

                  {/* Infos minimales */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-[#D4AF37] transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 text-sky-400 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Plein Écran Sobre */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md"
          >
            {/* Fermer */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hidden sm:flex cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hidden sm:flex cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Contenu Lightbox */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="relative w-full h-[65vh] bg-black">
                <Image
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  fill
                  unoptimized={activeItem.imageUrl.startsWith('http')}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="p-4 sm:p-5 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 text-white">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-wider block mb-1">
                    {GALLERY_CATEGORIES[activeItem.category]?.label || 'Galerie'}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold">{activeItem.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeItem.date} • {activeItem.location}
                  </p>
                </div>

                <a
                  href={activeItem.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-slate-900 font-bold text-xs uppercase transition-opacity hover:opacity-90 whitespace-nowrap self-end sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ouvrir HD</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
