/**
 * Gestionnaire audio des alertes et notifications Réussir Polytech.
 * Joue une sonnerie cristalline pour prévenir l'étudiant d'un événement réel.
 */

class SoundManager {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audio = new Audio('/sounds/notification.wav');
        this.audio.preload = 'auto';
      } catch {}
    }
  }

  public playChime() {
    if (typeof window === 'undefined') return;

    // 1. Tenter d'abord la lecture du fichier audio officiel
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.volume = 0.85;
      const playPromise = this.audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Si le navigateur bloque la lecture d'élément audio sans interaction directe,
          // basculer sur la synthèse Web Audio API
          this.playSynthesizedChime();
        });
        return;
      }
    }

    // 2. Repli : Synthèse harmonique Web Audio API
    this.playSynthesizedChime();
  }

  private playSynthesizedChime() {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // Note 1 : C6 (1046.5 Hz)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Note 2 : G6 (1567.98 Hz) avec léger décalage (chime montant)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.12);
      gain2.gain.setValueAtTime(0.35, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.75);
    } catch {}
  }
}

export const soundManager = new SoundManager();

export function playNotificationSound() {
  soundManager.playChime();
}
