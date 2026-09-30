import React, { useState } from 'react';
import { ShoppingBag, Plus, FileText, CheckCircle2, Truck, Eye } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useHospital } from '../../context/HospitalContext';

export const Purchase = () => {
  const { showToast } = useHospital();
  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: 1, poNumber: 'PO-2026-0812', vendor: 'AstraZeneca Pharmaceuticals', items: 'Brilinta 90mg (1,000 tablets)', total: 38000, date: '2026-09-14', status: 'Delivered & Stocked' },
    { id: 2, poNumber: 'PO-2026-0813', vendor: 'Sun Pharma Distributors', items: 'Rozavel-EZ & Pantoprazole IV', total: 64500, date: '2026-09-16', status: 'In Transit' },
    { id: 3, poNumber: 'PO-2026-0814', vendor: 'Cipla Healthcare Division', items: 'Inj. Meropenem 1g (500 vials)', total: 340000, date: '2026-09-17', status: 'Order Approved' }
  ]);

  const handleReceiveDelivery = (po) => {
    setPurchaseOrders((prev) =>
      prev.map((item) => (item.id === po.id ? { ...item, status: 'Delivered & Stocked' } : item))
    );
    showToast(`Order ${po.poNumber} received! Stock added to pharmacy inventory.`, 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center flex-wrap gap-3.5">
        <div>
          <h2 className="text-[1.35rem] font-extrabold text-text-main">
            Medicine Purchase Orders
          </h2>
          <p className="text-[0.85rem] text-text-muted">
            Track wholesale medicine orders placed with suppliers and delivery status.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => showToast('New Medicine Purchase Order requisition form opened.', 'info')}
        >
          <Plus size={16} /> New Purchase Order
        </button>
      </div>

      <div className="table-container">
        <table className="medicore-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Medicine Supplier</th>
              <th>Ordered Items</th>
              <th>Total Amount (₹)</th>
              <th>Order Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <tr
                key={po.id}
                className="cursor-pointer hover:bg-bg-surface-elevated/60 transition-colors"
                onClick={() => showToast(`Selected PO ${po.poNumber} from ${po.vendor}.`, 'info')}
              >
                <td>
                  <span className="mono font-bold text-teal-600 bg-bg-surface-elevated px-2 py-0.5 rounded border border-border-subtle">
                    {po.poNumber}
                  </span>
                </td>
                <td className="font-bold text-text-main">{po.vendor}</td>
                <td className="text-text-main">{po.items}</td>
                <td className="mono font-bold">₹{po.total.toLocaleString()}</td>
                <td className="text-[0.8rem] text-text-dim">{po.date}</td>
                <td>
                  <Badge variant={po.status.includes('Stocked') ? 'emerald' : po.status.includes('Transit') ? 'amber' : 'teal'}>
                    {po.status}
                  </Badge>
                </td>
                <td className="text-right">
                  {po.status !== 'Delivered & Stocked' ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReceiveDelivery(po);
                      }}
                    >
                      <Truck size={13} /> Receive Stock
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`PO ${po.poNumber} invoice copy downloaded.`, 'info');
                      }}
                    >
                      <FileText size={13} /> View Invoice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
