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
  Search,
  FileCheck,
  ExternalLink,
  Download,
  Eye,
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

interface AssetInspectionData {
  assetIdentifier: string;
  foundInDb: boolean;
  assetId?: string;
  fileName: string;
  storageKey: string;
  publicUrl: string;
  driver: "local" | "s3";
  configuredRoot: string;
  resolvedDiskPath: string;
  existsOnDisk: boolean;
  expectedDbSize?: number;
  actualDiskSize?: number;
  sizeMatches: boolean;
  mimeType: string;
  isInlineSafe: boolean;
  sha256?: string;
  integrityStatus: "VALID" | "SIZE_MISMATCH" | "CHECKSUM_FAILED" | "NOT_FOUND";
  publicServingStatus: "AVAILABLE" | "MISSING" | "SIZE_MISMATCH";
  canReadStream: boolean;
  error?: string;
}

export function StorageDiagnosticModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"storage" | "asset">("storage");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Asset Inspection State
  const [assetQuery, setAssetQuery] = useState("uploads/cms/media/library/13th-nov.webp");
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetData, setAssetData] = useState<AssetInspectionData | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);

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

  const inspectAsset = async (queryToUse?: string) => {
    const q = (queryToUse ?? assetQuery).trim();
    if (!q) return;
    setAssetLoading(true);
    setAssetError(null);
    try {
      const res = await fetch(
        `/api/admin/media/diagnostic?asset=${encodeURIComponent(q)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      setAssetData(json);
      if (!res.ok && !json.fileName) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      setAssetError(err.message || "Failed to inspect asset on disk");
    } finally {
      setAssetLoading(false);
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
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-150 px-5 py-4 bg-white shrink-0">
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

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("storage")}
                className={`py-2.5 px-4 text-xs font-bold transition border-b-2 -mb-px ${
                  activeTab === "storage"
                    ? "border-indigo-600 text-indigo-700 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                Storage Volume Probe
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("asset");
                  if (!assetData && !assetLoading) {
                    inspectAsset("uploads/cms/media/library/13th-nov.webp");
                  }
                }}
                className={`py-2.5 px-4 text-xs font-bold transition border-b-2 -mb-px flex items-center gap-1.5 ${
                  activeTab === "asset"
                    ? "border-indigo-600 text-indigo-700 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                Asset Disk Inspector
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {activeTab === "storage" ? (
                /* Tab 1: Storage Probe */
                loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
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
                        <span className="font-mono text-[11px] text-slate-800 break-all text-right max-w-[360px]">
                          {data.configuredRoot}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="font-medium text-slate-600">Resolved Base Path:</span>
                        <span className="font-mono text-[11px] text-slate-800 break-all text-right max-w-[360px]">
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
                ) : null
              ) : (
                /* Tab 2: Asset Disk Inspector */
                <div className="space-y-4">
                  {/* Search / Input Box */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={assetQuery}
                      onChange={(e) => setAssetQuery(e.target.value)}
                      placeholder="Enter filename, key or URL (e.g. 13th-nov.webp)"
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => inspectAsset()}
                      disabled={assetLoading}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {assetLoading ? "Checking..." : "Inspect Asset"}
                    </button>
                  </div>

                  {/* Quick test buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    <span>Quick inspect:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAssetQuery("13th-nov.webp");
                        inspectAsset("13th-nov.webp");
                      }}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] hover:bg-slate-100 text-slate-700"
                    >
                      13th-nov.webp
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssetQuery("uploads/cms/media/library/phd-commerce.webp");
                        inspectAsset("uploads/cms/media/library/phd-commerce.webp");
                      }}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] hover:bg-slate-100 text-slate-700"
                    >
                      phd-commerce.webp
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssetQuery("uploads/cms/media/library/pharmacy-brochure.pdf");
                        inspectAsset("uploads/cms/media/library/pharmacy-brochure.pdf");
                      }}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] hover:bg-slate-100 text-slate-700"
                    >
                      pharmacy-brochure.pdf
                    </button>
                  </div>

                  {/* Inspector Results */}
                  {assetLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                      <RefreshCw className="h-7 w-7 animate-spin text-indigo-600 mb-2" />
                      <p className="text-xs font-medium">Resolving physical file on disk...</p>
                    </div>
                  ) : assetError ? (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                      <p className="font-semibold">Inspection Error</p>
                      <p className="mt-1">{assetError}</p>
                    </div>
                  ) : assetData ? (
                    <div className="space-y-3">
                      {/* Status Banner */}
                      <div
                        className={`flex items-center gap-3 rounded-lg border p-3.5 text-sm ${
                          assetData.existsOnDisk
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : "border-rose-200 bg-rose-50 text-rose-900"
                        }`}
                      >
                        {assetData.existsOnDisk ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold">
                            {assetData.existsOnDisk
                              ? "Physical File Present in Permanent Storage"
                              : "Physical File Missing from Storage Volume"}
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Status: <strong className={assetData.existsOnDisk ? "text-emerald-700" : "text-rose-700"}>{assetData.publicServingStatus}</strong>
                            {assetData.foundInDb ? " | MySQL record verified" : " | Note: No record found in MySQL MediaAsset"}
                          </p>
                        </div>
                      </div>

                      {/* Details Table */}
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs divide-y divide-slate-200/80">
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Filename:</span>
                          <span className="font-bold text-slate-800">{assetData.fileName}</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Storage Provider:</span>
                          <span className="font-bold uppercase text-slate-800">{assetData.driver} (LocalStorageProvider)</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Relative Storage Key:</span>
                          <span className="font-mono text-[11px] text-slate-800 break-all text-right max-w-[360px]">
                            {assetData.storageKey}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Resolved Disk Path:</span>
                          <span className="font-mono text-[11px] text-indigo-900 font-semibold break-all text-right max-w-[360px]">
                            {assetData.resolvedDiskPath}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Exists on Disk:</span>
                          <span className={`font-semibold ${assetData.existsOnDisk ? "text-emerald-700" : "text-rose-700"}`}>
                            {assetData.existsOnDisk ? "YES (Verified)" : "NO (Missing)"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Actual Disk Size:</span>
                          <span className="font-mono text-[11px] text-slate-800">
                            {assetData.actualDiskSize !== undefined
                              ? `${assetData.actualDiskSize.toLocaleString()} bytes`
                              : "(file missing)"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Expected DB Size:</span>
                          <span className="font-mono text-[11px] text-slate-800">
                            {assetData.expectedDbSize !== undefined
                              ? `${assetData.expectedDbSize.toLocaleString()} bytes`
                              : "(not in database)"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Verified MIME Type:</span>
                          <span className="font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {assetData.mimeType}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="font-medium text-slate-600">Browser Display Mode:</span>
                          <span className="font-semibold text-slate-800">
                            {assetData.isInlineSafe ? "Inline Viewer (No Forced Download)" : "Attachment (Download)"}
                          </span>
                        </div>
                        {assetData.sha256 && (
                          <div className="flex justify-between py-1.5">
                            <span className="font-medium text-slate-600">SHA-256 Checksum:</span>
                            <span className="font-mono text-[10px] text-slate-700 break-all text-right max-w-[320px]">
                              {assetData.sha256}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Live Browser Test Actions */}
                      {assetData.existsOnDisk && (
                        <div className="rounded-lg border border-slate-200 bg-white p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-slate-700">Test Live Public Serving:</span>
                          <div className="flex items-center gap-2">
                            <a
                              href={assetData.publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 font-bold text-white shadow-xs hover:bg-[#1A3A6B] transition"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View Inline (New Tab)
                            </a>
                            <a
                              href={`${assetData.publicUrl}${assetData.publicUrl.includes("?") ? "&" : "?"}download=1`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Explicit Download
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-150 px-5 py-3 bg-slate-50 shrink-0">
              <span className="text-[11px] text-slate-500">
                Safe runtime verification restricted to administrators
              </span>
              <div className="flex gap-2">
                {activeTab === "storage" ? (
                  <button
                    type="button"
                    onClick={runDiagnostic}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    Re-test
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => inspectAsset()}
                    disabled={assetLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${assetLoading ? "animate-spin" : ""}`} />
                    Re-inspect
                  </button>
                )}
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

