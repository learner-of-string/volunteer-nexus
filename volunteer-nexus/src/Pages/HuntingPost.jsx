import CustomToast from "@/components/CustomToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
    FaCheckCircle,
    FaClock,
    FaEdit,
    FaMapMarkerAlt,
    FaUser,
    FaUsers,
} from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios.jsx";
import formatDate from "../lib/formateDate";

const HuntingPost = () => {
    const [currentPost, setCurrentPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [applying, setApplying] = useState(false);

    const secureAxios = useAxios();

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const isCreator =
        user && currentPost && user.email === currentPost.creatorEmail;

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        secureAxios
            .get(`/post/${id}`)
            .then((res) => {
                setCurrentPost(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, secureAxios]);

    const navigateToEditPost = (postId) => {
        sessionStorage.setItem("editPostId", String(postId));
        navigate("/volunteer/edit-post", { state: { postId } });
    };

    const handleApplyClick = () => {
        if (!user) {
            toast.custom((t) => (
                <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                    Please sign in to apply for this opportunity.
                </CustomToast>
            ));
            navigate("/sign-in");
            return;
        }
        setShowConfirmDialog(true);
    };

    const handleConfirmApplication = async () => {
        if (!user || !currentPost) return;

        try {
            setApplying(true);
            await secureAxios.post(`/applications`, {
                postId: currentPost._id,
                applicantEmail: user.email,
            });

            setShowConfirmDialog(false);
            toast.custom((t) => (
                <CustomToast type="success" onClose={() => toast.dismiss(t)}>
                    Application submitted successfully! The organizer will
                    review your application.
                </CustomToast>
            ));

            const updatedPost = await secureAxios.get(`/post/${id}`);
            setCurrentPost(updatedPost.data);
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.custom((t) => (
                <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                    {error.response?.data?.message ||
                        "Failed to submit application. Please try again."}
                </CustomToast>
            ));
        } finally {
            setApplying(false);
        }
    };

    const handleCancelApplication = () => {
        setShowConfirmDialog(false);
    };

    const handleShareClick = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);

            toast.custom((t) => (
                <CustomToast type="success" onClose={() => toast.dismiss(t)}>
                    Link copied to clipboard! Share this opportunity with
                    others.
                </CustomToast>
            ));
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            toast.custom((t) => (
                <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                    Failed to copy link. Please try again.
                </CustomToast>
            ));
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-64 md:h-96 w-full mb-8 rounded-lg bg-gray-200"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't load the volunteer post. Please try again.
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentPost) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Post not found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        The volunteer post you're looking for doesn't exist.
                    </p>
                    <Link to="/">
                        <Button>
                            <IoArrowBack className="mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                <Link
                    to={-1}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                >
                    <IoArrowBack className="mr-1 sm:mr-2 w-4 h-4" />
                    Back to all posts
                </Link>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl group">
                    <img
                        src={currentPost?.photoUrl}
                        alt={currentPost?.postTitle}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <Badge
                            className="bg-white/90 text-gray-900 hover:bg-white transition-colors backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                            variant="secondary"
                        >
                            {currentPost?.category}
                        </Badge>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                        {currentPost?.postTitle}
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg text-gray-600">
                        <FaUser className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span>
                            Organized by{" "}
                            <span className="font-semibold text-gray-900">
                                {currentPost?.creatorOrg ||
                                    "Anonymous Organizer"}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                                <FaMapMarkerAlt className="text-blue-600 text-lg sm:text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                    Location
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                    {currentPost?.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                                <FaClock className="text-red-600 text-lg sm:text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                    Deadline
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                    {formatDate(currentPost?.deadline)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                                <FaUsers className="text-green-600 text-lg sm:text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                    Volunteers
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                    {currentPost?.interestedVolunteers || 0}{" "}
                                    volunteer
                                    {currentPost?.interestedVolunteers === 1
                                        ? ""
                                        : "s"}{" "}
                                    applied out of{" "}
                                    {currentPost?.necessaryVolunteers} needed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <div className="w-1 h-6 sm:h-8 bg-blue-500 rounded-full"></div>
                        About this project
                    </h2>
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                            {currentPost?.description}
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-blue-100">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
                            {isCreator ? (
                                <FaEdit className="text-blue-600 text-lg sm:text-2xl" />
                            ) : (
                                <FaUsers className="text-blue-600 text-lg sm:text-2xl" />
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                            {isCreator
                                ? "Manage your opportunity"
                                : "Ready to make a difference?"}
                        </h2>
                        <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
                            {isCreator
                                ? "This is your volunteer opportunity. You can edit the details, view applications, or manage volunteers from here."
                                : "Join this meaningful volunteer opportunity and contribute to your community. Click below to send your application to the organizer."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            {isCreator ? (
                                <>
                                    <Button
                                        size="lg"
                                        onClick={() =>
                                            navigateToEditPost(currentPost?._id)
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                                    >
                                        <FaEdit className="mr-1 sm:mr-2 w-4 h-4" />
                                        Edit Post
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() =>
                                            navigate("/manage-post/me")
                                        }
                                        className="px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                                    >
                                        Manage Posts
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        size="lg"
                                        onClick={handleApplyClick}
                                        disabled={applying}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {applying
                                            ? "Applying..."
                                            : "Apply as Volunteer"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleShareClick}
                                        className="px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                                    >
                                        Share Opportunity
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 transform transition-all duration-300 scale-100">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="text-blue-600 text-lg sm:text-xl" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                    Confirm Application
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    You're about to apply for this volunteer
                                    opportunity
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                                Are you sure you want to apply for this
                                volunteer opportunity?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border">
                                <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                    {currentPost?.postTitle}
                                </h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{currentPost?.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaClock className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>
                                            {formatDate(currentPost?.deadline)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={handleCancelApplication}
                                disabled={applying}
                                className="px-4 sm:px-6 py-2 text-sm sm:text-base"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmApplication}
                                disabled={applying}
                                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {applying ? (
                                    <>
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm">
                                            Applying...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm">
                                            Apply Now
                                        </span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HuntingPost;
