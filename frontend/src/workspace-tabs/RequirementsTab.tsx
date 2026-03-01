import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RequirementsTabProps {
    data: any;
}

export const RequirementsTab: React.FC<RequirementsTabProps> = ({ data }) => {
    const rawRequirements = data.mandatory_requirements || [];
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedReq, setSelectedReq] = useState<any | null>(null);

    // Filter Logic
    const filteredReqs = rawRequirements.filter((req: any) => {
        const text = typeof req === 'string' ? req : (req.requirement || '');
        const matchesSearch = text.toLowerCase().includes(search.toLowerCase());

        let matchesFilter = true;
        if (typeof req === 'object') {
            if (filter === 'high priority') matchesFilter = req.criticality?.toLowerCase() === 'high';
            if (filter === 'unresolved') matchesFilter = req.status?.toLowerCase() === 'unresolved';
            if (filter === 'action needed') matchesFilter = req.status?.toLowerCase() === 'action_needed';
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full flex flex-col">

            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative w-96">
                    <svg className="w-5 h-5 absolute left-3 top-2.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Search requirements..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#d4d0c5] focus:border-[#2a2f36] focus:ring-1 focus:ring-[#2a2f36] outline-none text-[14px] shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'high priority', 'unresolved', 'action needed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-[13px] font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-[#2a2f36] text-white' : 'bg-white border border-[#d4d0c5] text-neutral-600 hover:bg-neutral-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area (List + Drawer) */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Hybrid Table List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 pb-10">
                    {filteredReqs.map((req: any, idx: number) => {
                        const isStr = typeof req === 'string';
                        const text = isStr ? req : req.requirement;
                        const crit = isStr ? 'medium' : (req.criticality?.toLowerCase() || 'medium');
                        const status = isStr ? 'pending' : (req.status?.toLowerCase() || 'unresolved');
                        const isSelected = selectedReq === req;

                        return (
                            <div
                                key={idx}
                                onClick={() => setSelectedReq(isSelected ? null : req)}
                                className={`bg-white rounded-lg border transition-all cursor-pointer flex items-stretch overflow-hidden group
                                    ${isSelected ? 'border-[#2a2f36] shadow-md ring-1 ring-[#2a2f36]' : 'border-[#d4d0c5] shadow-sm hover:border-neutral-400'}
                                `}
                            >
                                {/* Left strip color indication */}
                                <div className={`w-1.5 ${crit === 'high' ? 'bg-red-500' : crit === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />

                                <div className="flex-1 p-4 flex items-center gap-6">
                                    {/* Text Column (Left) */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[15px] font-medium truncate ${isSelected ? 'text-[#2a2f36] whitespace-normal' : 'text-neutral-800'}`}>
                                            {text}
                                        </p>
                                    </div>

                                    {/* Middle Column (Source/Cat) */}
                                    <div className="w-48 flex-shrink-0 flex flex-col gap-1 hidden md:flex">
                                        {!isStr && req.category && (
                                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">{req.category}</span>
                                        )}
                                        <span className="text-[13px] text-neutral-600 truncate flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                            {isStr ? 'Document' : req.source_clause || 'General'}
                                        </span>
                                    </div>

                                    {/* Right Column (Status) */}
                                    <div className="w-36 flex-shrink-0 flex justify-end">
                                        <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide border
                                            ${status === 'satisfied' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                status === 'action_needed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    status === 'missing_info' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                        'bg-neutral-100 text-neutral-600 border-neutral-200'
                                            }
                                        `}>
                                            {status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredReqs.length === 0 && (
                        <div className="text-center py-20 text-neutral-400">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <p>No requirements found matching criteria.</p>
                        </div>
                    )}
                </div>

                {/* Right Side Details Drawer */}
                <AnimatePresence>
                    {selectedReq && (
                        <motion.div
                            initial={{ width: 0, opacity: 0, scale: 0.95 }}
                            animate={{ width: 400, opacity: 1, scale: 1 }}
                            exit={{ width: 0, opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white border border-[#d4d0c5]/80 shadow-lg rounded-xl overflow-y-auto custom-scrollbar flex-shrink-0 relative"
                        >
                            <div className="p-6">
                                <button onClick={() => setSelectedReq(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors bg-neutral-100 p-1 rounded-full">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>

                                <h3 className="text-[12px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Requirement Details</h3>

                                <div className="space-y-6">
                                    {/* Core Text */}
                                    <div>
                                        <p className="text-[16px] font-medium text-[#2a2f36] leading-relaxed">
                                            {typeof selectedReq === 'string' ? selectedReq : selectedReq.requirement}
                                        </p>
                                    </div>

                                    {/* Metadata Grid */}
                                    {typeof selectedReq !== 'string' && (
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#d4d0c5]/50">
                                            <div>
                                                <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Status</span>
                                                <span className="text-[14px] font-medium text-neutral-800 capitalize">
                                                    {(selectedReq.status || 'Pending').replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Criticality</span>
                                                <span className={`text-[14px] font-bold
                                                    ${selectedReq.criticality?.toLowerCase() === 'high' ? 'text-red-600' : 'text-neutral-800'}
                                                `}>
                                                    {selectedReq.criticality || 'Medium'}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Source Clause</span>
                                                <div className="flex items-center gap-2 text-[14px] text-blue-600 font-medium bg-blue-50 px-3 py-2 rounded-md">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {selectedReq.source_clause || 'General Document'}
                                                    {selectedReq.page_number && <span className="text-blue-400 ml-1">(Page {selectedReq.page_number})</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Next Action Box */}
                                    {typeof selectedReq !== 'string' && selectedReq.status === 'action_needed' && (
                                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                            <h4 className="text-[12px] font-bold uppercase tracking-widest text-red-800 mb-1">Action Required</h4>
                                            <p className="text-[14px] text-red-900 font-medium">This requirement is flagged as unresolved. Please review the missing information or supply the mandatory evidence in the Draft Studio.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
