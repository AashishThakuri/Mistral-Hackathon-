import React, { useState, useEffect } from 'react';
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
    onNewAnalysis?: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ file, data, onBack, onNewAnalysis }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Shared upload state across all tabs
    const [uploadedDocs, setUploadedDocs] = useState<Record<string, { originalName: string; storedName: string }>>({});

    // Voxtral transcription data (from audio uploads)
    const [voxtralData, setVoxtralData] = useState<any>(null);

    const handleUploadDoc = async (docKey: string): Promise<void> => {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = async () => {
                if (input.files?.[0]) {
                    try {
                        const formData = new FormData();
                        formData.append('file', input.files[0]);
                        const res = await fetch('http://localhost:5000/api/documents/upload', {
                            method: 'POST',
                            body: formData,
                        });
                        const result = await res.json();
                        if (result.success) {
                            setUploadedDocs(prev => ({ ...prev, [docKey]: { originalName: result.file.originalName, storedName: result.file.storedName } }));
                        }
                    } catch (err) {
                        console.error('Upload failed:', err);
                    }
                }
                resolve();
            };
            input.click();
        });
    };

    const handleRemoveDoc = async (docKey: string) => {
        const doc = uploadedDocs[docKey];
        if (!doc) return;
        try {
            await fetch('http://localhost:5000/api/documents/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storedName: doc.storedName }),
            });
            setUploadedDocs(prev => {
                const next = { ...prev };
                delete next[docKey];
                return next;
            });
        } catch (err) {
            console.error('Remove failed:', err);
        }
    };

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

    // Live clock + deadline awareness
    const [currentTime, setCurrentTime] = useState(new Date());
    const [deadlineNotifDismissed, setDeadlineNotifDismissed] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
        return () => clearInterval(timer);
    }, []);

    // Parse deadline date
    const parseDeadline = (dl: string): Date | null => {
        if (!dl || dl === 'Not Specified') return null;
        const d = new Date(dl);
        if (!isNaN(d.getTime())) return d;
        // Try common formats
        const match = dl.match(/(\w+ \d{1,2},?\s*\d{4})/i);
        if (match) {
            const pd = new Date(match[1]);
            if (!isNaN(pd.getTime())) return pd;
        }
        return null;
    };

    const deadlineDate = parseDeadline(deadline);
    const isPastDeadline = deadlineDate ? currentTime > deadlineDate : false;
    const hoursToDeadline = deadlineDate ? (deadlineDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60) : null;
    const isDeadlineSoon = hoursToDeadline !== null && hoursToDeadline > 0 && hoursToDeadline <= 48;
    const daysLeft = hoursToDeadline !== null && hoursToDeadline > 0 ? Math.ceil(hoursToDeadline / 24) : 0;

    // Export Summary as downloadable .doc
    const exportSummary = () => {
        const exec = data.executive_summary || {};
        const requirements = data.mandatory_requirements || [];
        const documents = data.required_documents || [];
        const risks = data.risks_flagged || [];
        const criteria = data.evaluation_criteria || [];
        const matrix = data.compliance_matrix || [];
        const blockers = data.top_blockers || [];
        const actions = data.next_actions || [];

        const listItems = (arr: any[], field: string) =>
            arr.map((item: any) => `<li style="margin-bottom:6px;">${typeof item === 'string' ? item : (item[field] || JSON.stringify(item))}</li>`).join('');

        const html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="utf-8"><title>${title} - Analysis Summary</title>
            <style>
                body { font-family: Calibri, Arial, sans-serif; margin: 40px; color: #2a2f36; line-height: 1.6; }
                h1 { font-size: 24pt; color: #1a1d24; border-bottom: 3px solid #2a2f36; padding-bottom: 8px; }
                h2 { font-size: 16pt; color: #2a2f36; margin-top: 28px; border-bottom: 1px solid #d4d0c5; padding-bottom: 4px; }
                .meta { background: #f5f3ef; padding: 12px 16px; border-radius: 6px; margin: 16px 0; }
                .meta span { display: inline-block; margin-right: 32px; }
                .meta strong { color: #666; font-size: 9pt; text-transform: uppercase; letter-spacing: 1px; display: block; }
                .score { font-size: 28pt; font-weight: bold; }
                .score-good { color: #059669; } .score-mid { color: #d97706; } .score-bad { color: #dc2626; }
                table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                th { background: #2a2f36; color: white; padding: 8px 12px; text-align: left; font-size: 10pt; }
                td { padding: 8px 12px; border-bottom: 1px solid #e5e2db; font-size: 10pt; }
                tr:nth-child(even) td { background: #faf9f6; }
                ul { padding-left: 20px; } li { margin-bottom: 4px; }
                .risk-critical { color: #dc2626; font-weight: bold; } .risk-high { color: #ea580c; font-weight: bold; }
                .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #d4d0c5; color: #999; font-size: 9pt; text-align: center; }
            </style></head><body>
            <h1>${title}</h1>
            <div class="meta">
                <span><strong>Issuing Authority</strong>${authority}</span>
                <span><strong>Deadline</strong>${deadline}</span>
                <span><strong>Category</strong>${category}</span>
                <span><strong>Bid Readiness</strong><span class="score ${(exec.bid_readiness_score || 0) > 70 ? 'score-good' : (exec.bid_readiness_score || 0) > 40 ? 'score-mid' : 'score-bad'}">${exec.bid_readiness_score || 'N/A'}</span> / 100</span>
            </div>

            <h2>Executive Summary</h2>
            <p>${exec.summary || exec.tender_summary || 'No executive summary available.'}</p>
            ${exec.overall_readiness_statement ? `<p><strong>Readiness Statement:</strong> ${exec.overall_readiness_statement}</p>` : ''}

            <h2>Mandatory Requirements (${requirements.length})</h2>
            <ul>${listItems(requirements, 'requirement')}</ul>

            <h2>Required Documents (${documents.length})</h2>
            <table>
                <tr><th>Document</th><th>Type</th><th>Status</th><th>Source</th></tr>
                ${documents.map((d: any) => {
            const isStr = typeof d === 'string';
            return `<tr>
                        <td>${isStr ? d : (d.document_name || 'Unnamed')}</td>
                        <td>${isStr ? '-' : (d.document_type || '-')}</td>
                        <td>${isStr ? 'Required' : (d.present ? '✅ Present' : '❌ Missing')}</td>
                        <td>${isStr ? '-' : (d.source_clause || '-')}</td>
                    </tr>`;
        }).join('')}
            </table>

            <h2>Risks Flagged (${risks.length})</h2>
            <table>
                <tr><th>Risk</th><th>Severity</th><th>Details</th></tr>
                ${risks.map((r: any) => {
            const isStr = typeof r === 'string';
            const sev = isStr ? '-' : (r.severity || '-');
            return `<tr>
                        <td>${isStr ? r : (r.risk_title || r.description || 'Unknown')}</td>
                        <td class="${sev.toLowerCase() === 'critical' ? 'risk-critical' : sev.toLowerCase() === 'high' ? 'risk-high' : ''}">${sev}</td>
                        <td>${isStr ? '-' : (r.mitigation || r.description || '-')}</td>
                    </tr>`;
        }).join('')}
            </table>

            <h2>Evaluation Criteria (${criteria.length})</h2>
            <table>
                <tr><th>Criteria</th><th>Weight</th><th>Details</th></tr>
                ${criteria.map((c: any) => {
            const isStr = typeof c === 'string';
            return `<tr>
                        <td>${isStr ? c : (c.criteria || c.criterion || 'Unknown')}</td>
                        <td>${isStr ? '-' : (c.weight || c.max_points || '-')}</td>
                        <td>${isStr ? '-' : (c.description || c.details || '-')}</td>
                    </tr>`;
        }).join('')}
            </table>

            ${matrix.length > 0 ? `
            <h2>Compliance Matrix</h2>
            <table>
                <tr><th>Requirement</th><th>Status</th><th>Evidence</th></tr>
                ${matrix.map((m: any) => `<tr>
                    <td>${m.requirement || '-'}</td>
                    <td>${m.status || m.compliance_status || '-'}</td>
                    <td>${m.evidence || m.action_needed || '-'}</td>
                </tr>`).join('')}
            </table>` : ''}

            <h2>Top Blockers</h2>
            <ul>${listItems(blockers, 'description')}</ul>

            <h2>Recommended Next Actions</h2>
            <ul>${listItems(actions, 'action')}</ul>

            <div class="footer">Generated by Strata AI · Tender Analysis Report · ${new Date().toLocaleDateString()}</div>
            </body></html>`;

        const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_Analysis_Report.doc`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full h-full min-h-screen flex bg-[#fbf9f6] text-neutral-800" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* Sidebar */}
            <div className={`bg-white border-r border-[#d4d0c5]/50 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-30 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className={`p-6 pb-2 transition-all duration-300 ${isSidebarOpen ? '' : 'px-4 items-center justify-center'}`}>
                    <div className={`flex items-center gap-2 ${isSidebarOpen ? '' : 'justify-center'}`}>
                        <img src="/logo.png" alt="Strata Logo" className="h-10 w-auto object-contain -ml-1 transition-transform" />
                        {isSidebarOpen && (
                            <span className="text-[22px] font-bold tracking-tight whitespace-nowrap" style={{ fontFamily: '"ADLaM Display", cursive', color: '#2a2f36' }}>
                                Strata
                            </span>
                        )}
                    </div>
                </div>

                <div className={`flex-1 overflow-y-auto py-6 flex flex-col gap-1 custom-scrollbar ${isSidebarOpen ? 'px-4' : 'px-2 items-center'}`}>
                    {isSidebarOpen && (
                        <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2 px-3 whitespace-nowrap">Analysis Workspace</p>
                    )}
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            title={!isSidebarOpen ? tab.id : undefined}
                            className={`flex items-center rounded-md font-medium transition-colors cursor-pointer w-full
                                ${isSidebarOpen ? 'gap-3 px-3 py-2.5 text-[14px] text-left' : 'justify-center p-3'}
                                ${activeTab === tab.id
                                    ? 'bg-[#2a2f36] text-white shadow-sm'
                                    : 'text-neutral-600 hover:bg-[#f0ebe1] hover:text-neutral-900'}
                            `}
                        >
                            <svg className={`flex-shrink-0 ${isSidebarOpen ? 'w-5 h-5' : 'w-6 h-6'} ${activeTab === tab.id ? 'text-white' : 'text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSidebarOpen ? 2 : 1.5} d={tab.icon} />
                            </svg>
                            {isSidebarOpen && <span className="truncate">{tab.id}</span>}
                        </button>
                    ))}
                </div>

                {/* Sidebar Toggle Button */}
                <div className={`p-4 border-t border-[#d4d0c5]/50 flex ${isSidebarOpen ? 'justify-end' : 'justify-center'}`}>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        <svg className={`w-5 h-5 transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
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
                            <button onClick={onNewAnalysis} className="nav-box-hover flex items-center justify-center gap-2" title="New Analysis">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                New
                            </button>
                            <button onClick={exportSummary} className="nav-box-hover flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export Summary
                            </button>
                            {activeTab !== 'Draft Studio' && (
                                <button onClick={() => setActiveTab('Draft Studio')} className="nav-box-hover flex items-center justify-center gap-2">
                                    Open Draft Studio
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Deadline Notification Banner */}
                {!deadlineNotifDismissed && (isPastDeadline || isDeadlineSoon) && (
                    <div className={`mx-10 mt-4 rounded-xl px-6 py-4 flex items-center justify-between shadow-sm border animate-[fadeIn_0.3s_ease-out] ${isPastDeadline
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPastDeadline ? 'bg-red-100' : 'bg-amber-100'}`}>
                                <svg className={`w-5 h-5 ${isPastDeadline ? 'text-red-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isPastDeadline ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'} />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-[14px]">
                                    {isPastDeadline ? '⚠️ Deadline Has Passed!' : `⏰ Deadline Approaching — ${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining`}
                                </p>
                                <p className="text-[13px] opacity-80">
                                    {isPastDeadline
                                        ? `The submission deadline was ${deadline}. You may still prepare your response, but verify with the issuing authority if late submissions are accepted.`
                                        : `Submission is due ${deadline}. Ensure all documents are uploaded and the response package is finalized.`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">
                                Now: {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button onClick={() => setDeadlineNotifDismissed(true)} className={`p-1.5 rounded-full transition-colors cursor-pointer ${isPastDeadline ? 'hover:bg-red-100' : 'hover:bg-amber-100'}`} title="Dismiss">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab Content */}
                <main className="flex-1 p-10">
                    {activeTab === 'Overview' && (
                        <OverviewTab
                            data={data}
                            meta={meta}
                            onNavigate={setActiveTab}
                            uploadedDocs={uploadedDocs}
                        />
                    )}

                    {activeTab === 'Requirements' && (
                        <RequirementsTab data={data} />
                    )}

                    {activeTab === 'Documents' && (
                        <DocumentsTab data={data} onNavigate={setActiveTab} uploadedDocs={uploadedDocs} onUpload={handleUploadDoc} onRemove={handleRemoveDoc} />
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
                        <DraftStudioTab data={data} uploadedDocs={uploadedDocs} voxtralData={voxtralData} />
                    )}

                    {activeTab === 'Submission Review' && (
                        <SubmissionReviewTab data={data} onNavigate={setActiveTab} uploadedDocs={uploadedDocs} />
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
