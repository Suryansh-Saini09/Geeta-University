
interface ScholarshipsSectionProps {
  data?: {
    title?: string;
    description?: string;
    criteria?: Array<{ title: string }>;
    buttonText?: string;
    buttonHref?: string;
    gutsLabel?: string;
    gutsTitle?: string;
    gutsDescription?: string;
    gutsButtonText?: string;
    gutsButtonHref?: string;
  } | null;
}

export default function ScholarshipsSection({ data }: ScholarshipsSectionProps) {
  const schTitle = data?.title || "Up to 100% Scholarships Available";
  const schDesc = data?.description || "Geeta University offers generous merit-based and need-based scholarship schemes to empower talented students across all academic disciplines.";
  const schCriteria = data?.criteria && data.criteria.length > 0 ? data.criteria : [
    { title: "Merit / Percentage in Qualifying Exams" },
    { title: "National Level Entrance Exams" },
    { title: "Social Responsibility & Single Child" },
    { title: "Sports & Cultural Performance" },
  ];
  const schBtnText = data?.buttonText || "Apply for Scholarship";
  const schBtnHref = data?.buttonHref || "https://admissions.geetauniversity.edu.in/";

  const gutsLbl = data?.gutsLabel || "GUTS 2026";
  const gutsTtl = data?.gutsTitle || "Geeta University Talent Search";
  const gutsDesc = data?.gutsDescription || "Take the GUTS test to unlock up to 100% tuition fee waivers and academic rewards.";
  const gutsBtnTxt = data?.gutsButtonText || "Register for GUTS";
  const gutsBtnHref = data?.gutsButtonHref || "https://admissions.geetauniversity.edu.in/";

  return (
    <section className="relative overflow-hidden bg-[#F5F8FA] py-12 md:py-16">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#F28C18]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#06355F]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main cards */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Scholarships card */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-[#06355F] p-7 shadow-xl sm:p-9 lg:p-10">
            {/* Decorative circles */}
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10"
            />

            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#F28C18]/20"
            />

            <div className="relative z-10">
              <h3 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                {schTitle}
              </h3>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                {schDesc}
              </p>

              {/* Scholarship criteria */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {schCriteria.map((criterion) => (
                  <div
                    key={criterion.title}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-all duration-300 hover:border-[#F28C18]/50 hover:bg-white/10"
                  >
                    <span
                      className="mt-1.5 flex h-2 w-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: "#F28C18",
                      }}
                    />
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-medium leading-5 text-white/90">
                        {criterion.title}
                        {criterion.title ===
                          "National Level Entrance Exams" && (
                          <span className="mt-1 block text-xs text-white/50">
                            JEE · CUET · NEET · CLAT & more
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <a
                  href={schBtnHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-[#F28C18] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#e47f0d] hover:shadow-xl"
                >
                  {schBtnText}

                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M4 10H16M10 4L16 10L10 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* GUTS card */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-[#DCE5EC] bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-9 lg:p-10">
            {/* Orange accent */}
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] bg-[#F28C18]/10"
            />

            <div className="relative z-10">
              {/* GUTS badge (Aligned to the left) */}
              <div className="flex items-center justify-start">
                <span className="inline-flex items-center justify-center rounded-full bg-[#06355F] px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-black tracking-[0.25em] text-white shadow-lg transition-transform duration-300 group-hover:scale-105 border border-white/10">
                  {gutsLbl}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-bold leading-tight text-[#06355F] sm:text-3xl">
                {gutsTtl}
              </h3>

              <p className="mt-5 text-sm leading-7 text-[#607284] sm:text-base">
                {gutsDesc}
              </p>

              {/* CTA */}
              <div className="mt-7">
                <a
                  href={gutsBtnHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border-2 border-[#06355F] px-6 py-3 text-sm font-bold text-[#06355F] transition-all duration-300 hover:-translate-y-1 hover:bg-[#06355F] hover:text-white"
                >
                  {gutsBtnTxt}

                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="M4 10H16M10 4L16 10L10 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}