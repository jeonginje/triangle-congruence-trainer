// Question database for Middle School Grade 1 Triangle Congruence (SSS, SAS, ASA)

export const CURATED_QUESTIONS = [
  // --- LEVEL 1: 기본 식별 (SSS, SAS, ASA의 기본 형태) ---
  {
    id: 'q1_sss_basic',
    level: 1,
    title: '세 변의 길이가 각각 주어졌을 때',
    description: '두 삼각형의 변의 길이를 조사해 보세요.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 0, to: 1, text: '6cm', ticks: 1 },
        { from: 1, to: 2, text: '8cm', ticks: 2 },
        { from: 2, to: 0, text: '7cm', ticks: 3 },
      ],
      angles: [],
    },
    triangleB: {
      name: 'DEF',
      rotation: 0,
      vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
      edges: [
        { from: 0, to: 1, text: '6cm', ticks: 1 },
        { from: 1, to: 2, text: '8cm', ticks: 2 },
        { from: 2, to: 0, text: '7cm', ticks: 3 },
      ],
      angles: [],
    },
    knownSides: 3,
    knownAngles: 0,
    isIncludedAngle: null,
    isBothEndAngles: null,
    correctAnswer: 'SSS',
    congruent: true,
    matchingVertices: 'DEF',
    hint: '주어진 정보를 세어보세요. 변이 3개 주어졌고 각은 없습니다.',
    explanation: '대응하는 세 변의 길이가 각각 6cm, 8cm, 7cm로 같으므로 [SSS 합동]입니다. (대응점: A-D, B-E, C-F)',
  },
  {
    id: 'q2_sas_basic',
    level: 1,
    title: '두 변과 그 사이의 각이 주어졌을 때',
    description: '각의 위치가 두 변의 "끼인각"인지 잘 살펴보세요.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 0, to: 1, text: '5cm', ticks: 1 },
        { from: 1, to: 2, text: '9cm', ticks: 2 },
      ],
      angles: [
        { vertex: 1, text: '50°', marker: 'arc1' },
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 0,
      vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
      edges: [
        { from: 0, to: 1, text: '5cm', ticks: 1 },
        { from: 1, to: 2, text: '9cm', ticks: 2 },
      ],
      angles: [
        { vertex: 1, text: '50°', marker: 'arc1' },
      ],
    },
    knownSides: 2,
    knownAngles: 1,
    isIncludedAngle: true,
    isBothEndAngles: null,
    correctAnswer: 'SAS',
    congruent: true,
    matchingVertices: 'DEF',
    hint: '변 5cm와 9cm가 만나는 꼭짓점 B와 E에 각각 50° 각이 있습니다.',
    explanation: '두 변의 길이(5cm, 9cm)가 각각 같고, 그 사이의 "끼인각"(50°)의 크기가 같으므로 [SAS 합동]입니다.',
  },
  {
    id: 'q3_asa_basic',
    level: 1,
    title: '한 변과 양 끝 각이 주어졌을 때',
    description: '주어진 각들이 알려진 변의 양 끝에 위치하는지 확인하세요.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 1, to: 2, text: '8cm', ticks: 1 },
      ],
      angles: [
        { vertex: 1, text: '65°', marker: 'arc1' },
        { vertex: 2, text: '45°', marker: 'arc2' },
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 0,
      vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
      edges: [
        { from: 1, to: 2, text: '8cm', ticks: 1 },
      ],
      angles: [
        { vertex: 1, text: '65°', marker: 'arc1' },
        { vertex: 2, text: '45°', marker: 'arc2' },
      ],
    },
    knownSides: 1,
    knownAngles: 2,
    isIncludedAngle: null,
    isBothEndAngles: true,
    correctAnswer: 'ASA',
    congruent: true,
    matchingVertices: 'DEF',
    hint: '길이가 8cm인 선분 BC의 양 끝 꼭짓점 B(65°)와 C(45°)에 각이 주어졌습니다.',
    explanation: '대응하는 한 변의 길이(8cm)가 같고, 그 양 끝 각(65°, 45°)의 크기가 각각 같으므로 [ASA 합동]입니다.',
  },

  // --- LEVEL 2: 회전 및 대칭 (방향이 바뀐 삼각형) ---
  {
    id: 'q4_sss_rotated',
    level: 2,
    title: '회전된 두 삼각형의 세 변 비교',
    description: '오른쪽 삼각형이 회전되어 있습니다. 같은 길이의 변끼리 짝지어보세요.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 0, to: 1, text: '4cm', ticks: 1 },
        { from: 1, to: 2, text: '7cm', ticks: 2 },
        { from: 2, to: 0, text: '6cm', ticks: 3 },
      ],
      angles: [],
    },
    triangleB: {
      name: 'DEF',
      rotation: 120,
      vertices: [{ label: 'E' }, { label: 'F' }, { label: 'D' }],
      edges: [
        { from: 0, to: 1, text: '4cm', ticks: 1 },
        { from: 1, to: 2, text: '7cm', ticks: 2 },
        { from: 2, to: 0, text: '6cm', ticks: 3 },
      ],
      angles: [],
    },
    knownSides: 3,
    knownAngles: 0,
    isIncludedAngle: null,
    isBothEndAngles: null,
    correctAnswer: 'SSS',
    congruent: true,
    matchingVertices: 'EFD',
    hint: '삼각형이 회전되어 있지만 세 변의 길이가 4cm, 6cm, 7cm로 완벽히 짝이 맞습니다.',
    explanation: '방향은 다르지만 세 변의 길이가 각각 같으므로 [SSS 합동]입니다! (대응점: A ↔ E, B ↔ F, C ↔ D)',
  },
  {
    id: 'q5_sas_rotated',
    level: 2,
    title: '돌아간 삼각형에서 끼인각 확인',
    description: '두 변 사이의 꼭짓점에 각이 있는지 확인해 보세요.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 0, to: 1, text: '6cm', ticks: 1 },
        { from: 0, to: 2, text: '8cm', ticks: 2 },
      ],
      angles: [
        { vertex: 0, text: '40°', marker: 'arc1' },
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 180,
      vertices: [{ label: 'E' }, { label: 'D' }, { label: 'F' }],
      edges: [
        { from: 0, to: 1, text: '6cm', ticks: 1 },
        { from: 0, to: 2, text: '8cm', ticks: 2 },
      ],
      angles: [
        { vertex: 0, text: '40°', marker: 'arc1' },
      ],
    },
    knownSides: 2,
    knownAngles: 1,
    isIncludedAngle: true,
    isBothEndAngles: null,
    correctAnswer: 'SAS',
    congruent: true,
    matchingVertices: 'EDF',
    hint: '△ABC에서는 변 AB와 AC 사이의 각 A(40°)이고, △DEF에서는 변 ED와 EF 사이의 각 E(40°)입니다.',
    explanation: '두 변(6cm, 8cm)과 그 끼인각(40°)이 각각 같으므로 [SAS 합동]입니다! (대응점: A ↔ E, B ↔ D, C ↔ F)',
  },

  // --- LEVEL 3: 시험 단골 함정 (SSA 함정, AAA 함정, 각 계산 ASA) ---
  {
    id: 'q6_ssa_trap',
    level: 3,
    title: '⚠️ [주의] 끼인각이 아닌 다른 각이 주어졌을 때 (SSA 함정)',
    description: '주어진 각이 두 변의 "끼인각"인지 눈을 크게 뜨고 확인하세요!',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 0, to: 1, text: '7cm', ticks: 1 },
        { from: 1, to: 2, text: '9cm', ticks: 2 },
      ],
      angles: [
        { vertex: 0, text: '45°', marker: 'arc1' }, // NOT between AB and BC (angle at B would be included!)
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 0,
      vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
      edges: [
        { from: 0, to: 1, text: '7cm', ticks: 1 },
        { from: 1, to: 2, text: '9cm', ticks: 2 },
      ],
      angles: [
        { vertex: 0, text: '45°', marker: 'arc1' },
      ],
    },
    knownSides: 2,
    knownAngles: 1,
    isIncludedAngle: false, // TRAP!
    isBothEndAngles: null,
    correctAnswer: 'NONE',
    congruent: false,
    matchingVertices: null,
    hint: '두 변 AB(7cm)와 BC(9cm) 사이의 끼인각은 각 B입니다. 그런데 문제에서 주어진 각은 각 A입니다!',
    explanation: '❌ [합동이라 할 수 없습니다!] 두 변과 그 "끼인각"이 아니라 다른 각이 주어지면(SSA), 하나의 삼각형으로 결정되지 않고 서로 다른 두 가지 모양의 삼각형이 만들어질 수 있습니다!',
  },
  {
    id: 'q7_aaa_trap',
    level: 3,
    title: '⚠️ [주의] 세 각의 크기만 모두 같을 때 (AAA 함정)',
    description: '변의 길이가 하나도 주어지지 않았습니다.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [],
      angles: [
        { vertex: 0, text: '40°', marker: 'arc1' },
        { vertex: 1, text: '60°', marker: 'arc2' },
        { vertex: 2, text: '80°', marker: 'arc3' },
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 0,
      customPoints: [
        { x: 125, y: 80 },
        { x: 70, y: 185 },
        { x: 205, y: 185 },
      ],
      vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
      edges: [],
      angles: [
        { vertex: 0, text: '40°', marker: 'arc1' },
        { vertex: 1, text: '60°', marker: 'arc2' },
        { vertex: 2, text: '80°', marker: 'arc3' },
      ],
    },
    knownSides: 0,
    knownAngles: 3,
    isIncludedAngle: null,
    isBothEndAngles: null,
    correctAnswer: 'NONE',
    congruent: false,
    matchingVertices: null,
    hint: '세 각이 같으면 모양은 같지만, 크기가 얼마든지 더 크거나 작을 수 있습니다.',
    explanation: '❌ [합동이 아닙니다!] 세 각의 크기가 같으면 모양은 같지만 크기가 다를 수 있어 포개어지지 않습니다. (중2 때 배울 "닮음" 관계입니다. 중1 합동 조건에는 AAA가 없습니다!)',
  },
  {
    id: 'q8_asa_angle_calc',
    level: 3,
    title: '💡 [응용] 삼각형 내각의 합(180°)을 이용해 양 끝 각 찾기',
    description: '주어진 각이 양 끝 각이 아니더라도, 나머지 한 각을 계산해 보세요!',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 1, to: 2, text: '8cm', ticks: 1 }, // BC = 8
      ],
      angles: [
        { vertex: 0, text: '50°', marker: 'arc1' }, // angle A = 50°
        { vertex: 1, text: '60°', marker: 'arc2' }, // angle B = 60° (then angle C = 180 - 110 = 70°)
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 0,
      vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
      edges: [
        { from: 1, to: 2, text: '8cm', ticks: 1 }, // EF = 8
      ],
      angles: [
        { vertex: 1, text: '60°', marker: 'arc2' }, // angle E = 60°
        { vertex: 2, text: '70°', marker: 'arc3' }, // angle F = 70°
      ],
    },
    knownSides: 1,
    knownAngles: 2,
    isIncludedAngle: null,
    isBothEndAngles: true, // after calculation!
    correctAnswer: 'ASA',
    congruent: true,
    matchingVertices: 'DEF',
    hint: '△ABC에서 세 각의 합은 180°이므로 각 C = 180° - (50° + 60°) = 70° 입니다. 이제 선분 BC(8cm)의 양 끝 각을 비교해 보세요!',
    explanation: '대응하는 한 변(8cm)과 그 양 끝 각이 60°, 70°로 같아지므로 [ASA 합동]입니다! 🌟 시험에 가장 많이 나오는 유형으로, 두 각이 주어지면 나머지 한 각을 180°에서 빼서 양 끝 각을 확인해야 합니다!',
  },
  {
    id: 'q9_insufficient_info',
    level: 3,
    title: '⚠️ 조건 부족 (정보가 2개만 주어졌을 때)',
    description: '삼각형이 하나로 정해지려면 조건이 최소 몇 개 필요할까요?',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 0, to: 1, text: '6cm', ticks: 1 },
      ],
      angles: [
        { vertex: 0, text: '55°', marker: 'arc1' },
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 0,
      customPoints: [
        { x: 120, y: 45 },   // D
        { x: 45, y: 195 },   // E (DE = 6cm, angle D = 55°)
        { x: 190, y: 155 },  // F is different position!
      ],
      vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
      edges: [
        { from: 0, to: 1, text: '6cm', ticks: 1 },
      ],
      angles: [
        { vertex: 0, text: '55°', marker: 'arc1' },
      ],
    },
    knownSides: 1,
    knownAngles: 1,
    isIncludedAngle: null,
    isBothEndAngles: null,
    correctAnswer: 'NONE',
    congruent: false,
    matchingVertices: null,
    hint: '현재 알려진 조건은 한 변(6cm)과 한 각(55°)뿐입니다. 삼각형의 합동 조건(SSS, SAS, ASA)은 모두 3개의 단서가 필요합니다!',
    explanation: '❌ [합동 조건 부족!] 삼각형의 합동을 증명하려면 적어도 3가지 요소(변 3개, 두 변과 끼인각, 한 변과 양 끝 각)의 정보가 있어야 합니다. 단서가 2개뿐이면 그림처럼 전혀 다른 모양의 삼각형이 만들어질 수 있습니다.',
  },

  // --- LEVEL 4: 기호로만 주어진 정밀 판별 ---
  {
    id: 'q10_symbols_sas',
    level: 4,
    title: '기호(눈금과 호)로만 주어진 SAS 합동',
    description: '숫자가 없어도 눈금(/, //)과 각 호())를 보고 판별할 수 있습니다.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 0, to: 1, ticks: 1 },
        { from: 1, to: 2, ticks: 2 },
      ],
      angles: [
        { vertex: 1, marker: 'arc1' },
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 60,
      vertices: [{ label: 'F' }, { label: 'D' }, { label: 'E' }],
      edges: [
        { from: 0, to: 1, ticks: 1 },
        { from: 1, to: 2, ticks: 2 },
      ],
      angles: [
        { vertex: 1, marker: 'arc1' },
      ],
    },
    knownSides: 2,
    knownAngles: 1,
    isIncludedAngle: true,
    isBothEndAngles: null,
    correctAnswer: 'SAS',
    congruent: true,
    matchingVertices: 'FDE',
    hint: '△ABC에서 눈금 1개와 눈금 2개 사이의 각 B에 호가 있습니다. △DEF에서도 눈금 1개와 2개 사이의 각 D에 호가 있습니다.',
    explanation: '두 변의 길이가 각각 같고, 그 사이의 끼인각의 크기가 같으므로 [SAS 합동]입니다! (대응점: A ↔ F, B ↔ D, C ↔ E)',
  },
  {
    id: 'q11_symbols_asa',
    level: 4,
    title: '기호로 주어진 ASA 합동 (대응점 찾기)',
    description: '한 변과 양 끝 각의 기호를 확인해 보세요.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [
        { from: 1, to: 2, ticks: 2 },
      ],
      angles: [
        { vertex: 1, marker: 'dot' },
        { vertex: 2, marker: 'cross' },
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: 180,
      vertices: [{ label: 'E' }, { label: 'F' }, { label: 'D' }],
      edges: [
        { from: 1, to: 2, ticks: 2 },
      ],
      angles: [
        { vertex: 1, marker: 'dot' },
        { vertex: 2, marker: 'cross' },
      ],
    },
    knownSides: 1,
    knownAngles: 2,
    isIncludedAngle: null,
    isBothEndAngles: true,
    correctAnswer: 'ASA',
    congruent: true,
    matchingVertices: 'EFD',
    hint: '선분 BC(2줄 눈금)의 양 끝에 ●와 ✕ 각이 있습니다. 선분 FD(2줄 눈금)의 양 끝에도 ●와 ✕ 각이 있습니다.',
    explanation: '대응하는 한 변의 길이가 같고 그 양 끝 각이 각각 같으므로 [ASA 합동]입니다! (대응점: B(●) ↔ F(●), C(✕) ↔ D(✕), A ↔ E)',
  }
];

