import React from 'react';
import { X, AlertTriangle, Activity, Bell, FileText, Clock } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const NotificationDrawer = () => {
  const { notificationDrawerOpen, setNotificationDrawerOpen, openModal, labOrders } = useHospital();

  if (!notificationDrawerOpen) return null;

  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'ESI Level 1 Resuscitation Trauma Case',
      desc: 'Polytrauma patient in Trauma Bay 1. Massive transfusion protocol active.',
      time: '12 min ago',
      icon: AlertTriangle,
      color: 'rose'
    },
    {
      id: 2,
      type: 'lab',
      title: 'Critical Lab Value Alert: Troponin I',
      desc: 'Patient Rameshwar Sharma lab panel verified by Dr. Neha Kulkarni.',
      time: '28 min ago',
      icon: Activity,
      color: 'amber'
    },
    {
      id: 3,
      type: 'ot',
      title: 'Modular OT 1 Surgery Commenced',
      desc: 'CABG x 3 in progress by Dr. Ananya Mukherjee. Pre-op checklist verified.',
      time: '45 min ago',
      icon: FileText,
      color: 'teal'
    },
    {
      id: 4,
      type: 'blood',
      title: 'Blood Bank: O-Negative Low Reserve',
      desc: 'Current stock is 5 units. Emergency donor drive requisition triggered.',
      time: '1 hr ago',
      icon: AlertTriangle,
      color: 'rose'
    }
  ];

  return (
    <div className="fixed top-0 right-0 bottom-0 w-[380px] bg-bg-surface border-l border-border-subtle shadow-2xl z-[1050] flex flex-col animate-[slideLeft_0.2s_cubic-bezier(0.16,1,0.3,1)]">
      {/* Header */}
      <div className="h-[68px] px-5 border-b border-border-subtle flex items-center justify-between bg-bg-surface-elevated shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-teal-600" />
          <h3 className="text-base font-bold text-text-main">Clinical & System Feeds</h3>
        </div>
        <button
          onClick={() => setNotificationDrawerOpen(false)}
          className="btn-icon w-8 h-8 rounded-md"
        >
          <X size={16} />
        </button>
      </div>

      {/* List */}
      <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
        {alerts.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="glass-card-interactive bg-bg-surface-elevated border border-border-subtle rounded-md p-3.5 flex gap-3 cursor-pointer"
              onClick={() => {
                if (item.type === 'lab') {
                  openModal('lab', labOrders[0]);
                }
              }}
            >
              <div
                className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
                  item.color === 'rose'
                    ? 'bg-rose-50 text-rose-600'
                    : item.color === 'amber'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-teal-50 text-teal-600'
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="text-[0.85rem] font-bold text-text-main">{item.title}</div>
                <p className="text-[0.775rem] text-text-muted mt-[3px]">{item.desc}</p>
                <div className="flex items-center gap-1 text-[0.7rem] text-text-dim mt-2">
                  <Clock size={11} /> {item.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-subtle bg-bg-surface-elevated text-center">
        <button className="btn btn-secondary btn-sm w-full rounded-md" onClick={() => setNotificationDrawerOpen(false)}>
          Mark All Feeds Acknowledged
        </button>
      </div>
    </div>
  );
};
