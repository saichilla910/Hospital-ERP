import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { NotificationDrawer } from './components/layout/NotificationDrawer';

// Global Modals
import { PrescriptionModal } from './components/common/PrescriptionModal';
import { LabReportModal } from './components/common/LabReportModal';
import { RadiologyViewerModal } from './components/common/RadiologyViewerModal';
import { InvoiceModal } from './components/common/InvoiceModal';
import { PatientOnboardingModal } from './components/common/PatientOnboardingModal';
import { DoctorProfileModal } from './components/common/DoctorProfileModal';
import { DoctorSlotsModal } from './components/common/DoctorSlotsModal';
import { AddDoctorModal } from './components/common/AddDoctorModal';

// Module Components
import { Dashboard } from './modules/dashboard/Dashboard';
import { PatientManagement } from './modules/patientManagement/PatientManagement';
import { OPD } from './modules/opd/OPD';
import { IPD } from './modules/ipd/IPD';
import { Emergency } from './modules/emergency/Emergency';
import { EMR } from './modules/emr/EMR';
import { Laboratory } from './modules/laboratory/Laboratory';
import { Radiology } from './modules/radiology/Radiology';
import { Pharmacy } from './modules/pharmacy/Pharmacy';
import { Billing } from './modules/billing/Billing';
import { OperationTheatre } from './modules/operationTheatre/OperationTheatre';
import { BloodBank } from './modules/bloodBank/BloodBank';
import { Inventory } from './modules/inventory/Inventory';
import { HRPayroll } from './modules/hrPayroll/HRPayroll';
import { Finance } from './modules/finance/Finance';
import { Reports } from './modules/reports/Reports';
import { Administration } from './modules/administration/Administration';
import { Settings } from './modules/settings/Settings';
import { Doctors } from './modules/doctors/Doctors';

const MainLayout = () => {
  const { activeNav, activeModal, closeModal, toast } = useHospital();

  const renderActiveModule = () => {
    switch (activeNav.module) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
      case 'patientManagement':
        return <PatientManagement />;
      case 'doctors':
        return <Doctors />;
      case 'appointment':
      case 'opd':
        return <OPD />;
      case 'bedroom':
      case 'ipd':
        return <IPD />;
      case 'labReports':
      case 'laboratory':
        return <Laboratory />;
      case 'transaction':
      case 'billing':
        return <Billing />;
      case 'emergency':
        return <Emergency />;
      case 'emr':
        return <EMR />;
      case 'radiology':
        return <Radiology />;
      case 'pharmacy':
        return <Pharmacy />;
      case 'operationTheatre':
        return <OperationTheatre />;
      case 'bloodBank':
        return <BloodBank />;
      case 'inventory':
        return <Inventory />;
      case 'hrPayroll':
        return <HRPayroll />;
      case 'finance':
        return <Finance />;
      case 'reports':
        return <Reports />;
      case 'administration':
        return <Administration />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-app">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <Topbar />

        {/* Scrollable Work Area with Consistent Responsive Page Layout */}
        <main className="main-container flex-1 overflow-y-auto w-full px-4 sm:px-6 md:px-8 2xl:px-8 py-6 pb-20">
          <div className="w-full max-w-[1440px] mx-auto min-w-0">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Universal Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Notifications Drawer */}
      <NotificationDrawer />

      {/* Global Interactive Clinical Modals */}
      <PrescriptionModal
        isOpen={activeModal?.type === 'prescription'}
        onClose={closeModal}
        prescription={activeModal?.data}
      />
      <LabReportModal
        isOpen={activeModal?.type === 'lab'}
        onClose={closeModal}
        labReport={activeModal?.data}
      />
      <RadiologyViewerModal
        isOpen={activeModal?.type === 'radiology'}
        onClose={closeModal}
        radiologyOrder={activeModal?.data}
      />
      <InvoiceModal
        isOpen={activeModal?.type === 'invoice'}
        onClose={closeModal}
        invoice={activeModal?.data}
      />
      <DoctorProfileModal
        isOpen={activeModal?.type === 'doctorProfile' || activeModal?.type === 'doctorConsult'}
        onClose={closeModal}
        doctor={activeModal?.data}
      />
      <DoctorSlotsModal
        isOpen={activeModal?.type === 'doctorSlots'}
        onClose={closeModal}
        doctor={activeModal?.data}
      />
      <AddDoctorModal
        isOpen={activeModal?.type === 'addDoctor'}
        onClose={closeModal}
      />

      {/* Patient Portal Onboarding & Registration Modal */}
      <PatientOnboardingModal />

      {/* Global Toast Notification — Premium */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[2000] flex items-center gap-3 animate-[slideUp_0.22s_cubic-bezier(0.16,1,0.3,1)]"
          style={{
            background: toast.type === 'error'
              ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
              : toast.type === 'info'
              ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
              : 'linear-gradient(135deg, #0d9488 0%, #0a7268 100%)',
            color: '#fff',
            padding: '13px 20px',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)',
            fontSize: '0.875rem',
            fontWeight: 600,
            maxWidth: '380px',
            backdropFilter: 'blur(12px)',
            fontFamily: 'var(--font-main)',
          }}
        >
          {/* Accent dot */}
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: 'rgba(255,255,255,0.7)' }}
          />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainLayout />
    </HospitalProvider>
  );
}
