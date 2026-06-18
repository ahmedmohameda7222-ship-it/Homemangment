"use client";

import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useLanguage } from "../context/LanguageContext";
import { getProfileTheme } from "../lib/profile-themes";
import type { ProfileId } from "../lib/types";

function pinKey(profileId: ProfileId) {
  return `beitna-private-pin-${profileId}`;
}

function unlockedKey(profileId: ProfileId) {
  return `beitna-private-unlocked-${profileId}`;
}

function encodePin(pin: string) {
  return `pin:${btoa(pin)}`;
}

export default function PinGate({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const { selectedProfile } = useProfile();
  const { t } = useLanguage();
  const theme = getProfileTheme(selectedProfile);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [hasPin, setHasPin] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedProfile || typeof window === "undefined") return;
    setHasPin(Boolean(localStorage.getItem(pinKey(selectedProfile))));
    setUnlocked(sessionStorage.getItem(unlockedKey(selectedProfile)) === "1");
    setPin("");
    setConfirmPin("");
    setError("");
  }, [selectedProfile]);

  if (!selectedProfile) return null;
  if (unlocked) return <>{children}</>;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (pin.length < 4) {
      setError("PIN must be at least 4 digits.");
      return;
    }

    if (!hasPin) {
      if (pin !== confirmPin) {
        setError("PIN confirmation does not match.");
        return;
      }
      localStorage.setItem(pinKey(selectedProfile), encodePin(pin));
      sessionStorage.setItem(unlockedKey(selectedProfile), "1");
      setHasPin(true);
      setUnlocked(true);
      return;
    }

    const savedPin = localStorage.getItem(pinKey(selectedProfile));
    if (savedPin !== encodePin(pin)) {
      setError("Wrong PIN.");
      return;
    }

    sessionStorage.setItem(unlockedKey(selectedProfile), "1");
    setUnlocked(true);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-[1.75rem] bg-cream border p-6 shadow-[0_20px_50px_rgba(26,26,46,0.10)]" style={{ borderColor: theme.primary + "24" }}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: theme.soft, color: theme.primary }}>
          {hasPin ? <Lock size={26} /> : <ShieldCheck size={26} />}
        </div>
        <h2 className="text-center text-xl font-bold" style={{ color: theme.textAccent }}>{t(title)}</h2>
        {subtitle && <p className="mt-2 text-center text-sm text-navy-muted leading-relaxed">{t(subtitle)}</p>}

        <div className="mt-6 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy-muted">
              {hasPin ? t("Enter PIN") : t("Create PIN")}
            </label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 8))}
              className="w-full rounded-xl border bg-cream px-4 py-3 text-center text-xl font-bold tracking-[0.35em] text-navy outline-none profile-focus"
              style={{ borderColor: theme.primary + "28" }}
              autoComplete="off"
              required
            />
          </div>

          {!hasPin && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy-muted">{t("Confirm PIN")}</label>
              <input
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 8))}
                className="w-full rounded-xl border bg-cream px-4 py-3 text-center text-xl font-bold tracking-[0.35em] text-navy outline-none profile-focus"
                style={{ borderColor: theme.primary + "28" }}
                autoComplete="off"
                required
              />
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-center text-xs font-semibold text-rose">{t(error)}</p>}

        <button type="submit" className="mt-5 w-full rounded-xl py-3.5 font-semibold text-cream transition-opacity hover:opacity-90 profile-focus" style={{ backgroundColor: theme.primary }}>
          {hasPin ? t("Unlock") : t("Save PIN")}
        </button>
      </form>
    </div>
  );
}
