/* ============================================================
   PowerApp — Voice Commands v1.0
   🎙️ Commandes vocales mains libres pendant la séance
   ============================================================ */

'use strict';

const Voice = {

  // ════════════════════════════════════════════════════════
  // CONFIG
  // ════════════════════════════════════════════════════════
  _actif:        false,
  _recognition:  null,
  _timeout:      null,
  _dernierCmd:   null,
  _listening:    false,
  _wakeLock:     null,
  _langue:       'fr-FR',

  // ════════════════════════════════════════════════════════
  // COMMANDES DISPONIBLES
  // ════════════════════════════════════════════════════════
  COMMANDES: [
    // ── Série validée ──
    {
      patterns: [
        'série faite', 'serie faite', 'valider', 'validé',
        'fait', 'terminé', 'fini', 'done', 'ok c\'est bon',
        'c\'est bon', 'enregistrer', 'next', 'suivant'
      ],
      action: 'VALIDER_SERIE',
      emoji:  '✅',
      desc:   '"Série faite" ou "Valider"'
    },

    // ── Timer repos ──
    {
      patterns: [
        'timer', 'repos', 'pause', 'chrono',
        'démarrer repos', 'lance le timer',
        'go repos', 'start timer'
      ],
      action: 'TIMER_REPOS',
      emoji:  '⏱️',
      desc:   '"Repos" ou "Timer"'
    },

    // ── Poids vocal ──
    {
      patterns: [
        'poids (?<kg>[0-9]+(?:[,.][0-9]+)?)',
        '(?<kg>[0-9]+(?:[,.][0-9]+)?) kilos',
        '(?<kg>[0-9]+(?:[,.][0-9]+)?) kilo',
        '(?<kg>[0-9]+(?:[,.][0-9]+)?) kg'
      ],
      action: 'SET_POIDS',
      emoji:  '🏋️',
      desc:   '"80 kg" ou "Poids 80"',
      regex:  true
    },

    // ── Reps vocal ──
    {
      patterns: [
        'reps (?<n>[0-9]+)',
        '(?<n>[0-9]+) reps',
        '(?<n>[0-9]+) répétitions',
        'répétitions (?<n>[0-9]+)'
      ],
      action: 'SET_REPS',
      emoji:  '🔁',
      desc:   '"12 reps" ou "Reps 12"',
      regex:  true
    },

    // ── RPE vocal ──
    {
      patterns: [
        'rpe (?<n>[0-9]+)',
        'effort (?<n>[0-9]+)',
        'ressenti (?<n>[0-9]+)'
      ],
      action: 'SET_RPE',
      emoji:  '😤',
      desc:   '"RPE 8"',
      regex:  true
    },

    // ── Navigation ──
    {
      patterns: [
        'exercice suivant', 'prochain exercice',
        'next exercice', 'suivant'
      ],
      action: 'NEXT_EXERCICE',
      emoji:  '➡️',
      desc:   '"Exercice suivant"'
    },
    {
      patterns: [
        'exercice précédent', 'retour', 'précédent'
      ],
      action: 'PREV_EXERCICE',
      emoji:  '⬅️',
      desc:   '"Exercice précédent"'
    },

    // ── Terminer séance ──
    {
      patterns: [
        'terminer la séance', 'fin de séance',
        'séance terminée', 'stop séance',
        'arrêter la séance'
      ],
      action: 'TERMINER_SEANCE',
      emoji:  '🏁',
      desc:   '"Terminer la séance"'
    },

    // ── Ajouter poids ──
    {
      patterns: [
        'plus (?<n>[0-9]+(?:[,.][0-9]+)?)',
        'augmenter (?<n>[0-9]+(?:[,.][0-9]+)?)',
        'plus deux virgule cinq',
        'plus cinq'
      ],
      action: 'AJOUTER_POIDS',
      emoji:  '📈',
      desc:   '"Plus 2.5" ou "Plus 5"',
      regex:  true
    },
    {
      patterns: [
        'moins (?<n>[0-9]+(?:[,.][0-9]+)?)',
        'diminuer (?<n>[0-9]+(?:[,.][0-9]+)?)',
        'moins deux virgule cinq',
        'moins cinq'
      ],
      action: 'RETIRER_POIDS',
      emoji:  '📉',
      desc:   '"Moins 2.5" ou "Moins 5"',
      regex:  true
    },

    // ── Aide ──
    {
      patterns: [
        'aide', 'help', 'commandes',
        'qu\'est-ce que je peux dire',
        'que puis-je dire'
      ],
      action: 'AIDE',
      emoji:  '❓',
      desc:   '"Aide" ou "Commandes"'
    },

    // ── Annuler ──
    {
      patterns: [
        'annuler', 'cancel', 'stop', 'arrêter',
        'désactiver la voix', 'couper le micro'
      ],
      action: 'STOP_VOICE',
      emoji:  '🔇',
      desc:   '"Stop" ou "Annuler"'
    }
  ],

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  estSupporte() {
    return 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window;
  },

  init() {
    if (!this.estSupporte()) {
      console.warn('[Voice] Non supporté sur ce navigateur');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition
      || window.webkitSpeechRecognition;

    this._recognition = new SpeechRecognition();
    this._recognition.lang            = this._langue;
    this._recognition.continuous      = true;
    this._recognition.interimResults  = false;
    this._recognition.maxAlternatives = 3;

    // ✅ Résultat vocal
    this._recognition.onresult = (event) => {
      const results  = event.results;
      const dernier  = results[results.length - 1];

      if (!dernier.isFinal) return;

      // Essayer toutes les alternatives
      for (let i = 0; i < dernier.length; i++) {
        const transcript = dernier[i].transcript
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        console.log(`[Voice] Transcription (${i}):`, transcript);

        if (this._traiter(transcript)) break;
      }
    };

    // ✅ Erreur → relancer si toujours actif
    this._recognition.onerror = (event) => {
      console.warn('[Voice] Erreur:', event.error);

      if (event.error === 'not-allowed') {
        Utils.toast('❌ Micro non autorisé', 'error', 3000);
        this.arreter();
        return;
      }

      if (event.error === 'no-speech' && this._actif) {
        // Pas grave — relancer
        this._relancer();
      }
    };

    // ✅ Fin → relancer si toujours actif
    this._recognition.onend = () => {
      this._listening = false;
      if (this._actif) {
        setTimeout(() => this._relancer(), 300);
      }
    };

    this._recognition.onstart = () => {
      this._listening = true;
      this._mettreAJourUI();
    };

    console.log('[Voice] Initialisé ✅');
    return true;
  },

  // ════════════════════════════════════════════════════════
  // DÉMARRER / ARRÊTER
  // ════════════════════════════════════════════════════════
  async demarrer() {
    if (this._actif) return;

    // ✅ Vérifier support
    if (!this.estSupporte()) {
      Utils.toast(
        '❌ Commandes vocales non supportées sur ce navigateur',
        'error', 3000
      );
      return false;
    }

    // ✅ Init si pas encore fait
    if (!this._recognition) {
      const ok = this.init();
      if (!ok) return false;
    }

    this._actif = true;

    try {
      this._recognition.start();
    } catch(e) {
      // Déjà démarré
    }

    // ✅ UI
    this._mettreAJourUI();
    this._afficherBulle();

    Utils.toast(
      '🎙️ Commandes vocales activées ! Dis "Aide" pour la liste.',
      'success', 3000
    );
    Utils.vibrer([50, 30, 50]);

    // ✅ Annonce vocale
    try {
      SeanceGuidee.parler(
        'Commandes vocales activées. Dis série faite pour valider.',
        true
      );
    } catch(e) {}

    return true;
  },

  arreter() {
    this._actif    = false;
    this._listening = false;

    try { this._recognition?.stop(); } catch(e) {}
    clearTimeout(this._timeout);

    this._mettreAJourUI();
    this._masquerBulle();

    Utils.toast('🔇 Commandes vocales désactivées', 'info', 1500);
  },

  toggle() {
    if (this._actif) this.arreter();
    else             this.demarrer();
  },

  _relancer() {
    if (!this._actif || this._listening) return;
    try {
      this._recognition?.start();
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // TRAITEMENT COMMANDES
  // ════════════════════════════════════════════════════════
  _traiter(texte) {
    // Normaliser
    const txt = texte
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    console.log('[Voice] Traitement:', txt);

    for (const cmd of this.COMMANDES) {

      // ✅ Regex avec capture
      if (cmd.regex) {
        for (const pattern of cmd.patterns) {
          try {
            const regex = new RegExp(pattern, 'i');
            const match = txt.match(regex);
            if (match) {
              this._executer(cmd.action, match.groups || {}, txt);
              return true;
            }
          } catch(e) {}
        }
        continue;
      }

      // ✅ Correspondance simple
      for (const pattern of cmd.patterns) {
        const patNorm = pattern
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

        if (txt.includes(patNorm)) {
          this._executer(cmd.action, {}, txt);
          return true;
        }
      }
    }

    // Aucune commande trouvée
    console.log('[Voice] Commande non reconnue:', txt);
    return false;
  },

  // ════════════════════════════════════════════════════════
  // EXÉCUTION
  // ════════════════════════════════════════════════════════
  _executer(action, params = {}, texte = '') {
    console.log('[Voice] Action:', action, params);

    // ✅ Éviter doublons (même commande < 1s)
    const now = Date.now();
    if (this._dernierCmd?.action === action
        && now - this._dernierCmd.ts < 1000) return;
    this._dernierCmd = { action, ts: now };

    // ✅ Feedback visuel
    this._afficherFeedback(action, params);

    switch(action) {

      // ── Valider série en cours ──
      case 'VALIDER_SERIE': {
        const btnActif = this._getTrouverSerieActive();
        if (btnActif) {
          btnActif.click();
          Utils.toast('🎙️ ✅ Série validée !', 'success', 2000);
          Utils.vibrer([100, 50, 100]);
        } else {
          Utils.toast('🎙️ Aucune série active', 'info', 1500);
          try { SeanceGuidee.parler('Aucune série active.', true); } catch(e) {}
        }
        break;
      }

      // ── Timer repos ──
      case 'TIMER_REPOS': {
        try {
          TimerManager.demarrerRepos(75);
          Utils.toast('🎙️ ⏱️ Timer repos 75s !', 'success', 2000);
          try { SeanceGuidee.parler('Repos de 75 secondes. C\'est parti !', true); } catch(e) {}
        } catch(e) {
          Utils.toast('🎙️ Erreur timer', 'error', 1500);
        }
        break;
      }

      // ── Set poids ──
      case 'SET_POIDS': {
        const kg = parseFloat(
          (params.kg || '0').replace(',', '.')
        );
        if (!kg || isNaN(kg)) break;

        const inputs = this._getInputsPoidsActifs();
        if (inputs.length > 0) {
          inputs.forEach(inp => {
            inp.value = kg;
            inp.dispatchEvent(new Event('input'));
          });
          Utils.toast(`🎙️ Poids : ${kg}kg`, 'success', 2000);
          try { SeanceGuidee.parler(`${kg} kilos enregistré.`, true); } catch(e) {}
        } else {
          Utils.toast('🎙️ Aucun champ poids actif', 'info', 1500);
        }
        break;
      }

      // ── Set reps ──
      case 'SET_REPS': {
        const n = parseInt(params.n || '0');
        if (!n || isNaN(n)) break;

        const inputs = this._getInputsRepsActifs();
        if (inputs.length > 0) {
          inputs.forEach(inp => {
            inp.value = n;
            inp.dispatchEvent(new Event('input'));
          });
          Utils.toast(`🎙️ Reps : ${n}`, 'success', 2000);
          try { SeanceGuidee.parler(`${n} répétitions enregistré.`, true); } catch(e) {}
        }
        break;
      }

      // ── Set RPE ──
      case 'SET_RPE': {
        const rpe = parseInt(params.n || '0');
        if (!rpe || rpe < 1 || rpe > 10) break;

        // Trouver le bouton RPE correspondant
        const exoIdx = this._getExoActif();
        if (exoIdx !== null) {
          try {
            LiveRapide.setRPE(exoIdx, rpe);
            // Cliquer le bouton RPE
            const btnsRPE = document.querySelectorAll(
              `#lr-bloc-${exoIdx}-${this._getSerieActif(exoIdx)} button`
            );
            btnsRPE.forEach(btn => {
              if (btn.textContent.trim() === String(rpe)) {
                btn.click();
              }
            });
            Utils.toast(`🎙️ RPE : ${rpe}/10`, 'success', 2000);
          } catch(e) {}
        }
        break;
      }

      // ── Ajouter poids ──
      case 'AJOUTER_POIDS': {
        let delta = parseFloat((params.n || '2.5').replace(',', '.'));
        if (isNaN(delta)) delta = 2.5;

        // Mots → nombres
        if (texte.includes('deux virgule cinq')) delta = 2.5;
        if (texte.includes('cinq') && !texte.includes('virgule')) delta = 5;

        const exoIdx = this._getExoActif();
        if (exoIdx !== null) {
          try {
            LiveRapide.modifierPoids(exoIdx, delta);
            Utils.toast(`🎙️ Poids +${delta}kg`, 'success', 2000);
          } catch(e) {}
        }
        break;
      }

      // ── Retirer poids ──
      case 'RETIRER_POIDS': {
        let delta = parseFloat((params.n || '2.5').replace(',', '.'));
        if (isNaN(delta)) delta = 2.5;

        if (texte.includes('deux virgule cinq')) delta = 2.5;
        if (texte.includes('cinq') && !texte.includes('virgule')) delta = 5;

        const exoIdx = this._getExoActif();
        if (exoIdx !== null) {
          try {
            LiveRapide.modifierPoids(exoIdx, -delta);
            Utils.toast(`🎙️ Poids -${delta}kg`, 'success', 2000);
          } catch(e) {}
        }
        break;
      }

      // ── Exercice suivant ──
      case 'NEXT_EXERCICE': {
        const exoActif = this._getExoActif();
        const prochain = exoActif !== null ? exoActif + 1 : 0;
        const exoEl    = document.getElementById(
          `live-exo-${prochain}`
        );
        if (exoEl) {
          exoEl.scrollIntoView({ behavior:'smooth', block:'start' });
          Utils.toast(`🎙️ Exercice ${prochain + 1}`, 'info', 1500);
          try {
            const nom = exoEl.querySelector('[style*="font-size:1rem"]')
              ?.textContent?.trim() || '';
            SeanceGuidee.parler(`Exercice suivant : ${nom}`, true);
          } catch(e) {}
        }
        break;
      }

      // ── Exercice précédent ──
      case 'PREV_EXERCICE': {
        const exoActif = this._getExoActif();
        const prec     = Math.max(0, (exoActif || 1) - 1);
        const exoEl    = document.getElementById(`live-exo-${prec}`);
        if (exoEl) {
          exoEl.scrollIntoView({ behavior:'smooth', block:'start' });
          Utils.toast(`🎙️ Exercice ${prec + 1}`, 'info', 1500);
        }
        break;
      }

      // ── Terminer séance ──
      case 'TERMINER_SEANCE': {
        try {
          SeanceGuidee.parler(
            'Séance terminée ! Excellent travail !',
            true
          );
          setTimeout(() => {
            const seanceId = Utils.storage.get(
              'ft_seance_active', null
            ) || Programme.getSeanceduJour()?.id;
            if (seanceId) App.terminerSeance(seanceId);
          }, 1500);
        } catch(e) {}
        break;
      }

      // ── Aide ──
      case 'AIDE': {
        this._afficherAide();
        break;
      }

      // ── Stop voix ──
      case 'STOP_VOICE': {
        this.arreter();
        break;
      }
    }
  },

  // ════════════════════════════════════════════════════════
  // HELPERS DOM
  // ════════════════════════════════════════════════════════

  // ✅ Trouver le bouton de série active (premier btn non disabled)
  _getTrouverSerieActive() {
    const btns = document.querySelectorAll('[id^="btn-serie-"]');
    for (const btn of btns) {
      if (!btn.disabled) return btn;
    }
    return null;
  },

  // ✅ Trouver l'exo actif (dernier avec une série en cours)
  _getExoActif() {
    const btns = document.querySelectorAll('[id^="btn-serie-"]');
    let exoActif = null;

    for (const btn of btns) {
      if (!btn.disabled) {
        const parts = btn.id.split('-');
        exoActif = parseInt(parts[2]);
        break;
      }
    }

    return exoActif;
  },

  // ✅ Trouver la série active d'un exo
  _getSerieActif(exoIdx) {
    for (let s = 0; s < 10; s++) {
      const btn = document.getElementById(
        `btn-serie-${exoIdx}-${s}`
      );
      if (btn && !btn.disabled) return s;
    }
    return 0;
  },

  // ✅ Inputs poids non validés
  _getInputsPoidsActifs() {
    const inputs = [];
    document.querySelectorAll('[id^="lr-poids-"]').forEach(inp => {
      const parts    = inp.id.split('-');
      const exoIdx   = parseInt(parts[2]);
      const serieIdx = parseInt(parts[3]);
      const btn      = document.getElementById(
        `btn-serie-${exoIdx}-${serieIdx}`
      );
      if (btn && !btn.disabled) inputs.push(inp);
    });
    return inputs.slice(0, 1); // Seulement le premier actif
  },

  // ✅ Inputs reps non validés
  _getInputsRepsActifs() {
    const inputs = [];
    document.querySelectorAll('[id^="lr-reps-"]').forEach(inp => {
      const parts    = inp.id.split('-');
      const exoIdx   = parseInt(parts[2]);
      const serieIdx = parseInt(parts[3]);
      const btn      = document.getElementById(
        `btn-serie-${exoIdx}-${serieIdx}`
      );
      if (btn && !btn.disabled) inputs.push(inp);
    });
    return inputs.slice(0, 1);
  },

  // ════════════════════════════════════════════════════════
  // UI — Bulle micro
  // ════════════════════════════════════════════════════════
  _afficherBulle() {
    let bulle = document.getElementById('voice-bulle');
    if (!bulle) {
      bulle    = document.createElement('div');
      bulle.id = 'voice-bulle';
      document.body.appendChild(bulle);
    }

    bulle.innerHTML = `
      <div id="voice-bulle-inner" style="
        position:fixed;
        bottom:${window.innerWidth >= 1024 ? '80px' : '90px'};
        right:16px;
        z-index:500;
        display:flex;align-items:center;gap:8px;
        padding:10px 14px;
        background:rgba(9,9,45,0.95);
        border:1px solid rgba(0,207,255,0.3);
        border-radius:99px;
        box-shadow:0 4px 20px rgba(0,0,0,0.4),
                   0 0 20px rgba(0,207,255,0.15);
        backdrop-filter:blur(12px);
        cursor:pointer;
        transition:all .2s;
        animation:fadeIn .3s ease"
        onclick="Voice.toggle()">

        <!-- Micro animé -->
        <div style="
          width:28px;height:28px;border-radius:50%;
          background:rgba(0,207,255,0.15);
          border:1px solid rgba(0,207,255,0.4);
          display:flex;align-items:center;justify-content:center;
          font-size:.9rem;
          box-shadow:0 0 12px rgba(0,207,255,0.3);
          animation:pulseLive 1.5s ease-in-out infinite">
          🎙️
        </div>

        <!-- Label -->
        <div>
          <div style="
            font-size:.68rem;font-weight:700;
            color:rgba(0,207,255,0.9);
            font-family:'Orbitron',monospace;
            letter-spacing:1px">
            VOIX ACTIVE
          </div>
          <div id="voice-status" style="
            font-size:.55rem;
            color:rgba(0,207,255,0.4);
            margin-top:1px">
            En écoute...
          </div>
        </div>

        <!-- Bouton fermer -->
        <div onclick="event.stopPropagation();Voice.arreter()"
             style="
               width:20px;height:20px;border-radius:50%;
               background:rgba(255,80,80,0.15);
               border:1px solid rgba(255,80,80,0.3);
               display:flex;align-items:center;
               justify-content:center;
               font-size:.6rem;color:rgba(255,100,100,0.8);
               cursor:pointer;flex-shrink:0;
               margin-left:4px">
          ✕
        </div>
      </div>
    `;
  },

  _masquerBulle() {
    const bulle = document.getElementById('voice-bulle');
    if (bulle) {
      bulle.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => bulle.remove(), 300);
    }
  },

  // ✅ Feedback visuel commande reconnue
  _afficherFeedback(action, params) {
    const cmd = this.COMMANDES.find(c => c.action === action);
    if (!cmd) return;

    // Flash sur la bulle
    const bulle = document.getElementById('voice-bulle-inner');
    if (bulle) {
      bulle.style.borderColor  = 'rgba(139,240,187,0.6)';
      bulle.style.boxShadow    = '0 4px 20px rgba(0,0,0,0.4), 0 0 30px rgba(139,240,187,0.3)';
      setTimeout(() => {
        bulle.style.borderColor = 'rgba(0,207,255,0.3)';
        bulle.style.boxShadow   = '0 4px 20px rgba(0,0,0,0.4), 0 0 20px rgba(0,207,255,0.15)';
      }, 600);
    }

    // Mettre à jour le status
    const status = document.getElementById('voice-status');
    if (status) {
      status.textContent  = `${cmd.emoji} Compris !`;
      status.style.color  = 'rgba(139,240,187,0.8)';
      setTimeout(() => {
        if (status) {
          status.textContent = 'En écoute...';
          status.style.color = 'rgba(0,207,255,0.4)';
        }
      }, 2000);
    }

    // Popup commande reconnue
    const popup = document.createElement('div');
    popup.style.cssText = `
      position:fixed;
      bottom:${window.innerWidth >= 1024 ? '140px' : '150px'};
      right:16px;z-index:501;
      padding:8px 14px;
      background:rgba(9,9,45,0.9);
      border:1px solid rgba(139,240,187,0.3);
      border-radius:12px;
      font-size:.72rem;color:var(--fd-mint);
      font-weight:700;
      box-shadow:0 0 16px rgba(139,240,187,0.2);
      animation:fadeIn .2s ease;
      max-width:200px;
      text-align:center`;

    popup.textContent = `${cmd.emoji} ${cmd.desc}`;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => popup.remove(), 300);
    }, 1800);
  },

  // ✅ Modal aide commandes
  _afficherAide() {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="padding:var(--space-md)">
        <h3 style="margin-bottom:16px">🎙️ Commandes vocales</h3>

        <div style="background:rgba(0,207,255,0.08);
                    border:1px solid rgba(0,207,255,0.2);
                    border-radius:var(--radius-md);
                    padding:10px 14px;
                    margin-bottom:16px;
                    font-size:.75rem;
                    color:rgba(0,207,255,0.8);
                    line-height:1.5">
          💡 Parle naturellement en français.
          La voix fonctionne même mains occupées !
        </div>

        ${this.COMMANDES.map(cmd => `
          <div style="display:flex;align-items:center;gap:10px;
                      padding:8px 0;
                      border-bottom:1px solid rgba(255,255,255,0.06)">
            <span style="font-size:1.2rem;width:28px;
                         text-align:center;flex-shrink:0">
              ${cmd.emoji}
            </span>
            <div>
              <div style="font-size:.8rem;font-weight:600;
                          color:var(--text-primary)">
                ${cmd.desc}
              </div>
              <div style="font-size:.62rem;color:var(--text-muted);
                          margin-top:1px">
                ${cmd.patterns.filter(p => !p.includes('(?')).slice(0,2).join(', ')}
              </div>
            </div>
          </div>`).join('')}

        <button onclick="document.getElementById('modal-info')
                          .classList.add('hidden')"
                class="btn-primary mt-md"
                style="width:100%">
          ✓ Compris !
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () =>
      modal.classList.add('hidden');
  },

  // ════════════════════════════════════════════════════════
  // UPDATE UI
  // ════════════════════════════════════════════════════════
  _mettreAJourUI() {
    // Bouton dans le live header
    const btn = document.getElementById('btn-voice');
    if (!btn) return;

    if (this._actif) {
      btn.innerHTML         = '🎙️ Voix ON';
      btn.style.background  = 'rgba(0,207,255,0.15)';
      btn.style.borderColor = 'rgba(0,207,255,0.4)';
      btn.style.color       = '#00cfff';
      btn.style.boxShadow   = '0 0 12px rgba(0,207,255,0.3)';
    } else {
      btn.innerHTML         = '🎙️ Voix';
      btn.style.background  = 'rgba(255,255,255,0.06)';
      btn.style.borderColor = 'rgba(255,255,255,0.1)';
      btn.style.color       = 'rgba(255,255,255,0.5)';
      btn.style.boxShadow   = 'none';
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER SETTINGS
  // ════════════════════════════════════════════════════════
  renderSettings(container) {
    if (!container) return;
    const supporte = this.estSupporte();

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">🎙️ Commandes vocales</div>

        <div style="margin-top:12px;padding:12px 14px;
                    background:${supporte
                      ? 'rgba(139,240,187,0.08)'
                      : 'rgba(255,141,150,0.08)'};
                    border:1px solid ${supporte
                      ? 'rgba(139,240,187,0.25)'
                      : 'rgba(255,141,150,0.25)'};
                    border-radius:var(--radius-md);
                    font-size:.78rem;
                    color:${supporte
                      ? 'var(--fd-mint)' : 'var(--fd-coral)'}">
          ${supporte
            ? '✅ Commandes vocales disponibles'
            : '❌ Non supporté sur ce navigateur'}
        </div>

        ${supporte ? `
          <div style="margin-top:14px">
            <button onclick="Voice.toggle()"
                    class="${this._actif ? 'btn-primary' : 'btn-secondary'}"
                    style="width:100%;font-size:.85rem">
              ${this._actif ? '🔇 Désactiver' : '🎙️ Activer les commandes vocales'}
            </button>
          </div>

          <div style="margin-top:12px">
            <button onclick="Voice._afficherAide()"
                    class="btn-secondary"
                    style="width:100%;font-size:.82rem">
              ❓ Voir toutes les commandes
            </button>
          </div>

          <div style="margin-top:12px;padding:10px 12px;
                      background:rgba(75,75,249,0.08);
                      border:1px solid rgba(75,75,249,0.15);
                      border-radius:var(--radius-md);
                      font-size:.72rem;
                      color:var(--text-muted);
                      line-height:1.6">
            <strong>Commandes rapides :</strong><br>
            🎙️ "Série faite" → Valider la série<br>
            🎙️ "80 kg" → Définir le poids<br>
            🎙️ "12 reps" → Définir les reps<br>
            🎙️ "Repos" → Lancer le timer<br>
            🎙️ "Stop" → Désactiver la voix
          </div>` : `
          <div style="margin-top:12px;font-size:.75rem;
                      color:var(--text-muted);line-height:1.6">
            Les commandes vocales nécessitent Chrome, Edge
            ou Safari récent.
          </div>`}
      </div>
    `;
  }
};

window.Voice = Voice;
console.log('✅ Voice.js v1.0 — Commandes vocales chargé');
