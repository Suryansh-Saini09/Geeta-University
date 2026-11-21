"use client";

import { useState } from "react";
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  X,
  HardDrive,
  ShieldAlert,
} from "lucide-react";

interface DiagnosticData {
  timestamp: string;
  nodeEnv: string;
  driver: "local" | "s3";
  configuredRoot: string;
  resolvedRoot: string;
  isAbsolute: boolean;
  isInsideDeployment: boolean;
  directoryExists: boolean;
  canCreateDirectory: boolean;
  canWrite: boolean;
  canRead: boolean;
  canCleanup: boolean;
  latencyMs: number;
  healthy: boolean;
  error?: string;
  warnings: string[];
}

export function StorageDiagnosticModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/media/diagnostic", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok && !json.timestamp) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setData(json);
    } catch (err: any) {
      setFetchError(err.message || "Failed to run diagnostic");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    runDiagnostic();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Server className="h-3.5 w-3.5 text-indigo-600" />
        Storage Health
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-150 px-5 py-4">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Hostinger Media Storage Diagnostic
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                  <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
                  <p className="text-sm font-medium">Running non-destructive storage probe...</p>
                </div>
              ) : fetchError ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                  <p className="font-semibold">Diagnostic Request Failed</p>
                  <p className="mt-1 text-xs">{fetchError}</p>
                </div>
              ) : data ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div
                    className={`flex items-center gap-3 rounded-lg border p-3.5 text-sm ${
                      data.healthy
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-rose-200 bg-rose-50 text-rose-900"
                    }`}
                  >
                    {data.healthy ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold">
                        {data.healthy
                          ? "Permanent Storage Active & Verified"
                          : "Storage Configuration Alert"}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Probe Latency: {data.latencyMs}ms | Node Environment: {data.nodeEnv}
                      </p>
                    </div>
                  </div>

                  {data.error && (
                    <div className="rounded-lg border border-rose-300 bg-rose-50/70 p-3 text-xs text-rose-800">
                      <span className="font-semibold">Error:</span> {data.error}
                    </div>
                  )}

                  {data.warnings && data.warnings.length > 0 && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <span>Configuration Notice</span>
                      </div>
                      {data.warnings.map((w, i) => (
                        <p key={i}>{w}</p>
                      ))}
                    </div>
                  )}

                  {/* Diagnostic Details Grid */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs divide-y divide-slate-200/80">
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Storage Driver:</span>
                      <span className="font-bold uppercase text-slate-800">{data.driver}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Configured Root:</span>
                      <span className="font-mono text-[11px] text-slate-800 break-all text-right max-w-[320px]">
                        {data.configuredRoot}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Resolved Path:</span>
                      <span className="font-mono text-[11px] text-slate-800 break-all text-right max-w-[320px]">
                        {data.resolvedRoot}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Absolute Path:</span>
                      <span className={`font-semibold ${data.isAbsolute ? "text-emerald-700" : "text-rose-700"}`}>
                        {data.isAbsolute ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Directory Exists:</span>
                      <span className={`font-semibold ${data.directoryExists ? "text-emerald-700" : "text-rose-700"}`}>
                        {data.directoryExists ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Write Verified:</span>
                      <span className={`font-semibold ${data.canWrite ? "text-emerald-700" : "text-rose-700"}`}>
                        {data.canWrite ? "Verified (Probe Created)" : "Failed"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Read & Integrity:</span>
                      <span className={`font-semibold ${data.canRead ? "text-emerald-700" : "text-rose-700"}`}>
                        {data.canRead ? "Verified (Byte Match)" : "Failed"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Cleanup Verified:</span>
                      <span className={`font-semibold ${data.canCleanup ? "text-emerald-700" : "text-rose-700"}`}>
                        {data.canCleanup ? "Verified (Probe Removed)" : "Failed"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-medium text-slate-600">Outside Ephemeral Tree:</span>
                      <span className={`font-semibold ${!data.isInsideDeployment ? "text-emerald-700" : "text-amber-700"}`}>
                        {!data.isInsideDeployment ? "Yes (Persistent)" : "Inside Deployment Folder"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-150 px-5 py-3 bg-slate-50 rounded-b-xl">
              <span className="text-[11px] text-slate-500">
                Safe non-destructive probe runs in runtime process
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={runDiagnostic}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  Re-test
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

