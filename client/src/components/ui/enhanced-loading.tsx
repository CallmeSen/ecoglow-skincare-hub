import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn("animate-spin text-[var(--forest-green)]", sizeClasses[size])} />
        {text && <p className="text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ progress, className, showPercentage = true }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Loading...</span>
        {showPercentage && (
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-[var(--forest-green)] h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface PulseLoadingProps {
  count?: number;
  className?: string;
  height?: string;
}

export function PulseLoading({ count = 3, className, height = "h-4" }: PulseLoadingProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className={cn("loading-skeleton rounded", height)}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

interface ShimmerCardProps {
  className?: string;
  variant?: "product" | "blog" | "review";
}

export function ShimmerCard({ className, variant = "product" }: ShimmerCardProps) {
  const variants = {
    product: (
      <>
        <div className="loading-skeleton aspect-square rounded-lg mb-4" />
        <div className="loading-skeleton h-4 rounded mb-2" />
        <div className="loading-skeleton h-4 rounded w-3/4 mb-2" />
        <div className="loading-skeleton h-6 rounded w-1/2" />
      </>
    ),
    blog: (
      <>
        <div className="loading-skeleton aspect-[16/9] rounded-lg mb-4" />
        <div className="loading-skeleton h-6 rounded mb-3" />
        <div className="loading-skeleton h-4 rounded mb-2" />
        <div className="loading-skeleton h-4 rounded w-2/3" />
      </>
    ),
    review: (
      <>
        <div className="flex items-center space-x-3 mb-3">
          <div className="loading-skeleton w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="loading-skeleton h-4 rounded mb-1" />
            <div className="loading-skeleton h-3 rounded w-2/3" />
          </div>
        </div>
        <div className="loading-skeleton h-16 rounded" />
      </>
    )
  };

  return (
    <div className={cn("animate-pulse", className)}>
      {variants[variant]}
    </div>
  );
}

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export function FloatingActionButton({ 
  onClick, 
  icon, 
  label, 
  className,
  variant = "primary" 
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:ring-4 focus:ring-offset-2 z-50",
        variant === "primary" 
          ? "bg-[var(--forest-green)] hover:bg-[var(--dark-green)] text-white focus:ring-[var(--sage-green)]"
          : "bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-200 border",
        "micro-bounce hover-glow",
        className
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

interface NotificationToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function NotificationToast({ 
  message, 
  type = "info", 
  duration = 3000,
  onClose 
}: NotificationToastProps) {
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-[var(--forest-green)] text-white"
  };

  return (
    <div className={cn(
      "fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm",
      "slide-in-from-right",
      typeClasses[type]
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-3 text-white/80 hover:text-white"
            aria-label="Close notification"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}