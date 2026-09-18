// Universal Accessible Modal Manager
import { icon } from './icons.js';

let activeOverlay = null;

export function openModal({ title, contentHtml, footerHtml = '', size = 'md', onClose = null }) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const sizeClass = size === 'lg' ? 'modal-lg' : size === 'sm' ? 'modal-sm' : '';

  overlay.innerHTML = `
    <div class="modal-container ${sizeClass}">
      <div class="modal-header">
        <h3 style="font-size: 1.15rem; font-weight: 700;">${title}</h3>
        <button class="modal-close-btn" aria-label="Close modal">
          ${icon('x', 20)}
        </button>
      </div>
      <div class="modal-body">
        ${contentHtml}
      </div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;

  // Close handlers
  const closeBtn = overlay.querySelector('.modal-close-btn');
  closeBtn.addEventListener('click', () => {
    closeModal();
    if (onClose) onClose();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
      if (onClose) onClose();
    }
  });

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (onClose) onClose();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  activeOverlay = overlay;

  return overlay;
}

export function closeModal() {
  if (activeOverlay) {
    activeOverlay.remove();
    activeOverlay = null;
    document.body.style.overflow = '';
  }
}
