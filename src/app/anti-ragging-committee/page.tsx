import React from "react";
import type { Metadata } from "next";
import { Shield, Phone, FileText, AlertTriangle, ExternalLink, Mail, Users } from "lucide-react";
import { getPublishedAntiRaggingPage } from "@/server/services/pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedAntiRaggingPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Anti-Ragging Committee | Geeta University",
    description:
      seo?.description ||
      "National Ragging Prevention Program at Geeta University. View contact details, helplines, and policies against ragging.",
    keywords: Array.isArray(seo?.keywords)
      ? (seo.keywords as string[])
      : [
          "Anti-Ragging Committee",
          "Geeta University anti ragging",
          "UGC anti ragging helpline",
          "ragging free campus",
        ],
    alternates: {
      canonical: seo?.canonical || "https://geetauniversity.edu.in/anti-ragging-committee/",
    },
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Anti-Ragging Committee | Geeta University",
      description:
        seo?.description ||
        "National Ragging Prevention Program at Geeta University. View contact details, helplines, and policies against ragging.",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : ["/anti-ragging.png"],
    },
  };
}

export default async function AntiRaggingPage() {
  const {
    hero,
    actionCards,
    nationalHelpline,
    ugcMonitoringAgency,
    regulatoryWarning,
    nodalOfficers,
  } = await getPublishedAntiRaggingPage();

  // Fallbacks for data safety
  const heroTitle = hero?.title || "Anti-Ragging Committee";
  const heroDescription =
    hero?.description ||
    "Geeta University is committed to providing a safe, secure, and ragging-free environment for all students. We strictly adhere to the National Ragging Prevention Program.";

  const cardsList = Array.isArray(actionCards?.cards)
    ? actionCards.cards
    : [
        {
          id: "poster",
          title: "Anti Ragging Poster",
          subtitle: "View official guidelines and posters",
          url: "https://geetauniversity.edu.in/uploads/all/388/Anti-Ragging-Poster.pdf",
          bgStyle: "navy",
        },
        {
          id: "committee-notification",
          title: "Anti Ragging Committee",
          subtitle: "View committee members & notification",
          url: "https://geetauniversity.edu.in/uploads/all/2073/Notification-Anti-Ragging-Committee.pdf",
          bgStyle: "orange",
        },
      ];

  const helplineHeading = nationalHelpline?.heading || "National Helpline";
  const tollFreeLabel = nationalHelpline?.tollFreeLabel || "24×7 Toll Free Number";
  const tollFreeNumber = nationalHelpline?.tollFreeNumber || "1800-180-5522";
  const helplineEmail = nationalHelpline?.email || "helpline@antiragging.in";
  const helplineWebsite = nationalHelpline?.website || "www.antiragging.in";
  const helplineWebsiteUrl = nationalHelpline?.websiteUrl || "http://www.antiragging.in";

  const agencyHeading = ugcMonitoringAgency?.heading || "UGC Monitoring Agency";
  const agencyLabel = ugcMonitoringAgency?.agencyLabel || "Agency Name";
  const agencyName = ugcMonitoringAgency?.agencyName || "Centre for Youth (C4Y)";
  const agencyEmail = ugcMonitoringAgency?.email || "antiragging@c4yindia.org";
  const agencyWebsite = ugcMonitoringAgency?.website || "www.c4yindia.org";
  const agencyWebsiteUrl = ugcMonitoringAgency?.websiteUrl || "http://www.c4yindia.org";
  const ugcWebsite = ugcMonitoringAgency?.ugcWebsite || "www.ugc.ac.in";
  const ugcWebsiteUrl = ugcMonitoringAgency?.ugcWebsiteUrl || "http://www.ugc.ac.in";

  const badgeText = regulatoryWarning?.badgeText || "CRIMINAL OFFENCE";
  const warningHeading =
    regulatoryWarning?.warningHeading ||
    "RAGGING IS A CRIMINAL OFFENCE AND THE CULPRITS WILL ATTRACT PUNITIVE ACTION AS MENTIONED IN THE UGC REGULATIONS";
  const regulationsLabel = regulatoryWarning?.regulationsLabel || "View Full Regulations:";
  const documentName = regulatoryWarning?.documentName || "Annexure-I Document";
  const documentUrl =
    regulatoryWarning?.documentUrl ||
    "https://www.antiragging.in/assets/pdf/annexure/Annexure-I.pdf";

  const nodalHeading = nodalOfficers?.heading || "Contact Details of the Nodal Officers";
  const nodalSubtitle =
    nodalOfficers?.subtitle || "Anti-Ragging Committee (ARC) | Anti-Ragging Squad (ARS)";

  return (
    
<div className="min-h-screen bg-slate-50 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
          <Shield className="w-10 h-10 text-[#0c2d4e]" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0A1F44] font-bold mb-6 tracking-tight">
          {heroTitle.includes("Committee") ? (
            <>
              Anti-Ragging <span className="text-[#E8871A]">Committee</span>
            </>
          ) : (
            heroTitle
          )}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
          {heroDescription}
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Quick Action Buttons */}
        {cardsList.length > 0 && (
          <section className="grid sm:grid-cols-2 gap-6 justify-center max-w-4xl mx-auto">
            {cardsList.map((card: any, idx: number) => {
              const isOrange = card.bgStyle === "orange" || idx % 2 === 1;
              return (
                <a
                  key={card.id || card.title || idx}
                  href={card.url || card.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden text-white p-6 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center gap-4 border ${
                    isOrange
                      ? "bg-gradient-to-r from-[#E8871A] to-[#F5A623] border-orange-500/50"
                      : "bg-[#0c2d4e] hover:bg-[#0A1F44] border-blue-900/50"
                  }`}
                >
                  <div
                    className={`p-4 rounded-xl transition-colors ${
                      isOrange ? "bg-white/20 group-hover:bg-white/30" : "bg-white/10 group-hover:bg-white/20"
                    }`}
                  >
                    {isOrange ? (
                      <Users className="w-7 h-7 text-white" />
                    ) : (
                      <FileText className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-xl">{card.title}</h3>
                    <p className={`text-sm mt-1 ${isOrange ? "text-orange-50" : "text-blue-200"}`}>
                      {card.subtitle || card.description}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              );
            })}
          </section>
        )}

        {/* Main Content Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Helpline Info */}
          <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100 relative overflow-hidden group hover:border-blue-100 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Phone className="w-32 h-32 text-[#0c2d4e]" />
            </div>

            <h2 className="font-serif text-2xl text-[#0c2d4e] font-bold mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#E8871A] rounded-full"></span>
              {helplineHeading}
            </h2>

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">
                  {tollFreeLabel}
                </p>
                <p className="font-bold text-4xl text-[#E8871A] tracking-tight">
                  {tollFreeNumber}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                {helplineEmail && (
                  <a
                    href={`mailto:${helplineEmail}`}
                    className="flex items-center gap-4 text-slate-600 hover:text-[#0c2d4e] transition-colors group/link"
                  >
                    <div className="p-3 bg-slate-50 rounded-xl group-hover/link:bg-blue-50 transition-colors">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-lg">{helplineEmail}</span>
                  </a>
                )}
                {helplineWebsite && (
                  <a
                    href={helplineWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-slate-600 hover:text-[#0c2d4e] transition-colors group/link"
                  >
                    <div className="p-3 bg-slate-50 rounded-xl group-hover/link:bg-blue-50 transition-colors">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-lg">{helplineWebsite}</span>
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* UGC Monitoring Agency */}
          <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100 relative overflow-hidden group hover:border-blue-100 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shield className="w-32 h-32 text-[#0c2d4e]" />
            </div>

            <h2 className="font-serif text-2xl text-[#0c2d4e] font-bold mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#E8871A] rounded-full"></span>
              {agencyHeading}
            </h2>

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">
                  {agencyLabel}
                </p>
                <p className="font-bold text-2xl text-[#0A1F44]">{agencyName}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                {agencyEmail && (
                  <a
                    href={`mailto:${agencyEmail}`}
                    className="flex items-center gap-4 text-slate-600 hover:text-[#0c2d4e] transition-colors group/link"
                  >
                    <div className="p-3 bg-slate-50 rounded-xl group-hover/link:bg-blue-50 transition-colors">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-lg">{agencyEmail}</span>
                  </a>
                )}
                {agencyWebsite && (
                  <a
                    href={agencyWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-slate-600 hover:text-[#0c2d4e] transition-colors group/link"
                  >
                    <div className="p-3 bg-slate-50 rounded-xl group-hover/link:bg-blue-50 transition-colors">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-lg">{agencyWebsite}</span>
                  </a>
                )}
                {ugcWebsite && (
                  <a
                    href={ugcWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-slate-600 hover:text-[#0c2d4e] transition-colors group/link"
                  >
                    <div className="p-3 bg-slate-50 rounded-xl group-hover/link:bg-blue-50 transition-colors">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-lg">{ugcWebsite}</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Warning Section */}
        <section className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 sm:p-12 border border-red-100 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute -top-10 -right-10 p-8 opacity-10 transform rotate-12">
            <AlertTriangle className="w-64 h-64 text-red-500" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-100 text-red-700 font-bold rounded-full mb-8 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
              {badgeText}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-red-950 font-bold mb-6 leading-tight">
              {warningHeading}
            </h2>

            <div className="mt-10 pt-8 border-t border-red-200/60">
              <p className="text-red-900 font-semibold mb-4 text-lg">{regulationsLabel}</p>
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-red-700 hover:text-white bg-white hover:bg-red-600 px-6 py-4 rounded-xl transition-all shadow-sm hover:shadow-md font-bold text-lg group"
              >
                <FileText className="w-5 h-5 group-hover:text-white text-red-500" />
                {documentName}
                <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </section>

        {/* Nodal Officers Info */}
        <section className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center hover:border-blue-100 transition-colors">
          <h3 className="font-serif text-2xl font-bold text-[#0A1F44] mb-4">{nodalHeading}</h3>
          <p className="text-slate-600 text-lg">{nodalSubtitle}</p>
        </section>
      </div>
    </div>
  );
}
