/* ============================================================
   PowerApp — Utils.js v5.0
   + Fix semainesDepuis() → retourne 0 possible
   + Fix storage.set() QuotaExceededError
   + Fix ajouterJours() date null
   + Fix timerRepos.jouerSon() fallback propre
   + getCarteNutrition() NOUVEAU
   ============================================================ */

'use strict';

const Utils = {

  // ════════════════════════════════════════════════════════
  // STORAGE — ✅ v5.0 QuotaExceededError géré
  // ════════════════════════════════════════════════════════
  storage: {

    get(cle, defaut = null) {
      try {
        const val = localStorage.getItem(cle);
        if (val === null) return defaut;
        return JSON.parse(val);
      } catch(e) { return defaut; }
    },

    set(cle, valeur) {
      try {
        localStorage.setItem(cle, JSON.stringify(valeur));
        return true;
      } catch(e) {
        // ✅ FIX v5.0 — QuotaExceededError
        if (e.name === 'QuotaExceededError'
            || e.code === 22
            || e.code === 1014) {
          console.warn('[Storage] Quota dépassé — nettoyage...');
          this._nettoyerAnciens();
          // Réessayer une fois
          try {
            localStorage.setItem(cle, JSON.stringify(valeur));
            return true;
          } catch(e2) {
            console.error('[Storage] Quota toujours dépassé:', cle);
            return false;
          }
        }
        console.warn('[Storage] Erreur set:', cle, e);
        return false;
      }
    },

    // ✅ NOUVEAU v5.0 — Nettoyer les anciennes entrées
    _nettoyerAnciens() {
      try {
        const hierDate = (() => {
          const d = new Date();
          d.setDate(d.getDate() - 30);
          return d.toISOString().split('T')[0];
        })();

        const aSupprimer = [];
        for (let i = 0; i < localStorage.length; i++) {
          const cle = localStorage.key(i);
          if (!cle?.startsWith('ft_')) continue;

          // Supprimer les caches et données vieilles
          if (cle.startsWith('ft_cache_')) {
            aSupprimer.push(cle);
            continue;
          }

          // Supprimer les données de séances > 30 jours
          if (cle.startsWith('ft_seance_')) {
            const parts = cle.split('_');
            const date  = parts[2]; // ft_seance_DATE_id
            if (date && date < hierDate) {
              aSupprimer.push(cle);
            }
          }
        }

        aSupprimer.forEach(c => {
          try { localStorage.removeItem(c); } catch(e) {}
        });

        console.log(
          `[Storage] ${aSupprimer.length} entrées nettoyées`
        );
      } catch(e) {}
    },

    remove(cle) {
      try {
        localStorage.removeItem(cle);
        return true;
      } catch(e) { return false; }
    },

    clear(prefixe = null) {
      try {
        if (!prefixe) {
          localStorage.clear();
          return true;
        }
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const cle = localStorage.key(i);
          if (cle?.startsWith(prefixe)) {
            localStorage.removeItem(cle);
          }
        }
        return true;
      } catch(e) {
        console.warn('[Storage] Erreur clear:', e);
        return false;
      }
    },

    existe(cle) {
      return localStorage.getItem(cle) !== null;
    },

    taille() {
      try {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const cle = localStorage.key(i);
          const val = localStorage.getItem(cle) || '';
          total += cle.length + val.length;
        }
        const ko = Math.round(total / 1024);
        return ko < 1024
          ? `${ko} Ko`
          : `${(ko / 1024).toFixed(1)} Mo`;
      } catch(e) { return '— Ko'; }
    },

    clesPar(prefixe) {
      const cles = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const cle = localStorage.key(i);
          if (cle?.startsWith(prefixe)) cles.push(cle);
        }
      } catch(e) {}
      return cles;
    },

    viderPar(prefixe) {
      this.clesPar(prefixe).forEach(c => {
        try { localStorage.removeItem(c); } catch(e) {}
      });
    }
  },

  // ════════════════════════════════════════════════════════
  // DATES — ✅ v5.0 ajouterJours null-safe
  // ════════════════════════════════════════════════════════
  aujourd_hui() {
    return new Date().toISOString().split('T')[0];
  },

  // ✅ FIX v5.0 — Protéger contre dateStr null/undefined
  ajouterJours(dateStr, n) {
    try {
      const src = dateStr || this.aujourd_hui();
      const d   = new Date(src + 'T00:00:00');
      d.setDate(d.getDate() + n);
      return d.toISOString().split('T')[0];
    } catch(e) {
      return this.aujourd_hui();
    }
  },

  diffJours(dateDebut, dateFin) {
    try {
      const d1 = new Date((dateDebut || this.aujourd_hui()) + 'T00:00:00');
      const d2 = new Date((dateFin   || this.aujourd_hui()) + 'T00:00:00');
      return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    } catch(e) { return 0; }
  },

  debutSemaine(dateStr) {
    try {
      const src  = dateStr || this.aujourd_hui();
      const d    = new Date(src + 'T00:00:00');
      const day  = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      return d.toISOString().split('T')[0];
    } catch(e) { return dateStr || this.aujourd_hui(); }
  },

  finSemaine(dateStr) {
    try {
      const debut = this.debutSemaine(dateStr);
      return this.ajouterJours(debut, 6);
    } catch(e) { return dateStr || this.aujourd_hui(); }
  },

  indexJourSemaine(dateStr) {
    try {
      const src = dateStr || this.aujourd_hui();
      const d   = new Date(src + 'T00:00:00');
      const day = d.getDay();
      return day === 0 ? 6 : day - 1;
    } catch(e) { return 0; }
  },

  heureActuelle() {
    return new Date().getHours();
  },

  // ✅ FIX v5.0 — semainesDepuis() retourne 0 si même semaine
  semainesDepuis(dateStr) {
    try {
      if (!dateStr) return 0;
      const diff = this.diffJours(dateStr, this.aujourd_hui());
      return Math.max(0, Math.floor(diff / 7));
    } catch(e) { return 0; }
  },

  formatDateCourt(dateStr) {
    if (!dateStr) return '';
    try {
      const d    = new Date(dateStr + 'T00:00:00');
      const mois = [
        'Jan','Fév','Mar','Avr','Mai','Jun',
        'Jul','Aoû','Sep','Oct','Nov','Déc'
      ];
      return `${d.getDate()} ${mois[d.getMonth()]}`;
    } catch(e) { return dateStr; }
  },

  formatDateLong(dateStr) {
    if (!dateStr) return '';
    try {
      const d     = new Date(dateStr + 'T00:00:00');
      const jours = [
        'Dimanche','Lundi','Mardi','Mercredi',
        'Jeudi','Vendredi','Samedi'
      ];
      const mois  = [
        'Janvier','Février','Mars','Avril',
        'Mai','Juin','Juillet','Août',
        'Septembre','Octobre','Novembre','Décembre'
      ];
      return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]}`;
    } catch(e) { return dateStr; }
  },

  formatDate(dateStr, format = 'court') {
    return format === 'long'
      ? this.formatDateLong(dateStr)
      : this.formatDateCourt(dateStr);
  },

  formatHeure(date = null) {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleTimeString('fr-FR', {
      hour:   '2-digit',
      minute: '2-digit'
    });
  },

  formatDateTime(dateStr) {
    if (!dateStr) return '';
    try {
      const d     = new Date(dateStr);
      const date  = this.formatDateCourt(
        d.toISOString().split('T')[0]
      );
      const heure = this.formatHeure(d);
      return `${date} à ${heure}`;
    } catch(e) { return dateStr; }
  },

  estAujourdhui(dateStr) {
    return dateStr === this.aujourd_hui();
  },

  estCetteSemaine(dateStr) {
    if (!dateStr) return false;
    const debut = this.debutSemaine(this.aujourd_hui());
    const fin   = this.finSemaine(this.aujourd_hui());
    return dateStr >= debut && dateStr <= fin;
  },

  // ════════════════════════════════════════════════════════
  // FORMATAGE
  // ════════════════════════════════════════════════════════
  formatVolume(kg) {
    if (!kg || isNaN(kg)) return '0kg';
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)}T`;
    return `${Math.round(kg)}kg`;
  },

  formatDuree(secondes) {
    if (!secondes || isNaN(secondes)) return '0min';
    const s   = Math.round(Math.abs(secondes));
    const h   = Math.floor(s / 3600);
    const m   = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return m > 0 ? `${h}h ${m}min` : `${h}h`;
    if (m > 0) return sec > 0 ? `${m}min ${sec}s` : `${m}min`;
    return `${sec}s`;
  },

  formatDureeMin(secondes) {
    if (!secondes || isNaN(secondes)) return '0:00';
    const s = Math.max(0, Math.round(secondes));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, '0')}`;
  },

  getFormate(secondes) {
    return this.formatDureeMin(secondes);
  },

  arrondir(val, decimales = 1) {
    const factor = Math.pow(10, decimales);
    return Math.round((val || 0) * factor) / factor;
  },

  random(liste) {
    if (!liste?.length) return null;
    return liste[Math.floor(Math.random() * liste.length)];
  },

  // ════════════════════════════════════════════════════════
  // TOAST
  // ════════════════════════════════════════════════════════
  toast(message, type = 'info', duree = 3000) {
    try {
      const container = document.getElementById('toast-container');
      if (!container) {
        console.log(`[Toast] ${type}: ${message}`);
        return;
      }

      const colors = {
        success: { bg:'var(--fd-mint)',     text:'#09092d' },
        error:   { bg:'var(--fd-coral)',    text:'#09092d' },
        warning: { bg:'#ffa500',            text:'#09092d' },
        info:    { bg:'var(--fd-indigo)',   text:'white'   },
        pr:      { bg:'var(--fd-lemon)',    text:'#09092d' },
        dark:    { bg:'var(--fd-midnight)', text:'white'   }
      };

      const c     = colors[type] || colors.info;
      const toast = document.createElement('div');
      toast.style.cssText = `
        background:${c.bg};
        color:${c.text};
        padding:10px 18px;
        border-radius:99px;
        font-size:.82rem;
        font-weight:700;
        max-width:100%;
        text-align:center;
        pointer-events:auto;
        box-shadow:0 4px 20px rgba(0,0,0,0.3);
        animation:toastIn .3s ease;
        cursor:pointer;
        word-break:break-word`;

      toast.textContent = message;
      toast.onclick     = () => toast.remove();
      container.appendChild(toast);

      setTimeout(() => {
        if (!toast.parentNode) return;
        toast.style.animation = 'toastOut .3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      }, duree);

    } catch(e) {
      console.log(`[Toast] ${message}`);
    }
  },

  // ════════════════════════════════════════════════════════
  // CONFIRM MODAL
  // ════════════════════════════════════════════════════════
  confirmer(titre, message) {
    return new Promise(resolve => {
      const old = document.getElementById('modal-confirmer');
      if (old) old.remove();

      const modal = document.createElement('div');
      modal.id    = 'modal-confirmer';
      modal.style.cssText = `
        position:fixed;inset:0;z-index:99999;
        display:flex;align-items:center;
        justify-content:center;
        background:rgba(0,0,0,0.75);
        backdrop-filter:blur(4px);
        padding:20px`;

      modal.innerHTML = `
        <div style="background:var(--bg-card);
                    border:1px solid var(--border-color);
                    border-radius:var(--radius-xl);
                    padding:28px 24px;
                    width:100%;max-width:340px;
                    text-align:center;
                    box-shadow:0 20px 60px rgba(0,0,0,0.5)">
          <div style="font-size:1.2rem;font-weight:800;
                      margin-bottom:8px">${titre}</div>
          <div style="font-size:.85rem;color:var(--text-muted);
                      margin-bottom:24px;line-height:1.5">
            ${message}
          </div>
          <div style="display:grid;
                      grid-template-columns:1fr 1fr;gap:10px">
            <button id="confirmer-non"
                    style="padding:14px;
                           background:var(--bg-input);
                           border:1px solid var(--border-color);
                           border-radius:var(--radius-lg);
                           color:var(--text-primary);
                           font-size:.9rem;font-weight:700;
                           cursor:pointer">
              Annuler
            </button>
            <button id="confirmer-oui"
                    style="padding:14px;
                           background:var(--fd-indigo);
                           border:none;
                           border-radius:var(--radius-lg);
                           color:white;
                           font-size:.9rem;font-weight:700;
                           cursor:pointer;
                           box-shadow:0 4px 16px
                             rgba(75,75,249,0.4)">
              Confirmer
            </button>
          </div>
        </div>`;

      document.body.appendChild(modal);

      document.getElementById('confirmer-oui')
        .addEventListener('click', () => {
          modal.remove(); resolve(true);
        });

      document.getElementById('confirmer-non')
        .addEventListener('click', () => {
          modal.remove(); resolve(false);
        });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove(); resolve(false);
        }
      });

      const onEscape = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          resolve(false);
          document.removeEventListener('keydown', onEscape);
        }
      };
      document.addEventListener('keydown', onEscape);
    });
  },

  // ════════════════════════════════════════════════════════
  // VIBRATION
  // ════════════════════════════════════════════════════════
  vibrer(pattern = [200]) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch(e) {}
  },

  vibrerSuccess() { this.vibrer([100, 50, 100]);           },
  vibrerPR()      { this.vibrer([200, 100, 200, 100, 400]); },
  vibrerErreur()  { this.vibrer([300, 100, 300]);           },

  // ════════════════════════════════════════════════════════
  // NOTIFICATIONS PWA
  // ════════════════════════════════════════════════════════
  notifications: {

    async demanderPermission() {
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'granted') return true;
      if (Notification.permission === 'denied')  return false;
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    },

    estAutorisee() {
      return 'Notification' in window
        && Notification.permission === 'granted';
    },

    async envoyer(titre, options = {}) {
      const ok = await this.demanderPermission();
      if (!ok) return false;
      try {
        const notif = new Notification(titre, {
          body:    options.body    || '',
          icon:    options.icon    || '/icons/icon-192.png',
          badge:   options.badge   || '/icons/badge.png',
          tag:     options.tag     || 'powerapp',
          silent:  options.silent  || false,
          vibrate: options.vibrate || [200, 100, 200],
          data:    options.data    || {}
        });
        if (options.duree) {
          setTimeout(() => notif.close(), options.duree);
        }
        return true;
      } catch(e) {
        console.warn('[Notif]', e);
        return false;
      }
    },

    async rappelSeance(nom, seance) {
      return this.envoyer(
        `💪 C'est l'heure ${nom} !`,
        { body:`Séance ${seance} t'attend. Let's go ! 🔥`,
          tag:'rappel-seance', duree:10000 }
      );
    },

    async prBattu(exercice, poids, reps) {
      return this.envoyer(
        `🏆 NOUVEAU RECORD !`,
        { body:`${exercice} : ${poids}kg × ${reps} reps ! 🎉`,
          tag:'pr', duree:8000 }
      );
    },

    async streakEnDanger(jours) {
      return this.envoyer(
        `⚠️ Ton streak est en danger !`,
        { body:`Plus que quelques heures pour maintenir ton streak de ${jours} jours 🔥`,
          tag:'streak', duree:15000 }
      );
    },

    async rappelHydratation() {
      return this.envoyer(
        `💧 N'oublie pas de t'hydrater !`,
        { body:`Bois un verre d'eau maintenant. Ton corps te remerciera 💪`,
          tag:'eau', duree:5000 }
      );
    },

    async prProche(exercice, pct) {
      return this.envoyer(
        `🎯 PR en vue sur ${exercice} !`,
        { body:`Tu es à ${pct}% de ton record. Pousse fort ! 💥`,
          tag:'pr-proche', duree:8000 }
      );
    },

    programmer(titre, options, delaiMs) {
      setTimeout(() => { this.envoyer(titre, options); }, delaiMs);
    },

    programmerRappelQuotidien(heure = 18, minute = 0) {
      const maintenant = new Date();
      const cible      = new Date();
      cible.setHours(heure, minute, 0, 0);
      if (cible <= maintenant) cible.setDate(cible.getDate() + 1);
      const delai = cible - maintenant;
      setTimeout(() => {
        this.envoyer(
          `💪 PowerApp - Séance du soir !`,
          { body:`C'est l'heure de ton entraînement 🔥`,
            tag:'rappel-quotidien' }
        );
      }, delai);
    }
  },

  // ════════════════════════════════════════════════════════
  // CONFETTI
  // ════════════════════════════════════════════════════════
  confetti(duree = 3000) {
    try {
      const canvas = document.getElementById('confetti-canvas');
      if (!canvas) return;

      const ctx    = canvas.getContext('2d');
      const resize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();

      const resizeObs = new ResizeObserver(resize);
      resizeObs.observe(document.body);

      const particles = [];
      const colors    = [
        '#4b4bf9','#f9ef77','#8bf0bb',
        '#ff8d96','#bfa1ff','#ffffff'
      ];

      for (let i = 0; i < 120; i++) {
        particles.push({
          x:       Math.random() * canvas.width,
          y:       -Math.random() * canvas.height * 0.5,
          w:       Math.random() * 10 + 5,
          h:       Math.random() * 6 + 3,
          color:   colors[Math.floor(Math.random()*colors.length)],
          vx:      (Math.random() - 0.5) * 4,
          vy:      Math.random() * 4 + 2,
          rot:     Math.random() * 360,
          vrot:    (Math.random() - 0.5) * 8,
          opacity: 1
        });
      }

      const debut = Date.now();

      const animer = () => {
        const elapsed = Date.now() - debut;
        if (elapsed > duree) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          resizeObs.disconnect();
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          p.x   += p.vx;
          p.y   += p.vy;
          p.rot += p.vrot;
          p.vy  += 0.1;

          if (elapsed > duree * 0.8) {
            p.opacity = Math.max(0,
              1 - (elapsed - duree*0.8) / (duree*0.2)
            );
          }

          if (p.y > canvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x + p.w/2, p.y + p.h/2);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
          ctx.restore();
        });

        requestAnimationFrame(animer);
      };

      animer();
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // EXPORT / IMPORT
  // ════════════════════════════════════════════════════════
  exporterJSON(prefixe = 'ft_') {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (prefixe && !cle?.startsWith(prefixe)) continue;
        try {
          data[cle] = JSON.parse(localStorage.getItem(cle));
        } catch(e) {
          data[cle] = localStorage.getItem(cle);
        }
      }

      const export_data = {
        version:   '5.0',
        app:       'PowerApp',
        date:      this.aujourd_hui(),
        timestamp: Date.now(),
        donnees:   data
      };

      const blob = new Blob(
        [JSON.stringify(export_data, null, 2)],
        { type:'application/json' }
      );
      const link    = document.createElement('a');
      link.download = `powerapp-backup-${this.aujourd_hui()}.json`;
      link.href     = URL.createObjectURL(blob);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      this.toast('📤 Données exportées !', 'success');
    } catch(e) {
      console.error('[Utils] Erreur export:', e);
      this.toast('❌ Erreur export', 'error');
    }
  },

  async importerJSON(fichier = null) {
    try {
      if (!fichier) {
        return new Promise((resolve) => {
          const input    = document.createElement('input');
          input.type     = 'file';
          input.accept   = '.json';
          input.onchange = async (e) => {
            const f = e.target.files?.[0];
            if (f) {
              await this._traiterImport(f);
              resolve(true);
            } else {
              resolve(false);
            }
          };
          input.click();
        });
      } else {
        await this._traiterImport(fichier);
      }
    } catch(e) {
      console.error('[Utils] Erreur import:', e);
      this.toast('❌ Erreur import', 'error');
    }
  },

  async _traiterImport(fichier) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const raw  = JSON.parse(e.target.result);
          const data = raw.donnees || raw;

          if (!data || typeof data !== 'object') {
            throw new Error('Format invalide');
          }

          const nb = Object.keys(data).length;
          const ok = await this.confirmer(
            '📥 Importer les données ?',
            `${nb} entrées trouvées. Tes données actuelles seront remplacées.`
          );

          if (!ok) { resolve(false); return; }

          let imported = 0;
          Object.entries(data).forEach(([cle, val]) => {
            try {
              localStorage.setItem(cle, JSON.stringify(val));
              imported++;
            } catch(e) {}
          });

          this.toast(
            `✅ ${imported} données importées !`,
            'success', 4000
          );
          setTimeout(() => window.location.reload(), 1500);
          resolve(true);

        } catch(err) {
          this.toast('❌ Fichier invalide', 'error');
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(fichier);
    });
  },

  // ════════════════════════════════════════════════════════
  // GRAPHIQUES Canvas
  // ════════════════════════════════════════════════════════
  graphiques: {

    COULEURS: {
      indigo:   '#4b4bf9',
      mint:     '#8bf0bb',
      lemon:    '#f9ef77',
      coral:    '#ff8d96',
      lavender: '#bfa1ff',
      muted:    'rgba(255,255,255,0.15)'
    },

    barres(canvas, labels, valeurs, options = {}) {
      if (!canvas || !labels?.length) return;
      const ctx  = canvas.getContext('2d');
      const W    = canvas.offsetWidth  || canvas.width  || 300;
      const H    = canvas.offsetHeight || canvas.height || 140;
      canvas.width  = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);
      if (!valeurs?.length) return;

      const color  = options.color  || this.COULEURS.indigo;
      const color2 = options.color2 || null;
      const padL   = 8, padR = 8, padT = 20, padB = 24;
      const max    = Math.max(...valeurs, 1);
      const n      = valeurs.length;
      const barW   = Math.floor(
        (W - padL - padR - (n-1)*4) / n
      );
      const chartH = H - padT - padB;

      valeurs.forEach((val, i) => {
        const x   = padL + i * (barW + 4);
        const pct = val / max;
        const bH  = Math.max(2, Math.round(pct * chartH));
        const y   = padT + chartH - bH;

        if (color2) {
          const grad = ctx.createLinearGradient(x, y, x, y + bH);
          grad.addColorStop(0, color);
          grad.addColorStop(1, color2);
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = color;
        }

        this._roundRect(ctx, x, y, barW, bH, 4);
        ctx.fill();

        if (val > 0 && barW >= 20) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font      = '10px system-ui';
          ctx.textAlign = 'center';
          const label   = val >= 1000
            ? `${(val/1000).toFixed(1)}T` : `${val}`;
          ctx.fillText(label, x + barW/2, y - 4);
        }

        if (labels[i]) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.font      = '10px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(labels[i], x + barW/2, H - padB + 14);
        }
      });
    },

    ligne(canvas, labels, series, options = {}) {
      if (!canvas || !labels?.length) return;
      const ctx  = canvas.getContext('2d');
      const W    = canvas.offsetWidth  || canvas.width  || 300;
      const H    = canvas.offsetHeight || canvas.height || 140;
      canvas.width  = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);
      if (!series?.length) return;

      const padL = 40, padR = 12, padT = 16, padB = 24;
      const chartW = W - padL - padR;
      const chartH = H - padT - padB;
      const n      = labels.length;

      const toutesValeurs = series.flatMap(s => s.valeurs || []);
      const max   = Math.max(...toutesValeurs, 1);
      const min   = Math.min(...toutesValeurs, 0);
      const range = Math.max(max - min, 1);

      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth   = 1;
      [0, 0.25, 0.5, 0.75, 1].forEach(pct => {
        const y = padT + chartH - pct * chartH;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();
      });

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font      = '10px system-ui';
      ctx.textAlign = 'right';
      [0, 0.5, 1].forEach(pct => {
        const val = Math.round(min + pct * range);
        const y   = padT + chartH - pct * chartH;
        const lbl = val >= 1000
          ? `${(val/1000).toFixed(1)}T` : `${val}`;
        ctx.fillText(lbl, padL - 4, y + 4);
      });

      const defaultColors = [
        this.COULEURS.indigo, this.COULEURS.mint,
        this.COULEURS.lemon,  this.COULEURS.coral
      ];

      series.forEach((serie, si) => {
        const valeurs = serie.valeurs || [];
        if (!valeurs.length) return;

        const color  = serie.color || defaultColors[si % 4];
        const points = valeurs.map((v, i) => ({
          x: padL + (i / Math.max(n-1, 1)) * chartW,
          y: padT + chartH - ((v-min)/range) * chartH
        }));

        if (options.fill !== false) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, padT + chartH);
          points.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(points[points.length-1].x, padT + chartH);
          ctx.closePath();
          const grad = ctx.createLinearGradient(
            0, padT, 0, padT + chartH
          );
          grad.addColorStop(0, color + '40');
          grad.addColorStop(1, color + '00');
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth   = 2.5;
        ctx.lineJoin    = 'round';
        ctx.lineCap     = 'round';

        points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else {
            const prev = points[i-1];
            const cpx  = (prev.x + p.x) / 2;
            ctx.bezierCurveTo(
              cpx, prev.y, cpx, p.y, p.x, p.y
            );
          }
        });
        ctx.stroke();

        points.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          if (i === points.length - 1 || options.showValues) {
            ctx.fillStyle = color;
            ctx.font      = '10px system-ui';
            ctx.textAlign = 'center';
            const v   = valeurs[i];
            const lbl = v >= 1000
              ? `${(v/1000).toFixed(1)}T` : `${v}`;
            ctx.fillText(lbl, p.x, p.y - 8);
          }
        });
      });

      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font      = '10px system-ui';
      ctx.textAlign = 'center';
      labels.forEach((l, i) => {
        const x = padL + (i / Math.max(n-1, 1)) * chartW;
        ctx.fillText(l, x, H - padB + 14);
      });
    },

    donut(canvas, segments, options = {}) {
      if (!canvas || !segments?.length) return;
      const ctx  = canvas.getContext('2d');
      const W    = canvas.offsetWidth  || canvas.width  || 200;
      const H    = canvas.offsetHeight || canvas.height || 200;
      canvas.width  = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      const cx        = W / 2;
      const cy        = H / 2;
      const rayon     = Math.min(W, H) / 2 - 20;
      const epaisseur = options.epaisseur || 28;
      const total     = segments.reduce((a,s) => a+s.val, 0);
      if (total === 0) return;

      let angle = -Math.PI / 2;
      segments.forEach(seg => {
        const sweep = (seg.val / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, rayon, angle, angle + sweep);
        ctx.arc(
          cx, cy, rayon - epaisseur,
          angle + sweep, angle, true
        );
        ctx.closePath();
        ctx.fillStyle = seg.color || '#4b4bf9';
        ctx.fill();
        angle += sweep + 0.02;
      });

      if (options.centre) {
        ctx.fillStyle    = options.centre.color || '#ffffff';
        ctx.font = `bold ${options.centre.size||22}px system-ui`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(options.centre.texte, cx, cy);
        ctx.textBaseline = 'alphabetic';
      }
    },

    radar(canvas, labels, valeurs, options = {}) {
      if (!canvas || !labels?.length) return;
      const ctx  = canvas.getContext('2d');
      const W    = canvas.offsetWidth  || canvas.width  || 240;
      const H    = canvas.offsetHeight || canvas.height || 240;
      canvas.width  = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      const cx    = W / 2;
      const cy    = H / 2;
      const r     = Math.min(W, H) / 2 - 30;
      const n     = labels.length;
      const max   = options.max || Math.max(...valeurs, 1);
      const color = options.color || '#4b4bf9';

      [0.25, 0.5, 0.75, 1].forEach(pct => {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth   = 1;
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * r * pct;
          const y = cy + Math.sin(angle) * r * pct;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      });

      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(angle) * r,
          cy + Math.sin(angle) * r
        );
        ctx.stroke();

        const lx = cx + Math.cos(angle) * (r + 18);
        const ly = cy + Math.sin(angle) * (r + 18);
        ctx.fillStyle    = 'rgba(255,255,255,0.5)';
        ctx.font         = '11px system-ui';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i], lx, ly);
      }

      ctx.beginPath();
      valeurs.forEach((val, i) => {
        const pct   = Math.min(val / max, 1);
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * r * pct;
        const y = cy + Math.sin(angle) * r * pct;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle   = color + '33';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2;
      ctx.stroke();

      valeurs.forEach((val, i) => {
        const pct   = Math.min(val / max, 1);
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * r * pct;
        const y = cy + Math.sin(angle) * r * pct;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      ctx.textBaseline = 'alphabetic';
    },

    _roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x+r, y);
      ctx.lineTo(x+w-r, y);
      ctx.quadraticCurveTo(x+w, y, x+w, y+r);
      ctx.lineTo(x+w, y+h-r);
      ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
      ctx.lineTo(x+r, y+h);
      ctx.quadraticCurveTo(x, y+h, x, y+h-r);
      ctx.lineTo(x, y+r);
      ctx.quadraticCurveTo(x, y, x+r, y);
      ctx.closePath();
    }
  },

  // ════════════════════════════════════════════════════════
  // DEBOUNCE / THROTTLE
  // ════════════════════════════════════════════════════════
  debounce(fn, delai = 300) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delai);
    };
  },

  throttle(fn, delai = 300) {
    let dernierAppel = 0;
    return function(...args) {
      const now = Date.now();
      if (now - dernierAppel >= delai) {
        dernierAppel = now;
        fn.apply(this, args);
      }
    };
  },

  // ════════════════════════════════════════════════════════
  // FORMULES FITNESS
  // ════════════════════════════════════════════════════════
  calculer1RM(poids, reps) {
    if (!poids || !reps) return 0;
    if (reps === 1) return poids;
    return Math.round(poids * (1 + reps / 30));
  },

  calculerIMC(poids, taille) {
    if (!poids || !taille) return null;
    const t = taille / 100;
    return this.arrondir(poids / (t * t));
  },

  categorieIMC(imc) {
    if (!imc) return '—';
    if (imc < 18.5) return 'Insuffisance pondérale';
    if (imc < 25)   return 'Poids normal';
    if (imc < 30)   return 'Surpoids';
    return 'Obésité';
  },

  calculerCalories(poids, taille, age, sexe = 'H') {
    if (!poids || !taille) return 2000;
    const a = age || 25;
    if (sexe === 'H') {
      return Math.round(
        88.362 + (13.397 * poids)
        + (4.799 * taille) - (5.677 * a)
      );
    }
    return Math.round(
      447.593 + (9.247 * poids)
      + (3.098 * taille) - (4.330 * a)
    );
  },

  calculerProteines(poids, objectif = 'force') {
    const ratio = {
      force:       2.2,
      prise_masse: 2.0,
      seche:       2.5,
      endurance:   1.6,
      forme:       1.8
    };
    return Math.round(poids * (ratio[objectif] || 1.8));
  },

  // ════════════════════════════════════════════════════════
  // DIVERS
  // ════════════════════════════════════════════════════════
  genId(prefixe = 'id') {
    return `${prefixe}_${Date.now()}_${
      Math.random().toString(36).substring(2, 8)
    }`;
  },

  tronquer(texte, max = 50) {
    if (!texte) return '';
    if (texte.length <= max) return texte;
    return texte.substring(0, max) + '...';
  },

  capitaliser(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  clone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch(e) { return obj; }
  },

  estMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);
  },

  estPWA() {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
  },

  async copier(texte) {
    try {
      await navigator.clipboard.writeText(texte);
      this.toast('📋 Copié !', 'success', 1500);
      return true;
    } catch(e) {
      const el          = document.createElement('textarea');
      el.value          = texte;
      el.style.position = 'fixed';
      el.style.opacity  = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
      this.toast('📋 Copié !', 'success', 1500);
      return true;
    }
  },

  formatNombre(n) {
    if (!n || isNaN(n)) return '0';
    return Number(n).toLocaleString('fr-FR');
  },

  pct(valeur, total) {
    if (!total) return 0;
    return Math.round((valeur / total) * 100);
  },

  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  scrollToTop(smooth = true) {
    try {
      const main = document.querySelector('.main-content')
        || document.getElementById('app-content')
        || window;
      if (main === window) {
        window.scrollTo({ top:0, behavior: smooth ? 'smooth' : 'auto' });
      } else {
        main.scrollTo({ top:0, behavior: smooth ? 'smooth' : 'auto' });
      }
    } catch(e) { window.scrollTo(0, 0); }
  },

  // ════════════════════════════════════════════════════════
  // PWA INSTALL
  // ════════════════════════════════════════════════════════
  pwa: {
    _promptInstall: null,

    init() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this._promptInstall = e;
        console.log('[PWA] Install prompt intercepted');
      });
    },

    peutInstaller() { return !!this._promptInstall; },

    async installer() {
      if (!this._promptInstall) return false;
      this._promptInstall.prompt();
      const result = await this._promptInstall.userChoice;
      this._promptInstall = null;
      return result.outcome === 'accepted';
    }
  }
};

