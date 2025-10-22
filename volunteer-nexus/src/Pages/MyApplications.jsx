import CustomToast from "@/components/CustomToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaHourglassHalf,
    FaTimesCircle,
    FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import formatDate from "../lib/formateDate";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Status configuration for applications
    const statusConfig = {
        pending: {
            label: "Pending",
            icon: FaClock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
            borderColor: "border-yellow-200",
            textColor: "text-yellow-800",
        },
        under_review: {
            label: "Under Review",
            icon: FaExclamationTriangle,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            borderColor: "border-blue-200",
            textColor: "text-blue-800",
        },
        accepted: {
            label: "Accepted",
            icon: FaCheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-200",
            textColor: "text-green-800",
        },
        waitlisted: {
            label: "Waitlisted",
            icon: FaHourglassHalf,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            borderColor: "border-orange-200",
            textColor: "text-orange-800",
        },
        declined: {
            label: "Declined",
            icon: FaTimesCircle,
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-200",
            textColor: "text-red-800",
        },
    };

    const fetchMyApplications = useCallback(async () => {
        if (!user?.email) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/applications/applicant/${
                    user.email
                }`
            );
            setApplications(response.data);
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError(
                err.response?.data?.message || "Failed to load applications"
            );
            toast.custom((t) => (
                <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                    {err.response?.data?.message ||
                        "Failed to load applications"}
                </CustomToast>
            ));
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchMyApplications();
    }, [fetchMyApplications]);

    const handleBackClick = () => {
        navigate("/dashboard");
    };

    const handleViewPost = (postId) => {
        navigate(`/volunteer-need/${postId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Loading your applications...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTimesCircle className="text-red-600 text-2xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Error
                    </h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={handleBackClick} variant="outline">
                        <FaArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={handleBackClick}
                        variant="outline"
                        className="mb-4"
                    >
                        <FaArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Applications
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Track all your volunteer application submissions
                    </p>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FaUser className="text-green-600" />
                            Application Summary
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {applications.length} application
                            {applications.length !== 1 ? "s" : ""} submitted
                        </p>
                    </div>

                    <div className="p-6">
                        {applications.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Post Title
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Category
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Applied Date
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Status
                                            </th>
                                            <th className="text-center py-3 px-4 font-semibold text-gray-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((application) => {
                                            const statusInfo =
                                                statusConfig[
                                                    application.status
                                                ] || statusConfig.pending;
                                            const StatusIcon = statusInfo.icon;

                                            return (
                                                <tr
                                                    key={application._id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="py-4 px-4">
                                                        <div className="font-medium text-gray-900">
                                                            {
                                                                application.postTitle
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-green-50 text-green-700 border-green-200"
                                                        >
                                                            {
                                                                application.category
                                                            }
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <FaCalendarAlt className="text-gray-400" />
                                                            {formatDate(
                                                                application.appliedDate
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Badge
                                                            className={`${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border`}
                                                        >
                                                            <StatusIcon
                                                                className={`w-3 h-3 mr-1 ${statusInfo.color}`}
                                                            />
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2 justify-center">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleViewPost(
                                                                        application.postId
                                                                    )
                                                                }
                                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                            >
                                                                View Post
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaUser className="text-gray-400 text-2xl" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Applications Found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    You haven't applied to any volunteer
                                    opportunities yet.
                                </p>
                                <Button
                                    onClick={() => navigate("/all-posts")}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Browse Opportunities
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyApplications;
