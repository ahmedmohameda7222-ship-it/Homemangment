"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { getProfileTheme } from "../lib/profile-themes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md" }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const { selectedProfile } = useProfile();
  const theme = getProfileTheme(selectedProfile);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-navy/30 backdrop-blur-sm" />
      <div
        className={`relative w-full ${maxWidth} bg-cream rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${isClosing ? "translate-y-full sm:translate-y-4 opacity-0" : "translate-y-0 sm:translate-y-0 opacity-100"} transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-cream z-10 px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: theme.primary + "22" }}>
          <h2 className="text-lg font-semibold" style={{ color: theme.textAccent }}>{title}</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors profile-focus"
            style={{ backgroundColor: theme.soft, color: theme.primary }}
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
