// Alumni Directory Page with Live Multi-Filter Search
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { openAlumniProfile, openMentorshipRequestModal } from './alumniProfileModal.js';
import { showToast } from '../components/toast.js';

export function renderAlumniDirectoryPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  const departments = ['All', 'Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Civil & Environmental Engineering', 'Biotechnology', 'Management & Business'];
  const years = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013'];
  const industries = ['All', 'Artificial Intelligence', 'FinTech', 'Cloud Computing', 'Semiconductor & Hardware', 'Automotive & Clean Energy', 'Management Consulting', 'Healthcare & Biotech', 'Aerospace & Defense'];

  let activeFilters = {
    search: '',
    department: 'All',
    gradYear: 'All',
    industry: 'All',
    location: 'All',
    mentorshipOnly: false
  };

  container.innerHTML = `
    <!-- Page Header -->
    <div style="margin-bottom: 2rem;">
      <span class="section-tag">University Network</span>
      <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Alumni Directory</h1>
      <p style="color: var(--text-secondary); max-width: 720px;">
        Discover and connect with 5,000+ verified alumni across global industries, request 1-on-1 mentorship, and expand your professional circle.
      </p>
    </div>

    <!-- Search & Filters Toolbar -->
    <div class="card" style="padding: 1.5rem; margin-bottom: 2rem; border-radius: var(--radius-xl);">
      <!-- Search Input -->
      <div class="search-bar" style="margin-bottom: 1.25rem;">
        ${icon('search', 20, 'text-muted')}
        <input type="text" id="dirSearchInput" placeholder="Search by name, company (Google, Stripe...), job title, or skills (PyTorch, Go, VLSI)..." />
        <button id="clearSearchBtn" class="btn btn-ghost btn-sm" style="display: none;">Clear</button>
      </div>

      <!-- Filters Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.78rem;">Department</label>
          <select class="form-select" id="dirDeptFilter">
            ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.78rem;">Graduation Year</label>
          <select class="form-select" id="dirYearFilter">
            ${years.map(y => `<option value="${y}">${y}</option>`).join('')}
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.78rem;">Industry</label>
          <select class="form-select" id="dirIndustryFilter">
            ${industries.map(i => `<option value="${i}">${i}</option>`).join('')}
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 0.6rem; padding-bottom: 0.4rem;">
          <input type="checkbox" id="dirMentorToggle" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary);" />
          <label for="dirMentorToggle" style="font-size: 0.85rem; font-weight: 600; cursor: pointer; user-select: none;">
            Mentors Only
          </label>
        </div>
      </div>
    </div>

    <!-- Active Results Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <div id="dirResultCount" style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary);">
        Showing alumni...
      </div>
      <button id="resetFiltersBtn" class="btn btn-ghost btn-sm" style="font-size: 0.8rem; color: var(--primary);">
        Reset all filters
      </button>
    </div>

    <!-- Alumni Cards Grid -->
    <div id="alumniCardsGrid" class="grid grid-cols-3 gap-6">
      <!-- Injected via updateGrid -->
    </div>
  `;

  const searchInput = container.querySelector('#dirSearchInput');
  const clearBtn = container.querySelector('#clearSearchBtn');
  const deptFilter = container.querySelector('#dirDeptFilter');
  const yearFilter = container.querySelector('#dirYearFilter');
  const industryFilter = container.querySelector('#dirIndustryFilter');
  const mentorToggle = container.querySelector('#dirMentorToggle');
  const resultCount = container.querySelector('#dirResultCount');
  const cardsGrid = container.querySelector('#alumniCardsGrid');
  const resetBtn = container.querySelector('#resetFiltersBtn');

  function updateGrid() {
    const list = store.getAlumni(activeFilters);
    resultCount.textContent = `Showing ${list.length} verified alumni`;

    if (list.length === 0) {
      const isCompletelyEmpty = store.state.alumni.length === 0;
      cardsGrid.innerHTML = isCompletelyEmpty ? `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
          <div style="color: var(--primary); display: flex; justify-content: center; margin-bottom: 0.75rem;">
            ${icon('users', 54)}
          </div>
          <h3 style="margin-top: 0.5rem; font-size: 1.4rem; font-weight: 800;">No Alumni Profiles Registered Yet</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 520px; margin-left: auto; margin-right: auto;">
            The directory is ready for fresh registrations. Register as an alumni to be the first member listed, or switch to Admin to add verified profiles directly.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap;">
            <a href="#register" class="btn btn-primary">
              ${icon('plus', 16)} Register as Alumni
            </a>
            <a href="#dashboard/admin" class="btn btn-secondary">
              ${icon('shield', 16)} Open Admin Console
            </a>
          </div>
        </div>
      ` : `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl);">
          ${icon('users', 48, 'text-muted')}
          <h3 style="margin-top: 1rem; font-size: 1.25rem;">No alumni match your search criteria</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.35rem;">
            Try clearing filters or searching by a broader keyword.
          </p>
          <button class="btn btn-primary btn-sm" id="emptyResetBtn" style="margin-top: 1.25rem;">
            Reset Filters
          </button>
        </div>
      `;
      const emptyReset = cardsGrid.querySelector('#emptyResetBtn');
      if (emptyReset) emptyReset.addEventListener('click', resetAll);
      return;
    }

    cardsGrid.innerHTML = list.map(a => {
      const isConnected = store.state.connections.includes(a.id);
      return `
        <div class="alumni-card">
          <div class="alumni-card-header">
            <div class="alumni-avatar-wrap">
              <img src="${a.avatar}" alt="${a.name}" />
            </div>
            ${a.availableForMentorship ? `
              <span class="badge badge-primary" style="position: absolute; right: 0.75rem; top: 0.75rem; font-size: 0.68rem; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);">
                ${icon('sparkles', 12)} Mentor
              </span>
            ` : ''}
          </div>
          <div class="alumni-card-body">
            <div class="alumni-name">
              ${a.name}
              <span style="color: var(--accent-emerald);" title="Verified Graduate">${icon('shield', 14)}</span>
            </div>
            <div class="alumni-role">${a.role}</div>
            <div style="font-weight: 700; font-size: 0.875rem; color: var(--primary); margin-bottom: 0.75rem;">
              ${a.company}
            </div>

            <div class="alumni-meta">
              <div class="alumni-meta-row">${icon('graduationCap', 13)} Class of ${a.gradYear} · ${a.department}</div>
              <div class="alumni-meta-row">${icon('mapPin', 13)} ${a.location}</div>
            </div>

            <div class="skills-row">
              ${(a.skills || []).slice(0, 3).map(s => `<span class="skill-chip">${s}</span>`).join('')}
              ${(a.skills && a.skills.length > 3) ? `<span class="skill-chip">+${a.skills.length - 3}</span>` : ''}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-light);">
              <button class="btn btn-secondary btn-sm card-view-btn" data-id="${a.id}">
                View Profile
              </button>
              <button class="btn ${isConnected ? 'btn-secondary' : 'btn-primary'} btn-sm card-connect-btn" data-id="${a.id}">
                ${isConnected ? icon('check', 13) + ' Connected' : icon('users', 13) + ' Connect'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach actions
    cardsGrid.querySelectorAll('.card-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        openAlumniProfile(e.currentTarget.getAttribute('data-id'));
      });
    });

    cardsGrid.querySelectorAll('.card-connect-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const alum = store.getAlumniById(id);
        if (store.state.connections.includes(id)) {
          store.state.connections = store.state.connections.filter(c => c !== id);
          showToast(`Disconnected from ${alum.name}`, 'info');
        } else {
          store.state.connections.push(id);
          showToast(`Connection established with ${alum.name}!`, 'success');
        }
        store.saveState();
        updateGrid();
      });
    });
  }

  function resetAll() {
    activeFilters = { search: '', department: 'All', gradYear: 'All', industry: 'All', location: 'All', mentorshipOnly: false };
    searchInput.value = '';
    clearBtn.style.display = 'none';
    deptFilter.value = 'All';
    yearFilter.value = 'All';
    industryFilter.value = 'All';
    mentorToggle.checked = false;
    updateGrid();
  }

  // Filter inputs events
  searchInput.addEventListener('input', (e) => {
    activeFilters.search = e.target.value;
    clearBtn.style.display = e.target.value ? 'inline-flex' : 'none';
    updateGrid();
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    activeFilters.search = '';
    clearBtn.style.display = 'none';
    updateGrid();
  });

  deptFilter.addEventListener('change', (e) => {
    activeFilters.department = e.target.value;
    updateGrid();
  });

  yearFilter.addEventListener('change', (e) => {
    activeFilters.gradYear = e.target.value;
    updateGrid();
  });

  industryFilter.addEventListener('change', (e) => {
    activeFilters.industry = e.target.value;
    updateGrid();
  });

  mentorToggle.addEventListener('change', (e) => {
    activeFilters.mentorshipOnly = e.target.checked;
    updateGrid();
  });

  resetBtn.addEventListener('click', resetAll);

  // Initial render
  updateGrid();

  return container;
}
