import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mock = new MockAdapter(axios, { delayResponse: 1000 }); // 2s delay

const mockDoctors = {
  1: {
    id: 1,
    name: "Dr. Sarah Johnson",
    city: "Karachi",
    specialization: "neurologist",
    qualification: "MBBS, FCPS (Cardiology)",
    experience: 15,
    satisfactionRate: 94,
    avgTime: 20,
    hospitalAddress: "Aga Khan University Hospital, Stadium Road, Karachi",
    personalLink: "https://akhdoctorportal.com/sarahjohnson",
    fee: 3000,
    profilePicture: "https://s.pinimg.com/webapp/future-home1-796541ba.png"
  },
  2: {
    id: 2,
    name: "Dr. Ahmed Khan",
    city: "Lahore",
    specialization: "neurologist",
    qualification: "MBBS, FCPS (Dermatology)",
    experience: 10,
    satisfactionRate: 89,
    avgTime: 15,
    hospitalAddress: "Shaukat Khanum Memorial Hospital, Lahore",
    personalLink: "https://skmh.pk/ahmedkhan",
    fee: 2500
  },
  3: {
    id: 3,
    name: "Dr. Ayesha Siddiqui",
    city: "Islamabad",
    specialization: "neurologist",
    qualification: "MBBS, FCPS (Neurology)",
    experience: 7,
    satisfactionRate: 91,
    avgTime: 18,
    hospitalAddress: "PIMS Hospital, Islamabad",
    personalLink: "https://pims.gov.pk/ayeshasiddiqui",
    fee: 1800,
    profilePicture: "https://s.pinimg.com/webapp/future-home2-79d541ba.png"
  },
  4: {
    id: 4,
    name: "Dr. Usman Raza",
    city: "Karachi",
    specialization: "neurologist",
    qualification: "MBBS, MS (Ortho)",
    experience: 12,
    satisfactionRate: 88,
    avgTime: 25,
    hospitalAddress: "Jinnah Hospital, Karachi",
    personalLink: "https://jhkarachi.pk/usmanraza",
    fee: 3500
  },
  5: {
    id: 5,
    name: "Dr. Maria Latif",
    city: "Lahore",
    specialization: "neurologist",
    qualification: "MBBS, DCH",
    experience: 9,
    satisfactionRate: 92,
    avgTime: 14,
    hospitalAddress: "Children’s Hospital, Lahore",
    personalLink: "https://childrenshospital.pk/marialatif",
    fee: 2000
  },
  6: {
    id: 6,
    name: "Dr. Kamran Malik",
    city: "Islamabad",
    specialization: "neurologist",
    qualification: "MBBS, FCPS (Psychiatry)",
    experience: 14,
    satisfactionRate: 90,
    avgTime: 30,
    hospitalAddress: "Shifa International Hospital, Islamabad",
    personalLink: "https://shifa.pk/kamranmalik",
    fee: 4000
  },
  7: {
    id: 7,
    name: "Dr. Rida Hassan",
    city: "Karachi",
    specialization: "neurologist",
    qualification: "MBBS, FCPS (Gynecology)",
    experience: 11,
    satisfactionRate: 95,
    avgTime: 22,
    hospitalAddress: "Liaquat National Hospital, Karachi",
    personalLink: "https://lnh.pk/ridahassan",
    fee: 3200
  },
  8: {
    id: 8,
    name: "Dr. Zafar Iqbal",
    city: "Lahore",
    specialization: "ENT Specialist",
    qualification: "MBBS, MS (ENT)",
    experience: 16,
    satisfactionRate: 87,
    avgTime: 18,
    hospitalAddress: "Mayo Hospital, Lahore",
    personalLink: "https://mayo.pk/zafariqbal",
    fee: 2800
  },
  9: {
    id: 9,
    name: "Dr. Sana Yousuf",
    city: "Islamabad",
    specialization: "Endocrinologist",
    qualification: "MBBS, FCPS (Endocrinology)",
    experience: 10,
    satisfactionRate: 93,
    avgTime: 20,
    hospitalAddress: "PIMS Hospital, Islamabad",
    personalLink: "https://pims.pk/sanayousuf",
    fee: 2700
  },
  10: {
    id: 10,
    name: "Dr. Faisal Bashir",
    city: "Karachi",
    specialization: "Pulmonologist",
    qualification: "MBBS, FCPS (Pulmonology)",
    experience: 13,
    satisfactionRate: 89,
    avgTime: 24,
    hospitalAddress: "Indus Hospital, Karachi",
    personalLink: "https://indus.pk/faisalbashir",
    fee: 3500
  },
  11: {
    id: 11,
    name: "Dr. Hina Farooq",
    city: "Lahore",
    specialization: "Oncologist",
    qualification: "MBBS, FCPS (Oncology)",
    experience: 8,
    satisfactionRate: 91,
    avgTime: 26,
    hospitalAddress: "Shaukat Khanum Memorial Hospital, Lahore",
    personalLink: "https://skmh.pk/hinafarooq",
    fee: 3800
  },
  12: {
    id: 12,
    name: "Dr. Adnan Sheikh",
    city: "Islamabad",
    specialization: "Nephrologist",
    qualification: "MBBS, FCPS (Nephrology)",
    experience: 17,
    satisfactionRate: 86,
    avgTime: 28,
    hospitalAddress: "Shifa International Hospital, Islamabad",
    personalLink: "https://shifa.pk/adnansheikh",
    fee: 4100
  },
  13: {
    id: 13,
    name: "Dr. Lubna Tariq",
    city: "Karachi",
    specialization: "Rheumatologist",
    qualification: "MBBS, FCPS (Rheumatology)",
    experience: 6,
    satisfactionRate: 90,
    avgTime: 16,
    hospitalAddress: "South City Hospital, Karachi",
    personalLink: "https://southcity.pk/lubnatarik",
    fee: 2300
  }
};

