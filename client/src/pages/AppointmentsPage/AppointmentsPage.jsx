import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import styles from "./AppointmentsPage.module.css";
import useAuthContext from "../../hooks/useAuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/ToastNotification/Toast";
import SearchResultsGrid from "../../components/SearchResultsGrid/SearchResultsGrid";

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [appointments, setAppointments] = useState([]);
  const [refresh, toggleRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    if (user.role !== "patient" || !user.id) {
      showToast("error", "Please login as a patient");
      navigate("/");
    }
  }, [user, navigate]);
  
  const patientId = user?.id;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!patientId) return;
  
      setIsLoading(true);
      try {
        console.log(patientId);
        const response = await axios.get(`/patient/getAppointments/${patientId}`);
        // Ensure API returns a valid data structure
        let appointmentData = response.data.data;
        if (!Array.isArray(appointmentData)) {
          appointmentData = [appointmentData];
        }
  
        setAppointments(appointmentData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
  
        // Handle different types of API errors
        if (error.response) {
          const { status, data } = error.response;
  
          if (status === 404) {
            showToast("info", "No appointments found");
            setAppointments([]); // Ensure state remains an empty array
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

    fetchAppointments();
  }, [refresh, patientId]);

  
  const handleRefresh = () => toggleRefresh((prev) => !prev);

  const columns = [
    {
      field: "id",
      headerName: "Appointment ID",
      width: 150,
      headerClassName: styles.headers,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
      field: "doctorName",
      headerName: "Doctor Name",
      width: 180,
      headerClassName: styles.headers,
      cellClassName: "columnDoctor",
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
      headerName: "Fee (PKR)",
      width: 120,
      headerClassName: styles.headers,
      disableColumnMenu: true,
    },
    {
      field: "hospitalAddress",
      headerName: "Hospital Address",
      // width: 500,
      flex:1,
      minWidth:"200",
      headerClassName: styles.headers,
      cellClassName: "columnAddress",
    },
  ];

  const sx={
    "& .MuiDataGrid-root": {
      border: "none",
      fontFamily: "inherit",
    },
    "& .MuiDataGrid-row": {
      backgroundColor: "#C7CD98",
      cursor: "pointer",
      borderRadius: "6px",
      "&:not(:last-child)": {
        marginBottom: "6px",
      },
      "&:hover": {
        backgroundColor: "#A8B88E !important",
      },
    },
    "& .MuiDataGrid-cell": {
      color: "#000",
      fontWeight: "bold",
      borderBottom: "3px solid #566129",
      display: "flex !important",
      alignItems: "center",
      "&:focus": {
        outline: "none",
      },
      justifyContent:"center",
      // width:"27%",
        overflow:"hidden",
        whiteSpace:"nowrap",
        textOverflow:"ellipsis",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#566129",
      borderRadius: "6px",
      borderBottom: "none",
    },
    "& .MuiDataGrid-columnHeader": {
      color: "#fff !important",
      fontWeight: "bold !important",
      justifyContent: "center", // Center header text
      "&:focus": {
        outline: "none",
      },
    },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-virtualScroller": {
      marginTop: "8px",
    },
    "& .columnAddress": {
      justifyContent: "flex-start !important",
      paddingLeft: "16px !important",
      overflow:"hidden",
      whiteSpace:"nowrap",
      textOverflow:"ellipsis",
      width:"100%",
    },
  }

  if (!user || user.role !== "patient" || !user.id) {
    return (
      <div className={styles.container}>
        <Typography variant="h5" color="error">
          Access Denied. Redirecting...
        </Typography>
      </div>
    );
  }
  

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h4" fontWeight="bold"  component="h1" gutterBottom>
          Appointments
        </Typography>
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

    <SearchResultsGrid searchResults={appointments} columns={columns} navigateEnabled={false} navigateTo={"/"} sx={sx} isLoading={isLoading} />
     
    </div>
  );
};

export default AppointmentsPage;
