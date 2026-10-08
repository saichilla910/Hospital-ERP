// MediCore JSON Database Storage & Persistent Slots Service

const STORAGE_KEY = 'medicore_hospital_erp_db_json';

// Standard time templates for morning and evening clinic slots
export const DEFAULT_MORNING_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM'
];

export const DEFAULT_EVENING_SLOTS = [
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM'
];

export const loadDatabase = (fallbackData) => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      // Always synchronize doctor dataset (names, specialties, photos, departments) from fallbackData
      if (parsed.doctors && fallbackData.doctors) {
        let hasDoctorUpdate = false;
        parsed.doctors = fallbackData.doctors.map((fallbackDoc) => {
          const existingDoc = parsed.doctors.find((d) => d.id === fallbackDoc.id);
          if (existingDoc) {
            return {
              ...existingDoc,
              name: fallbackDoc.name,
              photo: fallbackDoc.photo,
              department: fallbackDoc.department,
              specialty: fallbackDoc.specialty
            };
          }
          return fallbackDoc;
        });
        hasDoctorUpdate = true;

        if (parsed.patients && fallbackData.patients) {
          parsed.patients = parsed.patients.map((pat) => {
            const fallbackPat = fallbackData.patients.find((f) => f.id === pat.id);
            if (fallbackPat && fallbackPat.photo && pat.photo !== fallbackPat.photo) {
              return { ...pat, photo: fallbackPat.photo };
            }
            return pat;
          });
        }

        if (hasDoctorUpdate) {
          saveDatabase(parsed);
        }
      } else if (!parsed.doctors) {
        parsed.doctors = fallbackData.doctors;
        saveDatabase(parsed);
      }
      if (!parsed.hospitalInfo || parsed.hospitalInfo.name !== fallbackData.hospitalInfo?.name) {
        parsed.hospitalInfo = fallbackData.hospitalInfo || {
          name: 'HospitalCare Super Specialty Hospital & Research Institute',
          tagline: 'Comprehensive Clinical Care & Hospital Resource Management',
          licenseNo: 'NABH-TERTIARY-2024-99821',
          taxId: 'GSTIN-36AAACH7829K1Z4',
          address: 'Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081',
          phone: '+91 (040) 6889-4000',
          emergencyHelpline: '+91 1066 / +91 (040) 6889-4911',
          email: 'contact@hospitalcare.org',
          activeShift: 'Morning Shift (07:00 - 15:30)',
          currentShiftSupervisor: 'Dr. Arvind Swaminathan, MD (Emergency Medicine)'
        };
        saveDatabase(parsed);
      }
      // Ensure bookedSlots array exists
      if (!parsed.bookedSlots) {
        parsed.bookedSlots = [
          {
            slotId: 'SLOT-101',
            doctorId: 'DOC-102',
            date: new Date().toISOString().split('T')[0],
            time: '10:30 AM',
            patientId: 'PAT-2026-8801',
            patientName: 'Rameshwar Prasad Sharma',
            token: 'OPD-03',
            type: 'In-Person OPD Clinic',
            status: 'Confirmed'
          },
          {
            slotId: 'SLOT-102',
            doctorId: 'DOC-104',
            date: new Date().toISOString().split('T')[0],
            time: '09:30 AM',
            patientId: 'PAT-2026-8802',
            patientName: 'Sneha Jennifer Thomas',
            token: 'OPD-01',
            type: 'In-Person OPD Clinic',
            status: 'Confirmed'
          }
        ];
        saveDatabase(parsed);
      }
      // Ensure charges, servicePriceMaster, servicePackages, and billingAuditLogs exist
      if (!parsed.charges && fallbackData.charges) {
        parsed.charges = fallbackData.charges;
        saveDatabase(parsed);
      }
      if (!parsed.servicePriceMaster && fallbackData.servicePriceMaster) {
        parsed.servicePriceMaster = fallbackData.servicePriceMaster;
        saveDatabase(parsed);
      }
      if (!parsed.servicePackages && fallbackData.servicePackages) {
        parsed.servicePackages = fallbackData.servicePackages;
        saveDatabase(parsed);
      }
      if (!parsed.billingAuditLogs && fallbackData.billingAuditLogs) {
        parsed.billingAuditLogs = fallbackData.billingAuditLogs;
        saveDatabase(parsed);
      }
      if (!parsed.drugsMaster || parsed.drugsMaster.length < fallbackData.drugsMaster?.length) {
        parsed.drugsMaster = fallbackData.drugsMaster;
        saveDatabase(parsed);
      }
      if (!parsed.drugInteractions || parsed.drugInteractions.length < fallbackData.drugInteractions?.length) {
        parsed.drugInteractions = fallbackData.drugInteractions;
        saveDatabase(parsed);
      }
      if (!parsed.labTestMaster || parsed.labTestMaster.length < fallbackData.labTestMaster?.length) {
        parsed.labTestMaster = fallbackData.labTestMaster;
        saveDatabase(parsed);
      }
      if (!parsed.criticalLabAlerts || parsed.criticalLabAlerts.length < fallbackData.criticalLabAlerts?.length) {
        parsed.criticalLabAlerts = fallbackData.criticalLabAlerts;
        saveDatabase(parsed);
      }
      if (!parsed.labOrders || parsed.labOrders.length < fallbackData.labOrders?.length || !parsed.labOrders[0]?.timeline) {
        parsed.labOrders = fallbackData.labOrders;
        saveDatabase(parsed);
      }
      if (!parsed.pharmacyItems || parsed.pharmacyItems.length < fallbackData.pharmacyItems?.length) {
        parsed.pharmacyItems = fallbackData.pharmacyItems;
        saveDatabase(parsed);
      }
      if (!parsed.pharmacyBatches || parsed.pharmacyBatches.length < fallbackData.pharmacyBatches?.length) {
        parsed.pharmacyBatches = fallbackData.pharmacyBatches;
        saveDatabase(parsed);
      }
      if (!parsed.stockMovements || parsed.stockMovements.length < fallbackData.stockMovements?.length) {
        parsed.stockMovements = fallbackData.stockMovements;
        saveDatabase(parsed);
      }
      if (!parsed.beds || parsed.beds.length < fallbackData.beds?.length) {
        parsed.beds = fallbackData.beds;
        saveDatabase(parsed);
      }
      if (!parsed.admissions || parsed.admissions.length < fallbackData.admissions?.length) {
        parsed.admissions = fallbackData.admissions;
        saveDatabase(parsed);
      }
      if (!parsed.bedTransfers || parsed.bedTransfers.length < fallbackData.bedTransfers?.length) {
        parsed.bedTransfers = fallbackData.bedTransfers;
        saveDatabase(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Could not load persistent JSON data, using initial data:', err);
  }

  // Fallback initial database setup
  const initialDb = {
    ...fallbackData,
    bookedSlots: [
      {
        slotId: 'SLOT-101',
        doctorId: 'DOC-102',
        date: new Date().toISOString().split('T')[0],
        time: '10:30 AM',
        patientId: 'PAT-2026-8801',
        patientName: 'Rameshwar Prasad Sharma',
        token: 'OPD-03',
        type: 'In-Person OPD Clinic',
        status: 'Confirmed'
      },
      {
        slotId: 'SLOT-102',
        doctorId: 'DOC-104',
        date: new Date().toISOString().split('T')[0],
        time: '09:30 AM',
        patientId: 'PAT-2026-8802',
        patientName: 'Sneha Jennifer Thomas',
        token: 'OPD-01',
        type: 'In-Person OPD Clinic',
        status: 'Confirmed'
      }
    ]
  };

  saveDatabase(initialDb);
  return initialDb;
};

