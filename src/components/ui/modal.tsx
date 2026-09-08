"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full" | "screen";
  /** Hide the visible header — the title stays available to screen readers. */
  bare?: boolean;
  /** Replace the default header entirely (it must include its own close control). */
  header?: React.ReactNode;
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-3xl",
  full: "max-w-[min(1400px,95vw)]",
  screen: "max-w-none",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  bare = false,
  header,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown, true);
    const focusTimer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panelRef.current)?.focus();
    }, 20);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown, true);
      window.clearTimeout(focusTimer);
      restoreFocus.current?.focus?.();
    };
  }, [open, onKeyDown]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[70] flex justify-center",
        size === "screen" ? "items-stretch p-0" : "items-end p-0 sm:items-center sm:p-6",
      )}
    >
      <div
        className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-describedby={description ? "modal-description" : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex w-full flex-col overflow-hidden border-line bg-surface shadow-float animate-scale-in",
          size === "screen"
            ? "h-full max-h-none rounded-none border-0"
            : "max-h-[92vh] rounded-t-xl border sm:rounded-xl",
          sizes[size],
        )}
      >
        {header ? (
          header
        ) : bare ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 rounded-md border border-line bg-surface/90 p-1.5 text-muted backdrop-blur transition-colors hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : (
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-[15px] font-semibold">{title}</h2>
              {description ? (
                <p id="modal-description" className="mt-1 text-[13px] leading-5 text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-m-1.5 rounded-md p-1.5 text-faint transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          </header>
        )}
        <div
          className={cn(
            "min-h-0 flex-1",
            size === "screen" ? "overflow-hidden" : "overflow-y-auto scrollbar-slim",
          )}
        >
          {children}
        </div>
        {footer ? <footer className="border-t border-line px-5 py-3.5">{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}
