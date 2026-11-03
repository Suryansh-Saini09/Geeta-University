import Image from "next/image";

interface VisionMissionProps {
  vision?: string;
  mission?: string[];
}

export default function VisionMission({ vision, mission }: VisionMissionProps) {
  const visionText = vision || "";
  const missionList = mission || [];

  return (
    <>
      <section className="w-full">
        <Image
          src="/about/8.webp"
          alt="Powering Education"
          width={1400}
          height={640}
          sizes="100vw"
          loading="lazy"
          className="h-auto w-full object-cover"
        />
      </section>

      <section
        id="vision-mission"
        className="scroll-mt-24 bg-slate-50 px-6 py-16 md:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#E8871A]">
              Who we are
            </p>

            <h2 className="mb-5 text-3xl font-bold text-[#0B2A4A]">
              Our Vision
            </h2>

            <p className="text-base leading-8 text-slate-600">
              “{visionText}”
            </p>
          </article>

          <article className="rounded-2xl bg-white p-8 shadow-sm md:p-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#E8871A]">
              Our direction
            </p>

            <h2 className="mb-5 text-3xl font-bold text-[#0B2A4A]">
              Our Mission
            </h2>

            <ul className="space-y-4 text-base leading-7 text-slate-600">
              {missionList.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#E8871A]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}