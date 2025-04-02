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
  },
  14: {
    id: 14,
    name: "Dr. Areej Tahir",
    city: "Karachi",
    specialization: "neurologist",
    qualification: "MBBS, FCPS (Rheumatology)",
    experience: 6,
    satisfactionRate: 90,
    avgTime: 30,
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
mock.onPost('/patient/bookAppointment').reply(config => {
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




let mockReports={1:[{
id:"rep1192",
title:"CBC",
date:"2025-4-1",
time:"9:32 AM",
patientName:"mr beemar",
fee:"300",
hospitalAddress:"very big hospital in karachi with a LAB!"

},
{
  id:"rep1122",
  title:"nose",
  date:"2025-4-1",
  time:"9:40 AM",
  patientName:"mr beemar",
  fee:"700",
  hospitalAddress:"very big hospital in karachi with a LAB!"
  
  },
  {
    id:"rep1132",
    title:"eyes",
    date:"2025-4-1",
    time:"10:32 AM",
    patientName:"mr beemar",
    fee:"2000",
    hospitalAddress:"very big hospital in karachi with a LAB!"
    
    }]}

mock.onGet(/\/patient\/getReports\/(\d+)/).reply(config => {
  const match = config.url.match(/\/patient\/getReports\/(\d+)/);
  const patientId = match ? parseInt(match[1], 10) : null; // Convert to number

  if (!patientId || !mockReports[patientId]) {
    return [404, { message: "No appointments found for this patient." }];
  }

  return [200, { data: mockReports[patientId] }];
});



// Simulated Base64-encoded PDF (Replace with actual Base64 data)
const fakePDFBase64 = "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVGl0bGUgKElu..."; // Truncated for readability

mock.onGet(/\/patient\/(\d+)\/downloadReport\/(\w+)/).reply((config) => {
  const match = config.url.match(/\/patient\/(\d+)\/downloadReport\/(\w+)/);
  const reportId = match ? match[2] : null;

  if (!reportId) {
    return [400, { message: "Invalid report request." }];
  }

  // Simulating a file download response
  return [200, fakePDFBase64];
});




let mockPrescriptions={1:[{
  id:"pres1192",
  appointmentId:"app1244",
  doctorName:"Dr. Sara",
  date:"2025-4-1",
  time:"9:32 AM",
  hospitalAddress:"very big hospital in karachi with a LAB!"
  
  },
  {
    id:"pres112192",
    appointmentId:"app1644",
    doctorName:"Dr. Sara",
    date:"2025-4-1",
    time:"11:32 AM",
    hospitalAddress:"very big hospital in karachi with a LAB!"
    
    },
    {
      id:"pres3192",
      appointmentId:"app15544",
      doctorName:"Dr. Sara",
      date:"2025-4-1",
      time:"10:32 AM",
      hospitalAddress:"very big hospital in karachi with a LAB!"
      
      }]}
  

mock.onGet(/\/patient\/getPrescriptions\/(\d+)/).reply(config => {
  const match = config.url.match(/\/patient\/getPrescriptions\/(\d+)/);
  const patientId = match ? parseInt(match[1], 10) : null; // Convert to number

  if (!patientId || !mockPrescriptions[patientId]) {
    return [404, { message: "No prescriptions found for this patient." }];
  }

  return [200, { data: mockPrescriptions[patientId] }];
});



const mockPrescription = {
  "1": [ // Use string keys for patient IDs
    {
      id: "pres1192",
      doctorName: "Dr. Sara",
      patientName: "mr beemar",
      date: "2025-03-28",
      time: "03:00 PM",
      prescriptionDuration: "7",
      endDate: "2025-04-04",
      prescriptionDetails: [
        {
          drug: "panadol",
          intake: "3",
          intakeInstruction: "take before 30 mins of each meal"
        },
        {
          drug: "drug187",
          intake: "2",
          intakeInstruction: "take in morning and night"
        }
      ],
      sideNote: "light exercise daily, workout biceps and prioritize rest. avoid cardio exercises",
      hospitalAddress:"very nice hospital, Karachi"
    }
  ]
};

mock.onGet(/\/patient\/(\d+)\/getPrescription\/(\w+)\/?/).reply((config) => {
  const urlMatch = config.url.match(/\/patient\/(\d+)\/getPrescription\/(\w+)\/?/);
  if (!urlMatch) {
    return [400, { message: "Invalid request URL" }];
  }

  const patientId = urlMatch[1];
  const prescriptionId = urlMatch[2];

  // Check if patient exists
  const patientPrescriptions = mockPrescription[patientId];
  if (!patientPrescriptions) {
    return [404, { message: "Patient not found" }];
  }

  // Find specific prescription
  const prescription = patientPrescriptions.find(p => p.id === prescriptionId);
  if (!prescription) {
    return [404, { message: "Prescription not found" }];
  }

  return [200, prescription];
});




// Mock API endpoints
// mock.onGet(/\/doctor\/(.+)\/getAppointments/).reply((config) => {
//   const doctorId = config.url.split('/')[2];
//   const today = new Date();
  
//   // Get today's appointments with automatic status updates
//   const todayString = format(today, 'yyyy-MM-dd');
//   const todayAppointments = getAppointmentsForDate(doctorId, todayString).map(appt => {
//     if (appt.status === 'pending' && isBefore(new Date(), parseISO(todayString + ' ' + appt.time.split('-')[0]))) {
//       return { ...appt, status: 'ongoing' };
//     }
//     return appt;
//   });


  // let appointments={

  //   today: [
  //       {
  //         id: 'appt001',
  //         patientId: '101',
  //         patientName: 'John Doe',
  //         reason: 'Annual checkup',
  //         time: '9:00AM-9:30AM',
  //         status: 'completed',
  //       },
  //       {
  //         id: 'appt002',
  //         patientId: '102',
  //         patientName: 'Jane Smith',
  //         time: '9:30AM-10:00AM',
  //         reason: 'Follow-up visit',
  //         status: 'ongoing',
  //       },
  //     {
  //         id: 'appt003',
  //         patientId: '102',
  //         patientName: 'Smith jhon',
  //         time: '1:00PM-01:30PM',
  //         reason: 'Follow-up visit',
  //         status: 'pending',
  //       }],
    
  //   futureSixDays:[
  //       {
  //         id: 'appt067',
  //         patientId: '101',
  //         patientName: 'John Doe',
  //         reason: 'Annual checkup',
  //     date:'2025-04-1',
  //         time: '9:00AM-9:30AM',
  //         status: 'pending',
  //       },
  //       {
  //         id: 'appt002',
  //         doctorId: '1',
  //         patientId: '102',
  //         patientName: 'Jane Smith',
  //   date:'2025-04-2',      
  //   time: '9:30AM-10:00AM',
  //         reason: 'Follow-up visit',
  //         status: 'pending',
  //       }] 
  //   }
    
    let appointments={
      appointments:{

      today: [ {
        id: 'app998x2',
        pres: "pres1192",
        patientId: '101',
        patientName: 'John Doe',
        reason: 'Annual checkup',
        time: '9:00AM-9:30AM',
        status: 'ongoing',
      },
      {
        id: 'appt7182732',
        patientId: '101',
        patientName: 'John Doe',
        reason: 'Annual checkup',
        time: '9:00AM-9:30AM',
        status: 'ongoing',
      },
      {
        id: 'appt7182732',
        patientId: '101',
        patientName: 'John Doe',
        reason: 'Annual checkup',
        time: '9:00AM-9:30AM',
        status: 'ongoing',
      },
      {
        id: 'appt7182732',
        patientId: '101',
        patientName: 'John Doe',
        reason: 'Annual checkup',
        time: '9:00AM-9:30AM',
        status: 'ongoing',
      },
      {
        id: 'appt7182732',
        patientId: '101',
        patientName: 'John Doe',
        reason: 'Annual checkup',
        time: '9:00AM-9:30AM',
        status: 'ongoing',
      }], 
      
      futureSixDays:[
          {
            id: 'jijihbu',
            patientId: '101',
            patientName: 'John Doe',
            reason: 'Annual checkup',
        date:'2025-04-03',
            time: '9:00AM-9:30AM',
            status: 'pending',
          },
          {
            id: 'nububu',
            patientId: '101',
            patientName: 'John Doe',
            reason: 'Annual checkup',
        date:'2025-04-03',
            time: '9:00AM-9:30AM',
            status: 'pending',
          },
          {
            id: 'nuihnui',
            patientId: '101',
            patientName: 'John Doe',
            reason: 'Annual checkup',
        date:'2025-04-03',
            time: '9:00AM-9:30AM',
            status: 'pending',
          },{
            id: 'bhjubhj',
            patientId: '101',
            patientName: 'John Doe',
            reason: 'Annual checkup',
        date:'2025-04-03',
            time: '9:00AM-9:30AM',
            status: 'pending',
          },
          {
            id: 'bhjbhj',
            patientId: '101',
            patientName: 'John Doe',
            reason: 'Annual checkup',
        date:'2025-04-03',
            time: '9:00AM-9:30AM',
            status: 'pending',
          },
          {
            id: 'bnjbn',
            doctorId: '1',
            patientId: '102',
            patientName: 'Jane Smith',
      date:'2025-04-04',      
      time: '9:30AM-10:00AM',
            reason: 'Follow-up visitasdnajskfnasfnasfnasfnasjfajsfajk',
            status: 'pending',
          }] 
      }}
      



  mock.onGet(/\/doctor\/(.+)\/getAppointments/).reply((config) => {
    const today = new Date();
      return[200, appointments]
  
    });
  

  


export default mock;