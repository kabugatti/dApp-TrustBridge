"use client";

import * as React from "react";

interface IllustrationProps {
  className?: string;
}

export function PoolsIllustration({ className }: IllustrationProps) {
  return (
    <svg 
      width="200" 
      height="160" 
      viewBox="0 0 200 160" 
      className={cn("text-muted-foreground w-full", className)}
      fill="none"
    >
      <defs>
        <linearGradient id="poolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Pool container */}
      <ellipse 
        cx="100" 
        cy="120" 
        rx="80" 
        ry="20" 
        fill="url(#poolGradient)" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />

      {/* Coins/tokens floating above */}
      <circle 
        cx="70" 
        cy="60" 
        r="15" 
        fill="url(#coinGradient)" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />
      <circle 
        cx="130" 
        cy="40" 
        r="12" 
        fill="url(#coinGradient)" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />
      <circle 
        cx="100" 
        cy="80" 
        r="18" 
        fill="url(#coinGradient)" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />

      {/* Ripple effects */}
      <ellipse 
        cx="100" 
        cy="120" 
        rx="60" 
        ry="15" 
        fill="none" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="2"
      />
      <ellipse 
        cx="100" 
        cy="120" 
        rx="40" 
        ry="10" 
        fill="none" 
        stroke="currentColor" 
        strokeOpacity="0.15" 
        strokeWidth="1"
      />

      {/* Connection lines */}
      <path 
        d="M70 75 Q85 90 100 100" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1" 
        fill="none"
        strokeDasharray="2,2"
      />
      <path 
        d="M130 55 Q115 70 100 100" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1" 
        fill="none"
        strokeDasharray="2,2"
      />
      <path 
        d="M100 98 Q100 105 100 110" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1" 
        fill="none"
        strokeDasharray="2,2"
      />
    </svg>
  );
}

export function WalletIllustration({ className }: IllustrationProps) {
  return (
    <svg 
      width="200" 
      height="160" 
      viewBox="0 0 200 160" 
      className={cn("text-muted-foreground w-full", className)}
      fill="none"
    >
      {/* Wallet body */}
      <rect 
        x="40" 
        y="60" 
        width="120" 
        height="80" 
        rx="8" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="2"
      />

      {/* Wallet flap */}
      <rect 
        x="40" 
        y="50" 
        width="120" 
        height="20" 
        rx="8" 
        fill="currentColor" 
        fillOpacity="0.2" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="2"
      />

      {/* Wallet details */}
      <rect 
        x="60" 
        y="70" 
        width="80" 
        height="4" 
        rx="2" 
        fill="currentColor" 
        fillOpacity="0.3"
      />
      <rect 
        x="60" 
        y="80" 
        width="60" 
        height="4" 
        rx="2" 
        fill="currentColor" 
        fillOpacity="0.2"
      />
      <rect 
        x="60" 
        y="90" 
        width="40" 
        height="4" 
        rx="2" 
        fill="currentColor" 
        fillOpacity="0.2"
      />

      {/* Connection indicator */}
      <circle 
        cx="180" 
        cy="100" 
        r="3" 
        fill="currentColor" 
        fillOpacity="0.6"
      />
      <circle 
        cx="170" 
        cy="100" 
        r="2" 
        fill="currentColor" 
        fillOpacity="0.4"
      />
      <circle 
        cx="162" 
        cy="100" 
        r="1" 
        fill="currentColor" 
        fillOpacity="0.2"
      />

      {/* Connection line */}
      <path 
        d="M160 100 Q170 100 180 100" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1" 
        fill="none"
        strokeDasharray="2,2"
      />
    </svg>
  );
}

export function PositionsIllustration({ className }: IllustrationProps) {
  return (
    <svg 
      width="200" 
      height="160" 
      viewBox="0 0 200 160" 
      className={cn("text-muted-foreground w-full", className)}
      fill="none"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Chart background */}
      <rect 
        x="30" 
        y="40" 
        width="140" 
        height="80" 
        rx="4" 
        fill="url(#chartGradient)" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />

      {/* Chart bars (empty state) */}
      <rect 
        x="50" 
        y="100" 
        width="20" 
        height="10" 
        rx="2" 
        fill="currentColor" 
        fillOpacity="0.1"
      />
      <rect 
        x="80" 
        y="100" 
        width="20" 
        height="10" 
        rx="2" 
        fill="currentColor" 
        fillOpacity="0.1"
      />
      <rect 
        x="110" 
        y="100" 
        width="20" 
        height="10" 
        rx="2" 
        fill="currentColor" 
        fillOpacity="0.1"
      />
      <rect 
        x="140" 
        y="100" 
        width="20" 
        height="10" 
        rx="2" 
        fill="currentColor" 
        fillOpacity="0.1"
      />

      {/* Chart axes */}
      <line 
        x1="30" 
        y1="120" 
        x2="170" 
        y2="120" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />
      <line 
        x1="30" 
        y1="40" 
        x2="30" 
        y2="120" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />

      {/* Plus icon */}
      <circle 
        cx="100" 
        cy="60" 
        r="8" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />
      <line 
        x1="100" 
        y1="56" 
        x2="100" 
        y2="64" 
        stroke="currentColor" 
        strokeOpacity="0.4" 
        strokeWidth="2"
      />
      <line 
        x1="96" 
        y1="60" 
        x2="104" 
        y2="60" 
        stroke="currentColor" 
        strokeOpacity="0.4" 
        strokeWidth="2"
      />
    </svg>
  );
}

