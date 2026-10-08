import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, Monitor, RefreshCw, Play, Pause, Maximize2, Minimize2, Stethoscope, Users, CheckCircle2, Clock } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';
import { playHospitalChime, announceTokenVoice } from '../../utils/audioNotification';

export const TokenQueue = () => {
  const { tokenQueue, doctors, opdAppointments, callQueueToken, showToast } = useHospital();
  
  const [currentQueue, setCurrentQueue] = useState(tokenQueue);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTvMode, setIsTvMode] = useState(false);
  const [isAutoPolling, setIsAutoPolling] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState(new Date().toLocaleTimeString());

  // Live Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state with context tokenQueue
  useEffect(() => {
    setCurrentQueue(tokenQueue);
  }, [tokenQueue]);

  // Polling simulation: refreshes queue status periodically
  useEffect(() => {
    if (!isAutoPolling) return;
    const interval = setInterval(() => {
      // Periodic check or polling state refresh
      setCurrentQueue((prev) => [...prev]);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPolling]);

  const handleCallToken = (tokenItem) => {
    if (soundEnabled) playHospitalChime();
    if (voiceEnabled) announceTokenVoice(tokenItem.token, tokenItem.patient, tokenItem.room, tokenItem.doctor);
    
    callQueueToken(tokenItem.token);
  };

  const toggleFullscreenTvMode = () => {
    setIsTvMode(!isTvMode);
    if (!isTvMode) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Group active tokens by doctor / room
  const doctorRoomMap = (doctors || []).map((doc) => {
    const activeTokens = currentQueue.filter((q) => q.doctor === doc.name || q.dept === doc.department);
    const nowServing = activeTokens.find((q) => q.status === 'Calling' || q.status === 'In-Room');
    const nextInQueue = activeTokens.filter((q) => q.status === 'Waiting');

    return {
      doctor: doc,
      nowServing: nowServing || null,
      nextTokens: nextInQueue,
      waitingCount: nextInQueue.length
    };
  });

  return (
    <div className={`flex flex-col gap-6 transition-all ${isTvMode ? 'fixed inset-0 z-[5000] bg-[#090d16] text-white p-6 md:p-10 overflow-y-auto font-sans' : ''}`}>
      {/* Top Controls Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className={`text-2xl font-black ${isTvMode ? 'text-white tracking-wider text-3xl' : 'text-text-main'}`}>
              OPD DIGITAL TOKEN & QUEUE TV DISPLAY
            </h2>
          </div>
          <p className={`text-xs ${isTvMode ? 'text-slate-400 text-sm mt-1' : 'text-text-muted mt-0.5'}`}>
            Real-time Reception Lounge Monitor • Live Sync WebSocket / Polling Active • {currentTimeStr}
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            className={`btn ${isAutoPolling ? 'btn-primary' : 'btn-secondary'} btn-sm text-xs flex items-center gap-1.5`}
            onClick={() => setIsAutoPolling(!isAutoPolling)}
          >
            {isAutoPolling ? <Pause size={13} /> : <Play size={13} />}
            Polling: {isAutoPolling ? 'LIVE SYNC (5s)' : 'PAUSED'}
          </button>

          <button
            className={`btn ${soundEnabled ? 'btn-primary' : 'btn-secondary'} btn-sm text-xs flex items-center gap-1.5`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />} Chime: {soundEnabled ? 'ON' : 'MUTED'}
          </button>

          <button
            className={`btn ${voiceEnabled ? 'btn-primary' : 'btn-secondary'} btn-sm text-xs flex items-center gap-1.5`}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            Voice Callout: {voiceEnabled ? 'ACTIVE' : 'OFF'}
          </button>

          <button
            className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10"
            onClick={toggleFullscreenTvMode}
          >
            {isTvMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {isTvMode ? 'Exit TV Mode' : 'Fullscreen TV Mode'}
          </button>
        </div>
      </div>

      {/* Primary TV Room Grid (Now Serving Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {doctorRoomMap.map(({ doctor, nowServing, nextTokens, waitingCount }) => {
          const isCalling = nowServing?.status === 'Calling';

          return (
            <div
              key={doctor.id}
              className={`rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 ${
                isTvMode
                  ? 'bg-slate-900/90 border-2 border-slate-800 shadow-xl'
                  : 'glass-card bg-bg-surface border border-border-subtle shadow-sm'
              } ${isCalling ? 'ring-4 ring-teal-500/60 border-teal-500 bg-teal-950/20' : ''}`}
            >
              {/* Doctor & Room Top Tag */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    isTvMode ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200'
                  }`}>
                    {doctor.room}
                  </span>
                  <span className={`text-[0.75rem] font-bold ${isTvMode ? 'text-slate-400' : 'text-text-muted'}`}>
                    {waitingCount} Waiting
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shrink-0"
                  />
                  <div>
                    <h3 className={`font-extrabold text-base leading-tight ${isTvMode ? 'text-white' : 'text-text-main'}`}>
                      {doctor.name}
                    </h3>
                    <p className={`text-xs ${isTvMode ? 'text-teal-400' : 'text-text-muted'}`}>{doctor.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Now Serving Highlight Display */}
              <div className={`rounded-xl p-4 flex flex-col items-center justify-center text-center gap-1.5 border ${
                nowServing
                  ? isCalling
                    ? 'bg-gradient-to-br from-teal-600 to-emerald-700 text-white border-teal-400 animate-pulse shadow-lg'
                    : 'bg-teal-500/10 border-teal-500/40 text-teal-600 dark:text-teal-400'
                  : isTvMode ? 'bg-slate-950/60 border-slate-800 text-slate-500' : 'bg-bg-surface-elevated border-border-subtle text-text-muted'
              }`}>
                <div className="text-[0.7rem] uppercase font-black tracking-widest opacity-80">
                  {nowServing ? (isCalling ? '🔔 CALLING NOW TO ROOM' : 'NOW IN CONSULTATION') : 'ROOM IDLE / WAITING'}
                </div>
                <div className="text-4xl font-black font-mono tracking-tight my-1">
                  {nowServing ? nowServing.token : '---'}
                </div>
                <div className="text-sm font-bold truncate max-w-[200px]">
                  {nowServing ? nowServing.patient : 'No Active Patient'}
                </div>
              </div>

              {/* Next Up Row */}
              <div className={`pt-3 border-t flex justify-between items-center ${isTvMode ? 'border-slate-800' : 'border-border-subtle'}`}>
                <div>
                  <div className={`text-[0.7rem] ${isTvMode ? 'text-slate-400' : 'text-text-muted'}`}>Next Token:</div>
                  <div className={`font-mono font-bold text-sm ${isTvMode ? 'text-emerald-400' : 'text-teal-600'}`}>
                    {nextTokens[0] ? `${nextTokens[0].token} (${nextTokens[0].patient})` : 'Queue Empty'}
                  </div>
                </div>

                {nowServing && (
                  <button
                    className="btn btn-primary btn-sm text-xs py-1 px-2.5 h-8 flex items-center gap-1"
                    onClick={() => handleCallToken(nowServing)}
                    title="Call token out loud over lounge speakers"
                  >
                    <Bell size={12} /> Call
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Queue Token Roster Table */}
      <div className={`rounded-2xl border p-5 ${isTvMode ? 'bg-slate-900/90 border-slate-800' : 'glass-card bg-bg-surface border-border-subtle shadow-xs'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className={`font-black text-lg ${isTvMode ? 'text-white' : 'text-text-main'}`}>
              RECEPTION WAITING LOUNGE TOKEN ROSTER
            </h3>
            <span className="mono text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/40">
              {currentQueue.length} Active Tokens
            </span>
          </div>

          <div className="text-xs font-mono text-text-muted">
            Auto-calculated Wait = Patients Ahead × Avg Consult Speed
          </div>
        </div>

        <div className="table-container overflow-x-auto">
          <table className={`w-full text-left text-xs ${isTvMode ? 'text-slate-200' : ''}`}>
            <thead>
              <tr className={`border-b ${isTvMode ? 'border-slate-800 text-slate-400' : 'border-border-subtle text-text-muted'}`}>
                <th className="py-3 px-3">Token #</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Consulting Specialist</th>
                <th className="py-3 px-3">Room / Dept</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Est. Wait</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-text-muted">
                    No active tokens currently in queue lounge.
                  </td>
                </tr>
              ) : (
                currentQueue.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b transition-colors ${
                      isTvMode
                        ? 'border-slate-800 hover:bg-slate-800/40'
                        : 'border-border-subtle hover:bg-bg-surface-elevated/60'
                    } ${item.status === 'Calling' ? 'bg-teal-500/10 font-bold' : ''}`}
                  >
                    <td className="py-3 px-3">
                      <span className="mono font-bold text-sm text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-1 px-2.5 rounded border border-teal-200 dark:border-teal-800">
                        {item.token}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold">{item.patient}</td>
                    <td className="py-3 px-3 text-teal-600 dark:text-teal-400 font-medium">{item.doctor}</td>
                    <td className="py-3 px-3 text-text-muted">{item.room} ({item.dept})</td>
                    <td className="py-3 px-3">
                      <Badge variant={item.status === 'Calling' ? 'teal' : item.status === 'In-Room' ? 'emerald' : 'indigo'} dot={item.status === 'Calling'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {item.waitMins > 0 ? `~${item.waitMins} mins` : 'Immediate'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        className="btn btn-primary btn-sm text-xs h-7.5 px-3 rounded-md"
                        onClick={() => handleCallToken(item)}
                      >
                        <Bell size={11} /> Call Out
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
