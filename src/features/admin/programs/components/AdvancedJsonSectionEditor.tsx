"use client";

import { useState } from "react";
import { Code, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

interface AdvancedJsonSectionEditorProps {
  programId: string;
  programName: string;
  overviewData: Record<string, any>;
  saved?: boolean;
  error?: string;
}

export function AdvancedJsonSectionEditor({
  programId,
  overviewData,
  saved,
  error,
}: AdvancedJsonSectionEditorProps) {
  const [jsonText, setJsonText] = useState(JSON.stringify(overviewData, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setParseError(null);
    } catch (err: any) {
      setParseError(err.message || "Invalid JSON syntax.");
    }
  };

  const handleChange = (val: string) => {
    setJsonText(val);
    try {
      JSON.parse(val);
      setParseError(null);
    } catch (err: any) {
      setParseError(err.message || "Invalid JSON syntax.");
    }
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Configuration settings saved successfully.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      ) : null}

      {parseError ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-mono text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          JSON Error: {parseError}
        </div>
      ) : null}

      <form action={updateProgramSectionAction} className="space-y-6">
        <input type="hidden" name="id" value={programId} />
        <input type="hidden" name="section" value="advancedJson" />
        <input type="hidden" name="payload" value={jsonText} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-slate-700" />
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  Advanced Raw JSON Overview Editor
                </h3>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Direct low-level inspector and editor for the complete database-backed course page content structure.
              </p>
            </div>
            <button
              type="button"
              onClick={handleFormat}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Format & Validate JSON
            </button>
          </div>

          <div>
            <textarea
              rows={26}
              value={jsonText}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-emerald-400 outline-none focus:border-slate-500 shadow-inner"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton
            disabled={!!parseError}
            label="Save Raw JSON"
            loadingLabel="Saving JSON..."
          />
        </div>
      </form>
    </div>
  );
}
