import { resolveAssetUrl } from './config.js';
import { decodeSharePayload, isStandaloneMode } from './api.js';
import { mountHomeView } from './views/homeView.js';
import { mountEditorView } from './views/editorView.js';
import { mountLetterView } from './views/letterView.js';
import { mountOutboxView } from './views/outboxView.js';

const appEl = document.getElementById('app');
const loadingEl = document.getElementById('site-loading');
const toastContainer = document.getElementById('toast-container');

let currentCleanup = null;

export function showToast(message) {
  const pill = document.createElement('div');
  pill.className = 'toast-pill';
  pill.textContent = message;
  toastContainer.appendChild(pill);
  setTimeout(() => {
    pill.style.opacity = '0';
    pill.style.transition = 'opacity 0.25s ease';
    setTimeout(() => pill.remove(), 260);
  }, 2400);
}

function useHashRouting() {
  return isStandaloneMode() || window.location.hash.startsWith('#/');
}

function getCurrentRoute() {
  if (useHashRouting()) {
    const hash = window.location.hash || '#/';
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    const [pathname, search = ''] = raw.split('?');
    return { pathname: pathname || '/', query: new URLSearchParams(search) };
  }
  return {
    pathname: window.location.pathname || '/',
    query: new URLSearchParams(window.location.search),
  };
}

export function navigate(url) {
  if (useHashRouting()) {
    const clean = url.startsWith('/') ? url : `/${url}`;
    const targetHash = `#${clean}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      renderRoute();
    }
    return;
  }

  const target = new URL(url, window.location.origin);
  const fullPath = target.pathname + target.search;
  if (window.location.pathname + window.location.search !== fullPath) {
    window.history.pushState({}, '', fullPath);
  }
  renderRoute();
}

function renderRoute() {
  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  const { pathname, query } = getCurrentRoute();
  const ctx = { navigate, showToast, query };

  if (pathname === '/editor') {
    currentCleanup = mountEditorView(appEl, ctx);
  } else if (pathname.startsWith('/share/')) {
    const token = decodeURIComponent(pathname.slice('/share/'.length).replace(/\/+$/, ''));
    const sharedPayload = decodeSharePayload(token);
    currentCleanup = mountLetterView(appEl, {
      ...ctx,
      letterId: sharedPayload?.id || 'shared',
      sharedPayload,
    });
  } else if (pathname.startsWith('/letter/')) {
    const letterId = decodeURIComponent(pathname.slice('/letter/'.length).replace(/\/+$/, ''));
    currentCleanup = mountLetterView(appEl, { ...ctx, letterId });
  } else if (pathname.startsWith('/outbox/')) {
    const outboxId = decodeURIComponent(pathname.slice('/outbox/'.length).replace(/\/+$/, ''));
    currentCleanup = mountOutboxView(appEl, { ...ctx, outboxId });
  } else {
    currentCleanup = mountHomeView(appEl, ctx);
  }
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-nav]');
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute('href'));
  }
});

window.addEventListener('popstate', renderRoute);
window.addEventListener('hashchange', renderRoute);

async function bootstrap() {
  const splashMark = document.querySelector('.loading-mark');
  if (splashMark) {
    splashMark.src = resolveAssetUrl('/assets/brand/mark.png');
  }
  renderRoute();
  await Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 900)),
  ]);
  setTimeout(() => {
    loadingEl.classList.add('hidden');
    loadingEl.setAttribute('aria-hidden', 'true');
  }, 260);
}

bootstrap();
