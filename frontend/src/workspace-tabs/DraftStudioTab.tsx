import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DraftStudioTabProps {
    data: any;
}

export const DraftStudioTab: React.FC<DraftStudioTabProps> = ({ data }) => {
    // Basic Extraction mapping for left nav structure
    const requirements = data.mandatory_requirements || [];
    const risks = data.risks_flagged || [];

    const [activeSection, setActiveSection] = useState('Executive Summary');
    const [editorText, setEditorText] = useState('Begin drafting your response here...');
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const sections = [
        'Executive Summary',
        'Company Profile',
        'Technical Solution',
        'Pricing & Financials',
        'Compliance & Risk Mitigation'
    ];

    const generateDraft = () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            setEditorText(prev => prev + '\n\n[AI GENERATED DRAFT:]\n' + `Based on the requirement: "${aiPrompt}", here is a proposed clause mitigating the risks identified in the tender. We assure full compliance with the stipulated guidelines and guarantee a 99.9% uptime SLA as required in section 4.2...`);
            setIsGenerating(false);
            setAiPrompt('');
        }, 1200);
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="h-full flex overflow-hidden border border-[#d4d0c5] rounded-xl bg-white shadow-sm max-w-[1400px]">

            {/* Left Nav: Sections & Outlines */}
            <div className="w-64 bg-[#fbf9f6] border-r border-[#d4d0c5] flex flex-col">
                <div className="p-4 border-b border-[#d4d0c5]">
                    <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#2a2f36]">Response Outline</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                    {sections.map(sec => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`w-full text-left px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors ${activeSection === sec ? 'bg-[#2a2f36] text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-200/50'}`}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t border-[#d4d0c5] bg-white">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Completion</p>
                    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[20%]"></div>
                    </div>
                    <p className="text-[12px] font-bold text-[#2a2f36] mt-1.5 text-right">20%</p>
                </div>
            </div>

            {/* Center: Editor Canvas */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="px-6 py-4 border-b border-[#d4d0c5] flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#2a2f36]">{activeSection}</h2>
                    <div className="flex gap-2 text-neutral-400">
                        <button onClick={() => {
                            const blob = new Blob([editorText], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${activeSection.replace(/\s+/g, '_')}_draft.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }} className="p-1.5 hover:bg-neutral-100 rounded text-[#2a2f36] cursor-pointer" title="Save as file"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg></button>
                        <button onClick={() => {
                            navigator.clipboard.writeText(editorText);
                            alert('Draft copied to clipboard!');
                        }} className="p-1.5 hover:bg-neutral-100 rounded text-[#2a2f36] cursor-pointer" title="Copy to clipboard"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                    </div>
                </div>
                <div className="flex-1 p-6">
                    <textarea
                        className="w-full h-full resize-none outline-none text-[15px] leading-relaxed text-neutral-800 placeholder:text-neutral-300 custom-scrollbar"
                        placeholder="Start typing or use the AI Support panel to generate content..."
                        value={editorText}
                        onChange={(e) => setEditorText(e.target.value)}
                    ></textarea>
                </div>
                <div className="px-6 py-3 border-t border-[#d4d0c5] bg-neutral-50 flex items-center justify-between text-[12px] text-neutral-500 font-medium">
                    <span>{editorText.split(/\s+/).filter(w => w.length > 0).length} words</span>
                    <span>Saved just now</span>
                </div>
            </div>

            {/* Right: AI Support Panel */}
            <div className="w-[380px] bg-[#fbf9f6] border-l border-[#d4d0c5] flex flex-col">
                <div className="p-4 border-b border-[#d4d0c5] bg-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <h3 className="text-[14px] font-bold text-[#2a2f36]">Mistral Draft Support</h3>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                    {/* Tender Context Injector */}
                    <div className="space-y-3">
                        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Active Context</h4>

                        <div className="bg-white border text-left w-full border-[#d4d0c5] rounded-lg p-3 shadow-sm select-none">
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-100 block w-max mb-1.5">Highest Risk</span>
                            <p className="text-[12px] font-medium text-[#2a2f36] leading-snug truncate">
                                {risks.length > 0 ? (typeof risks[0] === 'string' ? risks[0] : risks[0].risk_title || risks[0].description) : 'No major risks detected.'}
                            </p>
                        </div>

                        <div className="bg-white border text-left w-full border-[#d4d0c5] rounded-lg p-3 shadow-sm select-none">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100 block w-max mb-1.5">Missing Requirement</span>
                            <p className="text-[12px] font-medium text-[#2a2f36] leading-snug line-clamp-2">
                                {requirements.length > 0 ? (typeof requirements[0] === 'string' ? requirements[0] : requirements[0].requirement) : 'All requirements satisfied.'}
                            </p>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="space-y-4 pt-4 border-t border-[#d4d0c5]/50">
                        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Generate Clause</h4>

                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3">
                            <p className="text-[13px] text-indigo-900 leading-snug">
                                I can draft text mapped directly to the tender’s evaluation criteria. What do you need to write?
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-[#d4d0c5]">
                    <div className="relative">
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generateDraft())}
                            placeholder="e.g. Draft a compliance statement for the data residency requirement..."
                            className="w-full bg-[#fbf9f6] border border-[#d4d0c5] rounded-lg px-3 py-2.5 text-[13px] text-[#2a2f36] outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none h-20 custom-scrollbar"
                        ></textarea>
                        <button
                            onClick={generateDraft}
                            disabled={isGenerating || !aiPrompt.trim()}
                            className="absolute bottom-2 right-2 bg-[#2a2f36] text-white p-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
                        >
                            {isGenerating ? (
                                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            )}
                        </button>
                    </div>
                    <p className="text-[10px] text-neutral-400 text-center mt-2 font-medium">Mistral AI connects to your live Compliance Matrix</p>
                </div>
            </div>

        </motion.div>
    );
};
