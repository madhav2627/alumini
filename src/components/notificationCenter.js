// Notification Center Modal / Drawer
import { icon } from './icons.js';
import { store } from '../data/store.js';
import { openModal, closeModal } from './modal.js';

export function openNotificationCenter() {
  const notifications = store.getNotifications();

  let notifsHtml = '';
  if (notifications.length === 0) {
    notifsHtml = `
      <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
        ${icon('bell', 36, 'text-muted')}
        <div style="margin-top: 0.5rem; font-weight: 600;">All caught up!</div>
        <div style="font-size: 0.85rem;">No new notifications at this time.</div>
      </div>
    `;
  } else {
    notifsHtml = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">${notifications.filter(n => n.unread).length} unread alerts</span>
        <button id="markAllReadBtn" class="btn btn-ghost btn-sm" style="color: var(--primary); font-size: 0.8rem;">
          ${icon('check', 14)} Mark all as read
        </button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
    `;

    notifications.forEach(n => {
      const typeIcon = n.type === 'mentorship' ? 'users' : n.type === 'job' ? 'briefcase' : n.type === 'event' ? 'calendar' : 'sparkles';
      notifsHtml += `
        <div class="card" style="padding: 0.85rem 1rem; border-radius: var(--radius-md); ${n.unread ? 'background: var(--primary-light); border-color: var(--primary-border);' : ''} display: flex; gap: 0.75rem; align-items: flex-start;">
          <div style="padding: 0.4rem; border-radius: 50%; background: var(--bg-card); color: var(--primary); box-shadow: var(--shadow-xs);">
            ${icon(typeIcon, 16)}
          </div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <div style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary);">${n.title}</div>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${n.timeAgo}</span>
            </div>
            <p style="font-size: 0.825rem; margin-top: 0.2rem; color: var(--text-secondary); line-height: 1.4;">${n.message}</p>
            ${n.link ? `<a href="${n.link}" class="notif-link" style="display: inline-block; margin-top: 0.35rem; font-size: 0.78rem; font-weight: 600; color: var(--primary);">View Details →</a>` : ''}
          </div>
        </div>
      `;
    });

    notifsHtml += `</div>`;
  }

  const modal = openModal({
    title: 'Notifications',
    contentHtml: notifsHtml,
    size: 'md'
  });

  const markBtn = modal.querySelector('#markAllReadBtn');
  if (markBtn) {
    markBtn.addEventListener('click', () => {
      store.markAllNotificationsRead();
      closeModal();
      // Re-render navbar
      window.location.reload();
    });
  }

  modal.querySelectorAll('.notif-link').forEach(link => {
    link.addEventListener('click', () => {
      closeModal();
    });
  });
}
