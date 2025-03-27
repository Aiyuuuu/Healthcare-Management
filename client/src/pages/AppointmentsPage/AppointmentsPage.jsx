import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import styles from "./AppointmentsPage.module.css";
import useAuthContext from "../../hooks/useAuthContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/ToastNotification/Toast";

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [appointments, setAppointments] = useState([]);
  const [refresh, toggleRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authChecked = useRef(false); // To track if auth check was performed

  useEffect(() => {
    if (authChecked.current) return;

    if (!user || user.role !== "patient" || !user.patient_id) {
      showToast("error", "Please login as a patient");
      navigate("/");
      authChecked.current = true; // Mark auth check as done
      return;
    }

    authChecked.current = true; // Valid user, mark check as done
  }, [user, navigate]);

  const patientId = user?.patient_id;

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
      width: 120,
      headerClassName: styles.headers,
      disableColumnMenu: true,
    },
    {
      field: "time",
      headerName: "Time",
      width: 120,
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
      width: 500,
      headerClassName: styles.headers,
      cellClassName: "columnAddress",
    },
  ];

  if (!user || user.role !== "patient" || !user.patient_id) return null;

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

      <div className={styles.gridContainer}>
        <DataGrid
          rows={appointments}
          columns={columns}
          loading={isLoading}
          autoHeight
          pageSizeOptions={[15]}
          initialState={{
            pagination: { paginationModel: { pageSize: 15 } },
          }}
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: () => (
              <div className={styles.noRows}>No appointments found</div>
            ),
            loadingOverlay: CircularProgress,
          }}
          sx={{
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
            "& .columnDoctor": {
              justifyContent: "flex-start !important",
            },
            "& .columnPatient": {
              justifyContent: "flex-start !important",
            },
            "& .columnAddress": {
              justifyContent: "flex-start !important",
              paddingLeft: "16px !important",
            },
          }}
        />
      </div>
    </div>
  );
};

export default AppointmentsPage;
