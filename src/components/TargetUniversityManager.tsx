import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { University } from '../types';
import { 
  BookmarkCheck, 
  Plus, 
  Search, 
  Check
} from 'lucide-react';

export const TargetUniversityManager: React.FC = () => {
  const { 
    universities, 
    selectedUniversityIds, 
    setSelectedUniversityIds, 
    addCustomUniversity
  } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'national' | 'public' | 'private'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // 新規カスタム大学用ステート
  const [newUniv, setNewUniv] = useState({
    name: '',
    faculty: '',
    type: 'private' as University['type'],
    track: 'humanities' as University['track'],
    location: '東京都',
    borders: {
      shinken: 65,
      zento: 58,
      sundai: 52,
    },
  });

  // 志望校トグル（最大6校）
  const toggleSelectUniv = (id: string) => {
    if (selectedUniversityIds.includes(id)) {
      setSelectedUniversityIds(prev => prev.filter(x => x !== id));
    } else {
      if (selectedUniversityIds.length >= 6) {
        alert('志望校は最大6校まで選択可能です。');
        return;
      }
      setSelectedUniversityIds(prev => [...prev, id]);
    }
  };

  // 選択順位の繰り上げ・繰り下げ
  const moveChoice = (index: number, direction: 'up' | 'down') => {
    const newArr = [...selectedUniversityIds];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setSelectedUniversityIds(newArr);
  };

  // カスタム大学追加送信
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniv.name || !newUniv.faculty) {
      alert('大学名と学部名を入力してください。');
      return;
    }

    addCustomUniversity({
      name: newUniv.name,
      faculty: newUniv.faculty,
      type: newUniv.type,
      track: newUniv.track,
      location: newUniv.location,
      borders: {
        shinken: Number(newUniv.borders.shinken),
        zento: Number(newUniv.borders.zento),
        sundai: Number(newUniv.borders.sundai),
      },
    });

    setShowAddModal(false);
    setNewUniv({
      name: '',
      faculty: '',
      type: 'private',
      track: 'humanities',
      location: '東京都',
      borders: { shinken: 65, zento: 58, sundai: 52 },
    });
  };

  // フィルタリング
  const filteredUniversities = universities.filter(u => {
    const matchQuery = u.name.includes(searchQuery) || u.faculty.includes(searchQuery);
    if (selectedFilter === 'all') return matchQuery;
    return matchQuery && u.type === selectedFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* 上部ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6 text-indigo-600" />
            <span>志望校 ＆ ボーダー偏差値 管理</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            模試の判定対象となる志望校（最大6校）を選択・並び替えできます。自分だけのオリジナル大学や独自ボーダーの追加も可能！
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>カスタム大学を追加</span>
        </button>
      </div>

      {/* 現在の第1〜第6志望校カード */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-lg border border-indigo-900/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              現在の志望校スロット
            </span>
            <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
              {selectedUniversityIds.length} / 6校
            </span>
          </div>
          <span className="text-xs text-slate-400">矢印で第1〜第6志望の順位を変更可能</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectedUniversityIds.map((id, index) => {
            const univ = universities.find(u => u.id === id);
            if (!univ) return null;

            return (
              <div
                key={id}
                className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                      第{index + 1}志望
                    </span>
                    <button
                      onClick={() => toggleSelectUniv(id)}
                      className="text-slate-400 hover:text-rose-400 text-xs"
                      title="志望校から解除"
                    >
                      解除
                    </button>
                  </div>
                  <div className="font-bold text-white text-sm truncate">{univ.name}</div>
                  <div className="text-xs text-slate-300 truncate">{univ.faculty}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    全統: {univ.borders.zento} / 進研: {univ.borders.shinken} / 駿台: {univ.borders.sundai}
                  </div>
                </div>

                {/* 順位移動ボタン */}
                <div className="flex items-center justify-end space-x-1 mt-2 pt-2 border-t border-slate-700/60">
                  <button
                    disabled={index === 0}
                    onClick={() => moveChoice(index, 'up')}
                    className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-30 text-xs"
                  >
                    ▲ 上へ
                  </button>
                  <button
                    disabled={index === selectedUniversityIds.length - 1}
                    onClick={() => moveChoice(index, 'down')}
                    className="p-1 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-30 text-xs"
                  >
                    ▼ 下へ
                  </button>
                </div>
              </div>
            );
          })}

          {selectedUniversityIds.length === 0 && (
            <div className="col-span-full text-center py-6 text-slate-400 text-xs">
              下の大学一覧から志望校を選択してください（最大6校）。
            </div>
          )}
        </div>
      </div>

      {/* 大学データベース一覧 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        
        {/* 検索・フィルターバー */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-3 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="大学名や学部名で検索..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setSelectedFilter('national')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedFilter === 'national' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              国立大
            </button>
            <button
              onClick={() => setSelectedFilter('public')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedFilter === 'public' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              公立大
            </button>
            <button
              onClick={() => setSelectedFilter('private')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedFilter === 'private' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              私立大
            </button>
          </div>
        </div>

        {/* 大学一覧グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUniversities.map((univ) => {
            const isSelected = selectedUniversityIds.includes(univ.id);
            const choiceIndex = selectedUniversityIds.indexOf(univ.id);

            return (
              <div
                key={univ.id}
                onClick={() => toggleSelectUniv(univ.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {univ.type === 'national' ? '国立' : univ.type === 'public' ? '公立' : '私立'} ・ {univ.location}
                    </span>
                    {isSelected ? (
                      <span className="text-xs font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        第{choiceIndex + 1}志望
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">タップで選択</span>
                    )}
                  </div>

                  <h4 className="font-black text-slate-900 text-sm">{univ.name}</h4>
                  <p className="text-xs text-slate-600 mb-2">{univ.faculty}</p>
                </div>

                {/* 模試別ボーダー偏差値表示 */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-center text-[10px]">
                  <div className="bg-slate-50 p-1 rounded">
                    <span className="text-slate-400 block">全統ボーダー</span>
                    <strong className="text-slate-800 font-mono text-xs">{univ.borders.zento}</strong>
                  </div>
                  <div className="bg-[#fce4ec]/50 p-1 rounded">
                    <span className="text-[#d81b60] block">進研ボーダー</span>
                    <strong className="text-[#d81b60] font-mono text-xs">{univ.borders.shinken}</strong>
                  </div>
                  <div className="bg-[#002f6c]/10 p-1 rounded">
                    <span className="text-[#002f6c] block">駿台ボーダー</span>
                    <strong className="text-[#002f6c] font-mono text-xs">{univ.borders.sundai}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* カスタム大学追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCustom}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>カスタム志望校の登録</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">大学名</label>
                <input
                  type="text"
                  required
                  value={newUniv.name}
                  onChange={(e) => setNewUniv({ ...newUniv, name: e.target.value })}
                  placeholder="例: 横浜国立大学 / 慶応義塾大学"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">学部・学科名</label>
                <input
                  type="text"
                  required
                  value={newUniv.faculty}
                  onChange={(e) => setNewUniv({ ...newUniv, faculty: e.target.value })}
                  placeholder="例: 理工学部 機械工学科"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">区分</label>
                  <select
                    value={newUniv.type}
                    onChange={(e) => setNewUniv({ ...newUniv, type: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="national">国立大学</option>
                    <option value="public">公立大学</option>
                    <option value="private">私立大学</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">所在地</label>
                  <input
                    type="text"
                    value={newUniv.location}
                    onChange={(e) => setNewUniv({ ...newUniv, location: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* ボーダー偏差値設定 */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-2">
                  模試別 ボーダー偏差値（C判定・合格率50%基準）
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block">全統ボーダー</span>
                    <input
                      type="number"
                      step="0.5"
                      min="30"
                      max="85"
                      value={newUniv.borders.zento}
                      onChange={(e) => setNewUniv({
                        ...newUniv,
                        borders: { ...newUniv.borders, zento: parseFloat(e.target.value) }
                      })}
                      className="w-full p-2 border border-slate-300 rounded text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#d81b60] block">進研ボーダー(+5〜7)</span>
                    <input
                      type="number"
                      step="0.5"
                      min="30"
                      max="90"
                      value={newUniv.borders.shinken}
                      onChange={(e) => setNewUniv({
                        ...newUniv,
                        borders: { ...newUniv.borders, shinken: parseFloat(e.target.value) }
                      })}
                      className="w-full p-2 border border-slate-300 rounded text-center font-bold text-[#d81b60]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#002f6c] block">駿台ボーダー(-6〜8)</span>
                    <input
                      type="number"
                      step="0.5"
                      min="25"
                      max="80"
                      value={newUniv.borders.sundai}
                      onChange={(e) => setNewUniv({
                        ...newUniv,
                        borders: { ...newUniv.borders, sundai: parseFloat(e.target.value) }
                      })}
                      className="w-full p-2 border border-slate-300 rounded text-center font-bold text-[#002f6c]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-bold"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md"
              >
                登録して志望校に追加
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
