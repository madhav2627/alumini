// Mentorship Program Hub matching Section 19 of alumini.md
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { openAlumniProfile, openMentorshipRequestModal } from './alumniProfileModal.js';
import { showToast } from '../components/toast.js';

export function renderMentorshipPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  let searchQuery = '';
  let selectedTopic = 'All';

  const allMentors = store.state.alumni.filter(a => a.availableForMentorship);
  const topics = ['All', 'Career Guidance', 'Resume Critique', 'System Design', 'Mock Interview', 'AI & ML'];

  function renderView() {
    let filtered = allMentors;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
      );
    }

    container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="section-tag">Alumni Mentorship</span>
          <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Find an Alumni Mentor</h1>
          <p style="color: var(--text-secondary); max-width: 680px;">
            Get personalized career advice, technical interview coaching, and portfolio feedback directly from alumni working in your target industry.
          </p>
        </div>

        <div class="card" style="padding: 0.75rem 1.25rem; border-radius: var(--radius-lg); background: var(--bg-card); display: flex; align-items: center; gap: 0.75rem;">
          <div style="color: var(--accent-amber);">${icon('sparkles', 24)}</div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${allMentors.length} Active Mentors</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Free for all university students</div>
          </div>
        </div>
      </div>

      <!-- Search & Topics Bar -->
      <div class="card" style="padding: 1.25rem 1.5rem; border-radius: var(--radius-xl); margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <div class="search-bar" style="flex: 1; min-width: 0; width: 100%;">
            ${icon('search', 18, 'text-muted')}
            <input type="text" id="mentorSearchInput" value="${searchQuery}" placeholder="Search mentor by name, company (Google, Tesla...), or role..." />
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${topics.map(t => `
              <button class="tab-btn ${selectedTopic === t ? 'active' : ''} mentor-topic-pill" data-topic="${t}">
                ${t}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Mentors Grid -->
      <div class="grid grid-cols-3 gap-6" id="mentorsGrid">
        ${filtered.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="color: var(--accent-amber); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('sparkles', 54)}
            </div>
            <h3 style="margin-top: 0.5rem; font-size: 1.35rem; font-weight: 800;">No Mentors Available Yet</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 500px; margin-left: auto; margin-right: auto;">
              Are you an alumnus? Register your profile and toggle "Available for Mentorship" to guide current university students.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.25rem;">
              <a href="#register" class="btn btn-primary">
                ${icon('plus', 16)} Register as Mentor
              </a>
              <a href="#alumni" class="btn btn-secondary">
                ${icon('users', 16)} Explore Directory
              </a>
            </div>
          </div>
        ` : filtered.map(m => `
          <div class="card card-hover" style="padding: 1.5rem; display: flex; flex-direction: column; border-radius: var(--radius-xl);">
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
              <img src="${m.avatar}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);" />
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">${m.name}</h3>
                <div style="font-size: 0.825rem; font-weight: 600; color: var(--primary);">${m.role}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${m.company} · Batch '${String(m.gradYear).slice(2)}</div>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
              <span>${icon('star', 13)} <strong style="color: var(--text-primary);">${m.rating || '5.0'}</strong> rating</span>
              <span>·</span>
              <span>${m.menteesCount || 8}+ mentees guided</span>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem; flex: 1;">
              "${m.bio || 'Passionate about engineering leadership, distributed computing, and coaching ambitious juniors.'}"
            </p>

            <div class="skills-row" style="margin-bottom: 1.25rem;">
              ${(m.skills || []).slice(0, 3).map(s => `<span class="skill-chip">${s}</span>`).join('')}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-light);">
              <button class="btn btn-secondary btn-sm mentor-card-profile" data-id="${m.id}">
                View Profile
              </button>
              <button class="btn btn-primary btn-sm mentor-card-req" data-id="${m.id}">
                ${icon('sparkles', 13)} Request
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Hook listeners
    container.querySelector('#mentorSearchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderView();
    });

    container.querySelectorAll('.mentor-topic-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedTopic = e.currentTarget.getAttribute('data-topic');
        renderView();
      });
    });

    container.querySelectorAll('.mentor-card-profile').forEach(btn => {
      btn.addEventListener('click', (e) => {
        openAlumniProfile(e.currentTarget.getAttribute('data-id'));
      });
    });

    container.querySelectorAll('.mentor-card-req').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const alum = store.getAlumniById(e.currentTarget.getAttribute('data-id'));
        openMentorshipRequestModal(alum);
      });
    });
  }

  renderView();
  return container;
}
