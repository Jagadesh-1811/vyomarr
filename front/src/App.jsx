import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SpaceMysteriesPage from './pages/SpaceMysteriesPage'
import WhatIfPage from './pages/WhatIfPage'
import PuzzlePage from './pages/PuzzlePage'
import ArticlePage from './pages/ArticlePage'
import SubmitTheoryPage from './pages/SubmitTheoryPage'
import CommunityPage from './pages/CommunityPage'
import TermsPage from './pages/TermsPage'
import PolicyPage from './pages/PolicyPage'
import PrivacyPage from './pages/PrivacyPage'
import GuidelinesPage from './pages/GuidelinesPage'
import IssuesPage from './pages/IssuesPage'
import HowToSubmitPage from './pages/HowToSubmitPage'
import CookiesPage from './pages/CookiesPage'

// Admin Panel Components
import AdminLogin from './admin/Login'
import AdminDashboard from './admin/Dashboard'

function App() {
    return (
        <Routes>
            {/* Admin Routes (outside main layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Login Route (outside main layout - no navbar/footer) */}
            <Route path="/login" element={<LoginPage />} />

            {/* Public Routes with Layout */}
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="space-mysteries" element={<SpaceMysteriesPage />} />
                <Route path="what-if" element={<WhatIfPage />} />
                <Route path="puzzles" element={<PuzzlePage />} />
                <Route path="article/:id" element={<ArticlePage />} />
                <Route path="article" element={<ArticlePage />} />
                <Route path="submit-theory" element={<SubmitTheoryPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="policy" element={<PolicyPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="guidelines" element={<GuidelinesPage />} />
                <Route path="issues" element={<IssuesPage />} />
                <Route path="how-to-submit" element={<HowToSubmitPage />} />
                <Route path="cookies" element={<CookiesPage />} />
            </Route>
        </Routes>
    )
}

export default App
