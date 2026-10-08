/**
 * Route & Navigation utility for HospitalCare ERP
 * Maps between { module, subModule } internal state and readable URL paths
 */

export const moduleToPathMap = {
  dashboard: '/dashboard',
  patients: '/patients',
  patientManagement: '/patients',
  doctors: '/doctors',
  appointment: '/opd',
  opd: '/opd',
  bedroom: '/ipd',
  ipd: '/ipd',
  emergency: '/emergency',
  emr: '/emr',
  labReports: '/laboratory',
  laboratory: '/laboratory',
  radiology: '/radiology',
  pharmacy: '/pharmacy',
  transaction: '/billing',
  billing: '/billing',
  operationTheatre: '/operation-theatre',
  bloodBank: '/blood-bank',
  inventory: '/inventory',
  hrPayroll: '/hr-payroll',
  finance: '/finance',
  reports: '/reports',
  administration: '/administration',
  users: '/administration',
  settings: '/settings',
};

export const pathToModuleMap = {
  dashboard: 'dashboard',
  patients: 'patientManagement',
  patientManagement: 'patientManagement',
  doctors: 'doctors',
  opd: 'opd',
  appointment: 'opd',
  ipd: 'ipd',
  bedroom: 'ipd',
  emergency: 'emergency',
  emr: 'emr',
  laboratory: 'laboratory',
  labReports: 'laboratory',
  radiology: 'radiology',
  pharmacy: 'pharmacy',
  billing: 'billing',
  transaction: 'billing',
  'operation-theatre': 'operationTheatre',
  operationTheatre: 'operationTheatre',
  'blood-bank': 'bloodBank',
  bloodBank: 'bloodBank',
  inventory: 'inventory',
  'hr-payroll': 'hrPayroll',
  hrPayroll: 'hrPayroll',
  finance: 'finance',
  reports: 'reports',
  administration: 'administration',
  users: 'administration',
  settings: 'settings',
};

/**
 * Converts a navigation object { module, subModule } into a URL pathname
 */
export function getPathFromNav(nav) {
  if (!nav || !nav.module) return '/dashboard';
  const basePath = moduleToPathMap[nav.module] || '/dashboard';
  if (nav.subModule) {
    return `${basePath}/${nav.subModule}`;
  }
  return basePath;
}

/**
 * Converts a URL pathname into a navigation object { module, subModule }
 */
export function getNavFromPath(pathname) {
  if (!pathname || pathname === '/') {
    return { module: 'dashboard', subModule: null };
  }
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) {
    return { module: 'dashboard', subModule: null };
  }

  const mainPart = parts[0];
  const subPart = parts[1] || null;

  const targetModule = pathToModuleMap[mainPart];
  if (targetModule) {
    return {
      module: targetModule,
      subModule: subPart,
    };
  }

  return { module: 'dashboard', subModule: null };
}
