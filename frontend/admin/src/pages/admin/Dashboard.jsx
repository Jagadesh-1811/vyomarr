import React, { useState } from "react";
import { Menu, X, CheckCircle2, HelpCircle, MessageSquare, Users, FileText } from 'lucide-react';
import { SpaceAndMysteries } from './SpaceAndMysteries';
import { WhatIf } from './WhatIf';
import { FeedbackAndIssues } from './FeedbackAndIssues';
import { Comments } from './Comments';
import { SubscribedUsers } from './SubscribedUsers';
import PublishedArticles from './PublishedArticles';
import Sidebar from '../../components/Sidebar';

const MENU_ITEMS = [
  { id: 1, label: 'Space & Mysteries', icon: <CheckCircle2 size={18} /> },
  { id: 2, label: 'What If?', icon: <HelpCircle size={18} /> },
  { id: 3, label: 'Published Articles', icon: <FileText size={18} /> },
  { id: 4, label: 'Feedback & Issues', icon: <MessageSquare size={18} /> },
  { id: 5, label: 'Comments', icon: <Users size={18} /> },
  { id: 6, label: 'Subscribed Users', icon: <Users size={18} /> },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('Space & Mysteries');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      alert("Logged out!");
      // localStorage.removeItem('adminToken');
      // navigate('/login');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Space & Mysteries':
        return <SpaceAndMysteries onLogout={handleLogout} />;
      case 'What If?':
        return <WhatIf onLogout={handleLogout} />;
      case 'Published Articles':
        return <PublishedArticles />;
      case 'Feedback & Issues':
        return <FeedbackAndIssues onLogout={handleLogout} />;
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
      <button className="vy-mobile-toggle" onClick={() => setSidebarOpen(true)}>
        <Menu size={24} />
      </button>

      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {renderContent()}
    </div>
  );
}