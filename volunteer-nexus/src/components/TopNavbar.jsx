import Footer from "@/components/Footer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    MobileNavToggle,
    Navbar,
    NavbarButton,
    NavbarLogo,
    NavBody,
    NavItems,
} from "@/components/ui/resizable-navbar";
import {
    ClipboardList,
    Home,
    LogOut,
    PlusCircle,
    Settings2,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const TopNavBar = () => {
    const { user, signOutUser } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOutUser();
        } catch (err) {
            console.error(err);
        }
    };

    const navItems = [
        {
            name: "Home",
            link: "/",
        },
        {
            name: "Post Opportunity",
            link: "/volunteer/add-post",
        },
        {
            name: "Manage My Posts",
            link: "/manage-post/me",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative w-full min-h-screen flex flex-col">
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        aria-label="Open user menu"
                                        className="rounded-full outline-hidden ring-0 focus-visible:ring-2 focus-visible:ring-blue-500 transition"
                                    >
                                        <img
                                            src={user?.photoURL}
                                            alt={user?.displayName}
                                            referrerPolicy="no-referrer"
                                            className="object-cover size-10 rounded-full hover:brightness-95"
                                        />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-64 z-[9999]"
                                >
                                    <DropdownMenuLabel className="flex items-center gap-3">
                                        <img
                                            src={user?.photoURL}
                                            alt={user?.displayName}
                                            referrerPolicy="no-referrer"
                                            className="object-cover size-8 rounded-full"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">
                                                {user?.displayName || "User"}
                                            </p>
                                            <p className="text-xs text-neutral-500 truncate">
                                                {user?.email || "No email"}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link to="/">
                                        <DropdownMenuItem>
                                            <Home className="size-4" />
                                            Home
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to="/volunteer/add-post">
                                        <DropdownMenuItem>
                                            <PlusCircle className="size-4" />
                                            Post Opportunity
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to="/manage-post/me">
                                        <DropdownMenuItem>
                                            <Settings2 className="size-4" />
                                            Manage my posts
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="size-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to={"/sign-in"}>
                                <NavbarButton variant="primary">
                                    Sign in
                                </NavbarButton>
                            </Link>
                        )}
                    </div>
                </NavBody>
                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="flex w-full flex-col gap-5">
                            {user ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-3 items-center rounded-xl border p-3 bg-gray-50">
                                        <img
                                            src={user?.photoURL}
                                            alt={user?.displayName}
                                            referrerPolicy="no-referrer"
                                            className="object-cover size-10 rounded-full"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-neutral-900 font-semibold truncate">
                                                {user?.displayName || "User"}
                                            </p>
                                            <p className="text-neutral-600 text-sm truncate">
                                                {user?.email || "No email"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <Link
                                            to="/"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="inline-flex items-center gap-3 rounded-lg border px-3 py-3 text-neutral-800 hover:bg-gray-50 active:scale-[.99] transition"
                                        >
                                            <Home className="size-5 text-neutral-600" />
                                            <span className="block">Home</span>
                                        </Link>
                                        <Link
                                            to="/volunteer/add-post"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="inline-flex items-center gap-3 rounded-lg border px-3 py-3 text-neutral-800 hover:bg-gray-50 active:scale-[.99] transition"
                                        >
                                            <PlusCircle className="size-5 text-neutral-600" />
                                            <span className="block">
                                                Post Opportunity
                                            </span>
                                        </Link>
                                        <Link
                                            to="/manage-post/me"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="inline-flex items-center gap-3 rounded-lg border px-3 py-3 text-neutral-800 hover:bg-gray-50 active:scale-[.99] transition"
                                        >
                                            <ClipboardList className="size-5 text-neutral-600" />
                                            <span className="block">
                                                Manage my posts
                                            </span>
                                        </Link>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-red-700 hover:bg-red-100 active:scale-[.99] transition text-left"
                                    >
                                        <LogOut className="size-4" />
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to={"/sign-in"}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-3 font-semibold active:scale-[.99]"
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
            <main className="flex-1 pt-24 md:pt-28">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default TopNavBar;
