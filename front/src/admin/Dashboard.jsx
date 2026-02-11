import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Menu, X, CheckCircle2, HelpCircle, MessageSquare, Users, FileText, Mail, Layout } from 'lucide-react';
import { SpaceAndMysteries } from './SpaceAndMysteries';
import { ScheduledPosts } from './ScheduledPosts';
import { WhatIf } from './WhatIf';
import { FeedbackAndIssues } from './FeedbackAndIssues';
import { Comments } from './Comments';
import { SubscribedUsers } from './SubscribedUsers';
import { ContactMessages } from './ContactMessages';
import PublishedArticles from './PublishedArticles';
import { HeroEditor } from './HeroEditor';
import Sidebar from './Sidebar';

const MENU_ITEMS = [
  { id: 1, label: 'Space & Mysteries', icon: <CheckCircle2 size={18} /> },
  { id: 8, label: 'Scheduled Posts', icon: <FileText size={18} /> },
  { id: 2, label: 'What If?', icon: <HelpCircle size={18} /> },
  { id: 3, label: 'Published Articles', icon: <FileText size={18} /> },
  { id: 9, label: 'Site Settings', icon: <Layout size={18} /> },
  { id: 4, label: 'Feedback & Issues', icon: <MessageSquare size={18} /> },
  { id: 5, label: 'Contact Messages', icon: <Mail size={18} /> },
  { id: 6, label: 'Comments', icon: <Users size={18} /> },
  { id: 7, label: 'Subscribed Users', icon: <Users size={18} /> },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('Space & Mysteries');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('adminInfo');
      navigate('/admin/login');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Space & Mysteries':
        return <SpaceAndMysteries onLogout={handleLogout} />;
      case 'Scheduled Posts':
        return <ScheduledPosts onLogout={handleLogout} />;
      case 'What If?':
        return <WhatIf onLogout={handleLogout} />;
      case 'Published Articles':
        return <PublishedArticles />;
      case 'Site Settings':
        return <HeroEditor />;
      case 'Feedback & Issues':
        return <FeedbackAndIssues onLogout={handleLogout} />;
      case 'Contact Messages':
        return <ContactMessages onLogout={handleLogout} />;
      case 'Comments':
        return <Comments onLogout={handleLogout} />;
      case 'Subscribed Users':
        return <SubscribedUsers onLogout={handleLogout} />;
      default:
        return <SpaceAndMysteries onLogout={handleLogout} />;
    }
  };

  return (
    <div className="vy-container">
      <button
        className="vy-mobile-toggle"
        onClick={() => setSidebarOpen(true)}
        style={{ display: sidebarOpen ? 'none' : undefined }}
      >
        <Menu size={24} />
      </button>

      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {renderContent()}
    </div>
  );
}