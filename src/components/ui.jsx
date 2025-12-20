import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Stat({ icon, label, value, suffix }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 text-center shadow-xl">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06]">{icon}</div>
      <div className="text-3xl font-extrabold tracking-tight">{value}{suffix}</div>
      <div className="mt-1 text-white/70 text-sm">{label}</div>
    </div>
  );
}

export function useCounter(to = 0, duration = 1.6) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 80, damping: 20 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      motionVal.set(t * to);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const unsub = spring.on("change", (v) => setValue(Math.round(v)));
    return () => unsub();
  }, [to]);

  return value;
}
