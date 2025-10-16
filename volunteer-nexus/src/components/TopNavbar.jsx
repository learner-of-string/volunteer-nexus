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
import { useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import useAuth from "../hooks/useAuth";

const TopNavBar = () => {
    const { user, signOutUser } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const closeTimer = useRef(null);

    const applyTheme = (theme) => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
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
                            <div
                                onMouseEnter={() => {
                                    if (closeTimer.current) {
                                        clearTimeout(closeTimer.current);
                                        closeTimer.current = null;
                                    }
                                    setMenuOpen(true);
                                }}
                                onMouseLeave={() => {
                                    closeTimer.current = setTimeout(() => {
                                        setMenuOpen(false);
                                    }, 200);
                                }}
                            >
                                <DropdownMenu
                                    open={menuOpen}
                                    onOpenChange={setMenuOpen}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            aria-haspopup="menu"
                                            aria-label="User menu"
                                            className="overflow-hidden rounded-full ring-1 ring-black/5 dark:ring-white/10"
                                            onClick={() =>
                                                setMenuOpen((v) => !v)
                                            }
                                        >
                                            <img
                                                src={user?.photoURL}
                                                alt={user?.displayName}
                                                referrerPolicy="no-referrer"
                                                className="object-cover size-10 rounded-full"
                                            />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-72"
                                        onMouseEnter={() => {
                                            if (closeTimer.current) {
                                                clearTimeout(
                                                    closeTimer.current
                                                );
                                                closeTimer.current = null;
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            closeTimer.current = setTimeout(
                                                () => {
                                                    setMenuOpen(false);
                                                },
                                                200
                                            );
                                        }}
                                    >
                                        <div className="flex items-center gap-3 px-2 py-1.5">
                                            <img
                                                src={user?.photoURL}
                                                alt={user?.displayName}
                                                referrerPolicy="no-referrer"
                                                className="object-cover size-10 rounded-full"
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                                    {user?.displayName ||
                                                        "User"}
                                                </p>
                                                <p className="truncate text-xs text-gray-600 dark:text-gray-300">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400">
                                            Theme
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                applyTheme("light");
                                            }}
                                        >
                                            Light
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                applyTheme("dark");
                                            }}
                                        >
                                            Dark
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                navigate("/profile");
                                            }}
                                        >
                                            My profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            data-variant="destructive"
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                signOutUser()
                                                    .then(() => navigate("/"))
                                                    .catch(() => {});
                                            }}
                                        >
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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
                        {navItems.map((item, idx) => (
                            <Link
                                key={`mobile-link-${idx}`}
                                to={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block">{item.name}</span>
                            </Link>
                        ))}
                        <div className="flex w-full flex-col gap-4">
                            {user ? (
                                <div className="flex gap-1.5 items-center">
                                    <img
                                        src={user?.photoURL}
                                        alt={user?.displayName}
                                        referrerPolicy="no-referrer"
                                        className="object-cover size-10 rounded-full"
                                    />
                                    <p className="text-neutral-600 text-lg">
                                        {user?.displayName}
                                    </p>
                                </div>
                            ) : (
                                <Link to={"/sign-in"}>
                                    <NavbarButton variant="primary">
                                        Sign in
                                    </NavbarButton>
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
