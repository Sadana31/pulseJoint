import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; 
import toast from "react-hot-toast";

export default function PatientAsking() {
  const navigate = useNavigate();

  // ---- DARK MODE STATE & LOGIC ----
  const [isDarkMode, setIsDarkMode] = useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "General Consultation",
    title: "",
    message: "",
    severity: 3,
    patientName: "", 
    patientEmail: "",
  });

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "severity" ? Number(value) : value,
    }));
  }

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "queries"), {
        patientName: form.patientName || "Anonymous Patient",
        patientEmail: form.patientEmail || "No Email Provided",
        category: form.category,
        title: form.title,
        message: form.message,
        severity: form.severity,
        status: "open",
        doctorID: "global", 
        createdAt: serverTimestamp(),
      });

      toast.success("Inquiry transmitted to clinical pool.");
      navigate("/"); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to transmit message.");
    }
    setLoading(false);
  }

  // --- STYLING VARIABLES ---
  const bgColor = isDarkMode ? "bg-slate-950" : "bg-[#fcfcfc]";
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-900";
  const mutedTextColor = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBgColor = isDarkMode ? "bg-slate-900" : "bg-white";
  const borderColor = isDarkMode ? "border-slate-800" : "border-slate-300";
  const inputBgColor = isDarkMode ? "bg-slate-800" : "bg-white";
  const inputBorderColor = isDarkMode ? "border-slate-700" : "border-slate-400"; 
  const labelTextColor = isDarkMode ? "text-slate-300" : "text-slate-800"; 

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans ${bgColor} ${textColor} selection:bg-[#EFB701] selection:text-white transition-colors duration-500`}
    >
      <div className="px-4 md:px-20 flex flex-col gap-10">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#EFB701] animate-pulse" />
              <p className={`text-xs font-black uppercase tracking-[0.3em] ${mutedTextColor}`}>
                Open Clinical Pool
              </p>
            </div>
            <h1 className="text-6xl font-black tracking-tighter">
              Consultation<span className="text-[#EFB701]">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl border-2 ${inputBorderColor} ${cardBgColor} hover:border-[#EFB701] transition-all active:scale-90`}
            >
              <span className="text-xl">{isDarkMode ? "☀️" : "🌙"}</span>
            </button>

            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-xl border-2 ${inputBorderColor} ${cardBgColor} px-6 py-3 text-[13px] font-black uppercase tracking-widest hover:border-[#EFB701] transition-all shadow-md`}
            >
              BACK
            </Link>
          </div>
        </header>

        {/* MAIN FORM */}
        <form
          onSubmit={submitForm}
          className={`rounded-[3rem] border-2 ${borderColor} ${cardBgColor} p-10 sm:p-12 shadow-2xl shadow-black/5 transition-all duration-500`}
        >
          <div className="grid gap-10">
            
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${labelTextColor}`}>
                  Full Name
                </label>
                <input
                  name="patientName"
                  value={form.patientName}
                  onChange={updateField}
                  required
                  placeholder="John Doe"
                  className={`w-full rounded-xl border-2 ${inputBorderColor} ${inputBgColor} px-5 py-4 text-lg font-bold focus:border-[#EFB701] focus:ring-4 focus:ring-[#EFB701]/10 outline-none transition-all`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${labelTextColor}`}>
                  Contact Email
                </label>
                <input
                  type="email"
                  name="patientEmail"
                  value={form.patientEmail}
                  onChange={updateField}
                  required
                  placeholder="john@example.com"
                  className={`w-full rounded-xl border-2 ${inputBorderColor} ${inputBgColor} px-5 py-4 text-lg font-bold focus:border-[#EFB701] focus:ring-4 focus:ring-[#EFB701]/10 outline-none transition-all`}
                />
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
               <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${labelTextColor}`}>
                  Case Classification
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  className={`w-full rounded-xl border-2 ${inputBorderColor} ${inputBgColor} px-5 py-4 text-lg font-bold focus:border-[#EFB701] focus:ring-4 focus:ring-[#EFB701]/10 outline-none transition-all cursor-pointer appearance-none`}
                >
                  <option>General Consultation</option>
                  <option>New Symptom</option>
                  <option>Medication Question</option>
                  <option>Urgent Concern</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${labelTextColor}`}>
                  Subject line
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  required
                  placeholder="Brief summary..."
                  className={`w-full rounded-xl border-2 ${inputBorderColor} ${inputBgColor} px-5 py-4 text-lg font-bold focus:border-[#EFB701] focus:ring-4 focus:ring-[#EFB701]/10 outline-none transition-all`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ${labelTextColor}`}>
                Detailed Clinical Inquiry
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={updateField}
                rows={5}
                required
                placeholder="Describe symptoms, duration, and medical history..."
                className={`w-full rounded-[2rem] border-2 ${inputBorderColor} ${inputBgColor} px-6 py-4 text-lg font-bold focus:border-[#EFB701] focus:ring-4 focus:ring-[#EFB701]/10 outline-none transition-all resize-none shadow-inner`}
              />
            </div>

            {/* SEVERITY SLIDER */}
            <div className={`flex flex-col gap-6 rounded-[2rem] border-2 ${borderColor} bg-slate-100 dark:bg-slate-800/50 p-8 transition-all`}>
              <div className="flex items-center justify-between">
                <label className={`text-[10px] font-black uppercase tracking-widest ${labelTextColor}`}>
                  Self-Assessed Severity
                </label>
                <span className="bg-[#EFB701] px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-lg">
                  Level {form.severity} / 10
                </span>
              </div>
              <input
                type="range"
                name="severity"
                min="1"
                max="10"
                value={form.severity}
                onChange={updateField}
                className="w-full h-2 accent-[#EFB701] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-[1.5rem] bg-[#EFB701] text-white font-black uppercase text-[13px] tracking-[0.3em] shadow-[0_20px_40px_rgba(239,183,1,0.3)] hover:scale-[1.01] hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
            >
              {loading ? "Transmitting..." : "Submit to Clinical Pool"}
            </button>
          </div>
        </form>

        <footer className={`flex flex-col md:flex-row justify-between items-center gap-4 px-10 ${mutedTextColor}`}>
           <p className="text-[10px] font-black uppercase tracking-[0.2em]">PulsePoint Global Inbox System</p>
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Data Transmission Active</span>
           </div>
        </footer>
      </div>
    </div>
  );
}