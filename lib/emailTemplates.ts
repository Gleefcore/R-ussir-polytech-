/**
 * Modèles d'Emails Officiels — RÉUSSIR POLYTECH
 * Slogan : « L'excellence est notre seul standard. »
 * Palette officielle : Or Impérial (#D4AF37), Bleu Polytech (#0284C7), Fond (#F8FAFC / #050B14)
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
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B',
    primary: '#0284C7', // Bleu Polytech
    primaryDark: '#0369A1',
    gold: '#D4AF37', // Or Impérial Polytech
    goldLight: '#F3E5AB',
    border: '#E2E8F0',
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
  const safeLevel = escapeHtml(level);
  const safeMatricule = matricule ? escapeHtml(matricule) : '';
  const subject = 'Bienvenue sur Réussir Polytech — l\'excellence se construit ensemble';

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND_CONFIG.colors.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND_CONFIG.colors.text};">
  <div role="article" aria-roledescription="email" lang="fr">
    <div style="display:none;font-size:1px;line-height:1px;color:${BRAND_CONFIG.colors.bg};max-height:0;max-width:0;opacity:0;overflow:hidden;">
      Les ressources de votre parcours ${safeLevel} et le Coin de l'Ingénieur vous attendent.
    </div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:${BRAND_CONFIG.colors.bg};">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:600px;background:#ffffff;border:1px solid ${BRAND_CONFIG.colors.border};border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.04);">
            <!-- Liseré supérieur Or & Bleu -->
            <tr>
              <td style="height:6px;background:linear-gradient(90deg, ${BRAND_CONFIG.colors.gold} 0%, ${BRAND_CONFIG.colors.primary} 100%);background-color:${BRAND_CONFIG.colors.gold};font-size:0;line-height:6px;">&nbsp;</td>
            </tr>

            <!-- En-tête avec Logo Officiel -->
            <tr>
              <td style="padding:28px 28px 20px;border-bottom:1px solid ${BRAND_CONFIG.colors.border};">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="54" style="vertical-align:middle;padding-right:14px;">
                      <img src="${BRAND_CONFIG.logoUrl}" width="48" height="48" alt="Logo Réussir Polytech" style="border:0;display:block;border-radius:8px;max-width:48px;height:auto;">
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-size:18px;line-height:22px;font-weight:bold;letter-spacing:0.3px;color:${BRAND_CONFIG.colors.text};">
                        RÉUSSIR POLYTECH
                      </div>
                      <div style="font-size:12px;color:${BRAND_CONFIG.colors.gold};font-weight:bold;margin-top:2px;">
                        « ${BRAND_CONFIG.slogan} »
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Corps du message -->
            <tr>
              <td style="padding:28px 28px 10px;">
                <div style="display:inline-block;padding:4px 12px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:20px;font-size:11px;font-weight:bold;letter-spacing:0.8px;color:#15803D;text-transform:uppercase;margin-bottom:16px;">
                  Compte Académique Validé • ${safeLevel}
                </div>

                <h1 style="font-size:24px;line-height:32px;letter-spacing:-0.4px;margin:0 0 16px;color:${BRAND_CONFIG.colors.text};">
                  Bienvenue dans la communauté, ${safeName} !
                </h1>

                <p style="font-size:15px;line-height:25px;margin:0 0 16px;color:${BRAND_CONFIG.colors.text};">
                  Félicitations pour votre inscription sur <strong>Réussir Polytech</strong>. Vous rejoignez une communauté d'élèves-ingénieurs polytechniciens guidés par la méthode, la rigueur et l'entraide.
                </p>

                ${safeMatricule ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;background:#F8FAFC;border:1px solid ${BRAND_CONFIG.colors.border};border-radius:8px;">
                  <tr>
                    <td style="padding:12px 16px;font-size:13px;line-height:20px;color:${BRAND_CONFIG.colors.text};">
                      <strong>Matricule académique :</strong> <code style="font-family:monospace;background:#E2E8F0;padding:2px 6px;border-radius:4px;color:#0F172A;">${safeMatricule}</code> &bull; <strong>Niveau :</strong> ${safeLevel}
                    </td>
                  </tr>
                </table>` : ''}

                <p style="font-size:15px;line-height:25px;margin:0 0 16px;color:${BRAND_CONFIG.colors.text};">
                  Sur la plateforme, retrouvez l'intégralité des <strong>cours, fiches de TD, contrôles continus et annales d'examens</strong> certifiés dispensés par le corps professoral émérite des écoles polytechniques du Cameroun (notamment Pr Takou, Pr Bouetou, Pr Mama, Dr Yatat et leurs pairs).
                </p>

                <!-- Bouton d'accès direct -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:24px 0 24px;">
                  <tr>
                    <td bgcolor="${BRAND_CONFIG.colors.primary}" style="border-radius:8px;background:${BRAND_CONFIG.colors.primary};">
                      <a href="${BRAND_CONFIG.siteUrl}/${safeLevel.toLowerCase()}" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:14px;line-height:18px;font-weight:bold;letter-spacing:0.3px;">
                        Accéder à mes cours ${safeLevel} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:16px 18px;margin-bottom:24px;">
                  <div style="font-size:13px;font-weight:bold;color:#92400E;margin-bottom:6px;">
                    À DÉCOUVRIR : LE COIN DE L'INGÉNIEUR ENTREPRENEUR
                  </div>
                  <p style="font-size:13px;line-height:21px;color:#78350F;margin:0 0 10px;">
                    Les compétences ne s'arrêtent pas à l'amphithéâtre. Retrouvez des formations pratiques (Python, CAO 3D, modélisation technique) et les projets d'innovation encadrés par la direction académique.
                  </p>
                  <a href="${BRAND_CONFIG.vipUrl}" style="color:${BRAND_CONFIG.colors.primary};font-weight:bold;font-size:13px;text-decoration:underline;">
                    Explorer l'Espace Ingénieur Entrepreneur &rarr;
                  </a>
                </div>

                <p style="font-size:15px;line-height:25px;margin:0 0 8px;color:${BRAND_CONFIG.colors.text};">
                  Rigueur, entraide et ambition : ensemble, construisons l'excellence de l'ingénierie camerounaise.
                </p>

                <p style="font-size:14px;line-height:22px;margin:20px 0 28px;font-weight:bold;color:${BRAND_CONFIG.colors.text};">
                  ${BRAND_CONFIG.senderName}
                </p>
              </td>
            </tr>

            <!-- Pied de page -->
            <tr>
              <td style="padding:22px 28px;background:${BRAND_CONFIG.colors.bg};border-top:1px solid ${BRAND_CONFIG.colors.border};">
                <p style="font-size:12px;line-height:18px;margin:0 0 6px;color:${BRAND_CONFIG.colors.textMuted};">
                  Message officiel automatique envoyé à la suite de la validation de votre inscription sur Réussir Polytech.
                </p>
                <p style="font-size:12px;line-height:18px;margin:0;color:${BRAND_CONFIG.colors.textMuted};">
                  RÉUSSIR POLYTECH &bull; <a href="${BRAND_CONFIG.siteUrl}" style="color:${BRAND_CONFIG.colors.primary};text-decoration:underline;">Visiter la plateforme</a> &bull; Contact : <a href="mailto:${BRAND_CONFIG.senderEmail}" style="color:${BRAND_CONFIG.colors.primary};text-decoration:none;">${BRAND_CONFIG.senderEmail}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;

  const text = `RÉUSSIR POLYTECH — « ${BRAND_CONFIG.slogan} »
Bienvenue dans la communauté académique, ${name} !

Votre inscription est confirmée sur Réussir Polytech (${level}${matricule ? ` - Matricule : ${matricule}` : ''}).

Retrouvez les cours, fiches de TD, contrôles continus et annales d'examens dispensés par le corps professoral émérite des écoles polytechniques du Cameroun.

Accédez à vos documents :
${BRAND_CONFIG.siteUrl}/${level.toLowerCase()}

Découvrez également Le Coin de l'Ingénieur Entrepreneur :
${BRAND_CONFIG.vipUrl}

Rigueur, entraide et ambition.

${BRAND_CONFIG.senderName}
Contact : ${BRAND_CONFIG.senderEmail}
Site : ${BRAND_CONFIG.siteUrl}`;

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
  unsubscribeToken = 'demo-token',
}: WeeklyEmailParams) {
  const safeName = escapeHtml(name || 'Élève-Ingénieur');
  const safeLevel = escapeHtml(level);
  const subject = 'Votre point Polytech de la semaine — ressources et initiatives';
  const unsubscribeUrl = `${BRAND_CONFIG.siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubscribeToken)}`;

  // Maximum 3 ressources vérifiées issues du catalogue réel
  const topResources = resources.slice(0, 3);

  const resourcesHtml = topResources.length > 0
    ? topResources
        .map(
          (r) => `
      <div style="padding:12px 0;border-bottom:1px solid ${BRAND_CONFIG.colors.border};">
        <div style="font-size:11px;font-weight:bold;color:${BRAND_CONFIG.colors.primary};text-transform:uppercase;letter-spacing:0.5px;">
          ${escapeHtml(r.subject)} ${r.type ? `&bull; ${escapeHtml(r.type)}` : ''}
        </div>
        <div style="font-size:14px;font-weight:bold;color:${BRAND_CONFIG.colors.text};margin:3px 0;">
          ${escapeHtml(r.title)}
        </div>
        ${r.url ? `
        <a href="${escapeHtml(r.url)}" style="font-size:12px;color:${BRAND_CONFIG.colors.primary};font-weight:bold;text-decoration:underline;">
          Consulter le document &rarr;
        </a>` : ''}
      </div>`
        )
        .join('')
    : `
      <p style="font-size:13px;line-height:20px;color:${BRAND_CONFIG.colors.textMuted};margin:0;">
        Consultez votre cockpit étudiant pour retrouver les dernières épreuves et fiches de révision mises à jour.
      </p>`;

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND_CONFIG.colors.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND_CONFIG.colors.text};">
  <div role="article" aria-roledescription="email" lang="fr">
    <div style="display:none;font-size:1px;line-height:1px;color:${BRAND_CONFIG.colors.bg};max-height:0;max-width:0;opacity:0;overflow:hidden;">
      Un point utile sur vos cours ${safeLevel} et les opportunités d'ingénieurs.
    </div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:${BRAND_CONFIG.colors.bg};">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:600px;background:#ffffff;border:1px solid ${BRAND_CONFIG.colors.border};border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.04);">
            <!-- Liseré supérieur Or & Bleu -->
            <tr>
              <td style="height:6px;background:linear-gradient(90deg, ${BRAND_CONFIG.colors.primary} 0%, ${BRAND_CONFIG.colors.gold} 100%);background-color:${BRAND_CONFIG.colors.primary};font-size:0;line-height:6px;">&nbsp;</td>
            </tr>

            <!-- En-tête -->
            <tr>
              <td style="padding:28px 28px 20px;border-bottom:1px solid ${BRAND_CONFIG.colors.border};">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="54" style="vertical-align:middle;padding-right:14px;">
                      <img src="${BRAND_CONFIG.logoUrl}" width="48" height="48" alt="Logo Réussir Polytech" style="border:0;display:block;border-radius:8px;max-width:48px;height:auto;">
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-size:18px;line-height:22px;font-weight:bold;letter-spacing:0.3px;color:${BRAND_CONFIG.colors.text};">
                        RÉUSSIR POLYTECH
                      </div>
                      <div style="font-size:12px;color:${BRAND_CONFIG.colors.textMuted};margin-top:2px;">
                        Le rendez-vous académique hebdomadaire
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Corps du message -->
            <tr>
              <td style="padding:28px 28px 10px;">
                <div style="display:inline-block;padding:4px 12px;background:#F0F9FF;border:1px solid #BAE6FD;border-radius:20px;font-size:11px;font-weight:bold;letter-spacing:0.8px;color:${BRAND_CONFIG.colors.primaryDark};text-transform:uppercase;margin-bottom:16px;">
                  Hebdo Polytech • Semaine Académique
                </div>

                <h1 style="font-size:24px;line-height:32px;letter-spacing:-0.4px;margin:0 0 16px;color:${BRAND_CONFIG.colors.text};">
                  Un temps pour vos cours, un regard vers vos projets.
                </h1>

                <p style="font-size:15px;line-height:25px;margin:0 0 16px;color:${BRAND_CONFIG.colors.text};">
                  Bonjour ${safeName},
                </p>

                <p style="font-size:15px;line-height:25px;margin:0 0 18px;color:${BRAND_CONFIG.colors.text};">
                  ${customMessage ? escapeHtml(customMessage) : 'Voici une sélection ciblée de ressources académiques réellement disponibles sur Réussir Polytech pour structurer vos révisions avec méthode.'}
                </p>

                <!-- Bloc des Ressources Recommandées -->
                <div style="background:#F8FAFC;border:1px solid ${BRAND_CONFIG.colors.border};border-radius:12px;padding:18px;margin-bottom:24px;">
                  <div style="font-size:12px;font-weight:bold;color:${BRAND_CONFIG.colors.primaryDark};text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">
                    Ressources à réviser cette semaine
                  </div>
                  ${resourcesHtml}
                </div>

                <!-- Bouton Reprendre le Travail -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:20px 0 24px;">
                  <tr>
                    <td bgcolor="${BRAND_CONFIG.colors.primary}" style="border-radius:8px;background:${BRAND_CONFIG.colors.primary};">
                      <a href="${BRAND_CONFIG.siteUrl}/${safeLevel.toLowerCase()}" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:14px;line-height:18px;font-weight:bold;">
                        Reprendre mon travail sur ${safeLevel} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Bloc Le Coin de l'Ingénieur -->
                <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:16px 18px;margin-bottom:24px;">
                  <div style="font-size:13px;font-weight:bold;color:#92400E;margin-bottom:6px;">
                    LE COIN DE L'INGÉNIEUR ENTREPRENEUR
                  </div>
                  <p style="font-size:13px;line-height:21px;color:#78350F;margin:0 0 10px;">
                    Découvrez les ateliers pratiques et les initiatives d'ingénierie activement préparés par la communauté.
                  </p>
                  <a href="${BRAND_CONFIG.vipUrl}" style="color:${BRAND_CONFIG.colors.primary};font-weight:bold;font-size:13px;text-decoration:underline;">
                    Voir les formations et initiatives &rarr;
                  </a>
                </div>

                <p style="font-size:14px;line-height:22px;margin:0 0 6px;font-weight:bold;color:${BRAND_CONFIG.colors.gold};">
                  « ${BRAND_CONFIG.slogan} »
                </p>
                <p style="font-size:14px;line-height:22px;margin:0 0 24px;font-weight:bold;color:${BRAND_CONFIG.colors.text};">
                  ${BRAND_CONFIG.senderName}
                </p>
              </td>
            </tr>

            <!-- Pied de page avec lien de désabonnement -->
            <tr>
              <td style="padding:22px 28px;background:${BRAND_CONFIG.colors.bg};border-top:1px solid ${BRAND_CONFIG.colors.border};">
                <p style="font-size:12px;line-height:18px;margin:0 0 8px;color:${BRAND_CONFIG.colors.textMuted};">
                  Vous recevez ce point hebdomadaire car vous avez accepté de recevoir les communications académiques de Réussir Polytech.
                </p>
                <p style="font-size:12px;line-height:18px;margin:0;color:${BRAND_CONFIG.colors.textMuted};">
                  <a href="${unsubscribeUrl}" style="color:${BRAND_CONFIG.colors.primary};text-decoration:underline;">Se désabonner de cette lettre</a> &bull; 
                  <a href="${BRAND_CONFIG.siteUrl}/dashboard" style="color:${BRAND_CONFIG.colors.primary};text-decoration:underline;">Gérer mes préférences</a> &bull; 
                  <a href="${BRAND_CONFIG.siteUrl}" style="color:${BRAND_CONFIG.colors.primary};text-decoration:none;">Accéder au site</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;

  const textResources = topResources
    .map((r, i) => `${i + 1}. [${r.subject}] ${r.title} : ${r.url || BRAND_CONFIG.siteUrl}`)
    .join('\n');

  const text = `RÉUSSIR POLYTECH — Point Hebdomadaire
« ${BRAND_CONFIG.slogan} »

Bonjour ${name},

Voici votre sélection de ressources académiques pour votre semaine de travail (${level}) :

${textResources || 'Retrouvez vos cours et épreuves sur votre espace étudiant.'}

Reprendre mon travail :
${BRAND_CONFIG.siteUrl}/${level.toLowerCase()}

Le Coin de l'Ingénieur Entrepreneur :
${BRAND_CONFIG.vipUrl}

${BRAND_CONFIG.senderName}
Pour vous désabonner : ${unsubscribeUrl}`;

  return { html, text, subject };
}
