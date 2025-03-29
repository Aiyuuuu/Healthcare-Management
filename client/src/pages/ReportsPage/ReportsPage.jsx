import { useState, useRef, useEffect } from "react";
import SearchResultsGrid from "../../components/SearchResultsGrid/SearchResultsGrid";
import styles from "./ReportsPage.module.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/ToastNotification/Toast";



const ReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [reports, setReports] = useState([]);
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
        const fetchReports = async () => {
          if (!patientId) return;
      
          setIsLoading(true);
          try {
            console.log(patientId);
            const response = await axios.get(`/patient/getReports/${patientId}`);
            // Ensure API returns a valid data structure
            let reportData = response.data.data;
            if (!Array.isArray(reportData)) {
                reportData = [reportData];
            }
      
            setReports(reportData);
          } catch (error) {
            console.error("Error fetching appointments:", error);
      
            // Handle different types of API errors
            if (error.response) {
              const { status, data } = error.response;
      
              if (status === 404) {
                showToast("info", "No appointments found");
                setReports([]); // Ensure state remains an empty array
              } else {
                showToast("error", data?.message || "Failed to fetch appointments");
              }
            } else {
              showToast("error", "Network error or server unreachable");
            }
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchReports();
      }, [refresh, patientId]);
    


















  const columns = [
    {
      field: "id",
      headerName: "Report ID",
      width: 150,
      headerClassName: styles.headers,
      disableColumnMenu: true,
    },
    {
      field: "title",
      headerName: "Report Title",
      width: 300,
      headerClassName: styles.headers,
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
      field: "patientName",
      headerName: "Patient Name",
      width: 180,
      headerClassName: styles.headers,
      cellClassName: "columnPatient",
    },
    {
      field: "fee",
      headerName: "Fee Paid",
      width: 120,
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
    "& .MuiDataGrid-cell[data-field='title']": {
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
  const downloadReport = async (params) => {
    try {
        showToast('info',"downloading")
      const response = await axios.get(`/patient/${patientId}/downloadReport/${params.row.id}`, {
        responseType: "blob", // Important for handling file downloads
      });
  
      // Create a Blob URL from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // Create a temporary <a> element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf"); // File name
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className={`${styles.container}`}>
      <div className={styles.header}>
        <Typography variant="h4" fontWeight="bold" marginTop={"10px"} component="h1" gutterBottom>
          Reports
        </Typography>
        <p>click the report to download</p>
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
        searchResults={reports}
        columns={columns}
        onRowClick = {downloadReport}
        navigateEnabled={false}
        navigateTo={"/reports/download/"}
        sx={sx}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ReportsPage;
