import { Button } from "@/components/ui/button";
import { LuTriangleAlert } from "react-icons/lu";
import { Link } from "react-router-dom";

const Page404 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center px-4">
            <LuTriangleAlert className="w-24 h-24 text-primary mb-4" />
            <h1 className="text-4xl font-headline font-bold text-primary">
                404 - Page Not Found
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Oops! The page you are looking for does not exist.
            </p>
            <p className="mt-2 text-muted-foreground">
                It might have been moved or deleted.
            </p>
            <Button asChild className="mt-8">
                <Link to="/">Go Back to Homepage</Link>
            </Button>
        </div>
    );
};

export default Page404;
