import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Award, 
  FileText, 
  Layers, 
  SlidersHorizontal,
  BookmarkCheck,
  Flame,
  Volume2,
  VolumeX,
  TrendingUp
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { setMuted, getMuted } from '../utils/audio';

export type TabType = 'status' | 'exam' | 'report' | 'university' | 'rebirth' | 'trend' | 'pass';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openDockingModal: () => void;
  canDock: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  openDockingModal,
  canDock 
}) => {
  const { userProfile, examHistory } = useGame();
  const [isAudioMuted, setIsAudioMuted] = useState(getMuted());

  const toggleMute = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    setMuted(next);
  };

  return (
    <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('exam')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-200 via-white to-rose-200 bg-clip-text text-transparent">
                  大学受験 模試シミュレーター
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/30">
                  Ver 2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                進研・全統・駿台のリアルUI再現 ＆ 志望校合否判定
              </p>
            </div>
          </div>

          {/* 右側：周回数 ＆ 転生ポイント ＆ ドッキングボタン */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* ドッキング判定クイック呼び出し */}
            {canDock && (
              <button
                onClick={openDockingModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 animate-pulse-subtle"
                title="マーク模試と記述模試を合成してドッキング総合判定！"
              >
                <Layers className="w-4 h-4" />
                <span>ドッキング判定</span>
              </button>
            )}

            {/* サウンドON/OFFトグル */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={isAudioMuted ? 'サウンドをONにする' : 'サウンドをミュートにする'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* 周回数 */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{userProfile.loopCount}周目</span>
            </div>

            {/* 転生ポイント */}
            <button
              onClick={() => setActiveTab('rebirth')}
              className="flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/40 text-xs sm:text-sm font-semibold transition"
              title="転生ポイントを使って強くてニューゲーム＆パッシブスキル解放！"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin-slow" />
              <span>{userProfile.rebirthPoints} pt</span>
            </button>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="flex overflow-x-auto scrollbar-none space-x-1 pb-2 pt-1 border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'exam'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>模試を受験する</span>
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'status'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>学力ステータス育成 (Lv.1〜99)</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap relative ${
              activeTab === 'report'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>成績表（リアルUI再現）</span>
            {examHistory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-slate-700 text-amber-300 text-[10px] rounded-full">
                {examHistory.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('trend')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'trend'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>成績推移グラフ</span>
          </button>

          <button
            onClick={() => setActiveTab('pass')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'pass'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30 animate-pulse-subtle'
                : 'text-rose-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-rose-400" />
            <span>🌸 大学入試本番・合格発表</span>
          </button>

          <button
            onClick={() => setActiveTab('university')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'university'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>志望校・ボーダー編集</span>
          </button>

          <button
            onClick={() => setActiveTab('rebirth')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'rebirth'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-amber-300/80 hover:bg-slate-800 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>強くてニューゲーム</span>
          </button>
        </div>
      </div>
    </header>
  );
};
