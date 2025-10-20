import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import CustomToast from "./CustomToast";
import axios from "axios";

const ContinueWithGoogle = () => {
    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const createUserInDatabase = async (userData) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/users`,
                {
                    displayName: userData.displayName,
                    email: userData.email,
                    photoURL: userData.photoURL || "",
                }
            );
            console.log("User created in database:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creating user in database:", error);
            return null;
        }
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(async (res) => {
                console.log(res.user);

                // Create user in database after successful Google authentication
                if (res?.user) {
                    await createUserInDatabase({
                        displayName: res.user.displayName,
                        email: res.user.email,
                        photoURL: res.user.photoURL,
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
