import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Page404 from "../Pages/Page404";
import Home from "../Pages/Home/Home";

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
        ],
    },
    {
        path: "*",
        element: <Page404 />,
    },
]);

export default routes;
