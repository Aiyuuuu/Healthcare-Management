// import styles from "./SearchResultsGrid.module.css";
import { DataGrid } from "@mui/x-data-grid";
import styles from './SearchResultsGrid.module.css'

function SearchResultsGrid({rows}) {
  // Dummy data for DataGrid
  const columns = [
    { field: "name", headerName: "Doctor Name", width: 200, headerClassName: styles.headers },
    { field: "city", headerName: "City", width: 150, headerClassName: styles.headers },
    { field: "experience", headerName: "Experience (years)", width: 180, headerClassName: styles.headers },
    { field: "fee", headerName: "Fee (PKR)", width: 150, headerClassName: styles.headers },
    {
      field: "satisfaction",
      headerName: "Satisfaction Rate",
      width: 180,
      headerClassName: styles.headers,
      renderCell: (params) => (params.value ? "✔ High" : "❌ Low"),
    },
  ];
  
  
  return (
    <div className="mt-4">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        disableSelectionOnClick
        sx={{
          "& .MuiDataGrid-row": {
            backgroundColor: "#566022",
          },
          "& .MuiCheckbox-root": {
            color: "#007bff",
          },
        }}
      />
    </div>
  );
}

export default SearchResultsGrid;
