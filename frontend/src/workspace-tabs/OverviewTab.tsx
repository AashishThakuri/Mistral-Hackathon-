import React from 'react';
import { motion } from 'framer-motion';

interface OverviewTabProps {
    data: any;
    meta: any;
    onNavigate: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, meta, onNavigate }) => {
    const exec = data.executive_summary || {};
    const topBlockers = data.top_blockers || [];
    const nextActions = data.next_actions || [];

    const requirements = data.mandatory_requirements || [];
    const documents = data.required_documents || [];
    const risks = data.risks_flagged || [];
    const criteria = data.evaluation_criteria || [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8 max-w-[1200px]">

            {/* Top Row: Summary Cards */}
            <div className="grid grid-cols-5 gap-4">
                <div className="bg-[#2a2f36] p-5 rounded-lg border border-[#1a1d24] shadow-md flex flex-col justify-between">
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Bid Readiness</p>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${exec.bid_readiness_score > 70 ? 'text-emerald-400' : exec.bid_readiness_score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {exec.bid_readiness_score || 0}
                        </span>
                        <span className="text-neutral-500 font-medium text-sm">/ 100</span>
                    </div>
                </div>
                <div onClick={() => onNavigate('Requirements')} className="bg-white p-5 rounded-lg border border-[#d4d0c5]/70 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#2a2f36] hover:shadow-md transition-all">
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Requirements</p>
                    <span className="text-3xl font-bold text-[#2a2f36]">{requirements.length}</span>
                </div>
                <div onClick={() => onNavigate('Documents')} className="bg-white p-5 rounded-lg border border-[#d4d0c5]/70 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#2a2f36] hover:shadow-md transition-all">
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Documents</p>
                    <span className="text-3xl font-bold text-[#2a2f36]">{documents.length}</span>
                </div>
                <div onClick={() => onNavigate('Risks')} className="bg-white p-5 rounded-lg border border-[#d4d0c5]/70 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#2a2f36] hover:shadow-md transition-all">
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Risk Flags</p>
                    <span className="text-3xl font-bold text-red-600">{risks.length}</span>
                </div>
                <div onClick={() => onNavigate('Evaluation')} className="bg-white p-5 rounded-lg border border-[#d4d0c5]/70 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#2a2f36] hover:shadow-md transition-all">
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Eval Criteria</p>
                    <span className="text-3xl font-bold text-[#2a2f36]">{criteria.length}</span>
                </div>
            </div>

            {/* Second Row: Executive Summary & Key Info */}
            <div className="grid grid-cols-3 gap-8">
                {/* Executive Summary Block (2/3 width) */}
                <div className="col-span-2">
                    <section className="bg-white p-8 rounded-xl border border-[#d4d0c5]/70 shadow-sm h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold text-[#2a2f36]">Executive Summary</h2>
                        </div>
                        <p className="text-[15px] leading-relaxed text-neutral-700 mb-6 flex-1">
                            {exec.brief_explanation || "We successfully analyzed this document but the executive summary was not extracted. Please review the specific requirements to manually ascertain scope."}
                        </p>
                        <div className="p-4 bg-neutral-50 rounded border border-neutral-200 border-l-4 border-l-[#2a2f36]">
                            <p className="text-[14px] font-semibold text-[#2a2f36]">Overall Readiness Statement:</p>
                            <p className="text-[14px] text-neutral-600 mt-1">{exec.overall_readiness_statement || "Review requirements to determine readiness."}</p>
                        </div>
                    </section>
                </div>

                {/* Key Info Card (1/3 width right side) */}
                <div className="col-span-1">
                    <section className="bg-white p-6 rounded-xl border border-[#d4d0c5]/70 shadow-sm h-full">
                        <h2 className="text-[13px] font-bold uppercase tracking-wider text-neutral-400 mb-5">Key Tender Info</h2>
                        <ul className="space-y-4">
                            <li className="flex flex-col">
                                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Issuer</span>
                                <span className="text-[14px] font-medium text-[#2a2f36]">{meta.issuing_authority || 'Unknown'}</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Category</span>
                                <span className="text-[14px] font-medium text-[#2a2f36]">{meta.category || 'Tender Document'}</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Submission Type</span>
                                <span className="text-[14px] font-medium text-[#2a2f36]">{meta.submission_type || 'Unknown'}</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Page Count</span>
                                <span className="text-[14px] font-medium text-[#2a2f36]">{meta.page_count || 'Unknown'}</span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>

            {/* Third Row: Top Blockers & Next Actions */}
            <div className="grid grid-cols-2 gap-8">
                {/* Top Blockers Stacked List */}
                <section className="bg-white p-8 rounded-xl border border-red-200 shadow-sm shadow-red-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center text-red-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-[#2a2f36]">Top Blockers</h2>
                    </div>
                    {topBlockers.length > 0 ? (
                        <div className="space-y-4">
                            {topBlockers.slice(0, 4).map((item: any, idx: number) => (
                                <div key={idx} className="p-4 bg-[#fef2f2] rounded-lg border border-red-100 flex items-start gap-4 hover:shadow-sm transition-shadow">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <div>
                                        <p className="text-[12px] font-bold uppercase tracking-wider text-red-800 mb-1">{item.type || "Critical Issue"}</p>
                                        <p className="text-[14px] text-red-900 leading-snug">{item.blocker}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-center">
                            <svg className="w-10 h-10 text-emerald-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-[15px] text-emerald-700 font-semibold">No critical blockers</p>
                        </div>
                    )}
                </section>

                {/* Recommended Next Actions Checklist */}
                <section className="bg-white p-8 rounded-xl border border-[#d4d0c5]/70 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-[#2a2f36]">Recommended Next Actions</h2>
                    </div>
                    {nextActions.length > 0 ? (
                        <ul className="space-y-4">
                            {nextActions.map((action: string, idx: number) => (
                                <li key={idx} className="flex gap-4 text-[15px] text-neutral-700 items-start p-3 hover:bg-neutral-50 rounded-lg transition-colors border border-transparent hover:border-[#d4d0c5]/50 group cursor-default">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-emerald-500/30 bg-emerald-50 group-hover:bg-emerald-500 group-hover:border-emerald-500 flex items-center justify-center text-transparent group-hover:text-white transition-all">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                    <span className="leading-snug pt-0.5">{action}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#a16207] italic text-[15px] mt-4">No specific next actions extracted. Begin by reviewing requirements.</p>
                    )}
                </section>
            </div>

            {/* Bottom Row: Quick Previews */}
            <section className="pt-4">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-neutral-400 mb-4 px-1">Quick Deep-Dives</h3>
                <div className="grid grid-cols-4 gap-4">
                    <button onClick={() => onNavigate('Requirements')} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#d4d0c5]/80 hover:border-[#2a2f36] shadow-sm hover:shadow-md transition-all group text-left cursor-pointer">
                        <div className="w-10 h-10 rounded bg-[#f0ebe1] flex items-center justify-center text-neutral-600 group-hover:bg-[#2a2f36] group-hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4" /></svg>
                        </div>
                        <div>
                            <p className="text-[14px] font-bold text-[#2a2f36]">Requirements</p>
                            <p className="text-[12px] text-neutral-500">View {requirements.length} conditions</p>
                        </div>
                    </button>
                    <button onClick={() => onNavigate('Documents')} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#d4d0c5]/80 hover:border-[#2a2f36] shadow-sm hover:shadow-md transition-all group text-left cursor-pointer">
                        <div className="w-10 h-10 rounded bg-[#f0ebe1] flex items-center justify-center text-neutral-600 group-hover:bg-[#2a2f36] group-hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                        </div>
                        <div>
                            <p className="text-[14px] font-bold text-[#2a2f36]">Documents</p>
                            <p className="text-[12px] text-neutral-500">Review {documents.length} files</p>
                        </div>
                    </button>
                    <button onClick={() => onNavigate('Risks')} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#d4d0c5]/80 hover:border-[#2a2f36] shadow-sm hover:shadow-md transition-all group text-left cursor-pointer">
                        <div className="w-10 h-10 rounded bg-[#f0ebe1] flex items-center justify-center text-neutral-600 group-hover:bg-[#2a2f36] group-hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <p className="text-[14px] font-bold text-[#2a2f36]">Risk Matrix</p>
                            <p className="text-[12px] text-neutral-500">{risks.length} traps flagged</p>
                        </div>
                    </button>
                    <button onClick={() => onNavigate('Compliance Matrix')} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#d4d0c5]/80 hover:border-[#2a2f36] shadow-sm hover:shadow-md transition-all group text-left cursor-pointer">
                        <div className="w-10 h-10 rounded bg-[#f0ebe1] flex items-center justify-center text-neutral-600 group-hover:bg-[#2a2f36] group-hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <p className="text-[14px] font-bold text-[#2a2f36]">Compliance</p>
                            <p className="text-[12px] text-neutral-500">Track all evidence</p>
                        </div>
                    </button>
                </div>
            </section>

        </motion.div>
    );
};
