import { NavLink } from 'react-router-dom';

const links = [
  { to: '/words', label: '词汇表' },
  { to: '/learn', label: '单词学习' },
  { to: '/reading', label: '阅读练习' },
  { to: '/quiz', label: '词汇测验' },
];

export default function Nav() {
  return (
    <nav className="bg-white border-b border-sky-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <NavLink to="/" className="flex items-center gap-2 text-sky-600 font-semibold text-lg">
          <span className="text-xl">📖</span>
          <span className="hidden sm:inline">Basic English 850</span>
        </NavLink>
        <div className="flex gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
