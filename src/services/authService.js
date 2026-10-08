// Role Definitions and RBAC Permission Matrix according to Enterprise Hospital Specification
export const ROLES = {
  admin: {
    id: 'admin',
    name: 'Admin',
    emoji: '🛡️',
    label: '🛡️ Admin',
    tag: 'System Administrator',
    color: 'teal',
    badgeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
    description: 'Full Super Administrator access across clinical, financial, pharmacy, and staff systems',
    permissions: {
      dashboard: true,
      patients: true,
      appointment: true,
      billing: true,
      pharmacy: true,
      reports: true,
      users: true,
      // Extra clinical modules
      doctors: true,
      ipd: true,
      emergency: true,
      laboratory: true,
      finance: true,
      settings: true,
    }
  },
  doctor: {
    id: 'doctor',
    name: 'Doctor',
    emoji: '👨‍⚕️',
    label: '👨‍⚕️ Doctor',
    tag: 'Clinical Specialist',
    color: 'blue',
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    description: 'OPD consultations, inpatient diagnosis, surgical slots, and clinical reports',
    permissions: {
      dashboard: true,
      patients: true,
      appointment: true,
      billing: false,
      pharmacy: false,
      reports: true,
      users: false,
      // Extra clinical modules
      doctors: true,
      ipd: true,
      emergency: true,
      laboratory: true,
      finance: false,
      settings: false,
    }
  },
  nurse: {
    id: 'nurse',
    name: 'Nurse',
    emoji: '👩‍⚕️',
    label: '👩‍⚕️ Nurse',
    tag: 'Ward & Inpatient Care',
    color: 'indigo',
    badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    description: 'Patient admissions, vitals monitoring, scheduled appointments, and ward beds',
    permissions: {
      dashboard: true,
      patients: true,
      appointment: true,
      billing: false,
      pharmacy: false,
      reports: false,
      users: false,
      // Extra clinical modules
      doctors: false,
      ipd: true,
      emergency: true,
      laboratory: false,
      finance: false,
      settings: false,
    }
  },
  receptionist: {
    id: 'receptionist',
    name: 'Receptionist',
    emoji: '🧾',
    label: '🧾 Receptionist',
    tag: 'Front Desk & Cashier',
    color: 'amber',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    description: 'Patient registration, appointment tokens, OPD scheduling, live bed availability matrix, bed status management, and cashier billing',
    permissions: {
      dashboard: true,
      patients: true,
      appointment: true,
      billing: true,
      pharmacy: false,
      reports: false,
      users: false,
      // Extra clinical modules
      doctors: true,
      ipd: true,
      emergency: false,
      laboratory: false,
      finance: false,
      settings: false,
    }
  },
  pharmacist: {
    id: 'pharmacist',
    name: 'Pharmacist',
    emoji: '💊',
    label: '💊 Pharmacist',
    tag: 'Pharmacy & Inventory',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    description: 'Medicine dispensing counter, patient prescription history, batch inventory, and reports',
    permissions: {
      dashboard: true,
      patients: true,
      appointment: false,
      billing: false,
      pharmacy: true,
      reports: true,
      users: false,
      // Extra clinical modules
      doctors: false,
      ipd: false,
      emergency: false,
      laboratory: false,
      finance: false,
      settings: false,
    }
  },
  lab_technician: {
    id: 'lab_technician',
    name: 'Lab Technician',
    emoji: '🔬',
    label: '🔬 Lab Technician',
    tag: 'Diagnostics & Pathology',
    color: 'purple',
    badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    description: 'Patient diagnostics, blood investigations, lab report uploads, and clinical stats',
    permissions: {
      dashboard: true,
      patients: true,
      appointment: false,
      billing: false,
      pharmacy: false,
      reports: true,
      users: false,
      // Extra clinical modules
      doctors: false,
      ipd: false,
      emergency: false,
      laboratory: true,
      finance: false,
      settings: false,
    }
  }
};

