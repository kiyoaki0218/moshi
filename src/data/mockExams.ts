import { ExamDefinition, RebirthBonus } from '../types';

export const EXAM_DEFINITIONS: Record<string, ExamDefinition> = {
  shinken: {
    id: 'shinken',
    name: 'ベネッセ 総合学力テスト（進研模試）',
    shortName: '進研模試',
    organizer: 'ベネッセコーポレーション',
    tagline: '全国最大規模！基礎力から応用力までを的確に測るスタンダード模試',
    difficulty: 'easy',
    description: '全国約40万人の高校生が一斉受験。母集団が広く基礎〜標準問題が中心のため、偏差値が全統より+5〜+8高く出る「進研マジック」で有名。GTZ（学習到達ゾーン）判定が特徴。',
    colorScheme: {
      primary: '#d81b60', // ベネッセピンク・マゼンタ
      secondary: '#00897b', // エメラルドグリーン
      accent: '#f06292',
      bg: '#fff5f7',
      text: '#374151',
    },
    deviationModifier: +6.5, // 偏差値が+6〜7程度高めに出る
    expectedExaminees: 412580,
  },
  zento: {
    id: 'zento',
    name: '全統共通テスト模試 / 全統記述模試',
    shortName: '全統模試',
    organizer: '河合塾',
    tagline: '大学入試の最大標準！最も信頼できる合否判定と詳細データ',
    difficulty: 'standard',
    description: '受験生標準の指標として最もメジャー。国公立・私立の幅広い志望者が集まり、標準偏差・判定の信頼度が極めて高い。河合塾Webポータル風マイページで閲覧。',
    colorScheme: {
      primary: '#0d6efd', // 河合塾ブルー
      secondary: '#198754', // グリーン
      accent: '#0dcaf0',
      bg: '#f8fafc',
      text: '#1e293b',
    },
    deviationModifier: 0.0, // 基準（標準）
    expectedExaminees: 298450,
  },
  sundai: {
    id: 'sundai',
    name: '駿台全国模試（ハイレベル記述 / マーク）',
    shortName: '駿台全国模試',
    organizer: '駿台予備学校',
    tagline: '東大・京大・難関国公立・医学部志望者の登竜門！超ハイレベル母集団',
    difficulty: 'hard',
    description: '難関大志望者・進学校生・浪人生が多数集結する激辛模試。問題難易度が高く平均点も低いため、全統と比べて偏差値が-6〜-10落ちることも日常茶飯事。',
    colorScheme: {
      primary: '#002f6c', // 駿台ネイビー
      secondary: '#d97706', // 駿台ゴールド/アンバー
      accent: '#0284c7',
      bg: '#f0f4f8',
      text: '#0f172a',
    },
    deviationModifier: -8.0, // 偏差値が激辛（下がる）
    expectedExaminees: 62400,
  },
};

export const INITIAL_REBIRTH_BONUSES: RebirthBonus[] = [
  {
    id: 'base_stat_up',
    name: '前世の記憶（全教科Lv初期値+5）',
    description: '周回時に初期レベルが全教科+5底上げされます。',
    cost: 50,
    unlocked: false,
    effect: { baseLevelBonus: 5 },
  },
  {
    id: 'careless_guard',
    name: '見直しの達人（ケアレスミス激減）',
    description: '本番でのマークズレや計算ミス雪崩の発生確率を60%軽減します。',
    cost: 80,
    unlocked: false,
    effect: { carelessResistBonus: 0.6 },
  },
  {
    id: 'zone_burst',
    name: 'ゾーン突入率UP（ひらめきの境地）',
    description: '試験中にゾーン突入し、運・実力が+10上振れする確率が大幅に上昇します。',
    cost: 100,
    unlocked: false,
    effect: { zoneChanceBonus: 0.25 },
  },
  {
    id: 'luck_insurance',
    name: '鉛筆転がしの極意（運の下限保証）',
    description: '本番の運パラメータがマイナスにならず、最低でも±0以上になります。',
    cost: 120,
    unlocked: false,
    effect: { luckFloorBonus: 5 },
  },
];
