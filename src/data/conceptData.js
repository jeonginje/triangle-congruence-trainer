// Conceptual reference cards and decision tree data for Middle School Grade 1

export const CONCEPT_CARDS = [
  {
    id: 'sss',
    code: 'SSS 합동',
    fullName: 'Side - Side - Side (세 변)',
    summary: '대응하는 세 변의 길이가 각각 같을 때',
    formula: 'AB = DE, BC = EF, CA = FD',
    color: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    keyPoint: '각도 정보가 하나도 없어도, 세 변의 길이만 각각 같으면 삼각형의 모양과 크기는 단 하나로 결정됩니다.',
    checklist: [
      '삼각형 1의 세 변 길이 확인 (예: 5cm, 7cm, 8cm)',
      '삼각형 2에서 짝이 맞는 세 변이 모두 있는지 확인',
      '회전되어 있어도 세 변이 1:1로 일치하면 무조건 SSS 합동!',
    ],
    trap: '세 변 중 2개만 같고 나머지 하나가 다르면 합동이 아닙니다.',
  },
  {
    id: 'sas',
    code: 'SAS 합동',
    fullName: 'Side - Angle - Side (두 변과 끼인각)',
    summary: '대응하는 두 변의 길이가 각각 같고, 그 "끼인각"의 크기가 같을 때',
    formula: 'AB = DE, BC = EF, ∠B = ∠E',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    keyPoint: '반드시 알려진 두 변 "사이에 낀 각(끼인각)"이어야 합니다! 알파벳 순서대로 S와 S 사이에 A가 쏙 들어가 있습니다.',
    checklist: [
      '같은 길이의 변 2쌍 확인 (Side 2개)',
      '그 두 변이 만나는 꼭짓점의 각이 같은지 확인 (Angle 1개)',
      '⚠️ 각이 두 변 사이가 아닌 엉뚱한 곳에 있으면 SSA 함정!',
    ],
    trap: '★ 중1 단골 함정 1위 (SSA): 두 변과 끼인각이 아닌 다른 각이 주어지면, 길이가 같은 변을 컴퍼스처럼 돌렸을 때 둔각삼각형과 예각삼각형 2가지가 만들어질 수 있어 합동이 성립하지 않습니다!',
  },
  {
    id: 'asa',
    code: 'ASA 합동',
    fullName: 'Angle - Side - Angle (한 변과 양 끝 각)',
    summary: '대응하는 한 변의 길이가 같고, 그 "양 끝 각"의 크기가 각각 같을 때',
    formula: '∠B = ∠E, BC = EF, ∠C = ∠F',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    keyPoint: '알려진 변의 양쪽 끝에 위치한 두 각이어야 합니다. A와 A 사이에 S가 끼어 있는 모양새입니다.',
    checklist: [
      '같은 길이의 변 1쌍 확인 (Side 1개)',
      '그 변의 양 끝 꼭짓점의 각 2개가 같은지 확인 (Angle 2개)',
      '💡 양 끝 각이 아니더라도, 두 각을 알면 180° - (두 각의 합)으로 양 끝 각을 구할 수 있어 결국 ASA 합동 성립!',
    ],
    trap: '★ 시험 꿀팁: 두 각의 크기와 "다른 변"이 주어져도(AAS), 삼각형 내각의 합은 항상 180°이므로 나머지 한 각을 구하면 항상 양 끝 각을 알 수 있습니다!',
  },
  {
    id: 'non_congruent',
    code: '합동이 아닌 대표적 함정',
    fullName: 'AAA 및 SSA 주의보',
    summary: '시험에서 가장 많이 낚이는 오답 유형 2가지',
    formula: 'AAA ≠ 합동, SSA ≠ 합동',
    color: 'from-rose-500 to-red-600',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    keyPoint: '변의 길이가 하나도 없거나(AAA), 각의 위치가 엉뚱하면(SSA) 크기나 모양이 달라질 수 있습니다.',
    checklist: [
      'AAA (세 각만 같음): 모양은 같지만 돋보기로 확대한 것처럼 크기가 다를 수 있음 (중2 닮음)',
      'SSA (끼인각 아님): 한 변을 회전시켰을 때 서로 다른 2개의 삼각형이 그려질 수 있음',
      '조건 부족: 변 1개+각 1개 등 정보가 2개 이하인 경우',
    ],
    trap: '합동 조건은 오직 [SSS, SAS, ASA] 3가지만 존재합니다! (AAA, SSA는 절대 정답이 아닙니다)',
  }
];

export const FLOWCHART_STEPS = [
  {
    step: 1,
    title: '1단계: 주어진 변(S)의 개수를 센다!',
    options: [
      { count: '변 3개', desc: '세 변의 길이가 각각 같은지 확인', next: '➡️ 세 변이 모두 같으면 [SSS 합동] 완성!' },
      { count: '변 2개', desc: '각 1개가 주어졌는지 확인', next: '➡️ 2단계 (끼인각 점검)으로 이동!' },
      { count: '변 1개', desc: '각 2개가 주어졌는지 확인', next: '➡️ 3단계 (양 끝 각 점검)으로 이동!' },
      { count: '변 0개', desc: '세 각(AAA)만 주어졌다면?', next: '❌ 크기가 다를 수 있으므로 [합동 아님]!' },
    ]
  },
  {
    step: 2,
    title: '2단계 (변 2개일 때): 그 각이 "끼인각"인가?',
    options: [
      { case: '두 변이 만나는 꼭짓점의 각이다', result: '✅ 정답! [SAS 합동]' },
      { case: '두 변 사이가 아닌 다른 꼭짓점의 각이다', result: '❌ 함정! SSA는 하나로 정해지지 않으므로 [합동 아님]' },
    ]
  },
  {
    step: 3,
    title: '3단계 (변 1개일 때): 그 변의 "양 끝 각"인가?',
    options: [
      { case: '알려진 변의 양 끝 꼭짓점의 각이다', result: '✅ 정답! [ASA 합동]' },
      { case: '다른 각이지만 두 각이 주어져 있다', result: '💡 180° - (두 각의 합)으로 양 끝 각을 계산하면 결국 [ASA 합동]!' },
    ]
  }
];
