"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, PlayCircle, X } from "lucide-react";

export default function VehicleGallery({ images, make, model, year }: { images: string[]; make: string; model: string; year: number }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <>
      <section aria-label="Galerie photos" className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group cursor-pointer" style={{ backgroundColor: "var(--bg-secondary)" }} onClick={() => setLightbox(true)}>
          <Image src={images[current]} alt={`${make} ${model} ${year} - vue ${current + 1}`} fill className="object-cover transition-opacity duration-300" priority sizes="(max-width: 1024px) 100vw, 66vw" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Photo précédente">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Photo suivante">
            <ChevronRight className="h-6 w-6" />
          </button>
          <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur text-white text-xs rounded-full font-medium">
            {current + 1} / {images.length}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3" role="list" aria-label="Miniatures">
          {images.map((img, i) => (
            <button key={i} role="listitem" onClick={() => setCurrent(i)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-[var(--color-sg-accent-blue)] ring-1 ring-[var(--color-sg-accent-blue)]" : "border-transparent opacity-70 hover:opacity-100"}`}
              style={{ backgroundColor: "var(--bg-secondary)" }}>
              <Image src={img} alt={`${make} ${model} - vue ${i + 1}`} fill className="object-cover" sizes="25vw" />
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors z-10" aria-label="Précédente">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors z-10" aria-label="Suivante">
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="relative w-full max-w-5xl aspect-[16/9] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image src={images[current]} alt={`${make} ${model} - vue ${current + 1}`} fill className="object-contain" sizes="90vw" priority />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur px-4 py-2 rounded-full">
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
