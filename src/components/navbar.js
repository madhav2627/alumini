// Top Navigation Header with Search Trigger, Notifications, Persona Switcher & Responsive Navigation
import { icon } from './icons.js';
import { store } from '../data/store.js';
import { openGlobalSearch } from './globalSearch.js';
import { openNotificationCenter } from './notificationCenter.js';
import { showToast } from './toast.js';
import { openAppInstallModal, isRunningInApp } from './pwaInstallPrompt.js';

export function renderNavbar() {
  const persona = store.getCurrentPersona();
  const currentUser = store.getCurrentUser();
  const currentRole = store.state.currentRole;
  const unreadCount = store.getNotifications().filter(n => n.unread).length;
  const currentHash = window.location.hash || '#home';
  const inApp = isRunningInApp();

  const nav = document.createElement('header');
  nav.className = 'navbar';
  nav.innerHTML = `
    <div class="container navbar-container">
      <div class="navbar-inner">
        <!-- Brand Logo -->
        <a href="#home" class="nav-brand">
          <div class="brand-icon">
            ${icon('graduationCap', 20)}
          </div>
          <div class="nav-brand-text">
            <span class="nav-brand-title">AlumniConnect</span>
            <span class="nav-brand-tagline">Connect. Inspire. Grow.</span>
          </div>
        </a>

        <!-- Main Desktop Navigation -->
        <nav class="nav-desktop">
          <ul class="nav-links">
            <li><a href="#home" class="nav-link ${currentHash === '#home' || currentHash === '' ? 'active' : ''}">Home</a></li>
            <li><a href="#alumni" class="nav-link ${currentHash.startsWith('#alumni') ? 'active' : ''}">Alumni</a></li>
            <li><a href="#events" class="nav-link ${currentHash.startsWith('#events') ? 'active' : ''}">Events</a></li>
            <li><a href="#jobs" class="nav-link ${currentHash.startsWith('#jobs') ? 'active' : ''}">Jobs</a></li>
            <li class="nav-link-extended"><a href="#mentorship" class="nav-link ${currentHash.startsWith('#mentorship') ? 'active' : ''}">Mentorship</a></li>
            <li class="nav-link-extended"><a href="#community" class="nav-link ${currentHash.startsWith('#community') ? 'active' : ''}">Community</a></li>
            <li class="nav-link-extended"><a href="#stories" class="nav-link ${currentHash.startsWith('#stories') ? 'active' : ''}">Stories</a></li>
            
            <!-- Explore More Dropdown Menu -->
            <li class="nav-more-dropdown-wrap">
              <button class="nav-link nav-more-trigger" id="navMoreBtn" type="button" title="Explore more features">
                <span>More</span>
                ${icon('chevronDown', 13)}
              </button>
              <div class="nav-more-menu" id="navMoreMenu">
                <div class="nav-more-menu-mobile-items">
                  <a href="#mentorship" class="nav-more-item ${currentHash.startsWith('#mentorship') ? 'active' : ''}">
                    <div class="nav-more-icon-box" style="background: rgba(79, 70, 229, 0.1); color: var(--primary);">
                      ${icon('users', 16)}
                    </div>
                    <div>
                      <div class="nav-more-title">Mentorship</div>
                      <div class="nav-more-desc">1-on-1 career guidance</div>
                    </div>
                  </a>
                  <a href="#community" class="nav-more-item ${currentHash.startsWith('#community') ? 'active' : ''}">
                    <div class="nav-more-icon-box" style="background: rgba(14, 165, 233, 0.1); color: var(--accent-sky);">
                      ${icon('messageSquare', 16)}
                    </div>
                    <div>
                      <div class="nav-more-title">Community</div>
                      <div class="nav-more-desc">Discussions & channels</div>
                    </div>
                  </a>
                  <a href="#stories" class="nav-more-item ${currentHash.startsWith('#stories') ? 'active' : ''}">
                    <div class="nav-more-icon-box" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-amber);">
                      ${icon('sparkles', 16)}
                    </div>
                    <div>
                      <div class="nav-more-title">Stories</div>
                      <div class="nav-more-desc">Alumni spotlight</div>
                    </div>
                  </a>
                  <div class="nav-more-divider"></div>
                </div>
                <a href="#chapters" class="nav-more-item ${currentHash.startsWith('#chapters') ? 'active' : ''}">
                  <div class="nav-more-icon-box" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald);">
                    ${icon('mapPin', 16)}
                  </div>
                  <div>
                    <div class="nav-more-title">Regional Chapters</div>
                    <div class="nav-more-desc">Global alumni networks</div>
                  </div>
                </a>
                <a href="#donations" class="nav-more-item ${currentHash.startsWith('#donations') ? 'active' : ''}">
                  <div class="nav-more-icon-box" style="background: rgba(244, 63, 94, 0.1); color: var(--accent-rose);">
                    ${icon('heart', 16)}
                  </div>
                  <div>
                    <div class="nav-more-title">Giving & Donations</div>
                    <div class="nav-more-desc">Endowments & funds</div>
                  </div>
                </a>
                <a href="#polls" class="nav-more-item ${currentHash.startsWith('#polls') ? 'active' : ''}">
                  <div class="nav-more-icon-box" style="background: rgba(139, 92, 246, 0.1); color: var(--secondary);">
                    ${icon('vote', 16)}
                  </div>
                  <div>
                    <div class="nav-more-title">Community Polls</div>
                    <div class="nav-more-desc">Live community voting</div>
                  </div>
                </a>
                ${!inApp ? `
                  <div class="nav-more-divider"></div>
                  <button type="button" class="nav-more-item" id="navInstallAppBtn" style="width: 100%; border: none; background: transparent; text-align: left; cursor: pointer;">
                    <div class="nav-more-icon-box" style="background: rgba(79, 70, 229, 0.1); color: var(--primary);">
                      ${icon('smartphone', 16)}
                    </div>
                    <div>
                      <div class="nav-more-title">Download & Install App</div>
                      <div class="nav-more-desc">Add app to device home screen</div>
                    </div>
                  </button>
                ` : ''}
              </div>
            </li>

            <li><a href="#dashboard" class="nav-link ${currentHash.startsWith('#dashboard') ? 'active' : ''}">Dashboard</a></li>
          </ul>
        </nav>

        <!-- Actions & Tools -->
        <div class="nav-actions">
          <!-- Global Search Trigger -->
          <button class="search-trigger-btn" id="navSearchTrigger" title="Search alumni, jobs, events (Ctrl+K)" aria-label="Search">
            ${icon('search', 16)}
            <span class="search-text">Search...</span>
            <span class="kbd-shortcut">⌘K</span>
          </button>

          <!-- Theme Toggle -->
          <button class="btn-icon" id="navThemeToggle" title="Toggle theme" aria-label="Toggle Theme">
            ${store.state.darkTheme ? icon('sun', 18) : icon('moon', 18)}
          </button>

          <!-- Notifications Bell -->
          <button class="notif-btn" id="navNotifBtn" title="Notifications" aria-label="Notifications">
            ${icon('bell', 20)}
            ${unreadCount > 0 ? `<span class="notif-count">${unreadCount}</span>` : ''}
          </button>

          ${currentUser ? `
            <!-- Authenticated User Persona Pill -->
            <div class="persona-dropdown-wrap" style="position: relative;">
              <button class="persona-pill" id="personaSelectBtn" title="${currentUser.name} (ID: ${currentUser.collegeId})">
                <img src="${currentUser.avatar}" class="persona-avatar" alt="${currentUser.name}" />
                <span class="persona-badge ${currentUser.role || currentRole}">${currentUser.role || currentRole}</span>
                ${icon('chevronDown', 13)}
              </button>
              <!-- Dropdown Menu -->
              <div id="personaDropdown" class="persona-dropdown-menu" style="display: none; width: 230px;">
                <!-- Current Active Account Badge -->
                <div style="padding: 0.75rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); margin-bottom: 0.5rem; border: 1px solid var(--border-color);">
                  <div style="font-weight: 700; font-size: 0.875rem; color: var(--text-primary);">${currentUser.name}</div>
                  <div style="font-size: 0.725rem; color: var(--primary); font-family: monospace; font-weight: 700; margin-top: 2px;">
                    ${icon('shield', 12)} ID: ${currentUser.collegeId || 'N/A'}
                  </div>
                  <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
                    ${currentUser.department || 'Campus Member'}
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.2rem;">
                  <a href="#dashboard" class="nav-more-item" style="padding: 0.45rem 0.6rem; text-decoration: none;">
                    ${icon('user', 15)} <span style="font-weight: 600; font-size: 0.825rem;">My Dashboard</span>
                  </a>
                  <a href="#settings" class="nav-more-item" style="padding: 0.45rem 0.6rem; text-decoration: none;">
                    ${icon('activity', 15)} <span style="font-weight: 600; font-size: 0.825rem;">Account Settings</span>
                  </a>
                  <div style="border-top: 1px solid var(--border-light); margin: 0.35rem 0;"></div>
                  <a href="#login" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.6rem; font-size: 0.78rem; font-weight: 600; color: var(--text-primary); text-decoration: none;">
                    ${icon('user', 15)} Login with another ID
                  </a>
                  <button id="navSignOutBtn" type="button" style="width: 100%; text-align: left; display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.6rem; font-size: 0.78rem; font-weight: 600; color: var(--accent-rose); background: transparent; border: none; cursor: pointer; border-radius: var(--radius-md);">
                    ${icon('logOut', 15)} Sign Out
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <!-- Sign In button when logged out -->
            <a href="#login" class="btn btn-secondary btn-sm nav-signin-btn" style="flex-shrink: 0; padding: 0.42rem 0.75rem;">
              Sign In
            </a>
          `}

          <!-- Join Community Call-to-Action Button -->
          <a href="#register" class="btn btn-primary btn-sm nav-cta-btn" id="navJoinBtn">
            <span>Join Community</span>
          </a>

          <!-- Mobile Hamburger Menu Button -->
          <button class="btn-icon mobile-menu-trigger" id="mobileMenuTrigger" title="Toggle Navigation Menu" aria-label="Open Navigation Menu">
            ${icon('menu', 22)}
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach search trigger
  nav.querySelector('#navSearchTrigger').addEventListener('click', openGlobalSearch);

  // Attach notification trigger
  nav.querySelector('#navNotifBtn').addEventListener('click', openNotificationCenter);

  // Attach theme toggle
  nav.querySelector('#navThemeToggle').addEventListener('click', () => {
    store.toggleTheme();
    const existingNav = document.querySelector('.navbar');
    if (existingNav) {
      existingNav.replaceWith(renderNavbar());
    }
  });

  // Persona dropdown toggle
  const personaBtn = nav.querySelector('#personaSelectBtn');
  const personaDropdown = nav.querySelector('#personaDropdown');
  if (personaBtn && personaDropdown) {
    personaBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = personaDropdown.style.display !== 'none';
      personaDropdown.style.display = isShowing ? 'none' : 'block';
      nav.querySelector('#navMoreMenu')?.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
      if (!personaBtn.contains(e.target) && !personaDropdown.contains(e.target)) {
        personaDropdown.style.display = 'none';
      }
    });
  }

  // Sign out button
  const navSignOutBtn = nav.querySelector('#navSignOutBtn');
  if (navSignOutBtn) {
    navSignOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      store.logout();
      showToast('Signed out successfully.', 'info');
      window.location.hash = '#login';
      const existingNav = document.querySelector('.navbar');
      if (existingNav) {
        existingNav.replaceWith(renderNavbar());
      }
    });
  }

  // "More" Dropdown Toggle
  const moreBtn = nav.querySelector('#navMoreBtn');
  const moreMenu = nav.querySelector('#navMoreMenu');
  if (moreBtn && moreMenu) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moreMenu.classList.toggle('show');
      if (personaDropdown) personaDropdown.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
      if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
        moreMenu.classList.remove('show');
      }
    });
  }

  // Desktop More Menu "Install App" button
  const navInstallBtn = nav.querySelector('#navInstallAppBtn');
  if (navInstallBtn) {
    navInstallBtn.addEventListener('click', () => {
      openAppInstallModal();
      nav.querySelector('#navMoreMenu')?.classList.remove('show');
    });
  }

  // Mobile Drawer Toggle logic mounted directly to document.body
  const { openDrawer } = setupMobileDrawer(currentUser, currentHash, inApp);
  const mobileMenuTrigger = nav.querySelector('#mobileMenuTrigger');
  if (mobileMenuTrigger) {
    mobileMenuTrigger.addEventListener('click', openDrawer);
  }

  return nav;
}

/**
 * Mounts the mobile offcanvas drawer directly into document.body
 * to completely eliminate containing-block bugs caused by navbar backdrop-filter/sticky.
 */
function setupMobileDrawer(currentUser, currentHash, inApp) {
  // Clean up any stale drawer/overlay
  document.getElementById('mobileDrawer')?.remove();
  document.getElementById('mobileDrawerOverlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'mobileDrawerOverlay';
  overlay.className = 'mobile-drawer-overlay';

  const drawer = document.createElement('div');
  drawer.id = 'mobileDrawer';
  drawer.className = 'mobile-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Mobile Navigation');

  drawer.innerHTML = `
    <div class="mobile-drawer-header">
      <div class="flex items-center gap-2">
        <div class="brand-icon" style="width: 32px; height: 32px;">
          ${icon('graduationCap', 18)}
        </div>
        <span style="font-weight: 800; font-family: var(--font-display); font-size: 1.15rem; color: var(--text-primary);">AlumniConnect</span>
      </div>
      <button class="btn-icon" id="mobileDrawerClose" title="Close menu" aria-label="Close Navigation Menu">
        ${icon('x', 20)}
      </button>
    </div>
    <div class="mobile-drawer-body">
      ${currentUser ? `
        <div style="padding: 0.75rem 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); margin-bottom: 1rem; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 0.75rem;">
          <img src="${currentUser.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="${currentUser.name}" />
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary);">${currentUser.name}</div>
            <div style="font-size: 0.72rem; color: var(--primary); font-family: monospace; font-weight: 700;">ID: ${currentUser.collegeId}</div>
          </div>
        </div>
      ` : ''}

      <div class="mobile-drawer-links">
        <a href="#home" class="mobile-drawer-link ${currentHash === '#home' || currentHash === '' ? 'active' : ''}">
          ${icon('globe', 18)} <span>Home</span>
        </a>
        <a href="#dashboard" class="mobile-drawer-link ${currentHash.startsWith('#dashboard') ? 'active' : ''}">
          ${icon('user', 18)} <span>My Dashboard</span>
        </a>
        <a href="#alumni" class="mobile-drawer-link ${currentHash.startsWith('#alumni') ? 'active' : ''}">
          ${icon('users', 18)} <span>Alumni Directory</span>
        </a>
        <a href="#events" class="mobile-drawer-link ${currentHash.startsWith('#events') ? 'active' : ''}">
          ${icon('calendar', 18)} <span>Events & Reunions</span>
        </a>
        <a href="#jobs" class="mobile-drawer-link ${currentHash.startsWith('#jobs') ? 'active' : ''}">
          ${icon('briefcase', 18)} <span>Job Board & Referrals</span>
        </a>
        <a href="#mentorship" class="mobile-drawer-link ${currentHash.startsWith('#mentorship') ? 'active' : ''}">
          ${icon('star', 18)} <span>Mentorship Hub</span>
        </a>
        <a href="#community" class="mobile-drawer-link ${currentHash.startsWith('#community') ? 'active' : ''}">
          ${icon('messageSquare', 18)} <span>Community Channels</span>
        </a>
        <a href="#stories" class="mobile-drawer-link ${currentHash.startsWith('#stories') ? 'active' : ''}">
          ${icon('sparkles', 18)} <span>Success Stories</span>
        </a>
        <a href="#chapters" class="mobile-drawer-link ${currentHash.startsWith('#chapters') ? 'active' : ''}">
          ${icon('mapPin', 18)} <span>Regional Chapters</span>
        </a>
        <a href="#donations" class="mobile-drawer-link ${currentHash.startsWith('#donations') ? 'active' : ''}">
          ${icon('heart', 18)} <span>Giving & Endowments</span>
        </a>
        <a href="#polls" class="mobile-drawer-link ${currentHash.startsWith('#polls') ? 'active' : ''}">
          ${icon('vote', 18)} <span>Community Polls</span>
        </a>
        <a href="#login" class="mobile-drawer-link ${currentHash.startsWith('#login') ? 'active' : ''}">
          ${icon('shield', 18)} <span>Sign In (College ID)</span>
        </a>
        <a href="#settings" class="mobile-drawer-link ${currentHash.startsWith('#settings') ? 'active' : ''}">
          ${icon('activity', 18)} <span>Account Settings</span>
        </a>
      </div>

      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.65rem;">
        ${!inApp ? `
          <button type="button" class="btn btn-secondary w-full" id="mobileDrawerInstallBtn" style="justify-content: center; gap: 0.5rem;">
            ${icon('smartphone', 18)} Download & Install App
          </button>
        ` : ''}
        <a href="#register" class="btn btn-primary w-full" style="justify-content: center;">
          Join Alumni Community
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  drawer.querySelector('#mobileDrawerClose')?.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.mobile-drawer-link, .mobile-drawer-body a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Mobile Drawer Install Button
  const mobileDrawerInstallBtn = drawer.querySelector('#mobileDrawerInstallBtn');
  if (mobileDrawerInstallBtn) {
    mobileDrawerInstallBtn.addEventListener('click', () => {
      closeDrawer();
      openAppInstallModal();
    });
  }

  // Handle ESC key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  return { openDrawer, closeDrawer };
}


