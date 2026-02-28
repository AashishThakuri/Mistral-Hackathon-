import { motion } from "framer-motion";

function App() {
  return (
    <div className="min-h-screen bg-black p-1 flex flex-col">
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
        <nav className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start pl-4 pr-16 py-4 md:pl-8 md:pr-24 md:py-5 pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="Strata Logo" className="h-16 w-auto object-contain -ml-2" />
            <span style={{ fontFamily: "'ADLaM Display', sans-serif" }} className="text-[2rem] text-black leading-none tracking-tight">
              Strata
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 rounded-full border border-neutral-400/60 text-sm font-medium text-black bg-transparent hover:bg-black/5 transition-colors cursor-pointer">
              Home
            </button>
            <button className="px-5 py-2 rounded-full border border-neutral-400/60 text-sm font-medium text-black bg-transparent hover:bg-black/5 transition-colors cursor-pointer">
              About
            </button>
            <button className="px-5 py-2 rounded-full border border-neutral-400/60 text-sm font-medium text-black bg-transparent hover:bg-black/5 transition-colors cursor-pointer">
              How It Works
            </button>
            <button className="px-5 py-2 rounded-full border border-neutral-400/60 text-sm font-medium text-black bg-transparent hover:bg-black/5 transition-colors cursor-pointer flex items-center gap-2">
              Resources
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="px-5 py-2 rounded-full text-sm font-medium text-white bg-black hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2">
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
            className="absolute top-[20%] left-[8%] md:left-[10%] max-w-2xl lg:max-w-3xl pointer-events-auto"
          >
            <h1
              style={{ fontFamily: "'Abel', sans-serif" }}
              className="text-4xl sm:text-5xl md:text-[5rem] text-black leading-[1.1] tracking-tight"
            >
              Win with <span className="bg-[#8DE1DD] px-2 font-medium">clarity,</span><br />
              not document <br className="hidden md:block" />
              chaos.
            </h1>
          </motion.div>

          {/* Description Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-[50%] lg:top-[50%] left-[8%] lg:left-[8.1%] w-[80%] md:w-[35%] lg:w-[37.6%] min-h-[260px] md:min-h-[300px] lg:min-h-[365px] p-6 lg:p-10 pointer-events-auto bg-[#c9c6b9]/90 border border-[#b8b5a8] shadow-sm rounded-sm flex flex-col justify-center"
          >
            <h2 className="text-xl md:text-2xl text-neutral-900 font-serif leading-tight mb-4 tracking-tight">
              Strata transforms complex tenders into clear, actionable bid intelligence.
            </h2>
            <p className="text-base md:text-lg text-neutral-800 leading-relaxed font-sans mt-2">
              Upload a tender to uncover hidden requirements, missing documents, compliance risks, evaluation criteria, and the exact next steps needed to prepare a stronger submission.
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}

export default App;