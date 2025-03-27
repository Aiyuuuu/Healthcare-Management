import { DataGrid } from "@mui/x-data-grid";
import styles from "./SearchResultsGrid.module.css";
import { useNavigate } from "react-router-dom";

function SearchResultsGrid({ searchResults }) {
  const navigate = useNavigate();
  // columns
  const columns = [
    {
      field: "name",
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
      field: "experience",
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
      field: "satisfactionRate",
      headerName: "Satisfaction Rate",
      width: 180,
      headerClassName: styles.headers,
      disableColumnMenu: true,
      renderCell: (params) => {
        const value = String(params.value); 
        return value.slice(-1) === '%' ? value : value + '%';},   
    },
    {
      field: "hospitalAddress",
      headerName: "Hospital Address",
      width: 500,
      headerClassName: styles.headers,
      disableColumnMenu: true,
      sortable:false
    },
  ];

  return (
    <div className={`mt-4 ${styles.SearchResultsGridContainer}`} >
      <DataGrid
        rows={searchResults}
        columns={columns}
        pagination // Enables pagination
        paginationMode="client"
        pageSizeOptions={[15]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 15 }, // Force default page size to 10
          },
        }}
        disableSelectionOnClick
        disableColumnSelector
        disableRowSelectionOnClick
        onRowClick={(params) => navigate(`/specialistProfile/${params.row.id}`)}
        slots={{
          noRowsOverlay: () => (
            <div style={{ padding: "20px", textAlign: "center", fontWeight: "bold" }}>
              No Results Found
            </div>
          ),
        }}
        sx={{
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
            marginLeft:"10px"
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
        }}
      />
    </div>
  );
}

export default SearchResultsGrid;
