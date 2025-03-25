import React, { useState } from "react";
import styles from './SearchSpecialists.module.css'


function Search({formattedName}) {
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState({
      city: "",
      experience: "",
      fee: "",
      highSatisfaction: false,
    });
  
    const handleInputChange = (event) => {
      setSearchInput(event.target.value);
    };
  
    const handleFilterChange = (event) => {
      const { name, value, type, checked } = event.target;
      setFilters({
        ...filters,
        [name]: type === "checkbox" ? checked : value,
      });
    };
  
    const handleSearch = () => {
      console.log("Search Input:", searchInput);
      console.log("Filters:", filters);
      // Implement search logic here
    };
  
  
  return (
    <div className={`row g-3 ${styles.searchComponent}`}>
            {/* Search Input */}
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${formattedName} by name or keyword`}
                value={searchInput}
                onChange={handleInputChange}
              />
            </div>
    
            {/* City Filter */}
            <div className="col-md-2">
              <select
                className="form-select"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
              >
                <option value="">Select City</option>
                <option value="karachi">Karachi</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
              </select>
            </div>
    
            {/* Experience Filter */}
            <div className="col-md-2">
              <select
                className="form-select"
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
              >
                <option value="">Experience</option>
                <option value="1-3">1-3 years</option>
                <option value="4-6">4-6 years</option>
                <option value="7+">7+ years</option>
              </select>
            </div>
    
            {/* Fee Filter */}
            <div className="col-md-2">
              <select
                className="form-select"
                name="fee"
                value={filters.fee}
                onChange={handleFilterChange}
              >
                <option value="">Select Fee Range (PKR)</option>
                <option value="500-1000">500 - 1000</option>
                <option value="1000-2000">1000 - 2000</option>
                <option value="2000+">2000+</option>
              </select>
            </div>
    
    
            {/* Search Button */}
            <div className={`col-md-2`}>
              <button className={`btn btn-primary w-100 ${styles.searchButton}`} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
    
  )
}

export default Search