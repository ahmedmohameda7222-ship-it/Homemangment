import type { ProfileId } from "./types";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

function fallbackKey(profileId: ProfileId) {
  return `beitna-expense-pin-${profileId}`;
}

export async function hasProfileExpensePin(profileId: ProfileId) {
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    const { data } = await client.from("profile_expense_pins").select("profile_id").eq("profile_id", profileId).maybeSingle();
    return Boolean(data);
  }
  return Boolean(localStorage.getItem(fallbackKey(profileId)));
}

export async function saveProfileExpensePin(profileId: ProfileId, value: string) {
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    const { error } = await client.from("profile_expense_pins").upsert({
      profile_id: profileId,
      pin_hash: value,
      pin_salt: "plain-v1",
      updated_at: new Date().toISOString(),
    }, { onConflict: "profile_id" });
    if (error) throw error;
    localStorage.removeItem(fallbackKey(profileId));
    return;
  }
  localStorage.setItem(fallbackKey(profileId), value);
}

export async function verifyProfileExpensePin(profileId: ProfileId, value: string) {
  if (isSupabaseConfigured()) {
    const client = getSupabaseClient();
    const { data } = await client.from("profile_expense_pins").select("pin_hash").eq("profile_id", profileId).maybeSingle();
    return Boolean(data && data.pin_hash === value);
  }
  return localStorage.getItem(fallbackKey(profileId)) === value;
}
