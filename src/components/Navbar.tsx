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
  TrendingUp,
  Menu,
  X,
  ChevronRight
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMute = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    setMuted(next);
  };

  const handleMobileTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* ロゴ */}
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none" onClick={() => setActiveTab('exam')}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-amber-200 via-white to-rose-200 bg-clip-text text-transparent truncate">
                    模試シミュレーター
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/30 shrink-0">
                    v2.5
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block truncate">
                  進研・全統・駿台のリアルUI再現 ＆ 志望校合否判定
                </p>
              </div>
            </div>

            {/* 右側：周回数 ＆ 転生ポイント ＆ アクション */}
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              {/* ドッキング判定クイック呼び出し（PC & スマホ） */}
              {canDock && (
                <button
                  onClick={openDockingModal}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] sm:text-sm font-bold rounded-lg shadow-md hover:shadow-purple-500/25 transition-all transform active:scale-95 animate-pulse-subtle"
                  title="マーク模試と記述模試を合成してドッキング総合判定！"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">ドッキング</span>
                </button>
              )}

              {/* サウンドON/OFFトグル */}
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-300 transition"
                title={isAudioMuted ? 'サウンドをONにする' : 'サウンドをミュートにする'}
                aria-label="ミュート切替"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              </button>

              {/* 周回数（スマホでもコンパクトに表示） */}
              <div className="flex items-center space-x-1 bg-slate-800/90 px-2 py-1 rounded-lg border border-slate-700 text-[11px] sm:text-xs text-slate-300">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 shrink-0" />
                <span className="font-bold">{userProfile.loopCount}周</span>
              </div>

              {/* 転生ポイント */}
              <button
                onClick={() => setActiveTab('rebirth')}
                className="flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-300 px-2 sm:px-3 py-1 rounded-lg border border-amber-500/40 text-[11px] sm:text-sm font-semibold transition"
                title="転生ポイントを使って強くてニューゲーム＆パッシブスキル解放！"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 animate-spin-slow shrink-0" />
                <span className="font-mono font-bold">{userProfile.rebirthPoints}pt</span>
              </button>
            </div>
          </div>

          {/* PC向け上部タブナビゲーション（md以上で表示） */}
          <div className="hidden md:flex overflow-x-auto scrollbar-none space-x-1 pb-2 pt-1 border-t border-slate-800/60">
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

      {/* =========================================================================
          スマホ専用: 固定ボトムナビゲーションバー（下部固定で親指で即操作可能）
      ========================================================================= */}
      <nav 
        aria-label="モバイル下部ナビゲーション"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-14 items-center">
          {/* 1: 模試 */}
          <button
            onClick={() => handleMobileTabSelect('exam')}
            className={`flex flex-col items-center justify-center h-full transition ${
              activeTab === 'exam'
                ? 'text-rose-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'exam' ? 'bg-rose-500/20' : ''}`}>
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">模試受験</span>
          </button>

          {/* 2: 育成 */}
          <button
            onClick={() => handleMobileTabSelect('status')}
            className={`flex flex-col items-center justify-center h-full transition ${
              activeTab === 'status'
                ? 'text-rose-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'status' ? 'bg-rose-500/20' : ''}`}>
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">学力育成</span>
          </button>

          {/* 3: 成績表 */}
          <button
            onClick={() => handleMobileTabSelect('report')}
            className={`flex flex-col items-center justify-center h-full transition relative ${
              activeTab === 'report'
                ? 'text-rose-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg relative ${activeTab === 'report' ? 'bg-rose-500/20' : ''}`}>
              <FileText className="w-5 h-5" />
              {examHistory.length > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full leading-none">
                  {examHistory.length}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">成績表</span>
          </button>

          {/* 4: 本番 */}
          <button
            onClick={() => handleMobileTabSelect('pass')}
            className={`flex flex-col items-center justify-center h-full transition ${
              activeTab === 'pass'
                ? 'text-pink-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'pass' ? 'bg-pink-500/20' : ''}`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">合格発表</span>
          </button>

          {/* 5: メニュー（推移・志望校・転生・ドッキング） */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center justify-center h-full transition ${
              isMobileMenuOpen || ['trend', 'university', 'rebirth'].includes(activeTab)
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isMobileMenuOpen || ['trend', 'university', 'rebirth'].includes(activeTab) ? 'bg-amber-500/20' : ''}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">メニュー</span>
          </button>
        </div>
      </nav>

      {/* =========================================================================
          スマホ専用: スライドアップ メニューモーダル
      ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto space-y-4 pb-20 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* メニュートップバー */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-white">その他のメニュー</span>
                <span className="text-xs text-slate-400">({userProfile.loopCount}周目)</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* クイックリンク一覧 */}
            <div className="grid grid-cols-1 gap-2.5">
              {/* ドッキング判定 */}
              {canDock && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openDockingModal();
                  }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 text-purple-200 hover:bg-purple-800/40 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Layers className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">ドッキング総合判定</div>
                      <div className="text-[11px] text-purple-300">マーク模試と記述模試を合成して判定</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </button>
              )}

              {/* 成績推移グラフ */}
              <button
                onClick={() => handleMobileTabSelect('trend')}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  activeTab === 'trend'
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <div className="text-left">
                    <div className="text-sm font-bold">成績推移グラフ</div>
                    <div className="text-[11px] text-slate-400">受験回ごとの偏差値や判定の変化を分析</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* 志望校・ボーダー編集 */}
              <button
                onClick={() => handleMobileTabSelect('university')}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  activeTab === 'university'
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-sm font-bold">志望校・ボーダー編集</div>
                    <div className="text-[11px] text-slate-400">第1〜第6志望の大学やボーダー偏差値をカスタム</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* 強くてニューゲーム */}
              <button
                onClick={() => handleMobileTabSelect('rebirth')}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  activeTab === 'rebirth'
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div className="text-left">
                    <div className="text-sm font-bold text-amber-300">強くてニューゲーム（転生）</div>
                    <div className="text-[11px] text-slate-400">所持pt: {userProfile.rebirthPoints}pt ・ パッシブ能力解放</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* サウンド設定 */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-2">
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                <span>効果音・演出音</span>
              </span>
              <button
                onClick={toggleMute}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  isAudioMuted ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isAudioMuted ? 'ミュート中（OFF）' : '有効（ON）'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
