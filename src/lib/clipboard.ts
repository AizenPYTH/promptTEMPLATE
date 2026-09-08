"use client";

/** Clipboard write with a execCommand fallback for insecure contexts. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Trigger a client-side text download — no server round trip. */
export function downloadText(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ShareResult {
  method: "share" | "clipboard" | "failed";
}

export async function shareUrl(title: string, text: string, url: string): Promise<ShareResult> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title, text, url });
      return { method: "share" };
    } catch (error) {
      // AbortError means the user dismissed the sheet — not a failure to report.
      if (error instanceof DOMException && error.name === "AbortError") {
        return { method: "share" };
      }
    }
  }
  const copied = await copyText(url);
  return { method: copied ? "clipboard" : "failed" };
}
