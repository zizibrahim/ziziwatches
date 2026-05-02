// WhatsApp messaging via UltraMsg API (https://ultramsg.com)
// Required env vars: WHATSAPP_INSTANCE_ID, WHATSAPP_TOKEN
// Optional: NEXT_PUBLIC_BASE_URL for building review links

function formatAlgerianPhone(phone: string): string {
  let p = phone.replace(/[\s\-\(\)\+]/g, "");
  if (p.startsWith("00213")) p = p.slice(5);
  else if (p.startsWith("213")) p = p.slice(3);
  else if (p.startsWith("0")) p = p.slice(1);
  return `213${p}`;
}

export async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  const instanceId = process.env.WHATSAPP_INSTANCE_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!instanceId || !token) {
    console.log("[WhatsApp] Not configured — message for", phone, "\n", message);
    return false;
  }

  const to = formatAlgerianPhone(phone);

  try {
    const res = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token, to, body: message }).toString(),
    });
    const data = await res.json();
    const ok = data.sent === "true" || data.sent === true;
    if (!ok) console.error("[WhatsApp] Send failed:", data);
    return ok;
  } catch (err) {
    console.error("[WhatsApp] Request error:", err);
    return false;
  }
}

export function buildReviewMessage(customerName: string, reviewUrl: string): string {
  return (
    `Bonjour ${customerName} 👋\n\n` +
    `Merci pour votre commande chez *Ziziwatches* ! 🕐✨\n\n` +
    `Votre commande a bien été livrée. Nous espérons que vous êtes satisfait(e) de votre montre.\n\n` +
    `Partagez votre avis en cliquant sur ce lien unique :\n` +
    `${reviewUrl}\n\n` +
    `_(Ce lien est personnel et à usage unique)_\n\n` +
    `Merci de votre confiance 🙏\n— L'équipe Ziziwatches`
  );
}
