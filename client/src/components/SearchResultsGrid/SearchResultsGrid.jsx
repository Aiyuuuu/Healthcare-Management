import { DataGrid } from "@mui/x-data-grid";
import styles from "./SearchResultsGrid.module.css";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";


function SearchResultsGrid({
  searchResults,
  columns,
  navigateEnabled,
  navigateTo,
  sx,
  isLoading,
  onRowClick
}) {
  const navigate = useNavigate();

  return (
    <div className={`mt-4 ${styles.gridContainer}`}>
      <DataGrid
        rows={searchResults}
        columns={columns}
        getRowId={row => row.doctor_id}
        loading={isLoading}
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
        onRowClick={(params) => {if(onRowClick){onRowClick(params)}
        else if (navigateEnabled) {
            navigate(`${navigateTo}${params.row.doctor_id}`);
          }
        }}
        slots={{
          noRowsOverlay: () => (
            <div className={styles.noRows}>No results found</div>
          ),
          loadingOverlay: CircularProgress,
        }}
        sx={sx}
      />
    </div>
  );
}

export default SearchResultsGrid;