// Normalized module key mapper
export const normalizeModuleKey = (moduleKey) => {
  if (!moduleKey) return 'dashboard';
  const key = moduleKey.toLowerCase();
  
  if (['dashboard'].includes(key)) return 'dashboard';
  if (['patients', 'patientmanagement', 'patientdirectory', 'patientregistration'].includes(key)) return 'patients';
  if (['appointment', 'appointments', 'opd'].includes(key)) return 'appointment';
  if (['billing', 'transaction', 'opdbilling', 'ipdbilling'].includes(key)) return 'billing';
  if (['pharmacy', 'dispensing', 'medicines'].includes(key)) return 'pharmacy';
  if (['reports', 'analytics', 'statistics'].includes(key)) return 'reports';
  if (['users', 'administration', 'staff', 'roles'].includes(key)) return 'users';
  
  // Clinical specifics
  if (['doctors'].includes(key)) return 'doctors';
  if (['bedroom', 'ipd'].includes(key)) return 'ipd';
  if (['emergency'].includes(key)) return 'emergency';
  if (['labreports', 'laboratory'].includes(key)) return 'laboratory';
  if (['finance'].includes(key)) return 'finance';
  if (['settings'].includes(key)) return 'settings';

  return key;
};

// Check if a specific role has access to a module
export const canAccessModule = (roleId, moduleKey) => {
  if (!roleId) return false;
  const role = ROLES[roleId];
  if (!role) return false;
  
  // Super admin can access everything
  if (roleId === 'admin') return true;

  const normalizedKey = normalizeModuleKey(moduleKey);
  return !!role.permissions[normalizedKey];
};

// Default Preconfigured Staff Users with Unique Role Passwords
export const DEFAULT_DEMO_USERS = [
  {
    id: 'user-admin',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@hospitalcare.org',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    roleTitle: 'Chief Medical Officer & Administrator',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    department: 'Hospital Administration',
  },
  {
    id: 'user-doctor',
    name: 'Dr. Ananya Mukherjee',
    email: 'doctor@hospitalcare.org',
    username: 'doctor',
    password: 'doctor123',
    role: 'doctor',
    roleTitle: 'Consultant Cardiologist',
    avatar: 'https://images.unsplash.com/photo-1594824813511-4b1308a0d244?w=150&auto=format&fit=crop&q=80',
    department: 'Cardiology Department',
  },
  {
    id: 'user-nurse',
    name: 'Sr. Reena Mathews',
    email: 'nurse@hospitalcare.org',
    username: 'nurse',
    password: 'nurse123',
    role: 'nurse',
    roleTitle: 'Inpatient Ward & ICU Head Nurse',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Inpatient Nursing Ward',
  },
  {
    id: 'user-receptionist',
    name: 'Priya Sharma',
    email: 'receptionist@hospitalcare.org',
    username: 'receptionist',
    password: 'receptionist123',
    role: 'receptionist',
    roleTitle: 'Chief Receptionist & Billing Cashier',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Front Desk & Admissions',
  },
  {
    id: 'user-pharmacist',
    name: 'Rajesh Varma',
    email: 'pharmacist@hospitalcare.org',
    username: 'pharmacist',
    password: 'pharmacist123',
    role: 'pharmacist',
    roleTitle: 'Superintendent Pharmacist',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    department: 'Central Hospital Pharmacy',
  },
  {
    id: 'user-lab',
    name: 'Vikram Rao',
    email: 'lab@hospitalcare.org',
    username: 'lab_technician',
    password: 'lab123',
    role: 'lab_technician',
    roleTitle: 'Senior Pathology Laboratory Technologist',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    department: 'Pathology & Diagnostic Labs',
  }
];

// Local Storage Keys
const AUTH_USER_KEY = 'medicore_auth_user';
const REGISTERED_USERS_KEY = 'medicore_registered_users';

// Load all users (defaults + registered)
export const getStoredUsers = () => {
  try {
    const custom = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    return [...DEFAULT_DEMO_USERS, ...custom];
  } catch {
    return DEFAULT_DEMO_USERS;
  }
};

