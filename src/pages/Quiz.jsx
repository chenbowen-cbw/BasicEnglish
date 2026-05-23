import { useState } from 'react';
import { words } from '../data/words';

const QUIZ_SIZE = 20;

function buildQuiz() {
  const pool = [...words].sort(() => Math.random() - 0.5).slice(0, QUIZ_SIZE);
  return pool.map(correct => {
    const distractors = words
      .filter(w => w.id !== correct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...distractors, correct].sort(() => Math.random() - 0.5);
    return { correct, options };
  });
}

export default function Quiz() {
  const [questions, setQuestions] = useState(() => buildQuiz());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [done, setDone] = useState(false);

  const q = questions[index];

  function choose(optId) {
    if (selected !== null) return;
    setSelected(optId);
    if (optId === q.correct.id) {
      setScore(s => s + 1);
    } else {
      setWrong(w => [...w, q]);
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setSelected(null);
    }
  }

  function restart() {
    setQuestions(buildQuiz());
    setIndex(0);
    setSelected(null);
    setScore(0);
    setWrong([]);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / QUIZ_SIZE) * 100);
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">测验完成</h2>
          <p className="text-5xl font-bold text-sky-500 my-4">{score} / {QUIZ_SIZE}</p>
          <p className="text-slate-500 mb-6">正确率 {pct}%</p>

          {wrong.length > 0 && (
            <div className="text-left mb-6 bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-sm font-semibold text-red-700 mb-3">错题回顾</p>
              <div className="space-y-2">
                {wrong.map(({ correct }) => (
                  <div key={correct.id} className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{correct.word}</span>
                    <span className="text-slate-500">{correct.zh}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={restart}
            className="bg-sky-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-sky-600 transition-colors"
          >
            再来一次
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-800">词汇测验</h1>
        <span className="text-sm text-slate-500">
          第 {index + 1} / {QUIZ_SIZE} 题 · 得分 {score}
        </span>
      </div>

      {/* Progress */}
      <div className="bg-slate-100 rounded-full h-2 mb-6">
        <div
          className="bg-sky-400 h-2 rounded-full transition-all"
          style={{ width: `${((index) / QUIZ_SIZE) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
        <p className="text-sm text-slate-400 mb-2">这个单词的中文意思是？</p>
        <p className="text-3xl font-bold text-slate-800">{q.correct.word}</p>
        <p className="text-xs text-slate-400 mt-1 italic">"{q.correct.example}"</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-5">
        {q.options.map(opt => {
          let cls = 'border-slate-200 bg-white text-slate-700 hover:border-sky-400';
          if (selected !== null) {
            if (opt.id === q.correct.id) {
              cls = 'border-green-400 bg-green-50 text-green-800';
            } else if (opt.id === selected) {
              cls = 'border-red-400 bg-red-50 text-red-700';
            } else {
              cls = 'border-slate-100 bg-slate-50 text-slate-400';
            }
          }
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              className={`border rounded-xl px-5 py-3 text-left font-medium transition-colors text-sm ${cls}`}
            >
              {opt.zh}
              {selected !== null && opt.id === q.correct.id && (
                <span className="float-right text-green-500">✓</span>
              )}
              {selected !== null && opt.id === selected && opt.id !== q.correct.id && (
                <span className="float-right text-red-500">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          onClick={next}
          className="w-full bg-sky-500 text-white rounded-xl py-3 font-medium hover:bg-sky-600 transition-colors"
        >
          {index + 1 >= QUIZ_SIZE ? '查看结果' : '下一题 →'}
        </button>
      )}
    </div>
  );
}
