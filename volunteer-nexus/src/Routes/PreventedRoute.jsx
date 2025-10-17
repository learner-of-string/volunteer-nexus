import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomToast from "../components/CustomToast";
import useAuth from "../hooks/useAuth";

const PreventedRoute = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            toast.custom((t) => (
                <CustomToast type="warning" onClose={() => toast.dismiss(t)}>
                    আব্বে ওই! কয়বার সাইন ইন করার শখ আজব তো মাইরি...
                </CustomToast>
            ));
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    if (!user) return children;
    return null;
};

export default PreventedRoute;
