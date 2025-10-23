import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { useEffect, useMemo, useState } from "react";
import { FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios.jsx";
import formatDate from "../../lib/formateDate";

const VolunteerNeedNow = ({ searchTerm = "", selectedCategory = "all" }) => {
    const [volunteerHuntingPost, setVolunteerHuntingPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const secureAxios = useAxios();

    const filteredPosts = useMemo(() => {
        let filtered = [...volunteerHuntingPost];

        if (searchTerm) {
            filtered = filtered.filter(
                (post) =>
                    post.postTitle
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    post.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    post.location
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    post.creatorOrg
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (post) =>
                    post.category?.toLowerCase() ===
                    selectedCategory.toLowerCase()
            );
        }

        return filtered;
    }, [volunteerHuntingPost, searchTerm, selectedCategory]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        secureAxios
            .get(`/active-posts/featured`)
            .then((res) => {
                setVolunteerHuntingPost(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError(error.message);
                setLoading(false);
            });
    }, [secureAxios]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 container mx-auto my-6 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                            <div className="w-full h-48 bg-gray-200 rounded-t-2xl"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto my-6 text-center py-12 px-4 sm:px-6">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Failed to load opportunities
                </h3>
                <p className="text-gray-600 mb-6">
                    We couldn't fetch the volunteer opportunities. Please try
                    again.
                </p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    if (volunteerHuntingPost.length === 0) {
        return (
            <div className="container mx-auto my-6 text-center py-12 px-4 sm:px-6">
                <div className="text-gray-400 text-6xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No opportunities available
                </h3>
                <p className="text-gray-600">
                    Check back later for new volunteer opportunities.
                </p>
            </div>
        );
    }

    if (filteredPosts.length === 0) {
        return (
            <div className="container mx-auto my-6 text-center py-12 px-4 sm:px-6">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No opportunities found
                </h3>
                <p className="text-gray-600 mb-4">
                    Try adjusting your search or filter criteria.
                </p>
                <p className="text-sm text-gray-500">
                    Showing 0 of {volunteerHuntingPost.length} opportunities
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <p className="text-gray-700 font-medium">
                            Showing {filteredPosts.length} of{" "}
                            {volunteerHuntingPost.length} opportunities
                        </p>
                        {(searchTerm || selectedCategory !== "all") && (
                            <p className="text-sm text-gray-500">
                                Use filters above to narrow down your search
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 container mx-auto gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6">
                {filteredPosts.map((post) => (
                    <CometCard
                        key={post._id}
                        rotateDepth={6}
                        translateDepth={3}
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                            <div className="relative w-full h-48 overflow-hidden rounded-t-2xl bg-gray-50">
                                <img
                                    src={post?.photoUrl}
                                    alt={post?.postTitle}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    draggable="false"
                                    loading="lazy"
                                    onClick={() =>
                                        navigate(`/volunteer-need/${post._id}`)
                                    }
                                />

                                <div className="absolute top-3 left-3">
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm"
                                    >
                                        {post?.category}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col gap-3 flex-1">
                                <h1
                                    onClick={() =>
                                        navigate(`/volunteer-need/${post._id}`)
                                    }
                                    className="font-semibold tracking-tight font-headline text-lg leading-snug hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                                >
                                    {post?.postTitle}
                                </h1>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                                        <span className="truncate">
                                            {post?.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaClock className="text-red-500 flex-shrink-0" />
                                        <span>
                                            Deadline:{" "}
                                            {formatDate(post?.deadline)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaUsers className="text-green-500 flex-shrink-0" />
                                        <span>
                                            {post?.interestedVolunteers}{" "}
                                            volunteers applied
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-3 mt-auto">
                                    <Button
                                        onClick={() =>
                                            navigate(
                                                `/volunteer-need/${post._id}`
                                            )
                                        }
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-md block cursor-pointer"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CometCard>
                ))}
            </div>
        </div>
    );
};

export default VolunteerNeedNow;
