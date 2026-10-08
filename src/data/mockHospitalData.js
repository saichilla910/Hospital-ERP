// HospitalCare ERP — Hospital Management System Database

export const INITIAL_HOSPITAL_DATA = {
  hospitalInfo: {
    name: "HospitalCare Super Specialty Hospital & Research Institute",
    tagline: "Comprehensive Clinical Care & Hospital Resource Management",
    licenseNo: "NABH-TERTIARY-2024-99821",
    taxId: "GSTIN-36AAACH7829K1Z4",
    address: "Plot 42-45, Health City, Cyberabad, Hyderabad, TS - 500081",
    phone: "+91 (040) 6889-4000",
    emergencyHelpline: "+91 1066 / +91 (040) 6889-4911",
    email: "contact@hospitalcare.org",
    activeShift: "Morning Shift (07:00 - 15:30)",
    currentShiftSupervisor: "Dr. Arvind Swaminathan, MD (Emergency Medicine)"
  },

  doctors: [
  {
    "id": "DOC-101",
    "name": "Dr. Ananya Reddy",
    "specialty": "Interventional Cardiology",
    "department": "Cardiology",
    "room": "OPD-302 (Block A)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 12,
    "nextSlot": "Immediate / Walk-in",
    "phone": "+91 98480 11223",
    "experience": "14 yrs",
    "fee": 1200,
    "photo": "https://images.unsplash.com/photo-1594824813566-78853a15f795?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Consultant in Interventional Cardiology and Structural Heart Interventions. Expert in complex angioplasty, TAVR, coronary stenting, and acute cardiac care.",
    "successRate": 98.9,
    "patientRating": 4.95,
    "reviewCount": 560,
    "totalSurgeries": 88,
    "successfulSurgeries": 87,
    "inRecoverySurgeries": 1,
    "totalConsultations": 16200,
    "avgWaitTime": "10-15 mins",
    "councilRegNo": "MCI-TS-44120",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Osmania Medical College, Hyderabad",
        "year": "2010"
      },
      {
        "degree": "MD - General Medicine",
        "institution": "AIIMS New Delhi",
        "year": "2014"
      },
      {
        "degree": "DM - Cardiology",
        "institution": "NIMS Hyderabad",
        "year": "2017"
      }
    ],
    "certifications": [
      "Fellow of European Society of Cardiology (FESC)",
      "Gold Medalist in DM Cardiology"
    ],
    "proceduresTreated": [
      "Primary & Elective Angioplasty (PTCA)",
      "Drug-Eluting Stent Placement",
      "Radial Artery Angiography",
      "Pacemaker Implantation"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health",
      "Niva Bupa"
    ],
    "patientReviews": [
      {
        "patientName": "Rameshwar P.",
        "rating": 5,
        "date": "2026-09-17",
        "comment": "Dr. Ananya explained my stent procedure clearly and provided phenomenal care."
      }
    ]
  },
  {
    "id": "DOC-102",
    "name": "Dr. Rohan Sharma",
    "specialty": "Orthopaedics & Joint Replacement",
    "department": "Orthopaedics",
    "room": "OPD-108 (Block A)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 8,
    "nextSlot": "11:30 AM (In 20 mins)",
    "phone": "+91 98480 22334",
    "experience": "16 yrs",
    "fee": 1100,
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    "about": "Chief Orthopaedic Surgeon specializing in computer-navigated robotic knee & hip replacement, sports medicine arthroscopy, and complex trauma fixation.",
    "successRate": 99,
    "patientRating": 4.92,
    "reviewCount": 510,
    "totalSurgeries": 96,
    "successfulSurgeries": 95,
    "inRecoverySurgeries": 1,
    "totalConsultations": 18400,
    "avgWaitTime": "12 mins",
    "councilRegNo": "MCI-TS-38291",
    "languages": [
      "English",
      "Hindi",
      "Punjabi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Kasturba Medical College, Manipal",
        "year": "2008"
      },
      {
        "degree": "MS - Orthopaedics",
        "institution": "KEM Hospital, Mumbai",
        "year": "2012"
      }
    ],
    "certifications": [
      "Fellow in Robotic Joint Replacement (Germany)",
      "Arthroscopy Association Member"
    ],
    "proceduresTreated": [
      "Robotic Knee Replacement",
      "Total Hip Arthroplasty",
      "ACL & Meniscus Repair",
      "Fracture Reconstruction"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "Bajaj Allianz"
    ],
    "patientReviews": [
      {
        "patientName": "Gurpreet S.",
        "rating": 5,
        "date": "2026-09-10",
        "comment": "Dr. Rohan performed my knee replacement brilliantly. Walking painless now."
      }
    ]
  },
  {
    "id": "DOC-103",
    "name": "Dr. Priya Nair",
    "specialty": "Paediatrics & Neonatology",
    "department": "Paediatrics",
    "room": "OPD-204 (Block B)",
    "status": "In-Consult",
    "availableNow": true,
    "availableSlotsToday": 10,
    "nextSlot": "Available Now",
    "phone": "+91 98480 33445",
    "experience": "12 yrs",
    "fee": 850,
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Pediatrician and Neonatal Specialist. Expert in pediatric immunizations, developmental milestones, childhood asthma, and neonatal ICU management.",
    "successRate": 98.8,
    "patientRating": 4.96,
    "reviewCount": 620,
    "totalSurgeries": 34,
    "successfulSurgeries": 34,
    "inRecoverySurgeries": 0,
    "totalConsultations": 15200,
    "avgWaitTime": "8 mins",
    "councilRegNo": "MCI-TS-49102",
    "languages": [
      "English",
      "Malayalam",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "CMC Vellore",
        "year": "2012"
      },
      {
        "degree": "MD - Paediatrics",
        "institution": "JIPMER Puducherry",
        "year": "2016"
      }
    ],
    "certifications": [
      "Indian Academy of Pediatrics (IAP) Member",
      "Advanced Neonatal Resuscitation Trainer"
    ],
    "proceduresTreated": [
      "Childhood Immunization",
      "Neonatal Jaundice Care",
      "Pediatric Asthma Management",
      "Growth Tracking"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Niva Bupa"
    ],
    "patientReviews": [
      {
        "patientName": "Sunitha M.",
        "rating": 5,
        "date": "2026-09-14",
        "comment": "Dr. Priya is incredibly gentle and patient with babies. Best pediatrician!"
      }
    ]
  },
  {
    "id": "DOC-104",
    "name": "Dr. Suresh Babu",
    "specialty": "Neurology & Stroke Specialist",
    "department": "Neurology",
    "room": "OPD-405 (Block B)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 6,
    "nextSlot": "12:15 PM",
    "phone": "+91 98480 44556",
    "experience": "18 yrs",
    "fee": 1400,
    "photo": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    "about": "Chief Neurologist specializing in acute stroke thrombolysis, epilepsy diagnostics, Parkinson's disease management, and nerve conduction studies.",
    "successRate": 98.5,
    "patientRating": 4.89,
    "reviewCount": 440,
    "totalSurgeries": 52,
    "successfulSurgeries": 51,
    "inRecoverySurgeries": 1,
    "totalConsultations": 21000,
    "avgWaitTime": "15 mins",
    "councilRegNo": "MCI-TS-29188",
    "languages": [
      "English",
      "Telugu",
      "Tamil"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Madras Medical College",
        "year": "2006"
      },
      {
        "degree": "DM - Neurology",
        "institution": "NIMHANS Bengaluru",
        "year": "2013"
      }
    ],
    "certifications": [
      "American Academy of Neurology Fellow",
      "Stroke Association Advisor"
    ],
    "proceduresTreated": [
      "Stroke Thrombolysis",
      "EEG & Video Monitoring",
      "EMG & Nerve Studies",
      "Migraine Management"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "ICICI Lombard"
    ],
    "patientReviews": [
      {
        "patientName": "Venkatesh K.",
        "rating": 5,
        "date": "2026-09-08",
        "comment": "Accurate diagnosis and excellent treatment plan for father's stroke recovery."
      }
    ]
  },
  {
    "id": "DOC-105",
    "name": "Dr. Meera Iyer",
    "specialty": "Obstetrics & High-Risk Pregnancy",
    "department": "Obstetrics & Gynaecology",
    "room": "OPD-201 (Block C)",
    "status": "In-Consult",
    "availableNow": true,
    "availableSlotsToday": 9,
    "nextSlot": "Immediate",
    "phone": "+91 98480 55667",
    "experience": "15 yrs",
    "fee": 1000,
    "photo": "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80",
    "about": "Lead Consultant Obstetrician and Gynecologist. Expert in high-risk pregnancy care, painless deliveries, laparoscopic hysterectomy, and fertility management.",
    "successRate": 99.1,
    "patientRating": 4.97,
    "reviewCount": 680,
    "totalSurgeries": 92,
    "successfulSurgeries": 91,
    "inRecoverySurgeries": 1,
    "totalConsultations": 17800,
    "avgWaitTime": "10 mins",
    "councilRegNo": "MCI-TS-51920",
    "languages": [
      "English",
      "Tamil",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Stanley Medical College",
        "year": "2009"
      },
      {
        "degree": "MS - Obstetrics & Gynaecology",
        "institution": "JIPMER",
        "year": "2013"
      }
    ],
    "certifications": [
      "MRCOG (London UK)",
      "FOGSI Certified Laparoscopic Surgeon"
    ],
    "proceduresTreated": [
      "High-Risk Delivery Care",
      "Laparoscopic Cystectomy",
      "Infertility Workup",
      "Antenatal Care"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Tata AIG"
    ],
    "patientReviews": [
      {
        "patientName": "Anusuya P.",
        "rating": 5,
        "date": "2026-09-12",
        "comment": "Dr. Meera made my high-risk delivery smooth and safe. Eternally grateful."
      }
    ]
  },
  {
    "id": "DOC-106",
    "name": "Dr. Arjun Patel",
    "specialty": "Laparoscopic & General Surgery",
    "department": "General Surgery",
    "room": "OPD-102 (Block A)",
    "status": "In-Surgery",
    "availableNow": false,
    "availableSlotsToday": 3,
    "nextSlot": "03:00 PM",
    "phone": "+91 98480 66778",
    "experience": "17 yrs",
    "fee": 1000,
    "photo": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Consultant General & Minimal Access Surgeon. Specialized in laparoscopic cholecystectomy, hernia mesh repair, appendectomy, and laser proctology.",
    "successRate": 98.7,
    "patientRating": 4.88,
    "reviewCount": 390,
    "totalSurgeries": 110,
    "successfulSurgeries": 108,
    "inRecoverySurgeries": 2,
    "totalConsultations": 19200,
    "avgWaitTime": "15 mins",
    "councilRegNo": "MCI-TS-34190",
    "languages": [
      "English",
      "Gujarati",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "BJ Medical College, Ahmedabad",
        "year": "2007"
      },
      {
        "degree": "MS - General Surgery",
        "institution": "AIIMS New Delhi",
        "year": "2011"
      }
    ],
    "certifications": [
      "FIAGES (Laparoscopic Surgery)",
      "Laser Surgery Certified"
    ],
    "proceduresTreated": [
      "Laparoscopic Appendectomy",
      "Hernia Repair",
      "Gallbladder Surgery",
      "Hemorrhoid Laser Surgery"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "Niva Bupa"
    ],
    "patientReviews": [
      {
        "patientName": "Chirag M.",
        "rating": 5,
        "date": "2026-09-01",
        "comment": "Minimal pain after laparoscopic gallbladder surgery. Dr. Arjun is top notch."
      }
    ]
  },
  {
    "id": "DOC-107",
    "name": "Dr. Kavya Menon",
    "specialty": "Dermatology & Cosmetology",
    "department": "Dermatology",
    "room": "OPD-305 (Block C)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 11,
    "nextSlot": "Available Now",
    "phone": "+91 98480 77889",
    "experience": "10 yrs",
    "fee": 800,
    "photo": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
    "about": "Consultant Dermatologist and Aesthetic Specialist. Expertise in clinical dermatology, laser skin therapies, acne scar revision, and psoriasis treatment.",
    "successRate": 98.4,
    "patientRating": 4.91,
    "reviewCount": 340,
    "totalSurgeries": 22,
    "successfulSurgeries": 22,
    "inRecoverySurgeries": 0,
    "totalConsultations": 11400,
    "avgWaitTime": "8 mins",
    "councilRegNo": "MCI-TS-58210",
    "languages": [
      "English",
      "Malayalam",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Government Medical College, Kozhikode",
        "year": "2014"
      },
      {
        "degree": "MD - Dermatology",
        "institution": "Madras Medical College",
        "year": "2018"
      }
    ],
    "certifications": [
      "IADVL Life Member",
      "Aesthetic Laser Surgery Certification"
    ],
    "proceduresTreated": [
      "Laser Skin Resurfacing",
      "Acne & Scar Treatment",
      "Psoriasis Phototherapy",
      "Chemical Peels"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Divya N.",
        "rating": 5,
        "date": "2026-08-25",
        "comment": "Skin cleared up dramatically within 3 weeks under Dr. Kavya's care."
      }
    ]
  },
  {
    "id": "DOC-108",
    "name": "Dr. Venkat Rao",
    "specialty": "ENT & Head-Neck Surgery",
    "department": "ENT",
    "room": "OPD-210 (Block B)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 7,
    "nextSlot": "11:45 AM",
    "phone": "+91 98480 88990",
    "experience": "19 yrs",
    "fee": 900,
    "photo": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80",
    "about": "Senior ENT Surgeon and Rhinologist. Expert in endoscopic sinus surgery (FESS), tympanoplasty, vertigo management, and micro-laryngeal voice surgery.",
    "successRate": 98.6,
    "patientRating": 4.87,
    "reviewCount": 410,
    "totalSurgeries": 78,
    "successfulSurgeries": 77,
    "inRecoverySurgeries": 1,
    "totalConsultations": 20500,
    "avgWaitTime": "12 mins",
    "councilRegNo": "MCI-TS-28190",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Andhra Medical College, Visakhapatnam",
        "year": "2005"
      },
      {
        "degree": "MS - ENT",
        "institution": "Osmania Medical College",
        "year": "2009"
      }
    ],
    "certifications": [
      "AOI National Member",
      "FESS Endoscopic Surgery Specialist"
    ],
    "proceduresTreated": [
      "Endoscopic Sinus Surgery (FESS)",
      "Tympanoplasty",
      "Tonsillectomy",
      "Vertigo Rehabilitation"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Niva Bupa"
    ],
    "patientReviews": [
      {
        "patientName": "Subba Rao",
        "rating": 5,
        "date": "2026-09-05",
        "comment": "Sinus pressure completely gone post endoscopic surgery. Excellent doctor."
      }
    ]
  },
  {
    "id": "DOC-109",
    "name": "Dr. Fatima Khan",
    "specialty": "Radiology & Imaging Specialist",
    "department": "Radiology",
    "room": "Radiology Suite 1",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 15,
    "nextSlot": "Immediate",
    "phone": "+91 98480 99001",
    "experience": "13 yrs",
    "fee": 950,
    "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
    "about": "Chief Radiologist specializing in 3T MRI interpretation, multi-slice CT angiography, musculoskeletal ultrasound, and image-guided biopsy procedures.",
    "successRate": 99.2,
    "patientRating": 4.93,
    "reviewCount": 480,
    "totalSurgeries": 15,
    "successfulSurgeries": 15,
    "inRecoverySurgeries": 0,
    "totalConsultations": 22000,
    "avgWaitTime": "5 mins",
    "councilRegNo": "MCI-TS-45120",
    "languages": [
      "English",
      "Urdu",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Deccan College of Medical Sciences",
        "year": "2011"
      },
      {
        "degree": "MD - Radio-Diagnosis",
        "institution": "NIMS Hyderabad",
        "year": "2015"
      }
    ],
    "certifications": [
      "Indian Radiological & Imaging Association (IRIA) Fellow"
    ],
    "proceduresTreated": [
      "3T MRI Diagnostics",
      "CT Coronary Angiography",
      "USG Guided Biopsy",
      "Color Doppler Studies"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "Bajaj Allianz"
    ],
    "patientReviews": [
      {
        "patientName": "Ayesha B.",
        "rating": 5,
        "date": "2026-09-18",
        "comment": "Extremely detailed MRI report provided with prompt turnaround."
      }
    ]
  },
  {
    "id": "DOC-110",
    "name": "Dr. Harish Gupta",
    "specialty": "Medical Oncology & Chemotherapy",
    "department": "Oncology",
    "room": "OPD-501 (Block D)",
    "status": "In-Consult",
    "availableNow": true,
    "availableSlotsToday": 5,
    "nextSlot": "01:15 PM",
    "phone": "+91 98481 11223",
    "experience": "21 yrs",
    "fee": 1500,
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Consultant Medical Oncologist. Pioneer in targeted immunotherapy, molecular tumor profiling, precision cancer therapies, and systemic chemotherapy.",
    "successRate": 97.5,
    "patientRating": 4.9,
    "reviewCount": 530,
    "totalSurgeries": 40,
    "successfulSurgeries": 39,
    "inRecoverySurgeries": 1,
    "totalConsultations": 16500,
    "avgWaitTime": "15 mins",
    "councilRegNo": "MCI-TS-22910",
    "languages": [
      "English",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "KGMC Lucknow",
        "year": "2003"
      },
      {
        "degree": "DM - Medical Oncology",
        "institution": "Tata Memorial Hospital, Mumbai",
        "year": "2010"
      }
    ],
    "certifications": [
      "ASCO Member",
      "ESMO Certified Medical Oncologist"
    ],
    "proceduresTreated": [
      "Immunotherapy",
      "Targeted Cancer Therapy",
      "Systemic Chemotherapy",
      "Bone Marrow Biopsy"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "HDFC ERGO",
      "Aarogyasri"
    ],
    "patientReviews": [
      {
        "patientName": "Mahesh C.",
        "rating": 5,
        "date": "2026-09-02",
        "comment": "Dr. Harish's compassionate oncological guidance gave our family immense hope."
      }
    ]
  },
  {
    "id": "DOC-111",
    "name": "Dr. Lakshmi Prasad",
    "specialty": "Endocrinology & Diabetology",
    "department": "Endocrinology",
    "room": "OPD-308 (Block A)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 8,
    "nextSlot": "12:30 PM",
    "phone": "+91 98481 22334",
    "experience": "14 yrs",
    "fee": 1000,
    "photo": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    "about": "Lead Endocrinologist specializing in type 1 & 2 diabetes management, thyroid disorders, osteoporosis, pituitary disease, and hormonal imbalances.",
    "successRate": 98.7,
    "patientRating": 4.94,
    "reviewCount": 460,
    "totalSurgeries": 10,
    "successfulSurgeries": 10,
    "inRecoverySurgeries": 0,
    "totalConsultations": 17400,
    "avgWaitTime": "10 mins",
    "councilRegNo": "MCI-TS-41290",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Osmania Medical College",
        "year": "2010"
      },
      {
        "degree": "DM - Endocrinology",
        "institution": "PGIMER Chandigarh",
        "year": "2016"
      }
    ],
    "certifications": [
      "Endocrine Society USA Member",
      "RSSDI Life Member"
    ],
    "proceduresTreated": [
      "Insulin Pump Therapy",
      "Thyroid Nodule Evaluation",
      "Hormonal Replacement",
      "Gestational Diabetes Care"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Niva Bupa",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Narayana Swamy",
        "rating": 5,
        "date": "2026-09-11",
        "comment": "HbA1c dropped from 10.2 to 6.4 under Dr. Lakshmi's expert regimen."
      }
    ]
  },
  {
    "id": "DOC-112",
    "name": "Dr. Sandeep Kulkarni",
    "specialty": "Urology & Kidney Transplant",
    "department": "Urology",
    "room": "OPD-402 (Block C)",
    "status": "In-Surgery",
    "availableNow": false,
    "availableSlotsToday": 3,
    "nextSlot": "02:45 PM",
    "phone": "+91 98481 33445",
    "experience": "18 yrs",
    "fee": 1200,
    "photo": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80",
    "about": "Chief Urologist and Kidney Transplant Surgeon. Specialist in laser prostatectomy (HoLEP), RIRS kidney stone clearance, laparoscopic nephrectomy, and male infertility.",
    "successRate": 99,
    "patientRating": 4.89,
    "reviewCount": 520,
    "totalSurgeries": 102,
    "successfulSurgeries": 101,
    "inRecoverySurgeries": 1,
    "totalConsultations": 20100,
    "avgWaitTime": "15 mins",
    "councilRegNo": "MCI-TS-29810",
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Grant Medical College, Mumbai",
        "year": "2006"
      },
      {
        "degree": "MCh - Urology",
        "institution": "SGS Medical College, Mumbai",
        "year": "2012"
      }
    ],
    "certifications": [
      "Urological Society of India Fellow",
      "Endourology Society Member"
    ],
    "proceduresTreated": [
      "RIRS Laser Kidney Stone Removal",
      "Laser Prostate Surgery (HoLEP)",
      "Laparoscopic Nephrectomy",
      "Varicocele Repair"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health",
      "CGHS"
    ],
    "patientReviews": [
      {
        "patientName": "Prashanth G.",
        "rating": 5,
        "date": "2026-08-30",
        "comment": "Stones cleared completely with laser in a 1-day hospital stay."
      }
    ]
  },
  {
    "id": "DOC-113",
    "name": "Dr. Divya Chowdary",
    "specialty": "Ophthalmology & Cataract Surgery",
    "department": "Ophthalmology",
    "room": "OPD-105 (Block C)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 13,
    "nextSlot": "Available Now",
    "phone": "+91 98481 44556",
    "experience": "11 yrs",
    "fee": 800,
    "photo": "https://images.unsplash.com/photo-1594824813566-78853a15f795?w=400&auto=format&fit=crop&q=80",
    "about": "Consultant Ophthalmic Surgeon. Expert in Femto-LASIK vision correction, phacoemulsification premium IOL cataract surgery, glaucoma care, and diabetic retinopathy.",
    "successRate": 99.4,
    "patientRating": 4.96,
    "reviewCount": 580,
    "totalSurgeries": 84,
    "successfulSurgeries": 84,
    "inRecoverySurgeries": 0,
    "totalConsultations": 15900,
    "avgWaitTime": "8 mins",
    "councilRegNo": "MCI-TS-48190",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Andhra Medical College",
        "year": "2013"
      },
      {
        "degree": "MS - Ophthalmology",
        "institution": "LV Prasad Eye Institute",
        "year": "2017"
      }
    ],
    "certifications": [
      "All India Ophthalmological Society Fellow",
      "Femto-LASIK Certified"
    ],
    "proceduresTreated": [
      "Phacoemulsification Cataract Surgery",
      "LASIK Vision Correction",
      "Glaucoma Trabeculectomy",
      "Diabetic Retinal Laser"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "Niva Bupa"
    ],
    "patientReviews": [
      {
        "patientName": "Saraswathi K.",
        "rating": 5,
        "date": "2026-09-14",
        "comment": "Clear 6/6 vision after cataract surgery. Dr. Divya is wonderful!"
      }
    ]
  },
  {
    "id": "DOC-114",
    "name": "Dr. Imran Sheikh",
    "specialty": "Pulmonology & Critical Care",
    "department": "Pulmonology",
    "room": "OPD-208 (Block A)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 7,
    "nextSlot": "11:45 AM",
    "phone": "+91 98481 55667",
    "experience": "13 yrs",
    "fee": 1000,
    "photo": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80",
    "about": "Lead Pulmonologist & Respiratory Specialist. Specialized in COPD management, severe asthma, bronchoscopy, sleep apnea titration, and post-viral lung rehabilitation.",
    "successRate": 98.1,
    "patientRating": 4.88,
    "reviewCount": 370,
    "totalSurgeries": 44,
    "successfulSurgeries": 43,
    "inRecoverySurgeries": 1,
    "totalConsultations": 14200,
    "avgWaitTime": "10 mins",
    "councilRegNo": "MCI-TS-42910",
    "languages": [
      "English",
      "Urdu",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Deccan College of Medical Sciences",
        "year": "2011"
      },
      {
        "degree": "MD - Pulmonary Medicine",
        "institution": "VP Chest Institute Delhi",
        "year": "2015"
      }
    ],
    "certifications": [
      "European Diploma in Respiratory Medicine (EDARM)",
      "ICS Life Member"
    ],
    "proceduresTreated": [
      "Diagnostic Fiberoptic Bronchoscopy",
      "Polysomnography (Sleep Study)",
      "Pleural Effusion Drainage",
      "COPD Rehabilitation"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Zubair Ahmed",
        "rating": 5,
        "date": "2026-09-03",
        "comment": "Severe asthma now fully controlled under Dr. Imran's modern therapy."
      }
    ]
  },
  {
    "id": "DOC-115",
    "name": "Dr. Swathi Naidu",
    "specialty": "Psychiatry & Behavioral Health",
    "department": "Psychiatry",
    "room": "OPD-408 (Block D)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 9,
    "nextSlot": "Available Now",
    "phone": "+91 98481 66778",
    "experience": "11 yrs",
    "fee": 900,
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    "about": "Consultant Psychiatrist and Behavioral Therapist. Specialized in clinical depression, anxiety disorders, adult ADHD, stress management, and cognitive behavioral therapy.",
    "successRate": 98.3,
    "patientRating": 4.94,
    "reviewCount": 310,
    "totalSurgeries": 5,
    "successfulSurgeries": 5,
    "inRecoverySurgeries": 0,
    "totalConsultations": 10800,
    "avgWaitTime": "10 mins",
    "councilRegNo": "MCI-TS-49120",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Osmania Medical College",
        "year": "2013"
      },
      {
        "degree": "MD - Psychiatry",
        "institution": "NIMHANS Bengaluru",
        "year": "2017"
      }
    ],
    "certifications": [
      "Indian Psychiatric Society Life Member",
      "CBT Certified Specialist"
    ],
    "proceduresTreated": [
      "Cognitive Behavioral Therapy",
      "Depression & Anxiety Management",
      "Sleep Disorder Care",
      "De-addiction Counseling"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Karthik N.",
        "rating": 5,
        "date": "2026-09-09",
        "comment": "Dr. Swathi is compassionate, empathetic, and truly life-changing."
      }
    ]
  },
  {
    "id": "DOC-116",
    "name": "Dr. Karthik Subramanian",
    "specialty": "Interventional Gastroenterology",
    "department": "Gastroenterology",
    "room": "OPD-304 (Block B)",
    "status": "In-Consult",
    "availableNow": true,
    "availableSlotsToday": 6,
    "nextSlot": "12:10 PM",
    "phone": "+91 98481 77889",
    "experience": "16 yrs",
    "fee": 1100,
    "photo": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Gastroenterologist and Hepatologist. Expert in therapeutic endoscopy, ERCP bile duct stone extraction, IBS treatment, fatty liver care, and colonoscopy.",
    "successRate": 98.8,
    "patientRating": 4.91,
    "reviewCount": 490,
    "totalSurgeries": 72,
    "successfulSurgeries": 71,
    "inRecoverySurgeries": 1,
    "totalConsultations": 17900,
    "avgWaitTime": "12 mins",
    "councilRegNo": "MCI-TS-36190",
    "languages": [
      "English",
      "Tamil",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "MMC Chennai",
        "year": "2008"
      },
      {
        "degree": "DM - Gastroenterology",
        "institution": "PGI Chandigarh",
        "year": "2015"
      }
    ],
    "certifications": [
      "Indian Society of Gastroenterology Fellow",
      "ASGE Member"
    ],
    "proceduresTreated": [
      "Diagnostic & Therapeutic Colonoscopy",
      "ERCP Bile Duct Stenting",
      "Upper GI Endoscopy",
      "Fatty Liver Reversal"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "HDFC ERGO"
    ],
    "patientReviews": [
      {
        "patientName": "Gopalakrishnan V.",
        "rating": 5,
        "date": "2026-09-06",
        "comment": "Painless colonoscopy and very reassuring clinical explanation."
      }
    ]
  },
  {
    "id": "DOC-117",
    "name": "Dr. Pooja Verma",
    "specialty": "Anesthesiology & Critical Care",
    "department": "Anesthesiology",
    "room": "OT Complex 1",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 10,
    "nextSlot": "Immediate",
    "phone": "+91 98481 88990",
    "experience": "12 yrs",
    "fee": 900,
    "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Consultant Anesthesiologist specializing in neuro-anesthesia, pediatric anesthesia, ultrasound-guided regional nerve blocks, and acute pain management.",
    "successRate": 99.3,
    "patientRating": 4.92,
    "reviewCount": 290,
    "totalSurgeries": 120,
    "successfulSurgeries": 119,
    "inRecoverySurgeries": 1,
    "totalConsultations": 14500,
    "avgWaitTime": "5 mins",
    "councilRegNo": "MCI-TS-47180",
    "languages": [
      "English",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "BHU Varanasi",
        "year": "2012"
      },
      {
        "degree": "MD - Anaesthesiology",
        "institution": "AIIMS New Delhi",
        "year": "2016"
      }
    ],
    "certifications": [
      "Indian Society of Anaesthesiologists Fellow",
      "Ultrasound Regional Anesthesia Certified"
    ],
    "proceduresTreated": [
      "Ultrasound Guided Nerve Blocks",
      "Epidural Pain Relief",
      "General Anesthesia for Complex OT",
      "Post-Op Analgesia"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Sunil K.",
        "rating": 5,
        "date": "2026-09-11",
        "comment": "Woke up smoothly from surgery with zero nausea. Excellent anesthesiologist!"
      }
    ]
  },
  {
    "id": "DOC-118",
    "name": "Dr. Naveen Kumar",
    "specialty": "Nephrology & Renal Transplant",
    "department": "Nephrology",
    "room": "OPD-401 (Block C)",
    "status": "In-Consult",
    "availableNow": true,
    "availableSlotsToday": 5,
    "nextSlot": "01:00 PM",
    "phone": "+91 98481 99001",
    "experience": "15 yrs",
    "fee": 1200,
    "photo": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80",
    "about": "Chief Nephrologist and Dialysis Director. Specialist in chronic kidney disease (CKD) management, hemodialysis protocols, renal biopsy, and kidney transplants.",
    "successRate": 98.6,
    "patientRating": 4.89,
    "reviewCount": 420,
    "totalSurgeries": 58,
    "successfulSurgeries": 57,
    "inRecoverySurgeries": 1,
    "totalConsultations": 16800,
    "avgWaitTime": "15 mins",
    "councilRegNo": "MCI-TS-39102",
    "languages": [
      "English",
      "Telugu",
      "Kannada",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Bangalore Medical College",
        "year": "2009"
      },
      {
        "degree": "DM - Nephrology",
        "institution": "NIMS Hyderabad",
        "year": "2016"
      }
    ],
    "certifications": [
      "Indian Society of Nephrology Fellow",
      "Transplant Nephrology Specialist"
    ],
    "proceduresTreated": [
      "Hemodialysis & Peritoneal Dialysis",
      "Renal Biopsy",
      "AV Fistula Care",
      "Kidney Transplant Management"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health",
      "Aarogyasri"
    ],
    "patientReviews": [
      {
        "patientName": "Baskar Rao",
        "rating": 5,
        "date": "2026-08-29",
        "comment": "Creatinine levels stabilized under Dr. Naveen's meticulous care."
      }
    ]
  },
  {
    "id": "DOC-119",
    "name": "Dr. Shruti Deshpande",
    "specialty": "Pathology & Molecular Diagnostics",
    "department": "Laboratory",
    "room": "Central Lab Block",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 14,
    "nextSlot": "Immediate",
    "phone": "+91 98482 11223",
    "experience": "11 yrs",
    "fee": 750,
    "photo": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80",
    "about": "Consultant Pathologist & Laboratory Director. Expertise in histopathology, oncological biopsy staining, hematology automated diagnostics, and molecular genetics.",
    "successRate": 99.5,
    "patientRating": 4.95,
    "reviewCount": 380,
    "totalSurgeries": 0,
    "successfulSurgeries": 0,
    "inRecoverySurgeries": 0,
    "totalConsultations": 25000,
    "avgWaitTime": "5 mins",
    "councilRegNo": "MCI-TS-50129",
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "BJ Medical College Pune",
        "year": "2013"
      },
      {
        "degree": "MD - Pathology",
        "institution": "KEM Hospital Mumbai",
        "year": "2017"
      }
    ],
    "certifications": [
      "NABL Lead Assessor",
      "Molecular Pathology Certified"
    ],
    "proceduresTreated": [
      "Biopsy Histopathology",
      "Cytology & FNAC",
      "Bone Marrow Reporting",
      "Genetic Marker Testing"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Mohan Lal",
        "rating": 5,
        "date": "2026-09-15",
        "comment": "Highly reliable laboratory reports with zero delay."
      }
    ]
  },
  {
    "id": "DOC-120",
    "name": "Dr. Mohan Krishna",
    "specialty": "Emergency Medicine & Trauma",
    "department": "Emergency",
    "room": "Trauma Bay 2",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 16,
    "nextSlot": "Immediate Walk-in",
    "phone": "+91 98482 22334",
    "experience": "13 yrs",
    "fee": 1000,
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Consultant in Emergency Trauma Medicine. Expert in acute cardiac arrest resuscitation, severe polytrauma management, critical airway, and toxicology.",
    "successRate": 98.4,
    "patientRating": 4.9,
    "reviewCount": 450,
    "totalSurgeries": 65,
    "successfulSurgeries": 64,
    "inRecoverySurgeries": 1,
    "totalConsultations": 17200,
    "avgWaitTime": "5 mins",
    "councilRegNo": "MCI-TS-43910",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Osmania Medical College",
        "year": "2011"
      },
      {
        "degree": "MD - Emergency Medicine",
        "institution": "AIIMS New Delhi",
        "year": "2015"
      }
    ],
    "certifications": [
      "ATLS Instructor",
      "ACLS & BLS Master Trainer"
    ],
    "proceduresTreated": [
      "Polytrauma Resuscitation",
      "Rapid Intubation",
      "Central Line Insertion",
      "Chest Tube Insertion"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health",
      "Govt EHS"
    ],
    "patientReviews": [
      {
        "patientName": "Sandeep V.",
        "rating": 5,
        "date": "2026-09-04",
        "comment": "Saved my life during acute allergic anaphylaxis in ER!"
      }
    ]
  },
  {
    "id": "DOC-121",
    "name": "Dr. Ritu Agarwal",
    "specialty": "Dentistry & Maxillofacial Surgery",
    "department": "Dentistry",
    "room": "OPD-109 (Block C)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 9,
    "nextSlot": "12:00 PM",
    "phone": "+91 98482 33445",
    "experience": "10 yrs",
    "fee": 700,
    "photo": "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80",
    "about": "Consultant Dental Surgeon & Maxillofacial Specialist. Expertise in painless root canal treatment (RCT), dental implants, wisdom tooth extraction, and smile designing.",
    "successRate": 99.1,
    "patientRating": 4.93,
    "reviewCount": 360,
    "totalSurgeries": 45,
    "successfulSurgeries": 45,
    "inRecoverySurgeries": 0,
    "totalConsultations": 12900,
    "avgWaitTime": "8 mins",
    "councilRegNo": "MCI-TS-53102",
    "languages": [
      "English",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "BDS",
        "institution": "Government Dental College Hyderabad",
        "year": "2014"
      },
      {
        "degree": "MDS - Conservative Dentistry",
        "institution": "Manipal College of Dental Sciences",
        "year": "2018"
      }
    ],
    "certifications": [
      "Indian Dental Association Member",
      "Implantology Specialist"
    ],
    "proceduresTreated": [
      "Microscopic Root Canal Therapy",
      "Dental Implant Placement",
      "Wisdom Tooth Extraction",
      "Teeth Whitening"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Pooja S.",
        "rating": 5,
        "date": "2026-09-07",
        "comment": "Painless root canal done in a single sitting. Dr. Ritu is super skilled."
      }
    ]
  },
  {
    "id": "DOC-122",
    "name": "Dr. Vikram Singh",
    "specialty": "Neurosurgery & Spine Surgery",
    "department": "Neurology",
    "room": "OPD-406 (Block B)",
    "status": "In-Surgery",
    "availableNow": false,
    "availableSlotsToday": 2,
    "nextSlot": "03:30 PM",
    "phone": "+91 98482 44556",
    "experience": "20 yrs",
    "fee": 1500,
    "photo": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    "about": "Chief Neurosurgeon specializing in brain tumor excision, minimally invasive spine surgery, aneurysm clipping, and traumatic brain injury reconstruction.",
    "successRate": 98.2,
    "patientRating": 4.91,
    "reviewCount": 490,
    "totalSurgeries": 115,
    "successfulSurgeries": 113,
    "inRecoverySurgeries": 2,
    "totalConsultations": 19500,
    "avgWaitTime": "15 mins",
    "councilRegNo": "MCI-TS-25910",
    "languages": [
      "English",
      "Hindi",
      "Punjabi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "AFMC Pune",
        "year": "2004"
      },
      {
        "degree": "MCh - Neurosurgery",
        "institution": "AIIMS New Delhi",
        "year": "2011"
      }
    ],
    "certifications": [
      "Neurological Society of India Fellow",
      "World Federation of Neurosurgical Societies Member"
    ],
    "proceduresTreated": [
      "Craniotomy for Brain Tumor",
      "Microscopic Spine Discectomy",
      "Aneurysm Clipping",
      "Spinal Fusion"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health",
      "Aarogyasri"
    ],
    "patientReviews": [
      {
        "patientName": "Rajender P.",
        "rating": 5,
        "date": "2026-08-27",
        "comment": "Complex spine surgery performed with perfection. Walking without pain now."
      }
    ]
  },
  {
    "id": "DOC-123",
    "name": "Dr. Harini Raghavan",
    "specialty": "Rheumatology & Autoimmune Diseases",
    "department": "Rheumatology",
    "room": "OPD-306 (Block A)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 8,
    "nextSlot": "12:15 PM",
    "phone": "+91 98482 55667",
    "experience": "12 yrs",
    "fee": 1000,
    "photo": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80",
    "about": "Consultant Rheumatologist. Specialized in rheumatoid arthritis, lupus (SLE), ankylosing spondylitis, gout, vasculitis, and biologic immune therapies.",
    "successRate": 98.6,
    "patientRating": 4.92,
    "reviewCount": 330,
    "totalSurgeries": 8,
    "successfulSurgeries": 8,
    "inRecoverySurgeries": 0,
    "totalConsultations": 11900,
    "avgWaitTime": "10 mins",
    "councilRegNo": "MCI-TS-46910",
    "languages": [
      "English",
      "Tamil",
      "Telugu",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Stanley Medical College",
        "year": "2012"
      },
      {
        "degree": "DM - Clinical Immunology & Rheumatology",
        "institution": "JIPMER Puducherry",
        "year": "2018"
      }
    ],
    "certifications": [
      "Indian Rheumatology Association Fellow",
      "EULAR Certified Specialist"
    ],
    "proceduresTreated": [
      "Biologic Therapy Infusion",
      "Joint Fluid Aspiration",
      "Rheumatoid Arthritis Care",
      "Lupus Management"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "Niva Bupa"
    ],
    "patientReviews": [
      {
        "patientName": "Radha M.",
        "rating": 5,
        "date": "2026-09-13",
        "comment": "Joint pain controlled after starting Dr. Harini's targeted treatment plan."
      }
    ]
  },
  {
    "id": "DOC-124",
    "name": "Dr. Anil Choudhary",
    "specialty": "Cardiothoracic & Vascular Surgery",
    "department": "Cardiology",
    "room": "OT Complex 2",
    "status": "In-Surgery",
    "availableNow": false,
    "availableSlotsToday": 1,
    "nextSlot": "04:00 PM",
    "phone": "+91 98482 66778",
    "experience": "23 yrs",
    "fee": 1500,
    "photo": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80",
    "about": "Chief Cardiothoracic Surgeon. Expert in off-pump coronary artery bypass graft (CABG), mitral valve replacement, aortic aneurysm repair, and lung surgeries.",
    "successRate": 98.9,
    "patientRating": 4.93,
    "reviewCount": 610,
    "totalSurgeries": 130,
    "successfulSurgeries": 128,
    "inRecoverySurgeries": 2,
    "totalConsultations": 22400,
    "avgWaitTime": "15 mins",
    "councilRegNo": "MCI-TS-19810",
    "languages": [
      "English",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "SMS Medical College Jaipur",
        "year": "2001"
      },
      {
        "degree": "MCh - CTVS",
        "institution": "AIIMS New Delhi",
        "year": "2008"
      }
    ],
    "certifications": [
      "Indian Association of Cardiovascular Surgeons Fellow",
      "Heart Transplant Specialist"
    ],
    "proceduresTreated": [
      "Beating Heart Bypass Surgery (CABG)",
      "Mitral & Aortic Valve Replacement",
      "Aortic Aneurysm Repair",
      "Thoracotomy"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health",
      "Aarogyasri"
    ],
    "patientReviews": [
      {
        "patientName": "Satyanarayana B.",
        "rating": 5,
        "date": "2026-08-31",
        "comment": "Triple bypass surgery performed flawlessly. Dr. Anil is a master surgeon."
      }
    ]
  },
  {
    "id": "DOC-125",
    "name": "Dr. Sneha Joshi",
    "specialty": "Physiotherapy & Rehabilitation",
    "department": "Physiotherapy",
    "room": "Rehab Center (Block E)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 12,
    "nextSlot": "Available Now",
    "phone": "+91 98482 77889",
    "experience": "9 yrs",
    "fee": 650,
    "photo": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
    "about": "Lead Physiotherapist and Sports Rehab Specialist. Expertise in post-operative orthopedic rehabilitation, stroke gait training, cervical spine therapy, and dry needling.",
    "successRate": 99.2,
    "patientRating": 4.95,
    "reviewCount": 420,
    "totalSurgeries": 0,
    "successfulSurgeries": 0,
    "inRecoverySurgeries": 0,
    "totalConsultations": 13500,
    "avgWaitTime": "5 mins",
    "councilRegNo": "MCI-TS-54120",
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "BPT",
        "institution": "SGS Medical College Mumbai",
        "year": "2015"
      },
      {
        "degree": "MPT - Musculoskeletal",
        "institution": "Manipal University",
        "year": "2018"
      }
    ],
    "certifications": [
      "Certified Manual Therapist",
      "Dry Needling Specialist"
    ],
    "proceduresTreated": [
      "Post-Op Knee Rehab",
      "Stroke Neurological Gait Training",
      "Dry Needling & Cupping",
      "Spine Decompression Therapy"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Kavitha R.",
        "rating": 5,
        "date": "2026-09-10",
        "comment": "Regained full shoulder range of motion after 6 sessions with Dr. Sneha."
      }
    ]
  },
  {
    "id": "DOC-126",
    "name": "Dr. Rajesh Pillai",
    "specialty": "General Medicine & Internal Care",
    "department": "General Medicine",
    "room": "OPD-101 (Block A)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 10,
    "nextSlot": "Immediate",
    "phone": "+91 98482 88990",
    "experience": "16 yrs",
    "fee": 900,
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Consultant in Internal Medicine. Specialized in chronic disease management, fever protocols, hypertension control, metabolic health, and geriatric care.",
    "successRate": 98.6,
    "patientRating": 4.88,
    "reviewCount": 510,
    "totalSurgeries": 12,
    "successfulSurgeries": 12,
    "inRecoverySurgeries": 0,
    "totalConsultations": 23100,
    "avgWaitTime": "8 mins",
    "councilRegNo": "MCI-TS-35910",
    "languages": [
      "English",
      "Malayalam",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Trivandrum Medical College",
        "year": "2008"
      },
      {
        "degree": "MD - General Medicine",
        "institution": "Madras Medical College",
        "year": "2012"
      }
    ],
    "certifications": [
      "Association of Physicians of India Fellow"
    ],
    "proceduresTreated": [
      "Hypertension Management",
      "FUO (Fever of Unknown Origin)",
      "Geriatric Comprehensive Care",
      "Dyslipidemia Management"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Sudhakar N.",
        "rating": 5,
        "date": "2026-09-02",
        "comment": "Dr. Rajesh listens patiently and prescribes the exact minimal necessary meds."
      }
    ]
  },
  {
    "id": "DOC-127",
    "name": "Dr. Nisha Bhatt",
    "specialty": "Hematology & Bone Marrow Care",
    "department": "Laboratory",
    "room": "OPD-503 (Block D)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 6,
    "nextSlot": "12:30 PM",
    "phone": "+91 98482 99001",
    "experience": "13 yrs",
    "fee": 1200,
    "photo": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    "about": "Consultant Hematologist and Bone Marrow Transplant Specialist. Specialized in anemias, thalassemia, leukemia, lymphoma, bleeding disorders, and coagulation care.",
    "successRate": 98.4,
    "patientRating": 4.91,
    "reviewCount": 290,
    "totalSurgeries": 18,
    "successfulSurgeries": 18,
    "inRecoverySurgeries": 0,
    "totalConsultations": 11200,
    "avgWaitTime": "10 mins",
    "councilRegNo": "MCI-TS-44910",
    "languages": [
      "English",
      "Gujarati",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "BJ Medical College Ahmedabad",
        "year": "2011"
      },
      {
        "degree": "DM - Clinical Hematology",
        "institution": "CMC Vellore",
        "year": "2017"
      }
    ],
    "certifications": [
      "Indian Society of Hematology Fellow",
      "BMT Certified Physician"
    ],
    "proceduresTreated": [
      "Bone Marrow Aspiration & Biopsy",
      "Chemotherapy for Leukemia",
      "Thalassemia Management",
      "Coagulation Workup"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "HDFC ERGO"
    ],
    "patientReviews": [
      {
        "patientName": "Meenakshi K.",
        "rating": 5,
        "date": "2026-09-14",
        "comment": "Severe anemia diagnosed and corrected swiftly. Excellent doctor!"
      }
    ]
  },
  {
    "id": "DOC-128",
    "name": "Dr. Gopal Yadav",
    "specialty": "Plastic & Reconstructive Surgery",
    "department": "General Surgery",
    "room": "OPD-206 (Block C)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 5,
    "nextSlot": "01:00 PM",
    "phone": "+91 98483 11223",
    "experience": "15 yrs",
    "fee": 1300,
    "photo": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Consultant Plastic & Reconstructive Surgeon. Expertise in microvascular reconstruction, post-burn scar revision, cleft lip repair, hand surgery, and cosmetic procedures.",
    "successRate": 98.9,
    "patientRating": 4.9,
    "reviewCount": 370,
    "totalSurgeries": 76,
    "successfulSurgeries": 75,
    "inRecoverySurgeries": 1,
    "totalConsultations": 15600,
    "avgWaitTime": "12 mins",
    "councilRegNo": "MCI-TS-37810",
    "languages": [
      "English",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "BHU Varanasi",
        "year": "2009"
      },
      {
        "degree": "MCh - Plastic Surgery",
        "institution": "PGI Chandigarh",
        "year": "2016"
      }
    ],
    "certifications": [
      "Association of Plastic Surgeons of India Fellow"
    ],
    "proceduresTreated": [
      "Microvascular Tissue Transfer",
      "Post-Burn Scar Revision",
      "Hand Tendon Reconstruction",
      "Rhinoplasty"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "Bajaj Allianz"
    ],
    "patientReviews": [
      {
        "patientName": "Deepak S.",
        "rating": 5,
        "date": "2026-09-08",
        "comment": "Reconstructive hand surgery restored full hand motion. Dr. Gopal is amazing."
      }
    ]
  },
  {
    "id": "DOC-129",
    "name": "Dr. Tanvi Mehta",
    "specialty": "Neonatology & NICU Intensive Care",
    "department": "Paediatrics",
    "room": "NICU Complex (Level 3)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 9,
    "nextSlot": "Immediate",
    "phone": "+91 98483 22334",
    "experience": "11 yrs",
    "fee": 900,
    "photo": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Neonatologist and NICU Director. Specialized in extreme premature infant resuscitation, neonatal mechanical ventilation, congenital anomaly care, and surfactant therapy.",
    "successRate": 99.1,
    "patientRating": 4.96,
    "reviewCount": 410,
    "totalSurgeries": 25,
    "successfulSurgeries": 25,
    "inRecoverySurgeries": 0,
    "totalConsultations": 12800,
    "avgWaitTime": "5 mins",
    "councilRegNo": "MCI-TS-49810",
    "languages": [
      "English",
      "Gujarati",
      "Hindi",
      "Telugu"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "Baroda Medical College",
        "year": "2013"
      },
      {
        "degree": "DM - Neonatology",
        "institution": "AIIMS New Delhi",
        "year": "2019"
      }
    ],
    "certifications": [
      "National Neonatology Forum (NNF) Fellow",
      "NICU Resuscitation Trainer"
    ],
    "proceduresTreated": [
      "Premature Infant Resuscitation",
      "Neonatal Ventilation & Surfactant",
      "Central Arterial Cannulation",
      "NICU Developmental Care"
    ],
    "insuranceAccepted": [
      "Star Health",
      "HDFC ERGO",
      "Care Health"
    ],
    "patientReviews": [
      {
        "patientName": "Nilesh Patel",
        "rating": 5,
        "date": "2026-09-16",
        "comment": "Dr. Tanvi saved our 28-week premature twins in NICU. We are forever in debt."
      }
    ]
  },
  {
    "id": "DOC-130",
    "name": "Dr. Srinivas Murthy",
    "specialty": "Infectious Diseases & Tropical Care",
    "department": "General Medicine",
    "room": "OPD-309 (Block A)",
    "status": "On-Duty",
    "availableNow": true,
    "availableSlotsToday": 8,
    "nextSlot": "11:50 AM",
    "phone": "+91 98483 33445",
    "experience": "17 yrs",
    "fee": 1000,
    "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    "about": "Senior Consultant in Infectious Diseases and Antibiotic Stewardship. Expert in drug-resistant infections, tropical fevers, HIV/TB management, and hospital infection control.",
    "successRate": 98.7,
    "patientRating": 4.91,
    "reviewCount": 440,
    "totalSurgeries": 10,
    "successfulSurgeries": 10,
    "inRecoverySurgeries": 0,
    "totalConsultations": 18900,
    "avgWaitTime": "10 mins",
    "councilRegNo": "MCI-TS-32109",
    "languages": [
      "English",
      "Telugu",
      "Kannada",
      "Hindi"
    ],
    "education": [
      {
        "degree": "MBBS",
        "institution": "KMC Manipal",
        "year": "2007"
      },
      {
        "degree": "FNB - Infectious Diseases",
        "institution": "Hinduja Hospital Mumbai",
        "year": "2013"
      }
    ],
    "certifications": [
      "Infectious Diseases Society of America Member",
      "NABH Infection Control Lead"
    ],
    "proceduresTreated": [
      "Multidrug-Resistant Bacterial Care",
      "Tropical Fever Management",
      "Antibiotic Stewardship Protocol",
      "Travel Medicine"
    ],
    "insuranceAccepted": [
      "Star Health",
      "Care Health",
      "Niva Bupa"
    ],
    "patientReviews": [
      {
        "patientName": "Kishore Kumar",
        "rating": 5,
        "date": "2026-09-12",
        "comment": "Diagnosed a rare tropical infection accurately when others were stumped."
      }
    ]
  }
],

  patients: [
    {
      id: "PAT-2026-8801",
      mrn: "MRN-098801",
      name: "Rameshwar Prasad Sharma",
      age: 58,
      gender: "Male",
      bloodGroup: "B+",
      phone: "+91 98765 43210",
      email: "r.sharma@example.com",
      address: "Flat 402, Sai Krishna Enclave, Madhapur, Hyderabad",
      emergencyContact: "Sunita Sharma (Wife) - +91 98765 43211",
      allergies: ["Penicillin", "Sulfa Drugs", "NSAIDs (Mild)"],
      chronicConditions: ["Type 2 Diabetes Mellitus", "Hypertension", "Coronary Artery Disease"],
      vitals: { bp: "138/88 mmHg", pulse: "78 bpm", temp: "98.4 °F", spo2: "98%", weight: "74 kg", height: "172 cm", bmi: "25.0" },
      vitalsHistory: [
        { date: "09/11", time: "08:00 AM", systolic: 158, diastolic: 96, pulse: 94, spo2: 96, temp: 98.8, bloodSugar: 186, weight: 75.2, notes: "Initial admission triage" },
        { date: "09/12", time: "08:00 AM", systolic: 152, diastolic: 92, pulse: 88, spo2: 97, temp: 98.6, bloodSugar: 168, weight: 75.0, notes: "Pre-angioplasty workup" },
        { date: "09/13", time: "08:00 AM", systolic: 146, diastolic: 90, pulse: 82, spo2: 97, temp: 98.4, bloodSugar: 154, weight: 74.8, notes: "Post-stent stabilization" },
        { date: "09/14", time: "08:00 AM", systolic: 142, diastolic: 88, pulse: 80, spo2: 98, temp: 98.5, bloodSugar: 142, weight: 74.5, notes: "Titrating antihypertensives" },
        { date: "09/15", time: "08:00 AM", systolic: 140, diastolic: 86, pulse: 76, spo2: 98, temp: 98.4, bloodSugar: 136, weight: 74.2, notes: "Step-down ward recovery" },
        { date: "09/16", time: "08:00 AM", systolic: 138, diastolic: 84, pulse: 75, spo2: 99, temp: 98.3, bloodSugar: 128, weight: 74.0, notes: "Good response to meds" },
        { date: "09/17", time: "08:00 AM", systolic: 134, diastolic: 82, pulse: 74, spo2: 99, temp: 98.4, bloodSugar: 122, weight: 74.0, notes: "Target vitals achieved" }
      ],
      insurance: { provider: "Star Health Insurance", policyNo: "SH-CORP-9921448", coverage: "₹10,00,000", approvedPreAuth: "₹2,50,000", tpa: "Medi Assist TPA" },
      status: "Inpatient",
      ward: "Cardiology Step-Down (Ward 4B)",
      bedNo: "4B-108",
      attendingDoctor: "Dr. Ananya Mukherjee",
      registeredDate: "2026-03-12",
      admissionDate: "2026-03-15",
      photo: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300&auto=format&fit=crop&q=80",
      consultationsHistory: [
        {
          consultationId: "CNS-2026-101",
          doctorId: "DOC-102",
          doctorName: "Dr. Ananya Mukherjee",
          specialty: "Interventional Cardiology",
          department: "Cardiology",
          room: "OPD-302 (Block A)",
          date: "2026-09-17",
          time: "10:30 AM",
          type: "Post-Angioplasty Specialist Review",
          diagnosis: "CAD s/p PTCA to LAD, Essential Hypertension",
          vitalsAtConsult: "BP 134/82 mmHg, Pulse 74 bpm, SpO2 99%",
          clinicalNotes: "Patient is recovering well post LAD drug-eluting stent. No chest pain or exertional dyspnea. Lipid panel and renal function tests stable. Advised 30 min morning walk.",
          prescribedMeds: ["Tab. Ticagrelor 90mg BID", "Tab. Rosuvastatin 20mg + Ezetimibe 10mg HS", "Tab. Telmisartan 40mg + Amlodipine 5mg OD", "Tab. Metoprolol ER 25mg OD"],
          followUp: "Review after 4 weeks with repeat Lipid Profile.",
          status: "Completed"
        },
        {
          consultationId: "CNS-2026-088",
          doctorId: "DOC-101",
          doctorName: "Dr. Arvind Swaminathan",
          specialty: "Emergency & Trauma Medicine",
          department: "Emergency",
          room: "Trauma Bay 1",
          date: "2026-09-11",
          time: "08:15 AM",
          type: "Emergency Cardiac Triage",
          diagnosis: "Acute Coronary Syndrome / Unstable Angina",
          vitalsAtConsult: "BP 158/96 mmHg, Pulse 94 bpm, SpO2 96%",
          clinicalNotes: "Patient presented with severe retrosternal chest tightness radiating to left arm. Troponin-I elevated (0.84 ng/mL). Loaded with Aspirin 300mg, Clopidogrel 300mg, Atorvastatin 80mg and transferred urgently to Cath Lab.",
          prescribedMeds: ["Loading Dose Dual Antiplatelets", "IV Heparin 5000 IU", "Sublingual Nitroglycerin"],
          followUp: "Immediate Cath Lab intervention under Dr. Ananya Mukherjee.",
          status: "Completed"
        },
        {
          consultationId: "CNS-2026-042",
          doctorId: "DOC-108",
          doctorName: "Dr. Harsh Vardhan",
          specialty: "Gastroenterology & Hepatology",
          department: "Gastroenterology",
          room: "OPD-310 (Block A)",
          date: "2026-08-04",
          time: "11:00 AM",
          type: "OPD Specialist Consult",
          diagnosis: "Grade 1 Non-Alcoholic Fatty Liver Disease (NAFLD)",
          vitalsAtConsult: "BP 138/86 mmHg, Pulse 78 bpm",
          clinicalNotes: "Liver ultrasound showed mild steatosis. SGPT/SGOT mildly elevated. Advised dietary lifestyle modification and strict carb control.",
          prescribedMeds: ["Tab. Saroglitazar 4mg OD", "Cap. Vitamin E 400mg OD"],
          followUp: "Review LFTs in 3 months.",
          status: "Completed"
        }
      ]
    },
    {
      id: "PAT-2026-8802",
      mrn: "MRN-098802",
      name: "Sneha Jennifer Thomas",
      age: 32,
      gender: "Female",
      bloodGroup: "O+",
      phone: "+91 98112 33445",
      email: "sneha.thomas@example.com",
      address: "House 12, Road No 3, Banjara Hills, Hyderabad",
      emergencyContact: "Kevin Thomas (Husband) - +91 98112 33446",
      allergies: ["Latex"],
      chronicConditions: ["None reported"],
      vitals: { bp: "116/74 mmHg", pulse: "72 bpm", temp: "98.6 °F", spo2: "99%", weight: "58 kg", height: "164 cm", bmi: "21.6" },
      vitalsHistory: [
        { date: "07/15", time: "10:00 AM", systolic: 112, diastolic: 70, pulse: 70, spo2: 99, temp: 98.4, bloodSugar: 92, weight: 55.4, notes: "1st Trimester visit" },
        { date: "08/10", time: "10:30 AM", systolic: 114, diastolic: 72, pulse: 72, spo2: 99, temp: 98.6, bloodSugar: 96, weight: 56.5, notes: "Routine antenatal check" },
        { date: "08/28", time: "11:00 AM", systolic: 115, diastolic: 74, pulse: 74, spo2: 99, temp: 98.5, bloodSugar: 94, weight: 57.2, notes: "Normal fetal growth" },
        { date: "09/17", time: "09:30 AM", systolic: 116, diastolic: 74, pulse: 72, spo2: 99, temp: 98.6, bloodSugar: 98, weight: 58.0, notes: "24-week anomaly check" }
      ],
      insurance: { provider: "HDFC ERGO Health", policyNo: "HDFC-IND-88129", coverage: "₹5,00,000", approvedPreAuth: "₹0", tpa: "Vidal Health TPA" },
      status: "Outpatient",
      ward: "N/A",
      bedNo: "N/A",
      attendingDoctor: "Dr. Priya Sundaram",
      registeredDate: "2026-01-20",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      consultationsHistory: [
        {
          consultationId: "CNS-2026-102",
          doctorId: "DOC-104",
          doctorName: "Dr. Priya Sundaram",
          specialty: "Obstetrics & High-Risk Pregnancy",
          department: "Obstetrics & Gynaecology",
          room: "OPD-201 (Block C)",
          date: "2026-09-17",
          time: "09:30 AM",
          type: "2nd Trimester Routine Antenatal Consult",
          diagnosis: "Antenatal 24 Weeks Gestation, Mild Gestational Anemia (Hb 10.4 g/dL)",
          vitalsAtConsult: "BP 116/74 mmHg, Pulse 72 bpm, Weight 58 kg",
          clinicalNotes: "Fetal heart rate 142 bpm, active fetal kicks noted. Anomaly scan shows normal intracranial anatomy, 4-chamber heart, intact spine. Started on Ferrous Ascorbate and DHA.",
          prescribedMeds: ["Tab. Ferrous Ascorbate 100mg + Folic Acid 1.5mg", "Tab. Calcium Carbonate 500mg + Vit D3", "Cap. DHA 200mg"],
          followUp: "Next routine antenatal visit and scan at 28 weeks.",
          status: "Completed"
        },
        {
          consultationId: "CNS-2026-061",
          doctorId: "DOC-110",
          doctorName: "Dr. Tarun Sen",
          specialty: "Consultant Radiologist",
          department: "Radiology",
          room: "RIS/PACS Console 2",
          date: "2026-09-17",
          time: "08:45 AM",
          type: "Targeted Fetal Anomaly Ultrasound",
          diagnosis: "Single live intrauterine gestation, 24 weeks 2 days, normal morphology",
          vitalsAtConsult: "N/A",
          clinicalNotes: "Placenta anterior high, AFI 14.2 cm. Estimated fetal weight 640g. No structural anomalies detected.",
          prescribedMeds: [],
          followUp: "Third trimester growth scan at 32 weeks.",
          status: "Completed"
        }
      ]
    },
    {
      id: "PAT-2026-8803",
      mrn: "MRN-098803",
      name: "Venkata Satyanarayana Reddy",
      age: 67,
      gender: "Male",
      bloodGroup: "A+",
      phone: "+91 99887 76655",
      email: "vs.reddy@example.com",
      address: "Plot 88, Jubilee Hills, Hyderabad",
      emergencyContact: "Suresh Reddy (Son) - +91 99887 76650",
      allergies: ["Ciprofloxacin", "Contrast Media (Iodine)"],
      chronicConditions: ["COPD Gold Stage II", "Chronic Kidney Disease Stage 3", "Benign Prostatic Hyperplasia"],
      vitals: { bp: "148/92 mmHg", pulse: "84 bpm", temp: "99.1 °F", spo2: "94%", weight: "68 kg", height: "168 cm", bmi: "24.1" },
      vitalsHistory: [
        { date: "09/14", time: "02:00 AM", systolic: 165, diastolic: 102, pulse: 110, spo2: 87, temp: 99.8, bloodSugar: 145, weight: 68.5, notes: "Acute exacerbation / MICU admission" },
        { date: "09/14", time: "02:00 PM", systolic: 158, diastolic: 98, pulse: 98, spo2: 90, temp: 99.5, bloodSugar: 140, weight: 68.4, notes: "BiPAP support initiated" },
        { date: "09/15", time: "08:00 AM", systolic: 154, diastolic: 95, pulse: 92, spo2: 92, temp: 99.2, bloodSugar: 135, weight: 68.2, notes: "Bronchodilators & IV steroids" },
        { date: "09/16", time: "08:00 AM", systolic: 150, diastolic: 92, pulse: 88, spo2: 93, temp: 99.0, bloodSugar: 130, weight: 68.0, notes: "Weaning from BiPAP to nasal cannula" },
        { date: "09/17", time: "08:00 AM", systolic: 148, diastolic: 90, pulse: 84, spo2: 94, temp: 99.1, bloodSugar: 128, weight: 68.0, notes: "Stable on 2L O2" }
      ],
      insurance: { provider: "Care Health Insurance", policyNo: "CARE-SR-440192", coverage: "₹15,00,000", approvedPreAuth: "₹4,00,000", tpa: "FHPL TPA" },
      status: "ICU",
      ward: "Medical ICU (MICU)",
      bedNo: "MICU-03",
      attendingDoctor: "Dr. Farhan Siddiqui",
      registeredDate: "2026-02-10",
      admissionDate: "2026-03-14",
      photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&auto=format&fit=crop&q=80",
      consultationsHistory: [
        {
          consultationId: "CNS-2026-103",
          doctorId: "DOC-106",
          doctorName: "Dr. Farhan Siddiqui",
          specialty: "Pulmonology & Critical Care",
          department: "Pulmonology",
          room: "ICU-Consult",
          date: "2026-09-17",
          time: "08:00 AM",
          type: "ICU Critical Care Rounds",
          diagnosis: "Acute Exacerbation of COPD, Type 2 Respiratory Failure resolving",
          vitalsAtConsult: "BP 148/90 mmHg, Pulse 84 bpm, SpO2 94% on 2L nasal O2",
          clinicalNotes: "BiPAP successfully weaned. Rhonchi significantly reduced. ABG shows pH 7.37, pCO2 48 mmHg (improved from 68 mmHg). Step-down to Respiratory Ward planned tomorrow.",
          prescribedMeds: ["Neb. Ipratropium + Levosalbutamol Q6H", "Neb. Budecort 0.5mg BD", "Tab. Doxofylline 400mg BD", "IV Hydrocortisone 100mg Q8H (tapering)"],
          followUp: "Transfer to Step-Down ward in 24 hours.",
          status: "Active Care"
        },
        {
          consultationId: "CNS-2026-091",
          doctorId: "DOC-103",
          doctorName: "Dr. Vikramaditya Rao",
          specialty: "Neurology & Stroke Specialist",
          department: "Neurology",
          room: "OPD-405 (Block B)",
          date: "2026-09-17",
          time: "12:00 PM",
          type: "Cross-Department Neurology Consult",
          diagnosis: "Senile Tremor & Peripheral Neuropathy",
          vitalsAtConsult: "BP 148/92 mmHg, Pulse 84 bpm",
          clinicalNotes: "Evaluated for mild resting hand tremors. Ruled out acute stroke. Recommended serum B12 titration.",
          prescribedMeds: ["Tab. Methylcobalamin 1500mcg + Pregabalin 75mg OD"],
          followUp: "Neurology OPD follow-up post hospital discharge.",
          status: "Completed"
        }
      ]
    },
    {
      id: "PAT-2026-8804",
      mrn: "MRN-098804",
      name: "Ayesha Fatima Khan",
      age: 24,
      gender: "Female",
      bloodGroup: "AB+",
      phone: "+91 97001 23456",
      email: "ayesha.f.khan@example.com",
      address: "18-2-44, Mehdipatnam, Hyderabad",
      emergencyContact: "Farooq Khan (Father) - +91 97001 23450",
      allergies: ["Peanuts", "Aspirin"],
      chronicConditions: ["Bronchial Asthma"],
      vitals: { bp: "110/70 mmHg", pulse: "88 bpm", temp: "101.4 °F", spo2: "96%", weight: "52 kg", height: "158 cm", bmi: "20.8" },
      vitalsHistory: [
        { date: "09/17", time: "10:15 AM", systolic: 130, diastolic: 85, pulse: 128, spo2: 89, temp: 101.4, bloodSugar: 110, weight: 52.0, notes: "ER triage - acute severe bronchospasm" },
        { date: "09/17", time: "10:45 AM", systolic: 122, diastolic: 78, pulse: 108, spo2: 93, temp: 101.0, bloodSugar: 108, weight: 52.0, notes: "Post-nebulization 1st cycle" },
        { date: "09/17", time: "11:30 AM", systolic: 115, diastolic: 74, pulse: 94, spo2: 95, temp: 100.2, bloodSugar: 105, weight: 52.0, notes: "Wheeze reduced significantly" },
        { date: "09/17", time: "01:00 PM", systolic: 110, diastolic: 70, pulse: 88, spo2: 96, temp: 99.4, bloodSugar: 102, weight: 52.0, notes: "Transferred to Observation Bay" }
      ],
      insurance: { provider: "Self-Pay (Cash)", policyNo: "N/A", coverage: "N/A", approvedPreAuth: "N/A", tpa: "N/A" },
      status: "Emergency",
      ward: "Emergency Observation",
      bedNo: "ER-BAY-04",
      attendingDoctor: "Dr. Arvind Swaminathan",
      registeredDate: "2026-03-17",
      admissionDate: "2026-03-17",
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80",
      consultationsHistory: [
        {
          consultationId: "CNS-2026-104",
          doctorId: "DOC-101",
          doctorName: "Dr. Arvind Swaminathan",
          specialty: "Emergency & Trauma Medicine",
          department: "Emergency",
          room: "Trauma Bay 1",
          date: "2026-09-17",
          time: "10:15 AM",
          type: "Emergency Resuscitation & Triage",
          diagnosis: "Acute Severe Bronchial Asthma Exacerbation with marked wheeze",
          vitalsAtConsult: "BP 130/85 mmHg, Pulse 128 bpm, SpO2 89% Room Air",
          clinicalNotes: "Patient brought in with severe respiratory distress. Administered high-flow oxygen, back-to-back Salbutamol + Ipratropium nebulization, and IV Hydrocortisone 100mg. Marked relief noted within 45 minutes.",
          prescribedMeds: ["Nebulization Salbutamol + Ipratropium", "IV Hydrocortisone 100mg stat", "Tab. Montelukast 10mg + Levocetirizine 5mg HS"],
          followUp: "Observe for 6 hours before discharge with inhaler technique review.",
          status: "Active Care"
        },
        {
          consultationId: "CNS-2026-074",
          doctorId: "DOC-108",
          doctorName: "Dr. Harsh Vardhan",
          specialty: "Gastroenterology & Hepatology",
          department: "Gastroenterology",
          room: "OPD-310 (Block A)",
          date: "2026-09-17",
          time: "11:30 AM",
          type: "Gastroenterology OPD Consult",
          diagnosis: "Acid Reflux / GERD with Epigastric Burning",
          vitalsAtConsult: "BP 110/70 mmHg, Pulse 88 bpm",
          clinicalNotes: "Evaluated for concurrent epigastric burning causing nighttime coughing. Advised PPI and diet adjustments.",
          prescribedMeds: ["Tab. Pantoprazole 40mg + Domperidone 30mg OD before breakfast"],
          followUp: "Review after 2 weeks.",
          status: "Completed"
        }
      ]
    },
    {
      id: "PAT-2026-8805",
      mrn: "MRN-098805",
      name: "Gurpreet Singh Chawla",
      age: 45,
      gender: "Male",
      bloodGroup: "O-",
      phone: "+91 98200 45678",
      email: "g.chawla@example.com",
      address: "Sec 4, Kondapur, Hyderabad",
      emergencyContact: "Harpreet Kaur (Wife) - +91 98200 45670",
      allergies: ["None known"],
      chronicConditions: ["Lumbar Spondylolisthesis L4-L5"],
      vitals: { bp: "124/80 mmHg", pulse: "74 bpm", temp: "98.2 °F", spo2: "99%", weight: "82 kg", height: "178 cm", bmi: "25.9" },
      vitalsHistory: [
        { date: "09/15", time: "09:00 AM", systolic: 132, diastolic: 86, pulse: 78, spo2: 98, temp: 98.4, bloodSugar: 105, weight: 82.5, notes: "Pre-surgical admission check" },
        { date: "09/16", time: "07:00 AM", systolic: 126, diastolic: 82, pulse: 76, spo2: 99, temp: 98.2, bloodSugar: 98, weight: 82.0, notes: "Pre-operative holding area" },
        { date: "09/16", time: "04:00 PM", systolic: 120, diastolic: 78, pulse: 82, spo2: 99, temp: 98.6, bloodSugar: 112, weight: 82.0, notes: "Immediate PACU recovery" },
        { date: "09/17", time: "08:00 AM", systolic: 124, diastolic: 80, pulse: 74, spo2: 99, temp: 98.2, bloodSugar: 100, weight: 82.0, notes: "Post-Op Day 1, pain controlled" }
      ],
      insurance: { provider: "Niva Bupa Health Insurance", policyNo: "NB-CORP-33910", coverage: "₹10,00,000", approvedPreAuth: "₹1,80,000", tpa: "Health Insurance TPA" },
      status: "Post-Op",
      ward: "Orthopaedics Special Ward",
      bedNo: "ORTHO-204",
      attendingDoctor: "Dr. Rajesh K. Nair",
      registeredDate: "2026-02-28",
      admissionDate: "2026-03-16",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
      consultationsHistory: [
        {
          consultationId: "CNS-2026-105",
          doctorId: "DOC-105",
          doctorName: "Dr. Rajesh K. Nair",
          specialty: "Orthopaedics & Joint Replacement",
          department: "Orthopaedics",
          room: "OPD-108 (Block A)",
          date: "2026-09-17",
          time: "08:30 AM",
          type: "Post-Operative Orthopaedic Rounds",
          diagnosis: "Lumbar Spondylolisthesis L4-L5 s/p Microdiscectomy and Decompression",
          vitalsAtConsult: "BP 124/80 mmHg, Pulse 74 bpm, Pain Score 2/10",
          clinicalNotes: "Surgical wound clean, drain output minimal (15 ml). Lower limb straight leg raise negative. Power 5/5 bilateral lower limbs. Mobilized with walker under physiotherapist guidance.",
          prescribedMeds: ["Tab. Etoricoxib 90mg OD (5 days)", "Tab. Pregabalin 75mg HS", "Tab. Pantoprazole 40mg OD", "Physiotherapy gentle ambulation"],
          followUp: "Suture removal on Day 12. Review in Ortho OPD after 2 weeks.",
          status: "Active Care"
        }
      ]
    },
    {
      id: "PAT-2026-8806",
      mrn: "MRN-098806",
      name: "Master Aarav Karthik",
      age: 6,
      gender: "Male",
      bloodGroup: "B-",
      phone: "+91 98490 98765",
      email: "karthik.parents@example.com",
      address: "Villa 14, Gachibowli, Hyderabad",
      emergencyContact: "Karthik Subramanian (Father) - +91 98490 98765",
      allergies: ["Egg Protein"],
      chronicConditions: ["Febrile Seizures history"],
      vitals: { bp: "96/60 mmHg", pulse: "102 bpm", temp: "99.8 °F", spo2: "98%", weight: "21 kg", height: "114 cm", bmi: "16.2" },
      vitalsHistory: [
        { date: "09/15", time: "06:00 PM", systolic: 102, diastolic: 64, pulse: 126, spo2: 97, temp: 102.6, bloodSugar: 88, weight: 21.0, notes: "High fever onset, paracetamol given" },
        { date: "09/16", time: "09:00 AM", systolic: 98, diastolic: 62, pulse: 114, spo2: 98, temp: 101.0, bloodSugar: 92, weight: 21.0, notes: "Fever defervescence with hydration" },
        { date: "09/17", time: "10:00 AM", systolic: 96, diastolic: 60, pulse: 102, spo2: 98, temp: 99.8, bloodSugar: 90, weight: 21.0, notes: "Active, chest clear on auscultation" }
      ],
      insurance: { provider: "Bajaj Allianz General", policyNo: "BAG-FAM-77189", coverage: "₹8,00,000", approvedPreAuth: "₹0", tpa: "Paramount TPA" },
      status: "Outpatient",
      ward: "N/A",
      bedNo: "N/A",
      attendingDoctor: "Dr. Meenakshi Iyer",
      registeredDate: "2026-03-01",
      photo: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80",
      consultationsHistory: [
        {
          consultationId: "CNS-2026-106",
          doctorId: "DOC-107",
          doctorName: "Dr. Meenakshi Iyer",
          specialty: "Paediatrics & Neonatology",
          department: "Paediatrics",
          room: "OPD-112 (Block B)",
          date: "2026-09-17",
          time: "10:00 AM",
          type: "Paediatric Follow-up Consult",
          diagnosis: "Upper Respiratory Tract Infection, Resolving Febrile Episode",
          vitalsAtConsult: "Temp 99.8 °F, Pulse 102 bpm, SpO2 98%, Weight 21 kg",
          clinicalNotes: "Child is alert, playful, accepting fluids. Throat congestion reduced. Chest clear bilaterally. Paracetamol SOS advised for fever spikes.",
          prescribedMeds: ["Syr. Paracetamol 250mg/5ml (5ml SOS)", "Syr. Cetirizine 2.5ml HS (3 days)", "Saline nasal drops 2 drops in each nostril TID"],
          followUp: "Review if fever persists beyond 48 hours.",
          status: "Completed"
        }
      ]
    }
  ],

  doctorSlots: [
    { id: "SLOT-201", doctorId: "DOC-101", doctorName: "Dr. Ananya Reddy", department: "Cardiology", room: "OPD-302 (Block A)", date: new Date().toISOString().split('T')[0], startTime: "09:00 AM", endTime: "09:30 AM", capacity: 5, bookedCount: 3, avgConsultTimeMins: 10, status: "Active" },
    { id: "SLOT-202", doctorId: "DOC-101", doctorName: "Dr. Ananya Reddy", department: "Cardiology", room: "OPD-302 (Block A)", date: new Date().toISOString().split('T')[0], startTime: "09:30 AM", endTime: "10:00 AM", capacity: 5, bookedCount: 5, avgConsultTimeMins: 10, status: "Full" },
    { id: "SLOT-203", doctorId: "DOC-102", doctorName: "Dr. Rohan Sharma", department: "Orthopaedics", room: "OPD-108 (Block A)", date: new Date().toISOString().split('T')[0], startTime: "10:00 AM", endTime: "10:30 AM", capacity: 4, bookedCount: 2, avgConsultTimeMins: 15, status: "Active" },
    { id: "SLOT-204", doctorId: "DOC-103", doctorName: "Dr. Priya Nair", department: "Paediatrics", room: "OPD-204 (Block B)", date: new Date().toISOString().split('T')[0], startTime: "10:30 AM", endTime: "11:00 AM", capacity: 6, bookedCount: 4, avgConsultTimeMins: 10, status: "Active" },
    { id: "SLOT-205", doctorId: "DOC-104", doctorName: "Dr. Suresh Babu", department: "Neurology", room: "OPD-405 (Block B)", date: new Date().toISOString().split('T')[0], startTime: "11:00 AM", endTime: "11:30 AM", capacity: 4, bookedCount: 1, avgConsultTimeMins: 15, status: "Active" },
    { id: "SLOT-206", doctorId: "DOC-105", doctorName: "Dr. Meera Iyer", department: "Obstetrics & Gynaecology", room: "OPD-201 (Block C)", date: new Date().toISOString().split('T')[0], startTime: "11:30 AM", endTime: "12:00 PM", capacity: 5, bookedCount: 2, avgConsultTimeMins: 12, status: "Active" },
    { id: "SLOT-207", doctorId: "DOC-101", doctorName: "Dr. Ananya Reddy", department: "Cardiology", room: "OPD-302 (Block A)", date: new Date(Date.now() + 86400000).toISOString().split('T')[0], startTime: "09:00 AM", endTime: "09:30 AM", capacity: 5, bookedCount: 1, avgConsultTimeMins: 10, status: "Active" },
    { id: "SLOT-208", doctorId: "DOC-102", doctorName: "Dr. Rohan Sharma", department: "Orthopaedics", room: "OPD-108 (Block A)", date: new Date(Date.now() + 86400000).toISOString().split('T')[0], startTime: "10:00 AM", endTime: "10:30 AM", capacity: 4, bookedCount: 2, avgConsultTimeMins: 15, status: "Active" }
  ],

  opdAppointments: [
    { id: "APT-1001", token: "T-101", slotId: "SLOT-201", patientId: "PAT-2026-8802", patientName: "Sneha Jennifer Thomas", patientPhone: "+91 98112 33445", doctorId: "DOC-101", doctorName: "Dr. Ananya Reddy", department: "Cardiology", room: "OPD-302 (Block A)", time: "09:30 AM", date: new Date().toISOString().split('T')[0], status: "In-Consultation", reason: "Post-Angioplasty Stent follow-up & lipid profile titration", type: "Follow-up", checkInTime: "09:15 AM", estimatedWaitMins: 0, queuePosition: 0, reminderSent: true, reminderChannel: "WhatsApp", reminderTime: "Yesterday 06:00 PM" },
    { id: "APT-1002", token: "T-102", slotId: "SLOT-203", patientId: "PAT-2026-8806", patientName: "Master Aarav Karthik", patientPhone: "+91 98490 98765", doctorId: "DOC-102", doctorName: "Dr. Rohan Sharma", department: "Orthopaedics", room: "OPD-108 (Block A)", time: "10:00 AM", date: new Date().toISOString().split('T')[0], status: "Checked-In", reason: "Persistent dry cough and mild fever past 4 days", type: "General", checkInTime: "09:40 AM", estimatedWaitMins: 10, queuePosition: 1, reminderSent: true, reminderChannel: "SMS", reminderTime: "Yesterday 06:15 PM" },
    { id: "APT-1003", token: "T-103", slotId: "SLOT-204", patientId: "PAT-2026-8801", patientName: "Rameshwar Prasad Sharma", patientPhone: "+91 98765 43210", doctorId: "DOC-103", doctorName: "Dr. Priya Nair", department: "Paediatrics", room: "OPD-204 (Block B)", time: "10:30 AM", date: new Date().toISOString().split('T')[0], status: "Completed", reason: "Routine wellness check & pediatric growth assessment", type: "Post-Procedure", checkInTime: "10:05 AM", estimatedWaitMins: 0, queuePosition: 0, reminderSent: true, reminderChannel: "WhatsApp", reminderTime: "Yesterday 06:30 PM" },
    { id: "APT-1004", token: "T-104", slotId: "SLOT-205", patientId: "PAT-2026-8805", patientName: "Gurpreet Singh Chawla", patientPhone: "+91 98200 45678", doctorId: "DOC-105", doctorName: "Dr. Meera Iyer", department: "Obstetrics & Gynaecology", room: "OPD-201 (Block C)", time: "11:00 AM", date: new Date().toISOString().split('T')[0], status: "Checked-In", reason: "Severe lower back radiculopathy pain evaluation", type: "Specialist Consult", checkInTime: "10:35 AM", estimatedWaitMins: 24, queuePosition: 2, reminderSent: false, reminderChannel: null, reminderTime: null },
    { id: "APT-1005", token: "T-105", slotId: "SLOT-206", patientId: "PAT-2026-8804", patientName: "Ayesha Fatima Khan", patientPhone: "+91 97001 23456", doctorId: "DOC-104", doctorName: "Dr. Suresh Babu", department: "Neurology", room: "OPD-405 (Block B)", time: "11:30 AM", date: new Date().toISOString().split('T')[0], status: "Booked", reason: "Acid reflux and intermittent epigastric distress", type: "New Patient", checkInTime: null, estimatedWaitMins: 35, queuePosition: 3, reminderSent: true, reminderChannel: "WhatsApp", reminderTime: "Today 08:00 AM" },
    { id: "APT-1006", token: "T-106", slotId: "SLOT-207", patientId: "PAT-2026-8803", patientName: "Venkata Satyanarayana Reddy", patientPhone: "+91 99887 76655", doctorId: "DOC-101", doctorName: "Dr. Ananya Reddy", department: "Cardiology", room: "OPD-302 (Block A)", time: "12:00 PM", date: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: "Booked", reason: "Tremor assessment and nerve conduction velocity review", type: "Specialist Consult", checkInTime: null, estimatedWaitMins: 0, queuePosition: 0, reminderSent: false, reminderChannel: null, reminderTime: null },
    { id: "APT-1007", token: "T-107", slotId: "SLOT-208", patientId: "PAT-2026-8802", patientName: "Sneha Jennifer Thomas", patientPhone: "+91 98112 33445", doctorId: "DOC-102", doctorName: "Dr. Rohan Sharma", department: "Orthopaedics", room: "OPD-108 (Block A)", time: "10:30 AM", date: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: "Booked", reason: "Orthopaedic Follow-Up & Joint Mobility", type: "Follow-up", checkInTime: null, estimatedWaitMins: 0, queuePosition: 0, reminderSent: false, reminderChannel: null, reminderTime: null }
  ],

  tokenQueue: [
    { token: "T-101", room: "OPD-302 (Block A)", doctor: "Dr. Ananya Reddy", patient: "Sneha Jennifer Thomas", status: "In-Room", dept: "Cardiology", waitMins: 0 },
    { token: "T-102", room: "OPD-108 (Block A)", doctor: "Dr. Rohan Sharma", patient: "Master Aarav Karthik", status: "Calling", dept: "Orthopaedics", waitMins: 10 },
    { token: "T-104", room: "OPD-201 (Block C)", doctor: "Dr. Meera Iyer", patient: "Gurpreet Singh Chawla", status: "Waiting", dept: "Obstetrics & Gynaecology", waitMins: 24 },
    { token: "T-105", room: "OPD-405 (Block B)", doctor: "Dr. Suresh Babu", patient: "Ayesha Fatima Khan", status: "Waiting", dept: "Neurology", waitMins: 35 }
  ],

  prescriptions: [
    {
      id: "RX-2026-4401",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      doctorId: "DOC-102",
      doctorName: "Dr. Ananya Mukherjee",
      department: "Cardiology",
      date: "2026-09-17",
      diagnosis: "CAD s/p PTCA to LAD, Essential Hypertension",
      items: [
        { name: "Tab. Ticagrelor 90mg (Brilinta)", dosage: "1 tab twice daily (BID)", duration: "6 Months", instructions: "After meals, do not skip dose" },
        { name: "Tab. Rosuvastatin 20mg + Ezetimibe 10mg", dosage: "1 tab at bedtime (HS)", duration: "3 Months", instructions: "Night time" },
        { name: "Tab. Telmisartan 40mg + Amlodipine 5mg", dosage: "1 tab morning (OD)", duration: "1 Month", instructions: "Check BP weekly" },
        { name: "Tab. Metoprolol Succinate ER 25mg", dosage: "1 tab morning (OD)", duration: "1 Month", instructions: "Empty stomach" }
      ],
      dietAdvice: "Strict low salt (<2g/day), zero trans fats, 30 min gentle walk daily.",
      followUp: "Review after 4 weeks with Lipid Profile and Serum Creatinine."
    },
    {
      id: "RX-2026-4402",
      patientId: "PAT-2026-8802",
      patientName: "Sneha Jennifer Thomas",
      doctorId: "DOC-104",
      doctorName: "Dr. Priya Sundaram",
      department: "Obstetrics & Gynaecology",
      date: "2026-09-17",
      diagnosis: "Antenatal 24 Weeks Gestation, Mild Gestational Anemia",
      items: [
        { name: "Tab. Ferrous Ascorbate 100mg + Folic Acid 1.5mg", dosage: "1 tab daily afternoon", duration: "90 Days", instructions: "With lemon water or orange juice, avoid milk within 2 hours" },
        { name: "Tab. Calcium Carbonate 500mg + Vitamin D3", dosage: "1 tab morning", duration: "90 Days", instructions: "After breakfast" },
        { name: "Cap. DHA 200mg (Algal Source)", dosage: "1 cap at bedtime", duration: "90 Days", instructions: "Supports fetal neurodevelopment" }
      ],
      dietAdvice: "High protein diet, green leafy vegetables, dates, hydration 3L/day.",
      followUp: "Next scan and consult at 28 weeks gestation."
    }
  ],

  wards: [
    {
      id: "WARD-ICU",
      name: "Medical & Coronary ICU",
      floor: "2nd Floor, Critical Care Block",
      type: "Intensive Care Unit",
      totalBeds: 12,
      occupiedBeds: 10,
      nurseInCharge: "Sr. Nurse Reena Mathews, B.Sc Nursing",
      ratio: "1:1",
      beds: [
        { bedNo: "MICU-01", status: "Occupied", patientName: "K. Mohan Rao (62M)", diagnosis: "Septic Shock / ARDS", doctor: "Dr. Farhan Siddiqui", oxygen: true, ventilator: true, telemetry: "Active" },
        { bedNo: "MICU-02", status: "Occupied", patientName: "N. Lakshmi (54F)", diagnosis: "Post-CABG Day 1", doctor: "Dr. Ananya Mukherjee", oxygen: true, ventilator: false, telemetry: "Active" },
        { bedNo: "MICU-03", status: "Occupied", patientName: "Venkata Satyanarayana Reddy (67M)", diagnosis: "Acute on Chronic COPD", doctor: "Dr. Farhan Siddiqui", oxygen: true, ventilator: false, telemetry: "Active" },
        { bedNo: "MICU-04", status: "Available", patientName: "None", diagnosis: "None", doctor: "None", oxygen: true, ventilator: true, telemetry: "Standby" },
        { bedNo: "MICU-05", status: "Occupied", patientName: "Farid Ahmed (49M)", diagnosis: "Acute STEMI, Thrombolyzed", doctor: "Dr. Ananya Mukherjee", oxygen: true, ventilator: false, telemetry: "Active" },
        { bedNo: "MICU-06", status: "Cleaning", patientName: "Sanitization in progress", diagnosis: "None", doctor: "None", oxygen: true, ventilator: false, telemetry: "Off" },
        { bedNo: "MICU-07", status: "Occupied", patientName: "David D'Souza (71M)", diagnosis: "Acute Renal Failure + Hyperkalemia", doctor: "Dr. Farhan Siddiqui", oxygen: true, ventilator: false, telemetry: "Active" },
        { bedNo: "MICU-08", status: "Occupied", patientName: "P. Vani (41F)", diagnosis: "Severe DKA, Insulin Infusion", doctor: "Dr. Arvind Swaminathan", oxygen: true, ventilator: false, telemetry: "Active" },
        { bedNo: "MICU-09", status: "Occupied", patientName: "Syed Mastan (58M)", diagnosis: "Pneumonia / Type 1 Resp Failure", doctor: "Dr. Farhan Siddiqui", oxygen: true, ventilator: false, telemetry: "Active" },
        { bedNo: "MICU-10", status: "Occupied", patientName: "T. Balram (65M)", diagnosis: "Post-Craniotomy Observation", doctor: "Dr. Vikramaditya Rao", oxygen: true, ventilator: false, telemetry: "Active" },
        { bedNo: "MICU-11", status: "Available", patientName: "None", diagnosis: "None", doctor: "None", oxygen: true, ventilator: false, telemetry: "Standby" },
        { bedNo: "MICU-12", status: "Occupied", patientName: "Sarla Devi (78F)", diagnosis: "Hypertensive Encephalopathy", doctor: "Dr. Vikramaditya Rao", oxygen: true, ventilator: false, telemetry: "Active" }
      ]
    },
    {
      id: "WARD-CARDIO",
      name: "Cardiology Step-Down (Ward 4B)",
      floor: "4th Floor, East Wing",
      type: "Semi-Specialized Ward",
      totalBeds: 16,
      occupiedBeds: 13,
      nurseInCharge: "Sr. Nurse Angela Kurian",
      ratio: "1:4",
      beds: [
        { bedNo: "4B-101", status: "Occupied", patientName: "Subba Rao (55M)", diagnosis: "Post Angioplasty Day 2", doctor: "Dr. Ananya Mukherjee", oxygen: false, ventilator: false, telemetry: "Active" },
        { bedNo: "4B-102", status: "Occupied", patientName: "Anita Agarwal (60F)", diagnosis: "Atrial Fibrillation rate control", doctor: "Dr. Ananya Mukherjee", oxygen: false, ventilator: false, telemetry: "Active" },
        { bedNo: "4B-103", status: "Available", patientName: "None", diagnosis: "None", doctor: "None", oxygen: true, ventilator: false, telemetry: "Standby" },
        { bedNo: "4B-108", status: "Occupied", patientName: "Rameshwar Prasad Sharma (58M)", diagnosis: "Unstable Angina Stabilized", doctor: "Dr. Ananya Mukherjee", oxygen: true, ventilator: false, telemetry: "Active" },
        { bedNo: "4B-109", status: "Cleaning", patientName: "Linen Change", diagnosis: "None", doctor: "None", oxygen: true, ventilator: false, telemetry: "Off" },
        { bedNo: "4B-110", status: "Available", patientName: "None", diagnosis: "None", doctor: "None", oxygen: true, ventilator: false, telemetry: "Standby" }
      ]
    },
    {
      id: "WARD-ORTHO",
      name: "Orthopaedics & Joint Care (Ward 2A)",
      floor: "2nd Floor, West Wing",
      type: "Surgical Ward",
      totalBeds: 20,
      occupiedBeds: 15,
      nurseInCharge: "Sr. Nurse Sunitha Bai",
      ratio: "1:5",
      beds: [
        { bedNo: "ORTHO-201", status: "Occupied", patientName: "Harish Patel (42M)", diagnosis: "ACL Reconstruction Post-Op D1", doctor: "Dr. Rajesh K. Nair", oxygen: false, ventilator: false, telemetry: "None" },
        { bedNo: "ORTHO-204", status: "Occupied", patientName: "Gurpreet Singh Chawla (45M)", diagnosis: "L4-L5 Microdiscectomy Pre-Op", doctor: "Dr. Rajesh K. Nair", oxygen: false, ventilator: false, telemetry: "Active" },
        { bedNo: "ORTHO-205", status: "Available", patientName: "None", diagnosis: "None", doctor: "None", oxygen: true, ventilator: false, telemetry: "Standby" }
      ]
    }
  ],

  emergencyCases: [
    {
      id: "EMG-2026-901",
      caseNo: "ER-0901",
      patientName: "Ayesha Fatima Khan",
      age: 24,
      gender: "Female",
      arrivalTime: "10:14 AM (16 min ago)",
      triageLevel: "ESI Level 2 - Emergent",
      triageColor: "rose",
      chiefComplaint: "Acute severe bronchospasm, refractory to home salbutamol inhaler, marked stridor",
      vitals: { bp: "110/70", hr: "128", rr: "32/min", spo2: "89% on Room Air", temp: "99.2 °F", gcs: "15/15" },
      assignedBay: "Resuscitation Bay 2",
      attendingDoctor: "Dr. Arvind Swaminathan",
      status: "Nebulization & IV Hydrocortisone in progress",
      depositPaid: 5000
    },
    {
      id: "EMG-2026-902",
      caseNo: "ER-0902",
      patientName: "Kiran Kumar (40M)",
      age: 40,
      gender: "Male",
      arrivalTime: "09:40 AM (50 min ago)",
      triageLevel: "ESI Level 1 - Resuscitation",
      triageColor: "rose",
      chiefComplaint: "Polytrauma, Road Traffic Accident (2-Wheeler vs Truck), Hemorrhagic Shock, Closed Pelvic Fracture",
      vitals: { bp: "82/50", hr: "134", rr: "28/min", spo2: "92% (15L Non-rebreather)", temp: "97.4 °F", gcs: "10/15" },
      assignedBay: "Trauma Bay 1 (Red Zone)",
      attendingDoctor: "Dr. Arvind Swaminathan",
      status: "Massive Transfusion Protocol Activated, 2 Units O-Negative transfusing",
      depositPaid: 25000
    },
    {
      id: "EMG-2026-903",
      caseNo: "ER-0903",
      patientName: "Deepa Narayan (52F)",
      age: 52,
      gender: "Female",
      arrivalTime: "10:00 AM (30 min ago)",
      triageLevel: "ESI Level 3 - Urgent",
      triageColor: "amber",
      chiefComplaint: "Sudden onset severe right upper quadrant abdominal pain radiating to scapula, recurrent vomiting",
      vitals: { bp: "136/84", hr: "90", rr: "20/min", spo2: "98%", temp: "100.4 °F", gcs: "15/15" },
      assignedBay: "Observation Bay 5",
      attendingDoctor: "Dr. Harsh Vardhan",
      status: "Bedside USG done: Acute Calculous Cholecystitis, IV analgesics given",
      depositPaid: 3500
    }
  ],

  drugsMaster: [
    {
      id: "DRUG-001",
      brandName: "Brilinta 90mg",
      genericName: "Ticagrelor",
      strength: "90mg",
      strengthMg: 90,
      category: "Antiplatelet (P2Y12 Inhibitor)",
      maxDailyDoseMg: 180,
      defaultFrequency: "1 tab BID (Twice daily)",
      route: "Oral",
      allergyClasses: ["Ticagrelor", "Antiplatelet"],
      pediatricSafe: false,
      pediatricMgPerKg: 0,
      description: "Platelet aggregation inhibitor for acute coronary syndrome and post-coronary stenting."
    },
    {
      id: "DRUG-002",
      brandName: "Rozavel-EZ 20/10",
      genericName: "Rosuvastatin + Ezetimibe",
      strength: "20mg + 10mg",
      strengthMg: 30,
      category: "Lipid Lowering / Statin",
      maxDailyDoseMg: 50,
      defaultFrequency: "1 tab HS (Bedtime)",
      route: "Oral",
      allergyClasses: ["Statins"],
      pediatricSafe: false,
      pediatricMgPerKg: 0,
      description: "Dual action LDL reducer combining HMG-CoA reductase inhibitor and cholesterol absorption blocker."
    },
    {
      id: "DRUG-003",
      brandName: "Augmentin 625 Duo",
      genericName: "Amoxicillin + Clavulanic Acid",
      strength: "500mg + 125mg",
      strengthMg: 625,
      category: "Broad Spectrum Antibiotic (Penicillin class)",
      maxDailyDoseMg: 2000,
      defaultFrequency: "1 tab BD (Twice daily)",
      route: "Oral",
      allergyClasses: ["Penicillin", "Beta-Lactam"],
      pediatricSafe: true,
      pediatricMgPerKg: 20,
      description: "Bactericidal aminopenicillin with beta-lactamase inhibitor for respiratory and soft tissue infections."
    },
    {
      id: "DRUG-004",
      brandName: "Dolo 650 / Calpol",
      genericName: "Paracetamol (Acetaminophen)",
      strength: "650mg",
      strengthMg: 650,
      category: "Analgesic & Antipyretic",
      maxDailyDoseMg: 4000,
      defaultFrequency: "1 tab TDS (Thrice daily)",
      route: "Oral",
      allergyClasses: ["Paracetamol"],
      pediatricSafe: true,
      pediatricMgPerKg: 15,
      description: "Centrally acting antipyretic and analgesic. Strict adult ceiling 4000mg/day to prevent hepatotoxicity."
    },
    {
      id: "DRUG-005",
      brandName: "Ciplox 500",
      genericName: "Ciprofloxacin Hydrochloride",
      strength: "500mg",
      strengthMg: 500,
      category: "Fluoroquinolone Antibiotic",
      maxDailyDoseMg: 1500,
      defaultFrequency: "1 tab BD (Twice daily)",
      route: "Oral",
      allergyClasses: ["Ciprofloxacin", "Fluoroquinolones"],
      pediatricSafe: false,
      pediatricMgPerKg: 0,
      description: "DNA gyrase inhibitor bactericidal antibiotic. High CYP1A2 interaction profile with methylxanthines."
    },
    {
      id: "DRUG-006",
      brandName: "Ecosprin 75 / 150",
      genericName: "Aspirin (Acetylsalicylic Acid)",
      strength: "75mg",
      strengthMg: 75,
      category: "NSAID / Antiplatelet",
      maxDailyDoseMg: 325,
      defaultFrequency: "1 tab OD (After lunch)",
      route: "Oral",
      allergyClasses: ["Aspirin", "NSAIDs", "Salicylates"],
      pediatricSafe: false,
      pediatricMgPerKg: 0,
      description: "Irreversible COX-1 inhibitor antiplatelet. Contraindicated in active peptic ulcer and children (Reye's syndrome)."
    },
    {
      id: "DRUG-007",
      brandName: "Brufen 400",
      genericName: "Ibuprofen",
      strength: "400mg",
      strengthMg: 400,
      category: "NSAID (Analgesic & Anti-inflammatory)",
      maxDailyDoseMg: 2400,
      defaultFrequency: "1 tab TDS (After food)",
      route: "Oral",
      allergyClasses: ["Ibuprofen", "NSAIDs", "Aspirin"],
      pediatricSafe: true,
      pediatricMgPerKg: 10,
      description: "Non-selective COX inhibitor for musculoskeletal pain, fever, and inflammation. Blunts aspirin cardio-protection."
    },
    {
      id: "DRUG-008",
      brandName: "Deriphyllin Retard 150mg",
      genericName: "Theophylline + Etofylline",
      strength: "150mg",
      strengthMg: 150,
      category: "Bronchodilator (Methylxanthine)",
      maxDailyDoseMg: 600,
      defaultFrequency: "1 tab BD (Twice daily)",
      route: "Oral",
      allergyClasses: ["Theophylline", "Xanthines"],
      pediatricSafe: true,
      pediatricMgPerKg: 5,
      description: "Phosphodiesterase inhibitor bronchodilator for bronchial asthma and COPD. Narrow therapeutic index."
    },
    {
      id: "DRUG-009",
      brandName: "Telma 40",
      genericName: "Telmisartan",
      strength: "40mg",
      strengthMg: 40,
      category: "Angiotensin II Receptor Blocker (ARB)",
      maxDailyDoseMg: 80,
      defaultFrequency: "1 tab OD (Morning)",
      route: "Oral",
      allergyClasses: ["Telmisartan", "ARBs"],
      pediatricSafe: false,
      pediatricMgPerKg: 0,
      description: "Antihypertensive ARB promoting vasodilation and renal protection. May elevate potassium with potassium sparers."
    },
    {
      id: "DRUG-010",
      brandName: "Pan 40",
      genericName: "Pantoprazole Sodium",
      strength: "40mg",
      strengthMg: 40,
      category: "Proton Pump Inhibitor (PPI)",
      maxDailyDoseMg: 80,
      defaultFrequency: "1 tab OD (Before breakfast)",
      route: "Oral",
      allergyClasses: ["Pantoprazole", "PPIs"],
      pediatricSafe: true,
      pediatricMgPerKg: 1,
      description: "Gastric acid inhibitor for peptic ulcer, GERD, and gastroprotection during dual antiplatelet therapy."
    },
    {
      id: "DRUG-011",
      brandName: "Cetzine 10",
      genericName: "Cetirizine Hydrochloride",
      strength: "10mg",
      strengthMg: 10,
      category: "Antihistamine (Second Generation H1 Blocker)",
      maxDailyDoseMg: 10,
      defaultFrequency: "1 tab HS (Bedtime)",
      route: "Oral",
      allergyClasses: ["Cetirizine"],
      pediatricSafe: true,
      pediatricMgPerKg: 0.25,
      description: "Selective peripheral H1 receptor antagonist for allergic rhinitis, urticaria, and pruritus."
    },
    {
      id: "DRUG-012",
      brandName: "Warf 5mg",
      genericName: "Warfarin Sodium",
      strength: "5mg",
      strengthMg: 5,
      category: "Oral Vitamin K Antagonist (Anticoagulant)",
      maxDailyDoseMg: 10,
      defaultFrequency: "1 tab OD (Night as per INR)",
      route: "Oral",
      allergyClasses: ["Warfarin"],
      pediatricSafe: false,
      pediatricMgPerKg: 0,
      description: "Oral anticoagulant for deep vein thrombosis, pulmonary embolism, and prosthetic heart valves. High bleeding risk with antiplatelets."
    },
    {
      id: "DRUG-013",
      brandName: "Aldactone 25",
      genericName: "Spironolactone",
      strength: "25mg",
      strengthMg: 25,
      category: "Potassium-Sparing Diuretic / Aldosterone Antagonist",
      maxDailyDoseMg: 100,
      defaultFrequency: "1 tab OD (Morning)",
      route: "Oral",
      allergyClasses: ["Spironolactone"],
      pediatricSafe: false,
      pediatricMgPerKg: 0,
      description: "Mineralocorticoid receptor antagonist used in heart failure and resistant hypertension. Risk of severe hyperkalemia with ACEi/ARBs."
    },
    {
      id: "DRUG-014",
      brandName: "Ultram / Tramazac 50",
      genericName: "Tramadol Hydrochloride",
      strength: "50mg",
      strengthMg: 50,
      category: "Centrally Acting Opioid Analgesic",
      maxDailyDoseMg: 400,
      defaultFrequency: "1 cap SOS or BD",
      route: "Oral",
      allergyClasses: ["Tramadol", "Opioids"],
      pediatricSafe: false,
      pediatricMgPerKg: 0,
      description: "Mu-opioid agonist and SNRI inhibitor. Severe Serotonin Syndrome and seizure hazard with serotonergic antidepressants."
    }
  ],

  drugInteractions: [
    {
      id: "INT-001",
      drugA: "Aspirin (Acetylsalicylic Acid)",
      drugB: "Warfarin Sodium",
      severity: "Severe",
      mechanism: "Pharmacodynamic Synergism & Gastric Erosion",
      clinicalEffect: "Concomitant use profoundly amplifies hemorrhagic risk, resulting in major upper GI bleeding, epistaxis, and intracranial hemorrhage.",
      recommendation: "Contraindicated for routine care. If indicated for mechanical heart valves, maintain target INR 2.0-2.5 and co-prescribe a PPI."
    },
    {
      id: "INT-002",
      drugA: "Aspirin (Acetylsalicylic Acid)",
      drugB: "Ticagrelor",
      severity: "Moderate",
      mechanism: "Dual Antiplatelet Synergism",
      clinicalEffect: "Increases non-CABG related major bleeding and dyspnea incidence. High maintenance doses of Aspirin (>100mg) attenuate Ticagrelor efficacy.",
      recommendation: "Maintain Aspirin maintenance dose strictly <= 100mg once daily when administered alongside Ticagrelor 90mg BID."
    },
    {
      id: "INT-003",
      drugA: "Ciprofloxacin Hydrochloride",
      drugB: "Theophylline + Etofylline",
      severity: "Severe",
      mechanism: "Cytochrome P450 1A2 (CYP1A2) Metabolic Inhibition",
      clinicalEffect: "Ciprofloxacin drastically inhibits hepatic clearance of theophylline, raising serum theophylline levels by 100-300%, triggering refractory seizures, arrhythmias, and nausea.",
      recommendation: "Avoid co-administration. If an antibiotic is mandatory, switch to Azithromycin or reduce Theophylline dosage by 50% with serum level monitoring."
    },
    {
      id: "INT-004",
      drugA: "Telmisartan",
      drugB: "Spironolactone",
      severity: "Severe",
      mechanism: "Dual Renin-Angiotensin-Aldosterone System (RAAS) Blockade",
      clinicalEffect: "Combined inhibition of aldosterone leads to dangerous potassium retention, precipitating severe hyperkalemia (K+ > 6.0 mEq/L) and cardiac conduction arrest.",
      recommendation: "Exercise extreme vigilance. Check baseline Serum Creatinine and Potassium; recheck within 5 days of initiation."
    },
    {
      id: "INT-005",
      drugA: "Ibuprofen",
      drugB: "Aspirin (Acetylsalicylic Acid)",
      severity: "Moderate",
      mechanism: "Competitive Platelet COX-1 Active Site Binding",
      clinicalEffect: "Ibuprofen competitively impedes irreversible COX-1 acetylation by low-dose aspirin, eliminating the cardioprotective antiplatelet effect and doubling gastrointestinal ulcer risk.",
      recommendation: "Take Aspirin at least 2 hours prior to Ibuprofen, or substitute Ibuprofen with Paracetamol for pain management."
    },
    {
      id: "INT-006",
      drugA: "Tramadol Hydrochloride",
      drugB: "Cetzine 10",
      severity: "Mild",
      mechanism: "Central Nervous System Depression",
      clinicalEffect: "Additive psychomotor sedation, somnolence, and impaired motor reflexes.",
      recommendation: "Warn patient against operating heavy machinery or driving."
    },
    {
      id: "INT-007",
      drugA: "Amoxicillin + Clavulanic Acid",
      drugB: "Warfarin Sodium",
      severity: "Moderate",
      mechanism: "Gut Flora Suppression & Vitamin K Depletion",
      clinicalEffect: "Broad-spectrum oral penicillins eradicate vitamin K-synthesizing gut bacteria, elevating INR and bleeding tendency.",
      recommendation: "Check Prothrombin Time / INR on Day 3 of antibiotic therapy."
    }
  ],

  labTestMaster: [
    {
      id: "TEST-CBC",
      code: "L-101",
      testName: "Complete Blood Count (CBC & Hemogram)",
      category: "Hematology",
      sampleType: "Venous Blood (EDTA Purple Top)",
      turnaroundMins: 45,
      price: 450,
      parameters: [
        { name: "Hemoglobin (Hb)", unit: "g/dL", min: 13.0, max: 17.0, criticalLow: 7.0, criticalHigh: 20.0, description: "Oxygen carrying protein in red blood cells" },
        { name: "Total Leucocyte Count (WBC)", unit: "/cumm", min: 4000, max: 11000, criticalLow: 2000, criticalHigh: 30000, description: "Total white blood cells for immune response" },
        { name: "Platelet Count", unit: "lakhs/cumm", min: 1.5, max: 4.5, criticalLow: 0.5, criticalHigh: 8.0, description: "Primary hemostatic clotting fragments" },
        { name: "Hematocrit (PCV)", unit: "%", min: 40.0, max: 50.0, criticalLow: 20.0, criticalHigh: 60.0, description: "Packed cell volume percentage" },
        { name: "Neutrophils", unit: "%", min: 40, max: 75, criticalLow: 15, criticalHigh: 90, description: "First responder phagocytes" }
      ]
    },
    {
      id: "TEST-TROP",
      code: "L-102",
      testName: "High-Sensitivity Cardiac Troponin-I (hs-cTnI)",
      category: "Cardiac & Emergency",
      sampleType: "Venous Blood (Serum SST Red Top)",
      turnaroundMins: 30,
      price: 1200,
      parameters: [
        { name: "hs-cTnI (Troponin-I)", unit: "ng/mL", min: 0.000, max: 0.034, criticalLow: null, criticalHigh: 0.050, description: "Gold standard myocardial necrosis biomarker" }
      ]
    },
    {
      id: "TEST-KFT",
      code: "L-103",
      testName: "Kidney Function Test (KFT) & Electrolytes",
      category: "Biochemistry",
      sampleType: "Serum Gel Separator (Red/Gold SST)",
      turnaroundMins: 60,
      price: 850,
      parameters: [
        { name: "Serum Creatinine", unit: "mg/dL", min: 0.70, max: 1.20, criticalLow: null, criticalHigh: 4.0, description: "Muscle metabolism byproduct cleared by glomeruli" },
        { name: "Blood Urea Nitrogen (BUN)", unit: "mg/dL", min: 8.0, max: 20.0, criticalLow: null, criticalHigh: 60.0, description: "Protein metabolism waste product" },
        { name: "Serum Potassium (K+)", unit: "mEq/L", min: 3.5, max: 5.0, criticalLow: 2.8, criticalHigh: 6.2, description: "Principal intracellular cation, vital for cardiac rhythm" },
        { name: "Serum Sodium (Na+)", unit: "mEq/L", min: 135, max: 145, criticalLow: 120, criticalHigh: 160, description: "Extracellular cation regulating blood volume and osmolality" }
      ]
    },
    {
      id: "TEST-LFT",
      code: "L-104",
      testName: "Comprehensive Liver Function Test (LFT)",
      category: "Biochemistry",
      sampleType: "Serum Gel Separator (Red/Gold SST)",
      turnaroundMins: 60,
      price: 800,
      parameters: [
        { name: "Total Bilirubin", unit: "mg/dL", min: 0.2, max: 1.2, criticalLow: null, criticalHigh: 12.0, description: "Heme breakdown pigment" },
        { name: "SGOT (AST)", unit: "U/L", min: 10, max: 40, criticalLow: null, criticalHigh: 500, description: "Aspartate aminotransferase cellular enzyme" },
        { name: "SGPT (ALT)", unit: "U/L", min: 7, max: 56, criticalLow: null, criticalHigh: 500, description: "Alanine aminotransferase liver specific enzyme" },
        { name: "Alkaline Phosphatase (ALP)", unit: "U/L", min: 44, max: 147, criticalLow: null, criticalHigh: 600, description: "Biliary tract and bone enzyme" },
        { name: "Serum Albumin", unit: "g/dL", min: 3.5, max: 5.0, criticalLow: 2.0, criticalHigh: null, description: "Major circulating oncotic plasma protein" }
      ]
    },
    {
      id: "TEST-GLUC",
      code: "L-105",
      testName: "Random Blood Glucose & Glycated HbA1c",
      category: "Biochemistry",
      sampleType: "Fluoride Grey / EDTA Purple",
      turnaroundMins: 30,
      price: 550,
      parameters: [
        { name: "Plasma Glucose (Random)", unit: "mg/dL", min: 70, max: 140, criticalLow: 45, criticalHigh: 400, description: "Instant circulating venous blood sugar" },
        { name: "HbA1c (3-Month Glycemic)", unit: "%", min: 4.0, max: 5.7, criticalLow: null, criticalHigh: 11.0, description: "Long term glucose control index" }
      ]
    }
  ],

  criticalLabAlerts: [
    {
      id: "CRIT-ALERT-01",
      orderId: "LAB-8812",
      orderNo: "ORD-LAB-9923",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      testName: "Kidney Function Test (KFT) & Electrolytes",
      criticalParameter: "Serum Potassium (K+)",
      value: "6.4 mEq/L",
      referenceRange: "3.5 - 5.0 mEq/L (Critical > 6.2)",
      severity: "Life-Threatening Hyperkalemia",
      alertedToDoctor: "Dr. Farhan Siddiqui",
      alertTime: "2026-09-17 10:15 AM",
      status: "Doctor Notified - Pending Review",
      acknowledged: false
    },
    {
      id: "CRIT-ALERT-02",
      orderId: "LAB-8816",
      orderNo: "ORD-LAB-9927",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      testName: "High-Sensitivity Cardiac Troponin-I (hs-cTnI)",
      criticalParameter: "hs-cTnI (Troponin-I)",
      value: "0.185 ng/mL",
      referenceRange: "0.000 - 0.034 ng/mL (Critical > 0.050)",
      severity: "Acute Myocardial Necrosis Alert",
      alertedToDoctor: "Dr. Ananya Mukherjee",
      alertTime: "2026-09-17 08:50 AM",
      status: "Acknowledged by Attending Cardiologist",
      acknowledged: true,
      acknowledgedAt: "2026-09-17 08:55 AM",
      actionTaken: "Patient shifted to CCU. Urgent repeat ECG and bedside echo ordered."
    }
  ],

  labOrders: [
    {
      id: "LAB-8810",
      orderNo: "ORD-LAB-9921",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      testName: "Comprehensive Cardiac & Lipid Biomarker Panel",
      category: "Biochemistry & Pathology",
      orderedBy: "Dr. Ananya Mukherjee",
      sampleType: "Venous Blood (EDTA + Serum Gel Separator)",
      barcode: "MEDLAB*8810*CBC*",
      orderTime: "2026-09-17 08:30 AM",
      sampleCollectedTime: "2026-09-17 08:45 AM",
      processingStartTime: "2026-09-17 09:00 AM",
      reportedTime: "2026-09-17 09:35 AM",
      verifiedTime: "2026-09-17 09:48 AM",
      status: "verified", // 5-stage: ordered | sample_collected | processing | reported | verified
      verifiedBy: "Dr. Neha Kulkarni, MD (Path)",
      technician: "R. Murali, DMLT",
      isCritical: false,
      doctorAlerted: false,
      pdfAttachment: "Official_NABL_Report_LAB8810.pdf",
      timeline: [
        { stage: "ordered", time: "08:30 AM", user: "Dr. Ananya Mukherjee", note: "Order requisitioned & fee auto-captured to billing" },
        { stage: "sample_collected", time: "08:45 AM", user: "Phlebotomist Deepa", note: "5.0 mL drawn into SST & EDTA vacutainers" },
        { stage: "processing", time: "09:00 AM", user: "Tech R. Murali", note: "Loaded into Roche Cobas 6000 analyzer" },
        { stage: "reported", time: "09:35 AM", user: "LIS Auto-Interface", note: "Results transmitted. High/Low flags calculated" },
        { stage: "verified", time: "09:48 AM", user: "Dr. Neha Kulkarni", note: "Clinical sign-off & electronic seal applied" }
      ],
      parameters: [
        { name: "High-Sensitivity Troponin I", result: "0.012", unit: "ng/mL", reference: "0.000 - 0.034", flag: "Normal" },
        { name: "Total Cholesterol", result: "228.4", unit: "mg/dL", reference: "125.0 - 200.0", flag: "High" },
        { name: "LDL Cholesterol", result: "148.0", unit: "mg/dL", reference: "< 100.0 (Optimal < 70)", flag: "High" },
        { name: "HDL Cholesterol", result: "38.2", unit: "mg/dL", reference: "40.0 - 60.0", flag: "Low" },
        { name: "Triglycerides", result: "211.0", unit: "mg/dL", reference: "< 150.0", flag: "High" },
        { name: "Serum Creatinine", result: "1.08", unit: "mg/dL", reference: "0.70 - 1.20", flag: "Normal" },
        { name: "HbA1c (Glycated Hemoglobin)", result: "7.4", unit: "%", reference: "< 5.7 (Target < 7.0)", flag: "High" }
      ],
      interpretation: "Lipid profile reveals mixed hyperlipidemia requiring intensifications of statin-ezetimibe combination. Cardiac biomarkers currently non-ischemic. Glycemic control sub-optimal."
    },
    {
      id: "LAB-8811",
      orderNo: "ORD-LAB-9922",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      testName: "Arterial Blood Gas (ABG) & Renal Function Test",
      category: "Critical Care / Biochemistry",
      orderedBy: "Dr. Farhan Siddiqui",
      sampleType: "Heparinized Radial Arterial Blood",
      barcode: "MEDLAB*8811*ABG*",
      orderTime: "2026-09-17 09:15 AM",
      sampleCollectedTime: "2026-09-17 09:25 AM",
      processingStartTime: "2026-09-17 09:30 AM",
      reportedTime: "2026-09-17 09:42 AM",
      verifiedTime: "2026-09-17 09:50 AM",
      status: "verified",
      verifiedBy: "Dr. Neha Kulkarni, MD (Path)",
      technician: "R. Murali, DMLT",
      isCritical: false,
      doctorAlerted: false,
      pdfAttachment: "Official_NABL_Report_LAB8811.pdf",
      timeline: [
        { stage: "ordered", time: "09:15 AM", user: "Dr. Farhan Siddiqui", note: "Stat requisition for respiratory acidosis" },
        { stage: "sample_collected", time: "09:25 AM", user: "ICU Staff Nurse Reena", note: "Radial arterial sample on ice" },
        { stage: "processing", time: "09:30 AM", user: "Tech S. Rao", note: "Radiometer ABL90 analyzer" },
        { stage: "reported", time: "09:42 AM", user: "Tech S. Rao", note: "Blood gas calibrated" },
        { stage: "verified", time: "09:50 AM", user: "Dr. Neha Kulkarni", note: "Authorized & released to ICU" }
      ],
      parameters: [
        { name: "pH", result: "7.31", unit: "", reference: "7.35 - 7.45", flag: "Low" },
        { name: "pCO2", result: "54.2", unit: "mmHg", reference: "35.0 - 45.0", flag: "High" },
        { name: "pO2", result: "68.4", unit: "mmHg", reference: "80.0 - 100.0", flag: "Low" },
        { name: "HCO3- (Bicarbonate)", result: "28.6", unit: "mEq/L", reference: "22.0 - 26.0", flag: "High" },
        { name: "Serum Potassium (K+)", result: "4.8", unit: "mEq/L", reference: "3.5 - 5.0", flag: "Normal" },
        { name: "Serum Creatinine", result: "2.14", unit: "mg/dL", reference: "0.70 - 1.20", flag: "High" },
        { name: "Blood Urea Nitrogen (BUN)", result: "38.0", unit: "mg/dL", reference: "8.0 - 20.0", flag: "High" }
      ],
      interpretation: "Partially compensated respiratory acidosis with moderate hypercapnia secondary to COPD exacerbation. Baseline elevated serum creatinine reflecting CKD Stage 3."
    },
    {
      id: "LAB-8812",
      orderNo: "ORD-LAB-9923",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      testName: "Kidney Function Test (KFT) & Electrolytes",
      category: "Biochemistry",
      orderedBy: "Dr. Farhan Siddiqui",
      sampleType: "Venous Blood (Serum SST Red Top)",
      barcode: "MEDLAB*8812*KFT*",
      orderTime: "2026-09-17 09:40 AM",
      sampleCollectedTime: "2026-09-17 09:52 AM",
      processingStartTime: "2026-09-17 10:02 AM",
      reportedTime: "2026-09-17 10:14 AM",
      status: "reported",
      verifiedBy: "Pending Pathologist Sign-Off",
      technician: "R. Murali, DMLT",
      isCritical: true,
      doctorAlerted: true,
      criticalAlertMessage: "CRITICAL VALUE: Serum Potassium is 6.4 mEq/L (Critical High > 6.2). Urgent cardiac arrhythmia hazard!",
      timeline: [
        { stage: "ordered", time: "09:40 AM", user: "Dr. Farhan Siddiqui", note: "Follow-up electrolyte check" },
        { stage: "sample_collected", time: "09:52 AM", user: "Phlebotomist Deepa", note: "Serum SST drawn" },
        { stage: "processing", time: "10:02 AM", user: "Tech R. Murali", note: "Roche Cobas Ion Selective Electrode" },
        { stage: "reported", time: "10:14 AM", user: "Tech R. Murali", note: "CRITICAL ALERT TRIGGERED: Potassium 6.4 mEq/L" }
      ],
      parameters: [
        { name: "Serum Potassium (K+)", result: "6.4", unit: "mEq/L", reference: "3.5 - 5.0", flag: "Critical" },
        { name: "Serum Sodium (Na+)", result: "132", unit: "mEq/L", reference: "135 - 145", flag: "Low" },
        { name: "Serum Creatinine", result: "2.35", unit: "mg/dL", reference: "0.70 - 1.20", flag: "High" },
        { name: "Blood Urea Nitrogen (BUN)", result: "42.0", unit: "mg/dL", reference: "8.0 - 20.0", flag: "High" }
      ],
      interpretation: "CRITICAL ALERT: Life-threatening hyperkalemia (K+ = 6.4). Immediate calcium gluconate, insulin-dextrose, or hemodialysis consideration required."
    },
    {
      id: "LAB-8813",
      orderNo: "ORD-LAB-9924",
      patientId: "PAT-2026-8802",
      patientName: "Sneha Jennifer Thomas",
      testName: "Complete Blood Count (CBC & Hemogram)",
      category: "Hematology",
      orderedBy: "Dr. Priya Sundaram",
      sampleType: "Venous Blood (EDTA Purple Top)",
      barcode: "MEDLAB*8813*CBC*",
      orderTime: "2026-09-17 10:10 AM",
      sampleCollectedTime: "2026-09-17 10:25 AM",
      processingStartTime: "2026-09-17 10:35 AM",
      status: "processing",
      verifiedBy: null,
      technician: "Anjali P., MLT",
      isCritical: false,
      doctorAlerted: false,
      timeline: [
        { stage: "ordered", time: "10:10 AM", user: "Dr. Priya Sundaram", note: "Antenatal 24-week routine screening" },
        { stage: "sample_collected", time: "10:25 AM", user: "Phlebotomist Swetha", note: "3.5 mL EDTA tube drawn" },
        { stage: "processing", time: "10:35 AM", user: "Tech Anjali P.", note: "Loaded on Sysmex XN-1000 automated counter" }
      ],
      parameters: [],
      interpretation: "Sample actively running on automated Sysmex XN-1000 hematology counter. Estimated completion: 8 minutes."
    },
    {
      id: "LAB-8814",
      orderNo: "ORD-LAB-9925",
      patientId: "PAT-2026-8804",
      patientName: "Ayesha Fatima Khan",
      testName: "Comprehensive Liver Function Test (LFT)",
      category: "Biochemistry",
      orderedBy: "Dr. Arvind Swaminathan",
      sampleType: "Venous Blood (Serum SST Red Top)",
      barcode: "MEDLAB*8814*LFT*",
      orderTime: "2026-09-17 10:15 AM",
      sampleCollectedTime: "2026-09-17 10:28 AM",
      status: "sample_collected",
      verifiedBy: null,
      technician: null,
      isCritical: false,
      doctorAlerted: false,
      timeline: [
        { stage: "ordered", time: "10:15 AM", user: "Dr. Arvind Swaminathan", note: "Emergency observation workup" },
        { stage: "sample_collected", time: "10:28 AM", user: "Phlebotomist Deepa", note: "Sample accessioned and sent to centrifugation rack" }
      ],
      parameters: [],
      interpretation: "Sample collected at Emergency Phlebotomy desk. Centrifugation in progress; awaiting analyzer batch queue."
    },
    {
      id: "LAB-8815",
      orderNo: "ORD-LAB-9926",
      patientId: "PAT-2026-8806",
      patientName: "Master Aarav Karthik",
      testName: "Complete Blood Count (CBC) & Pediatric Platelets",
      category: "Hematology",
      orderedBy: "Dr. Meenakshi Iyer",
      sampleType: "Pediatric Microtainer (EDTA Purple Top)",
      barcode: "MEDLAB*8815*PED*",
      orderTime: "2026-09-17 10:32 AM",
      status: "ordered",
      verifiedBy: null,
      technician: null,
      isCritical: false,
      doctorAlerted: false,
      timeline: [
        { stage: "ordered", time: "10:32 AM", user: "Dr. Meenakshi Iyer", note: "Pediatric fever spike evaluation. Auto-charged to billing." }
      ],
      parameters: [],
      interpretation: "Requisitioned by Pediatric OPD. Token generated. Patient proceeding to Pediatric Phlebotomy cubicle."
    }
  ],

  radiologyOrders: [
    {
      id: "RAD-501",
      orderNo: "ORD-RAD-3011",
      patientId: "PAT-2026-8805",
      patientName: "Gurpreet Singh Chawla",
      modality: "MRI 3.0 Tesla",
      bodyPart: "Lumbosacral Spine with Contrast Screening",
      urgency: "Routine",
      orderedBy: "Dr. Rajesh K. Nair",
      status: "Verified & PACS Available",
      radiologist: "Dr. Tarun Sen, MD (Radiodiagnosis)",
      scanDate: "2026-09-16",
      findings: "Marked diffuse disc bulge with right posterolateral extrusion at L4-L5 level causing severe compression over traversing right L5 nerve root. Facet joint arthropathy at L5-S1. No canal stenosis at higher lumbar levels.",
      impression: "Severe L4-L5 right paracentral disc herniation with nerve impingement correlating with right sciatica symptoms.",
      pacsImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "RAD-502",
      orderNo: "ORD-RAD-3012",
      patientId: "PAT-2026-8804",
      patientName: "Ayesha Fatima Khan",
      modality: "Digital Chest X-Ray (PA View)",
      bodyPart: "Chest & Thorax",
      urgency: "STAT (Emergency)",
      orderedBy: "Dr. Arvind Swaminathan",
      status: "Verified & PACS Available",
      radiologist: "Dr. Tarun Sen, MD (Radiodiagnosis)",
      scanDate: "2026-09-17",
      findings: "Bilateral hyperinflated lung fields with flattened diaphragmatic domes. Increased bronchovascular markings in perihilar regions. No focal consolidation, pneumothorax, or pleural effusion visualized.",
      impression: "Findings suggestive of acute obstructive airway pathology / bronchial asthma exacerbation.",
      pacsImage: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80"
    }
  ],

  pharmacyMedicines: [
    { id: "MED-001", name: "Brilinta (Ticagrelor)", salt: "Ticagrelor 90mg", category: "Cardiology / Antiplatelet", stock: 1420, minStock: 200, unitPrice: 42.50, expiryDate: "2027-08-30", batchNo: "BT-2024-88A", rack: "Rack C-04", status: "In-Stock" },
    { id: "MED-002", name: "Rozavel-EZ 20/10", salt: "Rosuvastatin 20mg + Ezetimibe 10mg", category: "Lipid Lowering", stock: 890, minStock: 150, unitPrice: 28.00, expiryDate: "2027-04-15", batchNo: "RZ-99120", rack: "Rack C-02", status: "In-Stock" },
    { id: "MED-003", name: "Augmentin 625 Duo", salt: "Amoxicillin 500mg + Clavulanic Acid 125mg", category: "Antibiotics", stock: 240, minStock: 300, unitPrice: 22.80, expiryDate: "2026-11-20", batchNo: "AG-4410", rack: "Rack A-08", status: "Low Stock" },
    { id: "MED-004", name: "Inj. Meropenem 1g (Meromac)", salt: "Meropenem 1000mg IV", category: "Critical Care Antibiotic", stock: 180, minStock: 100, unitPrice: 850.00, expiryDate: "2026-10-10", batchNo: "MP-1082", rack: "Cold Room-01", status: "Near Expiry" },
    { id: "MED-005", name: "Inj. Noradrenaline 4mg/2mL", salt: "Norepinephrine Bitartrate", category: "Emergency / Vasopressor", stock: 350, minStock: 80, unitPrice: 115.00, expiryDate: "2027-12-01", batchNo: "NA-7721", rack: "Crash Cart / ICU", status: "In-Stock" },
    { id: "MED-006", name: "Deriphyllin Retard 150mg", salt: "Theophylline + Etofylline", category: "Respiratory / Bronchodilator", stock: 65, minStock: 200, unitPrice: 8.50, expiryDate: "2026-04-28", batchNo: "DP-2291", rack: "Rack R-01", status: "Critical Shortage" },
    { id: "MED-007", name: "Inj. Pantoprazole 40mg (Pan-IV)", salt: "Pantoprazole Sodium 40mg", category: "Gastroenterology", stock: 2100, minStock: 400, unitPrice: 48.00, expiryDate: "2027-09-30", batchNo: "PN-8834", rack: "Rack G-03", status: "In-Stock" }
  ],

  operationTheatres: [
    {
      id: "OT-ROOM-1",
      name: "Modular OT 1 (Cardiac & Vascular)",
      surgeon: "Dr. Ananya Mukherjee & Surgical Team",
      surgery: "Coronary Artery Bypass Graft (Off-Pump CABG x 3)",
      patient: "M. K. Nambiar (61M)",
      anesthetist: "Dr. Sandeep Deshmukh, MD",
      timing: "08:30 AM - 01:30 PM",
      status: "In-Progress",
      preOpDone: true,
      whoChecklistSigned: true
    },
    {
      id: "OT-ROOM-2",
      name: "Modular OT 2 (Orthopaedics & Spine)",
      surgeon: "Dr. Rajesh K. Nair",
      surgery: "L4-L5 Micro-Lumbar Discectomy",
      patient: "Gurpreet Singh Chawla (45M)",
      anesthetist: "Dr. Sunita Kulkarni, DA",
      timing: "02:00 PM - 04:30 PM",
      status: "Scheduled",
      preOpDone: true,
      whoChecklistSigned: false
    },
    {
      id: "OT-ROOM-3",
      name: "Modular OT 3 (Neuro & Trauma)",
      surgeon: "Dr. Vikramaditya Rao",
      surgery: "Emergency Craniotomy & Subdural Evacuation",
      patient: "Trauma Case #902",
      anesthetist: "Dr. Sandeep Deshmukh, MD",
      timing: "11:00 AM - 02:00 PM",
      status: "Emergency Prep",
      preOpDone: true,
      whoChecklistSigned: true
    },
    {
      id: "OT-ROOM-4",
      name: "Modular OT 4 (General & Laparoscopy)",
      surgeon: "Dr. Harsh Vardhan & Surgical Team",
      surgery: "Laparoscopic Cholecystectomy",
      patient: "Deepa Narayan (52F)",
      anesthetist: "Dr. Sunita Kulkarni, DA",
      timing: "04:30 PM - 06:00 PM",
      status: "Booked",
      preOpDone: false,
      whoChecklistSigned: false
    }
  ],

  bloodBankStock: [
    { group: "A+", packedCells: 24, ffp: 18, platelets: 8, cryo: 6, status: "Adequate" },
    { group: "A-", packedCells: 6, ffp: 5, platelets: 2, cryo: 1, status: "Low" },
    { group: "B+", packedCells: 38, ffp: 26, platelets: 14, cryo: 9, status: "Adequate" },
    { group: "B-", packedCells: 4, ffp: 3, platelets: 1, cryo: 1, status: "Critical" },
    { group: "O+", packedCells: 42, ffp: 30, platelets: 16, cryo: 10, status: "Adequate" },
    { group: "O-", packedCells: 5, ffp: 4, platelets: 2, cryo: 2, status: "Emergency Shortage (Universal Donor)" },
    { group: "AB+", packedCells: 16, ffp: 12, platelets: 6, cryo: 4, status: "Adequate" },
    { group: "AB-", packedCells: 2, ffp: 2, platelets: 1, cryo: 0, status: "Critical Alert" }
  ],

  billingInvoices: [
    {
      id: "INV-2026-9081",
      billNo: "BILL-IPD-2026-0981",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      type: "IPD Intermediate Bill",
      date: "2026-09-17",
      wardCharges: 18000,
      doctorConsultCharges: 6000,
      otAndProcedureCharges: 85000,
      pharmacyCharges: 24650,
      labAndRadiologyCharges: 14800,
      nursingCharges: 4500,
      subtotal: 152950,
      taxGst: 7647.50,
      discount: 5000,
      totalAmount: 155597.50,
      advancePaid: 50000,
      insuranceClaimed: 100000,
      balanceDue: 5597.50,
      status: "Partially Paid"
    },
    {
      id: "INV-2026-9082",
      billNo: "BILL-OPD-2026-1142",
      patientId: "PAT-2026-8802",
      patientName: "Sneha Jennifer Thomas",
      type: "OPD Consultation & Scan",
      date: "2026-09-17",
      wardCharges: 0,
      doctorConsultCharges: 900,
      otAndProcedureCharges: 0,
      pharmacyCharges: 1850,
      labAndRadiologyCharges: 2400,
      nursingCharges: 0,
      subtotal: 5150,
      taxGst: 0,
      discount: 0,
      totalAmount: 5150,
      advancePaid: 5150,
      insuranceClaimed: 0,
      balanceDue: 0,
      status: "Paid"
    }
  ],

  charges: [
    {
      id: "CHG-1001",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      admissionId: "IPD-8801",
      serviceType: "Bed Charges",
      serviceName: "Cardiology Step-Down (Ward 4B) Bed Stay - Day 1",
      qty: 1,
      rate: 3500,
      amount: 3500,
      date: "2026-09-15",
      sourceModule: "IPD",
      status: "Billed",
      isAutoCaptured: true
    },
    {
      id: "CHG-1002",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      admissionId: "IPD-8801",
      serviceType: "Bed Charges",
      serviceName: "Cardiology Step-Down (Ward 4B) Bed Stay - Day 2",
      qty: 1,
      rate: 3500,
      amount: 3500,
      date: "2026-09-16",
      sourceModule: "IPD",
      status: "Billed",
      isAutoCaptured: true
    },
    {
      id: "CHG-1003",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      admissionId: "IPD-8801",
      serviceType: "Laboratory",
      serviceName: "Comprehensive Cardiac & Lipid Biomarker Panel",
      qty: 1,
      rate: 4200,
      amount: 4200,
      date: "2026-09-16",
      sourceModule: "Laboratory",
      status: "Billed",
      isAutoCaptured: true
    },
    {
      id: "CHG-1004",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      admissionId: "IPD-8801",
      serviceType: "Surgery/OT",
      serviceName: "Primary Angioplasty (PTCA) with Drug-Eluting Stent Placement",
      qty: 1,
      rate: 85000,
      amount: 85000,
      date: "2026-09-15",
      sourceModule: "Operation Theatre",
      status: "Billed",
      isAutoCaptured: true
    },
    {
      id: "CHG-1005",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      admissionId: "IPD-8801",
      serviceType: "Pharmacy",
      serviceName: "Brilinta (Ticagrelor 90mg) + Rozavel-EZ Inpatient Pack",
      qty: 2,
      rate: 1850,
      amount: 3700,
      date: "2026-09-16",
      sourceModule: "Pharmacy",
      status: "Billed",
      isAutoCaptured: true
    },
    {
      id: "CHG-1006",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      admissionId: "IPD-8803",
      serviceType: "Bed Charges",
      serviceName: "Medical ICU (MICU-03) Bed Stay - Day 1",
      qty: 1,
      rate: 8500,
      amount: 8500,
      date: "2026-09-14",
      sourceModule: "IPD",
      status: "Pending",
      isAutoCaptured: true
    },
    {
      id: "CHG-1007",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      admissionId: "IPD-8803",
      serviceType: "Bed Charges",
      serviceName: "Medical ICU (MICU-03) Bed Stay - Day 2",
      qty: 1,
      rate: 8500,
      amount: 8500,
      date: "2026-09-15",
      sourceModule: "IPD",
      status: "Pending",
      isAutoCaptured: true
    },
    {
      id: "CHG-1008",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      admissionId: "IPD-8803",
      serviceType: "Bed Charges",
      serviceName: "Medical ICU (MICU-03) Bed Stay - Day 3",
      qty: 1,
      rate: 8500,
      amount: 8500,
      date: "2026-09-16",
      sourceModule: "IPD",
      status: "Pending",
      isAutoCaptured: true
    },
    {
      id: "CHG-1009",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      admissionId: "IPD-8803",
      serviceType: "Laboratory",
      serviceName: "Arterial Blood Gas (ABG) & Renal Function Test Panel",
      qty: 2,
      rate: 1800,
      amount: 3600,
      date: "2026-09-15",
      sourceModule: "Laboratory",
      status: "Pending",
      isAutoCaptured: true
    },
    {
      id: "CHG-1010",
      patientId: "PAT-2026-8804",
      patientName: "Ayesha Fatima Khan",
      admissionId: "ER-8804",
      serviceType: "Emergency",
      serviceName: "Emergency Resuscitation & Acute Nebulization Triage",
      qty: 1,
      rate: 3500,
      amount: 3500,
      date: "2026-09-17",
      sourceModule: "Emergency",
      status: "Pending",
      isAutoCaptured: true
    },
    {
      id: "CHG-1011",
      patientId: "PAT-2026-8804",
      patientName: "Ayesha Fatima Khan",
      admissionId: "ER-8804",
      serviceType: "Radiology",
      serviceName: "Digital Chest X-Ray (PA View)",
      qty: 1,
      rate: 1200,
      amount: 1200,
      date: "2026-09-17",
      sourceModule: "Radiology",
      status: "Pending",
      isAutoCaptured: true
    },
    {
      id: "CHG-1012",
      patientId: "PAT-2026-8805",
      patientName: "Gurpreet Singh Chawla",
      admissionId: "IPD-8805",
      serviceType: "Radiology",
      serviceName: "MRI 3.0 Tesla Lumbosacral Spine with Contrast",
      qty: 1,
      rate: 9500,
      amount: 9500,
      date: "2026-09-16",
      sourceModule: "Radiology",
      status: "Pending",
      isAutoCaptured: true
    },
    {
      id: "CHG-1013",
      patientId: "PAT-2026-8805",
      patientName: "Gurpreet Singh Chawla",
      admissionId: "IPD-8805",
      serviceType: "Bed Charges",
      serviceName: "Orthopaedics Special Ward (ORTHO-204) Bed - Day 1",
      qty: 1,
      rate: 4200,
      amount: 4200,
      date: "2026-09-16",
      sourceModule: "IPD",
      status: "Pending",
      isAutoCaptured: true
    }
  ],

  servicePriceMaster: [
    { id: "PRC-101", code: "SRV-BED-GEN", category: "Bed Charges", name: "General Ward Bed (Per Day)", rate: 1800, sacCode: "999311", dept: "IPD", taxPct: 0, status: "Active" },
    { id: "PRC-102", code: "SRV-BED-SEMI", category: "Bed Charges", name: "Semi-Private Ward Bed (Per Day)", rate: 3200, sacCode: "999311", dept: "IPD", taxPct: 0, status: "Active" },
    { id: "PRC-103", code: "SRV-BED-PVT", category: "Bed Charges", name: "Single Private Room Bed (Per Day)", rate: 4500, sacCode: "999311", dept: "IPD", taxPct: 0, status: "Active" },
    { id: "PRC-104", code: "SRV-BED-ICU", category: "Bed Charges", name: "Intensive Care Unit (ICU/CCU/MICU) Bed (Per Day)", rate: 8500, sacCode: "999311", dept: "Critical Care", taxPct: 0, status: "Active" },
    { id: "PRC-105", code: "SRV-CON-GEN", category: "Consultation", name: "OPD Specialist Doctor Consultation", rate: 850, sacCode: "999312", dept: "OPD", taxPct: 0, status: "Active" },
    { id: "PRC-106", code: "SRV-CON-SR", category: "Consultation", name: "Senior Super-Specialist / HOD Consultation", rate: 1500, sacCode: "999312", dept: "OPD", taxPct: 0, status: "Active" },
    { id: "PRC-107", code: "SRV-LAB-CBC", category: "Laboratory", name: "Complete Blood Count (CBC) with ESR", rate: 650, sacCode: "999313", dept: "Pathology", taxPct: 0, status: "Active" },
    { id: "PRC-108", code: "SRV-LAB-LIPID", category: "Laboratory", name: "Complete Lipid Profile (Cholesterol, LDL, HDL, Triglycerides)", rate: 1100, sacCode: "999313", dept: "Biochemistry", taxPct: 0, status: "Active" },
    { id: "PRC-109", code: "SRV-LAB-LFT", category: "Laboratory", name: "Liver Function Test (LFT) Comprehensive", rate: 1200, sacCode: "999313", dept: "Biochemistry", taxPct: 0, status: "Active" },
    { id: "PRC-110", code: "SRV-LAB-KFT", category: "Laboratory", name: "Renal / Kidney Function Test (KFT / RFT)", rate: 1150, sacCode: "999313", dept: "Biochemistry", taxPct: 0, status: "Active" },
    { id: "PRC-111", code: "SRV-LAB-TROP", category: "Laboratory", name: "High-Sensitivity Troponin-I Quantitative", rate: 2100, sacCode: "999313", dept: "Biochemistry", taxPct: 0, status: "Active" },
    { id: "PRC-112", code: "SRV-RAD-XRAY", category: "Radiology", name: "Digital Chest X-Ray (Single / Double View)", rate: 1200, sacCode: "999313", dept: "Radiology", taxPct: 0, status: "Active" },
    { id: "PRC-113", code: "SRV-RAD-USG", category: "Radiology", name: "Whole Abdomen & Pelvis Ultrasound (USG)", rate: 2400, sacCode: "999313", dept: "Radiology", taxPct: 0, status: "Active" },
    { id: "PRC-114", code: "SRV-RAD-CT", category: "Radiology", name: "Multi-Slice CT Scan (Head / Brain / Thorax)", rate: 4800, sacCode: "999313", dept: "Radiology", taxPct: 0, status: "Active" },
    { id: "PRC-115", code: "SRV-RAD-MRI", category: "Radiology", name: "3.0 Tesla MRI Spine / Brain with Screening", rate: 9500, sacCode: "999313", dept: "Radiology", taxPct: 0, status: "Active" },
    { id: "PRC-116", code: "SRV-SUR-LAP", category: "Surgery/OT", name: "Laparoscopic Cholecystectomy (Gallbladder Removal)", rate: 48000, sacCode: "999314", dept: "OT", taxPct: 0, status: "Active" },
    { id: "PRC-117", code: "SRV-SUR-PTCA", category: "Surgery/OT", name: "Coronary Angioplasty (PTCA) with Stent (Excl. Implant)", rate: 85000, sacCode: "999314", dept: "Cath Lab", taxPct: 0, status: "Active" },
    { id: "PRC-118", code: "SRV-NRS-DAY", category: "Nursing", name: "Daily Specialized Nursing & Patient Telemetry Care", rate: 1200, sacCode: "999311", dept: "Nursing", taxPct: 0, status: "Active" }
  ],

  servicePackages: [
    {
      id: "PKG-201",
      code: "PKG-DEL-NORMAL",
      name: "Normal Vaginal Delivery Package",
      department: "Obstetrics & Gynaecology",
      baseRate: 45000,
      discountedRate: 38000,
      stayDurationDays: 3,
      roomType: "Semi-Private Ward",
      inclusions: [
        "3 Days Semi-Private Room Accommodation",
        "Obstetrician & Pediatrician Delivery Fees",
        "Labour Room (LDRP) & Nursing Charges",
        "Standard Delivery Consumables & Mother Meds",
        "Baby Initial Vaccines (BCG, OPV, Hep-B) & Blood Grouping",
        "Mother Routine Post-Natal Follow-up"
      ],
      exclusions: ["Blood Transfusions", "Emergency NICU Care", "Specialized Neonatal Phototherapy"],
      status: "Active"
    },
    {
      id: "PKG-202",
      code: "PKG-DEL-LSCS",
      name: "Lower Segment Caesarean Section (C-Section) Package",
      department: "Obstetrics & Gynaecology",
      baseRate: 75000,
      discountedRate: 64000,
      stayDurationDays: 4,
      roomType: "Single Private Room",
      inclusions: [
        "4 Days Single Room Stay",
        "Surgical Team, Anesthetist & Pediatrician Charges",
        "Major Modular OT Charges & Sterilization",
        "Pre-op Labs (CBC, PT/INR, Blood Group, Viral Markers)",
        "Post-op Standard IV Fluids & Antibiotics",
        "Baby Intake Screening & Primary Immunizations"
      ],
      exclusions: ["Blood Transfusions", "Extended NICU Incubator Stay"],
      status: "Active"
    },
    {
      id: "PKG-203",
      code: "PKG-SUR-LAP-CHOL",
      name: "Laparoscopic Cholecystectomy (Gallbladder) Package",
      department: "General & Minimal Access Surgery",
      baseRate: 65000,
      discountedRate: 55000,
      stayDurationDays: 2,
      roomType: "Semi-Private Room",
      inclusions: [
        "2 Days Hospital Stay",
        "Lap Surgeon & Anesthesiologist Charges",
        "Operation Theatre & Laparoscopy Tower Facility",
        "Histopathology of Gallbladder Specimen",
        "Pre-op Routine Investigations & Post-op Antibiotics"
      ],
      exclusions: ["ERCP Stenting (if CBD stones)", "Extended ICU observation"],
      status: "Active"
    },
    {
      id: "PKG-204",
      code: "PKG-SUR-TKR",
      name: "Total Knee Replacement (Single Joint) Package",
      department: "Orthopaedics & Joint Care",
      baseRate: 185000,
      discountedRate: 165000,
      stayDurationDays: 5,
      roomType: "Special Ward",
      inclusions: [
        "5 Days Hospital Stay with Physiotherapy",
        "Orthopaedic Surgeon & Surgical Team Charges",
        "Modular Laminar OT Charges & Computer Navigation",
        "Pre-op Cardiac & Blood Workup",
        "Post-op Inpatient Physiotherapy Mobilization Sessions"
      ],
      exclusions: ["High-End Robotic Implant Cost (Billed at MRP)", "Extended ICU stay beyond 24h"],
      status: "Active"
    },
    {
      id: "PKG-205",
      code: "PKG-CHK-EXEC",
      name: "Comprehensive Executive Master Health Checkup",
      department: "Preventive Healthcare",
      baseRate: 11000,
      discountedRate: 8500,
      stayDurationDays: 0,
      roomType: "Daycare Lounge",
      inclusions: [
        "68 Blood & Urine Biomarkers (CBC, Lipid, LFT, KFT, HbA1c, Thyroid Panel)",
        "Digital Chest X-Ray & Resting ECG 12-Lead",
        "2D Echocardiography / TMT Treadmill Stress Test",
        "Ultrasound Whole Abdomen & Pelvis",
        "Consultation with Cardiologist, Physician & Dietitian",
        "Nutritious Executive Breakfast at Hospital Lounge"
      ],
      exclusions: ["CT / MRI Scans", "Specialized Tumor Markers"],
      status: "Active"
    }
  ],

  insuranceClaims: [
    {
      id: "CLM-901",
      claimNo: "CLM-STAR-2026-8801",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      policyNo: "SH-CORP-9921448",
      insurer: "Star Health Insurance",
      tpa: "Medi Assist TPA",
      schemeType: "Private Health Insurance",
      treatmentType: "Cashless IPD (PTCA / Angioplasty)",
      claimAmount: 180000,
      preAuthAmount: 180000,
      approvedAmount: 150000,
      deductibleAmount: 30000,
      copayPct: 10,
      status: "Pre-Auth Approved",
      rejectionReason: null,
      submissionDate: "2026-09-15",
      approvalDate: "2026-09-16",
      remarks: "Pre-auth verified for single stent PTCA with Star Health Mediclaim."
    },
    {
      id: "CLM-902",
      claimNo: "PMJAY-TS-2026-9042",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      policyNo: "PMJAY-ABHA-778102941",
      insurer: "National Health Authority (PMJAY / Ayushman Bharat)",
      tpa: "State Health Agency (Telangana)",
      schemeType: "PMJAY Government Scheme",
      treatmentType: "Cashless ICU / Acute Respiratory Failure",
      claimAmount: 320000,
      preAuthAmount: 300000,
      approvedAmount: 280000,
      deductibleAmount: 0,
      copayPct: 0,
      status: "Pre-Auth Approved",
      rejectionReason: null,
      submissionDate: "2026-09-14",
      approvalDate: "2026-09-15",
      remarks: "100% Cashless Government Health Scheme Coverage authorized under PMJAY Tertiary package."
    },
    {
      id: "CLM-903",
      claimNo: "CLM-NB-2026-4401",
      patientId: "PAT-2026-8805",
      patientName: "Gurpreet Singh Chawla",
      policyNo: "NB-CORP-33910",
      insurer: "Niva Bupa Health Insurance",
      tpa: "Health Insurance TPA",
      schemeType: "Corporate Group Mediclaim",
      treatmentType: "Cashless Spine Microdiscectomy",
      claimAmount: 185000,
      preAuthAmount: 185000,
      approvedAmount: 180000,
      deductibleAmount: 5000,
      copayPct: 0,
      status: "Query Raised",
      rejectionReason: "Implant invoice and pre-operative MRI DICOM plate requested by TPA medical desk.",
      submissionDate: "2026-09-16",
      approvalDate: null,
      remarks: "Query raised by TPA doctor. Hospital billing desk to submit original spine implant invoice."
    },
    {
      id: "CLM-904",
      claimNo: "PMJAY-TS-2026-9043",
      patientId: "PAT-2026-8804",
      patientName: "Ayesha Fatima Khan",
      policyNo: "PMJAY-ABHA-129481023",
      insurer: "National Health Authority (PMJAY / Ayushman Bharat)",
      tpa: "State Health Agency",
      schemeType: "PMJAY Government Scheme",
      treatmentType: "Emergency Bronchial Asthma Triage",
      claimAmount: 12000,
      preAuthAmount: 12000,
      approvedAmount: 0,
      deductibleAmount: 12000,
      copayPct: 0,
      status: "Rejected",
      rejectionReason: "Emergency Daycare observation less than mandatory 24-hour inpatient admission rule under PMJAY guideline section 4.2.",
      submissionDate: "2026-09-17",
      approvalDate: null,
      remarks: "Claim rejected due to non-fulfilment of 24h hospitalization criteria. Converted to hospital charity concession."
    }
  ],

  billingAuditLogs: [
    {
      id: "BAUD-2026-01",
      timestamp: "2026-09-17 11:20 AM",
      billNo: "BILL-IPD-2026-0981",
      patientName: "Rameshwar Prasad Sharma",
      action: "Discount Applied",
      field: "Institutional Discount",
      previousValue: "₹0",
      newValue: "₹5,000",
      changeAmount: 5000,
      reason: "NABH Senior Citizen Concession approved by Medical Director",
      user: "Dr. Arvind Swaminathan (Medical Superintendent)",
      role: "admin"
    },
    {
      id: "BAUD-2026-02",
      timestamp: "2026-09-17 10:45 AM",
      billNo: "BILL-IPD-2026-0981",
      patientName: "Rameshwar Prasad Sharma",
      action: "Rate Adjusted",
      field: "Nursing Charges",
      previousValue: "₹5,500",
      newValue: "₹4,500",
      changeAmount: -1000,
      reason: "Adjusted for half-day nursing overlap on transition from ICU to Step-Down ward",
      user: "K. Sudhakar (Billing Supervisor)",
      role: "billing"
    },
    {
      id: "BAUD-2026-03",
      timestamp: "2026-09-16 04:30 PM",
      billNo: "BILL-IPD-2026-0980",
      patientName: "Gurpreet Singh Chawla",
      action: "Package Applied",
      field: "Surgical Bill Package",
      previousValue: "Itemized Charges: ₹1,95,000",
      newValue: "Fixed Package: ₹1,65,000",
      changeAmount: -30000,
      reason: "Patient enrolled in standard Spine Surgery Fixed Care Package",
      user: "Chilla Sai (Accounts Executive)",
      role: "admin"
    }
  ],

  staffRoster: [
    { id: "EMP-401", name: "Dr. Arvind Swaminathan", role: "Chief of Emergency", dept: "Emergency", shift: "Morning (07:00 - 15:30)", status: "Active", salary: "₹3,50,000" },
    { id: "EMP-402", name: "Dr. Ananya Mukherjee", role: "Senior Interventional Cardiologist", dept: "Cardiology", shift: "Morning (08:00 - 16:30)", status: "Active", salary: "₹4,20,000" },
    { id: "EMP-403", name: "Sr. Nurse Reena Mathews", role: "Nursing Head (ICU)", dept: "Critical Care", shift: "Morning (07:00 - 15:30)", status: "Active", salary: "₹85,000" },
    { id: "EMP-404", name: "Sr. Pharmacist Rajesh Varma", role: "Lead Pharmacist", dept: "Pharmacy", shift: "Morning (08:00 - 16:30)", status: "Active", salary: "₹65,000" },
    { id: "EMP-405", name: "K. Sudhakar", role: "Senior Billing & TPA Executive", dept: "Billing & Accounts", shift: "General (09:00 - 18:00)", status: "Active", salary: "₹55,000" }
  ],

  auditLogs: [
    { id: "LOG-9901", user: "Dr. Ananya Mukherjee (DOC-102)", action: "Generated Digital Prescription", target: "PAT-2026-8801 (Rameshwar Sharma)", ip: "192.168.1.104", timestamp: "2026-09-17 10:24:18", module: "OPD/Consultation" },
    { id: "LOG-9902", user: "Dr. Neha Kulkarni (DOC-109)", action: "Approved & Signed Lab Diagnostics Report", target: "LAB-8810 (Cardiac Biomarkers)", ip: "192.168.1.182", timestamp: "2026-09-17 09:48:02", module: "Laboratory LIS" },
    { id: "LOG-9903", user: "Nurse Reena Mathews (EMP-403)", action: "Administered Scheduled IV Antibiotic", target: "PAT-2026-8803 (Bed MICU-03)", ip: "192.168.2.12", timestamp: "2026-09-17 09:30:10", module: "Nursing eMAR" },
    { id: "LOG-9904", user: "K. Sudhakar (EMP-405)", action: "Submitted TPA Cashless Claim Pre-Authorization", target: "CLM-901 (Star Health ₹1,50,000)", ip: "192.168.1.205", timestamp: "2026-09-17 09:12:44", module: "Billing & Insurance" },
    { id: "LOG-9905", user: "Admin / IT Security", action: "Role RBAC Permission Matrix Updated", target: "Role: Pharmacist (Write Dispensary)", ip: "192.168.0.1", timestamp: "2026-09-17 08:00:00", module: "Administration" }
  ],

  executiveStats: {
    totalPatientsToday: 248,
    opdFootfall: 182,
    ipdAdmissionsActive: 94,
    emergencyCasesToday: 28,
    totalBedsAvailable: 150,
    occupiedBeds: 122,
    occupancyRate: "81.3%",
    surgeriesScheduledToday: 14,
    revenueToday: "₹18,42,850",
    monthlyRevenue: "₹4.82 Cr",
    averageLengthOfStay: "3.8 Days",
    criticalAlarms: 3,
    pendingLabReports: 18,
    tpaPendingApproval: 6,
    expectedDischargesTodayCount: 5,
    cleaningBedsCount: 3
  },

  pharmacyItems: [
    { id: "PHARM-001", code: "RX-TIC-90", name: "Brilinta 90mg", genericName: "Ticagrelor", category: "Cardiology / Antiplatelet", form: "Tablet", unitPrice: 42.50, reorderLevel: 300, totalStock: 1420 },
    { id: "PHARM-002", code: "RX-ROS-20", name: "Rozavel-EZ 20/10", genericName: "Rosuvastatin 20mg + Ezetimibe 10mg", category: "Lipid Lowering", form: "Tablet", unitPrice: 28.00, reorderLevel: 250, totalStock: 890 },
    { id: "PHARM-003", code: "RX-AUG-625", name: "Augmentin 625 Duo", genericName: "Amoxicillin 500mg + Clavulanic Acid 125mg", category: "Antibiotics (Penicillin)", form: "Tablet", unitPrice: 22.80, reorderLevel: 350, totalStock: 240 },
    { id: "PHARM-004", code: "RX-DOL-650", name: "Dolo 650", genericName: "Paracetamol 650mg", category: "Analgesic & Antipyretic", form: "Tablet", unitPrice: 3.50, reorderLevel: 1000, totalStock: 4800 },
    { id: "PHARM-005", code: "RX-CIP-500", name: "Ciplox 500", genericName: "Ciprofloxacin 500mg", category: "Fluoroquinolone Antibiotic", form: "Tablet", unitPrice: 16.00, reorderLevel: 200, totalStock: 520 },
    { id: "PHARM-006", code: "RX-DER-150", name: "Deriphyllin Retard 150mg", genericName: "Theophylline + Etofylline", category: "Respiratory / Bronchodilator", form: "Tablet", unitPrice: 8.50, reorderLevel: 200, totalStock: 65 },
    { id: "PHARM-007", code: "RX-MER-1G", name: "Inj. Meropenem 1g (Meromac)", genericName: "Meropenem 1000mg IV", category: "Critical Care Antibiotic", form: "Injection", unitPrice: 850.00, reorderLevel: 100, totalStock: 180 },
    { id: "PHARM-008", code: "RX-PAN-40", name: "Pan 40", genericName: "Pantoprazole 40mg", category: "Gastroenterology / PPI", form: "Tablet", unitPrice: 9.80, reorderLevel: 400, totalStock: 2100 },
    { id: "PHARM-009", code: "RX-TEL-40", name: "Telma 40", genericName: "Telmisartan 40mg", category: "Antihypertensive ARB", form: "Tablet", unitPrice: 12.00, reorderLevel: 300, totalStock: 1250 }
  ],

  pharmacyBatches: [
    { id: "BAT-101", itemId: "PHARM-001", itemName: "Brilinta 90mg", batchNo: "BT-2024-88A", expiryDate: "2027-08-30", qty: 900, purchasePrice: 32.00, mrp: 42.50, supplier: "AstraZeneca India", rack: "Rack C-04", status: "In-Stock" },
    { id: "BAT-102", itemId: "PHARM-001", itemName: "Brilinta 90mg", batchNo: "BT-2024-42B", expiryDate: "2026-12-15", qty: 520, purchasePrice: 31.50, mrp: 42.50, supplier: "AstraZeneca India", rack: "Rack C-04", status: "In-Stock" },
    { id: "BAT-103", itemId: "PHARM-002", itemName: "Rozavel-EZ 20/10", batchNo: "RZ-99120", expiryDate: "2027-04-15", qty: 890, purchasePrice: 20.00, mrp: 28.00, supplier: "Sun Pharma Laboratories", rack: "Rack C-02", status: "In-Stock" },
    { id: "BAT-104", itemId: "PHARM-003", itemName: "Augmentin 625 Duo", batchNo: "AG-4410", expiryDate: "2026-11-20", qty: 140, purchasePrice: 16.50, mrp: 22.80, supplier: "GSK Pharmaceuticals", rack: "Rack A-08", status: "Low Stock" },
    { id: "BAT-105", itemId: "PHARM-003", itemName: "Augmentin 625 Duo", batchNo: "AG-4302", expiryDate: "2026-05-10", qty: 100, purchasePrice: 16.00, mrp: 22.80, supplier: "GSK Pharmaceuticals", rack: "Rack A-08", status: "Near Expiry" },
    { id: "BAT-106", itemId: "PHARM-004", itemName: "Dolo 650", batchNo: "DL-8821", expiryDate: "2027-10-30", qty: 3200, purchasePrice: 2.10, mrp: 3.50, supplier: "Micro Labs Ltd", rack: "Rack D-01", status: "In-Stock" },
    { id: "BAT-107", itemId: "PHARM-004", itemName: "Dolo 650", batchNo: "DL-7714", expiryDate: "2026-10-25", qty: 1600, purchasePrice: 2.00, mrp: 3.50, supplier: "Micro Labs Ltd", rack: "Rack D-01", status: "In-Stock" },
    { id: "BAT-108", itemId: "PHARM-006", itemName: "Deriphyllin Retard 150mg", batchNo: "DP-2291", expiryDate: "2026-04-28", qty: 65, purchasePrice: 5.80, mrp: 8.50, supplier: "Zydus Healthcare", rack: "Rack R-01", status: "Near Expiry" },
    { id: "BAT-109", itemId: "PHARM-007", itemName: "Inj. Meropenem 1g", batchNo: "MP-1082", expiryDate: "2026-10-10", qty: 180, purchasePrice: 620.00, mrp: 850.00, supplier: "Cipla Critical Care", rack: "Cold Room-01", status: "In-Stock" }
  ],

  stockMovements: [
    { id: "MOV-1001", itemId: "PHARM-001", itemName: "Brilinta 90mg", batchNo: "BT-2024-42B", type: "DISPENSE_OUT", qty: -30, balanceAfter: 520, reference: "POS-INV-2026-9081", patientName: "Rameshwar Prasad Sharma", user: "Lead Pharmacist Rajesh Varma", timestamp: "2026-09-17 10:35 AM" },
    { id: "MOV-1002", itemId: "PHARM-003", itemName: "Augmentin 625 Duo", batchNo: "AG-4302", type: "DISPENSE_OUT", qty: -10, balanceAfter: 100, reference: "POS-INV-2026-9082", patientName: "Walk-in OPD Patient", user: "Dispenser Swathi", timestamp: "2026-09-17 09:40 AM" },
    { id: "MOV-1003", itemId: "PHARM-004", itemName: "Dolo 650", batchNo: "DL-7714", type: "DISPENSE_OUT", qty: -20, balanceAfter: 1600, reference: "POS-INV-2026-9083", patientName: "Master Aarav Karthik", user: "Lead Pharmacist Rajesh Varma", timestamp: "2026-09-17 09:15 AM" },
    { id: "MOV-1004", itemId: "PHARM-007", itemName: "Inj. Meropenem 1g", batchNo: "MP-1082", type: "PURCHASE_IN", qty: 100, balanceAfter: 180, reference: "GRN-PO-44021", patientName: "Hospital Inward Store", user: "Purchase Manager R. Rao", timestamp: "2026-09-16 02:15 PM" }
  ],

  beds: [
    // Medical & Coronary ICU (WARD-ICU)
    { bedNo: "MICU-01", wardId: "WARD-ICU", wardName: "Medical & Coronary ICU", floor: "2nd Floor", roomNo: "ICU-Pod-A", bedType: "ICU Ventilator Bed", status: "occupied", patientId: "PAT-2026-8809", patientName: "K. Mohan Rao (62M)", attendingDoctor: "Dr. Farhan Siddiqui", oxygen: true, ventilator: true, telemetry: "Active", admittedAt: "2026-09-14 06:30 AM", expectedDischarge: "2026-09-20 12:00 PM" },
    { bedNo: "MICU-02", wardId: "WARD-ICU", wardName: "Medical & Coronary ICU", floor: "2nd Floor", roomNo: "ICU-Pod-A", bedType: "ICU Ventilator Bed", status: "occupied", patientId: "PAT-2026-8810", patientName: "N. Lakshmi (54F)", attendingDoctor: "Dr. Ananya Mukherjee", oxygen: true, ventilator: false, telemetry: "Active", admittedAt: "2026-09-15 02:00 PM", expectedDischarge: "2026-09-18 10:00 AM" },
    { bedNo: "MICU-03", wardId: "WARD-ICU", wardName: "Medical & Coronary ICU", floor: "2nd Floor", roomNo: "ICU-Pod-A", bedType: "ICU High Dependency Bed", status: "occupied", patientId: "PAT-2026-8803", patientName: "Venkata Satyanarayana Reddy", attendingDoctor: "Dr. Farhan Siddiqui", oxygen: true, ventilator: false, telemetry: "Active", admittedAt: "2026-09-16 09:00 AM", expectedDischarge: "2026-09-19 04:00 PM" },
    { bedNo: "MICU-04", wardId: "WARD-ICU", wardName: "Medical & Coronary ICU", floor: "2nd Floor", roomNo: "ICU-Pod-B", bedType: "ICU Ventilator Bed", status: "available", patientId: null, patientName: null, attendingDoctor: null, oxygen: true, ventilator: true, telemetry: "Standby" },
    { bedNo: "MICU-05", wardId: "WARD-ICU", wardName: "Medical & Coronary ICU", floor: "2nd Floor", roomNo: "ICU-Pod-B", bedType: "ICU High Dependency Bed", status: "occupied", patientId: "PAT-2026-8811", patientName: "Farid Ahmed (49M)", attendingDoctor: "Dr. Ananya Mukherjee", oxygen: true, ventilator: false, telemetry: "Active", admittedAt: "2026-09-16 11:20 PM", expectedDischarge: "Today (2026-09-17 03:00 PM)" },
    { bedNo: "MICU-06", wardId: "WARD-ICU", wardName: "Medical & Coronary ICU", floor: "2nd Floor", roomNo: "ICU-Pod-B", bedType: "ICU High Dependency Bed", status: "cleaning", patientId: null, patientName: null, attendingDoctor: null, oxygen: true, ventilator: false, telemetry: "Off", cleaningStartedAt: "2026-09-17 09:40 AM", housekeeper: "Housekeeper Ramesh B." },
    { bedNo: "MICU-07", wardId: "WARD-ICU", wardName: "Medical & Coronary ICU", floor: "2nd Floor", roomNo: "ICU-Pod-C", bedType: "ICU Ventilator Bed", status: "occupied", patientId: "PAT-2026-8812", patientName: "David D'Souza (71M)", attendingDoctor: "Dr. Farhan Siddiqui", oxygen: true, ventilator: false, telemetry: "Active", admittedAt: "2026-09-13 04:15 PM", expectedDischarge: "2026-09-18 11:00 AM" },
    { bedNo: "MICU-08", wardId: "WARD-ICU", wardName: "Medical & Coronary ICU", floor: "2nd Floor", roomNo: "ICU-Pod-C", bedType: "ICU Ventilator Bed", status: "reserved", patientId: "PAT-2026-8813", patientName: "Reserved for Post-CABG recovery (M. K. Nambiar)", attendingDoctor: "Dr. Ananya Mukherjee", oxygen: true, ventilator: true, telemetry: "Pre-Configured" },

    // Cardiology Step-Down (WARD-CARDIO)
    { bedNo: "4B-101", wardId: "WARD-CARDIO", wardName: "Cardiology Step-Down (Ward 4B)", floor: "4th Floor", roomNo: "Room 401", bedType: "Semi-Private Cardiac Bed", status: "occupied", patientId: "PAT-2026-8814", patientName: "Subba Rao (55M)", attendingDoctor: "Dr. Ananya Mukherjee", oxygen: false, ventilator: false, telemetry: "Active", admittedAt: "2026-09-15 10:00 AM", expectedDischarge: "Today (2026-09-17 01:00 PM)" },
    { bedNo: "4B-102", wardId: "WARD-CARDIO", wardName: "Cardiology Step-Down (Ward 4B)", floor: "4th Floor", roomNo: "Room 401", bedType: "Semi-Private Cardiac Bed", status: "occupied", patientId: "PAT-2026-8815", patientName: "Anita Agarwal (60F)", attendingDoctor: "Dr. Ananya Mukherjee", oxygen: false, ventilator: false, telemetry: "Active", admittedAt: "2026-09-14 02:30 PM", expectedDischarge: "2026-09-18 12:00 PM" },
    { bedNo: "4B-103", wardId: "WARD-CARDIO", wardName: "Cardiology Step-Down (Ward 4B)", floor: "4th Floor", roomNo: "Room 402", bedType: "Semi-Private Cardiac Bed", status: "available", patientId: null, patientName: null, attendingDoctor: null, oxygen: true, ventilator: false, telemetry: "Standby" },
    { bedNo: "4B-104", wardId: "WARD-CARDIO", wardName: "Cardiology Step-Down (Ward 4B)", floor: "4th Floor", roomNo: "Room 402", bedType: "Semi-Private Cardiac Bed", status: "cleaning", patientId: null, patientName: null, attendingDoctor: null, oxygen: true, ventilator: false, telemetry: "Off", cleaningStartedAt: "2026-09-17 10:05 AM", housekeeper: "Housekeeper Sunitha" },
    { bedNo: "4B-108", wardId: "WARD-CARDIO", wardName: "Cardiology Step-Down (Ward 4B)", floor: "4th Floor", roomNo: "Room 404", bedType: "Private Deluxe Room", status: "occupied", patientId: "PAT-2026-8801", patientName: "Rameshwar Prasad Sharma", attendingDoctor: "Dr. Ananya Mukherjee", oxygen: true, ventilator: false, telemetry: "Active", admittedAt: "2026-09-15 08:30 AM", expectedDischarge: "Today (2026-09-17 02:30 PM)" },
    { bedNo: "4B-109", wardId: "WARD-CARDIO", wardName: "Cardiology Step-Down (Ward 4B)", floor: "4th Floor", roomNo: "Room 405", bedType: "Private Deluxe Room", status: "maintenance", patientId: null, patientName: null, attendingDoctor: null, oxygen: false, ventilator: false, telemetry: "Off", maintenanceReason: "Motorized backrest actuator calibration & oxygen flow sensor service" },
    { bedNo: "4B-110", wardId: "WARD-CARDIO", wardName: "Cardiology Step-Down (Ward 4B)", floor: "4th Floor", roomNo: "Room 405", bedType: "Private Deluxe Room", status: "available", patientId: null, patientName: null, attendingDoctor: null, oxygen: true, ventilator: false, telemetry: "Standby" },

    // Orthopaedics & Joint Care (WARD-ORTHO)
    { bedNo: "ORTHO-201", wardId: "WARD-ORTHO", wardName: "Orthopaedics & Joint Care (Ward 2A)", floor: "2nd Floor", roomNo: "Room 201", bedType: "Surgical Recovery Bed", status: "occupied", patientId: "PAT-2026-8816", patientName: "Harish Patel (42M)", attendingDoctor: "Dr. Rajesh K. Nair", oxygen: false, ventilator: false, telemetry: "None", admittedAt: "2026-09-16 07:00 AM", expectedDischarge: "2026-09-19 11:00 AM" },
    { bedNo: "ORTHO-204", wardId: "WARD-ORTHO", wardName: "Orthopaedics & Joint Care (Ward 2A)", floor: "2nd Floor", roomNo: "Room 202", bedType: "Surgical Recovery Bed", status: "occupied", patientId: "PAT-2026-8805", patientName: "Gurpreet Singh Chawla", attendingDoctor: "Dr. Rajesh K. Nair", oxygen: false, ventilator: false, telemetry: "Active", admittedAt: "2026-09-15 11:00 AM", expectedDischarge: "Today (2026-09-17 04:30 PM)" },
    { bedNo: "ORTHO-205", wardId: "WARD-ORTHO", wardName: "Orthopaedics & Joint Care (Ward 2A)", floor: "2nd Floor", roomNo: "Room 203", bedType: "General Ward Bed", status: "available", patientId: null, patientName: null, attendingDoctor: null, oxygen: true, ventilator: false, telemetry: "Standby" },
    { bedNo: "ORTHO-206", wardId: "WARD-ORTHO", wardName: "Orthopaedics & Joint Care (Ward 2A)", floor: "2nd Floor", roomNo: "Room 203", bedType: "General Ward Bed", status: "available", patientId: null, patientName: null, attendingDoctor: null, oxygen: false, ventilator: false, telemetry: "Standby" }
  ],

  admissions: [
    {
      admissionId: "ADM-2026-081",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      uhid: "UHID-2026-8801",
      abhaId: "91-8842-9901-3421",
      bedNo: "4B-108",
      wardId: "WARD-CARDIO",
      wardName: "Cardiology Step-Down (Ward 4B)",
      roomNo: "Room 404",
      admitTime: "2026-09-15 08:30 AM",
      expectedDischarge: "Today (2026-09-17 02:30 PM)",
      dischargeTime: null,
      diagnosis: "CAD s/p PTCA to LAD, Essential Hypertension",
      attendingDoctor: "Dr. Ananya Mukherjee",
      status: "Admitted"
    },
    {
      admissionId: "ADM-2026-082",
      patientId: "PAT-2026-8803",
      patientName: "Venkata Satyanarayana Reddy",
      uhid: "UHID-2026-8803",
      abhaId: "91-7711-2233-4455",
      bedNo: "MICU-03",
      wardId: "WARD-ICU",
      wardName: "Medical & Coronary ICU",
      roomNo: "ICU-Pod-A",
      admitTime: "2026-09-16 09:00 AM",
      expectedDischarge: "2026-09-19 04:00 PM",
      dischargeTime: null,
      diagnosis: "Acute COPD Exacerbation, Type 2 Respiratory Acidosis, CKD Stage 3",
      attendingDoctor: "Dr. Farhan Siddiqui",
      status: "Admitted"
    },
    {
      admissionId: "ADM-2026-083",
      patientId: "PAT-2026-8805",
      patientName: "Gurpreet Singh Chawla",
      uhid: "UHID-2026-8805",
      abhaId: "91-6622-4411-8899",
      bedNo: "ORTHO-204",
      wardId: "WARD-ORTHO",
      wardName: "Orthopaedics & Joint Care (Ward 2A)",
      roomNo: "Room 202",
      admitTime: "2026-09-15 11:00 AM",
      expectedDischarge: "Today (2026-09-17 04:30 PM)",
      dischargeTime: null,
      diagnosis: "L4-L5 Lumbar Disc Herniation s/p Microdiscectomy",
      attendingDoctor: "Dr. Rajesh K. Nair",
      status: "Admitted"
    },
    {
      admissionId: "ADM-2026-084",
      patientId: "PAT-2026-8814",
      patientName: "Subba Rao (55M)",
      uhid: "UHID-2026-8814",
      abhaId: "91-4433-2211-7788",
      bedNo: "4B-101",
      wardId: "WARD-CARDIO",
      wardName: "Cardiology Step-Down (Ward 4B)",
      roomNo: "Room 401",
      admitTime: "2026-09-15 10:00 AM",
      expectedDischarge: "Today (2026-09-17 01:00 PM)",
      dischargeTime: null,
      diagnosis: "Post Angioplasty Day 2 Recovery",
      attendingDoctor: "Dr. Ananya Mukherjee",
      status: "Admitted"
    },
    {
      admissionId: "ADM-2026-085",
      patientId: "PAT-2026-8811",
      patientName: "Farid Ahmed (49M)",
      uhid: "UHID-2026-8811",
      abhaId: "91-5588-9922-1133",
      bedNo: "MICU-05",
      wardId: "WARD-ICU",
      wardName: "Medical & Coronary ICU",
      roomNo: "ICU-Pod-B",
      admitTime: "2026-09-16 11:20 PM",
      expectedDischarge: "Today (2026-09-17 03:00 PM)",
      dischargeTime: null,
      diagnosis: "Acute STEMI, Thrombolyzed, Step-down candidate",
      attendingDoctor: "Dr. Ananya Mukherjee",
      status: "Admitted"
    }
  ],

  bedTransfers: [
    {
      id: "TRF-2026-01",
      patientId: "PAT-2026-8801",
      patientName: "Rameshwar Prasad Sharma",
      uhid: "UHID-2026-8801",
      fromBed: "MICU-02",
      toBed: "4B-108",
      fromWard: "Medical & Coronary ICU",
      toWard: "Cardiology Step-Down (Ward 4B)",
      reason: "Patient stabilized post-stent; stepped down from ICU to intermediate ward",
      transferredBy: "Sr. Nurse Reena Mathews",
      timestamp: "2026-09-16 02:00 PM"
    },
    {
      id: "TRF-2026-02",
      patientId: "PAT-2026-8805",
      patientName: "Gurpreet Singh Chawla",
      uhid: "UHID-2026-8805",
      fromBed: "ORTHO-201",
      toBed: "ORTHO-204",
      fromWard: "Orthopaedics & Joint Care (Ward 2A)",
      toWard: "Orthopaedics & Joint Care (Ward 2A)",
      reason: "Shifted to private window bed per attendant request post-op",
      transferredBy: "Sr. Nurse Sunitha Bai",
      timestamp: "2026-09-16 09:30 AM"
    }
  ]
};
