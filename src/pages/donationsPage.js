// Giving & Alumni Endowment Funds matching Section 24 of alumini.md - Enhanced UI
import { icon } from '../components/icons.js';
import { store } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';

export function renderDonationsPage() {
  const container = document.createElement('div');
  container.className = 'container py-8 animate-fade-in';
  container.style.paddingTop = '2.5rem';
  container.style.paddingBottom = '4rem';

  function renderView() {
    const funds = store.getFunds();
    const totalRaised = funds.reduce((acc, f) => acc + (f.raised || 0), 0);
    const totalDonors = funds.reduce((acc, f) => acc + (f.donorsCount || 0), 0);
    const totalCampaigns = funds.length;

    container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="section-tag">Empower Future Generations</span>
          <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem;">Alumni Giving & Endowment Funds</h1>
          <p style="color: var(--text-secondary); max-width: 680px;">
            Every contribution directly funds undergraduate STEM scholarships, modern laboratory gear, and hardship student grants.
          </p>
        </div>

        <button id="createFundTopBtn" class="btn btn-primary" style="box-shadow: 0 4px 14px var(--primary-glow);">
          ${icon('plus', 16)} Start a Campaign
        </button>
      </div>

      <!-- Trust Badges Strip -->
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; align-items: center;">
        <span class="badge badge-success" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
          ${icon('shield', 12)} 100% Directed to Students
        </span>
        <span class="badge badge-neutral" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
          ${icon('checkCircle', 12)} 501(c)(3) Tax Deductible
        </span>
        <span class="badge badge-primary" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
          ${icon('sparkles', 12)} University Matching Eligible
        </span>
      </div>

      <!-- Giving Impact Summary Banner -->
      <div class="card card-premium" style="padding: 2rem; border-radius: var(--radius-xl); margin-bottom: 3rem; background: linear-gradient(135deg, hsla(234, 85%, 60%, 0.04) 0%, hsla(158, 75%, 42%, 0.08) 100%);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
          <div>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--accent-emerald); line-height: 1.1;">
              $${totalRaised.toLocaleString()}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-top: 0.35rem;">Total Contributed Directly</div>
          </div>
          <div class="stat-summary-center-col">
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--primary); line-height: 1.1;">
              ${totalDonors}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-top: 0.35rem;">Generous Alumni Donors</div>
          </div>
          <div>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--secondary); line-height: 1.1;">
              ${totalCampaigns}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-top: 0.35rem;">Active Impact Endowments</div>
          </div>
        </div>
      </div>

      <!-- Campaigns List -->
      <div class="grid grid-cols-3 gap-8">
        ${funds.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-xl);">
            <div style="color: var(--accent-emerald); display: flex; justify-content: center; margin-bottom: 0.75rem;">
              ${icon('heart', 54)}
            </div>
            <h3 style="margin-top: 0.5rem; font-size: 1.35rem; font-weight: 800;">No Active Giving Campaigns Yet</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem; max-width: 500px; margin-left: auto; margin-right: auto;">
              Support the university by creating the first scholarship, student aid, or laboratory equipment fund.
            </p>
            <button class="btn btn-primary empty-create-fund-btn" style="margin-top: 1.25rem;">
              ${icon('plus', 16)} Start a Giving Campaign
            </button>
          </div>
        ` : funds.map(f => {
          const percent = f.goal > 0 ? Math.min(100, Math.round((f.raised / f.goal) * 100)) : 0;
          return `
            <div class="card card-hover" style="display: flex; flex-direction: column; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--border-color);">
              <div style="padding: 1.6rem; display: flex; flex-direction: column; flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <span class="badge badge-success">${icon('shield', 11)} Verified Campaign</span>
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-emerald); background: var(--accent-emerald-light); padding: 0.2rem 0.5rem; border-radius: var(--radius-full);">
                    ${percent}% Goal
                  </span>
                </div>

                <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-primary);">${f.title}</h3>
                <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 1.5rem; flex: 1;">
                  ${f.description}
                </p>

                <!-- Progress Bar -->
                <div style="margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 800; margin-bottom: 0.4rem;">
                    <span style="color: var(--accent-emerald);">$${f.raised.toLocaleString()} raised</span>
                    <span style="color: var(--text-muted); font-size: 0.8rem;">Goal: $${f.goal.toLocaleString()}</span>
                  </div>
                  <div class="fund-progress-bar" style="height: 8px;">
                    <div class="fund-progress-fill" style="width: ${percent}%;"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
                    <span>${percent}% achieved</span>
                    <span>${f.donorsCount} generous alumni</span>
                  </div>
                </div>

                <!-- Recent Donors Preview -->
                <div style="background: var(--bg-card-subtle); padding: 0.75rem 0.95rem; border-radius: var(--radius-md); font-size: 0.8rem; margin-bottom: 1.25rem;">
                  <strong style="color: var(--text-muted); display: block; margin-bottom: 0.25rem; font-size: 0.7rem; text-transform: uppercase;">Recent Alumni Donors</strong>
                  ${(f.donors || []).length > 0 ? f.donors.slice(0, 2).map(d => `<span style="font-weight: 600; color: var(--text-primary);">${d.name} ($${d.amount}) · </span>`).join('') : '<span style="color: var(--text-muted);">Be the first founding donor to contribute!</span>'}
                </div>

                <button class="btn btn-primary btn-sm w-full donate-btn" data-id="${f.id}" data-title="${f.title}" style="box-shadow: 0 4px 12px var(--primary-glow);">
                  ${icon('heart', 14)} Make a Tax-Deductible Gift
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Hook listeners
    container.querySelectorAll('.donate-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const title = e.currentTarget.getAttribute('data-title');
        openDonationModal(id, title);
      });
    });

    const topFundBtn = container.querySelector('#createFundTopBtn');
    if (topFundBtn) topFundBtn.addEventListener('click', openCreateFundModal);

    const emptyFundBtn = container.querySelector('.empty-create-fund-btn');
    if (emptyFundBtn) emptyFundBtn.addEventListener('click', openCreateFundModal);
  }

  function openCreateFundModal() {
    const modal = openModal({
      title: 'Start Alumni Giving Campaign',
      contentHtml: `
        <form id="createFundForm">
          <div class="form-group">
            <label class="form-label">Campaign Title *</label>
            <input type="text" class="form-input" id="mFundTitle" placeholder="e.g. Undergraduate STEM Scholars Endowment" required />
          </div>
          <div class="form-group">
            <label class="form-label">Funding Goal ($ USD) *</label>
            <input type="number" class="form-input" id="mFundGoal" placeholder="50000" min="100" required />
          </div>
          <div class="form-group">
            <label class="form-label">Campaign Purpose & Beneficiary Allocation *</label>
            <textarea class="form-textarea" id="mFundDesc" placeholder="Explain the direct impact of this fund, student eligibility requirements, and disbursement schedule..." required></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" id="mFundCancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Campaign</button>
          </div>
        </form>
      `,
      size: 'md'
    });

    modal.querySelector('#mFundCancel').addEventListener('click', closeModal);
    modal.querySelector('#createFundForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = modal.querySelector('#mFundTitle').value;
      const goal = Number(modal.querySelector('#mFundGoal').value);
      const description = modal.querySelector('#mFundDesc').value;

      store.createFund({ title, goal, description });
      closeModal();
      showToast('New giving campaign launched successfully!', 'success');
      renderView();
    });
  }

  function openDonationModal(fundId, title) {
    let selectedAmount = 50;

    const modal = openModal({
      title: `Contribute to "${title}"`,
      contentHtml: `
        <form id="donationForm">
          <div style="margin-bottom: 1.5rem; text-align: center;">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">Select Contribution Amount</div>
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary amount-pill" data-amt="25">$25</button>
              <button type="button" class="btn btn-primary amount-pill active" data-amt="50">$50</button>
              <button type="button" class="btn btn-secondary amount-pill" data-amt="100">$100</button>
              <button type="button" class="btn btn-secondary amount-pill" data-amt="250">$250</button>
              <button type="button" class="btn btn-secondary amount-pill" data-amt="500">$500</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Custom Contribution ($ USD)</label>
            <input type="number" class="form-input" id="customAmountInput" value="50" min="5" />
          </div>

          <div class="form-group">
            <label class="form-label">Donor Name or Recognition</label>
            <input type="text" class="form-input" id="donorNameInput" placeholder="Your name (or Anonymous)" value="${store.getCurrentUser()?.name || ''}" />
          </div>

          <div class="form-group">
            <label class="form-label">Secured Payment Method</label>
            <select class="form-select">
              <option>Credit / Debit Card (Stripe Secured 256-bit)</option>
              <option>University Alumni Payroll Match</option>
              <option>Direct Bank Transfer / ACH</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" id="modalDonationCancel">Cancel</button>
            <button type="submit" class="btn btn-primary" style="box-shadow: 0 4px 12px var(--primary-glow);">
              ${icon('heart', 14)} Complete $50 Gift
            </button>
          </div>
        </form>
      `,
      size: 'md'
    });

    const submitBtn = modal.querySelector('button[type="submit"]');
    const customInput = modal.querySelector('#customAmountInput');

    modal.querySelectorAll('.amount-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        modal.querySelectorAll('.amount-pill').forEach(p => {
          p.classList.remove('btn-primary', 'active');
          p.classList.add('btn-secondary');
        });
        e.currentTarget.classList.add('btn-primary', 'active');
        e.currentTarget.classList.remove('btn-secondary');
        selectedAmount = Number(e.currentTarget.getAttribute('data-amt'));
        customInput.value = selectedAmount;
        submitBtn.innerHTML = `${icon('heart', 14)} Complete $${selectedAmount} Gift`;
      });
    });

    customInput.addEventListener('input', (e) => {
      selectedAmount = Number(e.target.value) || 0;
      submitBtn.innerHTML = `${icon('heart', 14)} Complete $${selectedAmount} Gift`;
    });

    modal.querySelector('#modalDonationCancel').addEventListener('click', closeModal);

    modal.querySelector('#donationForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const customDonor = modal.querySelector('#donorNameInput').value;
      store.makeDonation(fundId, selectedAmount, customDonor);
      closeModal();
      showToast(`Thank you! Your donation of $${selectedAmount} has been recorded!`, 'success');
      renderView();
    });
  }

  renderView();
  return container;
}
