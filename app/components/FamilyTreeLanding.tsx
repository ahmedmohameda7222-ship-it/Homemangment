"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  familyTreeNodes,
  type FamilyTreeNode,
  type FamilyTreeNodeId,
  type FamilyTreeNodeSize,
} from "../lib/family-tree-data";

type ConnectorPath = {
  id: string;
  path: string;
  delay: number;
  duration: number;
};

interface FamilyTreeLandingProps {
  onEnter: () => void;
}

const nodeRevealDelay: Record<FamilyTreeNodeId, number> = {
  father: 0.35,
  mother: 2.65,
  wedding: 6.05,
  sherien1994: 8.7,
  sherienParents: 10.75,
  ahmed2002: 13.2,
  ahmedParents: 15.3,
  familyFour: 19,
};

const connectorPaths: ConnectorPath[] = [
  { id: "father-to-center", path: "M245 325 V365 H600", delay: 1.15, duration: 1.25 },
  { id: "mother-to-center", path: "M955 325 V365 H600", delay: 3.55, duration: 1.25 },
  { id: "center-to-wedding", path: "M600 365 V430", delay: 5, duration: 0.9 },
  { id: "wedding-to-sherien", path: "M600 650 V690 H300 V730", delay: 7, duration: 1.55 },
  { id: "sherien-to-memory", path: "M300 940 V1010", delay: 9.55, duration: 0.95 },
  { id: "wedding-to-ahmed", path: "M600 650 V690 H900 V730", delay: 11.55, duration: 1.55 },
  { id: "ahmed-to-memory", path: "M900 940 V1010", delay: 14.05, duration: 0.95 },
  { id: "left-memory-to-lower-center", path: "M290 1220 V1245 H600", delay: 16.1, duration: 1.35 },
  { id: "right-memory-to-lower-center", path: "M910 1220 V1245 H600", delay: 16.1, duration: 1.35 },
  { id: "lower-center-to-family", path: "M600 1245 V1260", delay: 17.7, duration: 0.8 },
];

const mobileConnectorDelays = [1.15, 3.55, 7, 9.55, 11.55, 14.05, 17.7];
const introCompleteMs = 20200;

