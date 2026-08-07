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
          subject: `Portfolio message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
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
