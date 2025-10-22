import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomToast from "@/components/CustomToast";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}`,
    withCredentials: true,
});

const useAxios = () => {
    const navigate = useNavigate();
    const { signOutUser } = useAuth();
    useEffect(() => {
        axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.log("error caught at interceptor: ", error);

                if (error?.status === 401 || error?.status === 403) {
                    signOutUser().then(() => {
                        navigate("/sign-in");
                        toast.custom((t) => (
                            <CustomToast
                                type="warning"
                                onClose={() => toast.dismiss(t)}
                                title="Sign-In Required"
                            >
                                Your session has expired. Please sign in again
                                to continue.
                            </CustomToast>
                        ));
                    });
                }
                return Promise.reject(error);
            }
        );
    }, [navigate, signOutUser]);

    return axiosInstance;
};

export default useAxios;
