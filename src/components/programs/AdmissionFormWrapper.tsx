"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Loader2,
  Send,
  RotateCcw,
} from "lucide-react";

interface AdmissionFormWrapperProps {
  initialDiscipline?: string;
  initialCourse?: string;
}

const INDIAN_STATES = [
  "Andaman and Nicobar",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra And Nagar Haveli",
  "Daman And Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const STATE_CITIES: Record<string, string[]> = {
  Haryana: [
    "Panipat",
    "Sonipat",
    "Karnal",
    "Gurugram",
    "Faridabad",
    "Rohtak",
    "Hisar",
    "Ambala",
    "Kurukshetra",
    "Yamunanagar",
    "Panchkula",
    "Bhiwani",
    "Sirsa",
    "Bahadurgarh",
    "Jhajjar",
    "Rewari",
    "Kaithal",
    "Palwal",
  ],
  Delhi: [
    "New Delhi",
    "Central Delhi",
    "East Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
    "Dwarka",
    "Rohini",
  ],
  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Mohali",
    "Hoshiarpur",
    "Pathankot",
    "Moga",
    "Abohar",
    "Phagwara",
  ],
  "Uttar Pradesh": [
    "Noida",
    "Greater Noida",
    "Ghaziabad",
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Meerut",
    "Prayagraj",
    "Bareilly",
    "Aligarh",
    "Moradabad",
    "Saharanpur",
    "Gorakhpur",
    "Muzaffarnagar",
    "Mathura",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Udaipur",
    "Bhilwara",
    "Alwar",
    "Bharatpur",
    "Sikar",
  ],
  Bihar: [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Purnia",
    "Darbhanga",
    "Bihar Sharif",
    "Arrah",
    "Begusarai",
  ],
  Chandigarh: ["Chandigarh"],
  "Himachal Pradesh": [
    "Shimla",
    "Dharamshala",
    "Mandi",
    "Solan",
    "Kullu",
    "Manali",
    "Baddi",
    "Hamirpur",
  ],
  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Udhampur",
    "Kathua",
  ],
  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Roorkee",
    "Haldwani",
    "Rishikesh",
    "Kashipur",
    "Rudrapur",
  ],
  "Madhya Pradesh": [
    "Indore",
    "Bhopal",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Navi Mumbai",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Gandhinagar",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Kharagpur",
  ],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Tirupati",
  ],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
};

const DISCIPLINES: string[] = [
  "Computer Science and Engineering",
  "Management",
  "Commerce",
  "Pharmacy",
  "Law",
  "Sciences",
  "Computer Application",
  "Forensic Science",
  "Nutrition and Dietetics",
  "Humanities and Social Science",
  "Agriculture",
  "Hospitality and Hotel Management",
];

