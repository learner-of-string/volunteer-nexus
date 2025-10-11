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
import { categoriesItem } from "../../lib/categoriesItem";

const QueryHub = () => {
    return (
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:max-w-sm">
                <Input placeholder="Search by title or location" />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {categoriesItem.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default QueryHub;
