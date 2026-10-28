import React, { useState } from 'react';
import { ExamResult } from '../../types';
import { Shield, Smartphone, FileText, Target, AlertTriangle } from 'lucide-react';

interface SundaiReportProps {
  result: ExamResult;
}

export const SundaiReport: React.FC<SundaiReportProps> = ({ result }) => {
  // 'paper' (伝統紙面2段組) | 'web' (I-SUM Webスマホ版)
  const [viewMode, setViewMode] = useState<'paper' | 'web'>('paper');

  const getSub = (key: string) => {
    return result.subjectResults.find(s => s.subjectId.includes(key) || s.name.includes(key));
  };

  const eng = getSub('english') || { score: 128, maxScore: 200, deviationValue: 62.7, averageScore: 76.5, rank: 1722, totalExaminees: 12374 };
  const math = getSub('math') || { score: 67, maxScore: 200, deviationValue: 63.9, averageScore: 47.4, rank: 1512, totalExaminees: 8935 };
  const kokugo = getSub('japanese') || { score: 78, maxScore: 200, deviationValue: 52.1, averageScore: 72.8, rank: 5544, totalExaminees: 12247 };
  const sci = getSub('science') || { score: 41, maxScore: 100, deviationValue: 53.2, averageScore: 35.5, rank: 2279, totalExaminees: 6156 };
  const soc = getSub('social') || { score: 27, maxScore: 100, deviationValue: 45.0, averageScore: 41.7, rank: 3108, totalExaminees: 5745 };

  const pentagonItems = [
    { label: '英語', dev: eng.deviationValue },
    { label: '数学', dev: math.deviationValue },
    { label: '国語', dev: kokugo.deviationValue },
    { label: result.course === 'sciences' ? '物理' : '日本史', dev: soc.deviationValue },
    { label: result.course === 'sciences' ? '化学' : '世界史', dev: sci.deviationValue },
  ];

  const pCenter = 85;
  const pRadius = 55;
  const numP = 5;

  const getPCoord = (index: number, valRatio: number) => {
    const angle = (Math.PI * 2 / numP) * index - Math.PI / 2;
    const r = pRadius * valRatio;
    return {
      x: pCenter + r * Math.cos(angle),
      y: pCenter + r * Math.sin(angle),
    };
  };

  const userPolyPoints = pentagonItems.map((item, idx) => {
    const ratio = Math.max(0.18, Math.min(1.0, (item.dev - 25) / 50));
    const { x, y } = getPCoord(idx, ratio);
    return `${x},${y}`;
  }).join(' ');

  const avgPolyPoints = Array.from({ length: numP }).map((_, idx) => {
    const ratio = (50 - 25) / 50;
    const { x, y } = getPCoord(idx, ratio);
    return `${x},${y}`;
  }).join(' ');

  const questionsList = [
    { sub: '英語', no: 1, title: '英文読解（長文論説）', score: 41, max: 70, dev: 62.4, avg: 24.6, diff: '+16.7', pct: 58, avgPct: 35 },
    { sub: '英語', no: 2, title: '英文読解（小説・エッセイ）', score: 21, max: 50, dev: 48.0, avg: 22.8, diff: '-1.8', pct: 42, avgPct: 45 },
    { sub: '英語', no: 3, title: '自由英作文・和文英訳', score: 42, max: 50, dev: 71.6, avg: 15.0, diff: '+27.0', pct: 84, avgPct: 30 },
    { sub: '英語', no: 4, title: '文法・語法・語彙綜合', score: 4, max: 20, dev: 45.2, avg: 6.1, diff: '-2.1', pct: 20, avgPct: 30 },
    { sub: '英語', no: 5, title: 'リスニング読解', score: 20, max: 30, dev: 57.0, avg: 15.0, diff: '+5.0', pct: 66, avgPct: 50 },

    { sub: '数学', no: 1, title: '和積の展開、ベクトルの内積', score: 7, max: 50, dev: 37.9, avg: 22.0, diff: '-15.0', pct: 14, avgPct: 44 },
    { sub: '数学', no: 2, title: '円に内接する四角形の求積', score: 10, max: 50, dev: 47.5, avg: 15.6, diff: '-5.6', pct: 20, avgPct: 31 },
    { sub: '数学', no: 3, title: '整数、関数でみることの証明', score: 25, max: 50, dev: 56.2, avg: 18.4, diff: '+6.6', pct: 50, avgPct: 36 },
    { sub: '数学', no: 4, title: '3次関数と接線部分の面積', score: 25, max: 50, dev: 69.3, avg: 16.4, diff: '+8.6', pct: 50, avgPct: 32 },

    { sub: '国語', no: 1, title: '現代文（評論・哲学論考）', score: 26, max: 60, dev: 47.7, avg: 27.7, diff: '-1.7', pct: 43, avgPct: 46 },
    { sub: '国語', no: 2, title: '現代文（小説・心情把握）', score: 13, max: 40, dev: 54.2, avg: 10.7, diff: '+2.3', pct: 32, avgPct: 26 },
    { sub: '国語', no: 3, title: '古文（平安物語・文法解釈）', score: 21, max: 50, dev: 42.6, avg: 25.6, diff: '-4.6', pct: 42, avgPct: 51 },
    { sub: '国語', no: 4, title: '漢文（漢詩・故事成語論説）', score: 18, max: 50, dev: 51.0, avg: 16.6, diff: '+1.4', pct: 36, avgPct: 33 },

    { sub: result.course === 'sciences' ? '理科' : '地歴', no: 1, title: '力学・電磁気 / 原始古代', score: 11, max: 20, dev: 49.1, avg: 11.4, diff: '-0.4', pct: 55, avgPct: 57 },
    { sub: result.course === 'sciences' ? '理科' : '地歴', no: 2, title: '熱力学・波動 / 中世近世', score: 11, max: 20, dev: 48.6, avg: 9.1, diff: '+1.9', pct: 55, avgPct: 45 },
    { sub: result.course === 'sciences' ? '理科' : '地歴', no: 3, title: '無機・有機化学 / 近現代', score: 9, max: 30, dev: 47.8, avg: 13.1, diff: '-4.1', pct: 30, avgPct: 43 },
  ];

  return (
    <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-6xl mx-auto p-4 sm:p-6 font-sans text-slate-900 print:p-0">
      
      {/* 切替バー */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="bg-[#002f6c] text-white text-[10px] font-black px-2 py-0.5 rounded">
            駿台予備学校
          </span>
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">
            {viewMode === 'paper' ? '駿台全国模試 個人成績表（紙面）' : 'SUNDAI I-SUM Web マイページ'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-bold">
          <button
            onClick={() => setViewMode('paper')}
            className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
              viewMode === 'paper' ? 'bg-[#002f6c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>紙面成績票</span>
          </button>
          <button
            onClick={() => setViewMode('web')}
            className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
              viewMode === 'web' ? 'bg-[#002f6c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>I-SUM Web</span>
          </button>
        </div>
      </div>

      {viewMode === 'paper' ? (
        /* ================= 1. 参考画像「駿台模試.jpg」完全再現の紙面シート ================= */
        <div>
          <div className="flex flex-col md:flex-row items-stretch justify-between border-b-2 border-[#00a0e9] pb-3 mb-4 gap-3">
            <div className="border-2 border-[#00a0e9] p-2 rounded-sm bg-[#f4fbff] flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#002f6c]">
                  第１回　駿台全国模試　個人成績表
                </span>
                <span className="text-xs font-bold text-slate-700">（２次型）</span>
              </div>
              <div className="text-[11px] text-slate-600 font-mono mt-0.5 flex flex-wrap gap-x-4">
                <span>{result.date}施行</span>
                <span>受験者数: <strong>{result.totalExaminees.toLocaleString()}</strong>名</span>
                <span>（文系: 4,812名　理系: 7,562名）</span>
              </div>
            </div>

            <div className="border border-[#00a0e9] rounded-sm overflow-hidden text-xs font-mono self-start md:self-auto w-full md:w-80">
              <div className="grid grid-cols-4 bg-[#00a0e9] text-white text-[10px] text-center font-bold py-0.5">
                <div>高校/学年名</div>
                <div>受験番号</div>
                <div>氏名</div>
                <div>頁</div>
              </div>
              <div className="grid grid-cols-4 bg-white text-center py-1 text-[11px] font-bold divide-x divide-slate-200">
                <div className="truncate px-1">{result.highSchoolName}</div>
                <div>8830-192</div>
                <div className="text-[#002f6c] truncate px-1">{result.studentName}</div>
                <div>1 / 2</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex items-center space-x-1 text-xs font-black text-slate-800 mb-1">
                  <span className="inline-block w-2.5 h-2.5 bg-[#00a0e9] mr-1"></span>
                  <span>1 教科・科目別成績（２次型）</span>
                </div>
                <div className="overflow-x-auto border border-[#00a0e9]">
                  <table className="w-full text-[10px] text-left border-collapse border border-[#00a0e9] bg-white font-mono">
                    <thead>
                      <tr className="bg-[#d9f1fd] text-slate-800 border-b border-[#00a0e9] text-center">
                        <th rowSpan={2} className="p-1 border-r border-[#00a0e9]">教科・科目</th>
                        <th rowSpan={2} className="p-1 border-r border-[#00a0e9]">得点/配点</th>
                        <th rowSpan={2} className="p-1 border-r border-[#00a0e9] bg-[#bfe7fb] font-black">偏差値</th>
                        <th colSpan={3} className="p-0.5 border-r border-[#00a0e9] border-b">全　国</th>
                        <th colSpan={3} className="p-0.5">学校内</th>
                      </tr>
                      <tr className="bg-[#d9f1fd] text-[9px] text-center border-b border-[#00a0e9]">
                        <th className="p-1 border-r border-[#00a0e9]">席次 (番/名中)</th>
                        <th className="p-1 border-r border-[#00a0e9]">平均点</th>
                        <th className="p-1 border-r border-[#00a0e9]">標準偏差</th>
                        <th className="p-1 border-r border-[#00a0e9]">偏差値</th>
                        <th className="p-1 border-r border-[#00a0e9]">席次</th>
                        <th className="p-1">平均点</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00a0e9]">
                      <tr>
                        <td className="p-1 border-r border-[#00a0e9] font-sans font-bold">英語</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{eng.score} / {eng.maxScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-black bg-[#f0f9ff] text-[#002f6c]">{eng.deviationValue}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{eng.rank} / {eng.totalExaminees}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{eng.averageScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">32.6</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">61.2</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">18 / 280</td>
                        <td className="p-1 text-center">82.4</td>
                      </tr>
                      <tr>
                        <td className="p-1 border-r border-[#00a0e9] font-sans font-bold">数学</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{math.score} / {math.maxScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-black bg-[#f0f9ff] text-[#002f6c]">{math.deviationValue}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{math.rank} / {math.totalExaminees}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{math.averageScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">18.2</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">62.0</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">14 / 280</td>
                        <td className="p-1 text-center">51.0</td>
                      </tr>
                      <tr>
                        <td className="p-1 border-r border-[#00a0e9] font-sans font-bold">国語</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{kokugo.score} / {kokugo.maxScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-black bg-[#f0f9ff] text-[#002f6c]">{kokugo.deviationValue}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{kokugo.rank} / {kokugo.totalExaminees}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{kokugo.averageScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">19.5</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">50.8</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">64 / 280</td>
                        <td className="p-1 text-center">74.2</td>
                      </tr>
                      <tr>
                        <td className="p-1 border-r border-[#00a0e9] font-sans font-bold">{result.course === 'sciences' ? '物理' : '日本史'}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{soc.score} / {soc.maxScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-black bg-[#f0f9ff] text-[#002f6c]">{soc.deviationValue}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{soc.rank} / {soc.totalExaminees}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{soc.averageScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">14.4</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">46.5</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">32 / 120</td>
                        <td className="p-1 text-center">44.0</td>
                      </tr>
                      <tr>
                        <td className="p-1 border-r border-[#00a0e9] font-sans font-bold">{result.course === 'sciences' ? '化学' : '世界史'}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{sci.score} / {sci.maxScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-black bg-[#f0f9ff] text-[#002f6c]">{sci.deviationValue}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{sci.rank} / {sci.totalExaminees}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{sci.averageScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">19.6</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">54.2</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">21 / 110</td>
                        <td className="p-1 text-center">38.1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1 text-xs font-black text-slate-800 mb-1">
                  <span className="inline-block w-2.5 h-2.5 bg-[#00a0e9] mr-1"></span>
                  <span>2 成績集計コース別成績（２次型）</span>
                </div>
                <div className="overflow-x-auto border border-[#00a0e9]">
                  <table className="w-full text-[10px] text-left border-collapse border border-[#00a0e9] bg-white font-mono">
                    <thead>
                      <tr className="bg-[#d9f1fd] text-slate-800 border-b border-[#00a0e9] text-center">
                        <th className="p-1 border-r border-[#00a0e9]">成績集計コース</th>
                        <th className="p-1 border-r border-[#00a0e9]">得点/配点</th>
                        <th className="p-1 border-r border-[#00a0e9] bg-[#bfe7fb] font-black">偏差値</th>
                        <th className="p-1 border-r border-[#00a0e9]">席次 (番/名中)</th>
                        <th className="p-1 border-r border-[#00a0e9]">平均点</th>
                        <th className="p-1">標準偏差</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00a0e9]">
                      <tr>
                        <td className="p-1 border-r border-[#00a0e9] font-sans font-semibold">英数国理２ (または英数国歴２)</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-bold">{result.totalScore} / {result.totalMaxScore}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-black bg-[#f0f9ff] text-[#002f6c]">{result.overallDeviation}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">{result.overallRank} / {result.totalExaminees}</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">245.2</td>
                        <td className="p-1 text-center">102.7</td>
                      </tr>
                      <tr>
                        <td className="p-1 border-r border-[#00a0e9] font-sans font-semibold">英数理 (または英数国)</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-bold">273 / 600</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-black bg-[#f0f9ff] text-[#002f6c]">54.4</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">3391 / 8815</td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">214.3</td>
                        <td className="p-1 text-center">76.6</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="border border-[#00a0e9] p-2 bg-white rounded-sm">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-800 mb-1 border-b pb-1">
                    <span>■ 3 科目別偏差値（2次型）</span>
                    <span className="text-[9px] text-slate-500 font-normal">●本人 ▲平均(50)</span>
                  </div>
                  <div className="flex justify-center my-1 relative">
                    <svg className="w-40 h-40 overflow-visible" viewBox="0 0 170 170">
                      <polygon points={Array.from({ length: numP }).map((_, i) => `${getPCoord(i, 1.0).x},${getPCoord(i, 1.0).y}`).join(' ')} fill="#f9fdff" stroke="#bfe7fb" strokeWidth="1" />
                      <polygon points={avgPolyPoints} fill="none" stroke="#002f6c" strokeWidth="1" strokeDasharray="2,2" />
                      <polygon points={userPolyPoints} fill="rgba(0, 160, 233, 0.35)" stroke="#00a0e9" strokeWidth="2" />
                      {userPolyPoints.split(' ').map((pt, i) => {
                        const [px, py] = pt.split(',').map(Number);
                        return <circle key={i} cx={px} cy={py} r="2.5" fill="#00a0e9" />;
                      })}
                    </svg>
                    {pentagonItems.map((item, idx) => {
                      const { x, y } = getPCoord(idx, 1.25);
                      return (
                        <div
                          key={idx}
                          className="absolute text-[9px] font-bold text-slate-700 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ left: `${(x / 170) * 100}%`, top: `${(y / 170) * 100}%` }}
                        >
                          {item.label} <span className="font-mono text-[#002f6c]">{item.dev}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-[#00a0e9] p-2 bg-white rounded-sm text-[10px]">
                  <div className="text-[10px] font-black text-slate-800 mb-1 border-b pb-1">
                    ■ ドッキング対象模試（1次型）
                  </div>
                  <div className="space-y-1 font-mono text-[9px]">
                    <div className="flex justify-between border-b pb-0.5 text-slate-500 font-bold">
                      <span>教科・科目</span>
                      <span>得点 / 偏差値</span>
                    </div>
                    <div className="flex justify-between"><span>英語マーク</span><span>146点 / 60.4</span></div>
                    <div className="flex justify-between"><span>数学ⅠA・ⅡB</span><span>114点 / 59.7</span></div>
                    <div className="flex justify-between"><span>国語マーク</span><span>138点 / 55.6</span></div>
                    <div className="flex justify-between font-bold text-[#002f6c] pt-0.5 border-t">
                      <span>1次換算計</span>
                      <span>614点 / 61.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center space-x-1 text-xs font-black text-slate-800 mb-1">
                <span className="inline-block w-2.5 h-2.5 bg-[#00a0e9] mr-1"></span>
                <span>4 設問別成績（２次型）</span>
              </div>

              <div className="overflow-x-auto border border-[#00a0e9]">
                <table className="w-full text-[9px] text-left border-collapse border border-[#00a0e9] bg-white font-mono">
                  <thead>
                    <tr className="bg-[#d9f1fd] text-slate-800 border-b border-[#00a0e9] text-center">
                      <th className="p-1 border-r border-[#00a0e9] w-10">教科</th>
                      <th className="p-1 border-r border-[#00a0e9]">設問内容</th>
                      <th className="p-1 border-r border-[#00a0e9] w-14">得点/配点</th>
                      <th className="p-1 border-r border-[#00a0e9] w-10 bg-[#bfe7fb] font-black">偏差値</th>
                      <th className="p-1 border-r border-[#00a0e9] w-12">全国平均</th>
                      <th className="p-1 border-r border-[#00a0e9] w-10">差</th>
                      <th className="p-1 w-32">得点率 (▼平均 棒:本人)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {questionsList.map((q, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50">
                        <td className="p-1 border-r border-[#00a0e9] text-center font-bold text-slate-700">
                          {q.sub} {q.no}
                        </td>
                        <td className="p-1 border-r border-[#00a0e9] font-sans truncate max-w-[130px]">
                          {q.title}
                        </td>
                        <td className="p-1 border-r border-[#00a0e9] text-center">
                          {q.score}/{q.max}
                        </td>
                        <td className="p-1 border-r border-[#00a0e9] text-center font-bold text-[#002f6c] bg-[#f0f9ff]">
                          {q.dev}
                        </td>
                        <td className="p-1 border-r border-[#00a0e9] text-center text-slate-500">
                          {q.avg}
                        </td>
                        <td className={`p-1 border-r border-[#00a0e9] text-center font-bold ${
                          q.diff.startsWith('+') ? 'text-[#002f6c]' : 'text-slate-500'
                        }`}>
                          {q.diff}
                        </td>
                        <td className="p-1">
                          <div className="relative w-full h-3 bg-slate-100 rounded-xs overflow-hidden">
                            <div className="h-full bg-slate-400/80" style={{ width: `${q.pct}%` }} />
                            <div className="absolute top-0 transform -translate-x-1/2 text-[8px] text-slate-900 leading-none" style={{ left: `${q.avgPct}%` }}>
                              ▼
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border border-[#00a0e9] rounded-sm p-3 bg-[#f8fbff]">
                <div className="text-[11px] font-black text-[#002f6c] mb-2 flex items-center justify-between">
                  <span>■ 志望校合否判定（駿台判定基準）</span>
                  <span className="text-[9px] text-slate-500 font-normal">※激辛母集団基準</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  {result.judgments.slice(0, 4).map((judge) => {
                    let badge = judge.rank === 'A' ? 'bg-emerald-700 text-white' : judge.rank === 'B' ? 'bg-blue-700 text-white' : judge.rank === 'C' ? 'bg-amber-600 text-white' : 'bg-rose-700 text-white';
                    return (
                      <div key={judge.university.id} className="flex items-center justify-between border-b pb-1 bg-white p-1 rounded">
                        <div>
                          <span className="font-bold text-[#002f6c] mr-2">第{judge.choiceRank}志望</span>
                          <strong className="text-slate-900 font-sans">{judge.university.name}</strong>
                          <span className="text-slate-500 ml-1 font-sans">{judge.university.faculty}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500">席次: {judge.aspirantsRank}/{judge.totalAspirants}名</span>
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${badge}`}>{judge.rank} ({judge.percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                <div className="text-[9px] leading-tight max-w-[280px]">
                  模試の採点結果は現在の学力を客観的に映し出すものです。
                </div>
                <div className="border border-[#00a0e9] px-2 py-1 bg-[#f4fbff] text-right">
                  <div className="font-black text-xs text-[#002f6c]">駿台予備学校</div>
                  <div className="text-[8px] text-slate-500">全国入試模試センター</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 2. 駿台「I-SUM Web」スマホWebマイページ版 ================= */
        <div className="space-y-5">
          <div className="bg-[#002f6c] text-white p-5 rounded-2xl shadow-sm border-b-4 border-[#d97706]">
            <div className="text-xs text-amber-300 font-bold mb-1">SUNDAI I-SUM Web 成績カルテ</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black">{result.studentName} 殿</div>
                <div className="text-xs text-sky-200">{result.highSchoolName}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-amber-300">駿台全国偏差値</div>
                <div className="text-3xl font-black text-amber-400 font-mono">{result.overallDeviation}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#002f6c]">■ 志望校合否判定・席次カルテ</h3>
            {result.judgments.map((judge) => (
              <div key={judge.university.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-blue-50 text-[#002f6c] px-2 py-0.5 rounded">第{judge.choiceRank}志望</span>
                  <div className="font-black text-sm text-slate-900 mt-1">{judge.university.name} {judge.university.faculty}</div>
                  <div className="text-xs text-slate-500 mt-1">志望者内席次: <strong className="text-slate-800">{judge.aspirantsRank}位</strong> / {judge.totalAspirants}名</div>
                </div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl text-white ${
                    judge.rank === 'A' ? 'bg-emerald-600' : judge.rank === 'B' ? 'bg-blue-600' : judge.rank === 'C' ? 'bg-amber-600' : 'bg-rose-700'
                  }`}>
                    {judge.rank}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 mt-0.5">{judge.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
