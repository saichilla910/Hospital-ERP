import React, { useState } from 'react';
import { Volume2, Users, Stethoscope, Bell, CheckCircle2 } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const TokenQueue = () => {
  const { tokenQueue, showToast } = useHospital();
  const [currentQueue, setCurrentQueue] = useState(tokenQueue);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const callNextToken = (tokenNumber) => {
    setCurrentQueue((prev) =>
      prev.map((item) => {
        if (item.token === tokenNumber) {
          return { ...item, status: 'Calling' };
        }
        if (item.status === 'Calling') {
          return { ...item, status: 'In-Room' };
        }
        return item;
      })
    );
    showToast(`Token ${tokenNumber} called to Consultation Room! (Announcement broadcasted)`, 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Control */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-main">
            OPD Digital Token Calling & Queue Management
          </h2>
          <p className="text-xs text-text-muted">
            Real-time visual queue monitor and automated patient token calling.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            className={`btn ${soundEnabled ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            <Volume2 size={15} /> Sound Chime: {soundEnabled ? 'ON' : 'MUTED'}
          </button>
        </div>
      </div>

      {/* Waiting Room Display Card */}
      <div className="glass-card bg-bg-surface border border-border-subtle rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3.5 mb-5">
          <div className="flex items-center gap-2">
            <span className="pulse-indicator green" />
            <h3 className="text-[1.05rem] font-bold text-text-main tracking-wide">
              WAITING LOUNGE DISPLAY MONITOR • BLOCK A & B
            </h3>
          </div>
          <span className="mono text-xs text-text-muted">
            Live Sync • Auto-Refreshed
          </span>
        </div>

        {/* Cards of Calling Tokens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentQueue.map((item, idx) => {
            const isCalling = item.status === 'Calling';
            return (
              <div
                key={idx}
                className={`rounded-xl p-4.5 md:p-5 flex flex-col justify-between h-full gap-3 transition-all ${
                  isCalling
                    ? 'bg-teal-500/10 border-2 border-teal-500 shadow-md'
                    : 'bg-bg-surface-elevated border border-border-subtle'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`mono text-2xl font-bold ${isCalling ? 'text-teal-600' : 'text-text-main'}`}>
                    {item.token}
                  </span>
                  <Badge variant={isCalling ? 'teal' : item.status === 'In-Room' ? 'emerald' : 'indigo'} dot={isCalling}>
                    {item.status}
                  </Badge>
                </div>

                <div>
                  <div className="text-base font-bold text-text-main">{item.patient}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {item.doctor} ({item.dept})
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-border-subtle">
                  <span className="text-[0.85rem] font-bold text-teal-600">
                    {item.room}
                  </span>
                  {item.status !== 'Calling' && item.status !== 'In-Room' && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => callNextToken(item.token)}
                    >
                      <Bell size={12} /> Call Token
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
