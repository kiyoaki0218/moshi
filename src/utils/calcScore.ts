import { 
  SubjectLevel, 
  ExamType, 
  ExamFormat, 
  ExamCondition, 
  SubjectResult, 
  ExamResult, 
  University, 
  UniversityJudgmentResult, 
  JudgmentRank,
  RebirthBonus 
} from '../types';
import { EXAM_DEFINITIONS } from '../data/mockExams';

// 小問のタイトルプリセット
const QUESTION_PATTERNS: Record<string, { title: string; maxScore: number }[]> = {
  english_reading: [
    { title: '第1問：図表読解・掲示文', maxScore: 16 },
    { title: '第2問：論説文・Eメール', maxScore: 20 },
    { title: '第3問：ブログ・記事読解', maxScore: 18 },
    { title: '第4問：エッセイ・要約', maxScore: 22 },
    { title: '第5問：長文論説文（推論・論理）', maxScore: 24 },
  ],
  english_listening: [
    { title: '第1問：短文発話・イラスト選択', maxScore: 25 },
    { title: '第2問：対話文応答', maxScore: 25 },
    { title: '第3問：講義・ワークショップ聞き取り', maxScore: 25 },
    { title: '第4問：長文ディスカッション・複数人会話', maxScore: 25 },
  ],
  math_1a: [
    { title: '第1問：数と式・集合と命題・2次関数', maxScore: 30 },
    { title: '第2問：図形と計量・データの分析', maxScore: 30 },
    { title: '第3問：場合の数と確率', maxScore: 20 },
    { title: '第4問：整数の性質 / 図形の性質', maxScore: 20 },
  ],
  math_2bc: [
    { title: '第1問：三角関数・指数対数関数', maxScore: 30 },
    { title: '第2問：微分法と積分法', maxScore: 30 },
    { title: '第3問：数列', maxScore: 20 },
    { title: '第4問：ベクトル / 複素数平面', maxScore: 20 },
  ],
  japanese_modern: [
    { title: '第1問：現代文（論理的文章）', maxScore: 60 },
    { title: '第2問：現代文（文学的文章・資料複合）', maxScore: 50 },
  ],
  japanese_classic: [
    { title: '第3問：古文（説話・物語の心情・文法）', maxScore: 50 },
  ],
  japanese_chinese: [
    { title: '第4問：漢文（故事・思想・返り点読解）', maxScore: 40 },
  ],
  science: [
    { title: '第1問：基礎小問集合', maxScore: 25 },
    { title: '第2問：実験考察・データ分析', maxScore: 25 },
    { title: '第3問：標準〜応用問題（大問A）', maxScore: 25 },
    { title: '第4問：発展思考問題（大問B）', maxScore: 25 },
  ],
  social: [
    { title: '第1問：原始・古代・通史テーマ', maxScore: 25 },
    { title: '第2問：中世・近世史料問題', maxScore: 25 },
    { title: '第3問：近現代政治・国際関係', maxScore: 25 },
    { title: '第4問：現代社会・地域構造と統計', maxScore: 25 },
  ],
  info: [
    { title: '第1問：情報社会の諸問題・情報セキュリティ', maxScore: 25 },
    { title: '第2問：コミュニケーションと情報デザイン', maxScore: 25 },
    { title: '第3問：プログラミング的思考・アルゴリズム', maxScore: 25 },
    { title: '第4問：データの活用・モデル化とシミュレーション', maxScore: 25 },
  ],
};

// GTZ（学習到達ゾーン）の判定（進研模試風）
export function calculateGTZ(deviation: number): string {
  if (deviation >= 75) return 'S1';
  if (deviation >= 70) return 'S2';
  if (deviation >= 65) return 'S3';
  if (deviation >= 60) return 'A1';
  if (deviation >= 56) return 'A2';
  if (deviation >= 52) return 'A3';
  if (deviation >= 48) return 'B1';
  if (deviation >= 44) return 'B2';
  if (deviation >= 40) return 'B3';
  if (deviation >= 36) return 'C1';
  if (deviation >= 33) return 'C2';
  if (deviation >= 30) return 'C3';
  return 'D';
}

