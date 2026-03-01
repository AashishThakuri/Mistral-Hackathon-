import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DocumentsTabProps {
    data: any;
    onNavigate?: (tab: string) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ data, onNavigate }) => {
    const rawDocs = data.required_documents || [];
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'Forms': true,
        'Certifications': true,
        'Pricing Sheets': true,
        'Legal': true,
        'Technical Attachments': true,
        'Other': true
    });

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    // Grouping Logic
    const grouped = rawDocs.reduce((acc: any, doc: any) => {
        const type = typeof doc === 'string' ? 'Other' : (doc.document_type || 'Other');
        if (!acc[type]) acc[type] = [];
        acc[type].push(doc);
        return acc;
    }, {});

    const totalDocs = rawDocs.length;
    const missingDocs = rawDocs.filter((d: any) => typeof d !== 'string' && d.mandatory && !d.present);
    const presentDocs = totalDocs - missingDocs.length;
    const optionalDocs = rawDocs.filter((d: any) => typeof d !== 'string' && d.mandatory === false);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full flex flex-col space-y-6 max-w-7xl">

            {/* Top Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-[#d4d0c5]/70 shadow-sm flex flex-col justify-between">
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Total Required</p>
                    <span className="text-3xl font-bold text-[#2a2f36]">{totalDocs}</span>
                </div>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200 shadow-sm flex flex-col justify-between">
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1">Uploaded</p>
                    <span className="text-3xl font-bold text-emerald-600">{presentDocs}</span>
                </div>
                <div className="bg-red-50 p-5 rounded-lg border border-red-200 shadow-sm flex flex-col justify-between">
                    <p className="text-red-800 text-xs font-bold uppercase tracking-widest mb-1">Missing</p>
                    <span className="text-3xl font-bold text-red-600">{missingDocs.length}</span>
                </div>
                <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200 shadow-sm flex flex-col justify-between">
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Optional</p>
                    <span className="text-3xl font-bold text-neutral-600">{optionalDocs.length}</span>
                </div>
            </div>

            <div className="flex-1 flex gap-8 items-start pb-10">
                {/* Main Accordion List */}
                <div className="flex-1 space-y-4">
                    {Object.keys(grouped).map(group => (
                        <div key={group} className="bg-white rounded-xl border border-[#d4d0c5] shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleGroup(group)}
                                className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50/50 hover:bg-neutral-100 transition-colors border-b border-[#d4d0c5]/50 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-[#2a2f36]">{group}</h3>
                                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold">{grouped[group].length}</span>
                                </div>
                                <svg className={`w-5 h-5 text-neutral-500 transition-transform ${expandedGroups[group] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {expandedGroups[group] && (
                                <div className="divide-y divide-[#d4d0c5]/50">
                                    {grouped[group].map((doc: any, idx: number) => {
                                        const isStr = typeof doc === 'string';
                                        const name = isStr ? doc : (doc.document_name || 'Unnamed Document');
                                        const isMandatory = isStr ? true : doc.mandatory !== false;
                                        const isMissing = isStr ? true : !doc.present;

                                        return (
                                            <div key={idx} className="p-6 flex items-start gap-4 hover:bg-neutral-50 transition-colors">
                                                <div className="mt-1">
                                                    <svg className={`w-8 h-8 ${isMissing ? 'text-neutral-300' : 'text-emerald-500'}`} fill={isMissing ? 'none' : 'currentColor'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-[16px] font-bold text-[#2a2f36]">{name}</h4>
                                                        <div className="flex gap-2">
                                                            {isMandatory ? (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100">Mandatory</span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-500 border border-neutral-200">Optional</span>
                                                            )}
                                                            {isMissing ? (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-200">Missing</span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200">Uploaded</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {!isStr && (
                                                        <div className="flex items-center gap-4 text-[13px] text-neutral-500 font-medium mt-2">
                                                            {doc.source_clause && (
                                                                <span className="flex items-center gap-1.5 bg-neutral-100 rounded px-2 py-1">
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    Source: {doc.source_clause}
                                                                </span>
                                                            )}
                                                            {doc.page_number && <span>Page: {doc.page_number}</span>}
                                                        </div>
                                                    )}

                                                    {!isStr && doc.why_required && (
                                                        <p className="text-[13px] text-neutral-600 mt-2 leading-relaxed">
                                                            <span className="font-semibold text-neutral-800">Context:</span> {doc.why_required}
                                                        </p>
                                                    )}

                                                    {isMissing && (
                                                        <div className="mt-4">
                                                            <button onClick={() => {
                                                                const input = document.createElement('input');
                                                                input.type = 'file';
                                                                input.onchange = () => alert(`File selected: ${input.files?.[0]?.name}. Upload functionality will be connected to backend.`);
                                                                input.click();
                                                            }} className="text-[13px] font-bold text-[#2a2f36] bg-white border border-[#2a2f36] rounded px-4 py-1.5 hover:bg-[#2a2f36] hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                                Upload Document
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Side Sticky Panel: Missing Forms */}
                <div className="w-80 flex-shrink-0">
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm sticky top-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-[16px] font-bold text-red-900">Missing Mandatory Forms</h3>
                        </div>

                        {missingDocs.length > 0 ? (
                            <ul className="space-y-3">
                                {missingDocs.map((doc: any, idx: number) => (
                                    <li key={idx} className="bg-white p-3 rounded border border-red-100 shadow-sm">
                                        <p className="text-[13px] font-bold text-[#2a2f36] mb-1">{typeof doc === 'string' ? doc : doc.document_name}</p>
                                        {!typeof doc && doc.why_required && (
                                            <p className="text-[11px] text-neutral-500 leading-snug">{doc.why_required}</p>
                                        )}
                                        <button onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.onchange = () => alert(`File selected: ${input.files?.[0]?.name}. Upload connected.`);
                                            input.click();
                                        }} className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider cursor-pointer flex items-center gap-1">
                                            Upload Now <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-emerald-700 font-bold text-[14px]">All mandatory forms uploaded!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </motion.div>
    );
};
