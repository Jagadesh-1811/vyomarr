import React from 'react';
import UsersNavbar from './UsersNavbar';
import UsersFooter from './UsersFooter';
import LegacyPage from './LegacyPage';

import homeHtml from './users pages/home_page.html?raw';
import spaceMysteriesHtml from './users pages/space_mysteries_page.html?raw';
import puzzleHtml from './users pages/puzzle.html?raw';
import whatIfHtml from './users pages/what_if_scenarios_page.html?raw';
import aboutHtml from './users pages/about.html?raw';
import contactHtml from './users pages/contact_page.html?raw';
import loginRegisterHtml from './users pages/login_register_page.html?raw';
import termsHtml from './users pages/terms.html?raw';
import policyHtml from './users pages/policy.html?raw';
import issuesHtml from './users pages/issues.html?raw';
import dataHtml from './users pages/data.html?raw';
import communityHtml from './users pages/community.html?raw';
import articleReadingHtml from './users pages/article_reading_page.html?raw';
import submitTheoryHtml from './users pages/how to submit a theory.html?raw';

const withLayout = (html) => () => (
  <>
    <UsersNavbar />
    <LegacyPage html={html} />
    <UsersFooter />
  </>
);

export const UsersHomePage = withLayout(homeHtml);
export const SpaceMysteriesPage = withLayout(spaceMysteriesHtml);
export const PuzzlePage = withLayout(puzzleHtml);
export const WhatIfScenariosPage = withLayout(whatIfHtml);
export const AboutPage = withLayout(aboutHtml);
export const ContactPage = withLayout(contactHtml);
export const LoginRegisterPage = withLayout(loginRegisterHtml);
export const TermsPage = withLayout(termsHtml);
export const PolicyPage = withLayout(policyHtml);
export const IssuesPage = withLayout(issuesHtml);
export const DataPage = withLayout(dataHtml);
export const CommunityPage = withLayout(communityHtml);
export const ArticleReadingPage = withLayout(articleReadingHtml);
export const SubmitTheoryPage = withLayout(submitTheoryHtml);

