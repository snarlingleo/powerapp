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
// PAGE LIVE v2
// ═══════════════════════════════════════════════════════════
function _rendreLive(container, options = {}) {

  const seanceId = options.seanceId
    || PM.get(() => Programme.getSeanceduJour()?.id, null);

  const seance = PM.get(() =>
    seanceId
      ? Programme.getSeanceById(seanceId)
      : Programme.getSeanceduJour(),
    null);

  if (!seance) {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;min-height:60vh;text-align:center;
                  padding:32px 16px">
        <div style="font-size:3rem;margin-bottom:16px">😴</div>
        <div style="font-size:1.1rem;font-weight:700;margin-bottom:8px">
          Aucune séance aujourd'hui
        </div>
        <div style="font-size:.82rem;color:rgba(255,255,255,.4);margin-bottom:20px">
          Jour de repos ou programme non configuré
        </div>
        <button onclick="naviguer('training')"
                class="pm-btn-primary">
          📅 Voir le programme
        </button>
      </div>`;
    return;
  }

  // ── Data ──
  const etat    = PM.get(() => Tracker.getEtatSeance(seance.id), {
    series: [], exoActif: 0, serieActive: 0, debut: null, terminee: false
  });
  const charge  = PM.get(() => Predict.analyserFatigue(), null);
  const supersets = PM.get(() => Superset.getSupersets(seance.id), []);

  const exercices = seance.exercices || [];
  const exoIdx    = Math.min(etat.exoActif || 0, exercices.length - 1);
  const exoRef    = exercices[exoIdx];
  const exo       = PM.get(() => (window.EXERCICES||{})[exoRef?.ref||exoRef] || {}, {});
  const serieIdx  = etat.serieActive || 0;
  const nbSeries  = exoRef?.series || 4;
  const seriesFaites = (etat.series || []).filter(s =>
    s.exoIndex === exoIdx
  );

  // Total séries programme
  const totalSeries = exercices.reduce((s, ex) => s + (ex.series || 4), 0);
  const seriesFaitesTotal = (etat.series || []).length;
  const pct = Math.round((seriesFaitesTotal / Math.max(totalSeries, 1)) * 100);

  // Chrono
  const tempsEcoule = etat.debut
    ? Math.floor((Date.now() - etat.debut) / 1000)
    : 0;
  const mm = String(Math.floor(tempsEcoule / 60)).padStart(2, '0');
  const ss = String(tempsEcoule % 60).padStart(2, '0');

  // PR
  const pr = PM.get(() =>
    Tracker.getPR(exoRef?.ref || exoRef), null);

  // Recommandation poids
  const reco = PM.get(() =>
    Predict.getRecommandation(exoRef?.ref || exoRef), null);

  container.innerHTML = `

    <!-- Barre sticky progress -->
    <div style="background:rgba(9,9,45,.97);backdrop-filter:blur(16px);
                border-bottom:1px solid rgba(75,75,249,.3);
                padding:10px 16px;margin:-16px -16px 16px;
                position:sticky;top:0;z-index:50">
      <div style="display:flex;align-items:center;justify-content:space-between;
                  margin-bottom:6px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:7px;height:7px;border-radius:50%;
                      background:var(--fd-mint);
                      box-shadow:0 0 6px var(--fd-mint);
                      animation:pm-liveDot 1.5s infinite"></div>
          <span style="font-size:.82rem;font-weight:800;color:var(--fd-mint)">
            ⏱️ ${mm}:${ss}
          </span>
        </div>
        <span style="font-size:.72rem;font-weight:600;
                     color:rgba(255,255,255,.5)">
          ${seance.emoji} ${seance.nom}
        </span>
        <button onclick="_pauserSeance && _pauserSeance()"
                style="padding:5px 12px;background:rgba(255,255,255,.06);
                       border:1px solid rgba(255,255,255,.1);border-radius:99px;
                       font-size:.65rem;font-weight:700;
                       color:rgba(255,255,255,.6);cursor:pointer">
          ⏸ Pause
        </button>
      </div>
      <div style="display:flex;justify-content:space-between;
                  font-size:.6rem;color:rgba(255,255,255,.3);
                  margin-bottom:4px">
        <span>Exo ${exoIdx+1}/${exercices.length}
          · ${seriesFaitesTotal} séries faites</span>
        <span style="font-weight:700;color:var(--fd-indigo)">${pct}%</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.06);
                  border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${pct}%;
                    background:linear-gradient(90deg,var(--fd-indigo),var(--fd-mint));
                    border-radius:99px;box-shadow:0 0 8px var(--fd-indigo);
                    transition:width .5s ease"></div>
      </div>
    </div>

    <!-- Header séance -->
    <div class="pm-card" style="background:linear-gradient(135deg,
         rgba(75,75,249,.15),rgba(139,240,187,.05));
         border-color:rgba(75,75,249,.3);margin-bottom:12px;
         animation:pm-fadeUp .3s ease">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:1.1rem;font-weight:800">
            ${seance.emoji} ${seance.nom}
          </div>
          <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:2px">
            ~${seance.duree_estimee||60}min
            · ${exercices.length} exercices
            ${supersets.length > 0
              ? ` · ⚡ ${supersets.length} superset${supersets.length>1?'s':''}`
              : ''}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
          ${charge ? `
            <div style="font-size:.72rem;font-weight:700;
                        color:${charge.recommandation?.couleur||'white'}">
              Forme: ${charge.score}/100
            </div>` : ''}
          <button id="btn-demarrer-chrono"
                  onclick="typeof App!=='undefined'
                    &&App._demarrerSeanceManuellement('${seance.id}')"
                  style="padding:8px 16px;background:var(--fd-mint);border:none;
                         border-radius:99px;font-size:.75rem;font-weight:800;
                         color:#09092d;cursor:pointer;
                         box-shadow:0 4px 16px rgba(139,240,187,.4)">
            ▶ Démarrer
          </button>
        </div>
      </div>
    </div>

    <!-- Timer repos (si actif) -->
    <div id="pm-repos-overlay" style="display:none">
      <div class="pm-repos-overlay">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.15em;color:var(--fd-mint);margin-bottom:12px">
          😴 REPOS
        </div>
        <div style="position:relative;width:140px;height:140px;margin:0 auto 16px">
          <svg width="140" height="140" style="transform:rotate(-90deg)">
            <circle cx="70" cy="70" r="60" fill="none"
                    stroke="rgba(139,240,187,.1)" stroke-width="8"/>
            <circle id="pm-repos-ring" cx="70" cy="70" r="60" fill="none"
                    stroke="var(--fd-mint)" stroke-width="8"
                    stroke-linecap="round"
                    stroke-dasharray="377" stroke-dashoffset="0"
                    style="filter:drop-shadow(0 0 6px var(--fd-mint));
                           transition:stroke-dashoffset 1s linear"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);text-align:center">
            <div id="pm-repos-count"
                 style="font-size:2.8rem;font-weight:800;color:var(--fd-mint);
                        font-variant-numeric:tabular-nums">
              90
            </div>
            <div style="font-size:.6rem;color:rgba(255,255,255,.4)">secondes</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center">
          <button onclick="PM.reposPlus15()"
                  style="padding:10px 18px;background:rgba(255,255,255,.06);
                         border:1px solid rgba(255,255,255,.1);border-radius:12px;
                         font-size:.82rem;font-weight:700;
                         color:rgba(255,255,255,.7);cursor:pointer">
            +15s
          </button>
          <button onclick="PM.reposPasser()"
                  style="padding:10px 24px;background:var(--fd-indigo);border:none;
                         border-radius:12px;font-size:.85rem;font-weight:700;
                         color:white;cursor:pointer;
                         box-shadow:0 4px 16px rgba(75,75,249,.4)">
            ⚡ Passer
          </button>
        </div>
      </div>
    </div>

    <!-- Exercice actuel -->
    <div class="pm-card" style="animation:pm-fadeUp .3s .1s ease both">

      <!-- Header exo -->
      <div style="display:flex;justify-content:space-between;
                  align-items:flex-start;margin-bottom:14px">
        <div>
          <div style="font-weight:700;font-size:1rem">
            ${exo.emoji||'🏋️'} ${exo.nom||exoRef?.ref||'Exercice'}
          </div>
          <div style="font-size:.68rem;color:var(--fd-mint);margin-top:2px">
            ${exo.muscle||exo.groupe||''}
          </div>
          <div style="font-size:.65rem;color:rgba(255,255,255,.4);margin-top:3px">
            ${nbSeries} séries
            · ${exoRef?.reps||'8-10'} reps
            · repos ${exoRef?.repos||90}s
          </div>
        </div>
        <div style="text-align:right">
          ${pr ? `
            <div style="font-size:.72rem;color:var(--fd-lemon);font-weight:700">
              🏆 PR ${pr.poids}kg×${pr.reps}
            </div>` : ''}
          ${reco ? `
            <div style="font-size:.62rem;color:var(--fd-indigo);margin-top:2px">
              💡 Reco ${reco.poids}kg
            </div>` : ''}
        </div>
      </div>

      <!-- Séries faites -->
      ${seriesFaites.map((s, i) => `
        <div class="pm-serie done">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:.78rem;font-weight:800;color:var(--fd-mint)">
              S${i+1}/${nbSeries}
            </div>
            <div style="font-size:.72rem;font-weight:700;color:var(--fd-mint)">
              ✅ ${s.poids||0}kg × ${s.reps||0} reps
              ${s.rpe ? `· RPE ${s.rpe}` : ''}
            </div>
          </div>
        </div>`).join('')}

      <!-- Série active -->
      <div class="pm-serie active" id="pm-serie-active">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:14px">
          <div style="font-size:.78rem;font-weight:800;color:var(--fd-indigo)">
            S${seriesFaites.length+1}/${nbSeries}
          </div>
          <div style="padding:3px 10px;background:rgba(75,75,249,.15);
                      border:1px solid rgba(75,75,249,.3);border-radius:99px;
                      font-size:.6rem;font-weight:700;color:var(--fd-indigo)">
            ⚡ Active
          </div>
        </div>

        <!-- Inputs poids + reps -->
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:10px;margin-bottom:14px">

          <!-- Poids -->
          <div>
            <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                        letter-spacing:.08em;color:rgba(255,255,255,.4);margin-bottom:6px">
              🏋️ Charge (kg)
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <button onclick="PM.inputDelta('pm-poids',-2.5)"
                      class="pm-inp-btn minus"
                      style="width:38px;height:38px;flex-shrink:0;border-radius:10px;
                             font-size:1rem;font-weight:800;cursor:pointer;
                             background:rgba(255,141,150,.12);
                             border:1.5px solid rgba(255,141,150,.3);
                             color:var(--fd-coral);transition:all .15s"
                      ontouchstart="" onmousedown="this.style.transform='scale(.88)'"
                      onmouseup="this.style.transform=''">−</button>
              <input id="pm-poids" class="pm-input"
                     value="${reco?.poids || pr?.poids || exoRef?.charge_depart || 20}"
                     type="number" step="2.5" min="0"/>
              <button onclick="PM.inputDelta('pm-poids',2.5)"
                      style="width:38px;height:38px;flex-shrink:0;border-radius:10px;
                             font-size:1rem;font-weight:800;cursor:pointer;
                             background:rgba(139,240,187,.12);
                             border:1.5px solid rgba(139,240,187,.3);
                             color:var(--fd-mint);transition:all .15s"
                      ontouchstart="" onmousedown="this.style.transform='scale(.88)'"
                      onmouseup="this.style.transform=''">+</button>
            </div>
          </div>

          <!-- Reps -->
          <div>
            <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                        letter-spacing:.08em;color:rgba(255,255,255,.4);margin-bottom:6px">
              🔁 Répétitions
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <button onclick="PM.inputDelta('pm-reps',-1)"
                      style="width:38px;height:38px;flex-shrink:0;border-radius:10px;
                             font-size:1rem;font-weight:800;cursor:pointer;
                             background:rgba(255,141,150,.12);
                             border:1.5px solid rgba(255,141,150,.3);
                             color:var(--fd-coral);transition:all .15s"
                      ontouchstart="" onmousedown="this.style.transform='scale(.88)'"
                      onmouseup="this.style.transform=''">−</button>
              <input id="pm-reps" class="pm-input"
                     value="${exoRef?.reps_cible || 10}"
                     type="number" step="1" min="1"/>
              <button onclick="PM.inputDelta('pm-reps',1)"
                      style="width:38px;height:38px;flex-shrink:0;border-radius:10px;
                             font-size:1rem;font-weight:800;cursor:pointer;
                             background:rgba(139,240,187,.12);
                             border:1.5px solid rgba(139,240,187,.3);
                             color:var(--fd-mint);transition:all .15s"
                      ontouchstart="" onmousedown="this.style.transform='scale(.88)'"
                      onmouseup="this.style.transform=''">+</button>
            </div>
          </div>
        </div>

        <!-- RPE -->
        <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.08em;color:rgba(255,255,255,.4);margin-bottom:6px">
          😤 RPE · optionnel
        </div>
        <div style="display:flex;gap:4px;margin-bottom:14px" id="pm-rpe-row">
          ${[6,7,8,9,10].map(r=>`
            <div class="pm-rpe-btn"
                 onclick="PM.setRPE(${r},this)"
                 style="flex:1;padding:8px 2px;font-size:.78rem;font-weight:700;
                        background:rgba(255,255,255,.04);
                        border:1px solid rgba(255,255,255,.08);
                        border-radius:8px;color:rgba(255,255,255,.4);
                        cursor:pointer;transition:all .15s;text-align:center">
              ${r}
            </div>`).join('')}
        </div>

        <!-- Bouton série -->
        <button onclick="PM.validerSerie('${seance.id}',${exoIdx},${seriesFaites.length})"
                style="width:100%;padding:18px;background:var(--fd-indigo);border:none;
                       border-radius:14px;font-size:1rem;font-weight:800;color:white;
                       cursor:pointer;letter-spacing:.02em;
                       box-shadow:0 4px 20px rgba(75,75,249,.4);
                       transition:all .15s"
                onmousedown="this.style.transform='scale(.97)'"
                onmouseup="this.style.transform=''">
          ✅ SÉRIE FAITE
        </button>
      </div>

      <!-- Séries en attente -->
      ${Array.from({ length: Math.max(0, nbSeries - seriesFaites.length - 1) },
        (_, i) => `
          <div class="pm-serie" style="opacity:.45">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="font-size:.78rem;font-weight:600;
                          color:rgba(255,255,255,.4)">
                S${seriesFaites.length + 2 + i}/${nbSeries}
              </div>
              <div style="font-size:.62rem;color:rgba(255,255,255,.3)">
                ○ En attente
              </div>
            </div>
          </div>`).join('')}
    </div>

    <!-- Exercices restants -->
    ${exercices.length > 1 ? `
      ${PM.sectionTitle('📋 Exercices restants')}
      ${exercices.slice(exoIdx + 1, exoIdx + 4).map((ex, i) => {
        const e = PM.get(() => (window.EXERCICES||{})[ex.ref||ex] || {}, {});
        return `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;
                      background:rgba(255,255,255,.03);
                      border:1px solid rgba(255,255,255,.06);
                      border-radius:12px;margin-bottom:6px;opacity:.7">
            <span style="font-size:1.1rem">${e.emoji||'💪'}</span>
            <div style="flex:1">
              <div style="font-size:.8rem;font-weight:600">${e.nom||ex.ref||ex}</div>
              <div style="font-size:.62rem;color:rgba(255,255,255,.35)">
                ${ex.series||4} × ${ex.reps||'8-10'}
              </div>
            </div>
          </div>`;
      }).join('')}` : ''}

    <!-- Terminer -->
    <button onclick="PM.terminerSeance('${seance.id}')"
            style="width:100%;padding:16px;margin-top:12px;
                   background:rgba(139,240,187,.12);
                   border:1px solid rgba(139,240,187,.25);
                   border-radius:14px;font-size:.88rem;font-weight:700;
                   color:var(--fd-mint);cursor:pointer;transition:all .2s"
            onmouseenter="this.style.background='rgba(139,240,187,.2)'"
            onmouseleave="this.style.background='rgba(139,240,187,.12)'">
      🏁 Terminer la séance
    </button>

    <div style="height:16px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE ONBOARDING v2
