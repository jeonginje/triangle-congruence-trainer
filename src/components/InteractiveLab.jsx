import React, { useState } from 'react';
import { Compass, Sparkles, AlertTriangle, CheckCircle2, RotateCcw, Info } from 'lucide-react';

export default function InteractiveLab() {
  const [activeTab, setActiveTab] = useState('ssa'); // 'ssa' or 'builder'

  // SSA Lab State: angle A in degrees, side c (AB), swinging side a (BC)
  const [angleA, setAngleA] = useState(35);
  const [sideC, setSideC] = useState(150);
  const [sideA, setSideA] = useState(105); // Set so it hits baseline at 2 points!
  const [swingAngle, setSwingAngle] = useState(0); // additional swing angle

  // Geometry for SSA demonstration
  // Vertex A at (50, 200)
  // Vertex B along angle A: (50 + c * cos(A), 200 - c * sin(A))
  const radA = (angleA * Math.PI) / 180;
  const vertA = { x: 50, y: 200 };
  const vertB = {
    x: vertA.x + sideC * Math.cos(radA),
    y: vertA.y - sideC * Math.sin(radA),
  };

  // Height from B perpendicular to baseline (y = 200):
  const height = vertA.y - vertB.y; // sideC * sin(A)
  const projBX = vertB.x;

  // If sideA > height and sideA < sideC, there are 2 intersections with baseline y = 200!
  let c1 = null;
  let c2 = null;

  if (sideA >= height) {
    const dx = Math.sqrt(Math.max(0, sideA * sideA - height * height));
    c1 = { x: projBX - dx, y: 200 }; // obtuse triangle vertex
    c2 = { x: projBX + dx, y: 200 }; // acute triangle vertex
  }

  // Builder State
  const [knownSides, setKnownSides] = useState({ s1: true, s2: true, s3: false });
  const [knownAngles, setKnownAngles] = useState({ a1: false, a2: true, a3: false });
  const [isIncluded, setIsIncluded] = useState(true);

  // Evaluate builder state
  const sideCount = Object.values(knownSides).filter(Boolean).length;
  const angleCount = Object.values(knownAngles).filter(Boolean).length;

  let builderResult = { type: 'NONE', title: '조건 분석 중', desc: '단서를 선택해 보세요.', valid: false };
  if (sideCount === 3) {
    builderResult = {
      type: 'SSS',
      title: 'SSS 합동 달성! 🎯',
      desc: '세 변의 길이가 각각 같으므로 각도 정보 없이도 삼각형이 완벽히 하나로 결정됩니다.',
      valid: true,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
    };
  } else if (sideCount === 2 && angleCount === 1) {
    if (isIncluded) {
      builderResult = {
        type: 'SAS',
        title: 'SAS 합동 달성! 🎯',
        desc: '두 변과 그 "끼인각"이 같으므로 삼각형의 모양과 크기가 단 하나로 결정됩니다.',
        valid: true,
        color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      };
    } else {
      builderResult = {
        type: 'SSA_FAIL',
        title: '⚠️ SSA 함정 발생! (합동 아님)',
        desc: '주어진 각이 두 변의 끼인각이 아닙니다! 컴퍼스로 돌렸을 때 2가지 삼각형이 만들어지므로 합동이 성립하지 않습니다.',
        valid: false,
        color: 'bg-rose-50 border-rose-200 text-rose-900',
      };
    }
  } else if (sideCount === 1 && angleCount >= 2) {
    builderResult = {
      type: 'ASA',
      title: 'ASA 합동 달성! 🎯',
      desc: '한 변과 양 끝 각이 같으므로(또는 180° 계산을 통해) 삼각형이 단 하나로 결정됩니다.',
      valid: true,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    };
  } else if (sideCount === 0 && angleCount === 3) {
    builderResult = {
      type: 'AAA_FAIL',
      title: '❌ AAA 함정 (합동 아님)',
      desc: '세 각의 크기가 같아도 크기가 제각각 다를 수 있어 모양만 같은 닮음일 뿐, 합동은 아닙니다.',
      valid: false,
      color: 'bg-rose-50 border-rose-200 text-rose-900',
    };
  } else {
    builderResult = {
      type: 'INSUFFICIENT',
      title: '조건 부족',
      desc: `현재 변 ${sideCount}개, 각 ${angleCount}개로 정보가 부족하여 삼각형의 모양을 확정할 수 없습니다.`,
      valid: false,
      color: 'bg-slate-50 border-slate-200 text-slate-700',
    };
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header & Sub-tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> 인터랙티브 실험실
            </span>
            <span className="text-xs text-slate-400 font-medium">원리 직접 눈으로 확인하기</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {activeTab === 'ssa' ? '왜 SSA는 합동이 아닐까? (컴퍼스 실험실)' : '합동 조건 조합기 (Congruence Builder)'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            교과서 그림만으로는 이해하기 어려웠던 기하학적 원리를 슬라이더로 직접 조작해 보세요.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('ssa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ssa' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🔬 SSA 함정 시뮬레이터
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'builder' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🧩 조건 조립기
          </button>
        </div>
      </div>

      {/* TAB 1: SSA TRAP LAB */}
      {activeTab === 'ssa' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col gap-6 animate-pop-in">
          {/* Explanation Banner */}
          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-950 leading-relaxed">
              <span className="font-bold text-sm block mb-0.5">💡 왜 중1 때 "끼인각"을 그토록 강조할까요?</span>
              각 A와 변 c(AB), 변 a(BC)가 주어졌을 때(끼인각이 아닌 SSA), 꼭짓점 B에서 길이가 a인 컴퍼스를 밑변에 대고 돌리면 밑변과 <span className="font-bold text-purple-700 underline">서로 다른 2개의 점(C₁과 C₂)</span>에서 만납니다.
              따라서 <span className="font-bold">둔각삼각형과 예각삼각형 2가지</span>가 만들어져 삼각형이 하나로 결정되지 않습니다!
            </div>
          </div>

          {/* SVG Canvas for Compass / SSA */}
          <div className="w-full aspect-[540/270] max-w-2xl mx-auto bg-slate-50/50 rounded-2xl border border-slate-200 relative overflow-hidden shadow-inner">
            <svg viewBox="0 0 540 270" className="w-full h-full select-none">
              {/* Baseline */}
              <line x1="20" y1="200" x2="520" y2="200" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
              <text x="500" y="220" className="text-[11px] fill-slate-400 font-semibold" textAnchor="end">밑변</text>

              {/* Ray from A representing Angle A */}
              <line
                x1={vertA.x}
                y1={vertA.y}
                x2={vertA.x + 240 * Math.cos(radA)}
                y2={vertA.y - 240 * Math.sin(radA)}
                stroke="#6366f1"
                strokeWidth="2.5"
              />

              {/* Angle A Arc */}
              <path
                d={`M ${vertA.x + 35} ${vertA.y} A 35 35 0 0 0 ${vertA.x + 35 * Math.cos(radA)} ${vertA.y - 35 * Math.sin(radA)}`}
                fill="rgba(99, 102, 241, 0.15)"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <text x={vertA.x + 48} y={vertA.y - 10} className="text-[12px] font-bold fill-indigo-700">
                ∠A = {angleA}°
              </text>

              {/* Side c (AB) */}
              <line x1={vertA.x} y1={vertA.y} x2={vertB.x} y2={vertB.y} stroke="#4f46e5" strokeWidth="4" />
              <text
                x={(vertA.x + vertB.x) / 2 - 14}
                y={(vertA.y + vertB.y) / 2 - 10}
                className="text-[12px] font-bold fill-indigo-900"
              >
                c = {sideC}
              </text>

              {/* Compass circle / arc centered at B with radius sideA */}
              <circle
                cx={vertB.x}
                cy={vertB.y}
                r={sideA}
                fill="none"
                stroke="#ec4899"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Height reference line (dotted) */}
              <line x1={vertB.x} y1={vertB.y} x2={vertB.x} y2="200" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x={vertB.x + 5} y={vertB.y + height / 2} className="text-[10px] font-semibold fill-rose-500">
                높이 h = {Math.round(height)}
              </text>

              {/* Triangle 1: Obtuse (A - B - C1) */}
              {c1 && (
                <>
                  <polygon
                    points={`${vertA.x},${vertA.y} ${vertB.x},${vertB.y} ${c1.x},${c1.y}`}
                    fill="rgba(244, 63, 94, 0.2)"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                  <line x1={vertB.x} y1={vertB.y} x2={c1.x} y2={c1.y} stroke="#f43f5e" strokeWidth="3" />
                  <circle cx={c1.x} cy={c1.y} r="5" className="fill-rose-600 stroke-white stroke-2" />
                  <text x={c1.x - 10} y="225" className="text-[13px] font-black fill-rose-700">
                    C₁ (둔각)
                  </text>
                </>
              )}

              {/* Triangle 2: Acute (A - B - C2) */}
              {c2 && (
                <>
                  <polygon
                    points={`${vertA.x},${vertA.y} ${vertB.x},${vertB.y} ${c2.x},${c2.y}`}
                    fill="rgba(16, 185, 129, 0.15)"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <line x1={vertB.x} y1={vertB.y} x2={c2.x} y2={c2.y} stroke="#10b981" strokeWidth="3" />
                  <circle cx={c2.x} cy={c2.y} r="5" className="fill-emerald-600 stroke-white stroke-2" />
                  <text x={c2.x + 10} y="225" className="text-[13px] font-black fill-emerald-700">
                    C₂ (예각)
                  </text>
                </>
              )}

              {/* Vertex A and B labels */}
              <circle cx={vertA.x} cy={vertA.y} r="5" className="fill-indigo-600 stroke-white stroke-2" />
              <text x={vertA.x - 18} y={vertA.y + 5} className="text-[14px] font-black fill-indigo-900">A</text>

              <circle cx={vertB.x} cy={vertB.y} r="5" className="fill-indigo-600 stroke-white stroke-2" />
              <text x={vertB.x} y={vertB.y - 10} className="text-[14px] font-black fill-indigo-900" textAnchor="middle">B</text>
            </svg>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>돌아가는 변 a (BC 길이): {sideA}</span>
                <span className="text-slate-400">높이 h = {Math.round(height)}</span>
              </div>
              <input
                type="range"
                min={Math.round(height) - 10}
                max={sideC + 30}
                value={sideA}
                onChange={(e) => setSideA(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">
                {sideA < height ? '❌ 높이보다 짧아 삼각형이 만들어지지 않음' : sideA < sideC ? '⚠️ 둔각(C₁)과 예각(C₂) 2가지가 모두 만들어짐! (SSA 실패)' : '변 c보다 길어져 1개만 만남'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>각 A의 크기: {angleA}°</span>
              </div>
              <input
                type="range"
                min="20"
                max="65"
                value={angleA}
                onChange={(e) => setAngleA(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">각도를 조절하면 꼭짓점 B의 높이가 변합니다.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONGRUENCE BUILDER */}
      {activeTab === 'builder' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col gap-6 animate-pop-in">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              삼각형의 단서를 직접 켜고 끄며 합동 조건을 완성해 보세요!
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              어떤 조합일 때 "합동 잠금(Lock)"이 걸리는지 테스트할 수 있습니다.
            </p>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Side toggles */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3">
              <span className="text-xs font-bold text-indigo-700 uppercase">변(Side) 단서 설정 (최대 3개)</span>
              {['변 AB (s1)', '변 BC (s2)', '변 CA (s3)'].map((label, idx) => {
                const key = `s${idx + 1}`;
                return (
                  <label key={key} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                    <span className="text-sm font-semibold text-slate-800">{label}</span>
                    <input
                      type="checkbox"
                      checked={knownSides[key]}
                      onChange={(e) => setKnownSides({ ...knownSides, [key]: e.target.checked })}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
                    />
                  </label>
                );
              })}
            </div>

            {/* Angle toggles */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3">
              <span className="text-xs font-bold text-emerald-700 uppercase">각(Angle) 단서 설정</span>
              {['각 A (a1)', '각 B (a2)', '각 C (a3)'].map((label, idx) => {
                const key = `a${idx + 1}`;
                return (
                  <label key={key} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition-colors">
                    <span className="text-sm font-semibold text-slate-800">{label}</span>
                    <input
                      type="checkbox"
                      checked={knownAngles[key]}
                      onChange={(e) => setKnownAngles({ ...knownAngles, [key]: e.target.checked })}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer rounded"
                    />
                  </label>
                );
              })}

              {sideCount === 2 && angleCount === 1 && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <label className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
                    <span className="text-xs font-bold text-amber-900">그 각이 두 변의 "끼인각"인가요?</span>
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={(e) => setIsIncluded(e.target.checked)}
                      className="w-4 h-4 accent-amber-600 cursor-pointer"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Builder Outcome Banner */}
          <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${builderResult.color}`}>
            {builderResult.valid ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-base font-black flex items-center gap-2">
                {builderResult.title}
                {builderResult.valid && (
                  <span className="text-xs bg-white/80 px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                    합동 성립
                  </span>
                )}
              </div>
              <div className="text-xs mt-1 leading-relaxed">{builderResult.desc}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
