import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black p-1 flex flex-col">
      {/* Staircase Preloader */}
      {showPreloader && (
        <>
          <div className="preloader">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="preloader-col" />
            ))}
          </div>
          <div className="preloader-center-text">Strata</div>
        </>
      )}
      {/* Main Container with Rounded Corners */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
        className="relative flex-1 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10"
      >
        {/* Background Image */}
        <img
          src="/bg.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start pl-4 pr-6 py-4 md:pl-8 md:pr-10 md:py-5 pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="Strata Logo" className="h-16 w-auto object-contain -ml-2" />
            <span style={{ fontFamily: "'ADLaM Display', sans-serif" }} className="text-[2rem] text-black leading-none tracking-tight">
              Strata
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button className="nav-box-hover">
              Product
            </button>
            <button className="nav-box-hover">
              How it works
            </button>
            <button className="nav-box-hover">
              Sample Analysis
            </button>
            <button className="nav-box-hover flex items-center justify-center gap-2">
              Upload Tender
            </button>
          </div>
        </nav>


        {/* Hero Content */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="absolute top-[23%] left-[5%] md:left-[7%] max-w-[90%] md:max-w-4xl lg:max-w-5xl pointer-events-auto"
          >
            <h1
              style={{ fontFamily: "'Alegreya SC', sans-serif" }}
              className="text-4xl sm:text-5xl md:text-[4.5rem] lg:text-[5rem] text-black leading-[1.15] tracking-tight"
            >
              Win with <span className="bg-[#B8C9B9] px-2 py-0.5 font-medium inline-block leading-[1.15]">clarity,</span> not<br />
              document<br />
              chaos.
            </h1>
          </motion.div>

          {/* Description Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            className="absolute top-[59%] lg:top-[57.5%] left-[8%] lg:left-[7.5%] w-[80%] md:w-[35%] lg:w-[38%] min-h-[160px] md:min-h-[200px] lg:min-h-[280px] p-8 lg:p-10 pointer-events-auto bg-[#c9c6b9]/40 rounded-sm flex flex-col justify-center"
          >
            <h2 style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="text-xl md:text-2xl text-neutral-800 leading-relaxed mb-5 tracking-normal font-normal">
              Strata transforms complex tenders into clear, actionable bid intelligence.
            </h2>
            <p style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="text-base md:text-lg text-neutral-600 leading-loose mt-2">
              Upload a tender to uncover hidden requirements, missing documents, compliance risks, evaluation criteria, and the exact next steps needed to prepare a stronger submission.
            </p>
          </motion.div>
        </div>

        {/* Triangle Grid Behind Cubes */}
        <div className="absolute right-0 bottom-0 w-[55%] lg:w-[52%] h-[65%] lg:h-[72%] z-[5] pointer-events-none overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Horizontal grid lines - only inside triangle */}
            {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((y) => (
              <line key={`h-${y}`} x1={400 - y} y1={y} x2="400" y2={y} stroke="#a8a498" strokeWidth="0.5" opacity="0.35" />
            ))}
            {/* Vertical grid lines - only inside triangle */}
            {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((x) => (
              <line key={`v-${x}`} x1={x} y1={400 - x} x2={x} y2="400" stroke="#a8a498" strokeWidth="0.5" opacity="0.35" />
            ))}
          </svg>
        </div>

      </motion.div>
    </div>
  );
}

export default App;