/* ============================================================
   PowerApp — Sounds.js v2.0
   Sons synthétiques Web Audio API
   + Alias go/bip/serie/circuit
   + Fix réverb + Persistance volume
   ============================================================ */

'use strict';

const Sounds = {

  _ctx:    null,
  _config: {
    volume: 0.4,
    active: true
  },

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  init() {
    try {
      const cfg = Utils.storage.get('ft_notifs_config', {});
      this._config.active = cfg.son !== false;
      this._config.volume = cfg.volume || 0.4;
    } catch(e) {}
    console.log('✅ Sounds.js v2.0 prêt — synthèse audio');
  },

  // ════════════════════════════════════════════════════════
  // AUDIO CONTEXT
  // ════════════════════════════════════════════════════════
  _getCtx() {
    if (!this._ctx || this._ctx.state === 'closed') {
      this._ctx = new (window.AudioContext
        || window.webkitAudioContext)();
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
    return this._ctx;
  },

  // ════════════════════════════════════════════════════════
  // JOUER UN SON — ✅ v2.0 avec alias go/bip/serie/circuit
  // ════════════════════════════════════════════════════════
  jouer(type = 'beep') {
    if (!this._config.active) return;

    try {
      switch(type) {
        // Sons principaux
        case 'beep':    this._beep();    break;
        case 'pr':      this._pr();      break;
        case 'rest':    this._repos();   break;
        // ✅ NOUVEAU v2.0 — Alias circuit.js + timer
        case 'go':      this._go();      break;
        case 'bip':     this._bip();     break;
        case 'serie':   this._serie();   break;
        case 'circuit': this._circuit(); break;
        // Sons spéciaux
        case 'levelup': this.levelUp();  break;
        case 'trophee': this.trophee();  break;
        case 'erreur':  this.erreur();   break;
        default:        this._beep();
      }
    } catch(e) {
      console.warn('[Sounds] Erreur lecture:', e);
    }
  },

  // ════════════════════════════════════════════════════════
  // SON BEEP — Compte à rebours (3s)
  // ════════════════════════════════════════════════════════
  _beep() {
    const ctx  = this._getCtx();
    const now  = ctx.currentTime;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type            = 'sine';
    osc.frequency.value = 880;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(
      this._config.volume, now + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001, now + 0.12
    );

    osc.start(now);
    osc.stop(now + 0.15);
  },

  // ✅ NOUVEAU v2.0 — SON BIP court (compte à rebours circuit)
  _bip() {
    const ctx  = this._getCtx();
    const now  = ctx.currentTime;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type            = 'sine';
    osc.frequency.value = 1100; // Plus aigu que beep

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(
      this._config.volume * 0.7, now + 0.005
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001, now + 0.06
    );

    osc.start(now);
    osc.stop(now + 0.08);
  },

  // ✅ NOUVEAU v2.0 — SON GO ! (départ circuit / phase travail)
  _go() {
    const ctx  = this._getCtx();
    const now  = ctx.currentTime;

    // Deux bips montants = GO !
    [660, 880].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type            = 'sine';
      osc.frequency.value = freq;

      const t = i * 0.1;
      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(
        this._config.volume * 0.8, now + t + 0.01
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001, now + t + 0.15
      );

      osc.start(now + t);
      osc.stop(now + t + 0.18);
    });
  },

  // ✅ NOUVEAU v2.0 — SON SÉRIE VALIDÉE
  _serie() {
    const ctx  = this._getCtx();
    const now  = ctx.currentTime;

    // Bip court + bip plus haut = validation
    [600, 750].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type            = 'triangle';
      osc.frequency.value = freq;

      const t = i * 0.08;
      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(
        this._config.volume * 0.5, now + t + 0.01
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001, now + t + 0.1
      );

      osc.start(now + t);
      osc.stop(now + t + 0.12);
    });
  },

  // ✅ NOUVEAU v2.0 — SON CIRCUIT TERMINÉ (fanfare enrichie)
  _circuit() {
    const ctx  = this._getCtx();
    const now  = ctx.currentTime;

    const notes = [
      { freq:523.25, t:0,    dur:0.12, type:'square'   },
      { freq:659.25, t:0.13, dur:0.12, type:'square'   },
      { freq:783.99, t:0.26, dur:0.12, type:'square'   },
      { freq:1046.5, t:0.39, dur:0.20, type:'triangle' },
      { freq:1318.5, t:0.60, dur:0.40, type:'triangle' }
    ];

    notes.forEach(note => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type            = note.type;
      osc.frequency.value = note.freq;

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
  },

  // ════════════════════════════════════════════════════════
  // SON PR — Nouveau record personnel
  // ════════════════════════════════════════════════════════
  _pr() {
    const ctx  = this._getCtx();
    const now  = ctx.currentTime;

    const notes = [
      { freq:523.25, t:0,    dur:0.12 },
      { freq:659.25, t:0.13, dur:0.12 },
      { freq:783.99, t:0.26, dur:0.12 },
      { freq:1046.5, t:0.39, dur:0.35 }
    ];

    notes.forEach(note => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type            = 'square';
      osc.frequency.value = note.freq;

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
  },

  // ════════════════════════════════════════════════════════
  // SON REPOS — Fin du timer de repos
  // ════════════════════════════════════════════════════════
  _repos() {
    const ctx = this._getCtx();
    const now = ctx.currentTime;

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
  // SON LEVEL UP
  // ════════════════════════════════════════════════════════
  levelUp() {
    if (!this._config.active) return;
    try {
      const ctx = this._getCtx();
      const now = ctx.currentTime;

      const sequence = [
        { freq:261.63, t:0,   dur:0.1  },
        { freq:329.63, t:0.1, dur:0.1  },
        { freq:392.00, t:0.2, dur:0.1  },
        { freq:523.25, t:0.3, dur:0.1  },
        { freq:659.25, t:0.4, dur:0.1  },
        { freq:783.99, t:0.5, dur:0.25 }
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
  // SON TROPHÉE
  // ════════════════════════════════════════════════════════
  trophee() {
    if (!this._config.active) return;
    try {
      const ctx  = this._getCtx();
      const now  = ctx.currentTime;
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
      const ctx  = this._getCtx();
      const now  = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);

      gain.gain.setValueAtTime(
        this._config.volume * 0.4, now
      );
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // VOLUME — ✅ v2.0 avec persistance
  // ════════════════════════════════════════════════════════
  setVolume(val) {
    this._config.volume = Math.max(0, Math.min(1, val));
    // ✅ Persister dans storage
    try {
      const cfg = Utils.storage.get('ft_notifs_config', {});
      cfg.volume = this._config.volume;
      Utils.storage.set('ft_notifs_config', cfg);
    } catch(e) {}
  },

  // ✅ v2.0 — setActive avec persistance
  setActive(bool) {
    this._config.active = bool;
    try {
      const cfg = Utils.storage.get('ft_notifs_config', {});
      cfg.son = bool;
      Utils.storage.set('ft_notifs_config', cfg);
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // TESTER TOUS LES SONS
  // ════════════════════════════════════════════════════════
  tester() {
    const sons = [
      { type:'beep',    label:'Beep'     },
      { type:'bip',     label:'Bip'      },
      { type:'go',      label:'Go!'      },
      { type:'serie',   label:'Série'    },
      { type:'rest',    label:'Repos'    },
      { type:'pr',      label:'PR'       },
      { type:'circuit', label:'Circuit'  }
    ];

    sons.forEach((s, i) => {
      setTimeout(() => {
        console.log(`[Sounds] Test: ${s.label}`);
        this.jouer(s.type);
      }, i * 700);
    });

    setTimeout(() => this.levelUp(),  sons.length * 700);
    setTimeout(() => this.trophee(), (sons.length + 1) * 700);
  }
};

window.Sounds = Sounds;
console.log('✅ Sounds.js v2.0 chargé — go/bip/serie/circuit + persistance');