// 判定ランク算出（ボーダーと自分の偏差値の差分）
export function calculateJudgment(
  myDeviation: number, 
  borderC: number
): { rank: JudgmentRank; percentage: number; diff: number; advice: string } {
  const diff = Math.round((myDeviation - borderC) * 10) / 10;
  
  // ボーダーC判定を基準に50%とし、差分±1ごとに合格可能性をシグモイド風に算出
  let percentage: number;
  let rank: JudgmentRank;
  let advice: string;

  if (diff >= 5.0) {
    rank = 'A';
    percentage = Math.min(95, Math.round(80 + (diff - 5.0) * 2.5));
    advice = '安全圏です。このままの調子を維持しつつ、ケアレスミス対策を怠らないようにしましょう。';
  } else if (diff >= 2.5) {
    rank = 'B';
    percentage = Math.round(65 + (diff - 2.5) * 6);
    advice = '合格可能性は十分高いレベルにあります。苦手分野の穴埋めを継続して確実なものにしましょう。';
  } else if (diff >= -2.0) {
    rank = 'C';
    percentage = Math.round(45 + (diff + 2.0) * 4.5);
    advice = 'ボーダー付近の激戦ラインです。あと数問の得点力アップが当落を左右します。演習量を増やしましょう。';
  } else if (diff >= -5.5) {
    rank = 'D';
    percentage = Math.round(25 + (diff + 5.5) * 5.5);
    advice = '合格には一段の学力引き上げが必要です。弱点単元に絞った集中特訓で基礎からの底上げを急ぎましょう。';
  } else {
    rank = 'E';
    percentage = Math.max(5, Math.round(20 + diff * 1.5));
    advice = '現時点では厳しい判定です。基礎の総復習を最優先し、併願校の検討や学習スケジュールの再構築を図りましょう。';
  }

  return { rank, percentage, diff, advice };
}

// コンディション生成
export function generateCondition(
  unlockedBonuses: RebirthBonus[],
  customHealth?: ExamCondition['health']
): ExamCondition {
  const healthOptions: ExamCondition['health'][] = ['perfect', 'good', 'normal', 'normal', 'tired', 'sick'];
  const health = customHealth || healthOptions[Math.floor(Math.random() * healthOptions.length)];

  // 体調による運・実力補正
  let baseLuck = 0;
  switch (health) {
    case 'perfect': baseLuck = 6; break;
    case 'good': baseLuck = 3; break;
    case 'normal': baseLuck = 0; break;
    case 'tired': baseLuck = -4; break;
    case 'sick': baseLuck = -8; break;
  }

  // ランダムな運（-10〜+10）
  const randomRoll = Math.floor(Math.random() * 21) - 10;
  let luck = baseLuck + randomRoll;

  // ボーナス：運の下限保証
  const luckFloor = unlockedBonuses.find(b => b.id === 'luck_insurance');
  if (luckFloor && luck < 0) {
    luck = Math.max(0, luck + (luckFloor.effect.luckFloorBonus || 5));
  }

  // ゾーン突入判定
  const zoneBonusChance = 0.08 + (unlockedBonuses.some(b => b.id === 'zone_burst') ? 0.25 : 0);
  const zoneBonus = Math.random() < zoneBonusChance;

  // ケアレスミス雪崩判定
  let carelessChance = 0.15;
  if (health === 'tired' || health === 'sick') carelessChance += 0.15;
  if (unlockedBonuses.some(b => b.id === 'careless_guard')) {
    carelessChance *= 0.4; // 60%カット
  }
  const carelessPenalty = !zoneBonus && Math.random() < carelessChance;

  // ハプニング演出文
  let eventTitle: string | undefined;
  let eventDescription: string | undefined;

  if (zoneBonus) {
    eventTitle = '超集中状態「ゾーン」に突入！';
    eventDescription = '試験中、周りの音が消えて問題の解法が次々と閃いた！普段解けない難問も驚異的な閃きで完答！';
  } else if (carelessPenalty) {
    eventTitle = '悲報：大問1で痛恨の計算ミス・マークズレ！';
    eventDescription = '大問1の序盤の符号ミスに気づかず大問全体が雪崩崩壊…あるいは終了直前に1段ズレに気づくパニック発生！';
  } else if (health === 'sick') {
    eventTitle = '極度の体調不良・腹痛の襲来！';
    eventDescription = '試験開始と同時に激しい腹痛と頭痛が襲い、問題文が全く頭に入ってこない最悪のコンディション。';
  } else if (health === 'perfect') {
    eventTitle = '前夜の睡眠バッチリ・視界クリア！';
    eventDescription = '朝から頭が冴え渡り、直前に確認した参考書のページからズバリ的中問題が出題！';
  }

  return {
    health,
    luck,
    carelessPenalty,
    zoneBonus,
    eventTitle,
    eventDescription,
  };
}

