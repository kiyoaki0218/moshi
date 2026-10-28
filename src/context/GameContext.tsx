import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SubjectLevel, 
  University, 
  ExamResult, 
  UserProfile, 
  RebirthBonus 
} from '../types';
import { INITIAL_UNIVERSITIES } from '../data/universities';
import { INITIAL_REBIRTH_BONUSES } from '../data/mockExams';

interface GameContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  subjectLevels: SubjectLevel[];
  setSubjectLevels: React.Dispatch<React.SetStateAction<SubjectLevel[]>>;
  universities: University[];
  setUniversities: React.Dispatch<React.SetStateAction<University[]>>;
  selectedUniversityIds: string[];
  setSelectedUniversityIds: React.Dispatch<React.SetStateAction<string[]>>;
  examHistory: ExamResult[];
  addExamResult: (result: ExamResult) => void;
  deleteExamResult: (id: string) => void;
  rebirthBonuses: RebirthBonus[];
  unlockBonus: (bonusId: string) => boolean;
  executeRebirth: () => void; // 強くてニューゲーム実行
  updateSubjectLevel: (id: string, newLevel: number) => void;
  addCustomUniversity: (univ: Omit<University, 'id' | 'isCustom'>) => void;
  activeExamResult: ExamResult | null;
  setActiveExamResult: (result: ExamResult | null) => void;
}

const DEFAULT_SUBJECTS: SubjectLevel[] = [
  { id: 'english_reading', name: '英語（リーディング）', category: 'english', level: 50 },
  { id: 'english_listening', name: '英語（リスニング）', category: 'english', level: 48 },
  { id: 'math_1a', name: '数学I・A', category: 'math', level: 52 },
  { id: 'math_2bc', name: '数学II・B・C', category: 'math', level: 46 },
  { id: 'japanese_modern', name: '国語（現代文）', category: 'japanese', level: 55 },
  { id: 'japanese_classic', name: '国語（古文）', category: 'japanese', level: 45 },
  { id: 'japanese_chinese', name: '国語（漢文）', category: 'japanese', level: 42 },
  { id: 'science', name: '理科（物理 / 化学 / 生物）', category: 'science', level: 48 },
  { id: 'social', name: '地歴公民（日本史 / 世界史 / 地理）', category: 'social', level: 50 },
  { id: 'info', name: '情報I', category: 'info', level: 52 },
];

const DEFAULT_PROFILE: UserProfile = {
  studentName: '駿台 一郎',
  highSchoolName: '第一志望突破高等学校',
  grade: '高校3年',
  track: 'sciences',
  loopCount: 1,
  rebirthPoints: 0,
  unlockedBonuses: [],
};

const DEFAULT_SELECTED_UNIV_IDS = [
  'u-tokyo-ri1',
  'kyoto-u-eng',
  'waseda-adv-sci',
  'keio-econ',
  'meiji-commerce',
  'kanazawa-u-sci'
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // localStorageから初期化
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('moshi_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [subjectLevels, setSubjectLevels] = useState<SubjectLevel[]>(() => {
    const saved = localStorage.getItem('moshi_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [universities, setUniversities] = useState<University[]>(() => {
    const saved = localStorage.getItem('moshi_universities');
    return saved ? JSON.parse(saved) : INITIAL_UNIVERSITIES;
  });

  const [selectedUniversityIds, setSelectedUniversityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('moshi_selected_univs');
    return saved ? JSON.parse(saved) : DEFAULT_SELECTED_UNIV_IDS;
  });

  const [examHistory, setExamHistory] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem('moshi_exam_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [rebirthBonuses, setRebirthBonuses] = useState<RebirthBonus[]>(() => {
    const saved = localStorage.getItem('moshi_bonuses');
    return saved ? JSON.parse(saved) : INITIAL_REBIRTH_BONUSES;
  });

  const [activeExamResult, setActiveExamResult] = useState<ExamResult | null>(null);

  // 保存処理
  useEffect(() => {
    localStorage.setItem('moshi_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('moshi_subjects', JSON.stringify(subjectLevels));
  }, [subjectLevels]);

  useEffect(() => {
    localStorage.setItem('moshi_universities', JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('moshi_selected_univs', JSON.stringify(selectedUniversityIds));
  }, [selectedUniversityIds]);

  useEffect(() => {
    localStorage.setItem('moshi_exam_history', JSON.stringify(examHistory));
  }, [examHistory]);

  useEffect(() => {
    localStorage.setItem('moshi_bonuses', JSON.stringify(rebirthBonuses));
  }, [rebirthBonuses]);

  // 教科レベル更新
  const updateSubjectLevel = (id: string, newLevel: number) => {
    setSubjectLevels(prev => 
      prev.map(s => s.id === id ? { ...s, level: Math.max(1, Math.min(99, newLevel)) } : s)
    );
  };

  // 模試結果追加（同時に転生ポイントも獲得！）
  const addExamResult = (result: ExamResult) => {
    setExamHistory(prev => [result, ...prev]);
    setActiveExamResult(result);
    // 偏差値に応じた転生ポイントの付与 (例: 偏差値60で15pt, 70で30pt)
    const earnedPoints = Math.max(5, Math.round((result.overallDeviation - 40) * 1.5));
    setUserProfile(prev => ({
      ...prev,
      rebirthPoints: prev.rebirthPoints + earnedPoints,
    }));
  };

  const deleteExamResult = (id: string) => {
    setExamHistory(prev => prev.filter(r => r.id !== id));
    if (activeExamResult?.id === id) {
      setActiveExamResult(null);
    }
  };

  // 周回ボーナス解放
  const unlockBonus = (bonusId: string): boolean => {
    const target = rebirthBonuses.find(b => b.id === bonusId);
    if (!target || target.unlocked) return false;
    if (userProfile.rebirthPoints < target.cost) return false;

    setUserProfile(prev => ({
      ...prev,
      rebirthPoints: prev.rebirthPoints - target.cost,
      unlockedBonuses: [...prev.unlockedBonuses, bonusId],
    }));

    setRebirthBonuses(prev => 
      prev.map(b => b.id === bonusId ? { ...b, unlocked: true } : b)
    );
    return true;
  };

  // 強くてニューゲーム（周回・転生）
  const executeRebirth = () => {
    const baseBonus = rebirthBonuses.find(b => b.id === 'base_stat_up' && b.unlocked)?.effect.baseLevelBonus || 0;
    
    // 各科目をベースレベル + 周回ボーナスでリフレッシュ
    setSubjectLevels(prev => 
      prev.map(s => ({
        ...s,
        // 前世の記憶ボーナス
        level: Math.min(99, 45 + (userProfile.loopCount * 2) + baseBonus),
      }))
    );

    // 周回数加算＆ボーナスポイント贈呈
    setUserProfile(prev => ({
      ...prev,
      loopCount: prev.loopCount + 1,
      rebirthPoints: prev.rebirthPoints + 50, // 周回お祝いボーナス50pt
    }));
  };

  // カスタム大学追加
  const addCustomUniversity = (univData: Omit<University, 'id' | 'isCustom'>) => {
    const newUniv: University = {
      ...univData,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    setUniversities(prev => [newUniv, ...prev]);
    setSelectedUniversityIds(prev => [newUniv.id, ...prev.slice(0, 5)]); // 最大6校
  };

  return (
    <GameContext.Provider
      value={{
        userProfile,
        setUserProfile,
        subjectLevels,
        setSubjectLevels,
        universities,
        setUniversities,
        selectedUniversityIds,
        setSelectedUniversityIds,
        examHistory,
        addExamResult,
        deleteExamResult,
        rebirthBonuses,
        unlockBonus,
        executeRebirth,
        updateSubjectLevel,
        addCustomUniversity,
        activeExamResult,
        setActiveExamResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
