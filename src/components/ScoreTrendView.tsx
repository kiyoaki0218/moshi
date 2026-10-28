import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TrendingUp, Award, Calendar, ArrowRight, PlusCircle } from 'lucide-react';

export const ScoreTrendView: React.FC<{ onGoToExam: () => void }> = ({ onGoToExam }) => {
  const { examHistory, selectedUniversityIds, universities } = useGame();
  const [selectedUnivId, setSelectedUnivId] = useState<string>(selectedUniversityIds[0] || '');

  // 時系列順（古い順）に並べ替え
  const chronResults = [...examHistory].reverse();

  if (chronResults.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center max-w-lg mx-auto border border-slate-200 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          成績推移を表示するには模試を受験してください
        </h3>
        <p className="text-xs text-slate-500">
          模試を2回以上受験すると、春から秋・冬にかけての偏差値や判定の成長折れ線グラフが描画されます。
        </p>
        <button
          onClick={onGoToExam}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
        >
          模試を受験する
        </button>
      </div>
    );
  }

  // 選択中の志望校
  const targetUniv = universities.find(u => u.id === selectedUnivId) || universities[0];

  // SVG折れ線グラフ計算
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 30, right: 40, bottom: 40, left: 50 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // 偏差値レンジ (35〜80)
  const minDev = 35;
  const maxDev = 80;

  const getX = (idx: number) => {
    if (chronResults.length === 1) return padding.left + plotWidth / 2;
    return padding.left + (idx / (chronResults.length - 1)) * plotWidth;
  };

  const getY = (dev: number) => {
    const clamped = Math.max(minDev, Math.min(maxDev, dev));
    return padding.top + plotHeight - ((clamped - minDev) / (maxDev - minDev)) * plotHeight;
  };

  // 折れ線の座標文字列
  const overallLinePoints = chronResults.map((r, i) => `${getX(i)},${getY(r.overallDeviation)}`).join(' ');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>年間模試成績 ＆ 合否判定推移カルテ</span>
          </div>
          <h2 className="text-2xl font-black">
            受験生 成績推移アナリティクス
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            受験回数: 全{chronResults.length}回 ・ 模試ごとの学力変化とボーダー突破の軌跡
          </p>
        </div>

        <button
          onClick={onGoToExam}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-md whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>新しい模試を受験</span>
        </button>
      </div>

      {/* 総合偏差値の推移折れ線グラフ */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-black text-slate-900 text-base">
            ■ 総合偏差値 年間推移グラフ
          </h3>
          <div className="flex items-center space-x-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-3.5 h-1 bg-indigo-600"></span> 総合偏差値
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3.5 h-0.5 border-t border-dashed border-slate-400"></span> 偏差値50（平均）
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg className="w-full max-w-[700px] h-56 mx-auto" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* Y軸グリッド線 (40, 50, 60, 70, 80) */}
            {[40, 50, 60, 70, 80].map((d) => {
              const y = getY(d);
              return (
                <g key={d}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke={d === 50 ? '#94a3b8' : '#e2e8f0'}
                    strokeDasharray={d === 50 ? '3,3' : 'none'}
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    {d}
                  </text>
                </g>
              );
            })}

            {/* 折れ線 */}
            {chronResults.length > 1 && (
              <polyline
                points={overallLinePoints}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* 各模試のプロット点 ＆ ツールチップ的数値 */}
            {chronResults.map((r, i) => {
              const x = getX(i);
              const y = getY(r.overallDeviation);
              return (
                <g key={r.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    className="fill-indigo-600 stroke-white stroke-2"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-[11px] font-black font-mono fill-indigo-700"
                  >
                    {r.overallDeviation}
                  </text>
                  <text
                    x={x}
                    y={svgHeight - padding.bottom + 18}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-600"
                  >
                    第{i + 1}回 ({r.examType === 'shinken' ? '進研' : r.examType === 'zento' ? '全統' : '駿台'})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 志望校判定の推移履歴（E→D→C→B→A） */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>志望校 合否判定の履歴（{targetUniv?.name} {targetUniv?.faculty}）</span>
          </h3>

          <select
            value={selectedUnivId}
            onChange={(e) => setSelectedUnivId(e.target.value)}
            className="text-xs font-bold p-2 border border-slate-300 rounded-lg bg-slate-50"
          >
            {universities.filter(u => selectedUniversityIds.includes(u.id)).map(u => (
              <option key={u.id} value={u.id}>{u.name} {u.faculty}</option>
            ))}
          </select>
        </div>

        {/* 判定ステップステップ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {chronResults.map((r, i) => {
            const judge = r.judgments.find(j => j.university.id === selectedUnivId) || r.judgments[0];
            let badgeBg = 'bg-slate-600';
            if (judge?.rank === 'A') badgeBg = 'bg-emerald-600';
            else if (judge?.rank === 'B') badgeBg = 'bg-blue-600';
            else if (judge?.rank === 'C') badgeBg = 'bg-amber-500';
            else if (judge?.rank === 'D') badgeBg = 'bg-orange-600';
            else badgeBg = 'bg-rose-600';

            return (
              <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400">第{i + 1}回 {r.date}</div>
                  <div className="font-black text-xs text-slate-800 mt-0.5">{r.examTitle}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">偏差値: {r.overallDeviation}</div>
                </div>

                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-black shadow-sm ${badgeBg}`}>
                  <span className="text-xl leading-none">{judge?.rank || 'ー'}</span>
                  <span className="text-[9px] font-mono opacity-80 mt-0.5">{judge?.percentage || 0}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
