import { useEffect } from "react";

interface SkipLinksProps {
  className?: string;
}

export function SkipLinks({ className = "" }: SkipLinksProps) {
  return (
    <div className={`sr-only focus-within:not-sr-only ${className}`}>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 bg-[var(--forest-green)] text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-[var(--sage-green)]"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="fixed top-4 left-32 z-50 bg-[var(--forest-green)] text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-[var(--sage-green)]"
      >
        Skip to navigation
      </a>
    </div>
  );
}

export function useAnnounceLiveRegion() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    liveRegion.textContent = message;
    
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  };

  return announce;
}

interface HighContrastModeProps {
  enabled: boolean;
  onToggle: () => void;
}

export function useHighContrastMode() {
  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast');
  };

  return toggleHighContrast;
}

export function useFocusManagement() {
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  return { trapFocus };
}

// Enhanced keyboard navigation hook
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Home key - go to top
      if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const skipLink = document.querySelector('a[href="#main-content"]') as HTMLElement;
        skipLink?.focus();
      }

      // End key - go to bottom
      if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }

      // Escape key - close modals/dropdowns
      if (e.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        activeElement?.blur();
        
        // Close any open dialogs
        const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
        openDialogs.forEach(dialog => {
          const closeButton = dialog.querySelector('[aria-label*="close"], [data-testid*="close"]') as HTMLElement;
          closeButton?.click();
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Screen reader optimizations
export function useScreenReaderOptimizations() {
  useEffect(() => {
    // Add role descriptions to interactive elements
    const buttons = document.querySelectorAll('button[data-testid]');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label') && !button.getAttribute('aria-describedby')) {
        const testId = button.getAttribute('data-testid');
        if (testId) {
          const label = testId.replace(/^(button|link|input)-/, '').replace(/-/g, ' ');
          button.setAttribute('aria-label', label);
        }
      }
    });

    // Enhance form labels
    const inputs = document.querySelectorAll('input[data-testid]');
    inputs.forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-describedby')) {
        const testId = input.getAttribute('data-testid');
        if (testId) {
          const label = testId.replace(/^input-/, '').replace(/-/g, ' ');
          input.setAttribute('aria-label', label);
        }
      }
    });
  }, []);
}