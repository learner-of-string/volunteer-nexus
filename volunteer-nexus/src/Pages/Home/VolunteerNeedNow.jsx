import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";

const VolunteerNeedNow = () => {
    const [volunteerHuntingPost, setVolunteerHuntingPost] = useState([]);

    const formatDate = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/volunteers/active`)
            .then((res) => {
                setVolunteerHuntingPost(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    console.log(volunteerHuntingPost);
    console.log(new Date(volunteerHuntingPost?.[0]?.deadline));

    // this is basically a card component that fetch all the data through api and loop and display'em in the ui

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 container mx-auto my-6 gap-8">
            {volunteerHuntingPost.length >= 1 &&
                volunteerHuntingPost.map((post) => (
                    <CometCard
                        key={post._id}
                        rotateDepth={6}
                        translateDepth={3}
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                            <div className="w-full h-48 overflow-hidden rounded-t-2xl flex justify-center items-center bg-gray-50">
                                <Link to={`/hunting-post/${post._id}`}>
                                    <img
                                        src={post?.photoUrl}
                                        alt={post?.postTitle}
                                        className="w-full h-full object-cover"
                                        draggable="false"
                                    />
                                </Link>
                            </div>
                            <div className="p-4 flex flex-col gap-2 flex-1">
                                <Badge variant="secondary">
                                    {post?.category}
                                </Badge>
                                <h1 className="font-semibold tracking-tight font-headline text-lg leading-snug hover:text-primary transition-colors cursor-pointer">
                                    <Link to={`/hunting-post/${post._id}`}>
                                        {post?.postTitle}
                                    </Link>
                                </h1>
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    <IoLocationOutline />
                                    <span>{post?.location}</span>
                                </p>
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    <SlCalender />
                                    <span>
                                        Deadline: {formatDate(post?.deadline)}
                                    </span>
                                </p>
                                <div className="pt-2 mt-auto">
                                    <Link to={`/hunting-post/${post._id}`}>
                                        <Button className={"w-full"}>
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CometCard>
                ))}
        </div>
    );
};

export default VolunteerNeedNow;
