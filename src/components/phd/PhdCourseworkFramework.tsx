import React from "react";
import {
  BookOpen,
  FileText,
  Laptop,
  CalendarCheck,
  Calendar,
  FileCheck2,
  CheckCircle,
  CheckCircle2,
  Globe2,
  Info,
  Check,
} from "lucide-react";

export interface PhdCourseworkCardItem {
  id?: string;
  cardNumber: number | string;
  title: string;
  icon?: string;
  borderColor?: string;
  colSpan?: "half" | "full" | string;
  content?: string;
  paragraphs?: string[];
  description?: string;
  deliveryMode?: string;
  attendanceRequirement?: string;
  intro?: string;
  days?: string;
  mode?: string;
  timings?: string[];
  note?: string;
  assessments?: string[];
  midTermExamTitle?: string;
  midTermExamDetails?: string[];
  midTermExamNote?: string;
  endTermExamTitle?: string;
  endTermExamNote?: string;
  mandatoryTitle?: string;
  mandatoryPoints?: string[];
  guidelines?: string[];
  instructions?: string[];
  [key: string]: any;
}

export interface PhdCourseworkFrameworkProps {
  data?: {
    title?: string;
    description?: string;
    stipendText?: string;
    weekendClassesText?: string;
    cards?: PhdCourseworkCardItem[];
    [key: string]: any;
  };
}

export const defaultCourseworkCards: PhdCourseworkCardItem[] = [
  // Card 1: Background and Rationale
  {
    id: "card-1",
    cardNumber: 1,
    title: "1. Background and Rationale",
    icon: "book",
    borderColor: "#0E395C",
    colSpan: "half",
    paragraphs: [
      "Geeta University recognizes the growing need to promote research among working professionals, academicians, and industry practitioners who aspire to pursue doctoral studies while continuing their professional commitments.",
      "The Ph.D. Coursework Framework for Part-Time Scholars/International Scholars/Scholars from Industry backgrounds has been designed to ensure academic rigor, research integrity, and flexibility. The framework addresses the unique challenges faced by part-time scholars without compromising on the quality and depth of doctoral training.",
    ],
  },

  // Card 2: Structure of Ph.D. Coursework
  {
    id: "card-2",
    cardNumber: 2,
    title: "2. Structure of Ph.D. Coursework",
    icon: "journal-text",
    borderColor: "#ff5f19",
    colSpan: "half",
    description:
      "The Ph.D. coursework shall be conducted for six months and will include compulsory and discipline-specific courses as prescribed by the University.",
    deliveryMode: "Hybrid (Online + Offline)",
    attendanceRequirement: "Minimum 75% attendance in each course",
  },

  // Card 3: Class Schedule and Timings
  {
    id: "card-3",
    cardNumber: 3,
    title: "3. Class Schedule and Timings",
    icon: "calendar3",
    borderColor: "#28a745",
    colSpan: "half",
    intro: "To accommodate part-time scholars, classes will be conducted on weekends:",
    days: "Saturday and Sunday",
    mode: "Hybrid",
    timings: ["Saturday: 9:00 AM – 5:00 PM", "Sunday: 9:00 AM – 5:00 PM"],
    note: "Classes will include lectures, discussions, presentations, research exercises, and guided sessions. The detailed timetable will be circulated by the Ph.D. Cell before commencement of coursework.",
  },

  // Card 4: Assessment and Evaluation Scheme
  {
    id: "card-4",
    cardNumber: 4,
    title: "4. Assessment and Evaluation Scheme",
    icon: "file-earmark-check",
    borderColor: "#ff5f19",
    colSpan: "half",
    intro: "To ensure continuous evaluation and academic integrity, the following assessment pattern shall be followed:",
    assessments: ["Assessment 1", "Assessment 2"],
    midTermExamTitle: "4.2 Mid-Term Examination",
    midTermExamDetails: [
      "One Mid-Term Examination will be conducted.",
      "Venue: Geeta University Campus",
    ],
    midTermExamNote: "The schedule will be notified well in advance to enable scholars to plan travel.",
    endTermExamTitle: "4.3 End-Term Examination: Offline (Mandatory)",
    endTermExamNote:
      "The End-Term Examination for Ph.D. coursework shall be conducted in offline mode only over a period of three days.",
  },

  // Card 5: Completion of Coursework
  {
    id: "card-5",
    cardNumber: 5,
    title: "5. Completion of Coursework",
    icon: "check2-circle",
    borderColor: "#17a2b8",
    colSpan: "half",
    description:
      "Scholars must pass all coursework papers with the minimum qualifying marks as prescribed in the Ph.D. Regulations.",
    mandatoryTitle: "Successful completion of coursework is mandatory for:",
    mandatoryPoints: [
      "Registration confirmation",
      "Progression to research work",
      "Submission of synopsis",
    ],
  },

  // Card 6: Guidelines for International Scholars
  {
    id: "card-6",
    cardNumber: 6,
    title: "6. Guidelines for International Scholars",
    icon: "globe",
    borderColor: "#6f42c1",
    colSpan: "half",
    intro: "International Ph.D. scholars enrolled under part-time/full-time programmes are required to:",
    guidelines: [
      "Complete admission formalities and attend the orientation programme online, conducted by the Registrar Office in coordination with the International Help Desk.",
      "Remain in regular and continuous contact with their respective Research Supervisors. The validity of the entrance test result shall be one year only.",
      "Follow coursework guidelines as communicated by the University.",
      "Ensure compliance with visa norms, residency requirements, and additional conditions prescribed by the University or statutory bodies.",
      "Coordinate with the Supervisor regarding coursework progress, research planning, and physical presence on campus for assessments and examinations.",
      "Visit the University campus for 3–4 weeks towards the end of the semester to complete coursework modules and the Coursework Examination.",
      "Attend two DRC meetings each year, one in each semester. Physical presence is mandatory for at least one meeting. The second meeting may be conducted online upon the scholar's request, subject to approval by the DRC Chairperson.",
      "Foreign/NRI candidates who are not present in India at the time of the Entrance Test must achieve at least 5 in IELTS Academic, 60 in TOEFL, 150–154 in GRE, or 600 in GMAT, or qualify in another equivalent entrance test in their home country. Merit will be determined based on marks obtained at the 10+2, Bachelor's, and Master's degree levels.",
    ],
  },

  // Card 7: General Instructions
  {
    id: "card-7",
    cardNumber: 7,
    title: "7. General Instructions",
    icon: "info-circle",
    borderColor: "#0E395C",
    colSpan: "full",
    instructions: [
      "All scholars must regularly check official communications from the Ph.D. Cell.",
      "Any deviation from the prescribed structure shall require prior approval of the University authorities.",
      "The University reserves the right to modify the schedule or assessment pattern in accordance with academic and regulatory requirements.",
      "The Ph.D. Regulations of Geeta University, as amended and in force from time to time, shall be applicable and shall govern all matters relating to the Ph.D. programme, including, but not limited to, progress monitoring, pre-thesis submission, pre-submission seminar, thesis submission, evaluation, viva-voce, award of the Ph.D. degree, and all other academic, administrative, procedural, and regulatory requirements pertaining to the programme.",
    ],
  },
];

