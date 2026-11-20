"use client";

import React, { useState, useMemo } from "react";
import { saveProgramFeeAction, deleteProgramFeeAction } from "../actions";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  RefreshCw,
  Building2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface ProgramFeeRecord {
  id: string;
  feeScheduleId: string;
  departmentId?: string | null;
  programId?: string | null;
  schoolName: string;
  schoolCode: string;
  programName: string;
  programCode: string;
  specializationCode?: string | null;
  degreeLevel: string;
  durationYears?: string | null;
  totalFee: number;
  tuitionFee: number;
  developmentFee: number;
  scholarshipAllowed: boolean;
  status: string;
  sortOrder: number;
  sourceNotes?: string | null;
  validationStatus: string;
}

interface ScheduleOption {
  id: string;
  academicYear: string;
  title: string;
  isCurrent: boolean;
}

interface ProgramFeesTabProps {
  schedules: ScheduleOption[];
  initialProgramFees: ProgramFeeRecord[];
  onRefresh: () => void;
}

export function ProgramFeesTab({
  schedules,
  initialProgramFees,
  onRefresh,
}: ProgramFeesTabProps) {
  // Current selected schedule
  const defaultScheduleId = schedules.find((s) => s.isCurrent)?.id || schedules[0]?.id || "";
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(defaultScheduleId);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");

  // Edit / Create Modal state
  const [editingFee, setEditingFee] = useState<ProgramFeeRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter program fees by schedule, search, school, level
  const feesForSchedule = useMemo(() => {
    return initialProgramFees.filter((f) => f.feeScheduleId === selectedScheduleId);
  }, [initialProgramFees, selectedScheduleId]);

  const uniqueSchools = useMemo(() => {
    const map = new Map<string, string>();
    feesForSchedule.forEach((f) => {
      map.set(f.schoolCode, f.schoolName);
    });
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, [feesForSchedule]);

  const filteredFees = useMemo(() => {
    return feesForSchedule.filter((f) => {
      if (selectedSchool !== "ALL" && f.schoolCode !== selectedSchool) return false;
      if (selectedLevel !== "ALL" && f.degreeLevel !== selectedLevel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.programName.toLowerCase().includes(q);
        const matchesCode = f.programCode.toLowerCase().includes(q);
        const matchesSpec = f.specializationCode?.toLowerCase().includes(q);
        const matchesSchool = f.schoolName.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesSpec && !matchesSchool) return false;
      }
      return true;
    });
  }, [feesForSchedule, selectedSchool, selectedLevel, searchQuery]);

  // Modal form state
  const [modalForm, setModalForm] = useState<{
    id?: string;
    feeScheduleId: string;
    schoolName: string;
    schoolCode: string;
    programName: string;
    programCode: string;
    specializationCode: string;
    degreeLevel: string;
    durationYears: string;
    totalFee: number;
    tuitionFee: number;
    developmentFee: number;
    scholarshipAllowed: boolean;
    status: string;
    sortOrder: number;
    sourceNotes: string;
  }>({
    feeScheduleId: selectedScheduleId,
    schoolName: "",
    schoolCode: "01",
    programName: "",
    programCode: "",
    specializationCode: "",
    degreeLevel: "UG",
    durationYears: "4",
    totalFee: 0,
    tuitionFee: 0,
    developmentFee: 0,
    scholarshipAllowed: true,
    status: "PUBLISHED",
    sortOrder: 0,
    sourceNotes: "",
  });

  const openCreateModal = () => {
    setModalForm({
      feeScheduleId: selectedScheduleId,
      schoolName: uniqueSchools[0]?.name || "School of Computer Science and Engineering",
      schoolCode: uniqueSchools[0]?.code || "01",
      programName: "",
      programCode: "",
      specializationCode: "-",
      degreeLevel: "UG",
      durationYears: "4",
      totalFee: 100000,
      tuitionFee: 60000,
      developmentFee: 40000,
      scholarshipAllowed: true,
      status: "PUBLISHED",
      sortOrder: feesForSchedule.length + 1,
      sourceNotes: "",
    });
    setEditingFee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (fee: ProgramFeeRecord) => {
    setEditingFee(fee);
    setModalForm({
      id: fee.id,
      feeScheduleId: fee.feeScheduleId,
      schoolName: fee.schoolName,
      schoolCode: fee.schoolCode,
      programName: fee.programName,
      programCode: fee.programCode,
      specializationCode: fee.specializationCode || "-",
      degreeLevel: fee.degreeLevel,
      durationYears: fee.durationYears || "4",
      totalFee: fee.totalFee,
      tuitionFee: fee.tuitionFee,
      developmentFee: fee.developmentFee,
      scholarshipAllowed: fee.scholarshipAllowed,
      status: fee.status,
      sortOrder: fee.sortOrder,
      sourceNotes: fee.sourceNotes || "",
    });
    setIsModalOpen(true);
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    // Validation: Total = Tuition + Dev
    if (modalForm.totalFee !== modalForm.tuitionFee + modalForm.developmentFee) {
      alert("Error: Total Programme Fee must strictly equal Tuition Fee + Development Fee.");
      setSaving(false);
      return;
    }

    const res = await saveProgramFeeAction(modalForm as any);
    setSaving(false);

    if (res.success) {
      setIsModalOpen(false);
      setStatusMessage({ type: "success", text: "Program fee record successfully updated in MySQL!" });
      onRefresh();
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      alert(res.error || "Failed to save program fee");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete fee record for "${name}"?`)) return;

    const res = await deleteProgramFeeAction(id);
    if (res.success) {
      setStatusMessage({ type: "success", text: "Program fee record deleted." });
      onRefresh();
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      alert(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 md:p-8 shadow-xs">
        {/* Top Header & Schedule Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Program Fee Schedule Manager</h2>
            <p className="text-sm text-slate-500 mt-1">
              Search, filter, and independently edit semester programme fees, tuition fee splits, and scholarship eligibility flags.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Schedule:</span>
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="rounded-[8px] border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-[#0A1F44] outline-none focus:border-[#066191]"
              >
                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.academicYear} {s.isCurrent ? "(Active)" : `(${s.title.slice(0, 20)}...)`}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 rounded-[8px] bg-[#066191] hover:bg-[#054d74] text-white px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Program Fee
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-[12px] p-4 text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 p-4 rounded-[12px] bg-slate-50 border border-slate-200">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by program, code, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[8px] border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-[#066191]"
            />
          </div>

          {/* School Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#066191]"
            >
              <option value="ALL">All Schools ({uniqueSchools.length})</option>
              {uniqueSchools.map((s) => (
                <option key={s.code} value={s.code}>
                  [{s.code}] {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#066191]"
            >
              <option value="ALL">All Levels</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
              <option value="Diploma">Diploma / GNM</option>
              <option value="Ph.D">Doctoral (Ph.D)</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
          <span>
            Showing <strong>{filteredFees.length}</strong> of {feesForSchedule.length} fee records
          </span>
          <span className="text-[11px] text-slate-400">
            * Note: University scholarship rules strictly discount Tuition Fees only. Development fees are non-discountable.
          </span>
        </div>

        {/* Program Fees Table */}
        <div className="overflow-x-auto rounded-[12px] border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Code</th>
                <th className="py-3 px-3.5">Program Name</th>
                <th className="py-3 px-3.5">School</th>
                <th className="py-3 px-2 text-center">Lvl</th>
                <th className="py-3 px-2 text-center">Dur.</th>
                <th className="py-3 px-3.5 text-right font-black text-[#0A1F44]">Prog. Fee</th>
                <th className="py-3 px-3.5 text-right font-black text-[#066191]">Tuition Fee</th>
                <th className="py-3 px-3.5 text-right font-black text-slate-600">Dev. Fee</th>
                <th className="py-3 px-2 text-center">Scholarship</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-medium text-slate-700">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No program fee entries matched your filter.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => {
                  const isValid = fee.totalFee === fee.tuitionFee + fee.developmentFee;

                  return (
                    <tr
                      key={fee.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Codes */}
                      <td className="py-3 px-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        <div>{fee.programCode}</div>
                        {fee.specializationCode && fee.specializationCode !== "-" && (
                          <div className="text-[10px] text-indigo-600 font-semibold">{fee.specializationCode}</div>
                        )}
                      </td>

                      {/* Program Name */}
                      <td className="py-3 px-3.5 font-semibold text-slate-900 max-w-[280px]">
                        <div className="line-clamp-2">{fee.programName}</div>
                        {fee.sourceNotes && (
                          <div className="text-[10.5px] text-amber-700 font-normal line-clamp-1 mt-0.5">
                            {fee.sourceNotes}
                          </div>
                        )}
                      </td>

                      {/* School */}
                      <td className="py-3 px-3.5 text-slate-600 max-w-[180px] truncate text-[11.5px]">
                        [{fee.schoolCode}] {fee.schoolName}
                      </td>

                      {/* Level */}
                      <td className="py-3 px-2 text-center">
                        <span className="inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-bold text-slate-700">
                          {fee.degreeLevel}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-2 text-center text-slate-500 whitespace-nowrap">
                        {fee.durationYears ? `${fee.durationYears}y` : "-"}
                      </td>

                      {/* Total Fee */}
                      <td className="py-3 px-3.5 text-right font-bold text-[#0A1F44] whitespace-nowrap">
                        ₹ {fee.totalFee.toLocaleString("en-IN")}
                      </td>

                      {/* Tuition Fee */}
                      <td className="py-3 px-3.5 text-right font-bold text-[#066191] whitespace-nowrap">
                        ₹ {fee.tuitionFee.toLocaleString("en-IN")}
                      </td>

                      {/* Development Fee */}
                      <td className="py-3 px-3.5 text-right font-medium text-slate-600 whitespace-nowrap">
                        ₹ {fee.developmentFee.toLocaleString("en-IN")}
                      </td>

                      {/* Scholarship Allowed */}
                      <td className="py-3 px-2 text-center">
                        {fee.scholarshipAllowed ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-800">
                            Allowed
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10.5px] font-bold text-red-800">
                            Excluded
                          </span>
                        )}
                      </td>

                      {/* Validation */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isValid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600" title="Total = Tuition + Dev">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600" title="Total != Tuition + Dev">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Mismatch
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(fee)}
                            title="Edit Program Fee"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#066191] transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(fee.id, fee.programName)}
                            title="Delete Fee Record"
                            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-[16px] border border-slate-200 shadow-xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {editingFee ? `Edit Fee Record: ${editingFee.programCode}` : "Add New Program Fee Entry"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* School Name */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={modalForm.schoolName}
                    onChange={(e) => setModalForm({ ...modalForm, schoolName: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#066191]"
                    required
                  />
                </div>

                {/* School Code */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    School Code *
                  </label>
                  <input
                    type="text"
                    value={modalForm.schoolCode}
                    onChange={(e) => setModalForm({ ...modalForm, schoolCode: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#066191]"
                    required
                  />
                </div>

                {/* Program Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Full Program Name *
                  </label>
                  <input
                    type="text"
                    value={modalForm.programName}
                    onChange={(e) => setModalForm({ ...modalForm, programName: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#066191]"
                    required
                  />
                </div>

                {/* Program Code */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Program Code (e.g. 01-3-01) *
                  </label>
                  <input
                    type="text"
                    value={modalForm.programCode}
                    onChange={(e) => setModalForm({ ...modalForm, programCode: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#066191]"
                    required
                  />
                </div>

                {/* Specialization Code */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Specialization Code (e.g. 01-3-01-AIML or -)
                  </label>
                  <input
                    type="text"
                    value={modalForm.specializationCode}
                    onChange={(e) => setModalForm({ ...modalForm, specializationCode: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#066191]"
                  />
                </div>

                {/* Level & Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Degree Level *
                  </label>
                  <select
                    value={modalForm.degreeLevel}
                    onChange={(e) => setModalForm({ ...modalForm, degreeLevel: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#066191]"
                  >
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="Diploma">Diploma / GNM</option>
                    <option value="Ph.D">Doctoral (Ph.D)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Duration (in years)
                  </label>
                  <input
                    type="text"
                    value={modalForm.durationYears}
                    onChange={(e) => setModalForm({ ...modalForm, durationYears: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#066191]"
                  />
                </div>

                {/* FINANCIAL COMPONENTS */}
                <div className="sm:col-span-2 p-4 rounded-[12px] bg-blue-50/50 border border-blue-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Semester Fee Components (INR)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Total Programme Fee *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={modalForm.totalFee}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setModalForm((prev) => ({
                            ...prev,
                            totalFee: val,
                            // Auto-adjust dev fee if tuition exists
                            developmentFee: Math.max(0, val - prev.tuitionFee),
                          }));
                        }}
                        className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-[#0A1F44] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#066191] mb-1">
                        Tuition Fee (Discountable) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={modalForm.tuitionFee}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setModalForm((prev) => ({
                            ...prev,
                            tuitionFee: val,
                            developmentFee: Math.max(0, prev.totalFee - val),
                          }));
                        }}
                        className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-[#066191] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Development Fee (Non-disc.) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={modalForm.developmentFee}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setModalForm((prev) => ({
                            ...prev,
                            developmentFee: val,
                            totalFee: prev.tuitionFee + val,
                          }));
                        }}
                        className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none"
                        required
                      />
                    </div>
                  </div>

                  {modalForm.totalFee !== modalForm.tuitionFee + modalForm.developmentFee && (
                    <p className="text-[11px] font-semibold text-red-600 mt-2">
                      ⚠️ Mismatch detected: Tuition (₹{modalForm.tuitionFee}) + Dev (₹{modalForm.developmentFee}) = ₹{modalForm.tuitionFee + modalForm.developmentFee}, but Total is set to ₹{modalForm.totalFee}.
                    </p>
                  )}
                </div>

                {/* Scholarship Allowed & Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sch-allowed-toggle"
                    checked={modalForm.scholarshipAllowed}
                    onChange={(e) => setModalForm({ ...modalForm, scholarshipAllowed: e.target.checked })}
                    className="h-4 w-4 rounded-sm text-[#066191] cursor-pointer"
                  />
                  <label htmlFor="sch-allowed-toggle" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Scholarship Permitted for this Program
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={modalForm.status}
                    onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-1.5 text-xs text-slate-800 outline-none"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Footnotes / Source Notes (e.g. *, #, &amp;)
                  </label>
                  <input
                    type="text"
                    value={modalForm.sourceNotes}
                    onChange={(e) => setModalForm({ ...modalForm, sourceNotes: e.target.value })}
                    placeholder="# ACCA additional charges apply, * Statutory approval"
                    className="w-full rounded-[8px] border border-slate-300 px-3 py-1.5 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || modalForm.totalFee !== modalForm.tuitionFee + modalForm.developmentFee}
                  className="flex items-center gap-1.5 rounded-[8px] bg-[#066191] hover:bg-[#054d74] text-white px-5 py-2 text-xs font-semibold disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Program Fee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
