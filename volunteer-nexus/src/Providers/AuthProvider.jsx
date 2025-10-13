import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import app from "../firebase/firebase.init";

const AuthProvider = ({ children }) => {
    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useState(null);

    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const signInWithManualEmailAndPass = (email, password) => {
        setUserLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = () => {
        setUserLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const signOutUser = () => {
        setUserLoading(true);
        return signOut(auth);
    };

    const authInfo = [
        user,
        setUser,
        userLoading,
        signInWithManualEmailAndPass,
        signInWithGoogle,
        signOutUser,
    ];

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
