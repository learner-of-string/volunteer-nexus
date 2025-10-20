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
import AllPost from "../Pages/AllPost";
import ApplicantDetails from "../Pages/ApplicantDetails";
import Dashboard from "../Pages/Dashboard";
import MyApplications from "../Pages/MyApplications";

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
            {
                path: "/all-posts",
                element: <AllPost />,
            },
            {
                path: "/applicant/:applicantEmail",
                element: (
                    <PrivateRoute>
                        <ApplicantDetails />
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard",
                element: (
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: "/my-applications",
                element: (
                    <PrivateRoute>
                        <MyApplications />
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