// ═══════════════════════════════════════════════════════════
function _afficherOnboarding() {

  // ── État onboarding ──
  window._OB = window._OB || {
    etape: 1,
    total: 7,
    data: {
      nom: '', poids: 80, taille: 175, age: 25,
      genre: null, objectif: null, niveau: null,
      lieu: null, muscles: new Set(), jours: 4
    }
  };

  const screen = document.getElementById('onboarding-screen')
    || document.getElementById('app-wrapper');

  if (!screen) {
    console.error('[OB] Écran onboarding introuvable');
    return;
  }

  // ── CSS Onboarding ──
  if (!document.getElementById('css-ob-v2')) {
    const s = document.createElement('style');
    s.id = 'css-ob-v2';
    s.textContent = `
      #onboarding-screen {
        display:flex !important;
        flex-direction:column;
        min-height:100vh;
        background:var(--bg-app, #070714);
        overflow-y:auto;
        -webkit-overflow-scrolling:touch;
      }
      .ob-wrap {
        max-width:480px;margin:0 auto;
        padding:20px 16px 40px;
        min-height:100vh;
        display:flex;flex-direction:column;
      }
      .ob-header {
        display:flex;align-items:center;
        justify-content:space-between;
        margin-bottom:24px;
      }
      .ob-steps {
        display:flex;gap:5px;
      }
      .ob-step-dot {
        height:6px;border-radius:99px;
        background:rgba(255,255,255,.1);
        transition:all .3s;
      }
      .ob-step-dot.active {
        width:24px;background:var(--fd-indigo);
      }
      .ob-step-dot.done {
        width:8px;background:rgba(75,75,249,.4);
      }
      .ob-step-dot.todo {
        width:8px;
      }
      .ob-etape {
        font-size:.62rem;font-weight:700;
        text-transform:uppercase;letter-spacing:.1em;
        color:var(--fd-indigo);margin-bottom:6px;
      }
      .ob-titre {
        font-size:1.5rem;font-weight:800;
        letter-spacing:-.02em;margin-bottom:6px;
        color:white;
      }
      .ob-sous {
        font-size:.82rem;color:rgba(255,255,255,.45);
        margin-bottom:20px;line-height:1.5;
      }
      .ob-content { flex:1; }
      .ob-footer {
        margin-top:auto;padding-top:20px;
      }
      .ob-btn-next {
        width:100%;padding:17px;
        background:var(--fd-indigo);border:none;
        border-radius:99px;font-size:.95rem;
        font-weight:800;color:white;cursor:pointer;
        box-shadow:0 4px 20px rgba(75,75,249,.4);
        transition:all .2s;margin-bottom:8px;
      }
      .ob-btn-next:hover { transform:scale(1.01); }
      .ob-btn-next:active { transform:scale(.98); }
      .ob-btn-back {
        width:100%;padding:12px;background:none;border:none;
        font-size:.82rem;color:rgba(255,255,255,.4);cursor:pointer;
      }
      .ob-input {
        width:100%;padding:16px;font-size:1rem;font-weight:600;
        background:rgba(255,255,255,.06);
        border:2px solid rgba(255,255,255,.1);
        border-radius:16px;color:white;outline:none;
        transition:border-color .2s;margin-bottom:10px;
        -webkit-appearance:none;
      }
      .ob-input:focus { border-color:var(--fd-indigo); }
      .ob-input::placeholder { color:rgba(255,255,255,.25); }
      .ob-3col {
        display:grid;grid-template-columns:repeat(3,1fr);gap:10px;
        margin-bottom:10px;
      }
      .ob-inp-group label {
        font-size:.6rem;font-weight:700;text-transform:uppercase;
        letter-spacing:.08em;color:rgba(255,255,255,.4);
        display:block;margin-bottom:6px;
      }
    `;
    document.head.appendChild(s);
  }

  // ── Générer une étape ──
  function genEtape(n) {
    const d = window._OB.data;

    const steps = {

      // ── ÉTAPE 1 : Prénom + mensurations ──
      1: {
        titre: 'Bienvenue ! ⚡',
        sous:  'Commençons par te connaître',
        html: `
          <div>
            <label style="font-size:.62rem;font-weight:700;text-transform:uppercase;
                          letter-spacing:.08em;color:rgba(255,255,255,.4);
                          display:block;margin-bottom:6px">
              TON PRÉNOM *
            </label>
            <input id="ob-nom" class="ob-input"
                   placeholder="ex: Othmane"
                   value="${d.nom}"
                   oninput="window._OB.data.nom=this.value"/>

            <div class="ob-3col" style="margin-top:10px">
              <div class="ob-inp-group">
                <label>Poids (kg)</label>
                <input id="ob-poids" class="ob-input"
                       type="number" value="${d.poids}" min="30" max="300"
                       oninput="window._OB.data.poids=+this.value"/>
              </div>
              <div class="ob-inp-group">
                <label>Taille (cm)</label>
                <input id="ob-taille" class="ob-input"
                       type="number" value="${d.taille}" min="100" max="250"
                       oninput="window._OB.data.taille=+this.value"/>
              </div>
              <div class="ob-inp-group">
                <label>Âge</label>
                <input id="ob-age" class="ob-input"
                       type="number" value="${d.age}" min="12" max="99"
                       oninput="window._OB.data.age=+this.value"/>
              </div>
            </div>
          </div>`
      },

      // ── ÉTAPE 2 : Genre ──
      2: {
        titre: 'Ton genre 👤',
        sous:  'Pour personnaliser ton programme',
        html: `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            ${[
              {val:'homme',emoji:'👨',label:'Homme',  desc:'Force & Volume'},
              {val:'femme', emoji:'👩',label:'Femme',  desc:'Galbe & Mobilité'}
            ].map(g=>`
              <div class="pm-ob-option ${d.genre===g.val?'selected':''}"
                   style="flex-direction:column;text-align:center;padding:24px 12px;
                          ${d.genre===g.val
                            ?'border-color:rgba(75,75,249,.5);background:rgba(75,75,249,.15)'
                            :''}"
                   onclick="
                     document.querySelectorAll('.pm-ob-option').forEach(e=>
                       e.classList.remove('selected'));
                     this.classList.add('selected');
                     window._OB.data.genre='${g.val}'">
                <div style="font-size:3rem;margin-bottom:10px">${g.emoji}</div>
                <div style="font-size:1rem;font-weight:800;margin-bottom:4px">${g.label}</div>
                <div style="font-size:.7rem;color:rgba(255,255,255,.45)">${g.desc}</div>
              </div>`).join('')}
          </div>`
      },

      // ── ÉTAPE 3 : Objectif ──
      3: {
        titre: 'Ton objectif 🎯',
        sous:  "Qu'est-ce qui te motive le plus ?",
        html: `
          <div>
            ${[
              {val:'masse',   emoji:'💪',label:'Prise de masse',   desc:'Volume · Charges lourdes',    c:'#ff4d6d'},
              {val:'perte',   emoji:'🔥',label:'Perte de poids',   desc:'Cardio · Déficit calorique',  c:'#f9ef77'},
              {val:'seche',   emoji:'✂️', label:'Sèche',           desc:'Muscle · Brûler les graisses',c:'#8bf0bb'},
              {val:'force',   emoji:'🏋️',label:'Force pure',       desc:'Charges max · Faibles reps',  c:'#bfa1ff'},
              {val:'forme',   emoji:'✨',label:'Forme générale',    desc:'Équilibre · Bien-être',       c:'#f9ef77'}
            ].map(o=>`
              <div class="pm-ob-option ${d.objectif===o.val?'selected':''}"
                   style="${d.objectif===o.val
                     ?'border-color:rgba(75,75,249,.5);background:rgba(75,75,249,.15)'
                     :''}"
                   onclick="
                     document.querySelectorAll('.pm-ob-option').forEach(e=>
                       e.classList.remove('selected'));
                     this.classList.add('selected');
                     window._OB.data.objectif='${o.val}'">
                <div style="width:44px;height:44px;flex-shrink:0;border-radius:12px;
                            background:${o.c}22;border:1px solid ${o.c}33;
                            display:flex;align-items:center;justify-content:center;
                            font-size:1.3rem">${o.emoji}</div>
                <div style="flex:1">
                  <div style="font-size:.88rem;font-weight:800">${o.label}</div>
                  <div style="font-size:.65rem;color:rgba(255,255,255,.4);
                              margin-top:2px">${o.desc}</div>
                </div>
                ${d.objectif===o.val
                  ?`<div style="color:var(--fd-indigo);font-size:1.1rem">✓</div>`:''}
              </div>`).join('')}
          </div>`
      },

      // ── ÉTAPE 4 : Niveau ──
      4: {
        titre: 'Ton niveau 📊',
        sous:  "Pour adapter l'intensité",
        html: `
          <div>
            ${[
              {val:'debutant',     emoji:'🌱',label:'Débutant',       desc:'< 1 an · 3j/sem · Repos 60s'},
              {val:'intermediaire',emoji:'💪',label:'Intermédiaire',  desc:'1-3 ans · 4j/sem · Repos 75s'},
              {val:'avance',       emoji:'🔥',label:'Avancé',         desc:'3+ ans · 5j/sem · Repos 90s'}
            ].map(n=>`
              <div class="pm-ob-option ${d.niveau===n.val?'selected':''}"
                   style="${d.niveau===n.val
                     ?'border-color:rgba(75,75,249,.5);background:rgba(75,75,249,.15)'
                     :''}"
                   onclick="
                     document.querySelectorAll('.pm-ob-option').forEach(e=>
                       e.classList.remove('selected'));
                     this.classList.add('selected');
                     window._OB.data.niveau='${n.val}'">
                <div style="width:52px;height:52px;flex-shrink:0;border-radius:14px;
                            background:rgba(75,75,249,.15);
                            border:1px solid rgba(75,75,249,.2);
                            display:flex;align-items:center;justify-content:center;
                            font-size:1.6rem">${n.emoji}</div>
                <div style="flex:1">
                  <div style="font-size:.95rem;font-weight:800">${n.label}</div>
                  <div style="font-size:.68rem;color:rgba(255,255,255,.4);
                              margin-top:3px">${n.desc}</div>
                </div>
                ${d.niveau===n.val
                  ?`<div style="color:var(--fd-indigo);font-size:1.2rem">✓</div>`:''}
              </div>`).join('')}
          </div>`
      },

      // ── ÉTAPE 5 : Lieu ──
      5: {
        titre: "Où tu t'entraînes ? 📍",
        sous:  'Pour adapter les exercices',
        html: `
          <div>
            ${[
              {val:'salle',    emoji:'🏋️',label:'Salle de sport',
               desc:'Tous les équipements',  bonus:'Machines + Câbles + Rack'},
              {val:'maison',   emoji:'🏠',label:'À la maison',
               desc:'Haltères, élastiques',  bonus:'Exercices adaptés maison'},
              {val:'exterieur',emoji:'🌳',label:'En extérieur',
               desc:'Parcs, barres',         bonus:'Cardio + Poids de corps'}
            ].map(l=>`
              <div class="pm-ob-option ${d.lieu===l.val?'selected':''}"
                   style="${d.lieu===l.val
                     ?'border-color:rgba(139,240,187,.4);background:rgba(139,240,187,.08)'
                     :''}"
                   onclick="
                     document.querySelectorAll('.pm-ob-option').forEach(e=>
                       e.classList.remove('selected'));
                     this.classList.add('selected');
                     window._OB.data.lieu='${l.val}'">
                <div style="width:56px;height:56px;flex-shrink:0;border-radius:16px;
                            background:rgba(139,240,187,.1);
                            border:1px solid rgba(139,240,187,.2);
                            display:flex;align-items:center;justify-content:center;
                            font-size:2rem">${l.emoji}</div>
                <div style="flex:1">
                  <div style="font-size:.9rem;font-weight:800">${l.label}</div>
                  <div style="font-size:.65rem;color:rgba(255,255,255,.4);
                              margin-top:2px">${l.desc}</div>
                  <div style="font-size:.62rem;color:var(--fd-mint);
                              margin-top:3px;font-weight:600">
                    ✅ ${l.bonus}
                  </div>
                </div>
                ${d.lieu===l.val
                  ?`<div style="color:var(--fd-mint);font-size:1.2rem">✓</div>`:''}
              </div>`).join('')}
          </div>`
      },

      // ── ÉTAPE 6 : Muscles cibles ──
      6: {
        titre: 'Muscles prioritaires 💪',
        sous:  'Optionnel — laisse vide pour un programme complet',
        html: `
          <div>
            <!-- Corps SVG -->
            <div style="display:flex;justify-content:center;margin-bottom:16px">
              <svg width="220" height="280" viewBox="0 0 220 280" fill="none">
                <!-- Corps base -->
                <ellipse cx="110" cy="38" rx="22" ry="26"
                         fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
                <rect x="86" y="62" width="48" height="72" rx="10"
                      fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
                <rect x="54" y="66" width="30" height="60" rx="8"
                      fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
                <rect x="136" y="66" width="30" height="60" rx="8"
                      fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
                <rect x="88" y="134" width="20" height="72" rx="8"
                      fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
                <rect x="112" y="134" width="20" height="72" rx="8"
                      fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
                <rect x="90" y="206" width="18" height="60" rx="7"
                      fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>
                <rect x="112" y="206" width="18" height="60" rx="7"
                      fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>

                <!-- Zones cliquables colorées -->
                <!-- Pectoraux -->
                <rect id="ob-z-pec" x="90" y="66" width="40" height="30" rx="6"
                      fill="rgba(75,75,249,0)" stroke="rgba(75,75,249,0)"
                      style="cursor:pointer;transition:all .2s"
                      onclick="PM.obToggleMuscle('pectoraux','#4b4bf9',this)"/>
                <!-- Épaules -->
                <ellipse id="ob-z-del-g" cx="80" cy="74" rx="13" ry="11"
                         fill="rgba(191,161,255,0)" stroke="rgba(191,161,255,0)"
                         style="cursor:pointer;transition:all .2s"
                         onclick="PM.obToggleMuscle('deltoides','#bfa1ff',this)"/>
                <ellipse id="ob-z-del-d" cx="140" cy="74" rx="13" ry="11"
                         fill="rgba(191,161,255,0)" stroke="rgba(191,161,255,0)"
                         style="cursor:pointer;transition:all .2s"
                         onclick="PM.obToggleMuscle('deltoides','#bfa1ff',this)"/>
                <!-- Biceps -->
                <rect id="ob-z-bi-g" x="56" y="74" width="22" height="30" rx="6"
                      fill="rgba(139,240,187,0)" stroke="rgba(139,240,187,0)"
                      style="cursor:pointer;transition:all .2s"
                      onclick="PM.obToggleMuscle('biceps','#8bf0bb',this)"/>
                <rect id="ob-z-bi-d" x="142" y="74" width="22" height="30" rx="6"
                      fill="rgba(139,240,187,0)" stroke="rgba(139,240,187,0)"
                      style="cursor:pointer;transition:all .2s"
                      onclick="PM.obToggleMuscle('biceps','#8bf0bb',this)"/>
                <!-- Abdos -->
                <rect id="ob-z-abs" x="94" y="98" width="32" height="38" rx="6"
                      fill="rgba(249,239,119,0)" stroke="rgba(249,239,119,0)"
                      style="cursor:pointer;transition:all .2s"
                      onclick="PM.obToggleMuscle('abdominaux','#f9ef77',this)"/>
                <!-- Quadriceps -->
                <rect id="ob-z-quad-g" x="90" y="140" width="18" height="44" rx="7"
                      fill="rgba(34,197,94,0)" stroke="rgba(34,197,94,0)"
                      style="cursor:pointer;transition:all .2s"
                      onclick="PM.obToggleMuscle('quadriceps','#22c55e',this)"/>
                <rect id="ob-z-quad-d" x="112" y="140" width="18" height="44" rx="7"
                      fill="rgba(34,197,94,0)" stroke="rgba(34,197,94,0)"
                      style="cursor:pointer;transition:all .2s"
                      onclick="PM.obToggleMuscle('quadriceps','#22c55e',this)"/>

                <!-- Labels fixes -->
                <text x="110" y="85" text-anchor="middle"
                      fill="rgba(255,255,255,.25)" font-size="7"
                      font-family="-apple-system,sans-serif" pointer-events="none">PEC</text>
                <text x="66" y="93" text-anchor="middle"
                      fill="rgba(255,255,255,.2)" font-size="6"
                      font-family="-apple-system,sans-serif" pointer-events="none">BI</text>
                <text x="154" y="93" text-anchor="middle"
                      fill="rgba(255,255,255,.2)" font-size="6"
                      font-family="-apple-system,sans-serif" pointer-events="none">BI</text>
                <text x="110" y="122" text-anchor="middle"
                      fill="rgba(255,255,255,.25)" font-size="7"
                      font-family="-apple-system,sans-serif" pointer-events="none">ABS</text>
                <text x="99" y="168" text-anchor="middle"
                      fill="rgba(255,255,255,.25)" font-size="6"
                      font-family="-apple-system,sans-serif" pointer-events="none">Q</text>
                <text x="121" y="168" text-anchor="middle"
                      fill="rgba(255,255,255,.25)" font-size="6"
                      font-family="-apple-system,sans-serif" pointer-events="none">Q</text>
              </svg>
            </div>

            <!-- Chips muscles sélectionnés -->
            <div id="ob-muscles-chips"
                 style="display:flex;flex-wrap:wrap;gap:6px;
                        justify-content:center;min-height:28px;
                        margin-bottom:12px">
              ${d.muscles.size === 0
                ? `<span style="font-size:.68rem;color:rgba(255,255,255,.3);
                               font-style:italic">
                     Clique sur le corps pour cibler des muscles
                   </span>`
                : [...d.muscles].map(m => PM.obChipHTML(m)).join('')}
            </div>

            <div style="padding:10px 14px;background:rgba(75,75,249,.06);
                        border:1px solid rgba(75,75,249,.15);border-radius:12px;
                        font-size:.72rem;color:rgba(255,255,255,.4);text-align:center">
              💡 Laisse vide pour un programme corps complet
            </div>
          </div>`
      },

      // ── ÉTAPE 7 : Programme IA ──
      7: {
        titre: '🧠 Ton programme IA',
        sous:  'Personnalisé en fonction de tes réponses',
        html: `
          <div>
            <!-- Message Coach -->
            <div style="background:rgba(75,75,249,.08);
                        border:1px solid rgba(75,75,249,.2);
                        border-left:3px solid var(--fd-indigo);
                        border-radius:14px;padding:14px 16px;margin-bottom:16px">
              <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                          letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:6px">
                🤖 Coach IA
              </div>
              <p style="font-size:.8rem;color:rgba(255,255,255,.75);
                        line-height:1.6;margin:0">
                ${d.nom ? d.nom+',' : 'Bienvenue,'} j'ai analysé ton profil et créé
                un programme
                ${d.objectif === 'masse'  ? 'Push/Pull/Legs pour ta prise de masse' :
                  d.objectif === 'perte'  ? 'Full Body pour ta perte de poids' :
                  d.objectif === 'force'  ? 'de force pure avec 5×5' :
                  d.objectif === 'seche'  ? 'de sèche avec supersets' :
                  'équilibré corps complet'}.
                ${d.niveau === 'debutant' ? '3 séances/sem pour bien débuter.' :
                  d.niveau === 'avance'   ? '5 séances/sem pour maximiser tes gains.' :
                  '4 séances/sem adaptées à ton niveau.'} 💪
              </p>
            </div>

            <!-- Badges récap -->
            <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px">
              ${[
                d.genre === 'homme' ? {l:'👨 Homme',    c:'#bfa1ff'} :
                                     {l:'👩 Femme',    c:'#bfa1ff'},
                {l: d.niveau === 'debutant'     ? '🌱 Débutant'
                   : d.niveau === 'avance'       ? '🔥 Avancé'
                   : '💪 Intermédiaire',           c:'#4b4bf9'},
                {l: d.objectif === 'masse'  ? '💪 Masse'
                   : d.objectif === 'perte' ? '🔥 Perte poids'
                   : d.objectif === 'force' ? '🏋️ Force'
                   : d.objectif === 'seche' ? '✂️ Sèche'
                   : '✨ Forme',                   c:'#ff4d6d'},
                {l: d.lieu === 'salle'    ? '🏋️ Salle'
                   : d.lieu === 'maison'  ? '🏠 Maison'
                   : '🌳 Extérieur',               c:'#8bf0bb'},
                {l: d.niveau === 'debutant' ? 'PPL · 3j/sem'
                   : d.niveau === 'avance'  ? 'PPL · 5j/sem'
                   : 'PPL · 4j/sem',               c:'#ff8d96'}
              ].map(b=>`
                <span style="padding:4px 10px;background:${b.c}22;
                             border:1px solid ${b.c}44;border-radius:99px;
                             font-size:.62rem;font-weight:700;color:${b.c}">
                  ${b.l}
                </span>`).join('')}
            </div>

            <!-- Planning aperçu -->
            <div style="background:rgba(255,255,255,.03);
                        border:1px solid rgba(255,255,255,.07);
                        border-radius:14px;padding:12px;margin-bottom:14px">
              <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                          letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:10px">
                📅 Planning — commence aujourd'hui
              </div>
              <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">
                ${['L','M','M','J','V','S','D'].map((day,i)=>{
                  const nbJ = d.niveau==='debutant' ? 3
                            : d.niveau==='avance'   ? 5 : 4;
                  const seances = nbJ===3 ? [0,2,4]
                                : nbJ===5 ? [0,1,2,4,5]
                                : [0,2,4,6];
                  const hasSe = seances.includes(i);
                  const emojis = ['⬆️','⬇️','🦵','🔄','⬆️','⬇️','🦵'];
                  return `
                    <div style="display:flex;flex-direction:column;
                                align-items:center;gap:3px">
                      <div style="width:34px;height:34px;border-radius:10px;
                                  display:flex;align-items:center;justify-content:center;
                                  font-size:.75rem;font-weight:700;
                                  ${i===0
                                    ?'background:var(--fd-indigo);color:white;box-shadow:0 0 10px rgba(75,75,249,.5)'
                                    :hasSe
                                      ?'background:rgba(75,75,249,.2);border:1px solid rgba(75,75,249,.3);color:var(--fd-lavender)'
                                      :'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.3)'}">
                        ${i===0 ? '▶' : hasSe ? emojis[i] : '😴'}
                      </div>
                      <div style="font-size:.46rem;color:rgba(255,255,255,.3);
                                  text-transform:uppercase">${day}</div>
                    </div>`;
                }).join('')}
              </div>
            </div>

            <!-- Boutons -->
            <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px">
              <button onclick="window._OB.etape=1;_afficherOnboarding()"
                      style="padding:12px;background:rgba(255,255,255,.06);
                             border:1px solid rgba(255,255,255,.1);border-radius:12px;
                             font-size:.75rem;font-weight:700;
                             color:rgba(255,255,255,.5);cursor:pointer">
                ✏️ Modifier
              </button>
              <button onclick="PM.obTerminer()"
                      style="padding:12px;background:var(--fd-mint);border:none;
                             border-radius:12px;font-size:.85rem;font-weight:800;
                             color:#09092d;cursor:pointer;
                             box-shadow:0 4px 16px rgba(139,240,187,.4)">
                ✅ J'adopte ce programme !
              </button>
            </div>
          </div>`
      }
    };

    return steps[n] || steps[1];
  }

  // ── Render l'écran ──
  const e    = window._OB.etape;
  const tot  = window._OB.total;
  const step = genEtape(e);

  screen.style.display    = 'flex';
  screen.style.flexDirection = 'column';
  screen.style.pointerEvents = 'all';

  screen.innerHTML = `
    <div class="ob-wrap">

      <!-- Header -->
      <div class="ob-header">
        <div class="ob-steps">
          ${Array.from({length:tot},(_,i)=>`
            <div class="ob-step-dot ${
              i+1 === e ? 'active' : i+1 < e ? 'done' : 'todo'
            }"></div>`).join('')}
        </div>
        ${e > 1 ? `
          <button onclick="window._OB.etape--;_afficherOnboarding()"
                  style="background:none;border:none;font-size:.8rem;
                         color:rgba(255,255,255,.4);cursor:pointer;padding:4px">
            ← Retour
          </button>` : '<div></div>'}
      </div>

      <!-- Étape -->
      <div class="ob-etape">Étape ${e} / ${tot}</div>
      <div class="ob-titre">${step.titre}</div>
      <div class="ob-sous">${step.sous}</div>

      <!-- Contenu -->
      <div class="ob-content">
        ${step.html}
      </div>

      <!-- Footer -->
      <div class="ob-footer">
        ${e < tot ? `
          <button class="ob-btn-next"
                  onclick="PM.obSuivant()">
            ${e === tot - 1 ? 'Voir mon programme →' : 'Suivant →'}
          </button>` : ''}
        ${e > 1 ? `
          <button class="ob-btn-back"
                  onclick="window._OB.etape--;_afficherOnboarding()">
            ← Retour
          </button>` : ''}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// HELPERS PM — Live + Onboarding