// Mock API for fetching a specific doctor by ID
mock.onGet(/doctors\/\d+/).reply(config => {
  return new Promise(resolve => {
    setTimeout(() => {
      const doctorId = config.url.split("/").pop();
      const doctor = mockDoctors[doctorId];

      if (doctor) {
        resolve([200, doctor]);
      } else {
        resolve([404, { message: "Doctor not found" }]);
      }
    }, 2000);
  });
});

// Mock API for fetching all doctors with filtering
mock.onGet("/doctors").reply(config => {
  return new Promise(resolve => {
    setTimeout(() => {
      const filters = config.params || {};
      const filteredDoctors = Object.values(mockDoctors).filter(doctor => {
        const matchesCity = !filters.city || doctor.city.toLowerCase() === filters.city.toLowerCase();
        const matchesSpecialization = !filters.specialization || doctor.specialization.toLowerCase() === filters.specialization.toLowerCase();
        const matchesName = !filters.name || doctor.name.toLowerCase().includes(filters.name.toLowerCase());
    
        // Handle fee filter (range and "2000+")
        const matchesFee = !filters.fee || (() => {
            if (filters.fee.includes("+")) {
                const minFee = Number(filters.fee.replace("+", "").trim());
                return doctor.fee >= minFee;
            } else {
                const [minFee, maxFee] = filters.fee.split("-").map(Number);
                return doctor.fee >= minFee && doctor.fee <= maxFee;
            }
        })();
    
        // Handle experience filter (range and "10+")
        const matchesExperience = !filters.experience || (() => {
            if (filters.experience.includes("+")) {
                const minExp = Number(filters.experience.replace("+", "").trim());
                return doctor.experience >= minExp;
            } else {
                const [minExp, maxExp] = filters.experience.split("-").map(Number);
                return doctor.experience >= minExp && doctor.experience <= maxExp;
            }
        })();
    
        return matchesCity && matchesSpecialization && matchesName && matchesFee && matchesExperience;
    });
     
      resolve([200, filteredDoctors]);
    }, 2000);
  });
});










