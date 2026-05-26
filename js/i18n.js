/* ============================================================
   PowerApp — i18n.js v2.0
   Multi-langue FR/EN/ES/PT
   + t(key) traductions + reload UI
   ============================================================ */

const i18n = {

  _langue: 'fr',

  // ════════════════════════════════════════════════════════
  // TRADUCTIONS
  // ════════════════════════════════════════════════════════
  TRADUCTIONS: {
    fr: {
      // Navigation
      'nav.home':       'Accueil',
      'nav.training':   'Entraînement',
      'nav.nutrition':  'Nutrition',
      'nav.stats':      'Stats',
      'nav.coach':      'Coach',
      'nav.profile':    'Profil',
      // Séance
      'session.start':   'Démarrer',
      'session.pause':   'Pause',
      'session.resume':  'Reprendre',
      'session.finish':  'Terminer',
      'session.rest':    'Repos',
      'session.set':     'Série',
      'session.reps':    'Répétitions',
      'session.weight':  'Poids (kg)',
      'session.rpe':     'RPE (difficulté)',
      'session.next':    'Exercice suivant',
      'session.skip':    'Passer',
      // Stats
      'stats.volume':    'Volume',
      'stats.sessions':  'Séances',
      'stats.streak':    'Streak',
      'stats.records':   'Records',
      'stats.total':     'Total',
      'stats.week':      'Semaine',
      'stats.best':      'Meilleur',
      // Nutrition
      'nutri.calories':  'Calories',
      'nutri.protein':   'Protéines',
      'nutri.carbs':     'Glucides',
      'nutri.fat':       'Lipides',
      'nutri.water':     'Eau',
      'nutri.goal':      'Objectif',
      // Actions
      'action.save':     'Sauvegarder',
      'action.cancel':   'Annuler',
      'action.delete':   'Supprimer',
      'action.edit':     'Modifier',
      'action.add':      'Ajouter',
      'action.share':    'Partager',
      'action.download': 'Télécharger',
      'action.confirm':  'Confirmer',
      'action.back':     'Retour',
      // Messages
      'msg.pr':          '🏆 Nouveau record !',
      'msg.good_job':    '💪 Bravo !',
      'msg.loading':     'Chargement...',
      'msg.no_data':     'Aucune donnée',
      'msg.error':       'Erreur',
      'msg.success':     'Succès',
      // Général
      'general.days':    'jours',
      'general.weeks':   'semaines',
      'general.months':  'mois',
      'general.minutes': 'minutes',
      'general.seconds': 'secondes',
      'general.kg':      'kg',
      'general.reps':    'reps',
      'general.sets':    'séries'
    },

    en: {
      // Navigation
      'nav.home':       'Home',
      'nav.training':   'Training',
      'nav.nutrition':  'Nutrition',
      'nav.stats':      'Stats',
      'nav.coach':      'Coach',
      'nav.profile':    'Profile',
      // Session
      'session.start':   'Start',
      'session.pause':   'Pause',
      'session.resume':  'Resume',
      'session.finish':  'Finish',
      'session.rest':    'Rest',
      'session.set':     'Set',
      'session.reps':    'Reps',
      'session.weight':  'Weight (kg)',
      'session.rpe':     'RPE (effort)',
      'session.next':    'Next exercise',
      'session.skip':    'Skip',
      // Stats
      'stats.volume':    'Volume',
      'stats.sessions':  'Sessions',
      'stats.streak':    'Streak',
      'stats.records':   'Records',
      'stats.total':     'Total',
      'stats.week':      'Week',
      'stats.best':      'Best',
      // Nutrition
      'nutri.calories':  'Calories',
      'nutri.protein':   'Protein',
      'nutri.carbs':     'Carbs',
      'nutri.fat':       'Fat',
      'nutri.water':     'Water',
      'nutri.goal':      'Goal',
      // Actions
      'action.save':     'Save',
      'action.cancel':   'Cancel',
      'action.delete':   'Delete',
      'action.edit':     'Edit',
      'action.add':      'Add',
      'action.share':    'Share',
      'action.download': 'Download',
      'action.confirm':  'Confirm',
      'action.back':     'Back',
      // Messages
      'msg.pr':          '🏆 New record!',
      'msg.good_job':    '💪 Great job!',
      'msg.loading':     'Loading...',
      'msg.no_data':     'No data',
      'msg.error':       'Error',
      'msg.success':     'Success',
      // General
      'general.days':    'days',
      'general.weeks':   'weeks',
      'general.months':  'months',
      'general.minutes': 'minutes',
      'general.seconds': 'seconds',
      'general.kg':      'kg',
      'general.reps':    'reps',
      'general.sets':    'sets'
    },

    es: {
      // Navegación
      'nav.home':       'Inicio',
      'nav.training':   'Entrenamiento',
      'nav.nutrition':  'Nutrición',
      'nav.stats':      'Estadísticas',
      'nav.coach':      'Coach',
      'nav.profile':    'Perfil',
      // Sesión
      'session.start':   'Empezar',
      'session.pause':   'Pausar',
      'session.resume':  'Reanudar',
      'session.finish':  'Terminar',
      'session.rest':    'Descanso',
      'session.set':     'Serie',
      'session.reps':    'Repeticiones',
      'session.weight':  'Peso (kg)',
      'session.rpe':     'RPE (esfuerzo)',
      'session.next':    'Siguiente ejercicio',
      'session.skip':    'Saltar',
      // Stats
      'stats.volume':    'Volumen',
      'stats.sessions':  'Sesiones',
      'stats.streak':    'Racha',
      'stats.records':   'Récords',
      'stats.total':     'Total',
      'stats.week':      'Semana',
      'stats.best':      'Mejor',
      // Nutrición
      'nutri.calories':  'Calorías',
      'nutri.protein':   'Proteínas',
      'nutri.carbs':     'Carbohidratos',
      'nutri.fat':       'Grasas',
      'nutri.water':     'Agua',
      'nutri.goal':      'Objetivo',
      // Acciones
      'action.save':     'Guardar',
      'action.cancel':   'Cancelar',
      'action.delete':   'Eliminar',
      'action.edit':     'Editar',
      'action.add':      'Añadir',
      'action.share':    'Compartir',
      'action.download': 'Descargar',
      'action.confirm':  'Confirmar',
      'action.back':     'Volver',
      // Mensajes
      'msg.pr':          '🏆 ¡Nuevo récord!',
      'msg.good_job':    '💪 ¡Buen trabajo!',
      'msg.loading':     'Cargando...',
      'msg.no_data':     'Sin datos',
      'msg.error':       'Error',
      'msg.success':     'Éxito',
      // General
      'general.days':    'días',
      'general.weeks':   'semanas',
      'general.months':  'meses',
      'general.minutes': 'minutos',
      'general.seconds': 'segundos',
      'general.kg':      'kg',
      'general.reps':    'reps',
      'general.sets':    'series'
    },

    pt: {
      // Navegação
      'nav.home':       'Início',
      'nav.training':   'Treino',
      'nav.nutrition':  'Nutrição',
      'nav.stats':      'Estatísticas',
      'nav.coach':      'Coach',
      'nav.profile':    'Perfil',
      // Sessão
      'session.start':   'Iniciar',
      'session.pause':   'Pausar',
      'session.resume':  'Retomar',
      'session.finish':  'Terminar',
      'session.rest':    'Descanso',
      'session.set':     'Série',
      'session.reps':    'Repetições',
      'session.weight':  'Peso (kg)',
      'session.rpe':     'RPE (esforço)',
      'session.next':    'Próximo exercício',
      'session.skip':    'Pular',
      // Stats
      'stats.volume':    'Volume',
      'stats.sessions':  'Sessões',
      'stats.streak':    'Sequência',
      'stats.records':   'Recordes',
      'stats.total':     'Total',
      'stats.week':      'Semana',
      'stats.best':      'Melhor',
      // Nutrição
      'nutri.calories':  'Calorias',
      'nutri.protein':   'Proteínas',
      'nutri.carbs':     'Carboidratos',
      'nutri.fat':       'Gorduras',
      'nutri.water':     'Água',
      'nutri.goal':      'Objetivo',
      // Ações
      'action.save':     'Salvar',
      'action.cancel':   'Cancelar',
      'action.delete':   'Excluir',
      'action.edit':     'Editar',
      'action.add':      'Adicionar',
      'action.share':    'Compartilhar',
      'action.download': 'Baixar',
      'action.confirm':  'Confirmar',
      'action.back':     'Voltar',
      // Mensagens
      'msg.pr':          '🏆 Novo recorde!',
      'msg.good_job':    '💪 Bom trabalho!',
      'msg.loading':     'Carregando...',
      'msg.no_data':     'Sem dados',
      'msg.error':       'Erro',
      'msg.success':     'Sucesso',
      // Geral
      'general.days':    'dias',
      'general.weeks':   'semanas',
      'general.months':  'meses',
      'general.minutes': 'minutos',
      'general.seconds': 'segundos',
      'general.kg':      'kg',
      'general.reps':    'reps',
      'general.sets':    'séries'
    }
  },

  // ════════════════════════════════════════════════════════
  // LANGUES DISPONIBLES
  // ════════════════════════════════════════════════════════
  LANGUES: {
    fr: { label:'Français', flag:'🇫🇷', rtl:false },
    en: { label:'English',  flag:'🇬🇧', rtl:false },
    es: { label:'Español',  flag:'🇪🇸', rtl:false },
    pt: { label:'Português',flag:'🇧🇷', rtl:false }
  },

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  init() {
    try {
      const saved = Utils.storage.get('ft_langue', null);
      if (saved && this.LANGUES[saved]) {
        this._langue = saved;
      } else {
        const nav = navigator.language?.slice(0, 2) || 'fr';
        this._langue = this.LANGUES[nav] ? nav : 'fr';
      }
    } catch(e) {}
    console.log(`[i18n] Langue : ${this._langue}`);
  },

  // ════════════════════════════════════════════════════════
  // t(key) — Traduction
  // ════════════════════════════════════════════════════════
  t(key, params = {}) {
    // Chercher dans la langue active
    let texte = this.TRADUCTIONS[this._langue]?.[key]
      // Fallback français
      || this.TRADUCTIONS['fr']?.[key]
      // Fallback clé elle-même
      || key;

    // ✅ Interpolation de paramètres : {{variable}}
    Object.entries(params).forEach(([k, v]) => {
      texte = texte.replace(new RegExp(`{{${k}}}`, 'g'), v);
    });

    return texte;
  },

  // ════════════════════════════════════════════════════════
  // GETTERS / SETTERS
  // ════════════════════════════════════════════════════════
  getLangue() {
    return this._langue;
  },

  estFrancais() {
    return this._langue === 'fr';
  },

  estAnglais() {
    return this._langue === 'en';
  },

  // ✅ v2.0 — setLangue avec reload UI optionnel
  setLangue(code, reloadUI = true) {
    if (!this.LANGUES[code]) {
      console.warn(`[i18n] Langue '${code}' non supportée`);
      return;
    }

    this._langue = code;
    try { Utils.storage.set('ft_langue', code); } catch(e) {}

    Utils.toast(
      `🌍 Langue : ${this.LANGUES[code].flag} ${this.LANGUES[code].label}`,
      'success', 2000
    );

    if (reloadUI) {
      // Re-render la page settings si ouverte
      try {
        const settings = document.getElementById('page-settings');
        if (settings) {
          const container = settings.querySelector('.i18n-container');
          if (container) this.renderSelecteur(container);
        }
      } catch(e) {}
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER SÉLECTEUR — ✅ v2.0 enrichi
  // ════════════════════════════════════════════════════════
  renderSelecteur(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">🌍 Langue / Language</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);margin-top:var(--space-md)">
          ${Object.entries(this.LANGUES).map(([code, lang]) => {
            const actif = this._langue === code;
            return `
              <button onclick="i18n.setLangue('${code}')"
                      style="padding:var(--space-md) var(--space-sm);
                             border-radius:var(--radius-md);
                             border:2px solid ${actif
                               ? 'var(--fd-indigo)'
                               : 'var(--border-color)'};
                             background:${actif
                               ? 'rgba(75,75,249,0.15)'
                               : 'var(--bg-input)'};
                             color:${actif
                               ? 'var(--fd-indigo)'
                               : 'var(--text-muted)'};
                             font-size:.85rem;font-weight:${actif ? '700' : '400'};
                             cursor:pointer;
                             display:flex;align-items:center;
                             gap:8px;justify-content:center;
                             transition:all .2s">
                <span style="font-size:1.2rem">${lang.flag}</span>
                <div style="text-align:left">
                  <div style="font-size:.82rem;font-weight:600">
                    ${lang.label}
                  </div>
                  ${actif ? `
                    <div style="font-size:.6rem;
                                color:var(--fd-indigo)">
                      ✓ Actif
                    </div>` : ''}
                </div>
              </button>`;
          }).join('')}
        </div>

        <!-- ✅ NOUVEAU v2.0 — Info traduction -->
        <div style="margin-top:var(--space-md);padding:var(--space-sm);
                    background:rgba(75,75,249,0.06);
                    border-radius:var(--radius-md);
                    font-size:.68rem;color:var(--text-muted)">
          💡 L'interface principale reste en français.
          La langue affecte les hashtags sociaux,
          les messages du Coach et les notifications.
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // UTILITAIRES
  // ════════════════════════════════════════════════════════

  // Formater un nombre selon la locale
  formatNombre(n) {
    try {
      const locales = {
        fr: 'fr-FR', en: 'en-US',
        es: 'es-ES', pt: 'pt-BR'
      };
      return Number(n).toLocaleString(
        locales[this._langue] || 'fr-FR'
      );
    } catch(e) {
      return String(n);
    }
  },

  // Formater une date selon la locale
  formatDate(dateStr) {
    try {
      const locales = {
        fr: 'fr-FR', en: 'en-US',
        es: 'es-ES', pt: 'pt-BR'
      };
      return new Date(dateStr + 'T00:00:00').toLocaleDateString(
        locales[this._langue] || 'fr-FR',
        { day:'numeric', month:'long', year:'numeric' }
      );
    } catch(e) {
      return dateStr;
    }
  }
};

window.i18n = i18n;
console.log('✅ i18n.js v2.0 chargé — FR/EN/ES/PT');
