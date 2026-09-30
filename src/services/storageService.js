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
      // Ensure all doctors from fallbackData are synchronized if fallback has more or newer doctors or outdated surgery count
      if (!parsed.doctors || parsed.doctors.length < (fallbackData.doctors?.length || 0) || parsed.doctors.some(d => (d.totalSurgeries || 0) >= 100)) {
        parsed.doctors = fallbackData.doctors;
        saveDatabase(parsed);
      }
      if (!parsed.hospitalInfo || parsed.hospitalInfo.name !== fallbackData.hospitalInfo?.name) {
        parsed.hospitalInfo = fallbackData.hospitalInfo || {
          name: 'MediCore ERP Super Specialty Hospital & Research Institute',
          tagline: 'Excellence in Tertiary Healthcare & Clinical Research',
          licenseNo: 'NABH-TERTIARY-2024-99821',
          taxId: 'GSTIN-36AAACH7829K1Z4',
          address: 'Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081',
          phone: '+91 (040) 6889-4000',
          emergencyHelpline: '+91 1066 / +91 (040) 6889-4911',
          email: 'desk@medicore-erp.org',
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