const DISCIPLINE_COURSES: Record<string, string[]> = {
  "Computer Science and Engineering": [
    "B.Tech CSE (Hons.) AI & Machine Learning",
    "B.Tech CSE (Hons.) Cyber Security",
    "B.Tech CSE (Hons.) Data Science",
    "B.Tech CSE (Hons.) Full Stack Development",
    "B.Tech CSE (Hons.) Cloud Computing",
    "B.Tech Computer Science & Engineering",
    "M.Tech Computer Science & Engineering",
    "Ph.D. in Computer Science & Engineering",
  ],
  Management: [
    "BBA (Bachelor of Business Administration)",
    "BBA (Hons.) Digital Marketing",
    "BBA (Hons.) Financial Markets",
    "BBA (Hons.) International Business",
    "MBA (Master of Business Administration)",
    "MBA in Pharmaceutical Management",
    "MBA in Hospital Administration",
    "Ph.D. in Management",
  ],
  Commerce: [
    "B.Com (Hons.)",
    "B.Com (Hons.) with ACCA",
    "M.Com (Master of Commerce)",
    "Ph.D. in Commerce",
  ],
  Pharmacy: [
    "D.Pharm. (Diploma in Pharmacy)",
    "B.Pharm. (Bachelor of Pharmacy)",
    "B.Pharm. (Lateral Entry)",
    "M.Pharm. (Pharmaceutics)",
    "M.Pharm. (Pharmacology)",
    "Ph.D. in Pharmaceutical Sciences",
  ],
  Law: [
    "B.A. LL.B. (Hons.) - 5 Years Integrated",
    "B.B.A. LL.B. (Hons.) - 5 Years Integrated",
    "LL.B. (Hons.) - 3 Years",
    "LL.M. (Master of Laws) - 1 Year",
    "Ph.D. in Law",
  ],
  Sciences: [
    "B.Sc. (Hons.) Physics",
    "B.Sc. (Hons.) Chemistry",
    "B.Sc. (Hons.) Mathematics",
    "B.Sc. (Hons.) Microbiology",
    "M.Sc. Physics",
    "M.Sc. Chemistry",
    "M.Sc. Mathematics",
    "M.Sc. Microbiology",
    "Ph.D. in Sciences",
  ],
  "Computer Application": [
    "BCA (Bachelor of Computer Applications)",
    "BCA (Hons.) AI & Data Science",
    "MCA (Master of Computer Applications)",
    "Ph.D. in Computer Applications",
  ],
  "Forensic Science": [
    "B.Sc. (Hons.) Forensic Science",
    "M.Sc. Forensic Science",
    "Ph.D. in Forensic Science",
  ],
  "Nutrition and Dietetics": [
    "B.Sc. (Hons.) Nutrition & Dietetics",
    "M.Sc. Nutrition & Dietetics",
    "Ph.D. in Nutrition & Dietetics",
  ],
  "Humanities and Social Science": [
    "B.A. (Hons.) Bachelor of Arts",
    "B.A. (Hons.) Psychology",
    "B.A. (Hons.) English",
    "B.A. (Hons.) Political Science",
    "B.A. (Hons.) Economics",
    "M.A. Psychology",
    "M.A. English",
    "Ph.D. in Humanities",
  ],
  Agriculture: [
    "B.Sc. (Hons.) Agriculture - 4 Years",
    "M.Sc. Agronomy",
    "M.Sc. Horticulture",
    "Ph.D. in Agricultural Sciences",
  ],
  "Hospitality and Hotel Management": [
    "BHMCT (Bachelor of Hotel Management & Catering Technology)",
    "B.Sc. (Hons.) Hotel Management",
    "Diploma in Hotel Management & Catering Technology",
    "Diploma in Food & Beverage Operations",
  ],
};

function resolveDiscipline(hint?: string): string {
  if (!hint) return "";
  const lower = hint.toLowerCase();
  if (lower.includes("pharmacy")) return "Pharmacy";
  if (lower.includes("computer science") || lower.includes("cse"))
    return "Computer Science and Engineering";
  if (
    lower.includes("computer application") ||
    lower.includes("bca") ||
    lower.includes("mca")
  )
    return "Computer Application";
  if (lower.includes("management") || lower.includes("business"))
    return "Management";
  if (lower.includes("commerce")) return "Commerce";
  if (lower.includes("law")) return "Law";
  if (lower.includes("forensic")) return "Forensic Science";
  if (lower.includes("nutrition") || lower.includes("dietetics"))
    return "Nutrition and Dietetics";
  if (
    lower.includes("humanities") ||
    lower.includes("arts") ||
    lower.includes("social")
  )
    return "Humanities and Social Science";
  if (lower.includes("agriculture") || lower.includes("agricultural"))
    return "Agriculture";
  if (lower.includes("hotel") || lower.includes("hospitality"))
    return "Hospitality and Hotel Management";
  if (lower.includes("science")) return "Sciences";
  return "";
}

