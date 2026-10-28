import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Check, 
  Lock, 
  ShieldCheck, 
  Award,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RebirthModal: React.FC<{ onGoToStatus: () => void }> = ({ onGoToStatus }) => {
  const { 
    userProfile, 
    rebirthBonuses, 
    unlockBonus, 
    executeRebirth 
  } = useGame();

  const [confirmRebirth, setConfirmRebirth] = useState(false);

  // 転生実行
  const handleRebirth = () => {
    executeRebirth();
    setConfirmRebirth(false);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
    alert(`🎉 【第${userProfile.loopCount + 1}周目の世界へ転生しました！】\n初期学力レベルが底上げされ、ボーナスポイント50ptを獲得しました！`);
    onGoToStatus();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 周回ステータスバナー */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <Flame className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-200 text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>強くてニューゲーム（周回・転生システム）</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              現在: 受験生生活 第{userProfile.loopCount}周目
            </h2>
            <p className="text-slate-100 text-xs sm:text-sm mt-1 max-w-xl">
              模試を受験して好成績を修めると「転生ポイント」が蓄積されます。パッシブスキルを解放して前世の記憶を引き継ぎ、次なる周回で東大・医学部A判定を狙いましょう！
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 text-center">
            <div className="text-xs text-amber-200 font-semibold">所持 転生ポイント</div>
            <div className="text-3xl font-black text-amber-300 font-mono mt-0.5">
              {userProfile.rebirthPoints} <span className="text-xs text-white">pt</span>
            </div>
          </div>
        </div>
      </div>

      {/* 周回パッシブスキルショップ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>転生パッシブスキル 解放ショップ</span>
            </h3>
            <p className="text-xs text-slate-500">
              一度解放したスキルは周回後も永続的に効果を発揮します。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rebirthBonuses.map((bonus) => {
            const canAfford = userProfile.rebirthPoints >= bonus.cost;

            return (
              <div
                key={bonus.id}
                className={`p-4 rounded-xl border-2 transition flex flex-col justify-between ${
                  bonus.unlocked
                    ? 'border-emerald-500 bg-emerald-50/40'
                    : canAfford
                    ? 'border-amber-400 bg-amber-50/30 hover:border-amber-500'
                    : 'border-slate-200 bg-slate-50 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-sm text-slate-900">
                      {bonus.name}
                    </span>
                    {bonus.unlocked ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        解放済み
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                        {bonus.cost} pt
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {bonus.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  {bonus.unlocked ? (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      常時パッシブ発動中
                    </span>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        const success = unlockBonus(bonus.id);
                        if (success) {
                          confetti({ particleCount: 50, spread: 60 });
                        }
                      }}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{bonus.cost} pt で解放する</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>ポイント不足 (あと{bonus.cost - userProfile.rebirthPoints}pt)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 強くてニューゲーム実行エリア */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
          <RotateCcw className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black">
          第{userProfile.loopCount + 1}周目へ「強くてニューゲーム」
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          基礎学力に周回ボーナスが上乗せされた状態で、新たな受験生ライフをリスタートします。<br />
          ※解放済みのパッシブスキルや所持ポイントはすべて引き継がれます。
        </p>

        {!confirmRebirth ? (
          <button
            onClick={() => setConfirmRebirth(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-90 text-white font-black rounded-xl shadow-lg shadow-rose-500/20 text-sm sm:text-base transition transform hover:-translate-y-0.5"
          >
            周回（強くてニューゲーム）を開始する
          </button>
        ) : (
          <div className="bg-slate-800 p-4 rounded-xl max-w-md mx-auto space-y-3 border border-amber-500/40">
            <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>本当に第{userProfile.loopCount + 1}周目へ転生しますか？</span>
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setConfirmRebirth(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={handleRebirth}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-lg shadow-md"
              >
                転生を実行する！
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
