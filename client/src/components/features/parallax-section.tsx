import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  backgroundImage: string;
  children: React.ReactNode;
  className?: string;
  speed?: number;
  height?: string;
}

export default function ParallaxSection({ 
  backgroundImage, 
  children, 
  className,
  speed = 0.5,
  height = "h-96"
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid forced reflow
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setOffsetY(window.scrollY * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Mark as ready after initial setup
    setIsReady(true);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div className={cn("relative overflow-hidden", height, className)}>
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateZ(0) translateY(${offsetY}px)`,
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4">
          {children}
        </div>
      </div>
    </div>
  );
}