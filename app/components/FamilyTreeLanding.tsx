"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  familyTreeNodes,
  ANIMATION_STEP_DELAY_MS,
  type AnimationStep,
  type FamilyTreeNode,
} from "../lib/family-tree-data";

/* ================================================================
   FamilyTreeLanding — Cinematic animated family tree intro
   ================================================================ */

interface FamilyTreeLandingProps {
  onEnter: () => void;
  onSkip: () => void;
}

export default function FamilyTreeLanding({ onEnter, onSkip }: FamilyTreeLandingProps) {
  const [step, setStep] = useState<AnimationStep>(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* ── Reduced motion detection ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── Animation sequencer ── */
  useEffect(() => {
    if (reducedMotion) {
      setStep(18);
      return;
    }
    if (step >= 18) return;

    const t = setTimeout(() => {
      setStep((s) => ((s + 1) as AnimationStep));
    }, ANIMATION_STEP_DELAY_MS);

    timeoutsRef.current.push(t);
    return () => clearTimeout(t);
  }, [step, reducedMotion]);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleImageError = useCallback((id: string) => {
    setImageErrors((prev) => new Set(prev).add(id));
  }, []);

  const showEnter = step >= 18 || reducedMotion;

  return (
    <section
      aria-label="Our family story"
      className="relative w-full overflow-hidden"
      style={{
        background: "#1a1512",
      }}
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep warm radial glow from center */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(185,138,59,0.15) 0%, transparent 60%)",
          }}
        />
        {/* Subtle beige warmth */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 70%, rgba(212,175,127,0.10) 0%, transparent 50%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(10,8,6,0.65) 100%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-cream/90">
            This is our family story
          </h1>
          <p className="mt-2 text-sm sm:text-base text-champagne/70 font-light tracking-wide">
            And this app is our home
          </p>
        </div>

        {/* Desktop Tree */}
        <div className="hidden sm:block w-full">
          <DesktopFamilyTree
            step={step}
            reducedMotion={reducedMotion}
            imageErrors={imageErrors}
            onImageError={handleImageError}
          />
        </div>

        {/* Mobile Timeline */}
        <div className="sm:hidden w-full">
          <MobileFamilyTimeline
            step={step}
            reducedMotion={reducedMotion}
            imageErrors={imageErrors}
            onImageError={handleImageError}
          />
        </div>

        {/* Buttons */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center gap-4">
          <button
            onClick={onSkip}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-cream/60 border border-cream/20 hover:text-cream/90 hover:border-cream/40 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-champagne/40 focus:ring-offset-2 focus:ring-offset-[#1a1512]"
          >
            Skip Intro
          </button>

          {showEnter && (
            <button
              onClick={onEnter}
              className="px-8 py-3 rounded-full text-sm font-semibold tracking-wide text-[#1a1512] bg-champagne hover:bg-champagne-light transition-colors duration-300 shadow-[0_0_20px_rgba(216,184,111,0.25)] focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 focus:ring-offset-[#1a1512] animate-fade-in-scale"
            >
              Enter Beitna
            </button>
          )}
        </div>
      </div>

      {/* ── Inline styles for this component ── */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes haloPulseStrong {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%      { opacity: 0.65; transform: scale(1.08); }
        }
        .card-appear {
          opacity: 0;
          animation: fadeInScale 0.6s ease-out forwards;
        }
        .gold-line {
          stroke: #D4AF37;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.5));
        }
        .gold-line.animate {
          animation: drawLine 0.8s ease-out forwards;
        }
        .halo-soft {
          animation: haloPulse 3s ease-in-out infinite;
        }
        .halo-strong {
          animation: haloPulseStrong 3s ease-in-out infinite;
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .card-appear,
          .gold-line,
          .gold-line.animate,
          .halo-soft,
          .halo-strong,
          .animate-fade-in-scale {
            animation: none;
            opacity: 1;
            stroke-dashoffset: 0;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

/* ================================================================
   DesktopFamilyTree
   ================================================================ */

function DesktopFamilyTree({
  step,
  reducedMotion,
  imageErrors,
  onImageError,
}: {
  step: AnimationStep;
  reducedMotion: boolean;
  imageErrors: Set<string>;
  onImageError: (id: string) => void;
}) {
  const n = familyTreeNodes;
  const visible = (s: AnimationStep) => reducedMotion || step >= s;
  const line = (s: AnimationStep) => (reducedMotion || step >= s ? "animate" : "");

  const cardW = 400; // px — wide photo frames
  const gap = 280;   // px — generous gap between cards
  const svgW = cardW * 2 + gap; // 1080
  const svgH = 180;  // taller connectors
  const vSvgH = 140; // vertical connector height

  return (
    <div className="flex flex-col items-center">
      {/* ── Row 1: Baba & Mama ── */}
      <div className="flex justify-center" style={{ gap: `${gap}px` }}>
        <FamilyNodeCard node={n.baba} visible={visible(1)} errored={imageErrors.has(n.baba.id)} onError={() => onImageError(n.baba.id)} />
        <FamilyNodeCard node={n.mama} visible={visible(3)} errored={imageErrors.has(n.mama.id)} onError={() => onImageError(n.mama.id)} />
      </div>

      {/* ── Top connector ── */}
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible">
        {/* Baba line: down then right */}
        <path d={`M ${cardW / 2} 0 L ${cardW / 2} ${svgH / 2} L ${svgW / 2} ${svgH / 2}`} className={`gold-line ${line(2)}`} />
        {/* Mama line: down then left */}
        <path d={`M ${cardW + gap + cardW / 2} 0 L ${cardW + gap + cardW / 2} ${svgH / 2} L ${svgW / 2} ${svgH / 2}`} className={`gold-line ${line(4)}`} />
        {/* Shared down */}
        <path d={`M ${svgW / 2} ${svgH / 2} L ${svgW / 2} ${svgH}`} className={`gold-line ${line(5)}`} />
      </svg>

      {/* ── Row 2: Wedding ── */}
      <div className="flex justify-center">
        <FamilyNodeCard node={n.wedding} visible={visible(6)} errored={imageErrors.has(n.wedding.id)} onError={() => onImageError(n.wedding.id)} isWedding />
      </div>

      {/* ── Branch connector ── */}
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible">
        {/* Down from wedding */}
        <path d={`M ${svgW / 2} 0 L ${svgW / 2} ${svgH * 0.35}`} className={`gold-line ${line(7)}`} />
        {/* Left to Sherien */}
        <path d={`M ${svgW / 2} ${svgH * 0.35} L ${cardW / 2} ${svgH * 0.35} L ${cardW / 2} ${svgH}`} className={`gold-line ${line(7)}`} />
        {/* Right to Ahmed */}
        <path d={`M ${svgW / 2} ${svgH * 0.35} L ${cardW + gap + cardW / 2} ${svgH * 0.35} L ${cardW + gap + cardW / 2} ${svgH}`} className={`gold-line ${line(11)}`} />
      </svg>

      {/* ── Row 3: Sherien 1994 & Ahmed 2002 ── */}
      <div className="flex justify-center" style={{ gap: `${gap}px` }}>
        <FamilyNodeCard node={n["sherien-1994"]} visible={visible(8)} errored={imageErrors.has("sherien-1994")} onError={() => onImageError("sherien-1994")} />
        <FamilyNodeCard node={n["ahmed-2002"]} visible={visible(12)} errored={imageErrors.has("ahmed-2002")} onError={() => onImageError("ahmed-2002")} />
      </div>

      {/* ── Vertical connectors ── */}
      <div className="flex justify-center" style={{ gap: `${gap}px` }}>
        <svg width={cardW} height={vSvgH} viewBox={`0 0 ${cardW} ${vSvgH}`} className="overflow-visible">
          <path d={`M ${cardW / 2} 0 L ${cardW / 2} ${vSvgH}`} className={`gold-line ${line(9)}`} />
        </svg>
        <svg width={cardW} height={vSvgH} viewBox={`0 0 ${cardW} ${vSvgH}`} className="overflow-visible">
          <path d={`M ${cardW / 2} 0 L ${cardW / 2} ${vSvgH}`} className={`gold-line ${line(13)}`} />
        </svg>
      </div>

      {/* ── Row 4: Sherien memory & Ahmed memory ── */}
      <div className="flex justify-center" style={{ gap: `${gap}px` }}>
        <FamilyNodeCard node={n["sherien-with-parents"]} visible={visible(10)} errored={imageErrors.has("sherien-with-parents")} onError={() => onImageError("sherien-with-parents")} />
        <FamilyNodeCard node={n["ahmed-with-parents"]} visible={visible(14)} errored={imageErrors.has("ahmed-with-parents")} onError={() => onImageError("ahmed-with-parents")} />
      </div>

      {/* ── Bottom connector ── */}
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible">
        {/* Left up then right */}
        <path d={`M ${cardW / 2} 0 L ${cardW / 2} ${svgH / 2} L ${svgW / 2} ${svgH / 2}`} className={`gold-line ${line(15)}`} />
        {/* Right up then left */}
        <path d={`M ${cardW + gap + cardW / 2} 0 L ${cardW + gap + cardW / 2} ${svgH / 2} L ${svgW / 2} ${svgH / 2}`} className={`gold-line ${line(16)}`} />
        {/* Final down */}
        <path d={`M ${svgW / 2} ${svgH / 2} L ${svgW / 2} ${svgH}`} className={`gold-line ${line(17)}`} />
      </svg>

      {/* ── Row 5: Final Family ── */}
      <div className="flex justify-center">
        <FamilyNodeCard node={n["family-four"]} visible={visible(18)} errored={imageErrors.has("family-four")} onError={() => onImageError("family-four")} isFinal />
      </div>
    </div>
  );
}

/* ================================================================
   MobileFamilyTimeline
   ================================================================ */

function MobileFamilyTimeline({
  step,
  reducedMotion,
  imageErrors,
  onImageError,
}: {
  step: AnimationStep;
  reducedMotion: boolean;
  imageErrors: Set<string>;
  onImageError: (id: string) => void;
}) {
  const n = familyTreeNodes;
  const visible = (s: AnimationStep) => reducedMotion || step >= s;
  const line = (s: AnimationStep) => (reducedMotion || step >= s ? "animate" : "");

  const nodesInOrder: { node: FamilyTreeNode; step: AnimationStep; lineStep?: AnimationStep; isWedding?: boolean; isFinal?: boolean }[] = [
    { node: n.baba, step: 1 },
    { node: n.mama, step: 3, lineStep: 2 },
    { node: n.wedding, step: 6, lineStep: 5, isWedding: true },
    { node: n["sherien-1994"], step: 8, lineStep: 7 },
    { node: n["sherien-with-parents"], step: 10, lineStep: 9 },
    { node: n["ahmed-2002"], step: 12, lineStep: 11 },
    { node: n["ahmed-with-parents"], step: 14, lineStep: 13 },
    { node: n["family-four"], step: 18, lineStep: 17, isFinal: true },
  ];

  return (
    <div className="flex flex-col items-center">
      {nodesInOrder.map((item, index) => (
        <div key={item.node.id} className="flex flex-col items-center">
          {/* Connector line above this card (except first) */}
          {index > 0 && item.lineStep && (
            <svg width={2} height={72} viewBox="0 0 2 72" className="overflow-visible">
              <path d="M 1 0 L 1 72" className={`gold-line ${line(item.lineStep)}`} />
            </svg>
          )}
          <FamilyNodeCard
            node={item.node}
            visible={visible(item.step)}
            errored={imageErrors.has(item.node.id)}
            onError={() => onImageError(item.node.id)}
            isWedding={item.isWedding}
            isFinal={item.isFinal}
            mobile
          />
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   FamilyNodeCard
   ================================================================ */

function FamilyNodeCard({
  node,
  visible,
  errored,
  onError,
  isWedding,
  isFinal,
  mobile,
}: {
  node: FamilyTreeNode;
  visible: boolean;
  errored: boolean;
  onError: () => void;
  isWedding?: boolean;
  isFinal?: boolean;
  mobile?: boolean;
}) {
  if (!visible) {
    return <div className={mobile ? "h-[420px]" : "h-[520px]"} aria-hidden="true" />;
  }

  const widthClass = mobile
    ? isFinal
      ? "w-[22rem]"
      : "w-80"
    : isFinal
      ? "w-[28rem]"
      : "w-[25rem]";

  const photoHeight = mobile
    ? isFinal
      ? "h-80"
      : "h-72"
    : isFinal
      ? "h-96"
      : "h-80";

  return (
    <div
      className={`relative ${widthClass} flex flex-col items-center card-appear`}
      style={{ animationDelay: "0ms" }}
    >
      {/* Halo behind photo */}
      {(isWedding || isFinal) && (
        <div
          className={`absolute rounded-full blur-2xl pointer-events-none ${isFinal ? "halo-strong" : "halo-soft"}`}
          style={{
            width: isFinal ? "150%" : "130%",
            height: isFinal ? "90%" : "80%",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Photo frame */}
      <div
        className={`relative w-full ${photoHeight} rounded-2xl overflow-hidden border border-champagne/30 shadow-[0_8px_30px_rgba(0,0,0,0.4)] bg-[#2a2018]`}
      >
        {errored ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-cream/40 gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-[10px] uppercase tracking-wider text-cream/30 text-center px-2 leading-tight">
              {node.src.split("/").pop()}
            </span>
          </div>
        ) : (
          <img
            src={node.src}
            alt={node.alt}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={onError}
          />
        )}

        {/* Warm overlay gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(26,21,18,0) 60%, rgba(26,21,18,0.35) 100%)",
          }}
        />
      </div>

      {/* Caption */}
      <div className="mt-3 text-center">
        <p className={`font-semibold text-cream/90 ${isFinal ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}>
          {node.caption}
        </p>
        <p className="text-sm sm:text-base text-champagne/60 mt-1 font-light">
          {node.subcaption}
        </p>
      </div>
    </div>
  );
}
