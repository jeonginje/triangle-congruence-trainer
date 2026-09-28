import React from 'react';
import { Volume2, VolumeX, Sparkles, Compass, Zap, BookOpen, Search } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
}) {
  const tabs = [
    { id: 'step', label: '단계별 조사 훈련', icon: Search, badge: '추천' },
    { id: 'quiz', label: '실전 스피드 퀴즈', icon: Zap, badge: '실전' },
    { id: 'lab', label: '원리 탐구 실험실', icon: Compass, badge: '체험' },
    { id: 'concept', label: '개념 사전 & 순서도', icon: BookOpen },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/90">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('step')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-white/20 stroke-2">
                <polygon points="12 3 22 21 2 21" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-800 tracking-tight">
                  삼각형의 합동 탐정단
                </span>
                <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                  중1 수학
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                SSS · SAS · ASA 조건만 조사하여 합동 판정하기
              </p>
            </div>
          </div>

          {/* Sound toggle on mobile */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            title={soundEnabled ? '소리 끄기' : '소리 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Sound toggle on desktop */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="hidden md:flex ml-2 p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            title={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
