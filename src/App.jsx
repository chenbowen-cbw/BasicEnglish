import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import WordList from './pages/WordList';
import Learn from './pages/Learn';
import Reading from './pages/Reading';
import Quiz from './pages/Quiz';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f8f6f0]">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/words" element={<WordList />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
