export type SubjectId = 
  | 'english_reading'
  | 'english_listening'
  | 'math_1a'
  | 'math_2bc'
  | 'japanese_modern'
  | 'japanese_classic'
  | 'japanese_chinese'
  | 'science'
  | 'social'
  | 'info';

export interface SubjectLevel {
  id: SubjectId;
  name: string;
  category: 'english' | 'math' | 'japanese' | 'science' | 'social' | 'info';
  level: number; // 1 to 99
  subName?: string;
}

export type ExamType = 'shinken' | 'zento' | 'sundai';
export type ExamFormat = 'mark' | 'written'; // マーク型（共テ模試） or 記述型

export interface ExamDefinition {
  id: ExamType;
  name: string;
  shortName: string;
  organizer: string;
  tagline: string;
  difficulty: 'easy' | 'standard' | 'hard';
  description: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
  };
  // 偏差値補正係数 (進研は高く出やすく、駿台は辛口)
  deviationModifier: number;
  expectedExaminees: number;
}

export interface QuestionBreakdown {
  number: string;
  title: string;
  score: number;
  maxScore: number;
  averageScore: number;
  percentage: number;
}

export interface SubjectResult {
  subjectId: SubjectId;
  name: string;
  score: number;
  maxScore: number;
  averageScore: number;
  standardDeviation: number;
  deviationValue: number; // 偏差値 (e.g. 62.4)
  rank: number;
  totalExaminees: number;
  gtz?: string; // S1, S2, S3, A1, A2, A3, B1, B2, B3, C1, C2, C3, D
  schoolRank?: number;
  schoolExaminees?: number;
  questions: QuestionBreakdown[];
}

export interface ExamCondition {
  health: 'perfect' | 'good' | 'normal' | 'tired' | 'sick'; // 体調
  luck: number; // -15 to +15 運・ブレ
  carelessPenalty: boolean; // マークズレや計算ミス雪崩
  zoneBonus: boolean; // ゾーン突入
  eventTitle?: string;
  eventDescription?: string;
}

export type JudgmentRank = 'A' | 'B' | 'C' | 'D' | 'E';

export interface UniversityBorder {
  A: number; // 80%
  B: number; // 60%
  C: number; // 50%
  D: number; // 35%
  E: number; // 20%
}

export interface University {
  id: string;
  name: string;
  faculty: string;
  department?: string;
  type: 'national' | 'public' | 'private';
  track: 'humanities' | 'sciences'; // 文系・理系
  location: string;
  borders: {
    shinken: number; // ボーダー偏差値(C判定基準)
    zento: number;
    sundai: number;
  };
  isCustom?: boolean;
}

export interface UniversityJudgmentResult {
  university: University;
  choiceRank: number; // 第1志望〜第6志望
  totalDeviation: number;
  rank: JudgmentRank;
  percentage: number; // 合格可能性 %
  rankDiff: number; // ボーダーとの差 (+3.2 とか -4.5)
  aspirantsRank: number; // 志望者内順位
  totalAspirants: number; // 志望者総数
  advice: string;
}

export interface ExamResult {
  id: string;
  examType: ExamType;
  examFormat: ExamFormat;
  examTitle: string;
  date: string;
  studentName: string;
  highSchoolName: string;
  grade: string;
  course: 'humanities' | 'sciences'; // 文系・理系
  subjectResults: SubjectResult[];
  totalScore: number;
  totalMaxScore: number;
  overallDeviation: number;
  overallRank: number;
  totalExaminees: number;
  gtzOverall?: string;
  condition: ExamCondition;
  judgments: UniversityJudgmentResult[];
}

export interface RebirthBonus {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  effect: {
    baseLevelBonus?: number;
    luckFloorBonus?: number;
    carelessResistBonus?: number; // ケアレスミス軽減率
    zoneChanceBonus?: number; // ゾーン突入確率
  };
}

export interface UserProfile {
  studentName: string;
  highSchoolName: string;
  grade: string;
  track: 'humanities' | 'sciences';
  loopCount: number; // 周回数 (1 = 初回, 2 = 2周目...)
  rebirthPoints: number; // 転生ポイント
  unlockedBonuses: string[];
}
