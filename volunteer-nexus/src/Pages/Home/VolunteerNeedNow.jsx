import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useEffect, useState } from "react";

const VolunteerNeedNow = () => {
    const [volunteerHuntingPost, setVolunteerHuntingPost] = useState([]);

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-11/12 mx-auto my-3">
            {volunteerHuntingPost.length >= 1 &&
                volunteerHuntingPost.map((post) => (
                    <div key={post._id}>
                        <div>
                            <img
                                src={post?.photoUrl}
                                alt={post?.postTitle}
                                className="object-cover max-w-md max-h-48"
                            />
                        </div>
                        <div>
                            <div>
                                <Badge variant="secondary">
                                    {post?.category}
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default VolunteerNeedNow;
