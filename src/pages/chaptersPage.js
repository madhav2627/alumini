// Regional Alumni Chapters matching Section 23 of alumini.md - Enhanced UI
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderChaptersPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  let regionFilter = 'All';
  let searchQuery = '';

  function renderView() {
    const allChapters = store.getChapters();
    const joinedChapters = allChapters.filter(c => c.isJoined);
    const totalMembers = allChapters.reduce((acc, c) => acc + (c.membersCount || 0), 0);

    const filteredChapters = allChapters.filter(ch => {
      const matchSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ch.country.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (regionFilter === 'Joined') return ch.isJoined;
      if (regionFilter === 'North America') return /USA|United States|Canada|San Francisco|New York|Toronto/i.test(ch.country + ' ' + ch.city);
      if (regionFilter === 'Europe') return /UK|United Kingdom|Germany|France|London|Berlin|Paris/i.test(ch.country + ' ' + ch.city);
      if (regionFilter === 'Asia-Pacific') return /India|Singapore|Japan|Australia|Bengaluru|Tokyo|Sydney/i.test(ch.country + ' ' + ch.city);
      return true;
    });

    container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="section-tag">Global Alumni Network</span>
          <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Regional Alumni Chapters</h1>
          <p style="color: var(--text-secondary); max-width: 680px;">
            Stay connected locally wherever your career takes you. Join city chapters for networking dinners, technical seminars, and relocation circles.
          </p>
        </div>

        <button id="createChapterTopBtn" class="btn btn-primary" style="box-shadow: 0 4px 14px var(--primary-glow);">
          ${icon('plus', 16)} Establish Local Chapter
        </button>
      </div>

      <!-- Quick Global Reach Summary -->
      <div class="grid grid-cols-4 gap-4" style="margin-bottom: 2rem;">
        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
            ${icon('globe', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${allChapters.length}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">City Hubs</div>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-emerald-light); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center;">
            ${icon('users', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${totalMembers.toLocaleString()}+</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">Active Members</div>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--secondary-light); color: var(--secondary); display: flex; align-items: center; justify-content: center;">
            ${icon('calendar', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${allChapters.length * 2}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">Annual Meetups</div>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-amber-light); color: var(--accent-amber); display: flex; align-items: center; justify-content: center;">
            ${icon('checkCircle', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${joinedChapters.length}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">My Chapters</div>
          </div>
        </div>
      </div>

      <!-- Search & Region Filter Bar -->
      <div class="card" style="padding: 1.25rem 1.5rem; border-radius: var(--radius-xl); margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <div class="search-bar" style="flex: 1; min-width: 0; width: 100%;">
            ${icon('search', 18, 'text-muted')}
            <input type="text" id="chapterSearchInput" value="${searchQuery}" placeholder="Search chapter by city, country, or keyword..." />
          </div>

          <!-- Region Pills -->
          <div style="display: flex; gap: 0.5rem; overflow-x: auto;">
            ${['All', 'North America', 'Europe', 'Asia-Pacific', 'Joined'].map(reg => `
              <button class="badge region-filter-btn ${regionFilter === reg ? 'badge-primary' : 'badge-neutral'}" data-reg="${reg}" style="cursor: pointer; padding: 0.45rem 0.9rem; font-size: 0.8rem; border-radius: var(--radius-full);">
                ${reg === 'Joined' ? `${icon('check', 12)} My Chapters (${joinedChapters.length})` : reg}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Chapters Grid -->
      <div class="grid grid-cols-2 gap-8">
        ${filteredChapters.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="color: var(--primary); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('mapPin', 54)}
            </div>
            <h3 style="margin-top: 0.5rem; font-size: 1.35rem; font-weight: 800;">No Chapters Found in this Filter</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 500px; margin-left: auto; margin-right: auto;">
              Can't find a chapter in your area? Be the founding lead for your city and connect alumni nearby!
            </p>
            <button class="btn btn-primary empty-launch-chapter-btn" style="margin-top: 1.25rem;">
              ${icon('plus', 16)} Form Chapter Here
            </button>
          </div>
        ` : filteredChapters.map(ch => `
          <div class="chapter-hero-card">
            <div class="chapter-banner-wrap">
              <img src="${ch.banner}" alt="${ch.name}" />
              <div class="chapter-banner-overlay">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                  <div>
                    <span class="badge" style="background: rgba(255,255,255,0.9); color: #0f172a; font-weight: 700; margin-bottom: 0.4rem;">
                      ${icon('mapPin', 12)} ${ch.city}, ${ch.country}
                    </span>
                    <h3 style="color: #fff; font-size: 1.35rem; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.6);">${ch.name}</h3>
                  </div>
                  <span class="badge" style="background: rgba(15,23,42,0.85); color: #fff; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2);">
                    ${icon('users', 12)} ${ch.membersCount} Alumni
                  </span>
                </div>
              </div>
            </div>

            <div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
              <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 1.25rem;">
                ${ch.description}
              </p>

              <!-- Chapter Key Focus Tags -->
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
                <span class="skill-chip">${icon('calendar', 11)} Quarterly Socials</span>
                <span class="skill-chip">${icon('briefcase', 11)} Local Job Referrals</span>
                <span class="skill-chip">${icon('users', 11)} New Relocation Help</span>
              </div>

              <!-- Chapter Leadership Bar -->
              <div style="background: var(--bg-card-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <div>
                  <span style="color: var(--text-muted); display: block; font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">Chapter President</span>
                  <strong style="color: var(--text-primary); font-size: 0.875rem;">${ch.lead}</strong>
                </div>
                <span class="badge ${ch.isJoined ? 'badge-success' : 'badge-neutral'}">
                  ${ch.isJoined ? `${icon('check', 11)} Member` : 'Open to Join'}
                </span>
              </div>

              <!-- Actions -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-light);">
                <button class="btn ${ch.isJoined ? 'btn-secondary' : 'btn-primary'} btn-sm toggle-chapter-btn" data-id="${ch.id}">
                  ${ch.isJoined ? `${icon('check', 14)} Joined Chapter` : `${icon('plus', 14)} Join Chapter`}
                </button>
                <a href="#events" class="btn btn-ghost btn-sm" style="font-size: 0.825rem; font-weight: 600;">
                  Upcoming Events →
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Hook listeners
    const searchInput = container.querySelector('#chapterSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderView();
      });
    }

    container.querySelectorAll('.region-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        regionFilter = btn.getAttribute('data-reg');
        renderView();
      });
    });

    container.querySelectorAll('.toggle-chapter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        store.toggleJoinChapter(id);
        const chapter = store.state.chapters.find(c => c.id === id);
        showToast(chapter.isJoined ? `Joined the ${chapter.name}!` : `Left ${chapter.name}`, chapter.isJoined ? 'success' : 'info');
        renderView();
      });
    });

    const topBtn = container.querySelector('#createChapterTopBtn');
    if (topBtn) topBtn.addEventListener('click', openCreateChapterModal);

    const emptyBtn = container.querySelector('.empty-launch-chapter-btn');
    if (emptyBtn) emptyBtn.addEventListener('click', openCreateChapterModal);
  }

  function openCreateChapterModal() {
    const modal = openModal({
      title: 'Establish New Regional Alumni Chapter',
      contentHtml: `
        <form id="createChapterForm">
          <div class="form-group">
            <label class="form-label">Chapter Name *</label>
            <input type="text" class="form-input" id="mChapName" placeholder="e.g. Greater Seattle Alumni Chapter" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">City *</label>
              <input type="text" class="form-input" id="mChapCity" placeholder="e.g. Seattle" required />
            </div>
            <div class="form-group">
              <label class="form-label">Country / State *</label>
              <input type="text" class="form-input" id="mChapCountry" placeholder="e.g. USA (WA)" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Chapter Lead / President</label>
            <input type="text" class="form-input" id="mChapLead" value="${store.getCurrentUser()?.name || ''}" placeholder="Your full name" required />
          </div>
          <div class="form-group">
            <label class="form-label">Mission Statement & Gathering Plan *</label>
            <textarea class="form-textarea" id="mChapDesc" placeholder="Describe the focus of the chapter, meeting frequency (e.g. monthly socials), and communication channel (e.g. Slack/WhatsApp)..." required></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" id="mChapCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Found Chapter</button>
          </div>
        </form>
      `,
      size: 'md'
    });

    modal.querySelector('#mChapCancel').addEventListener('click', closeModal);
    modal.querySelector('#createChapterForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modal.querySelector('#mChapName').value;
      const city = modal.querySelector('#mChapCity').value;
      const country = modal.querySelector('#mChapCountry').value;
      const lead = modal.querySelector('#mChapLead').value;
      const description = modal.querySelector('#mChapDesc').value;

      store.createChapter({ name, city, country, lead, description });
      closeModal();
      showToast('New regional chapter chartered successfully!', 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
