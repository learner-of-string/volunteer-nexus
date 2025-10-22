import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import CustomToast from "../components/CustomToast";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { signInWithManualEmailAndPass } = useAuth();

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
            // Don't throw error here as Firebase auth was successful
            // Just log the error and continue
            return null;
        }
    };

    const getJWTToken = async (userData) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/jwt`,
                {
                    email: userData.email,
                    displayName: userData.displayName,
                },
                {
                    withCredentials: true,
                }
            );
            console.log("JWT token set in httpOnly cookie");
            return true;
        } catch (error) {
            console.error("Error getting JWT token:", error);
            return false;
        }
    };

    const handleSignInWithEmailAndPass = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        signInWithManualEmailAndPass(email, password)
            .then(async (userCredential) => {
                // Create user in database after successful Firebase authentication
                if (userCredential?.user) {
                    await createUserInDatabase({
                        displayName: userCredential.user.displayName,
                        email: userCredential.user.email,
                        photoURL: userCredential.user.photoURL,
                    });

                    // Get JWT token (set in httpOnly cookie)
                    await getJWTToken({
                        email: userCredential.user.email,
                        displayName: userCredential.user.displayName,
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
                        {err?.message || "Failed to sign in. Please try again."}
                    </CustomToast>
                ));
            });
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mx-auto w-full max-w-md">
                <div className="relative rounded-2xl border bg-white/70 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] backdrop-blur dark:bg-neutral-900/60">
                    {/* Cute accent blob */}
                    <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-100 blur-2xl dark:bg-blue-500/20" />
                    <div className="pointer-events-none absolute -bottom-8 -left-10 h-24 w-24 rounded-full bg-pink-100 blur-2xl dark:bg-pink-500/20" />

                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Welcome back
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Sign in to continue your journey
                        </p>
                    </div>

                    <form
                        onSubmit={handleSignInWithEmailAndPass}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {/* <Link
                                    to="#"
                                    className="text-xs text-blue-700 hover:text-blue-800 underline-offset-4 hover:underline dark:text-blue-400"
                                >
                                    Forgot?
                                </Link> */}
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-4 w-4" />
                                    ) : (
                                        <FiEye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-500/40 shadow cursor-pointer"
                        >
                            Sign in
                        </Button>
                    </form>

                    <div className="my-4 flex items-center gap-3">
                        <div className="h-px w-full bg-gray-300 dark:bg-neutral-700" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                            or
                        </span>
                        <div className="h-px w-full bg-gray-300 dark:bg-neutral-700" />
                    </div>
                    <ContinueWithGoogle />
                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                        Don’t have an account?{" "}
                        <Link
                            to="/sign-up"
                            className="text-blue-700 underline-offset-4 hover:underline hover:text-blue-800 dark:text-blue-400"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
