import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { calculateDockingJudgment } from '../../utils/calcScore';
import { Layers, X, Award, AlertCircle } from 'lucide-react';

interface DockingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DockingModal: React.FC<DockingModalProps> = ({ isOpen, onClose }) => {
  const { examHistory, universities, selectedUniversityIds } = useGame();

  // マーク模試と記述模試をフィルタリング
  const markExams = examHistory.filter(e => e.examFormat === 'mark');
  const writtenExams = examHistory.filter(e => e.examFormat === 'written');

  const [selectedMarkId, setSelectedMarkId] = useState<string>(markExams[0]?.id || '');
  const [selectedWrittenId, setSelectedWrittenId] = useState<string>(writtenExams[0]?.id || '');

  if (!isOpen) return null;

  // 選択された模試
  const markResult = examHistory.find(e => e.id === selectedMarkId) || markExams[0];
  const writtenResult = examHistory.find(e => e.id === selectedWrittenId) || writtenExams[0];

  const hasBoth = Boolean(markResult && writtenResult);

  // ドッキング計算
  const dockingData = hasBoth
    ? calculateDockingJudgment(markResult, writtenResult, universities, selectedUniversityIds)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Layers className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider">
                共通テスト ＆ 記述 総合判定
              </div>
              <h2 className="text-xl font-black">
                模試ドッキング判定カルテ
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!hasBoth ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800">
                ドッキング判定を行うには両方の模試が必要です
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                「マーク式模試（共通テスト型）」と「記述式模試（二次試験型）」をそれぞれ1回以上受験すると、合算した総合ドッキング判定が算出されます。
              </p>
              <div className="flex justify-center gap-4 text-xs font-semibold">
                <span className={markExams.length > 0 ? 'text-emerald-600' : 'text-slate-400'}>
                  ✓ マーク模試: {markExams.length}件受験済
                </span>
                <span className={writtenExams.length > 0 ? 'text-emerald-600' : 'text-slate-400'}>
                  ✓ 記述模試: {writtenExams.length}件受験済
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* ドッキング模試選択セレクター */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ① 共通テストマーク模試を選択
                  </label>
                  <select
                    value={selectedMarkId}
                    onChange={(e) => setSelectedMarkId(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {markExams.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.examTitle} (偏差値: {m.overallDeviation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ② 記述模試を選択
                  </label>
                  <select
                    value={selectedWrittenId}
                    onChange={(e) => setSelectedWrittenId(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {writtenExams.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.examTitle} (偏差値: {w.overallDeviation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ドッキング総合サマリー */}
              {dockingData && (
                <div className="grid grid-cols-3 gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200 text-center">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">共テ偏差値 (45%)</div>
                    <div className="text-xl font-black text-purple-700 mt-1 font-mono">
                      {dockingData.markDeviation}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">記述偏差値 (55%)</div>
                    <div className="text-xl font-black text-indigo-700 mt-1 font-mono">
                      {dockingData.writtenDeviation}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-2 shadow-sm border border-purple-300">
                    <div className="text-xs text-purple-900 font-bold">ドッキング総合偏差値</div>
                    <div className="text-2xl font-black text-purple-950 font-mono">
                      {dockingData.dockingDeviation}
                    </div>
                  </div>
                </div>
              )}

              {/* 志望校ドッキング判定一覧 */}
              {dockingData && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-700" />
                    <span>国公立・私立 ドッキング総合判定結果</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dockingData.judgments.map((judge) => {
                      let badgeColor = 'bg-slate-600';
                      if (judge.rank === 'A') badgeColor = 'bg-emerald-600';
                      else if (judge.rank === 'B') badgeColor = 'bg-blue-600';
                      else if (judge.rank === 'C') badgeColor = 'bg-amber-600';
                      else if (judge.rank === 'D') badgeColor = 'bg-orange-600';
                      else badgeColor = 'bg-rose-600';

                      return (
                        <div key={judge.university.id} className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-sm">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xs text-slate-400 font-bold">
                                第{judge.choiceRank}志望 ・ {judge.university.location}
                              </div>
                              <div className="font-black text-sm text-slate-900">
                                {judge.university.name}
                              </div>
                              <div className="text-xs text-slate-600">
                                {judge.university.faculty}
                              </div>
                            </div>

                            <div className="text-center">
                              <div className={`w-11 h-11 rounded-xl text-white font-black text-xl flex items-center justify-center shadow ${badgeColor}`}>
                                {judge.rank}
                              </div>
                              <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                                {judge.percentage}%
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>ボーダー差: <strong className={judge.rankDiff >= 0 ? 'text-purple-700' : 'text-slate-700'}>{judge.rankDiff >= 0 ? `+${judge.rankDiff}` : judge.rankDiff}</strong></span>
                            <span>志望者席次: {judge.aspirantsRank}位 / {judge.totalAspirants}名</span>
                          </div>

                          <div className="mt-1.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded">
                            {judge.advice}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-slate-50 p-4 rounded-b-2xl border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
          >
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
};
