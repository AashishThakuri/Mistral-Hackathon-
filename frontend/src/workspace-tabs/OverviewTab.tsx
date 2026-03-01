import React from 'react';
import { motion } from 'framer-motion';

interface OverviewTabProps {
    data: any;
    meta: any;
    onNavigate: (tab: string) => void;
    uploadedDocs?: Record<string, { originalName: string; storedName: string }>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, meta, onNavigate, uploadedDocs = {} }) => {
    const exec = data.executive_summary || {};
    const topBlockers = data.top_blockers || [];
    const nextActions = data.next_actions || [];

    const requirements = data.mandatory_requirements || [];
    const documents = data.required_documents || [];
    const missingDocCount = documents.filter((d: any) => {
        const isStr = typeof d === 'string';
        const name = isStr ? d : (d.document_name || '');
        const key = `doc::${name.replace(/\s+/g, '_').toLowerCase()}`;
        if (uploadedDocs[key]) return false;
        return isStr ? true : (d.mandatory !== false && !d.present);
    }).length;
    const risks = data.risks_flagged || [];
    const criteria = data.evaluation_criteria || [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">

            {/* Top Row: Quick Navigation Cards */}
            <div className="grid grid-cols-5 gap-4">
                <button onClick={() => onNavigate('Overview')} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#d4d0c5]/80 hover:border-[#2a2f36] shadow-sm hover:shadow-md transition-all group text-left cursor-pointer">
                    <div className="w-10 h-10 rounded bg-[#f0ebe1] flex items-center justify-center text-neutral-600 group-hover:bg-[#2a2f36] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-[#2a2f36]">Bid Readiness</p>
                        <p className={`text-[13px] font-bold ${exec.bid_readiness_score > 70 ? 'text-emerald-600' : exec.bid_readiness_score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>{exec.bid_readiness_score || 0} / 100</p>
                    </div>
                </button>
                <button onClick={() => onNavigate('Requirements')} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#d4d0c5]/80 hover:border-[#2a2f36] shadow-sm hover:shadow-md transition-all group text-left cursor-pointer">
                    <div className="w-10 h-10 rounded bg-[#f0ebe1] flex items-center justify-center text-neutral-600 group-hover:bg-[#2a2f36] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4" /></svg>
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-[#2a2f36]">Requirements</p>
                        <p className="text-[12px] text-neutral-500">View {requirements.length} conditions</p>
                    </div>
                </button>
                <button onClick={() => onNavigate('Documents')} className={`flex items-center gap-4 p-4 rounded-lg border shadow-sm hover:shadow-md transition-all group text-left cursor-pointer ${missingDocCount === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-[#d4d0c5]/80 hover:border-[#2a2f36]'}`}>
                    <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${missingDocCount === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-[#f0ebe1] text-neutral-600 group-hover:bg-[#2a2f36] group-hover:text-white'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-[#2a2f36]">Documents</p>
                        <p className="text-[12px] text-neutral-500">{documents.length - missingDocCount} / {documents.length} uploaded{missingDocCount > 0 && <span className="text-orange-600 font-bold ml-1">· {missingDocCount} missing</span>}</p>
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
                <button onClick={() => onNavigate('Evaluation')} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#d4d0c5]/80 hover:border-[#2a2f36] shadow-sm hover:shadow-md transition-all group text-left cursor-pointer">
                    <div className="w-10 h-10 rounded bg-[#f0ebe1] flex items-center justify-center text-neutral-600 group-hover:bg-[#2a2f36] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-[#2a2f36]">Eval Criteria</p>
                        <p className="text-[12px] text-neutral-500">{criteria.length} scoring areas</p>
                    </div>
                </button>
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



        </motion.div>
    );
};
