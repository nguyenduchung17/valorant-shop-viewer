import React from "react";
import { Image } from "@/components/ui/image";

export default function StoreCard({ item }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-[#1a2323] transition-transform duration-200 hover:-translate-y-1">
      <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-[#2a3333] to-[#141c1c]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
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
        <p className="text-[11px] uppercase tracking-widest text-white/40">{item.weapon}</p>
        <h3 className="mt-1 truncate text-lg font-semibold text-white">{item.name}</h3>
        <p className="mt-2 text-sm font-bold text-[#ff4655]">{item.price} VP</p>
      </div>
    </div>
  );
}