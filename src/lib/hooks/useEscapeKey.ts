import { useEffect } from "react";

/**
 * Custom React hook that attaches a global keydown listener for the Escape key.
 * Automatically cleans up when unmounted or disabled.
 *
 * @param onEscape Callback to invoke when Escape is pressed
 * @param isEnabled Whether the listener should be active (defaults to true)
 */
export function useEscapeKey(onEscape: () => void, isEnabled: boolean = true) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, isEnabled]);
}
