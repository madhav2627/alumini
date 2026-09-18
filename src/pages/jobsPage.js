// Jobs & Career Opportunities Board matching Section 17 of alumini.md - Enhanced UI
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

function getCompanyAvatar(name = 'Tech') {
  const gradients = [
    ['#4f46e5', '#7c3aed'],
    ['#059669', '#10b981'],
    ['#d97706', '#f59e0b'],
    ['#dc2626', '#f43f5e'],
    ['#2563eb', '#38bdf8'],
    ['#7c3aed', '#ec4899']
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  const [c1, c2] = gradients[Math.abs(hash) % gradients.length];
  const initials = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'CO';
  return `<div class="company-avatar" style="background: linear-gradient(135deg, ${c1}, ${c2});">${initials}</div>`;
}

export function renderJobsPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  let activeFilters = {
    search: '',
    workType: 'All',
    savedOnly: false,
    tag: 'All'
  };

  function renderView() {
    const allJobs = store.getJobs({ search: '', workType: 'All', savedOnly: false });
    const jobs = store.getJobs(activeFilters).filter(j => {
      if (activeFilters.tag === 'All') return true;
      if (activeFilters.tag === 'Engineering') return (j.skills || []).some(s => /react|python|cloud|system|node|go|c\+\+/i.test(s)) || /engineer|developer/i.test(j.title);
      if (activeFilters.tag === 'Product') return /product|manager|lead/i.test(j.title) || (j.skills || []).some(s => /agile|roadmap|scrum/i.test(s));
      if (activeFilters.tag === 'Design') return /designer|ui|ux/i.test(j.title) || (j.skills || []).some(s => /figma|design/i.test(s));
      return true;
    });

    const referralCount = allJobs.length;
    const remoteCount = allJobs.filter(j => j.workType === 'Remote').length;
    const savedCount = allJobs.filter(j => j.saved).length;

    container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="section-tag">Career Pipelines & Referrals</span>
          <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Job Board & Alumni Referrals</h1>
          <p style="color: var(--text-secondary); max-width: 680px;">
            Fast-track your application with direct employee referrals from alumni working at top tech firms, startups, and institutions.
          </p>
        </div>

        <button id="jobBoardPostBtn" class="btn btn-primary" style="box-shadow: 0 4px 14px var(--primary-glow);">
          ${icon('plus', 16)} Post Job / Referral
        </button>
      </div>

      <!-- Quick KPI Stats Bar -->
      <div class="grid grid-cols-4 gap-4" style="margin-bottom: 2rem;">
        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
            ${icon('briefcase', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${allJobs.length}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">Active Roles</div>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-emerald-light); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center;">
            ${icon('sparkles', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${referralCount}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">Alumni Referrers</div>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-sky-light); color: var(--accent-sky); display: flex; align-items: center; justify-content: center;">
            ${icon('globe', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${remoteCount}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">Remote Friendly</div>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-amber-light); color: var(--accent-amber); display: flex; align-items: center; justify-content: center;">
            ${icon('bookmark', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${savedCount}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">Bookmarked</div>
          </div>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="card" style="padding: 1.25rem 1.5rem; border-radius: var(--radius-xl); margin-bottom: 2rem;">
        <div class="filter-toolbar-grid">
          <div class="search-bar">
            ${icon('search', 18, 'text-muted')}
            <input type="text" id="jobSearchInput" value="${activeFilters.search}" placeholder="Search position, company (Stripe, Google, OpenAI), or tech stack..." />
          </div>

          <div>
            <select class="form-select" id="jobTypeFilter">
              <option value="All" ${activeFilters.workType === 'All' ? 'selected' : ''}>All Work Types</option>
              <option value="Full-time" ${activeFilters.workType === 'Full-time' ? 'selected' : ''}>Full-time</option>
              <option value="Internship" ${activeFilters.workType === 'Internship' ? 'selected' : ''}>Internship</option>
              <option value="Remote" ${activeFilters.workType === 'Remote' ? 'selected' : ''}>Remote</option>
              <option value="Hybrid" ${activeFilters.workType === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
            </select>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.85rem; background: var(--bg-card-subtle); border-radius: var(--radius-full);">
            <input type="checkbox" id="jobSavedOnly" ${activeFilters.savedOnly ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer;" />
            <label for="jobSavedOnly" style="font-size: 0.85rem; font-weight: 600; cursor: pointer; white-space: nowrap;">Saved (${savedCount})</label>
          </div>
        </div>

        <!-- Role Category Pills -->
        <div style="display: flex; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-light); overflow-x: auto;">
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); align-self: center; margin-right: 0.5rem;">Categories:</span>
          ${['All', 'Engineering', 'Product', 'Design'].map(cat => `
            <button class="badge role-cat-btn ${activeFilters.tag === cat ? 'badge-primary' : 'badge-neutral'}" data-cat="${cat}" style="cursor: pointer; padding: 0.4rem 0.85rem; font-size: 0.8rem; border-radius: var(--radius-full);">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Result Count Info -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">
          Showing <span style="color: var(--text-primary); font-weight: 700;">${jobs.length}</span> verified career opportunities
        </div>
      </div>

      <!-- Jobs Grid -->
      <div class="grid grid-cols-2 gap-6" id="jobsGridContainer">
        ${jobs.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="color: var(--accent-emerald); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('briefcase', 54)}
            </div>
            <h3 style="margin-top: 0.5rem; font-size: 1.35rem; font-weight: 800;">No Matching Opportunities Found</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 500px; margin-left: auto; margin-right: auto;">
              Try tweaking your search keywords or clear the category filters to discover more alumni postings.
            </p>
            <button class="btn btn-primary empty-post-job-btn" style="margin-top: 1.25rem;">
              ${icon('plus', 16)} Post a Referral Opportunity
            </button>
          </div>
        ` : jobs.map(j => `
          <div class="job-card-premium">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; gap: 1rem; align-items: flex-start;">
                ${getCompanyAvatar(j.company)}
                <div>
                  <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.25rem; flex-wrap: wrap;">
                    <span class="badge ${j.workType === 'Internship' ? 'badge-warning' : 'badge-primary'}">${j.workType}</span>
                    <span class="job-referral-pill">${icon('sparkles', 10)} Referral Available</span>
                  </div>
                  <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); line-height: 1.25;">${j.title}</h3>
                  <div style="font-weight: 600; font-size: 0.925rem; color: var(--primary); margin-top: 0.2rem;">
                    ${j.company} · <span style="color: var(--text-muted); font-weight: 500; font-size: 0.85rem;">${j.location}</span>
                  </div>
                </div>
              </div>

              <button class="btn-icon toggle-save-job" data-id="${j.id}" title="${j.saved ? 'Remove bookmark' : 'Bookmark job'}" style="color: ${j.saved ? 'var(--primary)' : 'var(--text-muted)'}; background: ${j.saved ? 'var(--primary-light)' : 'transparent'}; border-radius: var(--radius-full); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                ${icon('bookmark', 18)}
              </button>
            </div>

            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 1.25rem; flex: 1;">
              ${j.description}
            </p>

            <div class="skills-row" style="margin-bottom: 1.25rem;">
              ${(j.skills || []).map(s => `<span class="skill-chip">${s}</span>`).join('')}
            </div>

            <div style="background: var(--bg-card-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.825rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <span style="color: var(--accent-emerald); font-weight: 700; display: flex; align-items: center; gap: 0.35rem;">
                ${icon('shield', 13)} Referrer: ${j.postedBy}
              </span>
              <span class="job-salary-pill">
                ${j.salary || '$120,000+'}
              </span>
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <button class="btn btn-primary btn-sm w-full apply-job-btn" data-id="${j.id}" style="box-shadow: 0 2px 8px var(--primary-glow);">
                ${icon('sparkles', 14)} Request Referral
              </button>
              <button class="btn btn-secondary btn-sm view-job-details-btn" data-id="${j.id}">
                Details
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Hook listeners
    container.querySelector('#jobSearchInput').addEventListener('input', (e) => {
      activeFilters.search = e.target.value;
      renderView();
    });

    container.querySelector('#jobTypeFilter').addEventListener('change', (e) => {
      activeFilters.workType = e.target.value;
      renderView();
    });

    container.querySelector('#jobSavedOnly').addEventListener('change', (e) => {
      activeFilters.savedOnly = e.target.checked;
      renderView();
    });

    container.querySelectorAll('.role-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilters.tag = btn.getAttribute('data-cat');
        renderView();
      });
    });

    container.querySelectorAll('.toggle-save-job').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        store.toggleSaveJob(id);
        renderView();
        showToast('Bookmark updated!', 'info');
      });
    });

    container.querySelectorAll('.apply-job-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openApplyModal(id);
      });
    });

    container.querySelectorAll('.view-job-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openJobDetailsModal(id);
      });
    });

    const postBtn = container.querySelector('#jobBoardPostBtn');
    if (postBtn) {
      postBtn.addEventListener('click', openPostJobModal);
    }
    const emptyPostBtn = container.querySelector('.empty-post-job-btn');
    if (emptyPostBtn) {
      emptyPostBtn.addEventListener('click', openPostJobModal);
    }
  }

  function openApplyModal(jobId) {
    const job = store.state.jobs.find(j => j.id === jobId);
    if (!job) return;

    const modal = openModal({
      title: `Referral Application: ${job.title}`,
      contentHtml: `
        <div>
          <div style="margin-bottom: 1.25rem; padding: 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-lg); border-left: 4px solid var(--primary); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 800; font-size: 1.05rem;">${job.company}</div>
              <div style="font-size: 0.825rem; color: var(--text-muted);">${job.location} · Referrer: ${job.postedBy}</div>
            </div>
            <span class="badge badge-success">${icon('shield', 11)} Verified Alumni</span>
          </div>

          <form id="applyJobForm">
            <div class="form-group">
              <label class="form-label">LinkedIn or Professional Portfolio URL *</label>
              <input type="url" class="form-input" id="candidateUrl" placeholder="https://linkedin.com/in/yourprofile" required />
            </div>

            <div class="form-group">
              <label class="form-label">Resume / CV Document Link (Google Drive / Notion) *</label>
              <input type="url" class="form-input" id="candidateResume" placeholder="https://drive.google.com/file/..." required />
            </div>

            <div class="form-group">
              <label class="form-label">Pitch Note to ${job.postedBy.split(' ')[0]} *</label>
              <textarea class="form-textarea" id="candidateNote" placeholder="Explain your alignment with the role, notable projects, and why this referral makes sense..." required></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
              <button type="button" class="btn btn-secondary" id="applyCancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Referral Pitch</button>
            </div>
          </form>
        </div>
      `,
      size: 'md'
    });

    modal.querySelector('#applyCancel').addEventListener('click', closeModal);
    modal.querySelector('#applyJobForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const note = modal.querySelector('#candidateNote').value;
      store.applyJob(jobId, note);
      closeModal();
      showToast(`Referral pitch successfully submitted to ${job.postedBy}!`, 'success');
    });
  }

  function openJobDetailsModal(jobId) {
    const job = store.state.jobs.find(j => j.id === jobId);
    if (!job) return;

    openModal({
      title: job.title,
      contentHtml: `
        <div>
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
            ${getCompanyAvatar(job.company)}
            <div>
              <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">${job.company}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                ${job.location} · ${job.workType} · Experience: ${job.experience || '1-3 Years'}
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
            <span class="badge badge-primary">${job.salary || 'Competitive Base'}</span>
            <span class="badge badge-success">Referral Verified</span>
          </div>

          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">About the Opportunity</h4>
          <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1.25rem;">
            ${job.description}
          </p>

          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Required Competencies</h4>
          <div class="skills-row" style="margin-bottom: 1.5rem;">
            ${(job.skills || []).map(s => `<span class="skill-chip">${s}</span>`).join('')}
          </div>

          <div class="card" style="padding: 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">ALUMNI REFERRER</div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--accent-emerald); margin-top: 0.15rem;">${job.postedBy}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">Application Deadline: ${job.deadline || 'Rolling basis'}</div>
          </div>
        </div>
      `,
      footerHtml: `
        <button class="btn btn-primary w-full" id="detailsApplyBtn">
          ${icon('sparkles', 14)} Request Referral from ${job.postedBy.split(' ')[0]}
        </button>
      `,
      size: 'md'
    });

    const dBtn = document.querySelector('#detailsApplyBtn');
    if (dBtn) {
      dBtn.addEventListener('click', () => {
        closeModal();
        openApplyModal(jobId);
      });
    }
  }

  function openPostJobModal() {
    const modal = openModal({
      title: 'Post New Opportunity / Referral',
      contentHtml: `
        <form id="modalNewJob">
          <div class="form-group">
            <label class="form-label">Job Title *</label>
            <input type="text" class="form-input" id="mJobTitle" placeholder="e.g. Senior Frontend Engineer" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Company Name *</label>
              <input type="text" class="form-input" id="mJobCompany" placeholder="e.g. Stripe, OpenAI" required />
            </div>
            <div class="form-group">
              <label class="form-label">Location *</label>
              <input type="text" class="form-input" id="mJobLocation" placeholder="Remote or City, Country" required />
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Work Type</label>
              <select class="form-select" id="mJobType">
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Estimated Salary Range</label>
              <input type="text" class="form-input" id="mJobSalary" placeholder="e.g. $120,000 - $150,000" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description & Referral Guidelines *</label>
            <textarea class="form-textarea" id="mJobDesc" placeholder="Responsibilities, required background, and what qualifications will make a candidate stand out for a referral..." required></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
            <button type="button" class="btn btn-secondary" id="mJobCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish to Alumni Board</button>
          </div>
        </form>
      `,
      size: 'md'
    });

    modal.querySelector('#mJobCancel').addEventListener('click', closeModal);
    modal.querySelector('#modalNewJob').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = modal.querySelector('#mJobTitle').value;
      const company = modal.querySelector('#mJobCompany').value;
      const location = modal.querySelector('#mJobLocation').value;
      const workType = modal.querySelector('#mJobType').value;
      const salary = modal.querySelector('#mJobSalary').value || 'Competitive';
      const desc = modal.querySelector('#mJobDesc').value;

      store.postJob({ title, company, location, workType, salary, description: desc });
      closeModal();
      showToast('Career opportunity published to the Alumni Board!', 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
