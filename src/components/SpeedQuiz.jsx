import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  Zap,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Send,
  Award
} from 'lucide-react';
import TriangleCanvas from './TriangleCanvas';
import SuperposeModal from './SuperposeModal';
import ScoreReportModal from './ScoreReportModal';
import { CURATED_QUESTIONS, generateRandomQuestion } from '../data/questions';
import { playSound } from '../utils/sound';
import { calculateDifferentiatedScore } from '../utils/scorePlatform';
import confetti from 'canvas-confetti';

export default function SpeedQuiz({ soundEnabled }) {
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(CURATED_QUESTIONS[0]);

  // Quiz state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSuperpose, setShowSuperpose] = useState(false);

  // Behavioral tracking metrics for 100-point differentiated evaluation
  const [sessionMetrics, setSessionMetrics] = useState({
    totalAttempted: 0,
    firstTryCorrect: 0,
    wrongAttemptsTotal: 0,
    trapsFaced: 0,
    trapsCorrectFirstTry: 0,
    corrOrderFaced: 0,
    corrOrderCorrectFirstTry: 0,
    hintsUsed: 0,
    superposeUsed: 0,
    streakMax: 0,
  });

  const [showReportModal, setShowReportModal] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  // Filtered curated questions for current level or random
  const loadQuestion = (lvl, idx) => {
    setIsAnswered(false);
    setSelectedAnswer(null);

    if (lvl === 4) {
      setCurrentQuestion(generateRandomQuestion(3));
    } else {
      const pool = CURATED_QUESTIONS.filter((q) => q.level === lvl);
      if (idx < pool.length) {
        setCurrentQuestion(pool[idx]);
      } else {
        setCurrentQuestion(generateRandomQuestion(lvl));
      }
    }
  };

  useEffect(() => {
    loadQuestion(level, questionIndex);
  }, [level, questionIndex]);

  const handleSelectAnswer = (ans) => {
    if (isAnswered) return;

    setSelectedAnswer(ans);
    setIsAnswered(true);

    const correct = ans === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    const isTrap =
      currentQuestion.id.includes('trap') ||
      currentQuestion.correctAnswer === 'NONE' ||
      currentQuestion.id.includes('angle_calc');

    // Update behavioral metrics
    setSessionMetrics((prev) => {
      const newAttempted = prev.totalAttempted + 1;
      const newFirstTry = correct ? prev.firstTryCorrect + 1 : prev.firstTryCorrect;
      const newWrong = correct ? prev.wrongAttemptsTotal : prev.wrongAttemptsTotal + 1;
      const newTrapsFaced = isTrap ? prev.trapsFaced + 1 : prev.trapsFaced;
      const newTrapsCorrect = isTrap && correct ? prev.trapsCorrectFirstTry + 1 : prev.trapsCorrectFirstTry;
      const newStreakMax = Math.max(prev.streakMax, correct ? streak + 1 : streak);

      return {
        ...prev,
        totalAttempted: newAttempted,
        firstTryCorrect: newFirstTry,
        wrongAttemptsTotal: newWrong,
        trapsFaced: newTrapsFaced,
        trapsCorrectFirstTry: newTrapsCorrect,
        streakMax: newStreakMax,
      };
    });

    if (correct) {
      playSound('correct', soundEnabled);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      const addedScore = 100 + newStreak * 20;
      setScore((prev) => prev + addedScore);

      if (newStreak % 5 === 0) {
        playSound('fanfare', soundEnabled);
        confetti({ particleCount: 70, spread: 60 });
      }
    } else {
      playSound('wrong', soundEnabled);
      setStreak(0);
    }
  };

  const handleNext = () => {
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);

    // If 10 questions completed, suggest viewing and submitting score!
    if (sessionMetrics.totalAttempted >= 10 && sessionMetrics.totalAttempted % 10 === 0) {
      handleOpenReport();
    }
  };

  const handleOpenReport = () => {
    const evalData = calculateDifferentiatedScore({
      ...sessionMetrics,
      streakMax: Math.max(sessionMetrics.streakMax, bestStreak),
    });
    setCurrentEvaluation(evalData);
    setShowReportModal(true);
  };

  const handleResetQuiz = () => {
    setScore(0);
    setStreak(0);
    setQuestionIndex(0);
    setSessionMetrics({
      totalAttempted: 0,
      firstTryCorrect: 0,
      wrongAttemptsTotal: 0,
      trapsFaced: 0,
      trapsCorrectFirstTry: 0,
      corrOrderFaced: 0,
      corrOrderCorrectFirstTry: 0,
      hintsUsed: 0,
      superposeUsed: 0,
      streakMax: 0,
    });
    loadQuestion(level, 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Stats Banner */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Level selector tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 1, label: '🌱 Lv1 기본' },
            { id: 2, label: '🌿 Lv2 회전' },
            { id: 3, label: '🌳 Lv3 함정' },
            { id: 4, label: '🔥 무한 챌린지' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setLevel(tab.id);
                setQuestionIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Score & Streak & Report Submit Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-800">{streak} 콤보</span>
          </div>

          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-2xl">
            <Trophy className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">{score}점</span>
          </div>

          <button
            onClick={handleOpenReport}
            disabled={sessionMetrics.totalAttempted === 0}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-100 disabled:opacity-40 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>학급 점수 제출 ({sessionMetrics.totalAttempted}문제 푼 기록)</span>
          </button>
        </div>
      </div>

      {/* Triangles Comparison View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TriangleCanvas
          triangle={currentQuestion.triangleA}
          title="삼각형 ABC"
          colorScheme="blue"
        />
        <TriangleCanvas
          triangle={currentQuestion.triangleB}
          title="삼각형 DEF"
          colorScheme="emerald"
        />
      </div>

      {/* Answer Decision Buttons */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              두 삼각형은 어떤 조건으로 합동일까요?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              눈금과 각의 기호 또는 길이를 비교하여 신속하게 판별하세요!
            </p>
          </div>
          <button
            onClick={() => {
              setShowSuperpose(true);
              setSessionMetrics((prev) => ({ ...prev, superposeUsed: prev.superposeUsed + 1 }));
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-4 h-4" /> 포개어보기
          </button>
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { code: 'SSS', label: 'SSS 합동', sub: '세 변이 각각 같음', color: 'border-blue-200 hover:border-blue-400 text-blue-700' },
            { code: 'SAS', label: 'SAS 합동', sub: '두 변과 그 끼인각', color: 'border-emerald-200 hover:border-emerald-400 text-emerald-700' },
            { code: 'ASA', label: 'ASA 합동', sub: '한 변과 양 끝 각', color: 'border-amber-200 hover:border-amber-400 text-amber-700' },
            { code: 'NONE', label: '합동 아님 / 부족', sub: 'SSA 함정, AAA 등', color: 'border-rose-200 hover:border-rose-400 text-rose-700' },
          ].map((btn) => {
            const isChosen = selectedAnswer === btn.code;
            const isRightChoice = isAnswered && btn.code === currentQuestion.correctAnswer;
            const isWrongChoice = isAnswered && isChosen && !isCorrect;

            let style = 'bg-white border-slate-200 hover:bg-slate-50';
            if (isRightChoice) {
              style = 'bg-emerald-500 text-white border-emerald-500 shadow-md ring-2 ring-emerald-300';
            } else if (isWrongChoice) {
              style = 'bg-rose-500 text-white border-rose-500 shadow-md';
            } else if (isAnswered) {
              style = 'bg-slate-50 text-slate-400 border-slate-100 opacity-60';
            }

            return (
              <button
                key={btn.code}
                disabled={isAnswered}
                onClick={() => handleSelectAnswer(btn.code)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 font-bold ${style}`}
              >
                <span className="text-base font-black">{btn.label}</span>
                <span className={`text-[11px] font-medium ${isRightChoice || isWrongChoice ? 'text-white/80' : 'text-slate-400'}`}>
                  {btn.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback area */}
        {isAnswered && (
          <div className="flex flex-col gap-4 animate-pop-in pt-2">
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 ${
                isCorrect
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="text-sm font-bold">
                  {isCorrect ? '정답입니다! 🎯' : '오답입니다! 💡'}
                </div>
                <div className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {currentQuestion.explanation}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowSuperpose(true);
                  setSessionMetrics((prev) => ({ ...prev, superposeUsed: prev.superposeUsed + 1 }));
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Layers className="w-4 h-4" /> 포개어서 다시 확인하기
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                다음 문제 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Superpose Modal */}
      <SuperposeModal
        isOpen={showSuperpose}
        onClose={() => setShowSuperpose(false)}
        question={currentQuestion}
      />

      {/* Score Report & Platform Submission Modal */}
      <ScoreReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        evaluation={currentEvaluation}
        onRestart={handleResetQuiz}
      />
    </div>
  );
}
