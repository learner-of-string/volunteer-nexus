import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="mt-16 bg-blue-400/3 border-t-2 border-gray-100">
            <div className="w-11/12 mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-3">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <img
                            src="/volunteerNexus.png"
                            alt="Volunteer Nexus"
                            className="h-8 w-8"
                        />
                        <span className="text-lg font-semibold">
                            Volunteer Nexus
                        </span>
                    </Link>
                    <p className="text-sm text-gray-600">
                        Connecting volunteers with meaningful opportunities
                        across communities.
                    </p>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Link
                            to={"/"}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <FaFacebook />
                        </Link>
                        <Link
                            to={"/"}
                            className="hover:text-sky-500 transition-colors"
                        >
                            <FaTwitter />
                        </Link>
                        <Link
                            to={"/"}
                            className="hover:text-blue-700 transition-colors"
                        >
                            <FaLinkedin />
                        </Link>
                        <Link
                            to={"/"}
                            className="hover:text-black transition-colors"
                        >
                            <FaGithub />
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">Explore</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>
                            <Link to="/" className="hover:text-primary">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/post/opportunity"
                                className="hover:text-primary"
                            >
                                Post Opportunity
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/dashboard"
                                className="hover:text-primary"
                            >
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">Contact</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>Email: support@volunteernexus.org</li>
                        <li>Phone: +88012345678891</li>
                        <li>Location: The Underworld, Den of Hell's Vermin.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">Newsletter</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Get updates on new opportunities.
                    </p>
                    <form className="flex items-center gap-2">
                        <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-black text-white text-sm font-semibold hover:-translate-y-0.5 transition"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="border-t border-gray-300">
                <div className="w-11/12 mx-auto py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
                    <p>
                        © {new Date().getFullYear()} Volunteer Nexus. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link to="#" className="hover:text-primary">
                            Privacy
                        </Link>
                        <Link to="#" className="hover:text-primary">
                            Terms
                        </Link>
                        <Link to="#" className="hover:text-primary">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
