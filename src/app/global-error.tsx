"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error digest without disclosing stack or internal messages to visitors
    if (error.digest) {
      console.error(`[Notice] Fatal layout error (Ref: ${error.digest})`);
    } else {
      console.error("[Notice] Fatal layout error occurred");
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#0A1F44", color: "#ffffff" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "540px", textAlign: "center" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 16px" }}>Geeta University Portal</h1>
            <p style={{ color: "#cbd5e1", fontSize: "16px", lineHeight: "1.6", margin: "0 0 24px" }}>
              A temporary service interruption occurred while loading institutional resources.
            </p>
            {error.digest && (
              <p style={{ fontSize: "12px", fontFamily: "monospace", color: "#94a3b8", backgroundColor: "rgba(255,255,255,0.06)", padding: "8px 12px", borderRadius: "6px", display: "inline-block" }}>
                Incident ID: {error.digest}
              </p>
            )}
            <div style={{ marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  backgroundColor: "#E8871A",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "9999px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
