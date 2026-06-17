"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings, Trash2, AlertTriangle, Home, Users, Info, LogOut, ChevronRight, Pin, Palette, FileDown, Moon,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import Header from "../components/Header";
import Modal from "../components/Modal";
import BottomNav from "../components/BottomNav";
import { getProfileById } from "../lib/constants";

export default function SettingsPage() {
  const { selectedProfile, clearProfile } = useProfile();
  const router = useRouter();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  const profile = getProfileById(selectedProfile);

  const handleClearData = () => {
    localStorage.removeItem("beitna-data");
    localStorage.removeItem("beitna-profile");
    window.location.reload();
  };

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header title="Settings" showBack={false} />

      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        {/* Current Profile */}
        <section className="bg-cream rounded-2xl border border-warm-gray/60 p-5">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-cream"
              style={{ backgroundColor: profile?.color || "#6B6B80" }}
            >
              {profile?.name[0]}
            </div>
            <div>
              <p className="text-base font-semibold text-navy">{profile?.name}</p>
              <p className="text-sm text-navy-muted">{profile?.nickname} · {profile?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearProfile();
              router.push("/");
            }}
            className="mt-4 w-full py-3 rounded-xl bg-olive/10 text-olive font-medium hover:bg-olive/20 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Switch to Another Profile
          </button>
        </section>

        {/* App Info */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">App Info</h2>
          <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-olive/15 flex items-center justify-center">
                <Home size={18} className="text-olive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">Beitna Manager</p>
                <p className="text-xs text-navy-muted">Your family home, organized.</p>
              </div>
            </div>
            <div className="pt-3 border-t border-warm-gray/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-muted">Version</span>
                <span className="text-sm text-navy font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-muted">Data Storage</span>
                <span className="text-sm text-navy font-medium">Local Browser</span>
              </div>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Data Management</h2>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center gap-3 p-4 bg-cream rounded-2xl border border-rose/30 text-left hover:bg-rose/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-rose/15 flex items-center justify-center">
              <Trash2 size={18} className="text-rose" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose">Clear All Data</p>
              <p className="text-xs text-navy-muted">Remove all expenses, bills, tasks, and repairs</p>
            </div>
            <ChevronRight size={18} className="text-rose shrink-0" />
          </button>
        </section>

        {/* Coming Soon */}
        <section>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">Coming Soon</h2>
          <div className="bg-cream rounded-2xl border border-warm-gray/60 p-4 space-y-3">
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-warm-gray flex items-center justify-center">
                <Pin size={18} className="text-navy-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy">PIN per Profile</p>
                <p className="text-xs text-navy-muted">Extra security for each family member</p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-warm-gray flex items-center justify-center">
                <Palette size={18} className="text-navy-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy">Theme Preferences</p>
                <p className="text-xs text-navy-muted">Customize colors per profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-warm-gray flex items-center justify-center">
                <FileDown size={18} className="text-navy-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy">Export Data</p>
                <p className="text-xs text-navy-muted">Download your data as JSON</p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-warm-gray flex items-center justify-center">
                <Moon size={18} className="text-navy-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy">Dark Mode</p>
                <p className="text-xs text-navy-muted">Comfortable viewing at night</p>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="pb-6">
          <div className="text-center">
            <p className="text-xs text-navy-muted">
              Beitna Manager v1.0.0
            </p>
            <p className="text-xs text-navy-muted mt-1">
              Built for one family. No sign-ups, no SaaS, no tracking.
            </p>
            <p className="text-xs text-navy-muted mt-1">
              Just your home, organized.
            </p>
          </div>
        </section>
      </div>

      <BottomNav />

      {/* Clear Data Confirm */}
      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear All Data?">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose/15 flex items-center justify-center">
            <AlertTriangle size={20} className="text-rose" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">This cannot be undone</p>
            <p className="text-xs text-navy-muted">All expenses, bills, tasks, repairs, and items will be deleted.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowClearConfirm(false)}
            className="flex-1 py-3 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleClearData}
            className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors"
          >
            Clear Everything
          </button>
        </div>
      </Modal>
    </div>
  );
}
