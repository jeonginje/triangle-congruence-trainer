/**
 * 바이브코딩 및 학급 플랫폼 점수 전송 & 100점 만점 누적형 차등 배점 계산 엔진
 */

// 문항별 배점 가중치 (11문제 총합 = 정확히 100점 만점)
export const QUESTION_WEIGHTS = {
  q1_sss_basic: 8,       // Lv1 기본 SSS (8점)
  q2_sas_basic: 8,       // Lv1 기본 SAS 끼인각 (8점)
  q3_asa_basic: 8,       // Lv1 기본 ASA 양끝각 (8점)
  q4_sss_rotated: 9,     // Lv2 회전된 SSS (9점)
  q5_sas_rotated: 9,     // Lv2 회전된 SAS (9점)
  q6_ssa_trap: 11,       // Lv3 중요 함정 SSA (11점)
  q7_aaa_trap: 11,       // Lv3 중요 함정 AAA (11점)
  q8_asa_angle_calc: 11, // Lv3 180도 계산 ASA 응용 (11점)
  q9_insufficient_info: 8, // Lv3 조건 부족 (8점)
  q10_symbols_sas: 9,    // Lv4 기호 SAS 판별 (9점)
  q11_symbols_asa: 9,    // Lv4 기호 ASA 대응점 일치 (9점)
};

/**
 * 학급 플랫폼(부모 iframe)으로 점수 전송 함수
 * @param {number} score 0~100 사이의 점수
 * @param {string} details 상세 행동 분석 메시지
 */
export function sendScoreToClassPlatform(score, details) {
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  const payload = {
    type: 'MATH_SCORE_SUBMIT',
    score: finalScore,
    details: details || `삼각형의 합동(SSS·SAS·ASA) 훈련 완료 (${finalScore}점)`,
    timestamp: Date.now(),
  };

  const isInsideIframe = typeof window !== 'undefined' && window.parent && window.parent !== window;

  if (isInsideIframe) {
    try {
      window.parent.postMessage(payload, '*');
      console.log('✅ [Score Submitted to Parent iframe]:', payload);
      return { sent: true, score: finalScore, payload };
    } catch (err) {
      console.error('❌ Failed to postMessage:', err);
      return { sent: false, error: err };
    }
  } else {
    console.log('ℹ️ [Standalone Mode - Score Ready for Submission]:', payload);
    return { sent: false, standalone: true, score: finalScore, payload };
  }
}

/**
 * 학생의 풀이 진행도와 오답 횟수를 엄격히 반영하여 100점 만점 점수를 산출합니다.
 * - 다 맞추었을 때만 100점 만점이 들어갑니다.
 * - 1문제만 풀고 전송하면 해당 문제의 배점(약 8~10점)만 부여됩니다.
 * - 오답 후 재시도 통과 시 부분 점수가 부여됩니다.
 */
