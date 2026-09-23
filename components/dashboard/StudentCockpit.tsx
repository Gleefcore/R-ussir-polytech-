'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  User,
  LogOut,
  Camera,
  Flame,
  Search,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import { SubjectCard } from '@/components/academic/SubjectCard';
import { getSubjectsByLevelAndSemester } from '@/data/curriculum';
import { StudentMarquee } from '@/components/academic/StudentMarquee';
import { useRouter } from 'next/navigation';

interface StudentCockpitProps {
  level: 'MSP1' | 'MSP2';
  title: string;
  subtitle: string;
}

export function StudentCockpit({ level, title, subtitle }: StudentCockpitProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'profile'>('courses');
  const [semester, setSemester] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [student, setStudent] = useState<{
    id?: string;
    fullName?: string;
    matricule?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string | null;
  }>({});
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [simulatedActive, setSimulatedActive] = useState(31);
  const [joinedCount, setJoinedCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 1. Initialiser ou récupérer l'affluence de la session
    const savedActive = sessionStorage.getItem(`rp_active_${level}`);
    const initialBase = savedActive ? parseInt(savedActive, 10) : 31;
    setSimulatedActive(initialBase);

    // 2. Timer d'écoulement du temps (chaque seconde)
    const elapsedInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // 3. Plus le temps passe, plus le nombre de camarades connectés AUGMENTE !
    // Toutes les 15 à 30 secondes, un nouveau camarade se connecte
    const activities = [
      'vient d\'ouvrir le cours d\'Algèbre Linéaire',
      'vient de télécharger l\'épreuve de Physique CC',
      'vient de lancer la révision d\'Analyse',
      'vient de rejoindre la salle d\'étude',
      'est en train de s\'entraîner sur les annales d\'examens',
      'consulte la fiche de TD n°2',
      'vient de commencer un marathon de révision',
    ];

    const comradesInterval = setInterval(() => {
      setSimulatedActive((prev) => {
        const next = prev + 1;
        sessionStorage.setItem(`rp_active_${level}`, next.toString());
        return next;
      });
      setJoinedCount((prev) => prev + 1);

      // Notification discrète d'activité
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentNotification(`+1 camarade ${randomActivity} !`);
      setTimeout(() => setRecentNotification(null), 4000);
    }, 22000); // Toutes les 22 secondes

    return () => {
      clearInterval(elapsedInterval);
      clearInterval(comradesInterval);
    };
  }, [level]);

  useEffect(() => {
    // 2. Récupérer la session locale
    try {
      const saved = localStorage.getItem('polytech_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          setStudent((prev) => ({
            ...prev,
            fullName: parsed.name || prev.fullName,
            matricule: parsed.matricule || prev.matricule,
            email: parsed.email || prev.email,
            phone: parsed.phone || prev.phone,
            avatarUrl: parsed.avatar_url || prev.avatarUrl,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Récupérer l'utilisateur Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setStudent((prev) => ({
          id: user.id,
          fullName: user.user_metadata?.full_name || prev.fullName || 'Élève-Ingénieur',
          matricule: user.user_metadata?.matricule || prev.matricule || '24P-RP',
          email: user.email || prev.email || '',
          phone: user.user_metadata?.phone || prev.phone || '',
          avatarUrl: user.user_metadata?.avatar_url || prev.avatarUrl || null,
        }));
      }
    });
  }, [supabase]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !student.id) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', student.id);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.avatarUrl) {
        setStudent((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
        try {
          const saved = localStorage.getItem('polytech_user_session');
          if (saved) {
            const parsed = JSON.parse(saved);
            parsed.avatar_url = data.avatarUrl;
            localStorage.setItem('polytech_user_session', JSON.stringify(parsed));
          }
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error('Erreur changement photo:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('polytech_user_session');
    } catch {}
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
  };

  const allSubjects = getSubjectsByLevelAndSemester(level, semester);
  const filteredSubjects = allSubjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = student.fullName || 'Élève-Ingénieur';
  const firstName = displayName.split(' ')[0];
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'RP';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. HEADER DU COCKPIT ÉTUDIANT (Tout-en-un) */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0A1628] to-[#040D1B] border border-white/10 p-6 sm:p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-poly-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-poly-cyan/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Identité de l'étudiant */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-black text-amber-300">
                    {initials}
                  </span>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-amber-300 font-bold">
                    Upload...
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Changer ma photo de profil"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#D4AF37] text-slate-950 hover:scale-110 active:scale-95 transition-transform shadow-lg border-2 border-slate-900"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connecté
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  {level}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-100">{firstName}</span> 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-mono flex items-center gap-2">
                <span>Matricule : <strong>{student.matricule || '24P-RP'}</strong></span>
                <span className="text-slate-500">•</span>
                <span>Polytechnique Yaoundé</span>
              </p>
            </div>
          </div>

          {/* Boutons de bascule rapides du tableau de bord */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'courses'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 font-extrabold'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Mes Cours</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 font-extrabold'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mon Profil</span>
            </button>

            <button
              onClick={handleSignOut}
              title="Déconnexion"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. BANNIÈRE SOCIALE & MOTIVATION ("L'application cause avec l'étudiant") */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-sky-500/10 p-4 sm:p-5 rounded-2xl border border-amber-500/30 relative">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex-shrink-0 relative">
              <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
              {joinedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] animate-bounce">
                  +{joinedCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
                  En Direct — Salle d'Étude {level}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15">
                  ⏱️ Connecté depuis {Math.floor(elapsedSeconds / 60)} min {elapsedSeconds % 60} s
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-white leading-snug">
                <span className="text-amber-300 font-black text-lg sm:text-xl drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">
                  {simulatedActive} camarades
                </span>{' '}
                sont en train d&apos;apprendre en ce moment même !
              </p>
              <p className="text-xs sm:text-sm text-amber-100/90 font-medium mt-1">
                {joinedCount > 0 ? (
                  <span className="text-emerald-300 font-bold">
                    🔥 <strong>+{joinedCount} nouveaux camarades</strong> ont commencé à bosser depuis que tu es sur cette page.
                  </span>
                ) : (
                  <span>L&apos;affluence monte dans la promo.</span>
                )}{' '}
                <em>Qu&apos;attends-tu pour continuer à lire tes cours ? Pendant que tu dors ou hésites, les autres prennent de l&apos;avance !</em>
              </p>

              {/* Notification dynamique en direct d'un camarade qui rejoint */}
              {recentNotification && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fadeIn">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{recentNotification}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('courses');
              const el = document.getElementById('subjects-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-[#D4AF37] hover:scale-105 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider transition-all self-stretch md:self-auto text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Ouvrir mes cours</span>
          </button>
        </div>
      </div>

      {/* 3. VUE PRINCIPALE DU TABLEAU DE BORD (ONGLETS) */}
      <AnimatePresence mode="wait">
        {activeTab === 'courses' ? (
          <motion.div
            key="courses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Contrôles des cours : Semestre + Recherche */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              {/* Sélecteur de semestre */}
              <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-fit">
                {([1, 2] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSemester(s)}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                      semester === s
                        ? 'bg-gradient-to-r from-[#D4AF37] to-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Semestre {s}
                  </button>
                ))}
              </div>

              {/* Recherche de matière */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une matière (Maths, Physique, Info...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            {/* Légende rapide des ressources */}
            <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Polycopiés certifiés (Gratuit)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Fiches de TD (Gratuit)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Annales CC & Examens (Gratuit)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Corrections officielles guidées
              </div>
            </div>

            {/* Grille des matières */}
            <div id="subjects-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSubjects.map((subject, index) => (
                <SubjectCard key={subject.id} subject={subject} index={index} />
              ))}
            </div>

            {filteredSubjects.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                Aucune matière ne correspond à votre recherche &ldquo;{searchQuery}&rdquo;.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                {student.avatarUrl ? (
                  <img src={student.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-amber-300 font-bold text-xl">
                    {initials}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{displayName}</h2>
                <p className="text-xs text-[#D4AF37] font-bold font-mono">Étudiant certifié • {level}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Matricule Polytech</span>
                <p className="text-sm font-black text-slate-900 dark:text-white font-mono">{student.matricule || 'Non assigné'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Niveau Académique</span>
                <p className="text-sm font-black text-[#D4AF37]">{level}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email Institutionnel</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{student.email || 'Email non renseigné'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Téléphone WhatsApp</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{student.phone || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Remplacer ma photo de profil</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CARROUSEL DÉFILANT DES CAMARADES (Vous n'êtes pas seul !) */}
      <StudentMarquee level={level} />
    </div>
  );
}
