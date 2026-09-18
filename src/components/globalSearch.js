// Global Search Modal (Ctrl+K) with Multi-Category Results
import { icon } from './icons.js';
import { store } from '../data/store.js';
import { openModal, closeModal } from './modal.js';
import { openAlumniProfile } from '../pages/alumniProfileModal.js';

export function openGlobalSearch() {
  const content = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div class="search-bar" style="border-radius: var(--radius-md);">
        ${icon('search', 18, 'text-muted')}
        <input type="text" id="globalSearchInput" placeholder="Search alumni, companies, jobs, events, stories..." autofocus />
      </div>

      <div class="tabs-nav" id="searchCategoryTabs" style="margin-bottom: 0.5rem; border-bottom: 1px solid var(--border-light);">
        <button class="tab-btn active" data-cat="all">All Results</button>
        <button class="tab-btn" data-cat="alumni">Alumni</button>
        <button class="tab-btn" data-cat="jobs">Jobs</button>
        <button class="tab-btn" data-cat="events">Events</button>
        <button class="tab-btn" data-cat="stories">Stories</button>
      </div>

      <div id="globalSearchResults" style="max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.65rem;">
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem;">
          Type anything to search across 5,000+ alumni, jobs, campus events, and stories...
        </div>
      </div>
    </div>
  `;

  const modal = openModal({
    title: 'Global Search',
    contentHtml: content,
    size: 'lg'
  });

  const input = modal.querySelector('#globalSearchInput');
  const resultsContainer = modal.querySelector('#globalSearchResults');
  const tabs = modal.querySelectorAll('#searchCategoryTabs .tab-btn');
  let currentCat = 'all';

  function renderResults(q) {
    if (!q.trim()) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem;">
          Type anything to search across alumni, jobs, campus events, and stories...
        </div>
      `;
      return;
    }

    const query = q.toLowerCase();
    const alumniMatches = store.state.alumni.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.company.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query) ||
      (a.skills && a.skills.some(s => s.toLowerCase().includes(query)))
    );

    const jobMatches = store.state.jobs.filter(j =>
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      j.description.toLowerCase().includes(query)
    );

    const eventMatches = store.state.events.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query)
    );

    const storyMatches = store.state.stories.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.alumniName.toLowerCase().includes(query)
    );

    let html = '';

    // Alumni results
    if ((currentCat === 'all' || currentCat === 'alumni') && alumniMatches.length > 0) {
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.5rem;">Alumni (${alumniMatches.length})</div>`;
      alumniMatches.slice(0, 4).forEach(a => {
        html += `
          <div class="card card-search-result search-alumni-item" data-id="${a.id}" style="padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border-radius: var(--radius-md);">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${a.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />
              <div>
                <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${a.name}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${a.role} @ ${a.company} · Batch '${String(a.gradYear).slice(2)}</div>
              </div>
            </div>
            <span class="badge badge-primary">View Profile</span>
          </div>
        `;
      });
    }

    // Jobs results
    if ((currentCat === 'all' || currentCat === 'jobs') && jobMatches.length > 0) {
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.5rem;">Jobs (${jobMatches.length})</div>`;
      jobMatches.slice(0, 3).forEach(j => {
        html += `
          <div class="card card-search-result search-job-item" data-id="${j.id}" style="padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border-radius: var(--radius-md);">
            <div>
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${j.title}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${j.company} · ${j.location} · ${j.workType}</div>
            </div>
            <a href="#jobs" class="badge badge-success">View in Jobs</a>
          </div>
        `;
      });
    }

    // Events results
    if ((currentCat === 'all' || currentCat === 'events') && eventMatches.length > 0) {
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.5rem;">Events (${eventMatches.length})</div>`;
      eventMatches.slice(0, 3).forEach(e => {
        html += `
          <div class="card card-search-result search-event-item" data-id="${e.id}" style="padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border-radius: var(--radius-md);">
            <div>
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${e.title}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${e.date} · ${e.location}</div>
            </div>
            <a href="#events" class="badge badge-warning">View Event</a>
          </div>
        `;
      });
    }

    // Stories results
    if ((currentCat === 'all' || currentCat === 'stories') && storyMatches.length > 0) {
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.5rem;">Success Stories (${storyMatches.length})</div>`;
      storyMatches.slice(0, 2).forEach(s => {
        html += `
          <div class="card card-search-result search-story-item" data-id="${s.id}" style="padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border-radius: var(--radius-md);">
            <div>
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${s.title}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${s.alumniName} · ${s.company}</div>
            </div>
            <a href="#stories" class="badge badge-neutral">Read Story</a>
          </div>
        `;
      });
    }

    if (!html) {
      html = `
        <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <div style="font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem;">No results found for "${q}"</div>
          <div style="font-size: 0.85rem;">Try searching for "Sarah", "Google", "Hackathon", or "AI"</div>
        </div>
      `;
    }

    resultsContainer.innerHTML = html;

    // Attach click handlers
    resultsContainer.querySelectorAll('.search-alumni-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        closeModal();
        openAlumniProfile(id);
      });
    });

    resultsContainer.querySelectorAll('.search-job-item').forEach(el => {
      el.addEventListener('click', () => {
        closeModal();
        window.location.hash = '#jobs';
      });
    });

    resultsContainer.querySelectorAll('.search-event-item').forEach(el => {
      el.addEventListener('click', () => {
        closeModal();
        window.location.hash = '#events';
      });
    });

    resultsContainer.querySelectorAll('.search-story-item').forEach(el => {
      el.addEventListener('click', () => {
        closeModal();
        window.location.hash = '#stories';
      });
    });
  }

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCat = tab.getAttribute('data-cat');
      renderResults(input.value);
    });
  });

  setTimeout(() => input.focus(), 100);
}
