// Student Dashboard matching Section 9 & 29 of alumini.md
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { openAlumniProfile } from './alumniProfileModal.js';
import { showToast } from '../components/toast.js';
import { renderCommonDashboard } from './commonDashboard.js';

export function renderStudentDashboard() {
  if (!store.getCurrentUser()) {
    return renderCommonDashboard();
  }

  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2rem';
  container.style.paddingBottom = '4rem';

  const persona = store.getCurrentPersona();
  const recommendedMentors = store.state.alumni.filter(a => a.availableForMentorship).slice(0, 3);
  const recommendedJobs = store.state.jobs.slice(0, 3);
  const myEvents = store.state.events.filter(e => e.isRegistered).slice(0, 2);
  const myMentorshipRequests = store.state.mentorshipRequests;

  container.innerHTML = `
    <!-- Greeting & Profile Completeness Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <span class="badge badge-student">Student Portal</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${persona.department}</span>
        </div>
        <h1 style="font-size: 2.2rem; font-weight: 800;">Welcome back, ${persona.name}!</h1>
        <p style="color: var(--text-secondary); margin-top: 0.25rem;">
          Discover career opportunities, prepare for placements, and learn directly from university alumni.
        </p>
      </div>

      <!-- Section 29: Profile Completion Widget -->
      <div class="card dashboard-completion-card" style="padding: 1rem 1.25rem; background: var(--bg-card); border-radius: var(--radius-lg); border-color: var(--primary-border);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">Profile 85% Complete</span>
          <span class="badge badge-primary">Good</span>
        </div>
        <div class="fund-progress-bar" style="height: 6px; margin: 0.4rem 0;">
          <div class="fund-progress-fill" style="width: 85%;"></div>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.6rem;">
          Missing: Add GitHub portfolio link & upload latest resume.
        </div>
        <a href="#settings" class="btn btn-outline-primary btn-sm w-full" style="font-size: 0.78rem; padding: 0.35rem 0.6rem;">
          Complete Profile
        </a>
      </div>
    </div>

    <!-- Quick Actions Row -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
      <a href="#alumni" class="card card-hover" style="padding: 1.2rem; text-align: center; border-radius: var(--radius-lg); text-decoration: none;">
        <div style="width: 44px; height: 44px; margin: 0 auto 0.6rem; border-radius: var(--radius-md); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
          ${icon('users', 22)}
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Find Alumni</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">5,000+ graduates</div>
      </a>

      <a href="#mentorship" class="card card-hover" style="padding: 1.2rem; text-align: center; border-radius: var(--radius-lg); text-decoration: none;">
        <div style="width: 44px; height: 44px; margin: 0 auto 0.6rem; border-radius: var(--radius-md); background: var(--accent-amber-light); color: var(--accent-amber); display: flex; align-items: center; justify-content: center;">
          ${icon('sparkles', 22)}
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Find Mentor</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">1-on-1 coaching</div>
      </a>

      <a href="#jobs" class="card card-hover" style="padding: 1.2rem; text-align: center; border-radius: var(--radius-lg); text-decoration: none;">
        <div style="width: 44px; height: 44px; margin: 0 auto 0.6rem; border-radius: var(--radius-md); background: var(--accent-emerald-light); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center;">
          ${icon('briefcase', 22)}
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Explore Jobs</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">Alumni referrals</div>
      </a>

      <a href="#events" class="card card-hover" style="padding: 1.2rem; text-align: center; border-radius: var(--radius-lg); text-decoration: none;">
        <div style="width: 44px; height: 44px; margin: 0 auto 0.6rem; border-radius: var(--radius-md); background: var(--accent-rose-light); color: var(--accent-rose); display: flex; align-items: center; justify-content: center;">
          ${icon('calendar', 22)}
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Campus Events</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">Hackathons & talks</div>
      </a>

      <a href="#community" class="card card-hover" style="padding: 1.2rem; text-align: center; border-radius: var(--radius-lg); text-decoration: none;">
        <div style="width: 44px; height: 44px; margin: 0 auto 0.6rem; border-radius: var(--radius-md); background: var(--accent-sky-light); color: var(--accent-sky); display: flex; align-items: center; justify-content: center;">
          ${icon('messageSquare', 22)}
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Community</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">Discussions & posts</div>
      </a>
    </div>

    <!-- Main Grid: Recommended Mentors & Jobs -->
    <div class="grid grid-cols-2 gap-8" style="margin-bottom: 2.5rem;">
      <!-- Column 1: Recommended Mentors -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.35rem; font-weight: 700;">Recommended Mentors</h2>
          <a href="#mentorship" style="font-size: 0.85rem; font-weight: 600;">View All</a>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${recommendedMentors.length === 0 ? `
            <div class="card" style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); border: 1.5px dashed var(--border-color); background: var(--bg-card-subtle);">
              No alumni mentors registered yet. Check the <a href="#alumni" style="color: var(--primary); font-weight: 600;">Alumni Directory</a>.
            </div>
          ` : recommendedMentors.map(m => `
            <div class="card" style="padding: 1.15rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
              <div style="display: flex; gap: 0.85rem; align-items: center;">
                <img src="${m.avatar}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem;">${m.name}</div>
                  <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">${m.role} @ ${m.company}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">Class of ${m.gradYear} · ${m.rating} ★ (${m.menteesCount}+ mentees)</div>
                </div>
              </div>
              <button class="btn btn-outline-primary btn-sm std-view-mentor" data-id="${m.id}">
                View Profile
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Column 2: Recommended Opportunities -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.35rem; font-weight: 700;">Recommended Jobs & Referrals</h2>
          <a href="#jobs" style="font-size: 0.85rem; font-weight: 600;">View All</a>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${recommendedJobs.length === 0 ? `
            <div class="card" style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); border: 1.5px dashed var(--border-color); background: var(--bg-card-subtle);">
              No career opportunities posted yet. View all on the <a href="#jobs" style="color: var(--primary); font-weight: 600;">Job Board</a>.
            </div>
          ` : recommendedJobs.map(j => `
            <div class="card" style="padding: 1.15rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.45rem;">
                  <span class="badge ${j.workType === 'Internship' ? 'badge-warning' : 'badge-primary'}" style="font-size: 0.7rem;">${j.workType}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${j.postedAt}</span>
                </div>
                <div style="font-weight: 700; font-size: 0.95rem; margin-top: 0.25rem;">${j.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${j.company} · ${j.location}</div>
                <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600; margin-top: 0.2rem;">
                  ${icon('shield', 11)} ${j.postedBy}
                </div>
              </div>
              <a href="#jobs" class="btn btn-secondary btn-sm">
                Apply / Referral
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Active Mentorship Requests & Registered Events Split -->
    <div class="grid grid-cols-2 gap-8">
      <!-- Mentorship Status -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.35rem; font-weight: 700;">My Mentorship Requests</h2>
          <a href="#mentorship" style="font-size: 0.85rem; font-weight: 600;">New Request</a>
        </div>

        ${myMentorshipRequests.length === 0 ? `
          <div class="card" style="padding: 2rem; text-align: center; color: var(--text-muted);">
            No pending mentorship requests. Reach out to an alumni mentor!
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${myMentorshipRequests.map(r => `
              <div class="card" style="padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <strong style="font-size: 0.9rem;">Mentor: ${r.mentorName}</strong>
                    <span class="badge ${r.status === 'ACCEPTED' ? 'badge-success' : 'badge-warning'}">${r.status}</span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Topic: ${r.topic}</div>
                  <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.35rem; font-style: italic;">"${r.message.slice(0, 80)}..."</p>
                </div>
                ${r.status === 'ACCEPTED' ? `
                  <a href="#messages" class="btn btn-primary btn-sm">
                    ${icon('messageSquare', 14)} Chat
                  </a>
                ` : `
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${r.date}</span>
                `}
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Registered Events -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.35rem; font-weight: 700;">My Upcoming Events</h2>
          <a href="#events" style="font-size: 0.85rem; font-weight: 600;">Browse All</a>
        </div>

        ${myEvents.length === 0 ? `
          <div class="card" style="padding: 2rem; text-align: center; color: var(--text-muted);">
            You haven't registered for any events yet. Check out the upcoming Hackathons and Reunions!
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${myEvents.map(e => `
              <div class="card" style="padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span class="badge badge-primary" style="font-size: 0.7rem; margin-bottom: 0.25rem;">${e.category}</span>
                  <div style="font-weight: 700; font-size: 0.95rem;">${e.title}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
                    ${icon('calendar', 12)} ${e.date} · ${e.location}
                  </div>
                </div>
                <span class="badge badge-success">Registered</span>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  // Attach handlers
  container.querySelectorAll('.std-view-mentor').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openAlumniProfile(e.currentTarget.getAttribute('data-id'));
    });
  });

  return container;
}
