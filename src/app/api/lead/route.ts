import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  service?: string;
  meetingTime?: string;
  source?: string;
  botcheck?: boolean;
};

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in. Pretend success so bots don't retry.
  if (body.botcheck) {
    return NextResponse.json({ success: true });
  }

  const { name, email, phone, message, service, meetingTime, source } = body;
  if (!name || !email) {
    return NextResponse.json(
      { success: false, error: "Name and email are required." },
      { status: 400 }
    );
  }

  const crmUrl = process.env.CRM_LEAD_API_URL;
  if (!crmUrl) {
    console.error("CRM_LEAD_API_URL is not configured — lead was not forwarded.");
    return NextResponse.json(
      { success: false, error: "Lead intake is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const crmResponse = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CRM_LEAD_API_KEY
          ? { Authorization: `Bearer ${process.env.CRM_LEAD_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || null,
        message: message || null,
        service: service || null,
        meetingTime: meetingTime || null,
        source: source || "website-popup",
      }),
    });

    if (!crmResponse.ok) {
      const detail = await crmResponse.text().catch(() => "");
      console.error("CRM lead intake rejected the submission:", crmResponse.status, detail);
      return NextResponse.json(
        { success: false, error: "The CRM rejected this submission." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to reach CRM lead intake endpoint:", err);
    return NextResponse.json(
      { success: false, error: "Could not reach the CRM right now." },
      { status: 502 }
    );
  }
}
