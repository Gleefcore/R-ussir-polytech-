'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images,
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
  ExternalLink,
  Layers,
  Star,
  RefreshCw,
} from 'lucide-react';
import { GalleryItem, GalleryCategory, GALLERY_CATEGORIES, INITIAL_GALLERY_ITEMS } from '@/data/gallery';

export default function GaleriePage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Charger les publications réelles depuis l'API
  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      }
    } catch (e) {
      console.warn('Erreur lors du chargement de la galerie:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Filtrage combiné par catégorie et recherche
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
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [items, selectedCategory, searchQuery]);

  // Gestion du Lightbox
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

  // Clavier pour la Lightbox
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
      {/* ======================================================== */}
      {/* 1. HERO PRESTIGE                                         */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-[#D4AF37]/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          {/* Badge officiel */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-full px-5 py-2 mb-6 shadow-sm backdrop-blur-md"
          >
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs sm:text-sm font-black tracking-widest uppercase font-mono">
              Mémoire &amp; Vie de l&apos;Écosystème • Réussir Polytech
            </span>
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight"
          >
            Galerie Officielle{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
              Réussir Polytech
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-medium mb-10 leading-relaxed"
          >
            L&apos;excellence vécue et immortalisée : plongez au cœur de nos réalisations d&apos;ingénierie, nos sessions
            d&apos;études de haute intensité, nos événements académiques et nos immersions sur le terrain.
            <br className="hidden sm:inline" />
            <span className="italic font-bold text-slate-800 dark:text-[#F3E5AB]">
              « L&apos;excellence est notre seul standard. »
            </span>
          </motion.p>

          {/* 4 Piliers Clés */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {Object.values(GALLERY_CATEGORIES).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedCategory === cat.id
                    ? `${cat.color.border} bg-white dark:bg-white/10 shadow-lg scale-105`
                    : 'border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-black ${cat.color.text}`}>
                    0{cat.num}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${cat.color.badgeBg}`}>
                    {cat.badge}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white font-heading">
                  {cat.label}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BARRE D'OUTILS : RECHERCHE & ONGLETS                   */}
      {/* ======================================================== */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-[#050B14]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une photo, un lieu, un sujet..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Onglets de filtrage */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Toutes ({items.length})</span>
              </button>

              <button
                onClick={() => setSelectedCategory('realisations')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'realisations'
                    ? 'bg-[#D4AF37] text-slate-900 shadow-md shadow-[#D4AF37]/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>1. Nos Réalisations</span>
              </button>

              <button
                onClick={() => setSelectedCategory('etudes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'etudes'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Études</span>
              </button>

              <button
                onClick={() => setSelectedCategory('evenements')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'evenements'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Événements &amp; Formations</span>
              </button>

              <button
                onClick={() => setSelectedCategory('visites')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'visites'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>4. Visites</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. GRILLE DE LA GALERIE                                   */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Aucun résultat */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 glass-card rounded-3xl p-8 border border-dashed border-slate-300 dark:border-white/10 max-w-xl mx-auto">
            <Images className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Aucune photo trouvée pour cette sélection
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Les administrateurs peuvent publier de nouvelles photos dans cette catégorie depuis le Cockpit Administrateur.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-slate-900 font-black text-xs uppercase tracking-wider shadow-md"
            >
              Afficher toute la galerie
            </button>
          </div>
        )}

        {/* Grille des photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            const catMeta = GALLERY_CATEGORIES[item.category] || GALLERY_CATEGORIES.realisations;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                onClick={() => setActiveLightboxIndex(index)}
                className="group cursor-pointer glass-card overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 hover:border-[#D4AF37]/50 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-slate-900">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Badge de catégorie */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-md backdrop-blur-md ${catMeta.color.badgeBg}`}>
                        <span>0{catMeta.num}. {catMeta.label}</span>
                      </span>
                    </div>

                    {/* Date */}
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-xs font-mono font-bold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
                      <MapPin className="w-3.5 h-3.5 text-poly-cyan flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
                  <span>Agrandir l&apos;image</span>
                  <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODALE LIGHTBOX PLEIN ÉCRAN                            */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl"
          >
            {/* Bouton Fermer */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-xl"
              title="Fermer (Échap)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Boutons Flèches Nav */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md hidden sm:flex items-center justify-center"
              title="Précédent (Flèche gauche)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md hidden sm:flex items-center justify-center"
              title="Suivant (Flèche droite)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Boîte Principale */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[92vh] flex flex-col lg:flex-row bg-[#0B132B] border-2 border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Grand Affichage de l'Image */}
              <div className="relative flex-1 min-h-[300px] sm:min-h-[450px] lg:min-h-[550px] bg-black flex items-center justify-center">
                <Image
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Panneau Latéral d'Informations */}
              <div className="w-full lg:w-96 p-6 sm:p-8 flex flex-col justify-between bg-[#0F172A] border-t lg:border-t-0 lg:border-l border-slate-800 text-white overflow-y-auto max-h-[40vh] lg:max-h-none">
                <div>
                  {/* Catégorie */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                      {GALLERY_CATEGORIES[activeItem.category]?.label || 'Galerie'}
                    </span>
                  </div>

                  {/* Titre */}
                  <h2 className="text-xl sm:text-2xl font-black font-heading leading-tight mb-4">
                    {activeItem.title}
                  </h2>

                  {/* Métadonnées */}
                  <div className="space-y-2 mb-5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      <span>Date : <strong>{activeItem.date}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sky-400" />
                      <span>Lieu : <strong>{activeItem.location}</strong></span>
                    </div>

                    {activeItem.author && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <span>Auteur / Source : {activeItem.author}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mb-6">
                    {activeItem.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {activeItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Boutons d'Action */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800">
                  <a
                    href={activeItem.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:opacity-95 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    <span>Ouvrir l&apos;image HD</span>
                  </a>

                  <div className="text-center">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Photo {(activeLightboxIndex ?? 0) + 1} sur {filteredItems.length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 5. FOOTER SLOGAN                                         */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="border-t border-slate-200 dark:border-white/10 pt-10 text-center">
          <p className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-mono mb-2">
            Groupe d&apos;Études Réussir Polytech
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            « L&apos;excellence est notre seul standard. »
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Toutes les photographies et réalisations sont documentées et certifiées par la Direction.
          </p>
        </div>
      </div>
    </div>
  );
}
