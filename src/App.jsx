import React, { useState } from 'react';
import Header from './components/Header';
import StepByStepTrainer from './components/StepByStepTrainer';
import SpeedQuiz from './components/SpeedQuiz';
import InteractiveLab from './components/InteractiveLab';
import ConceptCards from './components/ConceptCards';
import ScoreReportModal from './components/ScoreReportModal';
import { CURATED_QUESTIONS } from './data/questions';
import { calculateDifferentiatedScore, sendScoreToClassPlatform } from './utils/scorePlatform';
import { Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Award, Send, BarChart2 } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const [activeTab, setActiveTab] = useState('step'); // 'step' | 'quiz' | 'lab' | 'concept'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Trainee mode state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [questionResults, setQuestionResults] = useState({});

  // Behavioral session metrics for Step-by-Step Training mode
  const [trainerMetrics, setTrainerMetrics] = useState({
    totalAttempted: 0,
    firstTryCorrect: 0,
    wrongAttemptsTotal: 0,
    hintsUsed: 0,
    superposeUsed: 0,
    streakMax: 0,
  });

  const [currentStreak, setCurrentStreak] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  const currentQuestion = CURATED_QUESTIONS[currentQuestionIdx];

  const handleNextQuestion = () => {
    if (currentQuestionIdx < CURATED_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setCurrentQuestionIdx(0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  // Called when a question in StepByStepTrainer is completed
  const handleQuestionCompleted = (result) => {
    const {
      questionId,
      firstTry,
      mistakes,
      isTrap,
      trapPassedFirstTry,
      isCorr,
      corrPassedFirstTry,
      usedHint,
      usedSuperpose,
    } = result;

    const updatedResults = {
      ...questionResults,
      [questionId]: {
        firstTry,
        mistakes,
        isTrap,
        isCorr,
      },
    };
    setQuestionResults(updatedResults);

    const nextCompleted = new Set([...completedQuestions, questionId]);
    setCompletedQuestions(nextCompleted);

    const newStreak = firstTry ? currentStreak + 1 : 0;
    setCurrentStreak(newStreak);

    setTrainerMetrics((prev) => ({
      totalAttempted: prev.totalAttempted + 1,
      firstTryCorrect: firstTry ? prev.firstTryCorrect + 1 : prev.firstTryCorrect,
      wrongAttemptsTotal: prev.wrongAttemptsTotal + mistakes,
      hintsUsed: usedHint ? prev.hintsUsed + 1 : prev.hintsUsed,
      superposeUsed: usedSuperpose ? prev.superposeUsed + 1 : prev.superposeUsed,
      streakMax: Math.max(prev.streakMax, newStreak),
    }));

    // If all 11 questions are completed or the 11th question finishes, auto-submit score!
    const isFinishedAll = nextCompleted.size === CURATED_QUESTIONS.length;
    const isFinishedLastQuestion = currentQuestionIdx === CURATED_QUESTIONS.length - 1;

    if (isFinishedAll || isFinishedLastQuestion) {
      setTimeout(() => {
        const evalData = calculateDifferentiatedScore({
          mode: 'step',
          targetTotal: CURATED_QUESTIONS.length,
          completedCount: nextCompleted.size,
          questionResults: updatedResults,
          wrongAttemptsTotal: trainerMetrics.wrongAttemptsTotal + mistakes,
          hintsUsed: trainerMetrics.hintsUsed,
          superposeUsed: trainerMetrics.superposeUsed,
          streakMax: Math.max(trainerMetrics.streakMax, newStreak),
        });

        // 🌟 AUTOMATIC SCORE SUBMISSION TO CLASS PLATFORM
        sendScoreToClassPlatform(evalData.totalScore, evalData.details);

        setCurrentEvaluation(evalData);
        setIsAutoSubmitted(true);
        setShowReportModal(true);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      }, 700);
    }
  };

  // Open score report on demand
  const handleOpenScoreReport = () => {
    const evalData = calculateDifferentiatedScore({
      mode: 'step',
      targetTotal: CURATED_QUESTIONS.length,
      completedCount: completedQuestions.size,
      questionResults,
      wrongAttemptsTotal: trainerMetrics.wrongAttemptsTotal,
      hintsUsed: trainerMetrics.hintsUsed,
      superposeUsed: trainerMetrics.superposeUsed,
      streakMax: trainerMetrics.streakMax,
    });
    setCurrentEvaluation(evalData);
    setIsAutoSubmitted(false);
    setShowReportModal(true);
  };

  const handleRestartTrainer = () => {
    setCompletedQuestions(new Set());
    setQuestionResults({});
    setCurrentQuestionIdx(0);
    setCurrentStreak(0);
    setIsAutoSubmitted(false);
    setTrainerMetrics({
      totalAttempted: 0,
      firstTryCorrect: 0,
      wrongAttemptsTotal: 0,
      hintsUsed: 0,
      superposeUsed: 0,
      streakMax: 0,
    });
  };

  // Compute live score for the progress bar
  const liveEvaluation = calculateDifferentiatedScore({
    mode: 'step',
    targetTotal: CURATED_QUESTIONS.length,
    completedCount: completedQuestions.size,
    questionResults,
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">
        {/* STEP BY STEP TRAINER */}
        {activeTab === 'step' && (
          <div className="flex flex-col gap-6">
            {/* Question Selector & Progress Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">훈련 진행도:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {CURATED_QUESTIONS.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIdx;
                    const isDone = completedQuestions.has(q.id);
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIdx(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200'
                            : isDone
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={`Q${idx + 1}: ${q.title}`}
                      >
                        {isDone && !isCurrent ? '✓' : idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress counter, Live Score, Prev/Next buttons, and Submit Score button */}
              <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
                <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
                  <span>진행: <strong className="text-indigo-600">{completedQuestions.size}</strong>/{CURATED_QUESTIONS.length}</span>
                  <span className="text-slate-300">|</span>
                  <span>현재 점수: <strong className="text-indigo-700 text-sm">{liveEvaluation.totalScore}점</strong> <span className="text-[10px] text-slate-400">/ 100점</span></span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={handlePrevQuestion}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentQuestionIdx === CURATED_QUESTIONS.length - 1}
                    onClick={handleNextQuestion}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleOpenScoreReport}
                  disabled={completedQuestions.size === 0}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-100 disabled:opacity-40 transition-all"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>학급 플랫폼 점수 제출 ({liveEvaluation.totalScore}점)</span>
                </button>
              </div>
            </div>

            {/* Interactive Step Trainer Component */}
            <StepByStepTrainer
              key={currentQuestion.id}
              question={currentQuestion}
              onNextQuestion={handleNextQuestion}
              soundEnabled={soundEnabled}
              onQuestionCompleted={handleQuestionCompleted}
              onOpenScoreReport={handleOpenScoreReport}
            />
          </div>
        )}

        {/* SPEED QUIZ */}
        {activeTab === 'quiz' && (
          <SpeedQuiz soundEnabled={soundEnabled} />
        )}

        {/* INTERACTIVE LAB */}
        {activeTab === 'lab' && (
          <InteractiveLab />
        )}

        {/* CONCEPT CARDS & FLOWCHART */}
        {activeTab === 'concept' && (
          <ConceptCards />
        )}
      </main>

      {/* Score Report & Platform Submission Modal */}
      <ScoreReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        evaluation={currentEvaluation}
        onRestart={handleRestartTrainer}
        autoSubmitted={isAutoSubmitted}
      />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">삼각형의 합동 탐정단</span>
            <span>|</span>
            <span>중학교 1학년 수학 2학기 도형의 성질 단원 연계</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">100점 만점 누적형 배점</span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">postMessage 플랫폼 연동</span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">전체 정답 시 100점 달성</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
