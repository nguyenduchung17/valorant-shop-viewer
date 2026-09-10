import React, { useState, useEffect } from "react";

export default function CountdownTimer({ targetIso }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const tick = () => {
      if (!targetIso) {
        setRemaining(null);
        return;
      }
      const diff = new Date(targetIso).getTime() - Date.now();
      setRemaining(diff > 0 ? diff : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!targetIso || remaining === null) {
    return <span className="font-mono text-2xl text-white/30">--:--:--</span>;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");

  return (
    <span className="font-mono text-2xl font-bold tracking-wider text-[#ff4655] sm:text-3xl">
      {h}:{m}:{s}
    </span>
  );
}