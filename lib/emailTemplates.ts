/**
 * Modèles d'Emails Officiels — RÉUSSIR POLYTECH
 * Design épuré, lumineux avec le dégradé bleu ciel officiel du logo.
 * Slogan officiel : « L'excellence est notre seul standard. »
 * Plateforme : RÉUSSIR POLYTECH (Groupe d'Études Réussir Polytech).
 */

export const BRAND_CONFIG = {
  name: 'RÉUSSIR POLYTECH',
  groupName: 'Groupe d\'Études Réussir Polytech',
  slogan: "L'excellence est notre seul standard.",
  senderName: "L'équipe RÉUSSIR POLYTECH",
  senderEmail: 'gwetsamuel49@gmail.com',
  siteUrl: 'https://reussirpolytech.vercel.app',
  vipUrl: 'https://reussirpolytech.vercel.app/entrepreneur-vip',
  logoUrl: 'https://reussirpolytech.vercel.app/icons/icon-192x192.png',
  colors: {
    gradientHeader: 'linear-gradient(135deg, #0A4368 0%, #0284C7 45%, #0EA5E9 75%, #38BDF8 100%)',
    primary: '#0284C7',
    skyLight: '#38BDF8',
    cyanAccent: '#0EA5E9',
    gold: '#D4AF37',
    goldLight: '#FEF3C7',
    goldBorder: '#FDE68A',
    goldText: '#92400E',
    darkNavy: '#0F172A',
    bodyText: '#334155',
    bg: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
  },
};

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ========================================================================= */
/* 1. EMAIL OFFICIEL DE BIENVENUE & DE FÉLICITATIONS (Connexion & Inscription) */
/* ========================================================================= */
export interface WelcomeEmailParams {
  name: string;
  email: string;
  password?: string;
  level?: string;
  matricule?: string;
  actionType?: 'welcome' | 'login';
}

