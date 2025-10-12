import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home/Home";
import HuntingPost from "../Pages/HuntingPost";
import ManageMyPost from "../Pages/ManageMyPost";
import Page404 from "../Pages/Page404";
import PostToGetVolunteer from "../Pages/PostToGetVolunteer";

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
                path: "/volunteer-need/:id",
                element: <HuntingPost />,
            },
            {
                path: "/volunteer/add-post",
                element: <PostToGetVolunteer />,
            },
            {
                path: "/volunteer/edit-post",
                element: <PostToGetVolunteer />,
            },
            {
                path: "/manage-post/me",
                element: <ManageMyPost />,
            },
        ],
    },
    {
        path: "*",
        element: <Page404 />,
    },
]);

export default routes;
