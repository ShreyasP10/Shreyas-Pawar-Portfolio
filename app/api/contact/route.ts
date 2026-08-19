import { NextResponse } from "next/server";
import type { ContactMessagePayload } from "@/lib/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validationError(message: string): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: Partial<ContactMessagePayload>;

  try {
    body = await request.json();
  } catch {
    return validationError("Invalid JSON body");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const honeypot = (body as { honeypot?: string }).honeypot;

  // Bot detection via honeypot
  if (honeypot) {
    return NextResponse.json({ success: true, message: "Message received" });
  }

  if (name.length < 2) {
    return validationError("Name must be at least 2 characters");
  }
  if (!EMAIL_REGEX.test(email)) {
    return validationError("A valid email address is required");
  }
  if (message.length < 10) {
    return validationError("Message must be at least 10 characters");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL ?? "shreyaspawar1011@gmail.com";

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0f;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0f;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#121218;border:1px solid rgba(255,215,0,0.25);border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#1a1a22,#121218);border-bottom:1px solid rgba(255,215,0,0.35);padding:22px 28px;">
                <span style="color:#ffd700;font-size:22px;font-weight:800;letter-spacing:2px;">SHREYAS PAWAR</span>
                <span style="color:#7dd3fc;font-size:11px;letter-spacing:3px;display:block;margin-top:4px;font-family:Consolas,monospace;">PORTFOLIO — NEW MESSAGE</span>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 28px;">
                <p style="margin:0 0 18px;color:#ffffff;font-size:15px;line-height:1.6;">
                  A new message was sent from your portfolio contact form:
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="110" style="padding:10px 0;color:#8f8c99;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">Name</td>
                    <td style="padding:10px 0;color:#ffffff;font-size:14px;font-weight:600;">${escapeHtml(name)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#8f8c99;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">Email</td>
                    <td style="padding:10px 0;color:#7dd3fc;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#7dd3fc;text-decoration:none;">${escapeHtml(email)}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#8f8c99;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;vertical-align:top;">Message</td>
                    <td style="padding:10px 0;color:#d6d3e0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;border-top:1px solid rgba(255,255,255,0.08);padding-top:18px;">
                  <tr>
                    <td align="center">
                      <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`Re: ${name} — ${email}`)}"
                         style="display:inline-block;background:#ffd700;color:#0b0b0f;text-decoration:none;font-weight:700;font-size:13px;padding:11px 26px;border-radius:8px;letter-spacing:1px;">
                        REPLY TO ${escapeHtml(name)}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#0e0e14;border-top:1px solid rgba(255,255,255,0.06);padding:14px 28px;">
                <span style="color:#5a5766;font-size:11px;">shreyaspawar1011@gmail.com &nbsp;·&nbsp; github.com/ShreyasP10 &nbsp;·&nbsp; linkedin.com/in/shreyaspawar10</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [recipient],
          replyTo: email,
          subject: `New Portfolio Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
          html,
        }),
      });

      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: "Failed to deliver message" },
          { status: 502 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Email service unavailable" },
        { status: 502 }
      );
    }
  } else {
    console.log("[contact]", { name, email, message });
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
      `Portfolio message from ${name}`
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    return NextResponse.json({ success: true, mailto });
  }

  return NextResponse.json({ success: true, message: "Message sent" });
}
