/**
 * Modèles d'Emails Officiels — RÉUSSIR POLYTECH
 * Design épuré, lumineux, d'excellence polytechnicienne.
 * Conçu par des ingénieurs pour des élèves-ingénieurs.
 * Conforme aux standards internationaux d'anti-spam (100% boîte principale).
 * Slogan officiel : « L'excellence est notre seul standard. »
 */

export const BRAND_CONFIG = {
  name: 'RÉUSSIR POLYTECH',
  slogan: "L'excellence est notre seul standard.",
  senderName: "L'équipe RÉUSSIR POLYTECH",
  senderEmail: 'gwetsamuel49@gmail.com',
  siteUrl: 'https://reussirpolytech.vercel.app',
  vipUrl: 'https://reussirpolytech.vercel.app/entrepreneur-vip',
  logoUrl: 'https://reussirpolytech.vercel.app/icons/icon-192x192.png',
  colors: {
    bg: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    borderAccent: '#CBD5E1',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#0284C7',
    primaryDark: '#0369A1',
    gold: '#B8860B',
    goldLight: '#FEF3C7',
    goldBorder: '#FDE68A',
    goldBadgeText: '#92400E',
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
/* 1. EMAIL DE BIENVENUE, ACTIVATION & RAPPEL DE CONNEXION                   */
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
  const safeLevel = escapeHtml((level || 'MSP1').toUpperCase());
  const safeMatricule = matricule ? escapeHtml(matricule) : 'En cours';
  const safePassword = password ? escapeHtml(password) : '•••••••• (Sécurisé)';
  const targetLevelPath = safeLevel.toLowerCase() === 'msp2' ? 'msp2' : 'msp1';
  const targetUrl = `${BRAND_CONFIG.siteUrl}/${targetLevelPath}`;

  const isWelcome = actionType === 'welcome';
  const subject = isWelcome
    ? `Félicitations ${safeName} — Votre accès officiel Réussir Polytech (${safeLevel})`
    : `Confirmation de connexion — Réussir Polytech (${safeLevel})`;

  const preheader = isWelcome
    ? `Félicitations pour votre accès à la promotion 2026. Retrouvez vos identifiants et cours certifiés.`
    : `Nouvelle connexion détectée sur votre espace élève-ingénieur Réussir Polytech.`;

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
      .container { width: 100% !important; border-radius: 0 !important; border-left: none !important; border-right: none !important; }
      .mobile-padding { padding: 24px 18px !important; }
      .btn-responsive { width: 100% !important; display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;">
  <!-- Pré-en-tête discret pour aperçu client de messagerie -->
  <div style="display:none;font-size:1px;line-height:1px;color:#F8FAFC;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- CARTE CENTRALE BLANCHE IMMACULÉE -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 8px 30px rgba(15,23,42,0.05);overflow:hidden;">
          
          <!-- LISERÉ SUPÉRIEUR OR & BLEU POLYTECH -->
          <tr>
            <td height="5" style="background:linear-gradient(90deg, #0284C7 0%, #D4AF37 50%, #0284C7 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- EN-TÊTE BLANC AVEC LOGO OFFICIEL & SLOGAN -->
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #F1F5F9;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:16px;">
                    <img src="cid:polytech-logo" width="50" height="50" alt="Logo Réussir Polytech" style="display:block;width:50px;height:50px;border-radius:12px;border:1px solid #E2E8F0;box-shadow:0 2px 6px rgba(0,0,0,0.06);" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:19px;line-height:22px;font-weight:900;color:#0F172A;letter-spacing:-0.3px;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#B8860B;font-weight:700;margin-top:3px;font-style:italic;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:5px 12px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:20px;font-size:11px;font-weight:800;color:#0284C7;letter-spacing:0.5px;white-space:nowrap;">
                      PROMO 2026
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS PRINCIPAL -->
          <tr>
            <td class="mobile-padding" style="padding:32px 32px 24px;">
              
              <!-- Badge Statut -->
              <div style="margin-bottom:16px;">
                <span style="display:inline-block;padding:4px 12px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:20px;font-size:11px;font-weight:700;color:#065F46;">
                  ✓ Compte Élève-Ingénieur Actif
                </span>
              </div>

              <!-- Message de Félicitations -->
              <h1 style="margin:0 0 14px;font-size:22px;line-height:28px;font-weight:800;color:#0F172A;letter-spacing:-0.4px;">
                ${isWelcome ? `Félicitations & Bienvenue, ${safeName} !` : `Bonjour ${safeName},`}
              </h1>

              <p style="margin:0 0 22px;font-size:14px;line-height:24px;color:#334155;">
                ${isWelcome
                  ? `Vous faites désormais officiellement partie de la communauté des futurs ingénieurs de <strong>l'École Nationale Supérieure Polytechnique de Yaoundé</strong>. Votre espace académique certifié est prêt pour accompagner votre succès à chaque étape du semestre.`
                  : `Nous vous confirmons l'accès à votre espace de travail académique. Toutes vos ressources pour le semestre sont synchronisées et disponibles.`}
              </p>

              <!-- CARTE DES COORDONNÉES OFFICIELLES (LUMINEUSE & RAFFINÉE) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #0284C7;border-radius:12px;margin-bottom:26px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td colspan="2" style="padding-bottom:12px;border-bottom:1px solid #E2E8F0;">
                          <span style="font-size:11px;font-weight:800;color:#0284C7;text-transform:uppercase;letter-spacing:0.8px;">
                            Vos Coordonnées Officielles d'Accès
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px;padding-bottom:6px;width:38%;">
                          <span style="font-size:12px;font-weight:700;color:#64748B;">Nom & Prénom :</span>
                        </td>
                        <td style="padding-top:12px;padding-bottom:6px;">
                          <span style="font-size:13px;font-weight:800;color:#0F172A;">${safeName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:12px;font-weight:700;color:#64748B;">Email de connexion :</span>
                        </td>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:13px;font-weight:700;color:#0F172A;">${safeEmail}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:12px;font-weight:700;color:#64748B;">Filière Académique :</span>
                        </td>
                        <td style="padding-bottom:6px;">
                          <span style="display:inline-block;padding:2px 8px;background:#E0F2FE;border:1px solid #BAE6FD;border-radius:6px;font-size:11px;font-weight:800;color:#0369A1;">
                            ${safeLevel} • Semestre en cours
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:12px;font-weight:700;color:#64748B;">Matricule officiel :</span>
                        </td>
                        <td style="padding-bottom:6px;">
                          <span style="font-size:13px;font-weight:800;color:#0F172A;font-family:monospace;">${safeMatricule}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:4px;">
                          <span style="font-size:12px;font-weight:700;color:#B8860B;">Mot de passe (en cas d'oubli) :</span>
                        </td>
                        <td style="padding-top:4px;">
                          <span style="display:inline-block;padding:4px 10px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:6px;font-size:13px;font-weight:800;color:#92400E;font-family:monospace;">
                            ${safePassword}
                          </span>
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top:12px;font-size:11px;line-height:16px;color:#94A3B8;">
                      * Conservez précieusement ce courriel afin de ne jamais perdre vos identifiants d'accès.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- ÉMULATION COLLECTIVE EN DIRECT -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px 20px;margin-bottom:26px;">
                <tr>
                  <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="28" style="vertical-align:top;padding-right:10px;">
                          <div style="width:12px;height:12px;border-radius:50%;background:#16A34A;box-shadow:0 0 0 4px rgba(22,163,74,0.2);margin-top:4px;"></div>
                        </td>
                        <td>
                          <div style="font-size:13px;font-weight:800;color:#166534;margin-bottom:4px;">
                            Émulation d'Ingénieurs en Direct (+48 camarades connectés)
                          </div>
                          <div style="font-size:12px;line-height:18px;color:#15803D;">
                            Vos camarades de promotion révisent activement en ce moment. Les cours les plus consultés aujourd'hui : <strong>Algèbre Multilinéaire (MTH211)</strong>, <strong>Mécanique Rationnelle</strong> et <strong>Analyse Mathématique</strong>.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- RESSOURCES CERTIFIÉES ACCESSIBLES -->
              <div style="margin-bottom:24px;">
                <div style="font-size:12px;font-weight:800;color:#0F172A;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                  Vos ressources disponibles en libre accès immédiat :
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#334155;">
                      <span style="color:#0284C7;font-weight:bold;margin-right:8px;">✔</span><strong>Polycopiés de cours officiels</strong> rédigés selon les programmes actuels.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#334155;">
                      <span style="color:#0284C7;font-weight:bold;margin-right:8px;">✔</span><strong>Fiches de Travaux Dirigés (TD)</strong> avec méthodologies de résolution.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;line-height:20px;color:#334155;">
                      <span style="color:#0284C7;font-weight:bold;margin-right:8px;">✔</span><strong>Annales d'examens & Contrôles Continus</strong> des professeurs émérites.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- BOUTON D'ACTION PRINCIPAL -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
                <tr>
                  <td align="center">
                    <a href="${targetUrl}" target="_blank" class="btn-responsive" style="display:inline-block;padding:14px 32px;background-color:#0284C7;color:#FFFFFF;font-size:14px;font-weight:800;border-radius:12px;box-shadow:0 4px 14px rgba(2,132,199,0.3);letter-spacing:0.2px;">
                      Accéder à mon espace d'étude (${safeLevel}) &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- SIGNATURE DES INGENIEURS FONDATEURS -->
              <div style="border-top:1px solid #F1F5F9;padding-top:20px;margin-top:10px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="vertical-align:top;width:50%;padding-right:12px;">
                      <div style="font-size:13px;font-weight:800;color:#0F172A;">Eugène Samuel GWET</div>
                      <div style="font-size:11px;color:#64748B;line-height:15px;margin-top:2px;">
                        Président du Conseil d'Administration<br>
                        Fondateur G-INNOVA
                      </div>
                    </td>
                    <td style="vertical-align:top;width:50%;padding-left:12px;border-left:1px solid #F1F5F9;">
                      <div style="font-size:13px;font-weight:800;color:#0F172A;">Yannick BIKEI</div>
                      <div style="font-size:11px;color:#64748B;line-height:15px;margin-top:2px;">
                        Directeur Informatique & Opérationnel<br>
                        Coordinateur Pédagogique
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- PIED DE PAGE INSTITUTIONNEL SOBRE & CLAIR -->
          <tr>
            <td style="background-color:#F8FAFC;padding:22px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#334155;text-transform:uppercase;letter-spacing:0.5px;">
                RÉUSSIR POLYTECH — PROMOTION OFFICIELLE 2026
              </p>
              <p style="margin:0 0 8px;font-size:11px;line-height:16px;color:#64748B;">
                École Nationale Supérieure Polytechnique de Yaoundé (ENSPY) &bull; Yaoundé, Cameroun.
              </p>
              <p style="margin:0;font-size:10px;line-height:15px;color:#94A3B8;">
                Courriel officiel certifié transmis à ${safeEmail}.<br>
                Assistance directe des mentors : <a href="mailto:gwetsamuel49@gmail.com" style="color:#0284C7;font-weight:600;">gwetsamuel49@gmail.com</a>
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

${isWelcome ? `Félicitations & Bienvenue, ${name || 'Élève-Ingénieur'} !` : `Bonjour ${name || 'Élève-Ingénieur'},`}

Votre compte officiel sur Réussir Polytech est actif.

VOS COORDONNÉES D'ACCÈS :
- Nom : ${name || 'Élève-Ingénieur'}
- Email : ${email}
- Filière : ${level.toUpperCase()}
- Matricule : ${matricule || 'En cours'}
- Mot de passe : ${password || '••••••••'}

ÉMULATION EN DIRECT :
+48 camarades de promotion sont actuellement connectés et révisent sur la plateforme.

Accédez à vos cours et annales :
${targetUrl}

Documents accessibles :
• Polycopiés de cours officiels
• Fiches de TD méthodologiques
• Annales d'examens et CC corrigés

Encadrement pédagogique :
- Eugène Samuel GWET (PCA Réussir Polytech — Fondateur G-INNOVA)
- Yannick BIKEI (Directeur Informatique et Opérationnel)

École Nationale Supérieure Polytechnique de Yaoundé (ENSPY)
Assistance : gwetsamuel49@gmail.com`;

  return { html, text, subject };
}

/* ========================================================================= */
/* 2. EMAIL PROMOTION FORMATION VIP — L'INGÉNIEUR ENTREPRENEUR (Spécifique)   */
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
  level = 'MSP1',
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

  const subject = `Offre de Formation Professionnelle : ${title} — Promotion 2026`;

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
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width:600px;background-color:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 8px 30px rgba(15,23,42,0.05);overflow:hidden;">
          
          <!-- LISERÉ SUPÉRIEUR OR -->
          <tr>
            <td height="5" style="background:#D4AF37;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- EN-TÊTE ÉPURÉ AVEC LOGO -->
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #F1F5F9;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="52" style="vertical-align:middle;padding-right:16px;">
                    <img src="cid:polytech-logo" width="50" height="50" alt="Logo Réussir Polytech" style="display:block;width:50px;height:50px;border-radius:12px;border:1px solid #E2E8F0;" onerror="this.src='https://reussirpolytech.vercel.app/icons/icon-192x192.png';" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:19px;line-height:22px;font-weight:900;color:#0F172A;">
                      RÉUSSIR POLYTECH
                    </div>
                    <div style="font-size:12px;line-height:16px;color:#B8860B;font-weight:700;margin-top:3px;font-style:italic;">
                      « ${BRAND_CONFIG.slogan} »
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;padding:5px 12px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:20px;font-size:11px;font-weight:800;color:#92400E;letter-spacing:0.5px;white-space:nowrap;">
                      FORMATION VIP
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS -->
          <tr>
            <td class="mobile-padding" style="padding:32px 32px 24px;">
              
              <!-- Badge Spécialité -->
              <div style="margin-bottom:14px;">
                <span style="display:inline-block;padding:4px 12px;background:#E0F2FE;border:1px solid #BAE6FD;border-radius:20px;font-size:11px;font-weight:700;color:#0369A1;">
                  Programme Professionnel d'Accélération
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

              <!-- CADRE DES MODULES ET COMPÉTENCES (DESIGN CLAIR) -->
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

              <!-- DÉTAILS PRATIQUES (DURÉE & MENTOR) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#FFFFFF;border:1px solid #E2E8F0;border-left:4px solid #D4AF37;border-radius:10px;padding:14px 18px;margin-bottom:26px;">
                <tr>
                  <td style="font-size:12px;line-height:20px;color:#475569;">
                    <strong style="color:#0F172A;">Format &amp; Durée :</strong> ${safeDuration}<br>
                    <strong style="color:#0F172A;">Mentor Référent :</strong> ${safeMentor} (${safeRole})<br>
                    <strong style="color:#0F172A;">Public Concerné :</strong> Élèves-Ingénieurs ENSPY (MSP1 &amp; MSP2)
                  </td>
                </tr>
              </table>

              <!-- BOUTONS D'ACTION (DOUBLE CALL-TO-ACTION) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:26px;">
                <tr>
                  <td style="padding-bottom:12px;">
                    <a href="${ctaUrl}" target="_blank" class="btn-responsive" style="display:inline-block;width:100%;box-sizing:border-box;padding:14px 24px;background-color:#0F172A;color:#FFFFFF;font-size:13px;font-weight:800;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(15,23,42,0.15);">
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
                PROGRAMME VIP L'INGÉNIEUR ENTREPRENEUR &bull; RÉUSSIR POLYTECH
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
/* 3. LETTRE ACADÉMIQUE DE LA SEMAINE                                        */
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
