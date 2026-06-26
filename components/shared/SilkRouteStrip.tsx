"use client";

import { motion } from "framer-motion";

const cities = ["Xi'an", "Dunhuang", "Samarkand", "Bukhara", "Tehran", "Istanbul"];

export default function SilkRouteStrip() {
  return (
    <div className="overflow-hidden border-y border-silk-gold/30 bg-gradient-to-r from-silk-indigo via-silk-indigo-mid to-silk-indigo py-3.5">
      <motion.div
        className="flex w-max gap-8 px-6 text-xs font-bold tracking-[0.2em] text-silk-gold/90 uppercase"
        animate={{ x: [0, -600] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...cities, ...cities, ...cities].map((city, i) => (
          <span key={`${city}-${i}`} className="flex items-center gap-8 whitespace-nowrap">
            {city}
            <span className="text-silk-gold-light animate-pulse">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}