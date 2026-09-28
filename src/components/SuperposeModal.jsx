import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { getAngleArcPath, getEdgeTicks, getEdgeLabelPos, getVertexLabelPos, getCentroid, transformPoints } from '../utils/geometry';

export default function SuperposeModal({ isOpen, onClose, question }) {
  const [progress, setProgress] = useState(0); // 0 (separated) to 1 (fully superposed)
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let animId;
    if (isPlaying) {
      const step = () => {
        setProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 1;
          }
          return Math.min(1, prev + 0.02);
        });
        if (isPlaying) {
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  if (!isOpen || !question) return null;

  // Base coordinates for △ABC
  const ptsA = [
    { x: 120, y: 50 },
    { x: 50, y: 190 },
    { x: 230, y: 190 },
  ];

  // Starting coordinates for △DEF: placed to the right, rotated
  const baseDefPts = [
    { x: 380, y: 50 },
    { x: 310, y: 190 },
    { x: 490, y: 190 },
  ];

  // Apply rotation to DEF
  const rot = question.triangleB.rotation || 0;
  const initialDefPts = transformPoints(baseDefPts, rot, false, false, { x: 400, y: 140 });

  // For superposed target: if congruent, align DEF onto ABC points!
  // If not congruent (e.g. SSA trap), make it slightly distorted to show discrepancy
  let targetPts = [...ptsA];
  if (!question.congruent) {
    if (question.knownAngles === 3) {
      // AAA: scaled up
      targetPts = [
        { x: 120, y: 20 },
        { x: 30, y: 210 },
        { x: 250, y: 210 },
      ];
    } else {
      // SSA: different third vertex
      targetPts = [
        { x: 155, y: 70 }, // mismatched vertex!
        { x: 50, y: 190 },
        { x: 230, y: 190 },
      ];
    }
  }

  // Current interpolated points for DEF
  const currentDefPts = initialDefPts.map((p, idx) => ({
    x: p.x + (targetPts[idx].x - p.x) * progress,
    y: p.y + (targetPts[idx].y - p.y) * progress,
  }));

  const pathA = `M ${ptsA[0].x} ${ptsA[0].y} L ${ptsA[1].x} ${ptsA[1].y} L ${ptsA[2].x} ${ptsA[2].y} Z`;
  const pathDef = `M ${currentDefPts[0].x} ${currentDefPts[0].y} L ${currentDefPts[1].x} ${currentDefPts[1].y} L ${currentDefPts[2].x} ${currentDefPts[2].y} Z`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">포개어보기 시뮬레이션</h3>
              <p className="text-xs text-slate-500">두 삼각형을 직접 이동·회전시켜 완전히 겹치는지 확인합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas area */}
        <div className="p-6 flex flex-col items-center bg-slate-50/30">
          <div className="w-full max-w-lg aspect-[540/250] bg-white rounded-2xl border border-slate-200 shadow-inner relative overflow-hidden">
            <svg viewBox="0 0 540 250" className="w-full h-full select-none">
              {/* Background grid */}
              <defs>
                <pattern id="modal-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f8fafc" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="540" height="250" fill="url(#modal-grid)" />

              {/* Triangle ABC (Blue, stationary on left) */}
              <path
                d={pathA}
                className="fill-indigo-500/20 stroke-indigo-600"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Triangle DEF (Emerald, moving) */}
              <path
                d={pathDef}
                className="fill-emerald-500/25 stroke-emerald-600"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeDasharray={progress > 0.95 && !question.congruent ? "6 4" : "none"}
              />

              {/* Labels for ABC */}
              {ptsA.map((p, idx) => (
                <g key={`lbl-a-${idx}`}>
                  <circle cx={p.x} cy={p.y} r="4" className="fill-indigo-600 stroke-white stroke-2" />
                  <text
                    x={p.x + (idx === 0 ? 0 : idx === 1 ? -16 : 16)}
                    y={p.y + (idx === 0 ? -12 : 18)}
                    className="text-[13px] font-bold fill-indigo-900"
                    textAnchor="middle"
                  >
                    {question.triangleA.vertices[idx].label}
                  </text>
                </g>
              ))}

              {/* Labels for DEF */}
              {currentDefPts.map((p, idx) => (
                <g key={`lbl-def-${idx}`}>
                  <circle cx={p.x} cy={p.y} r="4" className="fill-emerald-600 stroke-white stroke-2" />
                  <text
                    x={p.x + (idx === 0 ? 0 : idx === 1 ? -16 : 16)}
                    y={p.y + (idx === 0 ? -12 : 18)}
                    className="text-[13px] font-bold fill-emerald-800"
                    textAnchor="middle"
                  >
                    {question.triangleB.vertices[idx].label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Interactive controls */}
          <div className="w-full max-w-lg mt-5 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (progress >= 1) setProgress(0);
                  setIsPlaying(!isPlaying);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                {isPlaying ? '일시정지' : progress >= 1 ? <><RotateCcw className="w-4 h-4" /> 다시 포개기</> : <><Play className="w-4 h-4" /> 포개어보기</>}
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">분리</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={progress}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setProgress(parseFloat(e.target.value));
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs text-slate-400 font-medium">완전 포갬</span>
              </div>
            </div>

            {/* Congruence verdict banner at progress = 1 */}
            {progress >= 0.95 && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 animate-pop-in ${
                question.congruent
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}>
                {question.congruent ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {question.congruent
                      ? `완벽히 포개어집니다! (${question.correctAnswer} 합동 성립)`
                      : '포개어지지 않습니다! (합동이 아님)'}
                  </div>
                  <div className="text-xs mt-1 text-slate-600">
                    {question.explanation}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