export default function FamilyTreeLanding({ onEnter }: FamilyTreeLandingProps) {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setIntroComplete(true);
      return;
    }

    const timeout = window.setTimeout(() => setIntroComplete(true), introCompleteMs);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section
      aria-labelledby="family-tree-title"
      className="relative isolate overflow-hidden bg-[#130D0A] text-cream"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,0.24),transparent_28%),radial-gradient(circle_at_50%_82%,rgba(212,175,55,0.20),transparent_26%),linear-gradient(145deg,#100B09_0%,#241712_42%,#111015_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,239,198,0.10),transparent_22%),radial-gradient(circle_at_82%_52%,rgba(185,138,59,0.14),transparent_30%)]" />
      <div className="absolute inset-0 -z-10 shadow-[inset_0_0_130px_rgba(0,0,0,0.84)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#D4AF37]/85">
              Beitna Manager
            </p>
            <h1 id="family-tree-title" className="mt-2 max-w-xl text-3xl font-bold tracking-tight text-[#FFF8EA] sm:text-5xl">
              Our family story
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#E8D9B9]/78 sm:text-base">
              A warm golden line through the memories that built our home.
            </p>
          </div>

          <button
            type="button"
            onClick={onEnter}
            className="shrink-0 rounded-full border border-[#D4AF37]/35 bg-white/8 px-4 py-2 text-xs font-semibold text-[#FFF8EA] shadow-[0_10px_35px_rgba(0,0,0,0.28)] backdrop-blur transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70"
          >
            Skip Intro
          </button>
        </div>

        <div className="mt-8 hidden flex-1 md:block">
          <DesktopFamilyTree />
        </div>

        <div className="mt-8 md:hidden">
          <MobileFamilyTimeline />
        </div>

        <div
          className="family-enter-cta pointer-events-none sticky bottom-5 z-30 mt-8 flex justify-center"
          data-ready={introComplete ? "true" : "false"}
        >
          <button
            type="button"
            onClick={onEnter}
            className="pointer-events-auto rounded-full border border-[#E9C760]/55 bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#20130B] shadow-[0_18px_50px_rgba(212,175,55,0.32)] transition hover:bg-[#E9C760] focus:outline-none focus:ring-2 focus:ring-[#FFF3C4]"
          >
            Enter Beitna
          </button>
        </div>
      </div>

      <style jsx global>{`
        .family-tree-node {
          opacity: 0;
          transform: translate3d(0, 14px, 0) scale(0.96);
          animation: familyNodeReveal 780ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--node-delay);
        }

        .family-tree-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: familyLineDraw var(--line-duration) ease-in-out forwards;
          animation-delay: var(--line-delay);
        }

        .family-mobile-line {
          transform-origin: top;
          transform: scaleY(0);
          animation: familyMobileLineDraw 900ms ease-in-out forwards;
          animation-delay: var(--line-delay);
        }

        .family-enter-cta {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 520ms ease, transform 520ms ease;
        }

        .family-enter-cta[data-ready="true"] {
          opacity: 1;
          transform: translateY(0);
        }

        .family-final-halo::before,
        .family-wedding-halo::before {
          content: "";
          position: absolute;
          inset: -22px;
          z-index: -1;
          border-radius: 2rem;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.34), transparent 68%);
          filter: blur(10px);
        }

        .family-final-halo::before {
          inset: -34px;
          background: radial-gradient(circle, rgba(255, 225, 141, 0.42), rgba(212, 175, 55, 0.16) 42%, transparent 72%);
        }

        @keyframes familyNodeReveal {
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes familyLineDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes familyMobileLineDraw {
          to {
            transform: scaleY(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .family-tree-node {
            opacity: 1;
            transform: none;
            animation: none;
          }

          .family-tree-line {
            stroke-dashoffset: 0;
            animation: none;
          }

          .family-mobile-line {
            transform: none;
            animation: none;
          }

          .family-enter-cta {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

function DesktopFamilyTree() {
  return (
    <div className="relative mx-auto aspect-[1200/1500] w-full max-w-5xl">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1200 1500"
        role="img"
        aria-label="Animated gold family tree connector lines"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="goldGlow" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF1B8" />
            <stop offset="36%" stopColor="#D4AF37" />
            <stop offset="72%" stopColor="#C9A24A" />
            <stop offset="100%" stopColor="#B98A3B" />
          </linearGradient>
        </defs>

        {connectorPaths.map((connector) => (
          <path
            key={connector.id}
            d={connector.path}
            pathLength={100}
            fill="none"
            stroke="url(#goldStroke)"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            filter="url(#goldGlow)"
            className="family-tree-line"
            style={
              {
                "--line-delay": `${connector.delay}s`,
                "--line-duration": `${connector.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </svg>

      {familyTreeNodes.map((node) => (
        <div
          key={node.id}
          className={`family-tree-node absolute ${node.id === "familyFour" ? "family-final-halo" : ""} ${node.id === "wedding" ? "family-wedding-halo" : ""}`}
          style={getDesktopNodeStyle(node)}
        >
          <FamilyPhotoCard node={node} />
        </div>
      ))}
    </div>
  );
}

function MobileFamilyTimeline() {
  return (
    <div className="mx-auto max-w-sm pb-8">
      <div className="space-y-0">
        {familyTreeNodes.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center">
            <div
              className={`family-tree-node ${node.id === "familyFour" ? "family-final-halo" : ""} ${node.id === "wedding" ? "family-wedding-halo" : ""}`}
              style={getMobileNodeStyle(node)}
            >
              <FamilyPhotoCard node={node} compact />
            </div>

            {index < familyTreeNodes.length - 1 && (
              <div
                className="family-mobile-line h-16 w-[2px] bg-gradient-to-b from-[#FFF1B8] via-[#D4AF37] to-[#B98A3B] shadow-[0_0_18px_rgba(212,175,55,0.72)]"
                style={
                  {
                    "--line-delay": `${mobileConnectorDelays[index]}s`,
                  } as CSSProperties
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FamilyPhotoCard({ node, compact = false }: { node: FamilyTreeNode; compact?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const sizeClass = getSizeClass(node.size, compact);

  return (
    <article className={`relative ${sizeClass} overflow-hidden rounded-[1.35rem] border border-[#D4AF37]/42 bg-[#FFF8EA]/88 p-2 text-[#20130B] shadow-[0_22px_60px_rgba(0,0,0,0.34)] backdrop-blur-sm`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[#21150F]/90">
        {!imageFailed ? (
          <img
            src={node.src}
            alt={node.alt}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
            loading={node.id === "father" || node.id === "mother" ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.18),transparent_40%),linear-gradient(145deg,#2A1A11,#110B08)] px-3 text-center text-[#F7E8BF]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Missing image</span>
            <span className="break-all text-[11px] leading-4 text-[#F7E8BF]/75">{node.filePath}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
      </div>

      <div className="px-1.5 pb-1.5 pt-3 text-center">
        <h2 className={`${node.size === "final" ? "text-lg" : "text-sm"} font-bold tracking-tight text-[#1D120C]`}>
          {node.caption}
        </h2>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.18em] text-[#9B7130]">
          {node.subcaption}
        </p>
      </div>
    </article>
  );
}

function getDesktopNodeStyle(node: FamilyTreeNode): CSSProperties {
  return {
    left: `${(node.desktop.x / 1200) * 100}%`,
    top: `${(node.desktop.y / 1500) * 100}%`,
    "--node-delay": `${nodeRevealDelay[node.id]}s`,
  } as CSSProperties;
}

function getMobileNodeStyle(node: FamilyTreeNode): CSSProperties {
  return {
    "--node-delay": `${nodeRevealDelay[node.id]}s`,
  } as CSSProperties;
}

function getSizeClass(size: FamilyTreeNodeSize, compact: boolean) {
  if (compact) {
    if (size === "final") return "w-[16rem] max-w-[88vw]";
    if (size === "wide") return "w-[14rem] max-w-[82vw]";
    return "w-[12.5rem] max-w-[78vw]";
  }

  if (size === "final") return "w-72";
  if (size === "wide") return "w-56";
  return "w-48";
}
