"use client";

import { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Save,
  CheckCircle,
  ExternalLink,
  Columns,
  ListOrdered,
} from "lucide-react";
import {
  GovernanceTableColumn,
  GovernanceTableRow,
  GovernanceTableData,
} from "@/data/governance";

interface GovernanceCommitteeModalProps {
  committee: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<{ success: boolean; error?: string }>;
}

export function GovernanceCommitteeModal({
  committee,
  isOpen,
  onClose,
  onSave,
}: GovernanceCommitteeModalProps) {
  if (!isOpen || !committee) return null;

  // Initialize columns and rows from existing tableData or sensible defaults
  const initialTableData: GovernanceTableData = committee.tableData || {
    version: 1,
    columns: [
      { key: "col_1", label: "Reference" },
      { key: "col_2", label: "Position" },
      { key: "col_3", label: "Role" },
      { key: "col_4", label: "Member Details" },
    ],
    rows: [],
  };

  const [title, setTitle] = useState<string>(committee.title || "");
  const [description, setDescription] = useState<string>(committee.description || "");
  const [documentUrl, setDocumentUrl] = useState<string>(committee.documentUrl || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    committee.status || "PUBLISHED"
  );
  const [columns, setColumns] = useState<GovernanceTableColumn[]>(
    initialTableData.columns && initialTableData.columns.length > 0
      ? initialTableData.columns
      : [
          { key: "col_1", label: "Col 1" },
          { key: "col_2", label: "Col 2" },
        ]
  );
  const [rows, setRows] = useState<GovernanceTableRow[]>(
    initialTableData.rows || []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Column Actions
  const handleAddColumn = () => {
    const newIndex = columns.length + 1;
    const newKey = `col_${Date.now()}`;
    const newCol: GovernanceTableColumn = {
      key: newKey,
      label: `Column ${newIndex}`,
    };
    setColumns([...columns, newCol]);

    // Add empty cell to every existing row
    setRows(
      rows.map((row) => ({
        ...row,
        cells: [...row.cells, ""],
      }))
    );
  };

  const handleUpdateColumnLabel = (index: number, newLabel: string) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], label: newLabel };
    setColumns(updated);
  };

  const handleRemoveColumn = (index: number) => {
    if (columns.length <= 1) {
      alert("A committee table must have at least one column.");
      return;
    }
    if (
      !confirm(
        `Remove column "${columns[index].label}"? All cell values under this column will be removed.`
      )
    ) {
      return;
    }

    const updatedCols = columns.filter((_, idx) => idx !== index);
    setColumns(updatedCols);

    // Remove the corresponding cell from each row
    const updatedRows = rows.map((row) => ({
      ...row,
      cells: row.cells.filter((_, idx) => idx !== index),
    }));
    setRows(updatedRows);
  };

  // Row Actions
  const handleAddRow = () => {
    const newRow: GovernanceTableRow = {
      id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sortOrder: rows.length,
      cells: new Array(columns.length).fill(""),
    };
    setRows([...rows, newRow]);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const updated = [...rows];
    const targetRow = { ...updated[rowIndex] };
    const targetCells = [...targetRow.cells];

    // Ensure cell array length matches columns
    while (targetCells.length < columns.length) {
      targetCells.push("");
    }
    targetCells[colIndex] = value;
    targetRow.cells = targetCells;
    updated[rowIndex] = targetRow;
    setRows(updated);
  };

  const handleRemoveRow = (rowIndex: number) => {
    setRows(rows.filter((_, idx) => idx !== rowIndex));
  };

  const handleMoveRow = (rowIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? rowIndex - 1 : rowIndex + 1;
    if (targetIndex < 0 || targetIndex >= rows.length) return;

    const updated = [...rows];
    const temp = updated[rowIndex];
    updated[rowIndex] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate sortOrder
    const reordered = updated.map((r, idx) => ({ ...r, sortOrder: idx }));
    setRows(reordered);
  };

  // Submit Handler
  const handleSave = async (targetStatus: "DRAFT" | "PUBLISHED") => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push("Committee title is required.");
    }
    if (columns.length === 0) {
      errors.push("At least one column must be defined.");
    }
    for (let i = 0; i < columns.length; i++) {
      if (!columns[i].label.trim()) {
        errors.push(`Column #${i + 1} header label cannot be blank.`);
      }
    }

    // Validate cell counts
    for (let rIdx = 0; rIdx < rows.length; rIdx++) {
      const row = rows[rIdx];
      if (row.cells.length !== columns.length) {
        errors.push(
          `Row #${rIdx + 1} has ${row.cells.length} cells but ${columns.length} columns defined.`
        );
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setIsSubmitting(true);

    const tableData: GovernanceTableData = {
      version: 1,
      columns: columns.map((c, i) => ({
        key: c.key || `col_${i}`,
        label: c.label.trim(),
      })),
      rows: rows.map((r, idx) => ({
        id: r.id || `row-${idx}`,
        sortOrder: idx,
        cells: r.cells.slice(0, columns.length),
      })),
    };

    const payload = {
      id: committee.id || null,
      title: title.trim(),
      description: description.trim() || null,
      documentUrl: documentUrl.trim(),
      category: "governance",
      status: targetStatus,
      sortOrder: committee.sortOrder ?? 0,
      tableData,
    };

    const res = await onSave(payload);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setValidationErrors([res.error || "Failed to save committee"]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#0A1F44] text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-[#E8871A]">
              <Columns className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {committee.id ? `Edit Committee: ${title || "Untitled"}` : "New Governance Committee"}
              </h2>
              <p className="text-xs text-slate-300">
                Configure committee details, column definitions, and member entries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/about-us#governance"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview /about-us
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="h-4 w-4" />
                Please fix the following validation issues:
              </div>
              <ul className="list-disc pl-6 text-xs space-y-0.5">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1: Committee Details */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
              1. Committee Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Committee Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Board of Management"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-[#E8871A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Introductory Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Reconstitution and composition of the committee."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-[#E8871A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supporting Document URL / PDF (Optional)
                </label>
                <input
                  type="text"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="https://geetauniversity.edu.in/uploads/.../doc.pdf"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-[#E8871A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-[#E8871A] focus:outline-none"
                >
                  <option value="PUBLISHED">Published (Visible on live website)</option>
                  <option value="DRAFT">Draft (Hidden from public site)</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Columns Definition */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  2. Table Columns ({columns.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Configure the header labels for this committee's table.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddColumn}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:border-[#E8871A] hover:text-[#E8871A]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Column
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {columns.map((col, cIdx) => (
                <div
                  key={col.key || cIdx}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Col {cIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={col.label}
                      onChange={(e) => handleUpdateColumnLabel(cIdx, e.target.value)}
                      placeholder="Header Label"
                      className="w-full border-b border-transparent text-xs font-bold text-[#0A1F44] focus:border-[#E8871A] focus:outline-none"
                    />
                  </div>
                  {columns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(cIdx)}
                      title="Remove Column"
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Rows Editor */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  3. Committee Rows ({rows.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Enter member details matching each column. Multi-line values are supported.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
              >
                <Plus className="h-4 w-4" />
                Add Member Row
              </button>
            </div>

            {rows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <ListOrdered className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">No member rows yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Click "Add Member Row" to insert the first committee entry.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[700px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-[#0A1F44] border-b border-slate-200">
                      <th className="w-12 px-3 py-2.5 text-center text-xs font-bold">#</th>
                      {columns.map((col, cIdx) => (
                        <th
                          key={col.key || cIdx}
                          className="px-3 py-2.5 text-xs font-bold text-slate-700"
                        >
                          {col.label}
                        </th>
                      ))}
                      <th className="w-24 px-3 py-2.5 text-right text-xs font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((row, rIdx) => (
                      <tr key={row.id || rIdx} className="hover:bg-slate-50/80">
                        <td className="px-3 py-2.5 text-center text-xs font-bold text-slate-400">
                          {rIdx + 1}
                        </td>
                        {columns.map((col, cIdx) => (
                          <td key={`${row.id}-${col.key || cIdx}`} className="px-3 py-2.5 align-top">
                            <textarea
                              rows={2}
                              value={row.cells[cIdx] || ""}
                              onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                              placeholder={`Enter ${col.label}...`}
                              className="w-full rounded-md border border-slate-200 p-2 text-xs text-[#0A1F44] focus:border-[#E8871A] focus:outline-none resize-y min-h-[44px]"
                            />
                          </td>
                        ))}
                        <td className="px-3 py-2.5 align-top text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveRow(rIdx, "up")}
                              disabled={rIdx === 0}
                              title="Move Up"
                              className="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveRow(rIdx, "down")}
                              disabled={rIdx === rows.length - 1}
                              title="Move Down"
                              className="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(rIdx)}
                              title="Remove Row"
                              className="rounded p-1 text-rose-500 hover:bg-rose-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave("DRAFT")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-[#E8871A] hover:text-[#E8871A] disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave("PUBLISHED")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-5 py-2 text-xs font-bold text-white hover:bg-[#153468] disabled:opacity-50 shadow-sm"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              {isSubmitting ? "Saving to Aiven..." : "Publish Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
