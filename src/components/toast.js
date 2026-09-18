// Elegant Toast Notification System
import { icon } from './icons.js';

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'success', duration = 3500) {
  const container = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconName = type === 'success' ? 'checkCircle' : type === 'error' ? 'x' : 'sparkles';
  const iconColor = type === 'success' ? 'var(--accent-emerald)' : type === 'error' ? 'var(--accent-rose)' : 'var(--primary)';

  toast.innerHTML = `
    <span style="color: ${iconColor}; display: flex; align-items: center;">
      ${icon(iconName, 20)}
    </span>
    <span style="flex: 1; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
