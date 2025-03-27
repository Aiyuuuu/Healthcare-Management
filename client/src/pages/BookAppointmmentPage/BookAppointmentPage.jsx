import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Alert,
  TextField,
  Grid,
  Typography,
  Paper,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../../hooks/useAuthContext";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {showToast} from "../../components/ToastNotification/Toast"

const TimeSlotButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? "#566129" : theme.palette.background.paper,
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: selected ? "#566129" : theme.palette.action.hover,
  },
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  minWidth: "120px",
}));

const BookAppointmentPage = () => {
  const { id: doctorId, doctorName: doctorName, fee: fee } = useParams();
  const { user } = useAuthContext() || {};
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const navigate = useNavigate();

  // Generate time slots from 9 AM to 5 PM in 30-minute increments
  // In generateTimeSlots function - FIXED SLOT FORMAT
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      ["00", "30"].forEach((minute) => {
        if (hour === 16 && minute === "30") return;
        const endHour = minute === "30" ? hour + 1 : hour;
        const endMinute = minute === "30" ? "00" : "30";
        slots.push(
          `${hour.toString().padStart(2, "0")}:${minute}-${endHour
            .toString()
            .padStart(2, "0")}:${endMinute}`
        );
      });
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12; // Convert 0 to 12
    return `${adjustedHour}:${minutes} ${period}`;
  };

  // Generate next 7 days
  const generateDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
        day: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        isWeekend: [0, 6].includes(date.getDay()),
      });
    }
    return days;
  };

  // In your useEffect
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const response = await axios.get(`/getBookedSlots/${doctorId}/`);
        // Directly use bookedSlots from response (remove doctorId nesting)
        setBookedSlots(response.data.bookedSlots || {});
      } catch (err) {
        setError("Failed to load availability " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookedSlots();
  }, [doctorId]);

  // Update handleBooking function
  const handleBooking = async () => {
    try {
      // Set loading state when button is clicked
      setBookingStatus("loading");

      const response = await axios.post("/bookAppointment", {
        doctorId,
        patientId: user?.patient_id,
        date: selectedDay,
        time: selectedSlot,
        reason,
      });

      if (response.data.success) {
        // Update status to success and refresh slots
        setBookingStatus("success");
        showToast('success', "Booking Successful!")
        const newResponse = await axios.get(`/getBookedSlots/${doctorId}/`);
        setBookedSlots(newResponse.data.bookedSlots);

        // Reset form after 2 seconds
        setTimeout(() => {
          navigate("/appointments")
        }, 2000);
      }
    } catch (err) {
      // Handle errors after API response
      setBookingStatus("error");
      showToast('error', "Failed to book appointment!")

      console.error("Booking error:", err);

      // Reset error status after 2 seconds
      setTimeout(() => {
        setBookingStatus(null);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 1200,
        mx: "auto",
        my: 4,
        backgroundColor: "#D0E1D4",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#566129", fontWeight: "bold" }}
      >
        Book Appointment with {doctorName}
      </Typography>
      <Chip
        label={`Consultation Fee: PKR ${fee}`}
        color="primary"
        variant="outlined"
        sx={{ mb: 4, borderColor: "#566129", color: "#566129" }}
      />

      <Typography variant="h6" gutterBottom>
        Select Date
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4, overflowX: "auto" }}>
        {generateDays().map((day) => (
          <Button
            key={day.date}
            variant={selectedDay === day.date ? "contained" : "outlined"}
            onClick={() => setSelectedDay(day.date)}
            disabled={day.isWeekend}
            sx={{
              minWidth: 100,
              bgcolor: selectedDay === day.date ? "#566129" : undefined,
              color: selectedDay === day.date ? "common.white" : "common.black",
              borderColor: "common.black",
              opacity: day.isWeekend ? 0.5 : 1,
              "&:hover": {
                borderColor: "common.black",
              },
              "&:disabled": {
                borderStyle: "dashed",
                borderColor: "common.black",
              },
            }}
          >
            <Box textAlign="center">
              <Typography variant="body2">{day.weekday}</Typography>
              <Typography variant="h6">{day.day}</Typography>
              <Typography variant="caption">{day.month}</Typography>
            </Box>
          </Button>
        ))}
      </Stack>
      {selectedDay && (
        <>
          <Typography variant="h6" gutterBottom>
            Available Time Slots
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {timeSlots.map((slot) => {
              const isBooked = bookedSlots[selectedDay]?.includes(slot);
              const [startTime, endTime] = slot.split("-");
              return (
                <Grid key={slot} size={{ xs: 6, sm: 4, md: 3 }}>
                  <TimeSlotButton
                    fullWidth
                    selected={selectedSlot === slot}
                    onClick={() => setSelectedSlot(slot)}
                    disabled={isBooked}
                  >
                    {`${formatTime12Hour(startTime)} - ${formatTime12Hour(
                      endTime
                    )}`}
                  </TimeSlotButton>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      <TextField
        label="Appointment Reason (Optional)"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        sx={{
          mb: 4,
          "& .MuiInputLabel-root": {
            color: "#566129", // Label color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#566129",
            },
            "&:hover fieldset": {
              borderColor: "#566129",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#566129",
            },
          },
        }}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          disabled={
            !selectedDay || !selectedSlot || bookingStatus === "loading"
          }
          onClick={handleBooking}
          sx={{
            bgcolor: "#566129",
            "&:hover": { bgcolor: "#454d1f" },
            minWidth: 200,
            position: "relative",
          }}
        >
          {bookingStatus === "loading" ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={24} sx={{ color: "common.white" }} />
              Booking...
            </Box>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </Box>

      {bookingStatus && bookingStatus!="loading" && (
        <Alert
          severity={bookingStatus === "success" ? "success" : "error"}
          sx={{ mt: 2 }}
          onClose={() => setBookingStatus(null)}
        >
          {bookingStatus === "success"
            ? "Appointment booked successfully!"
            : "Failed to book appointment. Please try again."}
        </Alert>
      )}
    </Paper>
  );
};

export default BookAppointmentPage;
