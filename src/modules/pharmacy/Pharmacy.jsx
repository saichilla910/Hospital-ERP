import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Medicines } from './Medicines';
import { Dispensing } from './Dispensing';
import { Inventory } from './Inventory';
import { Purchase } from './Purchase';
import { Expiry } from './Expiry';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { Pill, ShoppingCart, Boxes, ShoppingBag, AlertTriangle } from 'lucide-react';

export const Pharmacy = () => {
  const { activeNav, setActiveNav } = useHospital();
  const currentSub = activeNav.subModule || 'dispensing';

  const tabs = [
    { key: 'dispensing', label: 'Dispense Medicines', icon: ShoppingCart },
    { key: 'medicines', label: 'Medicine Catalog', icon: Pill },
    { key: 'inventory', label: 'Stock Inventory', icon: Boxes },
    { key: 'purchase', label: 'Purchase Stock', icon: ShoppingBag },
    { key: 'expiry', label: 'Expiry Alerts', icon: AlertTriangle }
  ];

  const renderSubModule = () => {
    switch (currentSub) {
      case 'dispensing':
        return <Dispensing />;
      case 'medicines':
        return <Medicines />;
      case 'inventory':
        return <Inventory />;
      case 'purchase':
        return <Purchase />;
      case 'expiry':
        return <Expiry />;
      default:
        return <Dispensing />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sub Module Tabs Bar */}
      <SubNavTabs
        tabs={tabs}
        activeKey={currentSub}
        onSelectTab={(subKey) => setActiveNav({ module: 'pharmacy', subModule: subKey })}
      />

      {/* Sub Module Render */}
      {renderSubModule()}
    </div>
  );
};
