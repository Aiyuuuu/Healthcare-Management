import React, { useState } from "react";
import axios from "axios";
import styles from "./AddReportsPage.module.css";
import { showToast } from "../../components/ToastNotification/Toast";

const AddReportsPage = () => {
  const [patientId, setPatientId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    // Validate patientId and file presence
    if (!patientId.trim()) {
      showToast("error", "Please enter a valid patient ID.");
      return;
    }
    if (!selectedFile) {
      showToast("error", "Please select a PDF report to upload.");
      return;
    }
    // Validate file type (PDF)
    if (selectedFile.type !== "application/pdf") {
      showToast("error", "Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("report", selectedFile);

    setUploading(true);
    try {
      await axios.post(`/doctor/addReport/${patientId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("success", "Report uploaded successfully.");
      // Optionally reset fields or navigate away
      setPatientId("");
      setSelectedFile(null);
      // navigate("/some-success-page"); // Uncomment if needed
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Failed to upload report. Please try again later.";
      showToast("error", errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Report</h1>
      <div className={styles.formGroup}>
        <label htmlFor="patientId" className={styles.label}>
          Patient ID
        </label>
        <input
          type="text"
          id="patientId"
          className={styles.input}
          placeholder="Enter patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="report" className={styles.label}>
          Upload Report (PDF only)
        </label>
        <input
          type="file"
          id="report"
          className={styles.fileInput}
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>
      <button
        className={styles.uploadButton}
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default AddReportsPage;
