// Unified Member Dashboard for all authenticated students, alumni, faculty, and new members
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';

export function renderCommonDashboard() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2rem';
  container.style.paddingBottom = '5rem';

  const user = store.getCurrentUser();

  if (!user) {
    container.innerHTML = `
      <div class="card card-premium animate-fade-in" style="max-width: 540px; margin: 3rem auto; padding: 3rem 2rem; text-align: center; border-radius: var(--radius-xl);">
        <div class="brand-icon" style="width: 58px; height: 58px; margin: 0 auto 1.5rem; font-size: 1.5rem;">
          ${icon('shield', 30)}
        </div>
        <span class="section-tag" style="margin-bottom: 0.5rem; display: inline-block;">Authentication Required</span>
        <h2 style="font-size: 1.85rem; font-weight: 800; margin-bottom: 0.75rem; letter-spacing: -0.02em;">
          Sign in to Access Dashboard
        </h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem; line-height: 1.6;">
          Please sign in with your official university College ID / Roll Number to access your common member dashboard, network connections, and digital campus pass.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="#login" class="btn btn-primary btn-lg" style="box-shadow: 0 4px 16px var(--primary-glow); min-width: 180px; justify-content: center;">
            ${icon('logOut', 18)} Sign In with College ID
          </a>
          <a href="#register" class="btn btn-secondary btn-lg" style="min-width: 180px; justify-content: center;">
            Register Account
          </a>
        </div>
      </div>
    `;
    return container;
  }

  const role = (user.role || 'student').toLowerCase();
  const isPending = user.status === 'PENDING_VERIFICATION';

  // Metrics from store
  const alumniCount = store.state.alumni.filter(a => a.status === 'APPROVED').length;
  const jobsCount = store.state.jobs.length;
  const eventsCount = store.state.events.length;
  const myConnectionsCount = store.state.connections.length || 0;

  // Format greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  container.innerHTML = `
    <!-- Top Welcome Banner -->
    <div class="card card-premium dashboard-welcome-card">
      <div class="dashboard-welcome-flex">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div style="position: relative; flex-shrink: 0;">
            <img 
              src="${user.avatar}" 
              alt="${user.name}" 
              style="width: 76px; height: 76px; border-radius: 50%; object-fit: cover; border: 3px solid var(--bg-card); box-shadow: var(--shadow-md);" 
            />
            <div style="position: absolute; bottom: 0; right: 0; width: 22px; height: 22px; border-radius: 50%; background: ${isPending ? 'var(--accent-amber)' : 'var(--accent-emerald)'}; border: 2px solid var(--bg-card); display: flex; align-items: center; justify-content: center; color: #fff;">
              ${isPending ? icon('sparkles', 12) : icon('check', 12)}
            </div>
          </div>
          <div style="min-width: 0;">
            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
              <span class="badge ${role === 'admin' ? 'badge-danger' : role === 'alumni' ? 'badge-primary' : 'badge-success'}" style="text-transform: uppercase; font-weight: 700; font-size: 0.725rem;">
                ${role}
              </span>
              <span class="badge" style="background: var(--bg-card-subtle); border: 1px solid var(--border-color); font-family: monospace; font-size: 0.78rem; font-weight: 700; color: var(--text-primary); letter-spacing: 0.05em;">
                ${icon('shield', 13)} ID: ${user.collegeId || 'N/A'}
              </span>
              ${isPending ? `
                <span class="badge badge-warning" style="font-size: 0.725rem;">
                  Pending Records Review
                </span>
              ` : `
                <span class="badge badge-success" style="font-size: 0.725rem;">
                  Verified Member
                </span>
              `}
            </div>
            <h1 style="font-size: 1.85rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.25rem; word-break: break-word;">
              ${greeting}, ${user.name}!
            </h1>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
              ${user.department || 'Computer Science & Engineering'} • Class of ${user.gradYear || 2025}
            </p>
          </div>
        </div>

        <div class="dashboard-welcome-actions" style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <a href="#settings" class="btn btn-secondary btn-sm">
            ${icon('activity', 15)} Edit Profile
          </a>
          <a href="#messages" class="btn btn-primary btn-sm">
            ${icon('messageSquare', 15)} My Messages
          </a>
          <button class="btn btn-ghost btn-sm" id="logoutBtn" title="Sign out of this session">
            ${icon('logOut', 16)} Sign Out
          </button>
        </div>
      </div>
    </div>

    <!-- Onboarding / Pending Notice Banner -->
    ${isPending ? `
      <div class="card" style="margin-bottom: 2rem; padding: 1.25rem 1.5rem; background: rgba(245, 158, 11, 0.08); border: 1px solid hsla(38, 92%, 50%, 0.3); border-radius: var(--radius-lg); display: flex; align-items: flex-start; gap: 1rem;">
        <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--accent-amber); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          ${icon('shield', 18)}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.2rem;">
            Profile Registered with College ID: <code style="background: var(--bg-card); padding: 0.15rem 0.4rem; border-radius: var(--radius-xs);">${user.collegeId}</code>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
            Welcome to the community! Your registration record has been received. University administration will cross-reference your College ID with graduation archives. You have unrestricted access to explore the network, join events, and browse job referrals below.
          </p>
        </div>
        ${role === 'admin' ? `
          <a href="#dashboard/admin" class="btn btn-warning btn-sm" style="flex-shrink: 0;">
            Review Queue
          </a>
        ` : ''}
      </div>
    ` : ''}

    <!-- 4 KPI Overview Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
      <div class="card card-premium" style="padding: 1.35rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span style="font-size: 0.825rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">My Network</span>
          <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
            ${icon('users', 18)}
          </div>
        </div>
        <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-display); color: var(--primary); line-height: 1;">
          ${myConnectionsCount}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.4rem;">
          Connected classmates & mentors
        </div>
      </div>

      <div class="card card-premium" style="padding: 1.35rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span style="font-size: 0.825rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Active Opportunities</span>
          <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center;">
            ${icon('briefcase', 18)}
          </div>
        </div>
        <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-display); color: var(--accent-emerald); line-height: 1;">
          ${jobsCount}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.4rem;">
          Verified alumni referrals & roles
        </div>
      </div>

      <div class="card card-premium" style="padding: 1.35rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span style="font-size: 0.825rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Upcoming Events</span>
          <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: rgba(14, 165, 233, 0.1); color: var(--accent-sky); display: flex; align-items: center; justify-content: center;">
            ${icon('calendar', 18)}
          </div>
        </div>
        <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-display); color: var(--accent-sky); line-height: 1;">
          ${eventsCount}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.4rem;">
          Reunions, webinars & summits
        </div>
      </div>

      <div class="card card-premium" style="padding: 1.35rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span style="font-size: 0.825rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">Alumni Community</span>
          <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: rgba(244, 63, 94, 0.1); color: var(--accent-rose); display: flex; align-items: center; justify-content: center;">
            ${icon('graduationCap', 18)}
          </div>
        </div>
        <div style="font-size: 2rem; font-weight: 800; font-family: var(--font-display); color: var(--accent-rose); line-height: 1;">
          ${alumniCount}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.4rem;">
          Registered graduates worldwide
        </div>
      </div>
    </div>

    <!-- Quick Action Launchpad -->
    <div style="margin-bottom: 2.5rem;">
      <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        ${icon('sparkles', 18)} Quick Action Hub
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <a href="#alumni" class="card card-hover" style="padding: 1.1rem; display: flex; align-items: center; gap: 0.85rem; text-decoration: none;">
          <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${icon('search', 20)}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Browse Alumni</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Find seniors & peers</div>
          </div>
        </a>

        <a href="#jobs" class="card card-hover" style="padding: 1.1rem; display: flex; align-items: center; gap: 0.85rem; text-decoration: none;">
          <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${icon('briefcase', 20)}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Job Board</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Ask for internal referrals</div>
          </div>
        </a>

        <a href="#mentorship" class="card card-hover" style="padding: 1.1rem; display: flex; align-items: center; gap: 0.85rem; text-decoration: none;">
          <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${icon('star', 20)}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Mentorship</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Book 1-on-1 guidance</div>
          </div>
        </a>

        <a href="#community" class="card card-hover" style="padding: 1.1rem; display: flex; align-items: center; gap: 0.85rem; text-decoration: none;">
          <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: rgba(139, 92, 246, 0.1); color: var(--secondary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${icon('messageSquare', 20)}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Community Hub</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Discussion channels</div>
          </div>
        </a>
      </div>
    </div>

    <!-- 2 Column Layout: Digital College ID Card & Live Community Activity -->
    <div class="dashboard-main-grid">
      <!-- Column 1: Interactive Digital College ID Pass -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0;">
            Digital Campus Pass
          </h3>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Verified Credential</span>
        </div>

        <!-- ID Card Component -->
        <div class="card card-premium" style="padding: 1.75rem; border-radius: var(--radius-xl); background: radial-gradient(circle at top right, hsla(234, 85%, 65%, 0.08), transparent 70%), var(--bg-card); border: 2px solid var(--primary-border); position: relative; overflow: hidden;">
          <!-- Top Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <div class="brand-icon" style="width: 32px; height: 32px;">
                ${icon('graduationCap', 16)}
              </div>
              <div>
                <div style="font-size: 0.85rem; font-weight: 800; font-family: var(--font-display);">University Institute</div>
                <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Official Member ID</div>
              </div>
            </div>
            <span class="badge ${role === 'admin' ? 'badge-danger' : role === 'alumni' ? 'badge-primary' : 'badge-success'}" style="text-transform: uppercase; font-size: 0.7rem;">
              ${role}
            </span>
          </div>

          <!-- Body -->
          <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.25rem;">
            <img 
              src="${user.avatar}" 
              alt="${user.name}" 
              style="width: 68px; height: 68px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--border-color);" 
            />
            <div style="flex: 1;">
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">${user.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">${user.department || 'Computer Science & Engineering'}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">Class of ${user.gradYear || 2025}</div>
            </div>
          </div>

          <!-- Official College ID Monospace Highlight -->
          <div style="background: var(--bg-card-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">College ID / Roll No</div>
              <div style="font-family: monospace; font-size: 1.05rem; font-weight: 800; color: var(--primary); letter-spacing: 0.06em;">
                ${user.collegeId || 'COLLEGE-ID'}
              </div>
            </div>
            <span class="badge badge-success" style="font-size: 0.65rem;">
              VALID PASS
            </span>
          </div>

          <!-- Barcode Graphic Simulation -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem; padding-top: 0.5rem; opacity: 0.75;">
            <div style="display: flex; gap: 2px; height: 32px; width: 100%; justify-content: center; align-items: stretch;">
              ${Array.from({ length: 44 }).map((_, i) => `
                <div style="width: ${i % 3 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '2px'}; background: var(--text-primary);"></div>
              `).join('')}
            </div>
            <span style="font-family: monospace; font-size: 0.65rem; letter-spacing: 0.2em; color: var(--text-muted);">
              ${user.collegeId || 'COLLEGE-ID'}
            </span>
          </div>
        </div>
      </div>

      <!-- Column 2: Live Community Feed & Recent Opportunities -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0;">
            Campus Community Activity
          </h3>
          <a href="#community" style="font-size: 0.8rem; font-weight: 600; color: var(--primary);">
            View all posts →
          </a>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${(store.state.posts || []).slice(0, 3).map(post => `
            <div class="card" style="padding: 1.25rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
                <div style="display: flex; align-items: center; gap: 0.65rem;">
                  <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                  <div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">${post.authorName}</div>
                    <div style="font-size: 0.725rem; color: var(--text-muted);">${post.timestamp || 'Recent'} • in <span style="color: var(--primary); font-weight: 600;">#${post.channel || 'general'}</span></div>
                  </div>
                </div>
                <span class="badge badge-neutral" style="font-size: 0.7rem;">Discussion</span>
              </div>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                ${post.content}
              </p>
              <div style="display: flex; align-items: center; gap: 1.25rem; margin-top: 0.75rem; font-size: 0.75rem; color: var(--text-muted);">
                <span style="display: flex; align-items: center; gap: 0.35rem;">
                  ${icon('heart', 14)} ${post.likes || 12} Likes
                </span>
                <span style="display: flex; align-items: center; gap: 0.35rem;">
                  ${icon('messageSquare', 14)} ${post.comments?.length || 4} Replies
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach Sign Out handler
  const logoutBtn = container.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      showToast('Signed out successfully.', 'info');
      window.location.hash = '#login';
    });
  }

  return container;
}
