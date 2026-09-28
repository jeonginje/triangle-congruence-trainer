import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Send,
  CheckCircle2,
  RotateCcw,
  X,
  Target,
  ShieldCheck,
  Compass,
  Check,
  ExternalLink
} from 'lucide-react';
import { sendScoreToClassPlatform } from '../utils/scorePlatform';
import confetti from 'canvas-confetti';

export default function ScoreReportModal({
  isOpen,
  onClose,
  evaluation,
  onRestart,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  if (!isOpen || !evaluation) return null;

  const { totalScore, grade, title, badgeColor, breakdown, stats, details } = evaluation;

  const handleSubmitScore = () => {
    const res = sendScoreToClassPlatform(totalScore, details);
    setSubmitted(true);
    setSubmitResult(res);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                삼각형의 합동 훈련 종합 평가표
              </h3>
              <p className="text-xs text-slate-400">행동 분석 기반 100점 만점 차등 배점 리포트</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
          {/* Main Score Hero Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 flex flex-col items-center text-center relative overflow-hidden">
            <span className={`px-3 py-1 text-xs font-black rounded-full border mb-2 ${badgeColor}`}>
              {grade} 등급 • {title}
            </span>

            <div className="flex items-baseline gap-1 my-1">
              <span className="text-5xl font-black text-indigo-950 tracking-tight">
                {totalScore}
              </span>
              <span className="text-lg font-bold text-indigo-400">/ 100점</span>
            </div>

            <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
              정답 여부뿐만 아니라 <strong>함정 간파 능력, 오답 횟수, 서술형 대응점 정확도</strong>를 종합 채점했습니다.
            </p>
          </div>

          {/* Differentiated Rubric Breakdown */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600" /> 세부 행동별 배점 내역
            </h4>

            {Object.entries(breakdown).map(([key, item]) => {
              const percent = Math.min(100, Math.round((item.score / item.max) * 100));
              return (
                <div key={key} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-black text-slate-900">
                      <span className="text-indigo-600">{item.score}</span> / {item.max}점
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Stats Chips */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-medium block">1차 정답률</span>
              <span className="text-sm font-bold text-slate-800">{stats.firstTryAccuracy}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-medium block">오답 재시도</span>
              <span className="text-sm font-bold text-slate-800">{stats.wrongAttemptsTotal}회</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-medium block">포개어보기 활용</span>
              <span className="text-sm font-bold text-slate-800">{stats.superposeUsed}회</span>
            </div>
          </div>

          {/* Platform Transmission Status */}
          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-pop-in">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-emerald-900">
                  학급 플랫폼으로 점수가 성공적으로 전송되었습니다!
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5 font-mono line-clamp-1">
                  점수: {totalScore}점 ({details})
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-center justify-between">
              <span>바이브코딩 플랫폼과 연동되어 점수가 기록됩니다.</span>
              <span className="font-mono text-[10px] bg-blue-100 px-2 py-0.5 rounded font-bold">postMessage 연동</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            onClick={() => {
              onClose();
              onRestart && onRestart();
            }}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> 다시 풀기
          </button>

          <button
            onClick={handleSubmitScore}
            disabled={submitted}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all ${
              submitted
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            {submitted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 제출 완료됨
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> 학급 플랫폼에 점수 전송하기 ({totalScore}점)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
