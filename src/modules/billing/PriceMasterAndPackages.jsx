import React, { useState } from 'react';
import {
  Layers,
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Stethoscope,
  Scissors,
  FlaskConical,
  Radio,
  Edit2,
  X,
  Sparkles,
  Tag
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Badge } from '../../components/common/Badge';

export const PriceMasterAndPackages = () => {
  const { servicePriceMaster, servicePackages, addServicePriceItem, updateServicePriceItem, createServicePackage, showToast } = useHospital();

  const [activeTab, setActiveTab] = useState('priceMaster'); // 'priceMaster' | 'packages'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal States
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // New Service Form
  const [serviceCode, setServiceCode] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Laboratory');
  const [serviceDept, setServiceDept] = useState('Pathology');
  const [serviceRate, setServiceRate] = useState(800);
  const [serviceSac, setServiceSac] = useState('999313');

  // New Package Form
  const [pkgCode, setPkgCode] = useState('');
  const [pkgName, setPkgName] = useState('');
  const [pkgDept, setPkgDept] = useState('General Surgery');
  const [pkgBaseRate, setPkgBaseRate] = useState(50000);
  const [pkgDiscountedRate, setPkgDiscountedRate] = useState(42000);
  const [pkgDuration, setPkgDuration] = useState(3);
  const [pkgRoomType, setPkgRoomType] = useState('Semi-Private Room');
  const [pkgInclusionsStr, setPkgInclusionsStr] = useState('Room stay, Surgeon fee, Routine medications, Pre-op investigations');

  const filteredServices = (servicePriceMaster || []).filter((s) => {
    const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddService = (e) => {
    e.preventDefault();
    addServicePriceItem({
      code: serviceCode || `SRV-${Date.now().toString().slice(-4)}`,
      name: serviceName,
      category: serviceCategory,
      dept: serviceDept,
      rate: Number(serviceRate) || 0,
      sacCode: serviceSac
    });
    setShowAddServiceModal(false);
    setServiceName('');
  };

  const handleEditRateSubmit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateServicePriceItem(editingItem.id, { rate: Number(editingItem.rate) });
    setEditingItem(null);
  };

  const handleAddPackage = (e) => {
    e.preventDefault();
    const inclusions = pkgInclusionsStr.split(',').map((s) => s.trim()).filter(Boolean);
    createServicePackage({
      code: pkgCode || `PKG-${Date.now().toString().slice(-4)}`,
      name: pkgName,
      department: pkgDept,
      baseRate: Number(pkgBaseRate) || 0,
      discountedRate: Number(pkgDiscountedRate) || 0,
      stayDurationDays: Number(pkgDuration) || 0,
      roomType: pkgRoomType,
      inclusions,
      exclusions: ['Blood Transfusions', 'Extended ICU stay']
    });
    setShowAddPackageModal(false);
    setPkgName('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-main flex items-center gap-2.5">
            <Layers className="text-teal-600 dark:text-teal-400" size={24} />
            Service Price Master & Package Catalog
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Standard tariff definitions, SAC tax codes, and bundled fixed-price health care packages (e.g. Normal Delivery, Knee Replacement, Laparoscopy).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'priceMaster' ? (
            <button className="btn btn-primary text-xs font-bold" onClick={() => setShowAddServiceModal(true)}>
              <Plus size={14} /> Add Service Tariff
            </button>
          ) : (
            <button className="btn btn-primary text-xs font-bold" onClick={() => setShowAddPackageModal(true)}>
              <Plus size={14} /> Create Care Package
            </button>
          )}
        </div>
      </div>

      {/* Segmented Switcher Bar */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
        <button
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'priceMaster'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-bg-surface-elevated text-text-muted hover:text-text-main border border-border-subtle'
          }`}
          onClick={() => setActiveTab('priceMaster')}
        >
          <Tag size={14} /> Service Price Master ({servicePriceMaster.length})
        </button>

        <button
          className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-bg-surface-elevated text-text-muted hover:text-text-main border border-border-subtle'
          }`}
          onClick={() => setActiveTab('packages')}
        >
          <Package size={14} /> Bundled Health Packages ({servicePackages.length})
        </button>
      </div>

      {/* VIEW 1: Service Price Master */}
      {activeTab === 'priceMaster' && (
        <div className="flex flex-col gap-4">
          {/* Filters Bar */}
          <div className="glass-card p-3.5 rounded-xl border border-border-subtle flex items-center justify-between flex-wrap gap-3 bg-bg-surface">
            <div className="flex items-center gap-2.5 flex-wrap flex-1">
              <div className="relative min-w-[220px] max-w-sm flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  className="form-input text-xs pl-8.5 pr-3 py-1.5 h-8.5 rounded-lg w-full"
                  placeholder="Search Service by Name, Code, or Dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold">
                <Filter size={13} className="text-teal-600" /> Category:
              </div>
              <select
                className="form-select text-xs h-8.5 py-1 px-2.5 rounded-lg w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Service Categories</option>
                <option value="Bed Charges">Inpatient Bed Charges</option>
                <option value="Consultation">Doctor Consultation</option>
                <option value="Laboratory">Laboratory & Pathology</option>
                <option value="Radiology">Radiology & Imaging</option>
                <option value="Surgery/OT">Surgery & OT Suite</option>
                <option value="Nursing">Nursing Care</option>
              </select>
            </div>

            <div className="text-xs text-text-muted font-mono">
              Showing {filteredServices.length} standard tariffs
            </div>
          </div>

          {/* Price Master Table */}
          <div className="table-container rounded-xl border border-border-subtle overflow-x-auto bg-bg-surface shadow-xs">
            <table className="medicore-table w-full min-w-[900px] text-xs">
              <thead>
                <tr>
                  <th className="w-28">Tariff Code</th>
                  <th className="min-w-[260px]">Service Particulars</th>
                  <th className="w-32">Category</th>
                  <th className="w-28">Department</th>
                  <th className="w-24">SAC Code</th>
                  <th className="w-28 text-right">Standard Rate (₹)</th>
                  <th className="w-20">Status</th>
                  <th className="w-20 text-right">Edit</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((srv) => (
                  <tr key={srv.id} className="h-13 hover:bg-bg-surface-elevated/60 transition-colors">
                    <td>
                      <span className="mono font-bold text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 py-0.5 px-2 rounded border border-teal-200 dark:border-teal-800">
                        {srv.code}
                      </span>
                    </td>
                    <td className="font-bold text-text-main">{srv.name}</td>
                    <td>
                      <span className="badge badge-gray text-[10.5px]">{srv.category}</span>
                    </td>
                    <td className="text-text-muted">{srv.dept}</td>
                    <td className="mono text-text-dim">{srv.sacCode}</td>
                    <td className="text-right mono font-black text-sm text-text-main">
                      ₹{Number(srv.rate).toLocaleString()}
                    </td>
                    <td>
                      <Badge variant="emerald">Active</Badge>
                    </td>
                    <td className="text-right">
                      <button
                        className="w-7 h-7 rounded-lg border border-border-subtle flex items-center justify-center text-text-muted hover:text-teal-600 hover:bg-bg-surface-elevated transition-colors cursor-pointer"
                        onClick={() => setEditingItem({ ...srv })}
                        title="Edit Service Rate"
                      >
                        <Edit2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Bundled Healthcare Packages */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicePackages.map((pkg) => {
            const savings = pkg.baseRate - pkg.discountedRate;
            return (
              <div
                key={pkg.id}
                className="glass-card bg-bg-surface p-5 rounded-2xl border border-border-subtle hover:border-teal-500/40 transition-all flex flex-col justify-between shadow-xs gap-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="mono text-[10.5px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      {pkg.code}
                    </span>
                    <Badge variant="emerald">Active Package</Badge>
                  </div>

                  <h3 className="font-black text-base text-text-main mt-1 leading-snug">
                    {pkg.name}
                  </h3>
                  <div className="text-xs text-text-muted mt-0.5">
                    {pkg.department} • {pkg.roomType} ({pkg.stayDurationDays > 0 ? `${pkg.stayDurationDays} Days Stay` : 'Daycare'})
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-bg-surface-elevated p-3 rounded-xl my-3 border border-border-subtle flex justify-between items-center">
                    <div>
                      <div className="text-[10.5px] text-text-muted font-medium">Standard MRP</div>
                      <div className="text-xs text-text-muted line-through font-mono">₹{pkg.baseRate.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">Bundled Fixed Rate</div>
                      <div className="text-xl font-black font-mono text-teal-600 dark:text-teal-400">
                        ₹{pkg.discountedRate.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Inclusions List */}
                  <div className="space-y-1.5 text-xs text-text-main">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                      Package Inclusions:
                    </div>
                    {pkg.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11.5px] text-text-main">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border-subtle flex justify-between items-center text-xs">
                  <span className="text-emerald-600 font-bold">
                    Patient Saves ₹{savings.toLocaleString()}
                  </span>
                  <span className="text-text-muted text-[11px]">NABH Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Rate Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-teal-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <h3 className="text-base font-extrabold text-text-main mb-1 flex items-center gap-2">
              <Edit2 size={16} className="text-teal-600" /> Edit Service Tariff Rate
            </h3>
            <p className="text-xs text-text-muted mb-4">{editingItem.name} ({editingItem.code})</p>

            <form onSubmit={handleEditRateSubmit} className="flex flex-col gap-3">
              <div className="form-group">
                <label className="form-label text-xs">Unit Rate (INR ₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input text-sm font-mono font-bold"
                  value={editingItem.rate}
                  onChange={(e) => setEditingItem({ ...editingItem, rate: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Update Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-teal-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-extrabold text-text-main mb-1 flex items-center gap-2">
              <Plus size={18} className="text-teal-600" /> Add Service to Price Master
            </h3>
            <p className="text-xs text-text-muted mb-4">Define a new clinical investigation, procedure, or bed charge tariff.</p>

            <form onSubmit={handleAddService} className="flex flex-col gap-3.5">
              <div className="form-group">
                <label className="form-label">Service Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SRV-LAB-GLUCOSE"
                  value={serviceCode}
                  onChange={(e) => setServiceCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Fasting Blood Sugar (FBS)"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)}>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Bed Charges">Bed Charges</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Surgery/OT">Surgery/OT</option>
                    <option value="Nursing">Nursing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">SAC Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={serviceSac}
                    onChange={(e) => setServiceSac(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Standard Base Rate (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input font-mono font-bold"
                  value={serviceRate}
                  onChange={(e) => setServiceRate(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => setShowAddServiceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Save to Price Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Package Modal */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="glass-card bg-bg-surface border border-teal-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-extrabold text-text-main mb-1 flex items-center gap-2">
              <Package size={18} className="text-teal-600" /> Create Bundled Health Package
            </h3>
            <p className="text-xs text-text-muted mb-4">Bundle room stay, surgeon fees, and routine medications at a fixed rate.</p>

            <form onSubmit={handleAddPackage} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Package Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. PKG-HERNIA-LAP"
                    value={pkgCode}
                    onChange={(e) => setPkgCode(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. General Surgery"
                    value={pkgDept}
                    onChange={(e) => setPkgDept(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Package Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Laparoscopic Inguinal Hernia Repair Package"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Standard MRP (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input font-mono"
                    value={pkgBaseRate}
                    onChange={(e) => setPkgBaseRate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discounted Package Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input font-mono font-bold text-teal-600"
                    value={pkgDiscountedRate}
                    onChange={(e) => setPkgDiscountedRate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Stay Duration (Days)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={pkgDuration}
                    onChange={(e) => setPkgDuration(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Room Type</label>
                  <select className="form-select" value={pkgRoomType} onChange={(e) => setPkgRoomType(e.target.value)}>
                    <option value="Semi-Private Room">Semi-Private Room</option>
                    <option value="Single Private Room">Single Private Room</option>
                    <option value="General Ward">General Ward</option>
                    <option value="Daycare Lounge">Daycare Lounge</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Package Inclusions (comma-separated)</label>
                <textarea
                  className="form-textarea text-xs"
                  rows="2"
                  value={pkgInclusionsStr}
                  onChange={(e) => setPkgInclusionsStr(e.target.value)}
                  placeholder="Room stay, Surgeon charges, OT charges, Routine meds"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => setShowAddPackageModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
