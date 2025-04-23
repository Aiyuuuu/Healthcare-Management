import React, { useState } from "react";
import { showToast } from "../../components/ToastNotification/Toast"; 
import styles from "./SearchSpecialists.module.css";
import api from "../../services/api";

function SearchSpecialists({ formattedSpecializationName, onSearchResults }) {
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState({
        city: "",
        experience: "",
        fee: ""
    });
    const [loading, setLoading] = useState(false);

    const cities = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"];

    const parseFilters = () => {
        let experienceStart, experienceEnd, feeStart, feeEnd;

        // Parse experience filter
        if (filters.experience) {
            const [min, max] = filters.experience.split(/-|\+/);
            experienceStart = parseInt(min);
            experienceEnd = max ? parseInt(max) : 100; // Handle 10+ case
        }

        // Parse fee filter
        if (filters.fee) {
            const [min, max] = filters.fee.split(/-|\+/);
            feeStart = parseInt(min);
            feeEnd = max ? parseInt(max) : 100000; // Handle 2000+ case
        }

        return {
            name: searchInput.trim() || undefined,
            city: filters.city || undefined,
            experience_start: experienceStart || undefined,
            experience_end: experienceEnd || undefined,
            fee_start: feeStart || undefined,
            fee_end: feeEnd || undefined
        };
    };
    
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const filters = parseFilters();
            
            const response = await api.get("/api/doctors/search", {
                params: {
                    specialization: formattedSpecializationName,
                    ...filters
                }
            });
    
            if (response.data.success) {
                onSearchResults(response.data.data);
            } else {
                showToast("error", response.data.message || "Failed to fetch doctors");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               "Failed to fetch doctors. Please try again.";
            showToast("error", errorMessage);
            onSearchResults([]); // Clear previous results on error
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Rest of the component remains the same...
    return (
        <div className={`row g-3 ${styles.searchComponent}`}>
            {/* Search Input */}
            <div className="col-md-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder={`Search ${formattedSpecializationName} by name (can be left empty)`}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchDoctors()}
                />
            </div>

            {/* City Filter */}
            <div className="col-md-2">
                <select className="form-select" name="city" value={filters.city} onChange={handleFilterChange}>
                    <option value="">Select City</option>
                    {cities.map(city => (
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
                <button className={`btn btn-primary w-100 ${styles.searchButton}`} 
                        onClick={fetchDoctors} 
                        disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
        </div>
    );
}

export default SearchSpecialists;