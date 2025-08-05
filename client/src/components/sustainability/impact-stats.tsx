import { useEffect, useRef, useState } from "react";
import { TreePine, Leaf, Recycle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix: string;
  color: string;
  bgColor: string;
}

export default function ImpactStats() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({ trees: 0, co2: 0, packaging: 0, customers: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats/sustainability"],
  });

  const statsData: StatItem[] = [
    {
      icon: <TreePine className="h-8 w-8" />,
      value: stats?.treesPlanted || 12000,
      label: "Trees Planted",
      suffix: "",
      color: "text-[var(--forest-green)]",
      bgColor: "bg-[var(--forest-green)]/10"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      value: stats?.co2Offset || 500,
      label: "Tons CO2 Offset",
      suffix: "",
      color: "text-[var(--sage-green)]",
      bgColor: "bg-[var(--sage-green)]/10"
    },
    {
      icon: <Recycle className="h-8 w-8" />,
      value: stats?.sustainablePackaging || 95,
      label: "% Sustainable Packaging",
      suffix: "%",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: stats?.happyCustomers || 25000,
      label: "Happy Customers",
      suffix: "",
      color: "text-[var(--dark-green)]",
      bgColor: "bg-[var(--dark-green)]/10"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameDuration);
    
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedValues({
        trees: Math.round(easeOutQuart * statsData[0].value),
        co2: Math.round(easeOutQuart * statsData[1].value),
        packaging: Math.round(easeOutQuart * statsData[2].value),
        customers: Math.round(easeOutQuart * statsData[3].value),
      });
      
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
  };

  const formatNumber = (num: number, index: number) => {
    if (!isVisible) return "0";
    const animatedNum = Object.values(animatedValues)[index];
    
    if (animatedNum >= 1000) {
      return (animatedNum / 1000).toFixed(1) + "K";
    }
    return animatedNum.toString();
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-[var(--forest-green)] text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Our Environmental Impact</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Making beauty sustainable, one product at a time. See the real difference we're making together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <Card 
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 bg-white/20`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                
                <div className="text-4xl font-bold mb-2 text-white">
                  {formatNumber(stat.value, index)}{stat.suffix}
                </div>
                
                <div className="text-lg opacity-90 font-medium">
                  {stat.label}
                </div>
                
                {/* Progress indicator for animated stats */}
                {isVisible && (
                  <div className="mt-3 w-full bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-white rounded-full h-1 transition-all duration-2000 ease-out"
                      style={{ 
                        width: `${(Object.values(animatedValues)[index] / stat.value) * 100}%` 
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional Impact Details */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-2xl font-bold">🌍</div>
              <div className="font-semibold">Carbon Negative</div>
              <div className="text-sm opacity-80">
                We offset more CO2 than we produce
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold">♻️</div>
              <div className="font-semibold">Circular Economy</div>
              <div className="text-sm opacity-80">
                Refillable products and recycling programs
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold">🤝</div>
              <div className="font-semibold">Fair Trade</div>
              <div className="text-sm opacity-80">
                Supporting ethical supply chains worldwide
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
            <Leaf className="h-5 w-5" />
            <span className="font-semibold">Join our mission for a cleaner planet</span>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-30 animate-bounce">
        <Leaf className="h-8 w-8 text-white" />
      </div>
      <div className="absolute top-40 right-20 opacity-30 animate-bounce" style={{ animationDelay: '1s' }}>
        <TreePine className="h-6 w-6 text-white" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-30 animate-bounce" style={{ animationDelay: '2s' }}>
        <Recycle className="h-7 w-7 text-white" />
      </div>
    </section>
  );
}
