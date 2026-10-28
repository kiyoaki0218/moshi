import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { playDrumroll, playFanfare } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Sparkles, 
  Flame, 
  Clock, 
  Send, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  GraduationCap
} from 'lucide-react';

export const ExamPassSimulator: React.FC<{ onGoToRebirth: () => void }> = ({ onGoToRebirth }) => {
  const { userProfile, subjectLevels, universities, selectedUniversityIds } = useGame();

  const [selectedUnivId, setSelectedUnivId] = useState<string>(selectedUniversityIds[0] || universities[0]?.id || '');
  const [examStatus, setExamStatus] = useState<'ready' | 'testing' | 'result'>('ready');
  const [passResult, setPassResult] = useState<{
    passed: boolean;
    totalScore: number;
    borderScore: number;
    diff: number;
    rank: string;
    advice: string;
  } | null>(null);

  const targetUniv = universities.find(u => u.id === selectedUnivId) || universities[0];

  // 平均実力レベル (1〜99)
  const avgLevel = Math.round(
    subjectLevels.reduce((acc, s) => acc + s.level, 0) / subjectLevels.length
  );

  // 本番受験実行
  const handleTakeRealExam = () => {
    setExamStatus('testing');
    playDrumroll();

    setTimeout(() => {
      // 合否判定ロジック
      // ボーダー偏差値（全統基準）をもとに本番合格点を算出
      const targetBorder = targetUniv.borders.zento || 60;

      // 自分の実力偏差値換算（Lv.50 で偏差値50、Lv.80で偏差値68程度）
      const estimatedDev = 30 + (avgLevel / 99) * 45;

      // 本番の運要素 (-4 〜 +4)
      const roll = (Math.random() - 0.5) * 8;
      const finalRealDev = estimatedDev + roll;

      const diff = Math.round((finalRealDev - targetBorder) * 10) / 10;
      const passed = diff >= -1.0; // 多少の運でボーダーギリギリでも合格可能

      // 共通テスト換算配点 (例: 1000点満点)
      const totalScore = Math.round(600 + (finalRealDev - 50) * 16 + Math.random() * 20);
      const borderScore = Math.round(600 + (targetBorder - 50) * 16);

      const res = {
        passed,
        totalScore,
        borderScore,
        diff,
        rank: passed ? (diff >= 3 ? 'A判定首席級' : '合格') : '不合格（補欠）',
        advice: passed
          ? `見事、${targetUniv.name} ${targetUniv.faculty}の入試試験に合格しました！長い受験勉強の努力が結実した瞬間です！`
          : `惜しくもボーダーラインにあと一歩届きませんでした。この悔しさを胸に「強くてニューゲーム」で更なる高みを目指しましょう！`,
      };

      setPassResult(res);
      setExamStatus('result');

      if (passed) {
        playFanfare();
        // 満開の桜吹雪演出
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#ffb7b2', '#ff69b4', '#ffffff', '#ff1493', '#ffd700']
        });
      }
    }, 2800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 受験中アニメーションオーバーレイ */}
      {examStatus === 'testing' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-20 h-20 rounded-full border-4 border-rose-500 border-t-transparent animate-spin flex items-center justify-center mb-6">
            <GraduationCap className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-white">
            【令和入試本番】共通テスト ＆ ２次個別学力試験
          </h3>
          <p className="text-sm text-slate-300 animate-pulse">
            受験番号照合中… 解答用紙の採点・合格判定集計中…
          </p>
        </div>
      )}

      {/* トップバナー */}
      <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>大学入試本番 最終決戦</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            合格発表シミュレーター（サクラサク決戦）
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
            日々の模試と育成で高めた学力パラメータをもとに、第一志望大学の入試本番を受験！合格通知書を勝ち取れるか挑戦しましょう。
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center">
          <div className="text-xs text-rose-200 font-semibold">現在の総合実力</div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">Lv.{avgLevel}</div>
        </div>
      </div>

      {/* 入試本番 受験校選択 ＆ 本番突入カード */}
      {examStatus === 'ready' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-800">
              受験する大学・学部を選択
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {universities.filter(u => selectedUniversityIds.includes(u.id)).map((u) => {
                const isSelected = selectedUnivId === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUnivId(u.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-500">
                        {u.type === 'national' ? '国立' : '私立'} ・ ボーダー偏差値: {u.borders.zento}
                      </div>
                      <div className="font-black text-sm text-slate-900 mt-0.5">{u.name}</div>
                      <div className="text-xs text-slate-600">{u.faculty}</div>
                    </div>
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center">
            <button
              onClick={handleTakeRealExam}
              className="px-10 py-4 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-black text-base sm:text-lg rounded-xl shadow-xl shadow-rose-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 mx-auto"
            >
              <Send className="w-5 h-5" />
              <span>いざ、{targetUniv?.name} 入試本番を受験する！</span>
            </button>
          </div>
        </div>
      )}

      {/* 合格発表 結果画面 */}
      {examStatus === 'result' && passResult && (
        <div className="space-y-6 animate-scale-up">
          
          {passResult.passed ? (
            /* ================= サクラサク：合格通知書 ================= */
            <div className="bg-[#fffcf7] border-4 border-[#b8860b] rounded-2xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden font-serif">
              {/* 桜の装飾ヘッダー */}
              <div className="text-rose-500 text-xs font-sans font-bold tracking-widest uppercase mb-1">
                🌸 合 格 発 表 🌸
              </div>

              <div className="text-4xl sm:text-6xl font-black text-rose-600 tracking-widest my-3">
                サ クラ サク
              </div>

              <div className="max-w-md mx-auto my-6 p-6 border-2 border-slate-400 bg-white rounded-lg shadow-inner text-left font-sans space-y-3">
                <div className="text-right text-xs text-slate-500 font-mono">第 2026-A9102 号</div>
                <div className="text-center font-bold text-lg text-slate-900 border-b pb-2">
                  合　格　通　知　書
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {userProfile.studentName}　殿
                </div>
                <p className="text-xs text-slate-700 leading-relaxed indent-2">
                  本学令和八年度入学試験の結果、厳正なる選考の上、下記の学部・学科への合格を認定いたします。
                </p>
                <div className="bg-slate-50 p-3 rounded border text-center font-bold text-sm text-slate-900">
                  {targetUniv.name}　{targetUniv.faculty}
                </div>
                <div className="text-right text-xs font-bold text-slate-800 pt-2">
                  {targetUniv.name} 学長 印
                </div>
              </div>

              <div className="text-xs font-sans text-slate-600 font-medium">
                {passResult.advice}
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3 font-sans">
                <button
                  onClick={() => setExamStatus('ready')}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  別の大学を受験する
                </button>
                <button
                  onClick={onGoToRebirth}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-md"
                >
                  周回して更なる難関大へ（強くてニューゲーム）
                </button>
              </div>
            </div>
          ) : (
            /* ================= サクラチル：不合格・浪人転生へ ================= */
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl text-center text-white space-y-4">
              <div className="text-slate-400 text-xs font-bold tracking-widest uppercase">
                合 格 発 表
              </div>

              <div className="text-3xl sm:text-5xl font-black text-slate-300 tracking-wider">
                サ クラ チ ル
              </div>

              <div className="max-w-md mx-auto p-5 border border-slate-700 bg-slate-800/80 rounded-xl text-left text-xs space-y-2 text-slate-300">
                <div className="font-bold text-sm text-white">選考結果通知</div>
                <p className="leading-relaxed">
                  残念ながら今回は不合格（補欠候補）となりました。<br />
                  あなたの得点: <strong className="text-amber-400 font-mono">{passResult.totalScore}点</strong> / ボーダー: <strong className="font-mono">{passResult.borderScore}点</strong>
                </p>
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {passResult.advice}
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <button
                  onClick={() => setExamStatus('ready')}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
                >
                  リベンジ受験する
                </button>
                <button
                  onClick={onGoToRebirth}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-90 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>強くてニューゲームで転生する</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