// Generator for random unlimited challenge questions
export function generateRandomQuestion(level = 1) {
  const types = ['SSS', 'SAS', 'ASA', 'SSA_TRAP', 'AAA_TRAP'];
  let chosenType;

  if (level === 1) {
    chosenType = ['SSS', 'SAS', 'ASA'][Math.floor(Math.random() * 3)];
  } else if (level === 2) {
    chosenType = ['SSS', 'SAS', 'ASA', 'SSA_TRAP'][Math.floor(Math.random() * 4)];
  } else {
    chosenType = types[Math.floor(Math.random() * types.length)];
  }

  const rotations = [0, 60, 90, 120, 180, 240];
  const rot = level > 1 ? rotations[Math.floor(Math.random() * rotations.length)] : 0;

  const sideA = 4 + Math.floor(Math.random() * 4);
  const sideB = sideA + 2 + Math.floor(Math.random() * 3);
  const sideC = sideB - 1 + Math.floor(Math.random() * 2);

  const angle1 = 40 + Math.floor(Math.random() * 4) * 10;
  const angle2 = 50 + Math.floor(Math.random() * 3) * 10;

  if (chosenType === 'SSS') {
    return {
      id: `gen_${Date.now()}`,
      level,
      title: '랜덤 훈련: 세 변의 조건 조사',
      description: '두 삼각형의 변들을 조사하여 합동 여부를 확인하세요.',
      triangleA: {
        name: 'ABC',
        vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
        edges: [
          { from: 0, to: 1, text: `${sideA}cm`, ticks: 1 },
          { from: 1, to: 2, text: `${sideB}cm`, ticks: 2 },
          { from: 2, to: 0, text: `${sideC}cm`, ticks: 3 },
        ],
        angles: [],
      },
      triangleB: {
        name: 'DEF',
        rotation: rot,
        vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
        edges: [
          { from: 0, to: 1, text: `${sideA}cm`, ticks: 1 },
          { from: 1, to: 2, text: `${sideB}cm`, ticks: 2 },
          { from: 2, to: 0, text: `${sideC}cm`, ticks: 3 },
        ],
        angles: [],
      },
      knownSides: 3,
      knownAngles: 0,
      isIncludedAngle: null,
      isBothEndAngles: null,
      correctAnswer: 'SSS',
      congruent: true,
      matchingVertices: 'DEF',
      explanation: `세 변의 길이(${sideA}cm, ${sideB}cm, ${sideC}cm)가 각각 같으므로 [SSS 합동]입니다.`,
    };
  }

  if (chosenType === 'SAS') {
    return {
      id: `gen_${Date.now()}`,
      level,
      title: '랜덤 훈련: 두 변과 각 조사',
      description: '각이 두 변의 끼인각인지 꼼꼼히 확인하세요.',
      triangleA: {
        name: 'ABC',
        vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
        edges: [
          { from: 0, to: 1, text: `${sideA}cm`, ticks: 1 },
          { from: 1, to: 2, text: `${sideB}cm`, ticks: 2 },
        ],
        angles: [
          { vertex: 1, text: `${angle1}°`, marker: 'arc1' },
        ],
      },
      triangleB: {
        name: 'DEF',
        rotation: rot,
        vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
        edges: [
          { from: 0, to: 1, text: `${sideA}cm`, ticks: 1 },
          { from: 1, to: 2, text: `${sideB}cm`, ticks: 2 },
        ],
        angles: [
          { vertex: 1, text: `${angle1}°`, marker: 'arc1' },
        ],
      },
      knownSides: 2,
      knownAngles: 1,
      isIncludedAngle: true,
      isBothEndAngles: null,
      correctAnswer: 'SAS',
      congruent: true,
      matchingVertices: 'DEF',
      explanation: `두 변(${sideA}cm, ${sideB}cm)과 그 사이의 끼인각(${angle1}°)이 같으므로 [SAS 합동]입니다.`,
    };
  }

  if (chosenType === 'ASA') {
    return {
      id: `gen_${Date.now()}`,
      level,
      title: '랜덤 훈련: 한 변과 각 조사',
      description: '변의 양 끝 각이 일치하는지 조사하세요.',
      triangleA: {
        name: 'ABC',
        vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
        edges: [
          { from: 1, to: 2, text: `${sideB}cm`, ticks: 2 },
        ],
        angles: [
          { vertex: 1, text: `${angle1}°`, marker: 'arc1' },
          { vertex: 2, text: `${angle2}°`, marker: 'arc2' },
        ],
      },
      triangleB: {
        name: 'DEF',
        rotation: rot,
        vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
        edges: [
          { from: 1, to: 2, text: `${sideB}cm`, ticks: 2 },
        ],
        angles: [
          { vertex: 1, text: `${angle1}°`, marker: 'arc1' },
          { vertex: 2, text: `${angle2}°`, marker: 'arc2' },
        ],
      },
      knownSides: 1,
      knownAngles: 2,
      isIncludedAngle: null,
      isBothEndAngles: true,
      correctAnswer: 'ASA',
      congruent: true,
      matchingVertices: 'DEF',
      explanation: `한 변(${sideB}cm)과 그 양 끝 각(${angle1}°, ${angle2}°)이 같으므로 [ASA 합동]입니다.`,
    };
  }

  if (chosenType === 'SSA_TRAP') {
    return {
      id: `gen_${Date.now()}`,
      level,
      title: '⚠️ 랜덤 함정 훈련: 각의 위치 조사',
      description: '각이 두 변의 끼인각인가요, 아니면 다른 각인가요?',
      triangleA: {
        name: 'ABC',
        vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
        edges: [
          { from: 0, to: 1, text: `${sideA}cm`, ticks: 1 },
          { from: 1, to: 2, text: `${sideB}cm`, ticks: 2 },
        ],
        angles: [
          { vertex: 0, text: `${angle1}°`, marker: 'arc1' }, // NOT between edge 0-1 and edge 1-2!
        ],
      },
      triangleB: {
        name: 'DEF',
        rotation: rot,
        vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
        edges: [
          { from: 0, to: 1, text: `${sideA}cm`, ticks: 1 },
          { from: 1, to: 2, text: `${sideB}cm`, ticks: 2 },
        ],
        angles: [
          { vertex: 0, text: `${angle1}°`, marker: 'arc1' },
        ],
      },
      knownSides: 2,
      knownAngles: 1,
      isIncludedAngle: false,
      isBothEndAngles: null,
      correctAnswer: 'NONE',
      congruent: false,
      matchingVertices: null,
      explanation: '❌ [합동이 아님!] 변 2개와 각 1개가 주어졌지만, 주어진 각이 두 변 사이의 "끼인각"이 아니라 다른 각입니다(SSA). 두 가지 모양의 삼각형이 생길 수 있으므로 합동이라 할 수 없습니다!',
    };
  }

  // AAA_TRAP
  return {
    id: `gen_${Date.now()}`,
    level,
    title: '⚠️ 랜덤 함정 훈련: 각 3개만 주어졌을 때',
    description: '변의 길이가 주어졌는지 살펴보세요.',
    triangleA: {
      name: 'ABC',
      vertices: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
      edges: [],
      angles: [
        { vertex: 0, text: '45°', marker: 'arc1' },
        { vertex: 1, text: '65°', marker: 'arc2' },
        { vertex: 2, text: '70°', marker: 'arc3' },
      ],
    },
    triangleB: {
      name: 'DEF',
      rotation: rot,
      vertices: [{ label: 'D' }, { label: 'E' }, { label: 'F' }],
      edges: [],
      angles: [
        { vertex: 0, text: '45°', marker: 'arc1' },
        { vertex: 1, text: '65°', marker: 'arc2' },
        { vertex: 2, text: '70°', marker: 'arc3' },
      ],
    },
    knownSides: 0,
    knownAngles: 3,
    isIncludedAngle: null,
    isBothEndAngles: null,
    correctAnswer: 'NONE',
    congruent: false,
    matchingVertices: null,
    explanation: '❌ [합동이 아님!] 세 각(AAA)만 주어지면 크기가 얼마든지 다를 수 있어 합동 조건이 되지 않습니다.',
  };
}
