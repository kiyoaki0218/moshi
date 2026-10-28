import React, { useState } from 'react';
import { 
  User, 
  School, 
  Sparkles, 
  Check, 
  BookOpen, 
  Compass,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const StatusEditor: React.FC<{ onStartExam: () => void }> = ({ onStartExam }) => {
  const { userProfile, setUserProfile, subjectLevels, updateSubjectLevel, setSubjectLevels } = useGame();
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // プリセット適用
  const applyPreset = (presetType: 'todai_sci' | 'kyodai_hum' | 'waseda_hum' | 'med' | 'standard') => {
    let newLevels: Record<string, number> = {};

    switch (presetType) {
      case 'todai_sci': // 東大理系特化
        newLevels = {
          english_reading: 78, english_listening: 72,
          math_1a: 84, math_2bc: 82,
          japanese_modern: 65, japanese_classic: 60, japanese_chinese: 58,
          science: 85, social: 60, info: 70
        };
        setUserProfile(prev => ({ ...prev, track: 'sciences', grade: '高校3年' }));
        showNotification('プリセット「東大理系志望（超ハイレベル）」を適用しました！');
        break;
      case 'kyodai_hum': // 京大文系特化
        newLevels = {
          english_reading: 75, english_listening: 68,
          math_1a: 68, math_2bc: 65,
          japanese_modern: 80, japanese_classic: 76, japanese_chinese: 72,
          science: 55, social: 78, info: 62
        };
        setUserProfile(prev => ({ ...prev, track: 'humanities', grade: '高校3年' }));
        showNotification('プリセット「京大文系志望（国語・英語特化）」を適用しました！');
        break;
      case 'waseda_hum': // 早慶私文特化
        newLevels = {
          english_reading: 82, english_listening: 70,
          math_1a: 40, math_2bc: 35,
          japanese_modern: 76, japanese_classic: 74, japanese_chinese: 68,
          science: 38, social: 84, info: 50
        };
        setUserProfile(prev => ({ ...prev, track: 'humanities', grade: '高校3年' }));
        showNotification('プリセット「早慶私立文系特化（英・国・歴特化）」を適用しました！');
        break;
      case 'med': // 国立医学部
        newLevels = {
          english_reading: 85, english_listening: 80,
          math_1a: 88, math_2bc: 86,
          japanese_modern: 68, japanese_classic: 65, japanese_chinese: 62,
          science: 90, social: 70, info: 75
        };
        setUserProfile(prev => ({ ...prev, track: 'sciences', grade: '高校3年' }));
        showNotification('プリセット「国立医学部志望（全科目高水準）」を適用しました！');
        break;
      case 'standard': // 標準高3
        newLevels = {
          english_reading: 52, english_listening: 48,
          math_1a: 50, math_2bc: 46,
          japanese_modern: 54, japanese_classic: 48, japanese_chinese: 45,
          science: 50, social: 52, info: 50
        };
        showNotification('プリセット「高校3年生 標準バランス型」を適用しました！');
        break;
    }

    setSubjectLevels(prev => 
      prev.map(s => ({
        ...s,
        level: newLevels[s.id] !== undefined ? newLevels[s.id] : s.level,
      }))
    );
  };

  // 全科目を一括調整
  const shiftAllLevels = (amount: number) => {
    setSubjectLevels(prev => 
      prev.map(s => ({
        ...s,
        level: Math.max(1, Math.min(99, s.level + amount)),
      }))
    );
    showNotification(`全科目のレベルを ${amount > 0 ? `+${amount}` : amount} 調整しました！`);
  };

  // 平均レベル算出
  const avgLevel = Math.round(
    subjectLevels.reduce((acc, s) => acc + s.level, 0) / subjectLevels.length
  );

  return (
    <div className="space-y-6">
      {/* 通知トースト */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900/95 text-emerald-300 border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">{notification}</span>
        </div>
      )}

      {/* トップサマリーカード */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-1">
              <Trophy className="w-4 h-4" />
              <span>受験生ステータス設定（育成モード）</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{userProfile.studentName}</span>
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-medium">
                {userProfile.track === 'humanities' ? '文系コース' : '理系コース'}
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {userProfile.highSchoolName} ・ {userProfile.grade}（{userProfile.loopCount}周目の受験生ライフ）
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2 text-center">
              <div className="text-xs text-slate-400 font-medium">総合平均学力</div>
              <div className="text-2xl font-black text-amber-400">Lv.{avgLevel}</div>
            </div>
            <button
              onClick={onStartExam}
              className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-rose-500/30 transition transform hover:-translate-y-0.5"
            >
              <span>この能力で模試を受験</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 育成プリセットボタン群 */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            クイック育成プリセット:
          </span>
          <button
            onClick={() => applyPreset('todai_sci')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-900/60 text-indigo-200 text-xs font-medium rounded-lg border border-slate-700 hover:border-indigo-500/50 transition"
          >
            東大理系志望 (Lv.70〜85)
          </button>
          <button
            onClick={() => applyPreset('kyodai_hum')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 text-rose-200 text-xs font-medium rounded-lg border border-slate-700 hover:border-rose-500/50 transition"
          >
            京大文系志望 (国・英Lv.75+)
          </button>
          <button
            onClick={() => applyPreset('waseda_hum')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-amber-900/60 text-amber-200 text-xs font-medium rounded-lg border border-slate-700 hover:border-amber-500/50 transition"
          >
            早慶私文特化 (3教科集中)
          </button>
          <button
            onClick={() => applyPreset('med')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-900/60 text-emerald-200 text-xs font-medium rounded-lg border border-slate-700 hover:border-emerald-500/50 transition"
          >
            国公立医学部 (全教科ハイエンド)
          </button>
          <button
            onClick={() => applyPreset('standard')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            標準リセット (Lv.50前後)
          </button>
        </div>
      </div>

      {/* 2カラムレイアウト: プロフィール基本情報 ＆ 科目別レベルスライダー */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 左カラム：受験生情報設定 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <span>受験生プロフィール設定</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">受験生氏名</label>
              <input
                type="text"
                value={userProfile.studentName}
                onChange={(e) => setUserProfile(prev => ({ ...prev, studentName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: 合格 太郎"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">在籍高校名</label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userProfile.highSchoolName}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, highSchoolName: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="例: 県立第一高等学校"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">学年・所属</label>
                <select
                  value={userProfile.grade}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="高校3年">高校3年</option>
                  <option value="高校2年">高校2年</option>
                  <option value="高校1年">高校1年</option>
                  <option value="高卒生（浪人1年目）">浪人1年目</option>
                  <option value="高卒生（多浪生）">多浪生</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">志望文理</label>
                <select
                  value={userProfile.track}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, track: e.target.value as 'humanities' | 'sciences' }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="sciences">理系（理・工・医）</option>
                  <option value="humanities">文系（文・法・経）</option>
                </select>
              </div>
            </div>

            {/* 一括能力操作 */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-600 mb-2">全科目一括微調整</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => shiftAllLevels(-5)}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  一括 -5
                </button>
                <button
                  onClick={() => shiftAllLevels(+1)}
                  className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition"
                >
                  一括 +1
                </button>
                <button
                  onClick={() => shiftAllLevels(+5)}
                  className="py-1.5 px-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-bold rounded-lg transition"
                >
                  一括 +5
                </button>
              </div>
            </div>

            {/* 育成ヒント */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>シミュレーターの仕組み</span>
              </div>
              <p>
                教科Lv（1〜99）を上げると基礎得点率が上がります。Lv.50で平均点前後、Lv.80以上で難関大（旧帝大・早慶）合格レベルに達します。
              </p>
            </div>
          </div>
        </div>

        {/* 右カラム：教科別レベルスライダー一覧 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>教科・科目別 実力レベル設定（Lv.1〜99）</span>
            </h3>
            <span className="text-xs text-slate-400">スライダーまたはボタンで直感調整</span>
          </div>

          <div className="space-y-4">
            {subjectLevels.map((subject) => {
              // レベルに応じたカラー
              let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
              let progressColor = 'bg-slate-400';
              if (subject.level >= 80) {
                badgeColor = 'bg-rose-100 text-rose-800 border-rose-300 font-black';
                progressColor = 'bg-gradient-to-r from-rose-500 to-amber-500';
              } else if (subject.level >= 65) {
                badgeColor = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
                progressColor = 'bg-gradient-to-r from-amber-400 to-emerald-500';
              } else if (subject.level >= 50) {
                badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200 font-semibold';
                progressColor = 'bg-indigo-500';
              }

              return (
                <div 
                  key={subject.id} 
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-800">
                      {subject.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                        Lv.{subject.level}
                      </span>
                      {/* マイナス・プラスボタン */}
                      <button
                        onClick={() => updateSubjectLevel(subject.id, subject.level - 5)}
                        className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        title="-5"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateSubjectLevel(subject.id, subject.level + 5)}
                        className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs font-bold shadow-sm"
                        title="+5"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* スライダー */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={subject.level}
                      onChange={(e) => updateSubjectLevel(subject.id, parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* ゲージバー */}
                  <div className="w-full bg-slate-200/80 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                      style={{ width: `${subject.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
