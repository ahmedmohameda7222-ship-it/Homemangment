"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FamilyTreeLanding from "./components/FamilyTreeLanding";
import { PROFILE_SWITCH_REDIRECT_KEY, useProfile } from "./context/ProfileContext";

export default function HomePage() {
  const { selectedProfile, initialized } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (typeof window !== "undefined" && sessionStorage.getItem(PROFILE_SWITCH_REDIRECT_KEY) === "1") {
      sessionStorage.setItem(PROFILE_SWITCH_REDIRECT_KEY, "0");
      router.replace("/profiles");
      return;
    }

    if (selectedProfile) {
      router.push("/dashboard");
    }
  }, [initialized, selectedProfile, router]);

  const goToProfiles = () => {
    router.push("/profiles");
  };

  if (!initialized) {
    return (
      <div className="min-h-full bg-linen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-olive border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-full bg-[#1a1512]">
      <FamilyTreeLanding onEnter={goToProfiles} onSkip={goToProfiles} />
    </main>
  );
}
