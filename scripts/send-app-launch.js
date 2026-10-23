const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Charger dynamiquement .env.local si les variables ne sont pas définies
if (fs.existsSync(path.join(__dirname, '../.env.local'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const GMAIL_USER = 'gwetsamuel49@gmail.com';
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD || '';
const SITE_URL = 'https://reussirpolytech.vercel.app';
const APK_URL = `${SITE_URL}/reussir-polytech.apk`;
const VIP_URL = `${SITE_URL}/entrepreneur-vip`;
const SLOGAN = "L'excellence est notre seul standard.";

const subjectsMsp1 = [
  { title: 'Analyse Mathématique I & II', desc: 'Calcul différentiel, intégrales, développements limités, suites et séries' },
  { title: 'Algèbre Linéaire & Géométrie', desc: 'Espaces vectoriels, calcul matriciel, systèmes linéaires, géométrie' },
  { title: 'Mécanique Générale', desc: 'Cinématique et dynamique newtonienne du point matériel, énergie' },
  { title: 'Optique & Ondes', desc: 'Lois de Snell-Descartes, systèmes optiques, miroirs, lentilles et ondes' },
  { title: 'Chimie Générale & Thermodynamique', desc: 'Équilibres en solution, bilans énergétiques, principes thermodynamiques' },
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml(name, email, level) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeEmail = escapeHtml(email);
  const cleanLevel = (level || 'MSP2').toUpperCase();
  const isMsp2 = cleanLevel === 'MSP2';
  const safeLevel = isMsp2 ? 'MSP2' : 'MSP1';
  const targetPath = isMsp2 ? 'msp2' : 'msp1';
  const targetUrl = `${SITE_URL}/${targetPath}`;
  const activeSubjects = isMsp2 ? subjectsMsp2 : subjectsMsp1;

  const subjectsRows = activeSubjects
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

  const subject = `Félicitations ${safeName} ! L'application Réussir Polytech est disponible sur votre téléphone (${safeLevel})`;
  const preheader = `Félicitations pour votre connexion ! Vous pouvez désormais installer l'application officielle Réussir Polytech directement sur votre iPhone ou Android.`;

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #F8FAFC !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
    }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    img { border: 0 !important; outline: none !important; text-decoration: none !important; -ms-interpolation-mode: bicubic !important; }
    a { text-decoration: none !important; }
    @media only screen and (max-width: 600px) {
      .wrapper-table { padding: 12px 6px !important; }
      .container { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; }
      .mobile-padding { padding: 20px 16px !important; }
      .mobile-header { padding: 18px 16px 16px !important; }
      .mobile-hide { display: none !important; }
      .mobile-header-title { font-size: 16px !important; line-height: 20px !important; }
      .mobile-header-slogan { font-size: 11px !important; line-height: 15px !important; }
      .mobile-title { font-size: 19px !important; line-height: 25px !important; }
      .btn-responsive { width: 100% !important; display: block !important; text-align: center !important; box-sizing: border-box !important; }
      .mobile-card { padding: 14px 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <!-- Pré-en-tête discret -->
  <div style="display:none;font-size:1px;line-height:1px;color:#F8FAFC;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapper-table" style="background-color:#F8FAFC;padding:32px 12px;width:100%;table-layout:fixed;">
    <tr>
      <td align="center">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:18px;border:1px solid #E2E8F0;box-shadow:0 8px 30px rgba(15,23,42,0.06);overflow:hidden;margin:0 auto;">
          
          <!-- EN-TÊTE DÉGRADÉ BLEU CLAIR DU LOGO AVEC ACCENTS OR -->
          <tr>
            <td class="mobile-header" style="background:linear-gradient(135deg, #0A4368 0%, #0284C7 45%, #0EA5E9 75%, #38BDF8 100%);padding:26px 32px 22px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:14px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:50%;border:2px solid #D4AF37;box-shadow:0 2px 8px rgba(0,0,0,0.2);" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div class="mobile-header-title" style="font-size:19px;line-height:22px;font-weight:900;color:#FFFFFF;letter-spacing:-0.2px;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div class="mobile-header-slogan" style="font-size:12px;line-height:16px;color:#FDE68A;font-weight:700;margin-top:3px;font-style:italic;">
                      « ${SLOGAN} »
                    </div>
                  </td>
                  <td align="right" class="mobile-hide" style="vertical-align:middle;">
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
              <h1 class="mobile-title" style="margin:0 0 16px;font-size:23px;line-height:30px;font-weight:900;color:#0F172A;letter-spacing:-0.4px;">
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
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="mobile-card" style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-left:4px solid #16A34A;border-radius:12px;margin-bottom:22px;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:14px;font-weight:900;color:#166534;margin-bottom:6px;">
                      🤖 Vous avez un téléphone Android ? (Samsung, Tecno, Infinix, Xiaomi, etc.)
                    </div>
                    <div style="font-size:13px;line-height:21px;color:#15803D;margin-bottom:14px;">
                      Vous pouvez télécharger directement le package officiel <strong>.APK</strong> ou installer l&apos;application en 1 clic.
                    </div>

                    <!-- Bouton Télécharger APK -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;">
                      <tr>
                        <td>
                          <a href="${APK_URL}" target="_blank" class="btn-responsive" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg, #16A34A 0%, #15803D 100%);color:#FFFFFF;font-size:13px;font-weight:900;border-radius:10px;text-decoration:none;box-shadow:0 3px 10px rgba(22,163,74,0.3);text-align:center;">
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
                      <em>Astuce alternative :</em> Vous pouvez aussi ouvrir <a href="${SITE_URL}" style="color:#15803D;font-weight:700;">${SITE_URL}</a> dans <strong>Google Chrome</strong>, toucher le menu <strong>⋮</strong> (3 points) puis choisir <strong>&laquo; Installer l&apos;application &raquo;</strong>.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CARTE 2 : INSTALLATION IPHONE & IPAD (SAFARI) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="mobile-card" style="background-color:#F0F9FF;border:1px solid #BAE6FD;border-left:4px solid #0284C7;border-radius:12px;margin-bottom:26px;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:14px;font-weight:900;color:#075985;margin-bottom:6px;">
                      🍏 Vous avez un iPhone ou un iPad ? (Apple iOS)
                    </div>
                    <div style="font-size:13px;line-height:21px;color:#0369A1;margin-bottom:14px;">
                      L&apos;installation sur iPhone est instantanée et fluide via <strong>Safari</strong>, sans passer par l&apos;App Store.
                    </div>

                    <!-- Bouton Ouvrir sur Safari -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;">
                      <tr>
                        <td>
                          <a href="${SITE_URL}" target="_blank" class="btn-responsive" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg, #0284C7 0%, #0369A1 100%);color:#FFFFFF;font-size:13px;font-weight:900;border-radius:10px;text-decoration:none;box-shadow:0 3px 10px rgba(2,132,199,0.3);text-align:center;">
                            🍏 Ouvrir sur iPhone (Safari) &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="font-size:12px;line-height:20px;color:#0369A1;">
                      <strong>Comment l&apos;ajouter sur votre écran d&apos;accueil en 3 gestes :</strong><br>
                      1. Ouvrez le lien <a href="${SITE_URL}" style="color:#0284C7;font-weight:700;">${SITE_URL}</a> dans le navigateur <strong>Safari</strong>.<br>
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
                  ${subjectsRows}
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
                      <a href="${VIP_URL}" target="_blank" style="display:inline-block;color:#B45309;font-size:13px;font-weight:900;text-decoration:none;">
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
                  « ${SLOGAN} »
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
                RÉUSSIR POLYTECH &bull; Plateforme SaaS d&apos;Excellence pour Élèves-Ingénieurs &bull; <a href="${SITE_URL}" style="color:#0284C7;font-weight:700;">Accéder au site</a>
              </p>
            </td>
          </tr>

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — PROMOTION 2026
« ${SLOGAN} »

${subject}

Toutes nos félicitations pour votre connexion sur la plateforme Réussir Polytech dans votre filière ${safeLevel} !

L'APPLICATION MOBILE RÉUSSIR POLYTECH EST DÉSORMAIS DISPONIBLE SUR VOTRE TÉLÉPHONE !

1. POUR TÉLÉPHONES ANDROID :
- Téléchargez directement le fichier .APK officiel (3,6 Mo) : ${APK_URL}
- Si Android affiche "Fichier potentiellement dangereux", validez "Télécharger quand même".
- Ouvrez le fichier et cliquez sur "Installer".
- Alternative Chrome : ouvrez ${SITE_URL} dans Chrome > Menu (3 points) > "Installer l'application".

2. POUR IPHONE & IPAD (SAFARI) :
- Ouvrez ${SITE_URL} dans Safari sur votre iPhone.
- Touchez le bouton Partage en bas (carré avec flèche vers le haut).
- Sélectionnez "Sur l'écran d'accueil" (+), puis appuyez sur "Ajouter".
- L'application est installée directement avec son icône officielle !

ACCÉDER DIRECTEMENT À VOS COURS (${safeLevel}) :
${targetUrl}

VOS MATIÈRES CLÉS EN ${safeLevel} :
${activeSubjects.map((s, i) => `${i + 1}. ${s.title} (${s.desc})`).join('\n')}

ESPACE INGÉNIEUR ENTREPRENEUR :
Découvrez nos ateliers pratiques certifiés (Bureautique Excel/VBA, Python, SolidWorks, Leadership).
Découvrir : ${VIP_URL}

Rigueur, entraide et ambition : ensemble, faisons rayonner l'ingénierie camerounaise.

L'équipe RÉUSSIR POLYTECH
Direction Générale • Groupe d'Études Réussir Polytech
« ${SLOGAN} »`;

  return { html, text, subject };
}

async function main() {
  console.log('=== CAMPAGNE OFFICIELLE : ANNONCE DISPONIBILITÉ APPLICATION MOBILE ===');

  // 1. Initialiser Supabase et récupérer les utilisateurs réels
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: userList, error: uErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });

  if (uErr) {
    console.error('Erreur récupération utilisateurs Supabase:', uErr);
    process.exit(1);
  }

  const allUsers = userList?.users || [];
  console.log(`Utilisateurs trouvés au total : ${allUsers.length}`);

  // Filtrer les emails réels
  const realUsers = allUsers.filter((u) => u.email && !u.email.endsWith('@polytech.rp'));
  console.log(`Utilisateurs avec adresse email réelle : ${realUsers.length}`);

  // 2. Configurer le transporteur SMTP Gmail
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Vérifier la connexion SMTP
  await transporter.verify();
  console.log('✓ Connexion SMTP Gmail (gwetsamuel49@gmail.com) vérifiée avec succès.');

  // Chemin vers le logo officiel pour la pièce jointe CID
  const logoPath = path.join(__dirname, '../public/icons/icon-192x192.png');
  const attachments = fs.existsSync(logoPath)
    ? [
        {
          filename: 'logo-polytech.png',
          path: logoPath,
          cid: 'polytech-logo',
        },
      ]
    : [];

  const storePath = path.join(__dirname, '../data/email_store.json');
  let store = { settings: {}, logs: [], unsubscribedEmails: [] };
  if (fs.existsSync(storePath)) {
    try {
      store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
    } catch (e) {
      console.warn('Lecture email_store.json ignorée');
    }
  }

  const unsubscribedSet = new Set((store.unsubscribedEmails || []).map((e) => e.toLowerCase()));

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < realUsers.length; i++) {
    const user = realUsers[i];
    const email = user.email.toLowerCase().trim();
    const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
    const level = user.user_metadata?.level || 'MSP2';

    if (unsubscribedSet.has(email)) {
      console.log(`[${i + 1}/${realUsers.length}] Ignoré (désabonné) : ${email}`);
      skipCount++;
      continue;
    }

    console.log(`[${i + 1}/${realUsers.length}] Envoi en cours vers ${name} <${email}> (${level})...`);

    const { html, text, subject } = buildEmailHtml(name, email, level);

    try {
      const info = await transporter.sendMail({
        from: `"L'équipe RÉUSSIR POLYTECH" <${GMAIL_USER}>`,
        to: email,
        replyTo: GMAIL_USER,
        subject,
        html,
        text,
        attachments,
        headers: {
          'X-Entity-Ref-ID': `rp-app-${Date.now()}-${i}`,
          'List-Unsubscribe': `<mailto:${GMAIL_USER}?subject=Unsubscribe>`,
        },
      });

      console.log(`  ✓ Envoyé avec succès ! Message ID: ${info.messageId}`);
      successCount++;

      store.logs.unshift({
        id: `log_app_${Date.now()}_${i}`,
        type: 'targeted',
        toEmail: email,
        toName: name,
        subject,
        status: 'sent',
        mode: 'gmail_app_password',
        timestamp: new Date().toISOString(),
        campaignId: 'official_app_launch_2026',
        userId: user.id,
      });
    } catch (err) {
      console.error(`  ✗ Échec de l'envoi vers ${email} :`, err.message);
      failCount++;

      store.logs.unshift({
        id: `log_app_${Date.now()}_${i}`,
        type: 'targeted',
        toEmail: email,
        toName: name,
        subject,
        status: 'failed',
        mode: 'gmail_app_password',
        error: err.message,
        timestamp: new Date().toISOString(),
        campaignId: 'official_app_launch_2026',
        userId: user.id,
      });
    }

    // Petite pause de 600ms entre les envois pour garantir une réputation irréprochable auprès de Gmail
    await new Promise((r) => setTimeout(r, 600));
  }

  // Sauvegarder les logs
  if (store.logs.length > 500) store.logs = store.logs.slice(0, 500);
  try {
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
    console.log('✓ Logs enregistrés dans data/email_store.json');
  } catch (e) {
    console.warn('Erreur sauvegarde email_store.json:', e);
  }

  console.log('\n=== RÉSUMÉ DE LA CAMPAGNE ===');
  console.log(`Total cibles : ${realUsers.length}`);
  console.log(`Succès : ${successCount}`);
  console.log(`Échecs : ${failCount}`);
  console.log(`Ignorés : ${skipCount}`);
}

main().catch((err) => {
  console.error('Erreur fatale dans le script :', err);
  process.exit(1);
});
