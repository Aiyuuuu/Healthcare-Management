import React, { useState } from "react";
import styles from './SearchSpecialistPage.module.css'
import { useParams } from "react-router-dom";


const SearchSpecialistPage = () => {
  const { specialistName } = useParams(); // Get the specialist name from the URL
  const formattedName = specialistName.charAt(0).toUpperCase() + specialistName.slice(1);

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
    <div className={`${styles.container}`}>
       <h1 className="mb-4">Find a {formattedName}</h1>
      <div className="row g-3">
        {/* Search Input */}
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder={`Search ${formattedName} by name or keyword`}
            value={searchInput}
            onChange={handleInputChange}
          />
        </div>

        {/* City Filter */}
        <div className="col-md-3">
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
        <div className="col-md-3">
          <select
            className="form-select"
            name="experience"
            value={filters.experience}
            onChange={handleFilterChange}
          >
            <option value="">Select Experience</option>
            <option value="1-3">1-3 years</option>
            <option value="4-6">4-6 years</option>
            <option value="7+">7+ years</option>
          </select>
        </div>

        {/* Fee Filter */}
        <div className="col-md-3">
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

        {/* High Patient Satisfaction Checkbox */}
        <div className="col-md-3 d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input me-2"
            id="highSatisfaction"
            name="highSatisfaction"
            checked={filters.highSatisfaction}
            onChange={handleFilterChange}
          />
          <label className="form-check-label" htmlFor="highSatisfaction">
            High Patient Satisfaction Rate
          </label>
        </div>

        {/* Search Button */}
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSpecialistPage;
