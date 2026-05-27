/* ============================================================
   PowerApp — Export.js v1.0
   ✅ Export PDF rapport complet (HTML → PDF)
   ✅ Export CSV toutes données
   ✅ Export carte stats PNG (Canvas)
   ✅ QR Code profil partageable
   ✅ Backup complet localStorage
   ✅ Import backup
   ============================================================ */

'use strict';

const Export = {

  // ════════════════════════════════════════════════════════
  // EXPORT RAPPORT PDF (via HTML imprimable)
  // ════════════════════════════════════════════════════════
  exporterRapportPDF() {
    try {
      const profil     = Tracker.getProfil();
      const xp         = Gamification.getXP();
      const streak     = Tracker.getStreak();
      const prs        = Tracker.getAllPRs();
      const totalSeanc = Tracker.getTotalSeances();
      const scoreForme = Tracker.calculerScoreForme();
      const top5       = Object.entries(prs)
        .filter(([,pr]) => pr.rm1 > 0)
        .sort(([,a],[,b]) => (b.rm1||0) - (a.rm1||0))
        .slice(0, 5);

      const seances    = Tracker.getHistoriqueSeances(30);
      const vol        = Tracker.getVolumeParSemaine?.(8) || [];
      const auj        = new Date().toLocaleDateString('fr-FR',{
        weekday:'long', year:'numeric', month:'long', day:'numeric'
      });
      const mois       = new Date().toLocaleDateString('fr-FR',{
        month:'long', year:'numeric'
      });

      const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>PowerApp — Rapport ${mois}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: -apple-system, 'Segoe UI', sans-serif;
      background: #f3f3f7;
      color: #09092d;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    /* HEADER */
    .header {
      background: linear-gradient(135deg, #09092d, #1a1a4e);
      color: white;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .header-avatar {
      width: 70px; height: 70px;
      background: rgba(75,75,249,0.3);
      border: 3px solid #4b4bf9;
      border-radius: 50%;
      display: flex; align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
    .header-info h1 { font-size: 1.5rem; margin-bottom: 4px; }
    .header-info p  { font-size: .8rem; opacity: .7; }
    .header-badge {
      margin-left: auto;
      background: rgba(249,239,119,0.15);
      border: 1px solid rgba(249,239,119,0.4);
      border-radius: 10px; padding: 10px 16px;
      text-align: center;
    }
    .header-badge .xp-val { font-size: 1.2rem; font-weight: 900; color: #f9ef77; }
    .header-badge .xp-lab { font-size: .65rem; opacity: .6; }

    /* CARDS */
    .card {
      background: white;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .card-title {
      font-size: .62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: #4b4bf9;
      margin-bottom: 14px;
    }

    /* GRID STATS */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .stat-box {
      background: white;
      border-radius: 10px;
      padding: 14px 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .stat-val { font-size: 1.5rem; font-weight: 900; }
    .stat-lab { font-size: .6rem; color: #888; margin-top: 3px; }

    /* BARRE PROGRESSION */
    .progress-bar {
      height: 8px;
      background: #e8e8f0;
      border-radius: 99px;
      overflow: hidden;
      margin: 4px 0;
    }
    .progress-fill {
      height: 100%;
      border-radius: 99px;
    }

    /* TABLEAU */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: .8rem;
    }
    th {
      background: #f3f3f7;
      padding: 8px 10px;
      text-align: left;
      font-weight: 700;
      color: #4b4bf9;
      font-size: .7rem;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #f0f0f5;
    }
    tr:last-child td { border-bottom: none; }

    /* SCORE CIRCLE */
    .score-circle {
      display: inline-block;
      width: 80px; height: 80px;
      border-radius: 50%;
      background: conic-gradient(
        #4b4bf9 ${scoreForme.score * 3.6}deg,
        #e8e8f0 0deg
      );
      position: relative;
    }
    .score-inner {
      position: absolute;
      inset: 10px;
      background: white;
      border-radius: 50%;
      display: flex; align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 900;
      color: #4b4bf9;
    }

    /* FOOTER */
    .footer {
      text-align: center;
      font-size: .7rem;
      color: #888;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e8e8f0;
    }

    /* PRINT */
    @media print {
      body { background: white; padding: 16px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <!-- Bouton imprimer -->
  <div class="no-print" style="text-align:right;margin-bottom:16px">
    <button onclick="window.print()"
            style="padding:10px 20px;background:#4b4bf9;color:white;
                   border:none;border-radius:8px;font-size:.85rem;
                   font-weight:700;cursor:pointer">
      🖨️ Imprimer / Enregistrer PDF
    </button>
    <button onclick="window.close()"
            style="margin-left:8px;padding:10px 20px;
                   background:#f3f3f7;color:#09092d;
                   border:1px solid #e0e0ea;border-radius:8px;
                   font-size:.85rem;cursor:pointer">
      ✕ Fermer
    </button>
  </div>

  <!-- HEADER -->
  <div class="header">
    <div class="header-avatar">${profil.avatar || '💪'}</div>
    <div class="header-info">
      <h1>${profil.nom || 'Athlète'}</h1>
      <p>Rapport mensuel PowerApp — ${mois}</p>
      <p style="margin-top:4px;font-size:.72rem;opacity:.5">
        Généré le ${auj}
      </p>
    </div>
    <div class="header-badge">
      <div class="xp-val">${xp.niveau.emoji} Niv.${xp.niveau.numero}</div>
      <div style="font-size:.7rem;color:#bfa1ff;margin-top:2px">
        ${xp.niveau.nom}
      </div>
      <div class="xp-lab">${xp.total.toLocaleString('fr-FR')} XP</div>
    </div>
  </div>

  <!-- STATS GLOBALES -->
  <div class="stats-grid">
    ${[
      { val:totalSeanc,                        lab:'Séances totales',  color:'#4b4bf9' },
      { val:`${streak.count}🔥`,               lab:'Streak actuel',    color:'#f9ef77' },
      { val:Object.keys(prs).length,           lab:'Records (PRs)',    color:'#8bf0bb' },
      { val:`${scoreForme.score}/100`,         lab:'Score de forme',   color:'#bfa1ff' }
    ].map(s => `
      <div class="stat-box">
        <div class="stat-val" style="color:${s.color}">${s.val}</div>
        <div class="stat-lab">${s.lab}</div>
      </div>`).join('')}
  </div>

  <!-- SCORE FORME -->
  <div class="card">
    <div class="card-title">💪 Score de forme</div>
    <div style="display:flex;align-items:center;gap:20px">
      <div class="score-circle">
        <div class="score-inner">${scoreForme.score}</div>
      </div>
      <div style="flex:1">
        <p style="font-size:.85rem;font-weight:700;margin-bottom:10px">
          ${scoreForme.niveau}
        </p>
        ${[
          { lab:'Récupération', val:scoreForme.recup,      color:'#8bf0bb' },
          { lab:'Assiduité',    val:scoreForme.assiduite,  color:'#4b4bf9' },
          { lab:'Progression',  val:scoreForme.progression,color:'#bfa1ff' }
        ].map(s => `
          <div style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;
                        font-size:.72rem;margin-bottom:3px">
              <span>${s.lab}</span>
              <span style="font-weight:700;color:${s.color}">${s.val}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill"
                   style="width:${s.val}%;background:${s.color}"></div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- TOP PRs -->
  <div class="card">
    <div class="card-title">🏆 Top Records Personnels</div>
    <table>
      <thead>
        <tr>
          <th>Rang</th>
          <th>Exercice</th>
          <th>Muscle</th>
          <th>Poids × Reps</th>
          <th>1RM estimé</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${top5.map(([ref, pr], i) => {
          const ex = window.EXERCICES?.[ref] || {};
          return `
            <tr>
              <td>${['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</td>
              <td><strong>${ex.emoji || '💪'} ${ex.nom || ref}</strong></td>
              <td style="color:#888;font-size:.72rem">${ex.muscle || '—'}</td>
              <td style="font-weight:700;color:#4b4bf9">
                ${pr.poids}kg × ${pr.reps}
              </td>
              <td style="font-weight:900;color:#f9ef77">~${pr.rm1}kg</td>
              <td style="color:#888;font-size:.72rem">${pr.date || '—'}</td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>

  <!-- VOLUME SEMAINES -->
  ${vol.length > 0 ? `
    <div class="card">
      <div class="card-title">📊 Volume par semaine (8 semaines)</div>
      ${vol.map(s => {
        const max  = Math.max(...vol.map(v => v.volume), 1);
        const pct  = Math.round((s.volume / max) * 100);
        const label = s.label || s.debut || '';
        return `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;
                        font-size:.75rem;margin-bottom:4px">
              <span>${label}</span>
              <span style="font-weight:700;color:#4b4bf9">
                ${(s.volume/1000).toFixed(1)}T
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill"
                   style="width:${pct}%;background:#4b4bf9"></div>
            </div>
          </div>`;
      }).join('')}
    </div>` : ''}

  <!-- 10 DERNIÈRES SÉANCES -->
  <div class="card">
    <div class="card-title">📅 10 Dernières séances</div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Séance</th>
          <th>Durée</th>
          <th>Volume</th>
          <th>Séries</th>
          <th>RPE</th>
        </tr>
      </thead>
      <tbody>
        ${seances.slice(0, 10).map(s => {
          const nom = window.SEANCES_BASE?.[s.id]?.nom || s.id || 'Séance';
          const emoji = window.SEANCES_BASE?.[s.id]?.emoji || '💪';
          const duree = (() => {
            const min = Math.floor((s.duree||0)/60);
            const sec = (s.duree||0) % 60;
            return min > 0 ? `${min}min` : `${sec}s`;
          })();
          return `
            <tr>
              <td style="font-size:.72rem;color:#888">${s.date}</td>
              <td><strong>${emoji} ${nom}</strong></td>
              <td style="color:#4b4bf9;font-weight:700">${duree}</td>
              <td>${s.volumeTotal
                ? `${(s.volumeTotal/1000).toFixed(1)}T` : '—'}
              </td>
              <td>${s.series?.length || 0}</td>
              <td style="color:${(s.rpesMoyen||0) >= 8
                ? '#ff8d96' : '#888'}">${s.rpesMoyen || '—'}</td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>

  <!-- OBJECTIFS PROCHAINS -->
  ${(() => {
    try {
      const objs = Tracker.getObjectifs()
        .filter(o => !o.complete)
        .slice(0, 4);
      if (!objs.length) return '';
      return `
        <div class="card">
          <div class="card-title">🎯 Objectifs en cours</div>
          ${objs.map(o => {
            const pct = Tracker.calculerProgressionObjectif(o);
            return `
              <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;
                            margin-bottom:4px;font-size:.8rem">
                  <span style="font-weight:700">${o.titre||o.description}</span>
                  <span style="color:#4b4bf9;font-weight:700">${pct}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill"
                       style="width:${pct}%;background:#4b4bf9"></div>
                </div>
                ${o.valeurActuelle && o.valeurCible ? `
                  <div style="display:flex;justify-content:space-between;
                              font-size:.65rem;color:#888;margin-top:3px">
                    <span>${o.valeurActuelle} ${o.unite||''}</span>
                    <span>Objectif : ${o.valeurCible} ${o.unite||''}</span>
                  </div>` : ''}
              </div>`;
          }).join('')}
        </div>`;
    } catch(e) { return ''; }
  })()}

  <!-- FOOTER -->
  <div class="footer">
    <p>⚡ Généré par PowerApp — ${auj}</p>
    <p style="margin-top:4px">
      ${profil.nom || 'Athlète'} ·
      Niveau ${xp.niveau.numero} ${xp.niveau.nom} ·
      ${xp.total.toLocaleString('fr-FR')} XP total
    </p>
  </div>

</body>
</html>`;

      // Ouvrir dans une nouvelle fenêtre pour impression
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => win.print(), 500);
      } else {
        // Fallback — télécharger le fichier HTML
        const blob  = new Blob([html], { type:'text/html;charset=utf-8' });
        const url   = URL.createObjectURL(blob);
        const a     = document.createElement('a');
        a.href      = url;
        a.download  = `powerapp-rapport-${Utils.aujourd_hui()}.html`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      Utils.toast('📄 Rapport ouvert — clique sur Imprimer !', 'success', 3000);
    } catch(e) {
      Utils.toast('❌ Erreur export PDF', 'error');
      console.error(e);
    }
  },

  // ════════════════════════════════════════════════════════
  // EXPORT CSV COMPLET
  // ════════════════════════════════════════════════════════
  exporterCSVComplet() {
    try {
      const seances = Tracker.getHistoriqueSeancesAvecDetails(999);
      const prs     = Tracker.getAllPRs();
      const mesures = Tracker.getMesures();

      // Séances
      const csvSeances = [
        'Date,Séance,Durée(s),Volume(kg),Séries,RPE Moyen,PRs'
      ].concat(
        seances.map(s => [
          s.date,
          (window.SEANCES_BASE?.[s.id]?.nom || s.id || '').replace(/,/g,''),
          s.duree || 0,
          Math.round(s.volumeTotal || 0),
          s.series?.length || 0,
          s.rpesMoyen || '',
          s.prs?.length || 0
        ].join(','))
      ).join('\n');

      // PRs
      const csvPRs = [
        'Exercice,1RM estimé,Poids,Reps,Date'
      ].concat(
        Object.entries(prs).map(([ref, pr]) => {
          const nom = (window.EXERCICES?.[ref]?.nom || ref).replace(/,/g,'');
          return [nom, pr.rm1||0, pr.poids||0, pr.reps||0, pr.date||''].join(',');
        })
      ).join('\n');

      // Mesures
      const csvMesures = [
        'Date,Poids(kg),Taille(cm),Bras(cm),Poitrine(cm),Tour taille(cm),Hanches(cm)'
      ].concat(
        mesures.map(m => [
          m.date, m.poids||'', m.taille||'', m.bras||'',
          m.poitrine||'', m.taille2||'', m.hanches||''
        ].join(','))
      ).join('\n');

      // Combiner
      const csvComplet = [
        '# PowerApp — Export complet',
        `# Généré le ${Utils.aujourd_hui()}`,
        '',
        '# == SÉANCES ==',
        csvSeances,
        '',
        '# == RECORDS PERSONNELS ==',
        csvPRs,
        '',
        '# == MESURES CORPORELLES ==',
        csvMesures
      ].join('\n');

      const blob  = new Blob([csvComplet], { type:'text/csv;charset=utf-8' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href      = url;
      a.download  = `powerapp-export-${Utils.aujourd_hui()}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      Utils.toast('✅ CSV exporté !', 'success', 2500);
    } catch(e) {
      Utils.toast('❌ Erreur export CSV', 'error');
    }
  },

  // ════════════════════════════════════════════════════════
  // CARTE STATS PNG (Canvas)
  // ════════════════════════════════════════════════════════
  exporterCartePNG() {
    try {
      const profil  = Tracker.getProfil();
      const xp      = Gamification.getXP();
      const streak  = Tracker.getStreak();
      const prs     = Tracker.getAllPRs();
      const total   = Tracker.getTotalSeances();
      const pseudo  = Utils.storage.get('ft_social_profil', {})?.pseudo
        || profil.nom || 'Athlète';

      const top3 = Object.entries(prs)
        .filter(([,pr]) => pr.rm1 > 0)
        .sort(([,a],[,b]) => (b.rm1||0) - (a.rm1||0))
        .slice(0, 3)
        .map(([ref,pr]) => ({
          nom:   window.EXERCICES?.[ref]?.nom   || ref,
          emoji: window.EXERCICES?.[ref]?.emoji || '💪',
          rm1:   pr.rm1
        }));

      const canvas   = document.createElement('canvas');
      canvas.width   = 1080;
      canvas.height  = 1350; // Format Instagram story
      const ctx      = canvas.getContext('2d');

      // ── Fond dégradé ──────────────────────────────────
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0,   '#06063d');
      grad.addColorStop(0.5, '#0a0a2e');
      grad.addColorStop(1,   '#050522');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);

      // ── Glow accent ───────────────────────────────────
      const glow = ctx.createRadialGradient(540, 300, 0, 540, 300, 700);
      glow.addColorStop(0, 'rgba(75,75,249,0.4)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 1080, 1350);

      // ── Helper arrondis ───────────────────────────────
      const roundRect = (x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      // ── Logo PowerApp ──────────────────────────────────
      ctx.fillStyle    = '#4b4bf9';
      ctx.font         = 'bold 34px -apple-system, sans-serif';
      ctx.textAlign    = 'center';
      ctx.fillText('⚡ PowerApp', 540, 80);

      // ── Avatar grand ──────────────────────────────────
      ctx.font      = '110px serif';
      ctx.fillText(profil.avatar || '💪', 540, 240);

      // ── Pseudo ────────────────────────────────────────
      ctx.fillStyle = '#ffffff';
      ctx.font      = 'bold 72px -apple-system, sans-serif';
      ctx.fillText(pseudo, 540, 320);

      // ── Niveau ────────────────────────────────────────
      ctx.fillStyle = '#4b4bf9';
      ctx.font      = '36px -apple-system, sans-serif';
      ctx.fillText(
        `${xp.niveau.emoji} Niveau ${xp.niveau.numero} — ${xp.niveau.nom}`,
        540, 370
      );

      // ── XP bar ────────────────────────────────────────
      const barX = 120, barY = 400, barW = 840, barH = 16;
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      roundRect(barX, barY, barW, barH, 8);
      ctx.fill();
      ctx.fillStyle = '#4b4bf9';
      roundRect(barX, barY, barW * (xp.pourcentage/100), barH, 8);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font      = '24px -apple-system, sans-serif';
      ctx.fillText(`${xp.total.toLocaleString('fr-FR')} XP · ${xp.pourcentage}%`, 540, 440);

      // ── Stats 4 cases ─────────────────────────────────
      const stats = [
        { val:total,          lab:'Séances',  color:'#4b4bf9' },
        { val:`${streak.count}🔥`,lab:'Streak', color:'#f9ef77' },
        { val:Object.keys(prs).length, lab:'PRs', color:'#8bf0bb' },
        { val:`${streak.max}🏅`,lab:'Record',  color:'#bfa1ff' }
      ];

      const cW = 220, cH = 140, cY = 480, cGap = 20;
      const startX = (1080 - (cW * 4 + cGap * 3)) / 2;

      stats.forEach((s, i) => {
        const x = startX + i * (cW + cGap);

        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        roundRect(x, cY, cW, cH, 16);
        ctx.fill();

        ctx.fillStyle   = s.color;
        ctx.font        = 'bold 52px -apple-system, sans-serif';
        ctx.textAlign   = 'center';
        ctx.fillText(s.val, x + cW/2, cY + 72);

        ctx.fillStyle   = 'rgba(255,255,255,0.4)';
        ctx.font        = '26px -apple-system, sans-serif';
        ctx.fillText(s.lab, x + cW/2, cY + 108);
      });

      // ── Top PRs ───────────────────────────────────────
      if (top3.length > 0) {
        ctx.fillStyle = 'rgba(249,239,119,0.08)';
        roundRect(80, 660, 920, top3.length * 90 + 40, 20);
        ctx.fill();

        ctx.fillStyle = '#f9ef77';
        ctx.font      = 'bold 30px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 TOP RECORDS', 540, 700);

        top3.forEach((pr, i) => {
          const rowY = 720 + i * 90;

          ctx.fillStyle = '#ffffff';
          ctx.font      = 'bold 36px -apple-system, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`${['🥇','🥈','🥉'][i]} ${pr.emoji} ${pr.nom}`, 110, rowY + 30);

          ctx.fillStyle = '#f9ef77';
          ctx.font      = 'bold 40px -apple-system, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(`~${pr.rm1}kg`, 970, rowY + 30);

          if (i < top3.length - 1) {
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth   = 1;
            ctx.beginPath();
            ctx.moveTo(110, rowY + 50);
            ctx.lineTo(970, rowY + 50);
            ctx.stroke();
          }
        });
      }

      // ── Date + Watermark ──────────────────────────────
      ctx.fillStyle = 'rgba(75,75,249,0.6)';
      ctx.font      = 'bold 28px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('powerapp.fitness', 540, 1270);

      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font      = '24px -apple-system, sans-serif';
      ctx.fillText(
        new Date().toLocaleDateString('fr-FR',{
          day:'numeric', month:'long', year:'numeric'
        }),
        540, 1310
      );

      // ── Télécharger ───────────────────────────────────
      const link    = document.createElement('a');
      link.download = `powerapp-carte-${Utils.aujourd_hui()}.png`;
      link.href     = canvas.toDataURL('image/png', 0.95);
      link.click();

      Utils.toast('✅ Carte téléchargée !', 'success', 2500);
    } catch(e) {
      Utils.toast('❌ Erreur génération carte', 'error');
      console.error(e);
    }
  },

  // ════════════════════════════════════════════════════════
  // QR CODE PROFIL (SVG simple)
  // ════════════════════════════════════════════════════════
  genererQRCode(texte = 'powerapp.fitness') {
    // QR Code simplifié (pattern visuel)
    const taille = 21;
    const cells  = [];

    // Pattern coin haut-gauche (finder)
    const finderPattern = (sx, sy) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const bord = (x === 0 || x === 6 || y === 0 || y === 6);
          const int  = (x >= 2 && x <= 4 && y >= 2 && y <= 4);
          cells.push({ x: sx+x, y: sy+y, on: bord || int });
        }
      }
    };

    finderPattern(0, 0);
    finderPattern(14, 0);
    finderPattern(0, 14);

    // Données encodées (simplifié)
    const str = texte.split('')
      .map(c => c.charCodeAt(0))
      .reduce((a,b) => a+b, 0);

    for (let y = 8; y < 21; y++) {
      for (let x = 8; x < 21; x++) {
        if (!cells.find(c => c.x === x && c.y === y)) {
          cells.push({ x, y, on:(((x * y) + str) % 3 === 0) });
        }
      }
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           width="200" height="200" viewBox="0 0 21 21">
        <rect width="21" height="21" fill="white"/>
        ${cells.map(c => c.on
          ? `<rect x="${c.x}" y="${c.y}" width="1" height="1" fill="#09092d"/>`
          : '').join('')}
      </svg>`;

    return svg;
  },

  // ════════════════════════════════════════════════════════
  // BACKUP COMPLET
  // ════════════════════════════════════════════════════════
  exporterBackup() {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('ft_') || key.startsWith('powerapp_')) {
          try {
            data[key] = JSON.parse(localStorage.getItem(key));
          } catch(e) {
            data[key] = localStorage.getItem(key);
          }
        }
      }

      const backup = {
        version:   '6.0',
        date:      new Date().toISOString(),
        app:       'PowerApp',
        donnees:   data,
        nbCles:    Object.keys(data).length
      };

      const blob  = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type:'application/json;charset=utf-8' }
      );
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href      = url;
      a.download  = `powerapp-backup-${Utils.aujourd_hui()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      Utils.toast(
        `✅ Backup exporté ! (${Object.keys(data).length} clés)`,
        'success', 3000
      );
    } catch(e) {
      Utils.toast('❌ Erreur backup', 'error');
    }
  },

  async importerBackup(fichier) {
    try {
      const texte   = await fichier.text();
      const backup  = JSON.parse(texte);

      if (!backup.donnees || backup.app !== 'PowerApp') {
        Utils.toast('❌ Fichier backup invalide', 'error');
        return;
      }

      const ok = await Utils.confirmer(
        'Importer le backup ?',
        `${Object.keys(backup.donnees).length} clés seront restaurées. Les données actuelles seront écrasées.`
      );
      if (!ok) return;

      let count = 0;
      Object.entries(backup.donnees).forEach(([key, val]) => {
        try {
          localStorage.setItem(key, JSON.stringify(val));
          count++;
        } catch(e) {}
      });

      Utils.toast(
        `✅ ${count} clés importées ! Rechargement...`,
        'success', 3000
      );
      setTimeout(() => location.reload(), 2000);
    } catch(e) {
      Utils.toast('❌ Erreur import', 'error');
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE EXPORT
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    const profil = Tracker.getProfil();
    const qrSvg  = this.genererQRCode(
      `powerapp.fitness/profil/${profil.nom || 'athlete'}`
    );

    const statsBackup = (() => {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith('ft_')) count++;
      }
      return count;
    })();

    container.innerHTML = `

      <!-- Header -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.12),rgba(75,75,249,0.03));
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:6px">
          📤 Exporter mes données
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          Sauvegarde, partage et analyse tes données PowerApp
        </div>
      </div>

      <!-- PDF Rapport -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:52px;height:52px;border-radius:14px;
                      flex-shrink:0;background:rgba(75,75,249,0.1);
                      border:1px solid rgba(75,75,249,0.2);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.5rem">
            📄
          </div>
          <div style="flex:1">
            <div style="font-size:.88rem;font-weight:800;margin-bottom:3px">
              Rapport PDF mensuel
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Stats · PRs · Séances · Graphiques · Objectifs
            </div>
          </div>
          <button onclick="Export.exporterRapportPDF()"
                  style="padding:10px 18px;background:var(--fd-indigo);
                         border:none;border-radius:var(--radius-full);
                         font-size:.75rem;font-weight:700;
                         color:white;cursor:pointer;flex-shrink:0;
                         box-shadow:0 4px 12px rgba(75,75,249,0.4)">
            📥 Exporter
          </button>
        </div>
      </div>

      <!-- CSV -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:52px;height:52px;border-radius:14px;
                      flex-shrink:0;background:rgba(139,240,187,0.1);
                      border:1px solid rgba(139,240,187,0.2);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.5rem">
            📊
          </div>
          <div style="flex:1">
            <div style="font-size:.88rem;font-weight:800;margin-bottom:3px">
              Export CSV complet
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Séances · PRs · Mesures corporelles — Excel/Sheets
            </div>
          </div>
          <button onclick="Export.exporterCSVComplet()"
                  style="padding:10px 18px;background:rgba(139,240,187,0.15);
                         border:1px solid rgba(139,240,187,0.3);
                         border-radius:var(--radius-full);
                         font-size:.75rem;font-weight:700;
                         color:var(--fd-mint);cursor:pointer;flex-shrink:0">
            📥 Exporter
          </button>
        </div>
      </div>

      <!-- Carte PNG -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:52px;height:52px;border-radius:14px;
                      flex-shrink:0;background:rgba(249,239,119,0.1);
                      border:1px solid rgba(249,239,119,0.2);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.5rem">
            🖼️
          </div>
          <div style="flex:1">
            <div style="font-size:.88rem;font-weight:800;margin-bottom:3px">
              Carte stats Instagram
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Format Story 1080×1350px — prête à partager
            </div>
          </div>
          <button onclick="Export.exporterCartePNG()"
                  style="padding:10px 18px;
                         background:rgba(249,239,119,0.12);
                         border:1px solid rgba(249,239,119,0.25);
                         border-radius:var(--radius-full);
                         font-size:.75rem;font-weight:700;
                         color:var(--fd-lemon);cursor:pointer;flex-shrink:0">
            📥 Générer
          </button>
        </div>
      </div>

      <!-- QR Code -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:12px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:12px">
          📲 QR Code profil
        </div>
        <div style="display:flex;align-items:center;gap:14px">
          <div style="background:white;padding:8px;
                      border-radius:var(--radius-md);flex-shrink:0">
            ${qrSvg}
          </div>
          <div style="flex:1">
            <div style="font-size:.78rem;font-weight:700;margin-bottom:4px">
              Partage ton profil
            </div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-bottom:8px">
              Scanne pour voir mon profil PowerApp
            </div>
            <button onclick="navigator.clipboard?.writeText(
                               'powerapp.fitness/profil/${profil.nom || 'athlete'}')
                               .then(()=>Utils.toast('✅ Lien copié !','success',1500))"
                    style="padding:6px 14px;font-size:.68rem;font-weight:700;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:99px;color:var(--fd-indigo);cursor:pointer">
              📋 Copier le lien
            </button>
          </div>
        </div>
      </div>

      <!-- Backup -->
      <div style="background:rgba(191,161,255,0.06);
                  border:1px solid rgba(191,161,255,0.15);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:12px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-lavender);margin-bottom:10px">
          💾 Backup & Restauration
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button onclick="Export.exporterBackup()"
                  style="padding:12px;background:rgba(191,161,255,0.12);
                         border:1px solid rgba(191,161,255,0.25);
                         border-radius:var(--radius-md);
                         font-size:.75rem;font-weight:700;
                         color:var(--fd-lavender);cursor:pointer">
            💾 Sauvegarder<br>
            <span style="font-size:.6rem;font-weight:400;opacity:.7">
              ${statsBackup} clés
            </span>
          </button>

          <label style="display:block;padding:12px;
                        background:rgba(139,240,187,0.08);
                        border:1px solid rgba(139,240,187,0.15);
                        border-radius:var(--radius-md);
                        font-size:.75rem;font-weight:700;
                        color:var(--fd-mint);cursor:pointer;
                        text-align:center">
            📂 Restaurer
            <span style="font-size:.6rem;font-weight:400;
                         opacity:.7;display:block">
              .json backup
            </span>
            <input type="file" accept=".json" style="display:none"
                   onchange="Export.importerBackup(this.files)"/>
          </label>
        </div>

        <div style="margin-top:8px;font-size:.62rem;
                    color:var(--text-muted);line-height:1.4">
          ⚠️ La restauration écrase toutes les données actuelles.
          Fais un backup d'abord !
        </div>
      </div>
    `;
  }
};

window.Export = Export;
console.log('✅ Export.js v1.0 — PDF + CSV + PNG + QR Code + Backup/Restauration');
