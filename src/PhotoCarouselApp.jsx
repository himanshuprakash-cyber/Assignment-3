import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
];

export default function PhotoCarouselApp() {
  const [index, setIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [zoom, setZoom] = useState(1);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  // Close fullscreen on Esc
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setFullscreenImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Zoom controls
  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom((z) => Math.min(z + 0.2, 3)); // max zoom x3
  };
  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom((z) => Math.max(z - 0.2, 1)); // min zoom x1
  };

  // Reset zoom on image close
  const closeFullscreen = () => {
    setZoom(1);
    setFullscreenImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <header className="text-center py-6 border-b border-white/10">
          <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-sm">
            Interactive Photo Carousel
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Click a photo to view it in fullscreen and zoom 🔍
          </p>
        </header>

        {/* Carousel */}
        <div className="relative w-full h-80 md:h-[30rem] overflow-hidden flex items-center justify-center">
          <AnimatePresence>
            <motion.img
              key={index}
              src={images[index]}
              alt={`Slide ${index + 1}`}
              onClick={() => setFullscreenImage(images[index])}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute w-full h-full object-cover cursor-pointer"
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 flex items-center justify-center gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                  i === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 bg-white/10 border-t border-white/10 text-gray-300 text-sm">
          <p>
            Built with <span className="font-semibold text-white">React</span>,{" "}
            <span className="font-semibold text-white">TailwindCSS</span>, and{" "}
            <span className="font-semibold text-white">Framer Motion</span> ✨
          </p>
        </footer>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={closeFullscreen}
          >
            {/* Zoomed Image */}
            <motion.img
              src={fullscreenImage}
              alt="Full screen"
              initial={{ scale: 0.9 }}
              animate={{ scale: zoom }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Top Controls */}
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={handleZoomIn}
                className="text-white bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm"
                title="Zoom In"
              >
                <ZoomIn className="w-6 h-6" />
              </button>
              <button
                onClick={handleZoomOut}
                className="text-white bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm"
                title="Zoom Out"
              >
                <ZoomOut className="w-6 h-6" />
              </button>
              <button
                onClick={closeFullscreen}
                className="text-white bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