// ═══════════════════════════════════════════════════════════

// ── Input delta ──
PM.inputDelta = function(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;
  const val = parseFloat(el.value) || 0;
  el.value  = Math.max(0, Math.round((val + delta) * 4) / 4);
  el.dispatchEvent(new Event('input'));
};

// ── RPE select ──
PM.setRPE = function(val, el) {
  document.querySelectorAll('#pm-rpe-row .pm-rpe-btn')
    .forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  window._PM_RPE = val;
};

// ── Valider série ──
PM.validerSerie = function(seanceId, exoIdx, serieIdx) {
  const poids = parseFloat(document.getElementById('pm-poids')?.value) || 0;
  const reps  = parseInt(document.getElementById('pm-reps')?.value)   || 0;
  const rpe   = window._PM_RPE || null;

  if (!poids || !reps) {
    PM.toast('Entre le poids et les reps !', 'error');
    return;
  }

  // Appeler la vraie fonction si elle existe
  if (typeof validerSerie === 'function') {
    try { validerSerie(seanceId, exoIdx, serieIdx, poids, reps, rpe); return; }
    catch(e) { console.warn('[PM] validerSerie error:', e); }
  }
  if (typeof Tracker?.enregistrerSerie === 'function') {
    try {
      Tracker.enregistrerSerie({ seanceId, exoIdx, serieIdx, poids, reps, rpe });
    } catch(e) { console.warn('[PM] enregistrerSerie error:', e); }
  }

  PM.toast(`✅ Série validée !\n${poids}kg × ${reps} reps`, 'success');

  // Vérifier PR
  const pr = PM.get(() => Tracker.getPR(null), null);
  if (pr && poids >= pr.poids && reps >= pr.reps) {
    setTimeout(() => PM.toast('🏆 NOUVEAU RECORD !\nFélicitations !', 'pr', 3500), 500);
  }

  // Démarrer repos
  PM.demarrerRepos(90);

  // Re-render
  setTimeout(() => {
    const page = document.querySelector('.page.active');
    if (page) _rendreLive(page, { seanceId });
  }, 300);
};

