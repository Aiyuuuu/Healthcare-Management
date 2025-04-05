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
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  MedicalInformation,
  LocalHospital,
  Medication,
  NoteAlt,
  Add,
  Delete,
  Edit,
  Save,
} from "@mui/icons-material";
import styles from "./DoctorPrescriptionPage.module.css";
import { styled } from "@mui/material/styles";
import { showToast } from "../../components/ToastNotification/Toast";

const PrescriptionContainer = styled(Paper)(() => ({
  borderRadius: "24px",
  padding: "40px",
  maxWidth: "1200px",
  margin: "40px auto",
  boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.08)",
  background: "linear-gradient(145deg, #f8fff0 0%, #ffffff 100%)",
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

const DoctorPrescriptionPage = () => {
  const { user } = useAuthContext();
  const { apptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePrescription, setEditablePrescription] = useState(null);
  const [error, setError] = useState("");

  const fetchPrescription = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/patient/${user.id}/getPrescription/pres1192`);
      const data = response.data;
      // Ensure prescriptionDetails is always an array.
      data.prescriptionDetails = data.prescriptionDetails || [];
      setEditablePrescription(data);
    } catch (err) {
      showToast("error", "Failed to load prescription")
    } finally {
      setLoading(false);
    }
  }, [apptId, user]);

  const handleSavePrescription = async () => {
    try {
      setLoading(true);
      await axios.put(`/doctor/prescriptions/${apptId}`, editablePrescription);
      await fetchPrescription();
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setEditablePrescription((prev) => ({
      ...prev,
      prescriptionDetails: [
        ...prev.prescriptionDetails,
        { drug: "", dosage: "", instructions: "" },
      ],
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = [...editablePrescription.prescriptionDetails];
    updatedMeds[index][field] = value;
    setEditablePrescription((prev) => ({
      ...prev,
      prescriptionDetails: updatedMeds,
    }));
  };

  const handleRemoveMedication = (index) => {
    const updatedMeds = editablePrescription.prescriptionDetails.filter((_, i) => i !== index);
    setEditablePrescription((prev) => ({ ...prev, prescriptionDetails: updatedMeds }));
  };

  const handleGeneralChange = (field, value) => {
    setEditablePrescription((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.role !== "doctor") {
      navigate("/");
    }
    fetchPrescription();
  }, [user, navigate, fetchPrescription]);

  if (!user || user.role !== "doctor") return null;

  return (
    <Box className={styles.container}>
      <PrescriptionContainer>
        {loading ? (
          <Box className={styles.loaderContainer}>
            <CircularProgress className={styles.loader} />
          </Box>
        ) : editablePrescription ? (
          <>
            <Box className={styles.header}>
              <MedicalInformation className={styles.mainIcon} />
              <Typography variant="h3" component="div" className={styles.title}>
                Medical Prescription
                {!isEditing && (
                  <IconButton onClick={() => setIsEditing(true)} className={styles.editButton}>
                    <Edit />
                  </IconButton>
                )}
              </Typography>
            </Box>

            {/* Main Content: Left and Right columns */}
            <Box className={styles.mainContent}>
              {/* Left Column: Doctor & Hospital Details and Special Instructions */}
              <div className={styles.leftColumn}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12 }}>
                    <SectionCard>
                      <Box className={styles.sectionHeader}>
                        <LocalHospital className={styles.sectionIcon} />
                        <Typography variant="h5" component="div" className={styles.sectionTitle}>
                          Doctor & Hospital Details
                        </Typography>
                      </Box>
                      <DetailItem
                        label="Date"
                        value={new Date(editablePrescription.date).toLocaleDateString()}
                        editable={false}
                      />
                      <DetailItem
                        label="Appointment ID"
                        value={apptId}
                        editable={false}
                      />
                      <DetailItem
                        label="Patient Name"
                        value={editablePrescription.patientName}
                        editable={false}
                      />
                      <DetailItem
                        label="Doctor"
                        value={editablePrescription.doctorName}
                        editable={false}
                      />
                      <DetailItem
                        label="Hospital"
                        value={editablePrescription.hospitalAddress}
                        editable={isEditing}
                        onChange={(value) => handleGeneralChange("hospitalAddress", value)}
                      />
                    </SectionCard>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <SectionCard className={styles.specialInstructions}>
                      <Box className={styles.sectionHeader}>
                        <NoteAlt className={styles.sectionIcon} />
                        <Typography variant="h5" component="div" className={styles.sectionTitle}>
                          Special Instructions
                        </Typography>
                      </Box>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          value={editablePrescription.sideNote ?? ""}
                          onChange={(e) => handleGeneralChange("sideNote", e.target.value)}
                          variant="outlined"
                        />
                      ) : (
                        <Typography component="div" className={styles.sideNoteText}>
                          {editablePrescription.sideNote}
                        </Typography>
                      )}
                    </SectionCard>
                  </Grid>
                </Grid>
              </div>

              {/* Right Column: Drugs/Medication Schedule */}
              <div className={styles.rightColumn}>
                <SectionCard>
                  <Box className={styles.sectionHeader}>
                    <Medication className={styles.sectionIcon} />
                    <Typography variant="h5" component="div" className={styles.sectionTitle}>
                      Medication Schedule
                    </Typography>
                    {isEditing && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddMedication}
                        className={styles.addButton}
                      >
                        Add Drug
                      </Button>
                    )}
                  </Box>

                  <List disablePadding className={styles.medicationList}>
                    {editablePrescription.prescriptionDetails.map((med, index) => (
                      <div key={index}>
                        <ListItem className={styles.medicationItem}>
                          {isEditing ? (
                            <Box className={styles.editableMedication}>
                              <TextField
                                label="Drug Name"
                                value={med.drug ?? ""}
                                onChange={(e) => handleMedicationChange(index, "drug", e.target.value)}
                                fullWidth
                                margin="dense"
                              />
                              <TextField
                                label="Dosage"
                                value={med.dosage ?? ""}
                                onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                                margin="dense"
                                style={{ marginRight: "16px" }}
                              />
                              <TextField
                                label="Instructions"
                                value={med.instructions ?? ""}
                                onChange={(e) =>
                                  handleMedicationChange(index, "instructions", e.target.value)
                                }
                                fullWidth
                                margin="dense"
                                multiline
                              />
                              <IconButton onClick={() => handleRemoveMedication(index)}>
                                <Delete color="error" />
                              </IconButton>
                            </Box>
                          ) : (
                            <ListItemText
                              primary={
                                <Box className={styles.drugName}>
                                  <Medication className={styles.medicationIcon} />
                                  {med.drug}
                                </Box>
                              }
                              secondary={
                                <Box className={styles.medicationDetails}>
                                  <Typography variant="body2" component="span">
                                    <strong>Dosage:</strong> {med.dosage}
                                  </Typography>
                                  <Typography variant="body2" component="span">
                                    <strong>Instructions:</strong> {med.instructions}
                                  </Typography>
                                </Box>
                              }
                              primaryTypographyProps={{ component: "div" }}
                              secondaryTypographyProps={{ component: "div" }}
                            />
                          )}
                        </ListItem>
                        {index < editablePrescription.prescriptionDetails.length - 1 && (
                          <Divider className={styles.divider} />
                        )}
                      </div>
                    ))}
                  </List>
                </SectionCard>
              </div>
            </Box>

            {isEditing && (
              <Box className={styles.actionButtons}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleSavePrescription}
                  className={styles.saveButton}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    fetchPrescription();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="h6" component="div" className={styles.errorMessage}>
            {error || "Failed to load prescription details"}
          </Typography>
        )}
      </PrescriptionContainer>
    </Box>
  );
};

const DetailItem = ({ label, value, editable = false, onChange }) => {
  return (
    <Box className={styles.detailItem}>
      {editable ? (
        <TextField
          label={label}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          margin="dense"
        />
      ) : (
        <>
          <Typography variant="subtitle2" component="div" className={styles.detailLabel}>
            {label}
          </Typography>
          <Typography variant="body1" component="div" className={styles.detailValue}>
            {value}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default DoctorPrescriptionPage;
