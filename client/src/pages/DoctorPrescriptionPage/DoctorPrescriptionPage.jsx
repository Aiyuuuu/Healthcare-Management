import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import api from "../../services/api";
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
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  const fetchPrescription = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/prescriptions/appointment/${apptId}`);
      const data = response.data.data;

      setPrescription({
        ...data
      });
    } catch (err) {
      if (err.response?.status === 404) {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toLocaleTimeString('en-GB', { 
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
    
        setPrescription({
          medicines: [],
          special_instructions: "",
          hospital_address: "",
          prescription_date: currentDate,
          prescription_time: currentTime,
          duration: 7,
          patient_name: "",
          doctor_name: user?.name || "",
        });
      } else {
        showToast("error", "Failed to load prescription");
      }
    } finally {
      setLoading(false);
    }
  }, [apptId, user]);

  const handleSavePrescription = async () => {
    try {
      setLoading(true);
      const payload = {
        ...prescription
      };

      const isUpdate = !!prescription.prescription_id;
    
      if (isUpdate) {
        await api.put(`/api/prescriptions/${prescription.prescription_id}`, payload);
      } else {
        await api.post(`/api/prescriptions/`, payload);
      }

      await fetchPrescription();
      setIsEditing(false);
      showToast("success", "Prescription saved successfully");
    } catch (err) {
      setError("Failed to save prescription");
      console.error(err);
      showToast("error", "Failed to save prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setPrescription((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { drug: "", intake: "", intakeInstruction: "" },
      ],
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = [...prescription.medicines];
    updatedMeds[index][field] = value;
    setPrescription((prev) => ({
      ...prev,
      medicines: updatedMeds,
    }));
  };

  const handleRemoveMedication = (index) => {
    const updatedMeds = prescription.medicines.filter(
      (_, i) => i !== index
    );
    setPrescription((prev) => ({
      ...prev,
      medicines: updatedMeds,
    }));
  };

  const handleGeneralChange = (field, value) => {
    setPrescription((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!user) navigate("/login");
    if (user?.role !== "doctor") navigate("/");
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
        ) : prescription ? (
          <>
            <Box className={styles.header}>
              <MedicalInformation className={styles.mainIcon} />
              <div className={styles.titleContainer}>
                <Typography variant="h3" component="div" className={styles.title}>
                  Medical Prescription
                </Typography>
                <Box className={styles.durationContainer}>
                  {isEditing ? (
                    <TextField
                      label="Duration (days)"
                      type="number"
                      value={prescription.duration}
                      onChange={(e) => handleGeneralChange("duration", e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 1 }}
                      sx={{ width: 150 }}
                    />
                  ) : (
                    <Typography variant="subtitle1" className={styles.durationText}>
                      Duration: {prescription.duration} days
                    </Typography>
                  )}
                  {!isEditing && (
                    <IconButton
                      onClick={() => setIsEditing(true)}
                      className={styles.editButton}
                    >
                      <Edit />
                    </IconButton>
                  )}
                </Box>
              </div>
            </Box>

            <Box className={styles.mainContent}>
              <div className={styles.leftColumn}>
                <Grid container spacing={4}>
                  <Grid size={12}>
                    <SectionCard>
                      <Box className={styles.sectionHeader}>
                        <LocalHospital className={styles.sectionIcon} />
                        <Typography variant="h5" component="div" className={styles.sectionTitle}>
                          Doctor & Hospital Details
                        </Typography>
                      </Box>
                      <DetailItem
                        label="Date:"
                        value={new Date(prescription.prescription_date).toLocaleDateString()}
                        editable={false}
                      />
                      <DetailItem
                        label="Appointment ID:"
                        value={apptId}
                        editable={false}
                      />
                      <DetailItem 
                        label="Patient Name:"
                        value={prescription.patient_name}
                        editable={false}
                      />
                      <DetailItem
                        label="Doctor:"
                        value={prescription.doctor_name}
                        editable={false}
                      />
                      <DetailItem
                        label="Hospital:"
                        value={prescription.hospital_address}
                        editable={false}
                      />
                    </SectionCard>
                  </Grid>

                  <Grid size={12}>
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
                          value={prescription.special_instructions}
                          onChange={(e) =>
                            handleGeneralChange("special_instructions", e.target.value)
                          }
                          variant="outlined"
                        />
                      ) : (
                        <Typography component="div" className={styles.sideNoteText}>
                          {prescription.special_instructions}
                        </Typography>
                      )}
                    </SectionCard>
                  </Grid>
                </Grid>
              </div>

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
                    {prescription.medicines.map((med, index) => (
                      <div key={index}>
                        <ListItem className={styles.medicationItem}>
                          {isEditing ? (
                            <Box className={styles.editableMedication}>
                              <TextField
                                label="Drug Name"
                                value={med.drug}
                                onChange={(e) =>
                                  handleMedicationChange(index, "drug", e.target.value)
                                }
                                fullWidth
                                margin="dense"
                              />
                              <Box className={styles.dosageInstructionsContainer}>
                                <TextField
                                  label="Dosage"
                                  value={med.intake}
                                  onChange={(e) =>
                                    handleMedicationChange(index, "intake", e.target.value)
                                  }
                                  fullWidth
                                  margin="dense"
                                />
                                <TextField
                                  label="Instructions"
                                  value={med.intakeInstruction}
                                  onChange={(e) =>
                                    handleMedicationChange(index, "intakeInstruction", e.target.value)
                                  }
                                  fullWidth
                                  margin="dense"
                                  multiline
                                  minRows={2}
                                />
                              </Box>
                              <IconButton
                                onClick={() => handleRemoveMedication(index)}
                              >
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
                                  <div className={styles.dosageContainer}>
                                    <Typography variant="body2" component="div">
                                      <strong>Dosage:</strong> {med.intake}
                                    </Typography>
                                  </div>
                                  <div className={styles.instructionsContainer}>
                                    <Typography variant="body2" component="div">
                                      <strong>Instructions:</strong> {med.intakeInstruction}
                                    </Typography>
                                  </div>
                                </Box>
                              }
                              primaryTypographyProps={{ component: "div" }}
                              secondaryTypographyProps={{ component: "div" }}
                            />
                          )}
                        </ListItem>
                        {index < prescription.medicines.length - 1 && (
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
          value={value || ""}
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
            {value || "-"}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default DoctorPrescriptionPage;