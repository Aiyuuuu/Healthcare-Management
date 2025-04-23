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
    setSearchResults(results);
  };


 
  const columns = [
      {
        field: "doctor_name",
        headerName: "Doctor Name",
        width: 250,
        headerClassName: styles.headers,
        disableColumnMenu: true,
      },
      {
        field: "city",
        headerName: "City",
        width: 150,
        headerClassName: styles.headers,
        disableColumnMenu: true,
      },
      {
        field: "experience_years",
        headerName: "Experience (years)",
        width: 180,
        headerClassName: styles.headers,
        disableColumnMenu: true,
      },
      {
        field: "fee",
        headerName: "Fee (PKR)",
        width: 150,
        headerClassName: styles.headers,
        disableColumnMenu: true,
      },
      {
        field: "patient_satisfaction_rate",
        headerName: "Satisfaction Rate",
        width: 180,
        headerClassName: styles.headers,
        disableColumnMenu: true,
        renderCell: (params) => {
          const value = String(params.value); 
          return value.slice(-1) === '%' ? value : value + '%';},   
      },
      {
        field: "hospital_address",
        headerName: "Hospital Address",
        // width: 500,
        flex:1,
        minWidth:200,
        headerClassName: styles.headers,
        disableColumnMenu: true,
        sortable:false,
        textOverflow:"ellipsis"
      },
    ];
  
    const sx={
      "& .MuiDataGrid-row": {
        backgroundColor: "#C7CD98",
        cursor: "pointer",
        alignItems: "center",
        border:"3px solid #566129",
        marginBottom:"6px",
        borderRadius: "6px",
      },
      "& .MuiDataGrid-row:hover": {
        backgroundColor: "#A8B88E", // Slightly darker on hover
      },
      "& .MuiDataGrid-cell": {
        color: "#000", // Text color
        fontWeight: "bold", // Bold text
        borderRight: "0px solid #ddd", // Right border for separation
        textAlign:"center"
      },
      "& .MuiDataGrid-cell[data-field='name']": {
        textAlign:"left"
      },
      "& .MuiDataGrid-cell[data-field='hospitalAddress']": {
        textAlign:"left",
        marginLeft:"10px",
        width:"27%",
        overflow:"hidden",
        whiteSpace:"nowrap",
        textOverflow:"ellipsis",
      },
      "& .MuiCheckbox-root": {
        color: "#007bff",
      },
      "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
        outline: "none !important",
        boxShadow: "none",
      },
      "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
        {
          outline: "none !important",
          boxShadow: "none",
        },
    }

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
        columns = {columns}
        navigateEnabled = {true}
        navigateTo = {"/specialistProfile/"} 
        sx = {sx}
      />
    </div>
  );
};

export default SearchSpecialistPage;
