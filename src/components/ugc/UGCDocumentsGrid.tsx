import React from "react";
import { FileText, Presentation, FolderCheck, Video, Download, ExternalLink } from "lucide-react";
import { ugcDocuments as fallbackDocuments, UGCDocument } from "@/data/ugcData";

interface UGCDocumentsGridProps {
  title?: string;
  documents?: UGCDocument[] | null;
}

export default function UGCDocumentsGrid({ title, documents }: UGCDocumentsGridProps) {
  const sectionTitle = title || "Official UGC Performa & Inspection Files";
  const docsList = documents && documents.length > 0 ? documents : fallbackDocuments;

  const getDocumentIcon = (name: string) => {
    switch (name) {
      case "Presentation":
        return <Presentation className="h-7 w-7 text-[#E8871A]" />;
      case "FolderCheck":
        return <FolderCheck className="h-7 w-7 text-[#E8871A]" />;
      case "Video":
        return <Video className="h-7 w-7 text-[#E8871A]" />;
      default:
        return <FileText className="h-7 w-7 text-[#E8871A]" />;
    }
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#0A1F44] sm:text-4xl">
            {sectionTitle}
          </h2>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {docsList.map((doc) => (
            <div
              key={doc.id || doc.filename}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#F7F9FC] p-6 sm:p-8 transition-all duration-300 hover:border-[#E8871A]/50 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
                    {getDocumentIcon(doc.iconName)}
                  </div>
                  <span className="rounded-full bg-[#0A1F44] px-3 py-1 text-xs font-semibold text-white">
                    {doc.fileType}
                  </span>
                </div>

                <span className="block text-xs font-mono font-bold text-[#E8871A] mb-1">
                  {doc.filename}
                </span>

                <h3 className="font-serif text-xl font-bold text-[#0A1F44] mb-3 leading-snug">
                  {doc.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-sans mb-6">
                  {doc.description}
                </p>
              </div>

              <div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#E8871A] hover:text-white"
                  style={{ color: "#ffffff" }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download / View Document</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
