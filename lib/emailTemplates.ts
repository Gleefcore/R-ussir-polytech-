/**
 * Modèles d'Emails Officiels — RÉUSSIR POLYTECH
 * Design : Haute Définition, Typographie d'Élite (Outfit & Plus Jakarta Sans), Charte Or Impérial & Bleu Polytech
 * Slogan : « L'excellence est notre seul standard. »
 */

export const BRAND_CONFIG = {
  name: 'RÉUSSIR POLYTECH',
  slogan: 'L\'excellence est notre seul standard.',
  senderName: 'L\'équipe RÉUSSIR POLYTECH',
  senderEmail: 'gwetsamuel49@gmail.com',
  siteUrl: 'https://reussirpolytech.vercel.app',
  vipUrl: 'https://reussirpolytech.vercel.app/entrepreneur-vip',
  logoUrl: 'https://reussirpolytech.vercel.app/assets/logo-polytech.png',
  colors: {
    bg: '#0F172A',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#0284C7', // Bleu Polytech
    primaryDark: '#0369A1',
    gold: '#D4AF37', // Or Impérial Polytech
    goldLight: '#F3E5AB',
    goldDark: '#B8860B',
    border: '#E2E8F0',
    night: '#050B14',
    nightCard: '#0B1528',
  },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface WelcomeEmailParams {
  name: string;
  email: string;
  level?: string;
  matricule?: string;
}

export function renderWelcomeEmail({ name, email, level = 'MSP1', matricule }: WelcomeEmailParams) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeLevel = escapeHtml(level.toUpperCase());
  const safeMatricule = matricule ? escapeHtml(matricule) : '';
  const subject = 'Bienvenue sur Réussir Polytech — l\'excellence se construit ensemble';

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(subject)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #070D18 !important;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
    }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    img { border: 0 !important; outline: none !important; text-decoration: none !important; -ms-interpolation-mode: bicubic !important; }
    a { text-decoration: none !important; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-p-20 { padding: 22px 18px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-text-center { text-align: center !important; }
      .hero-title { font-size: 24px !important; line-height: 32px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#070D18;">
  <!-- Pré-en-tête masqué pour aperçu boîte de réception -->
  <div style="display:none;font-size:1px;line-height:1px;color:#070D18;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Bienvenue sur Réussir Polytech, ${safeName} ! Votre espace académique ${safeLevel} est prêt. Accédez immédiatement à vos cours et épreuves.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#070D18;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <!-- CONTENEUR PRINCIPAL 600px -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.5);border:1px solid rgba(212,175,55,0.3);">
          
          <!-- BANDEAU PRESTIGE SUPÉRIEUR (NOIR & OR POLYTECH) -->
          <tr>
            <td style="background:#050B14;padding:26px 32px;border-bottom:2px solid #D4AF37;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="56" style="vertical-align:middle;padding-right:16px;">
                    <img src="${BRAND_CONFIG.logoUrl}" width="52" height="52" alt="Logo Officiel Réussir Polytech" style="display:block;border-radius:14px;border:1px solid rgba(212,175,55,0.5);box-shadow:0 4px 15px rgba(212,175,55,0.25);">
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-family:'Outfit','Plus Jakarta Sans',Arial,sans-serif;font-size:20px;line-height:24px;font-weight:900;letter-spacing:0.8px;color:#FFFFFF;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#D4AF37;font-weight:700;letter-spacing:0.4px;margin-top:3px;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:4px 10px;background:rgba(212,175,55,0.15);border:1px solid rgba(212,175,55,0.4);border-radius:8px;font-family:'Outfit',sans-serif;font-size:10px;font-weight:800;color:#D4AF37;letter-spacing:1px;text-transform:uppercase;">
                      PROMOTION 2026
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS DU MESSAGE -->
          <tr>
            <td class="mobile-p-20" style="padding:36px 34px 20px;">
              
              <!-- Badge de Confirmation -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:6px 14px;background:#F0FDF4;border:1px solid #86EFAC;border-radius:9999px;">
                    <span style="font-size:11px;font-weight:800;color:#166534;letter-spacing:0.8px;text-transform:uppercase;font-family:'Outfit',sans-serif;">
                      ✓ INSCRIPTION ACADÉMIQUE VALIDÉE &bull; ${safeLevel}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Titre d'Accueil -->
              <h1 class="hero-title" style="margin:0 0 16px;font-family:'Outfit','Plus Jakarta Sans',sans-serif;font-size:28px;line-height:36px;font-weight:900;color:#0F172A;letter-spacing:-0.5px;">
                Bienvenue dans la communauté, ${safeName} !
              </h1>

              <p style="margin:0 0 18px;font-size:15px;line-height:26px;color:#334155;font-weight:400;">
                Félicitations pour votre inscription sur <strong>Réussir Polytech</strong>. Vous intégrez le réseau d&apos;élite des élèves-ingénieurs polytechniciens du Cameroun, unis par une même volonté d&apos;excellence, d&apos;entraide et de rigueur scientifique.
              </p>

              <!-- CARTE CERTIFICAT D'ACCÈS ÉTUDIANT -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 26px;background:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #D4AF37;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom:10px;border-bottom:1px solid #E2E8F0;">
                          <span style="font-size:11px;font-weight:800;color:#D4AF37;text-transform:uppercase;letter-spacing:0.8px;font-family:'Outfit',sans-serif;">
                            Fiche de Compte Académique Officielle
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td width="50%" style="font-size:13px;line-height:20px;color:#475569;">
                                <strong>Élève :</strong> ${safeName}
                              </td>
                              <td width="50%" style="font-size:13px;line-height:20px;color:#475569;">
                                <strong>Cursus :</strong> <span style="font-weight:800;color:#0284C7;">${safeLevel}</span>
                              </td>
                            </tr>
                            ${safeMatricule ? `
                            <tr>
                              <td style="font-size:13px;line-height:20px;color:#475569;padding-top:6px;">
                                <strong>Matricule :</strong> <code style="font-family:monospace;background:#E2E8F0;padding:2px 6px;border-radius:4px;color:#0F172A;font-weight:bold;">${safeMatricule}</code>
                              </td>
                              <td style="font-size:13px;line-height:20px;color:#166534;font-weight:bold;padding-top:6px;">
                                <strong>Statut :</strong> Actif &amp; Vérifié
                              </td>
                            </tr>` : ''}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- PARCOURS & RESSOURCES DU CURRICULUM -->
              <h2 style="margin:0 0 12px;font-family:'Outfit',sans-serif;font-size:16px;line-height:22px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:0.5px;">
                Ce qui est immédiatement à votre disposition :
              </h2>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:26px;">
                <tr>
                  <td style="padding:10px 0;vertical-align:top;" width="28">
                    <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#D4AF37;color:#050B14;text-align:center;font-weight:900;font-size:11px;line-height:20px;">1</span>
                  </td>
                  <td style="padding:10px 0 10px 8px;font-size:14px;line-height:22px;color:#334155;">
                    <strong>Polycopiés et Cours Magistraux :</strong> Des supports structurés conformes au syllabus officiel de l&apos;école polytechnique.
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;vertical-align:top;" width="28">
                    <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#0284C7;color:#FFFFFF;text-align:center;font-weight:900;font-size:11px;line-height:20px;">2</span>
                  </td>
                  <td style="padding:10px 0 10px 8px;font-size:14px;line-height:22px;color:#334155;">
                    <strong>Annales de Contrôles Continus (CC) &amp; Examens :</strong> Sujets certifiés dispensés par le corps professoral émérite (notamment Pr Takou, Pr Bouetou, Pr Mama, Dr Yatat et leurs pairs).
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;vertical-align:top;" width="28">
                    <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#10B981;color:#FFFFFF;text-align:center;font-weight:900;font-size:11px;line-height:20px;">3</span>
                  </td>
                  <td style="padding:10px 0 10px 8px;font-size:14px;line-height:22px;color:#334155;">
                    <strong>Téléchargement Direct :</strong> Fichiers PDF haute qualité immédiatement consultables pour réviser sans aucune friction.
                  </td>
                </tr>
              </table>

              <!-- BOUTON PRINCIPAL D'ACTION (OR IMPÉRIAL PRESTIGE) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:8px 0 32px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius:14px;background:linear-gradient(135deg, #D4AF37 0%, #F59E0B 50%, #B8860B 100%);box-shadow:0 8px 24px rgba(212,175,55,0.35);">
                          <a href="${BRAND_CONFIG.siteUrl}/${safeLevel.toLowerCase()}" target="_blank" style="display:inline-block;padding:16px 36px;font-family:'Outfit','Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:900;color:#050B14;text-transform:uppercase;letter-spacing:0.8px;text-decoration:none;">
                            Accéder à mes cours ${safeLevel} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CARTOUCHE : LE COIN DE L'INGÉNIEUR ENTREPRENEUR -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;background:linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);border:1px solid #FDE68A;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:22px 24px;">
                    <div style="font-family:'Outfit',sans-serif;font-size:12px;font-weight:900;color:#92400E;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                      ✦ ESPACE INGÉNIEUR ENTREPRENEUR
                    </div>
                    <p style="margin:0 0 12px;font-size:14px;line-height:22px;color:#78350F;font-weight:500;">
                      Les compétences ne s&apos;arrêtent pas à l&apos;amphithéâtre. Découvrez des ateliers pratiques (Python, CAO 3D SolidWorks, modélisation avancée) et les initiatives de prototypage encadrées par la direction.
                    </p>
                    <a href="${BRAND_CONFIG.vipUrl}" target="_blank" style="display:inline-block;font-size:13px;font-weight:800;color:#B45309;text-decoration:underline;">
                      Découvrir les formations et initiatives &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;line-height:24px;color:#475569;">
                Rigueur, entraide et ambition : ensemble, faisons rayonner l&apos;ingénierie camerounaise.
              </p>

              <!-- SIGNATURE OFFICIELLE DE LA DIRECTION -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 10px;padding-top:20px;border-top:1px solid #E2E8F0;">
                <tr>
                  <td>
                    <div style="font-family:'Outfit',sans-serif;font-size:14px;font-weight:900;color:#0F172A;">
                      ${BRAND_CONFIG.senderName}
                    </div>
                    <div style="font-size:12px;line-height:18px;color:#64748B;margin-top:2px;">
                      Direction Générale &bull; Groupe d&apos;Études Réussir Polytech
                    </div>
                    <div style="font-family:'Outfit',sans-serif;font-size:12px;font-weight:800;color:#D4AF37;margin-top:4px;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- PIED DE PAGE INSTITUTIONNEL -->
          <tr>
            <td style="background:#F8FAFC;padding:26px 34px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;line-height:18px;color:#64748B;">
                Message officiel automatique envoyé à la suite de la création de votre compte académique sur Réussir Polytech.
              </p>
              <p style="margin:0;font-size:11px;line-height:18px;color:#94A3B8;">
                RÉUSSIR POLYTECH &bull; Plateforme SaaS d&apos;Excellence pour Élèves-Ingénieurs &bull; 
                <a href="${BRAND_CONFIG.siteUrl}" target="_blank" style="color:#0284C7;text-decoration:underline;font-weight:bold;">Accéder au site</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — « ${BRAND_CONFIG.slogan} »
========================================================================
Bienvenue dans la communauté académique, ${name} !

Votre inscription sur Réussir Polytech est confirmée.
Niveau académique : ${safeLevel}${safeMatricule ? ` • Matricule : ${safeMatricule}` : ''}

Retrouvez immédiatement tous vos cours, fiches de TD et annales d'examens
dispensés par le corps professoral émérite des écoles polytechniques du Cameroun :
${BRAND_CONFIG.siteUrl}/${level.toLowerCase()}

Découvrez également Le Coin de l'Ingénieur Entrepreneur :
${BRAND_CONFIG.vipUrl}

Rigueur, entraide et ambition.

L'équipe RÉUSSIR POLYTECH
« ${BRAND_CONFIG.slogan} »
Contact : ${BRAND_CONFIG.senderEmail}`;

  return { html, text, subject };
}

export interface WeeklyResource {
  title: string;
  subject: string;
  type?: string;
  url?: string;
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
  const subject = 'Votre point Polytech de la semaine — ressources et initiatives';
  const unsubscribeUrl = `${BRAND_CONFIG.siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubscribeToken)}`;

  const topResources = resources.slice(0, 3);

  const resourcesHtml = topResources.length > 0
    ? topResources
        .map(
          (r, idx) => `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:14px 16px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="vertical-align:top;">
                  <div style="font-family:'Outfit',sans-serif;font-size:10px;font-weight:900;color:#0284C7;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">
                    ${escapeHtml(r.subject)} &bull; ${escapeHtml(r.type || 'Polycopié')}
                  </div>
                  <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;line-height:20px;font-weight:700;color:#0F172A;">
                    ${escapeHtml(r.title)}
                  </div>
                </td>
                <td width="90" align="right" style="vertical-align:middle;padding-left:12px;">
                  <a href="${escapeHtml(r.url || `${BRAND_CONFIG.siteUrl}/${safeLevel.toLowerCase()}`)}" target="_blank" style="display:inline-block;padding:7px 12px;background:#0F172A;color:#FFFFFF;border-radius:8px;font-size:11px;font-weight:800;text-decoration:none;font-family:'Outfit',sans-serif;">
                    Consulter &rarr;
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
      <div style="padding:16px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;color:#64748B;font-size:13px;text-align:center;">
        Consultez votre cockpit étudiant pour retrouver toutes les épreuves disponibles pour votre semestre.
      </div>`;

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(subject)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #070D18 !important;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
    }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    img { border: 0 !important; outline: none !important; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-p-20 { padding: 22px 18px !important; }
      .hero-title { font-size: 23px !important; line-height: 30px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#070D18;">
  <div style="display:none;font-size:1px;line-height:1px;color:#070D18;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Votre synthèse de révisions de la semaine pour le parcours ${safeLevel} est prête.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#070D18;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.5);border:1px solid rgba(212,175,55,0.3);">
          
          <!-- BANDEAU SUPÉRIEUR HAUTE FIDÉLITÉ -->
          <tr>
            <td style="background:#050B14;padding:26px 32px;border-bottom:2px solid #0284C7;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="56" style="vertical-align:middle;padding-right:16px;">
                    <img src="${BRAND_CONFIG.logoUrl}" width="52" height="52" alt="Logo Réussir Polytech" style="display:block;border-radius:14px;border:1px solid rgba(2,132,199,0.5);box-shadow:0 4px 15px rgba(2,132,199,0.25);">
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-family:'Outfit','Plus Jakarta Sans',sans-serif;font-size:20px;line-height:24px;font-weight:900;letter-spacing:0.8px;color:#FFFFFF;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#38BDF8;font-weight:700;letter-spacing:0.4px;margin-top:3px;">
                      Le Point Académique Hebdomadaire &bull; ${safeLevel}
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:4px 10px;background:rgba(2,132,199,0.2);border:1px solid rgba(2,132,199,0.4);border-radius:8px;font-family:'Outfit',sans-serif;font-size:10px;font-weight:800;color:#38BDF8;letter-spacing:1px;text-transform:uppercase;">
                      ÉDITION SEMAINE
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS DE LA LETTRE -->
          <tr>
            <td class="mobile-p-20" style="padding:36px 34px 20px;">
              
              <div style="display:inline-block;padding:5px 12px;background:#F0F9FF;border:1px solid #BAE6FD;border-radius:9999px;font-size:11px;font-weight:800;color:#0369A1;text-transform:uppercase;letter-spacing:0.8px;font-family:'Outfit',sans-serif;margin-bottom:18px;">
                ⚡ Objectif de la Semaine &bull; Excellence &amp; Méthode
              </div>

              <h1 class="hero-title" style="margin:0 0 16px;font-family:'Outfit',sans-serif;font-size:26px;line-height:34px;font-weight:900;color:#0F172A;letter-spacing:-0.4px;">
                Un temps pour vos cours, un regard vers vos projets.
              </h1>

              <p style="margin:0 0 16px;font-size:15px;line-height:26px;color:#334155;">
                Bonjour ${safeName},
              </p>

              <p style="margin:0 0 24px;font-size:15px;line-height:26px;color:#334155;">
                ${customMessage ? escapeHtml(customMessage) : 'Une nouvelle semaine d&apos;apprentissage commence. Voici une sélection ciblée d&apos;épreuves et de documents certifiés pour vous exercer et progresser avec méthode.'}
              </p>

              <!-- CADRE DES RESSOURCES SÉLECTIONNÉES -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-family:'Outfit',sans-serif;font-size:12px;font-weight:900;color:#0F172A;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:14px;">
                      📚 Ressources Recommandées pour vos Révisions :
                    </div>
                    ${resourcesHtml}
                  </td>
                </tr>
              </table>

              <!-- BOUTON REPRENDRE LE TRAVAIL -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 30px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius:14px;background:#0F172A;box-shadow:0 6px 20px rgba(15,23,42,0.25);">
                          <a href="${BRAND_CONFIG.siteUrl}/${safeLevel.toLowerCase()}" target="_blank" style="display:inline-block;padding:15px 32px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;color:#FFFFFF;text-transform:uppercase;letter-spacing:0.8px;text-decoration:none;">
                            Reprendre mon travail sur ${safeLevel} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- LE COIN DE L'INGÉNIEUR ENTREPRENEUR -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;background:linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);border:1px solid #FDE68A;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 22px;">
                    <div style="font-family:'Outfit',sans-serif;font-size:11px;font-weight:900;color:#92400E;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                      ✦ COMPÉTENCES D&apos;AVENIR
                    </div>
                    <p style="margin:0 0 10px;font-size:13px;line-height:21px;color:#78350F;font-weight:500;">
                      Les ateliers pratiques de modélisation CAO 3D, de développement Python et de structuration de projets d&apos;ingénierie sont consultables sur l&apos;espace dédié.
                    </p>
                    <a href="${BRAND_CONFIG.vipUrl}" target="_blank" style="font-size:13px;font-weight:800;color:#B45309;text-decoration:underline;">
                      Voir les formations et initiatives &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-family:'Outfit',sans-serif;font-size:14px;line-height:22px;font-weight:800;color:#D4AF37;">
                « ${BRAND_CONFIG.slogan} »
              </p>

              <!-- SIGNATURE -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top:16px;border-top:1px solid #E2E8F0;">
                <tr>
                  <td>
                    <div style="font-family:'Outfit',sans-serif;font-size:14px;font-weight:900;color:#0F172A;">
                      ${BRAND_CONFIG.senderName}
                    </div>
                    <div style="font-size:12px;color:#64748B;margin-top:2px;">
                      Direction Générale &bull; Réussir Polytech
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- PIED DE PAGE & DÉSABONNEMENT -->
          <tr>
            <td style="background:#F8FAFC;padding:24px 34px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;line-height:18px;color:#64748B;">
                Vous recevez ce point hebdomadaire car vous avez souscrit aux actualités académiques de Réussir Polytech.
              </p>
              <p style="margin:0;font-size:11px;line-height:18px;color:#94A3B8;">
                <a href="${unsubscribeUrl}" target="_blank" style="color:#0284C7;text-decoration:underline;font-weight:bold;">Se désabonner de cette lettre</a> &bull; 
                <a href="${BRAND_CONFIG.siteUrl}/dashboard" target="_blank" style="color:#0284C7;text-decoration:underline;font-weight:bold;">Préférences</a> &bull; 
                <a href="${BRAND_CONFIG.siteUrl}" target="_blank" style="color:#64748B;text-decoration:none;">Accéder au site</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textResources = topResources
    .map((r, i) => `${i + 1}. [${r.subject} - ${r.type || 'Document'}] ${r.title} : ${r.url || BRAND_CONFIG.siteUrl}`)
    .join('\n');

  const text = `RÉUSSIR POLYTECH — Point Hebdomadaire
========================================================================
Bonjour ${name},

Voici votre sélection de ressources académiques pour votre semaine (${level}) :

${textResources || 'Retrouvez vos cours et épreuves sur votre espace étudiant.'}

Reprendre mon travail :
${BRAND_CONFIG.siteUrl}/${level.toLowerCase()}

Le Coin de l'Ingénieur Entrepreneur :
${BRAND_CONFIG.vipUrl}

« ${BRAND_CONFIG.slogan} »
${BRAND_CONFIG.senderName}

Pour vous désabonner de cette lettre :
${unsubscribeUrl}`;

  return { html, text, subject };
}

export interface PromotionEmailParams {
  name: string;
  email: string;
  level?: string;
  matricule?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  modules?: string[];
  ctaUrl?: string;
  ctaText?: string;
}

export function renderPromotionFormationEmail({
  name,
  email,
  level = 'MSP1',
  matricule,
  title = 'Formation d\'Élite : L\'Ingénieur Entrepreneur',
  subtitle = 'Maîtrisez les outils pratiques et propulsez votre leadership technologique',
  description = 'Rejoignez le programme intensif conçu par les mentors de Réussir Polytech pour acquérir les compétences réelles du monde de l\'ingénierie et de l\'entrepreneuriat.',
  modules = [
    'Bureautique Avancée (Excel Expert, Automatisation & Reporting financier)',
    'Conception Assistée par Ordinateur 3D (SolidWorks, AutoCAD & Prototypage)',
    'Programmation Python Appliquée & Analyse de Données Ingénieur',
    'Leadership, Prise de parole & Stratégie de Montage de Projets'
  ],
  ctaUrl = BRAND_CONFIG.vipUrl,
  ctaText = 'Découvrir le Programme VIP & S\'inscrire',
}: PromotionEmailParams) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeLevel = escapeHtml(level.toUpperCase());
  const safeMatricule = matricule ? escapeHtml(matricule) : '';
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle);
  const safeDescription = escapeHtml(description);
  const safeCtaText = escapeHtml(ctaText);
  const subject = `[RÉUSSIR POLYTECH] ${title} — Accélérez votre potentiel`;

  const unsubscribeUrl = `${BRAND_CONFIG.siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

  const modulesHtml = modules.map((mod, idx) => `
    <tr>
      <td style="padding: 8px 0; vertical-align: top; width: 28px;">
        <div style="width: 22px; height: 22px; border-radius: 6px; background-color: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); color: ${BRAND_CONFIG.colors.gold}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; text-align: center; line-height: 22px;">
          ${idx + 1}
        </div>
      </td>
      <td style="padding: 8px 0 8px 10px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 13px; line-height: 20px; color: #E2E8F0; font-weight: 500;">
        ${escapeHtml(mod)}
      </td>
    </tr>
  `).join('');

  const html = `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #030712; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #050B14; border-radius: 20px; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.35); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- EN-TÊTE NOIR & OR -->
          <tr>
            <td style="padding: 32px 30px 24px; text-align: center; background: radial-gradient(circle at top, #0A1628 0%, #050B14 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
              <div style="display: inline-block; padding: 4px 14px; border-radius: 100px; background-color: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); margin-bottom: 14px;">
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: #D4AF37; text-transform: uppercase; letter-spacing: 1.5px;">
                  ACCÉLÉRATEUR DE CARRIÈRE • ÉDITION 2026
                </span>
              </div>
              <h1 style="margin: 0 0 6px; font-family: 'Outfit', Arial, sans-serif; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                RÉUSSIR POLYTECH
              </h1>
              <p style="margin: 0; font-family: 'Outfit', Arial, sans-serif; font-size: 13px; font-weight: 600; color: #D4AF37;">
                « ${BRAND_CONFIG.slogan} »
              </p>
            </td>
          </tr>

          <!-- CORPS -->
          <tr>
            <td style="padding: 32px 30px;">
              <p style="margin: 0 0 16px; font-size: 15px; font-weight: 700; color: #FFFFFF;">
                Bonjour ${safeName},
              </p>
              
              <div style="padding: 20px; border-radius: 16px; background-color: #0A1628; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 24px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background-color: #D4AF37; color: #050B14; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">
                  PROMOTION SPÉCIALE ÉLÈVES ${safeLevel}
                </span>
                <h2 style="margin: 0 0 6px; font-family: 'Outfit', Arial, sans-serif; font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.25;">
                  ${safeTitle}
                </h2>
                <p style="margin: 0; font-size: 13px; color: #94A3B8; line-height: 20px;">
                  ${safeSubtitle}
                </p>
              </div>

              <p style="margin: 0 0 20px; font-size: 14px; line-height: 22px; color: #CBD5E1;">
                ${safeDescription}
              </p>

              <!-- PROGRAMME DES MODULES -->
              <div style="margin-bottom: 28px;">
                <p style="margin: 0 0 12px; font-size: 12px; font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">
                  Programme & Compétences Clés :
                </p>
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                  ${modulesHtml}
                </table>
              </div>

              <!-- BOUTON D'ACTION OR MÉTALLISÉ -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 15px 36px; border-radius: 12px; background: linear-gradient(135deg, #D4AF37 0%, #F59E0B 50%, #B8860B 100%); color: #050B14; font-family: 'Outfit', Arial, sans-serif; font-size: 14px; font-weight: 800; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);">
                      ${safeCtaText} →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- SIGNATURE -->
              <div style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; color: #94A3B8; line-height: 18px;">
                <p style="margin: 0 0 4px; font-weight: 700; color: #FFFFFF;">
                  L'équipe de Direction Réussir Polytech
                </p>
                <p style="margin: 0;">
                  Eugène Samuel GWET (Cofondateur & PCA) • Yannick BIKEI (Directeur Informatique)
                </p>
              </div>
            </td>
          </tr>

          <!-- PIED DE PAGE -->
          <tr>
            <td style="padding: 20px 30px; background-color: #030712; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 11px; color: #64748B;">
              <p style="margin: 0 0 6px;">
                Cet email a été adressé à votre compte officiel élève-ingénieur (${email}).
              </p>
              <a href="${unsubscribeUrl}" style="color: #94A3B8; text-decoration: underline;">
                Se désabonner des communications
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — ${title}
========================================================================
Bonjour ${name},

${title}
${subtitle}

${description}

Programme & Compétences Clés :
${modules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Pour découvrir le programme et réserver votre place :
${ctaUrl}

« ${BRAND_CONFIG.slogan} »
L'équipe RÉUSSIR POLYTECH
Eugène Samuel GWET & Yannick BIKEI

Pour vous désabonner :
${unsubscribeUrl}`;

  return { html, text, subject };
}

