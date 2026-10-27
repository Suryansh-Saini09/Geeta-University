import type { Metadata } from "next";
import Image from "next/image";
import { fetchSocialData, SocialLink, SocialProfile } from "@/lib/socialLinks";
import { ChevronRight, Star, Globe, MessageCircle, Radio, GraduationCap, Compass } from "lucide-react";
import { serverLogger } from "@/lib/security/logger";

export const metadata: Metadata = {
  title: "Connect with Geeta University",
  description: "Connect with Geeta University through our official digital channels.",
  alternates: {
    canonical: "https://geetauniversity.edu.in/social-links/",
  },
};

function PlatformIcon({ iconKey, name, type }: { iconKey: string; name: string; type: string }) {
  const key = (iconKey || name || type).toLowerCase();

  if (key.includes("whatsapp") && key.includes("channel")) {
    return (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ color: "#25D366", backgroundColor: "#25D36615" }}
      >
        <Radio className="w-6 h-6" />
      </div>
    );
  }

  if (key.includes("whatsapp")) {
    return (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ color: "#25D366", backgroundColor: "#25D36615" }}
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>
    );
  }

  if (key.includes("facebook")) {
    return (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ color: "#1877F2", backgroundColor: "#1877F215" }}
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
    );
  }

  if (key.includes("instagram")) {
    return (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ color: "#E4405F", backgroundColor: "#E4405F15" }}
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </div>
    );
  }

  if (key.includes("youtube")) {
    return (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ color: "#FF0000", backgroundColor: "#FF000015" }}
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }

  if (key.includes("linkedin")) {
    return (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ color: "#0A66C2", backgroundColor: "#0A66C215" }}
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </div>
    );
  }

  if (key.includes("gu") || key.includes("review") || key.includes("google") || key.includes("star")) {
    return (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ color: "#FFB800", backgroundColor: "#FFB80015" }}
      >
        <Star className="w-6 h-6 fill-current" />
      </div>
    );
  }

  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-transform duration-300 group-hover:scale-110"
      style={{ color: "#012E55", backgroundColor: "#012E5515" }}
    >
      <Globe className="w-6 h-6" />
    </div>
  );
}

export default async function SocialLinksPage() {
  let profile: SocialProfile | null = null;
  let links: SocialLink[] = [];

  try {
    const json = await fetchSocialData();
    if (json.success && json.data) {
      profile = json.data.profile || null;
      if (Array.isArray(json.data.links)) {
        links = json.data.links
          .filter((link) => link.enabled)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      }
    }
  } catch (err) {
    serverLogger.error("Failed to load social links from API", err, { module: "SocialLinks", action: "loadPage" });
  }

  // Group links by category (defaulting to "Official Social Media" & "Reviews & Platforms")
  const socialMediaLinks = links.filter(
    (link) => !link.category || link.category.toLowerCase().includes("social")
  );
  const reviewLinks = links.filter(
    (link) => link.category && (link.category.toLowerCase().includes("review") || link.category.toLowerCase().includes("platform"))
  );

  // If no category split matched, put all links in socialMediaLinks
  const hasSplit = socialMediaLinks.length > 0 && reviewLinks.length > 0;
  const categoriesToDisplay = hasSplit
    ? [
        { title: "Official Social Media", items: socialMediaLinks },
        { title: "Reviews & Platforms", items: reviewLinks },
      ]
    : [{ title: "Official Digital Channels", items: links }];

  const heroBg = profile?.heroImage || "/uploads/all/2080/campus.webp";
  const logoUrl = profile?.logo || "/uploads/all/754/GU-Logo-PNG-(1).webp";
  const title = profile?.name || "Geeta University";
  const tagline = profile?.tagline || "Empowering Minds. Transforming Futures.";

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16 font-sans text-slate-900">
      {/* HERO SECTION */}
      <header
        className="relative py-24 sm:py-28 px-4 text-center bg-cover bg-center bg-no-repeat sm:bg-fixed"
        style={{ backgroundImage: `url('${heroBg}')` }}
      >
        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(1, 46, 85, 0.78), rgba(1, 46, 85, 0.50))",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-20 max-w-3xl mx-auto space-y-4">
          <div className="inline-block bg-white px-6 py-3 rounded-2xl shadow-2xl border border-white/20 mb-3">
            <Image
              src={logoUrl}
              alt={title}
              width={220}
              height={70}
              className="h-auto max-w-[200px] sm:max-w-[220px] object-contain"
              priority
            />
          </div>

          <h1
            className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight"
            style={{ fontFamily: "'Zilla Slab', Georgia, serif" }}
          >
            {title}
          </h1>

          <p className="text-base sm:text-xl text-[#e0e6ed] font-normal max-w-xl mx-auto">
            {tagline}
          </p>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="relative z-30 max-w-[1200px] mx-auto px-4 sm:px-6 -mt-10">
        {categoriesToDisplay.map((catGroup) => (
          <section
            key={catGroup.title}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] mb-8 sm:mb-10"
          >
            {/* Section Header */}
            <div className="relative pb-4 mb-7 border-b-2 border-slate-100">
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#012E55]"
                style={{ fontFamily: "'Zilla Slab', Georgia, serif" }}
              >
                {catGroup.title}
              </h2>
              <div className="absolute bottom-[-2px] left-0 w-16 h-[4px] bg-gradient-to-r from-[#FF6325] to-[#ff8a54] rounded-full" />
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {catGroup.items.map((link) => {
                const isReview = link.type === "gu" || link.name.toLowerCase().includes("review");
                const cardTitle = isReview ? "Google Reviews" : link.name;
                const cardDesc = isReview ? "Read or write reviews for Geeta University" : link.description;

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.target || "_blank"}
                    rel="noopener noreferrer"
                    className="group flex items-center p-5 bg-white border border-[#eef2f6] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#012E55] hover:shadow-[0_15px_35px_rgba(1,46,85,0.08)]"
                  >
                    <PlatformIcon iconKey={link.icon} name={link.name} type={link.type} />

                    <div className="ml-4 flex-1 min-w-0 pr-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#012E55] group-hover:text-[#FF6325] transition-colors truncate mb-1">
                        {cardTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {cardDesc}
                      </p>
                    </div>

                    <div className="text-slate-400 group-hover:text-[#FF6325] group-hover:translate-x-1 transition-all shrink-0">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
