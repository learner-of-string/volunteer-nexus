import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import AuthProvider from "./Providers/AuthProvider.jsx";
import routes from "./Routes/Routes.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={routes} />
            <Toaster position="top-right" />
        </AuthProvider>
    </StrictMode>
);
