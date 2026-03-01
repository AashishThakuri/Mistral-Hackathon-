import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComplianceMatrixTabProps {
    data: any;
    onNavigate?: (tab: string) => void;
}

export const ComplianceMatrixTab: React.FC<ComplianceMatrixTabProps> = ({ data, onNavigate }) => {
    // Rely on the expanded schema matrix specifically, fallback to building it manually from requirements if missing
    const rawMatrix = data.compliance_matrix || (data.mandatory_requirements || []).map((req: any) => ({
        requirement: typeof req === 'string' ? req : req.requirement,
        status: typeof req === 'string' ? 'unresolved' : req.status || 'unresolved',
        evidence_available: null,
        missing_info: "Awaiting document analysis.",
        action_needed: "Review and supply missing clauses.",
        page_number: typeof req === 'string' ? null : req.page_number
    }));

    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    const satisfiedCount = rawMatrix.filter((i: any) => i.status?.toLowerCase() === 'satisfied').length;
    const missingCount = rawMatrix.filter((i: any) => i.status?.toLowerCase() === 'missing_info').length;
    const actionCount = rawMatrix.filter((i: any) => i.status?.toLowerCase() === 'action_needed').length;
    const totalCount = rawMatrix.length;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full flex flex-col space-y-6 max-w-[1400px]">

            {/* Top Stat Bar */}
            <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-[#d4d0c5] shadow-sm">
                <div className="flex items-center gap-3 pr-6 border-r border-[#d4d0c5]/50">
                    <div className="w-10 h-10 rounded-lg bg-[#2a2f36] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1">Total Mapped</p>
                        <span className="text-xl font-bold text-[#2a2f36] leading-none">{totalCount}</span>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div>
                        <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Satisfied</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-lg font-bold text-emerald-700 leading-none">{satisfiedCount}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Missing Info</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-lg font-bold text-orange-700 leading-none">{missingCount}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Action Needed</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-lg font-bold text-red-700 leading-none">{actionCount}</span>
                        </div>
                    </div>
                </div>
                <div className="ml-auto">
                    <button onClick={() => {
                        const headers = ['Requirement', 'Status', 'Source', 'Evidence Available', 'Missing Info', 'Action Needed', 'Page'];
                        const rows = rawMatrix.map((item: any) => [
                            `"${(item.requirement || '').replace(/"/g, '""')}"`,
                            item.status || '',
                            item.source_clause || '',
                            `"${(item.evidence_available || '').replace(/"/g, '""')}"`,
                            `"${(item.missing_info || '').replace(/"/g, '""')}"`,
                            `"${(item.action_needed || '').replace(/"/g, '""')}"`,
                            item.page_number || ''
                        ].join(','));
                        const csv = [headers.join(','), ...rows].join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'compliance_matrix.csv';
                        a.click();
                        URL.revokeObjectURL(url);
                    }} className="bg-white border border-[#d4d0c5] text-[#2a2f36] px-4 py-2 rounded-md text-[13px] font-bold hover:bg-neutral-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden pb-10">
                {/* Wide Matrix Table */}
                <div className="flex-1 bg-white rounded-xl border border-[#d4d0c5] shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 relative">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-[#f0ebe1] sticky top-0 z-10 shadow-sm border-b border-[#d4d0c5]">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#2a2f36] w-[25%] border-r border-[#d4d0c5]/50">Requirement</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#2a2f36] w-[15%] border-r border-[#d4d0c5]/50">Status & Source</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#2a2f36] w-[25%] border-r border-[#d4d0c5]/50">Evidence Found</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#2a2f36] w-[35%]">Missing & Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#d4d0c5]/50">
                                {rawMatrix.map((item: any, idx: number) => {
                                    const status = item.status?.toLowerCase() || 'unresolved';
                                    const isSelected = selectedItem === item;

                                    return (
                                        <tr
                                            key={idx}
                                            onClick={() => setSelectedItem(isSelected ? null : item)}
                                            className={`cursor-pointer transition-colors group
                                                ${isSelected ? 'bg-blue-50/50' : 'hover:bg-neutral-50'}
                                            `}
                                        >
                                            <td className="px-6 py-5 align-top border-r border-[#d4d0c5]/50">
                                                <p className="text-[14px] font-medium text-neutral-900 leading-relaxed mb-1">{item.requirement}</p>
                                                {item.page_number && <span className="text-[11px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">Page {item.page_number}</span>}
                                            </td>

                                            <td className="px-6 py-5 align-top border-r border-[#d4d0c5]/50">
                                                <div className="space-y-3">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border
                                                        ${status === 'satisfied' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                            status === 'action_needed' ? 'bg-red-50 border-red-200 text-red-700' :
                                                                status === 'missing_info' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                                                    'bg-neutral-100 border-neutral-200 text-neutral-600'}
                                                    `}>
                                                        {status.replace('_', ' ')}
                                                    </span>
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest block mb-0.5">Source</span>
                                                        <span className="text-[12px] text-[#2a2f36] font-mono font-medium">{item.source_clause || 'General'}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 align-top border-r border-[#d4d0c5]/50 flex flex-col">
                                                {item.evidence_available ? (
                                                    <div className="bg-emerald-50/50 p-3 rounded border border-emerald-100/50 h-full">
                                                        <p className="text-[13px] text-emerald-900 leading-relaxed font-medium">{item.evidence_available}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-neutral-400 italic text-[13px] pt-1">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        No explicit evidence
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-5 align-top">
                                                <div className="space-y-3">
                                                    {(item.missing_info || status === 'missing_info') && (
                                                        <div>
                                                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block mb-0.5">Missing Details</span>
                                                            <p className="text-[13px] text-neutral-700 leading-snug">{item.missing_info || "Data absent."}</p>
                                                        </div>
                                                    )}
                                                    {(item.action_needed || status === 'action_needed') && (
                                                        <div className="bg-red-50/50 p-2.5 rounded border border-red-100 flex items-start gap-2">
                                                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                            <p className="text-[13px] text-red-800 font-medium leading-snug">{item.action_needed || "Provide required document or statement."}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {rawMatrix.length === 0 && (
                            <div className="text-center py-20 text-neutral-400">
                                <p>No matrix data available to map.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Area Drawer / Focus Panel */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 350, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white border border-[#d4d0c5] shadow-lg rounded-xl overflow-y-auto custom-scrollbar flex-shrink-0 relative overflow-hidden flex flex-col"
                        >
                            <div className="bg-[#f0ebe1] p-4 flex items-center justify-between border-b border-[#d4d0c5]">
                                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#2a2f36]">Requirement Scope</h3>
                                <button onClick={() => setSelectedItem(null)} className="text-neutral-500 hover:text-[#2a2f36] bg-white p-1 rounded-full shadow-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-6 flex-1">
                                <div>
                                    <p className="text-[15px] font-semibold text-[#2a2f36] leading-relaxed">
                                        {selectedItem.requirement}
                                    </p>
                                </div>

                                {selectedItem.evidence_available && (
                                    <div>
                                        <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-2 border-b border-emerald-100 pb-1">Found Evidence</h4>
                                        <p className="text-[13px] text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                            {selectedItem.evidence_available}
                                        </p>
                                    </div>
                                )}

                                {selectedItem.action_needed && (
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <h4 className="text-[11px] font-bold text-red-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Critical Action
                                        </h4>
                                        <p className="text-[13px] font-medium text-red-900 leading-relaxed">
                                            {selectedItem.action_needed}
                                        </p>
                                        <button onClick={() => onNavigate?.('Draft Studio')} className="mt-4 w-full bg-white text-red-700 border border-red-200 font-bold text-[12px] uppercase tracking-wider py-2 rounded shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer">
                                            Execute in Draft Studio
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </motion.div>
    );
};