// Register a new user (Restricted exclusively to System Administrator)
export const registerUser = ({ name, email, password, role, username }) => {
  const activeUser = getActiveSessionUser();
  if (activeUser && activeUser.role !== 'admin') {
    throw new Error('Unauthorized: Only the System Administrator has permission to create staff accounts and assign roles.');
  }

  const existing = getStoredUsers();
  const lowerEmail = email.toLowerCase().trim();
  const rawUsername = (username || lowerEmail.split('@')[0]).toLowerCase().trim();
  const found = existing.find(
    u => u.email.toLowerCase() === lowerEmail || (u.username && u.username.toLowerCase() === rawUsername)
  );
  if (found) {
    throw new Error('An account with this email or username already exists.');
  }

  const roleMeta = ROLES[role] || ROLES.admin;
  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: lowerEmail,
    username: rawUsername,
    password,
    role,
    roleTitle: roleMeta.tag,
    avatar: role === 'doctor'
      ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
      : role === 'nurse'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
      : role === 'receptionist'
      ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    department: roleMeta.name,
    registeredAt: new Date().toISOString()
  };

  try {
    const custom = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    custom.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(custom));
  } catch (err) {
    console.error('Error saving registered user', err);
  }

  return newUser;
};

// Authenticate user by email/username and password
export const authenticateUser = (identifier, password, selectedRole = null) => {
  const effectiveIdentifier = (identifier && identifier.trim()) ? identifier.trim() : (selectedRole || '');
  
  if (!effectiveIdentifier) {
    throw new Error('Please enter your staff email or username.');
  }
  if (!password) {
    throw new Error('Please enter your account password.');
  }

  const allUsers = getStoredUsers();
  const lower = effectiveIdentifier.toLowerCase().trim();
  const cleanPassword = password ? password.trim() : '';

  // Find user by email or username or role match
  const matched = allUsers.find(u => {
    const uEmail = u.email.toLowerCase();
    const uName = (u.username || '').toLowerCase();
    const uRole = (u.role || '').toLowerCase();
    return (
      uEmail === lower ||
      uName === lower ||
      uRole === lower ||
      uEmail.replace('@hospitalcare.org', '@medicore.org') === lower ||
      uEmail.replace('@medicore.org', '@hospitalcare.org') === lower ||
      (u.role === 'lab_technician' && (lower === 'lab' || lower === 'lab_technician'))
    );
  });

  if (!matched) {
    throw new Error('No staff account found with this username or email. Please check your credentials.');
  }

  // Password verification: matches user's set password, or role default password for demo accounts
  const isMatch = (
    matched.password === cleanPassword ||
    matched.password === password ||
    (matched.id === 'user-admin' && (cleanPassword === 'admin123' || cleanPassword === 'admin')) ||
    (matched.id === 'user-doctor' && (cleanPassword === 'doctor123' || cleanPassword === 'doctor')) ||
    (matched.id === 'user-nurse' && (cleanPassword === 'nurse123' || cleanPassword === 'nurse')) ||
    (matched.id === 'user-receptionist' && (cleanPassword === 'receptionist123' || cleanPassword === 'receptionist')) ||
    (matched.id === 'user-pharmacist' && (cleanPassword === 'pharmacist123' || cleanPassword === 'pharmacist')) ||
    (matched.id === 'user-lab' && (cleanPassword === 'lab123' || cleanPassword === 'labtech123' || cleanPassword === 'lab'))
  );

  if (!isMatch) {
    throw new Error('Incorrect password. Please verify your password and try again.');
  }

  // Verify that the chosen role matches the account's fixed assigned role
  if (selectedRole && matched.role !== selectedRole) {
    throw new Error(
      `This account is registered with the fixed role "${ROLES[matched.role]?.name || matched.role}". Please select the ${ROLES[matched.role]?.name || matched.role} role to sign in.`
    );
  }

  return matched;
};

// Active Session Management
export const getActiveSessionUser = () => {
  try {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    return null;
  }
  return null;
};

export const setActiveSessionUser = (user) => {
  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
  } else {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const clearActiveSession = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};
