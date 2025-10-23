import CustomToast from "@/components/CustomToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaClipboardList,
    FaClock,
    FaEdit,
    FaExclamationTriangle,
    FaHeart,
    FaMapMarkerAlt,
    FaPlus,
    FaTrash,
    FaUser,
    FaUsers,
} from "react-icons/fa";
import { LuSettings, LuUserCheck, LuUserX } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios.jsx";
import formatDate from "../lib/formateDate";

const ManageMyPost = () => {
    const [myVolunteerPosts, setMyVolunteerPosts] = useState([]);
    const [myVolunteerRequests, setMyVolunteerRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxios();

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
            icon: LuUserCheck,
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-200",
            textColor: "text-green-800",
        },
        waitlisted: {
            label: "Waitlisted",
            icon: FaClock,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            borderColor: "border-orange-200",
            textColor: "text-orange-800",
        },
        declined: {
            label: "Declined",
            icon: LuUserX,
            color: "text-red-600",
            bgColor: "bg-red-100",
            borderColor: "border-red-200",
            textColor: "text-red-800",
        },
    };

    useEffect(() => {
        if (!user?.email) return;

        setLoading(true);

        axiosSecure
            .get(`/posts/${user.email}`)
            .then((res) => {
                setMyVolunteerPosts(res.data);
            })
            .catch((err) => {
                console.error("Error fetching posts:", err);
                setError("Failed to load your posts");
            });

        axiosSecure
            .get(`/applications/${user.email}`)
            .then((res) => {
                setMyVolunteerRequests(res.data);
            })
            .catch((err) => {
                console.error("Error fetching applications:", err);
                setError("Failed to load applications");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user?.email, axiosSecure]);

    const handleUpdatePost = (postId) => {
        sessionStorage.setItem("editPostId", String(postId));
        navigate("/volunteer/edit-post", { state: { postId } });
    };

    const handleDeletePost = async (postId) => {
        try {
            setDeleteLoading(true);
            setError(null);

            const response = await axiosSecure.delete(`/posts/${postId}`);

            if (response.status === 200) {
                setMyVolunteerPosts((prevPosts) =>
                    prevPosts.filter((post) => post._id !== postId)
                );
                setSuccess("Post deleted successfully!");
                toast.custom((t) => (
                    <CustomToast
                        type="success"
                        title="Post deleted"
                        onClose={() => toast.dismiss(t)}
                    >
                        The post has been removed permanently.
                    </CustomToast>
                ));
                setDeleteConfirm(null);

                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error("Error deleting post:", err);
            setError(
                err.response?.data?.message ||
                    "Failed to delete post. Please try again."
            );
            toast.custom((t) => (
                <CustomToast
                    type="error"
                    title="Delete failed"
                    onClose={() => toast.dismiss(t)}
                >
                    {err.response?.data?.message ||
                        "We couldn't delete the post. Please try again."}
                </CustomToast>
            ));

            setTimeout(() => setError(null), 5000);
        } finally {
            setDeleteLoading(false);
        }
    };

    const confirmDelete = (post) => {
        setDeleteConfirm(post);
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleViewDetails = (applicantEmail) => {
        navigate(`/applicant/${encodeURIComponent(applicantEmail)}`);
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        const prev = myVolunteerRequests;
        try {
            setMyVolunteerRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request._id === requestId
                        ? { ...request, status: newStatus }
                        : request
                )
            );

            await axiosSecure.put(`/applications/${requestId}`, {
                status: newStatus,
            });

            toast.custom((t) => (
                <CustomToast
                    type="success"
                    title="Status Updated"
                    onClose={() => toast.dismiss(t)}
                >
                    Applicant status has been updated to {newStatus}.
                </CustomToast>
            ));
        } catch (error) {
            console.error("Error updating status:", error);

            setMyVolunteerRequests(prev);
            toast.custom((t) => (
                <CustomToast
                    type="error"
                    title="Update Failed"
                    onClose={() => toast.dismiss(t)}
                >
                    {error.response?.data?.message ||
                        "Failed to update status. Please try again."}
                </CustomToast>
            ));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {success && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 sm:gap-3">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <span className="text-green-800 font-medium text-sm sm:text-base">
                            {success}
                        </span>
                    </div>
                )}

                {error && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 sm:gap-3">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <span className="text-red-800 font-medium text-sm sm:text-base">
                            {error}
                        </span>
                    </div>
                )}

                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 sm:mb-6 shadow-lg">
                        <LuSettings className="text-white text-2xl sm:text-3xl" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Manage My Posts
                    </h1>
                    <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
                        Keep track of your volunteer opportunities and manage
                        your applications
                    </p>
                </div>

                <Tabs defaultValue="volunteerPost" className="w-full">
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="relative w-full max-w-sm sm:max-w-md">
                            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 sm:p-1.5 rounded-xl shadow-inner border border-gray-200 h-auto">
                                <TabsTrigger
                                    value="volunteerPost"
                                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 rounded-lg h-auto min-h-[40px] sm:min-h-[48px]"
                                >
                                    <FaClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">
                                        My Posts
                                    </span>
                                    <span className="sm:hidden">Posts</span>
                                    {myVolunteerPosts.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 sm:px-2 py-0.5 rounded-full"
                                        >
                                            {myVolunteerPosts.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="volunteerReq"
                                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 rounded-lg h-auto min-h-[40px] sm:min-h-[48px]"
                                >
                                    <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">
                                        Volunteer Request
                                    </span>
                                    <span className="sm:hidden">Apps</span>
                                    {myVolunteerRequests.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-1 bg-green-100 text-green-700 text-xs px-1.5 sm:px-2 py-0.5 rounded-full"
                                        >
                                            {myVolunteerRequests.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>
                    <TabsContent
                        value="volunteerPost"
                        className="mt-0 animate-in fade-in-50 duration-300"
                    >
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="p-2 sm:p-3 bg-blue-100 rounded-xl shadow-sm">
                                            <FaClipboardList className="text-blue-600 text-xl sm:text-2xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                                                My Volunteer Need Posts
                                            </h2>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Posts you've created to find
                                                volunteers
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                                            {myVolunteerPosts.length}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                            Total Posts
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                {myVolunteerPosts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[600px]">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Post Title
                                                    </th>
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Category
                                                    </th>
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Volunteers
                                                    </th>
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Deadline
                                                    </th>
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Location
                                                    </th>
                                                    <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myVolunteerPosts.map(
                                                    (post) => (
                                                        <tr
                                                            key={post._id}
                                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                                <div className="font-medium text-gray-900 text-sm sm:text-base">
                                                                    <Link
                                                                        className="hover:underline"
                                                                        to={`/volunteer-need/${post._id}`}
                                                                    >
                                                                        {
                                                                            post.postTitle
                                                                        }
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                                                >
                                                                    {
                                                                        post.category
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                                                    <FaUsers className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                                                                    <span className="text-gray-600">
                                                                        {
                                                                            post.interestedVolunteers
                                                                        }
                                                                        /
                                                                        {
                                                                            post.necessaryVolunteers
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                                                                    <FaCalendarAlt className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                                                                    {formatDate(
                                                                        post.deadline
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                                                                    <FaMapMarkerAlt className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                                                                    {
                                                                        post.location
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                                <div className="flex items-center gap-1 sm:gap-2 justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            handleUpdatePost(
                                                                                post._id
                                                                            )
                                                                        }
                                                                        className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer text-xs px-2 py-1 sm:px-3 sm:py-2"
                                                                    >
                                                                        <FaEdit className="w-3 h-3 mr-1" />
                                                                        <span className="hidden sm:inline">
                                                                            Edit
                                                                        </span>
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            confirmDelete(
                                                                                post
                                                                            )
                                                                        }
                                                                        className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-2 py-1 sm:px-3 sm:py-2"
                                                                    >
                                                                        <FaTrash className="w-3 h-3 mr-1" />
                                                                        <span className="hidden sm:inline">
                                                                            Delete
                                                                        </span>
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                            <FaPlus className="text-gray-400 text-xl sm:text-2xl" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                            No posts yet
                                        </h3>
                                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                            You haven't created any volunteer
                                            opportunities yet.
                                        </p>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">
                                            Create Your First Post
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="volunteerReq"
                        className="mt-0 animate-in fade-in-50 duration-300"
                    >
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="p-2 sm:p-3 bg-green-100 rounded-xl shadow-sm">
                                            <FaHeart className="text-green-600 text-xl sm:text-2xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                                                Applicant Management
                                            </h2>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Manage applicants who responded
                                                to your posts
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                                            {myVolunteerRequests.length}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                            Applications
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                {myVolunteerRequests.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[600px]">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Post Title
                                                    </th>
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Category
                                                    </th>
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Applicant
                                                    </th>
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Applied Date
                                                    </th>
                                                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Status
                                                    </th>
                                                    <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myVolunteerRequests.map(
                                                    (request) => (
                                                        <tr
                                                            key={request._id}
                                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="py-4 px-4">
                                                                <div className="font-medium text-gray-900">
                                                                    <Link
                                                                        className="hover:underline"
                                                                        to={`/volunteer-need/${request.postId}`}
                                                                    >
                                                                        {
                                                                            request.postTitle
                                                                        }
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-green-50 text-green-700 border-green-200"
                                                                >
                                                                    {
                                                                        request.category
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {
                                                                            request.applicantName
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            request.applicantEmail
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <FaClock className="text-gray-400" />
                                                                    {formatDate(
                                                                        request.appliedDate
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                {request.status ===
                                                                    "accepted" ||
                                                                request.status ===
                                                                    "declined" ? (
                                                                    <div className="inline-flex items-center gap-2 text-sm">
                                                                        {(() => {
                                                                            const IconComponent =
                                                                                statusConfig[
                                                                                    request
                                                                                        .status
                                                                                ]
                                                                                    ?.icon;
                                                                            return IconComponent ? (
                                                                                <IconComponent
                                                                                    className={`w-3 h-3 ${
                                                                                        statusConfig[
                                                                                            request
                                                                                                .status
                                                                                        ]
                                                                                            ?.color
                                                                                    }`}
                                                                                />
                                                                            ) : null;
                                                                        })()}
                                                                        <span
                                                                            className={`${
                                                                                statusConfig[
                                                                                    request
                                                                                        .status
                                                                                ]
                                                                                    ?.textColor ||
                                                                                "text-gray-800"
                                                                            }`}
                                                                        >
                                                                            {statusConfig[
                                                                                request
                                                                                    .status
                                                                            ]
                                                                                ?.label ||
                                                                                request.status}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <Select
                                                                        value={
                                                                            request.status
                                                                        }
                                                                        onValueChange={(
                                                                            value
                                                                        ) =>
                                                                            handleStatusUpdate(
                                                                                request._id,
                                                                                value
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="w-[180px]">
                                                                            <SelectValue>
                                                                                {request.status &&
                                                                                    statusConfig[
                                                                                        request
                                                                                            .status
                                                                                    ] && (
                                                                                        <div className="flex items-center gap-2">
                                                                                            {(() => {
                                                                                                const IconComponent =
                                                                                                    statusConfig[
                                                                                                        request
                                                                                                            .status
                                                                                                    ]
                                                                                                        .icon;
                                                                                                return (
                                                                                                    <IconComponent
                                                                                                        className={`w-3 h-3 ${
                                                                                                            statusConfig[
                                                                                                                request
                                                                                                                    .status
                                                                                                            ]
                                                                                                                .color
                                                                                                        }`}
                                                                                                    />
                                                                                                );
                                                                                            })()}
                                                                                            <span>
                                                                                                {
                                                                                                    statusConfig[
                                                                                                        request
                                                                                                            .status
                                                                                                    ]
                                                                                                        .label
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                            </SelectValue>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {Object.entries(
                                                                                statusConfig
                                                                            ).map(
                                                                                ([
                                                                                    status,
                                                                                    config,
                                                                                ]) => {
                                                                                    const IconComponent =
                                                                                        config.icon;
                                                                                    return (
                                                                                        <SelectItem
                                                                                            key={
                                                                                                status
                                                                                            }
                                                                                            value={
                                                                                                status
                                                                                            }
                                                                                        >
                                                                                            <div className="flex items-center gap-2">
                                                                                                <IconComponent
                                                                                                    className={`w-3 h-3 ${config.color}`}
                                                                                                />
                                                                                                <span>
                                                                                                    {
                                                                                                        config.label
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        </SelectItem>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-2 justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            handleViewDetails(
                                                                                request.applicantEmail
                                                                            )
                                                                        }
                                                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                    >
                                                                        <FaUser className="w-3 h-3 mr-1" />
                                                                        View
                                                                        Details
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                            <FaHeart className="text-gray-400 text-xl sm:text-2xl" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                            No applicants yet
                                        </h3>
                                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                            No one has applied to your volunteer
                                            opportunities yet.
                                        </p>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">
                                            Create New Post
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 transform transition-all duration-300 scale-100">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <FaExclamationTriangle className="text-red-600 text-lg sm:text-xl" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                    Delete Post
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <p className="text-gray-700 mb-2 text-sm sm:text-base">
                                Are you sure you want to delete this post?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 border">
                                <p className="font-medium text-gray-900 text-sm sm:text-base">
                                    {deleteConfirm.postTitle}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    {deleteConfirm.category} •{" "}
                                    {deleteConfirm.location}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={cancelDelete}
                                disabled={deleteLoading}
                                className="px-4 sm:px-6 py-2 text-sm sm:text-base"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    handleDeletePost(deleteConfirm._id)
                                }
                                disabled={deleteLoading}
                                className="px-4 sm:px-6 py-2 text-sm sm:text-base"
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm">
                                            Deleting...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm">
                                            Delete Post
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

export default ManageMyPost;
