"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FileText, ChevronDown, ExternalLink, Users, Download } from "lucide-react";

export interface GovernanceTableColumn {
  key: string;
  label: string;
}

export interface GovernanceTableRow {
  id: string;
  cells: string[];
  sortOrder?: number;
}

export interface GovernanceTableData {
  version?: number;
  columns: GovernanceTableColumn[];
  rows: GovernanceTableRow[];
}

export interface GovernanceCommitteeItem {
  id: string | number;
  title: string;
  description?: string | null;
  documentUrl?: string | null;
  tableData?: GovernanceTableData | null;
  status?: string;
  sortOrder?: number;
}

export interface PolicyDocumentItem {
  id: string | number;
  title: string;
  description?: string | null;
  documentUrl: string;
}

interface GovernancePoliciesSectionProps {
  governanceData?: GovernanceCommitteeItem[] | null;
  policiesData?: PolicyDocumentItem[] | null;
}

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function GovernancePoliciesSection({
  governanceData,
  policiesData,
}: GovernancePoliciesSectionProps) {
  const committees = governanceData && governanceData.length > 0 ? governanceData : [];
  const policyDocs = policiesData && policiesData.length > 0 ? policiesData : [];

  // Track expanded committee accordions (first one open by default for rich initial preview)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [String(committees[0]?.id || "gov-1")]: true,
  });

  const toggleAccordion = (id: string | number) => {
    const key = String(id);
    setExpandedIds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#F8FAFC]
        py-12
        md:py-16
      "
    >
      {/* Background subtle blur gradients */}
      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-10
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#E8871A]/[0.04]
          blur-3xl
        "
      />
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-10
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#0A1F44]/[0.03]
          blur-3xl
        "
      />

      <div className="gu-container relative z-10 max-w-[1240px]">
        {/* ===================================================
            GOVERNANCE SECTION
        =================================================== */}
        <section id="governance" className="scroll-mt-[180px]">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-6 border-b border-[#E2E8F0] pb-4"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-[26px] font-black tracking-tight text-[#0A1F44] sm:text-[32px]">
                  Governance <span className="text-[#E8871A]">Structure</span>
                </h2>
                <p className="mt-1 text-sm text-[#4A5568]">
                  Statutory university councils, administrative boards, and executive governance committees.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Committee Accordion List */}
          <div className="flex flex-col gap-3.5">
            {committees.map((committee, index) => {
              const isOpen = Boolean(expandedIds[String(committee.id)]);
              const table = committee.tableData;
              const hasColumns = table && Array.isArray(table.columns) && table.columns.length > 0;
              const hasRows = table && Array.isArray(table.rows) && table.rows.length > 0;
              const memberCount = hasRows ? table.rows.length : 0;

              return (
                <motion.div
                  key={committee.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.35, delay: index * 0.04, ease: "easeOut" },
                    },
                  }}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#E2E8F0]
                    bg-white
                    shadow-[0_2px_12px_rgba(10,31,68,0.03)]
                    transition-all
                    duration-300
                    hover:border-[#E8871A]/40
                  "
                >
                  {/* Committee Header Button */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleAccordion(committee.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleAccordion(committee.id);
                      }
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`gov-panel-${committee.id}`}
                    id={`gov-header-${committee.id}`}
                    className={`
                      group
                      flex
                      cursor-pointer
                      items-center
                      justify-between
                      gap-4
                      p-4
                      sm:p-5
                      select-none
                      transition-colors
                      duration-200
                      ${isOpen ? "bg-[#F8FAFC]" : "hover:bg-[#F8FAFC]/60"}
                    `}
                  >
                    <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          transition-all
                          duration-300
                          ${
                            isOpen
                              ? "bg-[#E8871A] text-white shadow-md shadow-[#E8871A]/20"
                              : "bg-[#0A1F44]/[0.05] text-[#0A1F44] group-hover:bg-[#E8871A] group-hover:text-white"
                          }
                        `}
                      >
                        <Users size={20} strokeWidth={2} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className="
                              font-serif
                              text-[16px]
                              sm:text-[18px]
                              font-bold
                              leading-snug
                              text-[#0A1F44]
                              transition-colors
                              group-hover:text-[#E8871A]
                            "
                          >
                            {committee.title}
                          </h3>
                          {memberCount > 0 && (
                            <span
                              className="
                                inline-flex
                                items-center
                                rounded-full
                                bg-[#0A1F44]/[0.06]
                                px-2.5
                                py-0.5
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-[#0A1F44]
                              "
                            >
                              {memberCount} {memberCount === 1 ? "Member" : "Members"}
                            </span>
                          )}
                        </div>
                        {committee.description && !isOpen && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-[#64748B]">
                            {committee.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      {committee.documentUrl && committee.documentUrl.trim() !== "" && (
                        <a
                          href={committee.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="View Official Notification / Document (PDF)"
                          className="
                            hidden
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-[#E2E8F0]
                            bg-white
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-[#0A1F44]
                            shadow-sm
                            transition-all
                            hover:border-[#E8871A]
                            hover:bg-[#E8871A]
                            hover:text-white
                            sm:inline-flex
                          "
                        >
                          <FileText size={14} />
                          <span>PDF</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#E2E8F0]
                          bg-white
                          text-[#0A1F44]
                          shadow-sm
                          transition-transform
                          duration-300
                          ${isOpen ? "rotate-180 bg-[#0A1F44] text-white border-[#0A1F44]" : ""}
                        `}
                      >
                        <ChevronDown size={17} strokeWidth={2.2} />
                      </div>
                    </div>
                  </div>

                  {/* Expandable Table Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`gov-panel-${committee.id}`}
                        role="region"
                        aria-labelledby={`gov-header-${committee.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-[#E2E8F0] bg-white"
                      >
                        <div className="p-4 sm:p-6 space-y-4">
                          {/* Contextual description & mobile document link */}
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            {committee.description ? (
                              <p className="text-xs sm:text-sm text-[#4A5568]">
                                {committee.description}
                              </p>
                            ) : (
                              <span />
                            )}

                            {committee.documentUrl && committee.documentUrl.trim() !== "" && (
                              <a
                                href={committee.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                  inline-flex
                                  w-fit
                                  items-center
                                  gap-1.5
                                  rounded-lg
                                  bg-[#0A1F44]
                                  px-3.5
                                  py-2
                                  text-xs
                                  font-bold
                                  text-white
                                  shadow-sm
                                  transition-all
                                  hover:bg-[#E8871A]
                                "
                              >
                                <Download size={13} />
                                <span>Official Notification PDF</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>

                          {/* Responsive Table Container */}
                          {hasColumns && hasRows ? (
                            <div className="overflow-hidden rounded-xl border border-[#E2E8F0] shadow-sm">
                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[620px] text-left text-sm border-collapse">
                                  <thead>
                                    <tr className="bg-[#0A1F44] text-white border-b border-[#0A1F44]">
                                      {table.columns.map((col, cIdx) => (
                                        <th
                                          key={col.key || cIdx}
                                          scope="col"
                                          className={`
                                            px-4
                                            py-3.5
                                            font-serif
                                            text-[13px]
                                            sm:text-[14px]
                                            font-bold
                                            tracking-wide
                                            ${cIdx === 0 ? "w-[12%] min-w-[70px]" : ""}
                                            ${cIdx === 1 ? "w-[28%] min-w-[160px]" : ""}
                                            ${cIdx === 2 ? "w-[22%] min-w-[130px]" : ""}
                                          `}
                                        >
                                          {col.label}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                                    {table.rows.map((row, rIdx) => {
                                      const isEven = rIdx % 2 === 0;
                                      return (
                                        <tr
                                          key={row.id || rIdx}
                                          className={`
                                            transition-colors
                                            duration-150
                                            hover:bg-[#FFF7ED]
                                            ${isEven ? "bg-white" : "bg-[#F8FAFC]/80"}
                                          `}
                                        >
                                          {table.columns.map((col, cIdx) => {
                                            const cellValue = row.cells[cIdx] || "";
                                            const isRefOrSno = cIdx === 0;
                                            const isPositionOrRole = cIdx === 1 || cIdx === 2;

                                            return (
                                              <td
                                                key={`${row.id}-${col.key || cIdx}`}
                                                className={`
                                                  px-4
                                                  py-3.5
                                                  align-top
                                                  text-[13px]
                                                  sm:text-[14px]
                                                  leading-relaxed
                                                  text-[#1A202C]
                                                  whitespace-pre-line
                                                  ${isRefOrSno ? "font-bold text-[#0A1F44]" : ""}
                                                  ${isPositionOrRole ? "font-medium" : ""}
                                                `}
                                              >
                                                {cellValue}
                                              </td>
                                            );
                                          })}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-[#CBD5E1] p-6 text-center">
                              <p className="text-sm font-medium text-[#64748B]">
                                No membership entries currently published for this committee.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ===================================================
            DIVIDER
        =================================================== */}
        <div className="my-12 md:my-16">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#DCE2EB] to-transparent" />
        </div>

        {/* ===================================================
            POLICIES SECTION
        =================================================== */}
        <section id="policies" className="scroll-mt-[180px]">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-6 border-b border-[#E2E8F0] pb-4"
          >
            <h2 className="font-serif text-[26px] font-black tracking-tight text-[#0A1F44] sm:text-[32px]">
              University <span className="text-[#E8871A]">Policies</span>
            </h2>
            <p className="mt-1 text-sm text-[#4A5568]">
              Official institutional policies governing academics, research, integrity, and campus conduct.
            </p>
          </motion.div>

          {/* Policy Cards Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {policyDocs.map((document, index) => (
              <DocumentCard
                key={document.id}
                index={index}
                title={document.title}
                documentUrl={document.documentUrl}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

/* ============================================================
   SLEEK HORIZONTAL DOCUMENT CARD (FOR POLICIES)
============================================================ */

function DocumentCard({
  index,
  title,
  documentUrl,
}: {
  index: number;
  title: string;
  documentUrl: string;
}) {
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.04,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.a
      href={documentUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      className="
        group
        relative
        flex
        items-center
        justify-between
        gap-4
        overflow-hidden
        rounded-xl
        border
        border-[#E2E8F0]
        bg-white
        p-4
        sm:p-5
        shadow-[0_2px_10px_rgba(10,31,68,0.03)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#E8871A]/40
        hover:shadow-[0_10px_25px_rgba(10,31,68,0.08)]
      "
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#0A1F44]/[0.04]
            text-[#0A1F44]
            transition-colors
            duration-300
            group-hover:bg-[#E8871A]
            group-hover:text-white
          "
        >
          <FileText size={19} strokeWidth={1.75} />
        </div>

        <span
          className="
            font-serif
            text-[15px]
            sm:text-[16px]
            font-bold
            leading-snug
            text-[#0A1F44]
            transition-colors
            duration-300
            group-hover:text-[#E8871A]
          "
        >
          {title}
        </span>
      </div>

      <span
        className="
          shrink-0
          rounded-lg
          bg-[#0A1F44]
          px-4
          py-2
          text-[12px]
          font-bold
          text-white
          shadow-sm
          transition-all
          duration-300
          group-hover:bg-[#E8871A]
        "
      >
        View
      </span>

      {/* Hover bottom accent bar */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-[3px]
          w-0
          bg-[#E8871A]
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </motion.a>
  );
}