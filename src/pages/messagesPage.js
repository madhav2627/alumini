// Real-Time Direct Messaging System matching Section 19 & 20 of alumini.md
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';

export function renderMessagesPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2rem';
  container.style.paddingBottom = '4rem';

  let activeChatId = store.state.chats[0]?.id || 'c1';

  function renderView() {
    const chats = store.getChats();
    const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h1 style="font-size: 2rem; font-weight: 800;">Messages & Direct Mentorship</h1>
        <p style="font-size: 0.875rem; color: var(--text-secondary);">Direct private channels between alumni, mentors, and students.</p>
      </div>

      <div class="card chat-window" style="overflow: hidden; border-radius: var(--radius-xl); padding: 0;">
        <!-- Left Sidebar: Conversations List -->
        <div class="chat-sidebar" style="background: var(--bg-card); display: flex; flex-direction: column;">
          <div style="padding: 1.25rem; border-bottom: 1px solid var(--border-light);">
            <div class="search-bar" style="padding: 0.4rem 0.75rem;">
              ${icon('search', 16, 'text-muted')}
              <input type="text" placeholder="Search conversations..." style="font-size: 0.85rem;" />
            </div>
          </div>

          <div style="flex: 1; overflow-y: auto;">
            ${chats.length === 0 ? `
              <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                No conversations yet.<br />
                <a href="#alumni" style="color: var(--primary); font-weight: 600; display: inline-block; margin-top: 0.75rem;">
                  Find Alumni to Message →
                </a>
              </div>
            ` : chats.map(c => `
              <div class="chat-contact-item ${c.id === activeChatId ? 'active' : ''}" data-id="${c.id}" style="display: flex; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-light); cursor: pointer; transition: var(--transition); background: ${c.id === activeChatId ? 'var(--primary-light)' : 'transparent'};">
                <div style="position: relative;">
                  <img src="${c.contact.avatar}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />
                  <span style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: var(--accent-emerald); border-radius: 50%; border: 2px solid #fff;"></span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">${c.contact.name}</div>
                    <span style="font-size: 0.7rem; color: var(--text-muted);">${c.messages[c.messages.length - 1]?.time || ''}</span>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">${c.contact.role}</div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 0.15rem;">
                    ${c.messages[c.messages.length - 1]?.text || 'Started conversation'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right Pane: Active Chat Room -->
        <div class="chat-room-pane" style="background: var(--bg-card-subtle);">
          ${activeChat ? `
            <!-- Chat Header -->
            <div style="padding: 1rem 1.5rem; background: var(--bg-card); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="${activeChat.contact.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem;">${activeChat.contact.name}</div>
                  <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;">● Online · ${activeChat.contact.role}</div>
                </div>
              </div>

              <a href="#alumni" class="btn btn-secondary btn-sm">
                View Profile
              </a>
            </div>

            <!-- Messages Stream -->
            <div id="messagesStream" style="flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
              ${activeChat.messages.map(m => {
                const isMe = m.sender === 'me';
                return `
                  <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'};">
                    <div style="max-width: 68%; padding: 0.85rem 1.15rem; border-radius: var(--radius-lg); ${isMe ? 'background: var(--primary); color: #fff; border-bottom-right-radius: 2px;' : 'background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-color); border-bottom-left-radius: 2px;'} box-shadow: var(--shadow-xs);">
                      <div style="font-size: 0.9rem; line-height: 1.5;">${m.text}</div>
                      <div style="font-size: 0.68rem; margin-top: 0.35rem; text-align: right; opacity: 0.8;">${m.time}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Chat Input Footer -->
            <div style="padding: 1rem 1.5rem; background: var(--bg-card); border-top: 1px solid var(--border-color);">
              <form id="chatSendForm" style="display: flex; gap: 0.75rem;">
                <input type="text" id="chatInput" class="form-input" placeholder="Type a message to ${activeChat.contact.name.split(' ')[0]}..." autocomplete="off" required style="border-radius: var(--radius-full);" />
                <button type="submit" class="btn btn-primary" style="border-radius: var(--radius-full); padding: 0 1.25rem;">
                  ${icon('sparkles', 14)} Send
                </button>
              </form>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); padding: 2rem; text-align: center;">
              <div style="color: var(--primary); margin-bottom: 0.75rem;">
                ${icon('messageSquare', 48)}
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">Direct Mentorship Channels</h3>
              <p style="max-width: 360px; font-size: 0.875rem; margin-bottom: 1.25rem;">
                Connect with verified alumni or mentors in the directory to start a 1-on-1 private discussion.
              </p>
              <a href="#alumni" class="btn btn-primary btn-sm">
                Explore Alumni Directory
              </a>
            </div>
          `}
        </div>
      </div>
    `;

    // Contact switch
    container.querySelectorAll('.chat-contact-item').forEach(item => {
      item.addEventListener('click', (e) => {
        activeChatId = e.currentTarget.getAttribute('data-id');
        renderView();
      });
    });

    // Send message
    const form = container.querySelector('#chatSendForm');
    if (form) {
      const input = container.querySelector('#chatInput');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value;
        store.sendMessage(activeChatId, text);
        input.value = '';
        renderView();
        setTimeout(() => {
          const stream = container.querySelector('#messagesStream');
          if (stream) stream.scrollTop = stream.scrollHeight;
        }, 50);
      });
    }

    // Auto scroll to bottom
    setTimeout(() => {
      const stream = container.querySelector('#messagesStream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }, 50);
  }

  // Subscribe to store updates for incoming auto-replies
  const unsubscribe = store.subscribe(() => {
    if (window.location.hash.startsWith('#messages')) {
      renderView();
    }
  });

  renderView();
  return container;
}