// ── Timer repos ──
PM._reposTimer  = null;
PM._reposRestant = 0;

PM.demarrerRepos = function(sec) {
  const overlay = document.getElementById('pm-repos-overlay');
  if (!overlay) return;

  clearInterval(PM._reposTimer);
  PM._reposRestant = sec;
  overlay.style.display = 'block';

  const ring  = document.getElementById('pm-repos-ring');
  const count = document.getElementById('pm-repos-count');
  const total = 377;

  PM._reposTimer = setInterval(() => {
    PM._reposRestant--;
    if (count) count.textContent = PM._reposRestant;
    if (ring) {
      const offset = total - (PM._reposRestant / sec) * total;
      ring.style.strokeDashoffset = offset;
    }
    if (PM._reposRestant <= 0) {
      clearInterval(PM._reposTimer);
      overlay.style.display = 'none';
      PM.toast('⏱ Repos terminé — C\'est parti !', 'info');
      try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch(e){}
    }
  }, 1000);
};

PM.reposPlus15 = function() { PM._reposRestant += 15; };

PM.reposPasser = function() {
  clearInterval(PM._reposTimer);
  const overlay = document.getElementById('pm-repos-overlay');
  if (overlay) overlay.style.display = 'none';
};

// ── Terminer séance ──
PM.terminerSeance = function(seanceId) {
  if (!confirm('Terminer la séance ?')) return;
  try {
    if (typeof Tracker?.terminerSeance === 'function') {
      Tracker.terminerSeance(seanceId);
    }
    if (typeof Gamification?.ajouterXP === 'function') {
      Gamification.ajouterXP(100, 'Séance terminée');
    }
  } catch(e) {}
  PM.toast('🎉 Séance terminée !\nBravo pour l\'effort !', 'success', 3500);
  setTimeout(() => naviguer('home'), 800);
};

