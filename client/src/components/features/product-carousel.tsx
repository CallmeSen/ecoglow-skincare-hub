import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { Product } from "@shared/schema";

interface ProductCarouselProps {
  products: Product[];
  autoAdvance?: boolean;
  interval?: number;
  showArrows?: boolean;
  className?: string;
}

export default function ProductCarousel({ 
  products, 
  autoAdvance = true,
  interval = 5000,
  showArrows = true,
  className = ""
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance functionality
  useEffect(() => {
    if (!autoAdvance || isPaused || products.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoAdvance, isPaused, interval, products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!products.length) return null;

  // Show 3 products at a time on desktop, 1 on mobile
  const visibleProducts = products.slice(currentIndex, currentIndex + 3).concat(
    currentIndex + 3 > products.length 
      ? products.slice(0, (currentIndex + 3) % products.length)
      : []
  ).slice(0, 3);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel */}
      <div className="overflow-hidden rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
          {visibleProducts.map((product, index) => (
            <div key={`${product.id}-${currentIndex}-${index}`} className="fade-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && products.length > 3 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
            aria-label="Previous products"
            data-testid="carousel-previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
            aria-label="Next products"
            data-testid="carousel-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dot Indicators */}
      {products.length > 3 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(products.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * 3)}
              className={`w-3 h-3 rounded-full transition-all ${
                Math.floor(currentIndex / 3) === index
                  ? "bg-[var(--forest-green)]"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`carousel-dot-${index}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoAdvance && !isPaused && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-[var(--forest-green)] transition-all ease-linear"
            style={{ 
              width: '100%',
              animation: `progress ${interval}ms linear infinite`
            }}
          />
        </div>
      )}
    </div>
  );
}