// ════════════════════════════════════════════════════════════
// TIMER REPOS — ✅ v5.0 jouerSon fallback propre
// ════════════════════════════════════════════════════════════
const timerRepos = {
  _interval: null,
  _restant:  0,
  _actif:    false,
  _onTick:   null,
  _onFin:    null,

  demarrer(secondes, onTick = null, onFin = null) {
    this.arreter();
    this._restant = secondes;
    this._actif   = true;
    this._onTick  = onTick;
    this._onFin   = onFin;
    this._afficherTimer(secondes);

    this._interval = setInterval(() => {
      this._restant--;

      if (this._onTick) {
        try { this._onTick(this._restant); } catch(e) {}
      }

      if (this._restant === 3) this.jouerSon('beep');

      this._mettreAJourTimer(this._restant);

      if (this._restant <= 0) {
        this.arreter();
        this.jouerSon('rest');
        Utils.vibrer([300, 100, 300]);
        this._cacherTimer();
        if (this._onFin) {
          try { this._onFin(); } catch(e) {}
        }
      }
    }, 1000);
  },

  arreter() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    this._actif   = false;
    this._restant = 0;
    this._cacherTimer();
  },

  _afficherTimer(secondes) {
    let el = document.getElementById('timer-repos-overlay');
    if (!el) {
      el    = document.createElement('div');
      el.id = 'timer-repos-overlay';
      el.style.cssText = `
        position:fixed;
        bottom:calc(var(--nav-height,60px) + 16px);
        right:16px;z-index:900;
        background:var(--fd-indigo);color:white;
        padding:12px 20px;
        border-radius:var(--radius-full,99px);
        font-size:1.1rem;font-weight:800;
        box-shadow:0 4px 20px rgba(75,75,249,0.5);
        display:flex;align-items:center;gap:8px;
        cursor:pointer;
        animation:bounceIn .3s ease;
        font-variant-numeric:tabular-nums`;
      el.onclick = () => this.arreter();
      document.body.appendChild(el);
    }
    el.innerHTML = `
      💤 <span id="timer-display">
        ${Utils.formatDureeMin(secondes)}
      </span>`;
  },

  _mettreAJourTimer(secondes) {
    const el = document.getElementById('timer-display');
    if (el) el.textContent = Utils.formatDureeMin(secondes);
  },

  _cacherTimer() {
    const el = document.getElementById('timer-repos-overlay');
    if (el) {
      el.style.transition = 'opacity .3s';
      el.style.opacity    = '0';
      setTimeout(() => el.remove(), 300);
    }
  },

  // ✅ FIX v5.0 — jouerSon() fallback propre
  jouerSon(type = 'beep') {
    try {
      // ✅ Vérifier config son
      const config = Utils.storage.get('ft_notifs_config', {});
      if (config.son === false) return;

      // ✅ Priorité 1 — Module Sounds.js
      if (window.Sounds?.jouer) {
        window.Sounds.jouer(type);
        return;
      }

      // ✅ Priorité 2 — Synthèse audio directe
      // (plus fiable que les fichiers mp3 qui peuvent manquer)
      this._jouerSonSynth(type);

    } catch(e) {}
  },

  _jouerSonSynth(type) {
    try {
      const AudioCtx = window.AudioContext
        || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx  = new AudioCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const configs = {
        beep:  { freq:880,  dur:.12, type:'sine',     vol:.3  },
        pr:    { freq:523,  dur:.5,  type:'triangle', vol:.4  },
        rest:  { freq:440,  dur:.25, type:'sine',     vol:.35 },
        go:    { freq:660,  dur:.15, type:'sine',     vol:.3  },
        bip:   { freq:880,  dur:.08, type:'sine',     vol:.25 },
        trophee:{ freq:784, dur:.6,  type:'triangle', vol:.4  },
        levelup:{ freq:523, dur:.8,  type:'triangle', vol:.5  }
      };

      const cfg = configs[type] || configs.beep;

      osc.frequency.setValueAtTime(cfg.freq, ctx.currentTime);
      osc.type = cfg.type;

      gain.gain.setValueAtTime(cfg.vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001, ctx.currentTime + cfg.dur
      );

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + cfg.dur);

      // ✅ Fermer le contexte après lecture
      setTimeout(() => {
        try { ctx.close(); } catch(e) {}
      }, (cfg.dur + 0.1) * 1000);

    } catch(e) {
      console.warn('[timerRepos] Son indisponible:', e);
    }
  }
};

