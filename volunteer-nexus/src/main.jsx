import DisableDevtool from "disable-devtool";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import AuthProvider from "./Providers/AuthProvider.jsx";
import routes from "./Routes/Routes.jsx";
import { getAuth, signOut } from "firebase/auth";
import app from "./firebase/firebase.init";

// Configure DisableDevtool with custom danger screen
DisableDevtool({
    delay: 0, // No delay for instant detection
    interval: 50, // Check every 50ms for faster detection
    disableRightClick: true, // Disable right click
    disableF12: true, // Disable F12 key
    disableCtrlShiftI: true, // Disable Ctrl+Shift+I
    disableCtrlShiftJ: true, // Disable Ctrl+Shift+J
    disableCtrlU: true, // Disable Ctrl+U
    ondevtoolopen: () => {
        // Sign out user immediately using Firebase
        const auth = getAuth(app);
        signOut(auth).catch((error) => {
            console.error("Error signing out:", error);
        });

        // Create danger screen
        const dangerScreen = document.createElement("div");
        dangerScreen.id = "devtools-danger-screen";
        dangerScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000000;
            color: #ff0000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            font-family: 'Courier New', monospace;
        `;

        dangerScreen.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 80px; margin-bottom: 20px;">⚠️</div>
                <h1 style="font-size: 48px; margin-bottom: 20px; color: #ff0000;">EXTREME DANGER ZONE</h1>
                <p style="font-size: 24px; margin-bottom: 10px;">Developer tools detected!</p>
                <p style="font-size: 20px; margin-bottom: 30px;">Access denied. Page will reload in 3 seconds...</p>
                <div style="font-size: 32px; font-weight: bold; animation: pulse 1s infinite;">
                    🚨 SECURITY BREACH 🚨
                </div>
            </div>
            <style>
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            </style>
        `;

        // Add to body
        document.body.appendChild(dangerScreen);

        // Remove all other content
        const root = document.getElementById("root");
        if (root) {
            root.style.display = "none";
        }

        // 3 second timer then reload
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    },
    ondevtoolclose: () => {
        // Remove danger screen if dev tools are closed
        const dangerScreen = document.getElementById("devtools-danger-screen");
        if (dangerScreen) {
            dangerScreen.remove();
        }

        // Show content again
        const root = document.getElementById("root");
        if (root) {
            root.style.display = "block";
        }
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={routes} />
            <Toaster position="top-right" />
        </AuthProvider>
    </StrictMode>
);
