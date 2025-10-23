import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FaSearch, FaFilter } from "react-icons/fa";
import { categoriesItem } from "../../lib/categoriesItem";

const QueryHub = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    onClearFilters,
}) => {
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        if (onClearFilters) {
            onClearFilters();
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Opportunities
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by title or location..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10 h-10 sm:h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Category
                            </label>
                            <Select
                                value={selectedCategory}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="h-10 sm:h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                    <FaFilter className="mr-2 text-gray-400 flex-shrink-0" />
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {categoriesItem.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                            {(searchTerm || selectedCategory !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="h-10 sm:h-12 px-4 sm:px-6 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200 w-full"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryHub;
