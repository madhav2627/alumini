// Mobile Bottom Navigation Bar
import { icon } from './icons.js';
import { store } from '../data/store.js';

export function renderMobileNav() {
  const currentRole = store.state.currentRole;
  const currentHash = window.location.hash || '#home';

  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.innerHTML = `
    <ul class="mobile-nav-items">
      <li>
        <a href="#home" class="mobile-nav-link ${currentHash === '#home' || currentHash === '' ? 'active' : ''}">
          ${icon('globe', 18)}
          <span>Home</span>
        </a>
      </li>
      <li>
        <a href="#alumni" class="mobile-nav-link ${currentHash.startsWith('#alumni') ? 'active' : ''}">
          ${icon('users', 18)}
          <span>Alumni</span>
        </a>
      </li>
      <li>
        <a href="#jobs" class="mobile-nav-link ${currentHash.startsWith('#jobs') ? 'active' : ''}">
          ${icon('briefcase', 18)}
          <span>Jobs</span>
        </a>
      </li>
      <li>
        <a href="#events" class="mobile-nav-link ${currentHash.startsWith('#events') ? 'active' : ''}">
          ${icon('calendar', 18)}
          <span>Events</span>
        </a>
      </li>
      <li>
        <a href="#dashboard" class="mobile-nav-link ${currentHash.startsWith('#dashboard') ? 'active' : ''}">
          ${icon('user', 18)}
          <span>Dashboard</span>
        </a>
      </li>
    </ul>
  `;
  return nav;
}
