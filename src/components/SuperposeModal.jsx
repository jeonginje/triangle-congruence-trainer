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
  const ptsA = question.triangleA.customPoints || [
    { x: 120, y: 50 },
    { x: 50, y: 190 },
    { x: 230, y: 190 },
  ];
  const centroidA = getCentroid(ptsA[0], ptsA[1], ptsA[2]);

  // Base coordinates for △DEF on right side
  const offsetX = 260;
  const rawDefPts = question.triangleB.customPoints || ptsA;
  const baseDefPts = rawDefPts.map((p) => ({ x: p.x + offsetX, y: p.y }));
  const centroidDef = getCentroid(baseDefPts[0], baseDefPts[1], baseDefPts[2]);

  const rot = question.triangleB.rotation || 0;

  // Non-congruent target mismatch endpoints
  let mismatchTargets = ptsA;
  if (!question.congruent) {
    if (question.knownAngles === 3) {
      // AAA trap: scale down
      mismatchTargets = ptsA.map((p) => ({
        x: centroidA.x + (p.x - centroidA.x) * 0.78,
        y: centroidA.y + (p.y - centroidA.y) * 0.78,
      }));
    } else if (question.id.includes('insufficient')) {
      mismatchTargets = [
        ptsA[0],
        ptsA[1],
        { x: ptsA[2].x - 35, y: ptsA[2].y - 35 },
      ];
    } else {
      // SSA trap: different third vertex
      mismatchTargets = [
        { x: ptsA[0].x + 35, y: ptsA[0].y + 20 },
        ptsA[1],
        ptsA[2],
      ];
    }
  }

  // Rigid motion interpolation:
  // Center moves from centroidDef to centroidA
  // Rotation angle smoothly un-rotates from rot to 0
  const curCenterX = centroidDef.x + (centroidA.x - centroidDef.x) * progress;
  const curCenterY = centroidDef.y + (centroidA.y - centroidDef.y) * progress;
  const curAngle = rot * (1 - progress);
  const rad = (curAngle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const currentDefPts = baseDefPts.map((p, idx) => {
    // Relative vector from centroid of DEF
    const dx = p.x - centroidDef.x;
    const dy = p.y - centroidDef.y;

    // Rotated around current moving center
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;

    let px = curCenterX + rx;
    let py = curCenterY + ry;

    // If not congruent, blend towards the mismatched target as progress increases
    if (!question.congruent) {
      const targetMismatch = mismatchTargets[idx];
      const idealLandPoint = ptsA[idx];
      const mismatchOffsetX = (targetMismatch.x - idealLandPoint.x) * progress;
      const mismatchOffsetY = (targetMismatch.y - idealLandPoint.y) * progress;
      px += mismatchOffsetX;
      py += mismatchOffsetY;
    }

    return { x: px, y: py };
  });

  const curDefCentroid = getCentroid(currentDefPts[0], currentDefPts[1], currentDefPts[2]);

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
                className="fill-indigo-500/15 stroke-indigo-600"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Angle Arcs on Triangle A */}
              {question.triangleA.angles && question.triangleA.angles.map((ang, idx) => {
                const v = ptsA[ang.vertex];
                const p1 = ptsA[(ang.vertex + 1) % 3];
                const p2 = ptsA[(ang.vertex + 2) % 3];
                const arcPath = getAngleArcPath(v, p1, p2, 22);
                return (
                  <path
                    key={`modal-arc-a-${idx}`}
                    d={arcPath}
                    className="fill-indigo-100/60 stroke-indigo-600"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Edge Ticks on Triangle A */}
              {question.triangleA.edges && question.triangleA.edges.map((edge, idx) => {
                const p1 = ptsA[edge.from];
                const p2 = ptsA[edge.to];
                const ticks = edge.ticks ? getEdgeTicks(p1, p2, edge.ticks, centroidA) : [];
                return (
                  <g key={`modal-edge-a-${idx}`}>
                    {ticks.map((t, tIdx) => (
                      <line
                        key={`tick-a-${tIdx}`}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        className="stroke-indigo-600"
                        strokeWidth="2"
                      />
                    ))}
                  </g>
                );
              })}

              {/* Triangle DEF (Emerald, moving and un-rotating) */}
              <path
                d={pathDef}
                className="fill-emerald-500/20 stroke-emerald-600"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeDasharray={progress > 0.95 && !question.congruent ? "6 4" : "none"}
              />

              {/* Angle Arcs on Triangle DEF */}
              {question.triangleB.angles && question.triangleB.angles.map((ang, idx) => {
                const v = currentDefPts[ang.vertex];
                const p1 = currentDefPts[(ang.vertex + 1) % 3];
                const p2 = currentDefPts[(ang.vertex + 2) % 3];
                const arcPath = getAngleArcPath(v, p1, p2, 22);
                return (
                  <path
                    key={`modal-arc-b-${idx}`}
                    d={arcPath}
                    className="fill-emerald-100/60 stroke-emerald-600"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Edge Ticks on Triangle DEF */}
              {question.triangleB.edges && question.triangleB.edges.map((edge, idx) => {
                const p1 = currentDefPts[edge.from];
                const p2 = currentDefPts[edge.to];
                const ticks = edge.ticks ? getEdgeTicks(p1, p2, edge.ticks, curDefCentroid) : [];
                return (
                  <g key={`modal-edge-b-${idx}`}>
                    {ticks.map((t, tIdx) => (
                      <line
                        key={`tick-b-${tIdx}`}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        className="stroke-emerald-600"
                        strokeWidth="2"
                      />
                    ))}
                  </g>
                );
              })}

              {/* Labels for ABC */}
              {ptsA.map((p, idx) => {
                const lblA = question.triangleA.vertices[idx].label;
                const lblB = question.triangleB.vertices[idx].label;
                const isSuperposed = progress >= 0.85;

                return (
                  <g key={`lbl-a-${idx}`}>
                    <circle cx={p.x} cy={p.y} r="4.5" className="fill-indigo-600 stroke-white stroke-2" />
                    <text
                      x={p.x + (idx === 0 ? 0 : idx === 1 ? -18 : 18)}
                      y={p.y + (idx === 0 ? -12 : 20)}
                      className="text-[13px] font-bold fill-indigo-900"
                      textAnchor="middle"
                    >
                      {isSuperposed && question.congruent ? (
                        <>
                          {lblA}
                          <tspan className="fill-emerald-700 font-extrabold text-[12px]">{`(${lblB})`}</tspan>
                        </>
                      ) : (
                        lblA
                      )}
                    </text>
                  </g>
                );
              })}

              {/* Labels for DEF (hidden when superposed with congruent triangle to avoid clutter) */}
              {progress < 0.85 && currentDefPts.map((p, idx) => (
                <g key={`lbl-def-${idx}`}>
                  <circle cx={p.x} cy={p.y} r="4.5" className="fill-emerald-600 stroke-white stroke-2" />
                  <text
                    x={p.x + (idx === 0 ? 0 : idx === 1 ? -16 : 16)}
                    y={p.y + (idx === 0 ? -12 : 20)}
                    className="text-[13px] font-bold fill-emerald-800"
                    textAnchor="middle"
                  >
                    {question.triangleB.vertices[idx].label}
                  </text>
                </g>
              ))}

              {/* Show mismatched vertex label if not congruent at progress >= 0.85 */}
              {progress >= 0.85 && !question.congruent && currentDefPts.map((p, idx) => (
                <g key={`lbl-def-mismatch-${idx}`}>
                  <circle cx={p.x} cy={p.y} r="4" className="fill-rose-500 stroke-white stroke-2" />
                  <text
                    x={p.x + (idx === 0 ? 14 : 0)}
                    y={p.y - 10}
                    className="text-[11px] font-bold fill-rose-600"
                    textAnchor="middle"
                  >
                    {question.triangleB.vertices[idx].label} (불일치)
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
