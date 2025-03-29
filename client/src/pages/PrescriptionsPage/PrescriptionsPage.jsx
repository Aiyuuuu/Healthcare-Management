import { useState, useRef, useEffect } from "react";
import SearchResultsGrid from "../../components/SearchResultsGrid/SearchResultsGrid";
import styles from "./PrescriptionsPage.module.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/ToastNotification/Toast";



const PrescriptionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, toggleRefresh] = useState(false);
  const handleRefresh = () => toggleRefresh((prev) => !prev);
  const authChecked = useRef(false); // To track if auth check was performed




      useEffect(() => {
        if (authChecked.current) return;
    
        if (!user || user.role !== "patient" || !user.id) {
          showToast("error", "Please login as a patient");
          navigate("/");
          authChecked.current = true; // Mark auth check as done
          return;
        }
    
        authChecked.current = true; // Valid user, mark check as done
      }, [user, navigate]);
    
      const patientId = user?.id;
    
      useEffect(() => {
        const fetchPrescriptions = async () => {
          if (!patientId) return;
      
          setIsLoading(true);
          try {
            console.log(patientId);
            const response = await axios.get(`/patient/getPrescriptions/${patientId}`);
            // Ensure API returns a valid data structure
            let reportData = response.data.data;
            if (!Array.isArray(reportData)) {
                reportData = [reportData];
            }
      
            setPrescriptions(reportData);
          } catch (error) {
            console.error("Error fetching prescriptions:", error);
      
            // Handle different types of API errors
            if (error.response) {
              const { status, data } = error.response;
      
              if (status === 404) {
                showToast("info", "No prescriptions found");
                setPrescriptions([]); // Ensure state remains an empty array
              } else {
                showToast("error", data?.message || "Failed to fetch prescriptions");
              }
            } else {
              showToast("error", "Network error or server unreachable");
            }
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchPrescriptions();
      }, [refresh, patientId]);
    


















  const columns = [
    {
      field: "id",
      headerName: "Prescription ID",
      width: 150,
      headerClassName: styles.headers,
      disableColumnMenu: true,
    },
    {
      field: "appointmentId",
      headerName: "Appointment Id",
      width: 150,
      headerClassName: styles.headers,
      disableColumnMenu: true,
    },
    {
        field: "doctorName",
        headerName: "Doctor Name",
        width: 180,
        headerClassName: styles.headers,
        cellClassName: "columnPatient",
      disableColumnMenu: true,

      },
    {
      field: "date",
      headerName: "Date",
      width: 100,
      headerClassName: styles.headers,
      disableColumnMenu: true,
    },
    {
      field: "time",
      headerName: "Time",
      width: 135,
      headerClassName: styles.headers,
      disableColumnMenu: true,
    },
    {
      field: "hospitalAddress",
      headerName: "Hospital Address",
      // width: 500,
      flex: 1,
      minWidth: "200",
      headerClassName: styles.headers,
      cellClassName: "columnAddress",
    },
  ];

  const sx = {
    "& .MuiDataGrid-row": {
      backgroundColor: "#C7CD98",
      cursor: "pointer",
      alignItems: "center",
      border: "3px solid #566129",
      marginBottom: "6px",
      borderRadius: "6px",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#A8B88E", // Slightly darker on hover
    },
    "& .MuiDataGrid-cell": {
      color: "#000", // Text color
      fontWeight: "bold", // Bold text
      borderRight: "0px solid #ddd", // Right border for separation
      textAlign: "center",
    },
    "& .MuiDataGrid-cell[data-field='hospitalAddress']": {
      textAlign: "left",
      marginLeft: "10px",
      width: "27%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
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
  };
  
  return (
    <div className={`${styles.container}`}>
      <div className={styles.header}>
        <Typography variant="h4" fontWeight="bold" marginTop={"10px"} component="h1" gutterBottom>
          Prescriptions
        </Typography>
        <p>click to view details</p>
        <Button
          className={styles.refreshButton}
          variant="contained"
          color="#D0E1D4"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>
      <SearchResultsGrid
        searchResults={prescriptions}
        columns={columns}
        navigateEnabled={true}
        navigateTo={"/patient/prescriptions/view/"}
        sx={sx}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PrescriptionsPage;