// ── Onboarding : suivant ──
PM.obSuivant = function() {
  const d = window._OB.data;
  const e = window._OB.etape;

  // Validations
  if (e === 1 && !d.nom.trim()) {
    PM.toast('Entre ton prénom pour continuer !', 'error'); return;
  }
  if (e === 2 && !d.genre) {
    PM.toast('Sélectionne ton genre', 'error'); return;
  }
  if (e === 3 && !d.objectif) {
    PM.toast('Choisis ton objectif', 'error'); return;
  }
  if (e === 4 && !d.niveau) {
    PM.toast('Choisis ton niveau', 'error'); return;
  }
  if (e === 5 && !d.lieu) {
    PM.toast('Choisis ton lieu d\'entraînement', 'error'); return;
  }

  window._OB.etape++;
  _afficherOnboarding();
};

// ── Onboarding : terminer ──
PM.obTerminer = function() {
  const d = window._OB.data;

  const profil = {
    nom:            d.nom || 'Athlète',
    poids:          d.poids,
    taille:         d.taille,
    age:            d.age,
    genre:          d.genre || 'homme',
    objectif:       d.objectif || 'forme',
    niveau:         d.niveau || 'intermediaire',
    lieu:           d.lieu || 'salle',
    muscles_cibles: [...(d.muscles || new Set())],
    avatar:         '💪',
    dateCreation:   new Date().toISOString().split('T')[0]
  };

  // Sauvegarder
  try {
    if (typeof Utils?.storage?.set === 'function') {
      Utils.storage.set('ft_profil', profil);
      Utils.storage.set('ft_profil_onboarding', profil);
    } else {
      localStorage.setItem('ft_profil', JSON.stringify(profil));
      localStorage.setItem('ft_profil_onboarding', JSON.stringify(profil));
    }
  } catch(e) { console.error('[OB] Save error:', e); }

  // Générer programme IA
  try {
    if (typeof Programme?.genererProgramme === 'function') {
      Programme.genererProgramme(profil);
    } else if (typeof Coach?.genererProgramme === 'function') {
      Coach.genererProgramme(profil);
    }
  } catch(e) { console.warn('[OB] Programme gen:', e); }

  // Masquer onboarding
  const screen = document.getElementById('onboarding-screen');
  if (screen) {
    screen.style.display      = 'none';
    screen.style.pointerEvents = 'none';
  }

  // Afficher app
  const app = document.getElementById('app-wrapper');
  if (app) {
    app.style.display      = 'flex';
    app.style.pointerEvents = 'all';
  }

  PM.toast(`Bienvenue ${profil.nom} ! 🎉\nTon programme est prêt`, 'success', 3500);
  setTimeout(() => {
    try { naviguer('home'); } catch(e) {}
  }, 300);
};

