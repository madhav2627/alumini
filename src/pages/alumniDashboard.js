// Alumni Dashboard matching Section 10 of alumini.md
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { renderCommonDashboard } from './commonDashboard.js';

export function renderAlumniDashboard() {
  if (!store.getCurrentUser()) {
    return renderCommonDashboard();
  }

  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2rem';
  container.style.paddingBottom = '4rem';

  const persona = store.getCurrentPersona();
  const registeredAlum = store.state.alumni.find(a => a.name === persona.name) || store.state.alumni[0];
  const alum = registeredAlum || {
    id: persona.id,
    name: persona.name,
    role: persona.title || persona.role,
    company: 'University Alumni Network',
    gradYear: persona.gradYear || 2022,
    department: persona.department || 'Computer Science & Engineering',
    location: persona.location || 'Campus City',
    avatar: persona.avatar,
    availableForMentorship: true,
    status: 'APPROVED'
  };
  const requests = store.state.mentorshipRequests;
  const myPostedJobs = store.state.jobs.filter(j => j.postedBy && (j.postedBy.includes(alum.name) || j.company === alum.company));
  const myEvents = store.state.events.filter(e => e.isRegistered);

  function renderView() {
    container.innerHTML = `
      <!-- Header with Profile Summary -->
      <div class="card" style="padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 2rem; background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-subtle) 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div style="display: flex; gap: 1.25rem; align-items: center;">
            <div style="position: relative;">
              <img src="${alum.avatar}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary);" />
              <span style="position: absolute; bottom: 0; right: 0; width: 16px; height: 16px; background: var(--accent-emerald); border-radius: 50%; border: 2px solid #fff;"></span>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <h1 style="font-size: 1.85rem; font-weight: 800;">${alum.name}</h1>
                <span class="badge badge-alumni">${icon('shield', 12)} Verified Alum</span>
              </div>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--primary); margin-top: 0.15rem;">
                ${alum.role} at ${alum.company}
              </p>
              <div style="font-size: 0.825rem; color: var(--text-muted); margin-top: 0.25rem;">
                Class of ${alum.gradYear} · Department of ${alum.department} · ${alum.location}
              </div>
            </div>
          </div>

          <!-- Mentorship Availability Switch -->
          <div class="card" style="padding: 0.85rem 1.25rem; border-radius: var(--radius-lg); background: var(--bg-card); display: flex; align-items: center; gap: 1rem;">
            <div>
              <div style="font-weight: 700; font-size: 0.875rem;">Mentorship Status</div>
              <div style="font-size: 0.75rem; color: ${alum.availableForMentorship ? 'var(--accent-emerald)' : 'var(--text-muted)'}; font-weight: 600;">
                ${alum.availableForMentorship ? '● Accepting Mentees' : '○ Paused'}
              </div>
            </div>
            <button id="toggleMentorStatusBtn" class="btn ${alum.availableForMentorship ? 'btn-secondary' : 'btn-primary'} btn-sm">
              ${alum.availableForMentorship ? 'Pause' : 'Activate'}
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Statistics Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
        <div class="card stat-card" style="border-left: 4px solid var(--primary);">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">PROFILE VIEWS</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin: 0.25rem 0;">${store.state.alumni.length > 0 ? 1 : 0}</div>
          <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;">Live profile</div>
        </div>

        <div class="card stat-card" style="border-left: 4px solid var(--secondary);">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">ALUMNI NETWORK</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin: 0.25rem 0;">${store.state.connections.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Verified contacts</div>
        </div>

        <div class="card stat-card" style="border-left: 4px solid var(--accent-amber);">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">MENTORSHIP REQS</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-amber); margin: 0.25rem 0;">${requests.filter(r => r.status === 'PENDING').length}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Awaiting your review</div>
        </div>

        <div class="card stat-card" style="border-left: 4px solid var(--accent-rose);">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">EVENTS ATTENDING</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-rose); margin: 0.25rem 0;">${myEvents.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Reunions & Meets</div>
        </div>

        <div class="card stat-card" style="border-left: 4px solid var(--accent-emerald);">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">CAREER REFERRALS</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-emerald); margin: 0.25rem 0;">${myPostedJobs.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Active job posts</div>
        </div>
      </div>

      <!-- Quick Actions Toolbar -->
      <div style="display: flex; gap: 0.75rem; margin-bottom: 2.5rem; flex-wrap: wrap;">
        <button id="alumniPostJobBtn" class="btn btn-primary btn-sm">
          ${icon('plus', 14)} Post Job Referral
        </button>
        <button id="alumniCreateEventBtn" class="btn btn-secondary btn-sm">
          ${icon('calendar', 14)} Propose Reunion / Event
        </button>
        <a href="#community" class="btn btn-secondary btn-sm">
          ${icon('messageSquare', 14)} Post Update on Feed
        </a>
        <a href="#stories" class="btn btn-secondary btn-sm">
          ${icon('award', 14)} Share Career Story
        </a>
      </div>

      <!-- Main Columns: Mentorship Requests Review & My Posted Opportunities -->
      <div class="grid grid-cols-2 gap-8">
        <!-- Mentorship Requests Section -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700;">Student Mentorship Requests</h2>
            <span class="badge badge-neutral">${requests.length} Total</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${requests.length === 0 ? `
              <div class="card" style="padding: 2.5rem 1.5rem; text-align: center; border: 1.5px dashed var(--border-color); background: var(--bg-card-subtle);">
                <div style="color: var(--accent-amber); margin-bottom: 0.5rem; display: flex; justify-content: center;">
                  ${icon('sparkles', 36)}
                </div>
                <h4 style="font-weight: 700; font-size: 1.05rem;">No Mentorship Requests Yet</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                  When students submit coaching requests to you, they will appear here for your review.
                </p>
              </div>
            ` : requests.map(req => `
              <div class="card" style="padding: 1.25rem; border-radius: var(--radius-lg);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <img src="${req.studentAvatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />
                    <div>
                      <div style="font-weight: 700; font-size: 0.95rem;">${req.studentName}</div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">${req.date} · Topic: <strong style="color: var(--primary);">${req.topic}</strong></div>
                    </div>
                  </div>
                  <span class="badge ${req.status === 'ACCEPTED' ? 'badge-success' : req.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}">
                    ${req.status}
                  </span>
                </div>

                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; background: var(--bg-card-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                  "${req.message}"
                </p>

                ${req.status === 'PENDING' ? `
                  <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button class="btn btn-secondary btn-sm req-reject-btn" data-id="${req.id}" style="color: var(--accent-rose);">
                      Decline
                    </button>
                    <button class="btn btn-primary btn-sm req-accept-btn" data-id="${req.id}">
                      ${icon('check', 14)} Accept Mentee
                    </button>
                  </div>
                ` : req.status === 'ACCEPTED' ? `
                  <div style="display: flex; justify-content: flex-end;">
                    <a href="#messages" class="btn btn-primary btn-sm">
                      ${icon('messageSquare', 14)} Open Chat with ${req.studentName.split(' ')[0]}
                    </a>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- My Posted Opportunities & Events -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700;">My Career Postings & Referrals</h2>
            <button id="postJobQuickBtn" class="btn btn-ghost btn-sm" style="color: var(--primary); font-size: 0.8rem;">
              + Post New
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
            ${myPostedJobs.length === 0 ? `
              <div class="card" style="padding: 2rem; text-align: center; color: var(--text-muted);">
                You haven't posted any jobs or referrals yet. Help a junior get hired!
              </div>
            ` : myPostedJobs.map(job => `
              <div class="card" style="padding: 1.15rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <span class="badge badge-primary">${job.workType}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${job.postedAt}</span>
                  </div>
                  <div style="font-weight: 700; font-size: 0.95rem; margin-top: 0.3rem;">${job.title}</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${job.company} · ${job.location}</div>
                </div>
                <span class="badge badge-success">Active & Receiving Applications</span>
              </div>
            `).join('')}
          </div>

          <!-- My Events -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h2 style="font-size: 1.35rem; font-weight: 700;">My Registered Events</h2>
            <a href="#events" style="font-size: 0.85rem; font-weight: 600;">Browse All</a>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${myEvents.map(e => `
              <div class="card" style="padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span class="badge badge-neutral" style="font-size: 0.7rem;">${e.category}</span>
                  <div style="font-weight: 700; font-size: 0.95rem; margin-top: 0.2rem;">${e.title}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${icon('calendar', 12)} ${e.date} · ${e.location}</div>
                </div>
                <a href="#events" class="btn btn-secondary btn-sm">View</a>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Hook listeners
    container.querySelector('#toggleMentorStatusBtn').addEventListener('click', () => {
      alum.availableForMentorship = !alum.availableForMentorship;
      store.saveState();
      showToast(alum.availableForMentorship ? 'Mentorship status: ACTIVE' : 'Mentorship status: PAUSED', 'info');
      renderView();
    });

    // Accept / Reject Mentorship
    container.querySelectorAll('.req-accept-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.updateMentorshipStatus(id, 'ACCEPTED');
        showToast('Mentorship accepted! You can now chat in messages.', 'success');
        renderView();
      });
    });

    container.querySelectorAll('.req-reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.updateMentorshipStatus(id, 'REJECTED');
        showToast('Mentorship declined.', 'info');
        renderView();
      });
    });

    // Post job action
    const postJobHandlers = [container.querySelector('#alumniPostJobBtn'), container.querySelector('#postJobQuickBtn')];
    postJobHandlers.forEach(b => {
      if (b) {
        b.addEventListener('click', openPostJobModal);
      }
    });

    // Propose event action
    const createEvtBtn = container.querySelector('#alumniCreateEventBtn');
    if (createEvtBtn) {
      createEvtBtn.addEventListener('click', openCreateEventModal);
    }
  }

  function openPostJobModal() {
    const content = `
      <form id="newJobForm">
        <div class="form-group">
          <label class="form-label">Job Title *</label>
          <input type="text" class="form-input" id="postJobTitle" placeholder="e.g. Senior Machine Learning Engineer" required />
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Company Name *</label>
            <input type="text" class="form-input" id="postJobCompany" value="${alum.company}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Location *</label>
            <input type="text" class="form-input" id="postJobLocation" value="Remote / San Francisco, CA" required />
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Employment Type</label>
            <select class="form-select" id="postJobType">
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Compensation / Salary</label>
            <input type="text" class="form-input" id="postJobSalary" placeholder="e.g. $140,000 - $185,000" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Key Skills (comma-separated)</label>
          <input type="text" class="form-input" id="postJobSkills" placeholder="Python, PyTorch, Kubernetes, Microservices" />
        </div>
        <div class="form-group">
          <label class="form-label">Job Overview & Referral Note *</label>
          <textarea class="form-textarea" id="postJobDesc" placeholder="Describe the role responsibilities and how university students can prepare to be referred..." required></textarea>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
          <button type="button" class="btn btn-secondary" id="jobCancelBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">Publish Opportunity</button>
        </div>
      </form>
    `;

    const modal = openModal({
      title: 'Post New Opportunity / Referral',
      contentHtml: content,
      size: 'md'
    });

    modal.querySelector('#jobCancelBtn').addEventListener('click', closeModal);
    modal.querySelector('#newJobForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = modal.querySelector('#postJobTitle').value;
      const company = modal.querySelector('#postJobCompany').value;
      const location = modal.querySelector('#postJobLocation').value;
      const workType = modal.querySelector('#postJobType').value;
      const salary = modal.querySelector('#postJobSalary').value || 'Competitive';
      const skills = modal.querySelector('#postJobSkills').value.split(',').map(s => s.trim()).filter(Boolean);
      const desc = modal.querySelector('#postJobDesc').value;

      store.postJob({ title, company, location, workType, salary, skills, description: desc });
      closeModal();
      showToast('Career opportunity published to the portal!', 'success');
      renderView();
    });
  }

  function openCreateEventModal() {
    const content = `
      <form id="newEventForm">
        <div class="form-group">
          <label class="form-label">Event Title *</label>
          <input type="text" class="form-input" id="postEvtTitle" placeholder="e.g. Alumni Founders & Tech Leaders Panel" required />
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="postEvtCat">
              <option value="Webinar">Webinar</option>
              <option value="Reunion">Reunion</option>
              <option value="Alumni Meet">Alumni Meet</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Networking">Networking</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Event Date *</label>
            <input type="text" class="form-input" id="postEvtDate" placeholder="e.g. October 24, 2026" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Location / Platform *</label>
          <input type="text" class="form-input" id="postEvtLoc" placeholder="e.g. Virtual via Zoom or Main Auditorium" required />
        </div>
        <div class="form-group">
          <label class="form-label">Event Description *</label>
          <textarea class="form-textarea" id="postEvtDesc" placeholder="Outline schedule, guest speakers, and who should attend..." required></textarea>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
          <button type="button" class="btn btn-secondary" id="evtCancelBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Event</button>
        </div>
      </form>
    `;

    const modal = openModal({
      title: 'Propose New Alumni Event',
      contentHtml: content,
      size: 'md'
    });

    modal.querySelector('#evtCancelBtn').addEventListener('click', closeModal);
    modal.querySelector('#newEventForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = modal.querySelector('#postEvtTitle').value;
      const category = modal.querySelector('#postEvtCat').value;
      const date = modal.querySelector('#postEvtDate').value;
      const location = modal.querySelector('#postEvtLoc').value;
      const desc = modal.querySelector('#postEvtDesc').value;

      store.createEvent({ title, category, date, location, description: desc });
      closeModal();
      showToast('New event created and registered!', 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
