/* ============================================================
   LAVA FLOW — js/lava.js
   Arrière-plan animé style lave qui coule
============================================================ */

'use strict';

const LavaBackground = {

  _canvas:  null,
  _ctx:     null,
  _blobs:   [],
  _raf:     null,
  _w:       0,
  _h:       0,
  _theme:   null,

  // ── Palettes par thème ──
  PALETTES: {
    'cyber-blue': {
      bg:     [2,   6,  16],
      colors: [
        [0,  102, 255, 0.18],
        [0,  150, 255, 0.14],
        [0,  207, 255, 0.12],
        [123,  0, 255, 0.10],
        [75,  75, 249, 0.15],
        [0,   80, 200, 0.12]
      ]
    },
    'lava-neon': {
      bg:     [18, 6, 6],
      colors: [
        [255,  80,  20, 0.20],
        [255,   0, 100, 0.16],
        [255, 120,  30, 0.14],
        [255,  50,   0, 0.18],
        [200,   0,  80, 0.12],
        [255, 150,  50, 0.10]
      ]
    },
    'deep-purple': {
      bg:     [8, 6, 18],
      colors: [
        [139,   0, 255, 0.18],
        [191, 127, 255, 0.14],
        [255,   0, 170, 0.12],
        [100,   0, 200, 0.15],
        [160,  50, 255, 0.12],
        [80,    0, 180, 0.10]
      ]
    },
    'matrix-green': {
      bg:     [2, 12, 6],
      colors: [
        [0,  255, 136, 0.16],
        [0,  200,  60, 0.18],
        [0,  255, 200, 0.12],
        [0,  150,  50, 0.14],
        [50, 255, 100, 0.10],
        [0,  180,  80, 0.12]
      ]
    },
    'arctic-white': {
      bg:     [232, 238, 255],
      colors: [
        [0,  102, 255, 0.04],
        [0,   80, 200, 0.03],
        [75,  75, 249, 0.03],
        [0,  150, 255, 0.02],
        [0,   60, 180, 0.02],
        [100, 100, 255, 0.02]
      ]
    }
  },

  // ── Init ──
  init() {
    this._canvas = document.getElementById('lava-canvas');
    if (!this._canvas) return;

    this._ctx = this._canvas.getContext('2d');
    this._resize();
    this._getTheme();
    this._creerBlobs();
    this._loop();

    // Resize
    window.addEventListener('resize', () => {
      this._resize();
      this._creerBlobs();
    });

    // Changement de thème → update palette
    const observer = new MutationObserver(() => {
      this._getTheme();
      this._creerBlobs();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme-style']
    });

    console.log('[LavaBG] Initialisé ✅');
  },

  // ── Récupérer thème ──
  _getTheme() {
    const id = document.documentElement
      .getAttribute('data-theme-style') || 'cyber-blue';
    this._theme = this.PALETTES[id] || this.PALETTES['cyber-blue'];
  },

  // ── Resize canvas ──
  _resize() {
    this._w = this._canvas.width  = window.innerWidth;
    this._h = this._canvas.height = window.innerHeight;
  },

  // ── Créer les blobs de lave ──
  _creerBlobs() {
    this._blobs = [];
    const COUNT = 12;

    for (let i = 0; i < COUNT; i++) {
      this._blobs.push(this._newBlob(i, COUNT));
    }
  },

  // ── Nouveau blob ──
  _newBlob(i, total) {
    const palette = this._theme?.colors
      || this.PALETTES['cyber-blue'].colors;

    const col = palette[i % palette.length];

    return {
      // Position — répartis sur la largeur + aléatoire vertical
      x:     (this._w / total) * i + Math.random() * (this._w / total),
      y:     Math.random() * this._h,

      // Taille
      r:     80 + Math.random() * 200,

      // Vitesse de chute (vers le bas comme lave)
      vy:    0.2 + Math.random() * 0.6,
      vx:    (Math.random() - 0.5) * 0.3,

      // Oscillation latérale
      ox:    Math.random() * Math.PI * 2,
      oxSpeed: 0.003 + Math.random() * 0.005,
      oxAmp:  20 + Math.random() * 40,

      // Pulsation taille
      pr:    0,
      prSpeed: 0.008 + Math.random() * 0.01,
      prAmp:  15 + Math.random() * 30,

      // Couleur RGBA
      r_col: col[0],
      g_col: col[1],
      b_col: col[2],
      a_col: col[3] || 0.15,

      // Opacité animation
      opacity:      0,
      targetOpacity: 0.6 + Math.random() * 0.4,
      fadeSpeed:    0.003 + Math.random() * 0.005,
      fadingIn:     true,

      // Phase (pour que tous ne soient pas au même stade)
      phase: Math.random() * Math.PI * 2
    };
  },

  // ── Boucle animation ──
  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());
    this._draw();
  },

  // ── Dessiner ──
  _draw() {
    const ctx = this._ctx;
    const w   = this._w;
    const h   = this._h;
    const bg  = this._theme?.bg || [2,6,16];

    // ── Fond ──
    ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
    ctx.fillRect(0, 0, w, h);

    // ── Metaballs / blobs ──
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    this._blobs.forEach(b => {
      // Update position
      b.y  += b.vy;
      b.x  += b.vx;
      b.ox += b.oxSpeed;
      b.pr += b.prSpeed;

      // Oscillation latérale (mouvement lave)
      const xOff = Math.sin(b.ox + b.phase) * b.oxAmp;
      const rOff = Math.sin(b.pr)           * b.prAmp;

      const drawX = b.x + xOff;
      const drawY = b.y;
      const drawR = Math.max(10, b.r + rOff);

      // Fade in/out
      if (b.fadingIn) {
        b.opacity = Math.min(
          b.targetOpacity,
          b.opacity + b.fadeSpeed
        );
      } else {
        b.opacity = Math.max(0, b.opacity - b.fadeSpeed * 0.5);
      }

      // Reset quand sort en bas
      if (b.y - drawR > h) {
        b.y         = -drawR * 2;
        b.x         = Math.random() * w;
        b.opacity   = 0;
        b.fadingIn  = true;

        // Nouvelle couleur au reset
        const palette = this._theme?.colors
          || this.PALETTES['cyber-blue'].colors;
        const col = palette[
          Math.floor(Math.random() * palette.length)
        ];
        b.r_col = col[0];
        b.g_col = col[1];
        b.b_col = col[2];
        b.a_col = col[3] || 0.15;
      }

      // Fade out avant sortie
      if (b.y > h * 0.85) b.fadingIn = false;

      // Draw gradient radial
      const alpha = b.a_col * b.opacity;
      if (alpha <= 0) return;

      const grad = ctx.createRadialGradient(
        drawX, drawY, 0,
        drawX, drawY, drawR
      );

      grad.addColorStop(0,
        `rgba(${b.r_col},${b.g_col},${b.b_col},${alpha})`
      );
      grad.addColorStop(0.4,
        `rgba(${b.r_col},${b.g_col},${b.b_col},${alpha * 0.6})`
      );
      grad.addColorStop(1,
        `rgba(${b.r_col},${b.g_col},${b.b_col},0)`
      );

      ctx.beginPath();
      ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    ctx.restore();

    // ── Traînées verticales (filaments de lave) ──
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    this._blobs.forEach((b, i) => {
      if (i % 3 !== 0) return; // 1 blob sur 3

      const xOff   = Math.sin(b.ox + b.phase) * b.oxAmp;
      const drawX  = b.x + xOff;
      const alpha  = b.a_col * b.opacity * 0.3;
      if (alpha <= 0.01) return;

      const trailH = 80 + Math.random() * 40;
      const grad   = ctx.createLinearGradient(
        drawX, b.y - trailH,
        drawX, b.y
      );

      grad.addColorStop(0,
        `rgba(${b.r_col},${b.g_col},${b.b_col},0)`
      );
      grad.addColorStop(1,
        `rgba(${b.r_col},${b.g_col},${b.b_col},${alpha})`
      );

      ctx.beginPath();
      ctx.moveTo(drawX - 2, b.y - trailH);
      ctx.lineTo(drawX + 2, b.y - trailH);
      ctx.lineTo(drawX + 4, b.y);
      ctx.lineTo(drawX - 4, b.y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    });

    ctx.restore();

    // ── Overlay sombre pour contraste ──
    const overlay = ctx.createLinearGradient(0, 0, 0, h);
    overlay.addColorStop(0,   `rgba(${bg[0]},${bg[1]},${bg[2]},0.3)`);
    overlay.addColorStop(0.5, `rgba(${bg[0]},${bg[1]},${bg[2]},0.1)`);
    overlay.addColorStop(1,   `rgba(${bg[0]},${bg[1]},${bg[2]},0.4)`);
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, w, h);
  },

  // ── Pause (économie batterie) ──
  pause() {
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  },

  reprendre() {
    if (!this._raf) this._loop();
  },

  // ── Détruire ──
  destroy() {
    this.pause();
    this._blobs = [];
  }
};

window.LavaBackground = LavaBackground;
console.log('✅ Lava.js chargé');
