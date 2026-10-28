import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar, TabType } from './components/Navbar';
import { StatusEditor } from './components/StatusEditor';
import { ExamRunner } from './components/ExamRunner';
import { ReportViewer } from './components/ReportViewer';
import { TargetUniversityManager } from './components/TargetUniversityManager';
import { RebirthModal } from './components/RebirthModal';
import { DockingModal } from './components/reports/DockingModal';
import { ScoreTrendView } from './components/ScoreTrendView';
import { ExamPassSimulator } from './components/ExamPassSimulator';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('exam');
  const [isDockingOpen, setIsDockingOpen] = useState(false);
  const { examHistory } = useGame();

  const markCount = examHistory.filter(e => e.examFormat === 'mark').length;
  const writtenCount = examHistory.filter(e => e.examFormat === 'written').length;
  const canDock = markCount > 0 && writtenCount > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* ナビゲーションバー */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openDockingModal={() => setIsDockingOpen(true)}
        canDock={canDock}
      />

      {/* メインコンテンツエリア */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'exam' && (
          <ExamRunner onExamFinished={() => setActiveTab('report')} />
        )}

        {activeTab === 'status' && (
          <StatusEditor onStartExam={() => setActiveTab('exam')} />
        )}

        {activeTab === 'report' && (
          <ReportViewer
            onGoToExam={() => setActiveTab('exam')}
            openDockingModal={() => setIsDockingOpen(true)}
          />
        )}

        {activeTab === 'university' && (
          <TargetUniversityManager />
        )}

        {activeTab === 'trend' && (
          <ScoreTrendView onGoToExam={() => setActiveTab('exam')} />
        )}

        {activeTab === 'pass' && (
          <ExamPassSimulator onGoToRebirth={() => setActiveTab('rebirth')} />
        )}

        {activeTab === 'rebirth' && (
          <RebirthModal onGoToStatus={() => setActiveTab('status')} />
        )}
      </main>

      {/* ドッキング判定モーダル */}
      <DockingModal
        isOpen={isDockingOpen}
        onClose={() => setIsDockingOpen(false)}
      />

      {/* フッター */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="font-medium text-slate-300">
            大学受験 模試結果シミュレーター（進研模試・全統模試・駿台模試 リアルUI完全再現）
          </p>
          <p className="text-slate-500">
            ※本シミュレーターは学習意欲向上のためのエンタメ・教育用シミュレーターです。各模試の実際の配点や採点基準・判定ロジックを忠実にオマージュ・モデル化しています。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
