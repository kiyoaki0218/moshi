import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShinkenReport } from './reports/ShinkenReport';
import { ZentoReport } from './reports/ZentoReport';
import { SundaiReport } from './reports/SundaiReport';
import { ShareModal } from './ShareModal';
import { 
  FileText, 
  Trash2, 
  PlusCircle,
  Share2,
  Camera
} from 'lucide-react';
import { ExamType } from '../types';

interface ReportViewerProps {
  onGoToExam: () => void;
  openDockingModal?: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ onGoToExam }) => {
  const { examHistory, activeExamResult, setActiveExamResult, deleteExamResult } = useGame();

  const currentResult = activeExamResult || examHistory[0] || null;
  const [overrideTheme, setOverrideTheme] = useState<ExamType | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!currentResult) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm border border-slate-200 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          まだ模試の受験履歴がありません
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          ステータスを設定して「模試を受験する」から受験してみましょう。進研模試・全統模試・駿台模試のリアルな成績表が生成されます。
        </p>
        <button
          onClick={onGoToExam}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>今すぐ模試を受験する</span>
        </button>
      </div>
    );
  }

  const displayTheme = overrideTheme || currentResult.examType;

  return (
    <div className="space-y-6">
      {/* 上部コントロールバー */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        
        {/* 過去ログ切り替え */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:space-x-3 w-full md:w-auto">
          <div className="text-xs font-bold text-slate-500 whitespace-nowrap">受験履歴 ({examHistory.length}件):</div>
          <select
            value={currentResult.id}
            onChange={(e) => {
              const found = examHistory.find(r => r.id === e.target.value);
              if (found) {
                setActiveExamResult(found);
                setOverrideTheme(null);
              }
            }}
            className="w-full sm:w-auto text-xs sm:text-sm font-semibold p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 truncate"
          >
            {examHistory.map(r => (
              <option key={r.id} value={r.id}>
                {r.examTitle}（偏差値: {r.overallDeviation}）- {r.date}
              </option>
            ))}
          </select>
        </div>

        {/* 右側アクション：UI切替 ＆ 画像保存・SNSシェア */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
          {/* UI再現切替 */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
            <button
              onClick={() => setOverrideTheme('shinken')}
              className={`px-2 sm:px-2.5 py-1 rounded font-bold transition text-[11px] sm:text-xs ${
                displayTheme === 'shinken'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              進研模試風
            </button>
            <button
              onClick={() => setOverrideTheme('zento')}
              className={`px-2 sm:px-2.5 py-1 rounded font-bold transition text-[11px] sm:text-xs ${
                displayTheme === 'zento'
                  ? 'bg-[#00529b] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全統模試風
            </button>
            <button
              onClick={() => setOverrideTheme('sundai')}
              className={`px-2 sm:px-2.5 py-1 rounded font-bold transition text-[11px] sm:text-xs ${
                displayTheme === 'sundai'
                  ? 'bg-[#002f6c] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              駿台全国風
            </button>
          </div>

          <div className="flex items-center space-x-1.5 ml-auto sm:ml-0">
            {/* 画像保存・SNSシェアボタン */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition"
              title="成績表をPNG画像として保存またはXでシェア"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>共有 / 保存</span>
            </button>

            {/* 削除ボタン */}
            <button
              onClick={() => {
                if (confirm('この模試成績データを削除しますか？')) {
                  deleteExamResult(currentResult.id);
                }
              }}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="成績を削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* キャプチャ対象の成績表コンテナ */}
      <div id="printable-report-card">
        {displayTheme === 'shinken' && <ShinkenReport result={currentResult} />}
        {displayTheme === 'zento' && <ZentoReport result={currentResult} />}
        {displayTheme === 'sundai' && <SundaiReport result={currentResult} />}
      </div>

      {/* シェアモーダル */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={currentResult}
        targetElementId="printable-report-card"
      />
    </div>
  );
};
