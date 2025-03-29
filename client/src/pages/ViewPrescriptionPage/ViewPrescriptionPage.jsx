import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Chip,
  Avatar,
} from "@mui/material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicationIcon from "@mui/icons-material/Medication";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import styles from "./ViewPrescriptionPage.module.css";
import { styled } from "@mui/material/styles";

const PrescriptionContainer = styled(Paper)(() => ({
  borderRadius: "24px",
  padding: "40px",
  maxWidth: "1200px",
  margin: "40px auto",
  boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.08)",
  background: "linear-gradient(145deg, #f8fff0 0%, #ffffff 100%)",
}));

const ProgressBar = styled(LinearProgress)(() => ({
  height: 12,
  borderRadius: 6,
  margin: "20px 0",
  "& .MuiLinearProgress-bar": {
    borderRadius: 6,
    backgroundColor: "#566129",
  },
}));

const SectionCard = styled(Paper)(() => ({
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0px 8px 16px rgba(86, 97, 41, 0.1)",
  backgroundColor: "rgba(86, 97, 41, 0.03)",
}));

const ViewPrescriptionPage = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState(null);
  const [progress, setProgress] = useState(0);

  // const themeColor = '#566129';

  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const fetchPrescription = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/patient/${user?.id}/getPrescription/${id}/`
      );
      setPrescription(response.data);
      setProgress(calculateProgress(response.data.date, response.data.endDate));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (!user) navigate("/login");
    if (user?.role !== "patient") navigate("/");
    fetchPrescription();
  }, [user, navigate, fetchPrescription]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user || user.role !== "patient") return null;

  return (
    <Box className={styles.container}>
      <Paper className={styles.prescriptionContainer}>
        {loading ? (
          <Box className={styles.loaderContainer}>
            <CircularProgress className={styles.loader} />
          </Box>
        ) : prescription ? (
          <>
            <Box className={styles.header}>
              <MedicalInformationIcon className={styles.mainIcon} />
              <Typography variant="h3" className={styles.title}>
                Medical Prescription
              </Typography>

              <Box className={styles.progressSection}>
                <Typography variant="h6" className={styles.dates}>
                  {formatDate(prescription.date)} -{" "}
                  {formatDate(prescription.endDate)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  className={styles.progressBar}
                />
                <Chip
                  label={`${Math.round(progress)}% Completed`}
                  className={styles.progressChip}
                />
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid grid={{ xs: 12, md: 6 }}>
                <Paper className={styles.sectionCard}>
                  <Box className={styles.sectionHeader}>
                    <LocalHospitalIcon className={styles.sectionIcon} />
                    <Typography variant="h5" className={styles.sectionTitle}>
                      Doctor & Hospital Details
                    </Typography>
                  </Box>

                  <DetailItem
                    icon={<EventIcon />}
                    label="Date"
                    value={formatDate(prescription.date)}
                  />
                  <DetailItem
                    icon={<AccessTimeIcon />}
                    label="Time"
                    value={prescription.time}
                  />
                  <DetailItem
                    icon={<Avatar className={styles.avatar}>D</Avatar>}
                    label="Doctor"
                    value={prescription.doctorName}
                  />
                  <DetailItem
                    icon={<LocalHospitalIcon />}
                    label="Hospital"
                    value={prescription.hospitalAddress}
                  />
                </Paper>
              </Grid>

              <Grid grid={{ xs: 12, md: 6 }}>
                <Paper className={styles.sectionCard}>
                  <Box className={styles.sectionHeader}>
                    <MedicationIcon className={styles.sectionIcon} />
                    <Typography variant="h5" className={styles.sectionTitle}>
                      Medication Schedule
                    </Typography>
                  </Box>

                  <List disablePadding className={styles.medicationList}>
                    {prescription.prescriptionDetails.map((med, index) => (
                      <div key={index}>
                        <ListItem className={styles.medicationItem}>
                          <ListItemText
                            primary={
                              <Box className={styles.drugName}>
                                <MedicationIcon
                                  className={styles.medicationIcon}
                                />
                                {med.drug}
                              </Box>
                            }
                            secondary={
                              <Box className={styles.medicationDetails}>
                                <Typography variant="body2" component="span">
                                  <strong>Dosage:</strong> {med.intake} times
                                  daily
                                </Typography>
                                <Typography variant="body2" component="span">
                                  <strong>Instructions:</strong>{" "}
                                  {med.intakeInstruction}
                                </Typography>
                              </Box>
                            }
                            slotProps={{
                              primary: { component: 'span' },
                              secondary: { component: 'span' }
                            }}
                          />
                        </ListItem>
                        {index <
                          prescription.prescriptionDetails.length - 1 && (
                          <Divider className={styles.divider} />
                        )}
                      </div>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {prescription.sideNote && (
                <Grid grid={{ xs: 12 }}>
                  <Paper
                    className={`${styles.sectionCard} ${styles.specialInstructions}`}
                  >
                    <Box className={styles.sectionHeader}>
                      <NoteAltIcon className={styles.sectionIcon} />
                      <Typography variant="h5" className={styles.sectionTitle}>
                        Special Instructions
                      </Typography>
                    </Box>
                    <Typography className={styles.sideNoteText}>
                      {prescription.sideNote}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </>
        ) : (
          <Typography variant="h6" className={styles.errorMessage}>
            Failed to load prescription details
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <Box className={styles.detailItem}>
    <Box className={styles.detailIcon}>{icon}</Box>
    <Box>
      <Typography variant="subtitle2" className={styles.detailLabel}>
        {label}
      </Typography>
      <Typography variant="body1" className={styles.detailValue}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default ViewPrescriptionPage;
