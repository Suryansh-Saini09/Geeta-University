import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Images } from "lucide-react";

import { getPublishedAlbums } from "@/server/services/gallery";

export const metadata: Metadata = { title: "Gallery | Geeta University", description: "Photo albums from Geeta University." };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums = await getPublishedAlbums();
  return <div className="min-h-screen bg-white text-[#0A1F44]"><header className="border-b border-slate-200 bg-slate-50 px-5 py-12 sm:py-16"><div className="mx-auto max-w-6xl"><h1 className="font-serif text-4xl font-bold sm:text-5xl">Gallery</h1></div></header><div className="mx-auto grid max-w-6xl gap-5 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3 sm:py-14">{albums.length ? albums.map((album) => <Link key={album.id} href={`/gallery/${album.slug}`} className="group overflow-hidden rounded-lg border border-slate-200"><div className="flex aspect-[4/3] items-center justify-center bg-slate-100">{album.images[0] ? <Image src={album.images[0].media.url} alt={album.images[0].media.altText ?? ""} width={600} height={450} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={album.images[0].media.url.startsWith("http")} className="h-full w-full object-cover" /> : <Images className="h-10 w-10 text-slate-400" />}</div><div className="p-4"><h2 className="font-serif text-xl font-bold group-hover:text-[#E8871A]">{album.title}</h2><p className="mt-1 text-sm text-slate-500">{album._count.images} image{album._count.images === 1 ? "" : "s"}</p></div></Link>) : <p className="text-slate-600">No albums have been published yet.</p>}</div></div>;
}
