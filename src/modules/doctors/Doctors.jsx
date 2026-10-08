import React, { useState, useRef } from 'react';
import {
  Stethoscope,
  Search,
  Plus,
  Clock,
  UserCheck,
  Building,
  Award,
  Star,
  Activity,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  BedDouble,
  Coins,
  CalendarClock,
  BarChart3,
  Scissors,
  CheckCircle2,
  Calendar,
  Sparkles,
  Building2,
  Phone,
  HeartPulse,
  ShieldAlert,
  Layers,
  Heart,
  Wind,
  Scan,
  FlaskConical,
  RotateCcw,
  ArrowUpDown,
  LayoutGrid,
  List,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { DoctorCard } from '../../components/common/DoctorCard';
import { AddDoctorModal } from '../../components/common/AddDoctorModal';

export const Doctors = () => {
  const { doctors, setActiveNav, openModal, showToast, userRole, authenticatedPatient } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All'); // 'All' | 'Available' | 'OPD' | 'Surgery'
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'rating' | 'experience' | 'fee-low' | 'fee-high'
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const scrollRowRef = useRef(null);

  const departmentConfig = [
    { name: 'All', label: 'All Specialties', icon: Stethoscope, color: 'blue' },
    { name: 'Cardiology', label: 'Cardiology', icon: HeartPulse, color: 'rose' },
    { name: 'Orthopaedics', label: 'Orthopaedics', icon: Layers, color: 'blue' },
    { name: 'Paediatrics', label: 'Paediatrics', icon: Sparkles, color: 'emerald' },
    { name: 'Neurology', label: 'Neurology', icon: Activity, color: 'violet' },
    { name: 'Obstetrics & Gynaecology', label: 'Obstetrics & Gynae', icon: Heart, color: 'pink' },
    { name: 'General Surgery', label: 'General Surgery', icon: Scissors, color: 'amber' },
    { name: 'Dermatology', label: 'Dermatology', icon: Sparkles, color: 'purple' },
    { name: 'ENT', label: 'ENT', icon: Stethoscope, color: 'cyan' },
    { name: 'Radiology', label: 'Radiology', icon: Scan, color: 'indigo' },
    { name: 'Oncology', label: 'Oncology', icon: ShieldAlert, color: 'rose' },
    { name: 'Endocrinology', label: 'Endocrinology', icon: Activity, color: 'blue' },
    { name: 'Urology', label: 'Urology', icon: Layers, color: 'blue' },
    { name: 'Ophthalmology', label: 'Ophthalmology', icon: Scan, color: 'violet' },
    { name: 'Pulmonology', label: 'Pulmonology', icon: Wind, color: 'cyan' },
    { name: 'Psychiatry', label: 'Psychiatry', icon: Activity, color: 'emerald' },
    { name: 'Gastroenterology', label: 'Gastroenterology', icon: Stethoscope, color: 'indigo' },
    { name: 'Anesthesiology', label: 'Anesthesiology', icon: Activity, color: 'amber' },
    { name: 'Nephrology', label: 'Nephrology', icon: Layers, color: 'blue' },
    { name: 'Laboratory', label: 'Laboratory', icon: FlaskConical, color: 'blue' },
    { name: 'Emergency', label: 'Emergency', icon: ShieldAlert, color: 'rose' },
    { name: 'Dentistry', label: 'Dentistry', icon: Sparkles, color: 'emerald' },
    { name: 'Rheumatology', label: 'Rheumatology', icon: Layers, color: 'pink' },
    { name: 'Physiotherapy', label: 'Physiotherapy', icon: Activity, color: 'blue' },
    { name: 'General Medicine', label: 'General Medicine', icon: Stethoscope, color: 'blue' }
  ];

  const scrollDepartments = (direction) => {
    if (scrollRowRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getDeptCount = (deptName) => {
    if (deptName === 'All') return doctors.length;
    return doctors.filter((d) => d.department?.toLowerCase() === deptName.toLowerCase()).length;
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedDept !== 'All' ||
    availabilityFilter !== 'All' ||
    topRatedOnly ||
    sortBy !== 'recommended';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setAvailabilityFilter('All');
    setTopRatedOnly(false);
    setSortBy('recommended');
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || doc.department.toLowerCase() === selectedDept.toLowerCase();

    let matchesAvailability = true;
    if (availabilityFilter === 'Available') {
      matchesAvailability = doc.availableNow === true;
    } else if (availabilityFilter === 'OPD') {
      matchesAvailability = doc.status === 'In-Consult' || doc.status === 'On-Duty';
    } else if (availabilityFilter === 'Surgery') {
      matchesAvailability = doc.status === 'In-Surgery' || doc.status === 'In-Rounds';
    }

    let matchesRating = true;
    if (topRatedOnly) {
      matchesRating = (doc.patientRating || 0) >= 4.8;
    }

    return matchesSearch && matchesDept && matchesAvailability && matchesRating;
  });

  const displayedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.patientRating || 0) - (a.patientRating || 0);
    }
    if (sortBy === 'fee-low') {
      return a.fee - b.fee;
    }
    if (sortBy === 'fee-high') {
      return b.fee - a.fee;
    }
    if (sortBy === 'experience') {
      const expA = parseInt(a.experience) || 0;
      const expB = parseInt(b.experience) || 0;
      return expB - expA;
    }
    return 0; // default featured order
  });

  const availableNowCount = doctors.filter((d) => d.availableNow).length;
  const onDutyCount = doctors.filter((d) => d.status === 'On-Duty').length;
  const inConsultCount = doctors.filter((d) => d.status === 'In-Consult').length;
  const inSurgeryCount = doctors.filter((d) => d.status === 'In-Surgery').length;

  const handleOpenDoctorProfile = (doctor) => {
    openModal('doctorProfile', doctor);
  };

  const handleStartConsult = (doctor) => {
    openModal('doctorConsult', doctor);
  };

  const handleCallDoctor = (doctor) => {
    showToast(`Calling ${doctor.name} at clinic extension ${doctor.phone}...`, 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── HEADER BANNER ── */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-text-main tracking-tight font-display">
              Doctors & Medical Specialists
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/25">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              {availableNowCount} Available for Consult Now
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-3xl leading-relaxed font-normal">
            Browse hospital consultants, clinical qualifications, surgical track records, and schedule real-time OPD appointments.
          </p>
        </div>

        <div className="flex gap-2.5 flex-wrap items-center">
          <button
            className="btn btn-primary h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-teal-600/20 flex items-center gap-2 cursor-pointer hover:shadow-md transition-all"
            onClick={() => setIsAddDoctorModalOpen(true)}
            title="Onboard and register a new specialist doctor"
          >
            <Plus size={18} />
            <span>Add Specialist Doctor</span>
          </button>
        </div>
      </div>

      {/* ── 4 SUMMARY STATS ── */}
      <div className="doc-stats-grid">
        <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex items-center gap-4 hover:border-blue-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Stethoscope size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold text-text-main leading-tight font-mono">
              {doctors.length}
            </div>
            <div className="text-xs text-text-muted font-medium mt-0.5">Hospital Specialists</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface border border-emerald-500/30 bg-emerald-500/[0.03] shadow-xs flex items-center gap-4 hover:border-emerald-500/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold text-emerald-600 dark:text-emerald-400 leading-tight font-mono">
              {availableNowCount}
            </div>
            <div className="text-xs text-text-muted font-medium mt-0.5">Available for Consult Now</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex items-center gap-4 hover:border-teal-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold text-teal-600 dark:text-teal-400 leading-tight font-mono">
              {inConsultCount + onDutyCount}
            </div>
            <div className="text-xs text-text-muted font-medium mt-0.5">In OPD Clinic / On Duty</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-bg-surface border border-border-subtle shadow-xs flex items-center gap-4 hover:border-rose-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Building size={24} />
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold text-rose-600 dark:text-rose-400 leading-tight font-mono">
              {inSurgeryCount}
            </div>
            <div className="text-xs text-text-muted font-medium mt-0.5">In Surgery / OT Rounds</div>
          </div>
        </div>
      </div>

      {/* ── UNIFIED MODERN DOCTOR FILTER COMMAND NAVBAR ── */}
      <div className="doc-filter-panel">
        {/* Row 1: Search Input & Segmented Availability Controls */}
        <div className="doc-filter-top-row">
          {/* Search Box with Styled Badge, Shortcut Cue, and Quick Clear */}
          <div className="doc-search-box">
            <div className="doc-search-icon-badge">
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search by doctor name, clinical specialty, department, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="doc-search-input"
            />
            {!searchTerm && (
              <span className="doc-search-kbd hidden sm:inline-block">⌘K</span>
            )}
            {searchTerm && (
              <button
                type="button"
                className="doc-search-clear"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Segmented Availability Controls with Live Status Beacons */}
          <div className="doc-avail-pills">
            <button
              onClick={() => setAvailabilityFilter('All')}
              className={`doc-avail-tab ${availabilityFilter === 'All' ? 'active-all' : ''}`}
            >
              <span>All Doctors</span>
              <span className="doc-dept-count-badge">{doctors.length}</span>
            </button>

            <button
              onClick={() => setAvailabilityFilter('Available')}
              className={`doc-avail-tab ${availabilityFilter === 'Available' ? 'active-available' : ''}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available Now</span>
              <span className="doc-dept-count-badge">{availableNowCount}</span>
            </button>

            <button
              onClick={() => setAvailabilityFilter('OPD')}
              className={`doc-avail-tab ${availabilityFilter === 'OPD' ? 'active-opd' : ''}`}
            >
              <Stethoscope size={13} />
              <span>In OPD</span>
              <span className="doc-dept-count-badge">{onDutyCount + inConsultCount}</span>
            </button>

            <button
              onClick={() => setAvailabilityFilter('Surgery')}
              className={`doc-avail-tab ${availabilityFilter === 'Surgery' ? 'active-surgery' : ''}`}
            >
              <Scissors size={13} />
              <span>In Surgery</span>
              <span className="doc-dept-count-badge">{inSurgeryCount}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Specialty / Department Carousel Navigation Strip with Left/Right Arrows */}
        <div className="doc-dept-carousel">
          <button
            type="button"
            className="doc-carousel-btn hidden sm:flex"
            onClick={() => scrollDepartments('left')}
            title="Scroll specialties left"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="doc-dept-scroll-row" ref={scrollRowRef}>
            {departmentConfig.map((dept) => {
              const IconComponent = dept.icon;
              const isActive = selectedDept === dept.name;
              const count = getDeptCount(dept.name);

              return (
                <button
                  key={dept.name}
                  onClick={() => setSelectedDept(dept.name)}
                  className={`doc-dept-pill ${isActive ? 'active' : ''}`}
                >
                  <div className={`doc-dept-pill-icon icon-${dept.color}`}>
                    <IconComponent size={13} />
                  </div>
                  <span>{dept.label}</span>
                  <span className="doc-dept-count-badge">{count}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="doc-carousel-btn hidden sm:flex"
            onClick={() => scrollDepartments('right')}
            title="Scroll specialties right"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Row 3: Meta Bar (Active Filter Pills, Quick Toggles, View Switcher & Sort) */}
        <div className="doc-filter-meta-bar">
          <div className="doc-active-tags">
            <span className="doc-filter-count-label">
              Showing <strong className="text-text-main font-bold">{displayedDoctors.length}</strong> of{' '}
              <strong className="text-text-muted">{doctors.length}</strong> specialists
            </span>

            {/* Quick Filter: Top Rated */}
            <button
              type="button"
              className={`doc-quick-toggle-btn ${topRatedOnly ? 'active' : ''}`}
              onClick={() => setTopRatedOnly(!topRatedOnly)}
              title="Show only top rated doctors (4.8+)"
            >
              <Star size={12} className={topRatedOnly ? 'fill-amber-400 text-amber-400' : 'text-text-dim'} />
              <span>Top Rated (4.8+)</span>
            </button>

            {/* Removable Active Tags */}
            {selectedDept !== 'All' && (
              <button
                className="doc-tag-pill-removable"
                onClick={() => setSelectedDept('All')}
                title="Remove department filter"
              >
                <span>Dept: {selectedDept}</span>
                <X size={12} />
              </button>
            )}

            {availabilityFilter !== 'All' && (
              <button
                className="doc-tag-pill-removable"
                onClick={() => setAvailabilityFilter('All')}
                title="Remove availability filter"
              >
                <span>Status: {availabilityFilter}</span>
                <X size={12} />
              </button>
            )}

            {searchTerm && (
              <button
                className="doc-tag-pill-removable"
                onClick={() => setSearchTerm('')}
                title="Clear search filter"
              >
                <span>"{searchTerm}"</span>
                <X size={12} />
              </button>
            )}

            {hasActiveFilters && (
              <button
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer ml-1"
                onClick={handleResetFilters}
              >
                <RotateCcw size={11} /> Reset All
              </button>
            )}
          </div>

          {/* Right Tools: View Switcher (Grid/List) & Quick Sort */}
          <div className="doc-meta-right-tools">
            {/* View Switcher */}
            <div className="doc-view-switcher" title="Toggle view mode">
              <button
                type="button"
                className={`doc-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Card View"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                className={`doc-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Compact Clinical List View"
              >
                <List size={14} />
              </button>
            </div>

            {/* Quick Sort Dropdown */}
            <div className="doc-sort-select-wrap">
              <span className="text-xs font-bold text-text-dim flex items-center gap-1">
                <ArrowUpDown size={12} /> Sort:
              </span>
              <select
                className="doc-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">⭐ Recommended / Featured</option>
                <option value="rating">★ Highest Patient Rating</option>
                <option value="experience">💼 Years of Experience</option>
                <option value="fee-low">💰 Consult Fee: Low to High</option>
                <option value="fee-high">💎 Consult Fee: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── DOCTORS DISPLAY (GRID OR CLINICAL LIST) ── */}
      {displayedDoctors.length === 0 ? (
        <div className="col-span-full text-center p-12 text-text-dim bg-bg-surface rounded-2xl border border-border-subtle shadow-xs">
          <Stethoscope size={40} className="mx-auto mb-2 text-text-dim opacity-40" />
          <div className="text-base font-bold text-text-main">No doctors matched your search filters</div>
          <div className="text-xs text-text-muted mt-1">Try resetting the department, rating, or availability filters</div>
          <button
            onClick={handleResetFilters}
            className="btn btn-secondary h-9 px-4 text-xs font-bold rounded-xl mt-4 cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="doc-main-grid">
          {displayedDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onOpenProfile={handleOpenDoctorProfile}
              onOpenSlots={(d) => openModal('doctorSlots', d)}
              onConsult={handleStartConsult}
            />
          ))}
        </div>
      ) : (
        <div className="doc-list-container">
          {displayedDoctors.map((doc) => (
            <div key={doc.id} className="doc-list-row">
              <div className="doc-list-main-info">
                <div className="doc-list-avatar-wrap">
                  <img src={doc.image} alt={doc.name} className="doc-list-avatar" />
                  <span
                    className={`doc-list-status-beacon ${
                      doc.status === 'Available' || doc.availableNow
                        ? 'bg-emerald-500'
                        : doc.status === 'In-Surgery'
                        ? 'bg-rose-500'
                        : 'bg-teal-500'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-bold text-text-main font-display">
                      {doc.name}
                    </h4>
                    <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                      {doc.specialty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building size={12} className="text-text-dim" /> {doc.department}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-text-dim" /> {doc.room}
                    </span>
                    <span>•</span>
                    <span>{doc.qualifications}</span>
                  </div>
                </div>
              </div>

              <div className="doc-list-metrics">
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{doc.patientRating || '4.9'}</span>
                    <span className="text-[11px] font-medium text-text-dim">({doc.ratingCount || 120})</span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">Rating</div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="text-xs font-bold text-text-main">{doc.experience}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">Experience</div>
                </div>

                <div className="text-center sm:text-left">
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    ₹{doc.fee}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">Consult Fee</div>
                </div>
              </div>

              <div className="doc-list-actions">
                <button
                  onClick={() => handleOpenDoctorProfile(doc)}
                  className="btn btn-secondary min-h-[38px] px-4 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleStartConsult(doc)}
                  className="btn btn-primary min-h-[38px] px-4.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2 shadow-xs shadow-teal-600/20"
                >
                  <CalendarClock size={14} className="shrink-0" />
                  <span>Consult OPD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Specialist Doctor Onboarding Modal */}
      <AddDoctorModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
      />
    </div>
  );
};
