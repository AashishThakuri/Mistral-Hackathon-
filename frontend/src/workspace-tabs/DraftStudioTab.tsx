import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface VoxtralData {
    text: string;
    segments: Array<{ speaker: string; text: string; start: number; end: number }>;
    decisions: string[];
    actionItems: string[];
    changedAssumptions: string[];
    unresolvedQuestions: string[];
}

interface DraftStudioTabProps {
    data: any;
    uploadedDocs?: Record<string, { originalName: string; storedName: string }>;
    voxtralData?: VoxtralData | null;
}

// Fixed 12 sections
const SECTIONS = [
    { id: 'executive-summary', label: 'Executive Summary', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'cover-letter', label: 'Cover Letter / Bid Form', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'forms', label: 'Forms', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'certifications', label: 'Certifications', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { id: 'pricing', label: 'Pricing Sheets', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'financial', label: 'Financial Assurance', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
    { id: 'legal', label: 'Legal / Contract Exceptions', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
    { id: 'document-compliance', label: 'Document Compliance', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
    { id: 'technical', label: 'Technical / Management Response', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'risk-mitigation', label: 'Risk Mitigation', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { id: 'evaluation', label: 'Evaluation Response', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'final-notes', label: 'Final Submission Notes', icon: 'M5 13l4 4L19 7' },
];

type SectionStatus = 'not-started' | 'in-progress' | 'needs-review' | 'ready';

const STATUS_CONFIG: Record<SectionStatus, { label: string; color: string; bg: string; border: string }> = {
    'not-started': { label: 'Not Started', color: 'text-neutral-400', bg: 'bg-neutral-100', border: 'border-neutral-200' },
    'in-progress': { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    'needs-review': { label: 'Needs Review', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    'ready': { label: 'Ready', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

export const DraftStudioTab: React.FC<DraftStudioTabProps> = ({ data, uploadedDocs = {}, voxtralData = null }) => {
    const requirements = data.mandatory_requirements || [];
    const risks = data.risks_flagged || [];
    const documents = data.required_documents || [];
    const criteria = data.evaluation_criteria || [];
    const complianceMatrix = data.compliance_matrix || [];
    const uploadedList = Object.values(uploadedDocs);

    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    const [sectionStatuses, setSectionStatuses] = useState<Record<string, SectionStatus>>(() => {
        const init: Record<string, SectionStatus> = {};
        SECTIONS.forEach(s => { init[s.id] = 'not-started'; });
        return init;
    });
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastSaved, setLastSaved] = useState<string>('');
    const [localVoxtralData, setLocalVoxtralData] = useState<VoxtralData | null>(voxtralData);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [audioFileName, setAudioFileName] = useState<string>('');

    const currentDraft = drafts[activeSection] || '';
    const activeSectionObj = SECTIONS.find(s => s.id === activeSection)!;

    // Autosave timer
    useEffect(() => {
        const d = new Date();
        setLastSaved(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
    }, [drafts]);

    // Update status when draft changes
    useEffect(() => {
        const text = drafts[activeSection] || '';
        setSectionStatuses(prev => {
            const current = prev[activeSection];
            if (text.length === 0 && current !== 'not-started') return { ...prev, [activeSection]: 'not-started' };
            if (text.length > 0 && text.length < 200 && current === 'not-started') return { ...prev, [activeSection]: 'in-progress' };
            if (text.length >= 200 && current !== 'ready') return { ...prev, [activeSection]: 'needs-review' };
            return prev;
        });
    }, [drafts, activeSection]);

    const updateDraft = (text: string) => {
        setDrafts(prev => ({ ...prev, [activeSection]: text }));
    };

    const markReady = () => {
        setSectionStatuses(prev => ({ ...prev, [activeSection]: 'ready' }));
    };

    // Section-aware data linking
    const getSectionData = useMemo(() => {
        const map: Record<string, { linkedReqs: any[]; linkedDocs: any[]; linkedRisks: any[]; linkedCriteria: any[]; linkedCompliance: any[] }> = {};

        SECTIONS.forEach(sec => {
            let linkedReqs: any[] = [];
            let linkedDocs: any[] = [];
            let linkedRisks: any[] = [];
            let linkedCriteria: any[] = [];
            let linkedCompliance: any[] = [];

            switch (sec.id) {
                case 'executive-summary':
                    linkedReqs = requirements.slice(0, 3);
                    break;
                case 'cover-letter':
                    linkedReqs = requirements.filter((r: any) => {
                        const text = typeof r === 'string' ? r : r.requirement || '';
                        return /bid form|cover|submission form|bidder.*blank/i.test(text);
                    });
                    linkedDocs = documents.filter((d: any) => /form|cover|bid/i.test(typeof d === 'string' ? d : d.document_name || ''));
                    break;
                case 'forms':
                    linkedDocs = documents.filter((d: any) => /form/i.test(typeof d === 'string' ? d : d.document_name || d.document_type || ''));
                    break;
                case 'certifications':
                    linkedDocs = documents.filter((d: any) => /certif|insurance|registration|license/i.test(typeof d === 'string' ? d : d.document_name || d.document_type || ''));
                    linkedReqs = requirements.filter((r: any) => /certif|insurance|registration|license/i.test(typeof r === 'string' ? r : r.requirement || ''));
                    break;
                case 'pricing':
                    linkedDocs = documents.filter((d: any) => /pric|cost|fee|schedule.*rate|quotation/i.test(typeof d === 'string' ? d : d.document_name || d.document_type || ''));
                    linkedReqs = requirements.filter((r: any) => /pric|cost|fee|budget/i.test(typeof r === 'string' ? r : r.requirement || ''));
                    break;
                case 'financial':
                    linkedReqs = requirements.filter((r: any) => /financ|bond|assurance|guarantee|fiscal/i.test(typeof r === 'string' ? r : r.requirement || ''));
                    linkedDocs = documents.filter((d: any) => /financ|bond|bank|guarantee/i.test(typeof d === 'string' ? d : d.document_name || ''));
                    break;
                case 'legal':
                    linkedReqs = requirements.filter((r: any) => /legal|contract|exception|redline|terms|condition/i.test(typeof r === 'string' ? r : r.requirement || ''));
                    break;
                case 'document-compliance':
                    linkedDocs = documents;
                    linkedCompliance = complianceMatrix;
                    break;
                case 'technical':
                    linkedReqs = requirements.filter((r: any) => {
                        const text = typeof r === 'string' ? r : r.requirement || r.category || '';
                        return /technical|management|scope|methodology|approach|staff|capability/i.test(text);
                    });
                    if (linkedReqs.length === 0) linkedReqs = requirements.filter((r: any) => typeof r !== 'string' && !['Forms', 'Certifications', 'Pricing'].includes(r.category));
                    linkedCriteria = criteria;
                    break;
                case 'risk-mitigation':
                    linkedRisks = risks;
                    break;
                case 'evaluation':
                    linkedCriteria = criteria;
                    break;
                case 'final-notes':
                    linkedCompliance = complianceMatrix.filter((c: any) => c.status !== 'satisfied');
                    break;
            }

            map[sec.id] = { linkedReqs, linkedDocs, linkedRisks, linkedCriteria, linkedCompliance };
        });

        return map;
    }, [requirements, risks, documents, criteria, complianceMatrix]);

    const sectionData = getSectionData[activeSection] || { linkedReqs: [], linkedDocs: [], linkedRisks: [], linkedCriteria: [], linkedCompliance: [] };
    const linkedCount = sectionData.linkedReqs.length + sectionData.linkedDocs.length + sectionData.linkedRisks.length + sectionData.linkedCriteria.length;

    // Readiness strip
    const sourceLinked = linkedCount > 0;
    const supportingDocsCount = uploadedList.length;
    const evalRelevance = sectionData.linkedCriteria.length > 0 ? 'High' : (linkedCount > 2 ? 'Medium' : 'Not identified');
    const riskWarnings = sectionData.linkedRisks.length;
    const missingInfoCount = sectionData.linkedDocs.filter((d: any) => typeof d !== 'string' && d.mandatory && !d.present).length
        + sectionData.linkedCompliance.filter((c: any) => c.status === 'missing_info' || c.status === 'action_needed').length;

    // Context-aware quick actions
    const quickActions = useMemo(() => {
        const actions: { label: string; prompt: string }[] = [];
        if (sectionData.linkedReqs.length > 0) {
            const req = sectionData.linkedReqs[0];
            const reqText = typeof req === 'string' ? req : req.requirement;
            actions.push({ label: 'Draft response for linked requirement', prompt: `Write a professional compliance response for this tender requirement: "${reqText}". Use formal bid language.` });
        }
        if (sectionData.linkedRisks.length > 0) {
            const risk = sectionData.linkedRisks[0];
            actions.push({ label: 'Draft mitigation for detected risk', prompt: `Write a risk mitigation clause addressing: "${risk.risk_title || risk.description}". Use reassuring, evidence-based language.` });
        }
        if (sectionData.linkedCriteria.length > 0) {
            const crit = sectionData.linkedCriteria[0];
            const critText = typeof crit === 'string' ? crit : crit.criterion;
            actions.push({ label: 'Align response to evaluation criteria', prompt: `Write a response structured to score highly on this evaluation criterion: "${critText}". Focus on evidence and compliance.` });
        }
        if (sectionData.linkedDocs.length > 0) {
            const doc = sectionData.linkedDocs[0];
            const docName = typeof doc === 'string' ? doc : doc.document_name;
            actions.push({ label: `Write compliance statement for ${docName}`, prompt: `Write a compliance statement confirming the availability and submission of "${docName}" as required by the tender.` });
        }
        if (uploadedList.length > 0) {
            actions.push({ label: `Reference "${uploadedList[0].originalName}" as evidence`, prompt: `Write a paragraph referencing the submitted document "${uploadedList[0].originalName}" as supporting evidence for compliance with the tender requirements in this section.` });
        }
        return actions;
    }, [activeSection, sectionData, uploadedList]);

    // Sub-requirement checklist
    const subRequirements = useMemo(() => {
        return sectionData.linkedReqs.map((r: any) => {
            const text = typeof r === 'string' ? r : r.requirement || '';
            const words = text.toLowerCase().split(/\s+/).slice(0, 4);
            const addressed = words.some((w: string) => currentDraft.toLowerCase().includes(w)) && currentDraft.length > 50;
            return { text, addressed, mandatory: typeof r !== 'string' ? (r.mandatory !== false) : true };
        });
    }, [sectionData.linkedReqs, currentDraft, activeSection]);

    // Generate draft via real Mistral API
    const generateDraft = async (prompt?: string) => {
        const actualPrompt = prompt || aiPrompt;
        if (!actualPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const contextParts = [
                `You are a professional bid writer. Write ONLY the requested section. Do NOT output JSON. Do NOT wrap in code fences. Write in professional prose.`,
                `\nSection: ${activeSectionObj.label}`,
                data.tender_metadata?.title ? `\nTender: ${data.tender_metadata.title}` : '',
                sectionData.linkedReqs.length > 0 ? `\nLinked Requirements:\n${sectionData.linkedReqs.slice(0, 5).map((r: any) => '- ' + (typeof r === 'string' ? r : r.requirement)).join('\n')}` : '',
                sectionData.linkedRisks.length > 0 ? `\nRisks to address:\n${sectionData.linkedRisks.slice(0, 3).map((r: any) => '- ' + (typeof r === 'string' ? r : r.risk_title || r.description)).join('\n')}` : '',
                sectionData.linkedCriteria.length > 0 ? `\nEvaluation criteria:\n${sectionData.linkedCriteria.slice(0, 3).map((c: any) => '- ' + (typeof c === 'string' ? c : c.criterion)).join('\n')}` : '',
                uploadedList.length > 0 ? `\nAvailable documents: ${uploadedList.map(d => d.originalName).join(', ')}` : '',
                voxtralData?.decisions?.length ? `\nClarification decisions: ${voxtralData.decisions.join('; ')}` : '',
                `\n\nUser Request: ${actualPrompt}\n\nWrite the draft now:`,
            ];

            const response = await fetch('http://127.0.0.1:5000/api/tender/analyze/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: contextParts.join('') }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let draftText = '';
            let buffer = '';
            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('data: ')) {
                            const jsonStr = trimmed.slice(6);
                            if (jsonStr === '[DONE]') continue;
                            try {
                                const parsed = JSON.parse(jsonStr);
                                if (parsed.content) draftText += parsed.content;
                            } catch { /* skip */ }
                        }
                    }
                }
            }
            draftText = draftText.replace(/```json[\s\S]*?```/g, '').replace(/```[\s\S]*?```/g, '').trim();
            if (draftText) {
                updateDraft(currentDraft + (currentDraft ? '\n\n' : '') + draftText);
            }
        } catch (error) {
            console.error('Draft generation failed:', error);
        } finally {
            setIsGenerating(false);
            setAiPrompt('');
        }
    };

    // Completion stats
    const readySections = SECTIONS.filter(s => sectionStatuses[s.id] === 'ready').length;
    const completionPct = Math.round((readySections / SECTIONS.length) * 100);

    // Voxtral section relevance
    const sectionVoxtralNotes = useMemo(() => {
        if (!voxtralData) return null;
        const sectionLabel = activeSectionObj.label.toLowerCase();
        const relevantDecisions = voxtralData.decisions.filter(d => d.toLowerCase().includes(sectionLabel) || sectionLabel.split(/\s+/).some(w => d.toLowerCase().includes(w)));
        const relevantActions = voxtralData.actionItems.filter(a => a.toLowerCase().includes(sectionLabel) || sectionLabel.split(/\s+/).some(w => a.toLowerCase().includes(w)));
        const relevantChanges = voxtralData.changedAssumptions.filter(c => c.toLowerCase().includes(sectionLabel) || sectionLabel.split(/\s+/).some(w => c.toLowerCase().includes(w)));
        const relevantQuestions = voxtralData.unresolvedQuestions.filter(q => q.toLowerCase().includes(sectionLabel) || sectionLabel.split(/\s+/).some(w => q.toLowerCase().includes(w)));
        if (relevantDecisions.length + relevantActions.length + relevantChanges.length + relevantQuestions.length === 0) return null;
        return { decisions: relevantDecisions, actions: relevantActions, changes: relevantChanges, questions: relevantQuestions };
    }, [voxtralData, activeSection]);

    // Compliance warnings for section
    const complianceWarnings = useMemo(() => {
        const warnings: string[] = [];
        if (missingInfoCount > 0) warnings.push(`${missingInfoCount} missing item${missingInfoCount > 1 ? 's' : ''} need resolution before this section can be finalized`);
        const unaddressed = subRequirements.filter(sr => !sr.addressed && sr.mandatory);
        if (unaddressed.length > 0) warnings.push(`${unaddressed.length} mandatory requirement${unaddressed.length > 1 ? 's' : ''} not yet addressed in draft`);
        if (riskWarnings > 0 && currentDraft.length < 100) warnings.push(`${riskWarnings} risk warning${riskWarnings > 1 ? 's' : ''} linked to this section — draft should address them`);
        if (currentDraft.length > 200) {
            const unsupportedClaims = /guarantee|100%|always|never|absolutely/gi;
            const matches = currentDraft.match(unsupportedClaims);
            if (matches && matches.length > 0) warnings.push(`Draft contains potentially unsupported claims (${matches.slice(0, 3).join(', ')})`);
        }
        return warnings;
    }, [missingInfoCount, subRequirements, riskWarnings, currentDraft]);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="h-full flex overflow-hidden border border-[#d4d0c5] rounded-xl bg-white shadow-sm">

            {/* =================== LEFT PANEL =================== */}
            <div className="w-64 bg-[#fbf9f6] border-r border-[#d4d0c5] flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-[#d4d0c5]">
                    <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#2a2f36]">Response Outline</h3>
                    <p className="text-[10px] text-neutral-400 mt-1">{readySections}/{SECTIONS.length} sections ready</p>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                    {SECTIONS.map(sec => {
                        const status = sectionStatuses[sec.id];
                        const isActive = activeSection === sec.id;
                        const hasDraft = (drafts[sec.id] || '').length > 0;

                        return (
                            <button
                                key={sec.id}
                                onClick={() => setActiveSection(sec.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-all flex items-center gap-2 group ${isActive ? 'bg-[#2a2f36] text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-200/50'
                                    }`}
                            >
                                <svg className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white/70' : 'text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sec.icon} />
                                </svg>
                                <span className="flex-1 truncate">{sec.label}</span>
                                {!isActive && (
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 'ready' ? 'bg-emerald-500' :
                                        status === 'needs-review' ? 'bg-amber-500' :
                                            status === 'in-progress' ? 'bg-blue-500' :
                                                hasDraft ? 'bg-blue-300' : 'bg-neutral-300'
                                        }`} />
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-[#d4d0c5] bg-white">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Overall Completion</p>
                    <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${completionPct}%` }}></div>
                    </div>
                    <p className="text-[12px] font-bold text-[#2a2f36] mt-1.5 text-right">{completionPct}%</p>
                </div>
            </div>

            {/* =================== CENTER PANEL =================== */}
            <div className="flex-1 flex flex-col bg-white min-w-0">

                {/* A. Section Header */}
                <div className="px-6 py-4 border-b border-[#d4d0c5] flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <h2 className="text-lg font-bold text-[#2a2f36] truncate">{activeSectionObj.label}</h2>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${STATUS_CONFIG[sectionStatuses[activeSection]].color} ${STATUS_CONFIG[sectionStatuses[activeSection]].bg} ${STATUS_CONFIG[sectionStatuses[activeSection]].border}`}>
                            {STATUS_CONFIG[sectionStatuses[activeSection]].label}
                        </span>
                        {linkedCount > 0 && (
                            <span className="text-[11px] text-neutral-400 font-medium">· {linkedCount} linked source{linkedCount !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                    <div className="flex gap-1.5">
                        <button onClick={() => {
                            const blob = new Blob([currentDraft], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${activeSectionObj.label.replace(/\s+/g, '_')}_draft.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }} className="p-1.5 hover:bg-neutral-100 rounded text-[#2a2f36] cursor-pointer" title="Save as file">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(currentDraft); }} className="p-1.5 hover:bg-neutral-100 rounded text-[#2a2f36] cursor-pointer" title="Copy">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                </div>

                {/* B. Requirement Source Block */}
                {sectionData.linkedReqs.length > 0 ? (
                    <div className="px-6 py-3 bg-[#fbf9f6] border-b border-[#d4d0c5] max-h-[140px] overflow-y-auto custom-scrollbar">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Linked Tender Requirements</p>
                        <div className="space-y-1.5">
                            {sectionData.linkedReqs.slice(0, 4).map((r: any, i: number) => {
                                const text = typeof r === 'string' ? r : r.requirement;
                                const page = typeof r !== 'string' ? r.page_number : null;
                                const isMandatory = typeof r !== 'string' ? r.mandatory !== false : true;
                                return (
                                    <div key={i} className="flex items-start gap-2 text-[12px]">
                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${isMandatory ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                            {isMandatory ? 'Mandatory' : 'Evaluative'}
                                        </span>
                                        <p className="text-neutral-700 leading-snug line-clamp-2">{text}</p>
                                        {page && <span className="text-[10px] text-neutral-400 flex-shrink-0">p.{page}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-3 bg-[#fbf9f6] border-b border-[#d4d0c5]">
                        <p className="text-[11px] text-neutral-400 italic">No linked tender clause detected — Manual drafting mode</p>
                    </div>
                )}

                {/* C. Draft Readiness Strip */}
                <div className="px-6 py-2 border-b border-[#d4d0c5] flex items-center gap-4 text-[11px] font-medium flex-wrap">
                    <span className={`flex items-center gap-1 ${sourceLinked ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sourceLinked ? 'bg-emerald-500' : 'bg-neutral-300'}`}></span>
                        Source: {sourceLinked ? 'Linked' : 'None'}
                    </span>
                    <span className="text-neutral-400">Docs: {supportingDocsCount > 0 ? `${supportingDocsCount} available` : 'Missing'}</span>
                    <span className={`${evalRelevance === 'High' ? 'text-indigo-600' : evalRelevance === 'Medium' ? 'text-amber-600' : 'text-neutral-400'}`}>
                        Eval: {evalRelevance}
                    </span>
                    {riskWarnings > 0 && <span className="text-red-500">{riskWarnings} risk{riskWarnings > 1 ? 's' : ''}</span>}
                    {missingInfoCount > 0 && <span className="text-amber-600">{missingInfoCount} missing</span>}
                </div>

                {/* D. Main Editor */}
                <div className="flex-1 p-6 min-h-0">
                    <textarea
                        className="w-full h-full resize-none outline-none text-[14px] leading-relaxed text-neutral-800 placeholder:text-neutral-300 custom-scrollbar"
                        placeholder={currentDraft ? '' : 'No verified draft available yet. Use the quick actions or generate a draft from the linked requirements.'}
                        value={currentDraft}
                        onChange={(e) => updateDraft(e.target.value)}
                    />
                </div>

                {/* E. Sub-Requirement Checklist */}
                {subRequirements.length > 0 && (
                    <div className="px-6 py-3 border-t border-[#d4d0c5] bg-[#fbf9f6] max-h-[100px] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-4 flex-wrap">
                            {subRequirements.slice(0, 5).map((sr, i) => (
                                <span key={i} className={`text-[11px] font-medium flex items-center gap-1 ${sr.addressed ? 'text-emerald-600' : 'text-neutral-400'}`}>
                                    <span className={`w-3 h-3 rounded border flex items-center justify-center flex-shrink-0 ${sr.addressed ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-300'}`}>
                                        {sr.addressed && <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </span>
                                    <span className="truncate max-w-[150px]">{sr.text.slice(0, 40)}{sr.text.length > 40 ? '...' : ''}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* F. Action Toolbar */}
                <div className="px-6 py-3 border-t border-[#d4d0c5] bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button disabled={isGenerating || linkedCount === 0}
                            onClick={() => generateDraft(`Write a comprehensive ${activeSectionObj.label} section for this tender response.`)}
                            className="text-[11px] font-bold px-3 py-1.5 rounded-md bg-[#2a2f36] text-white hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                            {isGenerating ? 'Generating...' : 'Generate Draft'}
                        </button>
                        <button disabled={!currentDraft || isGenerating}
                            onClick={() => generateDraft(`Rewrite the following text in a more formal, professional bid writing tone:\n\n${currentDraft}`)}
                            className="text-[11px] font-medium px-3 py-1.5 rounded-md border border-[#d4d0c5] text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                            More Formal
                        </button>
                        <button disabled={!currentDraft || isGenerating}
                            onClick={() => generateDraft(`Shorten the following text while keeping all key compliance points:\n\n${currentDraft}`)}
                            className="text-[11px] font-medium px-3 py-1.5 rounded-md border border-[#d4d0c5] text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                            Shorten
                        </button>
                        <button disabled={!currentDraft || isGenerating}
                            onClick={() => generateDraft(`Improve the compliance tone of this text, making it more aligned with tender evaluation language:\n\n${currentDraft}`)}
                            className="text-[11px] font-medium px-3 py-1.5 rounded-md border border-[#d4d0c5] text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                            Compliance Tone
                        </button>
                        <button disabled={!currentDraft} onClick={markReady}
                            className="text-[11px] font-bold px-3 py-1.5 rounded-md border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                            ✓ Mark Ready
                        </button>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-3 flex-shrink-0">
                        <span>{currentDraft.split(/\s+/).filter(w => w.length > 0).length} words</span>
                        {lastSaved && <span>Saved {lastSaved}</span>}
                    </div>
                </div>
            </div>

            {/* =================== RIGHT PANEL =================== */}
            <div className="w-[340px] bg-[#fbf9f6] border-l border-[#d4d0c5] flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-[#d4d0c5] bg-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="text-[13px] font-bold text-[#2a2f36]">Context & Support</h3>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">

                    {/* 1. Active Context */}
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Context</h4>
                        {sectionData.linkedRisks.length > 0 && (
                            <div className="bg-white border border-[#d4d0c5] rounded-lg p-2.5 shadow-sm">
                                <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-1.5 py-0.5 rounded border border-red-100 block w-max mb-1">Risk Warning</span>
                                <p className="text-[11px] text-[#2a2f36] leading-snug line-clamp-2">{typeof sectionData.linkedRisks[0] === 'string' ? sectionData.linkedRisks[0] : sectionData.linkedRisks[0].risk_title || sectionData.linkedRisks[0].description}</p>
                            </div>
                        )}
                        {sectionData.linkedReqs.length > 0 && (
                            <div className="bg-white border border-[#d4d0c5] rounded-lg p-2.5 shadow-sm">
                                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 block w-max mb-1">Key Requirement</span>
                                <p className="text-[11px] text-[#2a2f36] leading-snug line-clamp-2">{typeof sectionData.linkedReqs[0] === 'string' ? sectionData.linkedReqs[0] : sectionData.linkedReqs[0].requirement}</p>
                            </div>
                        )}
                        {sectionData.linkedDocs.length > 0 && (
                            <div className="bg-white border border-[#d4d0c5] rounded-lg p-2.5 shadow-sm">
                                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 block w-max mb-1">Required Document</span>
                                <p className="text-[11px] text-[#2a2f36] leading-snug line-clamp-2">{typeof sectionData.linkedDocs[0] === 'string' ? sectionData.linkedDocs[0] : sectionData.linkedDocs[0].document_name}</p>
                            </div>
                        )}
                        {linkedCount === 0 && (
                            <p className="text-[11px] text-neutral-400 italic">No specific context linked to this section</p>
                        )}
                    </div>

                    {/* 2. Source Evidence */}
                    {(sectionData.linkedReqs.length > 1 || sectionData.linkedDocs.length > 0) && (
                        <div className="space-y-2 pt-3 border-t border-[#d4d0c5]/50">
                            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Source Evidence</h4>
                            {sectionData.linkedReqs.slice(0, 3).map((r: any, i: number) => (
                                <div key={`req-${i}`} className="bg-white border border-[#d4d0c5] rounded-lg p-2 text-[11px] text-neutral-700 leading-snug">
                                    <span className="text-[9px] text-neutral-400 block mb-0.5">{typeof r !== 'string' && r.source_clause ? `Source: ${r.source_clause}` : 'Tender clause'}{typeof r !== 'string' && r.page_number ? ` · p.${r.page_number}` : ''}</span>
                                    <p className="line-clamp-2">{typeof r === 'string' ? r : r.requirement}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 3. Quick Actions */}
                    {quickActions.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-[#d4d0c5]/50">
                            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Quick Actions</h4>
                            {quickActions.slice(0, 4).map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => generateDraft(action.prompt)}
                                    disabled={isGenerating}
                                    className="w-full text-left bg-white border border-[#d4d0c5] rounded-lg p-2 text-[11px] text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer leading-snug disabled:opacity-50"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 4. Knowledge Vault */}
                    <div className="space-y-2 pt-3 border-t border-[#d4d0c5]/50">
                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Knowledge Vault</h4>
                        {uploadedList.length > 0 ? (
                            <div className="space-y-1.5">
                                {uploadedList.slice(0, 4).map((doc, i) => (
                                    <div key={i} className="bg-white border border-emerald-200 rounded-lg p-2 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        <span className="text-[11px] text-[#2a2f36] truncate flex-1">{doc.originalName}</span>
                                        <button onClick={() => generateDraft(`Reference the submitted document "${doc.originalName}" as supporting evidence for this section.`)}
                                            className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex-shrink-0">
                                            Insert
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[11px] text-neutral-400 italic">No approved content available. Upload company documents in the Documents tab.</p>
                        )}
                    </div>

                    {/* 5. Voxtral / Clarification */}
                    <div className="space-y-2 pt-3 border-t border-[#d4d0c5]/50">
                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            Clarification Capture
                        </h4>

                        {/* Audio Upload */}
                        {!localVoxtralData && !isTranscribing && (
                            <button
                                onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'audio/*,.mp3,.wav,.m4a,.ogg,.flac,.webm';
                                    input.onchange = async () => {
                                        const file = input.files?.[0];
                                        if (!file) return;
                                        setAudioFileName(file.name);
                                        setIsTranscribing(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append('audio', file);
                                            const res = await fetch('http://127.0.0.1:5000/api/voxtral/transcribe', {
                                                method: 'POST',
                                                body: formData,
                                            });
                                            const json = await res.json();
                                            if (json.success && json.data) {
                                                setLocalVoxtralData(json.data);
                                            } else {
                                                alert('Transcription failed: ' + (json.error || 'Unknown error'));
                                            }
                                        } catch (err) {
                                            console.error('Voxtral transcription failed:', err);
                                            alert('Failed to transcribe audio. Make sure the backend is running.');
                                        } finally {
                                            setIsTranscribing(false);
                                        }
                                    };
                                    input.click();
                                }}
                                className="w-full bg-white border border-dashed border-[#d4d0c5] rounded-lg p-3 text-center hover:border-indigo-300 hover:bg-indigo-50/20 transition-colors cursor-pointer group"
                            >
                                <svg className="w-5 h-5 mx-auto text-neutral-300 group-hover:text-indigo-400 transition-colors mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                <p className="text-[11px] font-medium text-neutral-500">Upload Meeting / Clarification Audio</p>
                                <p className="text-[10px] text-neutral-400 mt-0.5">MP3, WAV, M4A, FLAC, WebM</p>
                            </button>
                        )}

                        {/* Transcribing state */}
                        {isTranscribing && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
                                <svg className="w-5 h-5 mx-auto text-indigo-500 animate-spin mb-1.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="text-[11px] font-bold text-indigo-700">Transcribing with Voxtral...</p>
                                <p className="text-[10px] text-indigo-500 mt-0.5 truncate">{audioFileName}</p>
                            </div>
                        )}

                        {/* Transcription results */}
                        {localVoxtralData && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Audio Processed{audioFileName ? `: ${audioFileName}` : ''}
                                    </span>
                                    <button onClick={() => { setLocalVoxtralData(null); setAudioFileName(''); }} className="text-[9px] text-neutral-400 hover:text-red-500 cursor-pointer">Clear</button>
                                </div>

                                {localVoxtralData.decisions.length > 0 && localVoxtralData.decisions.map((d, i) => (
                                    <div key={`vd-${i}`} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[11px] text-emerald-900">
                                        <span className="text-[9px] font-bold text-emerald-600 block mb-0.5">Decision</span>{d}
                                    </div>
                                ))}
                                {localVoxtralData.actionItems.length > 0 && localVoxtralData.actionItems.map((a, i) => (
                                    <div key={`va-${i}`} className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-[11px] text-blue-900">
                                        <span className="text-[9px] font-bold text-blue-600 block mb-0.5">Action Item</span>{a}
                                    </div>
                                ))}
                                {localVoxtralData.changedAssumptions.length > 0 && localVoxtralData.changedAssumptions.map((c, i) => (
                                    <div key={`vc-${i}`} className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-900">
                                        <span className="text-[9px] font-bold text-amber-600 block mb-0.5">Changed Assumption</span>{c}
                                    </div>
                                ))}
                                {localVoxtralData.unresolvedQuestions.length > 0 && localVoxtralData.unresolvedQuestions.map((q, i) => (
                                    <div key={`vq-${i}`} className="bg-red-50 border border-red-200 rounded-lg p-2 text-[11px] text-red-900">
                                        <span className="text-[9px] font-bold text-red-600 block mb-0.5">Unresolved Question</span>{q}
                                    </div>
                                ))}

                                {localVoxtralData.text && (
                                    <details className="mt-1">
                                        <summary className="text-[10px] text-neutral-400 cursor-pointer hover:text-neutral-600">View Full Transcript</summary>
                                        <div className="mt-1.5 bg-white border border-[#d4d0c5] rounded-lg p-2 text-[10px] text-neutral-600 leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                                            {localVoxtralData.text}
                                        </div>
                                    </details>
                                )}

                                {localVoxtralData.decisions.length === 0 && localVoxtralData.actionItems.length === 0 && localVoxtralData.changedAssumptions.length === 0 && localVoxtralData.unresolvedQuestions.length === 0 && (
                                    <p className="text-[11px] text-neutral-400 italic">No specific decisions, actions, or questions extracted from this recording.</p>
                                )}
                            </div>
                        )}

                        {!localVoxtralData && !isTranscribing && sectionVoxtralNotes && (
                            <div className="space-y-1.5">
                                {sectionVoxtralNotes.decisions.map((d, i) => (
                                    <div key={`vd-${i}`} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[11px] text-emerald-900">
                                        <span className="text-[9px] font-bold text-emerald-600 block mb-0.5">Decision</span>{d}
                                    </div>
                                ))}
                                {sectionVoxtralNotes.changes.map((c, i) => (
                                    <div key={`vc-${i}`} className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-900">
                                        <span className="text-[9px] font-bold text-amber-600 block mb-0.5">Changed Assumption</span>{c}
                                    </div>
                                ))}
                                {sectionVoxtralNotes.questions.map((q, i) => (
                                    <div key={`vq-${i}`} className="bg-red-50 border border-red-200 rounded-lg p-2 text-[11px] text-red-900">
                                        <span className="text-[9px] font-bold text-red-600 block mb-0.5">Unresolved Question</span>{q}
                                    </div>
                                ))}
                                {sectionVoxtralNotes.actions.map((a, i) => (
                                    <div key={`va-${i}`} className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-[11px] text-blue-900">
                                        <span className="text-[9px] font-bold text-blue-600 block mb-0.5">Action Item</span>{a}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 6. Compliance Warnings */}
                    {complianceWarnings.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-[#d4d0c5]/50">
                            <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Compliance Warnings</h4>
                            {complianceWarnings.map((w, i) => (
                                <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-2 text-[11px] text-red-800 flex items-start gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <span>{w}</span>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                {/* Bottom prompt input */}
                <div className="p-3 bg-white border-t border-[#d4d0c5]">
                    <div className="relative">
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generateDraft())}
                            placeholder={`Write a custom request for ${activeSectionObj.label}...`}
                            className="w-full bg-[#fbf9f6] border border-[#d4d0c5] rounded-lg px-3 py-2 text-[12px] text-[#2a2f36] outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none h-16 custom-scrollbar pr-10"
                        />
                        <button
                            onClick={() => generateDraft()}
                            disabled={isGenerating || !aiPrompt.trim()}
                            className="absolute bottom-2 right-2 bg-[#2a2f36] text-white p-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors cursor-pointer"
                        >
                            {isGenerating ? (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};
