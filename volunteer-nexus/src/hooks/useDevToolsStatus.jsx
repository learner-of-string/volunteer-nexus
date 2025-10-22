import { useState, useEffect } from "react";
import devtoolsDetect from "devtools-detect";

export function useDevToolsStatus() {
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

    useEffect(() => {
        // Set initial state
        setIsDevToolsOpen(devtoolsDetect.isOpen);

        const handleChange = (event) => {
            console.log("Dev tools changed:", event.detail.isOpen);
            setIsDevToolsOpen(event.detail.isOpen);
        };

        // Listen for dev tools changes
        window.addEventListener("devtoolsChange", handleChange);

        // More aggressive detection methods
        const detectDevTools = () => {
            // Method 1: devtools-detect
            const devtoolsDetectResult = devtoolsDetect.isOpen;

            // Method 2: Console detection
            let devtoolsOpen = false;
            const threshold = 160;

            if (
                window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold
            ) {
                devtoolsOpen = true;
            }

            // Method 3: Console timing detection
            const start = performance.now();
            console.log("%c", "font-size:1px");
            const end = performance.now();
            if (end - start > 100) {
                devtoolsOpen = true;
            }

            // Use any positive detection
            const currentState = devtoolsDetectResult || devtoolsOpen;

            if (currentState !== isDevToolsOpen) {
                console.log("Dev tools state changed:", currentState);
                setIsDevToolsOpen(currentState);
            }
        };

        // Check every 500ms for more aggressive detection
        const interval = setInterval(detectDevTools, 500);

        // Also check on resize
        window.addEventListener("resize", detectDevTools);

        return () => {
            window.removeEventListener("devtoolsChange", handleChange);
            window.removeEventListener("resize", detectDevTools);
            clearInterval(interval);
        };
    }, [isDevToolsOpen]);

    return isDevToolsOpen;
}
