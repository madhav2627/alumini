// Rich LinkedIn-Style Alumni Profile Modal - Enhanced UI
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { openModal, closeModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function openAlumniProfile(alumniId) {
  const alum = store.getAlumniById(alumniId);
  if (!alum) return;

  const isSaved = store.state.savedAlumniIds.includes(alum.id);
  const isConnected = store.state.connections.includes(alum.id);

  const bannerImg = alum.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

  const content = `
    <div style="margin: -1.5rem -1.5rem 1.5rem -1.5rem; position: relative;">
      <!-- Banner -->
      <div style="height: 150px; background-image: url('${bannerImg}'); background-size: cover; background-position: center; border-radius: var(--radius-xl) var(--radius-xl) 0 0; position: relative;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);"></div>
      </div>
      
      <!-- Avatar & Quick Actions -->
      <div style="padding: 0 1.5rem; display: flex; justify-content: space-between; align-items: flex-end; margin-top: -50px; position: relative; z-index: 2;">
        <div style="position: relative;">
          <img src="${alum.avatar}" alt="${alum.name}" style="width: 96px; height: 96px; border-radius: 50%; border: 4px solid var(--bg-card); object-fit: cover; box-shadow: var(--shadow-lg);" />
          <span style="position: absolute; bottom: 6px; right: 6px; width: 16px; height: 16px; background: var(--accent-emerald); border-radius: 50%; border: 3px solid var(--bg-card);" title="Active Member"></span>
        </div>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <button id="modalConnectBtn" class="btn ${isConnected ? 'btn-secondary' : 'btn-primary'} btn-sm" style="box-shadow: 0 2px 8px var(--primary-glow);">
            ${isConnected ? icon('check', 14) + ' Connected' : icon('users', 14) + ' Connect'}
          </button>
          ${alum.availableForMentorship ? `
            <button id="modalMentorBtn" class="btn btn-outline-primary btn-sm">
              ${icon('sparkles', 14)} Request Guidance
            </button>
          ` : ''}
          <button id="modalSaveBtn" class="btn btn-secondary btn-sm" title="Bookmark profile">
            ${icon('bookmark', 14)} ${isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Header Details -->
    <div style="margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <h2 style="font-size: 1.5rem; font-weight: 800;">${alum.name}</h2>
        <span class="badge badge-success">${icon('shield', 12)} Verified Alum</span>
        ${alum.availableForMentorship ? '<span class="badge badge-primary"><span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--primary); margin-right: 2px;"></span> Open to Mentor</span>' : ''}
      </div>
      <p style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-top: 0.25rem;">
        ${alum.role} at <span style="color: var(--primary); font-weight: 700;">${alum.company}</span>
      </p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.825rem; color: var(--text-muted); margin-top: 0.5rem;">
        <span>${icon('mapPin', 13)} ${alum.location}</span>
        <span>${icon('graduationCap', 13)} Class of ${alum.gradYear} (${alum.department})</span>
        <span style="color: var(--accent-amber); font-weight: 600;">${icon('star', 13)} ${alum.rating || '5.0'} (${alum.menteesCount || 12}+ mentees guided)</span>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="profile-modal-stats-grid">
      <div>
        <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">${alum.gradYear ? (2026 - parseInt(alum.gradYear)) + ' Yrs' : '5+ Yrs'}</div>
        <div style="font-size: 0.725rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Experience</div>
      </div>
      <div style="border-left: 1px solid var(--border-color); border-right: 1px solid var(--border-color);">
        <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-emerald);">${alum.menteesCount || 14}</div>
        <div style="font-size: 0.725rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Students Mentored</div>
      </div>
      <div>
        <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">${(alum.skills || []).length * 8}+</div>
        <div style="font-size: 0.725rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Peer Endorsements</div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs-nav" id="profileTabs">
      <button class="tab-btn active" data-tab="about">${icon('user', 14)} About</button>
      <button class="tab-btn" data-tab="experience">${icon('briefcase', 14)} Experience</button>
      <button class="tab-btn" data-tab="education">${icon('graduationCap', 14)} Education</button>
      <button class="tab-btn" data-tab="mentorship">${icon('sparkles', 14)} Mentorship</button>
      <button class="tab-btn" data-tab="skills">${icon('checkCircle', 14)} Competencies</button>
    </div>

    <!-- Tab Panels -->
    <div id="profileTabPanels">
      <!-- About Tab -->
      <div class="tab-panel active" id="tab-about">
        <p style="font-size: 0.925rem; line-height: 1.65; color: var(--text-secondary); margin-bottom: 1.5rem;">
          ${alum.bio || 'Experienced engineering leader and dedicated university alumnus passionate about fostering the next wave of innovators, software developers, and research pioneers.'}
        </p>

        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.6rem;">Focus Areas</h4>
        <div class="skills-row" style="margin-bottom: 1.5rem;">
          ${(alum.skills || []).map(s => `<span class="skill-chip">${s}</span>`).join('')}
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.6rem;">Social & Professional Profiles</h4>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="https://linkedin.com" target="_blank" class="btn btn-secondary btn-sm">${icon('externalLink', 14)} Verified LinkedIn</a>
          <a href="https://github.com" target="_blank" class="btn btn-secondary btn-sm">${icon('externalLink', 14)} Open Source GitHub</a>
        </div>
      </div>

      <!-- Experience Tab -->
      <div class="tab-panel" id="tab-experience" style="display: none;">
        <div class="timeline-stepper">
          <div class="timeline-step">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-weight: 800; font-size: 1rem; color: var(--text-primary);">${alum.role}</div>
                <div style="font-size: 0.875rem; color: var(--primary); font-weight: 700;">${alum.company}</div>
              </div>
              <span class="badge badge-primary">Current Role</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin: 0.2rem 0 0.5rem;">2022 - Present · Full-time</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              Leading high-impact initiatives, driving technical roadmaps, and mentoring emerging college talent across engineering teams.
            </p>
          </div>

          <div class="timeline-step">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary);">Senior Software Associate</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 600;">Global Tech Labs</div>
              </div>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin: 0.2rem 0 0.5rem;">${alum.gradYear} - 2022 · 2 Years</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
              Architected cloud-native services, automated deployment pipelines, and participated as campus hiring interviewer.
            </p>
          </div>
        </div>
      </div>

      <!-- Education Tab -->
      <div class="tab-panel" id="tab-education" style="display: none;">
        <div class="card" style="padding: 1.25rem; background: var(--bg-card-subtle); border-radius: var(--radius-lg); margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-weight: 800; font-size: 1rem;">University Institute of Technology</div>
              <div style="font-size: 0.875rem; color: var(--primary); font-weight: 700;">${alum.degree || 'Bachelor of Technology'}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0 0.6rem;">Graduation Class: ${alum.gradYear} · Department of ${alum.department}</div>
            </div>
            <span class="badge badge-success">${icon('shield', 11)} Verified Degree</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            Graduated with First Class Distinction. Member of the University Robotics Society and Student Academic Council.
          </p>
        </div>
      </div>

      <!-- Mentorship Tab -->
      <div class="tab-panel" id="tab-mentorship" style="display: none;">
        ${alum.availableForMentorship ? `
          <div style="margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span class="badge badge-success">${icon('sparkles', 11)} Active Mentor</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Avg Response Time: &lt; 24 hrs</span>
            </div>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">
              ${alum.name} has mentored ${alum.menteesCount || 12} current students through career transitions, interview mockups, and resume enhancements:
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
              ${(alum.mentorshipTopics || ['Career Strategy', 'Technical Interview Prep', 'Resume Polish']).map(t => `
                <span class="badge badge-primary" style="font-size: 0.825rem; padding: 0.4rem 0.85rem;">${icon('checkCircle', 12)} ${t}</span>
              `).join('')}
            </div>
            <button id="modalMentorshipRequestBtn" class="btn btn-primary btn-sm" style="box-shadow: 0 4px 12px var(--primary-glow);">
              ${icon('sparkles', 14)} Send Mentorship Inquiry
            </button>
          </div>
        ` : `
          <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            ${icon('users', 36, 'text-muted')}
            <div style="font-weight: 700; margin-top: 0.5rem; font-size: 1rem;">Not currently accepting new mentees</div>
            <div style="font-size: 0.85rem; margin-top: 0.2rem;">You can still connect or save this profile for future alumni events.</div>
          </div>
        `}
      </div>

      <!-- Skills Tab -->
      <div class="tab-panel" id="tab-skills" style="display: none;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${(alum.skills || ['System Architecture', 'Modern Web Tech', 'Cloud Engineering', 'Team Mentoring']).map((skill, idx) => {
            const pct = 95 - (idx * 6);
            return `
              <div class="skill-bar-row">
                <div class="skill-bar-header">
                  <span>${skill}</span>
                  <span style="color: var(--primary);">${pct}% Proficiency · ${15 + idx * 4} Endorsements</span>
                </div>
                <div class="progress-bar" style="height: 6px;">
                  <div class="progress-fill" style="width: ${pct}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  const modal = openModal({
    title: `${alum.name} · Verified Profile`,
    contentHtml: content,
    size: 'lg'
  });

  // Tab switching logic
  const tabs = modal.querySelectorAll('#profileTabs .tab-btn');
  const panels = modal.querySelectorAll('#profileTabPanels .tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      panels.forEach(p => {
        p.style.display = p.id === `tab-${target}` ? 'block' : 'none';
      });
    });
  });

  // Connect button
  const connectBtn = modal.querySelector('#modalConnectBtn');
  if (connectBtn) {
    connectBtn.addEventListener('click', () => {
      if (store.state.connections.includes(alum.id)) {
        store.state.connections = store.state.connections.filter(id => id !== alum.id);
        connectBtn.innerHTML = `${icon('users', 14)} Connect`;
        connectBtn.className = 'btn btn-primary btn-sm';
        showToast(`Disconnected from ${alum.name}`, 'info');
      } else {
        store.state.connections.push(alum.id);
        connectBtn.innerHTML = `${icon('check', 14)} Connected`;
        connectBtn.className = 'btn btn-secondary btn-sm';
        showToast(`Connected with ${alum.name}!`, 'success');
      }
      store.saveState();
    });
  }

  // Save button
  const saveBtn = modal.querySelector('#modalSaveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      store.toggleSaveAlumni(alum.id);
      const nowSaved = store.state.savedAlumniIds.includes(alum.id);
      saveBtn.innerHTML = `${icon('bookmark', 14)} ${nowSaved ? 'Saved' : 'Save'}`;
      showToast(nowSaved ? 'Alumni profile bookmarked!' : 'Removed from bookmarks', 'info');
    });
  }

  // Mentorship request button
  const mentorBtn = modal.querySelector('#modalMentorBtn') || modal.querySelector('#modalMentorshipRequestBtn');
  if (mentorBtn) {
    mentorBtn.addEventListener('click', () => {
      closeModal();
      openMentorshipRequestModal(alum);
    });
  }
}

