import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useAxios from "../hooks/useAxios.jsx";
import { useEffect, useState } from "react";
import {
    FaBuilding,
    FaCalendarAlt,
    FaEnvelope,
    FaImage,
    FaMapMarkerAlt,
    FaUsers,
} from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { LuCheck, LuChevronDown, LuUpload } from "react-icons/lu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { categoriesItem } from "../lib/categoriesItem";

const PostToGetVolunteer = () => {
    const { id } = useParams();
    const location = useLocation();
    const secureAxios = useAxios();
    const routePostId = location?.state?.postId;
    const storedPostId =
        typeof window !== "undefined"
            ? sessionStorage.getItem("editPostId")
            : null;
    const effectiveId = id || routePostId || storedPostId || null;
    const isEdit = Boolean(effectiveId);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        postTitle: "",
        photoUrl: "",
        category: "",
        deadline: null,
        necessaryVolunteers: "",
        location: "",
        description: "",
        creatorOrg: user?.displayName || "",
        creatorEmail: user?.email || "",
        interestedVolunteers: 0,
    });

    useEffect(() => {
        if (user && !isEdit) {
            setFormData((prev) => ({
                ...prev,
                creatorOrg: user.displayName || "",
                creatorEmail: user.email || "",
                interestedVolunteers: 0,
            }));
        }
    }, [user, isEdit]);

    const handleInputChange = (field, value) => {
        if (!isEdit && (field === "creatorOrg" || field === "creatorEmail")) {
            return;
        }
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.postTitle.trim())
            newErrors.postTitle = "Post title is required";
        if (!formData.photoUrl.trim())
            newErrors.photoUrl = "Photo URL is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!date) newErrors.deadline = "Deadline is required";
        if (!formData.necessaryVolunteers.trim())
            newErrors.necessaryVolunteer = "Number of volunteers is required";
        if (!formData.location.trim())
            newErrors.location = "Location is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";

        if (!user) {
            newErrors.organizer = "Please sign in to create a post";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (!isEdit) return;
        let isActive = true;
        (async () => {
            try {
                const { data } = await secureAxios.get(`/post/${effectiveId}`);
                if (!isActive) return;
                const incomingCategory = data?.category ?? "";
                const matchedCategory = categoriesItem.find(
                    (c) =>
                        c.toLowerCase() ===
                        String(incomingCategory).toLowerCase()
                );
                setFormData({
                    postTitle: data?.postTitle ?? "",
                    photoUrl: data?.photoUrl ?? "",
                    category: matchedCategory || incomingCategory,
                    deadline: data?.deadline ?? null,
                    necessaryVolunteers: String(
                        data?.necessaryVolunteers ?? ""
                    ),
                    location: data?.location ?? "",
                    description: data?.description ?? "",
                    creatorOrg: data?.creatorOrg ?? "",
                    creatorEmail: data?.creatorEmail ?? "",
                    interestedVolunteers: data?.interestedVolunteers ?? 0,
                });
                setDate(data?.deadline ? new Date(data.deadline) : null);
                if (storedPostId) sessionStorage.removeItem("editPostId");
            } catch (e) {
                console.error(e);
            }
        })();
        return () => {
            isActive = false;
        };
    }, [effectiveId, isEdit, storedPostId, secureAxios]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const payload = {
                ...formData,
                deadline: date ? new Date(date).toISOString() : null,
                necessaryVolunteers: Number(formData.necessaryVolunteers || 0),
            };

            const method = isEdit ? "put" : "post";
            const url = isEdit ? `/post/${effectiveId}` : `/posts/new`;

            await secureAxios[method](url, payload);

            setSuccess(true);
            if (isEdit) {
                setTimeout(() => navigate("/manage-post/me"), 800);
            } else {
                setFormData({
                    postTitle: "",
                    photoUrl: "",
                    category: "",
                    deadline: null,
                    necessaryVolunteers: "",
                    location: "",
                    description: "",
                    creatorOrg: "",
                    creatorEmail: "",
                    interestedVolunteers: 0,
                });
                setDate(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user && !isEdit) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl border border-red-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <IoAlertCircle className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Sign In Required
                    </h2>
                    <p className="text-gray-700 mb-6">
                        You need to be signed in to create a volunteer
                        opportunity post. Please sign in to continue.
                    </p>
                    <Button
                        onClick={() => navigate("/sign-in")}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <LuCheck className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Success!
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Your volunteer opportunity has been posted successfully.
                        Volunteers will be able to see and apply for your
                        opportunity.
                    </p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => setSuccess(false)}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            Post Another Opportunity
                        </Button>
                        <Button
                            onClick={() => navigate("/")}
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            Go to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 sm:mb-6 shadow-lg">
                        <FaUsers className="text-white text-lg sm:text-2xl" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                        {isEdit
                            ? "Update Opportunity"
                            : "Create a New Opportunity"}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
                        Fill out the form below to find passionate volunteers
                        for your cause. Make your opportunity stand out with a
                        compelling description.
                    </p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
                    >
                        <div className="space-y-2 sm:space-y-3">
                            <Label
                                htmlFor="postTitle"
                                className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                            >
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                                Post Title
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g., Community Garden Volunteer"
                                name="postTitle"
                                value={formData.postTitle}
                                onChange={(e) =>
                                    handleInputChange(
                                        "postTitle",
                                        e.target.value
                                    )
                                }
                                className={`h-10 sm:h-12 text-sm sm:text-base ${
                                    errors.postTitle
                                        ? "border-red-500 focus:border-red-500"
                                        : ""
                                }`}
                            />
                            {errors.postTitle && (
                                <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                    <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {errors.postTitle}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <Label
                                htmlFor="photoUrl"
                                className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                            >
                                <FaImage className="text-blue-500 text-sm sm:text-base" />
                                Thumbnail Photo URL
                            </Label>
                            <div className="relative">
                                <Input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    name="photoUrl"
                                    value={formData.photoUrl}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "photoUrl",
                                            e.target.value
                                        )
                                    }
                                    className={`h-10 sm:h-12 pl-8 sm:pl-10 text-sm sm:text-base ${
                                        errors.photoUrl
                                            ? "border-red-500 focus:border-red-500"
                                            : ""
                                    }`}
                                />
                                <LuUpload className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                            </div>
                            {errors.photoUrl && (
                                <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                    <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {errors.photoUrl}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                            <div className="space-y-2 sm:space-y-3">
                                <Label
                                    htmlFor="category"
                                    className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                                >
                                    <Badge
                                        variant="outline"
                                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                        Category
                                    </Badge>
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        handleInputChange("category", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`h-10 sm:h-12 text-sm sm:text-base ${
                                            errors.category
                                                ? "border-red-500 focus:border-red-500"
                                                : ""
                                        }`}
                                    >
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {formData.category &&
                                                !categoriesItem.includes(
                                                    formData.category
                                                ) && (
                                                    <SelectItem
                                                        value={
                                                            formData.category
                                                        }
                                                    >
                                                        {String(
                                                            formData.category
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            String(
                                                                formData.category
                                                            ).slice(1)}
                                                    </SelectItem>
                                                )}
                                            {categoriesItem.map((category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        category.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                        <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <Label
                                    htmlFor="deadline"
                                    className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                                >
                                    <FaCalendarAlt className="text-red-500 text-sm sm:text-base" />
                                    Deadline
                                </Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="deadline"
                                            className={`h-10 sm:h-12 w-full justify-between font-normal text-sm sm:text-base ${
                                                errors.deadline
                                                    ? "border-red-500 focus:border-red-500"
                                                    : ""
                                            }`}
                                        >
                                            {date
                                                ? date.toLocaleDateString()
                                                : "Select date"}
                                            <LuChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            fromYear={2025}
                                            toYear={2035}
                                            onSelect={(selectedDate) => {
                                                setDate(selectedDate);
                                                handleInputChange(
                                                    "deadline",
                                                    selectedDate
                                                );
                                                setOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.deadline && (
                                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                        <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {errors.deadline}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                            <div className="space-y-2 sm:space-y-3">
                                <Label
                                    htmlFor="necessaryVolunteer"
                                    className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                                >
                                    <FaUsers className="text-gray-500 text-sm sm:text-base" />
                                    Number of Volunteers Needed
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 5"
                                    name="necessaryVolunteer"
                                    value={formData.necessaryVolunteers}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "necessaryVolunteers",
                                            e.target.value
                                        )
                                    }
                                    className={`h-10 sm:h-12 text-sm sm:text-base ${
                                        errors.necessaryVolunteer
                                            ? "border-red-500 focus:border-red-500"
                                            : ""
                                    }`}
                                />
                                {errors.necessaryVolunteer && (
                                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                        <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {errors.necessaryVolunteer}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <Label
                                    htmlFor="location"
                                    className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                                >
                                    <FaMapMarkerAlt className="text-gray-500 text-sm sm:text-base" />
                                    Location
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="e.g., City Park, Downtown"
                                    name="location"
                                    value={formData.location}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "location",
                                            e.target.value
                                        )
                                    }
                                    className={`h-10 sm:h-12 text-sm sm:text-base ${
                                        errors.location
                                            ? "border-red-500 focus:border-red-500"
                                            : ""
                                    }`}
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                        <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <Label
                                htmlFor="description"
                                className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                            >
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></div>
                                Description
                            </Label>
                            <Textarea
                                name="description"
                                placeholder="Tell us more about the opportunity, what volunteers will do, and any requirements. Be specific about the tasks, time commitment, and any skills needed."
                                value={formData.description}
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                className={`min-h-[100px] sm:min-h-[120px] text-sm sm:text-base ${
                                    errors.description
                                        ? "border-red-500 focus:border-red-500"
                                        : ""
                                }`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                    <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 border border-blue-100">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FaBuilding className="text-blue-600 text-sm sm:text-base" />
                                    Organization Details
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className="text-xs w-fit"
                                >
                                    Auto-filled from your account
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                                <div className="space-y-2 sm:space-y-3">
                                    <Label
                                        htmlFor="organizer"
                                        className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                                    >
                                        <FaBuilding className="text-blue-500 text-sm sm:text-base" />
                                        Organization Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="e.g., Green Earth Foundation"
                                        name="organizer"
                                        value={formData.creatorOrg}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "creatorOrg",
                                                e.target.value
                                            )
                                        }
                                        readOnly={true}
                                        className={`h-10 sm:h-12 bg-gray-50 cursor-not-allowed text-sm sm:text-base ${
                                            errors.organizer
                                                ? "border-red-500 focus:border-red-500"
                                                : ""
                                        }`}
                                    />
                                    {errors.organizer && (
                                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                            <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {errors.organizer}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    <Label
                                        htmlFor="orgEmail"
                                        className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2"
                                    >
                                        <FaEnvelope className="text-blue-500 text-sm sm:text-base" />
                                        Organization Email
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="e.g., contact@greenearth.org"
                                        name="orgEmail"
                                        value={formData.creatorEmail}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "creatorEmail",
                                                e.target.value
                                            )
                                        }
                                        readOnly={true}
                                        className={`h-10 sm:h-12 bg-gray-50 cursor-not-allowed text-sm sm:text-base ${
                                            errors.orgEmail
                                                ? "border-red-500 focus:border-red-500"
                                                : ""
                                        }`}
                                    />
                                    {errors.orgEmail && (
                                        <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                                            <IoAlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {errors.orgEmail}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-6 border-t border-gray-200">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm sm:text-base">
                                            {isEdit
                                                ? "Updating Opportunity..."
                                                : "Creating Opportunity..."}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <LuCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="text-sm sm:text-base">
                                            {isEdit
                                                ? "Update Volunteer Opportunity"
                                                : "Create Volunteer Opportunity"}
                                        </span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostToGetVolunteer;
