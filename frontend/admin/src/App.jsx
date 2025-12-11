import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ReadingArticle from './pages/ReadingArticle';
import ArticlesList from './pages/ArticlesList';
import SpaceMysteries from './pages/SpaceMysteries';
import PuzzlesGames from './pages/PuzzlesGames';
import SubmitTheory from './pages/SubmitTheory';
import SubmitForm from './pages/SubmitForm';
import FeedbackForm from './pages/FeedbackForm';
import WhatIf from './pages/WhatIf';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<ArticlesList />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/space-mysteries" element={<SpaceMysteries />} />
        <Route path="/puzzles" element={<PuzzlesGames />} />
        <Route path="/submit-theory" element={<SubmitTheory />} />
        <Route path="/submit-form" element={<SubmitForm />} />
        <Route path="/article/:id" element={<ReadingArticle />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/whatif" element={<WhatIf />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
