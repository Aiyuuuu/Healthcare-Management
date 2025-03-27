import React, { useState } from "react";
import axios from "axios";
import { showToast } from "../../components/ToastNotification/Toast"; 
import styles from "./SearchSpecialists.module.css";

function SearchSpecialists({ formattedSpecializationName, onSearchResults }) {
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState({
        city: "",
        experience: "",
        fee: ""
    });
    const [loading, setLoading] = useState(false); // Prevent duplicate calls

    const cities = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"];

    // Fetch doctors when the search button is clicked
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            console.log( {
                specialization: formattedSpecializationName,
                name: searchInput.trim(),  // Ensure no extra spaces
                city: filters.city || undefined,
                experience: filters.experience || undefined,
                fee: filters.fee || undefined
            })
            const response = await axios.get("/doctors", {
                params: {
                    specialization: formattedSpecializationName,
                    name: searchInput.trim(),  // Ensure no extra spaces
                    city: filters.city || undefined,
                    experience: filters.experience || undefined,
                    fee: filters.fee || undefined
                }
            });
            

            if (["fail", "failed"].includes(response.data?.status)) {
                showToast("error", response.data.reason || response.data.message);
            } else {
                onSearchResults(response.data); // Pass results to parent
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            showToast("error", error.response?.data?.message || "Network error. Please try again.");
        }
        setLoading(false);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Handle Enter key press for search
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            fetchDoctors();
        }
    };

    return (
        <div className={`row g-3 ${styles.searchComponent}`}>
            {/* Search Input */}
            <div className="col-md-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder={`Search ${formattedSpecializationName} by name (can be left empty)`}
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyEnter={handleKeyPress} // Trigger search on Enter key
                />
            </div>

            {/* City Filter */}
            <div className="col-md-2">
                <select className="form-select" name="city" value={filters.city} onChange={handleFilterChange}>
                    <option value="">Select City</option>
                    {cities.map((city) => (
                        <option key={city.toLowerCase()} value={city.toLowerCase()}>{city}</option>
                    ))}
                </select>
            </div>

            {/* Experience Filter */}
            <div className="col-md-2">
                <select className="form-select" name="experience" value={filters.experience} onChange={handleFilterChange}>
                    <option value="">Experience</option>
                    <option value="1-3">1-3 years</option>
                    <option value="4-6">4-6 years</option>
                    <option value="7-10">7-10 years</option>
                    <option value="10+">10+ years</option>
                </select>
            </div>

            {/* Fee Filter */}
            <div className="col-md-2">
                <select className="form-select" name="fee" value={filters.fee} onChange={handleFilterChange}>
                    <option value="">Select Fee Range (PKR)</option>
                    <option value="500-1000">500 - 1000</option>
                    <option value="1000-2000">1000 - 2000</option>
                    <option value="2000+">2000+</option>
                </select>
            </div>

            {/* Search Button */}
            <div className="col-md-2">
                <button className={`btn btn-primary w-100 ${styles.searchButton}`} onClick={fetchDoctors} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
        </div>
    );
}

export default SearchSpecialists;