// ── Onboarding : toggle muscle ──
PM._obMuscles = new Set();

PM.obToggleMuscle = function(muscle, couleur, el) {
  const d = window._OB?.data;
  if (!d) return;

  const ZONES = {
    pectoraux:  ['ob-z-pec'],
    deltoides:  ['ob-z-del-g','ob-z-del-d'],
    biceps:     ['ob-z-bi-g','ob-z-bi-d'],
    abdominaux: ['ob-z-abs'],
    quadriceps: ['ob-z-quad-g','ob-z-quad-d']
  };

  if (d.muscles.has(muscle)) {
    d.muscles.delete(muscle);
    (ZONES[muscle]||[]).forEach(id => {
      const z = document.getElementById(id);
      if (z) { z.setAttribute('fill','rgba(0,0,0,0)'); z.setAttribute('stroke','rgba(0,0,0,0)'); }
    });
  } else {
    d.muscles.add(muscle);
    (ZONES[muscle]||[]).forEach(id => {
      const z = document.getElementById(id);
      if (z) { z.setAttribute('fill',couleur+'40'); z.setAttribute('stroke',couleur); }
    });
  }

  // Update chips
  const chips = document.getElementById('ob-muscles-chips');
  if (chips) {
    chips.innerHTML = d.muscles.size === 0
      ? `<span style="font-size:.68rem;color:rgba(255,255,255,.3);font-style:italic">
           Clique sur le corps pour cibler des muscles
         </span>`
      : [...d.muscles].map(m => PM.obChipHTML(m)).join('');
  }
};

