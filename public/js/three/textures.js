import * as THREE from 'three';
import { getFont, getPaper, getStickerMeta, getTemplate, resolveAssetUrl } from '../config.js';

const imageCache = new Map();
const textureCache = new Map();

export function loadImage(url) {
  const resolved = resolveAssetUrl(url);
  if (!resolved) return Promise.resolve(null);
  if (imageCache.has(resolved)) return imageCache.get(resolved);
  const p = new Promise((resolve) => {
    const img = new Image();
    if (!resolved.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = resolved;
  });
  imageCache.set(resolved, p);
  return p;
}

export async function loadThreeTexture(url, { srgb = true, repeat = false } = {}) {
  if (!url) return null;
  const resolved = resolveAssetUrl(url);
  const key = `${resolved}|${srgb ? 's' : 'n'}|${repeat ? 'r' : 'c'}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const img = await loadImage(resolved);
  if (!img) return null;
  const tex = new THREE.Texture(img);
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  tex.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  if (repeat) tex.repeat.set(2.2, 3.0);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generates an inverted foil roughness map from foil.png:
 * paper areas => bright (high roughness ~0.92), gold foil => dark (low roughness ~0.26)
 */
export async function loadFoilMaps(foilUrl) {
  const img = await loadImage(foilUrl);
  if (!img) return { roughTex: null, metalTex: null };

  const w = img.width;
  const h = img.height;

  const metalCanvas = document.createElement('canvas');
  metalCanvas.width = w;
  metalCanvas.height = h;
  const mctx = metalCanvas.getContext('2d');
  mctx.drawImage(img, 0, 0);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = w;
  roughCanvas.height = h;
  const rctx = roughCanvas.getContext('2d');
  const src = mctx.getImageData(0, 0, w, h);
  const dst = rctx.createImageData(w, h);
  for (let i = 0; i < src.data.length; i += 4) {
    const foil = src.data[i] / 255;
    // paper = 240 (~0.94), gold foil = 70 (~0.27)
    const rVal = Math.round(240 - foil * 170);
    dst.data[i] = rVal;
    dst.data[i + 1] = rVal;
    dst.data[i + 2] = rVal;
    dst.data[i + 3] = 255;
  }
  rctx.putImageData(dst, 0, 0);

  const metalTex = new THREE.CanvasTexture(metalCanvas);
  metalTex.colorSpace = THREE.NoColorSpace;
  metalTex.anisotropy = 4;

  const roughTex = new THREE.CanvasTexture(roughCanvas);
  roughTex.colorSpace = THREE.NoColorSpace;
  roughTex.anisotropy = 4;

  return { roughTex, metalTex };
}

export const INSIDE_W = 1024;
export const INSIDE_H = 1418;

// Normalized UV bounds [x, y, w, h] on Inside-Right page (0..1 top-left origin)
export const SLOT_BOUNDS = {
  greeting: { x: 0.13, y: 0.11, w: 0.74, h: 0.11 },
  body: { x: 0.13, y: 0.24, w: 0.74, h: 0.46 },
  signature: { x: 0.13, y: 0.78, w: 0.74, h: 0.11 },
};

export const RED_PACKET_SLOT = { x: 0.16, y: 0.72, w: 0.68, h: 0.175 };

export function getTextSlotBounds(hasRedPacket = false) {
  if (!hasRedPacket) return SLOT_BOUNDS;
  return {
    greeting: { x: 0.13, y: 0.095, w: 0.74, h: 0.09 },
    body: { x: 0.13, y: 0.205, w: 0.74, h: 0.34 },
    signature: { x: 0.13, y: 0.585, w: 0.74, h: 0.085 },
  };
}

function wrapLines(ctx, text, maxWidth) {
  if (!text) return [];
  const paragraphs = text.split('\n');
  const lines = [];
  for (const para of paragraphs) {
    if (para === '') {
      lines.push('');
      continue;
    }
    let current = '';
    for (const ch of para) {
      const candidate = current + ch;
      if (ctx.measureText(candidate).width > maxWidth && current.length > 0) {
        // Prefer breaking after spaces for English words
        const lastSpace = current.lastIndexOf(' ');
        if (lastSpace > 4 && ch !== ' ') {
          lines.push(current.slice(0, lastSpace));
          current = current.slice(lastSpace + 1) + ch;
        } else {
          lines.push(current);
          current = ch;
        }
      } else {
        current = candidate;
      }
    }
    lines.push(current);
  }
  return lines;
}

async function drawPaperBase(ctx, w, h, paper) {
  ctx.fillStyle = paper.baseColor;
  ctx.fillRect(0, 0, w, h);

  if (paper.albedoUrl) {
    const kraftImg = await loadImage(paper.albedoUrl);
    if (kraftImg) {
      const pat = ctx.createPattern(kraftImg, 'repeat');
      if (pat) {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    }
  } else {
    // Subtle paper brightness wash variation
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(1, 'rgba(180, 165, 150, 0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

async function drawStickersOnPage(ctx, w, h, stickers, side) {
  const list = (stickers || []).filter((st) => (st.side || 'right') === side);
  for (const st of list) {
    const meta = getStickerMeta(st.stickerId);
    const img = await loadImage(meta.url);
    if (!img) continue;
    const cx = (st.u ?? 0.5) * w;
    const cy = (st.v ?? 0.5) * h;
    const size = (st.scale ?? 1) * w * 0.21;
    const rot = ((st.rotation ?? 0) * Math.PI) / 180;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.shadowColor = 'rgba(40, 28, 18, 0.18)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }
}

function drawCreaseShadow(ctx, w, h, side) {
  const grad =
    side === 'left'
      ? ctx.createLinearGradient(w - 58, 0, w, 0)
      : ctx.createLinearGradient(0, 0, 58, 0);
  if (side === 'left') {
    grad.addColorStop(0, 'rgba(40, 28, 18, 0)');
    grad.addColorStop(1, 'rgba(40, 28, 18, 0.11)');
  } else {
    grad.addColorStop(0, 'rgba(40, 28, 18, 0.11)');
    grad.addColorStop(1, 'rgba(40, 28, 18, 0)');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(side === 'left' ? w - 58 : 0, 0, 58, h);
}

export async function renderInsideLeftCanvas(canvas, state) {
  const w = INSIDE_W;
  const h = INSIDE_H;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext('2d');
  const paper = getPaper(state.paper);
  const tpl = getTemplate(state.templateId);

  await drawPaperBase(ctx, w, h, paper);

  if (state.showcase) {
    const emb = await loadImage(tpl.emblemUrl);
    if (emb) {
      const ew = w * 0.54;
      ctx.drawImage(emb, (w - ew) / 2, (h - ew) / 2 - 20, ew, ew);
    }
  } else {
    await drawStickersOnPage(ctx, w, h, state.stickers, 'left');
  }

  drawCreaseShadow(ctx, w, h, 'left');
}

export async function renderInsideRightCanvas(canvas, state) {
  const w = INSIDE_W;
  const h = INSIDE_H;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext('2d');
  const paper = getPaper(state.paper);
  const tpl = getTemplate(state.templateId);
  const font = getFont(state.font);

  await drawPaperBase(ctx, w, h, paper);

  // Inset lighter stationery sheet (matching reference inside-right card panel)
  const padX = Math.round(w * 0.082);
  const padY = Math.round(h * 0.068);
  ctx.fillStyle = paper.insetColor;
  ctx.fillRect(padX, padY, w - padX * 2, h - padY * 2);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.035)';
  ctx.lineWidth = 2;
  ctx.strokeRect(padX, padY, w - padX * 2, h - padY * 2);

  if (state.showcase) {
    // Showcase poetic birthday verse + small bottom crest
    ctx.fillStyle = '#3a342e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'italic 500 34px "Caveat", "Cormorant Garamond", cursive';
    const lines = tpl.showcaseQuote.split('\n');
    const startY = h * 0.34;
    lines.forEach((line, idx) => {
      ctx.fillText(line, w / 2, startY + idx * 54);
    });
    const icon = await loadImage(tpl.showcaseIconUrl);
    if (icon) {
      const iw = 132;
      ctx.drawImage(icon, (w - iw) / 2, h * 0.72, iw, iw);
    }
  } else {
    const hasRp = Boolean(state.redPacket?.enabled);
    const bounds = getTextSlotBounds(hasRp);
    const fontFamily = font.canvasFont;
    const maxTextW = w * bounds.body.w;
    const leftX = w * bounds.body.x;

    // 1. Greeting ("Dear name,")
    const greetingVal = (state.greeting || '').trim();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = fontFamily.replace(/(\d+px)?/, '').trim();
    const gFontSize = font.id === 'english' ? 54 : 44;
    const bFontSize = font.id === 'english' ? 46 : 38;
    const sFontSize = font.id === 'english' ? 48 : 40;

    const makeFont = (sz) => {
      if (font.id === 'english') return `italic 500 ${sz}px "Caveat", "Cormorant Garamond", "Segoe Script", cursive`;
      if (font.id === 'hand-zh') return `400 ${sz}px "Ma Shan Zheng", "Kaiti SC", "STKaiti", "KaiTi", serif`;
      return `400 ${sz}px "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif`;
    };

    ctx.font = makeFont(gFontSize);
    const gY = h * bounds.greeting.y + 8;
    if (!greetingVal) {
      ctx.fillStyle = paper.inkColor;
      ctx.fillText('Dear ', leftX, gY);
      const dw = ctx.measureText('Dear ').width;
      ctx.fillStyle = paper.placeholderColor;
      ctx.fillText('name ,', leftX + dw, gY);
    } else {
      ctx.fillStyle = paper.inkColor;
      ctx.fillText(greetingVal, leftX, gY, maxTextW);
    }

    // 2. Body ("Your letter")
    const bodyVal = (state.body || '').trim();
    ctx.font = makeFont(bFontSize);
    const bY = h * bounds.body.y + 6;
    const lineHeight = Math.round(bFontSize * (hasRp ? 1.40 : 1.48));
    if (!bodyVal) {
      ctx.fillStyle = paper.placeholderColor;
      ctx.fillText('Your letter', leftX, bY);
    } else {
      ctx.fillStyle = paper.inkColor;
      const lines = wrapLines(ctx, state.body, maxTextW);
      lines.slice(0, hasRp ? 6 : 10).forEach((ln, idx) => {
        ctx.fillText(ln, leftX, bY + idx * lineHeight);
      });
    }

    // 3. Signature ("— your name")
    const sigVal = (state.signature || '').trim();
    ctx.font = makeFont(sFontSize);
    ctx.textAlign = 'right';
    const sX = leftX + maxTextW;
    const sY = h * bounds.signature.y + 8;
    if (!sigVal) {
      ctx.fillStyle = paper.placeholderColor;
      ctx.fillText('your name', sX, sY);
      const sw = ctx.measureText('your name').width;
      ctx.fillStyle = paper.inkColor;
      ctx.fillText('— ', sX - sw - 4, sY);
    } else {
      ctx.fillStyle = paper.inkColor;
      ctx.fillText(sigVal, sX, sY, maxTextW);
    }

    await drawStickersOnPage(ctx, w, h, state.stickers, 'right');

    if (hasRp) {
      drawWeChatRedPacketBubble(ctx, w, h, state.redPacket, Boolean(state.redPacketClaimed));
    }
  }

  drawCreaseShadow(ctx, w, h, 'right');
}

