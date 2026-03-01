import React from 'react';
import { motion } from 'framer-motion';

interface SubmissionReviewTabProps {
    data: any;
    onNavigate?: (tab: string) => void;
    uploadedDocs?: Record<string, { originalName: string; storedName: string }>;
}

export const SubmissionReviewTab: React.FC<SubmissionReviewTabProps> = ({ data, onNavigate, uploadedDocs = {} }) => {
    // Computed Metrics
    const exec = data.executive_summary || {};
    const readinessScore = exec.bid_readiness_score || 0;

    const docs = data.required_documents || [];
    const missingDocsCount = docs.filter((d: any) => {
        const isStr = typeof d === 'string';
        const name = isStr ? d : (d.document_name || '');
        const key = `doc::${name.replace(/\s+/g, '_').toLowerCase()}`;
        if (uploadedDocs[key]) return false;
        return isStr ? true : (d.mandatory && !d.present);
    }).length;

    const risks = data.risks_flagged || [];
    const criticalRisksCount = risks.filter((r: any) => typeof r !== 'string' && r.severity?.toLowerCase() === 'critical').length;

    const reqs = data.mandatory_requirements || [];
    const unresolvedReqsCount = reqs.filter((r: any) => typeof r !== 'string' && (r.status === 'unresolved' || r.status === 'action_needed')).length;

    const isReady = missingDocsCount === 0 && criticalRisksCount === 0 && unresolvedReqsCount === 0;

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="h-full flex flex-col py-8">

            {/* Top Readiness Score Section */}
            <div className={`bg-white rounded-2xl p-8 border shadow-sm mb-8 flex items-center justify-between transition-colors
                ${isReady ? 'border-emerald-200 shadow-emerald-100/50' : 'border-[#d4d0c5]'}
            `}>
                <div>
                    <h2 className="text-2xl font-bold text-[#2a2f36] mb-2">Final Submission Readiness</h2>
                    <p className="text-[15px] text-neutral-600 max-w-md leading-relaxed">
                        {isReady
                            ? "All critical constraints satisfied. Generate the final compliant bid package now."
                            : "There are outstanding blockers preventing a fully compliant submission. Review the checklist below."}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Strata AI Score</p>
                        <div className="flex items-baseline gap-1 justify-end">
                            <span className={`text-6xl font-bold ${readinessScore > 80 ? 'text-emerald-500' : readinessScore > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{readinessScore}</span>
                            <span className="text-xl font-bold text-neutral-300">/100</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Pre-submission Checklist */}
            <h3 className="text-lg font-bold text-[#2a2f36] mb-5">Pre-submission Audit</h3>

            <div className="bg-white rounded-xl border border-[#d4d0c5] shadow-sm mb-8 divide-y divide-[#d4d0c5]/50 overflow-hidden">
                {/* Check 1: Documents */}
                <div className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${missingDocsCount === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {missingDocsCount === 0 ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <span className="font-bold">{missingDocsCount}</span>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[15px] font-bold text-[#2a2f36]">Mandatory Documents Uploaded</h4>
                            <p className="text-[13px] text-neutral-500 mt-0.5">Assessing required forms, pricing sheets, and certifications.</p>
                        </div>
                    </div>
                    {missingDocsCount === 0 ? (
                        <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100">Cleared</span>
                    ) : (
                        <button onClick={() => onNavigate?.('Documents')} className="text-[13px] font-bold text-red-700 bg-white border border-red-200 px-4 py-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer">Fix Documents</button>
                    )}
                </div>

                {/* Check 2: Risks */}
                <div className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${criticalRisksCount === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {criticalRisksCount === 0 ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <span className="font-bold">{criticalRisksCount}</span>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[15px] font-bold text-[#2a2f36]">Critical Risks Mitigated</h4>
                            <p className="text-[13px] text-neutral-500 mt-0.5">Checking for unresolved disqualifiers and major rule breaches.</p>
                        </div>
                    </div>
                    {criticalRisksCount === 0 ? (
                        <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100">Cleared</span>
                    ) : (
                        <button onClick={() => onNavigate?.('Risks')} className="text-[13px] font-bold text-red-700 bg-white border border-red-200 px-4 py-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer">Review Risks</button>
                    )}
                </div>

                {/* Check 3: Matrix */}
                <div className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${unresolvedReqsCount === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                            {unresolvedReqsCount === 0 ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <span className="font-bold">{unresolvedReqsCount}</span>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[15px] font-bold text-[#2a2f36]">Compliance Traceability Complete</h4>
                            <p className="text-[13px] text-neutral-500 mt-0.5">Ensuring every mandatory requirement points to explicit evidence.</p>
                        </div>
                    </div>
                    {unresolvedReqsCount === 0 ? (
                        <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100">Cleared</span>
                    ) : (
                        <button onClick={() => onNavigate?.('Compliance Matrix')} className="text-[13px] font-bold text-orange-700 bg-white border border-orange-200 px-4 py-1.5 rounded hover:bg-orange-50 transition-colors cursor-pointer">Map Evidence</button>
                    )}
                </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="grid grid-cols-2 gap-8 mt-auto">
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                    <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#2a2f36] mb-3">Unresolved Blockers</h4>
                    {!isReady ? (
                        <ul className="space-y-2 text-[13px] text-neutral-600 font-medium">
                            {missingDocsCount > 0 && <li>&bull; <span className="font-bold text-red-600">{missingDocsCount} required forms</span> are missing.</li>}
                            {criticalRisksCount > 0 && <li>&bull; <span className="font-bold text-red-600">{criticalRisksCount} critical risks</span> remain open.</li>}
                            {unresolvedReqsCount > 0 && <li>&bull; <span className="font-bold text-orange-600">{unresolvedReqsCount} requirements</span> lack mapped evidence.</li>}
                        </ul>
                    ) : (
                        <p className="text-[13px] text-emerald-700 font-medium bg-emerald-100/50 p-2.5 rounded border border-emerald-200/50">
                            Zero blockers detected. Proceed to final compilation.
                        </p>
                    )}
                </div>

                <div className="bg-[#fbf9f6] rounded-xl p-6 border border-[#d4d0c5] flex flex-col justify-center text-center shadow-sm">
                    <div>
                        <button
                            onClick={() => {
                                const pkg = {
                                    generated_at: new Date().toISOString(),
                                    tender_metadata: data.tender_metadata,
                                    executive_summary: data.executive_summary,
                                    mandatory_requirements: data.mandatory_requirements,
                                    required_documents: data.required_documents,
                                    risks_flagged: data.risks_flagged,
                                    evaluation_criteria: data.evaluation_criteria,
                                    compliance_matrix: data.compliance_matrix,
                                    next_actions: data.next_actions,
                                    top_blockers: data.top_blockers,
                                    readiness_score: readinessScore,
                                    submission_status: isReady ? 'READY' : 'BLOCKED',
                                };
                                const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                const name = (data.tender_metadata?.title || 'tender').replace(/\s+/g, '_');
                                a.href = url;
                                a.download = `${name}_final_response_package.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            disabled={!isReady}
                            className={`w-full py-4 rounded-lg font-bold text-[15px] tracking-wide transition-all shadow-sm flex items-center justify-center gap-3
                                ${isReady
                                    ? 'bg-[#2a2f36] text-white hover:bg-black cursor-pointer'
                                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Generate Final Response Package
                        </button>
                        <p className="text-[11px] font-medium text-neutral-400 mt-4 leading-relaxed max-w-sm mx-auto">
                            By generating the package, Mistral AI will compile your drafts, mapped documents, and compliance matrices into a ready-to-sign PDF & ZIP payload.
                        </p>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};
