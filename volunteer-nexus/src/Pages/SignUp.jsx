import CustomToast from "@/components/CustomToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const { signUpWithEmailPassword } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        photoURL: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.password) newErrors.password = "Password is required";
        if (form.password && form.password.length < 6)
            newErrors.password = "Minimum 6 characters";
        if (form.password && !/[A-Z]/.test(form.password))
            newErrors.password = "Must include an uppercase letter";
        if (form.password && !/[a-z]/.test(form.password))
            newErrors.password = "Must include a lowercase letter";
        return newErrors;
    };

    const signUpWithEmail = async (e) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) {
            toast.custom((t) => (
                <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                    Please fix the highlighted errors and try again.
                </CustomToast>
            ));
            return;
        }

        try {
            setSubmitting(true);
            await signUpWithEmailPassword(
                form.name.trim(),
                form.photoURL.trim(),
                form.email.trim(),
                form.password
            );
            navigate("/");
            toast.custom((t) => (
                <CustomToast type="success" onClose={() => toast.dismiss(t)}>
                    Account created successfully.
                </CustomToast>
            ));
            setForm({ name: "", email: "", photoURL: "", password: "" });
        } catch (err) {
            toast.custom((t) => (
                <CustomToast type="error" onClose={() => toast.dismiss(t)}>
                    {err?.message || "Failed to create account"}
                </CustomToast>
            ));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md p-6">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Create your account
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Join us to start your journey
                </p>
            </div>
            <form onSubmit={signUpWithEmail} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Abir Khan"
                        aria-invalid={Boolean(errors.name) || undefined}
                    />
                    {errors.name ? (
                        <p className="text-sm text-rose-600">{errors.name}</p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        aria-invalid={Boolean(errors.email) || undefined}
                    />
                    {errors.email ? (
                        <p className="text-sm text-rose-600">{errors.email}</p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="photoURL">Photo URL</Label>
                    <Input
                        id="photoURL"
                        name="photoURL"
                        value={form.photoURL}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••"
                            aria-invalid={Boolean(errors.password) || undefined}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-black/60 hover:bg-black/5 hover:text-black/80 dark:text-white/70 dark:hover:bg-white/5"
                        >
                            {showPassword ? (
                                <FiEyeOff className="h-4 w-4" />
                            ) : (
                                <FiEye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <ul className="text-xs text-muted-foreground">
                        <li>Must be at least 6 characters</li>
                        <li>
                            Must include an uppercase and a lowercase letter
                        </li>
                    </ul>
                    {errors.password ? (
                        <p className="text-sm text-rose-600">
                            {errors.password}
                        </p>
                    ) : null}
                </div>

                <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-500/40 shadow cursor-pointer"
                >
                    {submitting ? "Creating account..." : "Create account"}
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
        </div>
    );
};

export default SignUp;
