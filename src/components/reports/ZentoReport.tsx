import React, { useState } from 'react';
import { ExamResult } from '../../types';
import { Award, Smartphone, FileText, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';

interface ZentoReportProps {
  result: ExamResult;
}

export const ZentoReport: React.FC<ZentoReportProps> = ({ result }) => {
  // 'paper' (伝統紙面シート) | 'web' (模試なびスマホWebマイページ)
  const [viewMode, setViewMode] = useState<'paper' | 'web'>('paper');

  // 学力レベル判定関数 (S, A, B, C, D)
  const getLevel = (dev: number) => {
    if (dev >= 65.0) return 'S';
    if (dev >= 60.0) return 'A';
    if (dev >= 55.0) return 'B';
    if (dev >= 50.0) return 'C';
    return 'D';
  };

  // 各教科のデータを安全に抽出
  const getSubject = (keyword: string) => {
    return result.subjectResults.find(s => s.subjectId.includes(keyword) || s.name.includes(keyword));
  };

  const engR = getSubject('reading') || { score: 74, maxScore: 100, deviationValue: 60.7, averageScore: 56.6, rank: 42390, totalExaminees: 236700 };
  const engL = getSubject('listening') || { score: 72, maxScore: 100, deviationValue: 60.1, averageScore: 60.2, rank: 39654, totalExaminees: 214521 };
  const engTotalScore = engR.score + engL.score;
  const engTotalAvg = engR.averageScore + engL.averageScore;
  const engTotalDev = Math.round(((engR.deviationValue + engL.deviationValue) / 2) * 10) / 10;

  const m1a = getSubject('1a') || { score: 50, maxScore: 100, deviationValue: 54.3, averageScore: 55.1, rank: 105763, totalExaminees: 174127 };
  const m2bc = getSubject('2bc') || { score: 64, maxScore: 100, deviationValue: 65.1, averageScore: 42.1, rank: 24206, totalExaminees: 161311 };
  const mathTotalScore = m1a.score + m2bc.score;
  const mathTotalAvg = m1a.averageScore + m2bc.averageScore;
  const mathTotalDev = Math.round(((m1a.deviationValue + m2bc.deviationValue) / 2) * 10) / 10;

  const kokugo = getSubject('japanese') || { score: 138, maxScore: 200, deviationValue: 55.6, averageScore: 126.8, rank: 78587, totalExaminees: 220621 };
  const sci = getSubject('science') || { score: 83, maxScore: 100, deviationValue: 66.1, averageScore: 55.7, rank: 5964, totalExaminees: 65308 };
  const soc = getSubject('social') || { score: 70, maxScore: 100, deviationValue: 65.3, averageScore: 66.2, rank: 8979, totalExaminees: 23373 };

  const enkDev = Math.round(((engTotalDev + mathTotalDev + kokugo.deviationValue) / 3) * 10) / 10;

  return (
    <div className="bg-white border-2 border-[#1a4f9c] rounded-xl shadow-xl max-w-5xl mx-auto overflow-hidden font-sans p-4 sm:p-6 text-slate-900 print:p-0">
      
      {/* 表示形式切り替えバー（紙面シート ⇄ 模試なびWeb） */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="bg-[#1a4f9c] text-white text-[10px] font-black px-2 py-0.5 rounded">
            河合塾 全統模試
          </span>
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">
            {viewMode === 'paper' ? '個人成績概況シート（紙面）' : '全統模試なび WEBマイページ'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-bold">
          <button
            onClick={() => setViewMode('paper')}
            className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
              viewMode === 'paper' ? 'bg-[#1a4f9c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>紙面成績票</span>
          </button>
          <button
            onClick={() => setViewMode('web')}
            className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
              viewMode === 'web' ? 'bg-[#1a4f9c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>模試なびWeb</span>
          </button>
        </div>
      </div>

      {viewMode === 'paper' ? (
        /* ================= 1. 参考画像「全統模試.jpg」完全再現の紙面シート ================= */
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#1a4f9c] pb-2 mb-3 gap-2">
            <div className="flex items-center space-x-2">
              <div className="bg-[#1a4f9c] text-white font-black text-sm px-2.5 py-1 rounded-sm shadow-xs font-mono">
                1
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#1a4f9c] tracking-tight">
                -(1) 成績概況
              </h2>
            </div>

            <div className="text-[11px] text-slate-600 font-mono tracking-tighter sm:text-right">
              <span className="mr-3">S レベル…偏差値65.0以上</span>
              <span className="mr-3">A レベル…偏差値60.0〜64.9</span>
              <span className="mr-3">B レベル…偏差値55.0〜59.9</span>
              <span>C レベル…偏差値50.0〜54.9</span>
            </div>
          </div>

          {/* スマホ用スワイプガイド */}
          <div className="md:hidden text-[10px] text-[#1a4f9c] font-bold py-1 px-2 mb-1 bg-blue-50/70 rounded flex items-center justify-center space-x-1">
            <span>← 横にスクロールして全体を確認できます →</span>
          </div>

          <div className="overflow-x-auto border-2 border-[#1a4f9c]">
            <table className="w-full text-xs text-left border-collapse border border-[#1a4f9c] bg-white font-mono">
              <thead>
                <tr className="bg-[#eef4fc] text-slate-800 border-b border-[#1a4f9c]">
                  <th className="p-2 border-r border-[#1a4f9c] font-bold text-center w-28 bg-[#dbe8fa]">
                    受験型
                  </th>
                  <th className="p-2 border-r border-[#1a4f9c] font-bold text-center w-24">
                    1 型
                  </th>
                  <th colSpan={5} className="p-2 font-black text-center text-white bg-[#1a4f9c] tracking-widest text-sm">
                    全　国
                  </th>
                </tr>
                <tr className="bg-[#eef4fc] text-slate-800 font-bold border-b border-[#1a4f9c] text-center text-[11px]">
                  <th className="p-2 border-r border-[#1a4f9c] w-36">教科・科目</th>
                  <th className="p-2 border-r border-[#1a4f9c] w-28">あなたの得点 / 配点</th>
                  <th className="p-2 border-r border-[#1a4f9c] w-16 bg-[#dbe8fa] text-[#1a4f9c] font-black">偏差値</th>
                  <th className="p-2 border-r border-[#1a4f9c] w-16">学力レベル</th>
                  <th className="p-2 border-r border-[#1a4f9c] w-20">平均点</th>
                  <th className="p-2 border-r border-[#1a4f9c]">順位 (位) / (人中)</th>
                  <th className="p-2 w-20">現役平均</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a4f9c]">
                <tr className="hover:bg-blue-50/50">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans font-medium">英語</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{engR.score} / {engR.maxScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#f0f6ff] text-[#1a4f9c]">{engR.deviationValue}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{getLevel(engR.deviationValue)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{engR.averageScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{engR.rank.toLocaleString()} / {engR.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">54.8</td>
                </tr>
                <tr className="hover:bg-blue-50/50">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans font-medium pl-4 text-slate-700">リスニング</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{engL.score} / {engL.maxScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#f0f6ff] text-[#1a4f9c]">{engL.deviationValue}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{getLevel(engL.deviationValue)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{engL.averageScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{engL.rank.toLocaleString()} / {engL.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">59.2</td>
                </tr>
                <tr className="bg-[#f5f9ff] font-bold">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans">英語＋L</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{engTotalScore} / 200</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#dbe8fa] text-[#1a4f9c]">{engTotalDev}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{getLevel(engTotalDev)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{engTotalAvg}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{engR.rank.toLocaleString()} / {engR.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">111.4</td>
                </tr>
                <tr className="hover:bg-blue-50/50">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans">
                    数学① <span className="text-[10px] bg-slate-100 border border-slate-300 px-1 py-0.2 rounded ml-1">数学ⅠA</span>
                  </td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">＊ {m1a.score} / 100</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#f0f6ff] text-[#1a4f9c]">{m1a.deviationValue}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{getLevel(m1a.deviationValue)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{m1a.averageScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{m1a.rank.toLocaleString()} / {m1a.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">52.3</td>
                </tr>
                <tr className="hover:bg-blue-50/50">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans">
                    数学② <span className="text-[10px] bg-slate-100 border border-slate-300 px-1 py-0.2 rounded ml-1">数学ⅡB</span>
                  </td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{m2bc.score} / 100</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#f0f6ff] text-[#1a4f9c]">{m2bc.deviationValue}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{getLevel(m2bc.deviationValue)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{m2bc.averageScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{m2bc.rank.toLocaleString()} / {m2bc.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">38.9</td>
                </tr>
                <tr className="bg-[#f5f9ff] font-bold">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans">数学①②</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{mathTotalScore} / 200</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#dbe8fa] text-[#1a4f9c]">{mathTotalDev}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{getLevel(mathTotalDev)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{mathTotalAvg}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{m2bc.rank.toLocaleString()} / {m2bc.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">92.1</td>
                </tr>
                <tr className="hover:bg-blue-50/50">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans font-medium">国語</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{kokugo.score} / {kokugo.maxScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#f0f6ff] text-[#1a4f9c]">{kokugo.deviationValue}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{getLevel(kokugo.deviationValue)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{kokugo.averageScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{kokugo.rank.toLocaleString()} / {kokugo.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">124.6</td>
                </tr>
                <tr className="bg-[#f5f9ff] font-bold">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans text-slate-800">英数国総合</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center text-slate-400">ー / ー</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#dbe8fa] text-[#1a4f9c]">{enkDev}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{getLevel(enkDev)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center text-slate-400">ー</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">43,410 / 162,561</td>
                  <td className="p-2 text-center text-slate-400">ー</td>
                </tr>
                <tr className="hover:bg-blue-50/50">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans">
                    理科 <span className="text-[10px] bg-slate-100 border border-slate-300 px-1 py-0.2 rounded ml-1">第1: 物理</span>
                  </td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{sci.score} / 100</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#f0f6ff] text-[#1a4f9c]">{sci.deviationValue}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{getLevel(sci.deviationValue)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{sci.averageScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{sci.rank.toLocaleString()} / {sci.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">52.9</td>
                </tr>
                <tr className="hover:bg-blue-50/50">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans">
                    地歴公 <span className="text-[10px] bg-slate-100 border border-slate-300 px-1 py-0.2 rounded ml-1">第1: 倫理・政経</span>
                  </td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{soc.score} / 100</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-black bg-[#f0f6ff] text-[#1a4f9c]">{soc.deviationValue}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center font-bold">{getLevel(soc.deviationValue)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{soc.averageScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{soc.rank.toLocaleString()} / {soc.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center text-slate-600">64.5</td>
                </tr>
                <tr className="bg-[#eef4fc] font-black border-t-2 border-[#1a4f9c]">
                  <td className="p-2 border-r border-[#1a4f9c] font-sans">
                    総合1 <span className="text-[10px] text-slate-600 ml-1">{result.course === 'sciences' ? '5-7理系' : '5-7文系'}</span>
                  </td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center text-sm">{result.totalScore} / {result.totalMaxScore}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center text-sm bg-[#c8dcfa] text-[#1a4f9c]">{result.overallDeviation}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center text-sm">{getLevel(result.overallDeviation)}</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">546.2</td>
                  <td className="p-2 border-r border-[#1a4f9c] text-center">{result.overallRank.toLocaleString()} / {result.totalExaminees.toLocaleString()}</td>
                  <td className="p-2 text-center">522.4</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-2 text-[10px] text-slate-500 font-sans leading-tight">
            ※科目欄の＃印は解答科目のマークに不備があったことを表します。※得点欄の＊印はその科目の学力に対する参考点です。
          </div>

          <div className="mt-6 pt-4 border-t-2 border-[#1a4f9c]">
            <h3 className="font-black text-sm text-[#1a4f9c] mb-2 flex items-center space-x-2">
              <span>-(2) 志望校合否判定結果</span>
              <span className="text-xs text-slate-500 font-normal">※河合塾ボーダーライン比較</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.judgments.map((judge) => {
                let rankBadge = 'bg-[#dc3545] text-white';
                if (judge.rank === 'A') rankBadge = 'bg-[#198754] text-white';
                else if (judge.rank === 'B') rankBadge = 'bg-[#0d6efd] text-white';
                else if (judge.rank === 'C') rankBadge = 'bg-[#ffc107] text-slate-900';
                else if (judge.rank === 'D') rankBadge = 'bg-[#fd7e14] text-white';

                return (
                  <div key={judge.university.id} className="border border-[#1a4f9c]/30 rounded-lg p-3 bg-[#f8fafc] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-[#1a4f9c]">
                        第{judge.choiceRank}志望 ・ {judge.university.type === 'national' ? '国立' : judge.university.type === 'public' ? '公立' : '私立'}
                      </div>
                      <div className="font-black text-sm text-slate-900">{judge.university.name}</div>
                      <div className="text-xs text-slate-600">{judge.university.faculty}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        ボーダー: {judge.university.borders.zento} / 差: {judge.rankDiff >= 0 ? `+${judge.rankDiff}` : judge.rankDiff} / 志望者内: {judge.aspirantsRank}位
                      </div>
                    </div>

                    <div className="text-center pl-3">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-black text-2xl font-mono shadow-sm ${rankBadge}`}>
                        {judge.rank}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 mt-0.5">{judge.percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ================= 2. 河合塾「全統模試なび」スマホWebマイページ版 ================= */
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-[#003b70] to-[#00529b] text-white p-5 rounded-2xl shadow-sm">
            <div className="text-xs text-sky-200 font-bold mb-1">全統共通テスト模試 Webカルテ</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black">{result.studentName} 様</div>
                <div className="text-xs text-slate-200">{result.highSchoolName}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-sky-200">総合偏差値</div>
                <div className="text-3xl font-black text-amber-300 font-mono">{result.overallDeviation}</div>
              </div>
            </div>
          </div>

          {/* 志望校合否可能性メーター（A〜E判定バー） */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#003b70]">■ 合格可能性判定カルテ</h3>
            {result.judgments.map((judge) => {
              let barColor = judge.rank === 'A' ? 'bg-[#198754]' : judge.rank === 'B' ? 'bg-[#0d6efd]' : judge.rank === 'C' ? 'bg-[#ffc107]' : judge.rank === 'D' ? 'bg-[#fd7e14]' : 'bg-[#dc3545]';

              return (
                <div key={judge.university.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">第{judge.choiceRank}志望</span>
                      <div className="font-black text-sm text-slate-900 mt-0.5">{judge.university.name} {judge.university.faculty}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl text-white ${barColor}`}>
                      {judge.rank}
                    </div>
                  </div>
                  {/* メーターバー */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${judge.percentage}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>E判定 (20%未満)</span>
                    <span>合格可能性: {judge.percentage}%</span>
                    <span>A判定 (80%以上)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* フッター */}
      <div className="mt-6 pt-3 border-t border-slate-200 text-[10px] text-slate-400 text-center font-sans">
        学校法人 河合塾 ・ 全統共通テスト模試 個人成績表
      </div>

    </div>
  );
};
