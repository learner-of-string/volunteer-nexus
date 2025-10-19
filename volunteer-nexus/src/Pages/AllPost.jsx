import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
    FaClock,
    FaMapMarkerAlt,
    FaSearch,
    FaUsers,
    FaFilter,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import formatDate from "../lib/formateDate";
import { categoriesItem } from "../lib/categoriesItem";

const AllPost = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const navigate = useNavigate();

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/all-posts`
            );
            setAllPosts(response.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPosts = useCallback(() => {
        let filtered = [...allPosts];

        // Filter by search term
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

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (post) =>
                    post.category?.toLowerCase() ===
                    selectedCategory.toLowerCase()
            );
        }

        // Sort posts
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b._id) - new Date(a._id);
                case "oldest":
                    return new Date(a._id) - new Date(b._id);
                case "deadline":
                    return new Date(a.deadline) - new Date(b.deadline);
                case "volunteers":
                    return (
                        (b.interestedVolunteers || 0) -
                        (a.interestedVolunteers || 0)
                    );
                default:
                    return 0;
            }
        });

        setFilteredPosts(filtered);
    }, [allPosts, searchTerm, selectedCategory, sortBy]);

    useEffect(() => {
        fetchAllPosts();
    }, []);

    useEffect(() => {
        filterAndSortPosts();
    }, [filterAndSortPosts]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSortBy("newest");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(9)].map((_, index) => (
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
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Failed to load posts
                    </h3>
                    <p className="text-gray-600 mb-6">
                        We couldn't fetch the volunteer opportunities. Please
                        try again.
                    </p>
                    <Button onClick={fetchAllPosts}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                            backgroundSize: "20px 20px",
                        }}
                    ></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-32 right-20 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-indigo-300/20 rounded-full blur-lg animate-pulse delay-500"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                    <div className="text-center space-y-6">
                        {/* Badge */}
                        <div className="group relative inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-500 ease-out cursor-pointer overflow-hidden min-w-[12px] min-h-[12px] hover:min-w-[200px] hover:min-h-[40px] hover:shadow-2xl hover:shadow-green-400/30 hover:border-green-400/50">
                            {/* Collapsed state - single dot with curiosity effects */}
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse group-hover:opacity-0 transition-opacity duration-300"></div>
                                {/* Subtle glow ring that appears occasionally */}
                                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
                                {/* Mysterious sparkle effect */}
                                <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
                                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
                            </div>

                            {/* Expanded state - full text with reveal animation */}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform scale-95 group-hover:scale-100">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-white whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                    Live Opportunities
                                </span>
                                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                                {/* Animated arrow that slides in */}
                                <div className="w-2 h-2 transform translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-300">
                                    <svg
                                        className="w-2 h-2 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Subtle hint text that appears briefly */}
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-500 whitespace-nowrap">
                                ✨ Hover to explore
                            </div>
                        </div>

                        {/* Main Heading */}
                        <div className="flex md:flex-row flex-col gap-1.5 items-center justify-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-tight">
                                Volunteer
                            </h1>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Opportunities
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
                            Discover meaningful volunteer opportunities and make
                            a
                            <span className="font-semibold text-yellow-300">
                                {" "}
                                lasting impact
                            </span>{" "}
                            in your community
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12 py-4">
                            <div className="text-center min-w-[100px]">
                                <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-1">
                                    {allPosts.length}+
                                </div>
                                <div className="text-blue-200 text-xs font-medium uppercase tracking-wide">
                                    Opportunities
                                </div>
                            </div>
                            <div className="text-center min-w-[100px]">
                                <div className="text-2xl md:text-3xl font-bold text-green-300 mb-1">
                                    {allPosts.reduce(
                                        (sum, post) =>
                                            sum +
                                            (post.interestedVolunteers || 0),
                                        0
                                    )}
                                    +
                                </div>
                                <div className="text-blue-200 text-xs font-medium uppercase tracking-wide">
                                    Volunteers
                                </div>
                            </div>
                            <div className="text-center min-w-[100px]">
                                <div className="text-2xl md:text-3xl font-bold text-purple-300 mb-1">
                                    {
                                        new Set(
                                            allPosts.map(
                                                (post) => post.category
                                            )
                                        ).size
                                    }
                                    +
                                </div>
                                <div className="text-blue-200 text-xs font-medium uppercase tracking-wide">
                                    Categories
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <button
                                onClick={() =>
                                    document
                                        .querySelector('input[type="text"]')
                                        ?.focus()
                                }
                                className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 min-w-[180px]"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    Start Searching
                                </span>
                            </button>
                            <button
                                onClick={() => navigate("/volunteer/add-post")}
                                className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-8 py-3 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/30 min-w-[200px]"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Create Opportunity
                                </span>
                            </button>
                        </div>

                        {/* Scroll Indicator */}
                        <div className="pt-8 animate-bounce">
                            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center mx-auto">
                                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-blue-600/20 to-gray-50"></div>
            </div>

            {/* Filters and Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="space-y-4">
                        {/* Main Filter Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Opportunities
                                </label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search opportunities..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-10 h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Category
                                </label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger className="h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <FaFilter className="mr-2 text-gray-400 flex-shrink-0" />
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {categoriesItem.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    category.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort */}
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort by
                                </label>
                                <Select
                                    value={sortBy}
                                    onValueChange={handleSortChange}
                                >
                                    <SelectTrigger className="h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">
                                            Newest First
                                        </SelectItem>
                                        <SelectItem value="oldest">
                                            Oldest First
                                        </SelectItem>
                                        <SelectItem value="deadline">
                                            Deadline
                                        </SelectItem>
                                        <SelectItem value="volunteers">
                                            Most Volunteers
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Clear Filters Row */}
                        {(searchTerm ||
                            selectedCategory !== "all" ||
                            sortBy !== "newest") && (
                            <div className="flex justify-end pt-2 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="h-10 px-6 text-sm"
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="space-y-1">
                        <p className="text-gray-700 font-medium">
                            Showing {filteredPosts.length} of {allPosts.length}{" "}
                            opportunities
                        </p>
                        {filteredPosts.length !== allPosts.length && (
                            <p className="text-sm text-gray-500">
                                Use filters above to narrow down your search
                            </p>
                        )}
                    </div>
                    {filteredPosts.length !== allPosts.length && (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            size="sm"
                            className="self-start sm:self-center"
                        >
                            Show All
                        </Button>
                    )}
                </div>

                {/* Posts Grid */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                            No opportunities found
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Try adjusting your search or filter criteria to find
                            more opportunities.
                        </p>
                        <Button onClick={clearFilters} size="lg">
                            Clear All Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredPosts.map((post) => (
                            <CometCard
                                key={post._id}
                                rotateDepth={6}
                                translateDepth={3}
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                                    {/* Image Section */}
                                    <div className="relative w-full h-48 overflow-hidden rounded-t-2xl bg-gray-50">
                                        <img
                                            src={post?.photoUrl}
                                            alt={post?.postTitle}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            draggable="false"
                                            loading="lazy"
                                            onClick={() =>
                                                navigate(
                                                    `/volunteer-need/${post._id}`
                                                )
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

                                        {/* Deadline Badge */}
                                        <div className="absolute top-3 right-3">
                                            <Badge
                                                variant="destructive"
                                                className="bg-red-500/90 text-white backdrop-blur-sm"
                                            >
                                                <FaClock className="mr-1 text-xs" />
                                                {formatDate(post?.deadline)}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 flex flex-col gap-4 flex-1">
                                        <h1
                                            onClick={() =>
                                                navigate(
                                                    `/volunteer-need/${post._id}`
                                                )
                                            }
                                            className="font-semibold tracking-tight font-headline text-lg leading-snug hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                                        >
                                            {post?.postTitle}
                                        </h1>

                                        {/* Organization */}
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                by {post?.creatorOrg}
                                            </span>
                                        </div>

                                        {/* Info Icons */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                                                <span className="truncate">
                                                    {post?.location}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaUsers className="text-green-500 flex-shrink-0" />
                                                <span>
                                                    {post?.interestedVolunteers ||
                                                        0}{" "}
                                                    of{" "}
                                                    {post?.necessaryVolunteers}{" "}
                                                    volunteers
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description Preview */}
                                        <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                                            {post?.description}
                                        </p>

                                        {/* CTA Button */}
                                        <div className="pt-4 mt-auto">
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
                )}
            </div>
        </div>
    );
};

export default AllPost;