export default function AdmissionFormWrapper({
  initialDiscipline = "",
  initialCourse = "",
}: AdmissionFormWrapperProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    city: "",
    customCity: "",
    discipline: "",
    course: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-detect matching discipline from initialDiscipline prop or current URL
  useEffect(() => {
    let matched = resolveDiscipline(initialDiscipline);
    if (!matched && typeof window !== "undefined") {
      matched = resolveDiscipline(window.location.pathname);
    }
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        discipline: matched,
        course: prev.course || initialCourse,
      }));
    }
  }, [initialDiscipline, initialCourse]);

  // Handle discipline change -> reset course
  const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextDisc = e.target.value;
    setFormData((prev) => ({
      ...prev,
      discipline: nextDisc,
      course: "",
    }));
  };

  // Handle state change -> reset city
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: nextState,
      city: "",
      customCity: "",
    }));
  };

  const availableCities = formData.state ? STATE_CITIES[formData.state] || [] : [];
  const availableCourses = formData.discipline
    ? DISCIPLINE_COURSES[formData.discipline] || []
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Form validations
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const cleanedMobile = formData.mobile.replace(/\D/g, "");
    if (cleanedMobile.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.state) {
      setErrorMessage("Please select your state.");
      return;
    }

    const finalCity =
      formData.city === "Other" ? formData.customCity.trim() : formData.city;
    if (!finalCity) {
      setErrorMessage("Please select or enter your city.");
      return;
    }

    if (!formData.discipline) {
      setErrorMessage("Please select a discipline.");
      return;
    }

    if (!formData.course) {
      setErrorMessage("Please select a course.");
      return;
    }

    if (!formData.agree) {
      setErrorMessage("Please agree to receive admission information.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: cleanedMobile,
          state: formData.state,
          city: finalCity,
          discipline: formData.discipline,
          course: formData.course,
          agree: formData.agree,
          page_url: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLeadId(data.leadId);
        setSubmitted(true);
      } else {
        setErrorMessage(
          data.message || "Failed to submit enquiry. Please try again."
        );
      }
    } catch {
      setErrorMessage("Network issue. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setLeadId("");
    setErrorMessage("");
    setFormData({
      name: "",
      email: "",
      mobile: "",
      state: "",
      city: "",
      customCity: "",
      discipline: resolveDiscipline(initialDiscipline),
      course: "",
      agree: false,
    });
  };

  return (
    <div
      className="relative overflow-hidden w-full transition-all duration-300 border border-slate-200/90 shadow-[0_12px_36px_rgba(10,31,68,0.09)] bg-white"
      style={{
        borderRadius: "20px",
        borderTop: "5px solid #F37021",
        padding: "20px 18px 18px",
        width: "100%",
      }}
    >
      {/* ── CARD HEADER ── */}
      <div className="text-center pb-3 mb-4 border-b border-slate-100">
        <h3 className="text-[#0A1F44] font-extrabold text-[22px] sm:text-[24px] tracking-tight leading-tight">
          Enquire Now
        </h3>
      </div>

      {/* ── SUCCESS STATE ── */}
      {submitted ? (
        <div className="py-6 px-3 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={36} className="text-emerald-600" />
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-bold text-[#0A1F44]">
              Thank You, {formData.name.split(" ")[0]}!
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-[280px] mx-auto">
              Your enquiry has been received and is available to our admissions team.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-left text-xs space-y-1.5 text-slate-700">
            <div className="flex justify-between items-center text-slate-500 text-[11px] border-b border-slate-200/60 pb-1">
              <span>Reference ID</span>
              <span className="font-mono font-semibold text-[#0A1F44]">#{leadId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program:</span>
              <span className="font-semibold text-right max-w-[170px] truncate text-[#0A1F44]">
                {formData.course || formData.discipline}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact:</span>
              <span className="font-semibold text-[#0A1F44]">+91 {formData.mobile}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#F37021] hover:text-[#d95d13] transition-colors pt-2"
          >
            <RotateCcw size={13} />
            Submit Another Enquiry
          </button>
        </div>
      ) : (
        /* ── FORM ── */
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Name */}
          <div>
            <label
              htmlFor="gu_name"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="gu_name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter Name *"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] rounded-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all"
                required
              />
            </div>
          </div>

          {/* 2. Email Address */}
          <div>
            <label
              htmlFor="gu_email"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="gu_email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter Email Address *"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] rounded-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all"
                required
              />
            </div>
          </div>

          {/* 3. Mobile Number */}
          <div>
            <label
              htmlFor="gu_mobile"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative flex">
              <span className="inline-flex items-center gap-1 px-2.5 border border-r-0 border-slate-200 bg-slate-100/80 rounded-l-xl text-xs font-semibold text-slate-600 select-none">
                <span>🇮🇳</span>
                <span>+91</span>
              </span>
              <input
                id="gu_mobile"
                type="tel"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                placeholder="Enter Mobile Number *"
                className="w-full px-3 py-2 text-xs sm:text-[13px] rounded-r-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all"
                required
              />
            </div>
          </div>

          {/* 4 & 5. State & City (2-column on sm) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* State */}
            <div>
              <label
                htmlFor="gu_state"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <select
                  id="gu_state"
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full pl-8 pr-6 py-2 text-xs sm:text-[13px] rounded-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select State *</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="gu_city"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                City <span className="text-red-500">*</span>
              </label>
              {availableCities.length > 0 ? (
                <div className="relative">
                  <Building2
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <select
                    id="gu_city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                        customCity: "",
                      })
                    }
                    className="w-full pl-8 pr-6 py-2 text-xs sm:text-[13px] rounded-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select City *</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Other">Other (Type City)</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                    ▼
                  </div>
                </div>
              ) : (
                <input
                  id="gu_city"
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Enter City *"
                  className="w-full px-3 py-2 text-xs sm:text-[13px] rounded-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all"
                  required
                />
              )}
            </div>
          </div>

          {/* Conditional Custom City input if "Other" selected */}
          {formData.city === "Other" && (
            <div>
              <label
                htmlFor="gu_custom_city"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Type Your City <span className="text-red-500">*</span>
              </label>
              <input
                id="gu_custom_city"
                type="text"
                value={formData.customCity}
                onChange={(e) =>
                  setFormData({ ...formData, customCity: e.target.value })
                }
                placeholder="Enter City Name *"
                className="w-full px-3 py-2 text-xs sm:text-[13px] rounded-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all"
                required
              />
            </div>
          )}

          {/* 6. Discipline */}
          <div>
            <label
              htmlFor="gu_discipline"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Discipline <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <select
                id="gu_discipline"
                value={formData.discipline}
                onChange={handleDisciplineChange}
                className="w-full pl-8 pr-6 py-2 text-xs sm:text-[13px] rounded-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Select Discipline *</option>
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* 7. Course */}
          <div>
            <label
              htmlFor="gu_course"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Course <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookOpen
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <select
                id="gu_course"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                disabled={!formData.discipline}
                className="w-full pl-8 pr-6 py-2 text-xs sm:text-[13px] rounded-xl border border-slate-200 bg-slate-50/50 text-[#0A1F44] focus:bg-white focus:outline-none focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/15 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {formData.discipline
                    ? "Select Course *"
                    : "First Select a Discipline *"}
                </option>
                {availableCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* 8. Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-600 leading-tight">
              <input
                type="checkbox"
                checked={formData.agree}
                onChange={(e) =>
                  setFormData({ ...formData, agree: e.target.checked })
                }
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#F37021] focus:ring-[#F37021] accent-[#F37021] cursor-pointer"
              />
              <span>
                I agree to receive information regarding my submitted enquiry on{" "}
                <span className="font-semibold text-[#0A1F44]">
                  Geeta University
                </span>{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {/* 9. Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F37021] hover:bg-[#d95d13] text-white text-xs sm:text-[13px] font-bold tracking-wide shadow-md shadow-[#F37021]/20 hover:shadow-lg hover:shadow-[#F37021]/30 transition-all duration-200 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Submitting Enquiry...</span>
              </>
            ) : (
              <>
                <span>Enquire Now</span>
                <Send size={14} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
