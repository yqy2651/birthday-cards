import * as THREE from 'three';
import {
  FONTS,
  PAPERS,
  PRESET_MUSIC,
  PRESET_WISHES,
  RED_PACKET_AMOUNTS,
  STICKERS,
  TEMPLATES,
  createDefaultRedPacket,
  getFont,
  getStickerMeta,
  getTemplate,
  resolveAssetUrl,
} from '../config.js';
import {
  buildShareUrl,
  createLetter,
  fetchLetter,
  getStoredOutboxId,
  uploadAudio,
} from '../api.js';
import { audioEngine } from '../audio.js';
import { openRedPacketModal } from '../components/redPacketModal.js';
import { SceneManager } from '../three/sceneManager.js';
import { BiFoldCard3D, PAGE_H, PAGE_W } from '../three/card3d.js';
import { Envelope3D } from '../three/envelope3d.js';
import { RED_PACKET_SLOT, getTextSlotBounds } from '../three/textures.js';

const ICONS = {
  back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  cover: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  paper: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`,
  sticker: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/><path d="M8 13h.01"/><path d="M16 13h.01"/><path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1"/></svg>`,
  text: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  music: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  book: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  prev: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>`,
  next: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`,
  zoomOut: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
  zoomIn: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
  undo: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>`,
  redo: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>`,
  eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
  copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
};

function extractRecipientName(greeting, fallback = 'Friend') {
  const g = (greeting || '').trim();
  if (!g) return fallback;
  let cleaned = g.replace(/^(dear|to|hi|hello|亲爱的|致|给)\s*/i, '');
  cleaned = cleaned.replace(/[,，!！:：\s]+$/, '').trim();
  return cleaned || fallback;
}

function getLocalMidnightIso(daysAhead = 1) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysAhead, 0, 0, 0, 0);
  return target.toISOString();
}

function getWeekendDaysAhead() {
  const day = new Date().getDay();
  const diff = (6 - day + 7) % 7;
  return diff === 0 ? 7 : diff;
}

export function mountEditorView(root, { navigate, showToast, query }) {
  const initialTemplate = TEMPLATES.some((t) => t.id === query.get('template'))
    ? query.get('template')
    : TEMPLATES[0].id;

  const state = {
    step: 'design', // 'design' | 'seal' | 'sent'
    activeTab: 'cover', // 'cover' | 'paper' | 'stickers' | 'text' | 'music'
    isOpen: false,
    previewMode: false,
    zoom: 1.0,
    templateId: initialTemplate,
    paper: 'watercolor',
    font: 'english',
    greeting: '',
    body: '',
    signature: '',
    stickers: [],
    audioUrl: null,
    audioName: null,
    presetAudio: null,
    coverCloseup: true,
    effects3d: true,
    redPacket: createDefaultRedPacket(),
    redPacketClaimed: false,
    closeupPreview: false,
    closeupStopIdx: 0,
    selectedStickerUid: null,
    activeSlot: null,
  };

  const history = [];
  let historyIdx = -1;

  function snapshot() {
    return JSON.stringify({
      templateId: state.templateId,
      paper: state.paper,
      font: state.font,
      greeting: state.greeting,
      body: state.body,
      signature: state.signature,
      stickers: state.stickers,
      coverCloseup: state.coverCloseup,
      effects3d: state.effects3d,
      redPacket: state.redPacket,
    });
  }

  function pushHistory() {
    const snap = snapshot();
    if (history[historyIdx] === snap) return;
    history.splice(historyIdx + 1);
    history.push(snap);
    if (history.length > 40) history.shift();
    historyIdx = history.length - 1;
    updateHistoryButtons();
  }

  function applySnapshot(snapStr) {
    const parsed = JSON.parse(snapStr);
    Object.assign(state, parsed);
    state.selectedStickerUid = null;
    card.setState(parsed);
    renderDrawer();
    updateHistoryButtons();
  }

  function undo() {
    if (historyIdx <= 0) return;
    historyIdx--;
    applySnapshot(history[historyIdx]);
  }

  function redo() {
    if (historyIdx >= history.length - 1) return;
    historyIdx++;
    applySnapshot(history[historyIdx]);
  }

  root.innerHTML = `
    <div class="editor-shell">
      <header class="editor-topbar" id="ed-topbar">
        <button type="button" class="topbar-back-btn" id="ed-home-btn">${ICONS.back}<span>生日信</span></button>
        <div class="topbar-stepper">
          <span class="step-label active" id="step-lbl-design">做卡</span>
          <span class="step-sep">&gt;</span>
          <span class="step-label" id="step-lbl-seal">封装</span>
        </div>
        <div class="topbar-actions" id="ed-top-actions">
          <button type="button" class="topbar-cta" id="ed-next-btn">下一步</button>
        </div>
      </header>
      <div class="editor-body" id="ed-body">
        <aside class="editor-rail" id="ed-rail">
          <button type="button" class="rail-tab-btn active" data-tab="cover">${ICONS.cover}<span>封面</span></button>
          <button type="button" class="rail-tab-btn" data-tab="paper">${ICONS.paper}<span>纸张</span></button>
          <button type="button" class="rail-tab-btn" data-tab="stickers">${ICONS.sticker}<span>贴纸</span></button>
          <button type="button" class="rail-tab-btn" data-tab="text">${ICONS.text}<span>文字</span></button>
          <button type="button" class="rail-tab-btn" data-tab="music">${ICONS.music}<span>音乐</span></button>
        </aside>
        <main class="editor-stage" id="ed-stage">
          <div class="stage-canvas-wrap" id="ed-canvas-wrap"></div>
          <div class="canvas-overlay-layer" id="ed-overlay-layer"></div>
          <div class="stage-pagination" id="ed-pagination">
            <button type="button" class="page-nav-btn" id="ed-page-prev" aria-label="上一页">${ICONS.prev}</button>
            <span class="page-indicator" id="ed-page-label">封面 · 1/2</span>
            <button type="button" class="page-nav-btn" id="ed-page-next" aria-label="下一页">${ICONS.next}</button>
            <button type="button" class="page-nav-btn" id="ed-open-toggle" title="翻开贺卡" aria-label="翻开贺卡">${ICONS.book}</button>
          </div>
        </main>
        <aside class="editor-drawer" id="ed-drawer"></aside>
      </div>
      <footer class="editor-bottombar" id="ed-bottombar">
        <div class="zoom-group">
          <button type="button" class="bar-icon-btn" id="ed-zoom-out" title="缩小">${ICONS.zoomOut}</button>
          <span class="zoom-readout" id="ed-zoom-val">100%</span>
          <button type="button" class="bar-icon-btn" id="ed-zoom-in" title="放大">${ICONS.zoomIn}</button>
        </div>
        <div class="history-group">
          <button type="button" class="bar-icon-btn" id="ed-undo" title="撤销" disabled>${ICONS.undo}</button>
          <button type="button" class="bar-icon-btn" id="ed-redo" title="重做" disabled>${ICONS.redo}</button>
          <button type="button" class="bar-icon-btn" id="ed-preview" title="预览">${ICONS.eye}</button>
        </div>
      </footer>
    </div>
  `;

  const topbarEl = root.querySelector('#ed-topbar');
  const railEl = root.querySelector('#ed-rail');
  const drawerEl = root.querySelector('#ed-drawer');
  const bottombarEl = root.querySelector('#ed-bottombar');
  const stageEl = root.querySelector('#ed-stage');
  const canvasWrap = root.querySelector('#ed-canvas-wrap');
  const overlayLayer = root.querySelector('#ed-overlay-layer');
  const bodyEl = root.querySelector('#ed-body');
  const paginationEl = root.querySelector('#ed-pagination');
  const pageLabelEl = root.querySelector('#ed-page-label');

  const sceneMgr = new SceneManager(canvasWrap);
  sceneMgr.camera.position.set(0, 0, 8.2);

  const card = new BiFoldCard3D({
    templateId: state.templateId,
    paper: state.paper,
    font: state.font,
    greeting: state.greeting,
    body: state.body,
    signature: state.signature,
    stickers: state.stickers,
    effects3d: state.effects3d,
    redPacket: state.redPacket,
    showcase: false,
  });
  sceneMgr.scene.add(card.group);

  // Seal stage envelope (attached only in 'seal' mode)
  const envelope = new Envelope3D();
  envelope.group.visible = false;
  sceneMgr.scene.add(envelope.group);

  pushHistory();

  let yaw = 0;
  let pitch = 0;
  let draggingOrbit = false;
  let draggingSticker = false;
  let downX = 0;
  let downY = 0;
  let lastX = 0;
  let lastY = 0;
  let movedDist = 0;

  // Seal state
  let sealPhase = 'entering'; // 'entering' | 'ready' | 'stamped'
  let sealProgress = 0;
  let holdTimer = null;
  let holdStart = 0;
  let sealCardY = 3.0;
  let sealElapsed = 0;
  let sentResult = null;
  let recipientOverride = '';
  let scheduleMode = 'now';
  let customDateVal = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  function updateHistoryButtons() {
    const undoBtn = root.querySelector('#ed-undo');
    const redoBtn = root.querySelector('#ed-redo');
    if (undoBtn) undoBtn.disabled = historyIdx <= 0;
    if (redoBtn) redoBtn.disabled = historyIdx >= history.length - 1;
  }

  let closeupAutoTimer = 0;

  function renderCloseupStopsBar() {
    const oldBar = stageEl.querySelector('#ed-closeup-stops');
    if (oldBar) oldBar.remove();
    if (state.step !== 'design' || state.isOpen || !state.closeupPreview) return;

    const stops = getTemplate(state.templateId).closeupStops || [];
    if (!stops.length) return;
    const bar = document.createElement('div');
    bar.id = 'ed-closeup-stops';
    bar.className = 'closeup-stops-bar';
    bar.innerHTML = stops
      .map(
        (s, idx) =>
          `<button type="button" class="closeup-stop-pill ${idx === state.closeupStopIdx ? 'active' : ''}" data-stop="${idx}">${s.label}</button>`
      )
      .join('');
    bar.querySelectorAll('.closeup-stop-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.closeupStopIdx = Number(btn.dataset.stop);
        closeupAutoTimer = 0;
        renderCloseupStopsBar();
      });
    });
    stageEl.appendChild(bar);
  }

  function setCardOpen(open) {
    if (state.isOpen === open) return;
    if (open && state.closeupPreview) {
      state.closeupPreview = false;
      renderCloseupStopsBar();
      if (state.activeTab === 'cover') renderDrawer();
    }
    state.isOpen = open;
    audioEngine.playCardFlipSfx();
    card.setOpen(open);
    if (open && state.effects3d) {
      sceneMgr.triggerCelebrationBurst(0, 0.1, 0.5);
    }
    sceneMgr.setSparklesVisible(open && state.step === 'design');
    pageLabelEl.textContent = open ? '内页 · 2/2' : '封面 · 1/2';
    if (!open) {
      yaw = 0;
      pitch = 0;
      card.setOrbit(0, 0);
      closeInlineEditor();
      state.selectedStickerUid = null;
      renderOverlays();
    }
  }

  function closeInlineEditor() {
    state.activeSlot = null;
    const existing = overlayLayer.querySelector('.inline-text-editor');
    if (existing) existing.remove();
  }

  function openInlineEditor(slotName) {
    if (!state.isOpen || state.step !== 'design' || state.previewMode) return;
    closeInlineEditor();
    state.selectedStickerUid = null;
    state.activeSlot = slotName;

    const rect = canvasWrap.getBoundingClientRect();
    const box = card.getSlotScreenBox(slotName, sceneMgr.camera, rect);
    if (!box) return;

    const fontMeta = getFont(state.font);
    const isBody = slotName === 'body';
    const el = document.createElement(isBody ? 'textarea' : 'input');
    if (!isBody) el.type = 'text';
    el.className = 'inline-text-editor';
    el.value = state[slotName] || '';
    el.placeholder =
      slotName === 'greeting'
        ? 'Dear name,'
        : slotName === 'signature'
          ? '— your name'
          : 'Write your birthday wishes...';
    el.style.left = `${Math.max(8, box.left)}px`;
    el.style.top = `${Math.max(8, box.top)}px`;
    el.style.width = `${Math.max(140, box.width)}px`;
    el.style.height = isBody ? `${Math.max(110, box.height)}px` : `${Math.max(38, box.height)}px`;
    el.style.fontFamily = fontMeta.cssFamily;
    el.style.fontStyle = fontMeta.italic ? 'italic' : 'normal';
    el.style.fontSize = slotName === 'greeting' ? '18px' : '16px';
    el.style.textAlign = slotName === 'signature' ? 'right' : 'left';

    const commit = () => {
      state[slotName] = el.value;
      card.setState({ [slotName]: state[slotName] });
      pushHistory();
      if (state.activeTab === 'text') renderDrawer();
      closeInlineEditor();
    };

    el.addEventListener('input', () => {
      state[slotName] = el.value;
      card.setState({ [slotName]: state[slotName] });
    });
    el.addEventListener('blur', commit);
    if (!isBody) {
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          el.blur();
        }
      });
    }

    overlayLayer.appendChild(el);
    el.focus();
  }

  function renderOverlays() {
    // Keep active inline text editor intact; update sticker gizmo
    const oldGizmo = overlayLayer.querySelector('.sticker-gizmo');
    if (oldGizmo) oldGizmo.remove();

    if (
      state.step !== 'design' ||
      !state.isOpen ||
      state.previewMode ||
      !state.selectedStickerUid
    ) {
      return;
    }

    const st = state.stickers.find((s) => s.uid === state.selectedStickerUid);
    if (!st) return;

    const rect = canvasWrap.getBoundingClientRect();
    const halfSpan = (st.scale ?? 1) * 0.105;
    const tl = card.projectUvToScreen(st.side || 'right', st.u - halfSpan, st.v - halfSpan * (PAGE_W / PAGE_H), sceneMgr.camera, rect);
    const br = card.projectUvToScreen(st.side || 'right', st.u + halfSpan, st.v + halfSpan * (PAGE_W / PAGE_H), sceneMgr.camera, rect);

    const w = Math.max(44, Math.abs(br.x - tl.x));
    const h = Math.max(44, Math.abs(br.y - tl.y));
    const left = Math.min(tl.x, br.x);
    const top = Math.min(tl.y, br.y);

    const gizmo = document.createElement('div');
    gizmo.className = 'sticker-gizmo';
    gizmo.style.left = `${left}px`;
    gizmo.style.top = `${top}px`;
    gizmo.style.width = `${w}px`;
    gizmo.style.height = `${h}px`;
    gizmo.innerHTML = `
      <button type="button" class="gizmo-handle gizmo-delete" title="删除">×</button>
      <button type="button" class="gizmo-handle gizmo-rotate" title="旋转">↻</button>
      <button type="button" class="gizmo-handle gizmo-scale" title="缩放">↘</button>
    `;

    gizmo.querySelector('.gizmo-delete').addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      state.stickers = state.stickers.filter((s) => s.uid !== st.uid);
      state.selectedStickerUid = null;
      card.setState({ stickers: state.stickers });
      pushHistory();
      renderOverlays();
    });

    // Drag to move sticker
    gizmo.addEventListener('pointerdown', (ev) => {
      if (ev.target.closest('.gizmo-handle')) return;
      ev.stopPropagation();
      draggingSticker = true;
      gizmo.setPointerCapture(ev.pointerId);

      const onMove = (mv) => {
        const ndc = sceneMgr.getNdc(mv.clientX, mv.clientY);
        const hit = card.raycast(ndc, sceneMgr.camera);
        if (hit && (hit.hit === 'left' || hit.hit === 'right')) {
          st.side = hit.hit;
          st.u = Math.max(0.08, Math.min(0.92, hit.u));
          st.v = Math.max(0.08, Math.min(0.92, hit.v));
          card.setState({ stickers: state.stickers });
          renderOverlays();
        }
      };
      const onUp = () => {
        draggingSticker = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        pushHistory();
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });

    // Scale handle
    gizmo.querySelector('.gizmo-scale').addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      const startScale = st.scale ?? 1;
      const sx = ev.clientX;
      const sy = ev.clientY;
      const onMove = (mv) => {
        const delta = (mv.clientX - sx + mv.clientY - sy) * 0.008;
        st.scale = Math.max(0.45, Math.min(2.2, startScale + delta));
        card.setState({ stickers: state.stickers });
        renderOverlays();
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        pushHistory();
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });

    // Rotate handle
    gizmo.querySelector('.gizmo-rotate').addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      const cx = left + w / 2 + rect.left;
      const cy = top + h / 2 + rect.top;
      const startAng = Math.atan2(ev.clientY - cy, ev.clientX - cx);
      const origRot = st.rotation ?? 0;
      const onMove = (mv) => {
        const curAng = Math.atan2(mv.clientY - cy, mv.clientX - cx);
        st.rotation = origRot + ((curAng - startAng) * 180) / Math.PI;
        card.setState({ stickers: state.stickers });
        renderOverlays();
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        pushHistory();
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });

    overlayLayer.appendChild(gizmo);
  }

  function addSticker(stickerId, side = 'right', u = null, v = null) {
    setCardOpen(true);
    const idx = state.stickers.length;
    const uid = `st_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const px = u ?? 0.34 + ((idx * 17) % 36) / 100;
    const py = v ?? 0.42 + ((idx * 13) % 28) / 100;
    state.stickers.push({
      uid,
      stickerId,
      side,
      u: px,
      v: py,
      scale: 0.95,
      rotation: 0,
    });
    state.selectedStickerUid = uid;
    card.setState({ stickers: state.stickers });
    pushHistory();
    setTimeout(renderOverlays, 60);
  }

  function renderDrawer() {
    if (state.step !== 'design') return;
    const tab = state.activeTab;

    if (tab === 'cover') {
      drawerEl.innerHTML = `
        <h2 class="drawer-title">封面</h2>
        <p class="drawer-subtitle">换封面插画，你写的内容和贴纸会保留</p>
        <div class="cover-grid">
          ${TEMPLATES.map((t) => `
            <button type="button" class="cover-card-option ${state.templateId === t.id ? 'active' : ''}" data-tpl="${t.id}">
              <img src="${resolveAssetUrl(t.coverUrl)}" alt="${t.nameZh}" />
              ${state.templateId === t.id ? `<span class="cover-check">${ICONS.check}</span>` : ''}
              <span class="cover-name-tag">${t.nameZh}</span>
            </button>
          `).join('')}
        </div>
        <div class="fx-settings-card">
          <div class="toggle-row">
            <div class="toggle-meta">
              <span class="toggle-title">封面动态特写</span>
              <span class="toggle-desc">微距巡游封面重点工艺与烫金细节</span>
            </div>
            <button type="button" class="ios-switch" id="ed-closeup-toggle" role="switch" aria-checked="${state.coverCloseup}"></button>
          </div>
          <div class="toggle-row">
            <div class="toggle-meta">
              <span class="toggle-title">动态 3D 特效</span>
              <span class="toggle-desc">开启立体烛光星尘、花瓣漂浮与开卡彩带</span>
            </div>
            <button type="button" class="ios-switch" id="ed-fx3d-toggle" role="switch" aria-checked="${state.effects3d}"></button>
          </div>
          <button type="button" class="secondary-pill-btn" id="ed-closeup-preview-btn" style="width:100%;margin-top:2px;">
            ${state.closeupPreview ? '退出封面特写' : '预览封面动态特写'}
          </button>
        </div>
      `;
      drawerEl.querySelectorAll('.cover-card-option').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.templateId = btn.dataset.tpl;
          state.closeupStopIdx = 0;
          closeupAutoTimer = 0;
          card.setState({ templateId: state.templateId });
          pushHistory();
          renderCloseupStopsBar();
          renderDrawer();
        });
      });
      drawerEl.querySelector('#ed-closeup-toggle').addEventListener('click', () => {
        state.coverCloseup = !state.coverCloseup;
        if (!state.coverCloseup && state.closeupPreview) {
          state.closeupPreview = false;
          renderCloseupStopsBar();
        }
        pushHistory();
        renderDrawer();
      });
      drawerEl.querySelector('#ed-fx3d-toggle').addEventListener('click', () => {
        state.effects3d = !state.effects3d;
        card.setState({ effects3d: state.effects3d });
        pushHistory();
        renderDrawer();
      });
      drawerEl.querySelector('#ed-closeup-preview-btn').addEventListener('click', () => {
        setCardOpen(false);
        state.closeupPreview = !state.closeupPreview;
        state.closeupStopIdx = 0;
        closeupAutoTimer = 0;
        renderCloseupStopsBar();
        renderDrawer();
      });
      return;
    }

    if (tab === 'paper') {
      drawerEl.innerHTML = `
        <h2 class="drawer-title">纸张</h2>
        <p class="drawer-subtitle">改变内页和纸边的质感</p>
        <div class="paper-list">
          ${Object.values(PAPERS).map((p) => `
            <button type="button" class="paper-option ${state.paper === p.id ? 'active' : ''}" data-paper="${p.id}">
              <span class="paper-swatch ${p.id}"></span>
              <span>${p.nameZh}</span>
            </button>
          `).join('')}
        </div>
      `;
      drawerEl.querySelectorAll('.paper-option').forEach((btn) => {
        btn.addEventListener('click', () => {
          setCardOpen(true);
          state.paper = btn.dataset.paper;
          card.setState({ paper: state.paper });
          pushHistory();
          renderDrawer();
        });
      });
      return;
    }

    if (tab === 'stickers') {
      drawerEl.innerHTML = `
        <h2 class="drawer-title">贴纸</h2>
        <p class="drawer-subtitle">点一下放到右页，或者拖到卡片上</p>
        <div class="sticker-grid">
          ${STICKERS.map((s) => `
            <button type="button" class="sticker-cell" data-sticker="${s.id}" title="${s.name}" draggable="true">
              <img src="${resolveAssetUrl(s.url)}" alt="${s.name}" />
            </button>
          `).join('')}
        </div>
        <div class="sticker-tip">选中卡片上的贴纸后可拖拽位置、旋转或缩放；也可在两页内页自由点缀。</div>
      `;
      drawerEl.querySelectorAll('.sticker-cell').forEach((btn) => {
        btn.addEventListener('click', () => addSticker(btn.dataset.sticker));
        btn.addEventListener('dragstart', (ev) => {
          ev.dataTransfer.setData('text/sticker-id', btn.dataset.sticker);
        });
      });
      return;
    }

    if (tab === 'text') {
      drawerEl.innerHTML = `
        <h2 class="drawer-title">文字</h2>
        <p class="drawer-subtitle">点卡片上的称呼、正文或落款，直接在纸上写</p>
        <div class="panel-section-label">字体 · 正文</div>
        <div class="font-pills">
          ${FONTS.map((f) => `
            <button type="button" class="font-pill-btn ${f.cssClass} ${state.font === f.id ? 'active' : ''}" data-font="${f.id}">
              ${f.label}
            </button>
          `).join('')}
        </div>
        <div class="panel-section-label">常用祝福 · 点一下写进正文</div>
        <div class="preset-wish-list">
          ${PRESET_WISHES.map((w, i) => `
            <button type="button" class="preset-wish-btn" data-wish-idx="${i}">${w}</button>
          `).join('')}
        </div>
        <div class="text-inputs-stack">
          <div class="field-group">
            <label for="ed-in-greeting">称呼</label>
            <input id="ed-in-greeting" class="field-input" type="text" placeholder="Dear name," value="${(state.greeting || '').replace(/"/g, '&quot;')}" />
          </div>
          <div class="field-group">
            <label for="ed-in-body">正文</label>
            <textarea id="ed-in-body" class="field-textarea" placeholder="写下你的生日祝福...">${state.body || ''}</textarea>
          </div>
          <div class="field-group">
            <label for="ed-in-sig">落款</label>
            <input id="ed-in-sig" class="field-input" type="text" placeholder="— your name" value="${(state.signature || '').replace(/"/g, '&quot;')}" />
          </div>
        </div>
        <div class="fx-settings-card" style="margin-top:16px;">
          <div class="toggle-row">
            <div class="toggle-meta">
              <span class="toggle-title">祝福结尾 · 微信红包</span>
              <span class="toggle-desc">在祝福末尾附带可点击拆开的微信红包彩蛋</span>
            </div>
            <button type="button" class="ios-switch wx" id="ed-rp-toggle" role="switch" aria-checked="${Boolean(state.redPacket?.enabled)}"></button>
          </div>
          ${state.redPacket?.enabled ? `
            <div class="rp-config-box">
              <div class="field-group">
                <label>红包金额（元）</label>
                <div class="rp-amount-pills" style="margin-bottom:6px;">
                  ${RED_PACKET_AMOUNTS.map((amt) => `
                    <button type="button" class="rp-amount-pill ${state.redPacket.amount === amt ? 'active' : ''}" data-rp-amt="${amt}">¥${amt}</button>
                  `).join('')}
                </div>
                <input id="ed-rp-amount" class="field-input" type="text" placeholder="88.88" value="${(state.redPacket.amount || '').replace(/"/g, '&quot;')}" />
              </div>
              <div class="field-group">
                <label for="ed-rp-wish">红包封面祝福语</label>
                <input id="ed-rp-wish" class="field-input" type="text" placeholder="生日快乐，大吉大利！" value="${(state.redPacket.wish || '').replace(/"/g, '&quot;')}" />
              </div>
              <div class="field-group">
                <label for="ed-rp-code">微信红包封面码 / 兑现暗号（选填）</label>
                <input id="ed-rp-code" class="field-input" type="text" placeholder="例如：微信搜索封面码或转账暗号" value="${(state.redPacket.claimCode || '').replace(/"/g, '&quot;')}" />
              </div>
              <button type="button" class="rp-action-btn" id="ed-rp-preview-btn" style="width:100%;height:34px;font-size:12px;">预览拆微信红包效果</button>
            </div>
          ` : ''}
        </div>
      `;

      drawerEl.querySelectorAll('.font-pill-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          setCardOpen(true);
          state.font = btn.dataset.font;
          card.setState({ font: state.font });
          pushHistory();
          renderDrawer();
        });
      });

      drawerEl.querySelectorAll('.preset-wish-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          setCardOpen(true);
          const wish = PRESET_WISHES[Number(btn.dataset.wishIdx)];
          state.body = wish;
          card.setState({ body: wish });
          pushHistory();
          renderDrawer();
        });
      });

      const bindField = (id, key) => {
        const el = drawerEl.querySelector(id);
        el.addEventListener('input', () => {
          setCardOpen(true);
          state[key] = el.value;
          card.setState({ [key]: el.value });
        });
        el.addEventListener('change', () => pushHistory());
      };
      bindField('#ed-in-greeting', 'greeting');
      bindField('#ed-in-body', 'body');
      bindField('#ed-in-sig', 'signature');

      drawerEl.querySelector('#ed-rp-toggle').addEventListener('click', () => {
        setCardOpen(true);
        state.redPacket = {
          ...(state.redPacket || createDefaultRedPacket()),
          enabled: !state.redPacket?.enabled,
        };
        state.redPacketClaimed = false;
        card.setState({ redPacket: state.redPacket, redPacketClaimed: false });
        pushHistory();
        renderDrawer();
      });

      if (state.redPacket?.enabled) {
        drawerEl.querySelectorAll('[data-rp-amt]').forEach((btn) => {
          btn.addEventListener('click', () => {
            state.redPacket.amount = btn.dataset.rpAmt;
            card.setState({ redPacket: state.redPacket });
            pushHistory();
            renderDrawer();
          });
        });

        const rpAmtEl = drawerEl.querySelector('#ed-rp-amount');
        rpAmtEl.addEventListener('input', () => {
          state.redPacket.amount = rpAmtEl.value;
          card.setState({ redPacket: state.redPacket });
        });
        rpAmtEl.addEventListener('change', () => pushHistory());

        const rpWishEl = drawerEl.querySelector('#ed-rp-wish');
        rpWishEl.addEventListener('input', () => {
          state.redPacket.wish = rpWishEl.value;
          card.setState({ redPacket: state.redPacket });
        });
        rpWishEl.addEventListener('change', () => pushHistory());

        const rpCodeEl = drawerEl.querySelector('#ed-rp-code');
        rpCodeEl.addEventListener('input', () => {
          state.redPacket.claimCode = rpCodeEl.value;
          card.setState({ redPacket: state.redPacket });
        });
        rpCodeEl.addEventListener('change', () => pushHistory());

        drawerEl.querySelector('#ed-rp-preview-btn').addEventListener('click', () => {
          openRedPacketPreview();
        });
      }
      return;
    }

    if (tab === 'music') {
      const hasCustom = Boolean(state.audioUrl);
      const isPlayingNow = audioEngine.playing;
      drawerEl.innerHTML = `
        <h2 class="drawer-title">音乐</h2>
        <p class="drawer-subtitle">MP3、WAV、M4A 等，15MB 以内。朋友打开信后可以播放。</p>
        <input type="file" id="ed-audio-file" accept=".mp3,.wav,.m4a,.ogg,.aac,.webm,audio/*" hidden />
        <button type="button" class="audio-upload-box" id="ed-audio-pick">
          ${ICONS.music}
          <span>选择一个音频文件</span>
        </button>
        ${hasCustom ? `
          <div class="audio-active-card">
            <div class="audio-active-row">
              <span class="audio-track-name">${state.audioName || '已上传音乐'}</span>
              <button type="button" class="secondary-pill-btn" id="ed-audio-remove" style="height:26px;padding:0 10px;font-size:12px;">移除</button>
            </div>
            <button type="button" class="secondary-pill-btn" id="ed-audio-test">
              ${isPlayingNow ? '暂停试听' : '试听音频'}
            </button>
          </div>
        ` : ''}
        <div class="preset-music-list">
          <div class="panel-section-label" style="margin-bottom:2px;">或选用内置生日八音盒</div>
          ${PRESET_MUSIC.map((m) => `
            <button type="button" class="preset-music-btn ${state.presetAudio === m.id && !hasCustom ? 'active' : ''}" data-preset="${m.id}">
              <span>${m.name}</span>
              <span>${state.presetAudio === m.id && !hasCustom ? (isPlayingNow ? '播放中' : '已选') : '选用'}</span>
            </button>
          `).join('')}
        </div>
      `;

      const fileInput = drawerEl.querySelector('#ed-audio-file');
      drawerEl.querySelector('#ed-audio-pick').addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        if (file.size > 15 * 1024 * 1024) {
          showToast('音频文件不能超过 15MB');
          return;
        }
        try {
          showToast('正在上传音频...');
          const res = await uploadAudio(file);
          state.audioUrl = res.audioUrl;
          state.audioName = res.audioName;
          state.presetAudio = null;
          showToast('音乐已添加');
          renderDrawer();
        } catch (err) {
          showToast(err.message || '上传失败');
        }
      });

      if (hasCustom) {
        drawerEl.querySelector('#ed-audio-remove').addEventListener('click', () => {
          audioEngine.stop();
          state.audioUrl = null;
          state.audioName = null;
          renderDrawer();
        });
        drawerEl.querySelector('#ed-audio-test').addEventListener('click', () => {
          audioEngine.toggle({ audioUrl: state.audioUrl });
          renderDrawer();
        });
      }

      drawerEl.querySelectorAll('.preset-music-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const pid = btn.dataset.preset;
          if (state.presetAudio === pid && !state.audioUrl) {
            audioEngine.toggle({ presetAudio: pid });
          } else {
            state.audioUrl = null;
            state.audioName = null;
            state.presetAudio = pid;
            audioEngine.play({ presetAudio: pid });
          }
          renderDrawer();
        });
      });
    }
  }

  // Drag & drop sticker onto 3D canvas
  canvasWrap.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  canvasWrap.addEventListener('drop', (e) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('text/sticker-id');
    if (!stickerId || state.step !== 'design') return;
    setCardOpen(true);
    const ndc = sceneMgr.getNdc(e.clientX, e.clientY);
    const hit = card.raycast(ndc, sceneMgr.camera);
    if (hit && (hit.hit === 'left' || hit.hit === 'right')) {
      addSticker(stickerId, hit.hit, hit.u, hit.v);
    } else {
      addSticker(stickerId, 'right');
    }
  });

  // Left tool rail switching
  railEl.querySelectorAll('.rail-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.tab;
      railEl.querySelectorAll('.rail-tab-btn').forEach((b) => b.classList.toggle('active', b === btn));
      if (state.activeTab !== 'cover' && state.closeupPreview) {
        state.closeupPreview = false;
        renderCloseupStopsBar();
      }
      if (state.activeTab !== 'stickers') {
        state.selectedStickerUid = null;
        renderOverlays();
      }
      if (['paper', 'stickers', 'text'].includes(state.activeTab)) {
        setCardOpen(true);
      } else if (state.activeTab === 'cover') {
        setCardOpen(false);
      }
      renderDrawer();
    });
  });

  // Pagination & zoom & undo/redo & preview
  root.querySelector('#ed-page-prev').addEventListener('click', () => setCardOpen(false));
  root.querySelector('#ed-page-next').addEventListener('click', () => setCardOpen(true));
  root.querySelector('#ed-open-toggle').addEventListener('click', () => setCardOpen(!state.isOpen));

  function updateZoom(delta) {
    state.zoom = Math.max(0.75, Math.min(1.4, Number((state.zoom + delta).toFixed(2))));
    root.querySelector('#ed-zoom-val').textContent = `${Math.round(state.zoom * 100)}%`;
    sceneMgr.camera.position.z = 8.2 / state.zoom;
    renderOverlays();
  }
  root.querySelector('#ed-zoom-out').addEventListener('click', () => updateZoom(-0.1));
  root.querySelector('#ed-zoom-in').addEventListener('click', () => updateZoom(0.1));
  root.querySelector('#ed-undo').addEventListener('click', undo);
  root.querySelector('#ed-redo').addEventListener('click', redo);

  let exitPreviewBtn = null;
  function setPreview(on) {
    state.previewMode = on;
    closeInlineEditor();
    state.selectedStickerUid = null;
    renderOverlays();

    railEl.style.display = on ? 'none' : '';
    drawerEl.style.display = on ? 'none' : '';
    topbarEl.style.display = on ? 'none' : '';
    bottombarEl.style.display = on ? 'none' : '';
    sceneMgr.resize();

    if (on && !exitPreviewBtn) {
      exitPreviewBtn = document.createElement('button');
      exitPreviewBtn.type = 'button';
      exitPreviewBtn.className = 'preview-exit-pill';
      exitPreviewBtn.textContent = '退出预览';
      exitPreviewBtn.addEventListener('click', () => setPreview(false));
      root.appendChild(exitPreviewBtn);
    } else if (!on && exitPreviewBtn) {
      exitPreviewBtn.remove();
      exitPreviewBtn = null;
    }
  }
  root.querySelector('#ed-preview').addEventListener('click', () => setPreview(true));

  // Canvas pointer handling (orbit + sticker pick + inline text click)
  const canvas = sceneMgr.renderer.domElement;
  canvas.addEventListener('pointerdown', (e) => {
    if (state.step !== 'design' || draggingSticker) return;
    draggingOrbit = true;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    movedDist = 0;
    canvas.setPointerCapture(e.pointerId);
  });

  function openRedPacketPreview() {
    openRedPacketModal({
      senderName: state.signature || '我',
      recipientName: extractRecipientName(state.greeting, '朋友'),
      redPacket: state.redPacket,
      claimed: false,
      showToast,
      onClaim: () => {
        state.redPacketClaimed = true;
        card.setState({ redPacketClaimed: true });
        if (state.effects3d) sceneMgr.triggerCelebrationBurst(0.6, 0, 0.7);
      },
    });
  }

  canvas.addEventListener('pointermove', (e) => {
    const ndc = sceneMgr.getNdc(e.clientX, e.clientY);
    sceneMgr.setPointerBias(ndc.x, ndc.y);

    if (!draggingOrbit || state.step !== 'design') return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    movedDist += Math.hypot(dx, dy);
    lastX = e.clientX;
    lastY = e.clientY;
    if (movedDist > 4) {
      yaw = Math.max(-0.78, Math.min(0.78, yaw + dx * 0.006));
      pitch = Math.max(-0.32, Math.min(0.32, pitch + dy * 0.0045));
      card.setOrbit(yaw, pitch);
      closeInlineEditor();
      renderOverlays();
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!draggingOrbit) return;
    draggingOrbit = false;
    if (canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    if (movedDist < 6 && state.step === 'design') {
      const ndc = sceneMgr.getNdc(e.clientX, e.clientY);
      const hit = card.raycast(ndc, sceneMgr.camera);
      if (!hit) {
        state.selectedStickerUid = null;
        closeInlineEditor();
        renderOverlays();
        return;
      }

      if (!state.isOpen && hit.hit === 'front') {
        setCardOpen(true);
        return;
      }

      if (state.isOpen && (hit.hit === 'left' || hit.hit === 'right') && !state.previewMode) {
        // Check if user clicked an existing sticker first (topmost first)
        for (let i = state.stickers.length - 1; i >= 0; i--) {
          const st = state.stickers[i];
          if ((st.side || 'right') !== hit.hit) continue;
          const r = (st.scale ?? 1) * 0.115;
          if (Math.abs(hit.u - st.u) <= r && Math.abs(hit.v - st.v) <= r * (PAGE_W / PAGE_H)) {
            closeInlineEditor();
            state.selectedStickerUid = st.uid;
            renderOverlays();
            return;
          }
        }

        // Check WeChat Red Packet click first if enabled
        if (hit.hit === 'right' && state.redPacket?.enabled) {
          const rb = RED_PACKET_SLOT;
          if (hit.u >= rb.x && hit.u <= rb.x + rb.w && hit.v >= rb.y && hit.v <= rb.y + rb.h) {
            closeInlineEditor();
            state.selectedStickerUid = null;
            renderOverlays();
            openRedPacketPreview();
            return;
          }
        }

        // Otherwise check inside-right text slots
        if (hit.hit === 'right') {
          const slotMap = getTextSlotBounds(Boolean(state.redPacket?.enabled));
          for (const slot of ['greeting', 'body', 'signature']) {
            const b = slotMap[slot];
            if (hit.u >= b.x && hit.u <= b.x + b.w && hit.v >= b.y && hit.v <= b.y + b.h) {
              openInlineEditor(slot);
              return;
            }
          }
        }

        state.selectedStickerUid = null;
        closeInlineEditor();
        renderOverlays();
      }
    }
  });

  // Topbar Navigation & Sealing Flow ("封装")
  root.querySelector('#ed-home-btn').addEventListener('click', () => {
    audioEngine.stop();
    navigate('/');
  });

  function enterDesignStep() {
    state.step = 'design';
    clearSealHold();
    root.querySelector('#step-lbl-design').classList.add('active');
    root.querySelector('#step-lbl-seal').classList.remove('active');
    root.querySelector('#ed-top-actions').innerHTML = `<button type="button" class="topbar-cta" id="ed-next-btn">下一步</button>`;
    root.querySelector('#ed-next-btn').addEventListener('click', enterSealStep);

    // Restore 3-zone design chrome
    envelope.group.visible = false;
    card.setInEnvelope(false);
    card.group.visible = true;
    card.group.scale.setScalar(1);
    card.group.position.set(0, 0, 0);
    sceneMgr.camera.position.set(0, 0, 8.2 / state.zoom);
    railEl.style.display = '';
    drawerEl.style.display = '';
    bottombarEl.style.display = '';
    paginationEl.style.display = '';
    const deliv = root.querySelector('#ed-delivery-drawer');
    if (deliv) deliv.remove();
    const sentEl = root.querySelector('#ed-sent-view');
    if (sentEl) sentEl.remove();
    stageEl.style.display = '';
    bodyEl.style.display = '';
    overlayLayer.innerHTML = '';
    sceneMgr.resize();
    renderDrawer();
  }

  function clearSealHold() {
    if (holdTimer) {
      cancelAnimationFrame(holdTimer);
      holdTimer = null;
    }
    sealProgress = 0;
  }

  function enterSealStep() {
    state.step = 'seal';
    state.closeupPreview = false;
    renderCloseupStopsBar();
    audioEngine.stop();
    closeInlineEditor();
    state.selectedStickerUid = null;
    setCardOpen(false);
    yaw = 0;
    pitch = 0;
    card.setOrbit(0, 0, true);

    root.querySelector('#step-lbl-design').classList.remove('active');
    root.querySelector('#step-lbl-seal').classList.add('active');
    root.querySelector('#ed-top-actions').innerHTML = `<button type="button" class="topbar-secondary" id="ed-prev-btn">上一步</button>`;
    root.querySelector('#ed-prev-btn').addEventListener('click', enterDesignStep);

    railEl.style.display = 'none';
    drawerEl.style.display = 'none';
    bottombarEl.style.display = 'none';
    paginationEl.style.display = 'none';
    sceneMgr.setSparklesVisible(false);
    sceneMgr.camera.position.set(0, 0, 10.8);

    // Setup envelope + card insertion animation (starts open lowered at y=-1.00 so full open flap & deep-V pocket fit cleanly)
    sealPhase = 'entering';
    sealElapsed = 0;
    sealCardY = 3.25;
    sealProgress = 0;
    card.group.visible = true;
    card.setInEnvelope(true);
    card.group.scale.setScalar(0.91);
    card.group.position.set(0, sealCardY, -0.012);

    envelope.group.visible = true;
    envelope.group.position.set(0, -1.00, 0);
    envelope.setSealVisible(false);
    envelope.setFlapOpen(true, true);

    recipientOverride = extractRecipientName(state.greeting, 'Friend');
    overlayLayer.innerHTML = '';
    sceneMgr.resize();
  }

  function showHoldToSealOverlay() {
    overlayLayer.innerHTML = `
      <div class="seal-hold-overlay">
        <button type="button" class="seal-ring-btn" id="seal-hold-btn" aria-label="按住火漆处 1 秒盖上印章">
          <svg class="seal-ring-svg" viewBox="0 0 100 100">
            <circle class="seal-ring-track" cx="50" cy="50" r="42" />
            <circle class="seal-ring-progress" id="seal-ring-arc" cx="50" cy="50" r="42" stroke-dasharray="263.89" stroke-dashoffset="263.89" />
          </svg>
        </button>
        <div class="seal-prompt-caption">按住火漆处 1 秒，盖上印章</div>
      </div>
    `;

    const btn = overlayLayer.querySelector('#seal-hold-btn');
    const arc = overlayLayer.querySelector('#seal-ring-arc');
    const circ = 263.89;

    const positionRing = () => {
      const rect = canvasWrap.getBoundingClientRect();
      const pos = envelope.getSealScreenPos(sceneMgr.camera, rect);
      btn.style.left = `${pos.x}px`;
      btn.style.top = `${pos.y}px`;
    };
    positionRing();
    btn._reposition = positionRing;

    const startHold = (ev) => {
      ev.preventDefault();
      if (sealPhase !== 'ready') return;
      holdStart = performance.now();
      const step = () => {
        const elapsed = performance.now() - holdStart;
        sealProgress = Math.min(1, elapsed / 1000);
        arc.style.strokeDashoffset = String(circ * (1 - sealProgress));
        if (sealProgress >= 1) {
          completeWaxSeal();
          return;
        }
        holdTimer = requestAnimationFrame(step);
      };
      holdTimer = requestAnimationFrame(step);
    };

    const cancelHold = () => {
      if (sealProgress >= 1) return;
      clearSealHold();
      arc.style.strokeDashoffset = String(circ);
    };

    btn.addEventListener('pointerdown', startHold);
    btn.addEventListener('pointerup', cancelHold);
    btn.addEventListener('pointercancel', cancelHold);
    btn.addEventListener('pointerleave', cancelHold);
  }

  function completeWaxSeal() {
    clearSealHold();
    sealPhase = 'stamped';
    overlayLayer.innerHTML = '';
    envelope.triggerStampAnimation();
    audioEngine.playWaxStampSfx();
    showDeliveryDrawer();
  }

  function showDeliveryDrawer() {
    const old = root.querySelector('#ed-delivery-drawer');
    if (old) old.remove();

    const drawer = document.createElement('aside');
    drawer.id = 'ed-delivery-drawer';
    drawer.className = 'delivery-drawer';
    drawer.innerHTML = `
      <h2 class="delivery-heading">寄给 <span id="deliv-name-display">${recipientOverride}</span></h2>
      <p class="delivery-sub">信封已经封好。选好什么时候送到，再寄出。</p>
      <div class="field-group" style="margin-bottom:18px;">
        <label for="deliv-name-input">收信人称呼</label>
        <input id="deliv-name-input" class="field-input" type="text" value="${recipientOverride.replace(/"/g, '&quot;')}" />
      </div>
      <div class="panel-section-label">什么时候送到</div>
      <div class="schedule-pills">
        <button type="button" class="schedule-pill ${scheduleMode === 'now' ? 'active' : ''}" data-mode="now">立刻送达</button>
        <button type="button" class="schedule-pill ${scheduleMode === 'tomorrow' ? 'active' : ''}" data-mode="tomorrow">明天 0 点</button>
        <button type="button" class="schedule-pill ${scheduleMode === 'weekend' ? 'active' : ''}" data-mode="weekend">本周末</button>
        <button type="button" class="schedule-pill ${scheduleMode === 'custom' ? 'active' : ''}" data-mode="custom">自选日期</button>
      </div>
      <div class="custom-date-row" id="deliv-custom-wrap" style="display:${scheduleMode === 'custom' ? 'block' : 'none'};">
        <input type="date" id="deliv-date-input" class="field-input" value="${customDateVal}" />
      </div>
      <p class="delivery-note">在你所在时区的当天 0 点送达；送达前，朋友只能看到一封在路上的信。</p>
      <button type="button" class="send-submit-btn" id="deliv-send-btn">寄出</button>
    `;

    bodyEl.appendChild(drawer);
    sceneMgr.resize();

    const nameIn = drawer.querySelector('#deliv-name-input');
    const nameDisp = drawer.querySelector('#deliv-name-display');
    nameIn.addEventListener('input', () => {
      recipientOverride = nameIn.value.trim() || 'Friend';
      nameDisp.textContent = recipientOverride;
    });

    drawer.querySelectorAll('.schedule-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        scheduleMode = pill.dataset.mode;
        drawer.querySelectorAll('.schedule-pill').forEach((p) => p.classList.toggle('active', p === pill));
        drawer.querySelector('#deliv-custom-wrap').style.display = scheduleMode === 'custom' ? 'block' : 'none';
      });
    });

    drawer.querySelector('#deliv-date-input').addEventListener('change', (e) => {
      customDateVal = e.target.value;
    });

    drawer.querySelector('#deliv-send-btn').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.textContent = '寄出中...';

      let deliverAt = new Date().toISOString();
      if (scheduleMode === 'tomorrow') deliverAt = getLocalMidnightIso(1);
      else if (scheduleMode === 'weekend') deliverAt = getLocalMidnightIso(getWeekendDaysAhead());
      else if (scheduleMode === 'custom' && customDateVal) {
        const [yy, mm, dd] = customDateVal.split('-').map(Number);
        deliverAt = new Date(yy, mm - 1, dd, 0, 0, 0, 0).toISOString();
      }

      try {
        const data = await createLetter({
          recipientName: recipientOverride,
          outboxId: getStoredOutboxId(),
          envelopeColor: 'ivory',
          seal: { color: 'red', stamp: 'star' },
          deliverAt,
          content: {
            templateId: state.templateId,
            paper: state.paper,
            font: state.font,
            greeting: state.greeting || `Dear ${recipientOverride},`,
            body: state.body || PRESET_WISHES[0],
            signature: state.signature || '— Best wishes',
            stickers: state.stickers.map(({ stickerId, side, u, v, scale, rotation }) => ({
              stickerId, side, u, v, scale, rotation,
            })),
            audioUrl: state.audioUrl,
            audioName: state.audioName,
            presetAudio: state.presetAudio,
            coverCloseup: state.coverCloseup,
            effects3d: state.effects3d,
            redPacket: state.redPacket,
          },
        });
        sentResult = data;
        showSentScreen();
      } catch (err) {
        showToast(err.message || '寄出失败，请重试');
        btn.disabled = false;
        btn.textContent = '寄出';
      }
    });
  }

  function showSentScreen() {
    state.step = 'sent';
    const topActions = root.querySelector('#ed-top-actions');
    if (topActions) topActions.innerHTML = '';

    const deliv = root.querySelector('#ed-delivery-drawer');
    if (deliv) deliv.remove();
    stageEl.style.display = 'none';

    const letterUrl = buildShareUrl(sentResult);
    const outboxUrl = window.location.protocol === 'file:'
      ? `${window.location.href.split('#')[0]}#/outbox/${sentResult.outboxId}`
      : `${window.location.origin}/outbox/${sentResult.outboxId}`;
    const isNow = scheduleMode === 'now';

    const sentDiv = document.createElement('div');
    sentDiv.id = 'ed-sent-view';
    sentDiv.className = 'sent-confirmation';
    sentDiv.innerHTML = `
      <div class="sent-card">
        <h1 class="sent-title">寄给 ${recipientOverride} 的信已经寄出</h1>
        <p class="sent-subtitle">${
          isNow
            ? `已经送达，现在就能拆开。把下面的链接发给 ${recipientOverride}。`
            : `将在预约时间送达。把下面的链接提前发给 ${recipientOverride} 吧。`
        }</p>
        <div class="share-link-box">
          <input type="text" class="share-link-input" readonly value="${letterUrl}" id="sent-letter-url" />
          <button type="button" class="copy-dark-btn" id="sent-copy-letter">${ICONS.copy}<span>复制</span></button>
        </div>
        <div class="outbox-callout">
          <div class="outbox-callout-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>你的寄件箱</span>
          </div>
          <p class="outbox-callout-desc">这是只有你知道的链接，可以看到每封信有没有送达、拆开。换设备时用它找回寄件箱。</p>
          <div class="outbox-callout-links">
            <button type="button" class="text-link-btn" id="sent-copy-outbox">复制寄件箱链接</button>
            <button type="button" class="text-link-btn" id="sent-open-outbox">打开寄件箱</button>
          </div>
        </div>
        <div class="sent-footer-actions">
          <button type="button" class="sent-footer-primary" id="sent-clone-btn">复制一封，寄给下一位</button>
          <button type="button" class="sent-footer-secondary" id="sent-reset-btn">从头写一封</button>
        </div>
      </div>
    `;

    bodyEl.appendChild(sentDiv);

    const copyText = async (txt, msg) => {
      try {
        await navigator.clipboard.writeText(txt);
        showToast(msg);
      } catch {
        showToast('请手动复制输入框里的链接');
      }
    };

    sentDiv.querySelector('#sent-copy-letter').addEventListener('click', () => copyText(letterUrl, '收信链接已复制'));
    sentDiv.querySelector('#sent-copy-outbox').addEventListener('click', () => copyText(outboxUrl, '寄件箱链接已复制'));
    sentDiv.querySelector('#sent-open-outbox').addEventListener('click', () => navigate(`/outbox/${sentResult.outboxId}`));
    sentDiv.querySelector('#sent-clone-btn').addEventListener('click', () => {
      navigate(`/editor?copy=${encodeURIComponent(sentResult.id)}`);
    });
    sentDiv.querySelector('#sent-reset-btn').addEventListener('click', () => {
      navigate(`/editor?template=${encodeURIComponent(state.templateId)}`);
    });
  }

  // Frame loop for both Design and Seal stages
  const unsubFrame = sceneMgr.onFrame((dt, elapsed) => {
    if (state.step === 'design') {
      if (state.closeupPreview && !state.isOpen) {
        const stops = getTemplate(state.templateId).closeupStops || [];
        closeupAutoTimer += dt;
        if (stops.length && closeupAutoTimer > 3.6) {
          closeupAutoTimer = 0;
          state.closeupStopIdx = (state.closeupStopIdx + 1) % stops.length;
          renderCloseupStopsBar();
        }
        const stop = stops[state.closeupStopIdx] || { camX: 0, camY: 0, camZ: 5.0, yaw: 0.16, pitch: -0.05 };
        sceneMgr.camera.position.x += (stop.camX - sceneMgr.camera.position.x) * Math.min(1, dt * 4.5);
        sceneMgr.camera.position.y += (stop.camY - sceneMgr.camera.position.y) * Math.min(1, dt * 4.5);
        sceneMgr.camera.position.z += (stop.camZ * 0.92 - sceneMgr.camera.position.z) * Math.min(1, dt * 4.5);
        if (!draggingOrbit) {
          card.setOrbit(
            stop.yaw + Math.sin(elapsed * 0.8) * 0.06,
            stop.pitch + Math.cos(elapsed * 0.6) * 0.03
          );
        }
      } else {
        const goalZ = 8.2 / state.zoom;
        sceneMgr.camera.position.x += (0 - sceneMgr.camera.position.x) * Math.min(1, dt * 6);
        sceneMgr.camera.position.y += (0 - sceneMgr.camera.position.y) * Math.min(1, dt * 6);
        sceneMgr.camera.position.z += (goalZ - sceneMgr.camera.position.z) * Math.min(1, dt * 6);
      }

      card.update(dt, elapsed, false);
      if (state.selectedStickerUid) {
        if (Math.abs(card.targetOpen - card.openAmount) > 0.01) {
          renderOverlays();
        }
      }
    } else if (state.step === 'seal') {
      card.update(dt, elapsed, false);
      envelope.update(dt);

      if (sealPhase === 'entering') {
        sealElapsed += dt;
        // Phase A (0..1.15s): slide closed 3D card smoothly down into open deep-V pocket
        if (sealElapsed < 1.15) {
          const t = Math.min(1, sealElapsed / 1.15);
          const ease = 1 - Math.pow(1 - t, 3);
          sealCardY = 3.25 * (1 - ease) + -1.00 * ease;
          card.group.position.set(0, sealCardY, -0.012);
        } else if (sealElapsed < 1.48) {
          // Phase B: brief pause showing card nestled in crimson-lined V pocket
          card.group.position.set(0, -1.00, -0.012);
        } else {
          // Phase C: fold top curved flap down while lifting envelope+card gently to center y=0
          envelope.setFlapOpen(false);
          envelope.group.position.y += (0 - envelope.group.position.y) * Math.min(1, dt * 6);
          card.group.position.set(0, envelope.group.position.y, -0.012);
          sceneMgr.camera.position.z += (8.6 - sceneMgr.camera.position.z) * Math.min(1, dt * 5.5);
          if (envelope.flapAmount < 0.04 && Math.abs(envelope.group.position.y) < 0.03) {
            envelope.group.position.y = 0;
            sceneMgr.camera.position.z = 8.6;
            card.group.visible = false;
            sealPhase = 'ready';
            showHoldToSealOverlay();
          }
        }
      } else if (sealPhase === 'ready') {
        const btn = overlayLayer.querySelector('#seal-hold-btn');
        if (btn?._reposition) btn._reposition();
      }
    }
  });

  // Load copy source if ?copy=<id>
  const copyId = query.get('copy');
  if (copyId) {
    fetchLetter(copyId)
      .then((letter) => {
        if (!letter?.content) return;
        const c = letter.content;
        state.templateId = c.templateId || state.templateId;
        state.paper = c.paper || 'watercolor';
        state.font = c.font || 'english';
        state.greeting = c.greeting || '';
        state.body = c.body || '';
        state.signature = c.signature || '';
        state.stickers = (c.stickers || []).map((s, idx) => ({
          ...s,
          uid: `cp_${idx}_${Date.now()}`,
        }));
        state.audioUrl = c.audioUrl || null;
        state.audioName = c.audioName || null;
        state.presetAudio = c.presetAudio || null;
        state.coverCloseup = c.coverCloseup !== false;
        state.effects3d = c.effects3d !== false;
        state.redPacket = c.redPacket ? { ...createDefaultRedPacket(), ...c.redPacket } : createDefaultRedPacket();
        card.setState(state);
        pushHistory();
        renderDrawer();
      })
      .catch(() => {});
  }

  root.querySelector('#ed-next-btn').addEventListener('click', enterSealStep);
  renderDrawer();
  updateHistoryButtons();

  return () => {
    unsubFrame();
    clearSealHold();
    audioEngine.stop();
    if (exitPreviewBtn) exitPreviewBtn.remove();
    sceneMgr.dispose();
  };
}
