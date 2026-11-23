import { getTemplate, resolveAssetUrl } from '../config.js';
import { buildShareUrl, fetchOutbox } from '../api.js';

function formatShortTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${mm}/${dd} ${hh}:${mi}`;
}

export function mountOutboxView(root, { outboxId, navigate, showToast }) {
  root.innerHTML = `
    <div class="outbox-view">
      <a href="/" class="brand-lockup" data-nav="/">
        <img src="${resolveAssetUrl('/assets/brand/mark.png')}" alt="Birthday Cards" class="brand-mark" />
        <span class="brand-wordmark">Birthday Cards</span>
      </a>
      <div class="outbox-container">
        <div class="outbox-header">
          <div>
            <h1>我的寄件箱</h1>
            <p>查看每一封寄出的生日信有没有送达、拆开。</p>
          </div>
          <button type="button" class="primary-pill-btn" id="outbox-write-btn">再写一封</button>
        </div>
        <div id="outbox-list" class="outbox-list">
          <div class="empty-state-box">正在加载寄件箱...</div>
        </div>
      </div>
    </div>
  `;

  root.querySelector('#outbox-write-btn').addEventListener('click', () => navigate('/editor'));

  const listEl = root.querySelector('#outbox-list');
  fetchOutbox(outboxId)
    .then((data) => {
      const letters = data.letters || [];
      if (!letters.length) {
        listEl.innerHTML = `<div class="empty-state-box">寄件箱里还没有信，快去制作第一张生日贺卡吧。</div>`;
        return;
      }

      listEl.innerHTML = letters
        .map((item) => {
          const tpl = getTemplate(item.templateId);
          let badgeText = '已送达';
          let timeText = `${formatShortTime(item.deliverAt)} 送达`;
          if (item.status === 'opened') {
            badgeText = '已拆封';
            timeText = `${formatShortTime(item.openedAt)} 拆开`;
          } else if (item.status === 'scheduled') {
            badgeText = '在路上';
            timeText = `将于 ${formatShortTime(item.deliverAt)} 送达`;
          }

          return `
            <div class="outbox-item">
              <img src="${resolveAssetUrl(tpl.thumbUrl)}" alt="${tpl.nameZh}" class="outbox-thumb" />
              <div class="outbox-meta">
                <div class="outbox-recipient">寄给 ${item.recipientName}</div>
                <div class="outbox-status-row">
                  <span class="status-badge ${item.status}">${badgeText}</span>
                  <span class="outbox-time">${timeText}</span>
                </div>
              </div>
              <div class="outbox-actions">
                <button type="button" class="secondary-pill-btn" data-copy-id="${item.id}">复制链接</button>
                <button type="button" class="primary-pill-btn" style="height:36px;padding:0 14px;font-size:13px;" data-open-id="${item.id}">查看</button>
              </div>
            </div>
          `;
        })
        .join('');

      listEl.querySelectorAll('[data-copy-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.copyId;
          const found = letters.find((x) => x.id === id);
          const url = buildShareUrl({ id, ...(found || {}) });
          try {
            await navigator.clipboard.writeText(url);
            showToast('收信链接已复制');
          } catch {
            showToast(url);
          }
        });
      });

      listEl.querySelectorAll('[data-open-id]').forEach((btn) => {
        btn.addEventListener('click', () => navigate(`/letter/${btn.dataset.openId}`));
      });
    })
    .catch((err) => {
      listEl.innerHTML = `<div class="empty-state-box">${err.message || '加载失败'}</div>`;
    });

  return () => {};
}
