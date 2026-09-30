import React, { useState } from 'react';
import { Activity, HeartPulse, CheckCircle2, Bed, Clock, ArrowRight } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const PostOp = () => {
  const { showToast } = useHospital();
  const [pacuPatients, setPacuPatients] = useState([
    { id: 1, patient: 'Harish Patel (42 yrs, Male)', surgery: 'Knee Ligament Repair', recoveryScore: '9/10 (Ready for Ward)', vitals: 'BP 124/78, Oxygen 99%, Pulse 72', recoveryTime: '1 hr 15m', status: 'Ready for Room' },
    { id: 2, patient: 'Gurpreet Singh Chawla (45 yrs, Male)', surgery: 'Spine Disc Surgery', recoveryScore: '8/10 (Awake & Stable)', vitals: 'BP 128/82, Oxygen 98%, Pulse 76', recoveryTime: '30 min', status: 'Resting & Monitored' }
  ]);

  const handleTransfer = (id, patientName) => {
    setPacuPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Transferred to Inpatient Ward' } : p))
    );
    showToast(`${patientName} transferred from recovery room to regular inpatient ward bed.`, 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Post-Surgery Recovery Room (PACU)
          </h2>
          <p className="text-[0.8rem] text-text-muted">
            Patients recovering from surgery before shifting to their hospital ward room.
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Completed Surgery</th>
              <th>Recovery Status</th>
              <th>Live Vitals</th>
              <th>Time in Recovery</th>
              <th>Condition</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pacuPatients.map((p) => (
              <tr key={p.id}>
                <td className="font-bold text-text-main">{p.patient}</td>
                <td className="text-teal-600 font-semibold">{p.surgery}</td>
                <td>
                  <span className={`mono font-extrabold ${p.recoveryScore.startsWith('9') ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {p.recoveryScore}
                  </span>
                </td>
                <td className="text-[0.8rem] text-text-main">{p.vitals}</td>
                <td className="text-[0.8rem] text-text-muted">{p.recoveryTime}</td>
                <td>
                  <Badge variant={p.status.includes('Ward') || p.status.includes('Ready') ? 'emerald' : 'amber'}>
                    {p.status}
                  </Badge>
                </td>
                <td className="text-right">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleTransfer(p.id, p.patient)}
                    disabled={p.status.includes('Transferred')}
                  >
                    <ArrowRight size={13} /> Shift to Ward
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
