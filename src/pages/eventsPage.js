// Events & Campus Reunions Page matching Section 18 of alumini.md
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderEventsPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  const categories = ['All', 'Alumni Meet', 'Reunion', 'Webinar', 'Hackathon', 'Workshop', 'Networking'];
  let activeCategory = 'All';

  function renderView() {
    const events = store.getEvents({ category: activeCategory });

    container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="section-tag">Campus Gatherings</span>
          <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Events & Reunions</h1>
          <p style="color: var(--text-secondary); max-width: 680px;">
            Stay connected through flagship homecoming reunions, technical hackathons, industry webinars, and regional alumni dinners.
          </p>
        </div>

        <button id="createEventTopBtn" class="btn btn-primary">
          ${icon('plus', 16)} Host an Event
        </button>
      </div>

      <!-- Categories Pills -->
      <div class="tabs-nav" style="margin-bottom: 2rem;">
        ${categories.map(c => `
          <button class="tab-btn ${activeCategory === c ? 'active' : ''} evt-cat-btn" data-cat="${c}">
            ${c}
          </button>
        `).join('')}
      </div>

      <!-- Events Grid -->
      <div class="grid grid-cols-2 gap-8" id="eventsGridContainer">
        ${events.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="color: var(--accent-rose); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('calendar', 54)}
            </div>
            <h3 style="margin-top: 0.5rem; font-size: 1.35rem; font-weight: 800;">No Campus Events Scheduled Yet</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 500px; margin-left: auto; margin-right: auto;">
              Be the first to propose or host a batch reunion, technical workshop, or networking session.
            </p>
            <button class="btn btn-primary empty-create-event-btn" style="margin-top: 1.25rem;">
              ${icon('plus', 16)} Host the First Event
            </button>
          </div>
        ` : events.map(e => `
          <div class="card card-hover" style="display: flex; flex-direction: column; overflow: hidden; border-radius: var(--radius-xl);">
            <div style="position: relative; height: 180px;">
              <img src="${e.banner}" style="width: 100%; height: 100%; object-fit: cover;" alt="${e.title}" />
              <span class="badge ${e.isVirtual ? 'badge-sky' : 'badge-primary'}" style="position: absolute; top: 1rem; left: 1rem; font-weight: 700;">
                ${e.isVirtual ? 'Virtual Webinar' : e.category}
              </span>
              <span class="badge badge-neutral" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.65); color: #fff;">
                ${icon('users', 12)} ${e.attendeesCount} Attending
              </span>
            </div>

            <div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
              <div style="display: flex; gap: 0.75rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                <span>${icon('calendar', 13)} ${e.date}</span>
                <span>${icon('mapPin', 13)} ${e.location}</span>
              </div>

              <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.6rem; color: var(--text-primary);">${e.title}</h3>
              
              <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem; flex: 1;">
                ${e.description}
              </p>

              ${e.speakers && e.speakers.length > 0 ? `
                <div style="margin-bottom: 1.25rem; padding: 0.65rem 0.85rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); font-size: 0.8rem;">
                  <strong style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Keynote Speakers</strong>
                  ${e.speakers.join(' · ')}
                </div>
              ` : ''}

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1rem; margin-top: auto;">
                <button class="btn ${e.isRegistered ? 'btn-secondary' : 'btn-primary'} btn-sm toggle-register-btn" data-id="${e.id}">
                  ${e.isRegistered ? icon('check', 14) + ' Registered' : icon('calendar', 14) + ' RSVP / Attend'}
                </button>
                <button class="btn btn-ghost btn-sm add-cal-btn" data-title="${e.title}" data-date="${e.date}">
                  ${icon('download', 14)} Add to Calendar
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Category click
    container.querySelectorAll('.evt-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeCategory = e.currentTarget.getAttribute('data-cat');
        renderView();
      });
    });

    // Registration toggle
    container.querySelectorAll('.toggle-register-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        store.toggleEventRegistration(id);
        const evt = store.state.events.find(x => x.id === id);
        showToast(evt.isRegistered ? `You are RSVP'd for ${evt.title}!` : `Registration cancelled for ${evt.title}`, evt.isRegistered ? 'success' : 'info');
        renderView();
      });
    });

    // Add to Calendar simulation
    container.querySelectorAll('.add-cal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('Calendar invite (.ics) ready to import!', 'info');
      });
    });

    // Host Event modal
    const hostBtn = container.querySelector('#createEventTopBtn');
    if (hostBtn) {
      hostBtn.addEventListener('click', openCreateEventModal);
    }
    const emptyHostBtn = container.querySelector('.empty-create-event-btn');
    if (emptyHostBtn) {
      emptyHostBtn.addEventListener('click', openCreateEventModal);
    }
  }

  function openCreateEventModal() {
    const modal = openModal({
      title: 'Host New Event / Reunion',
      contentHtml: `
        <form id="createEvtForm">
          <div class="form-group">
            <label class="form-label">Event Title *</label>
            <input type="text" class="form-input" id="mEvtTitle" placeholder="e.g. Class of 2018 Five-Year Reunion Dinner" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="mEvtCat">
                <option value="Alumni Meet">Alumni Meet</option>
                <option value="Reunion">Reunion</option>
                <option value="Webinar">Webinar</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date & Time *</label>
              <input type="text" class="form-input" id="mEvtDate" placeholder="e.g. November 14, 2026 at 6:00 PM" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Location / Platform *</label>
            <input type="text" class="form-input" id="mEvtLoc" placeholder="e.g. Main Auditorium or Zoom Link" required />
          </div>
          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" id="mEvtDesc" placeholder="Event overview, agenda, and guest notes..." required></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
            <button type="button" class="btn btn-secondary" id="mEvtCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Event</button>
          </div>
        </form>
      `,
      size: 'md'
    });

    modal.querySelector('#mEvtCancel').addEventListener('click', closeModal);
    modal.querySelector('#createEvtForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = modal.querySelector('#mEvtTitle').value;
      const category = modal.querySelector('#mEvtCat').value;
      const date = modal.querySelector('#mEvtDate').value;
      const location = modal.querySelector('#mEvtLoc').value;
      const desc = modal.querySelector('#mEvtDesc').value;

      store.createEvent({ title, category, date, location, description: desc });
      closeModal();
      showToast('New event created and registered!', 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
