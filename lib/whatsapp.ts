export interface WhatsAppPayload {
  studentName: string;
  matricule: string;
  level: string;
  phone: string;
  itemTitle: string;
  subject?: string;
  objective?: string;
}

export type WhatsAppChannel =
  | 'VIP_EUGENE'
  | 'VIP_YANNICK'
  | 'CORRECTION_EUGENE'
  | 'CORRECTION_YANNICK'
  | 'TECH'
  | 'STRATEGY'
  | 'CORRECTION';

export const sendWhatsAppNotification = (
  channel: WhatsAppChannel,
  payload: WhatsAppPayload
) => {
  const EUGENE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441';
  const YANNICK_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_TECH || '237695957287';

  let targetNumber = EUGENE_NUMBER;
  let text = '';

  switch (channel) {
    case 'VIP_EUGENE':
    case 'STRATEGY':
      targetNumber = EUGENE_NUMBER;
      text = `Bonjour M. Eugène Samuel GWET (PCA Réussir Polytech),\n\nJe suis ${payload.studentName}, matricule *${payload.matricule}* (${payload.level}).\nJe souhaite régler mon adhésion VIP pour débloquer l'Espace Ingénieur Entrepreneur : *${payload.itemTitle}*.\n\nTéléphone : ${payload.phone}\nVision / Projet : ${payload.objective || 'Accès d\'élite aux sessions stratégiques'}\n\nMerci de me communiquer les coordonnées de paiement (Orange Money / Mobile Money) pour valider mon accès.`;
      break;

    case 'VIP_YANNICK':
    case 'TECH':
      targetNumber = YANNICK_NUMBER;
      text = `Bonjour M. Yannick BIKEI (Directeur Informatique Réussir Polytech),\n\nJe suis ${payload.studentName}, matricule *${payload.matricule}* (${payload.level}).\nJe souhaite régler et débloquer mon accès au module technique VIP : *${payload.itemTitle}*.\n\nTéléphone : ${payload.phone}\nObjectif : ${payload.objective || 'Perfectionnement technique d\'ingénieur'}\n\nMerci de m'indiquer la procédure de paiement pour l'activation.`;
      break;

    case 'CORRECTION_EUGENE':
    case 'CORRECTION':
      targetNumber = EUGENE_NUMBER;
      text = `Bonjour M. Eugène Samuel GWET (Direction Réussir Polytech),\n\nJe suis ${payload.studentName}, matricule *${payload.matricule}* (${payload.level}).\nJe souhaite débloquer et payer la correction officielle certifiée de : *${payload.itemTitle}* (${payload.subject || ''}).\n\nTéléphone : ${payload.phone}\nMerci de m'envoyer le numéro Orange Money / Mobile Money pour le règlement.`;
      break;

    case 'CORRECTION_YANNICK':
      targetNumber = YANNICK_NUMBER;
      text = `Bonjour M. Yannick BIKEI (Direction Réussir Polytech),\n\nJe suis ${payload.studentName}, matricule *${payload.matricule}* (${payload.level}).\nJe souhaite débloquer et payer la correction officielle certifiée de : *${payload.itemTitle}* (${payload.subject || ''}).\n\nTéléphone : ${payload.phone}\nMerci de m'envoyer le numéro Orange Money / Mobile Money pour le règlement.`;
      break;

    default:
      targetNumber = EUGENE_NUMBER;
      text = `Bonjour,\n\nJe suis ${payload.studentName}, matricule *${payload.matricule}* (${payload.level}).\nJe vous contacte concernant : *${payload.itemTitle}*.`;
  }

  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${targetNumber}?text=${encodedText}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
};