// ════════════════════════════════════════════════════════════
// CSS ANIMATIONS
// ════════════════════════════════════════════════════════════
(function _injecterAnimations() {
  const css = `
    @keyframes toastIn {
      from { opacity:0; transform:translateY(10px) scale(.95) }
      to   { opacity:1; transform:translateY(0)    scale(1)   }
    }
    @keyframes toastOut {
      from { opacity:1; transform:scale(1)  }
      to   { opacity:0; transform:scale(.9) }
    }
    @keyframes spin {
      from { transform:rotate(0deg)   }
      to   { transform:rotate(360deg) }
    }
    @keyframes fadeIn {
      from { opacity:0 }
      to   { opacity:1 }
    }
    @keyframes fadeOut {
      from { opacity:1 }
      to   { opacity:0 }
    }
    @keyframes bounceIn {
      0%   { transform:scale(0);   opacity:0 }
      70%  { transform:scale(1.1)            }
      100% { transform:scale(1);   opacity:1 }
    }
    @keyframes pulse {
      0%,100% { opacity:1  }
      50%     { opacity:.5 }
    }
    @keyframes slideUp {
      from { transform:translateY(20px);  opacity:0 }
      to   { transform:translateY(0);     opacity:1 }
    }
    @keyframes slideDown {
      from { transform:translateY(-20px); opacity:0 }
      to   { transform:translateY(0);     opacity:1 }
    }
    @keyframes splashLoad {
      0%   { width:0%   }
      80%  { width:90%  }
      100% { width:100% }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center }
      100% { background-position:  200% center }
    }
    @keyframes zoomIn {
      from { transform:scale(.8); opacity:0 }
      to   { transform:scale(1);  opacity:1 }
    }
    @keyframes floatUp {
      0%   { transform:translateY(0)    }
      50%  { transform:translateY(-8px) }
      100% { transform:translateY(0)    }
    }
  `;
  const style       = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

// ✅ Init PWA install listener
Utils.pwa.init();

window.Utils      = Utils;
window.timerRepos = timerRepos;

console.log('✅ Utils.js v5.0 chargé — Storage QuotaExceeded + semainesDepuis fix + jouerSon synth');
