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

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * speed);
    };

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