// 3. Update mock API structure
let mockAppointments = {
  doctors: {
    '1': {
      '2025-04-01': ['09:00-09:30', '10:00-10:30'],
      '2023-08-02': ['14:00-14:30']
    }
  },
  patients: {}
};

// Mock endpoint response
mock.onGet(/getBookedSlots\/\d+\//).reply(config => {
  const doctorId = config.url.split('/')[2];
  const doctorSlots = mockAppointments.doctors[doctorId] || {};
  
  // Return a cloned object to ensure React state updates
  return [200, { 
    bookedSlots: JSON.parse(JSON.stringify(doctorSlots)) 
  }];
});

// Mock POST booking endpoint
mock.onPost('/bookAppointment').reply(config => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const requestData = JSON.parse(config.data);
        const { doctorId, patientId, date, time, reason } = requestData;

        // Validate required fields
        if (!doctorId || !patientId || !date || !time) {
          resolve([400, { success: false, error: "Missing required fields" }]);
          return;
        }

        // Validate doctor exists
        if (!mockDoctors[doctorId]) {
          resolve([404, { success: false, error: "Doctor not found" }]);
          return;
        }

        // Validate date format and time
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate)) {
          resolve([400, { success: false, error: "Invalid date format" }]);
          return;
        }

        // Initialize storage
        mockAppointments.doctors[doctorId] = mockAppointments.doctors[doctorId] || {};
        mockAppointments.doctors[doctorId][date] = mockAppointments.doctors[doctorId][date] || [];
        mockAppointments.patients[patientId] = mockAppointments.patients[patientId] || [];

        // Check for existing booking
        if (mockAppointments.doctors[doctorId][date].includes(time)) {
          resolve([409, { 
            success: false, 
            error: "Time slot already booked" 
          }]);
          return;
        }

        // Create appointment
        const newAppointment = {
          id: `appt_${Date.now()}`,
          doctorId,
          patientId,
          date,
          time,
          reason,
          status: "confirmed",
          createdAt: new Date().toISOString()
        };

        // Update storage
        mockAppointments.doctors[doctorId][date].push(time);
        mockAppointments.patients[patientId].push(newAppointment);

        resolve([200, {
          success: true,
          appointment: {
            ...newAppointment,
            doctorDetails: mockDoctors[doctorId],
            patientDetails: {
              name: "Mock Patient",
              email: "patient@mock.com"
            }
          }
        }]);

      } catch (error) {
        console.error("Booking error:", error);
        resolve([500, { 
          success: false, 
          error: "Internal server error" 
        }]);
      }
    }, 1000);
  });
});





const mockPatientAppointments={
  1 :[{
      id: 'app998x2',
      status: 'pending',
      date: '2025-04-1',
      time: '09:00AM-09:30AM',
      doctorName: 'Dr. mehboob',
      patientName: 'mr beemar',
      fee: '3000',
      hospitalAddress: "very big very large very nice very beautiful hospital in karachi"
},
{
  id: 'app998x3',
  status: 'pending',
  date: '2025-04-2',
  time: '09:00AM-09:30AM',
  doctorName: 'Dr. mehboob',
  patientName: 'mr beemar',
  fee: '3000',
  hospitalAddress: "very big very large very nice very beautiful hospital in karachi"
}]}

mock.onGet(/\/patient\/getAppointments\/(\d+)/).reply(config => {
  const match = config.url.match(/\/patient\/getAppointments\/(\d+)/);
  const patientId = match ? parseInt(match[1], 10) : null; // Convert to number

  if (!patientId || !mockPatientAppointments[patientId]) {
    return [404, { message: "No appointments found for this patient." }];
  }

  return [200, { data: mockPatientAppointments[patientId] }];
});





export default mock;
