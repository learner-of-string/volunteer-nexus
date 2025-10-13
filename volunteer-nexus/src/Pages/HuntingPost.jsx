import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt, FaUser, FaUsers } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import formatDate from "../lib/formateDate";

const HuntingPost = () => {
    const [currentPost, setCurrentPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();

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
                    to="/"
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
                                {currentPost?.organizer ||
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
                                    {currentPost?.interestedVolunteers}{" "}
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
                            <FaUsers className="text-blue-600 text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Ready to make a difference?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Join this meaningful volunteer opportunity and
                            contribute to your community. Click below to send
                            your application to the organizer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                            >
                                Apply as Volunteer
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-3 text-lg font-semibold rounded-xl border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                            >
                                Share Opportunity
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HuntingPost;
