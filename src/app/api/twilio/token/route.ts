import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const { AccessToken } = twilio.jwt;
const { VoiceGrant } = AccessToken;

export async function POST(req: NextRequest) {
  const expectedKey = process.env.DIALER_ACCESS_KEY;
  const providedKey = req.headers.get("x-dialer-key");

  if (!expectedKey || providedKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

  if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
    return NextResponse.json(
      { error: "Missing Twilio environment configuration" },
      { status: 500 }
    );
  }

  const identity = "browser-dialer-user";
  const token = new AccessToken(accountSid, apiKey, apiSecret, {
    identity,
    ttl: 3600,
  });

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: false,
  });
  token.addGrant(voiceGrant);

  return NextResponse.json({ token: token.toJwt() });
}
