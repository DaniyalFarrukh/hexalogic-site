import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: NextRequest) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const appUrl = process.env.APP_URL?.replace(/\/+$/, "");
  const callerId = process.env.TWILIO_PHONE_NUMBER;

  if (!authToken || !appUrl || !callerId) {
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const formData = await req.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      params[key] = value;
    }
  }

  const signature = req.headers.get("x-twilio-signature") ?? "";
  const webhookUrl = `${appUrl}/api/twilio/voice`;
  const isValid = twilio.validateRequest(authToken, signature, webhookUrl, params);

  if (!isValid) {
    return new NextResponse("Invalid Twilio signature", { status: 403 });
  }

  const to = (params.To ?? "").trim();
  // E.164 validation (restrict to /^\+1\d{10}$/ in prod if US/CA only)
  const isValidE164 = /^\+[1-9]\d{6,14}$/.test(to);

  const twiml = new twilio.twiml.VoiceResponse();
  if (!isValidE164) {
    twiml.say("Invalid destination number.");
    twiml.hangup();
  } else {
    const dial = twiml.dial({ callerId });
    dial.number(to);
  }

  return new NextResponse(twiml.toString(), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
