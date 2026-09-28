import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  RotateCcw,
  Lightbulb,
  Search,
  Check
} from 'lucide-react';
import TriangleCanvas from './TriangleCanvas';
import SuperposeModal from './SuperposeModal';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function StepByStepTrainer({
  question,
  onNextQuestion,
  soundEnabled,
  onQuestionCompleted,
  onOpenScoreReport
}) {
  // Step tracker: 1 = Count, 2 = Position check, 3 = Verdict, 4 = Corresponding points
  const [currentStep, setCurrentStep] = useState(1);

  // Student inputs
  const [selectedSides, setSelectedSides] = useState(null);
  const [selectedAngles, setSelectedAngles] = useState(null);
  const [step1Feedback, setStep1Feedback] = useState(null);

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [step2Feedback, setStep2Feedback] = useState(null);

  const [selectedVerdict, setSelectedVerdict] = useState(null);
  const [step3Feedback, setStep3Feedback] = useState(null);

  const [corrLetters, setCorrLetters] = useState(['', '', '']);
  const [step4Feedback, setStep4Feedback] = useState(null);

  const [showSuperpose, setShowSuperpose] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Local action counters for this specific question
  const [mistakesThisQuestion, setMistakesThisQuestion] = useState(0);
  const [usedHintThisQuestion, setUsedHintThisQuestion] = useState(false);
  const [usedSuperposeThisQuestion, setUsedSuperposeThisQuestion] = useState(false);

  // Reset when question changes
  const resetState = () => {
    setCurrentStep(1);
    setSelectedSides(null);
    setSelectedAngles(null);
    setStep1Feedback(null);
    setSelectedPosition(null);
    setStep2Feedback(null);
    setSelectedVerdict(null);
    setStep3Feedback(null);
    setCorrLetters(['', '', '']);
    setStep4Feedback(null);
    setShowHint(false);
    setMistakesThisQuestion(0);
    setUsedHintThisQuestion(false);
    setUsedSuperposeThisQuestion(false);
  };

  const isTrapQuestion =
    question.id.includes('trap') ||
    question.correctAnswer === 'NONE' ||
    question.id.includes('angle_calc');

  // Step 1: Check side & angle count
  const handleCheckStep1 = (sides, angles) => {
    const s = sides !== null ? sides : selectedSides;
    const a = angles !== null ? angles : selectedAngles;

    if (s === null || a === null) return;

    if (s === question.knownSides && a === question.knownAngles) {
      playSound('correct', soundEnabled);
      setStep1Feedback({ success: true, message: `정답입니다! 변(S) ${s}개, 각(A) ${a}개의 단서가 주어졌습니다.` });
      setTimeout(() => {
        setCurrentStep(2);
      }, 700);
    } else {
      playSound('wrong', soundEnabled);
      setMistakesThisQuestion((prev) => prev + 1);
      setStep1Feedback({
        success: false,
        message: `다시 세어보세요! 그림의 눈금/길이(변)와 호/각도(각)를 꼼꼼히 확인해 보세요. (실제: 변 ${question.knownSides}개, 각 ${question.knownAngles}개)`,
      });
    }
  };

  // Step 2: Check position (included angle? both ends? etc.)
  const handleCheckStep2 = (optionKey) => {
    setSelectedPosition(optionKey);

    let isCorrect = false;
    let message = '';

    if (question.knownSides === 3) {
      if (optionKey === 'sss_all') {
        isCorrect = true;
        message = '맞습니다! 세 변이 각각 짝지어 길이가 같습니다.';
      }
    } else if (question.knownSides === 2 && question.knownAngles === 1) {
      if (question.isIncludedAngle && optionKey === 'included') {
        isCorrect = true;
        message = '정답! 두 변이 만나는 꼭짓점에 낀 "끼인각"입니다 (SAS 조건 만족).';
      } else if (!question.isIncludedAngle && optionKey === 'not_included') {
        isCorrect = true;
        message = '날카로운 관찰력! 두 변 사이가 아닌 엉뚱한 곳의 각입니다(SSA 함정).';
      } else {
        message = question.isIncludedAngle
          ? '두 변이 만나는 꼭짓점의 각을 자세히 보세요! 끼인각이 맞습니다.'
          : '두 변 사이의 꼭짓점이 아닙니다! 끼인각이 아니면 SSA 함정입니다.';
      }
    } else if (question.knownSides === 1 && question.knownAngles === 2) {
      if (optionKey === 'both_ends') {
        isCorrect = true;
        message = '맞습니다! 알려진 변의 양 끝 꼭짓점의 각입니다 (ASA 조건 만족).';
      }
    } else if (question.knownAngles === 3) {
      if (optionKey === 'aaa_different_size') {
        isCorrect = true;
        message = '정답! 세 각이 같아도 크기가 다를 수 있어 모양만 같고 합동은 아닙니다.';
      }
    } else {
      isCorrect = true;
      message = '조건을 올바르게 분석했습니다.';
    }

    if (isCorrect) {
      playSound('correct', soundEnabled);
      setStep2Feedback({ success: true, message });
      setTimeout(() => {
        setCurrentStep(3);
      }, 700);
    } else {
      playSound('wrong', soundEnabled);
      setMistakesThisQuestion((prev) => prev + 1);
      setStep2Feedback({ success: false, message });
    }
  };

  // Step 3: Check final verdict
  const handleCheckStep3 = (verdict) => {
    setSelectedVerdict(verdict);
    const isCorrect = verdict === question.correctAnswer;

    if (isCorrect) {
      playSound('correct', soundEnabled);
      setStep3Feedback({
        success: true,
        message: `완벽합니다! ${question.correctAnswer === 'NONE' ? '합동이 아님을 정확히 간파했습니다!' : `${question.correctAnswer} 합동입니다!`}`,
      });

      if (question.congruent && question.matchingVertices) {
        setTimeout(() => {
          setCurrentStep(4);
        }, 800);
      } else {
        // Non congruent: completed question!
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        onQuestionCompleted &&
          onQuestionCompleted({
            questionId: question.id,
            firstTry: mistakesThisQuestion === 0,
            mistakes: mistakesThisQuestion,
            isTrap: isTrapQuestion,
            trapPassedFirstTry: isTrapQuestion && mistakesThisQuestion === 0,
            usedHint: usedHintThisQuestion,
            usedSuperpose: usedSuperposeThisQuestion,
          });
      }
    } else {
      playSound('wrong', soundEnabled);
      setMistakesThisQuestion((prev) => prev + 1);
      setStep3Feedback({
        success: false,
        message: `틀렸습니다! ${question.explanation}`,
      });
    }
  };

  // Step 4: Check corresponding vertices order
  const handleCheckStep4 = () => {
    const entered = corrLetters.join('');
    const isCorrRight = entered === question.matchingVertices;

    if (isCorrRight) {
      playSound('fanfare', soundEnabled);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setStep4Feedback({
        success: true,
        message: `대응점 순서까지 완벽합니다! △ABC ≡ △${entered}`,
      });

      onQuestionCompleted &&
        onQuestionCompleted({
          questionId: question.id,
          firstTry: mistakesThisQuestion === 0,
          mistakes: mistakesThisQuestion,
          isTrap: isTrapQuestion,
          trapPassedFirstTry: isTrapQuestion && mistakesThisQuestion === 0,
          isCorr: true,
          corrPassedFirstTry: mistakesThisQuestion === 0,
          usedHint: usedHintThisQuestion,
          usedSuperpose: usedSuperposeThisQuestion,
        });
    } else {
      playSound('wrong', soundEnabled);
      setMistakesThisQuestion((prev) => prev + 1);
      setStep4Feedback({
        success: false,
        message: `대응점 순서가 맞지 않습니다! (정답: △${question.matchingVertices}) - 꼭짓점 A, B, C에 각각 짝지어지는 점을 차례대로 찾아보세요.`,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Question Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
              Level {question.level} 탐정 훈련
            </span>
            <span className="text-xs text-slate-400 font-medium">단서 3개 조사 훈련법</span>
            {mistakesThisQuestion === 0 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                무결점 진행 중
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800">{question.title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{question.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setShowHint(!showHint);
              setUsedHintThisQuestion(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Lightbulb className="w-4 h-4" /> 힌트 보기
          </button>
          <button
            onClick={() => {
              setShowSuperpose(true);
              setUsedSuperposeThisQuestion(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Layers className="w-4 h-4" /> 포개어보기
          </button>
        </div>
      </div>

      {showHint && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3 animate-pop-in">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 leading-relaxed font-medium">
            <span className="font-bold">탐정의 힌트:</span> {question.hint}
          </div>
        </div>
      )}

      {/* Triangles Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TriangleCanvas
          triangle={question.triangleA}
          title="기준 삼각형"
          colorScheme="blue"
        />
        <TriangleCanvas
          triangle={question.triangleB}
          title="비교할 삼각형"
          colorScheme="emerald"
        />
      </div>

      {/* Step by Step Investigation Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col gap-6">
        {/* Step indicator breadcrumbs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {[
              { num: 1, label: '단서 개수 세기' },
              { num: 2, label: '위치 관계 조사' },
              { num: 3, label: '합동 판정' },
              ...(question.congruent ? [{ num: 4, label: '대응점 작성' }] : [])
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                  currentStep === s.num
                    ? 'text-indigo-600'
                    : currentStep > s.num
                    ? 'text-emerald-600'
                    : 'text-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    currentStep === s.num
                      ? 'bg-indigo-600 text-white'
                      : currentStep > s.num
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400">Step {currentStep} / {question.congruent ? 4 : 3}</span>
        </div>

        {/* STEP 1: COUNT SIDES & ANGLES */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5 animate-pop-in">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 1</span>
              <h3 className="text-lg font-bold text-slate-800">
                주어진 변(S)과 각(A)의 개수를 조사하세요!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                두 삼각형에서 같다고 표시된 변의 개수와 각의 개수를 세어보세요.
              </p>
            </div>

            {/* Sides selection */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                1) 길이가 같다고 알려준 변(S)의 개수:
              </div>
              <div className="grid grid-cols-4 gap-2 max-w-md">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={`side-${num}`}
                    onClick={() => {
                      setSelectedSides(num);
                      if (selectedAngles !== null) handleCheckStep1(num, selectedAngles);
                    }}
                    className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                      selectedSides === num
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {num}개
                  </button>
                ))}
              </div>
            </div>

            {/* Angles selection */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                2) 크기가 같다고 알려준 각(A)의 개수:
              </div>
              <div className="grid grid-cols-4 gap-2 max-w-md">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={`angle-${num}`}
                    onClick={() => {
                      setSelectedAngles(num);
                      if (selectedSides !== null) handleCheckStep1(selectedSides, num);
                    }}
                    className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                      selectedAngles === num
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {num}개
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {step1Feedback && (
              <div
                className={`p-4 rounded-2xl flex items-start gap-3 animate-pop-in ${
                  step1Feedback.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {step1Feedback.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="text-sm font-medium">{step1Feedback.message}</div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: POSITIONAL RELATIONSHIP CHECK */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5 animate-pop-in">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 2</span>
              <h3 className="text-lg font-bold text-slate-800">
                변과 각의 <span className="text-indigo-600">위치 관계</span>를 조사하세요!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                중1 수학에서 가장 중요한 핵심 포인트입니다.
              </p>
            </div>

            {question.knownSides === 3 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-700 font-medium">세 변의 길이가 각각 대응하여 1:1로 일치합니까?</p>
                <button
                  onClick={() => handleCheckStep2('sss_all')}
                  className="p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all"
                >
                  <div className="font-bold text-slate-800 text-sm">✅ 네, 세 변의 길이가 각각 모두 일치합니다!</div>
                  <div className="text-xs text-slate-500 mt-1">각도 정보가 없어도 세 변이 같으면 모양과 크기가 단 하나로 정해집니다.</div>
                </button>
              </div>
            )}

            {question.knownSides === 2 && question.knownAngles === 1 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-700 font-medium">
                  주어진 각은 길이가 같은 두 변 사이의 <span className="text-indigo-600 font-bold">"끼인각"</span>인가요?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleCheckStep2('included')}
                    className="p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all"
                  >
                    <div className="font-bold text-slate-800 text-sm">👉 네, 두 변이 만나는 꼭짓점의 각(끼인각)입니다.</div>
                    <div className="text-xs text-slate-500 mt-1">S 와 S 사이에 A가 쏙 끼어 있는 형태 (SAS)</div>
                  </button>
                  <button
                    onClick={() => handleCheckStep2('not_included')}
                    className="p-4 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-2xl text-left transition-all"
                  >
                    <div className="font-bold text-slate-800 text-sm">⚠️ 아니오, 두 변 사이가 아닌 다른 각입니다!</div>
                    <div className="text-xs text-slate-500 mt-1">끼인각이 아닌 SSA 형태 (함정 주의!)</div>
                  </button>
                </div>
              </div>
            )}

            {question.knownSides === 1 && question.knownAngles === 2 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-700 font-medium">
                  주어진 각 2개는 알려진 변의 <span className="text-indigo-600 font-bold">"양 끝 각"</span>인가요?
                </p>
                <button
                  onClick={() => handleCheckStep2('both_ends')}
                  className="p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all"
                >
                  <div className="font-bold text-slate-800 text-sm">👉 네! 알려진 변의 양 끝 꼭짓점에 위치합니다.</div>
                  <div className="text-xs text-slate-500 mt-1">(또는 180° 계산을 통해 양 끝 각의 크기를 모두 알 수 있습니다)</div>
                </button>
              </div>
            )}

            {question.knownAngles === 3 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-700 font-medium">
                  세 각의 크기(AAA)만 주어졌을 때 두 삼각형이 반드시 합동일까요?
                </p>
                <button
                  onClick={() => handleCheckStep2('aaa_different_size')}
                  className="p-4 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-2xl text-left transition-all"
                >
                  <div className="font-bold text-slate-800 text-sm">❌ 아닙니다! 크기가 다를 수 있어 합동이 아닙니다.</div>
                  <div className="text-xs text-slate-500 mt-1">변의 길이가 하나도 없으므로 확대/축소된 닮음일 뿐입니다.</div>
                </button>
              </div>
            )}

            {/* Step 2 Feedback */}
            {step2Feedback && (
              <div
                className={`p-4 rounded-2xl flex items-start gap-3 animate-pop-in ${
                  step2Feedback.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {step2Feedback.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="text-sm font-medium">{step2Feedback.message}</div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: FINAL VERDICT */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5 animate-pop-in">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 3</span>
              <h3 className="text-lg font-bold text-slate-800">
                두 삼각형의 <span className="text-indigo-600">합동 조건</span>을 최종 선택하세요!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                위 1단계와 2단계에서 조사한 결과를 바탕으로 판단합니다.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { code: 'SSS', label: 'SSS 합동', desc: '세 변의 길이', color: 'border-blue-200 hover:bg-blue-50 text-blue-800' },
                { code: 'SAS', label: 'SAS 합동', desc: '두 변과 끼인각', color: 'border-emerald-200 hover:bg-emerald-50 text-emerald-800' },
                { code: 'ASA', label: 'ASA 합동', desc: '한 변과 양 끝 각', color: 'border-amber-200 hover:bg-amber-50 text-amber-800' },
                { code: 'NONE', label: '합동 아님 / 부족', desc: 'SSA, AAA, 정보 부족', color: 'border-rose-200 hover:bg-rose-50 text-rose-800' },
              ].map((btn) => (
                <button
                  key={btn.code}
                  onClick={() => handleCheckStep3(btn.code)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedVerdict === btn.code
                      ? 'ring-2 ring-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'bg-white'
                  } ${btn.color}`}
                >
                  <span className="text-base font-black">{btn.label}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{btn.desc}</span>
                </button>
              ))}
            </div>

            {/* Step 3 Feedback */}
            {step3Feedback && (
              <div
                className={`p-4 rounded-2xl flex items-start gap-3 animate-pop-in ${
                  step3Feedback.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {step3Feedback.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-sm font-bold">{step3Feedback.message}</div>
                  <div className="text-xs text-slate-600 mt-1">{question.explanation}</div>
                </div>
              </div>
            )}

            {step3Feedback && step3Feedback.success && !question.congruent && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    resetState();
                    onNextQuestion();
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  다음 문제 풀기 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: CORRESPONDING VERTICES ORDER */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-5 animate-pop-in">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 4 (서술형 완벽 대비)</span>
              <h3 className="text-lg font-bold text-slate-800">
                대응하는 꼭짓점의 순서를 맞춰 합동식을 완성하세요!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                학교 시험에서 가장 많이 감점되는 항목입니다: 꼭짓점 A, B, C에 대응하는 점을 순서대로 넣으세요.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 text-xl font-black text-slate-800">
                <span>△ABC</span>
                <span className="text-indigo-600 font-serif">≡</span>
                <span>△</span>
                <div className="flex items-center gap-2">
                  {['A 대응점', 'B 대응점', 'C 대응점'].map((lbl, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <input
                        type="text"
                        maxLength="1"
                        value={corrLetters[idx]}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          const updated = [...corrLetters];
                          updated[idx] = val;
                          setCorrLetters(updated);
                        }}
                        placeholder={`?`}
                        className="w-12 h-12 text-center text-xl font-bold uppercase rounded-xl border-2 border-indigo-300 focus:border-indigo-600 focus:outline-none bg-white shadow-sm"
                      />
                      <span className="text-[10px] text-slate-400 font-semibold">{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick letter button helpers */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">선택 가능한 점:</span>
                {['D', 'E', 'F'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => {
                      const firstEmpty = corrLetters.findIndex(c => c === '');
                      if (firstEmpty !== -1) {
                        const updated = [...corrLetters];
                        updated[firstEmpty] = ch;
                        setCorrLetters(updated);
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 font-bold text-sm text-slate-700 transition-colors"
                  >
                    {ch}
                  </button>
                ))}
                <button
                  onClick={() => setCorrLetters(['', '', ''])}
                  className="text-xs text-slate-400 hover:text-slate-600 ml-2 underline"
                >
                  지우기
                </button>
              </div>

              <button
                onClick={handleCheckStep4}
                className="mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                대응식 채점하기
              </button>
            </div>

            {/* Step 4 Feedback */}
            {step4Feedback && (
              <div
                className={`p-4 rounded-2xl flex items-start gap-3 animate-pop-in ${
                  step4Feedback.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {step4Feedback.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-sm font-bold">{step4Feedback.message}</div>
                  <div className="text-xs text-slate-600 mt-1">{question.explanation}</div>
                </div>
              </div>
            )}

            {step4Feedback && step4Feedback.success && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    resetState();
                    onNextQuestion();
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  다음 훈련 문제로 이동 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Superpose Modal */}
      <SuperposeModal
        isOpen={showSuperpose}
        onClose={() => setShowSuperpose(false)}
        question={question}
      />
    </div>
  );
}
