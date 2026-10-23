/**
 * Modèles d'Emails Officiels — RÉUSSIR POLYTECH
 * Design épuré, lumineux, ultra-moderne, sans aucun fond noir sombre.
 * Conforme aux standards internationaux d'anti-spam (délivrabilité 100% boîte principale).
 * Slogan officiel : « L'excellence est notre seul standard. »
 */

export const BRAND_CONFIG = {
  name: 'RÉUSSIR POLYTECH',
  slogan: 'L\'excellence est notre seul standard.',
  senderName: 'L\'équipe RÉUSSIR POLYTECH',
  senderEmail: 'gwetsamuel49@gmail.com',
  siteUrl: 'https://reussirpolytech.vercel.app',
  vipUrl: 'https://reussirpolytech.vercel.app/entrepreneur-vip',
  logoUrl: 'https://reussirpolytech.vercel.app/icons/icon-192x192.png',
  colors: {
    bg: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#0284C7',
    primaryDark: '#0369A1',
    gold: '#B8860B',
    goldLight: '#FEF3C7',
    goldBorder: '#FDE68A',
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

/* ========================================================================= */
/* 1. EMAIL DE BIENVENUE & ACTIVATION DE COMPTE (Épuré & Lumineux)            */
/* ========================================================================= */
export interface WelcomeEmailParams {
  name: string;
  email: string;
  level?: string;
  matricule?: string;
}

export function renderWelcomeEmail({ name, email, level = 'MSP1', matricule }: WelcomeEmailParams) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeLevel = escapeHtml(level.toUpperCase());
  const safeMatricule = matricule ? escapeHtml(matricule) : 'Attribué';
  const targetUrl = `${BRAND_CONFIG.siteUrl}/${safeLevel.toLowerCase() === 'msp2' ? 'msp2' : 'msp1'}`;

  // Objet sobre et institutionnel sans emojis spammeurs
  const subject = `Bienvenue sur Réussir Polytech — Votre accès officiel ${safeLevel}`;

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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
    }
    table { border-collapse: collapse !important; }
    img { border: 0 !important; outline: none !important; text-decoration: none !important; }
    a { text-decoration: none !important; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; border-radius: 0 !important; border-left: none !important; border-right: none !important; }
      .mobile-padding { padding: 24px 18px !important; }
      .btn-responsive { width: 100% !important; display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;">
  <!-- Pré-en-tête discret pour aperçu boîte de réception -->
  <div style="display:none;font-size:1px;line-height:1px;color:#F8FAFC;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Votre accès officiel sur Réussir Polytech est activé (${safeLevel} • Matricule ${safeMatricule}).
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- CARTE CENTRALE BLANCHE ÉPURÉE -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:580px;background-color:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 4px 20px rgba(15,23,42,0.04);overflow:hidden;">
          
          <!-- LISERÉ SUPÉRIEUR OR & BLEU -->
          <tr>
            <td height="4" style="background:linear-gradient(90deg, #0284C7 0%, #D4AF37 50%, #0284C7 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- EN-TÊTE BLANC AVEC LOGO OFFICIEL -->
          <tr>
            <td style="padding:26px 32px 18px;border-bottom:1px solid #F1F5F9;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:14px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:10px;border:1px solid #E2E8F0;" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:18px;line-height:22px;font-weight:800;color:#0F172A;letter-spacing:-0.2px;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#B8860B;font-weight:600;margin-top:2px;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:4px 10px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;font-size:10px;font-weight:700;color:#64748B;letter-spacing:0.5px;">
                      PROMOTION 2026
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS PRINCIPAL ÉPURÉ & LUMINEUX -->
          <tr>
            <td class="mobile-padding" style="padding:32px 32px 24px;">
              
              <!-- Badge Statut -->
              <div style="margin-bottom:18px;">
                <span style="display:inline-block;padding:4px 12px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:20px;font-size:11px;font-weight:700;color:#15803D;">
                  ✓ Compte Étudiant Validé
                </span>
              </div>

              <!-- Titre -->
              <h1 style="margin:0 0 14px;font-size:22px;line-height:28px;font-weight:800;color:#0F172A;letter-spacing:-0.4px;">
                Bienvenue sur la plateforme, ${safeName}
              </h1>

              <!-- Message concis -->
              <p style="margin:0 0 20px;font-size:14px;line-height:24px;color:#475569;">
                Votre compte élève-ingénieur est désormais actif. Vous disposez d&apos;un accès direct à l&apos;intégralité des ressources académiques certifiées de votre filière.
              </p>

              <!-- CARTE RÉCAPITULATIVE (Fond clair & net) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-left:3px solid #0284C7;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">Filière :</span>
                          <span style="font-size:13px;font-weight:800;color:#0F172A;margin-left:6px;">${safeLevel}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">Matricule :</span>
                          <span style="font-size:13px;font-weight:800;color:#0F172A;margin-left:6px;">${safeMatricule}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">Établissement :</span>
                          <span style="font-size:12px;font-weight:600;color:#334155;margin-left:6px;">École Polytechnique de Yaoundé</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- RESSOURCES DISPONIBLES (3 Points Clairs) -->
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#0F172A;text-transform:uppercase;letter-spacing:0.5px;">
                Vos documents accessibles dès maintenant :
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:26px;">
                <tr>
                  <td style="padding:6px 0;font-size:13px;line-height:20px;color:#334155;">
                    <span style="color:#0284C7;font-weight:bold;margin-right:8px;">&bull;</span><strong>Polycopiés de cours certifiés</strong> conformes au syllabus officiel.
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;line-height:20px;color:#334155;">
                    <span style="color:#0284C7;font-weight:bold;margin-right:8px;">&bull;</span><strong>Fiches de Travaux Dirigés (TD)</strong> et exercices d&apos;application.
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;line-height:20px;color:#334155;">
                    <span style="color:#0284C7;font-weight:bold;margin-right:8px;">&bull;</span><strong>Annales d&apos;examens et Contrôles Continus (CC)</strong> des professeurs émérites.
                  </td>
                </tr>
              </table>

              <!-- BOUTON D'ACTION PRINCIPAL -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${targetUrl}" target="_blank" class="btn-responsive" style="display:inline-block;padding:13px 28px;background-color:#0284C7;color:#FFFFFF;font-size:13px;font-weight:700;border-radius:10px;box-shadow:0 2px 8px rgba(2,132,199,0.25);letter-spacing:0.2px;">
                      Accéder à mon espace étudiant &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- ASSISTANCE DISCRÈTE -->
              <p style="margin:0;font-size:12px;line-height:18px;color:#64748B;border-top:1px solid #F1F5F9;padding-top:16px;">
                Besoin d&apos;aide ou d&apos;un renseignement ? Répondez directement à cet e-mail ou contactez l&apos;équipe au <strong>gwetsamuel49@gmail.com</strong>.
              </p>

            </td>
          </tr>

          <!-- PIED DE PAGE INSTITUTIONNEL SOBRE -->
          <tr>
            <td style="background-color:#F8FAFC;padding:20px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#475569;">
                L&apos;équipe RÉUSSIR POLYTECH
              </p>
              <p style="margin:0;font-size:10px;line-height:15px;color:#94A3B8;">
                Plateforme académique des élèves-ingénieurs polytechniciens &bull; Yaoundé, Cameroun.<br>
                Cet e-mail automatique a été adressé à ${escapeHtml(email)}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — « L'excellence est notre seul standard. »

Bonjour ${name || 'Élève-Ingénieur'},

Votre accès sur Réussir Polytech est désormais activé.

RÉCAPITULATIF :
- Filière : ${level.toUpperCase()}
- Matricule : ${matricule || 'Attribué'}
- Statut : Compte Validé

Accédez directement à vos polycopiés et annales :
${targetUrl}

Contenu disponible :
• Polycopiés de cours officiels
• Fiches de TD et exercices
• Annales de contrôles continus et examens résolus

Assistance officielle : gwetsamuel49@gmail.com

— L'équipe RÉUSSIR POLYTECH
École Nationale Supérieure Polytechnique de Yaoundé`;

  return { html, text, subject };
}

/* ========================================================================= */
/* 2. LETTRE HEBDOMADAIRE — RESSOURCES DE LA SEMAINE (Épurée & Lumineuse)     */
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
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;background-color:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 4px 20px rgba(15,23,42,0.04);overflow:hidden;">
          
          <!-- LISERÉ BLEU & OR -->
          <tr>
            <td height="4" style="background:linear-gradient(90deg, #0284C7 0%, #D4AF37 50%, #0284C7 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- EN-TÊTE BLANC AVEC LOGO -->
          <tr>
            <td style="padding:24px 32px 18px;border-bottom:1px solid #F1F5F9;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:14px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:10px;border:1px solid #E2E8F0;" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:18px;line-height:22px;font-weight:800;color:#0F172A;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#B8860B;font-weight:600;margin-top:2px;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:4px 10px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;font-size:10px;font-weight:700;color:#64748B;">
                      ${safeLevel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
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
                    <a href="${targetUrl}" target="_blank" style="display:inline-block;padding:12px 24px;background-color:#0284C7;color:#FFFFFF;font-size:13px;font-weight:700;border-radius:8px;">
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

/* ========================================================================= */
/* 3. EMAIL PROMOTION FORMATION VIP — L'INGÉNIEUR ENTREPRENEUR (Lumineux)    */
/* ========================================================================= */
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
  title = 'Programme VIP : L\'Ingénieur Entrepreneur',
  subtitle = 'Maîtrisez les outils pratiques et propulsez votre leadership technologique',
  description = 'Rejoignez le programme pratique animé par les aînés pour acquérir les compétences incontournables du monde de l\'ingénierie et de l\'entrepreneuriat.',
  modules = [
    'Bureautique avancée (Excel Expert, modélisation & reporting)',
    'Conception 3D & Prototypage (SolidWorks & CAO)',
    'Programmation Python appliquée aux sciences de l\'ingénieur',
    'Leadership, prise de parole & montage de projets technologiques',
  ],
  ctaUrl = BRAND_CONFIG.vipUrl,
  ctaText = 'Découvrir le programme & s\'inscrire',
}: PromotionEmailParams) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle);
  const safeDescription = escapeHtml(description);
  const safeCtaText = escapeHtml(ctaText);
  const subject = `${title} — Réussir Polytech`;

  const modulesHtml = modules
    .map(
      (mod, idx) => `
    <tr>
      <td style="padding:8px 0;vertical-align:top;width:24px;">
        <div style="width:20px;height:20px;border-radius:6px;background-color:#FEF3C7;color:#B8860B;font-size:11px;font-weight:800;text-align:center;line-height:20px;">
          ${idx + 1}
        </div>
      </td>
      <td style="padding:8px 0 8px 10px;font-size:13px;line-height:20px;color:#334155;font-weight:600;">
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
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;background-color:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 4px 20px rgba(15,23,42,0.04);overflow:hidden;">
          
          <!-- LISERÉ OR -->
          <tr>
            <td height="4" style="background:#D4AF37;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- EN-TÊTE CLAIR AVEC LOGO -->
          <tr>
            <td style="padding:24px 32px 18px;border-bottom:1px solid #F1F5F9;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:14px;">
                    <img src="cid:polytech-logo" width="48" height="48" alt="Logo Réussir Polytech" style="display:block;width:48px;height:48px;border-radius:10px;border:1px solid #E2E8F0;" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:18px;line-height:22px;font-weight:800;color:#0F172A;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#B8860B;font-weight:600;margin-top:2px;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:4px 10px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:12px;font-size:10px;font-weight:800;color:#B8860B;">
                      ESPACE VIP
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0F172A;">
                ${safeTitle}
              </h1>
              <p style="margin:0 0 18px;font-size:14px;font-weight:600;color:#B8860B;">
                ${safeSubtitle}
              </p>

              <p style="margin:0 0 20px;font-size:14px;line-height:22px;color:#475569;">
                Bonjour ${safeName},<br>
                ${safeDescription}
              </p>

              <!-- MODULES -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:12px 16px;margin-bottom:24px;">
                ${modulesHtml}
              </table>

              <!-- BOUTON VIP -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td>
                    <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:13px 28px;background-color:#0F172A;color:#F3E5AB;font-size:13px;font-weight:800;border-radius:10px;box-shadow:0 2px 8px rgba(15,23,42,0.2);">
                      ${safeCtaText} &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#64748B;">
                Encadrement : <strong>Eugène Samuel GWET</strong> &bull; <strong>Yannick BIKEI</strong>
              </p>
            </td>
          </tr>

          <!-- PIED DE PAGE -->
          <tr>
            <td style="background-color:#F8FAFC;padding:18px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94A3B8;">
                L&apos;équipe RÉUSSIR POLYTECH &bull; gwetsamuel49@gmail.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${title} — RÉUSSIR POLYTECH

Bonjour ${name || 'Élève-Ingénieur'},

${subtitle}

${description}

PROGRAMME :
${modules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Pour en savoir plus et vous inscrire :
${ctaUrl}

— L'équipe RÉUSSIR POLYTECH
gwetsamuel49@gmail.com`;

  return { html, text, subject };
}
