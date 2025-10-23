import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="mt-12 sm:mt-16 bg-blue-400/3 border-t-2 border-gray-100">
            <div className="w-11/12 mx-auto py-6 sm:py-8 lg:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <img
                            src="/volunteerNexus.png"
                            alt="Volunteer Nexus"
                            className="h-6 w-6 sm:h-8 sm:w-8"
                        />
                        <span className="text-base sm:text-lg font-semibold">
                            Volunteer Nexus
                        </span>
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        Connecting volunteers with meaningful opportunities
                        across communities.
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                        <Link
                            to={"/"}
                            className="hover:text-blue-600 transition-colors text-sm sm:text-base"
                        >
                            <FaFacebook />
                        </Link>
                        <Link
                            to={"/"}
                            className="hover:text-sky-500 transition-colors text-sm sm:text-base"
                        >
                            <FaTwitter />
                        </Link>
                        <Link
                            to={"/"}
                            className="hover:text-blue-700 transition-colors text-sm sm:text-base"
                        >
                            <FaLinkedin />
                        </Link>
                        <Link
                            to={"/"}
                            className="hover:text-black transition-colors text-sm sm:text-base"
                        >
                            <FaGithub />
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                        Explore
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                        <li>
                            <Link
                                to="/"
                                className="hover:text-primary transition-colors"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/post/opportunity"
                                className="hover:text-primary transition-colors"
                            >
                                Post Opportunity
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/dashboard"
                                className="hover:text-primary transition-colors"
                            >
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                        Contact
                    </h3>
                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                        <li className="break-all">
                            Email: support@volunteernexus.org
                        </li>
                        <li>Phone: +88012345678891</li>
                        <li className="break-words">
                            Location: The Underworld, Den of Hell's Vermin.
                        </li>
                    </ul>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                    <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                        Newsletter
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        Get updates on new opportunities.
                    </p>
                    <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="w-full rounded-md border border-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-black text-white text-xs sm:text-sm font-semibold hover:-translate-y-0.5 transition whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="border-t border-gray-300">
                <div className="w-11/12 mx-auto py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <p className="text-center sm:text-left">
                        © {new Date().getFullYear()} Volunteer Nexus. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            to="#"
                            className="hover:text-primary transition-colors text-xs sm:text-sm"
                        >
                            Privacy
                        </Link>
                        <Link
                            to="#"
                            className="hover:text-primary transition-colors text-xs sm:text-sm"
                        >
                            Terms
                        </Link>
                        <Link
                            to="#"
                            className="hover:text-primary transition-colors text-xs sm:text-sm"
                        >
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