PM.obChipHTML = function(muscle) {
  const COLORS = {
    pectoraux:'#4b4bf9', deltoides:'#bfa1ff',
    biceps:'#8bf0bb', abdominaux:'#f9ef77', quadriceps:'#22c55e',
    fessiers:'#ff8d96', ischio:'#f9ef77', mollets:'#bfa1ff'
  };
  const LABELS = {
    pectoraux:'Pectoraux', deltoides:'Deltoïdes',
    biceps:'Biceps', abdominaux:'Abdominaux', quadriceps:'Quadriceps',
    fessiers:'Fessiers', ischio:'Ischio', mollets:'Mollets'
  };
  const c = COLORS[muscle] || '#4b4bf9';
  return `
    <span onclick="PM.obToggleMuscle('${muscle}','${c}',null)"
          style="display:inline-flex;align-items:center;gap:4px;
                 padding:4px 10px;background:${c}22;
                 border:1px solid ${c}55;border-radius:99px;
                 font-size:.65rem;font-weight:700;color:${c};
                 cursor:pointer">
      ${LABELS[muscle]||muscle}
      <span style="opacity:.6">✕</span>
    </span>`;
};

window._rendreHome        = _rendreHome;
window._rendreStats       = _rendreStats;
window._rendreTraining    = _rendreTraining;
window._rendreProfil      = _rendreProfil;
window._rendreLive        = _rendreLive;
window._afficherOnboarding = _afficherOnboarding;
window.PM                  = PM;

console.log('✅ UI Premium v2 — Live + Onboarding chargés');
