import { audioEngine } from '../audio.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const FILIGREE_CORNER_SVG = `
  <svg class="wx-rp-filigree" viewBox="0 0 340 500" fill="none" aria-hidden="true">
    <rect x="14" y="14" width="312" height="472" rx="14" stroke="rgba(247,214,146,0.28)" stroke-width="1.2" />
    <path d="M22 44 C22 26, 26 22, 44 22" stroke="rgba(247,214,146,0.65)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M296 22 C314 22, 318 26, 318 44" stroke="rgba(247,214,146,0.65)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M22 456 C22 474, 26 478, 44 478" stroke="rgba(247,214,146,0.65)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M296 478 C314 478, 318 474, 318 456" stroke="rgba(247,214,146,0.65)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M68 418 L70 424 L76 426 L70 428 L68 434 L66 428 L60 426 L66 424 Z" fill="rgba(247,214,146,0.55)" />
    <path d="M274 398 L276 403 L281 405 L276 407 L274 412 L272 407 L267 405 L272 403 Z" fill="rgba(247,214,146,0.48)" />
    <circle cx="170" cy="436" r="2.2" fill="rgba(247,214,146,0.5)" />
  </svg>
`;

export function openRedPacketModal({
  senderName = '好友',
  recipientName = '你',
  redPacket = {},
  claimed = false,
  onClaim = () => {},
  showToast = () => {},
}) {
  const existing = document.querySelector('.wx-rp-backdrop');
  if (existing) existing.remove();

  const wish = (redPacket?.wish || '生日快乐，大吉大利！').trim();
  const amountNum = parseFloat(redPacket?.amount || '88.88');
  const displayAmount = Number.isFinite(amountNum) ? amountNum.toFixed(2) : (redPacket?.amount || '88.88');
  const claimCode = (redPacket?.claimCode || '').trim();
  const cleanSender = senderName.replace(/^[—\-\s]+/, '').trim() || '好友';

  const backdrop = document.createElement('div');
  backdrop.className = 'wx-rp-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  function closeModal() {
    window.removeEventListener('keydown', onKeyDown);
    backdrop.remove();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }
  window.addEventListener('keydown', onKeyDown);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  function renderClosed() {
    backdrop.innerHTML = `
      <div class="wx-rp-card wx-rp-luxury">
        ${FILIGREE_CORNER_SVG}
        <button type="button" class="wx-rp-close" id="wx-rp-close" aria-label="关闭">×</button>
        <div class="wx-rp-arc"></div>
        <div class="wx-rp-top-content">
          <div class="wx-rp-sender-row">
            <span class="wx-rp-avatar">${escapeHtml(cleanSender.slice(0, 1).toUpperCase())}</span>
            <span class="wx-rp-sender-text">${escapeHtml(cleanSender)} 发出的生日红包</span>
          </div>
          <div class="wx-rp-wish">${escapeHtml(wish)}</div>
        </div>
        <button type="button" class="wx-rp-coin" id="wx-rp-open-btn" aria-label="拆开微信红包">
          <span class="wx-rp-coin-ring">開</span>
        </button>
        <div class="wx-rp-bottom-hint">送给 ${escapeHtml(recipientName)} 的专属生日彩蛋</div>
      </div>
    `;

    backdrop.querySelector('#wx-rp-close').addEventListener('click', closeModal);
    const openBtn = backdrop.querySelector('#wx-rp-open-btn');
    openBtn.addEventListener('click', () => {
      if (openBtn.classList.contains('spinning')) return;
      openBtn.classList.add('spinning');
      audioEngine.playRedPacketChimeSfx();
      onClaim();
      setTimeout(() => {
        if (!backdrop.isConnected) return;
        renderOpened(true);
      }, 620);
    });
  }

  function renderOpened(animateCount = false) {
    backdrop.innerHTML = `
      <div class="wx-rp-card wx-rp-opened">
        <button type="button" class="wx-rp-close" id="wx-rp-close" aria-label="关闭">×</button>
        <div class="wx-rp-opened-header">
          <div class="wx-rp-opened-avatar">${escapeHtml(cleanSender.slice(0, 1).toUpperCase())}</div>
          <div class="wx-rp-opened-title">${escapeHtml(cleanSender)} 的微信生日红包</div>
          <div class="wx-rp-opened-wish">${escapeHtml(wish)}</div>
        </div>
        <div class="wx-rp-opened-body">
          <div class="wx-rp-amount-badge">已存入祝福心意</div>
          <div class="wx-rp-amount-row">
            <span class="wx-rp-currency">¥</span>
            <span class="wx-rp-amount" id="wx-rp-amount-val">${animateCount && Number.isFinite(amountNum) ? '0.00' : escapeHtml(displayAmount)}</span>
          </div>
          ${claimCode ? `
            <div class="wx-rp-code-box">
              <span class="wx-rp-code-label">微信红包封面码 / 兑现暗号</span>
              <div class="wx-rp-code-row">
                <code class="wx-rp-code-text">${escapeHtml(claimCode)}</code>
                <button type="button" class="wx-rp-code-copy" id="wx-rp-copy-code">复制</button>
              </div>
            </div>
          ` : ''}
          <div class="wx-rp-actions">
            <button type="button" class="wx-rp-voucher-btn" id="wx-rp-voucher-btn">复制祝福凭证</button>
            <button type="button" class="wx-rp-done-btn" id="wx-rp-done-btn">收下祝福</button>
          </div>
          <p class="wx-rp-footnote">生日祝福仪式感彩蛋 · 可截图或复制凭证找好友微信兑现</p>
        </div>
      </div>
    `;

    backdrop.querySelector('#wx-rp-close').addEventListener('click', closeModal);
    backdrop.querySelector('#wx-rp-done-btn').addEventListener('click', closeModal);

    if (animateCount && Number.isFinite(amountNum)) {
      const amountEl = backdrop.querySelector('#wx-rp-amount-val');
      const start = performance.now();
      const dur = 520;
      const tick = (now) => {
        if (!backdrop.isConnected) return;
        const p = Math.min(1, (now - start) / dur);
        const ease = 1 - Math.pow(1 - p, 3);
        amountEl.textContent = (amountNum * ease).toFixed(2);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    backdrop.querySelector('#wx-rp-copy-code')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(claimCode);
        showToast('红包暗号 / 序列号已复制');
      } catch {
        showToast(claimCode);
      }
    });

    backdrop.querySelector('#wx-rp-voucher-btn').addEventListener('click', async () => {
      const voucher = `🧧 ${cleanSender} 送给 ${recipientName} 的生日微信红包凭证：¥${displayAmount}｜祝福：「${wish}」${claimCode ? `｜暗号：${claimCode}` : ''}`;
      try {
        await navigator.clipboard.writeText(voucher);
        showToast('祝福凭证已复制，发到微信即可兑现');
      } catch {
        showToast(voucher);
      }
    });
  }

  if (claimed) renderOpened(false);
  else renderClosed();

  document.body.appendChild(backdrop);
  return closeModal;
}
