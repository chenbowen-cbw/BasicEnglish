import { useState, useMemo } from 'react';
import { words, CATEGORIES, CATEGORY_COLORS } from '../data/words';

const ALL = 'All';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function WordList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const [letter, setLetter] = useState(ALL);
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return words.filter(w => {
      const matchSearch = w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.zh.includes(search);
      const matchCat = category === ALL || w.category === category;
      const matchLetter = letter === ALL || w.word.toUpperCase().startsWith(letter);
      return matchSearch && matchCat && matchLetter;
    });
  }, [search, category, letter]);

  const categories = [ALL, ...Object.values(CATEGORIES)];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">词汇表</h1>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="搜索英文或中文..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-3">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              category === c
                ? 'bg-sky-500 text-white border-sky-500'
                : 'bg-white text-slate-600 border-slate-200 hover:border-sky-400'
            }`}
          >
            {c === ALL ? '全部' : c}
            {c !== ALL && (
              <span className="ml-1 opacity-70">
                ({words.filter(w => w.category === c).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alphabet filter */}
      <div className="flex gap-1 flex-wrap mb-5">
        <button
          onClick={() => setLetter(ALL)}
          className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
            letter === ALL ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-sky-500'
          }`}
        >
          ALL
        </button>
        {ALPHABET.map(l => (
          <button
            key={l}
            onClick={() => setLetter(l)}
            className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
              letter === l ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-sky-500'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500 mb-4">共 {filtered.length} 个词汇</p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(w => (
          <div
            key={w.id}
            onClick={() => setExpanded(expanded === w.id ? null : w.id)}
            className={`bg-white border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${
              expanded === w.id ? 'border-sky-400 shadow-md col-span-2 sm:col-span-1' : 'border-slate-100'
            }`}
          >
            <div className="font-semibold text-slate-800 text-base">{w.word}</div>
            <div className="text-slate-500 text-sm mt-0.5">{w.zh}</div>
            <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[w.category]}`}>
              {w.category.replace('Things ', '').replace('Qualities ', '')}
            </span>
            {expanded === w.id && (
              <p className="mt-2 text-xs text-slate-600 border-t border-slate-100 pt-2 italic">
                "{w.example}"
              </p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>没有找到匹配的词汇</p>
        </div>
      )}
    </div>
  );
}
