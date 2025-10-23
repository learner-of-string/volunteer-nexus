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

const AuthProvider = ({ children }) => {
    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useState(null);

    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const signOutUser = useCallback(() => {
        setUserLoading(true);
        return signOut(auth);
    }, [auth]);

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
        });
        return unsubscribe;
    }, [auth]);

    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
