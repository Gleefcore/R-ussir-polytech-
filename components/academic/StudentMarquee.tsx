'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';
import Marquee from 'react-fast-marquee';

interface Student {
  id: string;
  fullName: string;
  avatarUrl: string | null;
}

export function StudentMarquee({ level }: { level: 'MSP1' | 'MSP2' }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/users/level?level=${level}`);
        const data = await res.json();
        if (data.success) {
          // Filtrer ceux qui ont une photo de profil et quelques autres pour le défilement
          const validStudents = data.students.filter((s: Student) => s.avatarUrl || s.fullName);
          setStudents(validStudents);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [level]);

  if (loading || students.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Users className="w-5 h-5 text-poly-cyan" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Vous n'êtes pas seul ! <span className="text-[#D4AF37]">{students.length} inscrits</span> en {level}.
        </h3>
      </div>
      
      <div className="w-full overflow-hidden">
        <Marquee speed={40} gradient={false} pauseOnHover={true}>
          {students.map((s, i) => (
            <div key={`${s.id}-${i}`} className="flex flex-col items-center mx-4 gap-2">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-white/10 shadow-sm bg-slate-100 dark:bg-slate-800">
                {s.avatarUrl ? (
                  <Image src={s.avatarUrl} alt={s.fullName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-poly-cyan/20 text-poly-cyan font-bold text-xs uppercase">
                    {s.fullName.substring(0, 2)}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 max-w-[60px] truncate text-center">
                {s.fullName.split(' ')[0]}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
