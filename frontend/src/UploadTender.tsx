import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface UploadTenderProps {
    onBack: () => void;
}

interface AnalysisData {
    mandatory_requirements: { requirement: string; criticality: string }[];
    required_documents: string[];
    risks_flagged: string[];
    evaluation_criteria: { criterion: string; weight: string }[];
    evidence_snippets: string[];
}

const STAGES = [
    { title: "Parsing tender structure", desc: "reading pages, extracting sections, identifying annexes", details: "reading pages, extracting sections, identifying annexes" },
    { title: "Extracting mandatory requirements", desc: "finding must-have clauses, identifying obligations, tagging critical conditions", details: "scanning for 'must', 'shall', required compliance" },
    { title: "Detecting required documents", desc: "forms, certifications, declarations, pricing sheets, signatures", details: "pricing sheets, signatures, annexes" },
    { title: "Mapping evaluation criteria", desc: "technical score, commercial score, experience, certifications, deadlines", details: "extracting weightages and scoring logic" },
    { title: "Detecting risks and disqualification traps", desc: "contradictory instructions, missing compliance conditions, hidden traps, impossible requirements", details: "flagging hidden traps and strict penalties" },
    { title: "Building compliance matrix", desc: "matching requirement → status → evidence → next action", details: "structuring traceability matrix" },
    { title: "Preparing draft-ready sections", desc: "technical response areas, compliance response areas, missing information", details: "missing information gap analysis" },
];

