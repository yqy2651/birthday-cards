import { PRESET_MUSIC, getTemplate, resolveAssetUrl } from '../config.js';
import { fetchLetter, markLetterOpened } from '../api.js';
import { audioEngine } from '../audio.js';
import { openRedPacketModal } from '../components/redPacketModal.js';
import { SceneManager } from '../three/sceneManager.js';
import { BiFoldCard3D } from '../three/card3d.js';
import { Envelope3D } from '../three/envelope3d.js';
import { RED_PACKET_SLOT } from '../three/textures.js';

const ICONS = {
  music: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  closeup: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6M8 11h6"/></svg>`,
};

function formatCountdown(deliverIso) {
  const diff = Math.max(0, new Date(deliverIso).getTime() - Date.now());
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  if (hrs >= 24) {
    const days = Math.floor(hrs / 24);
    return `${days} 天 ${hrs % 24} 小时`;
  }
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function mountLetterView(root, { letterId, sharedPayload = null, navigate, showToast }) {
  root.innerHTML = `
    <div class="letter-view">
      <a href="/" class="brand-lockup" data-nav="/">
        <img src="${resolveAssetUrl('/assets/brand/mark.png')}" alt="Birthday Cards" class="brand-mark" />
        <span class="brand-wordmark">Birthday Cards</span>
      </a>
      <div class="stage-canvas-wrap" id="letter-stage"></div>
      <div id="letter-ui"></div>
    </div>
  `;

  const stageEl = root.querySelector('#letter-stage');
  const uiEl = root.querySelector('#letter-ui');

  const sceneMgr = new SceneManager(stageEl);
  sceneMgr.camera.position.set(0, 0, 8.8);

  const envelope = new Envelope3D();
  sceneMgr.scene.add(envelope.group);

  let card = null;
  let stagePhase = 'loading'; // 'loading' | 'locked' | 'sealed' | 'cracking' | 'pullCard' | 'extracting' | 'reading'
  let phaseTimer = 0;
  let cardY = 0;
  let envY = 0;
  let pullOffset = 0;
  let isOpen = false;
  let yaw = 0;
  let pitch = 0;
  let hoverX = 0;
  let hoverY = 0;
  let countdownInterval = null;
  let musicSource = null;

  let letterMeta = {
    recipientName: '你',
    senderName: '好友',
    templateId: 'candlelight-wish',
    coverCloseup: true,
    effects3d: true,
    redPacket: { enabled: false },
  };
  let redPacketClaimed = false;
  let closeupMode = false;
  let closeupStopIdx = 0;
  let closeupTimer = 0;

  const claimStorageKey = `birthday_cards_rp_claimed_${letterId || 'shared'}`;
  try {
    redPacketClaimed = localStorage.getItem(claimStorageKey) === '1';
  } catch {
    redPacketClaimed = false;
  }

  function renderMusicPill() {
    if (!musicSource) return '';
    const name =
      musicSource.audioName ||
      PRESET_MUSIC.find((m) => m.id === musicSource.presetAudio)?.name ||
      '生日祝福音乐';
    return `
      <button type="button" class="music-float-pill ${audioEngine.playing ? 'playing' : ''}" id="letter-music-btn">
        ${ICONS.music}
        <span>${audioEngine.playing ? `正在播放 · ${name}` : `播放 · ${name}`}</span>
      </button>
    `;
  }

  function handleOpenRedPacket() {
    if (!letterMeta.redPacket?.enabled) return;
    openRedPacketModal({
      senderName: letterMeta.senderName,
      recipientName: letterMeta.recipientName,
      redPacket: letterMeta.redPacket,
      claimed: redPacketClaimed,
      showToast,
      onClaim: () => {
        redPacketClaimed = true;
        try {
          localStorage.setItem(claimStorageKey, '1');
        } catch {
          // ignore
        }
        card?.setState({ redPacketClaimed: true });
        if (letterMeta.effects3d) {
          sceneMgr.triggerCelebrationBurst(0.6, 0, 0.7);
        }
        updateUi();
      },
    });
  }

  function updateUi() {
    if (stagePhase === 'sealed') {
      uiEl.innerHTML = `<div class="letter-stage-prompt">点一下火漆，拆开这封信</div>`;
      return;
    }
    if (stagePhase === 'pullCard') {
      uiEl.innerHTML = `
        ${renderMusicPill()}
        <div class="letter-stage-prompt">向上轻拖或点一下卡片，把它抽出来</div>
      `;
      bindMusicBtn();
      return;
    }
    if (stagePhase === 'reading') {
      const stops = getTemplate(letterMeta.templateId).closeupStops || [];
      const showStops = !isOpen && closeupMode && letterMeta.coverCloseup && stops.length > 0;
      const showCloseupBtn = !isOpen && letterMeta.coverCloseup;
      const showRpBtn = Boolean(letterMeta.redPacket?.enabled);

      uiEl.innerHTML = `
        ${renderMusicPill()}
        ${showStops ? `
          <div class="closeup-stops-bar">
            ${stops.map((s, idx) => `<button type="button" class="closeup-stop-pill ${idx === closeupStopIdx ? 'active' : ''}" data-stop="${idx}">${s.label}</button>`).join('')}
          </div>
        ` : ''}
        <div class="letter-bottom-dock">
          <button type="button" class="dock-icon-btn" id="letter-toggle-open" title="${isOpen ? '合上贺卡' : '翻开贺卡'}" aria-pressed="${isOpen}">
            ${ICONS.book}
          </button>
          ${showCloseupBtn ? `
            <button type="button" class="dock-pill-toggle ${closeupMode ? 'active' : ''}" id="letter-closeup-btn" aria-pressed="${closeupMode}">
              ${ICONS.closeup}
              <span>封面特写</span>
            </button>
          ` : ''}
          ${showRpBtn ? `
            <button type="button" class="rp-action-btn" id="letter-rp-btn">
              <span>🧧</span>
              <span>${redPacketClaimed ? '查看微信红包' : '拆微信红包'}</span>
            </button>
          ` : ''}
          <span class="dock-divider"></span>
          <button type="button" class="primary-pill-btn" id="letter-make-own">我也做一张</button>
        </div>
      `;
      bindMusicBtn();

      uiEl.querySelectorAll('.closeup-stop-pill').forEach((btn) => {
        btn.addEventListener('click', () => {
          closeupStopIdx = Number(btn.dataset.stop);
          closeupTimer = 0;
          updateUi();
        });
      });

      uiEl.querySelector('#letter-closeup-btn')?.addEventListener('click', () => {
        closeupMode = !closeupMode;
        closeupStopIdx = 0;
        closeupTimer = 0;
        updateUi();
      });

      uiEl.querySelector('#letter-rp-btn')?.addEventListener('click', () => {
        if (!isOpen) {
          isOpen = true;
          closeupMode = false;
          audioEngine.playCardFlipSfx();
          card.setOpen(true);
          sceneMgr.setSparklesVisible(true);
          updateUi();
        }
        handleOpenRedPacket();
      });

      uiEl.querySelector('#letter-toggle-open').addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) closeupMode = false;
        audioEngine.playCardFlipSfx();
        card.setOpen(isOpen);
        sceneMgr.setSparklesVisible(isOpen);
        if (isOpen && letterMeta.effects3d) {
          sceneMgr.triggerCelebrationBurst(0, 0.1, 0.55);
        }
        if (!isOpen) {
          yaw = 0;
          pitch = 0;
          card.setOrbit(0, 0);
        }
        updateUi();
      });

      uiEl.querySelector('#letter-make-own').addEventListener('click', () => {
        audioEngine.stop();
        navigate('/');
      });
    }
  }

  function bindMusicBtn() {
    const btn = uiEl.querySelector('#letter-music-btn');
    if (btn && musicSource) {
      btn.addEventListener('click', () => {
        audioEngine.toggle(musicSource);
      });
    }
  }

  const unsubAudio = audioEngine.onChange(() => {
    if (stagePhase === 'pullCard' || stagePhase === 'reading') {
      updateUi();
    }
  });

  function triggerCrack() {
    if (stagePhase !== 'sealed') return;
    stagePhase = 'cracking';
    phaseTimer = 0;
    envelope.crackSeal();
    audioEngine.playWaxCrackSfx();
    if (musicSource) {
      audioEngine.play(musicSource);
    }
  }

  function triggerExtract() {
    if (stagePhase !== 'pullCard') return;
    stagePhase = 'extracting';
    phaseTimer = 0;
    card.setInEnvelope(false);
    audioEngine.playCardFlipSfx();
    if (letterId) markLetterOpened(letterId);
  }

  const canvas = sceneMgr.renderer.domElement;
  let dragging = false;
  let downY = 0;
  let lastX = 0;
  let lastY = 0;
  let moved = 0;

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    downY = lastY = e.clientY;
    moved = 0;
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
    moved += Math.hypot(dx, dy);
    lastX = e.clientX;
    lastY = e.clientY;

    if (stagePhase === 'pullCard') {
      const upPx = Math.max(0, downY - e.clientY);
      pullOffset = Math.min(2.6, upPx / 95);
      if (pullOffset > 1.35) {
        dragging = false;
        triggerExtract();
      }
      return;
    }

    if (stagePhase === 'reading' && card && moved > 4) {
      yaw = Math.max(-0.78, Math.min(0.78, yaw + dx * 0.0065));
      pitch = Math.max(-0.32, Math.min(0.32, pitch + dy * 0.0045));
      card.setOrbit(yaw, pitch);
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

    if (stagePhase === 'pullCard') {
      if (moved < 10 || pullOffset > 0.65) {
        triggerExtract();
      } else {
        pullOffset = 0;
      }
      return;
    }

    if (moved < 8) {
      if (stagePhase === 'sealed') {
        triggerCrack();
      } else if (stagePhase === 'reading' && card) {
        if (isOpen && letterMeta.redPacket?.enabled) {
          const ndc = sceneMgr.getNdc(e.clientX, e.clientY);
          const hit = card.raycast(ndc, sceneMgr.camera);
          if (hit && hit.hit === 'right') {
            const rb = RED_PACKET_SLOT;
            if (hit.u >= rb.x && hit.u <= rb.x + rb.w && hit.v >= rb.y && hit.v <= rb.y + rb.h) {
              handleOpenRedPacket();
              return;
            }
          }
        }

        isOpen = !isOpen;
        if (isOpen) closeupMode = false;
        audioEngine.playCardFlipSfx();
        card.setOpen(isOpen);
        sceneMgr.setSparklesVisible(isOpen);
        if (isOpen && letterMeta.effects3d) {
          sceneMgr.triggerCelebrationBurst(0, 0.1, 0.55);
        }
        if (!isOpen) {
          yaw = 0;
          pitch = 0;
          card.setOrbit(0, 0);
        }
        updateUi();
      }
    }
  });

  const unsubFrame = sceneMgr.onFrame((dt, elapsed) => {
    envelope.update(dt);
    if (card) card.update(dt, elapsed, stagePhase === 'reading' && !dragging);

    if (stagePhase === 'locked') {
      envelope.group.position.y = Math.sin(elapsed * 1.3) * 0.06;
    } else if (stagePhase === 'sealed') {
      envelope.group.rotation.y += (hoverX * 0.10 - envelope.group.rotation.y) * Math.min(1, dt * 6);
      envelope.group.rotation.x += (-hoverY * 0.07 - envelope.group.rotation.x) * Math.min(1, dt * 6);
    } else if (stagePhase === 'cracking') {
      phaseTimer += dt;
      envelope.group.rotation.y *= Math.max(0, 1 - dt * 8);
      envelope.group.rotation.x *= Math.max(0, 1 - dt * 8);
      // Pause ~0.38s showing cracked wax halves before smoothly opening curved flap
      if (phaseTimer > 0.38) {
        envelope.setFlapOpen(true);
        envelope.waxSeal.setOpacity(Math.max(0, 1 - (phaseTimer - 0.38) * 3.5));
        envY += (-1.00 - envY) * Math.min(1, dt * 5.2);
        envelope.group.position.y = envY;
        sceneMgr.camera.position.z += (10.6 - sceneMgr.camera.position.z) * Math.min(1, dt * 5.2);
        if (card) {
          cardY = envY;
          card.group.position.set(0, cardY, -0.012);
        }
      }
      if (envelope.flapAmount > 0.94 && Math.abs(envY + 1.00) < 0.08) {
        stagePhase = 'pullCard';
        pullOffset = 0;
        updateUi();
      }
    } else if (stagePhase === 'pullCard' && card) {
      // Card rests physically inside the deep-V pocket and responds 1:1 to upward drag
      const targetY = envY + pullOffset;
      cardY += (targetY - cardY) * Math.min(1, dt * 14);
      card.group.position.set(0, cardY, -0.012);
      sceneMgr.camera.position.z += (10.6 - sceneMgr.camera.position.z) * Math.min(1, dt * 5.2);
    } else if (stagePhase === 'extracting' && card) {
      phaseTimer += dt;
      if (phaseTimer < 0.45) {
        // Lift card smoothly clear above the V-pocket
        const t = Math.min(1, phaseTimer / 0.45);
        const ease = 1 - Math.pow(1 - t, 2.4);
        card.group.position.y = cardY + (2.35 - cardY) * ease;
        card.group.position.z = -0.012 + 0.262 * ease;
      } else {
        // Drop empty envelope away & center closed 3D cover hero card!
        envY -= dt * 8.5;
        envelope.group.position.y = envY;
        const t2 = Math.min(1, (phaseTimer - 0.45) / 0.55);
        const ease2 = 1 - Math.pow(1 - t2, 3);
        card.group.position.y = 2.35 * (1 - ease2);
        card.group.position.z = 0.25 * (1 - ease2);
        card.group.scale.setScalar(0.91 + 0.09 * ease2);
        sceneMgr.camera.position.z += (8.8 - sceneMgr.camera.position.z) * Math.min(1, dt * 5.5);
      }
      if (phaseTimer > 1.02) {
        envelope.group.visible = false;
        card.group.scale.setScalar(1);
        card.group.position.set(0, 0, 0);
        stagePhase = 'reading';
        isOpen = false; // Present closed 3D multi-layered cover first like reference!
        card.setOpen(false, true);
        updateUi();
      }
    } else if (stagePhase === 'reading' && card) {
      card.group.position.y += (0 - card.group.position.y) * Math.min(1, dt * 7);
      card.group.position.z += (0 - card.group.position.z) * Math.min(1, dt * 7);

      if (!isOpen && closeupMode && letterMeta.coverCloseup) {
        const stops = getTemplate(letterMeta.templateId).closeupStops || [];
        closeupTimer += dt;
        if (stops.length && closeupTimer > 3.6) {
          closeupTimer = 0;
          closeupStopIdx = (closeupStopIdx + 1) % stops.length;
          updateUi();
        }
        const stop = stops[closeupStopIdx] || { camX: 0, camY: 0, camZ: 5.2, yaw: 0.16, pitch: -0.04 };
        sceneMgr.camera.position.x += (stop.camX - sceneMgr.camera.position.x) * Math.min(1, dt * 4.5);
        sceneMgr.camera.position.y += (stop.camY - sceneMgr.camera.position.y) * Math.min(1, dt * 4.5);
        sceneMgr.camera.position.z += (stop.camZ - sceneMgr.camera.position.z) * Math.min(1, dt * 4.5);
        if (!dragging) {
          card.setOrbit(
            stop.yaw + Math.sin(elapsed * 0.8) * 0.07 + hoverX * 0.18,
            stop.pitch + Math.cos(elapsed * 0.6) * 0.03 - hoverY * 0.12
          );
        }
      } else {
        sceneMgr.camera.position.x += (0 - sceneMgr.camera.position.x) * Math.min(1, dt * 6);
        sceneMgr.camera.position.y += (0 - sceneMgr.camera.position.y) * Math.min(1, dt * 6);
        sceneMgr.camera.position.z += (8.8 - sceneMgr.camera.position.z) * Math.min(1, dt * 6);
        if (!isOpen && !dragging) {
          card.setOrbit(hoverX * 0.22, -hoverY * 0.13);
        }
      }
    }
  });

  function initFromRecord(data) {
    if (data.locked) {
      stagePhase = 'locked';
      uiEl.innerHTML = `
        <div class="letter-locked-banner">
          <h2>寄给 ${data.recipientName || '你'} 的生日信正在路上</h2>
          <p>将在预约时间送达 · 距离拆信还有 <strong id="letter-countdown">${formatCountdown(data.deliverAt)}</strong></p>
        </div>
      `;
      countdownInterval = window.setInterval(() => {
        const el = uiEl.querySelector('#letter-countdown');
        if (el) el.textContent = formatCountdown(data.deliverAt);
        if (new Date(data.deliverAt).getTime() <= Date.now()) {
          window.location.reload();
        }
      }, 1000);
      return;
    }

    const c = data.content || {};
    letterMeta = {
      recipientName: data.recipientName || '你',
      senderName: c.signature || '好友',
      templateId: c.templateId || 'candlelight-wish',
      coverCloseup: c.coverCloseup !== false,
      effects3d: c.effects3d !== false,
      redPacket: c.redPacket || { enabled: false },
    };

    if (c.audioUrl || c.presetAudio) {
      musicSource = {
        audioUrl: c.audioUrl || null,
        audioName: c.audioName || null,
        presetAudio: c.presetAudio || null,
      };
    }

    card = new BiFoldCard3D({
      templateId: letterMeta.templateId,
      paper: c.paper || 'watercolor',
      font: c.font || 'english',
      greeting: c.greeting || '',
      body: c.body || '',
      signature: c.signature || '',
      stickers: c.stickers || [],
      effects3d: letterMeta.effects3d,
      redPacket: letterMeta.redPacket,
      redPacketClaimed,
      showcase: false,
    });
    card.setInEnvelope(true);
    card.group.visible = true; // Physically seated inside envelope from frame 1
    card.group.scale.setScalar(0.91);
    card.group.position.set(0, 0, -0.012);
    sceneMgr.scene.add(card.group);

    stagePhase = 'sealed';
    updateUi();
  }

  if (sharedPayload) {
    initFromRecord(sharedPayload);
  } else {
    fetchLetter(letterId)
      .then(initFromRecord)
      .catch((err) => {
        envelope.group.visible = false;
        uiEl.innerHTML = `
          <div class="letter-locked-banner">
            <h2>找不到这封生日信</h2>
            <p style="margin-bottom:14px;">${err.message || '链接可能已失效'}</p>
            <button type="button" class="primary-pill-btn" id="err-go-home">制作一张新贺卡</button>
          </div>
        `;
        uiEl.querySelector('#err-go-home')?.addEventListener('click', () => navigate('/'));
      });
  }

  return () => {
    unsubFrame();
    unsubAudio();
    if (countdownInterval) clearInterval(countdownInterval);
    audioEngine.stop();
    sceneMgr.dispose();
  };
}
