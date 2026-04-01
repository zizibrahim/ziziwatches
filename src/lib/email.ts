import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT ?? "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  locale?: string;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.SMTP_USER) {
    console.log("📧 Email not configured — skipping. Order:", data.orderNumber);
    return;
  }

  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #1a1a1a;color:#aaa">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #1a1a1a;color:#aaa;text-align:center">×${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #1a1a1a;color:#c9a84c;text-align:right">${item.price.toLocaleString()} DZD</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif">
  <div style="max-width:560px;margin:40px auto;padding:0 20px">
    <!-- Header -->
    <div style="text-align:center;padding:40px 0 30px;border-bottom:1px solid #1a1a1a">
      <p style="color:#c9a84c;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;margin:0 0 8px">Ziziwatches</p>
      <h1 style="color:#f5f0e6;font-size:22px;font-weight:300;margin:0;letter-spacing:0.1em">Commande confirmée</h1>
    </div>

    <!-- Body -->
    <div style="padding:32px 0">
      <p style="color:#888;font-size:14px;margin:0 0 24px">Bonjour ${data.customerName},</p>
      <p style="color:#888;font-size:14px;margin:0 0 24px">
        Votre commande <span style="color:#c9a84c;font-family:monospace">${data.orderNumber}</span> a bien été reçue.
        Nous vous contacterons pour confirmer la livraison.
      </p>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${itemsHtml}
        <tr>
          <td colspan="2" style="padding:12px 0 0;color:#888;font-size:13px">Total</td>
          <td style="padding:12px 0 0;color:#c9a84c;font-size:16px;text-align:right;font-weight:600">
            ${data.total.toLocaleString()} DZD
          </td>
        </tr>
      </table>

      <!-- Address -->
      <div style="background:#111;border:1px solid #1a1a1a;padding:16px;margin-bottom:24px">
        <p style="color:#c9a84c;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px">Adresse de livraison</p>
        <p style="color:#888;font-size:13px;margin:0;line-height:1.6">${data.address}</p>
      </div>

      <p style="color:#666;font-size:13px;margin:0">
        Paiement à la livraison (espèces). Merci pour votre confiance.
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a1a;padding:24px 0;text-align:center">
      <p style="color:#444;font-size:11px;margin:0;letter-spacing:0.2em">
        © ${new Date().getFullYear()} ZIZIWATCHES — ALGÉRIE
      </p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Ziziwatches" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Commande ${data.orderNumber} confirmée — Ziziwatches`,
    html,
  });
}