export function calculateDifferentiatedScore({
  mode = 'step', // 'step' (11문제 정규 훈련) | 'quiz' (10문제 스피드 퀴즈)
  targetTotal = 11,
  completedCount = 0,
  questionResults = {}, // { [questionId]: { firstTry: boolean, mistakes: number, isTrap: boolean } }
  quizTotalAttempted = 0,
  quizFirstTryCorrect = 0,
  quizWrongTotal = 0,
  superposeUsed = 0,
  hintsUsed = 0,
  streakMax = 0,
}) {
  if (mode === 'quiz') {
    // 스피드 퀴즈 모드: 10문제 단위 평가 (문항당 10점, 10문제 다 맞추면 100점)
    const targetQuizQuestions = 10;
    const basePerQuestion = 10;

    let quizScore = 0;
    // 1차 시도 정답: 문제당 10점 만점
    quizScore = quizFirstTryCorrect * basePerQuestion;

    // 만약 10문제 목표를 넘어서 계속 풀고 있다면 비율로 환산
    if (quizTotalAttempted > 10) {
      const accuracy = quizFirstTryCorrect / quizTotalAttempted;
      quizScore = Math.round(accuracy * 100);
    }

    // 오답 감점 (문항당 부분 감점)
    quizScore = Math.max(0, Math.min(100, quizScore));

    let grade = 'D';
    if (quizScore === 100) grade = 'S+';
    else if (quizScore >= 90) grade = 'S';
    else if (quizScore >= 80) grade = 'A';
    else if (quizScore >= 60) grade = 'B';
    else if (quizScore >= 40) grade = 'C';

    const details = `[스피드퀴즈] ${quizScore}점(${grade}등급) | 풀이: ${quizTotalAttempted}문제 중 ${quizFirstTryCorrect}문제 1차 정답 | 최대연속: ${streakMax}콤보`;

    return {
      totalScore: quizScore,
      grade,
      title: quizScore === 100 ? '스피드 합동 마스터' : quizScore >= 80 ? '실전 판별 우수자' : '실전 훈련 진행 중',
      badgeColor: quizScore >= 80 ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-slate-100 text-slate-800 border-slate-200',
      breakdown: {
        baseAccuracy: { score: quizScore, max: 100, label: '퀴즈 누적 정답 점수 (문제당 10점)' },
      },
      stats: {
        completedCount: quizFirstTryCorrect,
        targetTotal: 10,
        firstTryAccuracy: quizTotalAttempted > 0 ? Math.round((quizFirstTryCorrect / quizTotalAttempted) * 100) : 0,
        wrongAttemptsTotal: quizWrongTotal,
        streakMax,
        superposeUsed,
      },
      summary: `스피드 퀴즈 ${quizFirstTryCorrect}/10문제 정답 (${quizScore}점)`,
      details,
    };
  }

  // --- 단계별 정규 훈련 모드 (11문제 코스) ---
  let totalScore = 0;
  let basicScore = 0;   // 기본 SSS/SAS/ASA (24점 만점)
  let rotatedScore = 0; // 회전/대칭 (18점 만점)
  let trapScore = 0;    // SSA/AAA/180도 계산 함정 (33점 만점)
  let advancedScore = 0;// 조건부족/기호/대응점 (25점 만점)

  let totalMistakes = 0;
  let firstTryCount = 0;

  // 문항별 점수 계산
  Object.entries(questionResults).forEach(([qId, res]) => {
    const maxWeight = QUESTION_WEIGHTS[qId] || Math.round(100 / targetTotal);
    totalMistakes += res.mistakes || 0;

    let earned = 0;
    if (res.firstTry) {
      // 1차 시도 완벽 정답: 해당 문제 배점 100% 획득
      earned = maxWeight;
      firstTryCount += 1;
    } else if (res.mistakes === 1) {
      // 1회 오답 후 통과: 70% 부분 점수
      earned = Math.round(maxWeight * 0.7);
    } else {
      // 2회 이상 오답 후 통과: 40% 부분 점수
      earned = Math.round(maxWeight * 0.4);
    }

    totalScore += earned;

    // 카테고리별 누적
    if (['q1_sss_basic', 'q2_sas_basic', 'q3_asa_basic'].includes(qId)) {
      basicScore += earned;
    } else if (['q4_sss_rotated', 'q5_sas_rotated'].includes(qId)) {
      rotatedScore += earned;
    } else if (['q6_ssa_trap', 'q7_aaa_trap', 'q8_asa_angle_calc'].includes(qId)) {
      trapScore += earned;
    } else {
      advancedScore += earned;
    }
  });

  // 모든 11문제를 1차 시도에 다 맞추었을 때 정확히 100점!
  totalScore = Math.min(100, Math.max(0, totalScore));

  // 등급 및 학생 맞춤 코멘트
  let grade = 'D';
  let title = '기하학 훈련 진행 중';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';

  if (completedCount === targetTotal && totalScore === 100) {
    grade = 'S+';
    title = '삼각형 합동 완전정복 마스터 (만점)';
    badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
  } else if (totalScore >= 90) {
    grade = 'S';
    title = '예리한 기하학 탐정 (우수)';
    badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
  } else if (totalScore >= 75) {
    grade = 'A';
    title = '합동 조건 숙련자';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (totalScore >= 50) {
    grade = 'B';
    title = '합동 조건 연습생';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  } else if (totalScore >= 25) {
    grade = 'C';
    title = '기초 조건 습득 중';
    badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
  } else {
    grade = 'D';
    title = '훈련 시작 단계';
    badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
  }

  // 상세 행동 분석 메시지
  const progressText = `${completedCount}/${targetTotal}문제 완료`;
  const details = `[중1 삼각형합동] ${totalScore}점(${grade}등급) | 진행도: ${progressText} (1차정답 ${firstTryCount}개, 총오답 ${totalMistakes}회) | 함정점수: ${trapScore}/33점`;

  return {
    totalScore,
    grade,
    title,
    badgeColor,
    breakdown: {
      basicAccuracy: { score: basicScore, max: 24, label: '기본 조건 판별 (SSS·SAS·ASA 기초 3문항)' },
      rotatedAccuracy: { score: rotatedScore, max: 18, label: '회전 및 대칭형 판별 (방향 바뀐 2문항)' },
      trapDefense: { score: trapScore, max: 33, label: '함정 극복력 (SSA·AAA·180° 계산 3문항)' },
      advancedAccuracy: { score: advancedScore, max: 25, label: '조건부족 및 기호/대응점 완성 (3문항)' },
    },
    stats: {
      completedCount,
      targetTotal,
      firstTryCount,
      wrongAttemptsTotal: totalMistakes,
      hintsUsed,
      superposeUsed,
      streakMax,
    },
    summary: `${title} - ${progressText} (${totalScore}점)`,
    details,
  };
}
