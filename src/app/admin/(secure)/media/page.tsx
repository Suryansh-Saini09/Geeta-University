import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Pencil,
  Search,
  Upload,
  LayoutGrid,
  List,
  ExternalLink,
  Copy,
  CheckCircle,
  Video,
  Folder,
  SlidersHorizontal,
  X,
  FileCheck,
} from "lucide-react";

import DeleteMediaButton from "@/components/admin/DeleteMediaButton";
import { uploadMediaAction } from "@/features/admin/media/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import {
  getAdminMedia,
  type MediaCategory,
  type MediaSortOption,
} from "@/server/services/media";

export const dynamic = "force-dynamic";

interface AdminMediaPageProps {
  searchParams: Promise<{
    q?: string;
    kind?: string;
    dir?: string;
    usage?: string;
    sort?: string;
    view?: string;
    page?: string;
    uploaded?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
}

export default async function AdminMediaPage({ searchParams }: AdminMediaPageProps) {
  const [params, session] = await Promise.all([searchParams, requireAdminSession()]);

  const query = params.q?.trim() ?? "";
  const kind: MediaCategory =
    params.kind === "IMAGE" || params.kind === "PDF" || params.kind === "VIDEO"
      ? params.kind
      : "ALL";
  const directory = params.dir?.trim() ?? "";
  const usage =
    params.usage === "USED" || params.usage === "UNUSED" ? params.usage : "ALL";
  const sort = (params.sort as MediaSortOption) || "newest";
  const view = params.view === "table" ? "table" : "grid";
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const result = await getAdminMedia({
    query,
    kind,
    directory: directory || undefined,
    usage,
    sort,
    page,
    pageSize: view === "grid" ? 36 : 25,
  });

  const buildUrl = (updates: Record<string, string | number | undefined | null>) => {
    const sp = new URLSearchParams();
    const merged: Record<string, string | number | undefined | null> = {
      q: query || undefined,
      kind: kind !== "ALL" ? kind : undefined,
      dir: directory || undefined,
      usage: usage !== "ALL" ? usage : undefined,
      sort: sort !== "newest" ? sort : undefined,
      view: view !== "grid" ? view : undefined,
      page: page > 1 ? String(page) : undefined,
      ...updates,
    };

    for (const [k, v] of Object.entries(merged)) {
      if (
        v !== undefined &&
        v !== null &&
        v !== "" &&
        v !== "ALL" &&
        !(k === "page" && Number(v) <= 1)
      ) {
        sp.set(k, String(v));
      }
    }
    const qStr = sp.toString();
    return `/admin/media${qStr ? `?${qStr}` : ""}`;
  };

  const hasActiveFilters = Boolean(
    query || kind !== "ALL" || directory || usage !== "ALL" || sort !== "newest"
  );

  return (
    <div className="space-y-6">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">Media Library</h2>
          <p className="mt-1 text-sm text-slate-600">
            Unified catalog of verified CMS uploads and repository public assets.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
          <Link
            href={buildUrl({ view: "grid" })}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              view === "grid"
                ? "bg-[#0A1F44] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid
          </Link>
          <Link
            href={buildUrl({ view: "table" })}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              view === "table"
                ? "bg-[#0A1F44] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Table
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {params.uploaded || params.updated || params.deleted ? (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-800">
          <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            Asset {params.uploaded ? "uploaded" : params.updated ? "metadata updated" : "deleted"} successfully.
          </span>
        </div>
      ) : null}

      {params.error ? (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
          <span>{params.error === "not-found" ? "File could not be found." : params.error}</span>
        </div>
      ) : null}

      {/* Overview Statistics Cards */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Link
          href={buildUrl({ kind: undefined, usage: undefined, dir: undefined, page: 1 })}
          className={`flex flex-col rounded-xl border p-4 transition ${
            kind === "ALL" && !directory && usage === "ALL"
              ? "border-[#0A1F44] bg-[#0A1F44]/5 ring-1 ring-[#0A1F44]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Assets</span>
          <span className="mt-1 font-serif text-2xl font-bold text-[#0A1F44]">
            {result.metrics.total.toLocaleString()}
          </span>
          <span className="mt-1 text-[11px] text-slate-400">All media catalog items</span>
        </Link>

        <Link
          href={buildUrl({ kind: "IMAGE", usage: undefined, page: 1 })}
          className={`flex flex-col rounded-xl border p-4 transition ${
            kind === "IMAGE" && usage === "ALL"
              ? "border-[#0A1F44] bg-[#0A1F44]/5 ring-1 ring-[#0A1F44]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Images</span>
          <span className="mt-1 font-serif text-2xl font-bold text-[#0A1F44]">
            {result.metrics.images.toLocaleString()}
          </span>
          <span className="mt-1 text-[11px] text-slate-400">WebP, PNG, JPEG, SVG</span>
        </Link>

        <Link
          href={buildUrl({ kind: "PDF", usage: undefined, page: 1 })}
          className={`flex flex-col rounded-xl border p-4 transition ${
            kind === "PDF" && usage === "ALL"
              ? "border-[#0A1F44] bg-[#0A1F44]/5 ring-1 ring-[#0A1F44]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents / PDFs</span>
          <span className="mt-1 font-serif text-2xl font-bold text-[#0A1F44]">
            {result.metrics.documents.toLocaleString()}
          </span>
          <span className="mt-1 text-[11px] text-slate-400">PDF brochures &amp; circulars</span>
        </Link>

        <Link
          href={buildUrl({ kind: "VIDEO", usage: undefined, page: 1 })}
          className={`flex flex-col rounded-xl border p-4 transition ${
            kind === "VIDEO" && usage === "ALL"
              ? "border-[#0A1F44] bg-[#0A1F44]/5 ring-1 ring-[#0A1F44]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Videos</span>
          <span className="mt-1 font-serif text-2xl font-bold text-[#0A1F44]">
            {result.metrics.videos.toLocaleString()}
          </span>
          <span className="mt-1 text-[11px] text-slate-400">MP4, WebM clips</span>
        </Link>

        <Link
          href={buildUrl({
            kind: undefined,
            usage: usage === "USED" && kind === "ALL" ? undefined : "USED",
            page: 1,
          })}
          className={`flex flex-col rounded-xl border p-4 transition ${
            usage === "USED" && kind === "ALL"
              ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">In Use</span>
          <span className="mt-1 font-serif text-2xl font-bold text-emerald-900">
            {result.metrics.inUse.toLocaleString()}
          </span>
          <span className="mt-1 text-[11px] text-slate-400">Referenced in database/CMS</span>
        </Link>
      </section>

      {/* Upload Box (Collapsible/Concise) */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="mb-3 font-serif text-lg font-bold text-[#0A1F44]">Upload Asset</h3>
        <form
          action={uploadMediaAction}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1.5fr_auto] lg:items-end"
        >
          <div>
            <label htmlFor="file" className="mb-1 block text-xs font-semibold text-slate-700">
              Select File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf"
              required
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              JPEG, PNG, WebP, SVG, or PDF · Up to 10 MB (25 MB for PDF)
            </p>
          </div>

          <div>
            <label htmlFor="altText" className="mb-1 block text-xs font-semibold text-slate-700">
              Alt Text (for accessibility &amp; search)
            </label>
            <input
              id="altText"
              name="altText"
              maxLength={300}
              placeholder="e.g. Geeta University campus entrance"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="caption" className="mb-1 block text-xs font-semibold text-slate-700">
              Caption (optional)
            </label>
            <input
              id="caption"
              name="caption"
              maxLength={500}
              placeholder="e.g. Annual convocation 2026"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[#0A1F44] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#1A3A6B] transition"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload File
          </button>
        </form>
      </section>

      {/* Main Filter & Inventory Card */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {/* Search & Filter Bar */}
        <form
          method="GET"
          action="/admin/media"
          className="flex flex-wrap items-center gap-2.5 border-b border-slate-200 bg-slate-50/70 p-4"
        >
          <input type="hidden" name="view" value={view} />

          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search filename, directory, alt text, or tags..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-slate-400"
            />
          </div>

          {/* Category Filter */}
          <select
            name="kind"
            defaultValue={kind}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="ALL">All File Types</option>
            <option value="IMAGE">Images Only</option>
            <option value="PDF">PDFs / Documents Only</option>
            <option value="VIDEO">Videos Only</option>
          </select>

          {/* Directory Filter */}
          <select
            name="dir"
            defaultValue={directory}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="">All Folders ({result.directories.length})</option>
            {result.directories.map((dir) => (
              <option key={dir} value={dir}>
                /{dir}/
              </option>
            ))}
          </select>

          {/* Usage Filter */}
          <select
            name="usage"
            defaultValue={usage}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="ALL">All Usage</option>
            <option value="USED">Referenced Only</option>
            <option value="UNUSED">Unreferenced Only</option>
          </select>

          {/* Sort Option */}
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name_asc">Sort: Name (A to Z)</option>
            <option value="name_desc">Sort: Name (Z to A)</option>
            <option value="size_desc">Sort: Size (Largest)</option>
            <option value="size_asc">Sort: Size (Smallest)</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1A3A6B] transition"
          >
            Filter
          </button>

          {hasActiveFilters && (
            <Link
              href={`/admin/media?view=${view}`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="h-3 w-3" /> Reset
            </Link>
          )}
        </form>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{result.assets.length}</strong> of{" "}
            <strong className="text-slate-800">{result.totalCount.toLocaleString()}</strong> matching assets
            {directory ? ` in /${directory}/` : ""}
          </span>
          <span>
            Page {result.page} of {result.totalPages}
          </span>
        </div>

        {/* Assets Container (Grid vs Table) */}
        {result.assets.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Folder className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-600">No media assets found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or clearing your folder filter.
            </p>
            {hasActiveFilters && (
              <Link
                href={`/admin/media?view=${view}`}
                className="mt-4 inline-block rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-semibold text-white"
              >
                Clear all filters
              </Link>
            )}
          </div>
        ) : view === "grid" ? (
          /* GRID VIEW */
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {result.assets.map((asset) => {
                const isImage = asset.category === "IMAGE";
                const isPdf = asset.category === "PDF";
                const isVideo = asset.category === "VIDEO";
                const formattedSize =
                  asset.sizeBytes > 1024 * 1024
                    ? `${(asset.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
                    : `${Math.round(asset.sizeBytes / 1024)} KB`;

                return (
                  <div
                    key={asset.id}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition"
                  >
                    {/* Media Thumbnail */}
                    <div className="aspect-square w-full overflow-hidden bg-slate-100 relative flex items-center justify-center">
                      {isImage ? (
                        <Image
                          src={asset.url}
                          alt={asset.altText || asset.fileName}
                          width={200}
                          height={200}
                          unoptimized
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      ) : isPdf ? (
                        <div className="flex flex-col items-center gap-1.5 p-3 text-slate-400">
                          <FileText className="h-10 w-10 text-rose-500" />
                          <span className="text-[10px] font-bold uppercase text-slate-600">PDF</span>
                        </div>
                      ) : isVideo ? (
                        <div className="flex flex-col items-center gap-1.5 p-3 text-slate-400">
                          <Video className="h-10 w-10 text-blue-500" />
                          <span className="text-[10px] font-bold uppercase text-slate-600">Video</span>
                        </div>
                      ) : null}

                      {/* Open Link */}
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        title="Open full asset"
                        className="absolute top-2 right-2 rounded-md bg-white/80 p-1 text-slate-700 opacity-0 group-hover:opacity-100 transition shadow-xs hover:bg-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {/* Meta & Info */}
                    <div className="flex flex-1 flex-col justify-between p-3">
                      <div>
                        <p className="truncate text-xs font-bold text-[#0A1F44]" title={asset.fileName}>
                          {asset.fileName}
                        </p>
                        <p className="truncate text-[10px] text-slate-400 font-mono mt-0.5" title={asset.url}>
                          {asset.url}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{formattedSize}</span>
                          <span className="truncate max-w-[80px]" title={asset.directory}>
                            /{asset.directory.split("/")[0]}/
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center justify-between gap-1 border-t border-slate-100 pt-2">
                        <Link
                          href={`/admin/media/${encodeURIComponent(asset.id)}/edit`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                        >
                          <Pencil className="h-3 w-3 text-slate-400" />
                          Edit
                        </Link>

                        {hasPermission(session.user.role, "deleteContent") && (
                          <DeleteMediaButton
                            id={asset.id}
                            fileName={asset.fileName}
                            canDelete={asset.canDelete}
                            reason={
                              !asset.canDelete
                                ? asset.source === "static"
                                  ? "Static repository file (tracked in git)"
                                  : "Asset is currently in use across CMS"
                                : undefined
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Directory</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.assets.map((asset) => {
                  const isImage = asset.category === "IMAGE";
                  const formattedSize =
                    asset.sizeBytes > 1024 * 1024
                      ? `${(asset.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
                      : `${Math.round(asset.sizeBytes / 1024)} KB`;

                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                            {isImage ? (
                              <Image
                                src={asset.url}
                                alt={asset.altText ?? ""}
                                width={48}
                                height={48}
                                unoptimized
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FileText className="h-5 w-5 text-rose-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block max-w-xs truncate font-semibold text-[#0A1F44] hover:underline"
                              title={asset.fileName}
                            >
                              {asset.fileName}
                            </a>
                            <p className="max-w-xs truncate text-[10px] text-slate-400 font-mono" title={asset.url}>
                              {asset.url}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        /{asset.directory}/
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-600">
                        {asset.mimeType}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formattedSize}
                      </td>
                      <td className="px-4 py-3">
                        {asset.isReferenced || asset.usageCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            In Use ({asset.usageCount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/media/${encodeURIComponent(asset.id)}/edit`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Pencil className="h-3 w-3 text-slate-400" /> Edit
                          </Link>

                          {hasPermission(session.user.role, "deleteContent") && (
                            <DeleteMediaButton
                              id={asset.id}
                              fileName={asset.fileName}
                              canDelete={asset.canDelete}
                              reason={
                                !asset.canDelete
                                  ? asset.source === "static"
                                    ? "Static repository file (tracked in git)"
                                    : "Asset is currently in use across CMS"
                                  : undefined
                              }
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3.5 bg-slate-50/70 text-xs text-slate-600">
          <span>
            Page <strong className="text-slate-800">{result.page}</strong> of{" "}
            <strong className="text-slate-800">{result.totalPages}</strong> ({result.totalCount.toLocaleString()} total items)
          </span>

          <div className="flex items-center gap-2">
            {result.page > 1 && (
              <Link
                href={buildUrl({ page: result.page - 1 })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-[#0A1F44] hover:bg-slate-100 transition"
              >
                Previous
              </Link>
            )}
            {result.page < result.totalPages && (
              <Link
                href={buildUrl({ page: result.page + 1 })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-[#0A1F44] hover:bg-slate-100 transition"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
