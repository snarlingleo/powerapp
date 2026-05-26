/* ============================================================
   PowerApp — Photos.js v2.0
   Photos de progression + Avant/Après + Galerie + Stats
   + Navigation photo + Filtre période
   + Carte enrichie avec stats séances
   + Connexion Tracker trophées
   ============================================================ */

const Photos = {

  CONFIG: {
    maxPhotos: 50,
    qualite:   0.75,
    maxWidth:  1080,
    maxHeight: 1920,
    cle:       'ft_photos'
  },

  CATEGORIES: {
    front:  { label:'Face',    emoji:'👤', desc:'Vue de face'       },
    side:   { label:'Profil',  emoji:'↔️', desc:'Vue de profil'     },
    back:   { label:'Dos',     emoji:'🔙', desc:'Vue de dos'        },
    detail: { label:'Détail',  emoji:'🔍', desc:'Muscle spécifique' },
    autres: { label:'Autre',   emoji:'📸', desc:'Autre vue'         }
  },

  // ✅ NOUVEAU v2.0 — Index photo actuelle pour navigation
  _indexActuel: 0,
  _photosActuelles: [],
  _catAvantApres: 'front',

  // ════════════════════════════════════════════════════════
  // GETTERS
  // ════════════════════════════════════════════════════════
  getToutes() {
    return Utils.storage.get(this.CONFIG.cle, [])
      .sort((a,b) => (b.date||'').localeCompare(a.date||''));
  },

  getParCategorie(cat) {
    return this.getToutes().filter(p => p.categorie === cat);
  },

  getParDate(date) {
    return this.getToutes().filter(p => p.date === date);
  },

  // ✅ NOUVEAU v2.0 — Filtre par période
  getParPeriode(jours = 30) {
    const debut = Utils.ajouterJours(Utils.aujourd_hui(), -jours);
    return this.getToutes().filter(p => (p.date||'') >= debut);
  },

  getDerniere(cat = null) {
    const photos = cat ? this.getParCategorie(cat) : this.getToutes();
    return photos[0] || null;
  },

  getPremiere(cat = null) {
    const photos = cat
      ? this.getParCategorie(cat).reverse()
      : [...this.getToutes()].reverse();
    return photos[0] || null;
  },

  getAvantApres(cat = 'front') {
    const photos = this.getParCategorie(cat);
    if (photos.length < 2) return null;
    return {
      avant: photos[photos.length - 1],
      apres: photos[0],
      delta: Utils.diffJours(
        photos[photos.length - 1].date,
        photos[0].date
      )
    };
  },

  getStats() {
    const toutes = this.getToutes();
    const parCat = {};
    Object.keys(this.CATEGORIES).forEach(cat => {
      parCat[cat] = toutes.filter(p => p.categorie === cat).length;
    });

    let progPoids = null;
    try {
      const mesures = Tracker.getMesures();
      if (mesures.length >= 2) {
        const debut = mesures[mesures.length - 1];
        const fin   = mesures[0];
        progPoids   = Utils.arrondir(
          (fin.poids||0) - (debut.poids||0)
        );
      }
    } catch(e) {}

    return {
      total:        toutes.length,
      parCategorie: parCat,
      premierDate:  toutes[toutes.length-1]?.date || null,
      dernierDate:  toutes[0]?.date               || null,
      nbJours:      toutes.length >= 2
        ? Utils.diffJours(
            toutes[toutes.length-1].date,
            toutes[0].date
          )
        : 0,
      progPoids
    };
  },

  // ════════════════════════════════════════════════════════
  // AJOUTER
  // ════════════════════════════════════════════════════════
  async ajouterDepuisInput(fichier, options = {}) {
    if (!fichier) return null;

    try {
      const dataUrl = await this._compresser(fichier);

      // ✅ Récupérer poids actuel si pas fourni
      let poidsActuel = options.poids || null;
      if (!poidsActuel) {
        try {
          const mesure = Tracker.getDerniereMesure();
          poidsActuel  = mesure?.poids || Tracker.getProfil().poids || null;
        } catch(e) {}
      }

      const photo = {
        id:        'photo_' + Date.now(),
        date:      options.date      || Utils.aujourd_hui(),
        categorie: options.categorie || 'front',
        note:      options.note      || '',
        poids:     poidsActuel,
        image:     dataUrl,
        taille:    Math.round(dataUrl.length * 3/4 / 1024),
        ts:        Date.now()
      };

      const photos = this.getToutes();

      if (photos.length >= this.CONFIG.maxPhotos) {
        Utils.toast(
          `⚠️ Limite de ${this.CONFIG.maxPhotos} photos atteinte.`,
          'warning'
        );
        return null;
      }

      photos.unshift(photo);
      Utils.storage.set(this.CONFIG.cle, photos);

      try { Gamification.recompenser('PHOTO_AJOUTEE'); } catch(e) {}

      // ✅ NOUVEAU v2.0 — Vérifier trophées photos
      setTimeout(() => {
        try { Gamification.verifierTrophees(); } catch(e) {}
      }, 500);

      Utils.toast('📸 Photo ajoutée !', 'success');
      Utils.vibrerSuccess();
      return photo;

    } catch(e) {
      console.error('[Photos] Erreur ajout:', e);
      Utils.toast('❌ Erreur ajout photo', 'error');
      return null;
    }
  },

  _compresser(fichier) {
    return new Promise((resolve, reject) => {
      const reader   = new FileReader();
      reader.onload  = (e) => {
        const img    = new Image();
        img.onload   = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxW = this.CONFIG.maxWidth;
          const maxH = this.CONFIG.maxHeight;
          if (width > maxW || height > maxH) {
            const ratio = Math.min(maxW/width, maxH/height);
            width  = Math.round(width  * ratio);
            height = Math.round(height * ratio);
          }
          canvas.width  = width;
          canvas.height = height;
          canvas.getContext('2d')
            .drawImage(img, 0, 0, width, height);
          resolve(
            canvas.toDataURL('image/jpeg', this.CONFIG.qualite)
          );
        };
        img.onerror  = reject;
        img.src      = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fichier);
    });
  },

  modifier(id, updates) {
    const photos = this.getToutes();
    const idx    = photos.findIndex(p => p.id === id);
    if (idx < 0) return false;
    photos[idx] = { ...photos[idx], ...updates };
    Utils.storage.set(this.CONFIG.cle, photos);
    return true;
  },

  supprimer(id) {
    const photos = this.getToutes().filter(p => p.id !== id);
    Utils.storage.set(this.CONFIG.cle, photos);
    Utils.toast('Photo supprimée.', 'info');
  },

  telecharger(photo) {
    const link    = document.createElement('a');
    link.href     = photo.image;
    link.download =
      `progression-${photo.date}-${photo.categorie}.jpg`;
    link.click();
    Utils.toast('📥 Photo téléchargée !', 'success');
  },

  // ════════════════════════════════════════════════════════
  // GÉNÉRER CARTE AVANT/APRÈS — ✅ v2.0 enrichie avec stats
  // ════════════════════════════════════════════════════════
  async genererCarteAvantApres(cat = 'front') {
    const paire = this.getAvantApres(cat);
    if (!paire) {
      Utils.toast(
        'Pas assez de photos pour créer une comparaison !',
        'error'
      );
      return null;
    }

    const canvas  = document.createElement('canvas');
    canvas.width  = 1080;
    canvas.height = 1200; // ✅ NOUVEAU v2.0 — plus haut pour stats
    const ctx     = canvas.getContext('2d');

    // Fond gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1200);
    grad.addColorStop(0, '#09092d');
    grad.addColorStop(1, '#1a0030');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1200);

    // Titre
    ctx.fillStyle = '#bfa1ff';
    ctx.font      = 'bold 48px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('📸 MA PROGRESSION', 540, 80);

    let profil = { nom:'Athlète' };
    try { profil = Tracker.getProfil(); } catch(e) {}

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font      = '28px system-ui';
    ctx.fillText(profil.nom || '', 540, 125);

    const loadImg = src => new Promise((res) => {
      const img   = new Image();
      img.onload  = () => res(img);
      img.onerror = () => res(null);
      img.src     = src;
    });

    const [imgAvant, imgApres] = await Promise.all([
      loadImg(paire.avant.image),
      loadImg(paire.apres.image)
    ]);

    const phW = 490, phH = 700, phY = 160;

    const _rr = (ctx, x, y, w, h, r) => {
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
    };

    // Photo AVANT
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    _rr(ctx, 20, phY, phW, phH, 16);
    ctx.fill();

    if (imgAvant) {
      ctx.save();
      ctx.beginPath();
      _rr(ctx, 20, phY, phW, phH, 16);
      ctx.clip();
      const r = Math.max(
        phW/imgAvant.width, phH/imgAvant.height
      );
      ctx.drawImage(
        imgAvant,
        20 + (phW - imgAvant.width*r)/2,
        phY + (phH - imgAvant.height*r)/2,
        imgAvant.width*r, imgAvant.height*r
      );
      ctx.restore();
    }

    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    _rr(ctx, 20, phY+phH-80, phW, 80, 0);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font      = 'bold 32px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('AVANT', 20+phW/2, phY+phH-42);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font      = '22px system-ui';
    ctx.fillText(Utils.formatDateCourt(paire.avant.date),
      20+phW/2, phY+phH-15);
    if (paire.avant.poids) {
      ctx.fillText(
        `⚖️ ${paire.avant.poids}kg`,
        20+phW/2, phY+phH-37
      );
    }

    // Photo MAINTENANT
    ctx.fillStyle = 'rgba(75,75,249,0.1)';
    _rr(ctx, 570, phY, phW, phH, 16);
    ctx.fill();
    ctx.strokeStyle = '#4b4bf9';
    ctx.lineWidth   = 4;
    _rr(ctx, 570, phY, phW, phH, 16);
    ctx.stroke();

    if (imgApres) {
      ctx.save();
      ctx.beginPath();
      _rr(ctx, 570, phY, phW, phH, 16);
      ctx.clip();
      const r = Math.max(
        phW/imgApres.width, phH/imgApres.height
      );
      ctx.drawImage(
        imgApres,
        570 + (phW - imgApres.width*r)/2,
        phY  + (phH - imgApres.height*r)/2,
        imgApres.width*r, imgApres.height*r
      );
      ctx.restore();
    }

    ctx.fillStyle = '#4b4bf9';
    _rr(ctx, 570, phY+phH-80, phW, 80, 0);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font      = 'bold 32px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('MAINTENANT', 570+phW/2, phY+phH-42);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font      = '22px system-ui';
    ctx.fillText(Utils.formatDateCourt(paire.apres.date),
      570+phW/2, phY+phH-15);
    if (paire.apres.poids) {
      ctx.fillText(
        `⚖️ ${paire.apres.poids}kg`,
        570+phW/2, phY+phH-37
      );
    }

    // ✅ NOUVEAU v2.0 — Stats enrichies avec données réelles
    const statsY = phY + phH + 30;

    let totalSeances = 0, streak = 0, volumeTotal = 0;
    try { totalSeances = Tracker.getTotalSeances(); } catch(e) {}
    try { streak       = Tracker.getStreak().count; } catch(e) {}
    try {
      const seances = Tracker.getHistoriqueSeances(9999);
      volumeTotal   = seances.reduce(
        (a,s) => a + (s.volumeTotal||0), 0
      );
    } catch(e) {}

    let deltaPoids = null;
    if (paire.avant.poids && paire.apres.poids) {
      deltaPoids = Utils.arrondir(
        paire.apres.poids - paire.avant.poids
      );
    }

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    _rr(ctx, 20, statsY, 1040, 160, 16);
    ctx.fill();

    const statsData = [
      {
        label: 'Durée progression',
        val:   `${paire.delta}j`,
        color: '#bfa1ff'
      },
      {
        label: 'Séances totales',
        val:   `${totalSeances}`,
        color: '#4b4bf9'
      },
      {
        label: 'Streak actuel',
        val:   `${streak}🔥`,
        color: '#f9ef77'
      },
      {
        label: deltaPoids !== null ? 'Δ Poids' : 'Photos',
        val:   deltaPoids !== null
          ? `${deltaPoids > 0 ? '+' : ''}${deltaPoids}kg`
          : `${this.getToutes().length}📸`,
        color: deltaPoids !== null
          ? (deltaPoids <= 0 ? '#8bf0bb' : '#ff8d96')
          : '#8bf0bb'
      }
    ];

    const colW = 1040 / statsData.length;
    statsData.forEach((s, i) => {
      const x = 20 + i * colW + colW/2;
      ctx.fillStyle    = s.color;
      ctx.font         = 'bold 36px system-ui';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.val, x, statsY + 60);
      ctx.fillStyle    = 'rgba(255,255,255,0.4)';
      ctx.font         = '20px system-ui';
      ctx.fillText(s.label, x, statsY + 100);
    });

    ctx.textBaseline = 'alphabetic';

    // ✅ Footer PowerApp
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font      = '22px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('PowerApp · Généré par EverGPT', 540, 1175);

    return canvas;
  },

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  _getContainer() {
    return document.getElementById('page-photos')
      || document.getElementById('stats-content')
      || document.getElementById('page-content');
  },

  render(container) {
    if (!container) return;

    const stats  = this.getStats();
    const toutes = this.getToutes();

    container.innerHTML = `

      <!-- Stats rapides -->
      <div class="stats-grid mb-md">
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lavender)">
            ${stats.total}</span>
          <span class="stat-label">Photos</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-mint)">
            ${stats.nbJours}j</span>
          <span class="stat-label">Durée suivi</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lemon)">
            ${Object.values(stats.parCategorie)
              .filter(v => v > 0).length}</span>
          <span class="stat-label">Catégories</span>
        </div>
        <div class="stat-card">
          <span class="stat-value"
                style="color:${(stats.progPoids||0) <= 0
                  ? 'var(--fd-mint)' : 'var(--fd-coral)'}">
            ${stats.progPoids !== null
              ? `${stats.progPoids > 0 ? '+' : ''}${stats.progPoids}kg`
              : '—'}
          </span>
          <span class="stat-label">Δ Poids</span>
        </div>
      </div>

      <!-- Ajouter photo -->
      <div class="card mb-md"
           style="border-color:var(--fd-lavender);
                  border-style:dashed">
        <input type="file" id="photo-input"
               accept="image/*" capture="environment"
               style="display:none"
               onchange="Photos._handleInput(this)" />

        <div style="text-align:center;padding:var(--space-md)">
          <div style="font-size:2.5rem;
                      margin-bottom:var(--space-sm)">📸</div>
          <div style="font-weight:700;font-size:.95rem;
                      margin-bottom:4px">
            Ajouter une photo de progression
          </div>
          <div style="font-size:.75rem;color:var(--text-muted);
                      margin-bottom:var(--space-md)">
            Max ${this.CONFIG.maxPhotos} photos · JPEG compressé
          </div>

          <div style="display:grid;
                      grid-template-columns:1fr 1fr;
                      gap:var(--space-sm);
                      margin-bottom:var(--space-md)">
            <div>
              <div class="input-label">Catégorie</div>
              <select class="input" id="photo-cat">
                ${Object.entries(this.CATEGORIES).map(
                  ([k,v]) => `
                  <option value="${k}">
                    ${v.emoji} ${v.label}
                  </option>`
                ).join('')}
              </select>
            </div>
            <div>
              <div class="input-label">Poids actuel (opt)</div>
              <input class="input" id="photo-poids"
                     type="number"
                     placeholder="${(() => {
                       try {
                         return Tracker.getProfil().poids||'';
                       } catch(e) { return ''; }
                     })()} kg"
                     step="0.1"/>
            </div>
          </div>

          <div class="input-label">Note (optionnel)</div>
          <input class="input mb-md" id="photo-note"
                 placeholder="ex: Après 4 semaines de programme"/>

          <div style="display:grid;
                      grid-template-columns:1fr 1fr;
                      gap:var(--space-sm)">
            <button onclick="Photos._ouvrirCamera()"
                    class="btn-primary"
                    style="font-size:.85rem">
              📷 Prendre une photo
            </button>
            <button onclick="Photos._ouvrirGalerie()"
                    class="btn-secondary"
                    style="font-size:.85rem">
              🖼️ Galerie
            </button>
          </div>
        </div>
      </div>

      <!-- Avant / Après -->
      ${toutes.length >= 2 ? `
        <div class="section-title">🔄 Comparaison avant / après</div>
        <div class="card mb-md">
          <div class="input-label mb-sm">Catégorie</div>
          <select class="input mb-md" id="avap-cat"
                  onchange="Photos._renderAvantApres(this.value)">
            ${Object.entries(this.CATEGORIES).map(([k,v]) => `
              <option value="${k}">
                ${v.emoji} ${v.label}
              </option>`).join('')}
          </select>
          <div id="avap-preview"></div>
          <div id="avap-actions"
               style="display:none;margin-top:var(--space-md)">
            <div style="display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:var(--space-sm)">
              <button onclick="Photos._telechargerAvantApres()"
                      class="btn-secondary"
                      style="font-size:.82rem">
                💾 Télécharger
              </button>
              <button onclick="Photos._partagerAvantApres()"
                      class="btn-primary"
                      style="font-size:.82rem">
                📤 Partager
              </button>
            </div>
          </div>
        </div>` : ''}

      <!-- Filtres catégorie -->
      <div class="tabs-container mb-md">
        <button class="tab-btn active" id="tab-toutes"
                onclick="Photos._filtrerCat('toutes')">
          📸 Toutes (${toutes.length})
        </button>
        ${Object.entries(this.CATEGORIES)
          .filter(([k]) => toutes.some(p => p.categorie === k))
          .map(([k,v]) => `
            <button class="tab-btn" id="tab-${k}"
                    onclick="Photos._filtrerCat('${k}')">
              ${v.emoji} ${v.label}
              (${stats.parCategorie[k]})
            </button>`).join('')}
      </div>

      <!-- Grille photos -->
      <div id="photos-grille">
        ${this._renderGrille(toutes)}
      </div>

      <!-- Footer info -->
      <div style="text-align:center;font-size:.65rem;
                  color:var(--text-muted);
                  margin-top:var(--space-md)">
        ${toutes.length}/${this.CONFIG.maxPhotos} photos
        · ${this._calculerTaille(toutes)} Mo utilisés
      </div>
    `;

    // Initialiser avant/après
    if (toutes.length >= 2) {
      setTimeout(() => this._renderAvantApres('front'), 100);
    }
  },

  // ✅ NOUVEAU v2.0 — Grille avec lazy loading optimal
  _renderGrille(photos) {
    if (photos.length === 0) {
      return `
        <div class="card"
             style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:2rem;
                      margin-bottom:var(--space-sm)">📸</div>
          <p style="color:var(--text-muted);font-size:.88rem">
            Aucune photo dans cette catégorie.<br>
            Ajoutes-en une !
          </p>
        </div>`;
    }

    return `
      <div style="display:grid;
                  grid-template-columns:repeat(3,1fr);
                  gap:var(--space-sm)">
        ${photos.map((p, idx) => {
          const cat = this.CATEGORIES[p.categorie] || {};
          return `
            <div onclick="Photos._voirPhoto('${p.id}')"
                 data-idx="${idx}"
                 style="position:relative;
                        border-radius:var(--radius-md);
                        overflow:hidden;aspect-ratio:3/4;
                        cursor:pointer;
                        background:var(--bg-input)">
              <img src="${p.image}"
                   alt="Photo ${p.date}"
                   loading="lazy"
                   style="width:100%;height:100%;
                          object-fit:cover;
                          transition:transform .3s"
                   onmouseover="this.style.transform='scale(1.05)'"
                   onmouseout="this.style.transform='scale(1)'" />
              <div style="position:absolute;bottom:0;
                          left:0;right:0;
                          background:linear-gradient(
                            transparent,rgba(0,0,0,0.75));
                          padding:8px 6px 4px;
                          font-size:.6rem;color:white">
                <div style="font-weight:700">
                  ${cat.emoji||'📸'} ${p.date}
                </div>
                ${p.poids ? `
                  <div style="opacity:.8">
                    ⚖️ ${p.poids}kg
                  </div>` : ''}
              </div>
            </div>`;
        }).join('')}
      </div>`;
  },

  // ✅ NOUVEAU v2.0 — Navigation photo précédente/suivante
  _voirPhoto(id) {
    const toutes = this.getToutes();
    const idx    = toutes.findIndex(p => p.id === id);
    if (idx < 0) return;

    // ✅ Stocker pour navigation
    this._photosActuelles = toutes;
    this._indexActuel     = idx;

    this._afficherPhotoModal(toutes[idx], idx, toutes.length);
  },

  _afficherPhotoModal(photo, idx, total) {
    const cat     = this.CATEGORIES[photo.categorie] || {};
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const hasPrev = idx > 0;
    const hasNext = idx < total - 1;

    content.innerHTML = `
      <!-- Navigation + Titre -->
      <div style="display:flex;align-items:center;
                  gap:8px;margin-bottom:var(--space-sm)">
        <button onclick="Photos._navPhoto(-1)"
                ${hasPrev ? '' : 'disabled'}
                style="width:36px;height:36px;
                       border-radius:50%;
                       background:${hasPrev
                         ? 'var(--fd-indigo)'
                         : 'var(--bg-input)'};
                       border:none;color:white;
                       font-size:.9rem;cursor:pointer;
                       flex-shrink:0;
                       opacity:${hasPrev ? '1' : '.3'}">
          ←
        </button>
        <div style="flex:1;text-align:center">
          <div style="font-size:.72rem;color:var(--text-muted)">
            ${idx+1} / ${total}
          </div>
        </div>
        <button onclick="Photos._navPhoto(1)"
                ${hasNext ? '' : 'disabled'}
                style="width:36px;height:36px;
                       border-radius:50%;
                       background:${hasNext
                         ? 'var(--fd-indigo)'
                         : 'var(--bg-input)'};
                       border:none;color:white;
                       font-size:.9rem;cursor:pointer;
                       flex-shrink:0;
                       opacity:${hasNext ? '1' : '.3'}">
          →
        </button>
      </div>

      <!-- Image -->
      <img src="${photo.image}"
           alt="Photo progression"
           style="width:100%;max-height:380px;
                  object-fit:contain;
                  border-radius:var(--radius-lg);
                  margin-bottom:var(--space-md)"/>

      <!-- Infos -->
      <div style="display:flex;justify-content:space-between;
                  align-items:center;
                  margin-bottom:var(--space-sm)">
        <div>
          <div style="font-weight:700;font-size:.95rem">
            ${cat.emoji||'📸'} ${cat.label||photo.categorie}
          </div>
          <div style="font-size:.78rem;color:var(--text-muted)">
            ${Utils.formatDateLong(photo.date)}
          </div>
        </div>
        ${photo.poids ? `
          <div style="text-align:right">
            <div style="font-size:1.2rem;font-weight:800;
                        color:var(--fd-indigo)">
              ${photo.poids} kg
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Poids du jour
            </div>
          </div>` : ''}
      </div>

      ${photo.note ? `
        <div style="padding:var(--space-sm);
                    background:var(--bg-input);
                    border-radius:var(--radius-sm);
                    font-size:.82rem;
                    color:var(--text-secondary);
                    margin-bottom:var(--space-md)">
          💬 ${photo.note}
        </div>` : ''}

      <!-- Modifier note -->
      <div class="input-label">Note</div>
      <input class="input mb-md" id="edit-note"
             value="${photo.note||''}"
             placeholder="Ajouter une note..."/>

      <!-- Actions -->
      <div style="display:grid;
                  grid-template-columns:1fr 1fr 1fr;
                  gap:var(--space-sm)">
        <button onclick="Photos._sauvegarderNote('${photo.id}')"
                class="btn-secondary" style="font-size:.78rem">
          💾 Sauver
        </button>
        <button onclick="Photos.telecharger(
                  Photos._photosActuelles[Photos._indexActuel])"
                class="btn-secondary" style="font-size:.78rem">
          📥 Télécharger
        </button>
        <button onclick="Photos._confirmerSuppression('${photo.id}')"
                class="btn-secondary"
                style="font-size:.78rem;color:var(--fd-coral)">
          🗑️ Supprimer
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () =>
      modal.classList.add('hidden');
    modal.querySelector('.modal-overlay')
      ?.addEventListener('click',
        () => modal.classList.add('hidden'),
        { once:true }
      );
  },

  // ✅ NOUVEAU v2.0 — Navigation gauche/droite
  _navPhoto(direction) {
    const newIdx = this._indexActuel + direction;
    if (newIdx < 0 || newIdx >= this._photosActuelles.length) return;

    this._indexActuel = newIdx;
    const photo = this._photosActuelles[newIdx];

    this._afficherPhotoModal(
      photo,
      newIdx,
      this._photosActuelles.length
    );
  },

  _sauvegarderNote(id) {
    const note = document.getElementById('edit-note')
      ?.value?.trim();
    this.modifier(id, { note });
    Utils.toast('Note sauvegardée !', 'success');
    document.getElementById('modal-info')
      ?.classList.add('hidden');
  },

  async _confirmerSuppression(id) {
    const ok = await Utils.confirmer(
      'Supprimer cette photo ?',
      'Cette action est irréversible.'
    );
    if (!ok) return;
    this.supprimer(id);
    document.getElementById('modal-info')
      ?.classList.add('hidden');
    const container = this._getContainer();
    if (container) this.render(container);
  },

  _filtrerCat(cat) {
    document.querySelectorAll('.tabs-container .tab-btn')
      .forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${cat}`)
      ?.classList.add('active');

    const photos = cat === 'toutes'
      ? this.getToutes()
      : this.getParCategorie(cat);

    // ✅ Mettre à jour photosActuelles pour navigation
    this._photosActuelles = photos;

    const grille = document.getElementById('photos-grille');
    if (grille) grille.innerHTML = this._renderGrille(photos);
  },

  _renderAvantApres(cat) {
    const preview = document.getElementById('avap-preview');
    const actions = document.getElementById('avap-actions');
    if (!preview) return;

    const paire = this.getAvantApres(cat);

    if (!paire) {
      preview.innerHTML = `
        <div style="text-align:center;padding:var(--space-md);
                    color:var(--text-muted);font-size:.82rem">
          Pas assez de photos en
          "${this.CATEGORIES[cat]?.label||cat}".<br>
          Ajoute au moins 2 photos !
        </div>`;
      if (actions) actions.style.display = 'none';
      return;
    }

    // ✅ NOUVEAU v2.0 — Δ poids affiché
    let deltaPoids = null;
    if (paire.avant.poids && paire.apres.poids) {
      deltaPoids = Utils.arrondir(
        paire.apres.poids - paire.avant.poids
      );
    }

    preview.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:var(--space-sm);margin-bottom:var(--space-sm)">
        <div style="position:relative;
                    border-radius:var(--radius-md);
                    overflow:hidden;aspect-ratio:3/4">
          <img src="${paire.avant.image}"
               style="width:100%;height:100%;object-fit:cover"/>
          <div style="position:absolute;bottom:0;left:0;right:0;
                      background:rgba(0,0,0,0.7);padding:6px;
                      font-size:.72rem;color:white;
                      text-align:center;font-weight:700">
            AVANT · ${paire.avant.date}
            ${paire.avant.poids
              ? `<br>⚖️ ${paire.avant.poids}kg` : ''}
          </div>
        </div>
        <div style="position:relative;
                    border-radius:var(--radius-md);overflow:hidden;
                    border:2px solid var(--fd-indigo);
                    aspect-ratio:3/4">
          <img src="${paire.apres.image}"
               style="width:100%;height:100%;object-fit:cover"/>
          <div style="position:absolute;bottom:0;left:0;right:0;
                      background:var(--fd-indigo);padding:6px;
                      font-size:.72rem;color:white;
                      text-align:center;font-weight:700">
            MAINTENANT · ${paire.apres.date}
            ${paire.apres.poids
              ? `<br>⚖️ ${paire.apres.poids}kg` : ''}
          </div>
        </div>
      </div>

      <!-- Stats sous les photos -->
      <div style="display:flex;justify-content:space-around;
                  padding:10px;
                  background:rgba(255,255,255,0.04);
                  border-radius:var(--radius-md);
                  margin-bottom:8px">
        <div style="text-align:center">
          <div style="font-size:.9rem;font-weight:800;
                      color:var(--fd-lavender)">
            ${paire.delta}j
          </div>
          <div style="font-size:.58rem;color:var(--text-muted)">
            Durée
          </div>
        </div>
        ${deltaPoids !== null ? `
          <div style="text-align:center">
            <div style="font-size:.9rem;font-weight:800;
                        color:${deltaPoids <= 0
                          ? 'var(--fd-mint)' : 'var(--fd-coral)'}">
              ${deltaPoids > 0 ? '+' : ''}${deltaPoids}kg
            </div>
            <div style="font-size:.58rem;color:var(--text-muted)">
              Δ Poids
            </div>
          </div>` : ''}
        <div style="text-align:center">
          <div style="font-size:.9rem;font-weight:800;
                      color:var(--fd-mint)">
            ${(() => {
              try { return Tracker.getTotalSeances(); }
              catch(e) { return '—'; }
            })()}
          </div>
          <div style="font-size:.58rem;color:var(--text-muted)">
            Séances
          </div>
        </div>
        <div style="text-align:center">
          <div style="font-size:.9rem;font-weight:800;
                      color:var(--fd-lemon)">
            ${(() => {
              try { return Tracker.getStreak().count + '🔥'; }
              catch(e) { return '—'; }
            })()}
          </div>
          <div style="font-size:.58rem;color:var(--text-muted)">
            Streak
          </div>
        </div>
      </div>
    `;

    if (actions) actions.style.display = 'block';
    this._catAvantApres = cat;
  },

  async _telechargerAvantApres() {
    Utils.toast('⏳ Génération...', 'info', 2000);
    try {
      const canvas = await this.genererCarteAvantApres(
        this._catAvantApres
      );
      if (!canvas) return;
      const link    = document.createElement('a');
      link.download = `progression-${Utils.aujourd_hui()}.jpg`;
      link.href     = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      Utils.toast('📥 Image téléchargée !', 'success');
    } catch(e) {
      Utils.toast('❌ Erreur génération', 'error');
    }
  },

  async _partagerAvantApres() {
    Utils.toast('⏳ Préparation...', 'info', 2000);
    try {
      const canvas = await this.genererCarteAvantApres(
        this._catAvantApres
      );
      if (!canvas) return;

      canvas.toBlob(async blob => {
        const file = new File(
          [blob], `progression-${Utils.aujourd_hui()}.jpg`,
          { type:'image/jpeg' }
        );

        if (navigator.share && navigator.canShare?.({ files:[file] })) {
          const paire = this.getAvantApres(this._catAvantApres);
          await navigator.share({
            title: '📸 Ma progression',
            text:  `${paire?.delta || 0} jours de progression ! PowerApp`,
            files: [file]
          });
          Utils.toast('✅ Partagé !', 'success');
        } else {
          const link    = document.createElement('a');
          link.download = `progression-${Utils.aujourd_hui()}.jpg`;
          link.href     = URL.createObjectURL(blob);
          link.click();
          setTimeout(() => URL.revokeObjectURL(link.href), 1000);
          Utils.toast('💾 Image téléchargée !', 'success');
        }
      }, 'image/jpeg', 0.9);
    } catch(e) {
      Utils.toast('❌ Erreur partage', 'error');
    }
  },

  _ouvrirCamera() {
    const input = document.getElementById('photo-input');
    if (!input) return;
    input.setAttribute('capture', 'environment');
    input.click();
  },

  _ouvrirGalerie() {
    const input = document.getElementById('photo-input');
    if (!input) return;
    input.removeAttribute('capture');
    input.click();
  },

  async _handleInput(inputEl) {
    const fichier = inputEl.files?.[0];
    if (!fichier) return;

    const cat   = document.getElementById('photo-cat')
      ?.value || 'front';
    const poids = parseFloat(
      document.getElementById('photo-poids')?.value
    ) || null;
    const note  = document.getElementById('photo-note')
      ?.value?.trim() || '';

    Utils.toast('⏳ Compression...', 'info', 1500);

    const photo = await this.ajouterDepuisInput(fichier, {
      categorie: cat, poids, note
    });

    if (photo) {
      const container = this._getContainer();
      if (container) this.render(container);
    }

    inputEl.value = '';
  },

  _calculerTaille(photos) {
    const total = photos.reduce((acc,p) => acc + (p.taille||0), 0);
    return (total / 1024).toFixed(1);
  },

  nettoyer() {
    const photos = this.getToutes()
      .filter(p => p.image && p.date);
    Utils.storage.set(this.CONFIG.cle, photos);
    Utils.toast(`${photos.length} photos conservées.`, 'info');
  },

  exporter() {
    const data = {
      version: '2.0',
      date:    Utils.aujourd_hui(),
      photos:  this.getToutes()
    };
    const blob = new Blob(
      [JSON.stringify(data)],
      { type:'application/json' }
    );
    const link    = document.createElement('a');
    link.download = `photos-${Utils.aujourd_hui()}.json`;
    link.href     = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    Utils.toast('📤 Photos exportées !', 'success');
  }
};

// ✅ Connecter Tracker.getPhotos() à Photos
if (window.Tracker) {
  window.Tracker.getPhotos = () => Photos.getToutes();
}

window.Photos = Photos;
console.log('✅ Photos.js v2.0 chargé — Navigation + Stats enrichies + Avant/Après Δ poids');
