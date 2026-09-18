// Premium Landing Page matching Section 5, 6, 46, 47 of alumini.md - Resilient with Fresh Empty States
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { openAlumniProfile } from './alumniProfileModal.js';

export function renderLandingPage() {
  const container = document.createElement('div');
  container.className = 'landing-page animate-fade-in';

  const spotlightAlumni = store.state.alumni.slice(0, 4);
  const upcomingEvents = store.state.events.slice(0, 2);
  const featuredStory = store.state.stories[0];
  const featuredFund = store.state.funds[0];
  const firstAlum = store.state.alumni[0];

  const totalAlumniCount = store.state.alumni.length;
  const verifiedAlumniCount = store.state.alumni.filter(a => a.status === 'APPROVED').length;
  const mentorsCount = store.state.alumni.filter(a => a.availableForMentorship).length;
  const jobsCount = store.state.jobs.length;
  const eventsCount = store.state.events.length;
  const chaptersCount = store.state.chapters.length;

  container.innerHTML = `
    <!-- 1. Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          <div>
            <div class="hero-tag">
              ${icon('sparkles', 14)}
              <span>Official University Alumni Network</span>
            </div>
            <h1 class="hero-title">
              Your college network <br />
              <span class="hero-title-gradient">doesn't end at graduation.</span>
            </h1>
            <p class="hero-sub">
              Reconnect with your alumni community, discover career opportunities, find experienced mentors, and build meaningful lifelong professional relationships.
            </p>
            <div class="hero-actions">
              <a href="#alumni" class="btn btn-primary btn-lg">
                ${icon('search', 18)} Explore the Alumni Directory
              </a>
              <a href="#register" class="btn btn-secondary btn-lg">
                ${icon('users', 18)} Join the Community
              </a>
            </div>
            
            <div class="hero-social-proof">
              ${totalAlumniCount >= 4 ? `
                <div class="avatar-stack">
                  <img src="${store.state.alumni[0].avatar}" alt="Alumni" />
                  <img src="${store.state.alumni[1].avatar}" alt="Alumni" />
                  <img src="${store.state.alumni[2].avatar}" alt="Alumni" />
                  <img src="${store.state.alumni[3].avatar}" alt="Alumni" />
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">
                  <strong style="color: var(--text-primary);">${totalAlumniCount} Alumni</strong> registered worldwide in the network.
                </div>
              ` : `
                <div style="display: flex; align-items: center; gap: 0.65rem;">
                  <span class="badge badge-primary">${icon('sparkles', 12)} Fresh Portal</span>
                  <div style="font-size: 0.85rem; color: var(--text-secondary);">
                    Be among the founding alumni members on the platform.
                  </div>
                </div>
              `}
            </div>
          </div>

          <!-- Hero Graphic: Alumni Boarding Pass Card -->
          <div class="pass-card-container">
            <div class="pass-card">
              <div class="pass-header">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <div class="brand-icon" style="width: 32px; height: 32px;">
                    ${icon('graduationCap', 18)}
                  </div>
                  <div>
                    <div style="font-size: 0.85rem; font-weight: 700;">ALUMNICONNECT PASS</div>
                    <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">
                      ${firstAlum ? `Class of ${firstAlum.gradYear} · Verified` : 'Official Verified Pass'}
                    </div>
                  </div>
                </div>
                <span class="badge badge-success">${firstAlum ? 'ACTIVE MEMBER' : 'DIGITAL PASS'}</span>
              </div>

              ${firstAlum ? `
                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem;">
                  <img src="${firstAlum.avatar}" style="width: 64px; height: 64px; border-radius: var(--radius-lg); object-fit: cover;" />
                  <div>
                    <h3 style="font-size: 1.15rem; font-weight: 800;">${firstAlum.name}</h3>
                    <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">${firstAlum.role} @ ${firstAlum.company}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${firstAlum.location} · ${firstAlum.menteesCount || 0} Mentees</div>
                  </div>
                </div>

                <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 0.85rem 1rem; display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 1rem;">
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.7rem;">DEPARTMENT</span>
                    <strong>${firstAlum.department.split(' ')[0]}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.7rem;">AVAILABILITY</span>
                    <strong style="color: var(--accent-emerald);">${firstAlum.availableForMentorship ? 'Mentoring Active' : 'Connected'}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.7rem;">LOCATION</span>
                    <strong>${firstAlum.location.split(',')[0]}</strong>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem;">
                  <span style="font-family: monospace; font-size: 0.75rem; letter-spacing: 0.1em; color: var(--text-muted);">UIT-VERIFIED</span>
                  <button class="btn btn-primary btn-sm hero-view-profile" data-id="${firstAlum.id}">View Full Profile</button>
                </div>
              ` : `
                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem;">
                  <div style="width: 64px; height: 64px; border-radius: var(--radius-lg); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                    ${icon('user', 32)}
                  </div>
                  <div>
                    <h3 style="font-size: 1.15rem; font-weight: 800;">Your Alumni Profile</h3>
                    <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">Your Title & Current Company</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">Claim your verified digital badge</div>
                  </div>
                </div>

                <div style="background: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 0.85rem 1rem; display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 1rem;">
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.7rem;">STATUS</span>
                    <strong style="color: var(--accent-emerald);">Ready to Join</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.7rem;">NETWORKING</span>
                    <strong>Open to All</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.7rem;">PORTAL</span>
                    <strong>Official Network</strong>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem;">
                  <span style="font-family: monospace; font-size: 0.75rem; letter-spacing: 0.1em; color: var(--text-muted);">UIT-PASSPORT</span>
                  <a href="#register" class="btn btn-primary btn-sm">Register as Alumni</a>
                </div>
              `}
            </div>

            <!-- Floating Badges -->
            <div class="floating-badge floating-badge-1">
              <span style="color: var(--accent-emerald);">${icon('checkCircle', 18)}</span>
              <span style="font-size: 0.8rem; font-weight: 600;">Career Referrals & Opportunities</span>
            </div>

            <div class="floating-badge floating-badge-2">
              <span style="color: var(--primary);">${icon('sparkles', 18)}</span>
              <span style="font-size: 0.8rem; font-weight: 600;">1-on-1 Alumni Mentorship Hub</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Statistics Band -->
    <section class="stats-band">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">${verifiedAlumniCount}</span>
            <span class="stat-label">Verified Alumni</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${jobsCount}</span>
            <span class="stat-label">Job Opportunities</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${mentorsCount}</span>
            <span class="stat-label">Active Mentors</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${eventsCount}</span>
            <span class="stat-label">Events & Reunions</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${chaptersCount}</span>
            <span class="stat-label">Regional Chapters</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Find Your Next Step -->
    <section class="section journey-section" aria-labelledby="journey-title">
      <div class="container journey-wrap">
        <div class="journey-heading">
          <span class="section-tag">Start here</span>
          <h2 id="journey-title" class="section-title">What do you want to do today?</h2>
          <p>Jump straight to the part of AlumniConnect you need — discover people, opportunities, guidance, or community.</p>
        </div>

        <div class="journey-grid">
          <a class="journey-card" href="#alumni">
            <div>
              <div class="journey-icon">${icon('search', 21)}</div>
              <h3>Find an alumni</h3>
              <p>Search by batch, company, location, skills, or department.</p>
            </div>
            <span class="journey-link">Explore directory ${icon('arrowRight', 14)}</span>
          </a>

          <a class="journey-card" href="#mentorship">
            <div>
              <div class="journey-icon">${icon('users', 21)}</div>
              <h3>Find a mentor</h3>
              <p>Connect with alumni who can help with careers, projects, and interviews.</p>
            </div>
            <span class="journey-link">Browse mentors ${icon('arrowRight', 14)}</span>
          </a>

          <a class="journey-card" href="#jobs">
            <div>
              <div class="journey-icon">${icon('briefcase', 21)}</div>
              <h3>Find an opportunity</h3>
              <p>See jobs, internships, referrals, and career opportunities shared by the network.</p>
            </div>
            <span class="journey-link">View opportunities ${icon('arrowRight', 14)}</span>
          </a>

          <a class="journey-card" href="#events">
            <div>
              <div class="journey-icon">${icon('calendar', 21)}</div>
              <h3>Join the community</h3>
              <p>Discover reunions, talks, networking events, and what is happening on campus.</p>
            </div>
            <span class="journey-link">See upcoming events ${icon('arrowRight', 14)}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- 4. Core Features Section -->
    <section class="section" style="background: var(--bg-page);">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Platform Features</span>
          <h2 class="section-title">Everything you need to thrive in the network.</h2>
          <p class="section-desc">Designed with university standards to empower alumni, current students, and faculty across every step of their career.</p>
        </div>

        <div class="grid grid-cols-3 gap-6">
          <div class="feature-card">
            <div class="feature-icon-box" style="background: var(--primary-light); color: var(--primary);">
              ${icon('users', 26)}
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Alumni Directory</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
              Filter across batches, departments, global cities, and companies to discover former classmates and industry leaders.
            </p>
            <a href="#alumni" style="font-weight: 600; font-size: 0.85rem; color: var(--primary); margin-top: auto;">Explore Directory →</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background: var(--accent-emerald-light); color: var(--accent-emerald);">
              ${icon('briefcase', 26)}
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Career Opportunities</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
              Access exclusive alumni referrals, high-impact internships, and full-time engineering and product opportunities.
            </p>
            <a href="#jobs" style="font-weight: 600; font-size: 0.85rem; color: var(--accent-emerald); margin-top: auto;">Browse Open Jobs →</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background: var(--accent-amber-light); color: var(--accent-amber);">
              ${icon('sparkles', 26)}
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Dedicated Mentorship</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
              Connect directly with alumni in your dream role for resume reviews, system design practice, and career roadmap planning.
            </p>
            <a href="#mentorship" style="font-weight: 600; font-size: 0.85rem; color: var(--accent-amber); margin-top: auto;">Find a Mentor →</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background: var(--accent-rose-light); color: var(--accent-rose);">
              ${icon('calendar', 26)}
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Events & Reunions</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
              From campus reunions and hackathons to global chapter dinners and executive webinars.
            </p>
            <a href="#events" style="font-weight: 600; font-size: 0.85rem; color: var(--accent-rose); margin-top: auto;">View Upcoming Events →</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background: var(--accent-sky-light); color: var(--accent-sky);">
              ${icon('messageSquare', 26)}
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Community Feed</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
              Share career milestones, discuss technical developments, ask questions, and celebrate achievements together.
            </p>
            <a href="#community" style="font-weight: 600; font-size: 0.85rem; color: var(--accent-sky); margin-top: auto;">Join the Conversation →</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon-box" style="background: hsla(262, 80%, 60%, 0.15); color: var(--secondary);">
              ${icon('award', 26)}
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Success Stories</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
              Read how alumni built unicorn startups, designed lunar satellites, and reached leadership at world-class institutions.
            </p>
            <a href="#stories" style="font-weight: 600; font-size: 0.85rem; color: var(--secondary); margin-top: auto;">Read Inspiring Stories →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Featured Alumni Showcase -->
    <section class="section" style="background: var(--bg-card); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="section-tag">Alumni Spotlight</span>
            <h2 style="font-size: 2rem;">Meet alumni shaping global industries</h2>
          </div>
          <a href="#alumni" class="btn btn-outline-primary btn-sm">
            View all alumni ${icon('arrowRight', 14)}
          </a>
        </div>

        <div class="grid grid-cols-4 gap-6">
          ${spotlightAlumni.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 2rem; background: var(--bg-card-subtle); border-radius: var(--radius-xl); border: 1.5px dashed var(--border-color);">
              <div style="color: var(--primary); display: flex; justify-content: center; margin-bottom: 0.75rem;">
                ${icon('users', 44)}
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.4rem;">Be the First in the Spotlight</h3>
              <p style="color: var(--text-muted); font-size: 0.875rem; max-width: 500px; margin: 0 auto 1.25rem;">
                The alumni directory is ready for fresh data. Register your profile to showcase your career journey and inspire current students.
              </p>
              <a href="#register" class="btn btn-primary btn-sm">
                ${icon('plus', 14)} Register as Alumni
              </a>
            </div>
          ` : spotlightAlumni.map(a => `
            <div class="alumni-card">
              <div class="alumni-card-header">
                <div class="alumni-avatar-wrap">
                  <img src="${a.avatar}" alt="${a.name}" />
                </div>
              </div>
              <div class="alumni-card-body">
                <div class="alumni-name">
                  ${a.name}
                  <span style="color: var(--accent-emerald);" title="Verified">${icon('shield', 14)}</span>
                </div>
                <div class="alumni-role">${a.role}</div>
                <div style="font-weight: 600; font-size: 0.85rem; color: var(--primary); margin-bottom: 0.75rem;">${a.company}</div>
                
                <div class="alumni-meta">
                  <div class="alumni-meta-row">${icon('graduationCap', 13)} Class of ${a.gradYear}</div>
                  <div class="alumni-meta-row">${icon('mapPin', 13)} ${a.location}</div>
                </div>

                <div class="skills-row">
                  ${(a.skills || []).slice(0, 3).map(s => `<span class="skill-chip">${s}</span>`).join('')}
                </div>

                <button class="btn btn-secondary btn-sm w-full landing-view-alum" data-id="${a.id}" style="margin-top: 0.5rem;">
                  View Profile
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 6. Events & Success Story Split Preview -->
    <section class="section">
      <div class="container">
        <div class="grid grid-cols-2 gap-8">
          <!-- Upcoming Events Column -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h3 style="font-size: 1.45rem;">Upcoming Events</h3>
              <a href="#events" style="font-size: 0.85rem; font-weight: 600;">See all (${store.state.events.length})</a>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${upcomingEvents.length === 0 ? `
                <div class="card" style="padding: 2.5rem 1.5rem; text-align: center; border: 1.5px dashed var(--border-color); background: var(--bg-card-subtle);">
                  <div style="color: var(--accent-rose); display: flex; justify-content: center; margin-bottom: 0.75rem;">
                    ${icon('calendar', 36)}
                  </div>
                  <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.35rem;">No upcoming events scheduled yet</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                    Have an idea for a batch reunion, technical talk, or networking meetup?
                  </p>
                  <a href="#events" class="btn btn-secondary btn-sm">Host an Event</a>
                </div>
              ` : upcomingEvents.map(e => `
                <div class="card card-hover event-preview-card" style="padding: 1.25rem;">
                  <img src="${e.banner}" class="event-preview-card-img" alt="${e.title}" />
                  <div style="flex: 1; min-width: 0;">
                    <span class="badge badge-primary" style="margin-bottom: 0.35rem;">${e.category}</span>
                    <h4 style="font-size: 1.05rem; margin-bottom: 0.3rem;">${e.title}</h4>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.6rem;">
                      ${icon('calendar', 12)} ${e.date} · ${e.location}
                    </div>
                    <a href="#events" class="btn btn-secondary btn-sm">Event Details</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Featured Success Story Column -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h3 style="font-size: 1.45rem;">Featured Story</h3>
              <a href="#stories" style="font-size: 0.85rem; font-weight: 600;">Read all stories</a>
            </div>

            ${featuredStory ? `
              <div class="card" style="padding: 1.5rem; height: calc(100% - 3.25rem); display: flex; flex-direction: column;">
                <img src="${featuredStory.coverImage}" style="width: 100%; height: 180px; border-radius: var(--radius-md); object-fit: cover; margin-bottom: 1.25rem;" />
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                  <span class="badge badge-neutral">${featuredStory.readTime}</span>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">By ${featuredStory.alumniName} (Class of '${String(featuredStory.gradYear).slice(2)})</span>
                </div>
                <h4 style="font-size: 1.2rem; line-height: 1.35; margin-bottom: 0.75rem;">${featuredStory.title}</h4>
                <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
                  ${featuredStory.summary}
                </p>
                <a href="#stories" class="btn btn-outline-primary btn-sm" style="margin-top: auto; align-self: flex-start;">
                  Read Full Story ${icon('arrowRight', 14)}
                </a>
              </div>
            ` : `
              <div class="card" style="padding: 2.5rem 1.5rem; text-align: center; border: 1.5px dashed var(--border-color); background: var(--bg-card-subtle); height: calc(100% - 3.25rem); display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div style="color: var(--accent-amber); margin-bottom: 0.75rem;">
                  ${icon('award', 36)}
                </div>
                <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.35rem;">Share Your Journey</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 320px; margin-bottom: 1.25rem;">
                  Inspire fellow graduates and current undergraduates by sharing your milestones and experiences.
                </p>
                <a href="#stories" class="btn btn-secondary btn-sm">Share Your Story</a>
              </div>
            `}
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Giving Back / Donation Spotlight -->
    <section class="section" style="background: var(--bg-card); border-top: 1px solid var(--border-color);">
      <div class="container">
        <div class="card card-glass landing-giving-card">
          <div class="grid grid-cols-2 gap-8 items-center">
            <div>
              <span class="badge badge-success" style="margin-bottom: 0.75rem;">Give Back to College</span>
              <h2 style="font-size: 2rem; margin-bottom: 0.75rem;">Empower the next generation through alumni giving</h2>
              <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
                Alumni contributions go directly towards student scholarships, research laboratories, and emergency student aid.
              </p>
              <a href="#donations" class="btn btn-primary">
                ${icon('heart', 16)} Explore Giving Funds
              </a>
            </div>
            
            ${featuredFund ? `
              <div class="card" style="padding: 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg);">
                <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.25rem;">${featuredFund.title}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Goal: $${featuredFund.goal.toLocaleString()} · ${featuredFund.donorsCount} Donors</div>
                
                <div class="fund-progress-bar">
                  <div class="fund-progress-fill" style="width: ${Math.round((featuredFund.raised / featuredFund.goal) * 100)}%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600;">
                  <span style="color: var(--accent-emerald);">$${featuredFund.raised.toLocaleString()} raised</span>
                  <span style="color: var(--text-muted);">${Math.round((featuredFund.raised / featuredFund.goal) * 100)}% of goal</span>
                </div>
              </div>
            ` : `
              <div class="card" style="padding: 2rem; background: var(--bg-card); border-radius: var(--radius-lg); text-align: center; border: 1.5px dashed var(--border-color);">
                <div style="color: var(--accent-emerald); display: flex; justify-content: center; margin-bottom: 0.75rem;">
                  ${icon('heart', 36)}
                </div>
                <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">Alumni Endowment Funds</div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Support student scholarships, laboratories, and student aid.</p>
                <a href="#donations" class="btn btn-primary btn-sm">Explore Giving Funds</a>
              </div>
            `}
          </div>
        </div>
      </div>
    </section>

    <!-- 8. CTA Banner -->
    <section class="section" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: #fff; text-align: center; padding: 4.5rem 0;">
      <div class="container container-sm">
        <h2 class="landing-cta-title" style="font-size: 2.5rem; color: #fff; margin-bottom: 1rem;">Ready to reconnect with your university?</h2>
        <p class="landing-cta-sub" style="font-size: 1.1rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem;">
          Join alumni, mentors, and students building stronger futures together. Registration takes under 3 minutes.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="#register" class="btn btn-secondary btn-lg" style="color: var(--primary); font-weight: 700;">
            Register as Alumni
          </a>
          <a href="#alumni" class="btn btn-outline-primary btn-lg" style="color: #fff; border-color: rgba(255,255,255,0.6);">
            Browse Directory
          </a>
        </div>
      </div>
    </section>

    <!-- 9. Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="nav-brand" style="margin-bottom: 1rem;">
              <div class="brand-icon">
                ${icon('graduationCap', 20)}
              </div>
              <div>
                <span>AlumniConnect</span>
                <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Connect. Inspire. Grow.</span>
              </div>
            </div>
            <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; max-width: 320px;">
              Building stronger lifetime connections between higher education institutions, current students, and global alumni.
            </p>
          </div>

          <div>
            <div class="footer-col-title">Network</div>
            <ul class="footer-links">
              <li><a href="#alumni" class="footer-link">Alumni Directory</a></li>
              <li><a href="#mentorship" class="footer-link">Find a Mentor</a></li>
              <li><a href="#chapters" class="footer-link">Regional Chapters</a></li>
              <li><a href="#stories" class="footer-link">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <div class="footer-col-title">Opportunities</div>
            <ul class="footer-links">
              <li><a href="#jobs" class="footer-link">Job Board</a></li>
              <li><a href="#events" class="footer-link">Campus Events</a></li>
              <li><a href="#donations" class="footer-link">Give Back / Funds</a></li>
              <li><a href="#polls" class="footer-link">Campus Polls</a></li>
            </ul>
          </div>

          <div>
            <div class="footer-col-title">Dashboards</div>
            <ul class="footer-links">
              <li><a href="#dashboard/student" class="footer-link">Student Portal</a></li>
              <li><a href="#dashboard/alumni" class="footer-link">Alumni Portal</a></li>
              <li><a href="#dashboard/admin" class="footer-link">Admin Console</a></li>
              <li><a href="#settings" class="footer-link">Account Settings</a></li>
            </ul>
          </div>

          <div>
            <div class="footer-col-title">University Affairs</div>
            <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.75rem;">
              University Office of Advancement & Alumni Relations<br />
              Administration Hall, Suite 400<br />
              alumni-support@university.edu
            </p>
            <span class="badge badge-neutral">${icon('shield', 12)} Official Portal</span>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2026 AlumniConnect Platform. All rights reserved.</div>
          <div style="display: flex; gap: 1.5rem;">
            <a href="#settings" style="color: var(--text-muted);">Privacy Policy</a>
            <a href="#settings" style="color: var(--text-muted);">Terms of Service</a>
            <a href="#feedback" style="color: var(--text-muted);">Platform Feedback</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  // Attach handlers for hero card and spotlight alumni view profile
  container.querySelectorAll('.hero-view-profile, .landing-view-alum').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openAlumniProfile(id);
    });
  });

  return container;
}
