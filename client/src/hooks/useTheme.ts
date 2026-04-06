import { useEffect, useRef } from "react";
import { useThemeStore } from "../store/themeStore";

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const clickPositionRef = useRef<{ x: number; y: number } | null>(null);
  const hasClickRef = useRef(false); // Track whether the change came from a click

  const setThemeWithPosition = (newTheme: string, event?: React.MouseEvent) => {
    if (event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      clickPositionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      hasClickRef.current = true; // Mark as click-triggered
    } else {
      hasClickRef.current = false;
    }
    setTheme(newTheme as any);
  };

  useEffect(() => {
    const applyTheme = () => {
      document.documentElement.dataset.theme = theme;
    };

    // Skip transition if no click, no API support, or reduced motion preferred
    if (
      !hasClickRef.current ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }

    const transition = document.startViewTransition(applyTheme);

    transition.ready.then(() => {
      const position = clickPositionRef.current;
      const centerX = position?.x || window.innerWidth / 2;
      const centerY = position?.y || window.innerHeight / 2;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0% at ${centerX}px ${centerY}px)`,
            `circle(150% at ${centerX}px ${centerY}px)`,
          ],
        },
        {
          duration: 1000,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );

      // Reset after animation
      clickPositionRef.current = null;
      hasClickRef.current = false;
    });
  }, [theme]);

  return { theme, setTheme: setThemeWithPosition };
}