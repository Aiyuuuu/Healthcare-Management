import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiFilePlus,
  FiMessageSquare,
  FiSlash,
} from "react-icons/fi";
import styles from "./DoctorDashboardPage.module.css";
import { showToast } from "../../components/ToastNotification/Toast";
import api from "../../services/api";

const DoctorDashboardPage = () => {

  const [appointments, setAppointments] = useState({
    today: [],
    futureSixDays: [],
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const today = new Date();
  const isWeekend = [0, 6].includes(today.getDay());
  const dev = true;

  const fetchAppointments = useCallback(async () => {
    try {
      const { status, data } = await api.get(
        `api/doctors/dashboard`
      );
      if (status != 200) {
        console.log(data.data.message);
        return;
      }

      //convert from this_case to camelCase
      const transformedData = {
        today: data.data.appointments.today || [],
        futureSixDays: data.data.appointments.future_six_days || [],
      };

      setAppointments(transformedData);
      console.log(transformedData)
      setError("");
    } catch (err) {
      setError("Failed to fetch appointments. Please try again later.");
      console.error("API Error:", err);
      showToast("error", "API error ", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const handleAction = async (action, appointmentId) => {
    try {
      let endpoint = "";
      let method = "post";
      let body = {};

      switch (action) {
        case "cancel":
          endpoint = `/api/appointments/${appointmentId}`;
          method = "delete";
          break;
        case "completed":
          endpoint = `/api/appointments/${appointmentId}/status`;
          method = "put";
          body = { status: "completed" };
          break;
        case "missed":
          endpoint = `/api/appointments/${appointmentId}/status`;
          method = "put";
          body = { status: "missed" };
          break;
        default:
          return;
      }

      await api({
        method,
        url: endpoint,
        data: body,
        headers: { "Content-Type": "application/json" },
      });

      await fetchAppointments(); // Refresh data after action
    } catch (err) {
      console.error(`Action ${action} failed:`, err);
      setError(`Failed to ${action} appointment. Please try again.`);
    }
  };
  const getStatusSection = (appointments, status) => {
    const statusConfig = {
      completed: {
        icon: <FiCheckCircle />,
        title: "Completed Appointments",
        color: "#4CAF50",
      },
      ongoing: {
        icon: <FiAlertCircle />,
        title: "In Progress",
        color: "#FFC107",
      },
      pending: {
        icon: <FiClock />,
        title: "Upcoming Appointments",
        color: "#2196F3",
      },
      missed: {
        icon: <FiSlash />,
        title: "Missed Appointments",
        color: "#FF4444",
      },
    };

    return (
      <div className={styles.statusSection}>
        <div
          className={styles.sectionHeader}
          style={{ borderColor: statusConfig[status].color }}
        >
          {statusConfig[status].icon}
          <h3>{statusConfig[status].title}</h3>
        </div>
        {appointments
          .filter((a) => a.status === status)
          .map((appt) => (
            <div key={appt.appointment_id} className={styles.appointmentCard}>
              <div className={styles.appointmentInfo}>
                <h4>{appt.patient_name}</h4>
                <p>{appt.reason}</p>
                <time>{appt.time}</time>
              </div>
              <div className={styles.actionButtons}>
                {status === "ongoing" && (
                  <>
                    <button
                      onClick={() => handleAction("cancel", appt.appointment_id)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAction("completed", appt.appointment_id)}
                      className={styles.completeBtn}
                    >
                      Complete
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/doctor/dashboard/appointment/${appt.appointment_id}/prescription/`
                        )
                      }
                      className={styles.prescriptionBtn}
                    >
                      Prescription
                    </button>
                  </>
                )}
                {status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction("cancel", appt.appointment_id)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {status === "completed" && (
                  <>
                    <button
                      onClick={() => handleAction("missed", appt.appointment_id)}
                      className={styles.missedBtn}
                    >
                      Mark Missed
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/doctor/dashboard/appointment/${appt.appointment_id}/prescription`
                        )
                      }
                      className={styles.prescriptionBtn}
                    >
                      Prescription
                    </button>
                  </>
                )}
                {status === "missed" && (
                  <>
                    <button
                      onClick={() => handleAction("completed", appt.appointment_id)}
                      className={styles.completeBtn}
                    >
                      Mark Completed
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading Dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    // <div className={`${styles.dashboard} ${isWeekend ? styles.holiday : ""}`}>
    <div className={styles.dashboard}>
      <div className={styles.topBar}>
        <button
          className={styles.iconButton}
          onClick={() => navigate("/doctor/dashboard/addReport")}
        >
          <FiFilePlus /> Add Report
        </button>
        {!(isWeekend && !dev) && (
          <button className={styles.iconButton}>
            <FiMessageSquare /> Chat
          </button>
        )}
      </div>

      <div className={styles.mainContent}>
        {(isWeekend && !dev) && (
          <div className={styles.holidayOverlay}>
            <h2 className={styles.holidayTitle}>🎉 Holiday!</h2>
            <p>Enjoy the day off!</p>
          </div>
        )}

        {!(isWeekend && !dev) && (
          <div className={styles.todaysScheduleSection}>
            <div className={styles.sectionHeader}>
              <FiCalendar />
              <h2>Today's Schedule</h2>
              <time>{today.toLocaleDateString("en-GB")}</time>
            </div>

            {getStatusSection(appointments.today, "ongoing")}
            {getStatusSection(appointments.today, "pending")}
            {getStatusSection(appointments.today, "completed")}
            {getStatusSection(appointments.today, "missed")}
          </div>
        )}

        <div className={styles.futureSection}>
          <h3>Future Days</h3>
          <div className={styles.dateSelector}>
            {[...new Set(appointments.futureSixDays.map((appt) => appt.date))]
              .sort()
              .map((date) => (
                <button
                  key={date}
                  className={`${styles.dateButton} ${
                    selectedDate === date ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </button>
              ))}
          </div>

          <div className={styles.futureAppointments}>
            {(appointments.futureSixDays || [])
              .filter((a) => a.date === selectedDate)
              .map((appt) => (
                <div key={appt.appointment_id} className={styles.futureCard}>
                  <div className={styles.appointmentInfo}>
                    <h4>
                      {appt.patient_name +
                        " (" +
                        (appt.reason
                          ? appt.reason.length > 30
                            ? appt.reason.slice(0, 30) + "..."
                            : appt.reason
                          : "No reason provided") +
                        ")"}
                    </h4>
                    <time>{appt.time}</time>
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleAction("cancel", appt.appointment_id)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                    {/* <button onClick={() => handleAction('details', appt.appointment_id)} className={styles.detailsBtn}>Details</button> */}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
