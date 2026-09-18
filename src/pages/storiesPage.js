// Alumni Success Stories & Spotlights matching Section 22 of alumini.md
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderStoriesPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  function renderView() {
    const stories = store.getStories();

    container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="section-tag">Alumni Journeys</span>
          <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Success Stories & Spotlights</h1>
          <p style="color: var(--text-secondary); max-width: 680px;">
            Inspirational journeys of graduates who went from campus laboratories to founding startups, leading tech giants, and creating global impact.
          </p>
        </div>

        <button id="shareStoryTopBtn" class="btn btn-primary">
          ${icon('award', 16)} Share Your Story
        </button>
      </div>

      <!-- Stories Grid -->
      <div class="grid grid-cols-3 gap-8">
        ${stories.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="color: var(--accent-amber); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('award', 54)}
            </div>
            <h3 style="margin-top: 0.5rem; font-size: 1.35rem; font-weight: 800;">No Success Stories Published Yet</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 500px; margin-left: auto; margin-right: auto;">
              Inspire current students and alumni by publishing the first feature story of your university journey and career achievements.
            </p>
            <button class="btn btn-primary empty-submit-story-btn" style="margin-top: 1.25rem;">
              ${icon('award', 16)} Share Your Story
            </button>
          </div>
        ` : stories.map(s => `
          <div class="card card-hover" style="display: flex; flex-direction: column; overflow: hidden; border-radius: var(--radius-xl);">
            <div style="position: relative; height: 200px;">
              <img src="${s.coverImage}" style="width: 100%; height: 100%; object-fit: cover;" alt="${s.title}" />
              <span class="badge badge-neutral" style="position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.7); color: #fff;">
                ${s.readTime}
              </span>
            </div>

            <div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
              <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.75rem;">
                <img src="${s.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                <div style="font-size: 0.8rem;">
                  <strong style="color: var(--text-primary);">${s.alumniName}</strong>
                  <span style="color: var(--text-muted);"> · Class of '${String(s.gradYear).slice(2)}</span>
                </div>
              </div>

              <h3 style="font-size: 1.2rem; font-weight: 800; line-height: 1.35; margin-bottom: 0.65rem; color: var(--text-primary);">
                ${s.title}
              </h3>

              <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem; flex: 1;">
                ${s.summary}
              </p>

              <button class="btn btn-outline-primary btn-sm w-full read-story-btn" data-id="${s.id}" style="margin-top: auto;">
                Read Full Journey ${icon('arrowRight', 14)}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Hook listeners
    container.querySelectorAll('.read-story-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openStoryArticleModal(id);
      });
    });

    const shareBtn = container.querySelector('#shareStoryTopBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', openSubmitStoryModal);
    }
    const emptyShareBtn = container.querySelector('.empty-submit-story-btn');
    if (emptyShareBtn) {
      emptyShareBtn.addEventListener('click', openSubmitStoryModal);
    }
  }

  function openStoryArticleModal(storyId) {
    const story = store.state.stories.find(s => s.id === storyId);
    if (!story) return;

    openModal({
      title: story.title,
      contentHtml: `
        <div>
          <img src="${story.coverImage}" style="width: 100%; height: 240px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 1.5rem;" />
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-light);">
            <img src="${story.avatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />
            <div>
              <div style="font-weight: 700; font-size: 1rem;">${story.alumniName}</div>
              <div style="font-size: 0.825rem; color: var(--primary); font-weight: 600;">${story.role} @ ${story.company} · Class of ${story.gradYear}</div>
            </div>
          </div>

          <div style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary);">
            <p style="margin-bottom: 1rem; font-weight: 500; color: var(--text-primary);">
              "${story.summary}"
            </p>
            <p style="margin-bottom: 1rem;">
              ${story.content}
            </p>
            <p style="margin-bottom: 1rem;">
              "University was the foundation of everything. The late-night debug sessions in the campus server lab and the professors who pushed us beyond the syllabus gave us the conviction that we could compete on the world stage."
            </p>
          </div>
        </div>
      `,
      size: 'lg'
    });
  }

  function openSubmitStoryModal() {
    const modal = openModal({
      title: 'Submit Your Alumni Story',
      contentHtml: `
        <form id="submitStoryForm">
          <div class="form-group">
            <label class="form-label">Story Headline *</label>
            <input type="text" class="form-input" id="mStoryTitle" placeholder="e.g. How My Campus Capstone Turned Into an AI Startup" required />
          </div>
          <div class="form-group">
            <label class="form-label">Brief Summary (1-2 sentences) *</label>
            <input type="text" class="form-input" id="mStorySummary" placeholder="Short hook describing your key achievement..." required />
          </div>
          <div class="form-group">
            <label class="form-label">Full Narrative Story *</label>
            <textarea class="form-textarea" id="mStoryContent" rows="6" placeholder="Describe your background at university, early career challenges, the pivotal breakthrough, and words of wisdom for current students..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Cover Photo URL (Optional)</label>
            <input type="url" class="form-input" id="mStoryImage" placeholder="https://..." />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
            <button type="button" class="btn btn-secondary" id="mStoryCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Story</button>
          </div>
        </form>
      `,
      size: 'md'
    });

    modal.querySelector('#mStoryCancel').addEventListener('click', closeModal);
    modal.querySelector('#submitStoryForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = modal.querySelector('#mStoryTitle').value;
      const summary = modal.querySelector('#mStorySummary').value;
      const content = modal.querySelector('#mStoryContent').value;
      const coverImage = modal.querySelector('#mStoryImage').value || undefined;

      store.submitStory({ title, summary, content, coverImage });
      closeModal();
      showToast('Your success story has been published!', 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
