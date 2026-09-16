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

  const persistActiveSession = (data: { name: string; matricule: string; level: string; email?: string; phone?: string }) => {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const identifier = loginIdentifier.trim();
    let authEmail = identifier;
    let foundDisplayName = identifier;
    let resolvedLevel = 'MSP1';

    // Si ce n'est pas un email (ne contient pas @), on recherche le profil par matricule
    if (!identifier.includes('@')) {
      const cleanMatricule = identifier.toUpperCase();
      const { data: profileFound } = await supabase
        .from('profiles')
        .select('email, matricule, full_name, level')
        .eq('matricule', cleanMatricule)
        .maybeSingle();

      if (profileFound && profileFound.email) {
        authEmail = profileFound.email;
        foundDisplayName = profileFound.full_name || cleanMatricule;
        if (profileFound.level) resolvedLevel = profileFound.level;
      } else {
        const safeLocal = cleanMatricule.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        authEmail = `${safeLocal}@polytech.rp`;
      }
    }

    const { data: signData, error: signInError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: loginPassword,
    });

    if (signInError) {
      // Fallback si l'utilisateur a tapé son matricule
      if (!identifier.includes('@')) {
        const safeLocal = identifier.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const fallbackEmail = `${safeLocal}@polytech.rp`;
        if (fallbackEmail !== authEmail) {
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: fallbackEmail,
            password: loginPassword,
          });
          if (!retryError) {
            persistCredentials(identifier, loginPassword);
            const name = retryData.user?.user_metadata?.full_name || identifier;
            const dest = retryData.user?.user_metadata?.level === 'MSP2' ? '/msp2' : '/msp1';
            triggerSuccessAndRedirect(name, dest, retryData.user?.user_metadata?.level || 'MSP1');
            setLoading(false);
            return;
          }
        }
      }
      setError("Identifiants incorrects. Vérifiez votre matricule/email et mot de passe.");
      setLoading(false);
    } else {
      // Résoudre le niveau si pas encore identifié
      if (signData?.user?.id) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('level, full_name')
          .eq('id', signData.user.id)
          .maybeSingle();
        if (userProfile?.level) {
          resolvedLevel = userProfile.level;
        } else if (signData.user.user_metadata?.level) {
          resolvedLevel = signData.user.user_metadata.level;
        }
      }

      persistCredentials(identifier, loginPassword);
      const name = signData.user?.user_metadata?.full_name || foundDisplayName;
      const dest = resolvedLevel === 'MSP2' ? '/msp2' : '/msp1';

      persistActiveSession({
        name,
        matricule: identifier,
        level: resolvedLevel,
        email: authEmail,
      });

      triggerSuccessAndRedirect(name, dest, resolvedLevel);
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.avatar) {
      setError('Une photo de profil est obligatoire.');
      return;
    }

    const cleanMatricule = reg.matricule.trim();
    if (!cleanMatricule) {
      setError('Veuillez renseigner votre matricule.');
      return;
    }

    setLoading(true);
    setError('');

    const userEmail = reg.email.trim()
      ? reg.email.trim().toLowerCase()
      : `${cleanMatricule.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@polytech.rp`;

    // 1. Inscription Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: userEmail,
      password: reg.password,
      options: {
        data: {
          full_name: reg.fullName.trim(),
          matricule: cleanMatricule,
          phone: reg.phone.trim(),
          level: reg.level,
        },
      },
    });

    if (signUpError || !authData.user) {
      setError(signUpError?.message || 'Erreur lors de la création du compte.');
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    // 2. Upload de l'avatar
    const fileExt = reg.avatar.name.split('.').pop() || 'jpg';
    const avatarPath = `${userId}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, reg.avatar, { upsert: true });

    let avatarUrl = '';
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(avatarPath);
      avatarUrl = publicUrlData.publicUrl;
    }

    // 3. Sauvegarde profil
    const profilePayload: Record<string, unknown> = {
      id: userId,
      full_name: reg.fullName.trim(),
      matricule: cleanMatricule,
      email: userEmail,
      phone: reg.phone.trim(),
      level: reg.level,
      avatar_url: avatarUrl || '',
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });

    if (profileError) {
      delete profilePayload.email;
      await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
    }

    // Sauvegarder automatiquement les identifiants pour la prochaine fois
    persistCredentials(cleanMatricule, reg.password);

    persistActiveSession({
      name: reg.fullName.trim(),
      matricule: cleanMatricule,
      level: reg.level,
      email: userEmail,
      phone: reg.phone.trim(),
    });

    const dest = reg.level === 'MSP2' ? '/msp2' : '/msp1';
    triggerSuccessAndRedirect(reg.fullName.trim(), dest, reg.level);
    setLoading(false);
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

        {/* Message d'aide si mot de passe pré-rempli */}
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

        {/* Erreur éventuelle */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl p-4 mb-6 text-red-600 dark:text-red-400 text-sm font-semibold"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {mode === 'login' ? (
          /* ---- FORMULAIRE DE CONNEXION AVEC AUTO-COMPLÉTION NAVIGATEUR ET STOCKAGE ---- */
          <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5 font-heading">
                Matricule ou Adresse Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Ex: 24P100, 2024Q15, ou votre@email.com"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="input-field"
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Connectez-vous avec n&apos;importe quel matricule universitaire ou votre email.
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
                  <span>Connexion au cockpit...</span>
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
                placeholder="Ex: 24P100, 2024Q15, 2024P089..."
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
