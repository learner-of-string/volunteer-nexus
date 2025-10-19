import React, { useState } from "react";
import HeroArea from "./HeroArea";
import QueryHub from "./QueryHub";
import VolunteerNeedNow from "./VolunteerNeedNow";

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <HeroArea />
            <div className="py-8">
                <QueryHub
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onClearFilters={handleClearFilters}
                />
            </div>
            <VolunteerNeedNow
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
            />
        </div>
    );
};

export default Home;
