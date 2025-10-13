import React from "react";
import { cn } from "@/lib/utils";
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiInfo,
    FiXCircle,
    FiX,
} from "react-icons/fi";

const TOAST_CONFIG = {
    success: {
        title: "Success",
        Icon: FiCheckCircle,
        container:
            "border-emerald-200 bg-emerald-50/90 dark:border-emerald-900/40 dark:bg-emerald-950/80",
        titleClass: "text-emerald-900 dark:text-emerald-100",
        descClass: "text-emerald-700/90 dark:text-emerald-300/90",
        accent: "from-emerald-400/80 to-emerald-600/80",
        dot: "bg-emerald-500",
        icon: "text-emerald-600 dark:text-emerald-400",
    },
    warning: {
        title: "Warning",
        Icon: FiAlertTriangle,
        container:
            "border-amber-200 bg-amber-50/90 dark:border-amber-900/40 dark:bg-amber-950/80",
        titleClass: "text-amber-900 dark:text-amber-100",
        descClass: "text-amber-800/90 dark:text-amber-300/90",
        accent: "from-amber-400/80 to-amber-600/80",
        dot: "bg-amber-500",
        icon: "text-amber-600 dark:text-amber-400",
    },
    error: {
        title: "Error",
        Icon: FiXCircle,
        container:
            "border-rose-200 bg-rose-50/90 dark:border-rose-900/40 dark:bg-rose-950/80",
        titleClass: "text-rose-900 dark:text-rose-100",
        descClass: "text-rose-800/90 dark:text-rose-300/90",
        accent: "from-rose-400/80 to-rose-600/80",
        dot: "bg-rose-500",
        icon: "text-rose-600 dark:text-rose-400",
    },
    info: {
        title: "Notice",
        Icon: FiInfo,
        container:
            "border-sky-200 bg-sky-50/90 dark:border-sky-900/40 dark:bg-sky-950/80",
        titleClass: "text-sky-900 dark:text-sky-100",
        descClass: "text-sky-800/90 dark:text-sky-300/90",
        accent: "from-sky-400/80 to-sky-600/80",
        dot: "bg-sky-500",
        icon: "text-sky-600 dark:text-sky-400",
    },
};

// type: "success" | "warning" | "error" | "info" | "failed" (alias of error)
const CustomToast = ({ type = "info", children, onClose, title }) => {
    const normalizedType = type === "failed" ? "error" : type;
    const cfg = TOAST_CONFIG[normalizedType] || TOAST_CONFIG.info;

    return (
        <div
            className={cn(
                "pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl border shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] backdrop-blur-sm",
                "ring-1 ring-black/5 dark:ring-white/5",
                cfg.container
            )}
            role="status"
            aria-live="polite"
        >
            {/* Cute gradient accent bar */}
            <div
                className={cn(
                    "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                    cfg.accent
                )}
            />

            <div className="flex items-start gap-3 px-4 py-3">
                <span
                    className={cn(
                        "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/70 shadow-sm backdrop-blur",
                        "ring-1 ring-black/5 dark:ring-white/10"
                    )}
                >
                    <cfg.Icon className={cn("h-5 w-5", cfg.icon)} />
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p
                                className={cn(
                                    "text-sm font-semibold",
                                    cfg.titleClass
                                )}
                            >
                                {title || cfg.title}
                            </p>
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            aria-label="Dismiss"
                            onClick={onClose}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-black/60 hover:bg-black/5 hover:text-black/80 dark:text-white/70 dark:hover:bg-white/5"
                        >
                            <FiX className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-0.5 flex items-start gap-2">
                        <span
                            className={cn(
                                "mt-2 h-1.5 w-1.5 rounded-full",
                                cfg.dot
                            )}
                        />
                        <div className={cn("text-sm leading-6", cfg.descClass)}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomToast;

// Example usage with sonner (in your code where you call toast.custom):
// import { toast } from "sonner";
// toast.custom((t) => (
//     <CustomToast
//         type="success"
//         onClose={() => toast.dismiss(t)}
//     >
//         Your profile has been updated successfully.
//     </CustomToast>
// ));
