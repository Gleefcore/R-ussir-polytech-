export interface WhatsAppPayload {
  studentName: string;
  matricule: string;
  level: string;
  phone: string;
  itemTitle: string;
  subject?: string;
  objective?: string;
}

export const sendWhatsAppNotification = (
  channel: 'TECH' | 'STRATEGY' | 'CORRECTION',
  payload: WhatsAppPayload
) => {
  let targetNumber = '';
  let text = '';

  if (channel === 'TECH') {
    targetNumber = process.env.NEXT_PUBLIC_WHATSAPP_TECH || '237695957287';
    text = `Bonjour M. Bikey Yannick (Direction Informatique),\n\nJe suis ${payload.studentName}, matricule ${payload.matricule} (${payload.level}).\nJe souhaite intégrer le module technique : *${payload.itemTitle}*.\n\nTéléphone : ${payload.phone}\nObjectif : ${payload.objective || 'Perfectionnement technique'}\n\nMerci de m'indiquer la procédure d'inscription.`;
  } else if (channel === 'STRATEGY') {
    targetNumber = process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441';
    text = `Bonjour M. Eugène Samuel GWET (PCA Réussir Polytech),\n\nJe suis ${payload.studentName}, matricule ${payload.matricule} (${payload.level}).\nJe postule au programme d'élite : *${payload.itemTitle}*.\n\nTéléphone : ${payload.phone}\nVision : ${payload.objective || 'Développement du leadership et entrepreneuriat'}\n\nMerci de me communiquer les prochaines étapes.`;
  } else if (channel === 'CORRECTION') {
    targetNumber = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || '237672356441';
    text = `Bonjour Support Réussir Polytech,\n\nJe suis ${payload.studentName}, matricule ${payload.matricule} (${payload.level}).\nJe souhaite débloquer l'accès payant à la correction de : *${payload.itemTitle}* (${payload.subject || ''}).\n\nMon numéro : ${payload.phone}\nMerci de m'envoyer les coordonnées de paiement Orange Money.`;
  }

  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${targetNumber}?text=${encodedText}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
};
