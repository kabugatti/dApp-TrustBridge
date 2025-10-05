"use client";

import React from "react";
import { TimeRange } from "@/helpers/chart.helper";
import { Clock } from "lucide-react";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
  disabled?: boolean;
}

const TIME_RANGE_OPTIONS: {
  value: TimeRange;
  label: string;
  description: string;
}[] = [
  { value: "24h", label: "24H", description: "Last 24 hours" },
  { value: "7d", label: "7D", description: "Last 7 days" },
  { value: "30d", label: "30D", description: "Last 30 days" },
  { value: "90d", label: "90D", description: "Last 90 days" },
];

export function TimeRangeSelector({
  value,
  onChange,
  className = "",
  disabled = false,
}: TimeRangeSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Clock className="h-4 w-4" />
        <span>Time Range:</span>
      </div>

      <div className="flex bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
        {TIME_RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className={`
              px-3 py-1.5 text-sm font-medium transition-all duration-200
              ${
                value === option.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-neutral-700"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
