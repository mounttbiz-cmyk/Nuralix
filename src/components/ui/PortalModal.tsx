"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backdropClassName?: string;
}

export function PortalModal({
  isOpen,
  onClose,
  children,
  backdropClassName,
}: PortalModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle Escape key
  useEscapeKey(onClose, isOpen);

  if (!isOpen || !mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={
        backdropClassName ||
        "fixed inset-0 m-0 z-[9999] bg-slate-950/75 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      }
      style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  );
}
