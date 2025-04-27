import React, { useState } from "react";
import api from "../../services/api";
import styles from "./AddReportsPage.module.css";
import { showToast } from "../../components/ToastNotification/Toast";

const AddReportsPage = () => {
  const [patientId, setPatientId] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [feePaid, setFeePaid] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleUpload = async () => {
    if (!patientId.trim()) {
      showToast("error", "Please enter a valid patient ID.");
      return;
    }
    if (!reportTitle.trim()) {
      showToast("error", "Please enter a report title.");
      return;
    }
    if (!selectedFile) {
      showToast("error", "Please select a PDF report to upload.");
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      showToast("error", "Only PDF files are allowed.");
      return;
    }
    
    const feeValue = parseInt(feePaid);
    if (isNaN(feeValue) || feeValue <= 0) {
      showToast("error", "Please enter a valid fee amount in PKR.");
      return;
    }
  
    setUploading(true);
  
    try {
      // 1️⃣ First API: create metadata
      const metadataRes = await api.post(`/api/reports/createReportEntry`, {
        patientId: patientId.trim(),
        title: reportTitle.trim(),
        feePaid: feeValue,
      });
  
      const { reportId } = metadataRes.data;
      if (!reportId) {
        throw new Error("No reportId returned from server.");
      }
  
      // 2️⃣ Second API: upload file
      const formData = new FormData();
      formData.append("pdf", selectedFile);
  
      await api.post(`/api/reports/uploadReport/${reportId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      showToast("success", "Report uploaded successfully.");
  
      // Reset form after success
      setPatientId("");
      setReportTitle("");
      setFeePaid("");
      setSelectedFile(null);
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
        <label htmlFor="reportTitle" className={styles.label}>
          Report Title
        </label>
        <input
          type="text"
          id="reportTitle"
          className={styles.input}
          placeholder="Enter report title"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="feePaid" className={styles.label}>
          Fee Paid (PKR)
        </label>
        <input
          type="number"
          id="feePaid"
          className={styles.input}
          placeholder="Enter fee amount"
          step="1"
          min="0"
          value={feePaid}
          onChange={(e) => setFeePaid(e.target.value)}
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