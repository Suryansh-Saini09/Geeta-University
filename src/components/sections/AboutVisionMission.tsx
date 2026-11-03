
import Image from "next/image";

const MISSION_POINTS = [
  "To inspire academic excellence through a student-centred and outcome-based teaching-learning process.",
  "To develop the right knowledge, skills, behaviour, and attitude among students.",
  "To promote interdisciplinary research.",
  "To establish a strong industry-academia connection.",
  "To nurture entrepreneurship and support the innovative ideas of students.",
];

interface AboutVisionMissionProps {
  data?: {
    bannerImage?: string;
    visionHeading?: string;
    visionStatement?: string;
    missionHeading?: string;
    missionPoints?: string[];
    identityTitle?: string;
    identityDescription?: string;
    saffronText?: string;
    blueText?: string;
    crestStatement?: string;
  } | null;
}

export default function AboutVisionMission({ data }: AboutVisionMissionProps) {
  const banner = data?.bannerImage || "/about/8.webp";
  const visionTitle = data?.visionHeading || "Our Vision";
  const visionStmt = data?.visionStatement || "“To reach the pinnacle of academic excellence and nurture the dreams and aspirations of students aspiring to evolve into well-rounded technocrats, professionals, scientists, leaders, and entrepreneurs dedicated to nation-building.”";
  const missionTitle = data?.missionHeading || "Our Mission";
  const missionList = data?.missionPoints && data.missionPoints.length > 0 ? data.missionPoints : MISSION_POINTS;
  const idTitle = data?.identityTitle || "Our Identity: Rooted In Legacy, Shaping The Future";
  const idDesc = data?.identityDescription || "At Geeta University, we offer a combination of a bold futuristic vision and the wisdom of the past. Our integration of innovation, technology, and global academic standards helps carry forward the legacy of India’s rich educational heritage.";
  const saffron = data?.saffronText || "Saffron symbolises the timeless knowledge of Indian saints — a nod to our deep-rooted cultural legacy.";
  const blue = data?.blueText || "Blue represents the future — driven by technology, openness, and the pursuit of academic excellence.";
  const crest = data?.crestStatement || "Our crest stands for courage, ambition, and transformation. It reflects Geeta University's commitment to being more than an institution. It presents Geeta University as a hub of knowledge where the future is imagined, nurtured, and realised. Here, students are not just prepared for the future — they learn to shape it.";

  return (
    <>
      {/* =========================================================
          POWERING EDUCATION BANNER
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#0A1F44]">
        <div className="relative h-[200px] w-full sm:h-[260px] md:h-[320px]">
          <Image
            src={banner}
            alt="Powering Education at Geeta University"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-[#0A1F44]/20" />
        </div>
      </section>

      {/* =========================================================
          VISION & MISSION
      ========================================================= */}

      <section
        id="vision-mission"
        className="scroll-mt-[190px] bg-[#F7F9FC] py-10 md:py-14"
      >
        <div className="gu-container">
          {/* Vision + Mission */}

          <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {/* Vision */}

            <article className="relative overflow-hidden rounded-2xl bg-[#0A1F44] p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#E8871A]" />
                <h2 className="text-xl font-bold uppercase tracking-wider text-white sm:text-2xl">
                  {visionTitle}
                </h2>
              </div>

              <div className="mt-2 h-1 w-12 rounded-full bg-[#E8871A]" />

              <blockquote className="mt-5 text-base sm:text-lg font-medium leading-relaxed text-white/90">
                {visionStmt}
              </blockquote>
            </article>

            {/* Mission */}

            <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#E8871A]" />
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#0A1F44] sm:text-2xl">
                  {missionTitle}
                </h2>
              </div>

              <div className="mt-2 h-1 w-12 rounded-full bg-[#E8871A]" />

              <div className="mt-5 space-y-3">
                {missionList.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8871A]" />
                    <p className="text-sm sm:text-base font-medium leading-relaxed text-[#334155]">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================
          INSTITUTIONAL IDENTITY
      ========================================================= */}

      <section
        id="identity"
        className="scroll-mt-[190px] relative overflow-hidden bg-white py-12 md:py-16"
      >
        <div className="gu-container relative">
          {/* Heading */}
          <div className="mx-auto mb-10 max-w-[900px] text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#0A1F44] sm:text-4xl md:text-[40px]">
              {idTitle}
            </h2>

            <p className="mx-auto mt-6 max-w-[820px] text-base leading-relaxed text-[#4A5568] sm:text-lg">
              {idDesc}
            </p>
          </div>

          {/* Identity strip */}
          <div className="relative my-12 mx-auto max-w-[1100px] overflow-hidden rounded-none shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[220px]">
              {/* Saffron side */}
              <div className="flex items-center justify-center bg-[#EA5823] p-8 sm:p-12 md:pr-24">
                <p className="text-center text-base sm:text-lg leading-relaxed text-white md:text-left">
                  {saffron}
                </p>
              </div>

              {/* Blue side */}
              <div className="flex items-center justify-center bg-[#092540] p-8 sm:p-12 md:pl-24">
                <p className="text-center text-base sm:text-lg leading-relaxed text-white md:text-left">
                  {blue}
                </p>
              </div>
            </div>

            {/* Center circle overlay */}
            <div className="absolute left-1/2 top-1/2 z-10 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#E2E8F0] bg-white p-3 text-center shadow-xl sm:h-44 sm:w-44 md:h-48 md:w-48">
              <p className="px-2 text-center text-xs font-semibold leading-snug text-[#2D3748] sm:px-4 sm:text-sm">
                Our theme colours reflect this philosophy.
              </p>
            </div>
          </div>

          {/* Crest statement */}
          <div className="mx-auto mt-12 max-w-[880px] text-center">
            <p className="text-base leading-relaxed text-[#4A5568] sm:text-lg md:text-[19px]">
              {crest}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
