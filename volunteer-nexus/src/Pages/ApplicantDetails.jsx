import CustomToast from "@/components/CustomToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaEnvelope,
    FaExclamationTriangle,
    FaHourglassHalf,
    FaTimesCircle,
    FaUser,
    FaUserCircle,
    FaUsers,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useAxios from "../hooks/useAxios";

const ApplicantDetails = () => {
    const [applicant, setApplicant] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { applicantEmail } = useParams();
    const secureAxios = useAxios();

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

    const fetchApplicantDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const userResponse = await secureAxios(`/users/${applicantEmail}`);
            setApplicant(userResponse.data);

            const applicationsResponse = await secureAxios.get(
                `/applications/applicant/${applicantEmail}`
            );
            setApplications(applicationsResponse.data);
        } catch (err) {
            console.error("Error fetching applicant details:", err);
            setError(
                err.response?.data?.message ||
                    "Failed to load applicant details"
            );
            toast.custom((t) => (
                <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                    {err.response?.data?.message ||
                        "Failed to load applicant details"}
                </CustomToast>
            ));
        } finally {
            setLoading(false);
        }
    }, [applicantEmail, secureAxios]);

    useEffect(() => {
        if (!applicantEmail) {
            setError("No applicant email provided");
            setLoading(false);
            return;
        }

        fetchApplicantDetails();
    }, [applicantEmail, fetchApplicantDetails]);

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Loading applicant details...
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

    if (!applicant) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUser className="text-gray-400 text-2xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Applicant Not Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        The requested applicant could not be found.
                    </p>
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="mb-3 sm:mb-4 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
                    >
                        <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Go Back
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Applicant Details
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        View detailed information about this applicant
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 h-fit">
                            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FaUser className="text-blue-600 text-sm sm:text-base" />
                                    Personal Information
                                </h3>
                            </div>
                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                <div className="flex justify-center">
                                    {applicant.photoURL ? (
                                        <img
                                            src={applicant.photoURL}
                                            alt={applicant.displayName}
                                            referrerPolicy="no-referrer"
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 sm:border-4 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                            <FaUserCircle className="text-3xl sm:text-4xl text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                        {applicant.displayName}
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        Volunteer Applicant
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                        <FaEnvelope className="text-gray-400 text-sm sm:text-base" />
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                Email
                                            </p>
                                            <p className="font-medium text-gray-900 hover:underline cursor-pointer text-sm sm:text-base break-all">
                                                {applicant.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
                                    <div className="text-center p-2 sm:p-3 rounded-lg transition-all duration-200 ease-out hover:bg-blue-50 hover:-translate-y-0.5 cursor-default">
                                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                                            {applicant.appliedCampaigns
                                                ?.length || 0}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Applied Campaigns
                                        </div>
                                    </div>
                                    <div className="text-center p-2 sm:p-3 rounded-lg transition-all duration-200 ease-out hover:bg-green-50 hover:-translate-y-0.5 cursor-default">
                                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                                            {
                                                applications.filter(
                                                    (app) =>
                                                        app.status ===
                                                        "accepted"
                                                ).length
                                            }
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Accepted
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">
                            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FaUsers className="text-green-600 text-sm sm:text-base" />
                                    Application History
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    All applications submitted by this applicant
                                </p>
                            </div>
                            <div className="p-4 sm:p-6">
                                {applications.length > 0 ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        {applications.map((application) => {
                                            const statusInfo =
                                                statusConfig[
                                                    application.status
                                                ] || statusConfig.pending;
                                            const StatusIcon = statusInfo.icon;

                                            return (
                                                <div
                                                    key={application._id}
                                                    className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                        <div className="flex-1">
                                                            <h4
                                                                className="font-semibold text-gray-900 mb-2 hover:underline cursor-pointer text-sm sm:text-base"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/volunteer-need/${application.postId}`
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    application.postTitle
                                                                }
                                                            </h4>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                                                                <div className="flex items-center gap-1">
                                                                    <FaCalendarAlt className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                                                                    <span>
                                                                        Applied:{" "}
                                                                        {new Date(
                                                                            application.appliedDate
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-green-50 text-green-700 border-green-200 text-xs w-fit"
                                                                >
                                                                    {
                                                                        application.category
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="sm:ml-4">
                                                            <Badge
                                                                className={`${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border text-xs`}
                                                            >
                                                                <StatusIcon
                                                                    className={`w-3 h-3 mr-1 ${statusInfo.color}`}
                                                                />
                                                                {
                                                                    statusInfo.label
                                                                }
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 sm:py-8">
                                        <FaUsers className="text-3xl sm:text-4xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                            No Applications Found
                                        </h3>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            This applicant hasn't submitted any
                                            applications yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantDetails;
