import React, { useState } from 'react';
import { 
  FileCheck2, 
  Flame, 
  AlertTriangle, 
  Zap, 
  Smile, 
  Meh, 
  Frown, 
  Activity, 
  Clock, 
  Send,
  Sparkles
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { ExamType, ExamFormat, ExamCondition } from '../types';
import { EXAM_DEFINITIONS } from '../data/mockExams';
import { generateCondition, simulateExamResult } from '../utils/calcScore';
import { playChime, playWritingSound, playFanfare } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ExamRunnerProps {
  onExamFinished: () => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ onExamFinished }) => {
  const { 
    userProfile, 
    subjectLevels, 
    universities, 
    selectedUniversityIds, 
    rebirthBonuses, 
    addExamResult 
  } = useGame();

  const [selectedExamType, setSelectedExamType] = useState<ExamType>('zento');
  const [selectedFormat, setSelectedFormat] = useState<ExamFormat>('mark');
  const [selectedHealth, setSelectedHealth] = useState<ExamCondition['health']>('good');
  const [isExamining, setIsExamining] = useState(false);
  const [examStepText, setExamStepText] = useState('');
  const [activeEventModal, setActiveEventModal] = useState<ExamCondition | null>(null);

  const activeDef = EXAM_DEFINITIONS[selectedExamType];

  const handleStartExam = () => {
    setIsExamining(true);
    playChime(); // 学校チャイム

    // リアルな受験中アニメーション演出（3ステップ）
    setExamStepText('【1時間目】問題冊子が配られました。受験番号・氏名を記入中...');
    
    setTimeout(() => {
      playWritingSound();
      setExamStepText('【2時間目】「はじめ！」の合図で一斉にページをめくる音が響き渡る...');
    }, 900);

    setTimeout(() => {
      playWritingSound();
      setExamStepText('【最終科目】残り10分！マークのズレと計算ミスがないか最終確認中...');
    }, 1800);

    setTimeout(() => {
      // コンディション算出
      const condition = generateCondition(
        rebirthBonuses.filter(b => b.unlocked),
        selectedHealth
      );

      // 成績シミュレーション
      const result = simulateExamResult({
        examType: selectedExamType,
        examFormat: selectedFormat,
        subjectLevels,
        condition,
        universities,
        selectedUniversityIds,
        userProfile,
      });

      addExamResult(result);
      setIsExamining(false);

      // ゾーンやA判定などの場合は紙吹雪＆ファンファーレ
      if (condition.zoneBonus || result.overallDeviation >= 65) {
        playFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // イベント（ゾーン、ミス、腹痛等）があればモーダル表示、なければ即遷移
      if (condition.eventTitle) {
        setActiveEventModal(condition);
      } else {
        onExamFinished();
      }
    }, 2700);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 受験中全画面オーバーレイ演出 */}
      {isExamining && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-fade-in">
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
            <div className="w-20 h-20 rounded-full border-4 border-rose-500 border-t-transparent animate-spin flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-white">
            {activeDef.shortName} 受験中...
          </h3>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-md text-center animate-pulse">
            {examStepText}
          </p>
          <div className="mt-6 flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>制限時間 カウントダウン中</span>
          </div>
        </div>
      )}

      {/* 試験中ハプニング・ゾーン発生モーダル */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center animate-scale-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-amber-100 text-amber-600">
              {activeEventModal.zoneBonus ? (
                <Zap className="w-10 h-10 text-amber-500 animate-bounce" />
              ) : activeEventModal.carelessPenalty ? (
                <AlertTriangle className="w-10 h-10 text-rose-500 animate-bounce" />
              ) : (
                <Sparkles className="w-10 h-10 text-indigo-500" />
              )}
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              模試本番ハプニング発生！
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              {activeEventModal.eventTitle}
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {activeEventModal.eventDescription}
            </p>

            <button
              onClick={() => {
                setActiveEventModal(null);
                onExamFinished();
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition"
            >
              成績表を確認する
            </button>
          </div>
        </div>
      )}

      {/* 模試種別選択ヘッダー */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          模試受験モード
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          実在する三大模試から選択してください。難易度・母集団のレベルによって算出される偏差値や全国順位がリアルに変化します。
        </p>
      </div>

      {/* 三大模試カードセレクター */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.keys(EXAM_DEFINITIONS) as ExamType[]).map((type) => {
          const exam = EXAM_DEFINITIONS[type];
          const isSelected = selectedExamType === type;

          return (
            <div
              key={type}
              onClick={() => setSelectedExamType(type)}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-white shadow-xl ring-4 ring-indigo-500/10 transform -translate-y-1'
                  : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {/* バッジ */}
              {isSelected && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                  選択中
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: exam.colorScheme.primary }}
                  />
                  <span className="text-xs font-bold text-slate-500">
                    {exam.organizer}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-1">
                  {exam.shortName}
                </h3>
                <div className="text-xs font-semibold text-indigo-600 mb-3">
                  難易度: {exam.difficulty === 'easy' ? '基礎〜標準（母集団広め）' : exam.difficulty === 'standard' ? '標準（最大手・高信頼）' : '激辛・難問多め（ハイレベル）'}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {exam.description}
                </p>
              </div>

              {/* 偏差値バイアス案内 */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>母集団規模: 約{(exam.expectedExaminees / 10000).toFixed(0)}万人</span>
                <span className="font-bold text-slate-700">
                  偏差値傾向: {exam.deviationModifier > 0 ? `+${exam.deviationModifier}` : exam.deviationModifier}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 試験形式 ＆ 本番コンディション設定カード */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 試験形式選択 */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            <span>試験形式を選択</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedFormat('mark')}
              className={`p-3.5 rounded-xl border-2 text-left transition ${
                selectedFormat === 'mark'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-bold">マーク式（共通テスト模試）</div>
              <div className="text-xs text-slate-500 mt-1">
                選択式問題。高得点勝負・スピード重視
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('written')}
              className={`p-3.5 rounded-xl border-2 text-left transition ${
                selectedFormat === 'written'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-bold">記述式（2次・国公立対策）</div>
              <div className="text-xs text-slate-500 mt-1">
                論述・計算過程も採点。思考力・表現力重視
              </div>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            ※マーク模試と記述模試の両方を受験すると「ドッキング判定」が解放されます。
          </p>
        </div>

        {/* 当日のコンディション選択 */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-rose-500" />
            <span>当日の体調・コンディション</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'perfect', label: '絶好調', icon: Flame, color: 'text-amber-500' },
              { id: 'good', label: '良好', icon: Smile, color: 'text-emerald-500' },
              { id: 'tired', label: '睡眠不足', icon: Meh, color: 'text-slate-500' },
              { id: 'sick', label: '体調不良', icon: Frown, color: 'text-rose-500' },
            ].map((c) => {
              const Icon = c.icon;
              const isSelected = selectedHealth === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedHealth(c.id as ExamCondition['health'])}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${c.color}`} />
                  <span className="text-xs">{c.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            体調不良や睡眠不足だと、ケアレスミスやマークズレの発生率が上昇します。
          </p>
        </div>

      </div>

      {/* 受験アクションカード */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">
            受験準備完了
          </div>
          <div className="text-lg font-bold text-white">
            {activeDef.name}（{selectedFormat === 'mark' ? 'マーク式' : '記述式'}）
          </div>
          <div className="text-xs text-slate-400 mt-1">
            志望校：{selectedUniversityIds.length}校判定 ・ 育成レベルに基づきリアルに自動採点
          </div>
        </div>

        <button
          onClick={handleStartExam}
          disabled={isExamining}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-base sm:text-lg rounded-xl shadow-lg shadow-rose-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>今すぐ模試を受験する！</span>
        </button>
      </div>
    </div>
  );
};
