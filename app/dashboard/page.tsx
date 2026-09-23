import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GraduationCap, Star, BookOpen, User } from 'lucide-react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { StudentMarquee } from '@/components/academic/StudentMarquee';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  // Requête résiliente du profil (maybeSingle pour éviter l'erreur si le profil est en création)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Requête résiliente des demandes de corrections
  const { data: correctionRequests } = await supabase
    .from('correction_requests')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const fullName = profile?.full_name || (user.user_metadata?.full_name as string) || 'Élève Ingénieur';
  const matricule = profile?.matricule || (user.user_metadata?.matricule as string) || 'Non assigné';
  const level = profile?.level || (user.user_metadata?.level as string) || 'MSP1';
  const phone = profile?.phone || (user.user_metadata?.phone as string) || '';
  let avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || '';

  // Fallback au cas où l'utilisateur s'est inscrit avant le patch metadata
  if (!avatarUrl) {
    const { data: files } = await supabase.storage.from('avatars').list('', { search: user.id });
    if (files && files.length > 0) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(files[0].name);
      avatarUrl = data.publicUrl;
    }
  }

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'RP';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="glass-card p-6 border border-slate-200 dark:border-white/10 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm dark:shadow-none">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-full border-2 border-poly-gold/50 overflow-hidden bg-slate-100 dark:bg-poly-card flex items-center justify-center flex-shrink-0 shadow-sm">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-slate-800 dark:text-white font-black text-2xl">{initials}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Bienvenue, {fullName.split(' ')[0]} 👋
            </h1>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="text-sky-600 dark:text-poly-cyan font-mono text-sm bg-poly-cyan/10 border border-poly-cyan/30 px-3 py-1 rounded-lg font-bold">
                {matricule}
              </span>
              <span className="text-poly-gold text-sm bg-poly-gold/15 border border-poly-gold/30 px-3 py-1 rounded-lg font-black">
                {level}
              </span>
            </div>
            {phone && <p className="text-slate-500 dark:text-white/40 text-sm mt-1">{phone}</p>}
          </div>

          <SignOutButton />
        </div>

        {/* Quick access */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href={level === 'MSP2' ? '/msp2' : '/msp1'}
            className="glass-card p-6 border border-sky-500/20 hover:border-sky-500/50 transition-all group shadow-sm dark:shadow-none"
          >
            <GraduationCap className="w-8 h-8 text-sky-600 dark:text-poly-cyan mb-3" />
            <h3 className="text-slate-900 dark:text-white font-bold">Mes matières</h3>
            <p className="text-slate-500 dark:text-white/40 text-sm mt-1">
              {level} — Cours, TD, Examens
            </p>
          </Link>

          <Link
            href="/entrepreneur-vip"
            className="glass-card p-6 border border-poly-gold/20 hover:border-poly-gold/50 transition-all group shadow-sm dark:shadow-none"
          >
            <Star className="w-8 h-8 text-poly-gold mb-3" />
            <h3 className="text-slate-900 dark:text-white font-bold">Formations VIP</h3>
            <p className="text-slate-500 dark:text-white/40 text-sm mt-1">10 programmes d&apos;élite disponibles</p>
          </Link>

          <Link
            href="/a-propos"
            className="glass-card p-6 border border-violet-500/20 hover:border-violet-500/50 transition-all group shadow-sm dark:shadow-none"
          >
            <User className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-3" />
            <h3 className="text-slate-900 dark:text-white font-bold">Équipe dirigeante</h3>
            <p className="text-slate-500 dark:text-white/40 text-sm mt-1">14 membres fondateurs & mentors</p>
          </Link>
        </div>

        {/* Recent correction requests */}
        <div className="glass-card p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-poly-gold" />
            <h2 className="text-slate-900 dark:text-white font-bold">Mes demandes de corrections</h2>
          </div>

          {correctionRequests && correctionRequests.length > 0 ? (
            <div className="space-y-3">
              {correctionRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5"
                >
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-semibold">{req.subject_name}</p>
                    <p className="text-slate-400 dark:text-white/40 text-xs mt-0.5">
                      {new Date(req.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      req.status === 'VALIDATED'
                        ? 'text-emerald-700 dark:text-green-400 border-emerald-400/30 bg-emerald-400/10'
                        : 'text-amber-700 dark:text-poly-gold border-amber-400/30 bg-amber-400/10'
                    }`}
                  >
                    {req.status === 'VALIDATED' ? '✓ Validé' : '⏳ En attente'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-white/40 text-sm">
              Aucune demande de correction pour le moment. Visitez vos matières pour débloquer une correction officielle.
            </p>
          )}
        </div>

        {/* Marquee en bas du compte */}
        <div className="mt-12">
          <StudentMarquee level={level as 'MSP1' | 'MSP2'} />
        </div>
      </div>
    </div>
  );
}
