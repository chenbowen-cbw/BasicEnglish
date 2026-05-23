import { useState } from 'react';
import { readings } from '../data/readings';
import { getWordByText } from '../data/words';

const LEVEL_COLOR = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

function Tooltip({ word, onClose }) {
  const info = getWordByText(word);
  if (!info) return null;
  return (
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg pointer-events-none">
      <span className="font-semibold">{info.word}</span>
      <span className="mx-1 text-slate-400">|</span>
      {info.zh}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
    </span>
  );
}

function ReadableText({ content }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="leading-8 text-slate-700 text-base">
      {content.split('\n').map((para, pi) =>
        para.trim() === '' ? (
          <div key={pi} className="h-4" />
        ) : (
          <p key={pi} className="mb-0">
            {para.split(/(\s+)/).map((token, ti) => {
              const clean = token.replace(/[^a-zA-Z'-]/g, '');
              const isWord = /^[a-zA-Z]/.test(token);
              const info = isWord ? getWordByText(clean) : null;
              const id = `${pi}-${ti}`;

              if (!isWord) return <span key={ti}>{token}</span>;

              return (
                <span
                  key={ti}
                  className={`relative inline-block ${
                    info
                      ? 'text-sky-700 cursor-pointer hover:bg-sky-50 rounded px-0.5'
                      : 'text-amber-600'
                  }`}
                  onMouseEnter={() => info && setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === id && <Tooltip word={clean} />}
                  {token}
                </span>
              );
            })}
          </p>
        )
      )}
    </div>
  );
}

export default function Reading() {
  const [selected, setSelected] = useState(null);

  if (selected !== null) {
    const article = readings[selected];
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelected(null)}
          className="text-sky-500 hover:text-sky-700 text-sm mb-6 flex items-center gap-1"
        >
          ← 返回文章列表
        </button>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-800">{article.title}</h1>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${LEVEL_COLOR[article.level]}`}>
            {article.levelLabel}
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          <span className="text-sky-600">蓝色词</span> = Basic English 850 词（悬停查看释义）&nbsp;&nbsp;
          <span className="text-amber-600">橙色词</span> = 非 850 词
        </p>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <ReadableText content={article.content} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">阅读练习</h1>
      <p className="text-slate-500 text-sm mb-6">
        所有文章均由 Basic English 850 词写成，悬停单词可查看中文释义
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {readings.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setSelected(i)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-semibold text-slate-800">{r.title}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ml-2 ${LEVEL_COLOR[r.level]}`}>
                {r.levelLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{r.topic}</p>
            <p className="text-sm text-slate-500 line-clamp-2">
              {r.content.split('\n')[0]}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