export const saveDatabase = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to JSON storage:', err);
  }
};

/**
 * Returns structured slots list for a given doctor and date
 */
export const getDoctorSlotsForDate = (doctor, dateString, bookedSlots = []) => {
  const morningList = DEFAULT_MORNING_SLOTS.map((timeStr) => {
    const matchedBooking = bookedSlots.find(
      (b) => b.doctorId === doctor.id && b.date === dateString && b.time.toLowerCase() === timeStr.toLowerCase()
    );
    return {
      id: `${doctor.id}-${dateString}-${timeStr.replace(/[^a-zA-Z0-9]/g, '')}`,
      time: timeStr,
      period: 'Morning',
      isBooked: Boolean(matchedBooking),
      booking: matchedBooking || null
    };
  });

  const eveningList = DEFAULT_EVENING_SLOTS.map((timeStr) => {
    const matchedBooking = bookedSlots.find(
      (b) => b.doctorId === doctor.id && b.date === dateString && b.time.toLowerCase() === timeStr.toLowerCase()
    );
    return {
      id: `${doctor.id}-${dateString}-${timeStr.replace(/[^a-zA-Z0-9]/g, '')}`,
      time: timeStr,
      period: 'Evening',
      isBooked: Boolean(matchedBooking),
      booking: matchedBooking || null
    };
  });

  return {
    morningSlots: morningList,
    eveningSlots: eveningList,
    totalAvailable: morningList.filter((s) => !s.isBooked).length + eveningList.filter((s) => !s.isBooked).length,
    totalBooked: morningList.filter((s) => s.isBooked).length + eveningList.filter((s) => s.isBooked).length
  };
};
