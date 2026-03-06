import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; 
import toast from "react-hot-toast";
import { generateAIResponse } from "./geminiService";

const DoctorAnswering = () => {
  // ---- STATE MANAGEMENT ----
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [answer, setAnswer] = useState("");

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const fetchAllQueries = async () => {
    setIsRefreshing(true);
    try {
      const q = query(collection(db, "queries"), where("status", "==", "open"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQueries(list);
      toast.success("Database Synchronized");
    } catch (error) {
      toast.error("Sync failed.");
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  useEffect(() => {
    fetchAllQueries();
  }, []);

  // AI Logic: Now injects directly into the main state 'answer'
  const handleGenerate = async () => {
    if (!selectedQuery) return;
    setIsGenerating(true);
    try {
      const response = await generateAIResponse(selectedQuery.message);
      setAnswer(response); 
      toast.success("AI Synthesis complete");
    } catch (error) {
      toast.error("AI synthesis failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const sendAnswer = async () => {
    if (!answer.trim() || !selectedQuery) return;
    try {
      await addDoc(collection(db, "answers"), {
        patientName: selectedQuery.patientName || "Anonymous",
        patientEmail: selectedQuery.patientEmail || "",
        doctorName: "Staff Physician",
        queryTitle: selectedQuery.title,
        queryMessage: selectedQuery.message,
        answerText: answer,
        answerType: "doctor",
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "queries", selectedQuery.id), {
        status: "replied",
      });

      toast.success("Transmitted.");
      setAnswer("");
      setSelectedQuery(null);
      setQueries((prev) => prev.filter((q) => q.id !== selectedQuery.id));
    } catch (error) {
      toast.error("Transmission failed.");
    }
  };

  // ---- DYNAMIC STYLE VARIABLES ----
  const mainBg = isDarkMode ? "bg-slate-950" : "bg-[#fcfcfc]";
  const textMain = isDarkMode ? "text-slate-100" : "text-slate-900";
  const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = isDarkMode ? "bg-slate-900" : "bg-white";
  const borderColor = isDarkMode ? "border-slate-800" : "border-slate-300";
  const modalLeftBg = isDarkMode ? "bg-slate-900" : "bg-slate-50";
  const modalRightBg = isDarkMode ? "bg-slate-950" : "bg-white";
  const modalMsgBg = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300";
  const textareaBg = isDarkMode ? "bg-slate-950 text-slate-100 placeholder:text-slate-700" : "bg-white text-slate-900 placeholder:text-slate-200";

  return (
    <div className={`min-h-screen w-full p-10 ${mainBg} ${textMain} font-sans selection:bg-[#EFB701] transition-colors duration-300`}>
      
      {/* HEADER */}
      <header className="mb-12 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EFB701] mb-2">
            Clinical Management Suite
          </p>
          <h1 className="text-5xl font-black tracking-tighter">
            Inbox<span className="text-[#EFB701]">.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchAllQueries}
            disabled={isRefreshing}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${borderColor} bg-white dark:bg-slate-900 shadow-sm active:scale-95 transition-all`}
          >
            <span className={`${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isRefreshing ? "Syncing" : "Refresh"}
            </span>
          </button>

          <button onClick={toggleDarkMode} className="text-2xl p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <Link 
            to="/" 
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 ${borderColor} hover:border-[#EFB701] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm bg-white dark:bg-slate-900`}
          >
            ← Back
          </Link>
          
          <span className="text-sm font-black px-6 py-3 rounded-full bg-slate-900 text-white dark:bg-[#EFB701] dark:text-slate-950">
            {queries.length} Pending
          </span>
        </div>
      </header>

      {/* INBOX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {queries.map((q) => (
          <div 
            key={q.id}
            className={`group ${cardBg} border-2 ${borderColor} hover:border-[#EFB701] p-8 rounded-[2.5rem] transition-all duration-500 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between`}
            onClick={() => setSelectedQuery(q)}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 rounded-2xl bg-[#EFB701] flex items-center justify-center font-black text-white text-xl shadow-lg">
                  {q.patientName?.charAt(0) || "P"}
                </div>
                <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                   Lvl {q.severity}
                </div>
              </div>
              <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-[#EFB701] transition-colors">
                {q.title}
              </h3>
              <p className={`${textMuted} text-base line-clamp-3 font-medium leading-normal mb-6`}>
                {q.message}
              </p>
            </div>
            
            <div className={`pt-5 border-t ${borderColor} flex justify-between items-center`}>
                <span className="font-bold text-base opacity-50">{q.patientName}</span>
                <span className="text-[#EFB701] font-black text-[10px] uppercase tracking-widest">
                    Process →
                </span>
            </div>
          </div>
        ))}
      </div>

      {queries.length === 0 && (
        <div className={`flex flex-col items-center justify-center py-40 border-4 border-dashed ${borderColor} rounded-[4rem]`}>
          <div className="text-6xl mb-6 grayscale opacity-20">🕊️</div>
          <h2 className={`text-xl font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
            Workspace Clear
          </h2>
        </div>
      )}

      {/* FULL PAGE FOCUSED MODAL */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedQuery(null)} />
          
          <div className={`relative w-full h-full md:max-w-[94vw] md:h-[85vh] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-10 duration-500 border ${borderColor}`}>
            
            {/* Left Column: Details */}
            <div className={`w-full md:w-5/12 p-12 overflow-y-auto border-r ${borderColor} ${modalLeftBg}`}>
                <button onClick={() => setSelectedQuery(null)} className="mb-10 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center gap-2 transition-colors">
                    <span>←</span> Return
                </button>
                <p className="text-[#EFB701] font-black text-[9px] uppercase tracking-[0.4em] mb-2 text-center lg:text-left">Subject Case</p>
                <h2 className={`text-4xl font-black mb-8 leading-tight tracking-tighter ${textMain}`}>
                    {selectedQuery.title}
                </h2>
                <div className={`p-8 rounded-[2rem] border mb-10 shadow-sm ${modalMsgBg}`}>
                    <p className={`text-lg font-medium leading-relaxed italic ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} opacity-90`}>
                        "{selectedQuery.message}"
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${textMuted}`}>Verified Patient</p>
                    <p className={`font-black text-2xl tracking-tighter ${textMain}`}>{selectedQuery.patientName}</p>
                    <p className={`text-base ${textMuted} font-medium italic`}>{selectedQuery.patientEmail}</p>
                </div>
            </div>

            {/* Right Column: Editable Response Box */}
            <div className={`flex-1 p-12 flex flex-col ${modalRightBg}`}>
                <textarea
                    autoFocus
                    className={`flex-1 w-full text-2xl font-bold outline-none resize-none leading-relaxed mb-8 bg-transparent ${textareaBg} placeholder:opacity-30`}
                    placeholder="Enter Clinical Response or use AI Assist to populate this workspace..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />

                <div className="flex gap-6">
                  {/* Generate/Regenerate Button */}
                  <button 
                    onClick={handleGenerate} 
                    disabled={isGenerating} 
                    className="flex-1 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border border-[#EFB701] text-[#EFB701] hover:bg-[#EFB701] hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-30"
                  >
                    {isGenerating ? "..." : (answer ? "Regenerate AI ✨" : "AI Assist")}
                  </button>

                  {/* Transmit Button */}
                  <button 
                    onClick={sendAnswer} 
                    disabled={!answer.trim()} 
                    className="flex-[2] py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] bg-[#EFB701] text-white shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                  >
                    Transmit Response
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAnswering;