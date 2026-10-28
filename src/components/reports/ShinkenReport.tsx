import React, { useState } from 'react';
import { ExamResult } from '../../types';
import { 
  ChevronRight, 
  MapPin, 
  HelpCircle, 
  FileText, 
  RotateCw, 
  School, 
  BookOpen, 
  ChevronDown, 
  Flag, 
  CheckCircle, 
  AlertTriangle,
  X,
  ExternalLink,
  ChevronLeft,
  Building2
} from 'lucide-react';

interface ShinkenReportProps {
  result: ExamResult;
}

export const ShinkenReport: React.FC<ShinkenReportProps> = ({ result }) => {
  // 画面モード: 'digest' (2x2カード) | 'detail' (成績結果・詳細画面)
  const [screenMode, setScreenMode] = useState<'digest' | 'detail'>('digest');

  // 詳細画面内のタブ: 'results' (成績結果) | 'judgments' (志望校・判定) | 'review' (復習)
  const [activeSubTab, setActiveSubTab] = useState<'results' | 'judgments' | 'review'>('results');

  // 成績結果内のスコープ切替: 'national' (全国) | 'pref' (都道府県) | 'school' (校内)
  const [scope, setScope] = useState<'national' | 'pref' | 'school'>('national');

  // ダイジェスト用の設定
  const [digestSubScoreMode, setDigestSubScoreMode] = useState<'deviation' | 'score'>('deviation');
  const [digestRankMode, setDigestRankMode] = useState<'national' | 'school'>('national');

  // 設問別成績で選択中の教科
  const [selectedQuestionSubject, setSelectedQuestionSubject] = useState<string>(
    result.subjectResults[0]?.subjectId || 'japanese_modern'
  );

  // 志望校判定カルーセル（第1志望〜第6志望）
  const [currentChoiceIdx, setCurrentChoiceIdx] = useState(0);

  // 都道府県名（デフォルト東京都）
  const prefName = '東京都';
  const prefExaminees = Math.round(result.totalExaminees * 0.082); // 都内約3.6万人
  const schoolExaminees = 280;

  // 偏差値と順位のスコープ別計算ヘルパー
  const getScopeData = (rawDeviation: number, rawRank: number) => {
    if (scope === 'national') {
      return {
        deviation: rawDeviation,
        rank: rawRank,
        total: result.totalExaminees,
      };
    } else if (scope === 'pref') {
      // 都道府県（ややハイレベルな地域バイアス）
      const prefDev = Math.round((rawDeviation * 0.98 + 1.2) * 10) / 10;
      const prefRank = Math.max(1, Math.round((rawRank / result.totalExaminees) * prefExaminees * 1.05));
      return {
        deviation: prefDev,
        rank: prefRank,
        total: prefExaminees,
      };
    } else {
      // 校内
      const schoolDev = Math.round((rawDeviation * 0.92 + 3.8) * 10) / 10;
      const schoolRank = Math.max(1, Math.round((rawRank / result.totalExaminees) * schoolExaminees));
      return {
        deviation: schoolDev,
        rank: schoolRank,
        total: schoolExaminees,
      };
    }
  };

  // 教科別マッピング
  const kokugo = result.subjectResults.find(s => s.subjectId.includes('japanese')) || result.subjectResults[0];
  const sugaku = result.subjectResults.find(s => s.subjectId.includes('math')) || result.subjectResults[1];
  const eigo = result.subjectResults.find(s => s.subjectId.includes('english')) || result.subjectResults[2];

  // 3教科合計
  const kseScore = (kokugo?.score || 57) + (sugaku?.score || 42) + (eigo?.score || 58);
  const kseMax = (kokugo?.maxScore || 100) + (sugaku?.maxScore || 100) + (eigo?.maxScore || 100);
  const kseDev = Math.round((((kokugo?.deviationValue || 63) + (sugaku?.deviationValue || 55.5) + (eigo?.deviationValue || 63.8)) / 3) * 10) / 10;
  const kseRank = Math.max(1, Math.round(result.totalExaminees * (1 / (1 + Math.exp(1.6 * ((kseDev - 50) / 10))))));

  // 2教科国英
  const keScore = (kokugo?.score || 57) + (eigo?.score || 58);
  const keMax = (kokugo?.maxScore || 100) + (eigo?.maxScore || 100);
  const keDev = Math.round((((kokugo?.deviationValue || 63) + (eigo?.deviationValue || 63.8)) / 2) * 10) / 10;
  const keRank = Math.max(1, Math.round(result.totalExaminees * (1 / (1 + Math.exp(1.6 * ((keDev - 50) / 10))))));

  // 2教科数英
  const seScore = (sugaku?.score || 42) + (eigo?.score || 58);
  const seMax = (sugaku?.maxScore || 100) + (eigo?.maxScore || 100);
  const seDev = Math.round((((sugaku?.deviationValue || 55.5) + (eigo?.deviationValue || 63.8)) / 2) * 10) / 10;
  const seRank = Math.max(1, Math.round(result.totalExaminees * (1 / (1 + Math.exp(1.6 * ((seDev - 50) / 10))))));

  // 最も復習が必要な教科（偏差値が最も低い教科）
  const weakestSubject = [...result.subjectResults].sort((a, b) => a.deviationValue - b.deviationValue)[0] || sugaku;

  // 選択中の設問別教科データ
  const currentQSubject = result.subjectResults.find(s => s.subjectId === selectedQuestionSubject) || kokugo;

  // 志望校判定選択中の大学
  const currentChoice = result.judgments[currentChoiceIdx] || result.judgments[0];

  return (
    <div className="bg-[#fff9ef] min-h-[700px] rounded-2xl border-2 border-[#f5b358]/60 shadow-2xl max-w-4xl mx-auto font-sans text-slate-800 overflow-hidden">
      
      {/* =========================================================================
          ヘッダーバー（参考スクリーンショット上部完全再現）
      ========================================================================= */}
      <div className="bg-white border-b border-[#f3cca0] px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-black text-xs sm:text-sm text-slate-800 tracking-tight">
              模試カルテ {screenMode === 'digest' ? 'ダイジェスト' : activeSubTab === 'results' ? '成績結果画面' : '志望校判定画面'} ｜ 進研模試／ベネッセ総…
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {screenMode === 'detail' && (
              <button
                onClick={() => setScreenMode('digest')}
                className="text-xs font-black px-3 py-1 bg-[#fff2e0] hover:bg-[#ffe6c4] text-[#f06700] rounded-full border border-[#f5b358] transition flex items-center space-x-1"
              >
                <span>ダイジェスト</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setScreenMode(screenMode === 'digest' ? 'detail' : 'digest')}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="閉じる / 切替"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-1 text-xs text-slate-500 font-semibold flex items-center justify-between">
          <span>進研模試／ベネッセ総合学力テスト（{result.course === 'sciences' ? '理系' : '文系'}）</span>
          <span className="text-[11px] text-slate-400 font-mono">{result.studentName} 様</span>
        </div>
      </div>

      {/* =========================================================================
          モード 1: ダイジェスト画面（参考画像: 進研模試.jpg 2x2カード）
      ========================================================================= */}
      {screenMode === 'digest' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#f3cca0]">
            <div className="text-xs font-bold text-slate-600">
              ベネッセ総合学力テスト 個人生徒カルテ ダイジェスト
            </div>
            <button
              onClick={() => {
                setScreenMode('detail');
                setActiveSubTab('results');
              }}
              className="text-xs font-black text-[#f06700] bg-white border border-[#f5b358] px-3.5 py-1 rounded-full hover:bg-[#fef4e6] transition shadow-xs flex items-center space-x-1"
            >
              <span>成績結果詳細画面へ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2x2 カードグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* カード1：総合得点・満点・偏差値 */}
            <div className="bg-white rounded-2xl border-2 border-[#f7941d] p-5 shadow-sm relative flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 bg-[#f7941d] text-white text-xs font-black px-5 py-1.5 rounded-br-2xl shadow-sm tracking-wider">
                {result.course === 'sciences' ? '6-8理系' : '5-7文系'}
              </div>

              <div className="mt-6 text-center">
                <div className="inline-block relative">
                  <span className="text-5xl sm:text-6xl font-black text-[#f06700] tracking-tight">
                    {result.totalScore}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#f06700] ml-1">点</span>
                  <div className="w-full h-1 bg-[#f06700] mt-1 rounded-full mx-auto" />
                </div>
                <div className="mt-2 text-xl sm:text-2xl font-black text-[#f06700]">
                  {result.totalMaxScore}点
                </div>
                <div className="mt-4 text-sm sm:text-base font-bold text-slate-800">
                  偏差値 <span className="text-lg font-black">{result.overallDeviation}</span>
                  <span className="ml-1 text-slate-700 font-bold">（{result.gtzOverall || 'A1'}）</span>
                </div>
              </div>

              <div className="mt-6 pt-3 flex justify-end">
                <button
                  onClick={() => {
                    setScreenMode('detail');
                    setActiveSubTab('results');
                  }}
                  className="bg-[#fef4e6] hover:bg-[#fee7c8] text-[#f06700] border border-[#fbd4a4] px-4 py-1.5 rounded-full text-xs font-black transition flex items-center space-x-1"
                >
                  <span>成績結果</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* カード2：志望校判定 */}
            <div className="bg-white rounded-2xl border-2 border-[#f7941d] p-5 shadow-sm relative flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 bg-[#f7941d] text-white text-xs font-black px-5 py-1.5 rounded-br-2xl shadow-sm tracking-wider">
                志望校判定
              </div>

              <div className="mt-6 text-center">
                <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                  {result.judgments[0]?.university.name || '岡山大'}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  {result.judgments[0]?.university.faculty || '医 医 前'}
                </div>

                <div className="relative my-2 inline-flex items-center justify-center">
                  <svg className="w-32 h-28 text-slate-200/80 absolute -z-0" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 85 C30 80, 15 60, 20 35 C22 45, 28 55, 38 62 C30 50, 28 35, 34 20 C38 30, 44 40, 50 48 C56 40, 62 30, 66 20 C72 35, 70 50, 62 62 C72 55, 78 45, 80 35 C85 60, 70 80, 50 85 Z" opacity="0.35"/>
                  </svg>
                  <span className="text-6xl sm:text-7xl font-black text-[#f06700] relative z-10">
                    {result.judgments[0]?.rank || 'E'}
                  </span>
                </div>

                <div className="inline-block bg-[#fcefe7] text-[#c94900] text-xs font-bold px-3 py-1 rounded-full border border-[#f7c8b2] shadow-xs">
                  あと <strong className="text-[#f06700] text-sm">38点</strong> で1ランクUP！
                </div>
              </div>

              <div className="mt-6 pt-3 flex justify-end">
                <button
                  onClick={() => {
                    setScreenMode('detail');
                    setActiveSubTab('judgments');
                  }}
                  className="bg-[#fef4e6] hover:bg-[#fee7c8] text-[#f06700] border border-[#fbd4a4] px-4 py-1.5 rounded-full text-xs font-black transition flex items-center space-x-1"
                >
                  <span>志望校・判定</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* カード3：六角形レーダーチャート */}
            <div className="bg-white rounded-2xl border-2 border-[#f7941d] p-5 shadow-sm relative flex flex-col justify-between">
              <div className="absolute top-0 left-0 flex">
                <button
                  onClick={() => setDigestSubScoreMode('deviation')}
                  className={`text-xs font-black px-4 py-1.5 rounded-br-xl transition ${
                    digestSubScoreMode === 'deviation' ? 'bg-[#f7941d] text-white' : 'bg-[#fdeedc] text-[#c96200]'
                  }`}
                >
                  教科別成績（偏差値）
                </button>
                <button
                  onClick={() => setDigestSubScoreMode('score')}
                  className={`text-xs font-black px-3 py-1.5 rounded-br-xl transition ${
                    digestSubScoreMode === 'score' ? 'bg-[#f7941d] text-white' : 'bg-[#fdeedc] text-[#c96200]'
                  }`}
                >
                  得点
                </button>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                    {[0.33, 0.66, 1.0].map((level, i) => (
                      <polygon
                        key={i}
                        points={Array.from({ length: 6 }).map((_, idx) => {
                          const angle = (Math.PI * 2 / 6) * idx - Math.PI / 2;
                          const r = 68 * level;
                          return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                        }).join(' ')}
                        fill={i === 2 ? '#fafafa' : 'none'}
                        stroke="#e2e8f0"
                        strokeWidth="1.2"
                      />
                    ))}
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const angle = (Math.PI * 2 / 6) * idx - Math.PI / 2;
                      return (
                        <line
                          key={idx}
                          x1={100}
                          y1={100}
                          x2={100 + 68 * Math.cos(angle)}
                          y2={100 + 68 * Math.sin(angle)}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />
                      );
                    })}
                    {/* ポリゴン */}
                    <polygon
                      points="100,42 148,65 145,138 100,152 52,142 55,68"
                      fill="rgba(247, 148, 29, 0.45)"
                      stroke="#f06700"
                      strokeWidth="2.5"
                    />
                  </svg>
                  {/* 各軸ラベル */}
                  <div className="absolute top-1 text-center"><div className="text-[11px] font-bold">英語</div><div className="text-xs font-black text-[#f06700]">63.8</div></div>
                  <div className="absolute top-12 right-2 text-center"><div className="text-[11px] font-bold">国語</div><div className="text-xs font-black text-[#f06700]">63.0</div></div>
                  <div className="absolute bottom-10 right-2 text-center"><div className="text-[11px] font-bold">歴公</div><div className="text-xs font-black text-[#f06700]">65.2</div></div>
                  <div className="absolute bottom-0 text-center"><div className="text-[11px] font-bold">情報</div><div className="text-xs font-black text-[#f06700]">65.8</div></div>
                  <div className="absolute bottom-10 left-2 text-center"><div className="text-[11px] font-bold">理科</div><div className="text-xs font-black text-[#f06700]">45.1</div></div>
                  <div className="absolute top-12 left-2 text-center"><div className="text-[11px] font-bold">数学</div><div className="text-xs font-black text-[#f06700]">55.5</div></div>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#f06700]" />
                  <span>前回結果比較</span>
                </label>
                <button
                  onClick={() => {
                    setScreenMode('detail');
                    setActiveSubTab('results');
                  }}
                  className="bg-[#fef4e6] hover:bg-[#fee7c8] text-[#f06700] border border-[#fbd4a4] px-4 py-1.5 rounded-full text-xs font-black transition flex items-center space-x-1"
                >
                  <span>成績結果</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* カード4：全国順位 ＆ ピラミッド階層図 */}
            <div className="bg-white rounded-2xl border-2 border-[#f7941d] p-5 shadow-sm relative flex flex-col justify-between">
              <div className="absolute top-0 left-0 flex">
                <button
                  onClick={() => setDigestRankMode('national')}
                  className={`text-xs font-black px-4 py-1.5 rounded-br-xl transition ${
                    digestRankMode === 'national' ? 'bg-[#f7941d] text-white' : 'bg-[#fdeedc] text-[#c96200]'
                  }`}
                >
                  全国順位
                </button>
                <button
                  onClick={() => setDigestRankMode('school')}
                  className={`text-xs font-black px-3 py-1.5 rounded-br-xl transition ${
                    digestRankMode === 'school' ? 'bg-[#f7941d] text-white' : 'bg-[#fdeedc] text-[#c96200]'
                  }`}
                >
                  校内順位
                </button>
              </div>

              <div className="mt-6 text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#f06700] tracking-tight">
                  {digestRankMode === 'national' ? `${result.overallRank.toLocaleString()}位` : `${Math.round(result.overallRank / 450)}位`}
                  <span className="text-sm font-normal text-slate-500 ml-1">
                    / {digestRankMode === 'national' ? `${result.totalExaminees.toLocaleString()}人` : '280人'}
                  </span>
                </div>

                <div className="mt-4 relative max-w-[220px] mx-auto py-2">
                  <div className="space-y-1 flex flex-col items-center">
                    <div className="w-12 h-5 bg-slate-200 rounded-t-sm flex items-center justify-center text-[10px] text-slate-500 font-bold">5%</div>
                    <div className="w-24 h-5 bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">20%</div>
                    <div className="w-36 h-5 bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">50%</div>
                    <div className="w-48 h-5 bg-slate-200 rounded-b-sm flex items-center justify-center text-[10px] text-slate-500 font-bold">80%</div>
                  </div>
                  <div className="absolute top-1/2 left-[68%] transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                    <div className="bg-[#f06700] text-white p-1 rounded-full shadow-md">
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-semibold mt-1">
                  上位 {((result.overallRank / result.totalExaminees) * 100).toFixed(1)}% の位置
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#f06700]" />
                  <span>前回結果比較</span>
                </label>
                <button
                  onClick={() => {
                    setScreenMode('detail');
                    setActiveSubTab('results');
                  }}
                  className="bg-[#fef4e6] hover:bg-[#fee7c8] text-[#f06700] border border-[#fbd4a4] px-4 py-1.5 rounded-full text-xs font-black transition flex items-center space-x-1"
                >
                  <span>成績結果</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          モード 2: 詳細画面（参考スクリーンショット 4枚の全機能完全再現）
      ========================================================================= */}
      {screenMode === 'detail' && (
        <div className="space-y-5">
          
          {/* 上部サブタブバー（成績結果 / 志望校・判定 / 復習） */}
          <div className="bg-slate-100 border-b border-slate-200 grid grid-cols-3 text-center text-sm font-bold">
            <button
              onClick={() => setActiveSubTab('results')}
              className={`py-3 transition ${
                activeSubTab === 'results'
                  ? 'bg-white text-[#f06700] border-t-2 border-[#f06700] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              成績結果
            </button>
            <button
              onClick={() => setActiveSubTab('judgments')}
              className={`py-3 transition ${
                activeSubTab === 'judgments'
                  ? 'bg-white text-[#f06700] border-t-2 border-[#f06700] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              志望校・判定
            </button>
            <button
              onClick={() => setActiveSubTab('review')}
              className={`py-3 transition ${
                activeSubTab === 'review'
                  ? 'bg-white text-[#f06700] border-t-2 border-[#f06700] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              復習
            </button>
          </div>

          {/* -------------------------------------------------------------
              詳細タブ 1: 成績結果画面（全国 / 都道府県 / 校内）
          ------------------------------------------------------------- */}
          {activeSubTab === 'results' && (
            <div className="p-4 sm:p-6 space-y-6">
              
              {/* まっさきに復習してほしい教科バナー（スクショ1枚目完全再現） */}
              <div className="bg-[#fdf0e9] border border-[#f8cdb5] rounded-xl p-4">
                <div className="flex items-center space-x-2 text-[#c94900] font-black text-sm mb-2.5">
                  <div className="w-4 h-3 flex flex-col justify-between">
                    <span className="w-full h-0.5 bg-[#f06700] rounded"></span>
                    <span className="w-3/4 h-0.5 bg-[#f06700] rounded"></span>
                    <span className="w-1/2 h-0.5 bg-[#f06700] rounded"></span>
                  </div>
                  <span>まっさきに復習してほしい教科</span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-[#f7c8b2] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-base font-black text-slate-900 mr-3">{weakestSubject.name}</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {weakestSubject.questions[0]?.title || '数と式・基礎計算'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedQuestionSubject(weakestSubject.subjectId);
                      const el = document.getElementById('question-breakdown-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-1.5 bg-[#f06700] hover:bg-[#d85800] text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center space-x-1"
                  >
                    <span>復習</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 全国 / 都道府県 / 校内 切り替えピルボタン（スクショ1枚目完全再現） */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setScope('national')}
                  className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-black transition text-center ${
                    scope === 'national'
                      ? 'bg-[#0088e0] text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  全国
                </button>
                <button
                  onClick={() => setScope('pref')}
                  className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-black transition text-center ${
                    scope === 'pref'
                      ? 'bg-[#0088e0] text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  都道府県
                </button>
                <button
                  onClick={() => setScope('school')}
                  className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-black transition text-center ${
                    scope === 'school'
                      ? 'bg-[#0088e0] text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  校内
                </button>
              </div>

              {/* 成績概況テーブル（スクショ1枚目完全再現・スマホジャストフィット） */}
              <div className="overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-xs text-left border-collapse font-sans table-fixed">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-center text-[11px] sm:text-xs">
                      <th className="py-2.5 px-2 border-r border-slate-200 text-center w-[27%]">科目</th>
                      <th className="py-2.5 px-1 border-r border-slate-200 w-[25%]">得点 / 満点</th>
                      <th className="py-2.5 px-1 border-r border-slate-200 w-[18%] text-[#f06700]">偏差値</th>
                      <th className="py-2.5 px-1 w-[30%]">順位</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px] sm:text-xs">
                    {/* 国数英総合 */}
                    <tr className="hover:bg-slate-50/60 font-bold">
                      <td className="py-2.5 px-2 border-r border-slate-200 font-sans truncate">国数英総合</td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-center whitespace-nowrap">{kseScore} / {kseMax}</td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-center text-[#f06700] font-black text-xs sm:text-sm">
                        {getScopeData(kseDev, kseRank).deviation}
                      </td>
                      <td className="py-2 px-1 text-center leading-tight">
                        <div className="font-bold text-slate-800">{getScopeData(kseDev, kseRank).rank.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">/ {getScopeData(kseDev, kseRank).total.toLocaleString()}</div>
                      </td>
                    </tr>

                    {/* 2教科国英 */}
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-2 border-r border-slate-200 font-sans truncate">2教科国英</td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-center whitespace-nowrap">{keScore} / {keMax}</td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-center text-[#f06700] font-bold">
                        {getScopeData(keDev, keRank).deviation}
                      </td>
                      <td className="py-2 px-1 text-center leading-tight">
                        <div className="font-bold text-slate-800">{getScopeData(keDev, keRank).rank.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">/ {getScopeData(keDev, keRank).total.toLocaleString()}</div>
                      </td>
                    </tr>

                    {/* 2教科数英 */}
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-2 border-r border-slate-200 font-sans truncate">2教科数英</td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-center whitespace-nowrap">{seScore} / {seMax}</td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-center text-[#f06700] font-bold">
                        {getScopeData(seDev, seRank).deviation}
                      </td>
                      <td className="py-2 px-1 text-center leading-tight">
                        <div className="font-bold text-slate-800">{getScopeData(seDev, seRank).rank.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">/ {getScopeData(seDev, seRank).total.toLocaleString()}</div>
                      </td>
                    </tr>

                    {/* 各科目行（国語、数学、英語、理科、社会、情報） */}
                    {result.subjectResults.map((sub) => {
                      const d = getScopeData(sub.deviationValue, sub.rank);
                      return (
                        <tr key={sub.subjectId} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-2 border-r border-slate-200 font-sans font-medium text-slate-900 truncate">
                            {sub.name}
                          </td>
                          <td className="py-2.5 px-1 border-r border-slate-200 text-center font-bold whitespace-nowrap">
                            {sub.score} / {sub.maxScore}
                          </td>
                          <td className="py-2.5 px-1 border-r border-slate-200 text-center font-black text-[#f06700]">
                            {d.deviation}
                          </td>
                          <td className="py-2 px-1 text-center leading-tight">
                            <div className="font-bold text-slate-800">{d.rank.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-400">/ {d.total.toLocaleString()}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* -------------------------------------------------------------
                  目標得点・自己採点結果・得点の比較グラフ（スクショ3枚目完全再現）
              ------------------------------------------------------------- */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-[#0088e0] tracking-tight">
                    目標得点・自己採点結果・得点の比較グラフ
                  </h3>
                  <div className="flex items-center space-x-3 text-xs font-semibold">
                    <span className="flex items-center gap-1.5"><span className="w-3.5 h-3 bg-slate-500 rounded-xs"></span>目標得点</span>
                    <span className="flex items-center gap-1.5"><span className="w-3.5 h-3 bg-[#a8d3ea] rounded-xs"></span>自己採点</span>
                    <span className="flex items-center gap-1.5"><span className="w-3.5 h-3 bg-[#f06700] rounded-xs"></span>得点</span>
                  </div>
                </div>

                {/* 縦棒グラフ */}
                <div className="h-56 flex items-end justify-around pt-6 pb-2 border-b border-slate-200 px-4">
                  {[
                    { name: '国語', goal: 65, self: 54, actual: kokugo?.score || 57 },
                    { name: '数学', goal: 50, self: 42, actual: sugaku?.score || 42 },
                    { name: '英語', goal: 65, self: 40, actual: eigo?.score || 58 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center space-y-2">
                      <div className="flex items-end space-x-1 h-44">
                        {/* 目標得点棒 */}
                        <div className="w-6 bg-slate-500 rounded-t-sm transition-all" style={{ height: `${(item.goal / 100) * 100}%` }} title={`目標: ${item.goal}点`}></div>
                        {/* 自己採点棒 */}
                        <div className="w-6 bg-[#a8d3ea] rounded-t-sm transition-all" style={{ height: `${(item.self / 100) * 100}%` }} title={`自己採点: ${item.self}点`}></div>
                        {/* 実際得点棒 */}
                        <div className="w-6 bg-[#f06700] rounded-t-sm transition-all shadow-xs" style={{ height: `${(item.actual / 100) * 100}%` }} title={`得点: ${item.actual}点`}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* -------------------------------------------------------------
                  偏差値 教科バランス（三角形レーダーチャート・スクショ3枚目）
              ------------------------------------------------------------- */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-black text-[#0088e0]">
                  偏差値 教科バランス
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  凹んでいる教科は今後伸びを期待できる教科だ！
                </p>

                <div className="flex items-center space-x-4 text-xs font-semibold py-1">
                  <span className="flex items-center gap-1"><span className="w-4 h-1 bg-[#f06700]"></span>あなたの偏差値</span>
                  <span className="flex items-center gap-1"><span className="w-4 h-0.5 border-t border-dashed border-[#0088e0]"></span>偏差値 50</span>
                  <span className="text-rose-600">赤字の教科…要注意教科</span>
                </div>

                <div className="flex justify-center py-4">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                      {/* 同心円/正三角形ガイド (40, 50, 60, 70) */}
                      {[0.35, 0.55, 0.75, 0.95].map((lvl, i) => (
                        <polygon
                          key={i}
                          points="100,20 180,165 20,165"
                          transform={`scale(${lvl}) translate(${100 * (1 - lvl) / lvl}, ${100 * (1 - lvl) / lvl})`}
                          fill="none"
                          stroke={i === 1 ? '#0088e0' : '#e2e8f0'}
                          strokeWidth="1.2"
                          strokeDasharray={i === 1 ? '3,3' : 'none'}
                        />
                      ))}
                      {/* 本人ポリゴン */}
                      <polygon
                        points="100,32 165,152 42,148"
                        fill="rgba(240, 103, 0, 0.25)"
                        stroke="#f06700"
                        strokeWidth="2.5"
                      />
                    </svg>

                    <div className="absolute top-0 text-center"><div className="text-xs font-bold text-slate-800">英語計</div><div className="text-[10px] text-slate-500">63.8</div></div>
                    <div className="absolute bottom-0 right-2 text-center"><div className="text-xs font-bold text-slate-800">国語計</div><div className="text-[10px] text-slate-500">63.0</div></div>
                    <div className="absolute bottom-0 left-2 text-center"><div className="text-xs font-bold text-rose-600">数学計</div><div className="text-[10px] text-rose-600 font-bold">55.5</div></div>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  設問別成績（スクショ2枚目完全再現）
              ------------------------------------------------------------- */}
              <div id="question-breakdown-section" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-1">
                    教科をクリックすると、集計科目が表示されます
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-base font-black text-[#0088e0]">設問別成績</h3>
                    <select
                      value={selectedQuestionSubject}
                      onChange={(e) => setSelectedQuestionSubject(e.target.value)}
                      className="text-xs font-bold p-2 border border-slate-300 rounded-lg bg-slate-50"
                    >
                      {result.subjectResults.map(s => (
                        <option key={s.subjectId} value={s.subjectId}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 凡例 */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold pt-1">
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-2.5 bg-slate-500 rounded-xs"></span>全国平均得点率</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-2.5 bg-[#f06700] rounded-xs"></span>あなたの得点率</span>
                  <span className="flex items-center gap-1 text-rose-600"><Flag className="w-3.5 h-3.5 fill-current" /> 目標得点率</span>
                  <span className="flex items-center gap-1 text-sky-500">◯ よくできた分野</span>
                  <span className="flex items-center gap-1 text-rose-500">▼ 対策が必要な分野</span>
                </div>

                {/* 大問別テーブル */}
                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full min-w-[340px] text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-center text-[11px]">
                        <th className="p-2.5 text-left w-36">大問・分野</th>
                        <th className="p-2.5 w-20">得点/配点</th>
                        <th className="p-2.5 w-44">得点率(%) [0 - 50 - 100]</th>
                        <th className="p-2.5 w-16">全国平均</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentQSubject.questions.map((q, idx) => {
                        const userPct = q.percentage;
                        const avgPct = Math.round((q.averageScore / q.maxScore) * 100);
                        const isWeak = userPct < avgPct;
                        const isGood = userPct >= 70;

                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-800">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono">{idx + 1}</span>
                                <span className="truncate max-w-[140px]">{q.title}</span>
                                {isGood && <span className="text-sky-500 font-black">◯</span>}
                                {isWeak && <span className="text-rose-500 font-black text-[10px]">▼</span>}
                              </div>
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold">
                              {q.score} / {q.maxScore}
                            </td>
                            <td className="p-2.5">
                              {/* 2重バーグラフ（オレンジ本人 ＆ グレー全国平均 ＆ 目標旗🚩） */}
                              <div className="space-y-1">
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                                  <div className="h-full bg-[#f06700]" style={{ width: `${userPct}%` }} />
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-slate-400" style={{ width: `${avgPct}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="p-2.5 text-center font-mono text-slate-500">
                              {q.averageScore}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* アドバイスフキダシ */}
                <div className="bg-[#f0f9ff] border border-sky-200 rounded-xl p-3 text-xs space-y-1.5 text-slate-700">
                  <div className="font-bold text-slate-900">
                    あと <span className="text-[#f06700] font-black text-sm">2点</span> でひとつ上のGTZ <span className="font-black text-rose-600">A1</span> に到達！
                  </div>
                  <div className="text-sky-800 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-[#0088e0] rounded-sm"></span>
                    <span>復習するなら「{weakestSubject.questions[0]?.title || '第1問'}」がオススメ！</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              詳細タブ 2: 志望校・判定画面（スクショ4枚目完全再現）
          ------------------------------------------------------------- */}
          {activeSubTab === 'judgments' && (
            <div className="p-4 sm:p-6 space-y-5">
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700">WEB登録志望校 個人成績表に表示されている志望校</span>
                <span className="text-sky-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> 合格可能判定の見方
                </span>
              </div>

              {/* シアンのヘッダーバー（第1志望 1/4 ＞） */}
              <div className="bg-[#0088e0] text-white p-3.5 rounded-t-xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-[10px] font-bold tracking-wider opacity-90">WEB登録志望校</div>
                  <div className="text-base font-black">第{currentChoiceIdx + 1}志望</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentChoiceIdx === 0}
                    onClick={() => setCurrentChoiceIdx(prev => Math.max(0, prev - 1))}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs font-bold">{currentChoiceIdx + 1} / {result.judgments.length}</span>
                  <button
                    disabled={currentChoiceIdx === result.judgments.length - 1}
                    onClick={() => setCurrentChoiceIdx(prev => Math.min(result.judgments.length - 1, prev + 1))}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 大学カード */}
              <div className="bg-[#f0f8fd] border-x border-b border-sky-200 rounded-b-xl p-5 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      {currentChoice.university.type === 'national' ? '国公立' : '私立'}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {currentChoice.university.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600">
                      {currentChoice.university.faculty}
                    </p>
                  </div>
                </div>

                <button className="w-full py-2 bg-[#fff2e0] hover:bg-[#ffe6c4] text-[#f06700] border border-[#f5b358] rounded-xl text-xs font-black transition flex items-center justify-center space-x-1">
                  <span>パンフ・願書 追加 ＋</span>
                </button>

                {/* 判定ボックス */}
                <div className="bg-white rounded-xl p-4 border border-sky-100 shadow-sm space-y-3">
                  <div className="text-xs text-slate-500 font-semibold border-b pb-2">
                    ベネッセ総合学力テスト 実施判定結果
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">判定</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-lg bg-[#0088e0] text-white font-black text-2xl flex items-center justify-center shadow-xs">
                        {currentChoice.rank}
                      </div>
                      <span className="text-xs font-bold text-slate-600">({currentChoice.percentage}%)</span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition flex items-center justify-center space-x-1">
                    <span>合格者による先輩体験記</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button className="w-full py-3 bg-[#f06700] hover:bg-[#d85800] text-white font-black rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-1">
                  <span>志望校の大学情報トップへ</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              詳細タブ 3: 復習画面
          ------------------------------------------------------------- */}
          {activeSubTab === 'review' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                進研模試 弱点克服カリキュラム
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                今回の模試で失点した「{weakestSubject.name}」の基礎事項を徹底補強しましょう。
              </p>
              <button
                onClick={() => {
                  setActiveSubTab('results');
                }}
                className="px-6 py-2.5 bg-[#f06700] hover:bg-[#d85800] text-white text-xs font-bold rounded-xl"
              >
                成績結果画面へ戻る
              </button>
            </div>
          )}

        </div>
      )}

      {/* フッター */}
      <div className="bg-slate-50 px-4 py-3 border-t border-[#f3cca0] text-[11px] text-slate-500 flex items-center justify-between">
        <span>Benesse Corporation ・ マナビジョン 模試カルテ</span>
        <button
          onClick={() => setScreenMode(screenMode === 'digest' ? 'detail' : 'digest')}
          className="text-[#f06700] font-bold hover:underline"
        >
          {screenMode === 'digest' ? '詳細画面を開く ＞' : 'ダイジェストへ戻る ＞'}
        </button>
      </div>

    </div>
  );
};
