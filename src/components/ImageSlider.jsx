import { useState, useEffect } from "react";

export default function ImageSlider({ images = [], interval = 4000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className="w-full h-full">
      <img
        src={images[index]}
        alt="slider"
        className="w-full h-full object-cover transition-all duration-700"
      />
    </div>
  );
}
