"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  className = "",
}: ResponsiveModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Set mounted state for animations
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  const modalContent = (
    <div
      ref={modalRef}
      className={cn(
        "relative w-full bg-dark-secondary overflow-hidden shadow-xl transition-all",
        isMobile 
          ? "h-full max-h-screen m-0 rounded-none" 
          : `rounded-xl ${sizeClasses[size]} max-h-[90vh]`,
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-custom p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-400 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 -mr-2"
            aria-label="Close"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div 
        className="p-4 sm:p-6 overflow-y-auto" 
        style={{ maxHeight: isMobile ? 'calc(100vh - 120px)' : '70vh' }}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-0 bg-black/50 transition-opacity"></div>
      <div className={cn(
        "relative transform transition-all w-full",
        isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {modalContent}
      </div>
    </div>,
    document.body
  );
}
