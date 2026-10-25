import { analyzeMessage, MAX_MESSAGE_LENGTH } from '../../../lib/analyze';
import { rateLimit } from '../../../lib/rateLimit';
import { isValidTwilioSignature, twimlReply } from '../../../lib/twilio';

const PER_SENDER = { limit: 10, windowMs: 60 * 60 * 1000 };
const GLOBAL = { limit: 500, windowMs: 24 * 60 * 60 * 1000 };

const WELCOME =
  'Escudo RGV 🛡️\n' +
  'Reenvíe aquí el mensaje sospechoso y le diremos si es estafa.\n' +
  'Forward the suspicious message here and we will tell you if it is a scam.';

const SPANISH_HINTS = /\b(el|la|los|las|de|que|su|usted|por|para|con|una|un|favor|cuenta|pago|banco|hola|gracias|urgente|ganó|premio)\b|[ñáéíóú¿¡]/i;

function formatReply(analysis, lang) {
  const es = lang === 'es';
  const verdict = es ? analysis.verdict_es : analysis.verdict_en;
  const explanation = es ? analysis.explanation_es : analysis.explanation_en;
  const reply = es ? analysis.suggested_reply_es : analysis.suggested_reply_en;
  const family = analysis.family_group_chat_card;

  const lines = [
    `🛡️ Escudo RGV — ${verdict} (${analysis.risk_score}/100)`,
    explanation,
    `${es ? 'Qué hacer' : 'What to do'}: ${reply}`,
  ];
  if (family) lines.push(`${es ? 'Para su familia' : 'For your family'}: ${family}`);
  return lines.join('\n\n').slice(0, 1500);
}

export async function POST(request) {
  const form = await request.formData();
  const params = Object.fromEntries([...form].map(([k, v]) => [k, String(v)]));

  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.error('TWILIO_AUTH_TOKEN is not set; refusing to serve the SMS webhook.');
    return new Response('Not configured', { status: 503 });
  }
  const url = process.env.TWILIO_WEBHOOK_URL || request.url;
  const signature = request.headers.get('x-twilio-signature');
  if (!isValidTwilioSignature({ authToken, signature, url, params })) {
    return new Response('Invalid signature', { status: 403 });
  }

  const body = (params.Body || '').trim();
  const sender = params.From || 'unknown';

  if (!body || /^(hola|hello|hi|start|help|ayuda)$/i.test(body)) {
    return twimlReply(WELCOME);
  }
  if (body.length > MAX_MESSAGE_LENGTH) {
    return twimlReply('Mensaje muy largo / Message too long. Envíe menos de 1500 caracteres / Send under 1500 characters.');
  }

  if (!rateLimit('global', GLOBAL).allowed || !rateLimit(`from:${sender}`, PER_SENDER).allowed) {
    return twimlReply('Demasiadas solicitudes, intente más tarde / Too many requests, please try again later.');
  }

  const lang = SPANISH_HINTS.test(body) ? 'es' : 'en';
  try {
    const { analysis } = await analyzeMessage({ message: body });
    return twimlReply(formatReply(analysis, lang));
  } catch (error) {
    console.error('SMS Analysis Error:', error);
    return twimlReply('No pudimos analizar el mensaje, intente de nuevo / We could not analyze the message, please try again.');
  }
}
