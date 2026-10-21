import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Save, ExternalLink } from "lucide-react";

import { updateMediaAction } from "@/features/admin/media/actions";
import { getAdminMediaById } from "@/server/services/media";

export default async function EditMediaPage({
  params,
  searchParams,
}: {
  params: Promise<{ mediaId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { mediaId } = await params;
  const decodedId = decodeURIComponent(mediaId);
  const [{ error }, asset] = await Promise.all([
    searchParams,
    getAdminMediaById(decodedId),
  ]);

  if (!asset) notFound();

  const isImage = asset.mimeType.startsWith("image/");
  const formattedSize =
    asset.sizeBytes > 1024 * 1024
      ? `${(asset.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(asset.sizeBytes / 1024)} KB`;

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/media"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0A1F44] transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to media
      </Link>

      <div>
        <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">{asset.fileName}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="font-mono">{asset.url}</span>
          <span>•</span>
          <span>{asset.mimeType}</span>
          <span>•</span>
          <span>{formattedSize}</span>
          {asset.isReferenced || asset.usageCount > 0 ? (
            <>
              <span>•</span>
              <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                In Use ({asset.usageCount} reference{asset.usageCount === 1 ? "" : "s"})
              </span>
            </>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
            {isImage ? (
              <Image
                src={asset.url}
                alt={asset.altText ?? asset.fileName}
                width={280}
                height={280}
                unoptimized
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <FileText className="h-16 w-16 text-rose-500" />
                <span className="text-xs font-bold uppercase">{asset.extension} Document</span>
              </div>
            )}
          </div>
          <a
            href={asset.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" /> Open Full Asset
          </a>
        </div>

        <form action={updateMediaAction} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
          <input type="hidden" name="id" value={asset.id} />

          <div>
            <label htmlFor="altText" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Image Alt Text {isImage && <span className="text-red-500">*</span>}
            </label>
            <input
              id="altText"
              name="altText"
              maxLength={300}
              required={isImage}
              defaultValue={asset.altText ?? ""}
              placeholder="Descriptive alt text for accessibility and search..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
            <p className="mt-1 text-xs text-slate-400">
              Used by screen readers and indexed for media search.
            </p>
          </div>

          <div>
            <label htmlFor="caption" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Caption
            </label>
            <textarea
              id="caption"
              name="caption"
              rows={3}
              maxLength={500}
              defaultValue={asset.caption ?? ""}
              placeholder="Optional caption or notes..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
            <p className="mt-1 text-xs text-slate-400">
              Optional display caption shown in gallery albums and searchable.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#1A3A6B] transition"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
