"use client";

import React, { useState } from "react";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "./CmsFieldHelpers";
import {
  formatFieldLabel,
  isImageFieldKey,
  isLongTextFieldKey,
} from "../institutionalConfig";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface InstitutionalFieldRendererProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
  sectionKey?: string;
  itemTemplate?: Record<string, any>;
}

export function InstitutionalFieldRenderer({
  data,
  onChange,
  sectionKey,
  itemTemplate,
}: InstitutionalFieldRendererProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    key: string;
    index: number;
    title: string;
  } | null>(null);

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (itemKey: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const updateField = (key: string, value: any) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog) return;
    const currentList = Array.isArray(data[deleteDialog.key])
      ? (data[deleteDialog.key] as any[])
      : [];
    const updated = currentList.filter((_, i) => i !== deleteDialog.index);
    updateField(deleteDialog.key, updated);
    setDeleteDialog(null);
  };

  const keys = Object.keys(data || {});

  if (keys.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
        <p className="text-sm font-semibold text-slate-700">No editable fields configured in this section.</p>
        <p className="text-xs text-slate-500 mt-1">This section currently has an empty content body.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {keys.map((key) => {
        const val = data[key];
        const label = formatFieldLabel(key);

        // 1. Array of Strings -> CmsStringRepeater
        if (Array.isArray(val) && (val.length === 0 || typeof val[0] === "string")) {
          return (
            <div key={key} className="space-y-2">
              <CmsStringRepeater
                title={label}
                items={val}
                onChange={(nextItems) => updateField(key, nextItems)}
                placeholder={`Add ${label} entry...`}
              />
            </div>
          );
        }

        // 2. Array of Objects -> Structured Repeatable Item Editor
        if (Array.isArray(val) && (val.length === 0 || typeof val[0] === "object")) {
          const list = (val as Array<Record<string, any>>) || [];

          const handleAddItem = () => {
            let newTemplate: Record<string, any> = {};
            if (itemTemplate) {
              newTemplate = { ...itemTemplate };
            } else if (list.length > 0 && typeof list[0] === "object") {
              const sample = list[0];
              Object.keys(sample).forEach((prop) => {
                if (prop === "id") {
                  newTemplate[prop] = `item-${Date.now()}`;
                } else if (typeof sample[prop] === "number") {
                  newTemplate[prop] = 0;
                } else if (typeof sample[prop] === "boolean") {
                  newTemplate[prop] = false;
                } else if (Array.isArray(sample[prop])) {
                  newTemplate[prop] = [];
                } else {
                  newTemplate[prop] = "";
                }
              });
            } else {
              newTemplate = {
                title: "New Item",
                description: "",
              };
            }

            if (!newTemplate.id) {
              newTemplate.id = `item-${Date.now()}`;
            }

            updateField(key, [...list, newTemplate]);
            setExpandedItems((prev) => ({ ...prev, [`${key}-${list.length}`]: true }));
          };

          const handleMoveUp = (idx: number) => {
            if (idx <= 0) return;
            const updated = [...list];
            const temp = updated[idx];
            updated[idx] = updated[idx - 1];
            updated[idx - 1] = temp;
            updateField(key, updated);
          };

          const handleMoveDown = (idx: number) => {
            if (idx >= list.length - 1) return;
            const updated = [...list];
            const temp = updated[idx];
            updated[idx] = updated[idx + 1];
            updated[idx + 1] = temp;
            updateField(key, updated);
          };

          return (
            <div
              key={key}
              className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-2xs"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#0A1F44]">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                      {label}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {list.length} {list.length === 1 ? "entry" : "entries"} configured
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1A3A6B] shadow-2xs transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Items List */}
              {list.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">
                    No items added yet. Click &ldquo;Add Item&rdquo; above to create the first entry.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {list.map((item, idx) => {
                    const itemKey = `${key}-${idx}`;
                    const isExpanded = expandedItems[itemKey] !== false; // Default expanded
                    const itemTitle =
                      item.title ||
                      item.name ||
                      item.heading ||
                      item.question ||
                      item.battleName ||
                      item.councilName ||
                      item.city ||
                      `Item #${idx + 1}`;

                    return (
                      <div
                        key={item.id || idx}
                        className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition"
                      >
                        {/* Row Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-100">
                          <button
                            type="button"
                            onClick={() => toggleExpand(itemKey)}
                            className="flex items-center gap-2.5 text-left text-xs font-bold text-[#0A1F44] hover:text-slate-900 focus:outline-none"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                            <span className="font-mono text-slate-400 text-[11px]">#{idx + 1}</span>
                            <span className="truncate max-w-sm sm:max-w-md">{itemTitle}</span>
                          </button>

                          {/* Reordering & Delete Controls */}
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                title="Move Up"
                                onClick={() => handleMoveUp(idx)}
                                className="p-1 rounded text-slate-400 hover:text-[#0A1F44] hover:bg-slate-100 transition"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {idx < list.length - 1 && (
                              <button
                                type="button"
                                title="Move Down"
                                onClick={() => handleMoveDown(idx)}
                                className="p-1 rounded text-slate-400 hover:text-[#0A1F44] hover:bg-slate-100 transition"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              title="Delete Item"
                              onClick={() =>
                                setDeleteDialog({
                                  key,
                                  index: idx,
                                  title: itemTitle,
                                })
                              }
                              className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition ml-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Row Form Content */}
                        {isExpanded && (
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.keys(item).map((prop) => {
                                if (prop === "id") return null;

                                const propVal = item[prop];
                                const propLabel = formatFieldLabel(prop);

                                // Image property
                                if (isImageFieldKey(prop)) {
                                  return (
                                    <div key={prop} className="col-span-1 sm:col-span-2">
                                      <CmsImagePreviewInput
                                        label={propLabel}
                                        value={String(propVal || "")}
                                        onChange={(url) => {
                                          const nextList = [...list];
                                          nextList[idx] = { ...nextList[idx], [prop]: url };
                                          updateField(key, nextList);
                                        }}
                                        placeholder="/images/example.webp"
                                      />
                                    </div>
                                  );
                                }

                                // Long text property
                                if (isLongTextFieldKey(prop)) {
                                  return (
                                    <div key={prop} className="col-span-1 sm:col-span-2">
                                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        {propLabel}
                                      </label>
                                      <textarea
                                        rows={3}
                                        value={String(propVal ?? "")}
                                        onChange={(e) => {
                                          const nextList = [...list];
                                          nextList[idx] = { ...nextList[idx], [prop]: e.target.value };
                                          updateField(key, nextList);
                                        }}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none transition"
                                      />
                                    </div>
                                  );
                                }

                                // Number property
                                if (typeof propVal === "number") {
                                  return (
                                    <div key={prop}>
                                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        {propLabel}
                                      </label>
                                      <input
                                        type="number"
                                        value={propVal}
                                        onChange={(e) => {
                                          const nextList = [...list];
                                          nextList[idx] = {
                                            ...nextList[idx],
                                            [prop]: e.target.value === "" ? 0 : Number(e.target.value),
                                          };
                                          updateField(key, nextList);
                                        }}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none transition"
                                      />
                                    </div>
                                  );
                                }

                                // Boolean property
                                if (typeof propVal === "boolean") {
                                  return (
                                    <div key={prop} className="flex items-center gap-2 pt-2">
                                      <input
                                        type="checkbox"
                                        id={`${itemKey}-${prop}`}
                                        checked={propVal}
                                        onChange={(e) => {
                                          const nextList = [...list];
                                          nextList[idx] = { ...nextList[idx], [prop]: e.target.checked };
                                          updateField(key, nextList);
                                        }}
                                        className="h-4 w-4 rounded border-slate-300 text-[#0A1F44] focus:ring-[#0A1F44]"
                                      />
                                      <label
                                        htmlFor={`${itemKey}-${prop}`}
                                        className="text-xs font-bold text-slate-700"
                                      >
                                        {propLabel}
                                      </label>
                                    </div>
                                  );
                                }

                                // General short text
                                return (
                                  <div key={prop}>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                      {propLabel}
                                    </label>
                                    <input
                                      type="text"
                                      value={String(propVal ?? "")}
                                      onChange={(e) => {
                                        const nextList = [...list];
                                        nextList[idx] = { ...nextList[idx], [prop]: e.target.value };
                                        updateField(key, nextList);
                                      }}
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none transition"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // 3. Image Field
        if (typeof val === "string" && isImageFieldKey(key)) {
          return (
            <div key={key}>
              <CmsImagePreviewInput
                label={label}
                value={val}
                onChange={(url) => updateField(key, url)}
                placeholder="/images/example.webp"
              />
            </div>
          );
        }

        // 4. Long Text / Multiline Textarea
        if (typeof val === "string" && (isLongTextFieldKey(key) || val.length > 80)) {
          return (
            <div key={key}>
              <CmsAutoTextarea
                label={label}
                value={val}
                onChange={(text) => updateField(key, text)}
                rows={3}
              />
            </div>
          );
        }

        // 5. Number Field
        if (typeof val === "number") {
          return (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                {label}
              </label>
              <input
                type="number"
                value={val}
                onChange={(e) =>
                  updateField(key, e.target.value === "" ? 0 : Number(e.target.value))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none transition"
              />
            </div>
          );
        }

        // 6. Boolean Field
        if (typeof val === "boolean") {
          return (
            <div key={key} className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id={`field-${key}`}
                checked={val}
                onChange={(e) => updateField(key, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0A1F44] focus:ring-[#0A1F44]"
              />
              <label htmlFor={`field-${key}`} className="text-xs font-bold text-slate-700">
                {label}
              </label>
            </div>
          );
        }

        // 7. Nested Object (Non-array)
        if (typeof val === "object" && val !== null) {
          return (
            <div key={key} className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  {label}
                </h4>
              </div>
              <InstitutionalFieldRenderer
                data={val}
                onChange={(nextObj) => updateField(key, nextObj)}
                sectionKey={`${sectionKey}.${key}`}
              />
            </div>
          );
        }

        // 8. General Short Text
        return (
          <div key={key}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={val === null || val === undefined ? "" : String(val)}
              onChange={(e) => updateField(key, e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none transition"
            />
          </div>
        );
      })}

      {/* Delete Item Confirmation Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Delete Item?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete &ldquo;
              <strong className="text-slate-900">{deleteDialog.title}</strong>&rdquo;? This change will
              take effect once you save the section.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
