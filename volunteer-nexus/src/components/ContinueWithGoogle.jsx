import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios.jsx";
import CustomToast from "./CustomToast";

const ContinueWithGoogle = () => {
    const { signInWithGoogle } = useAuth();
    const secureAxios = useAxios();
    const navigate = useNavigate();

    const createUserInDatabase = async (userData) => {
        try {
            const response = await secureAxios.post(`/users`, {
                displayName: userData.displayName,
                email: userData.email,
                photoURL: userData.photoURL || "",
            });
            return response.data;
        } catch (error) {
            console.error("Error creating user in database:", error);
            toast.custom((t) => (
                <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                    Failed to create user profile. Please try again.
                </CustomToast>
            ));
            return null;
        }
    };

    const getJWTToken = async (userData) => {
        try {
            await secureAxios.post(`/jwt`, {
                email: userData.email,
                displayName: userData.displayName,
            });
            return true;
        } catch (error) {
            console.error("Error getting JWT token:", error);
            return false;
        }
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(async (res) => {
                if (res?.user) {
                    await createUserInDatabase({
                        displayName: res.user.displayName,
                        email: res.user.email,
                        photoURL: res.user.photoURL,
                    });

                    await getJWTToken({
                        email: res.user.email,
                        displayName: res.user.displayName,
                    });
                }

                navigate("/");
                toast.custom((t) => (
                    <CustomToast
                        type="success"
                        onClose={() => toast.dismiss(t)}
                    >
                        Signed in successfully!
                    </CustomToast>
                ));
            })
            .catch((err) => {
                toast.custom((t) => (
                    <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                        {err?.message || "Sign-in failed. Please try again."}
                    </CustomToast>
                ));
            });
    };

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
            onClick={handleGoogleSignIn}
        >
            <FcGoogle className="mr-1.5 text-lg" />
            Continue with Google
        </Button>
    );
};

export default ContinueWithGoogle;
