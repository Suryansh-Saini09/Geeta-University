import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getPublishedAlbumBySlug } from "@/server/services/gallery";

export const dynamic = "force-dynamic";
type AlbumProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: AlbumProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await getPublishedAlbumBySlug(slug);
  if (!album) return {};
  return { title: `${album.title} | Geeta University`, description: album.description ?? undefined };
}

export default async function AlbumPage({ params }: AlbumProps) {
  const { slug } = await params;
  const album = await getPublishedAlbumBySlug(slug);
  if (!album) notFound();
  return <div className="min-h-screen bg-white text-[#0A1F44]"><header className="border-b border-slate-200 bg-slate-50 px-5 py-12 sm:py-16"><div className="mx-auto max-w-6xl"><Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#E8871A]"><ArrowLeft className="h-4 w-4" /> All albums</Link><h1 className="mt-6 font-serif text-4xl font-bold sm:text-5xl">{album.title}</h1>{album.description ? <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">{album.description}</p> : null}</div></header><div className="mx-auto grid max-w-6xl gap-5 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3 sm:py-14">{album.images.map((item) => <figure key={item.id}><Image src={item.media.url} alt={item.media.altText ?? ""} width={600} height={450} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={item.media.url.startsWith("http")} className="aspect-[4/3] w-full rounded-lg object-cover" />{item.media.caption ? <figcaption className="mt-2 text-sm text-slate-600">{item.media.caption}</figcaption> : null}</figure>)}{!album.images.length ? <p className="text-slate-600">This album has no images yet.</p> : null}</div></div>;
}
