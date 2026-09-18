// Account Settings & Profile Configuration matching Section 28 of alumini.md - Enhanced UI
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderSettingsPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.maxWidth = '840px';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  let activeTab = 'profile';

  function renderView() {
    const persona = store.getCurrentPersona();

    container.innerHTML = `
      <!-- Header -->
      <div style="margin-bottom: 2rem;">
        <span class="section-tag">Account Preferences</span>
        <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Settings & Preferences</h1>
        <p style="color: var(--text-secondary);">
          Manage your verified credentials, directory discovery preferences, notification channels, and data controls.
        </p>
      </div>

      <!-- Account Overview Banner -->
      <div class="card card-premium" style="margin-bottom: 2rem; padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem;">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div style="position: relative;">
            <img id="profileAvatarImg" src="${persona.avatar}" style="width: 76px; height: 76px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-border); box-shadow: var(--shadow-md);" />
            <button type="button" id="changeAvatarBtn" title="Change Avatar" style="position: absolute; bottom: 0; right: 0; width: 26px; height: 26px; border-radius: 50%; background: var(--primary); color: #fff; border: 2px solid var(--bg-card); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition);">
              ${icon('sparkles', 12)}
            </button>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h2 style="font-size: 1.25rem; font-weight: 800;">${persona.name}</h2>
              <span class="badge badge-success">${icon('shield', 11)} Active</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">${persona.title || persona.role} · ${persona.department}</div>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.4rem; align-items: center;">
              <span class="badge badge-primary">Role: ${store.state.currentRole.toUpperCase()}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">ID: #ALU-2024-${persona.id.slice(0, 4)}</span>
            </div>
          </div>
        </div>

        <!-- Profile Completeness Indicator -->
        <div style="min-width: 180px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.35rem;">
            <span>Profile Completeness</span>
            <span style="color: var(--accent-emerald);">92%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 92%; background: linear-gradient(90deg, var(--primary), var(--accent-emerald));"></div>
          </div>
          <div style="font-size: 0.725rem; color: var(--text-muted); margin-top: 0.35rem;">
            Add graduation project to reach 100%
          </div>
        </div>
      </div>

      <!-- Settings Navigation Tabs -->
      <div class="settings-nav-tabs">
        <button class="settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}" data-target="profile">
          ${icon('user', 16)} Profile & Credentials
        </button>
        <button class="settings-tab-btn ${activeTab === 'privacy' ? 'active' : ''}" data-target="privacy">
          ${icon('shield', 16)} Privacy & Visibility
        </button>
        <button class="settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}" data-target="notifications">
          ${icon('bell', 16)} Notifications
        </button>
        <button class="settings-tab-btn ${activeTab === 'data' ? 'active' : ''}" data-target="data">
          ${icon('sparkles', 16)} Data & Backup
        </button>
      </div>

      <!-- Tab Content Panels -->
      <div id="settingsTabContent">
        <!-- Panel 1: Profile & Credentials -->
        <div id="panel-profile" style="display: ${activeTab === 'profile' ? 'block' : 'none'};">
          <form id="settingsProfileForm">
            <div class="card" style="padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 1.75rem;">
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
                ${icon('user', 18, 'primary')} Personal Identity
              </h3>

              <div class="form-group">
                <label class="form-label">Full Legal or Preferred Name</label>
                <input type="text" class="form-input" id="setFullName" value="${persona.name}" required />
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">Verified Contact Email</label>
                  <input type="email" class="form-input" id="setEmail" value="${persona.email}" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Professional Headline / Role</label>
                  <input type="text" class="form-input" id="setTitle" value="${persona.title || persona.role}" />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">Department / Faculty</label>
                  <input type="text" class="form-input" value="${persona.department}" readonly style="background: var(--bg-card-subtle);" />
                </div>
                <div class="form-group">
                  <label class="form-label">Graduation Cohort</label>
                  <input type="text" class="form-input" value="${persona.gradYear || '2021'}" readonly style="background: var(--bg-card-subtle);" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Short Bio / Overview</label>
                <textarea class="form-textarea" id="setBio" placeholder="Tell the community about your journey, interests, and how you can help current students...">${persona.bio || ''}</textarea>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-light);">
                <button type="submit" class="btn btn-primary">
                  ${icon('check', 16)} Save Profile Changes
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Panel 2: Privacy & Visibility -->
        <div id="panel-privacy" style="display: ${activeTab === 'privacy' ? 'block' : 'none'};">
          <div class="card" style="padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 1.75rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon('shield', 18, 'primary')} Directory Discovery & Visibility
            </h3>

            <div class="setting-item-row">
              <div class="setting-item-info">
                <span class="setting-item-title">Public Alumni Directory Listing</span>
                <span class="setting-item-desc">Allow students, verified alumni, and faculty to find your profile card in directory searches.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="prefDirVis" checked />
                <span class="toggle-track"></span>
              </label>
            </div>

            <div class="setting-item-row">
              <div class="setting-item-info">
                <span class="setting-item-title">Display Personal Email on Public Profile</span>
                <span class="setting-item-desc">When disabled, community members must message you through internal AlumniConnect chat.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="prefShowEmail" />
                <span class="toggle-track"></span>
              </label>
            </div>

            <div class="setting-item-row">
              <div class="setting-item-info">
                <span class="setting-item-title">Direct Messaging Requests</span>
                <span class="setting-item-desc">Permit students and peers to initiate 1-on-1 networking conversations with you.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="prefAcceptMessages" checked />
                <span class="toggle-track"></span>
              </label>
            </div>

            <div class="setting-item-row">
              <div class="setting-item-info">
                <span class="setting-item-title">Show Career Journey on Alumni Map</span>
                <span class="setting-item-desc">Display your current city pin on regional chapter map visualizations.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="prefShowCity" checked />
                <span class="toggle-track"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Panel 3: Notifications -->
        <div id="panel-notifications" style="display: ${activeTab === 'notifications' ? 'block' : 'none'};">
          <div class="card" style="padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 1.75rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon('bell', 18, 'primary')} Notification Channels
            </h3>

            <div class="setting-item-row">
              <div class="setting-item-info">
                <span class="setting-item-title">Job Board & Alumni Referrals</span>
                <span class="setting-item-desc">Immediate notifications when new opportunities matching your discipline are posted.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked />
                <span class="toggle-track"></span>
              </label>
            </div>

            <div class="setting-item-row">
              <div class="setting-item-info">
                <span class="setting-item-title">Reunion & Chapter Meetup Reminders</span>
                <span class="setting-item-desc">Receive RSVP reminders and calendar updates for events in your region.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked />
                <span class="toggle-track"></span>
              </label>
            </div>

            <div class="setting-item-row">
              <div class="setting-item-info">
                <span class="setting-item-title">Mentorship Inquiries & Requests</span>
                <span class="setting-item-desc">Alerts when aspiring students submit a guidance request to your inbox.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked />
                <span class="toggle-track"></span>
              </label>
            </div>

            <div class="setting-item-row">
              <div class="setting-item-info">
                <span class="setting-item-title">Weekly Alumni Digest</span>
                <span class="setting-item-desc">A curated summary of notable graduate achievements and campus developments.</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" />
                <span class="toggle-track"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Panel 4: Data & Backup -->
        <div id="panel-data" style="display: ${activeTab === 'data' ? 'block' : 'none'};">
          <div class="card" style="padding: 1.75rem; border-radius: var(--radius-xl); margin-bottom: 1.75rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon('download', 18, 'primary')} Data Portability & Backup
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
              Download a complete offline copy of your alumni records, job postings, mentorship threads, and chapters.
            </p>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button type="button" id="exportDataBtn" class="btn btn-secondary">
                ${icon('download', 16)} Export Complete Database (JSON)
              </button>
              <label class="btn btn-secondary" style="cursor: pointer; margin-bottom: 0;">
                ${icon('upload', 16)} Import Database (JSON)
                <input type="file" id="importDataInput" accept=".json" style="display: none;" />
              </label>
            </div>
          </div>

          <!-- Danger Zone Card -->
          <div class="card-danger-zone">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                  <span class="badge badge-danger">${icon('shield', 12)} Danger Zone</span>
                  <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--accent-rose);">Reset Database to Clean Slate</h4>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 520px; line-height: 1.5;">
                  Permanently purge all mock alumni, job postings, community discussions, and campaign pledges back to zero. This cannot be undone.
                </p>
              </div>

              <button type="button" id="resetDataFreshBtn" class="btn btn-secondary" style="color: var(--accent-rose); border-color: hsla(348, 83%, 58%, 0.4); font-weight: 700;">
                ${icon('trash', 16)} Clean Reset Database
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook tab switches
    container.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-target');
        container.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        ['profile', 'privacy', 'notifications', 'data'].forEach(tabName => {
          const panel = container.querySelector(`#panel-${tabName}`);
          if (panel) panel.style.display = tabName === activeTab ? 'block' : 'none';
        });
      });
    });

    // Profile form submit
    const pForm = container.querySelector('#settingsProfileForm');
    if (pForm) {
      pForm.addEventListener('submit', (e) => {
        e.preventDefault();
        persona.name = container.querySelector('#setFullName').value;
        persona.email = container.querySelector('#setEmail').value;
        persona.title = container.querySelector('#setTitle').value;
        persona.bio = container.querySelector('#setBio').value;
        store.saveState();
        showToast('Profile and credentials updated successfully!', 'success');
        renderView();
      });
    }

    // Avatar change dialog
    const avatarBtn = container.querySelector('#changeAvatarBtn');
    if (avatarBtn) {
      avatarBtn.addEventListener('click', () => {
        const avatars = [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'
        ];

        const m = openModal({
          title: 'Select Profile Photo',
          contentHtml: `
            <div>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
                Select an avatar below or provide a custom image URL.
              </p>
              <div class="avatar-selection-grid">
                ${avatars.map(url => `
                  <div class="avatar-option" data-url="${url}" style="cursor: pointer; border-radius: var(--radius-lg); overflow: hidden; border: 2px solid transparent; transition: var(--transition);">
                    <img src="${url}" style="width: 100%; height: 90px; object-fit: cover; display: block;" />
                  </div>
                `).join('')}
              </div>
              <div class="form-group">
                <label class="form-label">Or Custom Image URL</label>
                <input type="url" class="form-input" id="customAvatarUrl" placeholder="https://example.com/photo.jpg" />
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button type="button" class="btn btn-secondary" id="closeAvatarModal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveAvatarModal">Apply Avatar</button>
              </div>
            </div>
          `,
          size: 'sm'
        });

        let selected = persona.avatar;
        m.querySelectorAll('.avatar-option').forEach(opt => {
          opt.addEventListener('click', () => {
            m.querySelectorAll('.avatar-option').forEach(o => o.style.borderColor = 'transparent');
            opt.style.borderColor = 'var(--primary)';
            selected = opt.getAttribute('data-url');
          });
        });

        m.querySelector('#closeAvatarModal').addEventListener('click', closeModal);
        m.querySelector('#saveAvatarModal').addEventListener('click', () => {
          const custom = m.querySelector('#customAvatarUrl').value.trim();
          persona.avatar = custom || selected;
          store.saveState();
          closeModal();
          showToast('Profile photo updated!', 'success');
          renderView();
        });
      });
    }

    // Toggle switch toasts
    container.querySelectorAll('.toggle-switch input').forEach(toggle => {
      toggle.addEventListener('change', () => {
        showToast('Preference updated and saved.', 'info');
      });
    });

    // Reset fresh confirmation modal
    container.querySelector('#resetDataFreshBtn').addEventListener('click', () => {
      const confirmModal = openModal({
        title: 'Confirm Clean Slate Reset',
        contentHtml: `
          <div>
            <div style="color: var(--accent-rose); display: flex; justify-content: center; margin-bottom: 1rem;">
              ${icon('trash', 48)}
            </div>
            <h4 style="text-align: center; font-weight: 800; font-size: 1.15rem; margin-bottom: 0.5rem;">Erase all platform records?</h4>
            <p style="text-align: center; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.5rem;">
              This operation clears all alumni members, postings, donations, and chapter memberships back to an initial empty state.
            </p>
            <div style="display: flex; justify-content: center; gap: 0.75rem;">
              <button class="btn btn-secondary" id="cancelResetBtn">Keep My Data</button>
              <button class="btn btn-primary" id="confirmResetBtn" style="background: var(--accent-rose); border-color: var(--accent-rose);">
                Yes, Reset All Data
              </button>
            </div>
          </div>
        `,
        size: 'sm'
      });

      confirmModal.querySelector('#cancelResetBtn').addEventListener('click', closeModal);
      confirmModal.querySelector('#confirmResetBtn').addEventListener('click', () => {
        store.resetDatabase();
        closeModal();
        showToast('All records cleared to clean slate!', 'success');
        window.location.hash = '#home';
      });
    });

    // Export Data JSON
    container.querySelector('#exportDataBtn').addEventListener('click', () => {
      const dataStr = store.exportDataJSON();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alumniconnect_data_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Database exported successfully as JSON!', 'success');
    });

    // Import Data JSON
    container.querySelector('#importDataInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const success = store.importDataJSON(evt.target.result);
        if (success) {
          showToast('Data imported successfully!', 'success');
          renderView();
        } else {
          showToast('Failed to parse JSON file. Please check format.', 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  renderView();
  return container;
}
