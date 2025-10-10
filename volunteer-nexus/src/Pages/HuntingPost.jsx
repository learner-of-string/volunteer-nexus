import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const HuntingPost = () => {
    const [currentPost, setCurrentPost] = useState(null);

    const { id } = useParams();
    console.log(id);

    useEffect(() => {
        if (!id) return;
        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/volunteers/post/${id}`)
            .then((res) => {
                console.log("fetched by axios", res.data);
                setCurrentPost(res.data);
            });
    }, [id]);

    console.log(currentPost);

    return (
        <div>
            <div></div>
        </div>
    );
};

export default HuntingPost;
