import { useState, useEffect } from "react";

export default function ImageSlider({
  images = [],
  interval = 5000,
  showDots = false,
  kenBurns = true
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!images.length || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval, isHovered]);

  if (!images.length) return null;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stacked images with crossfade */}
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          <img
            src={src}
            alt={`Slide ${i + 1}`}
            className={`w-full h-full object-cover ${kenBurns && i === currentIndex
                ? "animate-ken-burns"
                : ""
              }`}
          />
        </div>
      ))}

      {/* Optional navigation dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar (optional - shows time until next slide) */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20">
          <div
            className={`h-full bg-white/60 ${isHovered ? "" : "animate-progress"}`}
            style={{
              animationDuration: `${interval}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}