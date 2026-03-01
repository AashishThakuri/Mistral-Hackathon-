import React from 'react';
import { motion } from 'framer-motion';

interface EvaluationTabProps {
    data: any;
}

export const EvaluationTab: React.FC<EvaluationTabProps> = ({ data }) => {
    const rawCriteria = data.evaluation_criteria || [];

    const totalCriteria = rawCriteria.length;
    let weightedCount = 0;

    // Attempt basic parsing for numeric weights to find "highest weight"
    let highestWeightItem: any = null;
    let maxNum = -1;

    rawCriteria.forEach((item: any) => {
        if (typeof item !== 'string' && item.weight) {
            weightedCount++;
            const numStr = item.weight.toString().replace(/[^0-9.]/g, '');
            if (numStr) {
                const num = parseFloat(numStr);
                if (num > maxNum) {
                    maxNum = num;
                    highestWeightItem = item;
                }
            }
        }
    });

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full flex flex-col space-y-8 max-w-6xl">

            {/* Top Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2a2f36] p-6 rounded-xl border border-[#1a1d24] shadow-md flex justify-between items-center text-white">
                    <div>
                        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Total Evaluation Criteria</p>
                        <span className="text-4xl font-bold">{totalCriteria}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#3f4551] flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#d4d0c5]/70 shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Items Scored / Weighted</p>
                        <span className="text-4xl font-bold text-[#2a2f36]">{weightedCount} <span className="text-xl text-neutral-400 font-medium">/ {totalCriteria}</span></span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 pb-10">
                {/* Main Criteria Grid (2/3 width) */}
                <div className="col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-[#2a2f36]">Scoring Rubric</h2>

                    {rawCriteria.length > 0 ? (
                        <div className="space-y-4">
                            {rawCriteria.map((item: any, idx: number) => {
                                const isStr = typeof item === 'string';
                                const title = isStr ? item : (item.criterion || 'Unnamed Criterion');
                                const weight = isStr ? 'N/A' : (item.weight || 'Unspecified');

                                return (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-[#d4d0c5] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-4">
                                        <div className="absolute top-0 right-0 bg-[#2a2f36] text-white px-4 py-1 rounded-bl-xl font-bold text-[15px] shadow-sm">
                                            {weight}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-[#2a2f36] pr-20">{title}</h3>
                                            {!isStr && item.description && (
                                                <p className="text-[14px] text-neutral-600 mt-2 leading-relaxed max-w-2xl">{item.description}</p>
                                            )}
                                        </div>

                                        {!isStr && (item.source_clause || item.implication) && (
                                            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 flex flex-col gap-3">
                                                {item.implication && (
                                                    <div>
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 block mb-1">Strategic Implication</span>
                                                        <p className="text-[13px] text-neutral-700 font-medium">{item.implication}</p>
                                                    </div>
                                                )}
                                                {item.source_clause && (
                                                    <div className="flex bg-neutral-200/50 rounded px-2.5 py-1.5 w-max">
                                                        <p className="text-[12px] text-neutral-600 tracking-wide font-mono">Source: {item.source_clause}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white border text-center py-20 rounded-xl border-[#d4d0c5]">
                            <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            <p className="text-neutral-500 font-medium">No strict evaluation criteria extracted.</p>
                        </div>
                    )}
                </div>

                {/* Strategy Insight Right Side Panel */}
                <div className="col-span-1">
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm sticky top-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-indigo-900">Strategy Insights</h3>
                        </div>

                        <div className="space-y-6">
                            {highestWeightItem ? (
                                <div>
                                    <h4 className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Highest Weight Section</h4>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                                        <p className="text-[14px] font-bold text-[#2a2f36] mb-1">{highestWeightItem.criterion}</p>
                                        <p className="text-[12px] text-neutral-500">{highestWeightItem.weight}</p>
                                        {highestWeightItem.implication && (
                                            <p className="text-[12px] text-indigo-800 mt-2 font-medium bg-indigo-50 rounded p-1.5">{highestWeightItem.implication}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[13px] text-indigo-800 italic">No clear numeric weight dominance detected from text.</p>
                            )}

                            <div>
                                <h4 className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Overall Guidance</h4>
                                <ul className="space-y-3">
                                    <li className="flex gap-2 text-[13px] text-indigo-900 leading-snug">
                                        <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        Ensure all mandatory requirements are strictly met before optimizing for weighted criteria.
                                    </li>
                                    <li className="flex gap-2 text-[13px] text-indigo-900 leading-snug">
                                        <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        Focus strongest narrative around items carrying the highest points block.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};
