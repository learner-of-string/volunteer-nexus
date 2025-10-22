import useAuth from "@/hooks/useAuth";
import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomToast from "../components/CustomToast";

const Dashboard = () => {
    const { user, signOutUser } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOutUser().then(() => {
            axios
                .post(
                    `${import.meta.env.VITE_SERVER_URL}/signout`,
                    {},
                    { withCredentials: true }
                )
                .then((res) => {
                    console.log(res.data);
                    navigate("/");
                });
            toast.custom((t) => (
                <CustomToast type="success" onClose={() => toast.dismiss(t)}>
                    Signed Out Successfully!
                </CustomToast>
            ));
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Welcome Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                        <span className="text-white text-2xl font-bold">
                            {user?.displayName?.charAt(0) || "U"}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                        Welcome Back!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage your volunteer journey
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                    {/* Profile Section */}
                    <div className="flex items-center justify-between gap-5 mb-8">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 p-1 shadow-lg">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user?.displayName || "User"}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">
                                                {user?.displayName?.charAt(0) ||
                                                    "U"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    {user?.displayName || "User"}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {user?.email || "-"}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 text-sm font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            Sign out
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        <Link
                            to="/manage-post/me"
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Manage My Posts
                                        </h3>
                                        <p className="text-blue-100 text-sm">
                                            Create and manage volunteer
                                            opportunities
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/my-applications"
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">
                                            My Applications
                                        </h3>
                                        <p className="text-green-100 text-sm">
                                            Track your volunteer applications
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Quick Summary */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Quick Summary
                            </h2>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                            <p className="text-gray-700 leading-relaxed">
                                View your applications in a separate page with a
                                summary table (status, post title, applied
                                date). Use the{" "}
                                <span className="font-semibold text-green-600">
                                    "My Applications"
                                </span>{" "}
                                button above to get started!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
