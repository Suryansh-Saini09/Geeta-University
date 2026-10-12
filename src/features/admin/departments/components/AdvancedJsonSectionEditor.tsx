"use client";

import { useState } from "react";
import { Save, Code, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface AdvancedJsonSectionEditorProps {
  departmentId: string;
  bodyData: any;
  userRole?: string;
  saved?: boolean;
  error?: string;
}

export function AdvancedJsonSectionEditor({
  departmentId,
  bodyData,
  userRole = "ADMIN",
  saved,
  error,
}: AdvancedJsonSectionEditorProps) {
  const formattedJson = JSON.stringify(bodyData || {}, null, 2);
  const [jsonText, setJsonText] = useState(formattedJson);
  const [parseError, setParseError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const handleTextChange = (val: string) => {
    setJsonText(val);
    try {
      JSON.parse(val);
      setParseError(null);
    } catch (e: any) {
      setParseError(e.message || "Invalid JSON syntax");
    }
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Raw JSON payload updated successfully.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          {error}
        </div>
      )}

      {/* Security Warning Notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-amber-900">
            ADVANCED TECHNICAL TOOL — RESTRICTED ACCESS
          </p>
          <p>
            Modifying raw JSON payload directly bypasses section-level validation UI. Only modify JSON if you are a technical administrator or performing structural migrations.
          </p>
        </div>
      </div>

      <form action={updateDepartmentSectionAction} className="space-y-6">
        <input type="hidden" name="id" value={departmentId} />
        <input type="hidden" name="section" value="advancedJson" />
        <input type="hidden" name="payloadJson" value={jsonText} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Full Structured School Content (JSON Payload)
              </h3>
            </div>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              Role: {userRole}
            </span>
          </div>

          {parseError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
              JSON Syntax Error: {parseError}
            </div>
          )}

          <textarea
            value={jsonText}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={18}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-emerald-400 outline-none transition focus:ring-2 focus:ring-[#E8871A]"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="confirmJson"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-[#E8871A]"
            />
            <label htmlFor="confirmJson" className="text-xs font-semibold text-slate-700">
              I understand the risk of modifying raw JSON payload directly.
            </label>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={!confirmed || parseError !== null}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-900 disabled:opacity-50"
          >
            <Save className="h-4 w-4 text-slate-700" />
            Save Advanced JSON
          </button>
        </div>
      </form>
    </div>
  );
}
