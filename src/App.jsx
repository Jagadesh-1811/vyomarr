import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ReadingArticle from './pages/ReadingArticle';
import ArticlesList from './pages/ArticlesList';
import {
  AboutPage,
  ArticleReadingPage,
  CommunityPage,
  ContactPage,
  DataPage,
  IssuesPage,
  LoginRegisterPage,
  PolicyPage,
  PuzzlePage,
  SpaceMysteriesPage,
  SubmitTheoryPage,
  TermsPage,
  UsersHomePage,
  WhatIfScenariosPage,
} from './pages/users';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<UsersHomePage />} />
        <Route path="/users" element={<Navigate to="/users/home" />} />
        <Route path="/users/home" element={<UsersHomePage />} />
        <Route path="/users/space-mysteries" element={<SpaceMysteriesPage />} />
        <Route path="/users/puzzles" element={<PuzzlePage />} />
        <Route path="/users/what-if" element={<WhatIfScenariosPage />} />
        <Route path="/users/about" element={<AboutPage />} />
        <Route path="/users/contact" element={<ContactPage />} />
        <Route path="/users/login" element={<LoginRegisterPage />} />
        <Route path="/users/terms" element={<TermsPage />} />
        <Route path="/users/policy" element={<PolicyPage />} />
        <Route path="/users/issues" element={<IssuesPage />} />
        <Route path="/users/data" element={<DataPage />} />
        <Route path="/users/community" element={<CommunityPage />} />
        <Route path="/users/article" element={<ArticleReadingPage />} />
        <Route path="/users/submit-theory" element={<SubmitTheoryPage />} />

        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/article/:id" element={<ReadingArticle />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

