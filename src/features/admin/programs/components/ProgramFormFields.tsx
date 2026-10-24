import React from "react";
import { ContentStatus } from "@prisma/client";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

export interface ProgramFieldDefaults {
  departmentId?: string;
  name?: string;
  slug?: string;
  level?: string | null;
  duration?: string | null;
  eligibility?: string | null;
}

export interface DepartmentOption {
  id: string;
  name: string;
  shortName?: string | null;
}

export function ProgramFields({
  departments,
  defaults,
}: {
  departments: DepartmentOption[];
  defaults?: ProgramFieldDefaults;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label
          htmlFor="departmentId"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Department
        </label>
        <select
          id="departmentId"
          name="departmentId"
          required
          defaultValue={defaults?.departmentId ?? ""}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        >
          <option value="" disabled>
            Select department
          </option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.shortName
                ? `${department.name} (${department.shortName})`
                : department.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Program name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaults?.name ?? ""}
          placeholder="B.Tech Computer Science and Engineering"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          URL slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={defaults?.slug ?? ""}
          placeholder="btech-computer-science-engineering"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>

      <div>
        <label
          htmlFor="level"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Level
        </label>
        <input
          id="level"
          name="level"
          defaultValue={defaults?.level ?? ""}
          placeholder="UG / PG / Ph.D."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>

      <div>
        <label
          htmlFor="duration"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Duration
        </label>
        <input
          id="duration"
          name="duration"
          defaultValue={defaults?.duration ?? ""}
          placeholder="4 Years"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="eligibility"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Eligibility
        </label>
        <textarea
          id="eligibility"
          name="eligibility"
          rows={5}
          defaultValue={defaults?.eligibility ?? ""}
          placeholder="Eligibility criteria for the program."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>
    </div>
  );
}

export function ProgramPublishingPanel({
  defaultStatus,
  defaultSortOrder,
  buttonLabel,
}: {
  defaultStatus: ContentStatus;
  defaultSortOrder: number;
  buttonLabel: string;
}) {
  return (
    <aside className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
          Publishing
        </h3>

        <div className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={defaultStatus}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
            >
              <option value={ContentStatus.DRAFT}>Draft</option>
              <option value={ContentStatus.PUBLISHED}>Published</option>
              <option value={ContentStatus.ARCHIVED}>Archived</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sortOrder"
              className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
            >
              Sort order
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={defaultSortOrder}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
            />
          </div>

          <CmsSubmitButton
            label={buttonLabel}
            loadingLabel="Saving..."
            iconType="save"
            className="w-full py-3"
          />
        </div>
      </section>
    </aside>
  );
}