// 模試結果シミュレーション実行
export function simulateExamResult(params: {
  examType: ExamType;
  examFormat: ExamFormat;
  subjectLevels: SubjectLevel[];
  condition: ExamCondition;
  universities: University[];
  selectedUniversityIds: string[];
  userProfile: {
    studentName: string;
    highSchoolName: string;
    grade: string;
    track: 'humanities' | 'sciences';
  };
}): ExamResult {
  const { examType, examFormat, subjectLevels, condition, universities, selectedUniversityIds, userProfile } = params;
  const examDef = EXAM_DEFINITIONS[examType];

  const subjectResults: SubjectResult[] = [];
  let totalRawScore = 0;
  let totalMaxScore = 0;

  // 各教科の計算
  subjectLevels.forEach((sub) => {
    const questionsPattern = QUESTION_PATTERNS[sub.id] || [
      { title: '第1問：基礎・計算', maxScore: 30 },
      { title: '第2問：標準読解・応用', maxScore: 35 },
      { title: '第3問：発展総合問題', maxScore: 35 },
    ];

    const maxScore = questionsPattern.reduce((acc, q) => acc + q.maxScore, 0);

    // 基礎実力スコア（Level 1〜99）
    // Level 50 で平均点（模試難易度に応じた平均点）付近
    // 模試難易度係数
    let difficultyFactor = 1.0;
    let baseAverageRatio = 0.52; // 標準的な平均点率（52%）

    if (examType === 'shinken') {
      difficultyFactor = 1.15; // 点数が取りやすい
      baseAverageRatio = 0.55;
    } else if (examType === 'sundai') {
      difficultyFactor = 0.78; // 激辛
      baseAverageRatio = 0.38;
    }

    if (examFormat === 'written') {
      difficultyFactor *= 0.92; // 記述はやや厳しめ
    }

    // レベルによる得点率の基本値
    // lv 1 -> 15%, lv 50 -> 55%, lv 99 -> 95%
    let estimatedScoreRatio = (sub.level / 100) * 0.85 + 0.12;

    // 模試難易度を適用
    estimatedScoreRatio *= difficultyFactor;

    // コンディション（運・ゾーン・ケアレス）
    let modifier = condition.luck * 0.007; // -10%〜+10%程度
    if (condition.zoneBonus) modifier += 0.12;
    if (condition.carelessPenalty) modifier -= 0.14;

    estimatedScoreRatio += modifier;
    // 範囲クランプ (5% 〜 99%)
    estimatedScoreRatio = Math.max(0.06, Math.min(0.98, estimatedScoreRatio));

    const rawScore = Math.round(maxScore * estimatedScoreRatio);
    totalRawScore += rawScore;
    totalMaxScore += maxScore;

    // 平均点・標準偏差
    const avgScore = Math.round(maxScore * baseAverageRatio);
    const standardDeviation = Math.round(maxScore * 0.22);

    // 偏差値の計算: 50 + 10 * (得点 - 平均点) / 標準偏差 + 模試補正
    let rawDeviation = 50 + 10 * ((rawScore - avgScore) / standardDeviation);
    // 模試特性による偏差値バイアス（進研は高め、駿台は辛口）
    rawDeviation += examDef.deviationModifier;
    const deviationValue = Math.round(Math.max(25, Math.min(88, rawDeviation)) * 10) / 10;

    // 順位（正規分布近似）
    // z = (deviation - 50) / 10
    const z = (deviationValue - 50) / 10;
    // 累積分布関数の概算で上位パーセンタイルを算出
    const percentile = Math.max(0.0001, Math.min(0.9999, 1 / (1 + Math.exp(1.6 * z))));
    const totalExaminees = examDef.expectedExaminees;
    const rank = Math.max(1, Math.round(totalExaminees * percentile));

    const schoolExaminees = 280;
    const schoolRank = Math.max(1, Math.round(schoolExaminees * percentile * (0.8 + Math.random() * 0.4)));

    // 小問別得点の分配
    let remainingScore = rawScore;
    const questions = questionsPattern.map((q, idx) => {
      const isLast = idx === questionsPattern.length - 1;
      let qScore: number;
      if (isLast) {
        qScore = Math.min(q.maxScore, Math.max(0, remainingScore));
      } else {
        const weight = q.maxScore / maxScore;
        // 多少のバラつき
        const variance = (Math.random() - 0.5) * (q.maxScore * 0.25);
        qScore = Math.round(rawScore * weight + variance);
        qScore = Math.min(q.maxScore, Math.max(0, qScore));
        remainingScore -= qScore;
      }
      const qAvg = Math.round(q.maxScore * baseAverageRatio * 10) / 10;
      return {
        number: `大問${idx + 1}`,
        title: q.title,
        score: qScore,
        maxScore: q.maxScore,
        averageScore: qAvg,
        percentage: Math.round((qScore / q.maxScore) * 100),
      };
    });

    subjectResults.push({
      subjectId: sub.id,
      name: sub.name,
      score: rawScore,
      maxScore,
      averageScore: avgScore,
      standardDeviation,
      deviationValue,
      rank,
      totalExaminees,
      gtz: calculateGTZ(deviationValue),
      schoolRank,
      schoolExaminees,
      questions,
    });
  });

  // 総合偏差値（各教科偏差値の加重・平均）
  const overallDeviation = Math.round(
    (subjectResults.reduce((acc, s) => acc + s.deviationValue, 0) / (subjectResults.length || 1)) * 10
  ) / 10;

  const totalExaminees = examDef.expectedExaminees;
  const overallZ = (overallDeviation - 50) / 10;
  const overallPercentile = Math.max(0.0001, Math.min(0.9999, 1 / (1 + Math.exp(1.6 * overallZ))));
  const overallRank = Math.max(1, Math.round(totalExaminees * overallPercentile));

  // 志望校判定の生成
  const targetUnivs = universities.filter(u => selectedUniversityIds.includes(u.id));
  const judgments: UniversityJudgmentResult[] = targetUnivs.map((univ, index) => {
    // 模試ごとのボーダーを取得
    let border = univ.borders[examType] || 60;
    const { rank, percentage, diff, advice } = calculateJudgment(overallDeviation, border);

    // 志望者内順位（適度なランダム性と偏差値順位に基づくリアルな値）
    const totalAspirants = Math.round(350 + Math.random() * 900);
    const aspirantPercentile = Math.max(0.01, Math.min(0.99, 1 / (1 + Math.exp(1.7 * (overallDeviation - border)))));
    const aspirantsRank = Math.max(1, Math.round(totalAspirants * aspirantPercentile));

    return {
      university: univ,
      choiceRank: index + 1,
      totalDeviation: overallDeviation,
      rank,
      percentage,
      rankDiff: diff,
      aspirantsRank,
      totalAspirants,
      advice,
    };
  });

  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return {
    id: `exam-${Date.now()}`,
    examType,
    examFormat,
    examTitle: `${examDef.name}（第${Math.floor(Math.random() * 3) + 1}回）`,
    date: today,
    studentName: userProfile.studentName || '合格 太郎',
    highSchoolName: userProfile.highSchoolName || '進学第一高等学校',
    grade: userProfile.grade || '高校3年',
    course: userProfile.track,
    subjectResults,
    totalScore: totalRawScore,
    totalMaxScore,
    overallDeviation,
    overallRank,
    totalExaminees,
    gtzOverall: calculateGTZ(overallDeviation),
    condition,
    judgments,
  };
}

