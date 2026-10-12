"use client";

import { useState } from "react";
import { updatePageSectionAction, updatePageSeoAction } from "@/features/admin/pages/actions";
import {
  CmsImagePreviewInput,
  CmsStringRepeater,
} from "@/features/admin/pages/components/CmsFieldHelpers";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

interface InstitutionalPagesCmsDashboardProps {
  pageSlug: string;
  initialData: {
    sections: Record<string, any>;
    seo: any;
  };
}

export function InstitutionalPagesCmsDashboard({
  pageSlug,
  initialData,
}: InstitutionalPagesCmsDashboardProps) {
  const [sectionsData, setSectionsData] = useState<Record<string, any>>(initialData.sections || {});
  const [seoData, setSeoData] = useState<any>(initialData.seo || {});
  const [activeTab, setActiveTab] = useState<string>(() => {
    const keys = Object.keys(initialData.sections || {});
    return keys.length > 0 ? keys[0] : "seo";
  });

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const sectionKeys = Object.keys(sectionsData);

  const handleSaveSection = async (key: string) => {
    setSavingKey(key);
    setFeedback(null);
    try {
      const section = sectionsData[key];
      const body = section?.body || section || {};
      const res = await updatePageSectionAction(pageSlug, key, body);
      if (res.success) {
        setFeedback({ type: "success", message: `Saved ${key} section for /${pageSlug} successfully!` });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save section" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred" });
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveSeo = async () => {
    setSavingKey("seo");
    setFeedback(null);
    try {
      const res = await updatePageSeoAction(pageSlug, seoData);
      if (res.success) {
        setFeedback({ type: "success", message: `Saved SEO metadata for /${pageSlug} successfully!` });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save SEO metadata" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred" });
    } finally {
      setSavingKey(null);
    }
  };

  const updateBody = (key: string, updater: (prev: any) => any) => {
    setSectionsData((prev: Record<string, any>) => {
      const current = prev[key]?.body || prev[key] || {};
      const nextBody = updater(current);
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          body: nextBody,
        },
      };
    });
  };

  const getBody = (key: string) => {
    return sectionsData[key]?.body || sectionsData[key] || {};
  };

  const publicUrl = `/${pageSlug}`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44] capitalize">
            {pageSlug.replace(/-/g, " ")} CMS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage live content sections for <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/{pageSlug}</code>.
          </p>
        </div>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
        >
          <ExternalLink className="h-4 w-4 text-slate-500" />
          <span>View Live Page</span>
        </a>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {sectionKeys.map((key) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all capitalize ${
                isActive
                  ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>{key.replace(/_/g, " ")}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "seo"
              ? "bg-[#E8871A] text-white shadow-md shadow-amber-900/10"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>SEO Metadata</span>
        </button>
      </div>

      {/* SEO TAB CONTENT */}
      {activeTab === "seo" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                SEO Metadata for /{pageSlug}
              </h3>
              <p className="text-xs text-slate-500">Configure page title, meta description, and social sharing images.</p>
            </div>
            <button
              type="button"
              onClick={handleSaveSeo}
              disabled={savingKey === "seo"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
            >
              {savingKey === "seo" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save SEO Metadata
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 max-w-3xl">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={seoData?.title || ""}
                onChange={(e) => setSeoData((prev: any) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Careers at Geeta University | Join Top Private University in Haryana"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoData?.description || ""}
                onChange={(e) => setSeoData((prev: any) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description for search engines and social media shares..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={Array.isArray(seoData?.keywords) ? seoData.keywords.join(", ") : seoData?.keywords || ""}
                onChange={(e) =>
                  setSeoData((prev: any) => ({
                    ...prev,
                    keywords: e.target.value.split(",").map((k) => k.trim()),
                  }))
                }
                placeholder="Careers, Geeta University, Faculty Jobs, Panipat"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                OpenGraph Title
              </label>
              <input
                type="text"
                value={seoData?.ogTitle || ""}
                onChange={(e) => setSeoData((prev: any) => ({ ...prev, ogTitle: e.target.value }))}
                placeholder="Social share title..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>

            <CmsImagePreviewInput
              label="OpenGraph Social Image URL"
              value={seoData?.ogImage || ""}
              onChange={(url) => setSeoData((prev: any) => ({ ...prev, ogImage: url }))}
              placeholder="/images/og-share.webp"
            />
          </div>
        </div>
      )}

      {/* Active Section Content Pane */}
      {activeTab !== "seo" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] capitalize">
                {activeTab.replace(/_/g, " ")} Section
              </h3>
              <p className="text-xs text-slate-500">Edit values and save section changes.</p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveSection(activeTab)}
              disabled={savingKey === activeTab}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
            >
              {savingKey === activeTab ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Changes
                </>
              )}
            </button>
          </div>

          {/* Form Fields Generator based on Section Content */}
          {(() => {
            const body = getBody(activeTab);
            const keys = Object.keys(body);

            if (keys.length === 0) {
              return (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No editable fields found for this section body.
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {keys.map((k) => {
                  const val = body[k];

                  // Array of strings -> CmsStringRepeater
                  if (Array.isArray(val) && (val.length === 0 || typeof val[0] === "string")) {
                    return (
                      <CmsStringRepeater
                        key={k}
                        title={k.replace(/_/g, " ").toUpperCase()}
                        items={val}
                        onChange={(next) => updateBody(activeTab, (b) => ({ ...b, [k]: next }))}
                        placeholder={`Enter ${k} item...`}
                      />
                    );
                  }

                  // Array of objects -> render items list editor with reorder & image preview
                  if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object") {
                    return (
                      <div key={k} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                            {k.replace(/_/g, " ")} ({val.length} items)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const template = { ...val[0], id: `item-${Date.now()}` };
                              Object.keys(template).forEach((prop) => {
                                if (prop !== "id") template[prop] = typeof template[prop] === "number" ? 0 : "";
                              });
                              updateBody(activeTab, (b) => ({ ...b, [k]: [...val, template] }));
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1F44] hover:text-[#E8871A]"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Row
                          </button>
                        </div>

                        <div className="space-y-3">
                          {val.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="rounded-lg border border-slate-200 bg-white p-3 space-y-3">
                              <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
                                <span>#{idx + 1} {item.title || item.name || item.question || item.city || item.category || ""}</span>
                                <div className="flex items-center gap-2">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      title="Move Up"
                                      onClick={() => {
                                        const next = [...val];
                                        const temp = next[idx];
                                        next[idx] = next[idx - 1];
                                        next[idx - 1] = temp;
                                        updateBody(activeTab, (b) => ({ ...b, [k]: next }));
                                      }}
                                      className="p-1 rounded text-slate-400 hover:text-[#0A1F44] hover:bg-slate-100"
                                    >
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  {idx < val.length - 1 && (
                                    <button
                                      type="button"
                                      title="Move Down"
                                      onClick={() => {
                                        const next = [...val];
                                        const temp = next[idx];
                                        next[idx] = next[idx + 1];
                                        next[idx + 1] = temp;
                                        updateBody(activeTab, (b) => ({ ...b, [k]: next }));
                                      }}
                                      className="p-1 rounded text-slate-400 hover:text-[#0A1F44] hover:bg-slate-100"
                                    >
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = val.filter((_: any, i: number) => i !== idx);
                                      updateBody(activeTab, (b) => ({ ...b, [k]: next }));
                                    }}
                                    className="p-1 rounded text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.keys(item).map((prop) => {
                                  if (prop === "id") return null;
                                  if (typeof item[prop] === "object") return null;

                                  const propLower = prop.toLowerCase();
                                  const isImageProp =
                                    propLower.includes("image") ||
                                    propLower.includes("icon") ||
                                    propLower.includes("photo") ||
                                    propLower.includes("logo") ||
                                    propLower.includes("thumbnail");

                                  const isLongTextProp =
                                    propLower.includes("description") ||
                                    propLower.includes("answer") ||
                                    propLower.includes("address") ||
                                    propLower.includes("eligibility") ||
                                    propLower.includes("details") ||
                                    (typeof item[prop] === "string" && item[prop].length > 60);

                                  if (isImageProp) {
                                    return (
                                      <div key={prop} className="col-span-1 sm:col-span-2">
                                        <CmsImagePreviewInput
                                          label={prop.replace(/_/g, " ")}
                                          value={item[prop] || ""}
                                          onChange={(url) => {
                                            const next = [...val];
                                            next[idx] = { ...next[idx], [prop]: url };
                                            updateBody(activeTab, (b) => ({ ...b, [k]: next }));
                                          }}
                                          placeholder="/images/example.webp"
                                        />
                                      </div>
                                    );
                                  }

                                  if (isLongTextProp) {
                                    return (
                                      <div key={prop} className="col-span-1 sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                                          {prop.replace(/_/g, " ")}
                                        </label>
                                        <textarea
                                          rows={2}
                                          value={item[prop] || ""}
                                          onChange={(e) => {
                                            const next = [...val];
                                            next[idx] = { ...next[idx], [prop]: e.target.value };
                                            updateBody(activeTab, (b) => ({ ...b, [k]: next }));
                                          }}
                                          className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                                        />
                                      </div>
                                    );
                                  }

                                  return (
                                    <div key={prop}>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                                        {prop.replace(/_/g, " ")}
                                      </label>
                                      <input
                                        type="text"
                                        value={item[prop] || ""}
                                        onChange={(e) => {
                                          const next = [...val];
                                          next[idx] = { ...next[idx], [prop]: e.target.value };
                                          updateBody(activeTab, (b) => ({ ...b, [k]: next }));
                                        }}
                                        className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // Image field
                  if (typeof val === "string" && (k.toLowerCase().includes("image") || k.toLowerCase().includes("icon"))) {
                    return (
                      <CmsImagePreviewInput
                        key={k}
                        label={k.replace(/_/g, " ")}
                        value={val}
                        onChange={(url) => updateBody(activeTab, (b) => ({ ...b, [k]: url }))}
                        placeholder="/images/example.webp"
                      />
                    );
                  }

                  // Long text / description / paragraphs
                  if (typeof val === "string" && val.length > 80) {
                    return (
                      <div key={k}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                          {k.replace(/_/g, " ")}
                        </label>
                        <textarea
                          rows={3}
                          value={val}
                          onChange={(e) => updateBody(activeTab, (b) => ({ ...b, [k]: e.target.value }))}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                        />
                      </div>
                    );
                  }

                  // General string / number field
                  return (
                    <div key={k}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {k.replace(/_/g, " ")}
                      </label>
                      <input
                        type="text"
                        value={typeof val === "string" || typeof val === "number" ? val : JSON.stringify(val)}
                        onChange={(e) => updateBody(activeTab, (b) => ({ ...b, [k]: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

