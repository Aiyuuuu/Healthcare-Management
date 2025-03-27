import styles from "./SearchSpecialistPage.module.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import SearchSpecialists from "../../components/SearchSpecialists/SearchSpecialists";
import SearchResultsGrid from "../../components/SearchResultsGrid/SearchResultsGrid";

const SearchSpecialistPage = () => {
  const { specializationName } = useParams();
  const formattedSpecializationName =
    specializationName.charAt(0).toUpperCase() + specializationName.slice(1);

  const [searchResults, setSearchResults] = useState([]); // State to store search results

  // Callback function to receive search results from SearchSpecialists
  const handleSearchResults = (results) => {
    console.log("Received new search results:", results);
    setSearchResults(results);
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.heading} mb-4`}>Find {formattedSpecializationName + "s"}</h1>
      
      {/* Pass the callback function to SearchSpecialists */}
      <SearchSpecialists 
        className={styles.SearchSpecialistsContainer} 
        formattedSpecializationName={formattedSpecializationName}
        onSearchResults={handleSearchResults} 
      />
      
      {/* Pass search results to SearchResultsGrid */}
      <SearchResultsGrid 
        className={styles.SearchResultsGridContainer} 
        searchResults={searchResults} 
      />
    </div>
  );
};

export default SearchSpecialistPage;
