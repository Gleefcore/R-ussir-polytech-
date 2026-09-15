'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-all"
    >
      <LogOut className="w-4 h-4" />
      Déconnexion
    </button>
  );
}
