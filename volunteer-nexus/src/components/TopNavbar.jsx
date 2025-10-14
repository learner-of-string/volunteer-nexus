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
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Footer from "@/components/Footer";
import useAuth from "../hooks/useAuth";

const TopNavBar = () => {
    const { user } = useAuth();

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
                            <img
                                src={user?.photoURL}
                                alt={user?.displayName}
                                // referrerPolicy="no-referrer"
                                className="object-cover size-10 rounded-full"
                            />
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
                            <Link to={"/sign-in"}>
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Sign in
                                </NavbarButton>
                            </Link>
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
