
import React from "react";
import type { CourseCollaborations as CourseCollaborationsType, CollaborationOrganisation } from "@/data/programs/courses/types";

interface CourseCollaborationsProps {
  collaborations: CourseCollaborationsType;
}

export default function CourseCollaborations({
  collaborations,
}: CourseCollaborationsProps) {
  if (!collaborations || !collaborations.organisations) return null;

  return (
    <section className="w-full bg-white py-10 md:py-14 border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
            Global Connections
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0A1F44] mt-1">
            {collaborations.title}
          </h2>
          {collaborations.description && (
            <p className="text-slate-600 text-base mt-2 max-w-2xl">
              {collaborations.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collaborations.organisations.map((org: CollaborationOrganisation, idx: number) => (
            <div
              key={idx}
              className="p-6 rounded-lg bg-slate-50 border border-slate-200"
            >
              <h3 className="font-serif font-bold text-lg text-[#0A1F44] mb-1">
                {org.name}
              </h3>
              {org.type && (
                <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded mb-2">
                  {org.type}
                </span>
              )}
              <p className="text-slate-600 text-sm">{org.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
