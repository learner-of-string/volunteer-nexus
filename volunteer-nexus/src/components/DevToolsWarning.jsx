import React from "react";

const DevToolsWarning = ({ countdown, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
            <div className="text-center text-white">
                <div className="text-6xl mb-4">🚨</div>
                <h1 className="text-4xl font-bold mb-4">Dev Tools Detected!</h1>
                <p className="text-xl mb-8">
                    Access denied. Page will refresh in:
                </p>
                <div className="text-8xl font-bold text-red-500 mb-4">
                    {countdown}
                </div>
                <p className="text-lg text-gray-300">
                    Close dev tools to stop this madness!
                </p>
            </div>
        </div>
    );
};

export default DevToolsWarning;
