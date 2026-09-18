// 5-Step Member Registration Wizard with College ID & Account Credentials
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';

export function renderRegisterPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.maxWidth = '780px';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  let currentStep = 1;
  const formData = {
    role: 'student',
    studentId: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Prefer not to say',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech in Computer Science',
    gradYear: 2025,
    company: '',
    jobRole: '',
    industry: 'Technology',
    experienceYears: 1,
    location: 'Campus City',
    skills: ['Python', 'Problem Solving', 'Teamwork'],
    availableForMentorship: true,
    mentorshipTopics: ['Career Guidance', 'Interview Prep']
  };

  function renderWizard() {
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 2rem;">
        <span class="section-tag">Join the Community</span>
        <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">University Member Registration</h1>
        <p style="color: var(--text-secondary);">
          Register using your official College ID / Roll Number to access the common member dashboard and university network.
        </p>
      </div>

      <!-- Step Indicator -->
      <div class="wizard-steps">
        <div class="wizard-step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}" data-step="1">
          <div class="step-circle">${currentStep > 1 ? icon('check', 16) : '1'}</div>
          <span class="step-title">Credentials</span>
        </div>
        <div class="wizard-step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}" data-step="2">
          <div class="step-circle">${currentStep > 2 ? icon('check', 16) : '2'}</div>
          <span class="step-title">Education</span>
        </div>
        <div class="wizard-step-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}" data-step="3">
          <div class="step-circle">${currentStep > 3 ? icon('check', 16) : '3'}</div>
          <span class="step-title">Profile</span>
        </div>
        <div class="wizard-step-item ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}" data-step="4">
          <div class="step-circle">${currentStep > 4 ? icon('check', 16) : '4'}</div>
          <span class="step-title">Skills</span>
        </div>
        <div class="wizard-step-item ${currentStep === 5 ? 'active' : ''}" data-step="5">
          <div class="step-circle">5</div>
          <span class="step-title">Mentorship</span>
        </div>
      </div>

      <!-- Form Container Card -->
      <div class="card card-premium wizard-card">
        <form id="wizardForm">
          <!-- STEP 1: Credentials & Personal Info -->
          <div id="step1Content" style="${currentStep === 1 ? 'display: block;' : 'display: none;'}">
            <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon('shield', 20)} Step 1: College Credentials & Account
            </h3>

            <div class="form-group">
              <label class="form-label">I am joining as a *</label>
              <div class="form-grid-3">
                <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; background: ${formData.role === 'student' ? 'var(--primary-light)' : 'var(--bg-card)'};">
                  <input type="radio" name="stepRole" value="student" ${formData.role === 'student' ? 'checked' : ''} />
                  <span style="font-weight: 600; font-size: 0.875rem;">Student</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; background: ${formData.role === 'alumni' ? 'var(--primary-light)' : 'var(--bg-card)'};">
                  <input type="radio" name="stepRole" value="alumni" ${formData.role === 'alumni' ? 'checked' : ''} />
                  <span style="font-weight: 600; font-size: 0.875rem;">Alumni</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; background: ${formData.role === 'faculty' ? 'var(--primary-light)' : 'var(--bg-card)'};">
                  <input type="radio" name="stepRole" value="faculty" ${formData.role === 'faculty' ? 'checked' : ''} />
                  <span style="font-weight: 600; font-size: 0.875rem;">Faculty</span>
                </label>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" style="display: flex; justify-content: space-between;">
                  <span>College ID / Roll Number *</span>
                  <span style="font-size: 0.725rem; color: var(--primary); font-weight: 600;">Your login ID</span>
                </label>
                <input 
                  type="text" 
                  class="form-input" 
                  id="stepStudentId" 
                  value="${formData.studentId}" 
                  placeholder="e.g. 21CS042 or UIT-2024-001" 
                  style="font-family: monospace; font-weight: 700; text-transform: uppercase;" 
                  required 
                />
              </div>

              <div class="form-group">
                <label class="form-label">Account Password *</label>
                <input 
                  type="password" 
                  class="form-input" 
                  id="stepPassword" 
                  value="${formData.password}" 
                  placeholder="Create a secure password" 
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="stepName" value="${formData.name}" placeholder="e.g. John Doe" required />
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" class="form-input" id="stepEmail" value="${formData.email}" placeholder="your.name@campus.edu" required />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" id="stepPhone" value="${formData.phone}" placeholder="+1 (555) 019-2834" />
              </div>
            </div>
          </div>

          <!-- STEP 2: University Education -->
          <div id="step2Content" style="${currentStep === 2 ? 'display: block;' : 'display: none;'}">
            <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon('graduationCap', 20)} Step 2: University Education
            </h3>

            <div class="form-group">
              <label class="form-label">College / Institute *</label>
              <input type="text" class="form-input" value="University Institute of Technology" readonly style="background: var(--bg-card-subtle);" />
            </div>

            <div class="form-group">
              <label class="form-label">Department / Branch *</label>
              <select class="form-select" id="stepDept" required>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil & Environmental Engineering">Civil & Environmental Engineering</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Management & Business">Management & Business</option>
              </select>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Degree / Program *</label>
                <input type="text" class="form-input" id="stepDegree" value="${formData.degree}" placeholder="B.Tech, M.Tech, MBA..." required />
              </div>
              <div class="form-group">
                <label class="form-label">Batch / Grad Year *</label>
                <input type="number" class="form-input" id="stepGradYear" value="${formData.gradYear}" min="1970" max="2030" required />
              </div>
            </div>
          </div>

          <!-- STEP 3: Career / Campus Life -->
          <div id="step3Content" style="${currentStep === 3 ? 'display: block;' : 'display: none;'}">
            <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon('briefcase', 20)} Step 3: Current Organization & Role
            </h3>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Current Company / Organization</label>
                <input type="text" class="form-input" id="stepCompany" value="${formData.company}" placeholder="e.g. Google, Startup, or University" />
              </div>
              <div class="form-group">
                <label class="form-label">Position / Status</label>
                <input type="text" class="form-input" id="stepJobRole" value="${formData.jobRole}" placeholder="e.g. Student, Software Engineer, Analyst" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Industry Domain</label>
                <select class="form-select" id="stepIndustry">
                  <option value="Technology">Technology & Software</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="FinTech">FinTech & Banking</option>
                  <option value="Healthcare">Healthcare & BioTech</option>
                  <option value="Education">Education & Academia</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Location / City</label>
                <input type="text" class="form-input" id="stepLocation" value="${formData.location}" placeholder="e.g. San Francisco, New York, Campus" />
              </div>
            </div>
          </div>

          <!-- STEP 4: Skills & Bio -->
          <div id="step4Content" style="${currentStep === 4 ? 'display: block;' : 'display: none;'}">
            <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon('sparkles', 20)} Step 4: Skills & Profile
            </h3>

            <div class="form-group">
              <label class="form-label">Skills & Technical Competencies (comma separated)</label>
              <input type="text" class="form-input" id="stepSkillsInput" value="${formData.skills.join(', ')}" placeholder="Python, Distributed Systems, Leadership" />
            </div>

            <div class="form-group">
              <label class="form-label">Profile Bio</label>
              <textarea class="form-textarea" id="stepBio" rows="3" placeholder="Write a short introduction to connect with peers and mentors...">${formData.bio || ''}</textarea>
            </div>
          </div>

          <!-- STEP 5: Mentorship -->
          <div id="step5Content" style="${currentStep === 5 ? 'display: block;' : 'display: none;'}">
            <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              ${icon('star', 20)} Step 5: Mentorship & Confirmation
            </h3>

            <div class="card" style="background: var(--bg-card-subtle); padding: 1.25rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                <input type="checkbox" id="stepMentorWilling" ${formData.availableForMentorship ? 'checked' : ''} style="width: 18px; height: 18px;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem;">Willing to connect with students for guidance</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Share career advice, resume feedback, and industry insights.</div>
                </div>
              </label>
            </div>

            <div class="card" style="padding: 1.25rem; border: 1px solid var(--primary-border); background: var(--primary-light); border-radius: var(--radius-lg);">
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary); margin-bottom: 0.25rem;">
                ✓ Automatic Login with College ID
              </div>
              <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">
                Upon clicking "Complete Registration", your account will be created and you will be automatically logged into your <strong>Common Member Dashboard</strong> under College ID: <code style="font-weight: 700; font-family: monospace;">${formData.studentId}</code>.
              </div>
            </div>
          </div>

          <!-- Wizard Actions Buttons -->
          <div class="wizard-actions-bar">
            ${currentStep > 1 ? `
              <button type="button" class="btn btn-secondary" id="prevStepBtn">
                ${icon('chevronRight', 16, 'rotate-180')} Previous
              </button>
            ` : `
              <a href="#login" class="btn btn-ghost">
                Already registered? Sign In
              </a>
            `}

            <button type="submit" class="btn btn-primary" id="nextStepBtn" style="min-width: 140px; justify-content: center;">
              ${currentStep === 5 ? 'Complete Registration' : 'Continue ' + icon('chevronRight', 16)}
            </button>
          </div>
        </form>
      </div>
    `;

    // Radio role handler in step 1
    container.querySelectorAll('input[name="stepRole"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        formData.role = e.target.value;
        renderWizard();
      });
    });

    // Previous step button
    const prevBtn = container.querySelector('#prevStepBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          renderWizard();
        }
      });
    }

    // Wizard Form Submit Handler
    const form = container.querySelector('#wizardForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (currentStep === 1) {
        formData.studentId = (container.querySelector('#stepStudentId').value || '').trim().toUpperCase();
        formData.password = container.querySelector('#stepPassword').value;
        formData.name = container.querySelector('#stepName').value;
        formData.email = container.querySelector('#stepEmail').value;
        formData.phone = container.querySelector('#stepPhone').value;

        if (!formData.studentId) {
          showToast('Please enter your College ID / Roll Number', 'danger');
          return;
        }
        currentStep = 2;
        renderWizard();
      } else if (currentStep === 2) {
        formData.department = container.querySelector('#stepDept').value;
        formData.degree = container.querySelector('#stepDegree').value;
        formData.gradYear = Number(container.querySelector('#stepGradYear').value);
        currentStep = 3;
        renderWizard();
      } else if (currentStep === 3) {
        formData.company = container.querySelector('#stepCompany').value;
        formData.jobRole = container.querySelector('#stepJobRole').value;
        formData.industry = container.querySelector('#stepIndustry').value;
        formData.location = container.querySelector('#stepLocation').value;
        currentStep = 4;
        renderWizard();
      } else if (currentStep === 4) {
        const skillsVal = container.querySelector('#stepSkillsInput').value;
        formData.skills = skillsVal.split(',').map(s => s.trim()).filter(Boolean);
        formData.bio = container.querySelector('#stepBio').value;
        currentStep = 5;
        renderWizard();
      } else if (currentStep === 5) {
        formData.availableForMentorship = container.querySelector('#stepMentorWilling').checked;

        // Register user and auto-login!
        const newUser = store.registerUser(formData);

        // Show Success Confirmation with immediate access to Common Dashboard
        container.innerHTML = `
          <div class="card card-premium animate-fade-in" style="padding: 3.5rem 2rem; text-align: center; border-radius: var(--radius-xl); max-width: 620px; margin: 0 auto;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--accent-emerald-light); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
              ${icon('checkCircle', 36)}
            </div>
            <span class="badge badge-success" style="font-size: 0.85rem; padding: 0.35rem 0.85rem; margin-bottom: 1rem;">
              Registration Completed & Authenticated
            </span>
            <h2 style="font-size: 1.85rem; font-weight: 800; margin-bottom: 0.75rem;">
              Welcome, ${newUser.name}!
            </h2>
            <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-color); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); display: inline-flex; align-items: center; gap: 0.65rem; margin-bottom: 1.5rem;">
              ${icon('shield', 18)}
              <span style="font-size: 0.875rem; color: var(--text-secondary);">Your Registered College ID:</span>
              <span style="font-family: monospace; font-size: 1.1rem; font-weight: 800; color: var(--primary);">${newUser.collegeId}</span>
            </div>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">
              You can now log in at any time using your College ID <strong>${newUser.collegeId}</strong>. We've set up your personalized common dashboard ready to explore!
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <a href="#dashboard" class="btn btn-primary btn-lg" style="box-shadow: 0 4px 16px var(--primary-glow);">
                ${icon('sparkles', 18)} Open My Common Dashboard
              </a>
              <a href="#alumni" class="btn btn-secondary btn-lg">
                Browse Alumni Directory
              </a>
            </div>
          </div>
        `;
        showToast(`Account registered with College ID: ${newUser.collegeId}!`, 'success');
      }
    });
  }

  renderWizard();
  return container;
}
