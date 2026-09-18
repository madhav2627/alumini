// Campus Polls & Community Surveys matching Section 25 of alumini.md - Enhanced UI
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderPollsPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.maxWidth = '840px';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  let filterMode = 'All';

  function renderView() {
    const allPolls = store.getPolls();
    const activePolls = allPolls.filter(p => p.status === 'Active');
    const votedCount = allPolls.filter(p => p.userVotedOption).length;
    const totalVotesCast = allPolls.reduce((sum, p) => sum + (p.totalVotes || 0), 0);

    const polls = allPolls.filter(p => {
      if (filterMode === 'Active') return p.status === 'Active';
      if (filterMode === 'Voted') return !!p.userVotedOption;
      return true;
    });

    container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="section-tag">Community Democracy</span>
          <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Alumni Polls & Surveys</h1>
          <p style="color: var(--text-secondary); max-width: 620px;">
            Cast your voice on university initiatives, upcoming alumni conventions, syllabus revisions, and campus projects.
          </p>
        </div>

        <button id="createPollTopBtn" class="btn btn-primary" style="box-shadow: 0 4px 14px var(--primary-glow);">
          ${icon('plus', 16)} Launch a Poll
        </button>
      </div>

      <!-- Quick KPI Stats Bar -->
      <div class="grid grid-cols-3 gap-4" style="margin-bottom: 2rem;">
        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
            ${icon('sparkles', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${activePolls.length}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">Live Polls</div>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-emerald-light); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center;">
            ${icon('checkCircle', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${totalVotesCast}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">Votes Cast</div>
          </div>
        </div>

        <div class="card" style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-lg);">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--accent-amber-light); color: var(--accent-amber); display: flex; align-items: center; justify-content: center;">
            ${icon('star', 22)}
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 800; line-height: 1;">${votedCount}</div>
            <div style="font-size: 0.775rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem;">My Participations</div>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem;">
        ${['All', 'Active', 'Voted'].map(tab => `
          <button class="badge poll-filter-btn ${filterMode === tab ? 'badge-primary' : 'badge-neutral'}" data-mode="${tab}" style="cursor: pointer; padding: 0.45rem 1rem; font-size: 0.825rem; border-radius: var(--radius-full);">
            ${tab === 'All' ? 'All Community Polls' : tab === 'Active' ? 'Active Polls' : `Voted by Me (${votedCount})`}
          </button>
        `).join('')}
      </div>

      <!-- Polls Stack -->
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        ${polls.length === 0 ? `
          <div style="text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="color: var(--primary); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('sparkles', 54)}
            </div>
            <h3 style="margin-top: 0.5rem; font-size: 1.35rem; font-weight: 800;">No Polls in this Category</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 480px; margin-left: auto; margin-right: auto;">
              Launch a community survey to gather insight on alumni reunions, campus speaker series, or networking events.
            </p>
            <button class="btn btn-primary empty-create-poll-btn" style="margin-top: 1.25rem;">
              ${icon('plus', 16)} Launch New Poll
            </button>
          </div>
        ` : polls.map(poll => `
          <div class="card card-premium" style="padding: 1.85rem; border-radius: var(--radius-xl);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; gap: 1rem;">
              <div>
                <span class="badge badge-primary" style="margin-bottom: 0.4rem; font-size: 0.725rem;">Campus Decision</span>
                <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${poll.question}</h3>
              </div>
              <span class="badge ${poll.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${poll.status}</span>
            </div>

            <!-- Options List -->
            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem;">
              ${poll.options.map(opt => {
                const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                const isSelected = poll.userVotedOption === opt.id;
                return `
                  <div class="poll-option-item ${isSelected ? 'voted' : ''}" data-poll-id="${poll.id}" data-opt-id="${opt.id}" style="padding: 0.95rem 1.15rem; border: 1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}; background: ${isSelected ? 'var(--primary-light)' : 'var(--bg-card-subtle)'}; border-radius: var(--radius-lg); cursor: pointer; position: relative; overflow: hidden; transition: var(--transition-smooth);">
                    <!-- Background progress bar -->
                    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${percent}%; background: ${isSelected ? 'hsla(234, 85%, 58%, 0.18)' : 'rgba(15, 23, 42, 0.05)'}; pointer-events: none; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);"></div>

                    <div style="position: relative; display: flex; justify-content: space-between; align-items: center; z-index: 1;">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; background: ${isSelected ? 'var(--primary)' : 'transparent'}; flex-shrink: 0; transition: var(--transition);">
                          ${isSelected ? `<span style="width: 6px; height: 6px; border-radius: 50%; background: #fff;"></span>` : ''}
                        </span>
                        <span style="font-weight: 600; font-size: 0.925rem; color: var(--text-primary);">${opt.text}</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 0.9rem; font-weight: 800; color: ${isSelected ? 'var(--primary)' : 'var(--text-primary)'};">
                          ${percent}%
                        </span>
                        <span style="font-size: 0.775rem; color: var(--text-muted);">
                          (${opt.votes} votes)
                        </span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Footer Details -->
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.825rem; color: var(--text-muted); border-top: 1px solid var(--border-light); padding-top: 1rem;">
              <span style="display: flex; align-items: center; gap: 0.35rem;">
                ${icon('users', 14)} Total Responses: <strong style="color: var(--text-primary);">${poll.totalVotes}</strong>
              </span>
              <span style="display: flex; align-items: center; gap: 0.35rem;">
                ${icon('calendar', 14)} Voting Ends: <strong style="color: var(--text-primary);">${poll.endsAt}</strong>
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Hook listeners
    container.querySelectorAll('.poll-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterMode = btn.getAttribute('data-mode');
        renderView();
      });
    });

    container.querySelectorAll('.poll-option-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const pollId = e.currentTarget.getAttribute('data-poll-id');
        const optId = e.currentTarget.getAttribute('data-opt-id');
        store.votePoll(pollId, optId);
        showToast('Your vote has been counted!', 'success');
        renderView();
      });
    });

    const topPollBtn = container.querySelector('#createPollTopBtn');
    if (topPollBtn) topPollBtn.addEventListener('click', openCreatePollModal);

    const emptyPollBtn = container.querySelector('.empty-create-poll-btn');
    if (emptyPollBtn) emptyPollBtn.addEventListener('click', openCreatePollModal);
  }

  function openCreatePollModal() {
    const modal = openModal({
      title: 'Launch Community Poll',
      contentHtml: `
        <form id="createPollForm">
          <div class="form-group">
            <label class="form-label">Poll Question *</label>
            <input type="text" class="form-input" id="mPollQ" placeholder="e.g. Which keynote topic would you prefer at Convocation 2026?" required />
          </div>
          <div class="form-group">
            <label class="form-label">Voting Options (one per line) *</label>
            <textarea class="form-textarea" id="mPollOpts" placeholder="Artificial Intelligence & Autonomous Systems&#10;Clean Tech & Renewable Energy Innovations&#10;Founder Journey: Seed to Series B&#10;Bioengineering & Personalized Medicine" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Voting Duration</label>
            <select class="form-select" id="mPollEnds">
              <option value="In 7 days">7 Days</option>
              <option value="In 14 days" selected>14 Days</option>
              <option value="In 30 days">30 Days</option>
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" id="mPollCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Community Poll</button>
          </div>
        </form>
      `,
      size: 'md'
    });

    modal.querySelector('#mPollCancel').addEventListener('click', closeModal);
    modal.querySelector('#createPollForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const question = modal.querySelector('#mPollQ').value;
      const rawOpts = modal.querySelector('#mPollOpts').value;
      const endsAt = modal.querySelector('#mPollEnds').value;

      const options = rawOpts.split('\n').map(s => s.trim()).filter(Boolean);
      if (options.length < 2) {
        showToast('Please provide at least 2 distinct voting options.', 'error');
        return;
      }

      store.createPoll({ question, options, endsAt });
      closeModal();
      showToast('Community poll successfully launched!', 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
