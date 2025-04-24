import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Alert, TextField, Grid, Typography, Paper, Chip, Stack, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { showToast } from "../../components/ToastNotification/Toast";
import api from "../../services/api";

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

const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour.toString().padStart(2, '0')}:${minutes} ${period}`;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 16; hour++) {
    ["00", "30"].forEach((minute) => {
      if (hour === 16 && minute === "30") return;
      const endHour = minute === "30" ? hour + 1 : hour;
      const endMinute = minute === "30" ? "00" : "30";
      const start = `${hour.toString().padStart(2, "0")}:${minute}`;
      const end = `${endHour.toString().padStart(2, "0")}:${endMinute}`;
      slots.push(`${formatTime12Hour(start)} - ${formatTime12Hour(end)}`);
    });
  }
  return slots;
};

const generateDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
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

const BookAppointmentPage = () => {
  const { id: doctor_id, doctor_name, fee } = useParams();
  const [state, setState] = useState({
    selectedDay: null,
    selectedSlot: null,
    bookedSlots: {},
    reason: "",
    loading: true,
    error: null,
    bookingStatus: null
  });
  const navigate = useNavigate();
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const response = await api.get(`/api/appointments/getBookedSlots/${doctor_id}`);
        console.log(response.data.data)
        setState(prev => ({ ...prev, bookedSlots: response.data.data || {}, loading: false }));
      } catch (err) {
        setState(prev => ({ ...prev, error: "Failed to load availability", loading: false }));
        console.log(err)
      }
    };
    fetchBookedSlots();
  }, [doctor_id]);

  const handleBooking = async () => {
    try {
      setState(prev => ({ ...prev, bookingStatus: "loading" }));
      
      await api.post("/api/appointments/", {
        doctor_id,
        appointment_date: state.selectedDay,
        appointment_time: state.selectedSlot,
        appointment_reason: state.reason || null,
      });

      showToast("success", "Booking Successful!");
      setState(prev => ({
        ...prev,
        bookingStatus: "success",
        bookedSlots: { ...prev.bookedSlots, [state.selectedDay]: [...(prev.bookedSlots[state.selectedDay] || []), state.selectedSlot] }
      }));

      setTimeout(() => navigate("/patient/appointments"), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to book appointment. Please try again.";
      showToast("error", errorMessage);
      setState(prev => ({ ...prev, bookingStatus: "error" }));
      setTimeout(() => setState(prev => ({ ...prev, bookingStatus: null })), 2000);
    }
  };

  if (state.loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  if (state.error) return (
    <Box mt={4}>
      <Alert severity="error">{state.error}</Alert>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: "auto", my: 4, backgroundColor: "#D0E1D4" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#566129", fontWeight: "bold" }}>
        Book Appointment with {doctor_name}
      </Typography>
      
      <Chip label={`Consultation Fee: PKR ${fee}`} variant="outlined" 
        sx={{ mb: 4, borderColor: "#566129", color: "#566129" }} />

      <Typography variant="h6" gutterBottom>Select Date</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4, overflowX: "auto" }}>
        {generateDays().map(day => (
          <Button
            key={day.date}
            variant={state.selectedDay === day.date ? "contained" : "outlined"}
            onClick={() => setState(prev => ({ ...prev, selectedDay: day.date }))}
            disabled={day.isWeekend}
            sx={{
              minWidth: 100,
              bgcolor: state.selectedDay === day.date ? "#566129" : undefined,
              color: state.selectedDay === day.date ? "common.white" : "common.black",
              borderColor: "common.black",
              opacity: day.isWeekend ? 0.5 : 1,
              "&:disabled": { borderStyle: "dashed" }
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

      {state.selectedDay && (
        <>
          <Typography variant="h6" gutterBottom>Available Time Slots</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {timeSlots.map(slot => {
              const isBooked = state.bookedSlots[state.selectedDay]?.includes(slot);
              return (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={slot}>
                  <TimeSlotButton
                    fullWidth
                    selected={state.selectedSlot === slot}
                    onClick={() => setState(prev => ({ ...prev, selectedSlot: slot }))}
                    disabled={isBooked}
                  >
                    {slot}
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
        value={state.reason}
        onChange={(e) => setState(prev => ({ ...prev, reason: e.target.value }))}
        sx={{
          mb: 4,
          "& .MuiInputLabel-root": { color: "#566129" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#566129" },
            "&:hover fieldset": { borderColor: "#566129" },
            "&.Mui-focused fieldset": { borderColor: "#566129" },
          },
        }}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          disabled={!state.selectedDay || !state.selectedSlot || state.bookingStatus === "loading"}
          onClick={handleBooking}
          sx={{ bgcolor: "#566129", "&:hover": { bgcolor: "#454d1f" }, minWidth: 200 }}
        >
          {state.bookingStatus === "loading" ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={24} sx={{ color: "common.white" }} />
              Booking...
            </Box>
          ) : "Confirm Booking"}
        </Button>
      </Box>

      {state.bookingStatus && state.bookingStatus !== "loading" && (
        <Alert severity={state.bookingStatus} sx={{ mt: 2 }} onClose={() => setState(prev => ({ ...prev, bookingStatus: null }))}>
          {state.bookingStatus === "success" 
            ? "Appointment booked successfully!"
            : "Failed to book appointment. Please try again."}
        </Alert>
      )}
    </Paper>
  );
};

export default BookAppointmentPage;