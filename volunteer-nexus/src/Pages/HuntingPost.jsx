import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    FaClock,
    FaMapMarkerAlt,
    FaUser,
    FaUsers,
    FaEdit,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { Link, useParams, useNavigate } from "react-router-dom";
import formatDate from "../lib/formateDate";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import CustomToast from "@/components/CustomToast";

const HuntingPost = () => {
    const [currentPost, setCurrentPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [applying, setApplying] = useState(false);

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Check if current user is the creator of this post
    const isCreator =
        user && currentPost && user.email === currentPost.creatorEmail;

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/post/${id}`)
            .then((res) => {
                setCurrentPost(res.data);
                console.log(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

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
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/applications`,
                {
                    postId: currentPost._id,
                    applicantEmail: user.email,
                }
            );

            setShowConfirmDialog(false);
            toast.custom((t) => (
                <CustomToast type="success" onClose={() => toast.dismiss(t)}>
                    Application submitted successfully! The organizer will
                    review your application.
                </CustomToast>
            ));

            // Refresh the post data to update volunteer count
            const updatedPost = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/post/${id}`
            );
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
            {/* Back Button */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
                <Link
                    to={-1}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <IoArrowBack className="mr-2" />
                    Back to all posts
                </Link>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Hero Image */}
                <div className="relative h-64 md:h-96 w-full mb-8 rounded-2xl overflow-hidden shadow-xl group">
                    <img
                        src={currentPost?.photoUrl}
                        alt={currentPost?.postTitle}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                        <Badge
                            className="bg-white/90 text-gray-900 hover:bg-white transition-colors backdrop-blur-sm"
                            variant="secondary"
                        >
                            {currentPost?.category}
                        </Badge>
                    </div>
                </div>

                {/* Post Header */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        {currentPost?.postTitle}
                    </h1>
                    <div className="flex items-center gap-3 text-lg text-gray-600">
                        <FaUser className="text-gray-400" />
                        <span>
                            Organized by{" "}
                            <span className="font-semibold text-gray-900">
                                {currentPost?.creatorOrg ||
                                    "Anonymous Organizer"}
                            </span>
                        </span>
                    </div>
                </div>
                {/* Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaMapMarkerAlt className="text-blue-600 text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Location
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {currentPost?.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <FaClock className="text-red-600 text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Deadline
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {formatDate(currentPost?.deadline)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaUsers className="text-green-600 text-xl" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Volunteers
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
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

                {/* Project Description */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                        About this project
                    </h2>
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {currentPost?.description}
                        </p>
                    </div>
                </div>

                {/* Volunteer Request Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 shadow-sm border border-blue-100">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                            {isCreator ? (
                                <FaEdit className="text-blue-600 text-2xl" />
                            ) : (
                                <FaUsers className="text-blue-600 text-2xl" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {isCreator
                                ? "Manage your opportunity"
                                : "Ready to make a difference?"}
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                            {isCreator
                                ? "This is your volunteer opportunity. You can edit the details, view applications, or manage volunteers from here."
                                : "Join this meaningful volunteer opportunity and contribute to your community. Click below to send your application to the organizer."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isCreator ? (
                                <>
                                    <Button
                                        size="lg"
                                        onClick={() =>
                                            navigateToEditPost(currentPost?._id)
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                                    >
                                        <FaEdit className="mr-2" />
                                        Edit Post
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() =>
                                            navigate("/manage-post/me")
                                        }
                                        className="px-8 py-3 text-lg font-semibold rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
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
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {applying
                                            ? "Applying..."
                                            : "Apply as Volunteer"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleShareClick}
                                        className="px-8 py-3 text-lg font-semibold rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                                    >
                                        Share Opportunity
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Confirm Application
                                </h3>
                                <p className="text-sm text-gray-600">
                                    You're about to apply for this volunteer
                                    opportunity
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to apply for this
                                volunteer opportunity?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 border">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    {currentPost?.postTitle}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{currentPost?.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaClock className="text-gray-400" />
                                        <span>
                                            {formatDate(currentPost?.deadline)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={handleCancelApplication}
                                disabled={applying}
                                className="px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmApplication}
                                disabled={applying}
                                className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {applying ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Applying...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle className="w-4 h-4 mr-2" />
                                        Apply Now
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
