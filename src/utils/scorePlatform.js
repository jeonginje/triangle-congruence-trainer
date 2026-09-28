/**
 * 바이브코딩 및 학급 플랫폼 점수 전송 & 100점 만점 차등 배점 계산 엔진
 */

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

  // Check if running inside iframe
  const isInsideIframe = typeof window !== 'undefined' && window.parent && window.parent !== window;

  if (isInsideIframe) {
    try {
      window.parent.postMessage(payload, '*');
      console.log('✅ [Score Submitted to Parent]', payload);
      return { sent: true, score: finalScore, payload };
    } catch (err) {
      console.error('❌ Failed to postMessage:', err);
      return { sent: false, error: err };
    }
  } else {
    // If opened directly (not in iframe), log for teacher/developer debugging
    console.log('ℹ️ [Standalone Mode - Score Ready for Submission]:', payload);
    return { sent: false, standalone: true, score: finalScore, payload };
  }
}

/**
 * 학생의 행동(시도 횟수, 오답 수, 함정 통과 여부, 힌트 의존도, 포개어보기 활용 등)을 분석하여
 * 100점 만점 차등 점수와 세부 분석 피드백을 계산합니다.
 *
 * [차등 배점 기준표 - 100점 만점]
 * 1. 기본 판별 정확도 (최대 55점): SSS, SAS, ASA 각 단서 식별 및 판정 (1차 시도 통과율)
 * 2. 함정 방어 능력 (최대 25점): 중1 최고 빈출 함정(SSA 끼인각 아님, AAA 크기 다름, 180° 계산 ASA) 정복
 * 3. 대응점 표기 정확도 (최대 15점): 서술형 대응 꼭짓점 순서(△ABC ≡ △DEF) 1차 작성 성공 여부
 * 4. 능동적 탐구 태도 (최대 5점): 힌트에만 의존하지 않고 '포개어보기' 시뮬레이션을 활용하여 스스로 검증
 */
export function calculateDifferentiatedScore(sessionData) {
  const {
    totalAttempted = 0,
    firstTryCorrect = 0,
    wrongAttemptsTotal = 0,
    trapsFaced = 0,
    trapsCorrectFirstTry = 0,
    corrOrderFaced = 0,
    corrOrderCorrectFirstTry = 0,
    hintsUsed = 0,
    superposeUsed = 0,
    streakMax = 0,
  } = sessionData;

  if (totalAttempted === 0) {
    return {
      totalScore: 0,
      breakdown: { baseAccuracy: 0, trapDefense: 0, corrAccuracy: 0, exploration: 0 },
      grade: 'F',
      summary: '풀이 기록이 없습니다.',
      details: '문제를 풀고 점수를 획득해 보세요.',
    };
  }

  // 1. 기본 정확도 (55점 만점)
  const accuracyRate = firstTryCorrect / totalAttempted;
  // 오답 누적에 따른 소폭 감점 (문제당 1.5점 감점 한도)
  const penalty = Math.min(15, wrongAttemptsTotal * 1.5);
  const baseScore = Math.max(10, Math.round(accuracyRate * 55 - penalty * 0.4));

  // 2. 함정 방어 점수 (25점 만점)
  // SSA, AAA, 180도 계산 문제를 첫 시도에 틀리지 않고 간파했는가?
  let trapScore = 0;
  if (trapsFaced > 0) {
    const trapRatio = trapsCorrectFirstTry / trapsFaced;
    trapScore = Math.round(trapRatio * 25);
  } else {
    // 함정 문제를 마주치지 않은 경우 기본 정답률로 비례 환산
    trapScore = Math.round(accuracyRate * 25);
  }

  // 3. 서술형 대응점 순서 점수 (15점 만점)
  let corrScore = 0;
  if (corrOrderFaced > 0) {
    const corrRatio = corrOrderCorrectFirstTry / corrOrderFaced;
    corrScore = Math.round(corrRatio * 15);
  } else {
    corrScore = Math.round(accuracyRate * 15);
  }

  // 4. 탐구 태도 및 보너스 (5점 만점)
  // 힌트를 무작정 보지 않고, 포개어보기 시뮬레이션을 1회 이상 직접 실행해 보았는가?
  let explorationScore = 0;
  if (superposeUsed >= 1) explorationScore += 3;
  if (streakMax >= 3) explorationScore += 2;
  // 힌트 과다 사용 감점
  if (hintsUsed > totalAttempted * 0.7) explorationScore = Math.max(0, explorationScore - 2);

  // 최종 점수 합산 (최대 100점, 최소 0점)
  const totalScore = Math.min(100, Math.max(15, baseScore + trapScore + corrScore + explorationScore));

  // 등급 및 학생 행동 코멘트 결정
  let grade = 'C';
  let title = '합동 조건 연습생';
  let badgeColor = 'bg-amber-100 text-amber-800';

  if (totalScore >= 95) {
    grade = 'S';
    title = '삼각형 합동 완전정복 마스터';
    badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
  } else if (totalScore >= 85) {
    grade = 'A';
    title = '예리한 기하학 탐정';
    badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
  } else if (totalScore >= 70) {
    grade = 'B';
    title = '합동 조건 숙련자';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else {
    grade = 'C';
    title = '개념 보충 필요';
    badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
  }

  // 상세 행동 분석 메시지 (LMS 저장용)
  const details = `[중1 삼각형합동] ${totalScore}점(${grade}등급) | 1차정답률: ${Math.round(accuracyRate * 100)}% | 함정방어: ${trapScore}/25점 | 대응점일치: ${corrScore}/15점 | 최대스트릭: ${streakMax}회`;

  return {
    totalScore,
    grade,
    title,
    badgeColor,
    breakdown: {
      baseAccuracy: { score: baseScore, max: 55, label: '기본 조건 판별력 (SSS·SAS·ASA)' },
      trapDefense: { score: trapScore, max: 25, label: '함정 극복력 (SSA 끼인각·AAA 방어)' },
      corrAccuracy: { score: corrScore, max: 15, label: '서술형 대응점 순서 일치도' },
      exploration: { score: explorationScore, max: 5, label: '포개어보기 탐구 및 연속정답 보너스' },
    },
    stats: {
      totalAttempted,
      firstTryAccuracy: Math.round(accuracyRate * 100),
      wrongAttemptsTotal,
      trapsSuccessRate: trapsFaced > 0 ? Math.round((trapsCorrectFirstTry / trapsFaced) * 100) : 100,
      streakMax,
      hintsUsed,
      superposeUsed,
    },
    summary: `${title} (${grade}등급, ${totalScore}점)`,
    details,
  };
}