export function renderBackCoverCanvas(canvas, templateId) {
  const tpl = getTemplate(templateId);
  if (canvas.width !== 512) canvas.width = 512;
  if (canvas.height !== 709) canvas.height = 709;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = tpl.backColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle paper vignette
  const grad = ctx.createRadialGradient(256, 354, 40, 256, 354, 460);
  grad.addColorStop(0, 'rgba(255,255,255,0.08)');
  grad.addColorStop(1, 'rgba(0,0,0,0.06)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const isDark = templateId === 'patisserie-window';
  ctx.fillStyle = isDark ? 'rgba(248, 232, 200, 0.55)' : 'rgba(70, 58, 48, 0.42)';
  ctx.textAlign = 'center';
  ctx.font = 'italic 500 22px "Caveat", cursive';
  ctx.fillText('Birthday Cards', canvas.width / 2, canvas.height - 54);
}

function drawRoundedPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWeChatRedPacketBubble(ctx, pageW, pageH, redPacket, claimed) {
  const bx = Math.round(RED_PACKET_SLOT.x * pageW);
  const by = Math.round(RED_PACKET_SLOT.y * pageH);
  const bw = Math.round(RED_PACKET_SLOT.w * pageW);
  const bh = Math.round(RED_PACKET_SLOT.h * pageH);
  const topH = Math.round(bh * 0.72);
  const r = 22;

  ctx.save();
  ctx.shadowColor = 'rgba(130, 56, 16, 0.16)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  drawRoundedPath(ctx, bx, by, bw, bh, r);
  ctx.fillStyle = '#fffdf9';
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedPath(ctx, bx, by, bw, bh, r);
  ctx.clip();

  // Luxury WeChat warm vermilion-amber silk gradient
  const grad = ctx.createLinearGradient(bx, by, bx + bw, by + topH);
  if (claimed) {
    grad.addColorStop(0, '#f4c694');
    grad.addColorStop(1, '#e8ac70');
  } else {
    grad.addColorStop(0, '#f79c3d');
    grad.addColorStop(0.55, '#ef822b');
    grad.addColorStop(1, '#df6820');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(bx, by, bw, topH);

  // Subtle decorative golden star filigree watermark on the right side
  ctx.save();
  ctx.translate(bx + bw - 52, by + topH * 0.45);
  ctx.strokeStyle = 'rgba(255, 240, 198, 0.22)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 240, 198, 0.20)';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 === 0 ? 28 : 11;
    if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Bottom warm cream footer bar
  ctx.fillStyle = '#fffcf7';
  ctx.fillRect(bx, by + topH, bw, bh - topH);

  // Sculpted mini crimson & gold red envelope icon on left
  const ix = bx + 32;
  const iy = by + Math.round((topH - 102) / 2);
  const iw = 80;
  const ih = 102;
  ctx.save();
  ctx.shadowColor = 'rgba(100, 22, 10, 0.22)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  drawRoundedPath(ctx, ix, iy, iw, ih, 10);
  ctx.fillStyle = claimed ? '#df7368' : '#d13a2f';
  ctx.fill();
  ctx.restore();

  // Curved top flap + gold hairline trim
  ctx.beginPath();
  ctx.moveTo(ix, iy);
  ctx.lineTo(ix + iw, iy);
  ctx.lineTo(ix + iw, iy + 32);
  ctx.quadraticCurveTo(ix + iw * 0.5, iy + 54, ix, iy + 32);
  ctx.closePath();
  ctx.fillStyle = claimed ? '#ea877d' : '#e44d40';
  ctx.fill();
  ctx.strokeStyle = 'rgba(248, 219, 146, 0.72)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Embossed gold coin
  ctx.beginPath();
  ctx.arc(ix + iw * 0.5, iy + 43, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#f6d88e';
  ctx.fill();
  ctx.strokeStyle = '#d3a243';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#9c5a12';
  ctx.font = 'bold 19px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('¥', ix + iw * 0.5, iy + 44);

  // Wish & status text
  const tx = ix + iw + 24;
  const maxTw = bx + bw - tx - 28;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 30px "PingFang SC", "Microsoft YaHei", sans-serif';
  const wishText = (redPacket?.wish || '生日快乐，大吉大利！').trim();
  ctx.fillText(wishText, tx, by + topH * 0.38, maxTw);

  ctx.fillStyle = 'rgba(255, 245, 228, 0.92)';
  ctx.font = '400 22px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(claimed ? '已拆开 · 点击查看' : '点击拆开生日红包', tx, by + topH * 0.67, maxTw);

  // Footer label + action cue
  ctx.fillStyle = '#8b837b';
  ctx.font = '500 21px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText('微信红包', bx + 32, by + topH + (bh - topH) * 0.52);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#cf661a';
  ctx.font = '600 21px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(claimed ? '已领取 ›' : '拆红包 ›', bx + bw - 30, by + topH + (bh - topH) * 0.52);

  ctx.restore();

  // Delicate outer + inner gold hairline border
  ctx.save();
  drawRoundedPath(ctx, bx, by, bw, bh, r);
  ctx.strokeStyle = 'rgba(204, 152, 76, 0.28)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}
