/* ═══════════════════════════════════════════════════════════
   UI PREMIUM v2 — PowerApp
   Fichier indépendant — ne modifie pas app.js
   ═══════════════════════════════════════════════════════════ */
'use strict';

// ── CSS Global Premium ──────────────────────────────────────
(function injectCSS() {
  if (document.getElementById('css-premium')) return;
  const s = document.createElement('style');
  s.id = 'css-premium';
  s.textContent = `
    /* ── Variables ── */
    :root {
      --fd-indigo:   #4b4bf9;
      --fd-midnight: #09092d;
      --fd-lemon:    #f9ef77;
      --fd-coral:    #ff8d96;
      --fd-lavender: #bfa1ff;
      --fd-mint:     #8bf0bb;
    }

    /* ── Animations ── */
    @keyframes pm-fadeUp {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0);    }
    }
    @keyframes pm-pulse {
      0%,100% { opacity:1; }
      50%     { opacity:.5; }
    }
    @keyframes pm-glow {
      0%,100% { box-shadow:0 0 12px currentColor; }
      50%     { box-shadow:0 0 24px currentColor; }
    }
    @keyframes pm-spin {
      to { transform:rotate(360deg); }
    }
    @keyframes pm-progressFill {
      from { width:0%; }
    }
    @keyframes pm-countUp {
      from { opacity:0; transform:scale(.5); }
      to   { opacity:1; transform:scale(1);  }
    }
    @keyframes pm-slideIn {
      from { opacity:0; transform:translateX(-10px); }
      to   { opacity:1; transform:translateX(0);     }
    }
    @keyframes pm-ringPop {
      0%  { transform:scale(.8); opacity:0; }
      60% { transform:scale(1.1);            }
      100%{ transform:scale(1);  opacity:1; }
    }
    @keyframes pm-toastIn {
      from { opacity:0; transform:translateX(100%) scale(.8); }
      to   { opacity:1; transform:translateX(0)    scale(1);  }
    }
    @keyframes pm-toastOut {
      from { opacity:1; transform:translateX(0);    }
      to   { opacity:0; transform:translateX(100%); }
    }
    @keyframes pm-avatarPulse {
      0%,100% { box-shadow:0 0 20px rgba(75,75,249,.5); }
      50%     { box-shadow:0 0 36px rgba(75,75,249,.8); }
    }
    @keyframes pm-liveDot {
      0%,100% { opacity:1; transform:scale(1);   }
      50%     { opacity:.4; transform:scale(1.4); }
    }

    /* ── Composants réutilisables ── */
    .pm-card {
      background:var(--bg-card, rgba(255,255,255,.04));
      border:1px solid var(--border-color, rgba(255,255,255,.08));
      border-radius:18px;
      padding:16px;
      margin-bottom:12px;
    }
    .pm-section-title {
      font-size:.58rem;font-weight:800;
      text-transform:uppercase;letter-spacing:.1em;
      color:rgba(255,255,255,.3);
      display:flex;align-items:center;gap:8px;
      margin:16px 0 10px;
    }
    .pm-section-title::after {
      content:'';flex:1;height:1px;
      background:rgba(255,255,255,.06);
    }
    .pm-chip {
      display:inline-flex;align-items:center;
      padding:4px 10px;border-radius:99px;
      font-size:.6rem;font-weight:700;
      text-transform:uppercase;letter-spacing:.04em;
      background:rgba(75,75,249,.2);
      color:var(--fd-lavender);
      border:1px solid rgba(75,75,249,.3);
    }
    .pm-progress {
      height:5px;background:rgba(255,255,255,.06);
      border-radius:99px;overflow:hidden;
    }
    .pm-progress-fill {
      height:100%;border-radius:99px;
      background:linear-gradient(90deg,var(--fd-indigo),var(--fd-mint));
      animation:pm-progressFill .8s ease forwards;
    }
    .pm-btn-primary {
      background:var(--fd-indigo);border:none;
      border-radius:99px;color:white;font-weight:700;
      cursor:pointer;padding:12px 22px;font-size:.85rem;
      box-shadow:0 4px 20px rgba(75,75,249,.4);
      transition:all .2s;
    }
    .pm-btn-primary:hover { transform:scale(1.03); }
    .pm-btn-primary:active { transform:scale(.97); }

    /* ── Serie blocs ── */
    .pm-serie {
      padding:14px;
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);
      border-radius:14px;margin-bottom:8px;
      transition:all .3s;
    }
    .pm-serie.active {
      border-color:rgba(75,75,249,.4);
      background:rgba(75,75,249,.06);
      box-shadow:0 0 20px rgba(75,75,249,.08);
    }
    .pm-serie.done {
      border-color:rgba(139,240,187,.25);
      background:rgba(139,240,187,.04);
      opacity:.75;
    }

    /* ── Input ── */
    .pm-input {
      width:100%;padding:10px 4px;
      font-size:1.3rem;font-weight:800;
      text-align:center;
      background:rgba(255,255,255,.06);
      border:2px solid rgba(255,255,255,.1);
      border-radius:12px;color:white;outline:none;
      transition:border-color .2s;
      -webkit-appearance:none;
    }
    .pm-input:focus { border-color:var(--fd-indigo); }

    /* ── RPE ── */
    .pm-rpe-btn {
      flex:1;padding:8px 2px;
      font-size:.78rem;font-weight:700;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.08);
      border-radius:8px;color:rgba(255,255,255,.4);
      cursor:pointer;transition:all .15s;text-align:center;
    }
    .pm-rpe-btn.active,
    .pm-rpe-btn:hover {
      background:rgba(75,75,249,.25);
      border-color:rgba(75,75,249,.4);
      color:white;
    }

    /* ── Timer overlay ── */
    .pm-repos-overlay {
      background:rgba(9,9,45,.98);
      border:1px solid rgba(139,240,187,.3);
      border-radius:22px;padding:24px 20px;
      text-align:center;margin-bottom:12px;
      animation:pm-ringPop .4s ease;
    }

    /* ── Onboarding ── */
    .pm-ob-option {
      display:flex;align-items:center;gap:12px;
      padding:14px 16px;
      background:rgba(255,255,255,.04);
      border:2px solid rgba(255,255,255,.1);
      border-radius:16px;cursor:pointer;
      transition:all .2s;margin-bottom:8px;
    }
    .pm-ob-option.selected,
    .pm-ob-option:hover {
      background:rgba(75,75,249,.15);
      border-color:rgba(75,75,249,.4);
    }
    .pm-ob-option:active { transform:scale(.98); }

    /* ── Menu items ── */
    .pm-menu-item {
      display:flex;align-items:center;gap:10px;
      padding:13px 14px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.07);
      border-radius:14px;cursor:pointer;transition:all .18s;
    }
    .pm-menu-item:hover { transform:scale(1.02); }

    /* ── Toast container ── */
    #pm-toast-container {
      position:fixed;top:calc(var(--header-height,56px) + 8px);
      right:12px;z-index:9999;
      display:flex;flex-direction:column;gap:8px;
      pointer-events:none;max-width:300px;
    }
    .pm-toast {
      padding:12px 16px;border-radius:14px;
      display:flex;align-items:flex-start;gap:10px;
      font-size:.82rem;font-weight:700;
      pointer-events:all;
      animation:pm-toastIn .35s cubic-bezier(.34,1.56,.64,1);
      box-shadow:0 8px 24px rgba(0,0,0,.4);
    }
    .pm-toast.success {
      background:rgba(139,240,187,.15);
      border:1px solid rgba(139,240,187,.35);
      color:var(--fd-mint);
    }
    .pm-toast.error {
      background:rgba(255,141,150,.15);
      border:1px solid rgba(255,141,150,.35);
      color:var(--fd-coral);
    }
    .pm-toast.pr {
      background:linear-gradient(135deg,rgba(249,239,119,.2),rgba(249,239,119,.05));
      border:1px solid rgba(249,239,119,.4);
      color:var(--fd-lemon);
    }
    .pm-toast.info {
      background:rgba(75,75,249,.15);
      border:1px solid rgba(75,75,249,.3);
      color:#818cf8;
    }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// HELPERS LOCAUX
// ═══════════════════════════════════════════════════════════
const PM = {

  // ── Safe getter ──
  get(fn, fallback) {
    try { return fn(); } catch(e) { return fallback; }
  },

  // ── Format volume ──
  vol(v) {
    if (!v) return '0kg';
    if (v >= 1000) return (v/1000).toFixed(1)+'T';
    return v+'kg';
  },

  // ── Date FR ──
  dateFR() {
    return new Date().toLocaleDateString('fr-FR',{
      weekday:'long', day:'numeric', month:'short'
    });
  },

  // ── Heure salut ──
  salut() {
    const h = new Date().getHours();
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  },

  // ── HTML section title ──
  sectionTitle(label, extra = '') {
    return `
      <div class="pm-section-title">
        ${label}
        ${extra}
      </div>`;
  },

  // ── Toast ──
  toast(msg, type = 'success', duree = 2800) {
    let container = document.getElementById('pm-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'pm-toast-container';
      document.body.appendChild(container);
    }
    const icons = {
      success:'✅', error:'❌', pr:'🏆', info:'ℹ️', warning:'⚠️'
    };
    const parts  = msg.split('\n');
    const toast  = document.createElement('div');
    toast.className = `pm-toast ${type}`;
    toast.innerHTML = `
      <span style="font-size:1.2rem;flex-shrink:0">${icons[type]||'💬'}</span>
      <div style="flex:1">
        <div style="font-weight:800">${parts[0]}</div>
        ${parts[1]
          ? `<div style="font-size:.72rem;opacity:.8;margin-top:2px">${parts[1]}</div>`
          : ''}
      </div>
      <button onclick="this.parentElement.remove()"
              style="background:none;border:none;color:currentColor;
                     font-size:.9rem;cursor:pointer;opacity:.5">✕</button>
    `;
    container.appendChild(toast);
    if (container.children.length > 4) container.children[0].remove();
    setTimeout(() => {
      toast.style.animation = 'pm-toastOut .3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duree);
  }
};

// ═══════════════════════════════════════════════════════════
// PAGE HOME v2
// ═══════════════════════════════════════════════════════════
function _rendreHome(container) {

  // ── Data ──
  const profil  = PM.get(() => Tracker.getProfil(),
                    { nom:'Athlète', avatar:'💪' });
  const seance  = PM.get(() => Programme.getSeanceduJour(), null);
  const infos   = PM.get(() => Programme.getInfosProgramme(),
                    { label:'S1', cycle:1,
                      phase:{ emoji:'🌱', nom:'Reprise', couleur:'#8bf0bb' } });
  const streak  = PM.get(() => Tracker.getStreak(), { count:0 });
  const xp      = PM.get(() => Gamification.getXP(),
                    { total:0, pourcentage:0,
                      niveau:{ emoji:'💪', numero:1, nom:'Débutant' } });
  const analyse = PM.get(() => Coach.getAnalyseSemaine(),
                    { seances:0, objectif:4, volume:0, rpe:0 });
  const msg     = PM.get(() => Coach.getMessageDuJour(),
                    { emoji:'💡', message:'Bonne séance aujourd\'hui !' });
  const planning= PM.get(() => Programme.getSeancesSemaine(), []);
  const defis   = PM.get(() =>
                    (Defis.mettreAJourProgression()||[])
                    .filter(d=>!d.complete).slice(0,2), []);

  // ── Séance faite ? ──
  const sd = PM.get(() => Tracker.getSeanceDuJour(), null);
  const seanceFaite = !!(sd?.terminee || sd?.series?.length > 0);
  const statsSd = {
    volume: sd?.volumeTotal   || 0,
    series: sd?.series?.length || 0,
    prs:    (sd?.prs||[]).length
  };

  // ── Streak ring ──
  const streakDash = Math.min(132, streak.count * 5);

  // ── XP ring ──
  const xpDash = Math.round((xp.pourcentage / 100) * 132);

  // ── Planning semaine ──
  const planningHTML = planning.length > 0 ? `
    ${PM.sectionTitle('📅 Planning semaine',
      `<span style="font-weight:700;color:var(--fd-mint)">
        ${Math.round((analyse.seances/Math.max(analyse.objectif,1))*100)}%
      </span>`)}
    <div class="pm-card">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:10px">
        ${planning.map(j => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
            <div onclick="PlanningEditor?.ouvrirChoixSeance(${j.jour})"
                 style="width:36px;height:36px;border-radius:10px;
                        display:flex;align-items:center;justify-content:center;
                        font-size:.8rem;font-weight:700;cursor:pointer;
                        transition:all .2s;
                        ${j.estAujourdhui
                          ? 'background:var(--fd-indigo);color:white;box-shadow:0 0 12px rgba(75,75,249,.5)'
                          : j.seance
                            ? 'background:rgba(75,75,249,.2);border:1px solid rgba(75,75,249,.4);color:var(--fd-lavender)'
                            : 'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.3)'}"
                 onmouseenter="this.style.transform='scale(1.1)'"
                 onmouseleave="this.style.transform=''">
              ${j.estAujourdhui ? '▶' : j.seance ? j.seance.emoji : '·'}
            </div>
            <div style="font-size:.46rem;color:rgba(255,255,255,.3);
                        text-transform:uppercase;font-weight:600">
              ${j.label}
            </div>
          </div>`).join('')}
      </div>
      <div class="pm-progress">
        <div class="pm-progress-fill"
             style="width:${Math.round((analyse.seances/Math.max(analyse.objectif,1))*100)}%">
        </div>
      </div>
    </div>` : '';

  // ── Défis HTML ──
  const defisHTML = defis.length > 0 ? `
    ${PM.sectionTitle('🏆 Défis en cours')}
    <div class="pm-card" style="cursor:pointer" onclick="naviguer('defis')">
      ${defis.map(d => {
        const pct = Math.round((d.progression/Math.max(d.cible,1))*100);
        return `
          <div style="margin-bottom:${defis.indexOf(d)<defis.length-1?'10px':'0'}">
            <div style="display:flex;justify-content:space-between;
                        font-size:.78rem;margin-bottom:5px">
              <span>${d.emoji} ${d.titre}</span>
              <span style="color:var(--fd-lemon);font-weight:700">
                ${d.progression}/${d.cible}
              </span>
            </div>
            <div class="pm-progress">
              <div class="pm-progress-fill"
                   style="width:${pct}%;
                          background:linear-gradient(90deg,var(--fd-lemon),var(--fd-mint));
                          box-shadow:0 0 6px var(--fd-lemon)">
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>` : '';

  // ── Hero séance ──
  const heroHTML = seanceFaite && seance ? `
    <div style="background:linear-gradient(135deg,
                rgba(139,240,187,.2),rgba(139,240,187,.06) 60%,
                rgba(75,75,249,.04) 100%);
                border:1px solid rgba(139,240,187,.4);
                border-radius:22px;padding:20px;margin-bottom:14px;
                position:relative;overflow:hidden;
                box-shadow:0 4px 24px rgba(139,240,187,.1);
                animation:pm-fadeUp .4s .2s ease both">
      <div style="position:absolute;top:-40px;right:-30px;width:150px;height:150px;
                  background:radial-gradient(circle,rgba(139,240,187,.15) 0%,transparent 70%);
                  pointer-events:none"></div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;position:relative;z-index:1">
        <div style="width:7px;height:7px;border-radius:50%;
                    background:var(--fd-mint);box-shadow:0 0 8px var(--fd-mint)"></div>
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.12em;color:var(--fd-mint)">
          ✅ Séance complétée !
        </div>
      </div>
      <div style="font-size:1.35rem;font-weight:800;margin-bottom:14px;position:relative;z-index:1">
        ${seance.emoji} ${seance.nom}
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;
                  margin-bottom:14px;position:relative;z-index:1">
        ${[
          {emoji:'📦',val:PM.vol(statsSd.volume),label:'Volume', c:'var(--fd-mint)'  },
          {emoji:'💪',val:statsSd.series,         label:'Séries', c:'var(--fd-indigo)'},
          {emoji:'🏆',val:statsSd.prs||'—',       label:'Records',c:'var(--fd-lemon)' }
        ].map(s=>`
          <div style="background:rgba(255,255,255,.05);
                      border:1px solid rgba(139,240,187,.15);
                      border-radius:12px;padding:10px 6px;text-align:center">
            <div style="font-size:.82rem;margin-bottom:2px">${s.emoji}</div>
            <div style="font-size:.95rem;font-weight:800;color:${s.c}">${s.val}</div>
            <div style="font-size:.5rem;color:rgba(255,255,255,.4);margin-top:2px;
                        text-transform:uppercase;letter-spacing:.04em">${s.label}</div>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;position:relative;z-index:1">
        <button onclick="naviguer('live')"
                style="flex:1;padding:10px;background:rgba(139,240,187,.15);
                       border:1px solid rgba(139,240,187,.3);border-radius:99px;
                       font-size:.75rem;font-weight:700;color:var(--fd-mint);cursor:pointer">
          📊 Résumé
        </button>
        <button onclick="naviguer('stats')"
                style="flex:1;padding:10px;background:rgba(75,75,249,.12);
                       border:1px solid rgba(75,75,249,.25);border-radius:99px;
                       font-size:.75rem;font-weight:700;color:var(--fd-indigo);cursor:pointer">
          📈 Stats
        </button>
      </div>
    </div>` :

  seance ? `
    <div style="background:linear-gradient(135deg,
                rgba(75,75,249,.22),rgba(75,75,249,.07) 55%,
                rgba(191,161,255,.05) 100%);
                border:1px solid rgba(75,75,249,.4);
                border-radius:22px;padding:20px;margin-bottom:14px;
                position:relative;overflow:hidden;
                box-shadow:0 4px 24px rgba(75,75,249,.2);
                animation:pm-fadeUp .4s .2s ease both">
      <div style="position:absolute;top:-50px;right:-30px;width:180px;height:180px;
                  background:radial-gradient(circle,rgba(75,75,249,.2) 0%,transparent 70%);
                  pointer-events:none"></div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;position:relative;z-index:1">
        <div style="width:7px;height:7px;border-radius:50%;
                    background:var(--fd-indigo);box-shadow:0 0 8px var(--fd-indigo);
                    animation:pm-pulse 2s infinite"></div>
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.12em;color:var(--fd-indigo)">
          Séance du jour
        </div>
      </div>
      <div style="font-size:1.4rem;font-weight:800;letter-spacing:-.02em;
                  margin-bottom:4px;position:relative;z-index:1">
        ${seance.emoji} ${seance.nom}
      </div>
      <div style="font-size:.75rem;color:rgba(255,255,255,.45);
                  margin-bottom:16px;position:relative;z-index:1">
        ~${seance.duree_estimee || 60}min
        · ${seance.exercices?.length || 0} exercices
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;
                  position:relative;z-index:1;flex-wrap:wrap;gap:10px">
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          ${(seance.muscles||[]).map(m=>`
            <span class="pm-chip">${m}</span>`).join('')}
        </div>
        <button onclick="naviguer('live')"
                style="padding:12px 20px;background:var(--fd-indigo);
                       color:white;border:none;border-radius:99px;
                       font-size:.82rem;font-weight:700;cursor:pointer;
                       box-shadow:0 4px 20px rgba(75,75,249,.5);
                       transition:all .2s"
                onmouseenter="this.style.transform='scale(1.05)'"
                onmouseleave="this.style.transform=''">
          ▶ Démarrer
        </button>
      </div>
    </div>` :

  `<div style="border-radius:22px;padding:20px;margin-bottom:14px;
               background:rgba(139,240,187,.06);
               border:1px solid rgba(139,240,187,.2);text-align:center;
               animation:pm-fadeUp .4s .2s ease both">
    <div style="font-size:2rem;margin-bottom:6px">😴</div>
    <div style="font-weight:700;font-size:1rem">Jour de repos</div>
    <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:4px">
      Profite pour récupérer 💆
    </div>
  </div>`;

  // ── Render ──
  container.innerHTML = `

    <!-- Bouton personnaliser -->
    <div style="display:flex;justify-content:flex-end;margin-bottom:6px">
      <button onclick="_ouvrirConfigWidgets && _ouvrirConfigWidgets()"
              style="display:flex;align-items:center;gap:6px;padding:6px 12px;
                     font-size:.68rem;font-weight:700;
                     background:rgba(75,75,249,.1);
                     border:1px solid rgba(75,75,249,.2);
                     border-radius:99px;color:var(--fd-indigo);cursor:pointer">
        🎛️ Personnaliser
      </button>
    </div>

    <!-- Greeting -->
    <div style="padding:8px 0 18px;animation:pm-fadeUp .3s ease">
      <div style="font-size:.68rem;color:rgba(255,255,255,.4);font-weight:600;
                  margin-bottom:5px;display:flex;align-items:center;gap:6px">
        <div style="width:6px;height:6px;border-radius:50%;
                    background:var(--fd-mint);box-shadow:0 0 6px var(--fd-mint);
                    animation:pm-pulse 2s infinite"></div>
        ${PM.dateFR()} · ${infos.label} · Cycle ${infos.cycle}
      </div>
      <div style="font-size:1.7rem;font-weight:800;letter-spacing:-.03em;line-height:1.1">
        ${PM.salut()},
        <span style="background:linear-gradient(135deg,#fff 0%,var(--fd-lavender) 100%);
                     -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                     background-clip:text">${profil.nom}</span>
        ${profil.avatar || '💪'}
      </div>
      <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:5px;
                  display:flex;align-items:center;gap:5px">
        <div style="width:4px;height:4px;border-radius:50%;
                    background:var(--fd-indigo)"></div>
        ${infos.phase.emoji} ${infos.phase.nom} · ${xp.niveau.nom}
      </div>
    </div>

    <!-- Rings Streak + XP -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">

      <!-- Streak -->
      <div onclick="naviguer('stats')"
           style="background:rgba(255,255,255,.04);
                  border:1px solid rgba(255,255,255,.08);
                  border-radius:18px;padding:14px;
                  display:flex;align-items:center;gap:12px;
                  position:relative;overflow:hidden;cursor:pointer;
                  transition:all .25s;animation:pm-fadeUp .4s ease"
           onmouseenter="this.style.borderColor='rgba(249,239,119,.35)';this.style.transform='translateY(-2px)'"
           onmouseleave="this.style.borderColor='rgba(255,255,255,.08)';this.style.transform=''">
        <svg width="50" height="50" viewBox="0 0 50 50" style="flex-shrink:0">
          <circle cx="25" cy="25" r="21" fill="none"
                  stroke="rgba(249,239,119,.12)" stroke-width="5"/>
          <circle cx="25" cy="25" r="21" fill="none"
                  stroke="#f9ef77" stroke-width="5"
                  stroke-linecap="round"
                  stroke-dasharray="${streakDash} ${132-streakDash}"
                  transform="rotate(-90 25 25)"
                  style="filter:drop-shadow(0 0 4px #f9ef77);transition:stroke-dasharray .8s"/>
          <text x="25" y="30" text-anchor="middle"
                fill="#f9ef77" font-size="14" font-weight="800">🔥</text>
        </svg>
        <div>
          <div style="font-size:1.5rem;font-weight:800;color:var(--fd-lemon);line-height:1">
            ${streak.count}
          </div>
          <div style="font-size:.58rem;color:rgba(255,255,255,.4);
                      text-transform:uppercase;letter-spacing:.06em;margin-top:2px">
            Streak
          </div>
          <div style="font-size:.55rem;color:rgba(255,255,255,.3)">jours</div>
        </div>
      </div>

      <!-- XP -->
      <div onclick="naviguer('gamification')"
           style="background:rgba(255,255,255,.04);
                  border:1px solid rgba(255,255,255,.08);
                  border-radius:18px;padding:14px;
                  display:flex;align-items:center;gap:12px;
                  position:relative;overflow:hidden;cursor:pointer;
                  transition:all .25s;animation:pm-fadeUp .4s .1s ease both"
           onmouseenter="this.style.borderColor='rgba(75,75,249,.35)';this.style.transform='translateY(-2px)'"
           onmouseleave="this.style.borderColor='rgba(255,255,255,.08)';this.style.transform=''">
        <svg width="50" height="50" viewBox="0 0 50 50" style="flex-shrink:0">
          <circle cx="25" cy="25" r="21" fill="none"
                  stroke="rgba(75,75,249,.15)" stroke-width="5"/>
          <circle cx="25" cy="25" r="21" fill="none"
                  stroke="#4b4bf9" stroke-width="5"
                  stroke-linecap="round"
                  stroke-dasharray="${xpDash} ${132-xpDash}"
                  transform="rotate(-90 25 25)"
                  style="filter:drop-shadow(0 0 4px #4b4bf9);transition:stroke-dasharray .8s"/>
          <text x="25" y="29" text-anchor="middle"
                fill="#bfa1ff" font-size="9" font-weight="800">
            N${xp.niveau.numero}
          </text>
        </svg>
        <div>
          <div style="font-size:1.3rem;font-weight:800;color:var(--fd-lavender);line-height:1">
            ${xp.total}
          </div>
          <div style="font-size:.58rem;color:rgba(255,255,255,.4);
                      text-transform:uppercase;letter-spacing:.06em;margin-top:2px">
            XP total
          </div>
          <div style="font-size:.55rem;color:rgba(255,255,255,.3)">${xp.niveau.nom}</div>
        </div>
      </div>
    </div>

    <!-- Hero séance -->
    ${heroHTML}

    <!-- Stats semaine -->
    ${PM.sectionTitle('📊 Cette semaine')}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
      ${[
        {emoji:'📅',val:`${analyse.seances}/${analyse.objectif}`,label:'Séances',c:'var(--fd-indigo)',delay:'0s'  },
        {emoji:'📦',val:PM.vol(analyse.volume),                  label:'Volume', c:'var(--fd-mint)',  delay:'.08s'},
        {emoji:'😤',val:analyse.rpe>0?`${analyse.rpe}/10`:'—',  label:'RPE',    c:'var(--fd-lemon)', delay:'.16s'}
      ].map(s=>`
        <div onclick="naviguer('stats')"
             style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                    border-radius:14px;padding:12px 8px;text-align:center;
                    cursor:pointer;transition:all .2s;
                    animation:pm-fadeUp .4s ${s.delay} ease both"
             onmouseenter="this.style.transform='translateY(-3px)'"
             onmouseleave="this.style.transform=''">
          <div style="font-size:.82rem;margin-bottom:4px">${s.emoji}</div>
          <div style="font-size:.95rem;font-weight:800;color:${s.c}">${s.val}</div>
          <div style="font-size:.52rem;color:rgba(255,255,255,.3);margin-top:3px;
                      text-transform:uppercase;letter-spacing:.04em">${s.label}</div>
        </div>`).join('')}
    </div>

    <!-- Planning -->
    ${planningHTML}

    <!-- Timers repos -->
    ${PM.sectionTitle('⏱ Timers repos')}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
      ${[
        {icon:'⚡',val:'45s', label:'Express',sec:45, c:'#4b4bf9'},
        {icon:'💪',val:'60s', label:'Normal', sec:60, c:'#8bf0bb'},
        {icon:'🏋️',val:'90s', label:'Force',  sec:90, c:'#f9ef77'},
        {icon:'🔥',val:'2min',label:'Lourd',  sec:120,c:'#ff8d96'}
      ].map((t,i)=>`
        <div onclick="typeof TimerManager!=='undefined'&&TimerManager.demarrerRepos(${t.sec})"
             style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                    border-radius:14px;padding:12px 4px;text-align:center;
                    cursor:pointer;transition:all .2s;
                    animation:pm-fadeUp .4s ${.3+i*.06}s ease both"
             onmouseenter="this.style.background='${t.c}12';this.style.borderColor='${t.c}33';this.style.transform='scale(.95)'"
             onmouseleave="this.style.background='rgba(255,255,255,.04)';this.style.borderColor='rgba(255,255,255,.08)';this.style.transform=''">
          <div style="font-size:1.2rem;margin-bottom:4px">${t.icon}</div>
          <div style="font-size:.8rem;font-weight:800;color:${t.c}">${t.val}</div>
          <div style="font-size:.52rem;color:rgba(255,255,255,.3);margin-top:1px;
                      text-transform:uppercase">${t.label}</div>
        </div>`).join('')}
    </div>

    <!-- Défis -->
    ${defisHTML}

    <!-- Coach du jour -->
    <div onclick="naviguer('coach')"
         style="background:rgba(255,255,255,.04);
                border:1px solid rgba(255,255,255,.08);
                border-left:3px solid var(--fd-lavender);
                border-radius:18px;padding:14px 16px;margin-bottom:14px;
                cursor:pointer;transition:all .2s;
                animation:pm-fadeUp .4s .5s ease both"
         onmouseenter="this.style.transform='translateX(4px)'"
         onmouseleave="this.style.transform=''">
      <div style="font-size:.62rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--fd-lavender);margin-bottom:5px">
        ${msg.emoji} Coach du jour
      </div>
      <p style="font-size:.82rem;color:rgba(255,255,255,.7);line-height:1.55;margin:0">
        ${msg.message}
      </p>
    </div>

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE STATS v2
// ═══════════════════════════════════════════════════════════
function _rendreStats(container) {

  const analyse = PM.get(() => Coach.getAnalyseSemaine(),
                    { seances:0, objectif:4, volume:0, rpe:0 });
  const prs     = PM.get(() => Tracker.getPRs(), []);
  const muscles = PM.get(() => Tracker.getRepartitionMuscles(),
                    [
                      { nom:'Pectoraux', pct:40, couleur:'#4b4bf9' },
                      { nom:'Épaules',   pct:24, couleur:'#8bf0bb' },
                      { nom:'Triceps',   pct:20, couleur:'#f9ef77' },
                      { nom:'Dos',       pct:16, couleur:'#bfa1ff' }
                    ]);
  const historique = PM.get(() => Tracker.getHistoriqueVolume7j(), []);

  // Donut SVG
  let offset = 0;
  const total = muscles.reduce((s,m) => s + m.pct, 0) || 100;
  const circonference = 276;
  const donutArcs = muscles.map(m => {
    const dash = (m.pct / total) * circonference;
    const arc  = `<circle cx="55" cy="55" r="44" fill="none"
      stroke="${m.couleur}" stroke-width="16"
      stroke-dasharray="${dash} ${circonference - dash}"
      stroke-dashoffset="${-offset}"
      transform="rotate(-90 55 55)"
      style="filter:drop-shadow(0 0 3px ${m.couleur})"/>`;
    offset += dash;
    return arc;
  }).join('');

  // Graphique SVG volume
  const pts = historique.length >= 7
    ? historique.slice(-7)
    : Array(7).fill(0).map((_,i) => ({
        vol: [100,200,150,320,180,400,250][i] || 0
      }));
  const maxVol = Math.max(...pts.map(p => p.vol || p), 1);
  const W = 320, H = 120;
  const svgPts = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * W;
    const y = H - ((p.vol || p) / maxVol) * (H - 10) - 5;
    return [x, y];
  });
  const pathD = svgPts.map((p,i) =>
    i === 0 ? `M${p[0]},${p[1]}`
    : `C${svgPts[i-1][0]+20},${svgPts[i-1][1]} ${p[0]-20},${p[1]} ${p[0]},${p[1]}`
  ).join(' ');
  const areaD = pathD + ` L${W},${H} L0,${H}Z`;

  // Score de forme
  const score = PM.get(() => {
    const a = Coach.getAnalyseSemaine();
    return Math.round(
      (a.seances / Math.max(a.objectif, 1)) * 40 +
      (streak?.count > 0 ? 30 : 10) +
      30
    );
  }, 72);

  container.innerHTML = `

    <!-- Stats 3 -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
      ${[
        {emoji:'📅',val:`${analyse.seances}/${analyse.objectif}`,label:'Séances',c:'var(--fd-indigo)',d:'0s'  },
        {emoji:'📦',val:PM.vol(analyse.volume),                  label:'Volume', c:'var(--fd-mint)',  d:'.1s' },
        {emoji:'😤',val:analyse.rpe>0?`${analyse.rpe}/10`:'—',  label:'RPE moy.',c:'var(--fd-lemon)',d:'.2s' }
      ].map(s=>`
        <div onclick="naviguer('history')"
             style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                    border-radius:14px;padding:12px 8px;text-align:center;
                    cursor:pointer;transition:all .2s;
                    animation:pm-countUp .4s ${s.d} ease both"
             onmouseenter="this.style.transform='translateY(-3px)'"
             onmouseleave="this.style.transform=''">
          <div style="font-size:.88rem;margin-bottom:4px">${s.emoji}</div>
          <div style="font-size:.95rem;font-weight:800;color:${s.c}">${s.val}</div>
          <div style="font-size:.52rem;color:rgba(255,255,255,.3);margin-top:3px;
                      text-transform:uppercase;letter-spacing:.04em">${s.label}</div>
        </div>`).join('')}
    </div>

    <!-- Graphique volume -->
    <div class="pm-card">
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:12px">
        📈 Volume 7 derniers jours
      </div>
      <svg width="100%" height="120" viewBox="0 0 320 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pm-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4b4bf9" stop-opacity=".35"/>
            <stop offset="100%" stop-color="#4b4bf9" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${[30,60,90].map(y=>`
          <line x1="0" y1="${y}" x2="320" y2="${y}"
                stroke="rgba(255,255,255,.04)" stroke-width="1"/>`).join('')}
        <path d="${areaD}" fill="url(#pm-grad)"/>
        <path d="${pathD}" fill="none" stroke="#4b4bf9" stroke-width="2.5"
              stroke-linecap="round"
              style="filter:drop-shadow(0 0 6px #4b4bf9)"/>
        ${svgPts.map(([x,y])=>`
          <circle cx="${x}" cy="${y}" r="4" fill="#4b4bf9"
                  style="filter:drop-shadow(0 0 4px #4b4bf9)"/>`).join('')}
      </svg>
      <div style="display:flex;justify-content:space-between;
                  margin-top:6px;font-size:.55rem;color:rgba(255,255,255,.3)">
        ${['L','M','M','J','V','S','D'].map(d=>`<span>${d}</span>`).join('')}
      </div>
    </div>

    <!-- Donut muscles -->
    <div class="pm-card">
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:12px">
        🎯 Répartition musculaire
      </div>
      <div style="display:flex;align-items:center;gap:16px">
        <svg width="110" height="110" viewBox="0 0 110 110" style="flex-shrink:0">
          ${donutArcs}
          <text x="55" y="50" text-anchor="middle"
                fill="white" font-size="12" font-weight="800">${muscles.length}</text>
          <text x="55" y="64" text-anchor="middle"
                fill="rgba(255,255,255,.4)" font-size="7">muscles</text>
        </svg>
        <div style="flex:1">
          ${muscles.map((m,i)=>`
            <div style="margin-bottom:7px">
              <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                <span style="font-size:.7rem;font-weight:600;color:${m.couleur}">${m.nom}</span>
                <span style="font-size:.65rem;color:rgba(255,255,255,.4)">${m.pct}%</span>
              </div>
              <div style="height:4px;background:rgba(255,255,255,.05);border-radius:99px;overflow:hidden">
                <div style="height:100%;width:${m.pct}%;background:${m.couleur};
                            border-radius:99px;
                            animation:pm-progressFill .8s ${i*.1}s ease both"></div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- PRs récents -->
    ${prs.length > 0 ? `
      <div class="pm-card" style="background:linear-gradient(135deg,
           rgba(249,239,119,.1),rgba(249,239,119,.03));
           border-color:rgba(249,239,119,.25)">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-lemon);margin-bottom:10px">
          🏆 Records personnels récents
        </div>
        ${prs.slice(0,3).map(p=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;
                      border-bottom:1px solid rgba(249,239,119,.08)">
            <span style="font-size:1.1rem">${p.emoji||'🏋️'}</span>
            <div style="flex:1">
              <div style="font-size:.8rem;font-weight:700">${p.exercice}</div>
              <div style="font-size:.62rem;color:var(--fd-mint)">${p.muscle||''}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:.85rem;font-weight:800;color:var(--fd-lemon)">
                ${p.poids}kg×${p.reps}
              </div>
              <div style="font-size:.58rem;color:rgba(255,255,255,.3)">
                1RM ~${Math.round(p.poids*(1+p.reps/30))}kg
              </div>
            </div>
          </div>`).join('')}
      </div>` : ''}

    <!-- Score de forme -->
    <div class="pm-card">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:4px">
            🔥 Score de forme
          </div>
          <div style="font-size:2.2rem;font-weight:800;color:var(--fd-mint)">
            ${score}<span style="font-size:.9rem;color:rgba(255,255,255,.4);font-weight:400">/100</span>
          </div>
        </div>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none"
                  stroke="rgba(255,255,255,.05)" stroke-width="8"
                  stroke-dasharray="150 51" transform="rotate(135 40 40)"/>
          <circle cx="40" cy="40" r="32" fill="none"
                  stroke="var(--fd-mint)" stroke-width="8" stroke-linecap="round"
                  stroke-dasharray="${(score/100)*150} ${150-(score/100)*150}"
                  transform="rotate(135 40 40)"
                  style="filter:drop-shadow(0 0 4px var(--fd-mint))"/>
          <text x="40" y="44" text-anchor="middle"
                fill="var(--fd-mint)" font-size="14" font-weight="800">🔥</text>
        </svg>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px">
        ${[
          {label:'Récup',    val:Math.min(100,score+10), c:'var(--fd-mint)'    },
          {label:'Assiduité',val:Math.min(100,Math.round((analyse.seances/Math.max(analyse.objectif,1))*100)),c:'var(--fd-indigo)'},
          {label:'Prog.',    val:Math.max(40,score-10), c:'var(--fd-lavender)'}
        ].map(s=>`
          <div style="text-align:center">
            <div style="font-size:.68rem;font-weight:700;color:${s.c}">${s.val}%</div>
            <div style="height:3px;background:rgba(255,255,255,.05);
                        border-radius:99px;overflow:hidden;margin:3px 0">
              <div style="height:100%;width:${s.val}%;background:${s.c};
                          border-radius:99px;animation:pm-progressFill .8s ease"></div>
            </div>
            <div style="font-size:.55rem;color:rgba(255,255,255,.3)">${s.label}</div>
          </div>`).join('')}
      </div>
    </div>

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE TRAINING v2
// ═══════════════════════════════════════════════════════════
function _rendreTraining(container) {

  const infos   = PM.get(() => Programme.getInfosProgramme(),
                    { semaine:1, cycle:1, progression:25,
                      phase:{ nom:'Reprise', emoji:'🌱',
                              couleur:'#8bf0bb', intensite:.65 } });
  const seances = PM.get(() => Programme.getAllSeances(), []);
  const planning= PM.get(() => Programme.getSeancesSemaine(), []);
  const isCustom= PM.get(() => Programme.estPlanningCustom(), false);

  const COLORS  = ['#ff4d6d','#8bf0bb','#4b4bf9','#f9ef77','#bfa1ff','#ff8d96'];

  container.innerHTML = `

    <!-- Hero programme -->
    <div style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                border-radius:22px;color:white;text-align:center;
                padding:20px;margin-bottom:14px;
                position:relative;overflow:hidden;animation:pm-fadeUp .3s ease">
      <div style="position:absolute;top:-30px;right:-20px;width:130px;height:130px;
                  border-radius:50%;
                  background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%);
                  pointer-events:none"></div>
      <div style="font-size:2rem;margin-bottom:6px">${infos.phase.emoji}</div>
      <div style="font-size:1.1rem;font-weight:800">${infos.phase.nom}</div>
      <div style="font-size:.78rem;opacity:.8;margin-top:2px">
        Semaine ${infos.semaine} · Cycle ${infos.cycle}
        · ${Math.round((infos.phase.intensite||.65)*100)}% intensité
      </div>
      <div style="height:6px;background:rgba(255,255,255,.2);border-radius:3px;
                  margin-top:14px;overflow:hidden">
        <div style="height:100%;background:var(--fd-lemon);
                    width:${infos.progression||25}%;border-radius:3px;
                    animation:pm-progressFill .8s ease"></div>
      </div>
      <div style="font-size:.62rem;opacity:.6;margin-top:4px">
        ${infos.progression||25}% du cycle
      </div>
    </div>

    <!-- Planning semaine -->
    ${PM.sectionTitle('📅 Planning semaine',
      isCustom ? `
        <button onclick="PlanningEditor?.resetPlanning()"
                style="font-size:.58rem;font-weight:700;padding:3px 8px;
                       background:rgba(255,141,150,.1);
                       border:1px solid rgba(255,141,150,.2);
                       border-radius:99px;color:var(--fd-coral);cursor:pointer">
          🔄 Reset
        </button>` : '')}

    <div class="pm-card" style="margin-bottom:14px">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">
        ${planning.map(j=>`
          <div style="text-align:center;padding:8px 2px;border-radius:10px;
                      cursor:pointer;position:relative;transition:all .2s;
                      ${j.estAujourdhui
                        ? 'background:var(--fd-indigo)'
                        : j.seance
                          ? 'background:rgba(75,75,249,.15)'
                          : 'background:rgba(255,255,255,.03)'}"
               onclick="PlanningEditor?.ouvrirChoixSeance(${j.jour})"
               onmouseenter="this.style.transform='scale(1.05)'"
               onmouseleave="this.style.transform=''">
            <div style="font-size:.58rem;
                        color:${j.estAujourdhui?'white':'rgba(255,255,255,.4)'};
                        font-weight:${j.estAujourdhui?'700':'400'}">
              ${j.label}
            </div>
            <div style="font-size:.9rem;margin-top:2px">
              ${j.seance ? j.seance.emoji : j.estRepos ? '😴' : '·'}
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Séances -->
    ${PM.sectionTitle('🏋️ Séances du programme')}

    ${seances.map((s,i)=>{
      const color = COLORS[i % COLORS.length];
      const exos  = (s.exercices||[]).slice(0,5);
      const reste = (s.exercices||[]).length - 5;
      return `
        <div style="background:rgba(255,255,255,.04);
                    border:1px solid rgba(255,255,255,.08);
                    border-radius:18px;padding:16px;margin-bottom:10px;
                    cursor:pointer;transition:all .2s;
                    animation:pm-fadeUp .3s ${i*.08}s ease both"
             onmouseenter="this.style.borderColor='${color}33';this.style.transform='translateX(4px)'"
             onmouseleave="this.style.borderColor='rgba(255,255,255,.08)';this.style.transform=''">
          <div style="display:flex;justify-content:space-between;
                      align-items:flex-start;margin-bottom:10px">
            <div>
              <div style="font-size:1rem;font-weight:700">
                ${s.emoji} ${s.nom}
              </div>
              <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:2px">
                ~${s.duree_estimee||60}min · ${s.exercices?.length||0} exercices
              </div>
            </div>
            <button onclick="event.stopPropagation();naviguer('live',{seanceId:'${s.id}'})"
                    style="padding:9px 18px;background:var(--fd-indigo);border:none;
                           border-radius:99px;font-size:.78rem;font-weight:700;
                           color:white;cursor:pointer;
                           box-shadow:0 3px 14px rgba(75,75,249,.35);
                           transition:all .2s"
                    onmouseenter="this.style.transform='scale(1.05)'"
                    onmouseleave="this.style.transform=''">
              ▶ Start
            </button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
            ${(s.muscles||[]).map(m=>`
              <span style="padding:3px 9px;border-radius:99px;font-size:.6rem;
                           font-weight:700;text-transform:uppercase;
                           background:${color}18;color:${color};
                           border:1px solid ${color}33">${m}</span>
            `).join('')}
          </div>
          <div style="display:flex;flex-wrap:wrap">
            ${exos.map(ex=>{
              const exo = (window.EXERCICES||{})[ex.ref]||{};
              return `
                <span style="display:inline-flex;align-items:center;gap:3px;
                             padding:3px 8px;border-radius:99px;font-size:.6rem;
                             background:rgba(255,255,255,.04);
                             border:1px solid rgba(255,255,255,.07);
                             color:rgba(255,255,255,.4);margin:2px">
                  ${exo.emoji||'💪'} ${exo.nom||ex.ref||ex}
                </span>`;
            }).join('')}
            ${reste > 0 ? `
              <span style="padding:3px 8px;border-radius:99px;font-size:.6rem;
                           background:rgba(75,75,249,.1);color:var(--fd-indigo);
                           border:1px solid rgba(75,75,249,.2);margin:2px">
                +${reste}
              </span>` : ''}
          </div>
        </div>`;
    }).join('')}

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE PROFIL v2
// ═══════════════════════════════════════════════════════════
function _rendreProfil(container) {

  const profil   = PM.get(() => Tracker.getProfil(),
                     { nom:'Athlète', avatar:'💪' });
  const xp       = PM.get(() => Gamification.getXP(),
                     { total:0, pourcentage:0,
                       niveau:{ emoji:'💪', numero:1, nom:'Débutant' } });
  const streak   = PM.get(() => Tracker.getStreak(),   { count:0 });
  const total    = PM.get(() => Tracker.getTotalSeances(), 0);
  const trophees = PM.get(() => Gamification.getTrophees(), []);
  const historique = PM.get(() => Tracker.getHistorique(), []);

  const unlocked = trophees.filter(t => t.debloquee);

  const menuItems = [
    { page:'journal',     emoji:'📔', label:'Journal',          color:'#f9ef77' },
    { page:'objectifs',   emoji:'🎯', label:'Objectifs',        color:'#ff4d6d' },
    { page:'coach',       emoji:'🤖', label:'Coach IA',         color:'#bfa1ff' },
    { page:'defis',       emoji:'🏆', label:'Défis',            color:'#f9ef77' },
    { page:'predict',     emoji:'📈', label:'Prédictions',      color:'#8bf0bb' },
    { page:'adaptatif',   emoji:'🧠', label:'Prog. Adaptatif',  color:'#bfa1ff' },
    { page:'gamification',emoji:'⭐', label:'XP & Niveaux',     color:'#f9ef77' },
    { page:'history',     emoji:'📅', label:'Historique',       color:'#4b4bf9' },
    { page:'photos',      emoji:'📸', label:'Photos',           color:'#ff8d96' },
    { page:'blessures',   emoji:'🩹', label:'Blessures',        color:'#ff8d96' },
    { page:'nutrition',   emoji:'🥗', label:'Nutrition',        color:'#8bf0bb' },
    { page:'circuit',     emoji:'🔥', label:'HIIT & Cardio',    color:'#f9ef77' },
    { page:'export',      emoji:'📤', label:'Exporter',         color:'#8bf0bb' },
    { page:'settings',    emoji:'⚙️', label:'Paramètres',       color:'#bfa1ff' }
  ];

  container.innerHTML = `

    <!-- Hero profil -->
    <div style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                border-radius:22px;padding:24px 20px;text-align:center;
                margin-bottom:14px;position:relative;overflow:hidden;
                animation:pm-fadeUp .3s ease">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;
                  border-radius:50%;
                  background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%);
                  pointer-events:none"></div>

      <!-- Avatar -->
      <div style="position:relative;display:inline-block;margin-bottom:12px">
        <div style="width:80px;height:80px;border-radius:50%;
                    border:3px solid rgba(255,255,255,.3);
                    display:flex;align-items:center;justify-content:center;
                    font-size:2.5rem;background:rgba(255,255,255,.1);
                    animation:pm-avatarPulse 3s ease-in-out infinite">
          ${profil.avatar||'💪'}
        </div>
        <div style="position:absolute;bottom:2px;right:2px;
                    width:22px;height:22px;border-radius:50%;
                    background:var(--fd-lemon);
                    display:flex;align-items:center;justify-content:center;
                    font-size:.65rem;border:2px solid #09092d;
                    color:#09092d;font-weight:800">
          ${xp.niveau.numero}
        </div>
      </div>

      <div style="font-size:1.4rem;font-weight:800">${profil.nom}</div>
      <div style="font-size:.82rem;opacity:.8;margin-top:4px">
        ${xp.niveau.emoji} ${xp.niveau.nom} · ${xp.total} XP
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  background:rgba(255,255,255,.1);border-radius:14px;
                  padding:12px;gap:8px;margin-top:16px">
        ${[[total,'Séances'],[streak.count,'Streak'],[unlocked.length,'🏆']].map(([v,l])=>`
          <div style="text-align:center">
            <div style="font-size:1.3rem;font-weight:800">${v}</div>
            <div style="font-size:.58rem;opacity:.6;text-transform:uppercase">${l}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Trophées -->
    ${PM.sectionTitle(`🏆 Trophées (${unlocked.length}/${trophees.length})`)}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);
                gap:8px;margin-bottom:14px">
      ${trophees.slice(0,8).map((t,i)=>`
        <div style="background:${t.debloquee?'rgba(249,239,119,.08)':'rgba(255,255,255,.04)'};
                    border:1px solid ${t.debloquee?'rgba(249,239,119,.25)':'rgba(255,255,255,.08)'};
                    border-radius:14px;padding:10px 6px;text-align:center;
                    transition:all .2s;animation:pm-countUp .4s ${i*.06}s ease both"
             onmouseenter="this.style.transform='scale(1.05)'"
             onmouseleave="this.style.transform=''">
          <div style="font-size:1.3rem;${!t.debloquee?'filter:grayscale(1);opacity:.3':''}">
            ${t.emoji||'🏆'}
          </div>
          <div style="font-size:.52rem;font-weight:700;margin-top:4px;line-height:1.2;
                      color:${t.debloquee?'var(--fd-lemon)':'rgba(255,255,255,.3)'}">
            ${t.nom||'???'}
          </div>
        </div>`).join('')}
    </div>

    <!-- Historique récent -->
    ${historique.length > 0 ? `
      ${PM.sectionTitle('📅 Historique récent')}
      <div style="position:relative;padding-left:20px;margin-bottom:14px">
        <div style="position:absolute;left:6px;top:0;bottom:0;width:2px;
                    background:rgba(255,255,255,.06)"></div>
        ${historique.slice(0,3).map((s,i)=>{
          const COLORS = ['#ff4d6d','#8bf0bb','#4b4bf9'];
          const c = COLORS[i%COLORS.length];
          return `
            <div style="position:relative;margin-bottom:12px;
                        animation:pm-slideIn .3s ${i*.1}s ease both">
              <div style="position:absolute;left:-17px;top:4px;
                          width:10px;height:10px;border-radius:50%;
                          background:${c};box-shadow:0 0 6px ${c};
                          border:2px solid var(--bg-app,#070714)"></div>
              <div style="background:rgba(255,255,255,.04);
                          border:1px solid rgba(255,255,255,.08);
                          border-radius:14px;padding:12px 14px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <div style="font-size:.88rem;font-weight:700">
                      ${s.emoji||'🏋️'} ${s.nom||'Séance'}
                    </div>
                    <div style="font-size:.62rem;color:rgba(255,255,255,.4);margin-top:2px">
                      ${s.date||''}
                    </div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-size:.8rem;font-weight:700;color:${c}">
                      ${PM.vol(s.volumeTotal||0)}
                    </div>
                    ${s.prs?.length > 0
                      ? `<div style="font-size:.6rem;color:var(--fd-lemon)">${s.prs.length} 🏆</div>`
                      : ''}
                  </div>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>` : ''}

    <!-- Menu rapide grid -->
    ${PM.sectionTitle('🔗 Accès rapide')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${menuItems.map((s,i)=>`
        <div onclick="naviguer('${s.page}')"
             class="pm-menu-item"
             style="animation:pm-slideIn .3s ${i*.04}s ease both"
             onmouseenter="this.style.background='${s.color}15';
                           this.style.borderColor='${s.color}44';
                           this.style.transform='scale(1.02)'"
             onmouseleave="this.style.background='rgba(255,255,255,.04)';
                           this.style.borderColor='rgba(255,255,255,.07)';
                           this.style.transform='scale(1)'">
          <div style="width:34px;height:34px;border-radius:10px;
                      background:${s.color}18;border:1px solid ${s.color}33;
                      display:flex;align-items:center;justify-content:center;
                      font-size:1.1rem;flex-shrink:0">
            ${s.emoji}
          </div>
          <span style="font-size:.78rem;font-weight:600;
                       color:rgba(255,255,255,.8);
                       overflow:hidden;text-overflow:ellipsis;
                       white-space:nowrap;flex:1">
            ${s.label}
          </span>
        </div>`).join('')}
    </div>

    <!-- Reset -->
    <button onclick="typeof UI!=='undefined'&&UI.confirmerReset()"
            style="width:100%;padding:12px;margin-bottom:8px;
                   background:rgba(255,141,150,.06);
                   border:1px solid rgba(255,141,150,.15);
                   border-radius:14px;color:var(--fd-coral);
                   font-size:.82rem;font-weight:600;cursor:pointer;
                   transition:background .2s"
            onmouseenter="this.style.background='rgba(255,141,150,.12)'"
            onmouseleave="this.style.background='rgba(255,141,150,.06)'">
      🗑️ Réinitialiser toutes les données
    </button>

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// EXPORT — rendre disponible globalement
// ═══════════════════════════════════════════════════════════
window._rendreHome     = _rendreHome;
window._rendreStats    = _rendreStats;
window._rendreTraining = _rendreTraining;
window._rendreProfil   = _rendreProfil;
window.PM              = PM;

console.log('✅ UI Premium v2 chargé — Home + Stats + Training + Profil');
