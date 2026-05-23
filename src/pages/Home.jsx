import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { words } from '../data/words';

const modules = [
  {
    to: '/words',
    icon: '📚',
    title: '词汇表',
    desc: '浏览全部 Basic English 核心词汇，按分类检索，实时搜索',
    color: 'bg-sky-500',
  },
  {
    to: '/learn',
    icon: '🃏',
    title: '单词学习',
    desc: '通过翻转卡片记忆单词，系统跟踪学习进度',
    color: 'bg-violet-500',
  },
  {
    to: '/reading',
    icon: '📰',
    title: '阅读练习',
    desc: '阅读用 850 词写成的文章，悬停单词查看中文释义',
    color: 'bg-emerald-500',
  },
  {
    to: '/quiz',
    icon: '✏️',
    title: '词汇测验',
    desc: '4 选 1 测试，检验你对 Basic English 词汇的掌握程度',
    color: 'bg-amber-500',
  },
];

export default function Home() {
  const stats = useMemo(() => [
    { label: 'Operations', count: words.filter(w => w.category === 'Operations').length, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Things', count: words.filter(w => w.category.startsWith('Things')).length, color: 'bg-green-50 text-green-600 border-green-200' },
    { label: 'Qualities', count: words.filter(w => w.category.startsWith('Qualities')).length, color: 'bg-orange-50 text-orange-600 border-orange-200' },
  ], []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
          Basic English 850
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          基于 C.K. Ogden 创立的 Basic English 体系，用最核心的词汇开启英语学习之旅
        </p>
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {stats.map(s => (
            <div key={s.label} className={`border rounded-xl px-5 py-3 ${s.color}`}>
              <div className="text-2xl font-bold">{s.count}</div>
              <div className="text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="grid sm:grid-cols-2 gap-5">
        {modules.map(m => (
          <Link
            key={m.to}
            to={m.to}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex gap-4 items-start group"
          >
            <div className={`${m.color} text-white rounded-xl w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0`}>
              {m.icon}
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">
                {m.title}
              </h2>
              <p className="text-slate-500 text-sm mt-1">{m.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* About */}
      <div className="mt-12 bg-sky-50 border border-sky-200 rounded-2xl p-6">
        <h3 className="font-semibold text-sky-800 mb-2">关于 Basic English</h3>
        <p className="text-sky-700 text-sm leading-relaxed">
          Basic English（基本英语）由英国语言学家 C.K. Ogden 于 1930 年代提出。
          他精选了 850 个英语单词，覆盖日常生活和科学表达的核心需求。
          掌握这 850 个词，你就能理解大部分英语文章，并进行基本的英语交流。
        </p>
      </div>
    </div>
  );
}
