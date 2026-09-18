// Administrator Dashboard & Verification Console matching Section 11, 13, 38 of alumini.md - Resilient & Fresh
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openAlumniProfile } from './alumniProfileModal.js';
import { openModal, closeModal } from '../components/modal.js';
import { renderCommonDashboard } from './commonDashboard.js';

export function renderAdminDashboard() {
  if (!store.getCurrentUser()) {
    return renderCommonDashboard();
  }

  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2rem';
  container.style.paddingBottom = '4rem';

  function renderView() {
    const allAlumni = store.state.alumni;
    const pendingAlumni = allAlumni.filter(a => a.status === 'PENDING_VERIFICATION');
    const approvedAlumni = allAlumni.filter(a => a.status === 'APPROVED');
    const mentorsCount = allAlumni.filter(a => a.availableForMentorship).length;

    // Dynamic department distribution
    const deptCounts = {};
    allAlumni.forEach(a => {
      const dept = a.department || 'General';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    // Dynamic graduation cohorts
    const cohortCounts = {};
    allAlumni.forEach(a => {
      const yr = a.gradYear || 2024;
      cohortCounts[yr] = (cohortCounts[yr] || 0) + 1;
    });

    container.innerHTML = `
      <!-- Admin Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="badge badge-admin">${icon('shield', 12)} University Administration</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Office of Alumni Relations</span>
          </div>
          <h1 style="font-size: 2.25rem; font-weight: 800;">Administration & Verification Console</h1>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">
            Manage credentials verification, campus analytics, user reports, and system announcements.
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button id="adminAddAlumBtn" class="btn btn-primary btn-sm">
            ${icon('plus', 14)} Add Alumni Profile
          </button>
          <button id="adminBroadcastBtn" class="btn btn-secondary btn-sm">
            ${icon('bell', 14)} Post Announcement
          </button>
          <button id="adminExportBtn" class="btn btn-secondary btn-sm">
            ${icon('externalLink', 14)} Export Alumni CSV
          </button>
        </div>
      </div>

      <!-- Section 11: Real Live Metric Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
        <div class="card stat-card" style="border-top: 3px solid var(--primary);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Alumni</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin: 0.2rem 0;">${allAlumni.length}</div>
          <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;">Fresh Database</div>
        </div>

        <div class="card stat-card" style="border-top: 3px solid var(--accent-emerald);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Active / Verified</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-emerald); margin: 0.2rem 0;">${approvedAlumni.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">In live directory</div>
        </div>

        <div class="card stat-card" style="border-top: 3px solid var(--accent-amber);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Pending Verification</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-amber); margin: 0.2rem 0;">${pendingAlumni.length}</div>
          <div style="font-size: 0.75rem; color: ${pendingAlumni.length > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}; font-weight: 600;">
            ${pendingAlumni.length > 0 ? 'Requires review' : 'Queue clear'}
          </div>
        </div>

        <div class="card stat-card" style="border-top: 3px solid var(--accent-sky);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Job Postings</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin: 0.2rem 0;">${store.state.jobs.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Active opportunities</div>
        </div>

        <div class="card stat-card" style="border-top: 3px solid var(--secondary);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Active Mentors</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--secondary); margin: 0.2rem 0;">${mentorsCount}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Available for coaching</div>
        </div>

        <div class="card stat-card" style="border-top: 3px solid var(--accent-rose);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Events Hosted</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-rose); margin: 0.2rem 0;">${store.state.events.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Campus & Virtual</div>
        </div>
      </div>

      <!-- Section 13: Alumni Verification Queue -->
      <div class="card" style="padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h2 style="font-size: 1.35rem; font-weight: 800;">Pending Alumni Registrations</h2>
              <span class="badge ${pendingAlumni.length > 0 ? 'badge-warning' : 'badge-success'}">
                ${pendingAlumni.length} pending
              </span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
              Compare submitted details with university registrar records before approving access.
            </p>
          </div>
          ${pendingAlumni.length > 0 ? `
            <button id="approveAllPendingBtn" class="btn btn-secondary btn-sm" style="color: var(--accent-emerald);">
              ${icon('checkCircle', 14)} Approve All (${pendingAlumni.length})
            </button>
          ` : ''}
        </div>

        ${pendingAlumni.length === 0 ? `
          <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-card-subtle); border-radius: var(--radius-lg);">
            <div style="color: var(--accent-emerald); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('checkCircle', 40)}
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">Verification Queue is Clear!</h3>
            <p style="font-size: 0.85rem; margin-top: 0.25rem;">No pending registrations waiting. When alumni register via the wizard, their submissions appear here.</p>
          </div>
        ` : `
          <div style="overflow-x: auto;">
            <table class="table-custom" style="width: 100%; text-align: left; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                  <th style="padding: 0.75rem;">Alumni Name</th>
                  <th style="padding: 0.75rem;">Department & Batch</th>
                  <th style="padding: 0.75rem;">Company & Role</th>
                  <th style="padding: 0.75rem;">Location</th>
                  <th style="padding: 0.75rem;">Mentorship</th>
                  <th style="padding: 0.75rem; text-align: right;">Verification Actions</th>
                </tr>
              </thead>
              <tbody>
                ${pendingAlumni.map(alum => `
                  <tr style="border-bottom: 1px solid var(--border-light); font-size: 0.85rem;">
                    <td style="padding: 0.75rem;">
                      <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <img src="${alum.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />
                        <div>
                          <div style="font-weight: 700; color: var(--text-primary);">${alum.name}</div>
                          <div style="font-size: 0.72rem; color: var(--text-muted);">${alum.degree || 'B.Tech'}</div>
                        </div>
                      </div>
                    </td>
                    <td style="padding: 0.75rem;">
                      <div>${alum.department}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">Class of ${alum.gradYear}</div>
                    </td>
                    <td style="padding: 0.75rem;">
                      <div style="font-weight: 600;">${alum.company}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${alum.role}</div>
                    </td>
                    <td style="padding: 0.75rem; color: var(--text-muted);">${alum.location}</td>
                    <td style="padding: 0.75rem;">
                      <span class="badge ${alum.availableForMentorship ? 'badge-primary' : 'badge-neutral'}">
                        ${alum.availableForMentorship ? 'Mentor' : 'Networking'}
                      </span>
                    </td>
                    <td style="padding: 0.75rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.4rem;">
                        <button class="btn btn-secondary btn-sm admin-view-alum" data-id="${alum.id}" title="Inspect full details">
                          View
                        </button>
                        <button class="btn btn-primary btn-sm admin-approve-btn" data-id="${alum.id}" style="background: var(--accent-emerald); border-color: var(--accent-emerald);" title="Approve credentials">
                          ${icon('check', 13)} Approve
                        </button>
                        <button class="btn btn-secondary btn-sm admin-reject-btn" data-id="${alum.id}" style="color: var(--accent-rose);" title="Reject submission">
                          ${icon('x', 13)}
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- Section 14: Analytics Charts (Dynamic or Clean Fallback) -->
      <div class="grid grid-cols-2 gap-8" style="margin-bottom: 3rem;">
        <!-- Chart 1: Cohort Distribution -->
        <div class="card" style="padding: 1.5rem; border-radius: var(--radius-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Alumni by Graduation Cohort</h3>
            <span class="badge badge-neutral">Live Cohorts</span>
          </div>

          ${allAlumni.length === 0 ? `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
              ${icon('barChart', 36)}
              <div style="font-size: 0.9rem; margin-top: 0.5rem;">No alumni cohorts registered yet.</div>
              <div style="font-size: 0.75rem; margin-top: 0.2rem;">Data will populate dynamically as alumni join.</div>
            </div>
          ` : `
            <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 180px; padding-top: 1rem; border-bottom: 2px solid var(--border-color); gap: 0.75rem;">
              ${Object.entries(cohortCounts).map(([yr, count]) => {
                const heightPct = Math.min(100, Math.round((count / allAlumni.length) * 100));
                return `
                  <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
                    <span style="font-size: 0.7rem; font-weight: 600; margin-bottom: 0.2rem;">${count}</span>
                    <div style="width: 100%; max-width: 36px; height: ${Math.max(15, heightPct)}%; background: var(--primary); border-radius: 4px 4px 0 0;"></div>
                    <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">${yr}</span>
                  </div>
                `;
              }).join('')}
            </div>
          `}
          <div style="font-size: 0.78rem; color: var(--text-muted); text-align: center; margin-top: 0.75rem;">
            Registered alumni count by graduation year
          </div>
        </div>

        <!-- Chart 2: Alumni by Department -->
        <div class="card" style="padding: 1.5rem; border-radius: var(--radius-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Alumni by Academic Department</h3>
            <span class="badge badge-neutral">Distribution</span>
          </div>

          ${allAlumni.length === 0 ? `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
              ${icon('users', 36)}
              <div style="font-size: 0.9rem; margin-top: 0.5rem;">No department distribution recorded yet.</div>
              <div style="font-size: 0.75rem; margin-top: 0.2rem;">Departments will appear here in real time.</div>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${Object.entries(deptCounts).map(([dept, count]) => {
                const pct = Math.round((count / allAlumni.length) * 100);
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                      <span style="font-weight: 600;">${dept}</span>
                      <span style="color: var(--text-muted);">${pct}% (${count})</span>
                    </div>
                    <div class="fund-progress-bar" style="height: 8px;">
                      <div class="fund-progress-fill" style="width: ${pct}%; background: var(--primary);"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // Hook listeners: Approve single
    container.querySelectorAll('.admin-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.approveAlumni(id);
        showToast('Alumni profile approved and added to live directory!', 'success');
        renderView();
      });
    });

    // Reject single
    container.querySelectorAll('.admin-reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.rejectAlumni(id);
        showToast('Registration rejected.', 'info');
        renderView();
      });
    });

    // Inspect
    container.querySelectorAll('.admin-view-alum').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openAlumniProfile(id);
      });
    });

    // Approve All
    const approveAllBtn = container.querySelector('#approveAllPendingBtn');
    if (approveAllBtn) {
      approveAllBtn.addEventListener('click', () => {
        pendingAlumni.forEach(p => store.approveAlumni(p.id));
        showToast(`All ${pendingAlumni.length} alumni registrations approved!`, 'success');
        renderView();
      });
    }

    // Add Alumni Manually
    const addAlumBtn = container.querySelector('#adminAddAlumBtn');
    if (addAlumBtn) {
      addAlumBtn.addEventListener('click', openAdminAddAlumniModal);
    }

    // Export CSV
    const exportBtn = container.querySelector('#adminExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const headers = ['ID', 'Name', 'Department', 'Degree', 'GradYear', 'Company', 'Role', 'Status', 'Location'];
        const rows = allAlumni.map(a => [
          a.id,
          `"${a.name}"`,
          `"${a.department}"`,
          `"${a.degree}"`,
          a.gradYear,
          `"${a.company}"`,
          `"${a.role}"`,
          a.status,
          `"${a.location}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `alumni_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        showToast('Exported complete Alumni records as CSV!', 'success');
      });
    }

    // Broadcast Announcement
    const broadcastBtn = container.querySelector('#adminBroadcastBtn');
    if (broadcastBtn) {
      broadcastBtn.addEventListener('click', () => {
        const modal = openModal({
          title: 'Post System Announcement',
          contentHtml: `
            <form id="announcementForm">
              <div class="form-group">
                <label class="form-label">Announcement Headline *</label>
                <input type="text" class="form-input" id="annTitle" placeholder="e.g. Annual Alumni Convocation Registration Open" required />
              </div>
              <div class="form-group">
                <label class="form-label">Target Audience</label>
                <select class="form-select" id="annAudience">
                  <option value="All">All Members (Alumni + Students + Faculty)</option>
                  <option value="Alumni">Alumni Only</option>
                  <option value="Students">Students Only</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Announcement Content *</label>
                <textarea class="form-textarea" id="annMsg" placeholder="Type your official announcement..." required></textarea>
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
                <button type="button" class="btn btn-secondary" id="annCancel">Cancel</button>
                <button type="submit" class="btn btn-primary">Broadcast to All</button>
              </div>
            </form>
          `,
          size: 'md'
        });

        modal.querySelector('#annCancel').addEventListener('click', closeModal);
        modal.querySelector('#announcementForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const title = modal.querySelector('#annTitle').value;
          const msg = modal.querySelector('#annMsg').value;
          store.addNotification({
            title: `Announcement: ${title}`,
            message: msg,
            type: 'announcement',
            link: '#community'
          });
          closeModal();
          showToast('Announcement broadcasted to all university members!', 'success');
        });
      });
    }
  }

  function openAdminAddAlumniModal() {
    const modal = openModal({
      title: 'Add Alumni Profile (Direct Verification)',
      contentHtml: `
        <form id="adminAddAlumForm">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="mAlumName" placeholder="e.g. Dr. Jane Smith" required />
            </div>
            <div class="form-group">
              <label class="form-label">Graduation Year *</label>
              <input type="number" class="form-input" id="mAlumGradYear" placeholder="2020" min="1950" max="2030" required />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Department *</label>
              <select class="form-select" id="mAlumDept" required>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil & Environmental Engineering">Civil & Environmental Engineering</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Management & Business">Management & Business</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Degree</label>
              <input type="text" class="form-input" id="mAlumDegree" placeholder="B.Tech in Computer Science" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Current Company *</label>
              <input type="text" class="form-input" id="mAlumCompany" placeholder="e.g. Google, Tesla, Microsoft..." required />
            </div>
            <div class="form-group">
              <label class="form-label">Job Title / Role *</label>
              <input type="text" class="form-input" id="mAlumRole" placeholder="e.g. Senior Software Engineer" required />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Location</label>
              <input type="text" class="form-input" id="mAlumLoc" placeholder="e.g. San Francisco, CA" />
            </div>
            <div class="form-group">
              <label class="form-label">Industry</label>
              <select class="form-select" id="mAlumIndustry">
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="FinTech">FinTech</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Semiconductor & Hardware">Semiconductor & Hardware</option>
                <option value="Automotive & Clean Energy">Automotive & Clean Energy</option>
                <option value="Healthcare & Biotech">Healthcare & Biotech</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Bio / Summary</label>
            <textarea class="form-textarea" id="mAlumBio" placeholder="Brief career highlight, mentoring focus..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Skills (comma-separated)</label>
            <input type="text" class="form-input" id="mAlumSkills" placeholder="Python, Distributed Systems, Product Management" />
          </div>

          <div style="display: flex; align-items: center; gap: 0.6rem; margin: 1rem 0;">
            <input type="checkbox" id="mAlumMentor" checked style="width: 18px; height: 18px; accent-color: var(--primary);" />
            <label for="mAlumMentor" style="font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              Available for Student Mentorship
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" id="mAlumCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save as Verified Alumni</button>
          </div>
        </form>
      `,
      size: 'lg'
    });

    modal.querySelector('#mAlumCancel').addEventListener('click', closeModal);
    modal.querySelector('#adminAddAlumForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modal.querySelector('#mAlumName').value;
      const gradYear = modal.querySelector('#mAlumGradYear').value;
      const department = modal.querySelector('#mAlumDept').value;
      const degree = modal.querySelector('#mAlumDegree').value;
      const company = modal.querySelector('#mAlumCompany').value;
      const role = modal.querySelector('#mAlumRole').value;
      const location = modal.querySelector('#mAlumLoc').value || 'Campus City';
      const industry = modal.querySelector('#mAlumIndustry').value;
      const bio = modal.querySelector('#mAlumBio').value;
      const rawSkills = modal.querySelector('#mAlumSkills').value;
      const skills = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
      const availableForMentorship = modal.querySelector('#mAlumMentor').checked;

      store.addAlumniDirect({
        name,
        gradYear,
        department,
        degree,
        company,
        role,
        location,
        industry,
        bio,
        skills,
        availableForMentorship
      });

      closeModal();
      showToast(`${name} has been added directly to verified directory!`, 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
