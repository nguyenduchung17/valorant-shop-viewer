import React from "react";
import { Image } from "@/components/ui/image";

export default function NightMarketCard({ offer }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-[#ff4655]/30 bg-[#1a2323] transition-transform duration-200 hover:-translate-y-1">
      <div className="absolute right-2 top-2 z-10 rounded bg-[#ff4655] px-2 py-1 text-xs font-bold text-white shadow-lg">
        {offer.discountPercent}% OFF
      </div>
      <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-[#3a1a1a] to-[#1a1010]">
        {offer.imageUrl ? (
          <Image
            src={offer.imageUrl}
            alt={offer.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm uppercase tracking-widest text-white/15">
            No artwork
          </div>
        )}
      </div>
      <div className="border-t-2 border-[#ff4655] p-4">
        <p className="text-[11px] uppercase tracking-widest text-white/40">{offer.weapon}</p>
        <h3 className="mt-1 truncate text-lg font-semibold text-white">{offer.name}</h3>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-white/40 line-through">{offer.originalPrice} VP</span>
          <span className="text-white/30">&rarr;</span>
          <span className="font-bold text-[#ff4655]">{offer.discountPrice} VP</span>
        </div>
      </div>
    </div>
  );
}