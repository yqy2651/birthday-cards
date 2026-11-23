import * as THREE from 'three';
import { TEMPLATES, resolveAssetUrl } from '../config.js';
import { getStoredOutboxId } from '../api.js';
import { audioEngine } from '../audio.js';
import { SceneManager } from '../three/sceneManager.js';
import { BiFoldCard3D } from '../three/card3d.js';

const ICONS = {
  bookOpen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  pen: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  up: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  down: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  closeup: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6M8 11h6"/></svg>`,
};

export function mountHomeView(root, { navigate }) {
  const outboxId = getStoredOutboxId();
  root.innerHTML = `
    <div class="home-view">
      <a href="/" class="brand-lockup" data-nav="/">
        <img src="${resolveAssetUrl('/assets/brand/mark.png')}" alt="Birthday Cards" class="brand-mark" />
        <span class="brand-wordmark">
          Birthday Cards
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4a84f" aria-hidden="true"><path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2Z"/></svg>
        </span>
      </a>
      ${outboxId ? `<a href="/outbox/${outboxId}" data-nav="/outbox/${outboxId}" class="secondary-pill-btn" style="position:fixed;top:24px;right:28px;z-index:30;">我的寄件箱</a>` : ''}
      <div class="stage-canvas-wrap" id="home-stage"></div>
      <div class="closeup-stops-bar" id="home-closeup-stops" style="display:none;"></div>
      <div class="home-hint" id="home-hint">左右滑动挑选款式 · 点击贺卡翻开</div>
      <div class="home-dock">
        <div class="dock-thumbs" id="home-thumbs">
          ${TEMPLATES.map((t, i) => `
            <button type="button" class="dock-thumb-btn" data-index="${i}" aria-label="${t.nameZh}" aria-pressed="${i === 0}">
              <img src="${resolveAssetUrl(t.thumbUrl)}" alt="${t.nameZh}" />
            </button>
          `).join('')}
        </div>
        <div class="dock-nav-arrows">
          <button type="button" class="dock-arrow-btn" id="home-prev" aria-label="上一张">${ICONS.up}</button>
          <button type="button" class="dock-arrow-btn" id="home-next" aria-label="下一张">${ICONS.down}</button>
        </div>
        <div class="dock-divider"></div>
        <button type="button" class="dock-pill-toggle" id="home-closeup-btn" title="封面动态特写" aria-pressed="false">
          ${ICONS.closeup}
          <span>动态特写</span>
        </button>
        <button type="button" class="dock-icon-btn" id="home-toggle-open" title="翻开贺卡" aria-label="翻开贺卡" aria-pressed="false">
          ${ICONS.bookOpen}
        </button>
        <button type="button" class="primary-pill-btn" id="home-create-btn">
          ${ICONS.pen}
          <span>制作贺卡</span>
        </button>
      </div>
    </div>
  `;

  const stageEl = root.querySelector('#home-stage');
  const thumbBtns = [...root.querySelectorAll('.dock-thumb-btn')];
  const toggleBtn = root.querySelector('#home-toggle-open');
  const closeupBtn = root.querySelector('#home-closeup-btn');
  const stopsBar = root.querySelector('#home-closeup-stops');
  const hintEl = root.querySelector('#home-hint');

  const sceneMgr = new SceneManager(stageEl);
  sceneMgr.camera.position.set(0, 0.05, 9.6);

  const cards = TEMPLATES.map((tpl) => {
    const card = new BiFoldCard3D({
      templateId: tpl.id,
      paper: 'watercolor',
      showcase: true,
      effects3d: true,
    });
    sceneMgr.scene.add(card.group);
    return card;
  });

  const echoCard = new BiFoldCard3D({
    templateId: TEMPLATES[2].id,
    paper: 'watercolor',
    showcase: true,
    effects3d: true,
  });
  sceneMgr.scene.add(echoCard.group);

  let activeIndex = 0;
  let scrollOffset = 0;
  let targetOffset = 0;
  let isOpen = false;
  let closeupMode = false;
  let closeupStopIdx = 0;
  let closeupTimer = 0;
  let yaw = 0;
  let pitch = 0;
  let hoverX = 0;
  let hoverY = 0;

  function renderCloseupStops() {
    if (!closeupMode || isOpen) {
      stopsBar.style.display = 'none';
      return;
    }
    const stops = TEMPLATES[activeIndex].closeupStops || [];
    stopsBar.style.display = 'inline-flex';
    stopsBar.innerHTML = stops
      .map(
        (s, idx) =>
          `<button type="button" class="closeup-stop-pill ${idx === closeupStopIdx ? 'active' : ''}" data-stop="${idx}">${s.label}</button>`
      )
      .join('');
    stopsBar.querySelectorAll('.closeup-stop-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        closeupStopIdx = Number(btn.dataset.stop);
        closeupTimer = 0;
        renderCloseupStops();
      });
    });
  }

  function syncUi() {
    thumbBtns.forEach((btn, idx) => {
      btn.setAttribute('aria-pressed', String(idx === activeIndex));
    });
    toggleBtn.setAttribute('aria-pressed', String(isOpen));
    toggleBtn.title = isOpen ? '合上贺卡' : '翻开贺卡';
    closeupBtn.setAttribute('aria-pressed', String(closeupMode));
    closeupBtn.classList.toggle('active', closeupMode);

    if (isOpen) {
      hintEl.style.display = '';
      hintEl.textContent = '拖拽 360° 欣赏立体贺卡 · 再次点击合上';
    } else if (closeupMode) {
      hintEl.style.display = 'none';
    } else {
      hintEl.style.display = '';
      hintEl.textContent = '左右滑动挑选款式 · 点击贺卡翻开';
    }
    renderCloseupStops();
    sceneMgr.setSparklesVisible(isOpen);
  }

  function selectIndex(nextIdx, animate = true) {
    const count = TEMPLATES.length;
    const prevWrapped = ((activeIndex % count) + count) % count;
    const nextWrapped = ((nextIdx % count) + count) % count;
    let delta = nextWrapped - prevWrapped;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;

    activeIndex = nextWrapped;
    targetOffset += delta;
    if (!animate) scrollOffset = targetOffset;
    closeupStopIdx = 0;
    closeupTimer = 0;

    if (isOpen) {
      isOpen = false;
      yaw = 0;
      pitch = 0;
      cards.forEach((c) => {
        c.setOpen(false);
        c.setOrbit(0, 0);
      });
    }
    syncUi();
  }

  function toggleOpen(forceState = null) {
    const nextOpen = forceState !== null ? forceState : !isOpen;
    if (nextOpen && closeupMode) {
      closeupMode = false;
    }
    isOpen = nextOpen;
    audioEngine.playCardFlipSfx();
    const activeCard = cards[activeIndex];
    activeCard.setOpen(isOpen);
    if (isOpen) {
      sceneMgr.triggerCelebrationBurst(0, 0.1, 0.55);
    } else {
      yaw = 0;
      pitch = 0;
      activeCard.setOrbit(0, 0);
    }
    syncUi();
  }

  function toggleCloseup() {
    closeupMode = !closeupMode;
    closeupStopIdx = 0;
    closeupTimer = 0;
    if (closeupMode && isOpen) {
      isOpen = false;
      yaw = 0;
      pitch = 0;
      cards[activeIndex].setOpen(false);
      cards[activeIndex].setOrbit(0, 0);
    }
    syncUi();
  }

  thumbBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => selectIndex(idx));
  });
  root.querySelector('#home-prev').addEventListener('click', () => selectIndex(activeIndex - 1));
  root.querySelector('#home-next').addEventListener('click', () => selectIndex(activeIndex + 1));
  toggleBtn.addEventListener('click', () => toggleOpen());
  closeupBtn.addEventListener('click', toggleCloseup);
  root.querySelector('#home-create-btn').addEventListener('click', () => {
    const tpl = TEMPLATES[activeIndex];
    navigate(`/editor?template=${encodeURIComponent(tpl.id)}`);
  });

  // Pointer drag, hover parallax & click interaction
  let dragging = false;
  let downX = 0;
  let downY = 0;
  let lastX = 0;
  let lastY = 0;
  let movedDist = 0;
  let startOffset = 0;

  const canvas = sceneMgr.renderer.domElement;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    movedDist = 0;
    startOffset = targetOffset;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    const ndc = sceneMgr.getNdc(e.clientX, e.clientY);
    hoverX = ndc.x;
    hoverY = ndc.y;
    sceneMgr.setPointerBias(ndc.x, ndc.y);

    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    movedDist += Math.hypot(dx, dy);
    lastX = e.clientX;
    lastY = e.clientY;

    if (isOpen) {
      yaw = Math.max(-0.78, Math.min(0.78, yaw + dx * 0.0065));
      pitch = Math.max(-0.32, Math.min(0.32, pitch + dy * 0.0045));
      cards[activeIndex].setOrbit(yaw, pitch);
    } else if (!closeupMode) {
      const totalDx = e.clientX - downX;
      targetOffset = startOffset - totalDx / 210;
    }
  });

  canvas.addEventListener('pointerleave', () => {
    hoverX = 0;
    hoverY = 0;
    sceneMgr.setPointerBias(0, 0);
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    if (movedDist < 8) {
      const ndc = sceneMgr.getNdc(e.clientX, e.clientY);
      const rc = new THREE.Raycaster();
      rc.setFromCamera(ndc, sceneMgr.camera);
      const hits = rc.intersectObjects(cards.map((c) => c.group), true);
      if (hits.length) {
        const hitObj = hits[0].object;
        const hitIdx = cards.findIndex((c) => {
          let cur = hitObj;
          while (cur) {
            if (cur === c.group) return true;
            cur = cur.parent;
          }
          return false;
        });
        if (hitIdx !== -1) {
          if (hitIdx === activeIndex) {
            toggleOpen();
          } else {
            selectIndex(hitIdx);
          }
        }
      }
      return;
    }

    if (!isOpen && !closeupMode) {
      const snapped = Math.round(targetOffset);
      const count = TEMPLATES.length;
      targetOffset = snapped;
      activeIndex = ((snapped % count) + count) % count;
      syncUi();
    }
  });

  const onWheel = (e) => {
    if (isOpen || closeupMode) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 12) {
      e.preventDefault();
      if (!onWheel._lock) {
        onWheel._lock = true;
        selectIndex(activeIndex + (delta > 0 ? 1 : -1));
        setTimeout(() => {
          onWheel._lock = false;
        }, 220);
      }
    }
  };
  canvas.addEventListener('wheel', onWheel, { passive: false });

  let openSpreadFactor = 0;
  let closeupFactor = 0;
  const unsubFrame = sceneMgr.onFrame((dt, elapsed) => {
    scrollOffset += (targetOffset - scrollOffset) * Math.min(1, dt * 10);
    openSpreadFactor += ((isOpen ? 1 : 0) - openSpreadFactor) * Math.min(1, dt * 7);
    closeupFactor += ((closeupMode && !isOpen ? 1 : 0) - closeupFactor) * Math.min(1, dt * 5.5);

    const stops = TEMPLATES[activeIndex].closeupStops || [];
    if (closeupMode && !isOpen && stops.length > 0) {
      closeupTimer += dt;
      if (closeupTimer > 3.6) {
        closeupTimer = 0;
        closeupStopIdx = (closeupStopIdx + 1) % stops.length;
        renderCloseupStops();
      }
    }

    const activeStop = stops[closeupStopIdx] || { camX: 0, camY: 0.1, camZ: 5.2, yaw: 0.14, pitch: -0.04 };
    const camGoalX = closeupMode && !isOpen ? activeStop.camX : 0;
    const camGoalY = closeupMode && !isOpen ? activeStop.camY : 0.05;
    const camGoalZ = closeupMode && !isOpen ? activeStop.camZ : 9.6;

    sceneMgr.camera.position.x += (camGoalX - sceneMgr.camera.position.x) * Math.min(1, dt * 4.5);
    sceneMgr.camera.position.y += (camGoalY - sceneMgr.camera.position.y) * Math.min(1, dt * 4.5);
    sceneMgr.camera.position.z += (camGoalZ - sceneMgr.camera.position.z) * Math.min(1, dt * 4.5);

    const pushAway = Math.max(openSpreadFactor, closeupFactor);
    const count = TEMPLATES.length;

    cards.forEach((card, idx) => {
      let rel = idx - scrollOffset;
      rel = ((rel % count) + count) % count;
      if (rel > count / 2) rel -= count;

      const absRel = Math.abs(rel);
      const spreadPush = idx === activeIndex ? 0 : Math.sign(rel || 1) * 3.4 * pushAway;
      const x = rel * 1.92 + spreadPush;
      const y = -absRel * absRel * 0.14 + (rel === 0 ? 0.14 : 0.10) * (1 - pushAway);
      const z = -absRel * 0.62 - pushAway * (idx === activeIndex ? -0.35 : 1.8);
      const rotZ = -rel * 0.135;

      card.group.position.set(x, y, z);
      card.group.rotation.z = rotZ * (1 - (idx === activeIndex ? pushAway : 0));

      if (idx === activeIndex && closeupMode && !isOpen) {
        const targetYaw = activeStop.yaw + Math.sin(elapsed * 0.75) * 0.08 + hoverX * 0.22;
        const targetPitch = activeStop.pitch + Math.cos(elapsed * 0.6) * 0.04 - hoverY * 0.14;
        card.setOrbit(targetYaw, targetPitch);
      } else if (idx === activeIndex && !isOpen) {
        card.setOrbit(hoverX * 0.24, -hoverY * 0.14);
      } else if (!isOpen || idx !== activeIndex) {
        card.setOrbit(-rel * 0.08, 0, true);
      }

      const scale = Math.max(0.74, 1.02 - absRel * 0.11);
      card.group.scale.setScalar(scale * (1 - (idx !== activeIndex ? pushAway * 0.25 : 0)));
      card.group.visible = !(pushAway > 0.88 && idx !== activeIndex);
      card.update(dt, elapsed, idx === activeIndex && !dragging);
    });

    const echoRel = 2 - ((scrollOffset % count) + count) % count;
    const mirrorSign = echoRel >= 0 ? -1 : 1;
    const farRel = echoRel + mirrorSign * count;
    const farAbs = Math.abs(farRel);
    echoCard.group.position.set(farRel * 1.92, -farAbs * farAbs * 0.14, -farAbs * 0.62 - pushAway * 2.2);
    echoCard.group.rotation.z = -farRel * 0.135;
    echoCard.group.scale.setScalar(Math.max(0.74, 1.02 - farAbs * 0.11));
    echoCard.group.visible = pushAway < 0.35 && farAbs <= 2.3;
    const mirrorIdx = (((Math.round(scrollOffset) + 2) % count) + count) % count;
    if (echoCard.state.templateId !== TEMPLATES[mirrorIdx].id) {
      echoCard.setState({ templateId: TEMPLATES[mirrorIdx].id });
    }
    echoCard.update(dt, elapsed, false);
  });

  syncUi();

  return () => {
    unsubFrame();
    canvas.removeEventListener('wheel', onWheel);
    sceneMgr.dispose();
  };
}