export function renderWelcomeEmail({
  name,
  email,
  password,
  level = 'MSP1',
  matricule,
  actionType = 'welcome',
}: WelcomeEmailParams) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeEmail = escapeHtml(email);
  const cleanLevel = (level || 'MSP1').toUpperCase();
  const isMsp2 = cleanLevel === 'MSP2';
  const safeLevel = isMsp2 ? 'MSP2' : 'MSP1';
  const safeMatricule = matricule ? escapeHtml(matricule) : 'En cours';
  const safePassword = password ? escapeHtml(password) : '•••••••• (Sécurisé)';
  const targetLevelPath = isMsp2 ? 'msp2' : 'msp1';
  const targetUrl = `${BRAND_CONFIG.siteUrl}/${targetLevelPath}`;

  const isWelcome = actionType === 'welcome';
  const subject = isWelcome
    ? `Félicitations ${safeName} ! Vous n'êtes plus seul — Réussir Polytech (${safeLevel})`
    : `Confirmation de connexion — Réussir Polytech (${safeLevel})`;

  const preheader = `Toutes nos félicitations pour votre accès à Réussir Polytech ! Découvrez vos matières en ${safeLevel}, vos conseils d'apprentissage et votre accès direct.`;

  // Programme des matières académiques par filière
  const subjectsMsp1 = [
    { title: 'Analyse Mathématique I & II', desc: 'Calcul différentiel, intégrales, développements limités, suites et séries' },
    { title: 'Algèbre Linéaire & Géométrie', desc: 'Espaces vectoriels, calcul matriciel, systèmes linéaires, géométrie' },
    { title: 'Mécanique Générale', desc: 'Cinématique et dynamique newtonienne du point matériel, énergie' },
    { title: 'Optique & Ondes', desc: 'Lois de Snell-Descartes, systèmes optiques, miroirs, lentilles et ondes' },
    { title: 'Chimie Générale & Thermodynamique', desc: 'Équilibres en solution, bilans énergétiques, premier et second principes' },
    { title: 'Informatique & Algorithmique', desc: 'Logique procédurale, variables, boucles, structures conditionnelles' },
  ];

  const subjectsMsp2 = [
    { title: 'Algèbre Multilinéaire (MTH211)', desc: 'Formes multilinéaires, déterminants, réduction d\'endomorphismes, diagonalisation' },
    { title: 'Analyse Vectorielle & Intégrales (MTH212)', desc: 'Intégrales multiples, séries de Fourier, théorèmes de Stokes et Green-Ostrogradski' },
    { title: 'Mécanique Rationnelle & Solides (PHY211)', desc: 'Torseurs, cinématique et dynamique des solides indéformables' },
    { title: 'Électromagnétisme & Ondes (PHY212)', desc: 'Équations de Maxwell, énergie électromagnétique, ondes guidées et libres' },
    { title: 'Algorithmique Avancée & Données (INF211)', desc: 'Complexité algorithmique, arbres, graphes et tris avancés' },
    { title: 'Probabilités & Statistiques (MTH213)', desc: 'Variables aléatoires discrètes et continues, lois de probabilité' },
  ];

  const activeSubjects = isMsp2 ? subjectsMsp2 : subjectsMsp1;

  const subjectsHtml = activeSubjects
    .map(
      (s, idx) => `
    <tr>
      <td style="padding:8px 0;vertical-align:top;width:24px;">
        <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#E0F2FE;color:#0284C7;font-size:10px;font-weight:800;text-align:center;line-height:20px;border:1px solid #BAE6FD;">
          ${idx + 1}
        </span>
      </td>
      <td style="padding:8px 0 8px 10px;font-size:13px;line-height:20px;color:#334155;">
        <strong style="color:#0F172A;">${escapeHtml(s.title)}</strong> — <span style="color:#64748B;">${escapeHtml(s.desc)}</span>
      </td>
    </tr>`
    )
    .join('');

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(subject)}</title>
  <style>
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #F8FAFC !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
    }
    table { border-collapse: collapse !important; }
    img { border: 0 !important; outline: none !important; text-decoration: none !important; }
    a { text-decoration: none !important; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding: 24px 18px !important; }
      .btn-responsive { width: 100% !important; display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;">
  <!-- Pré-en-tête discret -->
  <div style="display:none;font-size:1px;line-height:1px;color:#F8FAFC;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- CARTE PRINCIPALE -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:18px;border:1px solid #E2E8F0;box-shadow:0 8px 30px rgba(15,23,42,0.06);overflow:hidden;">
          
          <!-- EN-TÊTE DÉGRADÉ BLEU CLAIR DU LOGO AVEC ACCENTS OR -->
          <tr>
            <td style="background:linear-gradient(135deg, #0A4368 0%, #0284C7 45%, #0EA5E9 75%, #38BDF8 100%);padding:26px 32px 22px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:16px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:50%;border:2px solid #D4AF37;box-shadow:0 2px 8px rgba(0,0,0,0.2);" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:19px;line-height:22px;font-weight:900;color:#FFFFFF;letter-spacing:-0.2px;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#FDE68A;font-weight:700;margin-top:3px;font-style:italic;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:5px 12px;background:rgba(255,255,255,0.18);border:1px solid #D4AF37;border-radius:20px;font-size:10px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;white-space:nowrap;">
                      PROMOTION 2026
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LISERÉ DE SÉPARATION OR -->
          <tr>
            <td height="3" style="background:#D4AF37;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- CORPS PRINCIPAL ÉPURÉ -->
          <tr>
            <td class="mobile-padding" style="padding:32px 32px 26px;">
              
              <!-- Badge Statut vert clair net -->
              <div style="margin-bottom:16px;">
                <span style="display:inline-block;padding:5px 14px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:20px;font-size:11px;font-weight:800;color:#065F46;">
                  ✓ INSCRIPTION ACADÉMIQUE VALIDÉE &bull; ${safeLevel}
                </span>
              </div>

              <!-- Titre d'Accueil Chaleureux -->
              <h1 style="margin:0 0 16px;font-size:23px;line-height:30px;font-weight:900;color:#0F172A;letter-spacing:-0.4px;">
                Félicitations ${safeName} ! Vous n'êtes plus seul.
              </h1>

              <!-- Message Principal -->
              <p style="margin:0 0 22px;font-size:14px;line-height:24px;color:#334155;">
                Toutes nos félicitations pour votre inscription sur <strong>Réussir Polytech</strong> ! Sachez que désormais, vous n'êtes plus seul : vous rejoignez une communauté active d'élèves-ingénieurs déterminés qui apprennent, s'entraident et progressent ensemble à tout moment sur la plateforme.
              </p>

              <!-- CARTE COORDONNÉES OFFICIELLES (En cas d'oubli) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #0284C7;border-radius:12px;margin-bottom:26px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-size:11px;font-weight:800;color:#0284C7;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">
                      Vos Identifiants d'Accès Officiels
                    </div>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom:5px;width:38%;font-size:12px;font-weight:700;color:#64748B;">Nom complet :</td>
                        <td style="padding-bottom:5px;font-size:13px;font-weight:800;color:#0F172A;">${safeName}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:5px;font-size:12px;font-weight:700;color:#64748B;">Email de connexion :</td>
                        <td style="padding-bottom:5px;font-size:13px;font-weight:700;color:#0F172A;">${safeEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:5px;font-size:12px;font-weight:700;color:#64748B;">Filière :</td>
                        <td style="padding-bottom:5px;font-size:12px;font-weight:800;color:#0284C7;">${safeLevel} (Semestre officiel)</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:5px;font-size:12px;font-weight:700;color:#64748B;">Matricule :</td>
                        <td style="padding-bottom:5px;font-size:13px;font-weight:800;color:#0F172A;font-family:monospace;">${safeMatricule}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:4px;font-size:12px;font-weight:700;color:#B8860B;">Mot de passe (rappel) :</td>
                        <td style="padding-top:4px;">
                          <span style="display:inline-block;padding:3px 8px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:6px;font-size:12px;font-weight:800;color:#92400E;font-family:monospace;">
                            ${safePassword}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- COMMENT UTILISER LA PLATEFORME (GUIDE SIMPLE & DIRECT) -->
              <div style="margin-bottom:24px;">
                <div style="font-size:13px;font-weight:900;color:#0F172A;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                  Comment tirer le meilleur parti de Réussir Polytech ?
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:21px;color:#334155;">
                      <strong style="color:#0284C7;">1. Accédez à vos cours :</strong> Cliquez directement sur le bouton ci-dessous pour entrer dans votre espace d'étude ${safeLevel}.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:21px;color:#334155;">
                      <strong style="color:#0284C7;">2. Téléchargez les polycopiés &amp; TD :</strong> Révisez la théorie et préparez les exercices avant chaque amphi.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:21px;color:#334155;">
                      <strong style="color:#0284C7;">3. Entraînez-vous sur les annales :</strong> Testez-vous sur les Contrôles Continus (CC) et examens résolus des promotions précédentes.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- BOUTON D'ACCÈS PRINCIPAL (BLEU DÉGRADÉ LUMINEUX) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
                <tr>
                  <td align="center">
                    <a href="${targetUrl}" target="_blank" class="btn-responsive" style="display:inline-block;padding:14px 34px;background:linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%);color:#FFFFFF;font-size:14px;font-weight:900;border-radius:12px;box-shadow:0 4px 14px rgba(2,132,199,0.35);letter-spacing:0.2px;">
                      Accéder à mes cours &amp; annales (${safeLevel}) &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- MATIÈRES DU SEMESTRE SELON MSP1 OU MSP2 -->
              <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:20px;margin-bottom:26px;">
                <div style="font-size:12px;font-weight:900;color:#0F172A;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                  Vos Matières Clés à Maîtriser en ${safeLevel} :
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  ${subjectsHtml}
                </table>
              </div>

              <!-- QUELQUES CONSEILS CONCRETS POUR MIEUX APPRENDRE -->
              <div style="border:1px solid #E2E8F0;border-left:4px solid #D4AF37;border-radius:12px;padding:18px 20px;background:#FFFFFF;margin-bottom:28px;">
                <div style="font-size:12px;font-weight:900;color:#B8860B;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">
                  3 Conseils Clés pour Réussir avec Méthode :
                </div>
                <div style="font-size:13px;line-height:22px;color:#334155;margin-bottom:8px;">
                  &bull; <strong style="color:#0F172A;">Travaillez en amont :</strong> Parcourez le polycopié la veille du cours. Vous retiendrez 80% des notions clés dès la première séance.
                </div>
                <div style="font-size:13px;line-height:22px;color:#334155;margin-bottom:8px;">
                  &bull; <strong style="color:#0F172A;">Cherchez avant de regarder la solution :</strong> La véritable force de compréhension se développe pendant l'effort de recherche individuel.
                </div>
                <div style="font-size:13px;line-height:22px;color:#334155;">
                  &bull; <strong style="color:#0F172A;">Régularité et constance :</strong> 1h30 de travail méthodique chaque soir surclasse toujours une nuit blanche avant l'examen.
                </div>
              </div>

              <!-- LE COIN DE L'INGÉNIEUR ENTREPRENEUR (ENCADRÉ D'ÉLITE) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FFFBEB;border:1px solid #FDE68A;border-radius:14px;padding:22px;margin-bottom:28px;">
                <tr>
                  <td>
                    <div style="font-size:12px;font-weight:900;color:#92400E;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">
                      ✦ ESPACE INGÉNIEUR ENTREPRENEUR
                    </div>
                    <div style="font-size:13px;line-height:22px;color:#78350F;margin-bottom:14px;">
                      Les compétences ne s'arrêtent pas à l'amphithéâtre. Découvrez des ateliers pratiques (Bureautique Haute Précision Excel/VBA, Python appliqué, CAO 3D SolidWorks, modélisation avancée) et les initiatives de leadership, stratégie et prototypage encadrées par la direction.
                    </div>
                    <div>
                      <a href="${BRAND_CONFIG.vipUrl}" target="_blank" style="display:inline-block;color:#B45309;font-size:13px;font-weight:900;text-decoration:none;">
                        Découvrir les formations et initiatives &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- FORMULE DE CLÔTURE & SIGNATURE OFFICIELLE -->
              <div style="margin-top:20px;padding-top:18px;border-top:1px solid #F1F5F9;">
                <p style="margin:0 0 16px;font-size:13px;line-height:22px;color:#475569;font-weight:600;">
                  Rigueur, entraide et ambition : ensemble, faisons rayonner l'ingénierie camerounaise.
                </p>

                <div style="font-size:14px;font-weight:900;color:#0F172A;">
                  L'équipe RÉUSSIR POLYTECH
                </div>
                <div style="font-size:12px;color:#64748B;line-height:16px;margin-top:2px;">
                  Direction Générale &bull; Groupe d'Études Réussir Polytech
                </div>
                <div style="font-size:12px;color:#B8860B;font-weight:700;margin-top:4px;font-style:italic;">
                  « ${BRAND_CONFIG.slogan} »
                </div>
              </div>

            </td>
          </tr>

          <!-- PIED DE PAGE DISCRET -->
          <tr>
            <td style="background-color:#F8FAFC;padding:20px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;line-height:16px;color:#64748B;">
                Message officiel automatique envoyé à la suite de la création de votre compte académique sur Réussir Polytech.
              </p>
              <p style="margin:0;font-size:10px;line-height:15px;color:#94A3B8;">
                RÉUSSIR POLYTECH &bull; Plateforme SaaS d'Excellence pour Élèves-Ingénieurs &bull; <a href="${BRAND_CONFIG.siteUrl}" style="color:#0284C7;font-weight:700;">Accéder au site</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — PROMOTION 2026
« ${BRAND_CONFIG.slogan} »

${subject}

Toutes nos félicitations pour votre inscription sur Réussir Polytech !
Désormais, vous n'êtes plus seul : vous rejoignez une communauté active d'élèves-ingénieurs déterminés qui apprennent, s'entraident et progressent ensemble.

VOS ACCÈS :
- Nom : ${name || 'Élève-Ingénieur'}
- Email : ${email}
- Filière : ${safeLevel}
- Matricule : ${safeMatricule}
- Mot de passe : ${password || '••••••••'}

COMMENT UTILISER LA PLATEFORME :
1. Accédez à vos cours : ${targetUrl}
2. Téléchargez les polycopiés et séries de TD de chaque matière.
3. Entraînez-vous avec les annales de contrôles continus et examens corrigés.

VOS MATIÈRES CLÉS EN ${safeLevel} :
${activeSubjects.map((s, i) => `${i + 1}. ${s.title} (${s.desc})`).join('\n')}

3 CONSEILS CLÉS :
- Travaillez en amont en lisant le cours la veille.
- Cherchez chaque problème par vous-même avant de lire le corrigé.
- Privilégiez la régularité quotidienne.

ESPACE INGÉNIEUR ENTREPRENEUR :
Découvrez nos ateliers pratiques certifiés (Bureautique Haute Précision Excel/VBA, Python, SolidWorks, Design technique, Leadership).
Découvrir les formations : ${BRAND_CONFIG.vipUrl}

Rigueur, entraide et ambition : ensemble, faisons rayonner l'ingénierie camerounaise.

L'équipe RÉUSSIR POLYTECH
Direction Générale • Groupe d'Études Réussir Polytech
« ${BRAND_CONFIG.slogan} »`;

  return { html, text, subject };
}

/* ========================================================================= */
/* 2. EMAIL OFFICIEL : DISPONIBILITÉ DE L'APPLICATION MOBILE IPHONE & ANDROID */
/* ========================================================================= */
export interface AppAnnouncementEmailParams {
  name: string;
  email: string;
  level?: string;
}

export function renderAppAnnouncementEmail({
  name,
  email,
  level = 'MSP2',
}: AppAnnouncementEmailParams) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeEmail = escapeHtml(email);
  const cleanLevel = (level || 'MSP2').toUpperCase();
  const isMsp2 = cleanLevel === 'MSP2';
  const safeLevel = isMsp2 ? 'MSP2' : 'MSP1';
  const targetLevelPath = isMsp2 ? 'msp2' : 'msp1';
  const targetUrl = `${BRAND_CONFIG.siteUrl}/${targetLevelPath}`;
  const apkDownloadUrl = `${BRAND_CONFIG.siteUrl}/reussir-polytech.apk`;

  const subject = `Félicitations ${safeName} ! L'application Réussir Polytech est disponible sur votre téléphone (${safeLevel})`;
  const preheader = `Félicitations pour votre connexion ! Vous pouvez désormais installer l'application officielle Réussir Polytech directement sur votre iPhone ou Android. Suivez les étapes simples ici.`;

  // Programme des matières académiques par filière
  const subjectsMsp1 = [
    { title: 'Analyse Mathématique I & II', desc: 'Calcul différentiel, intégrales, développements limités, suites et séries' },
    { title: 'Algèbre Linéaire & Géométrie', desc: 'Espaces vectoriels, calcul matriciel, systèmes linéaires, géométrie' },
    { title: 'Mécanique Générale', desc: 'Cinématique et dynamique newtonienne du point matériel, énergie' },
    { title: 'Optique & Ondes', desc: 'Lois de Snell-Descartes, systèmes optiques, miroirs, lentilles et ondes' },
    { title: 'Chimie Générale & Thermodynamique', desc: 'Équilibres en solution, bilans énergétiques, principes de la thermodynamique' },
    { title: 'Informatique & Algorithmique', desc: 'Logique procédurale, variables, boucles, structures algorithmiques' },
  ];

  const subjectsMsp2 = [
    { title: 'Algèbre Multilinéaire (MTH211)', desc: 'Formes multilinéaires, déterminants, réduction d\'endomorphismes, diagonalisation' },
    { title: 'Analyse Vectorielle & Intégrales (MTH212)', desc: 'Intégrales multiples, séries de Fourier, théorèmes de Stokes et Green-Ostrogradski' },
    { title: 'Mécanique Rationnelle & Solides (PHY211)', desc: 'Torseurs, cinématique et dynamique des solides indéformables' },
    { title: 'Électromagnétisme & Ondes (PHY212)', desc: 'Équations de Maxwell, énergie électromagnétique, ondes guidées et libres' },
    { title: 'Algorithmique Avancée & Données (INF211)', desc: 'Complexité algorithmique, structures de données, arbres, graphes et tris' },
    { title: 'Probabilités & Statistiques (MTH213)', desc: 'Variables aléatoires discrètes et continues, lois de probabilité' },
  ];

  const activeSubjects = isMsp2 ? subjectsMsp2 : subjectsMsp1;

  const subjectsHtml = activeSubjects
    .map(
      (s, idx) => `
    <tr>
      <td style="padding:7px 0;vertical-align:top;width:24px;">
        <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#E0F2FE;color:#0284C7;font-size:10px;font-weight:800;text-align:center;line-height:20px;border:1px solid #BAE6FD;">
          ${idx + 1}
        </span>
      </td>
      <td style="padding:7px 0 7px 10px;font-size:13px;line-height:20px;color:#334155;">
        <strong style="color:#0F172A;">${escapeHtml(s.title)}</strong> &mdash; <span style="color:#64748B;">${escapeHtml(s.desc)}</span>
      </td>
    </tr>`
    )
    .join('');

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(subject)}</title>
  <style>
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #F8FAFC !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
    }
    table { border-collapse: collapse !important; }
    img { border: 0 !important; outline: none !important; text-decoration: none !important; }
    a { text-decoration: none !important; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding: 24px 18px !important; }
      .btn-responsive { width: 100% !important; display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;">
  <!-- Pré-en-tête discret -->
  <div style="display:none;font-size:1px;line-height:1px;color:#F8FAFC;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- CARTE PRINCIPALE -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:18px;border:1px solid #E2E8F0;box-shadow:0 8px 30px rgba(15,23,42,0.06);overflow:hidden;">
          
          <!-- EN-TÊTE DÉGRADÉ BLEU CLAIR DU LOGO AVEC ACCENTS OR -->
          <tr>
            <td style="background:linear-gradient(135deg, #0A4368 0%, #0284C7 45%, #0EA5E9 75%, #38BDF8 100%);padding:26px 32px 22px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:16px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:50%;border:2px solid #D4AF37;box-shadow:0 2px 8px rgba(0,0,0,0.2);" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:19px;line-height:22px;font-weight:900;color:#FFFFFF;letter-spacing:-0.2px;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#FDE68A;font-weight:700;margin-top:3px;font-style:italic;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:5px 12px;background:rgba(255,255,255,0.18);border:1px solid #D4AF37;border-radius:20px;font-size:10px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;white-space:nowrap;">
                      PROMOTION 2026
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LISERÉ DE SÉPARATION OR -->
          <tr>
            <td height="3" style="background:#D4AF37;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- CORPS PRINCIPAL ÉPURÉ -->
          <tr>
            <td class="mobile-padding" style="padding:32px 32px 26px;">
              
              <!-- Badge Statut -->
              <div style="margin-bottom:16px;">
                <span style="display:inline-block;padding:5px 14px;background:#E0F2FE;border:1px solid #BAE6FD;border-radius:20px;font-size:11px;font-weight:800;color:#0369A1;">
                  📱 APPLICATION MOBILE DISPONIBLE &bull; ${safeLevel}
                </span>
              </div>

              <!-- Titre d'Accueil Chaleureux -->
              <h1 style="margin:0 0 16px;font-size:23px;line-height:30px;font-weight:900;color:#0F172A;letter-spacing:-0.4px;">
                Félicitations ${safeName} ! L'application est disponible sur votre téléphone.
              </h1>

              <!-- Message de Félicitations & Annonce -->
              <p style="margin:0 0 16px;font-size:14px;line-height:24px;color:#334155;">
                Toutes nos félicitations pour votre connexion sur la plateforme <strong>Réussir Polytech</strong> dans votre filière <strong>${safeLevel}</strong> ! Vous faites partie des étudiants déterminés qui placent la rigueur et le travail méthodique au premier plan.
              </p>

              <p style="margin:0 0 24px;font-size:14px;line-height:24px;color:#334155;">
                Nous avons le plaisir de vous annoncer que <strong>l'application officielle Réussir Polytech est désormais disponible en téléchargement direct sur votre téléphone</strong>, que vous soyez sur <strong>Android</strong> ou sur <strong>iPhone</strong>. Il vous suffit de suivre les instructions très simples ci-dessous pour l'avoir directement sur votre écran d'accueil avec son icône officielle !
              </p>

              <!-- CARTE 1 : TÉLÉCHARGEMENT ANDROID (.APK & CHROME) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-left:4px solid #16A34A;border-radius:12px;margin-bottom:22px;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:14px;font-weight:900;color:#166534;margin-bottom:6px;">
                      🤖 Vous avez un téléphone Android ? (Samsung, Tecno, Infinix, Xiaomi, etc.)
                    </div>
                    <div style="font-size:13px;line-height:21px;color:#15803D;margin-bottom:14px;">
                      Vous pouvez télécharger directement le package officiel <strong>.APK</strong> ou installer l&apos;application en 1 clic.
                    </div>

                    <!-- Bouton Télécharger APK -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                      <tr>
                        <td>
                          <a href="${apkDownloadUrl}" target="_blank" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg, #16A34A 0%, #15803D 100%);color:#FFFFFF;font-size:13px;font-weight:900;border-radius:10px;text-decoration:none;box-shadow:0 3px 10px rgba(22,163,74,0.3);">
                            📥 Télécharger l&apos;Application (.APK) (3,6 Mo) &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="font-size:12px;line-height:20px;color:#166534;">
                      <strong>Comment l&apos;installer en 10 secondes :</strong><br>
                      1. Cliquez sur le bouton ci-dessus pour télécharger le fichier <code>reussir-polytech.apk</code>.<br>
                      2. Si votre téléphone affiche <em>&laquo; Fichier potentiellement dangereux &raquo;</em>, validez <strong>&laquo; Télécharger quand même &raquo;</strong> (sécurité habituelle Android pour les applications installées hors Play Store).<br>
                      3. Ouvrez le fichier téléchargé et appuyez sur <strong>&laquo; Installer &raquo;</strong>. L&apos;icône ronde Réussir Polytech apparaîtra immédiatement sur votre écran d&apos;accueil !<br>
                      <em>Astuce alternative :</em> Vous pouvez aussi ouvrir <a href="${BRAND_CONFIG.siteUrl}" style="color:#15803D;font-weight:700;">${BRAND_CONFIG.siteUrl}</a> dans <strong>Google Chrome</strong>, toucher le menu <strong>⋮</strong> (3 points) puis choisir <strong>&laquo; Installer l&apos;application &raquo;</strong>.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CARTE 2 : INSTALLATION IPHONE & IPAD (SAFARI) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F0F9FF;border:1px solid #BAE6FD;border-left:4px solid #0284C7;border-radius:12px;margin-bottom:26px;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:14px;font-weight:900;color:#075985;margin-bottom:6px;">
                      🍏 Vous avez un iPhone ou un iPad ? (Apple iOS)
                    </div>
                    <div style="font-size:13px;line-height:21px;color:#0369A1;margin-bottom:14px;">
                      L&apos;installation sur iPhone est instantanée et fluide via <strong>Safari</strong>, sans passer par l&apos;App Store.
                    </div>

                    <!-- Bouton Ouvrir sur Safari -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                      <tr>
                        <td>
                          <a href="${BRAND_CONFIG.siteUrl}" target="_blank" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg, #0284C7 0%, #0369A1 100%);color:#FFFFFF;font-size:13px;font-weight:900;border-radius:10px;text-decoration:none;box-shadow:0 3px 10px rgba(2,132,199,0.3);">
                            🍏 Ouvrir sur iPhone (Safari) &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="font-size:12px;line-height:20px;color:#0369A1;">
                      <strong>Comment l&apos;ajouter sur votre écran d&apos;accueil en 3 gestes :</strong><br>
                      1. Ouvrez le lien <a href="${BRAND_CONFIG.siteUrl}" style="color:#0284C7;font-weight:700;">${BRAND_CONFIG.siteUrl}</a> dans le navigateur <strong>Safari</strong>.<br>
                      2. Touchez le bouton de <strong>Partage</strong> en bas au centre (l&apos;icône d&apos;un carré avec une flèche vers le haut ⬆️).<br>
                      3. Faites défiler vers le bas et appuyez sur <strong>&laquo; Sur l&apos;écran d&apos;accueil &raquo;</strong> (icône avec un symbole <strong>+</strong>).<br>
                      4. Touchez <strong>&laquo; Ajouter &raquo;</strong> en haut à droite. C&apos;est tout ! L&apos;application Réussir Polytech est prête sur votre iPhone, fluide et rapide comme une application native.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- BOUTON PRINCIPAL D'ACCÈS AUX COURS -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${targetUrl}" target="_blank" class="btn-responsive" style="display:inline-block;padding:14px 34px;background:linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%);color:#FFFFFF;font-size:14px;font-weight:900;border-radius:12px;box-shadow:0 4px 14px rgba(2,132,199,0.35);letter-spacing:0.2px;">
                      Accéder à mes cours &amp; annales (${safeLevel}) &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- RAPPEL DES MATIÈRES CLÉS DU NIVEAU -->
              <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:20px;margin-bottom:26px;">
                <div style="font-size:12px;font-weight:900;color:#0F172A;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                  Vos Matières Clés disponibles en ${safeLevel} :
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  ${subjectsHtml}
                </table>
              </div>

              <!-- LE COIN DE L'INGÉNIEUR ENTREPRENEUR -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FFFBEB;border:1px solid #FDE68A;border-radius:14px;padding:22px;margin-bottom:28px;">
                <tr>
                  <td>
                    <div style="font-size:12px;font-weight:900;color:#92400E;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">
                      ✦ ESPACE INGÉNIEUR ENTREPRENEUR
                    </div>
                    <div style="font-size:13px;line-height:22px;color:#78350F;margin-bottom:14px;">
                      Développez des compétences pratiques qui font la différence : ateliers certifiés de Bureautique Haute Précision Excel/VBA, Python appliqué aux sciences de l&apos;ingénieur, CAO 3D SolidWorks et leadership.
                    </div>
                    <div>
                      <a href="${BRAND_CONFIG.vipUrl}" target="_blank" style="display:inline-block;color:#B45309;font-size:13px;font-weight:900;text-decoration:none;">
                        Découvrir les formations VIP &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- FORMULE DE CLÔTURE & SIGNATURE OFFICIELLE -->
              <div style="margin-top:20px;padding-top:18px;border-top:1px solid #F1F5F9;">
                <p style="margin:0 0 16px;font-size:13px;line-height:22px;color:#475569;font-weight:600;">
                  Rigueur, entraide et ambition : ensemble, faisons rayonner l&apos;ingénierie camerounaise.
                </p>

                <div style="font-size:14px;font-weight:900;color:#0F172A;">
                  L&apos;équipe RÉUSSIR POLYTECH
                </div>
                <div style="font-size:12px;color:#64748B;line-height:16px;margin-top:2px;">
                  Direction Générale &bull; Groupe d&apos;Études Réussir Polytech
                </div>
                <div style="font-size:12px;color:#B8860B;font-weight:700;margin-top:4px;font-style:italic;">
                  « ${BRAND_CONFIG.slogan} »
                </div>
              </div>

            </td>
          </tr>

          <!-- PIED DE PAGE DISCRET -->
          <tr>
            <td style="background-color:#F8FAFC;padding:20px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;line-height:16px;color:#64748B;">
                Message officiel envoyé à l&apos;ensemble des élèves-ingénieurs connectés sur la plateforme Réussir Polytech.
              </p>
              <p style="margin:0;font-size:10px;line-height:15px;color:#94A3B8;">
                RÉUSSIR POLYTECH &bull; Plateforme SaaS d&apos;Excellence pour Élèves-Ingénieurs &bull; <a href="${BRAND_CONFIG.siteUrl}" style="color:#0284C7;font-weight:700;">Accéder au site</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — PROMOTION 2026
« ${BRAND_CONFIG.slogan} »

${subject}

Toutes nos félicitations pour votre connexion sur la plateforme Réussir Polytech dans votre filière ${safeLevel} !

L'APPLICATION MOBILE RÉUSSIR POLYTECH EST DÉSORMAIS DISPONIBLE SUR VOTRE TÉLÉPHONE !

1. POUR TÉLÉPHONES ANDROID :
- Téléchargez directement le fichier .APK officiel (3,6 Mo) : ${apkDownloadUrl}
- Si Android affiche "Fichier potentiellement dangereux", validez "Télécharger quand même".
- Ouvrez le fichier et cliquez sur "Installer".
- Alternative Chrome : ouvrez ${BRAND_CONFIG.siteUrl} dans Chrome > Menu (3 points) > "Installer l'application".

2. POUR IPHONE & IPAD (SAFARI) :
- Ouvrez ${BRAND_CONFIG.siteUrl} dans Safari sur votre iPhone.
- Touchez le bouton Partage en bas (carré avec flèche vers le haut).
- Sélectionnez "Sur l'écran d'accueil" (+), puis appuyez sur "Ajouter".
- L'application est installée directement avec son icône officielle !

ACCÉDER DIRECTEMENT À VOS COURS (${safeLevel}) :
${targetUrl}

VOS MATIÈRES CLÉS EN ${safeLevel} :
${activeSubjects.map((s, i) => `${i + 1}. ${s.title} (${s.desc})`).join('\n')}

ESPACE INGÉNIEUR ENTREPRENEUR :
Découvrez nos ateliers pratiques certifiés (Bureautique Excel/VBA, Python, SolidWorks, Leadership).
Découvrir : ${BRAND_CONFIG.vipUrl}

Rigueur, entraide et ambition : ensemble, faisons rayonner l'ingénierie camerounaise.

L'équipe RÉUSSIR POLYTECH
Direction Générale • Groupe d'Études Réussir Polytech
« ${BRAND_CONFIG.slogan} »`;

  return { html, text, subject };
}

/* ========================================================================= */
/* 3. EMAIL OFFICIEL DE L'ADMINISTRATION (DIFFUSION DE COMMUNIQUÉ DIRECT)    */
/* ========================================================================= */
export interface OfficialAdminEmailParams {
  recipientName: string;
  recipientEmail: string;
  subject: string;
  senderTitle?: string;
  senderSignature?: string;
  headline?: string;
  messageContent: string;
  ctaText?: string;
  ctaUrl?: string;
  targetLevel?: string;
}

export function renderOfficialAdminEmail({
  recipientName,
  recipientEmail,
  subject,
  senderTitle = 'Direction Générale RÉUSSIR POLYTECH',
  senderSignature = 'Eugène Samuel GWET — Président du Conseil d\'Administration',
  headline = 'Communiqué Officiel aux Élèves-Ingénieurs',
  messageContent,
  ctaText,
  ctaUrl,
  targetLevel,
}: OfficialAdminEmailParams) {
  const safeName = escapeHtml(recipientName || 'Élève-Ingénieur');
  const safeEmail = escapeHtml(recipientEmail);
  const safeSubject = escapeHtml(subject || 'Communiqué Officiel — Réussir Polytech');
  const safeHeadline = escapeHtml(headline);
  const safeSenderTitle = escapeHtml(senderTitle);
  const safeSenderSignature = escapeHtml(senderSignature);
  const safeTargetLevel = targetLevel ? escapeHtml(targetLevel.toUpperCase()) : 'PROMOTION 2026';

  // Formatage propre des sauts de ligne pour le corps du texte
  const formattedContent = escapeHtml(messageContent)
    .replace(/\n\n+/g, '</p><p style="margin:0 0 16px;font-size:14px;line-height:24px;color:#334155;">')
    .replace(/\n/g, '<br>');

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeSubject}</title>
  <style>
    body { margin:0 !important; padding:0 !important; background-color:#F8FAFC !important; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif !important; }
    table { border-collapse:collapse !important; }
    a { text-decoration:none !important; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding: 24px 18px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:18px;border:1px solid #E2E8F0;box-shadow:0 8px 30px rgba(15,23,42,0.06);overflow:hidden;">
          
          <!-- EN-TÊTE DÉGRADÉ BLEU CIEL DU LOGO -->
          <tr>
            <td style="background:linear-gradient(135deg, #0A4368 0%, #0284C7 45%, #0EA5E9 75%, #38BDF8 100%);padding:26px 32px 22px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:16px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:50%;border:2px solid #D4AF37;" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:19px;line-height:22px;font-weight:900;color:#FFFFFF;letter-spacing:-0.2px;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#FDE68A;font-weight:700;margin-top:3px;font-style:italic;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:5px 12px;background:rgba(255,255,255,0.18);border:1px solid #D4AF37;border-radius:20px;font-size:10px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;">
                      ${safeTargetLevel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LISERÉ OR -->
          <tr>
            <td height="3" style="background:#D4AF37;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- CORPS DU COMMUNIQUÉ OFFICIEL -->
          <tr>
            <td class="mobile-padding" style="padding:32px 32px 26px;">
              
              <!-- Badge Officiel -->
              <div style="margin-bottom:16px;">
                <span style="display:inline-block;padding:5px 14px;background:#E0F2FE;border:1px solid #BAE6FD;border-radius:20px;font-size:11px;font-weight:800;color:#0369A1;">
                  📢 COMMUNIQUÉ OFFICIEL DE LA DIRECTION
                </span>
              </div>

              <!-- Titre -->
              <h1 style="margin:0 0 8px;font-size:22px;line-height:28px;font-weight:900;color:#0F172A;letter-spacing:-0.4px;">
                ${safeHeadline}
              </h1>

              <div style="font-size:12px;font-weight:700;color:#B8860B;margin-bottom:22px;">
                Émis par : ${safeSenderTitle}
              </div>

              <!-- Contenu du message -->
              <div style="margin-bottom:24px;">
                <p style="margin:0 0 16px;font-size:14px;line-height:24px;color:#334155;">
                  Bonjour <strong>${safeName}</strong>,
                </p>
                <div style="font-size:14px;line-height:24px;color:#334155;">
                  <p style="margin:0 0 16px;font-size:14px;line-height:24px;color:#334155;">
                    ${formattedContent}
                  </p>
                </div>
              </div>

              <!-- Bouton d'action si spécifié -->
              ${ctaText && ctaUrl ? `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td>
                    <a href="${escapeHtml(ctaUrl)}" target="_blank" style="display:inline-block;padding:13px 30px;background:linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%);color:#FFFFFF;font-size:13px;font-weight:900;border-radius:12px;box-shadow:0 4px 12px rgba(2,132,199,0.3);">
                      ${escapeHtml(ctaText)} &rarr;
                    </a>
                  </td>
                </tr>
              </table>` : ''}

              <!-- Signature officielle -->
              <div style="margin-top:24px;padding-top:18px;border-top:1px solid #F1F5F9;">
                <p style="margin:0 0 12px;font-size:13px;line-height:20px;color:#475569;font-weight:600;">
                  Rigueur, entraide et ambition : ensemble, faisons rayonner l'ingénierie camerounaise.
                </p>
                <div style="font-size:14px;font-weight:900;color:#0F172A;">
                  ${safeSenderSignature}
                </div>
                <div style="font-size:12px;color:#64748B;line-height:16px;margin-top:2px;">
                  ${safeSenderTitle} &bull; Groupe d'Études Réussir Polytech
                </div>
                <div style="font-size:12px;color:#B8860B;font-weight:700;margin-top:4px;font-style:italic;">
                  « ${BRAND_CONFIG.slogan} »
                </div>
              </div>

            </td>
          </tr>

          <!-- PIED DE PAGE -->
          <tr>
            <td style="background-color:#F8FAFC;padding:20px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;color:#64748B;">
                Communiqué officiel de l'administration adressé à ${safeEmail}.
              </p>
              <p style="margin:0;font-size:10px;color:#94A3B8;">
                RÉUSSIR POLYTECH &bull; Plateforme SaaS d'Excellence pour Élèves-Ingénieurs &bull; <a href="${BRAND_CONFIG.siteUrl}" style="color:#0284C7;font-weight:700;">Accéder au site</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — COMMUNIQUÉ OFFICIEL
« ${BRAND_CONFIG.slogan} »

${headline}
Émis par : ${senderTitle}

Bonjour ${recipientName || 'Élève-Ingénieur'},

${messageContent}

${ctaText && ctaUrl ? `\nLien : ${ctaUrl}\n` : ''}

Rigueur, entraide et ambition : ensemble, faisons rayonner l'ingénierie camerounaise.

${senderSignature}
${senderTitle} • Groupe d'Études Réussir Polytech
« ${BRAND_CONFIG.slogan} »`;

  return { html, text, subject: safeSubject };
}

