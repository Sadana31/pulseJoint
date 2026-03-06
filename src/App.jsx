import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DoctorAnswering from "./doctor"; 
import PatientAsking from "./patient";

const Home = () => (
  <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center p-6">
    <div className="mb-16 text-center">
      {/* Updated to EFB701 */}
      <div className="inline-block bg-[#EFB701] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-white">
        HealthLink v2.0
      </div>
      <h1 className="text-7xl font-black tracking-tighter text-slate-900">
        Portal Select<span className="text-[#EFB701]">.</span>
      </h1>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      <Link
        to="/patient"
        className="group relative bg-white border-2 border-slate-100 p-10 rounded-[3rem] transition-all hover:border-slate-900 hover:shadow-2xl overflow-hidden"
      >
        <div className="relative z-10">
          <span className="text-4xl mb-6 block">🩹</span>
          <h2 className="text-3xl font-black mb-2">Patient</h2>
          <p className="text-slate-500 font-medium italic">"I need medical advice."</p>
        </div>
        <div className="mt-8 flex items-center text-sm font-black uppercase tracking-widest group-hover:gap-4 transition-all">
          Enter Portal <span>→</span>
        </div>
      </Link>

      <Link
        to="/doctor"
        className="group relative bg-[#EFB701] p-10 rounded-[3rem] transition-all hover:shadow-[0_30px_60px_rgba(239,183,1,0.4)] hover:-translate-y-1 overflow-hidden"
      >
        <div className="relative z-10 text-white">
          <span className="text-4xl mb-6 block drop-shadow-md">🩺</span>
          <h2 className="text-3xl font-black mb-2">Physician</h2>
          <p className="text-white/80 font-medium italic">"I am here to help."</p>
        </div>
        <div className="mt-8 flex items-center text-sm font-black uppercase tracking-widest text-white group-hover:gap-4 transition-all">
          Login to Suite <span>→</span>
        </div>
        <div className="absolute -bottom-10 -right-10 text-[10rem] opacity-20 pointer-events-none group-hover:rotate-12 transition-transform text-white">
          ⚕️
        </div>
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<DoctorAnswering />} />
        <Route path="/patient" element={<PatientAsking />} />
      </Routes>
    </Router>
  );
}

export default App;