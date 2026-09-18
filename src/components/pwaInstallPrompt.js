// Dynamic App Installation & Setup Guide
// Displays download/install options in standard browsers (Chrome/Safari/Edge),
// but automatically suppresses them when running inside the installed app (Capacitor or PWA Standalone).

import { icon } from './icons.js';
import { openModal, closeModal } from './modal.js';

let deferredInstallPrompt = null;

/**
 * Detects if the current instance is running as an installed native application
 * (Capacitor Android/iOS, PWA Standalone window, or Android WebView wrapper).
 */
export function isRunningInApp() {
  if (typeof window === 'undefined') return false;

  // 1. Capacitor Native Platform (Android / iOS app container)
  if (window.Capacitor) {
    if (typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) {
      return true;
    }
    if (window.Capacitor.platform && window.Capacitor.platform !== 'web') {
      return true;
    }
  }

  // 2. Capacitor / Ionic custom scheme protocols
  if (window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:') {
    return true;
  }

  // 3. PWA Standalone / Fullscreen Display Mode (installed to home screen)
  if (window.matchMedia) {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
    if (isStandalone || isFullscreen || isMinimalUi) {
      return true;
    }
  }

  // 4. iOS Safari Standalone
  if (window.navigator && window.navigator.standalone === true) {
    return true;
  }

  // 5. Android TWA / WebAPK package referrer
  if (document.referrer && document.referrer.startsWith('android-app://')) {
    return true;
  }

  return false;
}

export function initPWAInstallPrompt() {
  // Never show installation prompts if already running as an installed app
  if (isRunningInApp()) {
    return;
  }

  // Capture beforeinstallprompt if browser fires it
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
}

export function openAppInstallModal() {
  // If browser already captured a native install prompt, trigger it
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        const banner = document.getElementById('pwaInstallBanner');
        if (banner) banner.remove();
      }
      deferredInstallPrompt = null;
    });
    return;
  }

  // Interactive step-by-step installation guide for Chrome & Safari
  openModal({
    title: 'Download & Install AlumniConnect App',
    size: 'md',
    contentHtml: `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div class="brand-icon" style="width: 58px; height: 58px; margin: 0 auto 0.75rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #fff; box-shadow: 0 4px 16px var(--primary-glow);">
          ${icon('graduationCap', 30)}
        </div>
        <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.25rem;">AlumniConnect App</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
          Fast, standalone full-screen experience with instant notifications.
        </p>
      </div>

      <!-- Installation Guide Steps -->
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="card" style="padding: 1rem 1.25rem; background: var(--bg-card-subtle); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            ${icon('smartphone', 18)} On Chrome (Android & Desktop):
          </div>
          <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
            <li>Click the <strong>three dots (⋮)</strong> menu in Chrome or the <strong>Install icon (⊕)</strong> in the address bar.</li>
            <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
            <li>Confirm <strong>Install</strong> to add the app icon to your device.</li>
          </ol>
        </div>

        <div class="card" style="padding: 1rem 1.25rem; background: var(--bg-card-subtle); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--secondary); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            ${icon('apple', 18)} On iPhone & iPad (Safari):
          </div>
          <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
            <li>Tap the <strong>Share button</strong> ${icon('share2', 13)} at the bottom bar.</li>
            <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (+).</li>
            <li>Tap <strong>Add</strong> in the top-right corner.</li>
          </ol>
        </div>
      </div>
    `,
    footerHtml: `
      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; width: 100%;">
        <button type="button" class="btn btn-secondary w-full" id="closeInstallGuideBtn">Got it!</button>
      </div>
    `
  });

  const closeBtn = document.getElementById('closeInstallGuideBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
}


