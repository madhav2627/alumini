// Community Discussion Feed matching Section 21 of alumini.md
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderCommunityPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.maxWidth = '840px';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  const categories = ['All', 'General', 'Career Advice', 'Achievements', 'Questions', 'Events'];
  let activeCategory = 'All';

  function renderView() {
    const posts = store.getPosts(activeCategory);
    const persona = store.getCurrentPersona();

    container.innerHTML = `
      <!-- Header -->
      <div style="margin-bottom: 2rem; text-align: center;">
        <span class="section-tag">Campus Discussions</span>
        <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Community Forum & Feed</h1>
        <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
          Share industry milestones, celebrate colleague promotions, ask technical questions, and stay engaged with university happenings.
        </p>
      </div>

      <!-- Create Post Box -->
      <div class="card" style="padding: 1.25rem; border-radius: var(--radius-xl); margin-bottom: 2rem;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <img src="${persona.avatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />
          <button id="triggerCreatePostBtn" class="search-bar" style="flex: 1; text-align: left; cursor: pointer; color: var(--text-muted); background: var(--bg-card-subtle);">
            Share an insight, achievement, or question with the alumni network...
          </button>
        </div>
      </div>

      <!-- Categories Pills -->
      <div class="tabs-nav feed-tabs-nav" style="margin-bottom: 2rem;">
        ${categories.map(c => `
          <button class="tab-btn ${activeCategory === c ? 'active' : ''} feed-cat-btn" data-cat="${c}">
            ${c}
          </button>
        `).join('')}
      </div>

      <!-- Feed Stream -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;" id="postsContainer">
        ${posts.length === 0 ? `
          <div class="card" style="padding: 4rem 2rem; text-align: center; border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="color: var(--accent-sky); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('messageSquare', 54)}
            </div>
            <h3 style="margin-top: 0.5rem; font-size: 1.35rem; font-weight: 800;">No Discussions Started Yet</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 480px; margin-left: auto; margin-right: auto;">
              Be the first to share an update, technical question, or career milestone with the community!
            </p>
            <button class="btn btn-primary empty-post-btn" style="margin-top: 1.25rem;">
              ${icon('plus', 16)} Start a Discussion
            </button>
          </div>
        ` : posts.map(post => `
          <div class="card" style="padding: 1.5rem; border-radius: var(--radius-xl);">
            <!-- Author Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <div style="display: flex; gap: 0.85rem; align-items: center;">
                <img src="${post.author.avatar}" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${post.author.name}</div>
                  <div style="font-size: 0.8rem; color: var(--primary); font-weight: 500;">${post.author.role}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${post.timeAgo} · Class of '${String(post.author.gradYear).slice(2)}</div>
                </div>
              </div>
              <span class="badge badge-neutral">${post.category}</span>
            </div>

            <!-- Content -->
            <p style="font-size: 0.925rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem; white-space: pre-line;">
              ${post.content}
            </p>

            ${post.image ? `
              <img src="${post.image}" style="width: 100%; max-height: 380px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 1rem;" />
            ` : ''}

            <!-- Post Action Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); padding: 0.6rem 0; margin-bottom: 1rem;">
              <div style="display: flex; gap: 1rem;">
                <button class="btn-ghost btn-sm like-post-btn" data-id="${post.id}" style="color: ${post.hasLiked ? 'var(--accent-rose)' : 'var(--text-muted)'}; display: flex; align-items: center; gap: 0.4rem;">
                  ${icon('heart', 16)} <strong>${post.likesCount}</strong> Likes
                </button>
                <button class="btn-ghost btn-sm toggle-comment-btn" data-id="${post.id}" style="display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted);">
                  ${icon('messageSquare', 16)} <strong>${(post.comments || []).length}</strong> Comments
                </button>
              </div>

              <button class="btn-icon toggle-save-post-btn" data-id="${post.id}" style="color: ${post.saved ? 'var(--primary)' : 'var(--text-muted)'};">
                ${icon('bookmark', 16)}
              </button>
            </div>

            <!-- Comments Section -->
            <div class="comments-section" id="comments-${post.id}">
              <!-- Existing comments -->
              <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
                ${(post.comments || []).map(c => `
                  <div style="background: var(--bg-card-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                      <strong style="color: var(--text-primary); font-size: 0.825rem;">${c.author}</strong>
                      <span style="font-size: 0.7rem; color: var(--text-muted);">${c.timeAgo}</span>
                    </div>
                    <p style="color: var(--text-secondary); line-height: 1.4;">${c.text}</p>
                  </div>
                `).join('')}
              </div>

              <!-- Add comment input -->
              <form class="add-comment-form" data-id="${post.id}" style="display: flex; gap: 0.5rem;">
                <input type="text" class="form-input comment-input" placeholder="Write a thoughtful comment..." style="font-size: 0.85rem; padding: 0.45rem 0.85rem;" required />
                <button type="submit" class="btn btn-primary btn-sm">Reply</button>
              </form>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Hook listeners: Category filter
    container.querySelectorAll('.feed-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeCategory = e.currentTarget.getAttribute('data-cat');
        renderView();
      });
    });

    // Like post
    container.querySelectorAll('.like-post-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        store.toggleLikePost(id);
        renderView();
      });
    });

    // Save post
    container.querySelectorAll('.toggle-save-post-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        store.toggleSavePost(id);
        showToast('Post bookmark updated!', 'info');
        renderView();
      });
    });

    // Add comment
    container.querySelectorAll('.add-comment-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const postId = form.getAttribute('data-id');
        const input = form.querySelector('.comment-input');
        store.addComment(postId, input.value);
        showToast('Comment posted!', 'success');
        renderView();
      });
    });

    // Create post trigger
    const trigger = container.querySelector('#triggerCreatePostBtn');
    if (trigger) {
      trigger.addEventListener('click', openCreatePostModal);
    }
    const emptyBtn = container.querySelector('.empty-post-btn');
    if (emptyBtn) {
      emptyBtn.addEventListener('click', openCreatePostModal);
    }
  }

  function openCreatePostModal() {
    const modal = openModal({
      title: 'Create a Community Post',
      contentHtml: `
        <form id="createPostForm">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="mPostCat">
              <option value="General">General Discussion</option>
              <option value="Career Advice">Career Advice & Guidance</option>
              <option value="Achievements">Alumni Milestones & Wins</option>
              <option value="Questions">Questions & Help Needed</option>
              <option value="Events">Campus Events & Meetups</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">What's on your mind? *</label>
            <textarea class="form-textarea" id="mPostText" rows="4" placeholder="Share technical tips, career learnings, or university memories..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Image URL (Optional)</label>
            <input type="url" class="form-input" id="mPostImg" placeholder="https://images.unsplash.com/..." />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
            <button type="button" class="btn btn-secondary" id="mPostCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Post</button>
          </div>
        </form>
      `,
      size: 'md'
    });

    modal.querySelector('#mPostCancel').addEventListener('click', closeModal);
    modal.querySelector('#createPostForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const cat = modal.querySelector('#mPostCat').value;
      const text = modal.querySelector('#mPostText').value;
      const img = modal.querySelector('#mPostImg').value || null;

      store.createPost({ category: cat, content: text, image: img });
      closeModal();
      showToast('Your post is now live on the community feed!', 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
