// Application Entry Point
import { initRouter } from './router.js';
import { store } from './data/store.js';
import { initPWAInstallPrompt } from './components/pwaInstallPrompt.js';

// Apply dark theme on initial load if stored
if (store.state.darkTheme) {
  document.body.classList.add('dark-theme');
}

// Initialize Router & PWA Install Prompt
initRouter();
initPWAInstallPrompt();

console.log('🚀 AlumniConnect initialized successfully. Mode: Mobile & Web App.');

