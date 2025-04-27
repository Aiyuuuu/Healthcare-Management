import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "./DoctorProfilePage.module.css";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import useAuthContext from "../../hooks/useAuthContext";
import { showToast } from "../../components/ToastNotification/Toast";

const DoctorProfilePage = () => {
  const { id } = useParams();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const defaultProfilePic = "/assets/DoctorProfilePage/default_icon.jpg";

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await api.get(
          `/api/doctors/${id}` 
        );
        setDoctorData(response.data.data);
        console.log(response.data.data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch doctor data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
        <p>Loading doctor profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          <Avatar
            src={doctorData.profile_picture || defaultProfilePic}
            alt={doctorData.name}
            className={styles.profileImage}
            onError={(e) => {
              e.target.src = defaultProfilePic;
            }}
          />
        </div>
        <div className={styles.leftSection}>
          <h1 className={styles.doctorName}>{doctorData.doctor_name}</h1>
          <p className={styles.specialization}>{doctorData.specialization}</p>
          <div className={styles.ratingContainer}>
            <span className={styles.satisfactionRate}>
              {doctorData.patient_satisfaction_rate}% Patient Satisfaction
            </span>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Experience</span>
            <span className={styles.infoValue}>
              {doctorData.experience_years} Years
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Avg. Time</span>
            <span className={styles.infoValue}>{doctorData.avg_time_to_patient} mins</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fee</span>
            <span className={styles.infoValue}>PKR {doctorData.fee}</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.qualificationSection}>
          <h3>Qualifications</h3>
          <p>{doctorData.qualification}</p>
        </div>
        <div className={styles.addressSection}>
          <h3>Hospital Address</h3>
          <p>{doctorData.hospital_address}</p>
          <a
            href={doctorData.doctor_link}
            className={styles.profileLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Profile
          </a>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          className={styles.bookButton}
          onClick={() => {
            if(!user){
              showToast('info', "please login first")
              navigate("/Login")
            }
            else if(user.role != 'patient'){
            showToast('error', "login as patient first")
            } else{
              navigate(
                `/specialistProfile/${id}/${doctorData.doctor_name}/${doctorData.fee}/bookAppointment`
              );
            }         
          }}
        >
          Book Appointment
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowChat(true)}
          className={styles.consultButton}
        >
          Consult Online
        </Button>
      </div>

      {showChat && (
        <ChatWindow
          doctorName={doctorData.name}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default DoctorProfilePage;
