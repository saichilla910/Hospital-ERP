import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { INITIAL_HOSPITAL_DATA } from '../data/mockHospitalData';
import { loadDatabase, saveDatabase } from '../services/storageService';
import { getPathFromNav, getNavFromPath } from '../utils/navigation';
import {
  ROLES,
  getActiveSessionUser,
  setActiveSessionUser,
  clearActiveSession,
  authenticateUser,
  registerUser as registerAuthUser,
  canAccessModule
} from '../services/authService';
import { announceTokenVoice } from '../utils/audioNotification';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(() => loadDatabase(INITIAL_HOSPITAL_DATA));
  const [selectedPatient, setSelectedPatient] = useState(() => {
    const loaded = loadDatabase(INITIAL_HOSPITAL_DATA);
    return loaded.patients[0] || INITIAL_HOSPITAL_DATA.patients[0];
  });
  const [activeModal, setActiveModal] = useState(null); // { type, data }
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [activeNav, setActiveNavState] = useState(() => getNavFromPath(location.pathname));

  useEffect(() => {
    const navFromPath = getNavFromPath(location.pathname);
    if (
      navFromPath.module !== activeNav.module ||
      navFromPath.subModule !== activeNav.subModule
    ) {
      setActiveNavState(navFromPath);
    }
  }, [location.pathname]);

  const setActiveNav = (navTarget) => {
    const nextNav = typeof navTarget === 'function' ? navTarget(activeNav) : navTarget;
    if (!nextNav || !nextNav.module) return;

    setActiveNavState(nextNav);
    const targetPath = getPathFromNav(nextNav);
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('medicore_theme') || 'light';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auto-sync entire data object to JSON persistent storage
  useEffect(() => {
    saveDatabase(data);
  }, [data]);

  // Staff Role-Based Authentication & Session State
  const [currentUser, setCurrentUser] = useState(() => getActiveSessionUser());
  const [userRole, setUserRole] = useState(() => {
    const active = getActiveSessionUser();
    return active ? active.role : 'admin';
  });
  const [authenticatedPatient, setAuthenticatedPatient] = useState(null);
  const [patientOnboardingModalOpen, setPatientOnboardingModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('medicore_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const openModal = (type, modalData = null) => {
    setActiveModal({ type, data: modalData });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const login = (emailOrUsername, password, role) => {
    const authenticated = authenticateUser(emailOrUsername, password, role);
    setCurrentUser(authenticated);
    setActiveSessionUser(authenticated);
    setUserRole(authenticated.role);
    setActiveNav({ module: 'dashboard', subModule: null });
    const r = ROLES[authenticated.role] || ROLES.admin;
    showToast(`Welcome, ${authenticated.name}! Logged in as ${r.emoji} ${r.name}.`, 'success');
    return authenticated;
  };

  const logout = () => {
    clearActiveSession();
    setCurrentUser(null);
    setUserRole('admin');
    setActiveNav({ module: 'dashboard', subModule: null });
    showToast('You have been logged out of HospitalCare ERP.', 'info');
  };

  const register = (userData) => {
    if (currentUser && currentUser.role !== 'admin') {
      showToast('Unauthorized: Only the System Administrator has permission to create staff accounts and assign roles.', 'error');
      throw new Error('Only the System Administrator has permission to create staff accounts and assign roles.');
    }
    const newUser = registerAuthUser(userData);
    const r = ROLES[newUser.role] || ROLES.admin;
    showToast(`Staff account for ${newUser.name} (${r.name}) provisioned successfully!`, 'success');
    return newUser;
  };

  // Role position is locked permanently upon login to maintain clinical data integrity
  const switchRole = () => {
    showToast('Staff role & position is strictly locked to this active login session. To switch roles, please log out and sign in with the target account.', 'warning');
  };


  const canAccess = (moduleKey) => {
    if (!currentUser) return false;
    return canAccessModule(currentUser.role, moduleKey);
  };

  const loginAsPatient = (patient) => {
    // If a staff user is logged in, their role is permanently locked to their staff position
    if (currentUser) {
      setSelectedPatient(patient);
      setActiveNav({ module: 'patientManagement', subModule: 'profile' });
      showToast(`Viewing medical dossier for ${patient.name} (${patient.mrn})`, 'info');
      return;
    }
    setUserRole('patient');
    setAuthenticatedPatient(patient);
    setSelectedPatient(patient);
    setActiveNav({ module: 'patientManagement', subModule: 'profile' });
    showToast(`Logged in to Patient Portal as ${patient.name} (${patient.mrn})`, 'success');
  };

  const loginAsStaff = () => {
    if (currentUser) {
      setUserRole(currentUser.role);
    } else {
      setUserRole('admin');
    }
    setAuthenticatedPatient(null);
    showToast('Switched to Staff Portal View', 'info');
  };

  const registerNewPatient = (patientInput) => {
    const generatedId = `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedMrn = `MRN-09${Math.floor(1000 + Math.random() * 9000)}`;
    const regDate = new Date().toISOString().split('T')[0];

    const weightNum = parseFloat(patientInput.weight) || 70;
    const heightNum = parseFloat(patientInput.height) || 170;
    const bmiVal = (weightNum / ((heightNum / 100) * (heightNum / 100))).toFixed(1);

    const bpInput = patientInput.bp || '120/80 mmHg';
    const systolicNum = parseInt(bpInput.split('/')[0]) || 120;
    const diastolicNum = parseInt(bpInput.split('/')[1]) || 80;
    const pulseNum = parseInt(patientInput.pulse) || 72;
    const spo2Num = parseInt(patientInput.spo2) || 98;
    const tempNum = parseFloat(patientInput.temp) || 98.6;
    const bloodSugarNum = parseInt(patientInput.bloodSugar) || 100;

    const vitalsHistory = [
      {
        date: "09/11",
        time: "08:00 AM",
        systolic: Math.min(180, systolicNum + 12),
        diastolic: Math.min(110, diastolicNum + 6),
        pulse: pulseNum + 6,
        spo2: Math.max(92, spo2Num - 2),
        temp: tempNum,
        bloodSugar: bloodSugarNum + 24,
        weight: weightNum + 0.6,
        notes: "Baseline intake check"
      },
      {
        date: "09/13",
        time: "08:00 AM",
        systolic: Math.min(175, systolicNum + 7),
        diastolic: Math.min(105, diastolicNum + 4),
        pulse: pulseNum + 3,
        spo2: Math.max(93, spo2Num - 1),
        temp: tempNum,
        bloodSugar: bloodSugarNum + 12,
        weight: weightNum + 0.3,
        notes: "Clinical review & stabilization"
      },
      {
        date: "09/15",
        time: "08:00 AM",
        systolic: Math.min(160, systolicNum + 3),
        diastolic: Math.min(100, diastolicNum + 2),
        pulse: pulseNum + 1,
        spo2: spo2Num,
        temp: tempNum,
        bloodSugar: bloodSugarNum + 4,
        weight: weightNum + 0.1,
        notes: "Follow-up monitoring"
      },
      {
        date: "09/17",
        time: "08:00 AM",
        systolic: systolicNum,
        diastolic: diastolicNum,
        pulse: pulseNum,
        spo2: spo2Num,
        temp: tempNum,
        bloodSugar: bloodSugarNum,
        weight: weightNum,
        notes: "Current verified vitals"
      }
    ];

    const patientRecord = {
      id: generatedId,
      mrn: generatedMrn,
      name: patientInput.name,
      age: parseInt(patientInput.age) || 30,
      gender: patientInput.gender || 'Male',
      bloodGroup: patientInput.bloodGroup || 'O+',
      phone: patientInput.phone,
      email: patientInput.email || `${patientInput.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: patientInput.address || 'Cyberabad, Hyderabad',
      emergencyContact: patientInput.emergencyContact || 'Family Contact - ' + patientInput.phone,
      allergies: Array.isArray(patientInput.allergies)
        ? patientInput.allergies
        : (patientInput.allergies ? patientInput.allergies.split(',').map((a) => a.trim()).filter(Boolean) : ['None known']),
      chronicConditions: Array.isArray(patientInput.chronicConditions)
        ? patientInput.chronicConditions
        : (patientInput.chronicConditions ? patientInput.chronicConditions.split(',').map((c) => c.trim()).filter(Boolean) : ['None reported']),
      vitals: {
        bp: `${systolicNum}/${diastolicNum} mmHg`,
        pulse: `${pulseNum} bpm`,
        temp: `${tempNum} °F`,
        spo2: `${spo2Num}%`,
        weight: `${weightNum} kg`,
        height: `${heightNum} cm`,
        bmi: bmiVal
      },
      vitalsHistory,
      insurance: {
        provider: patientInput.insuranceProvider || 'Self-Pay (Cash)',
        policyNo: patientInput.policyNo || (patientInput.insuranceProvider && patientInput.insuranceProvider !== 'Self-Pay (Cash)' ? `POL-${Math.floor(100000 + Math.random() * 900000)}` : 'N/A'),
        coverage: patientInput.coverage || (patientInput.insuranceProvider && patientInput.insuranceProvider !== 'Self-Pay (Cash)' ? '₹5,00,000' : '₹0'),
        approvedPreAuth: '₹0',
        tpa: patientInput.insuranceProvider && patientInput.insuranceProvider !== 'Self-Pay (Cash)' ? 'Medi Assist TPA' : 'Direct'
      },
      status: 'Outpatient',
      ward: 'N/A',
      bedNo: 'N/A',
      attendingDoctor: patientInput.attendingDoctor || 'Dr. Arvind Swaminathan',
      registeredDate: regDate,
      admissionDate: regDate,
      photo: patientInput.photo || (patientInput.gender === 'Female'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'),
      consultationsHistory: [
        {
          consultationId: `CNS-2026-${Math.floor(100 + Math.random() * 900)}`,
          doctorId: 'DOC-101',
          doctorName: patientInput.attendingDoctor || 'Dr. Arvind Swaminathan',
          specialty: 'Primary / General Care',
          department: 'Outpatient OPD',
          room: 'Consultation Suite',
          date: regDate,
          time: '11:00 AM',
          type: 'New Patient Baseline Intake & Registration',
          diagnosis: (patientInput.chronicConditions && patientInput.chronicConditions[0] !== 'None reported') ? patientInput.chronicConditions[0] : 'General Health Check & Baseline Evaluation',
          vitalsAtConsult: `BP ${systolicNum}/${diastolicNum} mmHg, Pulse ${pulseNum} bpm, SpO2 ${spo2Num}%`,
          clinicalNotes: `Patient registered into hospital system. Medical profile, allergy tags, and initial vitals verified. Assigned attending physician: ${patientInput.attendingDoctor || 'Dr. Arvind Swaminathan'}.`,
          prescribedMeds: ['Tab. Multivitamin & Minerals (A to Z)', 'Tab. Vitamin D3 60,000 IU Weekly'],
          followUp: 'Review in OPD after 4 weeks.',
          status: 'Active Care'
        }
      ]
    };

    const newApt = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      token: `OPD-0${data.opdAppointments.length + 1}`,
      date: regDate,
      patientId: patientRecord.id,
      patientName: patientRecord.name,
      doctorId: 'DOC-101',
      doctorName: patientRecord.attendingDoctor,
      department: 'General Medicine',
      time: '11:00 AM',
      status: 'Confirmed',
      reason: 'New Patient Intake & Preventive Checkup',
      type: 'New Patient'
    };

    const newRx = {
      id: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: regDate,
      patientId: patientRecord.id,
      patientName: patientRecord.name,
      doctorId: 'DOC-101',
      doctorName: patientRecord.attendingDoctor,
      department: 'General Medicine',
      diagnosis: patientRecord.chronicConditions[0] || 'Initial Health Consultation',
      items: [
        { name: 'Tab. Multivitamin & Minerals (A to Z)', dosage: '1 tab OD (Morning)', duration: '30 Days', instructions: 'After breakfast' },
        { name: 'Tab. Vitamin D3 60,000 IU', dosage: '1 cap Weekly', duration: '8 Weeks', instructions: 'With milk' }
      ],
      dietAdvice: 'Balanced hydration, 8 hours sleep, and 30 mins moderate activity daily.',
      followUp: 'Review in OPD after 4 weeks.'
    };

    setData((prev) => ({
      ...prev,
      patients: [patientRecord, ...prev.patients],
      opdAppointments: [newApt, ...prev.opdAppointments],
      prescriptions: [newRx, ...prev.prescriptions],
      executiveStats: {
        ...prev.executiveStats,
        totalPatientsToday: prev.executiveStats.totalPatientsToday + 1
      }
    }));

    setSelectedPatient(patientRecord);
    if (userRole === 'patient') {
      setAuthenticatedPatient(patientRecord);
      setUserRole('patient');
    }
    setPatientOnboardingModalOpen(false);

    logAudit('Patient Registration & Intake', `${patientRecord.name} (${patientRecord.mrn})`, 'Patient Intake');
    showToast(`Patient ${patientRecord.name} registered successfully! (MRN: ${patientRecord.mrn})`, 'success');
    setActiveNav({ module: 'patientManagement', subModule: 'profile' });
    return patientRecord;
  };

  // State Mutators
  const addPatient = (newPatient) => {
    const generatedId = `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const regDate = new Date().toISOString().split('T')[0];
    const generatedMrn = `MRN-09${Math.floor(1000 + Math.random() * 9000)}`;

    const patientRecord = {
      ...newPatient,
      id: generatedId,
      mrn: newPatient.mrn || generatedMrn,
      registeredDate: regDate,
      consultationsHistory: (newPatient.consultationsHistory && newPatient.consultationsHistory.length > 0)
        ? newPatient.consultationsHistory
        : [
            {
              consultationId: `CNS-2026-${Math.floor(100 + Math.random() * 900)}`,
              doctorId: 'DOC-101',
              doctorName: newPatient.attendingDoctor || 'Dr. Arvind Swaminathan',
              specialty: 'Primary Care / General Medicine',
              department: 'Outpatient OPD',
              room: 'Consultation Suite 1',
              date: regDate,
              time: '11:00 AM',
              type: 'New Patient Baseline Intake & Registration',
              diagnosis: (newPatient.chronicConditions && newPatient.chronicConditions[0] !== 'None reported')
                ? newPatient.chronicConditions[0]
                : 'General Clinical Intake & Baseline Examination',
              vitalsAtConsult: `BP ${newPatient.vitals?.bp || newPatient.bp || '120/80 mmHg'}, Pulse ${newPatient.vitals?.pulse || newPatient.pulse || '72 bpm'}, SpO2 ${newPatient.vitals?.spo2 || newPatient.spo2 || '99%'}`,
              clinicalNotes: `Patient registered into hospital database. Medical profile, allergy flags, and initial vitals verified. Assigned attending physician: ${newPatient.attendingDoctor || 'Dr. Arvind Swaminathan'}.`,
              prescribedMeds: ['Tab. Multivitamin & Minerals (A to Z)', 'Tab. Vitamin D3 60,000 IU Weekly'],
              followUp: 'Routine follow-up in OPD after 4 weeks.',
              status: 'Active Care'
            }
          ]
    };

    setData((prev) => ({
      ...prev,
      patients: [patientRecord, ...prev.patients],
      executiveStats: {
        ...prev.executiveStats,
        totalPatientsToday: prev.executiveStats.totalPatientsToday + 1
      }
    }));

    setSelectedPatient(patientRecord);
    if (userRole === 'patient') {
      setAuthenticatedPatient(patientRecord);
    }

    logAudit('Patient Registration', `${patientRecord.name} (${patientRecord.id})`, 'Patient Management');
    showToast(`Patient ${patientRecord.name} registered successfully! (MRN: ${patientRecord.mrn})`, 'success');
    return patientRecord;
  };

  const addDoctor = (newDoctor) => {
    const generatedId = `DOC-${Math.floor(200 + Math.random() * 800)}`;
    const docName = (newDoctor.name || '').trim().startsWith('Dr.')
      ? (newDoctor.name || '').trim()
      : `Dr. ${(newDoctor.name || 'Specialist Doctor').trim()}`;

    const avatarPool = [
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594824813511-4b1308a0d244?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&auto=format&fit=crop&q=80'
    ];
    const defaultPhoto = avatarPool[Math.floor(Math.random() * avatarPool.length)];

    const doctorRecord = {
      id: generatedId,
      name: docName,
      specialty: newDoctor.specialty || 'General Medicine Specialist',
      department: newDoctor.department || 'General Medicine',
      qualifications: newDoctor.qualifications || 'MBBS, MD',
      experience: newDoctor.experience ? (newDoctor.experience.includes('Year') ? newDoctor.experience : `${newDoctor.experience} Years`) : '10+ Years',
      room: newDoctor.room || `${Math.floor(100 + Math.random() * 400)}`,
      fee: parseFloat(newDoctor.fee) || 750,
      phone: newDoctor.phone || '+91 98480 12345',
      email: newDoctor.email || 'doctor@medicorehospital.org',
      photo: newDoctor.photo || defaultPhoto,
      status: newDoctor.status || 'On-Duty',
      availableNow: newDoctor.availableNow !== undefined ? newDoctor.availableNow : true,
      patientRating: parseFloat(newDoctor.patientRating) || 4.9,
      reviewCount: 1,
      totalSurgeries: parseInt(newDoctor.totalSurgeries) || 0,
      successRate: parseFloat(newDoctor.successRate) || 99.2,
      nextSlot: 'Today 11:30 AM',
      availableSlotsToday: 14,
      schedule: {
        days: newDoctor.days || 'Mon - Sat',
        timing: newDoctor.timing || '09:00 AM – 01:00 PM & 04:00 PM – 07:30 PM'
      },
      about: newDoctor.about || `Senior specialist in ${newDoctor.specialty || 'General Medicine'} dedicated to comprehensive diagnostic and surgical excellence.`,
      certifications: newDoctor.certifications || ['NMC Verified Specialist', 'NABH Quality Accredited Consultant']
    };

    setData((prev) => ({
      ...prev,
      doctors: [doctorRecord, ...(prev.doctors || [])]
    }));

    logAudit('Doctor Onboarding', `${doctorRecord.name} (${doctorRecord.specialty})`, 'Medical Administration');
    showToast(`${doctorRecord.name} registered and onboarded to Hospital Specialist Roster!`, 'success');
    return doctorRecord;
  };

  const addAppointment = (appointment) => {
    const newApt = {
      ...appointment,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      token: `OPD-0${data.opdAppointments.length + 1}`,
      date: new Date().toISOString().split('T')[0]
    };
    setData((prev) => ({
      ...prev,
      opdAppointments: [newApt, ...prev.opdAppointments],
      executiveStats: {
        ...prev.executiveStats,
        opdFootfall: prev.executiveStats.opdFootfall + 1
      }
    }));
    logAudit('OPD Appointment Scheduled', `Token ${newApt.token} for ${newApt.patientName}`, 'OPD');
    showToast(`Appointment booked! Token ${newApt.token} assigned.`, 'success');
  };

  const bookDoctorConsultation = ({ doctor, patient, appointmentTime = '11:30 AM', consultType = 'OPD Consultation', reason = 'General Clinical Consultation', date = null }) => {
    const consultationDate = date || new Date().toISOString().split('T')[0];
    const generatedToken = `OPD-0${(data.opdAppointments || []).length + 1}`;
    const newApt = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      token: generatedToken,
      date: consultationDate,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      time: appointmentTime,
      status: 'Checked-In',
      reason,
      type: consultType
    };

    const newSlotBooking = {
      slotId: `SLOT-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorId: doctor.id,
      date: consultationDate,
      time: appointmentTime,
      patientId: patient.id,
      patientName: patient.name,
      token: generatedToken,
      type: consultType,
      status: 'Confirmed'
    };

    const newEncounter = {
      consultationId: `CNS-2026-${Math.floor(100 + Math.random() * 900)}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      department: doctor.department,
      room: doctor.room,
      date: consultationDate,
      time: appointmentTime,
      type: consultType,
      diagnosis: reason || 'Specialist Consultation in Progress',
      vitalsAtConsult: `BP ${patient.vitals?.bp || '120/80 mmHg'}, Pulse ${patient.vitals?.pulse || '74 bpm'}, SpO2 ${patient.vitals?.spo2 || '98%'}`,
      clinicalNotes: `Patient scheduled and checked in for ${consultType} with ${doctor.name} (${doctor.specialty}). Chief complaint: ${reason}. Room: ${doctor.room}.`,
      prescribedMeds: [],
      followUp: 'Clinical consultation in progress.',
      status: 'In-Consult'
    };

    setData((prev) => {
      const updatedPatients = prev.patients.map((p) => {
        if (p.id === patient.id) {
          const currentHistory = p.consultationsHistory || [];
          return {
            ...p,
            attendingDoctor: doctor.name,
            consultationsHistory: [newEncounter, ...currentHistory]
          };
        }
        return p;
      });

      const consultFee = Number(doctor.fee) || 850;
      const consultCharge = {
        id: `CHG-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: patient.id,
        patientName: patient.name,
        admissionId: 'OPD-CONSULT',
        serviceType: 'Consultation',
        serviceName: `OPD Specialist Consultation - ${doctor.name} (${doctor.specialty})`,
        qty: 1,
        rate: consultFee,
        amount: consultFee,
        date: consultationDate,
        sourceModule: 'OPD',
        status: 'Pending',
        isAutoCaptured: true
      };

      return {
        ...prev,
        patients: updatedPatients,
        opdAppointments: [newApt, ...prev.opdAppointments],
        bookedSlots: [newSlotBooking, ...(prev.bookedSlots || [])],
        charges: [consultCharge, ...(prev.charges || [])],
        executiveStats: {
          ...prev.executiveStats,
          opdFootfall: prev.executiveStats.opdFootfall + 1
        }
      };
    });

    if (selectedPatient?.id === patient.id) {
      setSelectedPatient((prev) => ({
        ...prev,
        attendingDoctor: doctor.name,
        consultationsHistory: [newEncounter, ...(prev.consultationsHistory || [])]
      }));
    }
    if (authenticatedPatient?.id === patient.id) {
      setAuthenticatedPatient((prev) => ({
        ...prev,
        attendingDoctor: doctor.name,
        consultationsHistory: [newEncounter, ...(prev.consultationsHistory || [])]
      }));
    }

    logAudit('Doctor Consultation Booked', `${doctor.name} for ${patient.name} (Token ${generatedToken})`, 'OPD / Doctors');
    showToast(`Consultation confirmed with ${doctor.name}! Token ${generatedToken} assigned at ${doctor.room}`, 'success');
  };

  // Doctor Slot Management
  const createDoctorSlot = (slotData) => {
    const docObj = (data.doctors || []).find((d) => d.id === slotData.doctorId) || data.doctors[0];
    const newSlot = {
      id: `SLOT-${Math.floor(2000 + Math.random() * 8000)}`,
      doctorId: slotData.doctorId || docObj.id,
      doctorName: docObj.name,
      department: docObj.department || 'General OPD',
      room: docObj.room || 'OPD Suite',
      date: slotData.date || new Date().toISOString().split('T')[0],
      startTime: slotData.startTime || '09:00 AM',
      endTime: slotData.endTime || '09:30 AM',
      capacity: parseInt(slotData.capacity) || 5,
      bookedCount: 0,
      avgConsultTimeMins: parseInt(slotData.avgConsultTimeMins) || 12,
      status: 'Active'
    };

    setData((prev) => ({
      ...prev,
      doctorSlots: [newSlot, ...(prev.doctorSlots || [])]
    }));

    logAudit('Doctor Slot Created', `${docObj.name} - ${newSlot.date} (${newSlot.startTime})`, 'OPD / Slots');
    showToast(`Slot created for ${docObj.name} on ${newSlot.date} (${newSlot.startTime})`, 'success');
    return newSlot;
  };

  const updateDoctorSlot = (slotId, updates) => {
    setData((prev) => ({
      ...prev,
      doctorSlots: (prev.doctorSlots || []).map((s) => (s.id === slotId ? { ...s, ...updates } : s))
    }));
    showToast('Doctor slot updated successfully.', 'info');
  };

  const deleteDoctorSlot = (slotId) => {
    setData((prev) => ({
      ...prev,
      doctorSlots: (prev.doctorSlots || []).filter((s) => s.id !== slotId)
    }));
    showToast('Doctor slot deleted.', 'warning');
  };

  // Appointment Status & Queue Lifecycle Transition (Booked -> Checked-In -> In-Consultation -> Completed / No-Show)
  const updateAppointmentStatus = (aptId, newStatus) => {
    let updatedAptDetails = null;

    setData((prev) => {
      const appointments = prev.opdAppointments || [];
      const aptIndex = appointments.findIndex((a) => a.id === aptId);
      if (aptIndex < 0) return prev;

      const targetApt = appointments[aptIndex];
      let token = targetApt.token;
      let checkInTime = targetApt.checkInTime;
      let estimatedWaitMins = targetApt.estimatedWaitMins || 0;
      let queuePosition = targetApt.queuePosition || 0;

      // Handle transition to Checked-In: generate token number & calculate estimated wait time
      if (newStatus === 'Checked-In') {
        const todayStr = targetApt.date || new Date().toISOString().split('T')[0];
        
        // Count how many patients ahead for this doctor today
        const patientsAhead = appointments.filter(
          (a) => a.doctorId === targetApt.doctorId && a.date === todayStr && (a.status === 'Checked-In' || a.status === 'In-Consultation') && a.id !== aptId
        ).length;

        // Estimate wait time: average consult time (e.g. 12 mins) * patients ahead
        const doctorObj = (prev.doctors || []).find((d) => d.id === targetApt.doctorId);
        const avgConsult = doctorObj?.avgWaitTime ? parseInt(doctorObj.avgWaitTime) || 12 : 12;
        estimatedWaitMins = patientsAhead * avgConsult;
        queuePosition = patientsAhead + 1;
        checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (!token || token.startsWith('OPD-')) {
          const docSeq = (appointments.filter((a) => a.doctorId === targetApt.doctorId && a.token).length + 1);
          token = `T-${100 + docSeq}`;
        }
      }

      const updatedApt = {
        ...targetApt,
        status: newStatus,
        token: token || targetApt.token,
        checkInTime: checkInTime || targetApt.checkInTime,
        estimatedWaitMins,
        queuePosition
      };

      updatedAptDetails = updatedApt;

      const updatedAppointments = [...appointments];
      updatedAppointments[aptIndex] = updatedApt;

      // Synchronize with Live Token Queue Monitor
      let tokenQueue = [...(prev.tokenQueue || [])];
      const existingQueueIndex = tokenQueue.findIndex((q) => q.token === updatedApt.token);

      const queueStatusMap = {
        'Checked-In': 'Waiting',
        'In-Consultation': 'In-Room',
        'Completed': 'Completed',
        'No-Show': 'No-Show'
      };

      const roomName = updatedApt.room || (prev.doctors || []).find((d) => d.id === updatedApt.doctorId)?.room || 'OPD Suite';

      if (newStatus === 'Checked-In' || newStatus === 'In-Consultation') {
        const queueItem = {
          token: updatedApt.token,
          room: roomName,
          doctor: updatedApt.doctorName,
          patient: updatedApt.patientName,
          status: queueStatusMap[newStatus] || 'Waiting',
          dept: updatedApt.department,
          waitMins: updatedApt.estimatedWaitMins
        };

        if (existingQueueIndex >= 0) {
          tokenQueue[existingQueueIndex] = queueItem;
        } else {
          tokenQueue.push(queueItem);
        }
      } else if (newStatus === 'Completed' || newStatus === 'No-Show') {
        tokenQueue = tokenQueue.filter((q) => q.token !== updatedApt.token);
      }

      return {
        ...prev,
        opdAppointments: updatedAppointments,
        tokenQueue
      };
    });

    logAudit('Appointment Status Change', `${aptId} -> ${newStatus}`, 'OPD / Queue');
    showToast(`Appointment status changed to ${newStatus}${updatedAptDetails?.token ? ` (Token: ${updatedAptDetails.token})` : ''}`, 'success');
  };

  // SMS & WhatsApp Reminder Dispatches
  const sendAppointmentReminder = (aptId, channel = 'WhatsApp') => {
    const sentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

    let patientName = '';
    setData((prev) => ({
      ...prev,
      opdAppointments: (prev.opdAppointments || []).map((a) => {
        if (a.id === aptId) {
          patientName = a.patientName;
          return {
            ...a,
            reminderSent: true,
            reminderChannel: channel,
            reminderTime: sentTime
          };
        }
        return a;
      })
    }));

    logAudit(`${channel} Reminder Sent`, `Appointment ${aptId} to ${patientName}`, 'OPD / Reminders');
    showToast(`${channel} reminder dispatch simulated for ${patientName}! Status: Delivered`, 'success');
  };

  const sendBatchReminders = (targetDate, channel = 'WhatsApp') => {
    let count = 0;
    const sentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today';

    setData((prev) => ({
      ...prev,
      opdAppointments: (prev.opdAppointments || []).map((a) => {
        if (a.date === targetDate) {
          count++;
          return {
            ...a,
            reminderSent: true,
            reminderChannel: channel,
            reminderTime: sentTime
          };
        }
        return a;
      })
    }));

    logAudit(`Batch ${channel} Reminders Sent`, `${count} reminders sent for ${targetDate}`, 'OPD / Reminders');
    showToast(`Batch ${channel} reminders sent to ${count || 0} scheduled patients for ${targetDate}!`, 'success');
  };

  // Live Queue Voice & Chime Calling
  const callQueueToken = (tokenNumber) => {
    let calledApt = null;
    setData((prev) => {
      const tokenQueue = (prev.tokenQueue || []).map((item) => {
        if (item.token === tokenNumber) {
          calledApt = item;
          return { ...item, status: 'Calling' };
        }
        return item;
      });
      return { ...prev, tokenQueue };
    });

    if (calledApt) {
      announceTokenVoice(calledApt.token, calledApt.patient, calledApt.room, calledApt.doctor);
    }
    showToast(`Calling Token ${tokenNumber} to ${calledApt?.room || 'Consultation Room'}!`, 'info');
  };

  const addPrescription = (rx) => {
    const newRx = {
      ...rx,
      id: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };

    // Also update patient's consultation history with this prescription
    setData((prev) => {
      const updatedPatients = prev.patients.map((p) => {
        if (p.id === rx.patientId) {
          const existingHistory = p.consultationsHistory || [];
          const matchedEncIndex = existingHistory.findIndex((enc) => enc.doctorId === rx.doctorId && enc.date === newRx.date);

          if (matchedEncIndex >= 0) {
            const updatedEnc = {
              ...existingHistory[matchedEncIndex],
              diagnosis: rx.diagnosis,
              prescribedMeds: rx.items?.map((it) => it.name) || [],
              dietAdvice: rx.dietAdvice,
              followUp: rx.followUp,
              status: 'Completed'
            };
            const copy = [...existingHistory];
            copy[matchedEncIndex] = updatedEnc;
            return { ...p, consultationsHistory: copy };
          } else {
            const newEnc = {
              consultationId: `CNS-2026-${Math.floor(100 + Math.random() * 900)}`,
              doctorId: rx.doctorId,
              doctorName: rx.doctorName,
              specialty: rx.department || 'Specialist Consult',
              department: rx.department || 'General OPD',
              room: 'OPD Suite',
              date: newRx.date,
              time: 'Current Session',
              type: 'Prescription & Clinical Consult',
              diagnosis: rx.diagnosis,
              vitalsAtConsult: `BP ${p.vitals?.bp || '120/80'}, Pulse ${p.vitals?.pulse || '74'}`,
              clinicalNotes: `Prescription ${newRx.id} issued by ${rx.doctorName}. Diet: ${rx.dietAdvice}. Follow-up: ${rx.followUp}`,
              prescribedMeds: rx.items?.map((it) => it.name) || [],
              followUp: rx.followUp,
              status: 'Completed'
            };
            return { ...p, consultationsHistory: [newEnc, ...existingHistory] };
          }
        }
        return p;
      });

      return {
        ...prev,
        patients: updatedPatients,
        prescriptions: [newRx, ...prev.prescriptions]
      };
    });

    logAudit('Generated Prescription', `${newRx.id} for ${newRx.patientName}`, 'OPD / Prescriptions');
    showToast(`Prescription ${newRx.id} generated and sent to Central Pharmacy POS!`, 'success');
  };

  const addEmergencyCase = (erCase) => {
    const newCase = {
      ...erCase,
      id: `EMG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      caseNo: `ER-0${data.emergencyCases.length + 900}`,
      arrivalTime: 'Just now'
    };
    setData((prev) => ({
      ...prev,
      emergencyCases: [newCase, ...prev.emergencyCases],
      executiveStats: {
        ...prev.executiveStats,
        emergencyCasesToday: prev.executiveStats.emergencyCasesToday + 1
      }
    }));
    logAudit('Emergency Triage Recorded', `Case ${newCase.caseNo} (${newCase.triageLevel})`, 'Emergency');
    showToast(`Emergency Case ${newCase.caseNo} Triaged to ${newCase.assignedBay}!`, 'error');
  };

  const updateBedStatus = (arg1, arg2, arg3, arg4 = 'None', arg5 = 'None') => {
    let targetWardId = null;
    let targetBedNo = null;
    let newStatus = 'available';
    let patientName = 'None';
    let diagnosis = 'None';
    let extra = {};

    if (arg3 !== undefined && typeof arg3 === 'string') {
      // Called as: (wardId, bedNo, newStatus, patientName, diagnosis)
      targetWardId = arg1;
      targetBedNo = arg2;
      newStatus = arg3.toLowerCase();
      patientName = arg4;
      diagnosis = arg5;
    } else {
      // Called as: (bedNo, newStatus, extra)
      targetBedNo = arg1;
      newStatus = (arg2 || 'available').toLowerCase();
      extra = arg3 || {};
      if (extra.patientName) patientName = extra.patientName;
      if (extra.diagnosis) diagnosis = extra.diagnosis;
    }

    setData((prev) => {
      // 1. Update wards.beds
      const updatedWards = (prev.wards || []).map((ward) => {
        if (!targetWardId || ward.id === targetWardId) {
          const updatedBeds = ward.beds.map((bed) => {
            if (bed.bedNo === targetBedNo) {
              return {
                ...bed,
                status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
                patientName: newStatus === 'occupied' ? patientName : 'None',
                diagnosis: newStatus === 'occupied' ? diagnosis : 'None'
              };
            }
            return bed;
          });
          const occupiedCount = updatedBeds.filter((b) => b.status === 'Occupied' || b.status === 'occupied').length;
          return { ...ward, beds: updatedBeds, occupiedBeds: occupiedCount };
        }
        return ward;
      });

      // 2. Update beds table
      const updatedBeds = (prev.beds || []).map((bed) => {
        if (bed.bedNo === targetBedNo) {
          return {
            ...bed,
            status: newStatus,
            patientName: newStatus === 'occupied' ? (patientName !== 'None' ? patientName : bed.patientName) : null,
            attendingDoctor: newStatus === 'occupied' ? (extra.attendingDoctor || bed.attendingDoctor) : null,
            ...extra
          };
        }
        return bed;
      });

      return {
        ...prev,
        wards: updatedWards,
        beds: updatedBeds
      };
    });

    logAudit('Bed Status Changed', `Bed ${targetBedNo} -> ${newStatus}`, 'IPD Bed Management');
    showToast(`Bed ${targetBedNo} status updated to ${newStatus}.`, 'info');
  };

  const dispenseMedicine = (medId, quantity = 1) => {
    setData((prev) => ({
      ...prev,
      pharmacyMedicines: prev.pharmacyMedicines.map((med) => {
        if (med.id === medId) {
          const updatedStock = Math.max(0, med.stock - quantity);
          return {
            ...med,
            stock: updatedStock,
            status: updatedStock <= med.minStock ? (updatedStock === 0 ? 'Out of Stock' : 'Low Stock') : 'In-Stock'
          };
        }
        return med;
      })
    }));
    logAudit('Pharmacy POS Dispense', `Med ${medId} Qty: ${quantity}`, 'Pharmacy');
    showToast(`Dispensed ${quantity} unit(s) of medicine. Stock synchronized.`, 'success');
  };

  const addInvoice = (invoice) => {
    const newInv = {
      ...invoice,
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      billNo: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setData((prev) => ({
      ...prev,
      billingInvoices: [newInv, ...prev.billingInvoices]
    }));
    logAudit('Invoice Created', `${newInv.billNo} for ${newInv.patientName}`, 'Billing');
    showToast(`Invoice ${newInv.billNo} generated successfully!`, 'success');
    return newInv;
  };

  // Automatic Charge Capture Functions
  const addCharge = (chargeInput) => {
    const newChg = {
      id: `CHG-${Math.floor(1000 + Math.random() * 9000)}`,
      date: chargeInput.date || new Date().toISOString().split('T')[0],
      status: chargeInput.status || 'Pending',
      isAutoCaptured: chargeInput.isAutoCaptured !== undefined ? chargeInput.isAutoCaptured : true,
      ...chargeInput,
      amount: (chargeInput.qty || 1) * (chargeInput.rate || 0)
    };
    setData((prev) => ({
      ...prev,
      charges: [newChg, ...(prev.charges || [])]
    }));
    logAudit('Charge Captured', `${newChg.serviceName} (₹${newChg.amount}) for ${newChg.patientName} from ${newChg.sourceModule}`, 'Billing & Finance');
    showToast(`Captured ₹${newChg.amount.toLocaleString()} for ${newChg.serviceName} (${newChg.patientName})`, 'success');
    return newChg;
  };

  const autoCaptureCharge = ({ patientId, patientName, admissionId, serviceType, serviceName, qty = 1, rate = 0, sourceModule }) => {
    const chargeItem = {
      id: `CHG-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patientId || 'PAT-2026-8801',
      patientName: patientName || 'Outpatient',
      admissionId: admissionId || 'N/A',
      serviceType: serviceType || 'General Service',
      serviceName,
      qty,
      rate,
      amount: qty * rate,
      date: new Date().toISOString().split('T')[0],
      sourceModule: sourceModule || 'Clinical Services',
      status: 'Pending',
      isAutoCaptured: true
    };

    setData((prev) => ({
      ...prev,
      charges: [chargeItem, ...(prev.charges || [])]
    }));

    logAudit('Auto-Captured Charge', `${serviceName} (₹${chargeItem.amount}) from ${sourceModule} for ${patientName}`, 'Billing & Finance');
    return chargeItem;
  };

  // Daily Scheduled Job: Inpatient (IPD) Bed Charges & 24x7 Nursing Run
  const runDailyBedChargeJob = () => {
    const today = new Date().toISOString().split('T')[0];
    let capturedCount = 0;
    const newCharges = [];

    (data.patients || []).forEach((pat) => {
      if (pat.status === 'Inpatient' || pat.status === 'ICU' || pat.status === 'Post-Op') {
        const wardType = pat.ward || 'General Ward';
        const isIcu = pat.status === 'ICU' || wardType.includes('ICU') || wardType.includes('MICU');
        
        const bedRate = isIcu ? 8500 : (wardType.includes('Special') || wardType.includes('Private') ? 4500 : 3500);
        const nursingRate = isIcu ? 2500 : 1200;

        // Check if bed charge already exists for today
        const existingBedChargeToday = (data.charges || []).some(
          (c) => c.patientId === pat.id && c.date === today && c.serviceType === 'Bed Charges'
        );

        if (!existingBedChargeToday) {
          newCharges.push({
            id: `CHG-${Math.floor(1000 + Math.random() * 9000)}`,
            patientId: pat.id,
            patientName: pat.name,
            admissionId: `IPD-${pat.id.replace('PAT-', '')}`,
            serviceType: 'Bed Charges',
            serviceName: `${wardType} Bed Stay (${pat.bedNo || 'Bed'}) - Daily Charge`,
            qty: 1,
            rate: bedRate,
            amount: bedRate,
            date: today,
            sourceModule: 'IPD',
            status: 'Pending',
            isAutoCaptured: true
          });

          newCharges.push({
            id: `CHG-${Math.floor(1000 + Math.random() * 9000)}`,
            patientId: pat.id,
            patientName: pat.name,
            admissionId: `IPD-${pat.id.replace('PAT-', '')}`,
            serviceType: 'Nursing',
            serviceName: `24x7 Specialized Nursing & Vitals Care - Daily Charge`,
            qty: 1,
            rate: nursingRate,
            amount: nursingRate,
            date: today,
            sourceModule: 'IPD',
            status: 'Pending',
            isAutoCaptured: true
          });

          capturedCount += 2;
        }
      }
    });

    if (newCharges.length > 0) {
      setData((prev) => ({
        ...prev,
        charges: [...newCharges, ...(prev.charges || [])]
      }));
      logAudit('Daily Bed Charge Job Executed', `Captured ${capturedCount} automated daily IPD charges for today (${today})`, 'Billing & IPD');
      showToast(`Daily Bed Charge Job executed! Captured ${capturedCount} room & nursing charges across admitted patients.`, 'success');
    } else {
      showToast(`Daily Bed Charge Job: All admitted inpatients already have today's charges captured.`, 'info');
    }

    return capturedCount;
  };

  // Final Bill Generation: Sum of captured charges minus advance deposits and discounts (with strict audit logging)
  const generateFinalBill = ({
    patientId,
    patientName,
    chargeIds = [],
    discount = 0,
    discountReason = '',
    advancePaid = 0,
    insuranceClaimed = 0,
    paymentMode = 'POS Card / UPI'
  }) => {
    const allCharges = data.charges || [];
    const selectedCharges = allCharges.filter((c) => chargeIds.includes(c.id));
    
    let wardCharges = 0;
    let doctorConsultCharges = 0;
    let otAndProcedureCharges = 0;
    let pharmacyCharges = 0;
    let labAndRadiologyCharges = 0;
    let nursingCharges = 0;

    selectedCharges.forEach((c) => {
      const amt = Number(c.amount) || 0;
      if (c.serviceType === 'Bed Charges') wardCharges += amt;
      else if (c.serviceType === 'Consultation') doctorConsultCharges += amt;
      else if (c.serviceType === 'Surgery/OT') otAndProcedureCharges += amt;
      else if (c.serviceType === 'Pharmacy' || c.serviceType === 'Consumables') pharmacyCharges += amt;
      else if (c.serviceType === 'Laboratory' || c.serviceType === 'Radiology') labAndRadiologyCharges += amt;
      else if (c.serviceType === 'Nursing') nursingCharges += amt;
      else wardCharges += amt;
    });

    const subtotal = selectedCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const numDiscount = Number(discount) || 0;
    const numAdvance = Number(advancePaid) || 0;
    const numInsurance = Number(insuranceClaimed) || 0;
    const taxGst = Math.round(Math.max(0, subtotal - numDiscount) * 0.05);
    const totalAmount = Math.max(0, subtotal - numDiscount + taxGst);
    const balanceDue = Math.max(0, totalAmount - numAdvance - numInsurance);

    const generatedBillNo = `BILL-IPD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const billDate = new Date().toISOString().split('T')[0];

    const newInvoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      billNo: generatedBillNo,
      patientId,
      patientName,
      type: 'Hospital Final Settlement & Clinical Tax Invoice',
      date: billDate,
      wardCharges,
      doctorConsultCharges,
      otAndProcedureCharges,
      pharmacyCharges,
      labAndRadiologyCharges,
      nursingCharges,
      subtotal,
      taxGst,
      discount: numDiscount,
      totalAmount,
      advancePaid: numAdvance,
      insuranceClaimed: numInsurance,
      balanceDue,
      paymentMode,
      status: balanceDue === 0 ? 'Paid' : 'Partially Paid',
      billedChargeIds: chargeIds
    };

    // If discount was given, record in billingAuditLogs with user & reason!
    let newAuditLog = null;
    if (numDiscount > 0) {
      newAuditLog = {
        id: `BAUD-2026-${Math.floor(10 + Math.random() * 90)}`,
        timestamp: `${billDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        billNo: generatedBillNo,
        patientName,
        action: 'Discount Applied',
        field: 'Institutional Concession',
        previousValue: '₹0',
        newValue: `₹${numDiscount.toLocaleString()}`,
        changeAmount: numDiscount,
        reason: discountReason || 'NABH Institutional Concession approved by Medical Director',
        user: currentUser?.name || 'Administrator',
        role: currentUser?.role || 'admin'
      };
    }

    setData((prev) => {
      // Mark selected charges as billed
      const updatedCharges = (prev.charges || []).map((c) =>
        chargeIds.includes(c.id) ? { ...c, status: 'Billed' } : c
      );

      const updatedAuditLogs = newAuditLog
        ? [newAuditLog, ...(prev.billingAuditLogs || [])]
        : (prev.billingAuditLogs || []);

      return {
        ...prev,
        charges: updatedCharges,
        billingInvoices: [newInvoice, ...prev.billingInvoices],
        billingAuditLogs: updatedAuditLogs,
        executiveStats: {
          ...prev.executiveStats,
          revenueToday: `₹${((parseInt(prev.executiveStats.revenueToday.replace(/[^0-9]/g, '')) || 428000) + (numAdvance || totalAmount)).toLocaleString()}`
        }
      };
    });

    logAudit('Final Bill Generated', `Bill ${generatedBillNo} (₹${totalAmount}) for ${patientName}`, 'Billing & Finance');
    showToast(`Final Tax Bill ${generatedBillNo} generated successfully!`, 'success');
    return newInvoice;
  };

  // Healthcare Package Application
  const applyPackageToPatient = ({ patientId, patientName, packageId, discount = 0, discountReason = '' }) => {
    const pkg = (data.servicePackages || []).find((p) => p.id === packageId);
    if (!pkg) return;

    const today = new Date().toISOString().split('T')[0];
    const finalRate = Math.max(0, (pkg.discountedRate || pkg.baseRate) - (Number(discount) || 0));

    const packageCharge = {
      id: `CHG-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId,
      patientName,
      admissionId: `PKG-${patientId.replace('PAT-', '')}`,
      serviceType: 'Package',
      serviceName: `${pkg.name} (${pkg.roomType}, ${pkg.stayDurationDays} Days)`,
      qty: 1,
      rate: finalRate,
      amount: finalRate,
      date: today,
      sourceModule: 'Package Master',
      status: 'Pending',
      isAutoCaptured: true,
      packageDetails: pkg
    };

    let auditEntry = null;
    if (discount > 0 || (pkg.baseRate - pkg.discountedRate) > 0) {
      auditEntry = {
        id: `BAUD-2026-${Math.floor(10 + Math.random() * 90)}`,
        timestamp: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        billNo: `PKG-${pkg.code}`,
        patientName,
        action: 'Package Applied',
        field: pkg.name,
        previousValue: `Standard MRP: ₹${pkg.baseRate.toLocaleString()}`,
        newValue: `Package Rate: ₹${finalRate.toLocaleString()}`,
        changeAmount: -(pkg.baseRate - finalRate),
        reason: discountReason || `Applied ${pkg.name} fixed care package savings`,
        user: currentUser?.name || 'Administrator',
        role: currentUser?.role || 'admin'
      };
    }

    setData((prev) => ({
      ...prev,
      charges: [packageCharge, ...(prev.charges || [])],
      billingAuditLogs: auditEntry ? [auditEntry, ...(prev.billingAuditLogs || [])] : (prev.billingAuditLogs || [])
    }));

    logAudit('Healthcare Package Applied', `${pkg.name} (₹${finalRate}) for ${patientName}`, 'Billing');
    showToast(`Package "${pkg.name}" applied for ${patientName}! Rate: ₹${finalRate.toLocaleString()}`, 'success');
    return packageCharge;
  };

  // Insurance & PMJAY Claims Management
  const updateClaimStatus = ({ claimId, newStatus, approvedAmount, rejectionReason, remarks }) => {
    setData((prev) => ({
      ...prev,
      insuranceClaims: (prev.insuranceClaims || []).map((clm) => {
        if (clm.id === claimId) {
          return {
            ...clm,
            status: newStatus,
            approvedAmount: approvedAmount !== undefined ? Number(approvedAmount) : clm.approvedAmount,
            rejectionReason: rejectionReason !== undefined ? rejectionReason : clm.rejectionReason,
            remarks: remarks || clm.remarks,
            approvalDate: newStatus.includes('Approved') ? new Date().toISOString().split('T')[0] : clm.approvalDate
          };
        }
        return clm;
      })
    }));

    logAudit('Insurance Claim Updated', `Claim ${claimId} -> ${newStatus}${rejectionReason ? ` (Reason: ${rejectionReason})` : ''}`, 'Billing & TPA');
    showToast(`Claim ${claimId} updated to ${newStatus}!`, 'info');
  };

  const addBillingAuditEntry = (auditInput) => {
    const newEntry = {
      id: `BAUD-2026-${Math.floor(10 + Math.random() * 90)}`,
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      user: currentUser?.name || 'Administrator',
      role: currentUser?.role || 'admin',
      ...auditInput
    };

    setData((prev) => ({
      ...prev,
      billingAuditLogs: [newEntry, ...(prev.billingAuditLogs || [])]
    }));

    logAudit('Bill Edit / Discount Audit', `${auditInput.action}: ${auditInput.reason}`, 'Billing Audit');
    showToast(`Audit log recorded for bill modification.`, 'info');
    return newEntry;
  };

  const addServicePriceItem = (item) => {
    const newItem = {
      id: `PRC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      ...item
    };
    setData((prev) => ({
      ...prev,
      servicePriceMaster: [newItem, ...(prev.servicePriceMaster || [])]
    }));
    showToast(`Service "${newItem.name}" added to Price Master!`, 'success');
    return newItem;
  };

  const updateServicePriceItem = (id, updates) => {
    setData((prev) => ({
      ...prev,
      servicePriceMaster: (prev.servicePriceMaster || []).map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));
    showToast('Price master item updated.', 'info');
  };

  const createServicePackage = (pkg) => {
    const newPkg = {
      id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      ...pkg
    };
    setData((prev) => ({
      ...prev,
      servicePackages: [newPkg, ...(prev.servicePackages || [])]
    }));
    showToast(`Package "${newPkg.name}" created successfully!`, 'success');
    return newPkg;
  };

  const addPatientVital = (patientId, vitalData) => {
    const timeFormatted = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

    const newVitalEntry = {
      date: vitalData.date || dateFormatted,
      time: vitalData.time || timeFormatted,
      systolic: Number(vitalData.systolic) || 120,
      diastolic: Number(vitalData.diastolic) || 80,
      pulse: Number(vitalData.pulse) || 72,
      spo2: Number(vitalData.spo2) || 98,
      temp: Number(vitalData.temp) || 98.6,
      bloodSugar: Number(vitalData.bloodSugar) || 100,
      weight: Number(vitalData.weight) || 70,
      notes: vitalData.notes || 'Routine vital check'
    };

    let updatedSelected = null;

    setData((prev) => {
      const updatedPatients = prev.patients.map((p) => {
        if (p.id === patientId) {
          const newHistory = [...(p.vitalsHistory || []), newVitalEntry];
          const updatedPatient = {
            ...p,
            vitals: {
              ...p.vitals,
              bp: `${newVitalEntry.systolic}/${newVitalEntry.diastolic} mmHg`,
              pulse: `${newVitalEntry.pulse} bpm`,
              temp: `${newVitalEntry.temp} °F`,
              spo2: `${newVitalEntry.spo2}%`,
              weight: `${newVitalEntry.weight} kg`
            },
            vitalsHistory: newHistory
          };
          if (selectedPatient && selectedPatient.id === patientId) {
            updatedSelected = updatedPatient;
          }
          return updatedPatient;
        }
        return p;
      });

      return {
        ...prev,
        patients: updatedPatients
      };
    });

    if (updatedSelected) {
      setSelectedPatient(updatedSelected);
    }

    logAudit('Clinical Vitals Recorded', `Patient ${patientId}: BP ${newVitalEntry.systolic}/${newVitalEntry.diastolic}, Pulse ${newVitalEntry.pulse} bpm, SpO2 ${newVitalEntry.spo2}%`, 'EMR / Vitals');
    showToast(`New vital reading recorded for patient. Live graph updated!`, 'success');
  };

  const addPatientMedicalEvent = (patientId, eventData) => {
    const newEvent = {
      id: `EVT-${Date.now()}`,
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: eventData.type || 'Clinical Consultation',
      title: eventData.title || 'Medical Event',
      desc: eventData.desc || '',
      diagnosis: eventData.diagnosis || '',
      doctorName: eventData.doctorName || 'Attending Specialist',
      doctorId: eventData.doctorId || '',
      department: eventData.department || 'General Medicine',
      facility: eventData.facility || 'MediCore Hospital Main Campus',
      prescribedMeds: Array.isArray(eventData.prescribedMeds)
        ? eventData.prescribedMeds
        : (eventData.prescribedMeds ? eventData.prescribedMeds.split(',').map((m) => m.trim()) : []),
      severity: eventData.severity || 'Normal',
      status: eventData.status || 'Verified Record',
      recordedAt: new Date().toISOString()
    };

    let updatedSelected = null;

    setData((prev) => {
      const updatedPatients = prev.patients.map((p) => {
        if (p.id === patientId) {
          const currentEvents = p.medicalEvents || [];
          const updatedPatient = {
            ...p,
            medicalEvents: [newEvent, ...currentEvents]
          };
          if (selectedPatient && selectedPatient.id === patientId) {
            updatedSelected = updatedPatient;
          }
          return updatedPatient;
        }
        return p;
      });

      return {
        ...prev,
        patients: updatedPatients
      };
    });

    if (updatedSelected) {
      setSelectedPatient(updatedSelected);
    }

    logAudit('Medical Event Logged', `Patient ${patientId}: ${newEvent.type} - ${newEvent.title}`, 'EMR / Medical History');
    showToast(`Medical event "${newEvent.title}" logged successfully!`, 'success');
    return newEvent;
  };

  const deletePatientMedicalEvent = (patientId, eventId) => {
    let updatedSelected = null;

    setData((prev) => {
      const updatedPatients = prev.patients.map((p) => {
        if (p.id === patientId) {
          const updatedPatient = {
            ...p,
            medicalEvents: (p.medicalEvents || []).filter((e) => e.id !== eventId)
          };
          if (selectedPatient && selectedPatient.id === patientId) {
            updatedSelected = updatedPatient;
          }
          return updatedPatient;
        }
        return p;
      });

      return {
        ...prev,
        patients: updatedPatients
      };
    });

    if (updatedSelected) {
      setSelectedPatient(updatedSelected);
    }

    showToast('Medical event deleted from patient timeline.', 'info');
  };

  const logAudit = (action, target, module) => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      user: 'Dr. Sarah Jenkins (CMO / Admin)',
      action,
      target,
      ip: '192.168.1.55',
      timestamp: new Date().toLocaleString(),
      module
    };
    setData((prev) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs]
    }));
  };

  // ─── 1. MEDICATION SAFETY & DRUG CHECKING (Problem 5) ───
  const validatePrescriptionSafety = ({ patientId, drugItems }) => {
    const patient = (data.patients || []).find((p) => p.id === patientId) || selectedPatient;
    const patientAllergies = (patient?.allergies || []).map((a) => a.toLowerCase().trim()).filter((a) => a !== 'none known');
    const patientAge = Number(patient?.age) || 30;
    const patientWeight = Number(patient?.weightKg) || Number(patient?.vitals?.weight?.replace(/[^0-9.]/g, '')) || 70;
    const masterDrugs = data.drugsMaster || [];
    const interactionsTable = data.drugInteractions || [];

    const allergyWarnings = [];
    const interactionWarnings = [];
    const doseWarnings = [];

    // Allergy & Dose Checks
    drugItems.forEach((drug) => {
      const drugName = (drug.name || drug.genericName || '').toLowerCase();
      // Match drug in master
      const matchedMaster = masterDrugs.find((md) =>
        drugName.includes(md.genericName.toLowerCase()) ||
        drugName.includes(md.brandName.toLowerCase()) ||
        (md.allergyClasses && md.allergyClasses.some((ac) => drugName.includes(ac.toLowerCase())))
      ) || drug;

      // Allergy Check
      if (patientAllergies.length > 0) {
        patientAllergies.forEach((allergy) => {
          const matched =
            drugName.includes(allergy) ||
            (matchedMaster.genericName && matchedMaster.genericName.toLowerCase().includes(allergy)) ||
            (matchedMaster.allergyClasses && matchedMaster.allergyClasses.some((ac) => ac.toLowerCase().includes(allergy) || allergy.includes(ac.toLowerCase())));

          if (matched) {
            allergyWarnings.push({
              drugName: drug.name || matchedMaster.brandName,
              allergen: allergy.toUpperCase(),
              severity: 'Hard Warning',
              message: `Contraindicated: Patient has documented allergy to ${allergy.toUpperCase()}! Prescribing ${drug.name} carries severe anaphylaxis risk.`
            });
          }
        });
      }

      // Dose Validation
      if (matchedMaster.maxDailyDoseMg) {
        const dosageStr = (drug.dosage || '').toUpperCase();
        let timesPerDay = 1;
        if (dosageStr.includes('TID') || dosageStr.includes('TDS') || dosageStr.includes('THRICE')) timesPerDay = 3;
        else if (dosageStr.includes('BID') || dosageStr.includes('BD') || dosageStr.includes('TWICE')) timesPerDay = 2;
        else if (dosageStr.includes('QID') || dosageStr.includes('FOUR')) timesPerDay = 4;

        const singleDoseMg = Number(drug.strengthMg) || Number(matchedMaster.strengthMg) || (matchedMaster.strength ? parseInt(matchedMaster.strength) : 0);
        const estimatedDailyMg = singleDoseMg * timesPerDay;

        if (estimatedDailyMg > matchedMaster.maxDailyDoseMg) {
          doseWarnings.push({
            drugName: drug.name || matchedMaster.brandName,
            prescribedDose: `${estimatedDailyMg}mg/day`,
            maxSafeDose: `${matchedMaster.maxDailyDoseMg}mg/day`,
            severity: 'Overdose Warning',
            message: `Prescribed dose of ${estimatedDailyMg}mg/day exceeds maximum adult ceiling of ${matchedMaster.maxDailyDoseMg}mg/day.`
          });
        }

        // Pediatric dosing check
        if (patientAge < 18 || patientWeight < 40) {
          if (matchedMaster.pediatricSafe === false) {
            doseWarnings.push({
              drugName: drug.name || matchedMaster.brandName,
              prescribedDose: drug.dosage || 'Standard adult dose',
              maxSafeDose: 'Not approved for pediatric use',
              severity: 'Pediatric Contraindication',
              message: `${drug.name || matchedMaster.brandName} is contraindicated for pediatric patients (Age: ${patientAge} yrs, Wt: ${patientWeight} kg).`
            });
          } else if (matchedMaster.pediatricMgPerKg > 0) {
            const maxPediatricSingleDose = Math.round(matchedMaster.pediatricMgPerKg * patientWeight);
            if (singleDoseMg > maxPediatricSingleDose) {
              doseWarnings.push({
                drugName: drug.name || matchedMaster.brandName,
                prescribedDose: `${singleDoseMg}mg single dose`,
                maxSafeDose: `${maxPediatricSingleDose}mg single dose (${matchedMaster.pediatricMgPerKg}mg/kg for ${patientWeight}kg)`,
                severity: 'Pediatric Dose High',
                message: `Single dose (${singleDoseMg}mg) exceeds recommended pediatric limit of ${maxPediatricSingleDose}mg for patient weight (${patientWeight} kg).`
              });
            }
          }
        }
      }
    });

    // Drug-Drug Interaction Check (all pairs in active prescription)
    for (let i = 0; i < drugItems.length; i++) {
      for (let j = i + 1; j < drugItems.length; j++) {
        const d1Name = (drugItems[i].name || '').toLowerCase();
        const d2Name = (drugItems[j].name || '').toLowerCase();

        interactionsTable.forEach((interaction) => {
          const aName = interaction.drugA.toLowerCase();
          const bName = interaction.drugB.toLowerCase();

          const matchesPair =
            (d1Name.includes(aName) && d2Name.includes(bName)) ||
            (d1Name.includes(bName) && d2Name.includes(aName));

          if (matchesPair) {
            interactionWarnings.push({
              drugA: drugItems[i].name,
              drugB: drugItems[j].name,
              severity: interaction.severity,
              mechanism: interaction.mechanism,
              clinicalEffect: interaction.clinicalEffect,
              recommendation: interaction.recommendation
            });
          }
        });
      }
    }

    return {
      isValid: allergyWarnings.length === 0,
      allergyWarnings,
      interactionWarnings,
      doseWarnings
    };
  };

  // ─── 2. ORDER-TO-RESULT LABORATORY LIFECYCLE (Problem 6) ───
  const orderLabTest = (orderInput) => {
    const orderNo = `ORD-LAB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `LAB-${Math.floor(8800 + Math.random() * 1000)}`,
      orderNo,
      patientId: orderInput.patientId,
      patientName: orderInput.patientName,
      testName: orderInput.testName,
      category: orderInput.category || 'Biochemistry',
      orderedBy: orderInput.orderedBy || currentUser?.name || 'Dr. Ananya Mukherjee',
      sampleType: orderInput.sampleType || 'Venous Blood (EDTA/Serum)',
      barcode: `MEDLAB*${orderNo}*`,
      orderTime: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'ordered', // ordered -> sample_collected -> processing -> reported -> verified
      verifiedBy: null,
      technician: null,
      isCritical: false,
      doctorAlerted: false,
      timeline: [
        {
          stage: 'ordered',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: currentUser?.name || 'Attending Physician',
          note: `Requisition created for ${orderInput.testName}. Automatic charge posted to billing.`
        }
      ],
      parameters: [],
      interpretation: 'Test requisitioned. Awaiting sample draw at Phlebotomy desk.'
    };

    // Auto capture lab charge in billing
    autoCaptureCharge({
      patientId: orderInput.patientId,
      admissionId: null,
      serviceType: 'Laboratory',
      description: orderInput.testName,
      qty: 1,
      rate: orderInput.price || 450,
      sourceModule: 'Laboratory'
    });

    setData((prev) => ({
      ...prev,
      labOrders: [newOrder, ...(prev.labOrders || [])]
    }));

    logAudit('Lab Test Ordered', `${newOrder.orderNo}: ${newOrder.testName} for ${newOrder.patientName}`, 'Laboratory / LIS');
    showToast(`Lab order ${newOrder.orderNo} created & charge auto-captured to billing!`, 'success');
    return newOrder;
  };

  const advanceLabOrderStatus = (orderId, targetStatus, updateData = {}) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let isCriticalOrder = false;
    let criticalMsg = '';
    let newlyCreatedAlert = null;

    setData((prev) => {
      const updatedOrders = (prev.labOrders || []).map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = [...(order.timeline || [])];
        let note = updateData.note || `Stage updated to ${targetStatus}`;

        if (targetStatus === 'sample_collected') {
          note = updateData.note || `Sample drawn & barcoded (${order.sampleType})`;
        } else if (targetStatus === 'processing') {
          note = updateData.note || `Loaded onto analyzer queue (${updateData.analyzerName || 'Roche Cobas / Sysmex'})`;
        } else if (targetStatus === 'reported') {
          note = updateData.note || 'Diagnostic results entered by laboratory technician.';
        } else if (targetStatus === 'verified') {
          note = updateData.note || `Electronic validation & NABL sign-off by ${updateData.verifiedBy || 'Dr. Neha Kulkarni, MD'}`;
        }

        updatedTimeline.push({
          stage: targetStatus,
          time: timeStr,
          user: currentUser?.name || 'Laboratory Staff',
          note
        });

        // Parameters range check
        let finalParams = updateData.parameters || order.parameters || [];
        if (finalParams.length > 0) {
          finalParams = finalParams.map((param) => {
            const val = parseFloat(param.result);
            if (isNaN(val)) return param;
            let flag = 'Normal';
            if (param.criticalHigh != null && val >= param.criticalHigh) {
              flag = 'Critical';
              isCriticalOrder = true;
              criticalMsg = `CRITICAL ALERT: ${param.name} is ${param.result} ${param.unit} (Critical High > ${param.criticalHigh})`;
            } else if (param.criticalLow != null && val <= param.criticalLow) {
              flag = 'Critical';
              isCriticalOrder = true;
              criticalMsg = `CRITICAL ALERT: ${param.name} is ${param.result} ${param.unit} (Critical Low < ${param.criticalLow})`;
            } else if (param.max != null && val > param.max) {
              flag = 'High';
            } else if (param.min != null && val < param.min) {
              flag = 'Low';
            }
            return { ...param, flag };
          });
        }

        return {
          ...order,
          ...updateData,
          status: targetStatus,
          timeline: updatedTimeline,
          parameters: finalParams,
          isCritical: isCriticalOrder || order.isCritical,
          doctorAlerted: isCriticalOrder ? true : order.doctorAlerted,
          criticalAlertMessage: criticalMsg || order.criticalAlertMessage,
          [`${targetStatus}Time`]: `${new Date().toISOString().split('T')[0]} ${timeStr}`
        };
      });

      // Add doctor critical alert if critical threshold exceeded
      let updatedAlerts = prev.criticalLabAlerts || [];
      if (isCriticalOrder) {
        const targetOrder = prev.labOrders.find((o) => o.id === orderId);
        newlyCreatedAlert = {
          id: `CRIT-${Date.now()}`,
          orderId,
          orderNo: targetOrder?.orderNo || orderId,
          patientId: targetOrder?.patientId,
          patientName: targetOrder?.patientName,
          testName: targetOrder?.testName,
          criticalParameter: criticalMsg,
          value: 'Critical Threshold Exceeded',
          severity: 'Immediate Doctor Notification Required',
          alertedToDoctor: targetOrder?.orderedBy || 'Attending Physician',
          alertTime: `${new Date().toISOString().split('T')[0]} ${timeStr}`,
          status: 'Doctor Notified',
          acknowledged: false
        };
        updatedAlerts = [newlyCreatedAlert, ...updatedAlerts];
      }

      return {
        ...prev,
        labOrders: updatedOrders,
        criticalLabAlerts: updatedAlerts
      };
    });

    if (isCriticalOrder) {
      showToast(`CRITICAL LAB VALUE DETECTED! Urgent doctor alert dispatched.`, 'error');
    } else {
      showToast(`Lab order status advanced to ${targetStatus}!`, 'success');
    }
  };

  const acknowledgeCriticalAlert = (alertId, doctorName, actionTaken = '') => {
    setData((prev) => ({
      ...prev,
      criticalLabAlerts: (prev.criticalLabAlerts || []).map((alt) =>
        alt.id === alertId
          ? {
              ...alt,
              acknowledged: true,
              acknowledgedBy: doctorName || currentUser?.name || 'Dr. Ananya Mukherjee',
              acknowledgedAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              status: 'Acknowledged',
              actionTaken: actionTaken || 'Clinical intervention reviewed and initiated.'
            }
          : alt
      )
    }));
    showToast('Critical lab alert acknowledged by attending doctor.', 'success');
  };

  const uploadLabReportPdf = (orderId, fileData) => {
    setData((prev) => ({
      ...prev,
      labOrders: (prev.labOrders || []).map((o) =>
        o.id === orderId
          ? {
              ...o,
              pdfAttachment: fileData.fileName || 'Uploaded_Diagnostic_Report.pdf',
              uploadedPdfData: fileData.fileUrl || fileData.dataUrl
            }
          : o
      )
    }));
    showToast('PDF report attached to laboratory record successfully!', 'success');
  };

  // ─── 3. PATIENT UHID, ABHA ID & DUPLICATE DETECTION (Problem 7) ───
  const checkPatientDuplicates = ({ name = '', phone = '', dob = '', age = '' }) => {
    const cleanName = name.toLowerCase().trim();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const currentPatients = data.patients || [];
    const duplicates = [];

    currentPatients.forEach((existing) => {
      const existingName = (existing.name || '').toLowerCase().trim();
      const existingPhone = (existing.phone || '').replace(/[^0-9]/g, '');
      const matchReasons = [];
      let score = 0;

      // Phone match (very strong)
      if (cleanPhone.length >= 7 && existingPhone.includes(cleanPhone)) {
        matchReasons.push('Exact phone number match');
        score += 60;
      }

      // Name exact match
      if (cleanName && existingName === cleanName) {
        matchReasons.push('Exact full name match');
        score += 40;
      } else if (cleanName && (existingName.includes(cleanName) || cleanName.includes(existingName))) {
        matchReasons.push('Partial / fuzzy name match');
        score += 25;
      } else if (cleanName) {
        const nameTokens = cleanName.split(/\s+/);
        const existingTokens = existingName.split(/\s+/);
        const overlap = nameTokens.filter((tok) => existingTokens.includes(tok));
        if (overlap.length >= 2) {
          matchReasons.push(`Common name words: "${overlap.join(' ')}"`);
          score += 30;
        }
      }

      // ABHA ID match (national health identifier)
      const cleanAbha = (existing.abhaId || '').replace(/[^0-9]/g, '');
      const inputCleanAbha = (cleanName.length > 0 ? '' : '') + (cleanPhone ? '' : ''); // fallback
      if (dob && existing.dob === dob) {
        matchReasons.push('Identical date of birth');
        score += 25;
      } else if (age && existing.age && Number(existing.age) === Number(age)) {
        matchReasons.push('Identical age');
        score += 10;
      }

      if (score >= 35) {
        duplicates.push({
          ...existing,
          patient: existing,
          confidence: score >= 60 ? 'High' : 'Medium',
          score,
          reasons: matchReasons,
          matchReason: matchReasons.join(' • ')
        });
      }
    });

    return duplicates;
  };

  const registerPatientWithUhid = (patientInput) => {
    const uhid = patientInput.uhid || `UHID-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const mrn = patientInput.mrn || `MRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPatient = {
      id: `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      uhid,
      abhaId: patientInput.abhaId || '',
      mrn,
      name: patientInput.name,
      age: Number(patientInput.age) || 30,
      gender: patientInput.gender || 'Male',
      bloodGroup: patientInput.bloodGroup || 'O+',
      phone: patientInput.phone,
      email: patientInput.email || `${patientInput.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: patientInput.address || 'Cyberabad, Hyderabad',
      emergencyContact: patientInput.emergencyContact || 'Family Contact',
      allergies: Array.isArray(patientInput.allergies) ? patientInput.allergies : [patientInput.allergies || 'None known'],
      chronicConditions: Array.isArray(patientInput.chronicConditions) ? patientInput.chronicConditions : [patientInput.chronicConditions || 'None reported'],
      weightKg: Number(patientInput.weightKg) || Number(patientInput.weight) || 70,
      vitals: patientInput.vitals || { bp: '120/80 mmHg', pulse: '72 bpm', temp: '98.6 °F', spo2: '99%', weight: '70 kg', height: '170 cm', bmi: '24.2' },
      vitalsHistory: patientInput.vitalsHistory || [],
      insurance: patientInput.insurance || { provider: 'Self-Pay (Cash)', policyNo: 'N/A', coverage: '₹0', approvedPreAuth: '₹0', tpa: 'Direct' },
      status: patientInput.status || 'Outpatient',
      ward: patientInput.ward || 'N/A',
      bedNo: patientInput.bedNo || 'N/A',
      attendingDoctor: patientInput.attendingDoctor || 'Dr. Arvind Swaminathan',
      registeredDate: new Date().toISOString().split('T')[0],
      photo: patientInput.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      consultationsHistory: []
    };

    setData((prev) => ({
      ...prev,
      patients: [newPatient, ...(prev.patients || [])]
    }));

    logAudit('Patient Registration', `Registered patient ${newPatient.name} with UHID ${uhid} & ABHA ${newPatient.abhaId || 'None'}`, 'Patient Administration');
    showToast(`Patient registered! Assigned Unique UHID: ${uhid}`, 'success');
    return newPatient;
  };

  // ─── 4. PHARMACY BATCH INVENTORY & FEFO DISPENSE (Problem 8) ───
  const dispenseMedicineFEFO = (itemId, requestQty, patientRef = {}) => {
    const qtyToDispense = parseInt(requestQty) || 1;
    const currentBatches = [...(data.pharmacyBatches || [])];
    const currentItems = [...(data.pharmacyItems || [])];

    const matchedItem = currentItems.find((i) => i.id === itemId);
    if (!matchedItem) {
      showToast('Medicine not found in item master.', 'error');
      return { success: false, reason: 'Item not found' };
    }

    // Filter available batches for this item and sort by expiry date ASCENDING (FEFO!)
    const itemBatches = currentBatches
      .filter((b) => b.itemId === itemId && b.qty > 0)
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    const totalAvailable = itemBatches.reduce((sum, b) => sum + b.qty, 0);
    if (totalAvailable < qtyToDispense) {
      showToast(`Insufficient stock! Available: ${totalAvailable} units across all batches.`, 'error');
      return { success: false, reason: 'Insufficient stock' };
    }

    let remainingQty = qtyToDispense;
    const allocatedBatches = [];
    const updatedBatches = currentBatches.map((b) => {
      if (b.itemId !== itemId || b.qty <= 0 || remainingQty <= 0) return b;

      const takeFromBatch = Math.min(b.qty, remainingQty);
      remainingQty -= takeFromBatch;
      allocatedBatches.push({
        batchNo: b.batchNo,
        expiryDate: b.expiryDate,
        deductedQty: takeFromBatch,
        rack: b.rack
      });

      return {
        ...b,
        qty: b.qty - takeFromBatch,
        status: b.qty - takeFromBatch === 0 ? 'Out of Stock' : b.status
      };
    });

    const newTotalStock = matchedItem.totalStock - qtyToDispense;
    const updatedItems = currentItems.map((i) =>
      i.id === itemId ? { ...i, totalStock: newTotalStock } : i
    );

    // Stock Movement Log
    const newMovement = {
      id: `MOV-${Date.now()}`,
      itemId,
      itemName: matchedItem.name,
      batchNo: allocatedBatches.map((a) => `${a.batchNo} (${a.deductedQty}u)`).join(', '),
      type: 'DISPENSE_OUT',
      qty: -qtyToDispense,
      balanceAfter: newTotalStock,
      reference: patientRef.rxId || patientRef.invoiceId || 'POS-COUNTER',
      patientName: patientRef.patientName || 'Counter Dispense',
      user: currentUser?.name || 'Lead Pharmacist',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    // Auto capture charge in billing if patient provided
    if (patientRef.patientId) {
      autoCaptureCharge({
        patientId: patientRef.patientId,
        admissionId: patientRef.admissionId || null,
        serviceType: 'Pharmacy',
        description: `${matchedItem.name} (FEFO Batches: ${allocatedBatches.map((a) => a.batchNo).join(', ')})`,
        qty: qtyToDispense,
        rate: matchedItem.unitPrice,
        sourceModule: 'Pharmacy'
      });
    }

    setData((prev) => ({
      ...prev,
      pharmacyBatches: updatedBatches,
      pharmacyItems: updatedItems,
      stockMovements: [newMovement, ...(prev.stockMovements || [])]
    }));

    logAudit('FEFO Medicine Dispensed', `Dispensed ${qtyToDispense} units of ${matchedItem.name} via FEFO from batches: ${allocatedBatches.map((a) => a.batchNo).join(', ')}`, 'Pharmacy / FEFO');
    showToast(`FEFO Dispense complete: ${allocatedBatches.map((a) => `${a.batchNo} (${a.deductedQty}u, Exp: ${a.expiryDate})`).join(', ')}`, 'success');
    return { success: true, allocatedBatches, totalDeducted: qtyToDispense, item: matchedItem };
  };

  // ─── 5. REAL-TIME BED BOARD & HOUSEKEEPING LIFECYCLE (Bed Board Problem) ───
  const dischargePatientAndMarkCleaning = (patientId, bedNo, dischargeNotes = {}) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toISOString().split('T')[0];

    setData((prev) => {
      // 1. Mark Bed as Cleaning automatically
      const updatedBeds = (prev.beds || []).map((bed) => {
        if (bed.bedNo === bedNo) {
          return {
            ...bed,
            status: 'cleaning',
            patientId: null,
            patientName: null,
            attendingDoctor: null,
            cleaningStartedAt: `${dateStr} ${timeStr}`,
            housekeeper: dischargeNotes.housekeeper || 'Housekeeping Crew Station 4'
          };
        }
        return bed;
      });

      // Synchronize legacy wards matrix
      const updatedWards = (prev.wards || []).map((w) => {
        const beds = (w.beds || []).map((b) => {
          if (b.bedNo === bedNo) {
            return {
              ...b,
              status: 'Cleaning',
              patientName: 'None',
              diagnosis: 'None'
            };
          }
          return b;
        });
        const occupiedCount = beds.filter((b) => b.status === 'Occupied' || b.status === 'occupied').length;
        return { ...w, beds, occupiedBeds: occupiedCount };
      });

      // 2. Mark Admission as Discharged
      const updatedAdmissions = (prev.admissions || []).map((adm) => {
        if (adm.patientId === patientId && adm.status === 'Admitted') {
          return {
            ...adm,
            status: 'Discharged',
            dischargeTime: `${dateStr} ${timeStr}`,
            dischargeNotes: dischargeNotes.summary || 'Cleared for discharge'
          };
        }
        return adm;
      });

      // 3. Update Patient Status
      const updatedPatients = (prev.patients || []).map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'Discharged',
            ward: 'N/A',
            bedNo: 'N/A'
          };
        }
        return p;
      });

      return {
        ...prev,
        beds: updatedBeds,
        wards: updatedWards,
        admissions: updatedAdmissions,
        patients: updatedPatients
      };
    });

    logAudit('Patient Discharged & Bed Clean Initiated', `Patient ${patientId} discharged from Bed ${bedNo}. Bed shifted to 'cleaning' status.`, 'IPD / Housekeeping');
    showToast(`Patient discharged! Bed ${bedNo} automatically shifted to CLEANING queue.`, 'success');
  };

  const markBedCleanedAndAvailable = (bedNo, housekeeperName = 'Housekeeping Staff') => {
    const timeStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setData((prev) => {
      const updatedBeds = (prev.beds || []).map((b) =>
        b.bedNo === bedNo
          ? {
              ...b,
              status: 'available',
              cleaningCompletedAt: timeStr,
              housekeeper: housekeeperName
            }
          : b
      );

      const updatedWards = (prev.wards || []).map((w) => {
        const beds = (w.beds || []).map((b) => {
          if (b.bedNo === bedNo) {
            return { ...b, status: 'Available', patientName: 'None' };
          }
          return b;
        });
        const occupiedCount = beds.filter((b) => b.status === 'Occupied' || b.status === 'occupied').length;
        return { ...w, beds, occupiedBeds: occupiedCount };
      });

      return {
        ...prev,
        beds: updatedBeds,
        wards: updatedWards
      };
    });
    logAudit('Bed Sanitized & Available', `Housekeeper ${housekeeperName} marked Bed ${bedNo} available for intake.`, 'IPD / Housekeeping');
    showToast(`Bed ${bedNo} sanitized & marked AVAILABLE for new admissions!`, 'success');
  };

  const transferPatientBed = (patientId, fromBedNo, toBedNo, reason = 'Specialist Bed Transfer') => {
    const timeStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const patient = (data.patients || []).find((p) => p.id === patientId);

    setData((prev) => {
      let fromWardName = '';
      let toWardName = '';

      const updatedBeds = (prev.beds || []).map((bed) => {
        if (bed.bedNo === fromBedNo) {
          fromWardName = bed.wardName;
          return {
            ...bed,
            status: 'cleaning',
            patientId: null,
            patientName: null,
            attendingDoctor: null,
            cleaningStartedAt: timeStr,
            housekeeper: 'Housekeeping Station'
          };
        }
        if (bed.bedNo === toBedNo) {
          toWardName = bed.wardName;
          return {
            ...bed,
            status: 'occupied',
            patientId,
            patientName: patient?.name || 'Inpatient',
            attendingDoctor: patient?.attendingDoctor || 'Attending Physician'
          };
        }
        return bed;
      });

      const updatedWards = (prev.wards || []).map((w) => {
        const beds = (w.beds || []).map((b) => {
          if (b.bedNo === fromBedNo) {
            return { ...b, status: 'Cleaning', patientName: 'None' };
          }
          if (b.bedNo === toBedNo) {
            return { ...b, status: 'Occupied', patientName: patient?.name || 'Inpatient' };
          }
          return b;
        });
        const occupiedCount = beds.filter((b) => b.status === 'Occupied' || b.status === 'occupied').length;
        return { ...w, beds, occupiedBeds: occupiedCount };
      });

      const updatedAdmissions = (prev.admissions || []).map((adm) => {
        if (adm.patientId === patientId && adm.status === 'Admitted') {
          return { ...adm, bedNo: toBedNo, wardName: toWardName };
        }
        return adm;
      });

      const newTransfer = {
        id: `TRF-${Date.now()}`,
        patientId,
        patientName: patient?.name || 'Inpatient',
        uhid: patient?.uhid || patient?.mrn,
        fromBed: fromBedNo,
        toBed: toBedNo,
        fromWard: fromWardName,
        toWard: toWardName,
        reason,
        transferredBy: currentUser?.name || 'Charge Nurse',
        timestamp: timeStr
      };

      // Update patient bed
      const updatedPatients = (prev.patients || []).map((p) =>
        p.id === patientId ? { ...p, bedNo: toBedNo } : p
      );

      return {
        ...prev,
        beds: updatedBeds,
        wards: updatedWards,
        admissions: updatedAdmissions,
        patients: updatedPatients,
        bedTransfers: [newTransfer, ...(prev.bedTransfers || [])]
      };
    });

    logAudit('Bed Transfer Executed', `Transferred patient ${patient?.name} from ${fromBedNo} to ${toBedNo} (${reason})`, 'IPD / Bed Management');
    showToast(`Patient transferred from ${fromBedNo} to ${toBedNo}! Source bed shifted to cleaning.`, 'success');
  };

  return (
    <HospitalContext.Provider
      value={{
        hospitalInfo: data.hospitalInfo,
        doctors: data.doctors,
        patients: data.patients,
        opdAppointments: data.opdAppointments,
        tokenQueue: data.tokenQueue,
        prescriptions: data.prescriptions,
        wards: data.wards,
        emergencyCases: data.emergencyCases,
        labOrders: data.labOrders,
        radiologyOrders: data.radiologyOrders,
        pharmacyMedicines: data.pharmacyMedicines,
        operationTheatres: data.operationTheatres,
        bloodBankStock: data.bloodBankStock,
        billingInvoices: data.billingInvoices,
        insuranceClaims: data.insuranceClaims,
        staffRoster: data.staffRoster,
        auditLogs: data.auditLogs,
        executiveStats: data.executiveStats,
        selectedPatient,
        setSelectedPatient,
        activeModal,
        openModal,
        closeModal,
        toast,
        showToast,
        theme,
        setTheme,
        toggleTheme,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        toggleMobileSidebar,
        commandPaletteOpen,
        setCommandPaletteOpen,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        activeNav,
        setActiveNav,
        addDoctor,
        addPatient,
        addAppointment,
        addPrescription,
        addEmergencyCase,
        updateBedStatus,
        dispenseMedicine,
        addInvoice,
        addPatientVital,
        addPatientMedicalEvent,
        deletePatientMedicalEvent,
        logAudit,
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        register,
        switchRole,
        canAccess,
        authenticatedPatient,
        setAuthenticatedPatient,
        patientOnboardingModalOpen,
        setPatientOnboardingModalOpen,
        loginAsPatient,
        loginAsStaff,
        registerNewPatient,
        bookDoctorConsultation,
        bookedSlots: data.bookedSlots || [],
        doctorSlots: data.doctorSlots || [],
        createDoctorSlot,
        updateDoctorSlot,
        deleteDoctorSlot,
        updateAppointmentStatus,
        sendAppointmentReminder,
        callQueueToken,
        charges: data.charges || [],
        servicePriceMaster: data.servicePriceMaster || [],
        servicePackages: data.servicePackages || [],
        billingAuditLogs: data.billingAuditLogs || [],
        addCharge,
        autoCaptureCharge,
        runDailyBedChargeJob,
        generateFinalBill,
        applyPackageToPatient,
        updateClaimStatus,
        addBillingAuditEntry,
        addServicePriceItem,
        updateServicePriceItem,
        createServicePackage,
        // Medication Safety
        drugsMaster: data.drugsMaster || [],
        drugInteractions: data.drugInteractions || [],
        validatePrescriptionSafety,
        // Laboratory Order-to-Result
        labTestMaster: data.labTestMaster || [],
        criticalLabAlerts: data.criticalLabAlerts || [],
        orderLabTest,
        advanceLabOrderStatus,
        acknowledgeCriticalAlert,
        uploadLabReportPdf,
        // Patient UHID, ABHA & Duplicate Detection
        checkPatientDuplicates,
        registerPatientWithUhid,
        // Pharmacy Batch Inventory & FEFO
        pharmacyItems: data.pharmacyItems || [],
        pharmacyBatches: data.pharmacyBatches || [],
        stockMovements: data.stockMovements || [],
        dispenseMedicineFEFO,
        // Real-Time IPD Bed Board & Housekeeping
        beds: data.beds || [],
        admissions: data.admissions || [],
        bedTransfers: data.bedTransfers || [],
        dischargePatientAndMarkCleaning,
        markBedCleanedAndAvailable,
        transferPatientBed
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
