import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home/Home";
import HuntingPost from "../Pages/HuntingPost";
import ManageMyPost from "../Pages/ManageMyPost";
import Page404 from "../Pages/Page404";
import PostToGetVolunteer from "../Pages/PostToGetVolunteer";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import PrivateRoute from "./PrivateRoute";
import PreventedRoute from "./PreventedRoute";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Page404 />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/sign-in",
                element: (
                    <PreventedRoute>
                        <SignIn />
                    </PreventedRoute>
                ),
            },
            {
                path: "/sign-up",
                element: (
                    <PreventedRoute>
                        <SignUp />
                    </PreventedRoute>
                ),
            },
            {
                path: "/volunteer-need/:id",
                element: (
                    <PrivateRoute>
                        <HuntingPost />
                    </PrivateRoute>
                ),
            },
            {
                path: "/volunteer/add-post",
                element: (
                    <PrivateRoute>
                        <PostToGetVolunteer />
                    </PrivateRoute>
                ),
            },
            {
                path: "/volunteer/edit-post",
                element: (
                    <PrivateRoute>
                        <PostToGetVolunteer />
                    </PrivateRoute>
                ),
            },
            {
                path: "/manage-post/me",
                element: (
                    <PrivateRoute>
                        <ManageMyPost />
                    </PrivateRoute>
                ),
            },
        ],
    },
    {
        path: "*",
        element: <Page404 />,
    },
]);

export default routes;
