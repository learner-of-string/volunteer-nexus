import React from "react";
import useAuth from "../hooks/useAuth";
import { LoaderFive } from "@/components/ui/loader";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, userLoading } = useAuth();

    const navigate = useNavigate();

    if (user) {
        return children;
    }

    if (userLoading) {
        return (
            <div className="max-w-sm h-full mt-20 mx-auto flex justify-center items-center">
                <LoaderFive text="dhet! abar ki shob load kora lagbe..." />
            </div>
        );
    }

    if (!user) {
        navigate("/");
    }
};

export default PrivateRoute;
