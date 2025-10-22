import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import React, { useEffect, useState, useCallback } from "react";
import AuthContext from "../contexts/AuthContext";
import app from "../firebase/firebase.init";
import { useDevToolsStatus } from "../hooks/useDevToolsStatus";
import { toast } from "sonner";
import DevToolsWarning from "../components/DevToolsWarning";

const AuthProvider = ({ children }) => {
    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useState(null);

    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const signOutUser = useCallback(() => {
        setUserLoading(true);
        return signOut(auth);
    }, [auth]);

    const isDevToolsOpen = useDevToolsStatus();
    const [prevDevToolsState, setPrevDevToolsState] = useState(null);
    const [isDevToolsDetected, setIsDevToolsDetected] = useState(false);
    const [countdown, setCountdown] = useState(2);

    useEffect(() => {
        // Only show toast if we have a previous state to compare with
        if (
            prevDevToolsState !== null &&
            prevDevToolsState !== isDevToolsOpen
        ) {
            toast.warning(`Dev tools ${isDevToolsOpen ? "opened" : "closed"}`);
        }

        // Update previous state
        setPrevDevToolsState(isDevToolsOpen);
    }, [isDevToolsOpen, prevDevToolsState]);

    // Dev tools detection and punishment system
    useEffect(() => {
        if (isDevToolsOpen && !isDevToolsDetected) {
            setIsDevToolsDetected(true);

            // Sign out user immediately
            signOutUser().then(() => {
                console.clear();
                console.log("🚨 Dev tools detected! Access denied!");

                // Start countdown
                const countdownInterval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            window.location.reload();
                            return 2;
                        }
                        return prev - 1;
                    });
                }, 1000);

                // Continuous punishment while dev tools are open
                const punishmentInterval = setInterval(() => {
                    if (isDevToolsOpen) {
                        console.clear();
                        console.log(
                            "🚨 Dev tools still open! Refreshing page..."
                        );
                        window.location.reload();
                    } else {
                        clearInterval(punishmentInterval);
                        setIsDevToolsDetected(false);
                        setCountdown(2);
                    }
                }, 2000);

                return () => {
                    clearInterval(countdownInterval);
                    clearInterval(punishmentInterval);
                };
            });
        } else if (!isDevToolsOpen && isDevToolsDetected) {
            setIsDevToolsDetected(false);
            setCountdown(2);
            // Navigate to home page when dev tools are closed
            window.location.href = "/";
        }
    }, [isDevToolsOpen, isDevToolsDetected, signOutUser]);

    const signInWithManualEmailAndPass = (email, password) => {
        setUserLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signUpWithEmailPassword = async (name, photoURL, email, password) => {
        setUserLoading(true);
        const cred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        // Update displayName and photoURL after account creation
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL,
            });
        }
        return cred;
    };

    const signInWithGoogle = () => {
        setUserLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const authInfo = {
        user,
        setUser,
        userLoading,
        signInWithManualEmailAndPass,
        signUpWithEmailPassword,
        signInWithGoogle,
        signOutUser,
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserLoading(false);
            console.log(currentUser);
        });
        return unsubscribe;
    }, [auth]);

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
            <DevToolsWarning
                countdown={countdown}
                isVisible={isDevToolsDetected}
            />
        </AuthContext.Provider>
    );
};

export default AuthProvider;