export function ActivityIllustration({ className }: IllustrationProps) {
  return (
    <svg 
      width="200" 
      height="160" 
      viewBox="0 0 200 160" 
      className={cn("text-muted-foreground w-full", className)}
      fill="none"
    >
      {/* Activity timeline */}
      <line 
        x1="100" 
        y1="20" 
        x2="100" 
        y2="140" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="2"
      />

      {/* Activity nodes (empty) */}
      <circle 
        cx="100" 
        cy="40" 
        r="6" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />
      <circle 
        cx="100" 
        cy="80" 
        r="6" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />
      <circle 
        cx="100" 
        cy="120" 
        r="6" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />

      {/* Activity cards (empty) */}
      <rect 
        x="40" 
        y="30" 
        width="100" 
        height="20" 
        rx="4" 
        fill="currentColor" 
        fillOpacity="0.05" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />
      <rect 
        x="40" 
        y="70" 
        width="100" 
        height="20" 
        rx="4" 
        fill="currentColor" 
        fillOpacity="0.05" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />
      <rect 
        x="40" 
        y="110" 
        width="100" 
        height="20" 
        rx="4" 
        fill="currentColor" 
        fillOpacity="0.05" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />

      {/* Clock icon */}
      <circle 
        cx="100" 
        cy="60" 
        r="12" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />
      <line 
        x1="100" 
        y1="60" 
        x2="100" 
        y2="55" 
        stroke="currentColor" 
        strokeOpacity="0.4" 
        strokeWidth="2"
      />
      <line 
        x1="100" 
        y1="60" 
        x2="105" 
        y2="60" 
        stroke="currentColor" 
        strokeOpacity="0.4" 
        strokeWidth="1"
      />
    </svg>
  );
}

export function SearchIllustration({ className }: IllustrationProps) {
  return (
    <svg 
      width="200" 
      height="160" 
      viewBox="0 0 200 160" 
      className={cn("text-muted-foreground w-full", className)}
      fill="none"
    >
      {/* Search magnifying glass */}
      <circle 
        cx="80" 
        cy="80" 
        r="25" 
        fill="none" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="3"
      />
      <line 
        x1="100" 
        y1="100" 
        x2="120" 
        y2="120" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Search results (empty) */}
      <rect 
        x="40" 
        y="40" 
        width="120" 
        height="20" 
        rx="4" 
        fill="currentColor" 
        fillOpacity="0.05" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />
      <rect 
        x="40" 
        y="70" 
        width="100" 
        height="20" 
        rx="4" 
        fill="currentColor" 
        fillOpacity="0.05" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />
      <rect 
        x="40" 
        y="100" 
        width="80" 
        height="20" 
        rx="4" 
        fill="currentColor" 
        fillOpacity="0.05" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />

      {/* Question mark */}
      <circle 
        cx="100" 
        cy="60" 
        r="8" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="1"
      />
      <text 
        x="100" 
        y="65" 
        textAnchor="middle" 
        fontSize="12" 
        fill="currentColor" 
        fillOpacity="0.4"
      >
        ?
      </text>
    </svg>
  );
}

export function ErrorIllustration({ className }: IllustrationProps) {
  return (
    <svg 
      width="200" 
      height="160" 
      viewBox="0 0 200 160" 
      className={cn("text-muted-foreground w-full", className)}
      fill="none"
    >
      {/* Warning triangle */}
      <path 
        d="M100 20 L160 120 L40 120 Z" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeOpacity="0.3" 
        strokeWidth="2"
      />

      {/* Exclamation mark */}
      <line 
        x1="100" 
        y1="60" 
        x2="100" 
        y2="90" 
        stroke="currentColor" 
        strokeOpacity="0.4" 
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle 
        cx="100" 
        cy="100" 
        r="3" 
        fill="currentColor" 
        fillOpacity="0.4"
      />

      {/* Error details */}
      <rect 
        x="50" 
        y="130" 
        width="100" 
        height="20" 
        rx="4" 
        fill="currentColor" 
        fillOpacity="0.05" 
        stroke="currentColor" 
        strokeOpacity="0.2" 
        strokeWidth="1"
      />
    </svg>
  );
}

// Helper function for className concatenation
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
