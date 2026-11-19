"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyMediaLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy URL to clipboard"
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3 text-slate-400" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
