import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DocumentsTabProps {
    data: any;
    onNavigate?: (tab: string) => void;
    uploadedDocs: Record<string, { originalName: string; storedName: string }>;
    onUpload: (docKey: string) => Promise<void>;
    onRemove: (docKey: string) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ data, onNavigate, uploadedDocs, onUpload, onRemove }) => {
    const rawDocs = data.required_documents || [];
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'Forms': true,
        'Certifications': true,
        'Pricing Sheets': true,
        'Legal': true,
        'Technical Attachments': true,
        'Other': true
    });
    const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    // Create stable unique key from document name
    const getDocKey = (doc: any, _idx: number) => {
        const name = typeof doc === 'string' ? doc : (doc.document_name || `doc-${_idx}`);
        return `doc::${name.replace(/\s+/g, '_').toLowerCase()}`;
    };

    const handleUpload = async (docKey: string) => {
        setUploadingDocs(prev => ({ ...prev, [docKey]: true }));
        await onUpload(docKey);
        setUploadingDocs(prev => ({ ...prev, [docKey]: false }));
    };

    // Grouping Logic
    const grouped = rawDocs.reduce((acc: any, doc: any, idx: number) => {
        const type = typeof doc === 'string' ? 'Other' : (doc.document_type || 'Other');
        if (!acc[type]) acc[type] = [];
        acc[type].push({ doc, originalIdx: idx });
        return acc;
    }, {});

    // Compute counts using upload state
    const totalDocs = rawDocs.length;
    const getActualMissing = () => rawDocs.filter((d: any, idx: number) => {
        const key = getDocKey(d, idx);
        if (uploadedDocs[key]) return false; // uploaded → not missing
        const isStr = typeof d === 'string';
        return isStr ? true : (d.mandatory !== false && !d.present);
    });
    const missingDocs = getActualMissing();
    const presentDocs = totalDocs - missingDocs.length;
    const optionalDocs = rawDocs.filter((d: any) => typeof d !== 'string' && d.mandatory === false);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full flex flex-col space-y-6">

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
                <div className={`p-5 rounded-lg border shadow-sm flex flex-col justify-between ${missingDocs.length > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${missingDocs.length > 0 ? 'text-red-800' : 'text-emerald-700'}`}>{missingDocs.length > 0 ? 'Missing' : 'All Uploaded'}</p>
                    <span className={`text-3xl font-bold ${missingDocs.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{missingDocs.length}</span>
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
                                    {grouped[group].map(({ doc, originalIdx }: any) => {
                                        const isStr = typeof doc === 'string';
                                        const name = isStr ? doc : (doc.document_name || 'Unnamed Document');
                                        const isMandatory = isStr ? true : doc.mandatory !== false;
                                        const docKey = getDocKey(doc, originalIdx);
                                        const isUploaded = !!uploadedDocs[docKey];
                                        const isMissing = isStr ? !isUploaded : (!doc.present && !isUploaded);

                                        return (
                                            <div key={originalIdx} className="p-6 flex items-start gap-4 hover:bg-neutral-50 transition-colors">
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

                                                    {/* Upload button when missing */}
                                                    {isMissing && (
                                                        <div className="mt-4">
                                                            <button
                                                                onClick={() => handleUpload(docKey)}
                                                                disabled={uploadingDocs[docKey]}
                                                                className={`text-[13px] font-bold rounded px-4 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${uploadingDocs[docKey]
                                                                    ? 'bg-[#2a2f36] text-white border border-[#2a2f36]'
                                                                    : 'text-[#2a2f36] bg-white border border-[#2a2f36] hover:bg-[#2a2f36] hover:text-white'
                                                                    }`}
                                                            >
                                                                {uploadingDocs[docKey] ? (
                                                                    <>
                                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                                        Uploading...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                                        Upload Document
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Uploaded confirmation + Remove */}
                                                    {isUploaded && (
                                                        <div className="mt-4 flex items-center gap-3">
                                                            <div className="flex items-center gap-2 text-emerald-600">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                                <span className="text-[13px] font-bold">{uploadedDocs[docKey].originalName}</span>
                                                            </div>
                                                            <button onClick={() => onRemove(docKey)} className="text-[12px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors">
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                Remove
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
                    <div className={`p-6 rounded-xl border shadow-sm sticky top-6 ${missingDocs.length > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${missingDocs.length > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {missingDocs.length > 0 ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                )}
                            </div>
                            <h3 className={`text-[16px] font-bold ${missingDocs.length > 0 ? 'text-red-900' : 'text-emerald-900'}`}>
                                {missingDocs.length > 0 ? 'Missing Mandatory Forms' : 'All Documents Uploaded!'}
                            </h3>
                        </div>

                        {missingDocs.length > 0 ? (
                            <ul className="space-y-3">
                                {missingDocs.map((doc: any, idx: number) => {
                                    const docKey = getDocKey(doc, rawDocs.indexOf(doc));
                                    return (
                                        <li key={idx} className="bg-white p-3 rounded border border-red-100 shadow-sm">
                                            <p className="text-[13px] font-bold text-[#2a2f36] mb-1">{typeof doc === 'string' ? doc : doc.document_name}</p>
                                            {!uploadedDocs[docKey] ? (
                                                <button
                                                    onClick={() => handleUpload(docKey)}
                                                    disabled={uploadingDocs[docKey]}
                                                    className="mt-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-colors"
                                                >
                                                    {uploadingDocs[docKey] ? (
                                                        <span className="text-orange-600 flex items-center gap-1">
                                                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                            Uploading...
                                                        </span>
                                                    ) : (
                                                        <span className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                                            Upload Now <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                        </span>
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                        Uploaded
                                                    </span>
                                                    <button onClick={() => onRemove(docKey)} className="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer">
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-center py-6">
                                <svg className="w-10 h-10 text-emerald-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-emerald-700 font-bold text-[14px]">All mandatory forms uploaded!</p>
                                <p className="text-emerald-600 text-[12px] mt-1">Proceed to Draft Studio or Submission Review.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </motion.div>
    );
};