// Sub-modal: Send Mentorship Request
export function openMentorshipRequestModal(alum) {
  const content = `
    <div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; padding: 0.85rem; background: var(--bg-card-subtle); border-radius: var(--radius-lg); border-left: 4px solid var(--primary);">
        <img src="${alum.avatar}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-border);" />
        <div>
          <div style="font-weight: 800; font-size: 1rem;">Mentorship Request for ${alum.name}</div>
          <div style="font-size: 0.825rem; color: var(--text-muted);">${alum.role} at ${alum.company}</div>
        </div>
      </div>

      <form id="mentorshipForm">
        <div class="form-group">
          <label class="form-label">Mentorship Discussion Topic *</label>
          <select class="form-select" id="reqTopic" required>
            ${(alum.mentorshipTopics || ['General Career Guidance']).map(t => `<option value="${t}">${t}</option>`).join('')}
            <option value="Resume & Portfolio Review">Resume & Portfolio Review</option>
            <option value="System Design & Technical Prep">System Design & Technical Prep</option>
            <option value="Transitioning into Unicorns / Big Tech">Transitioning into Unicorns / Big Tech</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Your Immediate Career Goal *</label>
          <input type="text" class="form-input" id="reqGoal" placeholder="e.g. Preparing for full-stack engineering placements in 2025" required />
        </div>

        <div class="form-group">
          <label class="form-label">Personal Intro & Specific Questions *</label>
          <textarea class="form-textarea" id="reqMsg" placeholder="Introduce your background, why you reached out to ${alum.name.split(' ')[0]}, and 2-3 specific topics you want advice on..." required></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" id="reqCancelBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">Send Mentorship Request</button>
        </div>
      </form>
    </div>
  `;

  const modal = openModal({
    title: 'Request Alumni Mentorship',
    contentHtml: content,
    size: 'md'
  });

  modal.querySelector('#reqCancelBtn').addEventListener('click', closeModal);

  modal.querySelector('#mentorshipForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const topic = modal.querySelector('#reqTopic').value;
    const goal = modal.querySelector('#reqGoal').value;
    const msg = modal.querySelector('#reqMsg').value;

    store.sendMentorshipRequest({
      mentorId: alum.id,
      mentorName: alum.name,
      topic,
      careerGoal: goal,
      message: msg
    });

    closeModal();
    showToast(`Mentorship request successfully sent to ${alum.name}!`, 'success');
  });
}