/* ========================================================================= */
/* 3. EMAIL PROMOTION FORMATION VIP — L'INGÉNIEUR ENTREPRENEUR               */
/* ========================================================================= */
export interface PromotionEmailParams {
  name: string;
  email: string;
  level?: string;
  matricule?: string;
  programId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  mentorName?: string;
  mentorRole?: string;
  mentorWhatsapp?: string;
  duration?: string;
  modules?: string[];
  ctaUrl?: string;
  ctaText?: string;
}

export function renderPromotionFormationEmail({
  name,
  email,
  title = 'Formation Pratique : Bureautique Haute Précision (Excel Avancé & VBA)',
  subtitle = 'Maîtrisez les outils incontournables des grands bureaux d\'études et ingénieries',
  description = 'Dans le cadre de l\'accompagnement professionnel de la Promotion 2026, l\'équipe Réussir Polytech vous propose une formation intensive animée par vos aînés ingénieurs pour acquérir des compétences pratiques directement valorisables sur le marché.',
  mentorName = 'Bikei Yannick',
  mentorRole = 'Directeur Informatique et Opérationnel',
  mentorWhatsapp = '237695957287',
  duration = '4 semaines intensives (100% pratique)',
  modules = [
    'Excel Avancé : Calculs matriciels, formules financières & recherche complexe (XLOOKUP, INDEX/MATCH)',
    'Automatisation de processus & Macros VBA pour tableaux de bord d\'ingénierie',
    'Mise en page certifiée de rapports d\'études et mémoires techniques (Word & LaTeX)',
    'Modélisation financière de projets technologiques et analyse de rentabilité',
  ],
  ctaUrl = BRAND_CONFIG.vipUrl,
  ctaText = 'Découvrir le programme complet & Réserver ma place',
}: PromotionEmailParams) {
  const safeName = escapeHtml(name || 'Monsieur/Madame');
  const safeEmail = escapeHtml(email);
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle);
  const safeDescription = escapeHtml(description);
  const safeMentor = escapeHtml(mentorName);
  const safeRole = escapeHtml(mentorRole);
  const safeDuration = escapeHtml(duration);
  const safeCtaText = escapeHtml(ctaText);
  const cleanPhone = mentorWhatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Bonjour ${mentorName}, je suis ${name} (Promotion 2026 Polytech) et je souhaite m'inscrire à la formation : ${title}`)}`;

  const subject = `Offre de Formation Professionnelle : ${title} — Réussir Polytech`;

  const modulesHtml = modules
    .map(
      (mod, idx) => `
    <tr>
      <td style="padding:10px 0;vertical-align:top;width:28px;">
        <div style="width:22px;height:22px;border-radius:6px;background-color:#FEF3C7;color:#92400E;font-size:11px;font-weight:800;text-align:center;line-height:22px;border:1px solid #FDE68A;">
          0${idx + 1}
        </div>
      </td>
      <td style="padding:10px 0 10px 12px;font-size:13px;line-height:20px;color:#334155;font-weight:600;">
        ${escapeHtml(mod)}
      </td>
    </tr>`
    )
    .join('');

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <style>
    body { margin:0 !important; padding:0 !important; background-color:#F8FAFC !important; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif !important; }
    table { border-collapse:collapse !important; }
    a { text-decoration:none !important; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding: 24px 18px !important; }
      .btn-responsive { width: 100% !important; display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:18px;border:1px solid #E2E8F0;box-shadow:0 8px 30px rgba(15,23,42,0.06);overflow:hidden;">
          
          <!-- EN-TÊTE DÉGRADÉ BLEU CLAIR DU LOGO -->
          <tr>
            <td style="background:linear-gradient(135deg, #0A4368 0%, #0284C7 45%, #0EA5E9 75%, #38BDF8 100%);padding:26px 32px 22px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:16px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:50%;border:2px solid #D4AF37;" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:19px;line-height:22px;font-weight:900;color:#FFFFFF;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#FDE68A;font-weight:700;margin-top:3px;font-style:italic;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:5px 12px;background:rgba(255,255,255,0.18);border:1px solid #D4AF37;border-radius:20px;font-size:10px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;">
                      FORMATION VIP
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LISERÉ OR -->
          <tr>
            <td height="3" style="background:#D4AF37;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- CORPS -->
          <tr>
            <td class="mobile-padding" style="padding:32px 32px 24px;">
              
              <div style="margin-bottom:14px;">
                <span style="display:inline-block;padding:4px 12px;background:#E0F2FE;border:1px solid #BAE6FD;border-radius:20px;font-size:11px;font-weight:700;color:#0369A1;">
                  Programme Professionnel de l'Ingénieur Entrepreneur
                </span>
              </div>

              <h1 style="margin:0 0 8px;font-size:22px;line-height:28px;font-weight:800;color:#0F172A;letter-spacing:-0.3px;">
                ${safeTitle}
              </h1>

              <p style="margin:0 0 20px;font-size:14px;line-height:22px;font-weight:700;color:#B8860B;">
                ${safeSubtitle}
              </p>

              <p style="margin:0 0 16px;font-size:14px;line-height:24px;color:#334155;">
                Bonjour <strong>${safeName}</strong>,
              </p>
              <p style="margin:0 0 22px;font-size:14px;line-height:24px;color:#334155;">
                ${safeDescription}
              </p>

              <!-- CADRE DES MODULES -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:10px;border-bottom:1px solid #E2E8F0;">
                    <span style="font-size:12px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:0.6px;">
                      Modules Clés du Programme :
                    </span>
                  </td>
                </tr>
                ${modulesHtml}
              </table>

              <!-- DÉTAILS PRATIQUES -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#FFFFFF;border:1px solid #E2E8F0;border-left:4px solid #D4AF37;border-radius:10px;padding:14px 18px;margin-bottom:26px;">
                <tr>
                  <td style="font-size:12px;line-height:20px;color:#475569;">
                    <strong style="color:#0F172A;">Format &amp; Durée :</strong> ${safeDuration}<br>
                    <strong style="color:#0F172A;">Mentor Référent :</strong> ${safeMentor} (${safeRole})<br>
                    <strong style="color:#0F172A;">Public Concerné :</strong> Élèves-Ingénieurs Réussir Polytech
                  </td>
                </tr>
              </table>

              <!-- BOUTONS D'ACTION -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:26px;">
                <tr>
                  <td style="padding-bottom:12px;">
                    <a href="${ctaUrl}" target="_blank" class="btn-responsive" style="display:inline-block;width:100%;box-sizing:border-box;padding:14px 24px;background:linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%);color:#FFFFFF;font-size:13px;font-weight:900;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(2,132,199,0.25);">
                      ${safeCtaText} &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="${whatsappUrl}" target="_blank" class="btn-responsive" style="display:inline-block;width:100%;box-sizing:border-box;padding:12px 24px;background-color:#25D366;color:#FFFFFF;font-size:13px;font-weight:800;border-radius:12px;text-align:center;">
                      💬 Poser une question sur WhatsApp (${safeMentor})
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;line-height:18px;color:#64748B;border-top:1px solid #F1F5F9;padding-top:16px;">
                Les places par cohorte sont limitées afin de garantir un encadrement personnalisé pour chaque participant.
              </p>
            </td>
          </tr>

          <!-- PIED DE PAGE -->
          <tr>
            <td style="background-color:#F8FAFC;padding:22px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#334155;">
                ESPACE INGÉNIEUR ENTREPRENEUR &bull; RÉUSSIR POLYTECH
              </p>
              <p style="margin:0;font-size:10px;line-height:15px;color:#94A3B8;">
                Pour toute question : <a href="mailto:gwetsamuel49@gmail.com" style="color:#0284C7;">gwetsamuel49@gmail.com</a> &bull; Message envoyé à ${safeEmail}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${title} — RÉUSSIR POLYTECH VIP
« ${BRAND_CONFIG.slogan} »

Bonjour ${name || 'Monsieur/Madame'},

${subtitle}

${description}

MODULES :
${modules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

DÉTAILS :
- Format : ${duration}
- Mentor : ${mentorName} (${mentorRole})
- Inscription WhatsApp directe : ${whatsappUrl}

Consulter le programme sur le site :
${ctaUrl}

— L'équipe RÉUSSIR POLYTECH`;

  return { html, text, subject };
}

/* ========================================================================= */
/* 4. LETTRE ACADÉMIQUE DE LA SEMAINE                                        */
/* ========================================================================= */
export interface WeeklyResource {
  subject: string;
  title: string;
  type: string;
  url: string;
}

export interface WeeklyEmailParams {
  name: string;
  email: string;
  level?: string;
  resources?: WeeklyResource[];
  customMessage?: string;
  unsubscribeToken?: string;
}

export function renderWeeklyEmail({
  name,
  email,
  level = 'MSP2',
  resources = [],
  customMessage,
  unsubscribeToken = 'token',
}: WeeklyEmailParams) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeLevel = escapeHtml(level.toUpperCase());
  const subject = `Ressources académiques de la semaine — Réussir Polytech (${safeLevel})`;
  const unsubscribeUrl = `${BRAND_CONFIG.siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubscribeToken)}`;
  const targetUrl = `${BRAND_CONFIG.siteUrl}/${safeLevel.toLowerCase() === 'msp2' ? 'msp2' : 'msp1'}`;

  const topResources = resources.slice(0, 4);

  const resourcesHtml = topResources.length > 0
    ? topResources
        .map(
          (r) => `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:10px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;">
        <tr>
          <td style="padding:12px 16px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="vertical-align:middle;">
                  <div style="font-size:10px;font-weight:800;color:#0284C7;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;">
                    ${escapeHtml(r.subject)} &bull; ${escapeHtml(r.type || 'Polycopié')}
                  </div>
                  <div style="font-size:13px;line-height:18px;font-weight:700;color:#0F172A;">
                    ${escapeHtml(r.title)}
                  </div>
                </td>
                <td width="85" align="right" style="vertical-align:middle;padding-left:12px;">
                  <a href="${escapeHtml(r.url || targetUrl)}" target="_blank" style="display:inline-block;padding:6px 12px;background:#0284C7;color:#FFFFFF;border-radius:6px;font-size:11px;font-weight:700;">
                    Ouvrir &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
        )
        .join('')
    : `
      <div style="padding:16px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;color:#64748B;font-size:13px;text-align:center;">
        Consultez votre cockpit pour retrouver tous les documents disponibles pour votre promotion.
      </div>`;

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(subject)}</title>
  <style>
    body { margin:0 !important; padding:0 !important; background-color:#F8FAFC !important; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif !important; }
    table { border-collapse:collapse !important; }
    a { text-decoration:none !important; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;background-color:#FFFFFF;border-radius:18px;border:1px solid #E2E8F0;box-shadow:0 4px 20px rgba(15,23,42,0.04);overflow:hidden;">
          
          <!-- EN-TÊTE DÉGRADÉ BLEU CLAIR -->
          <tr>
            <td style="background:linear-gradient(135deg, #0A4368 0%, #0284C7 45%, #0EA5E9 75%, #38BDF8 100%);padding:24px 32px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:14px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:50%;border:2px solid #D4AF37;" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:18px;line-height:22px;font-weight:900;color:#FFFFFF;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#FDE68A;font-weight:700;margin-top:2px;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:4px 10px;background:rgba(255,255,255,0.18);border:1px solid #D4AF37;border-radius:12px;font-size:10px;font-weight:800;color:#FFFFFF;">
                      ${safeLevel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LISERÉ OR -->
          <tr>
            <td height="3" style="background:#D4AF37;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- CORPS -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;color:#0F172A;">
                Bonjour ${safeName},
              </h2>

              <p style="margin:0 0 20px;font-size:14px;line-height:22px;color:#475569;">
                Voici la sélection des ressources académiques recommandées cette semaine pour préparer efficacement vos séances de TD et contrôles continus en <strong>${safeLevel}</strong>.
              </p>

              ${customMessage ? `
              <div style="margin:0 0 20px;padding:14px 18px;background:#FEF3C7;border-left:3px solid #D4AF37;border-radius:8px;">
                <p style="margin:0;font-size:13px;line-height:20px;color:#92400E;font-weight:600;">
                  ${escapeHtml(customMessage)}
                </p>
              </div>` : ''}

              <!-- LISTE DES RESSOURCES -->
              <div style="margin-bottom:24px;">
                ${resourcesHtml}
              </div>

              <!-- BOUTON ACCÈS COCKPIT -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td>
                    <a href="${targetUrl}" target="_blank" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%);color:#FFFFFF;font-size:13px;font-weight:800;border-radius:10px;">
                      Consulter mon cockpit complet &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PIED DE PAGE -->
          <tr>
            <td style="background-color:#F8FAFC;padding:18px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#475569;">
                L&apos;équipe RÉUSSIR POLYTECH
              </p>
              <p style="margin:0;font-size:10px;line-height:15px;color:#94A3B8;">
                Pour modifier la fréquence de ces courriels : <a href="${unsubscribeUrl}" style="color:#0284C7;">se désabonner</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — Ressources de la semaine (${level.toUpperCase()})

Bonjour ${name || 'Élève-Ingénieur'},

Voici les documents sélectionnés pour vos révisions en ${level.toUpperCase()} :
${resources.map((r) => `- [${r.subject}] ${r.title} : ${r.url}`).join('\n')}

Accédez à votre cockpit complet : ${targetUrl}

Pour vous désabonner : ${unsubscribeUrl}

— L'équipe RÉUSSIR POLYTECH`;

  return { html, text, subject };
}
