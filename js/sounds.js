/* ============================================================
   PowerApp — Sounds.js v1.0
   Sons synthétiques Web Audio API
   Génère beep / pr / rest sans fichiers externes
   ============================================================ */

'use strict';

const Sounds = {

  _ctx: null,
  _config: {
    volume: 0.4,
    active: true
  },

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  init() {
    try {
      // Récupérer config depuis storage
      const cfg = Utils.storage.get('ft_notifs_config', {});
      this._config.active = cfg.son !== false;
    } catch(e) {}
    console.log('✅ Sounds.js prêt — synthèse audio');
  },

  // Créer ou réutiliser l'AudioContext
  _getCtx() {
    if (!this._ctx || this._ctx.state === 'closed') {
      this._ctx = new (window.AudioContext
        || window.webkitAudioContext)();
    }
    // Débloquer le contexte si suspendu (politique navigateur)
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
    return this._ctx;
  },

  // ════════════════════════════════════════════════════════
  // JOUER UN SON
  // ════════════════════════════════════════════════════════
  jouer(type = 'beep') {
    if (!this._config.active) return;

    try {
      switch(type) {
        case 'beep': this._beep();   break;
        case 'pr':   this._pr();     break;
        case 'rest': this._repos();  break;
        default:     this._beep();
      }
    } catch(e) {
      console.warn('[Sounds] Erreur lecture:', e);
    }
  },

  // ════════════════════════════════════════════════════════
  // SON BEEP — Compte à rebours (3s)
  // Bip court et aigu
  // ════════════════════════════════════════════════════════
  _beep() {
    const ctx  = this._getCtx();
    const now  = ctx.currentTime;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type            = 'sine';
    osc.frequency.value = 880;  // La4 — aigu et perceptible

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this._config.volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.15);
  },

  // ════════════════════════════════════════════════════════
  // SON PR — Nouveau record personnel
  // Mélodie montante festive
  // ════════════════════════════════════════════════════════
  _pr() {
    const ctx  = this._getCtx();
    const now  = ctx.currentTime;

    // Notes de la fanfare : Do Mi Sol Do (octave sup)
    const notes = [
      { freq:523.25, t:0,    dur:0.12 }, // Do4
      { freq:659.25, t:0.13, dur:0.12 }, // Mi4
      { freq:783.99, t:0.26, dur:0.12 }, // Sol4
      { freq:1046.5, t:0.39, dur:0.35 }  // Do5
    ];

    notes.forEach(note => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type            = 'square';
      osc.frequency.value = note.freq;

      // Envelope ADSR
      gain.gain.setValueAtTime(0, now + note.t);
      gain.gain.linearRampToValueAtTime(
        this._config.volume * 0.6,
        now + note.t + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + note.t + note.dur
      );

      osc.start(now + note.t);
      osc.stop(now + note.t + note.dur + 0.05);
    });

    // Réverb légère via délai
    this._addReverb(ctx, now, 0.8);
  },

  // ════════════════════════════════════════════════════════
  // SON REPOS — Fin du timer de repos
  // Son grave + montée douce
  // ════════════════════════════════════════════════════════
  _repos() {
    const ctx = this._getCtx();
    const now = ctx.currentTime;

    // Deux oscillateurs pour richesse harmonique
    [220, 330].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type            = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(
        this._config.volume * (i === 0 ? 0.5 : 0.3),
        now + i * 0.05 + 0.05
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.4
      );

      osc.start(now + i * 0.05);
      osc.stop(now + 0.5);
    });
  },

  // ════════════════════════════════════════════════════════
  // SON LEVEL UP — Nouveau niveau XP
  // ════════════════════════════════════════════════════════
  levelUp() {
    if (!this._config.active) return;
    try {
      const ctx = this._getCtx();
      const now = ctx.currentTime;

      // Arpège ascendant + accord final
      const sequence = [
        { freq:261.63, t:0,    dur:0.1  }, // Do4
        { freq:329.63, t:0.1,  dur:0.1  }, // Mi4
        { freq:392.00, t:0.2,  dur:0.1  }, // Sol4
        { freq:523.25, t:0.3,  dur:0.1  }, // Do5
        { freq:659.25, t:0.4,  dur:0.1  }, // Mi5
        { freq:783.99, t:0.5,  dur:0.25 }  // Sol5
      ];

      sequence.forEach(note => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type            = 'triangle';
        osc.frequency.value = note.freq;

        gain.gain.setValueAtTime(0, now + note.t);
        gain.gain.linearRampToValueAtTime(
          this._config.volume * 0.5,
          now + note.t + 0.02
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + note.t + note.dur
        );

        osc.start(now + note.t);
        osc.stop(now + note.t + note.dur + 0.05);
      });
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // SON TROPHÉE — Déblocage trophée
  // ════════════════════════════════════════════════════════
  trophee() {
    if (!this._config.active) return;
    try {
      const ctx = this._getCtx();
      const now = ctx.currentTime;

      // Shimmer effect — plusieurs fréquences rapides
      const freqs = [523, 659, 784, 1047];
      freqs.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type            = 'sine';
        osc.frequency.value = freq;

        const t = i * 0.08;
        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(
          this._config.volume * 0.4,
          now + t + 0.03
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + t + 0.3
        );

        osc.start(now + t);
        osc.stop(now + t + 0.35);
      });
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // SON ERREUR
  // ════════════════════════════════════════════════════════
  erreur() {
    if (!this._config.active) return;
    try {
      const ctx = this._getCtx();
      const now = ctx.currentTime;

      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Descente fréquentielle = erreur
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);

      gain.gain.setValueAtTime(this._config.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // RÉVERB SYNTHÉTIQUE (délai court)
  // ════════════════════════════════════════════════════════
  _addReverb(ctx, now, duree) {
    try {
      const delay = ctx.createDelay(1.0);
      const gain  = ctx.createGain();

      delay.delayTime.value = 0.08;
      gain.gain.value       = 0.15;

      delay.connect(gain);
      gain.connect(ctx.destination);
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // VOLUME
  // ════════════════════════════════════════════════════════
  setVolume(val) {
    this._config.volume = Math.max(0, Math.min(1, val));
  },

  setActive(bool) {
    this._config.active = bool;
  },

  // Test — joue tous les sons
  tester() {
    const sons = ['beep', 'rest', 'pr'];
    sons.forEach((son, i) => {
      setTimeout(() => {
        console.log(`[Sounds] Test: ${son}`);
        this.jouer(son);
      }, i * 800);
    });
    setTimeout(() => this.levelUp(), 2500);
    setTimeout(() => this.trophee(), 3500);
  }
};

window.Sounds = Sounds;
console.log('✅ Sounds.js v1.0 chargé');
