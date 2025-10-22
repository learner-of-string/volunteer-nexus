import React from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, userLoading } = useAuth();

    const navigate = useNavigate();

    if (user) {
        return children;
    }

    if (userLoading) {
        return <Loading />;
    }

    if (!user) {
        navigate("/sign-in");
    }
};

export default PrivateRoute;
