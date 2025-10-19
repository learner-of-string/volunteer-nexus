import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaClipboardList,
    FaClock,
    FaEdit,
    FaHeart,
    FaMapMarkerAlt,
    FaPlus,
    FaTrash,
    FaUsers,
    FaExclamationTriangle,
} from "react-icons/fa";
import { LuSettings, LuUserCheck, LuUserX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import formatDate from "../lib/formateDate";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import CustomToast from "@/components/CustomToast";

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

    // Mock data - in real app, this would come from API
    useEffect(() => {
        setMyVolunteerRequests([
            {
                id: 1,
                postTitle: "Elderly Home Companionship Drive",
                category: "social service",
                organizer: "Peace Haven Retirement Home",
                appliedDate: "2025-01-15T10:30:00Z",
                status: "pending",
            },
            {
                id: 2,
                postTitle: "Youth Robotics Workshop Mentor",
                category: "education",
                organizer: "Tech Innovations Lab",
                appliedDate: "2025-01-10T14:20:00Z",
                status: "accepted",
            },
        ]);

        setLoading(false);

        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/posts/${user?.email}`)
            .then((res) => {
                console.log(res.data);
                setMyVolunteerPosts(res.data);
            });
    }, [user?.email]);

    const handleUpdatePost = (postId) => {
        sessionStorage.setItem("editPostId", String(postId));
        navigate("/volunteer/edit-post", { state: { postId } });
    };

    const handleDeletePost = async (postId) => {
        try {
            setDeleteLoading(true);
            setError(null);
            console.log(postId);

            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/posts/${postId}`
            );

            if (response.status === 200) {
                // Remove the deleted post from the state
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

                // Clear success message after 3 seconds
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

            // Clear error message after 5 seconds
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

    const handleCancelRequest = (requestId) => {
        console.log("Cancel request:", requestId);
        // TODO: Implement cancel request functionality
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
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-3 h-3 text-green-600"
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
                        <span className="text-green-800 font-medium">
                            {success}
                        </span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-3 h-3 text-red-600"
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
                        <span className="text-red-800 font-medium">
                            {error}
                        </span>
                    </div>
                )}
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
                        <LuSettings className="text-white text-3xl" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Manage My Posts
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Keep track of your volunteer opportunities and manage
                        your applications
                    </p>
                </div>

                <Tabs defaultValue="volunteerPost" className="w-full">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1.5 rounded-xl shadow-inner border border-gray-200 h-auto">
                                <TabsTrigger
                                    value="volunteerPost"
                                    className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 rounded-lg h-auto min-h-[48px]"
                                >
                                    <FaClipboardList className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        My Posts
                                    </span>
                                    <span className="sm:hidden">Posts</span>
                                    {myVolunteerPosts.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                                        >
                                            {myVolunteerPosts.length}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="volunteerReq"
                                    className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-50 data-[state=inactive]:hover:text-gray-900 rounded-lg h-auto min-h-[48px]"
                                >
                                    <FaHeart className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Volunteer Request
                                    </span>
                                    <span className="sm:hidden">Apps</span>
                                    {myVolunteerRequests.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full"
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
                        {/* My Volunteer Need Posts Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                                            <FaClipboardList className="text-blue-600 text-2xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                My Volunteer Need Posts
                                            </h2>
                                            <p className="text-gray-600 text-sm">
                                                Posts you've created to find
                                                volunteers
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {myVolunteerPosts.length}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                            Total Posts
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {myVolunteerPosts.length > 0 ? (
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
                                                        Volunteers
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                        Deadline
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                        Location
                                                    </th>
                                                    <th className="text-center py-3 px-4 font-semibold text-gray-900">
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
                                                            <td className="py-4 px-4">
                                                                <div className="font-medium text-gray-900">
                                                                    {
                                                                        post.postTitle
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                                                >
                                                                    {
                                                                        post.category
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <FaUsers className="text-gray-400" />
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
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <FaCalendarAlt className="text-gray-400" />
                                                                    {formatDate(
                                                                        post.deadline
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <FaMapMarkerAlt className="text-gray-400" />
                                                                    {
                                                                        post.location
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-2 justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            handleUpdatePost(
                                                                                post._id
                                                                            )
                                                                        }
                                                                        className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                                                                    >
                                                                        <FaEdit className="w-3 h-3 mr-1" />
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            confirmDelete(
                                                                                post
                                                                            )
                                                                        }
                                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                                    >
                                                                        <FaTrash className="w-3 h-3 mr-1" />
                                                                        Delete
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
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FaPlus className="text-gray-400 text-2xl" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No posts yet
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            You haven't created any volunteer
                                            opportunities yet.
                                        </p>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                        {/* My Volunteer Request Posts Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                                            <FaHeart className="text-green-600 text-2xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                People interested to work
                                            </h2>
                                            <p className="text-gray-600 text-sm">
                                                People who responded to your
                                                post
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">
                                            {myVolunteerRequests.length}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                            Applications
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {myVolunteerRequests.length > 0 ? (
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
                                                        Organizer
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
                                                {myVolunteerRequests.map(
                                                    (request) => (
                                                        <tr
                                                            key={request.id}
                                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="py-4 px-4">
                                                                <div className="font-medium text-gray-900">
                                                                    {
                                                                        request.postTitle
                                                                    }
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
                                                                <div className="text-gray-600">
                                                                    {
                                                                        request.organizer
                                                                    }
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
                                                                <Badge
                                                                    className={`${
                                                                        request.status ===
                                                                        "accepted"
                                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                                    }`}
                                                                >
                                                                    {request.status ===
                                                                    "accepted" ? (
                                                                        <>
                                                                            <LuUserCheck className="w-3 h-3 mr-1" />{" "}
                                                                            Accepted
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FaClock className="w-3 h-3 mr-1" />{" "}
                                                                            Pending
                                                                        </>
                                                                    )}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-2 justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            handleCancelRequest(
                                                                                request.id
                                                                            )
                                                                        }
                                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                                    >
                                                                        <LuUserX className="w-3 h-3 mr-1" />
                                                                        Cancel
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
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FaHeart className="text-gray-400 text-2xl" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No applications yet
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            You haven't applied to any volunteer
                                            opportunities yet.
                                        </p>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                                            Browse Opportunities
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <FaExclamationTriangle className="text-red-600 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Delete Post
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to delete this post?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 border">
                                <p className="font-medium text-gray-900">
                                    {deleteConfirm.postTitle}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {deleteConfirm.category} •{" "}
                                    {deleteConfirm.location}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={cancelDelete}
                                disabled={deleteLoading}
                                className="px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    handleDeletePost(deleteConfirm._id)
                                }
                                disabled={deleteLoading}
                                className="px-6"
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="w-4 h-4 mr-2" />
                                        Delete Post
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
