import React, { useState } from 'react';
import { BookOpen, AlertCircle, CheckCircle, ArrowRight, ShieldAlert, Sparkles, GitBranch } from 'lucide-react';
import { CONCEPT_CARDS, FLOWCHART_STEPS } from '../data/conceptData';

export default function ConceptCards() {
  const [selectedCard, setSelectedCard] = useState('sss');

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* 3초 판별 순서도 (Decision Tree Flowchart) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              삼각형의 합동 3초 판별 순서도 (Decision Tree)
            </h2>
            <p className="text-xs text-slate-500">
              문제를 마주했을 때 머릿속으로 진행하는 최단 판별 알고리즘입니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FLOWCHART_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  STEP {step.step}
                </span>
                <h4 className="font-bold text-slate-800 text-sm mt-2 mb-3">
                  {step.title}
                </h4>
                <div className="flex flex-col gap-2">
                  {step.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-xs text-xs flex flex-col gap-1"
                    >
                      <div className="font-bold text-slate-800">
                        {opt.count || opt.case}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {opt.desc || opt.result}
                      </div>
                      {opt.next && (
                        <div className="text-indigo-600 font-bold text-[11px] mt-0.5">
                          {opt.next}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Cards Carousel / Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              중1 삼각형의 합동 조건 3대 원칙
            </h3>
            <p className="text-xs text-slate-500">
              카드를 클릭하여 상세 체크리스트와 교과서 함정을 확인하세요.
            </p>
          </div>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CONCEPT_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedCard === card.id
                  ? 'bg-white ring-2 ring-indigo-600 border-indigo-200 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${card.badgeColor}`}>
                  {card.code}
                </span>
                <div className="font-bold text-slate-800 text-sm mt-2">
                  {card.fullName}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 line-clamp-1">
                {card.summary}
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Card View */}
        {(() => {
          const card = CONCEPT_CARDS.find((c) => c.id === selectedCard) || CONCEPT_CARDS[0];
          return (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col gap-5 animate-pop-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${card.badgeColor}`}>
                      {card.code}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      {card.fullName}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mt-2">
                    {card.summary}
                  </h4>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                  {card.formula}
                </div>
              </div>

              {/* Key point */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 font-medium leading-relaxed">
                  <span className="font-bold text-sm block mb-0.5">탐정단의 핵심 원리:</span>
                  {card.keyPoint}
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  조사 체크리스트 (순서대로 확인)
                </h5>
                <div className="flex flex-col gap-2">
                  {card.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3 text-xs text-slate-700"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trap warning */}
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-950 leading-relaxed font-medium">
                  <span className="font-bold block mb-0.5">⚠️ 시험에 꼭 나오는 함정 방어:</span>
                  {card.trap}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Middle school tips card: Corresponding notation order */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-lg text-white">
            중1 서술형 감점 1위 방지: 대응점 순서 맞추기 규칙
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          두 삼각형이 합동임을 나타낼 때 사용하는 기호는 등호 위에 줄 하나를 더 그은 <span className="text-indigo-300 font-bold font-serif text-sm">≡</span> 기호입니다.
          이때 가장 중요한 점은 <span className="text-amber-300 font-bold underline">대응하는 꼭짓점의 순서를 반드시 일치</span>시켜야 한다는 점입니다!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold text-emerald-400 block mb-1">✅ 올바른 표기법</span>
            <div className="text-sm font-bold text-white">△ABC ≡ △DEF</div>
            <div className="text-xs text-slate-400 mt-1">
              (점 A ↔ 점 D, 점 B ↔ 점 E, 점 C ↔ 점 F 대응 순서 완벽 일치)
            </div>
          </div>
          <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
            <span className="text-xs font-bold text-rose-400 block mb-1">❌ 감점되는 표기법</span>
            <div className="text-sm font-bold text-white">△ABC ≡ △FED</div>
            <div className="text-xs text-slate-400 mt-1">
              (도형 자체는 합동이더라도 대응점 순서가 뒤바뀌면 서술형 채점에서 오답 처리됩니다!)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
