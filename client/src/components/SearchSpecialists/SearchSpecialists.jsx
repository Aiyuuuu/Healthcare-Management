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

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get("https://dummyjson.com/users", {
                params: {
                    specialization: formattedSpecializationName,
                    searchQuery: searchInput,
                    ...filters
                }
            });
            if(response.status=='failed'){
                showToast("error",response.reason? response.reason:response.message);return;}

            onSearchResults(response.data); // Pass results to parent
        } catch (error) {
            // Show error toast 
            showToast("error", error.response?.data?.message || "Network error. Please try again.");
        }
    };

    return (
        <div className={`row g-3 ${styles.searchComponent}`}>
            <div className="col-md-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder={`Search ${formattedSpecializationName} by name or keyword`}
                    value={searchInput}
                    onChange={handleInputChange}
                />
            </div>

            <div className="col-md-2">
                <select className="form-select" name="city" value={filters.city} onChange={handleFilterChange}>
                    <option value="">Select City</option>
                    <option value="karachi">Karachi</option>
                    <option value="lahore">Lahore</option>
                    <option value="islamabad">Islamabad</option>
                </select>
            </div>

            <div className="col-md-2">
                <select className="form-select" name="experience" value={filters.experience} onChange={handleFilterChange}>
                    <option value="">Experience</option>
                    <option value="1-3">1-3 years</option>
                    <option value="4-6">4-6 years</option>
                    <option value="7+">7+ years</option>
                </select>
            </div>

            <div className="col-md-2">
                <select className="form-select" name="fee" value={filters.fee} onChange={handleFilterChange}>
                    <option value="">Select Fee Range (PKR)</option>
                    <option value="500-1000">500 - 1000</option>
                    <option value="1000-2000">1000 - 2000</option>
                    <option value="2000+">2000+</option>
                </select>
            </div>

            <div className="col-md-2">
                <button className={`btn btn-primary w-100 ${styles.searchButton}`} onClick={handleSearch}>
                    Search
                </button>
            </div>
        </div>
    );
}

export default SearchSpecialists;
