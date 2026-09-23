'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Upload, CheckCircle, AlertCircle, Loader2, Sparkles, KeyRound } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import { CelebrationLightShow } from './CelebrationLightShow';

type AuthMode = 'login' | 'register';

interface RegisterData {
  fullName: string;
  email: string;
  matricule: string;
  phone: string;
  level: 'MSP1' | 'MSP2' | 'ALUMNI';
  password: string;
  avatar: File | null;
}

const LOCAL_STORAGE_CRED_KEY = 'polytech_saved_credentials';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [savedCredentialFound, setSavedCredentialFound] = useState(false);

  // État pour le spectacle lumineux de félicitations
  const [celebrating, setCelebrating] = useState(false);
  const [celebratedUser, setCelebratedUser] = useState('');
  const [targetUrl, setTargetUrl] = useState('/msp1');
  const [userLevel, setUserLevel] = useState('MSP1');

  const router = useRouter();
  const supabase = createClient();

  // Login state (accepte soit email, soit matricule)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [reg, setReg] = useState<RegisterData>({
    fullName: '',
    email: '',
    matricule: '',
    phone: '+237',
    level: 'MSP1',
    password: '',
    avatar: null,
  });

  // Sauvegarde automatique et détection automatique des identifiants et de la session active
  useEffect(() => {
    // 1. Si une session active est déjà enregistrée, rediriger immédiatement sans redemander la connexion
    try {
      const activeSession = localStorage.getItem('polytech_user_session');
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        if (parsed && (parsed.level || parsed.name)) {
          const dest = parsed.level === 'MSP2' ? '/msp2' : '/msp1';
          router.replace(dest);
          return;
        }
      }
    } catch {
      // Ignorer
    }

    // 2. Vérification côté Supabase
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        const level = data.session.user.user_metadata?.level;
        const dest = level === 'MSP2' ? '/msp2' : '/msp1';
        router.replace(dest);
        return;
      }
    });

    // 3. Pré-remplissage des champs si des identifiants sont mémorisés
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CRED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.identifier && parsed.password) {
          setLoginIdentifier(parsed.identifier);
          setLoginPassword(parsed.password);
          setSavedCredentialFound(true);
        }
      }
    } catch {
      // Ignore local storage error
    }
  }, [router, supabase]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReg((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const persistCredentials = (identifier: string, pass: string) => {
    if (rememberMe) {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_CRED_KEY,
          JSON.stringify({ identifier: identifier.trim(), password: pass })
        );
      } catch {
        // Ignorer si localStorage est désactivé
      }
    }
  };

  const persistActiveSession = (data: { name: string; matricule: string; level: string; email?: string; phone?: string; avatar_url?: string | null }) => {
    try {
      localStorage.setItem('polytech_user_session', JSON.stringify(data));
    } catch {
      // Ignorer si localStorage est désactivé
    }
  };

  const triggerSuccessAndRedirect = (displayName: string, destUrl: string, levelName: string) => {
    setCelebratedUser(displayName);
    setTargetUrl(destUrl);
    setUserLevel(levelName);
    setCelebrating(true);
  };

  // ==========================================
  // CONNEXION RÉSILIENTE (MATRICULE OU EMAIL)
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la connexion.');
      }

      // Synchroniser la session dans le client Supabase
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      // Mémoriser les identifiants
      persistCredentials(loginIdentifier, loginPassword);

      // Mémoriser la session locale active
      persistActiveSession({
        name: data.fullName,
        matricule: data.matricule,
        level: data.level,
        email: data.email,
        avatar_url: data.session?.user?.user_metadata?.avatar_url || null,
      });

      const dest = data.level === 'MSP2' ? '/msp2' : '/msp1';
      triggerSuccessAndRedirect(data.fullName, dest, data.level);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Identifiants incorrects.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INSCRIPTION RÉSILIENTE & AUTO-CONFIRMÉE
  // ==========================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.avatar) {
      setError('Une photo de profil est obligatoire.');
      return;
    }

    const cleanMatricule = reg.matricule.trim();
    if (!cleanMatricule) {
      setError('Veuillez renseigner votre matricule académique.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: reg.fullName.trim(),
          email: reg.email.trim(),
          matricule: cleanMatricule,
          phone: reg.phone.trim(),
          level: reg.level,
          password: reg.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la création du compte.');
      }

      // Upload sécurisé de l'avatar via l'API serveur (sans blocage RLS)
      let uploadedAvatarUrl = null;
      if (data.user?.id && reg.avatar) {
        try {
          const avatarData = new FormData();
          avatarData.append('file', reg.avatar);
          avatarData.append('userId', data.user.id);
          const avRes = await fetch('/api/user/avatar', {
            method: 'POST',
            body: avatarData,
          });
          const avJson = await avRes.json();
          if (avJson.success && avJson.avatarUrl) {
            uploadedAvatarUrl = avJson.avatarUrl;
          }
        } catch (e) {
          console.error('Avatar upload error:', e);
        }
      }

      // Synchroniser la session dans le client Supabase
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      persistCredentials(cleanMatricule, reg.password);

      persistActiveSession({
        name: data.fullName,
        matricule: data.matricule,
        level: data.level,
        email: data.email,
        phone: reg.phone.trim(),
        avatar_url: uploadedAvatarUrl || data.session?.user?.user_metadata?.avatar_url || null,
      });

      const dest = data.level === 'MSP2' ? '/msp2' : '/msp1';
      triggerSuccessAndRedirect(data.fullName, dest, data.level);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l\'inscription.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const canSubmitRegister =
    reg.fullName.trim() &&
    reg.matricule.trim() &&
    reg.phone.trim() &&
    reg.level &&
    reg.password.length >= 6 &&
    reg.avatar !== null;

  return (
    <>
      {/* Animation d'explosion de lumières et célébration */}
      <CelebrationLightShow
        show={celebrating}
        studentName={celebratedUser}
        targetUrl={targetUrl}
        academicLevel={userLevel}
        onFinish={() => {
          router.push(targetUrl);
          router.refresh();
        }}
      />

      <div className="w-full max-w-md mx-auto">
        {/* Onglets de sélection */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 mb-8 p-1 bg-slate-100 dark:bg-poly-night shadow-inner">
          {(['login', 'register'] as AuthMode[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setMode(tab); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-black rounded-lg transition-all ${
                mode === tab
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {/* Message d'aide si identifiants pré-remplis */}
        {mode === 'login' && savedCredentialFound && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-xl p-3 mb-5 text-[#D4AF37] text-xs font-bold"
          >
            <KeyRound className="w-4 h-4 flex-shrink-0" />
            <span>Identifiants mémorisés pour une connexion en 1 clic !</span>
          </motion.div>
        )}

        {/* Erreur éventuelle avec message clair */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 bg-red-500/15 border border-red-500/30 rounded-xl p-4 mb-6 text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {mode === 'login' ? (
          /* ---- FORMULAIRE DE CONNEXION AVEC AUTO-COMPLÉTION NAVIGATEUR ET STOCKAGE ---- */
          <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5 font-heading">
                Matricule académique, Nom ou Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Ex: 25Q529, Yannick Bikei, ou email@..."
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="input-field font-semibold"
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Connectez-vous facilement avec votre <strong>matricule</strong> (ex: 25Q...), votre <strong>nom</strong> ou votre <strong>email</strong>.
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5 font-heading">
                Mot de passe
              </label>
              <input
                id="current-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3.5 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Checkbox mémorisation */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span>Mémoriser mes accès sur cet appareil</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#050B14]" />
                  <span>Entrer dans l&apos;Excellence</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* ---- FORMULAIRE D'INSCRIPTION ---- */
          <form onSubmit={handleRegister} className="space-y-4" autoComplete="on">
            {/* Upload Avatar Obligatoire */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div
                className={`relative w-24 h-24 rounded-full border-2 cursor-pointer overflow-hidden transition-all shadow-md ${
                  avatarPreview
                    ? 'border-[#D4AF37]'
                    : 'border-dashed border-slate-300 dark:border-white/20 hover:border-[#D4AF37]'
                }`}
              >
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-poly-card">
                    <Upload className="w-6 h-6 text-slate-400 dark:text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">Photo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                {reg.avatar ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
                <span className={`text-xs font-bold ${reg.avatar ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {reg.avatar ? 'Photo de profil chargée ✓' : 'Photo de profil requise *'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 font-heading">Nom et prénom complets *</label>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Ex: Eugène Samuel GWET"
                value={reg.fullName}
                onChange={(e) => setReg((p) => ({ ...p, fullName: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 font-heading">
                Adresse Email *
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="votre.nom@gmail.com"
                value={reg.email}
                onChange={(e) => setReg((p) => ({ ...p, email: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 font-heading">
                Matricule académique * (Polytech, Univ. Douala, etc.)
              </label>
              <input
                type="text"
                placeholder="Ex: 25Q529, 25Q526, 24P100, 2024Q15..."
                value={reg.matricule}
                onChange={(e) =>
                  setReg((p) => ({ ...p, matricule: e.target.value.trim().toUpperCase() }))
                }
                className="input-field font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 font-heading">Téléphone WhatsApp *</label>
              <input
                type="tel"
                name="tel"
                autoComplete="tel"
                placeholder="+237 6XX XX XX XX"
                value={reg.phone}
                onChange={(e) => setReg((p) => ({ ...p, phone: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 font-heading">Niveau académique *</label>
              <select
                value={reg.level}
                onChange={(e) =>
                  setReg((p) => ({ ...p, level: e.target.value as typeof reg.level }))
                }
                className="input-field font-bold"
                required
              >
                <option value="MSP1">MSP1 — 1ère année</option>
                <option value="MSP2">MSP2 — 2ème année</option>
                <option value="ALUMNI">ALUMNI — Diplômé / Autre</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 font-heading">Mot de passe *</label>
              <input
                id="new-password"
                name="new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Minimum 6 caractères"
                value={reg.password}
                onChange={(e) => setReg((p) => ({ ...p, password: e.target.value }))}
                className="input-field pr-12"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3.5 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !canSubmitRegister}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enrôlement dans l&apos;Élite...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#050B14]" />
                  <span>Rejoindre la Communauté</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
