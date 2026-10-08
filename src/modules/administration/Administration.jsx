import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Users as UsersModule } from './Users';
import { Roles } from './Roles';
import { Permissions } from './Permissions';
import { AuditLogs } from './AuditLogs';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { Users, Key, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { AccessDenied } from '../../components/common/AccessDenied';

export const Administration = () => {
  const { activeNav, setActiveNav, currentUser } = useHospital();
  const currentSub = activeNav.subModule || 'users';

  if (currentUser?.role !== 'admin') {
    return (
      <AccessDenied
        role={currentUser?.role}
        moduleName="Administration & Staff Management"
        onGoToDashboard={() => setActiveNav({ module: 'dashboard', subModule: null })}
      />
    );
  }

  const tabs = [
    { key: 'users', label: 'Staff Accounts', icon: Users },
    { key: 'roles', label: 'Staff Roles', icon: Key },
    { key: 'permissions', label: 'Role Permissions', icon: ShieldCheck },
    { key: 'auditLogs', label: 'Activity Logs', icon: FileSpreadsheet }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'users':
        return <UsersModule />;
      case 'roles':
        return <Roles />;
      case 'permissions':
        return <Permissions />;
      case 'auditLogs':
        return <AuditLogs />;
      default:
        return <UsersModule />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'administration', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
