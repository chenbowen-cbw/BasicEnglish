import { useState, useEffect, useCallback } from 'react';
import { words, CATEGORIES } from '../data/words';

const STORAGE_KEY = 'basic-english-progress';
const STATUS = { NEW: 'new', LEARNING: 'learning', KNOWN: 'known' };

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function Learn() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(loadProgress);
  const [finished, setFinished] = useState(false);

  const buildDeck = useCallback((cat, prog) => {
    const pool = cat === 'All' ? words : words.filter(w => w.category === cat);
    const notKnown = pool.filter(w => prog[w.id] !== STATUS.KNOWN);
    const shuffled = [...notKnown].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
    setFlipped(false);
    setFinished(shuffled.length === 0);
  }, []);

  useEffect(() => {
    buildDeck(categoryFilter, progress);
  }, [categoryFilter]);

  const current = deck[index];

  function mark(status) {
    if (!current) return;
    const next = { ...progress, [current.id]: status };
    setProgress(next);
    saveProgress(next);
    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      setFinished(true);
    } else {
      setIndex(nextIndex);
      setFlipped(false);
    }
  }

  const known = words.filter(w => progress[w.id] === STATUS.KNOWN).length;
  const learning = words.filter(w => progress[w.id] === STATUS.LEARNING).length;

  function reset() {
    const cleared = {};
    saveProgress(cleared);
    setProgress(cleared);
    buildDeck(categoryFilter, cleared);
  }

  const categories = ['All', ...Object.values(CATEGORIES)];
  const pct = deck.length > 0 ? Math.round((index / deck.length) * 100) : 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">单词学习</h1>

      {/* Stats row */}
      <div className="flex gap-3 mb-5 text-sm">
        <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
          已掌握 {known}
        </div>
        <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg border border-yellow-200">
          学习中 {learning}
        </div>
        <div className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
          全部 {words.length}
        </div>
      </div>

      {/* Category */}
      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              categoryFilter === c
                ? 'bg-sky-500 text-white border-sky-500'
                : 'bg-white text-slate-600 border-slate-200 hover:border-sky-400'
            }`}
          >
            {c === 'All' ? '全部' : c.replace('Things ', 'T/').replace('Qualities ', 'Q/')}
          </button>
        ))}
      </div>

      {finished ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {deck.length === 0 ? '这个分类已全部掌握！' : '本轮学习完成！'}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            共掌握 {known} / {words.length} 个词汇
          </p>
          <button
            onClick={() => buildDeck(categoryFilter, progress)}
            className="bg-sky-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sky-600 transition-colors mr-3"
          >
            再练一次
          </button>
          <button
            onClick={reset}
            className="border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            重置进度
          </button>
        </div>
      ) : current ? (
        <>
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-slate-100 rounded-full h-2">
              <div
                className="bg-sky-400 h-2 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">{index} / {deck.length}</span>
          </div>

          {/* Card */}
          <div className="perspective h-56 mb-6 cursor-pointer" onClick={() => setFlipped(f => !f)}>
            <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
              <div className="card-front bg-white border-2 border-sky-100 shadow-md">
                <div className="text-4xl font-bold text-slate-800 mb-2">{current.word}</div>
                <div className="text-xs text-slate-400">点击翻转查看中文</div>
              </div>
              <div className="card-back bg-sky-500 text-white shadow-md">
                <div className="text-3xl font-bold mb-2">{current.zh}</div>
                <div className="text-sky-100 text-sm italic text-center px-4">"{current.example}"</div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          {flipped && (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => mark(STATUS.NEW)}
                className="bg-red-50 border border-red-200 text-red-600 rounded-xl py-3 font-medium hover:bg-red-100 transition-colors text-sm"
              >
                😕 不认识
              </button>
              <button
                onClick={() => mark(STATUS.LEARNING)}
                className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl py-3 font-medium hover:bg-yellow-100 transition-colors text-sm"
              >
                🤔 模糊
              </button>
              <button
                onClick={() => mark(STATUS.KNOWN)}
                className="bg-green-50 border border-green-200 text-green-700 rounded-xl py-3 font-medium hover:bg-green-100 transition-colors text-sm"
              >
                ✓ 认识
              </button>
            </div>
          )}

          {!flipped && (
            <button
              onClick={() => setFlipped(true)}
              className="w-full bg-sky-500 text-white rounded-xl py-3 font-medium hover:bg-sky-600 transition-colors"
            >
              翻转查看
            </button>
          )}
        </>
      ) : null}
    </div>
  );
}
