import React from 'react';
import { motion } from 'framer-motion';

interface RisksTabProps {
    data: any;
    onNavigate?: (tab: string) => void;
}

export const RisksTab: React.FC<RisksTabProps> = ({ data, onNavigate }) => {
    const rawRisks = data.risks_flagged || [];

    const totalRisks = rawRisks.length;
    const criticalRisks = rawRisks.filter((r: any) => typeof r !== 'string' && r.severity?.toLowerCase() === 'critical');
    const majorRisks = rawRisks.filter((r: any) => typeof r !== 'string' && r.severity?.toLowerCase() === 'major');
    const minorRisks = rawRisks.filter((r: any) => typeof r !== 'string' && r.severity?.toLowerCase() === 'minor');

    const topUrgent = rawRisks
        .filter((r: any) => typeof r !== 'string' && ['critical', 'major'].includes(r.severity?.toLowerCase()))
        .slice(0, 4);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full flex flex-col space-y-8">

            {/* Top Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#2a2f36] p-6 rounded-xl border border-[#1a1d24] shadow-md flex justify-between items-center text-white">
                    <div>
                        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Total Risks</p>
                        <span className="text-4xl font-bold">{totalRisks}</span>
                    </div>
                </div>
                <div className="bg-red-600 p-6 rounded-xl border border-red-700 shadow-md flex justify-between items-center text-white">
                    <div>
                        <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-1">Critical Blockers</p>
                        <span className="text-4xl font-bold">{criticalRisks.length}</span>
                    </div>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-orange-800 text-xs font-bold uppercase tracking-widest mb-1">Major Traps</p>
                        <span className="text-4xl font-bold text-orange-600">{majorRisks.length}</span>
                    </div>
                </div>
                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Minor Flags</p>
                        <span className="text-4xl font-bold text-neutral-600">{minorRisks.length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 pb-10">
                {/* Main Risk List (2/3) */}
                <div className="col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-[#2a2f36]">Risk Register</h2>

                    {rawRisks.length > 0 ? (
                        <div className="space-y-4">
                            {rawRisks.map((risk: any, idx: number) => {
                                const isStr = typeof risk === 'string';
                                const title = isStr ? risk : (risk.risk_title || risk.description || 'Threat Identified');
                                const severity = isStr ? 'unknown' : (risk.severity?.toLowerCase() || 'minor');
                                const type = isStr ? 'general risk' : (risk.risk_type || 'unclassified');

                                const isCrit = severity === 'critical';
                                const isMajor = severity === 'major';

                                return (
                                    <div key={idx} className={`bg-white rounded-xl border-l-[6px] shadow-sm hover:shadow-md transition-all overflow-hidden
                                        ${isCrit ? 'border-l-red-600 border-t border-r border-b border-[#d4d0c5]' :
                                            isMajor ? 'border-l-orange-500 border-t border-r border-b border-[#d4d0c5]' :
                                                'border-l-neutral-400 border-t border-r border-b border-[#d4d0c5]'}
                                    `}>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest 
                                                        ${isCrit ? 'bg-red-100 text-red-800 border border-red-200' :
                                                            isMajor ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                                                'bg-neutral-100 text-neutral-600 border border-neutral-200'}
                                                    `}>
                                                        {severity}
                                                    </span>
                                                    <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-wide">{type}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-[#2a2f36] mb-3 leading-snug">{title}</h3>

                                            {!isStr && risk.explanation && (
                                                <p className="text-[14px] text-neutral-700 leading-relaxed max-w-2xl mb-5">
                                                    <span className="font-semibold text-neutral-900">Why it matters:</span> {risk.explanation}
                                                </p>
                                            )}

                                            {!isStr && (risk.source_clause || risk.recommended_action) && (
                                                <div className="bg-neutral-50/50 rounded-lg p-5 flex flex-col gap-4 border border-[#d4d0c5]/50">
                                                    {risk.source_clause && (
                                                        <div className="flex items-center gap-2 text-[13px] text-neutral-600 font-mono bg-white border border-neutral-200 px-3 py-1.5 rounded-md w-max">
                                                            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            Source: {risk.source_clause} {risk.page_number && `(Page ${risk.page_number})`}
                                                        </div>
                                                    )}
                                                    {risk.recommended_action && (
                                                        <div className="flex items-start gap-2.5">
                                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <svg className="w-3.5 h-3.5 text-emerald-700 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <div>
                                                                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest block mb-0.5">Recommended Mitigation</span>
                                                                <p className="text-[14px] font-medium text-emerald-900">{risk.recommended_action}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white border text-center py-20 rounded-xl border-[#d4d0c5]">
                            <svg className="w-12 h-12 mx-auto mb-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-emerald-700 font-bold">Document registers cleanly. No overt risks flagged.</p>
                        </div>
                    )}
                </div>

                {/* Right Side Panel: Immediate Blockers */}
                <div className="col-span-1">
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm sticky top-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-full bg-white border border-red-200 flex items-center justify-center text-red-600 shadow-sm relative">
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-red-900">Immediate Blockers</h3>
                        </div>

                        {topUrgent.length > 0 ? (
                            <div className="space-y-4">
                                {topUrgent.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white border border-red-100 rounded-lg p-4 shadow-sm relative overflow-hidden group hover:border-red-300 transition-colors">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1.5">{item.severity}</p>
                                        <h4 className="text-[14px] font-bold text-[#2a2f36] leading-snug">{item.risk_title || item.description}</h4>
                                        <button onClick={() => onNavigate?.('Compliance Matrix')} className="text-[12px] font-bold text-red-700 hover:text-red-900 uppercase tracking-wider mt-3 flex items-center gap-1 cursor-pointer">
                                            Assess <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[13px] text-emerald-700 italic font-medium bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center">
                                No critical or immediate major blockers identified. Proceed with normal review.
                            </p>
                        )}
                    </div>
                </div>
            </div>

        </motion.div>
    );
};
