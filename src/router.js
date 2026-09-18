// SPA Client Router for AlumniConnect
import { store } from './data/store.js';
import { renderNavbar } from './components/navbar.js';
import { renderMobileNav } from './components/mobileNav.js';
import { renderLandingPage } from './pages/landingPage.js';
import { renderAlumniDirectoryPage } from './pages/alumniDirectoryPage.js';
import { renderRegisterPage } from './pages/registerPage.js';
import { renderLoginPage } from './pages/loginPage.js';
import { renderCommonDashboard } from './pages/commonDashboard.js';
import { renderStudentDashboard } from './pages/studentDashboard.js';
import { renderAlumniDashboard } from './pages/alumniDashboard.js';
import { renderAdminDashboard } from './pages/adminDashboard.js';
import { renderJobsPage } from './pages/jobsPage.js';
import { renderEventsPage } from './pages/eventsPage.js';
import { renderMentorshipPage } from './pages/mentorshipPage.js';
import { renderCommunityPage } from './pages/communityPage.js';
import { renderStoriesPage } from './pages/storiesPage.js';
import { renderChaptersPage } from './pages/chaptersPage.js';
import { renderDonationsPage } from './pages/donationsPage.js';
import { renderPollsPage } from './pages/pollsPage.js';
import { renderMessagesPage } from './pages/messagesPage.js';
import { renderSettingsPage } from './pages/settingsPage.js';
import { openGlobalSearch } from './components/globalSearch.js';

export function initRouter() {
  const appRoot = document.getElementById('app');

  function handleRoute() {
    const rawHash = window.location.hash || '#home';
    const hash = rawHash.split('?')[0];

    // Scroll to top
    window.scrollTo(0, 0);

    // Clear root
    appRoot.innerHTML = '';

    // Render Sticky Navbar
    const navbar = renderNavbar();
    appRoot.appendChild(navbar);

    // Main Page Content Container
    const mainContent = document.createElement('main');
    mainContent.id = 'mainContent';

    let pageNode;

    if (hash === '#home' || hash === '' || hash === '#') {
      pageNode = renderLandingPage();
    } else if (hash === '#alumni') {
      pageNode = renderAlumniDirectoryPage();
    } else if (hash === '#login') {
      pageNode = renderLoginPage();
    } else if (hash === '#register') {
      pageNode = renderRegisterPage();
    } else if (hash === '#dashboard' || hash === '#dashboard/me' || hash === '#dashboard/common') {
      pageNode = renderCommonDashboard();
    } else if (hash === '#dashboard/student') {
      pageNode = renderStudentDashboard();
    } else if (hash === '#dashboard/alumni') {
      pageNode = renderAlumniDashboard();
    } else if (hash === '#dashboard/admin' || hash === '#dashboard/faculty') {
      pageNode = renderAdminDashboard();
    } else if (hash.startsWith('#dashboard')) {
      pageNode = renderCommonDashboard();
    } else if (hash === '#jobs') {
      pageNode = renderJobsPage();
    } else if (hash === '#events') {
      pageNode = renderEventsPage();
    } else if (hash === '#mentorship') {
      pageNode = renderMentorshipPage();
    } else if (hash === '#community') {
      pageNode = renderCommunityPage();
    } else if (hash === '#stories') {
      pageNode = renderStoriesPage();
    } else if (hash === '#chapters') {
      pageNode = renderChaptersPage();
    } else if (hash === '#donations') {
      pageNode = renderDonationsPage();
    } else if (hash === '#polls') {
      pageNode = renderPollsPage();
    } else if (hash === '#messages') {
      pageNode = renderMessagesPage();
    } else if (hash === '#settings') {
      pageNode = renderSettingsPage();
    } else {
      pageNode = renderLandingPage();
    }

    mainContent.appendChild(pageNode);
    appRoot.appendChild(mainContent);

    // Mobile Bottom Navigation Bar
    const mobileNav = renderMobileNav();
    appRoot.appendChild(mobileNav);
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K for global search
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openGlobalSearch();
    }
  });

  // Listen for hashchange
  window.addEventListener('hashchange', handleRoute);

  // Initial load
  handleRoute();
}
