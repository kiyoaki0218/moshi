import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { ExamResult } from '../types';
import { Share2, Download, Copy, Check, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExamResult;
  targetElementId: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  result, 
  targetElementId 
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // X（旧Twitter）共有用テキスト
  const topJudge = result.judgments[0];
  const shareText = `【${result.examTitle}】を受験しました！\n総合得点: ${result.totalScore} / ${result.totalMaxScore}点\n総合偏差値: ${result.overallDeviation}（全国${result.overallRank.toLocaleString()}位）\n第一志望判定: ${topJudge?.university.name}【${topJudge?.rank}判定（${topJudge?.percentage}%）】\n\n#大学受験 #模試シミュレーター #進研模試 #全統模試 #駿台模試`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  // 画像ダウンロード実行
  const handleDownloadImage = async () => {
    const el = document.getElementById(targetElementId);
    if (!el) {
      alert('キャプチャ対象の要素が見つかりませんでした。');
      return;
    }

    try {
      setIsCapturing(true);
      const dataUrl = await toPng(el, {
        quality: 0.95,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `${result.examTitle}_${result.studentName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('画像の生成に失敗しました。');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-base">成績表をシェア・保存</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 成績サマリーボックス */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
          <div className="font-bold text-slate-800">{result.examTitle}</div>
          <div className="text-slate-600">
            得点: {result.totalScore}点 ｜ 偏差値: <strong className="text-indigo-600">{result.overallDeviation}</strong>
          </div>
          <div className="text-slate-600">
            第1志望: {topJudge?.university.name}【{topJudge?.rank}判定】
          </div>
        </div>

        {/* アクションボタン */}
        <div className="space-y-2.5 pt-2">
          {/* 画像ダウンロード */}
          <button
            disabled={isCapturing}
            onClick={handleDownloadImage}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{isCapturing ? '高画質画像を生成中...' : '成績表をPNG画像として保存'}</span>
          </button>

          {/* Xでポスト */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-black hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-2 text-center"
          >
            <span className="font-black text-sm">𝕏</span>
            <span>X (旧Twitter) で模試結果を共有</span>
          </a>

          {/* テキストコピー */}
          <button
            onClick={handleCopyText}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '結果テキストをコピーしました！' : 'テキストをコピー'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
