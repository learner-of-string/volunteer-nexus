import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, userLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && !user) {
            navigate("/sign-in");
        }
    }, [user, userLoading, navigate]);

    if (user) {
        return children;
    }

    if (userLoading) {
        return <Loading />;
    }

    return null;
};

export default PrivateRoute;
