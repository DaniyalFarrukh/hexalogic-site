"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Call, Device } from "@twilio/voice-sdk";
import { COUNTRIES } from "@/lib/countries";
import CountrySelector from "./CountrySelector";
import styles from "./Dialer.module.css";

interface DialerProps {
  dialerKey: string;
}

type DialerStatus = "initializing" | "ready" | "connecting" | "in-call" | "error";

const DTMF_KEYS: { digit: string; sub: string }[] = [
  { digit: "1", sub: "" },
  { digit: "2", sub: "ABC" },
  { digit: "3", sub: "DEF" },
  { digit: "4", sub: "GHI" },
  { digit: "5", sub: "JKL" },
  { digit: "6", sub: "MNO" },
  { digit: "7", sub: "PQRS" },
  { digit: "8", sub: "TUV" },
  { digit: "9", sub: "WXYZ" },
  { digit: "*", sub: "" },
  { digit: "0", sub: "+" },
  { digit: "#", sub: "" },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function toE164(input: string, countryDialCode: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("+")) return `+${trimmed.slice(1).replace(/\D/g, "")}`;

  const digits = trimmed.replace(/\D/g, "").replace(/^0+/, "");
  const cleanCode = countryDialCode.replace(/\D/g, "");
  return `+${cleanCode}${digits}`;
}

export default function Dialer({ dialerKey }: DialerProps) {
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Call | null>(null);
  const phoneAnchorRef = useRef<HTMLDivElement | null>(null);

  const [countryIso, setCountryIso] = useState("US");
  const [callerIdMode, setCallerIdMode] = useState("public");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<DialerStatus>("initializing");
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchToken = useCallback(async (): Promise<string> => {
    const res = await fetch("/api/twilio/token", {
      method: "POST",
      headers: { "x-dialer-key": dialerKey },
    });
    if (!res.ok) {
      throw new Error(`Token request failed (${res.status})`);
    }
    const data = (await res.json()) as { token: string };
    return data.token;
  }, [dialerKey]);

  useEffect(() => {
    if (status !== "in-call") return;
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    let active = true;

    async function initDevice() {
      try {
        const token = await fetchToken();
        if (!active) return;

        const device = new Device(token, { logLevel: 1 });

        device.on("registered", () => {
          if (active) setStatus("ready");
        });

        device.on("error", (err) => {
          if (!active) return;
          setErrorMsg(`${err.code ? `[${err.code}] ` : ""}${err.message}`);
          setStatus("error");
        });

        device.on("tokenWillExpire", async () => {
          try {
            const newToken = await fetchToken();
            device.updateToken(newToken);
          } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Token refresh failed");
          }
        });

        await device.register();
        deviceRef.current = device;
        if (active) setStatus("ready");
      } catch (err) {
        if (!active) return;
        setErrorMsg(err instanceof Error ? err.message : "Failed to initialize dialer");
        setStatus("error");
      }
    }

    initDevice();

    return () => {
      active = false;
      callRef.current?.disconnect();
      deviceRef.current?.destroy();
    };
  }, [fetchToken]);

  const selectedCountry =
    COUNTRIES.find((c) => c.iso === countryIso) ?? COUNTRIES[0];

  async function handleCall() {
    if (!deviceRef.current || !phoneNumber.trim()) return;
    setErrorMsg(null);
    setStatus("connecting");

    try {
      const to = toE164(phoneNumber, selectedCountry.dialCode);
      const call = await deviceRef.current.connect({ params: { To: to } });
      callRef.current = call;

      call.on("accept", () => {
        setDuration(0);
        setStatus("in-call");
        setMuted(false);
      });

      call.on("disconnect", () => {
        callRef.current = null;
        setMuted(false);
        setDuration(0);
        setStatus("ready");
      });

      call.on("cancel", () => {
        callRef.current = null;
        setMuted(false);
        setDuration(0);
        setStatus("ready");
      });

      call.on("error", (err) => {
        setErrorMsg(`${err.code ? `[${err.code}] ` : ""}${err.message}`);
        callRef.current = null;
        setDuration(0);
        setStatus("ready");
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Call failed");
      setStatus("ready");
    }
  }

  function handleHangUp() {
    callRef.current?.disconnect();
  }

  function handleToggleMute() {
    if (!callRef.current) return;
    const next = !muted;
    callRef.current.mute(next);
    setMuted(next);
  }

  function handleKeyPress(digit: string) {
    if (callRef.current && status === "in-call") {
      callRef.current.sendDigits(digit);
    } else {
      setPhoneNumber((prev) => prev + digit);
    }
  }

  function handleDelete() {
    setPhoneNumber((prev) => prev.slice(0, -1));
  }

  const isCallActive = status === "connecting" || status === "in-call";

  return (
    <div className={styles.page}>
      <div className={styles.heroIntro}>
        <div className={styles.heroMeta}>
          <span className={styles.heroMetaDot} />
          <span>HEXALOGIC CLOUD COMMUNICATIONS</span>
        </div>
        <h1 className={styles.heroTitle}>
          Enterprise Voice <span className={styles.heroTitleAccent}>Dialer</span>
        </h1>
      </div>

      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.fieldGroup}>
            <label htmlFor="phone-input" className={styles.label}>
              Phone Number
            </label>
            <div ref={phoneAnchorRef} className={styles.phoneAnchor}>
              <div className={styles.phoneBox}>
                <CountrySelector
                  value={countryIso}
                  onChange={setCountryIso}
                  disabled={isCallActive}
                  containerRef={phoneAnchorRef}
                />
                <input
                  id="phone-input"
                  type="tel"
                  className={styles.phoneInput}
                  placeholder="Phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isCallActive && status === "ready" && phoneNumber.trim()) {
                      handleCall();
                    }
                  }}
                  disabled={isCallActive}
                />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="caller-id-select" className={styles.label}>
              Caller ID
            </label>
            <select
              id="caller-id-select"
              className={styles.selectField}
              value={callerIdMode}
              onChange={(e) => setCallerIdMode(e.target.value)}
              disabled={isCallActive}
            >
              <option value="public">Use public number</option>
            </select>
          </div>

          <div className={styles.keypad}>
            {DTMF_KEYS.map(({ digit, sub }) => (
              <button
                key={digit}
                type="button"
                className={styles.key}
                onClick={() => handleKeyPress(digit)}
              >
                <span className={styles.keyDigit}>{digit}</span>
                {sub && <span className={styles.keySub}>{sub}</span>}
              </button>
            ))}
          </div>

          <div className={styles.buttonStack}>
            {!isCallActive ? (
              <div className={styles.statusBar}>
                {status === "initializing" && "Connecting to voice service..."}
                {status === "ready" && "Ready to call"}
                {status === "error" && "Voice service offline"}
              </div>
            ) : (
              <button
                type="button"
                className={`${styles.secondaryBtn} ${muted ? styles.secondaryBtnActive : ""}`}
                onClick={handleToggleMute}
                disabled={status !== "in-call"}
              >
                {muted ? "Unmute" : "Mute"} · {formatDuration(duration)}
              </button>
            )}

            {!isCallActive ? (
              <button
                type="button"
                className={styles.callBtn}
                onClick={handleCall}
                disabled={status !== "ready" || !phoneNumber.trim()}
              >
                Call
              </button>
            ) : (
              <button
                type="button"
                className={styles.hangupBtn}
                onClick={handleHangUp}
              >
                End Call
              </button>
            )}

            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={isCallActive || phoneNumber.length === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
              <span>Delete</span>
            </button>
          </div>

          {errorMsg && (
            <div className={styles.errorBox} role="alert">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