function UploadTender({ onBack }: UploadTenderProps) {

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [extractedText, setExtractedText] = useState("");

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeStage, setActiveStage] = useState(0);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [thoughtProcess, setThoughtProcess] = useState("");
    const [elapsedTime, setElapsedTime] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Advanced Timeline Simulation (Now driven by real-time stream size)
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isAnalyzing) {
            setElapsedTime(0);
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isAnalyzing]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFile(file);
        setIsUploading(true);
        setExtractedText("");
        setAnalysisData(null);
        setActiveStage(0);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/tender/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setExtractedText(data.text);
            } else {
                console.error("Upload failed:", data.error);
                alert("Failed to read document: " + data.error);
                setUploadedFile(null);
            }
        } catch (error) {
            console.error("Error uploading:", error);
            alert("Network error. Make sure the backend is running.");
            setUploadedFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!extractedText) {
            alert("No text extracted from document yet.");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisData(null);
        setThoughtProcess("");
        setActiveStage(0);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/tender/analyze/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: extractedText }),
            });
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No reader from stream");

            let fullText = "";
            let chunkText = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                chunkText += decoder.decode(value, { stream: true });
                const lines = chunkText.split('\n');

                // Keep the last incomplete line
                chunkText = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6);
                        if (dataStr === '[DONE]') break;
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.content) {
                                fullText += data.content;
                                // Clean display text and progress stages based on length
                                const displayMatch = fullText.split('```json');
                                setThoughtProcess(displayMatch[0].trim().replace(/[*#_]/g, ''));
                                // Roughly guess stages based on text volume to keep UI alive
                                setActiveStage(Math.max(0, Math.min(6, Math.floor(displayMatch[0].length / 400))));
                            }
                        } catch (e) { }
                    }
                }
            }

            // Extract the final JSON
            const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    setAnalysisData(JSON.parse(jsonMatch[1]));
                } catch (e) {
                    console.error("Failed parsing JSON output", e);
                }
            } else {
                console.error("No JSON output detected in stream.");
            }
            setActiveStage(STAGES.length);
        } catch (error) {
            console.error("Error analyzing:", error);
            alert("Network error during analysis.");
            setActiveStage(0);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const isComplete = !isAnalyzing && analysisData !== null;
    // Condition to show timeline view vs original upload view
    const showTimelineView = isAnalyzing || isComplete;

    return (
        <div className="min-h-screen bg-black p-1 flex flex-col">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex-1 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col"
                style={{ background: "#f0ebe1" }} // Restored original cream background
            >
                {/* RESTORED ORIGINAL NAVBAR */}
                <nav className="relative z-20 flex justify-between items-center px-6 md:px-10 py-5 shrink-0">
                    <button onClick={onBack} className="flex items-center gap-1 cursor-pointer">
                        <img src="/logo.png" alt="Strata Logo" className="h-14 w-auto object-contain -ml-2" />
                        <span style={{ fontFamily: "'ADLaM Display', sans-serif" }} className="text-[1.8rem] text-black leading-none tracking-tight">
                            Strata
                        </span>
                    </button>

                    <div className="hidden md:flex items-center gap-6">
                        <button className="nav-box-hover">Sample Analysis</button>
                        <button className="nav-box-hover opacity-40 cursor-not-allowed" disabled title="Complete an upload first">Workspace</button>
                        <button className="nav-box-hover">Help</button>
                        <div className="relative">
                            <button onClick={onBack} className="nav-box-hover flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start px-6">

                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect} className="hidden" />

                    {/* RESTORED ORIGINAL UPLOAD VIEW */}
                    {!showTimelineView && (
                        <div className="w-full flex-1 flex flex-col items-center justify-center" style={{ minHeight: "calc(100vh - 120px)" }}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-center mb-12">
                                <h1 style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="text-4xl md:text-5xl lg:text-6xl text-black leading-[1.2] tracking-tight mb-6">
                                    Before you bid,<br />know what matters.
                                </h1>
                                <p style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="text-lg md:text-xl text-neutral-500 leading-relaxed">
                                    Turn tender documents into actionable bid intelligence.
                                </p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="w-full max-w-xl flex flex-col items-center z-10">
                                {!uploadedFile ? (
                                    <>
                                        <button onClick={() => fileInputRef.current?.click()} className="bg-[#2a2f36] hover:bg-[#1a1d24] text-white px-10 py-4 text-[15px] font-medium transition-colors cursor-pointer rounded-[3px] shadow-sm tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                                            Upload Tender Files
                                        </button>
                                        <p style={{ fontFamily: "Inter, sans-serif" }} className="mt-5 text-[13px] text-neutral-400">or <button className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">view sample analysis</button></p>
                                    </>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-[#B8C9B9] bg-[#B8C9B9]/10 p-8 text-center w-full">
                                        {isUploading ? (
                                            <div className="w-12 h-12 rounded-full border-[3px] border-[#c1ccbed1] border-t-[#7aa87a] animate-spin mx-auto mb-4"></div>
                                        ) : (
                                            <svg className="w-12 h-12 mx-auto text-emerald-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        )}
                                        <p style={{ fontFamily: "Inter, sans-serif" }} className="text-lg font-medium text-neutral-800 mb-1">{uploadedFile.name}</p>
                                        <p style={{ fontFamily: "Inter, sans-serif" }} className="text-sm text-neutral-500 mb-6">
                                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB {isUploading ? <span className="text-[#a16207]"> • Extracting text with Mistral OCR...</span> : <span className="text-[#3e5e48] font-medium"> • Ready</span>}
                                        </p>
                                        <div className="flex gap-4 justify-center">
                                            <button onClick={() => { setUploadedFile(null); setExtractedText(""); setAnalysisData(null); }} disabled={isUploading || isAnalyzing} className={`nav-box-hover ${isUploading || isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}>Remove</button>
                                            <button onClick={handleAnalyze} disabled={isUploading || isAnalyzing || !extractedText} className={`nav-box-hover flex items-center justify-center gap-2 ${isUploading || isAnalyzing || !extractedText ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", padding: "12px 32px", background: "#B8C9B9" }}>
                                                {isUploading ? "Reading Document..." : "Analyze Tender"}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Trust Badges */}
                            {!uploadedFile && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-28 flex flex-col items-center z-10">
                                    <p style={{ fontFamily: "Inter, sans-serif" }} className="text-[11px] text-[#a8a498] mb-8 tracking-wide">Used by professionals at top firms</p>
                                    <div className="flex items-center gap-10 md:gap-16 opacity-30 grayscale text-[#8a8578]">
                                        <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] font-bold tracking-[0.15em]">MCKINSEY</span>
                                        <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] font-bold tracking-[0.15em]">BCG</span>
                                        <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] font-bold tracking-[0.15em]">BAIN</span>
                                        <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] font-bold tracking-[0.15em]">DELOITTE</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Decorative subtle shapes */}
                            <div className="absolute top-[15%] left-[8%] w-32 h-32 opacity-[0.04] pointer-events-none"><svg viewBox="0 0 100 100" fill="none"><polygon points="50,5 95,95 5,95" stroke="#8a8578" strokeWidth="1" /></svg></div>
                            <div className="absolute bottom-[20%] right-[10%] w-40 h-40 opacity-[0.04] pointer-events-none"><svg viewBox="0 0 100 100" fill="none"><polygon points="50,5 95,95 5,95" stroke="#8a8578" strokeWidth="1" /></svg></div>
                        </div>
                    )}

                    {/* NEW TIMELINE VIEW (Appears ONLY during & after analysis) */}
                    {showTimelineView && uploadedFile && (
                        <div className="w-full max-w-5xl flex flex-col items-center mt-6 pb-20 relative z-10">

                            {/* 1. Document Card Anchor */}
                            <motion.div
                                layoutId="doc-card"
                                className="bg-white/60 border border-[#c9c6b9] rounded-[20px] p-6 w-full flex items-center gap-6 shadow-sm mb-12"
                            >
                                <div className="w-16 h-20 bg-[#f0ebe1] flex items-center justify-center border border-[#d4d0c5] rounded-xl flex-shrink-0 shadow-inner">
                                    <span style={{ fontFamily: "Inter, sans-serif" }} className="text-[11px] font-bold text-[#8a8578]">PDF</span>
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <h3 style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="font-semibold text-black text-[22px] truncate mb-1">{uploadedFile.name}</h3>
                                    <p style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] text-neutral-500 flex items-center gap-3">
                                        <span className="font-medium text-neutral-700">Federal Issuing Authority</span>
                                        <span>•</span>
                                        <span>Uploaded just now</span>
                                        <span>•</span>
                                        <span>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <span>•</span>
                                        <span className="text-[#3e5e48] font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Text Extracted
                                        </span>
                                    </p>
                                </div>
                            </motion.div>

                            {/* Two Column Layout for Analysis & Results */}
                            <div className="w-full flex flex-col lg:flex-row gap-10 items-start justify-center">

                                {/* Left Column: Vertical Timeline */}
                                <div className="w-full lg:w-[600px] flex flex-col relative pl-6">
                                    {/* Vertical track line */}
                                    <div className="absolute left-[47px] top-6 bottom-6 w-[2px] bg-[#d4d0c5] z-0"></div>

                                    {STAGES.map((stage, index) => {
                                        const isPast = activeStage > index;
                                        const isCurrent = activeStage === index && isAnalyzing;

                                        return (
                                            <div key={index} className="relative z-10 flex gap-6 mb-4">
                                                {/* Status Node */}
                                                <div className="flex flex-col items-center mt-1">
                                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-colors duration-500 flex-shrink-0
                                                        ${isPast ? 'border-[#2a2f36] bg-[#f0ebe1]' : isCurrent ? 'border-[#a16207] bg-[#fefce8]' : 'border-[#d4d0c5] bg-[#f0ebe1]'}`}
                                                    >
                                                        {isPast ? (
                                                            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        ) : isCurrent ? (
                                                            <svg className="w-5 h-5 text-[#a16207] animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                        ) : (
                                                            <div className="w-3 h-3 rounded-full bg-[#c9c6b9]"></div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Stage Card */}
                                                <div className={`flex-1 rounded-[16px] p-5 border transition-all duration-300 text-left
                                                    ${isCurrent ? 'border-[#a16207] bg-white shadow-md' : 'border-[#c9c6b9] bg-white/40'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 style={{ fontFamily: "Inter, sans-serif" }} className={`font-semibold text-[15px] ${isCurrent ? 'text-black' : 'text-neutral-600'}`}>
                                                            {stage.title}
                                                        </h4>
                                                        {isCurrent && <span className="text-[11px] font-mono text-[#a16207] font-medium tracking-wide">Processing</span>}
                                                    </div>
                                                    <p style={{ fontFamily: "Inter, sans-serif" }} className="text-[13px] text-neutral-500 mb-2">{stage.desc}</p>

                                                    {isCurrent && (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                                                            {/* Progress Bar */}
                                                            <div className="w-full h-[4px] bg-[#e5e0d5] rounded-full overflow-hidden mb-3">
                                                                <motion.div
                                                                    initial={{ width: "0%" }}
                                                                    animate={{ width: "85%" }}
                                                                    transition={{ duration: 3, ease: "linear" }}
                                                                    className="h-full bg-[#2a2f36]"
                                                                />
                                                            </div>
                                                            <p style={{ fontFamily: "Inter, sans-serif" }} className="text-[12px] text-neutral-400 italic">Scanning: {stage.details}...</p>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Right Column: Meta Info & Results */}
                                <div className="w-full lg:w-[420px] flex flex-col gap-6 sticky top-8">

                                    {/* Status & ETA Card */}
                                    {isAnalyzing && (
                                        <AnimatePresence>
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/80 border border-[#c9c6b9] rounded-2xl p-8 text-center shadow-lg">
                                                <svg className="w-10 h-10 mx-auto text-[#a16207] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <h3 style={{ fontFamily: "Inter, sans-serif" }} className="font-semibold text-4xl text-black tabular-nums">
                                                    {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
                                                </h3>
                                                <p style={{ fontFamily: "Inter, sans-serif" }} className="text-[14px] text-neutral-500 mt-2">Time elapsed (Real-time AI Processing)</p>
                                                <div className="mt-6 pt-6 border-t border-[#e5e0d5]">
                                                    <p style={{ fontFamily: "Inter, sans-serif" }} className="text-[12px] font-bold text-neutral-400 tracking-widest uppercase">Streaming AI Forensics</p>
                                                </div>
                                            </motion.div>

                                            {/* AI Thought Process (Live) */}
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#c9c6b9] rounded-2xl p-6 text-left shadow-sm max-h-[400px] flex flex-col mt-4">
                                                <h4 style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="font-bold text-black text-[18px] mb-3 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    Live AI Thought Process
                                                </h4>
                                                <div className="flex-1 overflow-y-auto custom-scrollbar text-[13px] text-neutral-700 leading-relaxed whitespace-pre-wrap font-mono">
                                                    {thoughtProcess || "Connecting to Mistral Reasoning Engine..."}
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    )}

                                    {/* Dynamic Chips & Evidence (After API JSON returns) */}
                                    {isComplete && analysisData && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                                            {/* Found-so-far Summary Chips */}
                                            <div className="bg-[#2a2f36] rounded-2xl p-6 text-left text-white shadow-xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                                <h4 style={{ fontFamily: "Inter, sans-serif" }} className="text-[11px] tracking-[0.15em] text-[#a8a498] uppercase mb-6 font-bold">Discovery Overview</h4>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                                    <div>
                                                        <div style={{ fontFamily: "Inter, sans-serif" }} className="text-4xl font-light mb-1">{Array.isArray(analysisData.mandatory_requirements) ? analysisData.mandatory_requirements.length : 0}</div>
                                                        <div style={{ fontFamily: "Inter, sans-serif" }} className="text-[12px] text-[#a8a498] leading-tight">Mandatory<br />Requirements</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontFamily: "Inter, sans-serif" }} className="text-4xl font-light mb-1">{Array.isArray(analysisData.required_documents) ? analysisData.required_documents.length : 0}</div>
                                                        <div style={{ fontFamily: "Inter, sans-serif" }} className="text-[12px] text-[#a8a498] leading-tight">Required<br />Documents</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontFamily: "Inter, sans-serif" }} className="text-4xl font-light text-red-300 mb-1">{Array.isArray(analysisData.risks_flagged) ? analysisData.risks_flagged.length : 0}</div>
                                                        <div style={{ fontFamily: "Inter, sans-serif" }} className="text-[12px] text-[#a8a498] leading-tight">Risks & Traps<br />Flagged</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontFamily: "Inter, sans-serif" }} className="text-4xl font-light mb-1">{Array.isArray(analysisData.evaluation_criteria) ? analysisData.evaluation_criteria.length : 0}</div>
                                                        <div style={{ fontFamily: "Inter, sans-serif" }} className="text-[12px] text-[#a8a498] leading-tight">Evaluation<br />Criteria</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Final AI Thought Process Panel */}
                                            {thoughtProcess && (
                                                <div className="bg-white border border-[#c9c6b9] rounded-2xl p-6 text-left shadow-md flex flex-col max-h-[450px]">
                                                    <h4 style={{ fontFamily: "'Alegreya SC', sans-serif" }} className="font-bold text-black text-[18px] mb-2 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-[#3e5e48]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        Final Analysis Report
                                                    </h4>
                                                    <p style={{ fontFamily: "Inter, sans-serif" }} className="text-[13px] text-neutral-500 mb-5 leading-relaxed">
                                                        The complete forensic breakdown performed by Mistral AI in real time.
                                                    </p>
                                                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2 text-[13px] text-neutral-700 leading-relaxed whitespace-pre-wrap font-mono">
                                                        {thoughtProcess}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default UploadTender;
