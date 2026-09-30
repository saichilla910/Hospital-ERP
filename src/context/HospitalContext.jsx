import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_HOSPITAL_DATA } from '../data/mockHospitalData';
import { loadDatabase, saveDatabase } from '../services/storageService';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [data, setData] = useState(() => loadDatabase(INITIAL_HOSPITAL_DATA));
  const [selectedPatient, setSelectedPatient] = useState(() => {
    const loaded = loadDatabase(INITIAL_HOSPITAL_DATA);
    return loaded.patients[0] || INITIAL_HOSPITAL_DATA.patients[0];
  });
  const [activeModal, setActiveModal] = useState(null); // { type, data }
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState({ module: 'dashboard', subModule: null });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('medicore_theme') || 'light';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auto-sync entire data object to JSON persistent storage
  useEffect(() => {
    saveDatabase(data);
  }, [data]);

  // Patient Authentication & Role State
  const [userRole, setUserRole] = useState('staff'); // 'staff' | 'patient'
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

  const loginAsPatient = (patient) => {
    setUserRole('patient');
    setAuthenticatedPatient(patient);
    setSelectedPatient(patient);
    setActiveNav({ module: 'patientManagement', subModule: 'profile' });
    showToast(`Logged in to Patient Portal as ${patient.name} (${patient.mrn})`, 'success');
  };

  const loginAsStaff = () => {
    setUserRole('staff');
    setAuthenticatedPatient(null);
    showToast('Switched to Doctor / Hospital Administration Mode', 'info');
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
      photo: patientInput.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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
      photo: newDoctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
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

      return {
        ...prev,
        patients: updatedPatients,
        opdAppointments: [newApt, ...prev.opdAppointments],
        bookedSlots: [newSlotBooking, ...(prev.bookedSlots || [])],
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

  const updateBedStatus = (wardId, bedNo, newStatus, patientName = 'None', diagnosis = 'None') => {
    setData((prev) => ({
      ...prev,
      wards: prev.wards.map((ward) => {
        if (ward.id === wardId) {
          const updatedBeds = ward.beds.map((bed) => {
            if (bed.bedNo === bedNo) {
              return {
                ...bed,
                status: newStatus,
                patientName: newStatus === 'Occupied' ? patientName : 'None',
                diagnosis: newStatus === 'Occupied' ? diagnosis : 'None'
              };
            }
            return bed;
          });
          const occupiedCount = updatedBeds.filter((b) => b.status === 'Occupied').length;
          return { ...ward, beds: updatedBeds, occupiedBeds: occupiedCount };
        }
        return ward;
      })
    }));
    logAudit('Bed Status Changed', `${wardId} / Bed ${bedNo} -> ${newStatus}`, 'IPD Bed Management');
    showToast(`Bed ${bedNo} status updated to ${newStatus}.`, 'info');
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
        authenticatedPatient,
        setAuthenticatedPatient,
        patientOnboardingModalOpen,
        setPatientOnboardingModalOpen,
        loginAsPatient,
        loginAsStaff,
        registerNewPatient,
        bookDoctorConsultation,
        bookedSlots: data.bookedSlots || []
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
