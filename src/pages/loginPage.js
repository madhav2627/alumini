// College ID Login Portal for Students, Alumni, Faculty & Administrators
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';

export function renderLoginPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.maxWidth = '540px';
  container.style.paddingTop = '3rem';
  container.style.paddingBottom = '4rem';

  const registeredUsers = store.state.registeredUsers || [];

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 2rem;">
      <div class="brand-icon" style="width: 52px; height: 52px; margin: 0 auto 1.25rem; font-size: 1.5rem;">
        ${icon('shield', 26)}
      </div>
      <span class="section-tag" style="margin-bottom: 0.5rem; display: inline-block;">University Authentication</span>
      <h1 style="font-size: 2.15rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem;">Sign in with College ID</h1>
      <p style="color: var(--text-secondary); font-size: 0.95rem;">
        Enter your official university Roll Number / College ID to access your common member dashboard.
      </p>
    </div>

    <!-- Login Card -->
    <div class="card card-premium wizard-card">
      <form id="collegeLoginForm">
        <!-- College ID Field -->
        <div class="form-group">
          <label class="form-label" for="loginCollegeId" style="display: flex; justify-content: space-between; align-items: center;">
            <span>College ID / Roll Number *</span>
            <span style="font-size: 0.725rem; color: var(--text-muted); font-weight: 500;">e.g. 21CS042 or UIT-2024-001</span>
          </label>
          <div style="position: relative;">
            <input 
              type="text" 
              class="form-input" 
              id="loginCollegeId" 
              placeholder="Enter your registered College ID" 
              required 
              autofocus 
              style="font-family: monospace; font-weight: 600; text-transform: uppercase; font-size: 0.95rem; letter-spacing: 0.05em;"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group" style="margin-top: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label class="form-label" for="loginPassword" style="margin-bottom: 0;">Password *</label>
          </div>
          <div style="position: relative;">
            <input 
              type="password" 
              class="form-input" 
              id="loginPassword" 
              placeholder="Enter your account password" 
              required 
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary w-full" id="loginSubmitBtn" style="padding: 0.75rem; font-size: 1rem; margin-top: 1.5rem; justify-content: center;">
          ${icon('logOut', 18)} Sign In to Dashboard
        </button>
      </form>
    </div>

    <!-- Registration Link Footer -->
    <div class="card" style="margin-top: 1.5rem; padding: 1.25rem; text-align: center; background: var(--bg-card-subtle);">
      <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">
        Don't have an account registered with your College ID? 
        <a href="#register" style="font-weight: 700; color: var(--primary); text-decoration: underline; margin-left: 0.35rem;">
          Register Now with College ID →
        </a>
      </p>
    </div>
  `;

  // Attach Form Submit
  const form = container.querySelector('#collegeLoginForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const collegeId = container.querySelector('#loginCollegeId').value;
    const password = container.querySelector('#loginPassword').value;

    const result = store.loginWithCollegeId(collegeId, password);
    if (result.success) {
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      window.location.hash = '#dashboard';
    } else {
      showToast(result.message, 'danger');
    }
  });

  return container;
}
