"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  User,
  Search,
  Filter,
  Eye,
  X,
  FileCode,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export interface SerializedAuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  before: any;
  after: any;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

interface ActivityLogTableProps {
  logs: SerializedAuditLog[];
}

export function ActivityLogTable({ logs }: ActivityLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<SerializedAuditLog | null>(null);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Create
          </span>
        );
      case "UPDATE":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            Update
          </span>
        );
      case "DELETE":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            Delete
          </span>
        );
      case "PUBLISH":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
            Publish
          </span>
        );
      case "UNPUBLISH":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            Unpublish
          </span>
        );
      case "LOGIN":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            Login
          </span>
        );
      case "LOGOUT":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
            Logout
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            {action}
          </span>
        );
    }
  };

  const formatEntityType = (type: string) => {
    switch (type) {
      case "DepartmentSection":
        return "Department Content Section";
      case "DepartmentFaculty":
        return "Faculty Display Order";
      case "FacultyMember":
        return "Faculty Record";
      case "MediaAsset":
        return "Media Library Asset";
      case "NewsArticle":
        return "News Article";
      case "GalleryAlbum":
        return "Photo Gallery";
      case "SiteSetting":
        return "Site Configuration";
      case "AdminUser":
        return "Administrator Account";
      case "ContactSubmission":
        return "Form Submission";
      default:
        return type;
    }
  };

  // Helper to extract keys that changed between before and after
  const getChangedKeys = (before: any, after: any): string[] => {
    if (!before || !after || typeof before !== "object" || typeof after !== "object") {
      return [];
    }
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
    const changed: string[] = [];
    for (const key of allKeys) {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changed.push(key);
      }
    }
    return changed;
  };

  return (
    <div>
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-slate-200/80 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Timestamp</th>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Action</th>
              <th className="px-5 py-3.5">Affected Content</th>
              <th className="px-5 py-3.5">Outcome</th>
              <th className="px-5 py-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {logs.map((log) => {
              const dateObj = new Date(log.createdAt);
              const formattedDate = dateObj.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const changedKeys = getChangedKeys(log.before, log.after);

              return (
                <tr key={log.id} className="transition-colors hover:bg-slate-50/60">
                  {/* Timestamp */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="font-medium text-slate-900">{formattedDate}</p>
                    <p className="text-xs text-slate-400">{formattedTime}</p>
                  </td>

                  {/* Actor */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                        {log.actor?.name ? log.actor.name.charAt(0).toUpperCase() : "S"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-xs truncate">
                          {log.actor?.name ?? "System"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {log.actor?.email ?? "system@internal"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 whitespace-nowrap">{getActionBadge(log.action)}</td>

                  {/* Affected Content */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900 text-xs">
                      {formatEntityType(log.entityType)}
                    </p>
                    {log.entityId && (
                      <p className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
                        ID: {log.entityId}
                      </p>
                    )}
                    {changedKeys.length > 0 && (
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Changed: {changedKeys.slice(0, 3).join(", ")}
                        {changedKeys.length > 3 ? ` +${changedKeys.length - 3} more` : ""}
                      </p>
                    )}
                  </td>

                  {/* Outcome */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Success
                    </span>
                  </td>

                  {/* Actions / Details */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      View Diff
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Audit Event Details</h3>
                  {getActionBadge(selectedLog.action)}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {formatEntityType(selectedLog.entityType)} • Recorded at{" "}
                  {new Date(selectedLog.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Actor</span>
                  <p className="font-medium text-slate-800">{selectedLog.actor?.name || "System"}</p>
                  <p className="text-slate-500 text-[11px]">{selectedLog.actor?.email || "internal"}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Entity</span>
                  <p className="font-medium text-slate-800">{selectedLog.entityType}</p>
                  <p className="font-mono text-slate-500 text-[11px]">{selectedLog.entityId || "N/A"}</p>
                </div>
              </div>

              {/* Changes Summary */}
              {selectedLog.before || selectedLog.after ? (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs">Field Changes</h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Before state */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 mb-2">
                        <span className="font-bold text-slate-600">State Before</span>
                        <span className="text-[10px] text-slate-400">Previous</span>
                      </div>
                      <pre className="overflow-x-auto text-[11px] font-mono text-slate-700 whitespace-pre-wrap max-h-52">
                        {selectedLog.before
                          ? JSON.stringify(selectedLog.before, null, 2)
                          : "(Initial creation or not recorded)"}
                      </pre>
                    </div>

                    {/* After state */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
                      <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/80 mb-2">
                        <span className="font-bold text-emerald-800">State After</span>
                        <span className="text-[10px] text-emerald-600 font-medium">Updated</span>
                      </div>
                      <pre className="overflow-x-auto text-[11px] font-mono text-emerald-900 whitespace-pre-wrap max-h-52">
                        {selectedLog.after
                          ? JSON.stringify(selectedLog.after, null, 2)
                          : "(Deleted or no payload)"}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-6 text-slate-400 italic">
                  No payload diff recorded for this event.
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
