import React, { useState } from 'react';
import { OverviewTab } from './workspace-tabs/OverviewTab';
import { RequirementsTab } from './workspace-tabs/RequirementsTab';
import { DocumentsTab } from './workspace-tabs/DocumentsTab';
import { EvaluationTab } from './workspace-tabs/EvaluationTab';
import { RisksTab } from './workspace-tabs/RisksTab';
import { ComplianceMatrixTab } from './workspace-tabs/ComplianceMatrixTab';
import { DraftStudioTab } from './workspace-tabs/DraftStudioTab';
import { SubmissionReviewTab } from './workspace-tabs/SubmissionReviewTab';

export interface WorkspaceProps {
    file: File;
    data: any; // Parsed Mistral JSON analysis
    onBack?: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ file, data, onBack }) => {
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = [
        { id: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'Requirements', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4' },
        { id: 'Documents', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
        { id: 'Evaluation', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { id: 'Risks', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        { id: 'Compliance Matrix', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
        { id: 'Draft Studio', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
        { id: 'Submission Review', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
    ];

    // Extraction Safeties
    const meta = data.tender_metadata || {};
    const title = meta.title || file.name.replace('.pdf', '');
    const authority = meta.issuing_authority || 'Unknown Authority';
    const deadline = meta.deadline || 'Not Specified';
    const category = meta.category || 'Tender Document';

    // Export Summary as downloadable JSON
    const exportSummary = () => {
        const summary = {
            title: title,
            authority: authority,
            deadline: deadline,
            category: category,
            executive_summary: data.executive_summary,
            mandatory_requirements: data.mandatory_requirements,
            required_documents: data.required_documents,
            risks_flagged: data.risks_flagged,
            evaluation_criteria: data.evaluation_criteria,
            compliance_matrix: data.compliance_matrix,
            top_blockers: data.top_blockers,
            next_actions: data.next_actions,
        };
        const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_analysis_summary.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full h-full min-h-screen flex bg-[#fbf9f6] text-neutral-800" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-[#d4d0c5]/50 flex flex-col h-screen sticky top-0">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Strata Logo" className="h-10 w-auto object-contain -ml-1" />
                        <span className="text-[22px] font-bold tracking-tight" style={{ fontFamily: '"ADLaM Display", cursive', color: '#2a2f36' }}>
                            Strata
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-4 custom-scrollbar">
                    <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2 px-3">Analysis Workspace</p>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer w-full text-left
                            ${activeTab === tab.id ? 'bg-[#2a2f36] text-white shadow-sm' : 'text-neutral-600 hover:bg-[#f0ebe1] hover:text-neutral-900'}`}
                        >
                            <svg className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                            </svg>
                            {tab.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
                {/* Header */}
                <header className="bg-white border-b border-[#d4d0c5]/50 px-10 py-8 sticky top-0 z-20">
                    <div className="flex justify-between items-start">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-3">
                                <button onClick={onBack} className="p-1 hover:bg-neutral-100 rounded-md transition-colors text-neutral-400 hover:text-neutral-700 cursor-pointer" title="Back to Upload">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                </button>
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 uppercase tracking-wide">
                                    Analyzed
                                </span>
                                <span className="text-sm text-neutral-500 font-medium">Category: {category}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-[#2a2f36] mb-2 leading-tight">{title}</h1>
                            <div className="flex items-center gap-6 text-[14px] text-neutral-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    {authority}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className={deadline === 'Not Specified' ? '' : 'text-orange-700 font-bold'}>Deadline: {deadline}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={exportSummary} className="px-4 py-2 bg-white border border-[#d4d0c5] hover:border-[#a8a49c] hover:bg-neutral-50 text-[#2a2f36] text-[14px] font-semibold rounded-[4px] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export Summary
                            </button>
                            <button onClick={() => setActiveTab('Draft Studio')} className="px-5 py-2 bg-[#2a2f36] hover:bg-[#1a1d24] text-white text-[14px] font-semibold rounded-[4px] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                                Open Draft Studio
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Tab Content */}
                <main className="flex-1 p-10">
                    {activeTab === 'Overview' && (
                        <OverviewTab
                            data={data}
                            meta={meta}
                            onNavigate={setActiveTab}
                        />
                    )}

                    {activeTab === 'Requirements' && (
                        <RequirementsTab data={data} />
                    )}

                    {activeTab === 'Documents' && (
                        <DocumentsTab data={data} onNavigate={setActiveTab} />
                    )}

                    {activeTab === 'Risks' && (
                        <RisksTab data={data} onNavigate={setActiveTab} />
                    )}

                    {activeTab === 'Evaluation' && (
                        <EvaluationTab data={data} />
                    )}

                    {activeTab === 'Compliance Matrix' && (
                        <ComplianceMatrixTab data={data} onNavigate={setActiveTab} />
                    )}

                    {activeTab === 'Draft Studio' && (
                        <DraftStudioTab data={data} />
                    )}

                    {activeTab === 'Submission Review' && (
                        <SubmissionReviewTab data={data} onNavigate={setActiveTab} />
                    )}

                    {!['Overview', 'Requirements', 'Documents', 'Risks', 'Evaluation', 'Compliance Matrix', 'Draft Studio', 'Submission Review'].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <p>The {activeTab} view will populate here.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
