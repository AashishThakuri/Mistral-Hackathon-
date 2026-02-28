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
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex-1 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10"
      >
        {/* Background Image */}
        <img
          src="/bg.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start pl-4 pr-4 py-4 md:pl-8 md:pr-52 md:py-5 pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="Strata Logo" className="h-16 w-auto object-contain -ml-2" />
            <span style={{ fontFamily: "'ADLaM Display', sans-serif" }} className="text-[2rem] text-black leading-none tracking-tight">
              Strata
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <button className="nav-shine px-5 py-2 rounded-lg border border-neutral-400/60 text-sm font-medium bg-transparent hover:bg-black/5 transition-colors cursor-pointer">
              Home
            </button>
            <button className="nav-shine px-5 py-2 rounded-lg border border-neutral-400/60 text-sm font-medium bg-transparent hover:bg-black/5 transition-colors cursor-pointer">
              About
            </button>
            <button className="nav-shine px-5 py-2 rounded-lg border border-neutral-400/60 text-sm font-medium bg-transparent hover:bg-black/5 transition-colors cursor-pointer">
              How It Works
            </button>
            <button className="nav-shine px-5 py-2 rounded-lg border border-neutral-400/60 text-sm font-medium bg-transparent hover:bg-black/5 transition-colors cursor-pointer flex items-center gap-2">
              Resources
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-black hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2">
              More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>


        {/* Hero Content */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-[23%] left-[5%] md:left-[7%] max-w-2xl lg:max-w-3xl pointer-events-auto"
          >
            <h1
              style={{ fontFamily: "'Alegreya SC', sans-serif" }}
              className="text-4xl sm:text-5xl md:text-[5rem] text-black leading-[1.1] tracking-tight"
            >
              Win with <span className="bg-[#8DE1DD] px-2 py-0.5 font-medium inline-block leading-[1.15]">clarity,</span> not<br />
              document chaos.
            </h1>
          </motion.div>

          {/* Description Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-[55%] lg:top-[58%] left-[8%] lg:left-[7.5%] w-[80%] md:w-[35%] lg:w-[38%] min-h-[160px] md:min-h-[200px] lg:min-h-[280px] p-6 lg:p-8 pointer-events-auto bg-[#c9c6b9]/90 border border-[#b8b5a8] shadow-sm rounded-sm flex flex-col justify-center"
          >
            <h2 style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="text-xl md:text-2xl text-neutral-900 leading-tight mb-4 tracking-tight">
              Strata transforms complex tenders into clear, actionable bid intelligence.
            </h2>
            <p style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="text-base md:text-lg text-neutral-800 leading-relaxed mt-2">
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