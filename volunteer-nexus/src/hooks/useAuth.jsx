import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const {
        user,
        setUser,
        userLoading,
        signInWithManualEmailAndPass,
        signInWithGoogle,
        signOutUser,
    } = context;

    return {
        user,
        setUser,
        userLoading,
        signInWithManualEmailAndPass,
        signInWithGoogle,
        signOutUser,
    };
};

export default useAuth;