// ドッキング判定（共テ模試 + 記述模試）の計算
export function calculateDockingJudgment(
  markResult: ExamResult,
  writtenResult: ExamResult,
  universities: University[],
  selectedIds: string[]
): {
  markScore: number;
  markMaxScore: number;
  markDeviation: number;
  writtenScore: number;
  writtenMaxScore: number;
  writtenDeviation: number;
  dockingScore: number;
  dockingMaxScore: number;
  dockingDeviation: number;
  judgments: UniversityJudgmentResult[];
} {
  // 配分（マーク40%：記述60%など）
  const markScore = markResult.totalScore;
  const markMaxScore = markResult.totalMaxScore;
  const writtenScore = writtenResult.totalScore;
  const writtenMaxScore = writtenResult.totalMaxScore;

  // ドッキング偏差値（共テ比重45%、記述比重55%）
  const dockingDeviation = Math.round((markResult.overallDeviation * 0.45 + writtenResult.overallDeviation * 0.55) * 10) / 10;

  const targetUnivs = universities.filter(u => selectedIds.includes(u.id));
  const judgments = targetUnivs.map((univ, index) => {
    // 全統・駿台の基準ボーダーを採用
    const border = univ.borders.zento || 60;
    const { rank, percentage, diff, advice } = calculateJudgment(dockingDeviation, border);

    const totalAspirants = Math.round(500 + Math.random() * 1200);
    const aspirantPercentile = Math.max(0.01, Math.min(0.99, 1 / (1 + Math.exp(1.7 * (dockingDeviation - border)))));
    const aspirantsRank = Math.max(1, Math.round(totalAspirants * aspirantPercentile));

    return {
      university: univ,
      choiceRank: index + 1,
      totalDeviation: dockingDeviation,
      rank,
      percentage,
      rankDiff: diff,
      aspirantsRank,
      totalAspirants,
      advice: `【ドッキング判定結果】共テ(偏差値${markResult.overallDeviation})と記述(偏差値${writtenResult.overallDeviation})の合算判定です。${advice}`,
    };
  });

  return {
    markScore,
    markMaxScore,
    markDeviation: markResult.overallDeviation,
    writtenScore,
    writtenMaxScore,
    writtenDeviation: writtenResult.overallDeviation,
    dockingScore: markScore + writtenScore,
    dockingMaxScore: markMaxScore + writtenMaxScore,
    dockingDeviation,
    judgments,
  };
}
