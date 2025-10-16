import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import CustomToast from "./CustomToast";

const ContinueWithGoogle = () => {
    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then((res) => {
                console.log(res.user);
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