export default function PhdCourseworkFramework({ data }: PhdCourseworkFrameworkProps = {}) {
  const sectionTitle =
    data?.title ||
    "Ph.D. Coursework Framework for Part-Time Scholars/International Scholars";

  // Merge CMS cards with default definitions to guarantee complete rendering
  const cards: PhdCourseworkCardItem[] =
    Array.isArray(data?.cards) && data.cards.length > 0
      ? data.cards.map((c, idx) => ({
          ...(defaultCourseworkCards[idx] || {}),
          ...c,
        }))
      : defaultCourseworkCards;

  return (
    <section
      id="coursework-framework"
      className="w-full bg-white py-12 sm:py-16 md:py-20 border-t border-[#E2E8F0]"
    >
      <div className="gu-container space-y-12">
        {/* Main Framework Section */}
        <div>
          <h2
            className="font-serif text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#0E395C] leading-snug mb-8"
            style={{ fontFamily: "'Zilla Slab', serif" }}
          >
            {sectionTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, idx) => {
              const cardNumber = card.cardNumber || idx + 1;
              const borderColor = card.borderColor || "#0E395C";
              const isFullWidth = card.colSpan === "full" || String(cardNumber) === "7";

              return (
                <div
                  key={card.id || `coursework-card-${idx}`}
                  className={`h-full ${
                    isFullWidth ? "col-span-1 md:col-span-2" : "col-span-1"
                  }`}
                >
                  <div
                    className="p-5 sm:p-6 md:p-7 h-full rounded-2xl bg-[#f7f9fa] border border-[#eef2f6] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                    style={{ borderLeft: `5px solid ${borderColor}` }}
                  >
                    <div>
                      {/* Card Header with Icon */}
                      <h4
                        className="font-bold mb-4 text-[#0E395C] text-[18px] sm:text-[20px] flex items-center gap-2.5"
                        style={{ color: "#0E395C" }}
                      >
                        {String(cardNumber) === "1" && (
                          <BookOpen className="h-5 w-5 shrink-0" style={{ color: borderColor }} />
                        )}
                        {String(cardNumber) === "2" && (
                          <FileText className="h-5 w-5 shrink-0" style={{ color: borderColor }} />
                        )}
                        {String(cardNumber) === "3" && (
                          <Calendar className="h-5 w-5 shrink-0" style={{ color: borderColor }} />
                        )}
                        {String(cardNumber) === "4" && (
                          <FileCheck2 className="h-5 w-5 shrink-0" style={{ color: borderColor }} />
                        )}
                        {String(cardNumber) === "5" && (
                          <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: borderColor }} />
                        )}
                        {String(cardNumber) === "6" && (
                          <Globe2 className="h-5 w-5 shrink-0" style={{ color: borderColor }} />
                        )}
                        {String(cardNumber) === "7" && (
                          <Info className="h-5 w-5 shrink-0" style={{ color: borderColor }} />
                        )}
                        <span>{card.title}</span>
                      </h4>

                      {/* Card 1: Background & Rationale */}
                      {String(cardNumber) === "1" && (
                        <div className="text-[15px] text-[#334155] leading-[1.7] space-y-3.5">
                          {Array.isArray(card.paragraphs) && card.paragraphs.length > 0 ? (
                            card.paragraphs.map((p, pIdx) => <p key={pIdx}>{p}</p>)
                          ) : card.content ? (
                            card.content
                              .split(/\n\s*\n/)
                              .map((p, pIdx) => <p key={pIdx}>{p}</p>)
                          ) : (
                            <>
                              <p>
                                Geeta University recognizes the growing need to promote research
                                among working professionals, academicians, and industry
                                practitioners who aspire to pursue doctoral studies while continuing
                                their professional commitments.
                              </p>
                              <p>
                                The Ph.D. Coursework Framework for Part-Time
                                Scholars/International Scholars/Scholars from Industry backgrounds
                                has been designed to ensure academic rigor, research integrity, and
                                flexibility. The framework addresses the unique challenges faced by
                                part-time scholars without compromising on the quality and depth of
                                doctoral training.
                              </p>
                            </>
                          )}
                        </div>
                      )}

                      {/* Card 2: Structure of Ph.D. Coursework */}
                      {String(cardNumber) === "2" && (
                        <div className="space-y-4">
                          <p className="text-[15px] text-[#334155] leading-[1.7]">
                            {card.description ||
                              "The Ph.D. coursework shall be conducted for six months and will include compulsory and discipline-specific courses as prescribed by the University."}
                          </p>
                          <ul className="space-y-3 ps-0 mb-0 text-[15px] text-[#334155]">
                            <li className="flex items-start gap-2.5">
                              <Laptop
                                className="h-5 w-5 mt-0.5 shrink-0"
                                style={{ color: borderColor }}
                              />
                              <div>
                                <strong className="text-[#0E395C]">Mode of Delivery:</strong>{" "}
                                {card.deliveryMode || "Hybrid (Online + Offline)"}
                              </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <CalendarCheck
                                className="h-5 w-5 mt-0.5 shrink-0"
                                style={{ color: borderColor }}
                              />
                              <div>
                                <strong className="text-[#0E395C]">Attendance Requirement:</strong>{" "}
                                {card.attendanceRequirement || "Minimum 75% attendance in each course"}
                              </div>
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* Card 3: Class Schedule and Timings */}
                      {String(cardNumber) === "3" && (
                        <div className="space-y-3.5">
                          <p className="text-[15px] text-[#334155] leading-[1.7]">
                            {card.intro ||
                              "To accommodate part-time scholars, classes will be conducted on weekends:"}
                          </p>
                          <ul className="space-y-2 ps-0 text-[15px] text-[#334155]">
                            <li>
                              <strong className="text-[#0E395C]">Days:</strong>{" "}
                              {card.days || "Saturday and Sunday"}
                            </li>
                            <li>
                              <strong className="text-[#0E395C]">Mode:</strong>{" "}
                              {card.mode || "Hybrid"}
                            </li>
                            <li>
                              <strong className="text-[#0E395C]">Timings:</strong>
                              <ul className="ps-4 mt-1.5 space-y-1 list-disc text-[14.5px] text-[#475569]">
                                {(
                                  card.timings || [
                                    "Saturday: 9:00 AM – 5:00 PM",
                                    "Sunday: 9:00 AM – 5:00 PM",
                                  ]
                                ).map((t, tIdx) => (
                                  <li key={tIdx}>{t}</li>
                                ))}
                              </ul>
                            </li>
                          </ul>
                          <p className="pt-2 text-[13.5px] text-[#64748B] leading-[1.6]">
                            {card.note ||
                              "Classes will include lectures, discussions, presentations, research exercises, and guided sessions. The detailed timetable will be circulated by the Ph.D. Cell before commencement of coursework."}
                          </p>
                        </div>
                      )}

                      {/* Card 4: Assessment and Evaluation Scheme */}
                      {String(cardNumber) === "4" && (
                        <div className="space-y-4">
                          <p className="text-[15px] text-[#334155] leading-[1.7]">
                            {card.intro ||
                              "To ensure continuous evaluation and academic integrity, the following assessment pattern shall be followed:"}
                          </p>

                          {/* 4.1 Assessments */}
                          <div>
                            <strong className="text-[#0E395C] block text-[15px] mb-2">
                              4.1 Assessments
                            </strong>
                            <ul className="space-y-2 ps-0 text-[14.5px] text-[#334155]">
                              {(card.assessments || ["Assessment 1", "Assessment 2"]).map(
                                (asmt, aIdx) => (
                                  <li key={aIdx} className="flex items-center gap-2">
                                    <CheckCircle
                                      className="h-4 w-4 shrink-0"
                                      style={{ color: borderColor }}
                                    />
                                    <span>{asmt}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>

                          {/* 4.2 Mid-Term Examination */}
                          <div>
                            <strong className="text-[#0E395C] block text-[15px] mb-1.5">
                              {card.midTermExamTitle || "4.2 Mid-Term Examination"}
                            </strong>
                            <ul className="ps-4 space-y-1 list-disc text-[14.5px] text-[#334155]">
                              {(
                                card.midTermExamDetails || [
                                  "One Mid-Term Examination will be conducted.",
                                  "Venue: Geeta University Campus",
                                ]
                              ).map((detail, dIdx) => (
                                <li key={dIdx}>{detail}</li>
                              ))}
                            </ul>
                            <p className="mt-1.5 text-[13px] text-[#64748B] leading-[1.6]">
                              {card.midTermExamNote ||
                                "The schedule will be notified well in advance to enable scholars to plan travel."}
                            </p>
                          </div>

                          {/* 4.3 End-Term Examination */}
                          <div className="border-t border-[#e2e8f0] pt-3">
                            <strong className="text-[#0E395C] block text-[15px] mb-1">
                              {card.endTermExamTitle || "4.3 End-Term Examination: Offline (Mandatory)"}
                            </strong>
                            <p className="text-[13.5px] text-[#475569] leading-[1.6]">
                              {card.endTermExamNote ||
                                "The End-Term Examination for Ph.D. coursework shall be conducted in offline mode only over a period of three days."}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Card 5: Completion of Coursework */}
                      {String(cardNumber) === "5" && (
                        <div className="space-y-4">
                          <p className="text-[15px] text-[#334155] leading-[1.7]">
                            {card.description ||
                              "Scholars must pass all coursework papers with the minimum qualifying marks as prescribed in the Ph.D. Regulations."}
                          </p>

                          <strong className="block text-[#0E395C] text-[15px]">
                            {card.mandatoryTitle || "Successful completion of coursework is mandatory for:"}
                          </strong>

                          <ul className="space-y-3 ps-0 mb-0 text-[14.5px] text-[#334155]">
                            {(
                              card.mandatoryPoints || [
                                "Registration confirmation",
                                "Progression to research work",
                                "Submission of synopsis",
                              ]
                            ).map((point, ptIdx) => (
                              <li key={ptIdx} className="flex items-start gap-2.5">
                                <CheckCircle2
                                  className="h-5 w-5 mt-0.5 shrink-0"
                                  style={{ color: borderColor }}
                                />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Card 6: Guidelines for International Scholars */}
                      {String(cardNumber) === "6" && (
                        <div className="space-y-3.5">
                          <p className="text-[15px] text-[#334155] leading-[1.7]">
                            {card.intro ||
                              "International Ph.D. scholars enrolled under part-time/full-time programmes are required to:"}
                          </p>

                          <ul className="ps-4 mb-0 space-y-2 list-disc text-[13.5px] text-[#475569] leading-[1.7]">
                            {(
                              card.guidelines || [
                                "Complete admission formalities and attend the orientation programme online, conducted by the Registrar Office in coordination with the International Help Desk.",
                                "Remain in regular and continuous contact with their respective Research Supervisors. The validity of the entrance test result shall be one year only.",
                                "Follow coursework guidelines as communicated by the University.",
                                "Ensure compliance with visa norms, residency requirements, and additional conditions prescribed by the University or statutory bodies.",
                                "Coordinate with the Supervisor regarding coursework progress, research planning, and physical presence on campus for assessments and examinations.",
                                "Visit the University campus for 3–4 weeks towards the end of the semester to complete coursework modules and the Coursework Examination.",
                                "Attend two DRC meetings each year, one in each semester. Physical presence is mandatory for at least one meeting. The second meeting may be conducted online upon the scholar's request, subject to approval by the DRC Chairperson.",
                                "Foreign/NRI candidates who are not present in India at the time of the Entrance Test must achieve at least 5 in IELTS Academic, 60 in TOEFL, 150–154 in GRE, or 600 in GMAT, or qualify in another equivalent entrance test in their home country. Merit will be determined based on marks obtained at the 10+2, Bachelor's, and Master's degree levels.",
                              ]
                            ).map((g, gIdx) => (
                              <li key={gIdx}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Card 7: General Instructions */}
                      {String(cardNumber) === "7" && (
                        <div>
                          <ul className="space-y-3.5 ps-0 mb-0 text-[14.5px] text-[#334155] leading-[1.8]">
                            {(
                              card.instructions || [
                                "All scholars must regularly check official communications from the Ph.D. Cell.",
                                "Any deviation from the prescribed structure shall require prior approval of the University authorities.",
                                "The University reserves the right to modify the schedule or assessment pattern in accordance with academic and regulatory requirements.",
                                "The Ph.D. Regulations of Geeta University, as amended and in force from time to time, shall be applicable and shall govern all matters relating to the Ph.D. programme, including, but not limited to, progress monitoring, pre-thesis submission, pre-submission seminar, thesis submission, evaluation, viva-voce, award of the Ph.D. degree, and all other academic, administrative, procedural, and regulatory requirements pertaining to the programme.",
                              ]
                            ).map((inst, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2.5">
                                <CheckCircle2
                                  className="h-5 w-5 mt-1 shrink-0"
                                  style={{ color: borderColor }}
                                />
                                <span>{inst}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full-Time Scholarship Stipend Banner */}
        <div className="rounded-[24px] bg-[#0A1F44] p-8 sm:p-10 text-white shadow-xl">
          <h3 className="font-serif text-[26px] sm:text-[32px] md:text-[34px] font-bold text-white">
            Scholarship &amp; Stipend for Full-Time Ph.D. Scholars
          </h3>
          <div className="mt-4 space-y-2.5 text-[15px] sm:text-[16px] text-[#E2E8F0] max-w-3xl">
            {data?.stipendText && (
              <p className="text-amber-400 font-bold mb-3 text-base">
                {data.stipendText}
              </p>
            )}
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#E8871A] mt-2 shrink-0" />
              <p>
                <strong className="text-white">₹40,000 stipend per month:</strong> For postgraduate scholars who have completed their Master’s degree from IITs / IIMs / NITs, based on academic merit and selection performance.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-[#E8871A] mt-2 shrink-0" />
              <p>
                <strong className="text-white">Up to ₹30,000 stipend per month:</strong> For postgraduate scholars from other recognized institutions, based on academic merit and performance in the selection process.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column: Program Duration & Why Choose Geeta University */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-[20px] bg-white p-6 sm:p-8 border border-[#E2E8F0] shadow-sm">
            <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0A1F44] mb-4">
              Program Duration
            </h3>
            <p className="text-[15.5px] leading-relaxed text-[#334155]">
              The Ph.D. Program shall be for a minimum duration of <strong>three (3) years</strong>, including coursework, and a maximum duration of <strong>six (6) years</strong> from the date of admission to the doctoral program.
            </p>
          </div>

          <div className="rounded-[20px] bg-white p-6 sm:p-8 border border-[#E2E8F0] shadow-sm">
            <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0A1F44] mb-4">
              Why Choose Geeta University for Ph.D.?
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[14.5px] text-[#334155]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Experienced &amp; Industry-Aligned Faculty</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Smart Research &amp; Computational Facilities</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Well-equipped Labs &amp; Centers of Excellence</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Guidance for Patents &amp; Copyrights</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>Multi-disciplinary Research Culture</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>International Collaboration &amp; Exposure</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
