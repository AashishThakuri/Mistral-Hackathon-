import { motion } from "framer-motion";
import { useState, useRef } from "react";

interface UploadTenderProps {
    onBack: () => void;
}

function UploadTender({ onBack }: UploadTenderProps) {

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);



    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setUploadedFile(file);
    };

    return (
        <div className="min-h-screen bg-black p-1 flex flex-col">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex-1 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10"
                style={{ background: "#f0ebe1" }}
            >
                {/* Navbar */}
                <nav className="relative z-20 flex justify-between items-center px-6 md:px-10 py-5">
                    {/* Logo */}
                    <button onClick={onBack} className="flex items-center gap-1 cursor-pointer">
                        <img src="/logo.png" alt="Strata Logo" className="h-14 w-auto object-contain -ml-2" />
                        <span style={{ fontFamily: "'ADLaM Display', sans-serif" }} className="text-[1.8rem] text-black leading-none tracking-tight">
                            Strata
                        </span>
                    </button>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <button className="nav-box-hover">
                            Sample Analysis
                        </button>
                        <button className="nav-box-hover opacity-40 cursor-not-allowed" disabled title="Complete an upload first">
                            Workspace
                        </button>
                        <button className="nav-box-hover">
                            Help
                        </button>
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="nav-box-hover flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </button>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute right-0 top-full mt-2 w-40 rounded-lg overflow-hidden shadow-lg border border-[#d4d0c5]"
                                    style={{ background: "#f0ebe1" }}
                                >
                                    <button className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-[#e5e0d5] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                                        Settings
                                    </button>
                                    <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-[#e5e0d5] transition-colors border-t border-[#d4d0c5]" style={{ fontFamily: "Inter, sans-serif" }}>
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="flex flex-col items-center justify-center px-6" style={{ minHeight: "calc(100vh - 120px)" }}>
                    {/* Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-center mb-12"
                    >
                        <h1
                            style={{ fontFamily: "'Alegreya SC', sans-serif" }}
                            className="text-4xl md:text-5xl lg:text-6xl text-black leading-[1.2] tracking-tight mb-6"
                        >
                            Before you bid,<br />
                            know what matters.
                        </h1>
                        <p
                            style={{ fontFamily: "'Alegreya SC', sans-serif" }}
                            className="text-lg md:text-xl text-neutral-500 leading-relaxed"
                        >
                            Turn tender documents into actionable bid intelligence.
                        </p>
                    </motion.div>

                    {/* Upload Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="w-full max-w-xl flex flex-col items-center"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {!uploadedFile ? (
                            <>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-[#2a2f36] hover:bg-[#1a1d24] text-white px-10 py-4 text-[15px] font-medium transition-colors rounded-[3px] shadow-sm tracking-wide"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    Upload Tender Files
                                </button>

                                {/* Secondary link */}
                                <p
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                    className="mt-5 text-[13px] text-neutral-400"
                                >
                                    or <button className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">view sample analysis</button>
                                </p>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-2xl border border-[#B8C9B9] bg-[#B8C9B9]/10 p-8 text-center w-full"
                            >
                                <svg className="w-12 h-12 mx-auto text-[#7aa87a] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p style={{ fontFamily: "Inter, sans-serif" }} className="text-lg font-medium text-neutral-800 mb-1">
                                    {uploadedFile.name}
                                </p>
                                <p style={{ fontFamily: "Inter, sans-serif" }} className="text-sm text-neutral-500 mb-6">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => setUploadedFile(null)}
                                        className="nav-box-hover"
                                        style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
                                    >
                                        Remove
                                    </button>
                                    <button
                                        className="nav-box-hover"
                                        style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", padding: "12px 32px", background: "#B8C9B9" }}
                                    >
                                        Analyze Tender
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Trust Badges */}
                    {!uploadedFile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="mt-28 flex flex-col items-center"
                        >
                            <p style={{ fontFamily: "Inter, sans-serif" }} className="text-[11px] text-[#a8a498] mb-8 tracking-wide">
                                Used by professionals at top firms
                            </p>
                            <div className="flex items-center gap-10 md:gap-16 opacity-30 grayscale text-[#8a8578]">
                                <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] font-bold tracking-[0.15em]">MCKINSEY</span>
                                <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] font-bold tracking-[0.15em]">BCG</span>
                                <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] font-bold tracking-[0.15em]">BAIN</span>
                                <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] font-bold tracking-[0.15em]">DELOITTE</span>
                            </div>

                            <button className="mt-12 border border-[#d2cec3] text-[#a8a498] px-6 py-1.5 rounded-full text-[12px] hover:bg-[#e8e4da]/50 transition-colors tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                                Free tier available
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Decorative subtle shapes */}
                <div className="absolute top-[15%] left-[8%] w-32 h-32 opacity-[0.04] pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="none">
                        <polygon points="50,5 95,95 5,95" stroke="#8a8578" strokeWidth="1" />
                    </svg>
                </div>
                <div className="absolute bottom-[20%] right-[10%] w-40 h-40 opacity-[0.04] pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="none">
                        <polygon points="50,5 95,95 5,95" stroke="#8a8578" strokeWidth="1" />
                    </svg>
                </div>
            </motion.div>
        </div>
    );
}

export default UploadTender;
