import { useEffect, useRef } from "react";
import { useThemeStore } from "../store/themeStore";

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const clickPositionRef = useRef<{ x: number; y: number } | null>(null);

  const setThemeWithPosition = (newTheme: string, event?: React.MouseEvent) => {
    if (event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      clickPositionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    setTheme(newTheme as any);
  };

  useEffect(() => {
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.dataset.theme = theme;
      return;
    }
    
    const transition = document.startViewTransition(() => {
      document.documentElement.dataset.theme = theme;
    });

    transition.ready.then(() => {
      const position = clickPositionRef.current;
      const centerX = position?.x || window.innerWidth / 2;
      const centerY = position?.y || window.innerHeight / 2;
      
      document.documentElement.animate({
        clipPath: [`circle(0% at ${centerX}px ${centerY}px)`, `circle(150% at ${centerX}px ${centerY}px)`]
      },
      {
        duration: 1000,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)'
      }
      );
      
      // Reset position after animation
      clickPositionRef.current = null;
    });
  }, [theme]);

  return { theme, setTheme: setThemeWithPosition };
}
