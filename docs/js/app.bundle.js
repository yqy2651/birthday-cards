const __APP_MODS__ = { 'three': window.__THREE__ };

__APP_MODS__['js/config.js'] = (function() {
function resolveAssetUrl(url) {
  if (!url) return url;
  if (typeof window !== 'undefined' && window.__INLINE_ASSETS__ && window.__INLINE_ASSETS__[url]) {
    return window.__INLINE_ASSETS__[url];
  }
  return url;
}
const CARD_LAYERS = {
  'candlelight-wish': {
    bg: '/assets/cards/candlelight-wish/layers/bg.png',
    frame: '/assets/cards/candlelight-wish/layers/frame.png',
    props: {
      cake: { url: '/assets/cards/candlelight-wish/layers/cake.png', cx: 0.5, cy: 0.5463, w: 0.4615, h: 0.3667, pivotX: 0.5, pivotY: 0.5 },
      moon: { url: '/assets/cards/candlelight-wish/layers/prop-moon.png', cx: 0.1776, cy: 0.1384, w: 0.209, h: 0.138, pivotX: 0.5, pivotY: 0.5 },
      bells: { url: '/assets/cards/candlelight-wish/layers/prop-bells.png', cx: 0.8186, cy: 0.1407, w: 0.2013, h: 0.1556, pivotX: 0.5096, pivotY: 0.119 },
      ribbon: { url: '/assets/cards/candlelight-wish/layers/prop-ribbon.png', cx: 0.4974, cy: 0.775, w: 0.6923, h: 0.1426, pivotX: 0.5, pivotY: 0.5 },
      star: { url: '/assets/cards/candlelight-wish/layers/prop-star.png', cx: 0.5013, cy: 0.8829, w: 0.1385, h: 0.0954, pivotX: 0.5, pivotY: 0.5 },
    },
  },
  'garden-tea': {
    bg: '/assets/cards/garden-tea/layers/bg.png',
    frame: '/assets/cards/garden-tea/layers/frame.png',
    props: {
      table: { url: '/assets/cards/garden-tea/layers/table.png', cx: 0.5083, cy: 0.5324, w: 0.3628, h: 0.2778, pivotX: 0.5, pivotY: 0.5 },
      lantern: { url: '/assets/cards/garden-tea/layers/prop-lantern.png', cx: 0.7756, cy: 0.1593, w: 0.1359, h: 0.3185, pivotX: 0.5, pivotY: 0.0058 },
      wreath: { url: '/assets/cards/garden-tea/layers/prop-wreath.png', cx: 0.5, cy: 0.8861, w: 0.1641, h: 0.1111, pivotX: 0.5, pivotY: 0.5 },
      envelope: { url: '/assets/cards/garden-tea/layers/prop-envelope.png', cx: 0.7936, cy: 0.7134, w: 0.1487, h: 0.0713, pivotX: 0.5, pivotY: 0.5 },
      ribbon: { url: '/assets/cards/garden-tea/layers/prop-ribbon.png', cx: 0.4654, cy: 0.7509, w: 0.5564, h: 0.0833, pivotX: 0.5, pivotY: 0.5 },
    },
  },
  'patisserie-window': {
    bg: '/assets/cards/patisserie-window/layers/bg.png',
    frame: '/assets/cards/patisserie-window/layers/frame.png',
    awningTex: '/assets/cards/patisserie-window/layers/awning-tex.png',
    props: {
      cake: { url: '/assets/cards/patisserie-window/layers/cake.png', cx: 0.5, cy: 0.5528, w: 0.3436, h: 0.337, pivotX: 0.5, pivotY: 0.5 },
      sill: { url: '/assets/cards/patisserie-window/layers/prop-sill.png', cx: 0.5006, cy: 0.7782, w: 0.809, h: 0.1176, pivotX: 0.5, pivotY: 0.5 },
      bow: { url: '/assets/cards/patisserie-window/layers/prop-bow.png', cx: 0.4994, cy: 0.1319, w: 0.2269, h: 0.125, pivotX: 0.5, pivotY: 0.5 },
    },
  },
  'sky-balloons': {
    bg: '/assets/cards/sky-balloons/layers/bg.png',
    frame: '/assets/cards/sky-balloons/layers/frame.png',
    props: {
      balloonPink: { url: '/assets/cards/sky-balloons/layers/balloon-pink.png', cx: 0.3673, cy: 0.3861, w: 0.109, h: 0.1222, pivotX: 0.5, pivotY: 0.5 },
      balloonGold: { url: '/assets/cards/sky-balloons/layers/balloon-gold.png', cx: 0.4917, cy: 0.3231, w: 0.0962, h: 0.1148, pivotX: 0.5, pivotY: 0.5 },
      balloonBlue: { url: '/assets/cards/sky-balloons/layers/balloon-blue.png', cx: 0.6237, cy: 0.3583, w: 0.0987, h: 0.1185, pivotX: 0.5, pivotY: 0.5 },
      wreath: { url: '/assets/cards/sky-balloons/layers/wreath.png', cx: 0.5, cy: 0.4111, w: 0.8154, h: 0.5741, pivotX: 0.5, pivotY: 0.5 },
      bow: { url: '/assets/cards/sky-balloons/layers/prop-bow.png', cx: 0.4994, cy: 0.1981, w: 0.2346, h: 0.1296, pivotX: 0.5, pivotY: 0.5 },
      star: { url: '/assets/cards/sky-balloons/layers/prop-star.png', cx: 0.5013, cy: 0.8056, w: 0.1051, h: 0.0778, pivotX: 0.5, pivotY: 0.5 },
    },
  },
};
const TEMPLATES = [
  {
    id: 'candlelight-wish',
    nameZh: '星夜烛光',
    nameEn: 'Candlelight Wish',
    backColor: '#f3ede2',
    accentColor: '#c9a050',
    coverUrl: '/assets/cards/candlelight-wish/cover.png',
    thumbUrl: '/assets/cards/candlelight-wish/thumb.png',
    foilUrl: '/assets/cards/candlelight-wish/foil.png',
    reliefUrl: '/assets/cards/candlelight-wish/relief-normal.png',
    emblemUrl: '/assets/cards/candlelight-wish/emblem.png',
    showcaseIconUrl: '/assets/stickers/star-gold.png',
    showcaseQuote: 'Beneath a sky of quiet candlelight,\nmay every wish you whisper tonight\nbloom gently into joy.',
    closeupStops: [
      { label: '烛光蛋糕', camX: 0.0, camY: -0.06, camZ: 5.25, yaw: 0.16, pitch: -0.05 },
      { label: '星月浮雕', camX: -0.62, camY: 0.96, camZ: 4.95, yaw: -0.22, pitch: 0.08 },
      { label: '丝带礼盒', camX: 0.38, camY: -0.78, camZ: 5.15, yaw: 0.20, pitch: -0.07 },
    ],
  },
  {
    id: 'garden-tea',
    nameZh: '花庭茶会',
    nameEn: 'Garden Tea',
    backColor: '#d5e0d7',
    accentColor: '#98ae9d',
    coverUrl: '/assets/cards/garden-tea/cover.png',
    thumbUrl: '/assets/cards/garden-tea/thumb.png',
    foilUrl: '/assets/cards/garden-tea/foil.png',
    reliefUrl: '/assets/cards/garden-tea/relief-normal.png',
    emblemUrl: '/assets/cards/garden-tea/emblem.png',
    showcaseIconUrl: '/assets/stickers/wreath.png',
    showcaseQuote: 'A sunlit table among blooming roses,\nwishing you gentle mornings\nand sweet birthday magic.',
    closeupStops: [
      { label: '花园茶桌', camX: -0.06, camY: -0.05, camZ: 5.25, yaw: -0.15, pitch: 0.04 },
      { label: '暖光提灯', camX: 0.54, camY: 0.82, camZ: 4.95, yaw: 0.22, pitch: 0.06 },
      { label: '玫瑰花环', camX: 0.14, camY: -1.02, camZ: 5.05, yaw: -0.18, pitch: -0.07 },
    ],
  },
  {
    id: 'patisserie-window',
    nameZh: '甜点橱窗',
    nameEn: 'Patisserie Window',
    backColor: '#8d1e24',
    accentColor: '#d4a654',
    coverUrl: '/assets/cards/patisserie-window/cover.png',
    thumbUrl: '/assets/cards/patisserie-window/thumb.png',
    foilUrl: '/assets/cards/patisserie-window/foil.png',
    reliefUrl: '/assets/cards/patisserie-window/relief-normal.png',
    emblemUrl: '/assets/cards/patisserie-window/emblem.png',
    showcaseIconUrl: '/assets/stickers/cupcake.png',
    showcaseQuote: 'Wrapped with warmth and sweet cheer,\nmay every little surprise\nbrighten your brand-new year.',
    closeupStops: [
      { label: '橱窗蛋糕', camX: 0.0, camY: -0.20, camZ: 5.15, yaw: 0.16, pitch: -0.04 },
      { label: '条纹雨篷', camX: 0.0, camY: 0.98, camZ: 5.05, yaw: -0.18, pitch: 0.08 },
      { label: '甜点窗台', camX: 0.10, camY: -0.92, camZ: 5.10, yaw: 0.20, pitch: -0.06 },
    ],
  },
  {
    id: 'sky-balloons',
    nameZh: '晴空热气球',
    nameEn: 'Sky Balloons',
    backColor: '#cadcee',
    accentColor: '#8eaac5',
    coverUrl: '/assets/cards/sky-balloons/cover.png',
    thumbUrl: '/assets/cards/sky-balloons/thumb.png',
    foilUrl: '/assets/cards/sky-balloons/foil.png',
    reliefUrl: '/assets/cards/sky-balloons/relief-normal.png',
    emblemUrl: '/assets/cards/sky-balloons/emblem.png',
    showcaseIconUrl: '/assets/stickers/balloon.png',
    showcaseQuote: 'From above the sunlit clouds,\nmay warm winds carry your dreams\nwherever this year goes.',
    closeupStops: [
      { label: '云端热气球', camX: 0.0, camY: 0.32, camZ: 5.15, yaw: -0.16, pitch: 0.05 },
      { label: '湖畔暖亭', camX: 0.40, camY: -0.22, camZ: 4.95, yaw: 0.22, pitch: -0.04 },
      { label: '花环星芒', camX: -0.16, camY: -0.76, camZ: 5.20, yaw: -0.15, pitch: -0.08 },
    ],
  },
];
const PAPERS = {
  watercolor: {
    id: 'watercolor',
    nameZh: '冷压水彩纸',
    baseColor: '#f4f0ea',
    insetColor: '#f8f5f0',
    edgeColor: '#e8e2d8',
    normalUrl: '/assets/textures/watercolor-normal.png',
    roughUrl: '/assets/textures/watercolor-rough.png',
    albedoUrl: null,
    roughness: 0.88,
    metalness: 0.0,
    normalScale: 0.55,
    inkColor: '#3a342e',
    placeholderColor: '#b7afa6',
  },
  kraft: {
    id: 'kraft',
    nameZh: '牛皮纸',
    baseColor: '#c6a782',
    insetColor: '#ccb08d',
    edgeColor: '#b5946d',
    normalUrl: '/assets/textures/kraft-normal.png',
    roughUrl: null,
    albedoUrl: '/assets/textures/kraft-albedo.png',
    roughness: 0.92,
    metalness: 0.0,
    normalScale: 0.45,
    inkColor: '#3a2d21',
    placeholderColor: '#8f775f',
  },
  pearl: {
    id: 'pearl',
    nameZh: '珠光卡纸',
    baseColor: '#f7f1f3',
    insetColor: '#fbf7f8',
    edgeColor: '#ebd9df',
    normalUrl: '/assets/textures/pearl-normal.png',
    roughUrl: null,
    albedoUrl: null,
    roughness: 0.52,
    metalness: 0.08,
    normalScale: 0.25,
    inkColor: '#3a3136',
    placeholderColor: '#b9adb2',
  },
};
const STICKERS = [
  { id: 'star-gold', name: '金色星星', url: '/assets/stickers/star-gold.png' },
  { id: 'sparkles', name: '金色闪光', url: '/assets/stickers/sparkles.png' },
  { id: 'cake', name: '生日蛋糕', url: '/assets/stickers/cake.png' },
  { id: 'candle', name: '许愿蜡烛', url: '/assets/stickers/candle.png' },
  { id: 'balloon', name: '气球束', url: '/assets/stickers/balloon.png' },
  { id: 'gift', name: '礼物盒', url: '/assets/stickers/gift.png' },
  { id: 'bow', name: '蝴蝶结', url: '/assets/stickers/bow.png' },
  { id: 'moon', name: '星月花枝', url: '/assets/stickers/moon.png' },
  { id: 'cupcake', name: '纸杯蛋糕', url: '/assets/stickers/cupcake.png' },
  { id: 'wreath', name: '玫瑰花环', url: '/assets/stickers/wreath.png' },
  { id: 'envelope', name: '爱心信封', url: '/assets/stickers/envelope.png' },
  { id: 'crown', name: '生日皇冠', url: '/assets/stickers/crown.png' },
];
const FONTS = [
  {
    id: 'hand-zh',
    label: '手写',
    cssClass: 'font-hand',
    canvasFont: '"Ma Shan Zheng", "Kaiti SC", "STKaiti", "KaiTi", serif',
    cssFamily: 'var(--font-hand-zh)',
    italic: false,
  },
  {
    id: 'english',
    label: 'English',
    cssClass: 'font-en',
    canvasFont: 'italic 500 "Caveat", "Cormorant Garamond", "Segoe Script", cursive',
    cssFamily: 'var(--font-caveat)',
    italic: true,
  },
  {
    id: 'songti',
    label: '宋体',
    cssClass: 'font-song',
    canvasFont: '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif',
    cssFamily: 'var(--font-songti)',
    italic: false,
  },
];
const PRESET_WISHES = [
  '生日快乐，愿你永远被温柔与星光包围。',
  'Happy Birthday! Wishing you warmth, joy, and bright surprises.',
  '岁岁常欢愉，万事皆胜意，祝你生日快乐！',
  '愿这一岁的每一天，都闪耀着你喜欢的模样。',
];
const PRESET_MUSIC = [
  { id: 'musicbox-birthday', name: '八音盒 · 生日快乐' },
  { id: 'piano-starlight', name: '轻柔八音盒 · 星光许愿' },
];
const RED_PACKET_AMOUNTS = ['66.66', '88.88', '188.00', '520.00'];
function createDefaultRedPacket() {
  return {
    enabled: false,
    wish: '生日快乐，大吉大利！',
    amount: '88.88',
    claimCode: '',
  };
}
function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
function getPaper(id) {
  return PAPERS[id] || PAPERS.watercolor;
}
function getFont(id) {
  return FONTS.find((f) => f.id === id) || FONTS[1];
}
function getStickerMeta(id) {
  return STICKERS.find((s) => s.id === id) || STICKERS[0];
}

return { resolveAssetUrl, CARD_LAYERS, TEMPLATES, PAPERS, STICKERS, FONTS, PRESET_WISHES, PRESET_MUSIC, RED_PACKET_AMOUNTS, createDefaultRedPacket, getTemplate, getPaper, getFont, getStickerMeta };
})();

__APP_MODS__['js/api.js'] = (function() {
const OUTBOX_KEY = 'birthday_cards_outbox_id';
const LOCAL_LETTERS_KEY = 'birthday_cards_local_letters';
function isStandaloneMode() {
  return (
    typeof window !== 'undefined' &&
    (window.location.protocol === 'file:' || Boolean(window.__STANDALONE_BUNDLE__))
  );
}
function getStoredOutboxId() {
  try {
    return localStorage.getItem(OUTBOX_KEY) || null;
  } catch {
    return null;
  }
}
function setStoredOutboxId(id) {
  if (!id) return;
  try {
    localStorage.setItem(OUTBOX_KEY, id);
  } catch {
    // ignore storage limits
  }
}

function loadLocalMap() {
  try {
    const raw = localStorage.getItem(LOCAL_LETTERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalMap(map) {
  try {
    localStorage.setItem(LOCAL_LETTERS_KEY, JSON.stringify(map));
  } catch {
    // ignore storage quota errors
  }
}

function saveLocalRecord(record) {
  const map = loadLocalMap();
  map[record.id] = record;
  saveLocalMap(map);
}

function randomToken(len = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function computeLocalStatus(record) {
  const now = Date.now();
  const deliverMs = record.deliverAt ? new Date(record.deliverAt).getTime() : 0;
  if (deliverMs && now < deliverMs) {
    return { status: 'scheduled', locked: true };
  }
  if (record.openedAt) {
    return { status: 'opened', locked: false };
  }
  return { status: 'delivered', locked: false };
}
function encodeSharePayload(record) {
  try {
    const minimal = {
      id: record.id,
      recipientName: record.recipientName,
      envelopeColor: record.envelopeColor || 'ivory',
      seal: record.seal || { color: 'red', stamp: 'star' },
      deliverAt: record.deliverAt,
      content: {
        ...(record.content || {}),
        // Omit large DataURL audio from URL token if inline base64
        audioUrl: record.content?.audioUrl?.startsWith('data:') ? null : record.content?.audioUrl,
      },
    };
    const bytes = new TextEncoder().encode(JSON.stringify(minimal));
    let bin = '';
    bytes.forEach((b) => {
      bin += String.fromCharCode(b);
    });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}
function decodeSharePayload(token) {
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
    const bin = atob(b64 + pad);
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    const { status, locked } = computeLocalStatus(parsed);
    return { ...parsed, status, locked: Boolean(locked) };
  } catch {
    return null;
  }
}
function buildShareUrl(result) {
  if (!result) return '';
  if (isStandaloneMode() || result.offline) {
    const base = window.location.href.split('#')[0];
    const token = result.payload ? encodeSharePayload(result.payload) : '';
    return token ? `${base}#/share/${token}` : `${base}#/letter/${result.id}`;
  }
  return `${window.location.origin}/letter/${result.id}`;
}
async function createLetter(payload) {
  const outboxId = payload.outboxId || getStoredOutboxId() || randomToken(22);
  const localId = randomToken(12);
  const localRecord = {
    id: localId,
    outboxId,
    recipientName: payload.recipientName || 'Friend',
    envelopeColor: payload.envelopeColor || 'ivory',
    seal: payload.seal || { color: 'red', stamp: 'star' },
    deliverAt: payload.deliverAt || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    openedAt: null,
    content: payload.content || {},
  };

  if (isStandaloneMode()) {
    setStoredOutboxId(outboxId);
    saveLocalRecord(localRecord);
    return {
      id: localId,
      outboxId,
      deliverAt: localRecord.deliverAt,
      offline: true,
      payload: localRecord,
    };
  }

  try {
    const res = await fetch('/api/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || '寄出失败');
    }
    const serverRecord = { ...localRecord, ...data.data };
    setStoredOutboxId(data.data.outboxId);
    saveLocalRecord(serverRecord);
    return { ...data.data, payload: serverRecord };
  } catch {
    // Graceful fallback to local offline persistence + self-contained share link
    setStoredOutboxId(outboxId);
    saveLocalRecord(localRecord);
    return {
      id: localId,
      outboxId,
      deliverAt: localRecord.deliverAt,
      offline: true,
      payload: localRecord,
    };
  }
}
async function fetchLetter(id) {
  if (!isStandaloneMode()) {
    try {
      const res = await fetch(`/api/letters/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        return data.data;
      }
    } catch {
      // fall through to local store
    }
  }

  const local = loadLocalMap()[id];
  if (local) {
    const { status, locked } = computeLocalStatus(local);
    return { ...local, status, locked };
  }
  throw new Error('未找到这封信');
}
async function markLetterOpened(id) {
  if (!id) return null;
  const map = loadLocalMap();
  if (map[id] && !map[id].openedAt) {
    map[id].openedAt = new Date().toISOString();
    saveLocalMap(map);
  }
  if (isStandaloneMode()) return { id, openedAt: map[id]?.openedAt || new Date().toISOString() };

  try {
    const res = await fetch(`/api/letters/${encodeURIComponent(id)}/opened`, {
      method: 'POST',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}
async function fetchOutbox(outboxId) {
  if (!isStandaloneMode()) {
    try {
      const res = await fetch(`/api/outbox/${encodeURIComponent(outboxId)}`);
      const data = await res.json();
      if (res.ok && data.success) return data.data;
    } catch {
      // fallback to localStorage
    }
  }

  const map = loadLocalMap();
  const list = Object.values(map)
    .filter((r) => r.outboxId === outboxId)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .map((r) => {
      const { status, locked } = computeLocalStatus(r);
      return {
        id: r.id,
        recipientName: r.recipientName || 'Friend',
        templateId: r.content?.templateId || 'candlelight-wish',
        status,
        locked,
        deliverAt: r.deliverAt,
        openedAt: r.openedAt,
        createdAt: r.createdAt,
      };
    });
  return { outboxId, letters: list };
}
async function uploadAudio(file) {
  if (isStandaloneMode()) {
    if (file.size > 2.5 * 1024 * 1024) {
      throw new Error('单文件离线模式下音频建议控制在 2.5MB 以内');
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('音频读取失败'));
      reader.readAsDataURL(file);
    });
    return { audioUrl: dataUrl, audioName: file.name || 'music.mp3' };
  }

  try {
    const res = await fetch('/api/audio', {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'X-Filename': encodeURIComponent(file.name || 'music.mp3'),
      },
      body: file,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || '音频上传失败');
    }
    return data.data;
  } catch (err) {
    if (file.size <= 2.5 * 1024 * 1024) {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(err);
        reader.readAsDataURL(file);
      });
      return { audioUrl: dataUrl, audioName: file.name || 'music.mp3' };
    }
    throw err;
  }
}

return { isStandaloneMode, getStoredOutboxId, setStoredOutboxId, encodeSharePayload, decodeSharePayload, buildShareUrl, createLetter, fetchLetter, markLetterOpened, fetchOutbox, uploadAudio };
})();

__APP_MODS__['js/audio.js'] = (function() {
/**
 * Audio & tactile SFX engine:
 * - Uploaded audio playback via HTMLAudioElement
 * - Two gentle built-in birthday music-box melodies via Web Audio API
 * - Tactile wax stamp, wax crack, and paper flip sound effects
 */

const MELODIES = {
  'musicbox-birthday': {
    tempoMs: 420,
    // Happy Birthday gentle music box arrangement (frequencies in Hz)
    notes: [
      [392.0, 0.7], [392.0, 0.3], [440.0, 1.0], [392.0, 1.0], [523.25, 1.0], [493.88, 2.0],
      [392.0, 0.7], [392.0, 0.3], [440.0, 1.0], [392.0, 1.0], [587.33, 1.0], [523.25, 2.0],
      [392.0, 0.7], [392.0, 0.3], [783.99, 1.0], [659.25, 1.0], [523.25, 1.0], [493.88, 1.0], [440.0, 2.0],
      [698.46, 0.7], [698.46, 0.3], [659.25, 1.0], [523.25, 1.0], [587.33, 1.0], [523.25, 2.4],
    ],
  },
  'piano-starlight': {
    tempoMs: 520,
    // Gentle celestial waltz arpeggio
    notes: [
      [523.25, 1.0], [659.25, 1.0], [783.99, 1.0], [987.77, 1.5], [783.99, 0.5], [659.25, 1.0],
      [587.33, 1.0], [698.46, 1.0], [880.0, 1.0], [783.99, 2.0],
      [523.25, 1.0], [659.25, 1.0], [880.0, 1.0], [783.99, 1.5], [659.25, 0.5], [587.33, 1.0],
      [523.25, 2.5], [0, 0.5],
    ],
  },
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.htmlAudio = null;
    this.playing = false;
    this.currentUrl = null;
    this.currentPreset = null;
    this._timer = null;
    this._noteIdx = 0;
    this._listeners = new Set();
  }

  onChange(cb) {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  _emit() {
    for (const cb of this._listeners) cb(this.playing);
  }

  _ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playCardFlipSfx() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const dur = 0.14;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.11;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 0.9;
    src.connect(filter);
    filter.connect(ctx.destination);
    src.start();
  }

  playWaxStampSfx() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.18);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  playWaxCrackSfx() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const dur = 0.12;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      const env = Math.pow(1 - t, 2.4);
      data[i] = (Math.random() * 2 - 1) * env * 0.28;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1800;
    src.connect(hp);
    hp.connect(ctx.destination);
    src.start();
  }

  playRedPacketChimeSfx() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    const base = ctx.currentTime;
    freqs.forEach((f, idx) => {
      const t0 = base + idx * 0.055;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g1 = ctx.createGain();
      const g2 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(f, t0);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(f * 2, t0);
      g2.gain.value = 0.16;

      g1.gain.setValueAtTime(0.001, t0);
      g1.gain.linearRampToValueAtTime(0.14, t0 + 0.015);
      g1.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.65);

      osc1.connect(g1);
      osc2.connect(g2);
      g2.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(t0);
      osc2.start(t0);
      osc1.stop(t0 + 0.68);
      osc2.stop(t0 + 0.68);
    });
  }

  _playBellNote(freq, durationSec) {
    if (!freq || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const g2 = this.ctx.createGain();
    g2.gain.value = 0.12;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + Math.max(0.45, durationSec * 1.15));

    osc1.connect(gain);
    osc2.connect(g2);
    g2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationSec * 1.25);
    osc2.stop(now + durationSec * 1.25);
  }

  _scheduleNextNote(presetId) {
    if (!this.playing || this.currentPreset !== presetId) return;
    const melody = MELODIES[presetId];
    if (!melody) return;

    const [freq, beats] = melody.notes[this._noteIdx % melody.notes.length];
    this._noteIdx = (this._noteIdx + 1) % melody.notes.length;
    const waitMs = melody.tempoMs * beats;
    this._playBellNote(freq, waitMs / 1000);

    this._timer = window.setTimeout(() => this._scheduleNextNote(presetId), waitMs);
  }

  async play({ audioUrl = null, presetAudio = null } = {}) {
    this.stop();

    if (audioUrl) {
      this.currentUrl = audioUrl;
      this.htmlAudio = new Audio(audioUrl);
      this.htmlAudio.loop = true;
      this.htmlAudio.onended = () => {
        this.playing = false;
        this._emit();
      };
      try {
        await this.htmlAudio.play();
        this.playing = true;
        this._emit();
      } catch {
        this.playing = false;
        this._emit();
      }
      return;
    }

    if (presetAudio && MELODIES[presetAudio]) {
      this._ensureCtx();
      this.currentPreset = presetAudio;
      this._noteIdx = 0;
      this.playing = true;
      this._emit();
      this._scheduleNextNote(presetAudio);
    }
  }

  stop() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.src = '';
      this.htmlAudio = null;
    }
    this.currentUrl = null;
    this.currentPreset = null;
    if (this.playing) {
      this.playing = false;
      this._emit();
    }
  }

  toggle(source) {
    if (this.playing) {
      this.stop();
    } else {
      this.play(source);
    }
  }
}
const audioEngine = new AudioEngine();

return { audioEngine };
})();

__APP_MODS__['js/components/redPacketModal.js'] = (function() {
const {audioEngine} = __APP_MODS__['js/audio.js'];

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
function openRedPacketModal({
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

return { openRedPacketModal };
})();

__APP_MODS__['js/three/textures.js'] = (function() {
const THREE = __APP_MODS__['three'];
const {getFont,getPaper,getStickerMeta,getTemplate,resolveAssetUrl} = __APP_MODS__['js/config.js'];

const imageCache = new Map();
const textureCache = new Map();
function loadImage(url) {
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
async function loadThreeTexture(url, { srgb = true, repeat = false } = {}) {
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
async function loadFoilMaps(foilUrl) {
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
const INSIDE_W = 1024;
const INSIDE_H = 1418;

// Normalized UV bounds [x, y, w, h] on Inside-Right page (0..1 top-left origin)
const SLOT_BOUNDS = {
  greeting: { x: 0.13, y: 0.11, w: 0.74, h: 0.11 },
  body: { x: 0.13, y: 0.24, w: 0.74, h: 0.46 },
  signature: { x: 0.13, y: 0.78, w: 0.74, h: 0.11 },
};
const RED_PACKET_SLOT = { x: 0.16, y: 0.72, w: 0.68, h: 0.175 };
function getTextSlotBounds(hasRedPacket = false) {
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
async function renderInsideLeftCanvas(canvas, state) {
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
async function renderInsideRightCanvas(canvas, state) {
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
function renderBackCoverCanvas(canvas, templateId) {
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

return { loadImage, loadThreeTexture, loadFoilMaps, INSIDE_W, INSIDE_H, SLOT_BOUNDS, RED_PACKET_SLOT, getTextSlotBounds, renderInsideLeftCanvas, renderInsideRightCanvas, renderBackCoverCanvas };
})();

__APP_MODS__['js/three/coverEffects3d.js'] = (function() {
const THREE = __APP_MODS__['three'];
const {CARD_LAYERS,getTemplate} = __APP_MODS__['js/config.js'];
const {loadFoilMaps,loadThreeTexture} = __APP_MODS__['js/three/textures.js'];

const PAGE_W = 2.6;
const PAGE_H = 3.6;

let cachedTextures = null;

function createSoftGlowTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 60);
  g.addColorStop(0, 'rgba(255, 246, 204, 1)');
  g.addColorStop(0.28, 'rgba(255, 206, 102, 0.72)');
  g.addColorStop(0.65, 'rgba(244, 166, 62, 0.22)');
  g.addColorStop(1, 'rgba(244, 166, 62, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStarFlareTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 52);
  g.addColorStop(0, 'rgba(255, 250, 224, 1)');
  g.addColorStop(0.4, 'rgba(245, 202, 108, 0.45)');
  g.addColorStop(1, 'rgba(245, 202, 108, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = 'rgba(255, 248, 220, 0.95)';
  ctx.beginPath();
  ctx.moveTo(64, 8);
  ctx.quadraticCurveTo(68, 60, 120, 64);
  ctx.quadraticCurveTo(68, 68, 64, 120);
  ctx.quadraticCurveTo(60, 68, 8, 64);
  ctx.quadraticCurveTo(60, 60, 64, 8);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createPetalTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(28, 28, 4, 32, 32, 28);
  g.addColorStop(0, 'rgba(252, 224, 224, 0.95)');
  g.addColorStop(0.7, 'rgba(242, 184, 188, 0.88)');
  g.addColorStop(1, 'rgba(230, 158, 166, 0.4)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(32, 8);
  ctx.bezierCurveTo(50, 16, 52, 46, 32, 56);
  ctx.bezierCurveTo(12, 46, 14, 16, 32, 8);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSunbeamTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, 'rgba(255, 244, 198, 0.45)');
  g.addColorStop(0.55, 'rgba(255, 240, 184, 0.22)');
  g.addColorStop(1, 'rgba(255, 240, 184, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function getSharedTextures() {
  if (!cachedTextures) {
    cachedTextures = {
      glow: createSoftGlowTexture(),
      star: createStarFlareTexture(),
      petal: createPetalTexture(),
      beam: createSunbeamTexture(),
    };
  }
  return cachedTextures;
}
class CoverEffects3D {
  constructor() {
    this.group = new THREE.Group();
    this.dioramaGroup = new THREE.Group();
    this.fxGroup = new THREE.Group();
    this.group.add(this.dioramaGroup, this.fxGroup);

    this._flames = [];
    this._particles = [];
    this._pendulums = [];
    this._floaters = [];
    this._beams = [];
    this._templateId = null;
    this._buildVersion = 0;
    this._disposables = [];
  }

  _clearRig() {
    while (this.dioramaGroup.children.length > 0) {
      this.dioramaGroup.remove(this.dioramaGroup.children[0]);
    }
    while (this.fxGroup.children.length > 0) {
      this.fxGroup.remove(this.fxGroup.children[0]);
    }
    for (const item of this._disposables) {
      item.dispose?.();
    }
    this._disposables = [];
    this._flames = [];
    this._particles = [];
    this._pendulums = [];
    this._floaters = [];
    this._beams = [];
  }

  _addPlaneLayer(tex, { x = 0, y = 0, z = 0.02, w = PAGE_W, h = PAGE_H, normalMap = null, roughnessMap = null, metalnessMap = null, metalness = 0, roughness = 0.88, alphaTest = 0.03, castShadow = false, shadowOffset = [0.014, -0.018, -0.011], renderOrder = 0 } = {}) {
    if (!tex) return null;
    const geom = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      normalMap,
      normalScale: normalMap ? new THREE.Vector2(0.75, 0.75) : new THREE.Vector2(0, 0),
      roughnessMap,
      metalnessMap,
      metalness,
      roughness,
      transparent: true,
      alphaTest,
      depthWrite: alphaTest > 0.01,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    mesh.renderOrder = renderOrder;
    this.dioramaGroup.add(mesh);
    this._disposables.push(geom, mat);

    if (castShadow) {
      const shMat = new THREE.MeshBasicMaterial({
        map: tex,
        color: 0x1a120b,
        transparent: true,
        alphaTest: 0.06,
        opacity: 0.20,
        depthWrite: false,
      });
      const shMesh = new THREE.Mesh(geom, shMat);
      shMesh.position.set(x + shadowOffset[0], y + shadowOffset[1], z + shadowOffset[2]);
      shMesh.renderOrder = renderOrder - 1;
      this.dioramaGroup.add(shMesh);
      this._disposables.push(shMat);
      return { mesh, shadow: shMesh };
    }
    return { mesh, shadow: null };
  }

  _addProp(tex, propMeta, z, opts = {}) {
    if (!tex || !propMeta) return null;
    const pw = propMeta.w * PAGE_W;
    const ph = propMeta.h * PAGE_H;
    const cx = (propMeta.cx - 0.5) * PAGE_W;
    const cy = (0.5 - propMeta.cy) * PAGE_H;
    const ox = ((propMeta.pivotX ?? 0.5) - 0.5) * pw;
    const oy = (0.5 - (propMeta.pivotY ?? 0.5)) * ph;

    const pivot = new THREE.Group();
    pivot.position.set(cx + ox, cy + oy, z);

    const geom = new THREE.PlaneGeometry(pw, ph);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: opts.roughness ?? 0.78,
      metalness: opts.metalness ?? 0.14,
      transparent: true,
      alphaTest: 0.04,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(-ox, -oy, 0);
    mesh.renderOrder = opts.renderOrder ?? 3;
    pivot.add(mesh);
    this.dioramaGroup.add(pivot);
    this._disposables.push(geom, mat);

    let shadow = null;
    if (opts.castShadow) {
      const shMat = new THREE.MeshBasicMaterial({
        map: tex,
        color: 0x1b120b,
        transparent: true,
        alphaTest: 0.06,
        opacity: opts.shadowOpacity ?? 0.22,
        depthWrite: false,
      });
      shadow = new THREE.Mesh(geom, shMat);
      shadow.position.set(-ox + 0.015, -oy - 0.02, -0.012);
      shadow.renderOrder = (opts.renderOrder ?? 3) - 1;
      pivot.add(shadow);
      this._disposables.push(shMat);
    }

    return { pivot, mesh, shadow, baseX: cx + ox, baseY: cy + oy, baseZ: z };
  }

  _addGlow(x, y, z, size, baseOpacity, color = 0xffdf96, speed = 7.5, phase = 0) {
    const tex = getSharedTextures().glow;
    const mat = new THREE.SpriteMaterial({
      map: tex,
      color,
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.set(x, y, z);
    sp.scale.setScalar(size);
    sp.renderOrder = 8;
    this.fxGroup.add(sp);
    this._disposables.push(mat);
    this._flames.push({ sp, mat, baseX: x, baseY: y, baseSize: size, baseOpacity, speed, phase });
  }

  _addParticle({ x, y, z, size, vx, vy, rotSpeed, baseOpacity, type = 'star', color = 0xffe4a0, minX = -1.1, maxX = 1.1, minY = -1.5, maxY = 1.5, phase = 0 }) {
    const texs = getSharedTextures();
    const isPetal = type === 'petal';
    const mat = new THREE.SpriteMaterial({
      map: isPetal ? texs.petal : (type === 'glow' ? texs.glow : texs.star),
      color,
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
      blending: isPetal ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.set(x, y, z);
    sp.scale.setScalar(size);
    sp.renderOrder = 7;
    this.fxGroup.add(sp);
    this._disposables.push(mat);
    this._particles.push({ sp, mat, vx, vy, rotSpeed, baseSize: size, baseOpacity, minX, maxX, minY, maxY, phase });
  }

  setTemplate(templateId) {
    if (this._templateId === templateId && this.dioramaGroup.children.length > 0) return;
    this._templateId = templateId;
    const version = ++this._buildVersion;
    this._clearRig();
    this._buildRig(templateId, version);
  }

  async _buildRig(templateId, version) {
    const layers = CARD_LAYERS[templateId];
    const tpl = getTemplate(templateId);
    if (!layers) return;

    const [bgTex, frameTex, reliefNormal, foilMaps] = await Promise.all([
      loadThreeTexture(layers.bg, { srgb: true }),
      loadThreeTexture(layers.frame, { srgb: true }),
      loadThreeTexture(tpl.reliefUrl, { srgb: false }),
      loadFoilMaps(tpl.foilUrl),
    ]);
    if (version !== this._buildVersion) return;

    // 1. Recessed Window Backdrop (deep inside card)
    this._addPlaneLayer(bgTex, { z: 0.015, alphaTest: 0.04, roughness: 0.9, renderOrder: 1 });

    // 2. Cut Front Card Frame with letterpress relief normal & gold foil metalness
    this._addPlaneLayer(frameTex, {
      z: 0.062,
      normalMap: reliefNormal,
      roughnessMap: foilMaps.roughTex,
      metalnessMap: foilMaps.metalTex,
      metalness: 0.65,
      roughness: 0.90,
      alphaTest: 0.05,
      castShadow: true,
      shadowOffset: [0.0, 0.0, -0.014],
      renderOrder: 4,
    });

    // ------------------------------------------------------------------
    // Per-card bespoke 3D dioramas & animations
    // ------------------------------------------------------------------
    if (templateId === 'candlelight-wish') {
      const [cakeTex, moonTex, bellsTex, ribbonTex, starTex] = await Promise.all([
        loadThreeTexture(layers.props.cake.url, { srgb: true }),
        loadThreeTexture(layers.props.moon.url, { srgb: true }),
        loadThreeTexture(layers.props.bells.url, { srgb: true }),
        loadThreeTexture(layers.props.ribbon.url, { srgb: true }),
        loadThreeTexture(layers.props.star.url, { srgb: true }),
      ]);
      if (version !== this._buildVersion) return;

      // Floating mid-arch cake & cloud table inside the arch recess
      const cakeObj = this._addProp(cakeTex, layers.props.cake, 0.038, { castShadow: true, renderOrder: 2 });
      if (cakeObj) this._floaters.push({ pivot: cakeObj.pivot, baseY: cakeObj.baseY, baseZ: cakeObj.baseZ, ampY: 0.014, ampZ: 0.008, speed: 1.5, phase: 0.2 });

      // Foreground embossed relief cutouts
      const moonObj = this._addProp(moonTex, layers.props.moon, 0.090, { castShadow: true, metalness: 0.35, roughness: 0.45, renderOrder: 5 });
      if (moonObj) this._floaters.push({ pivot: moonObj.pivot, baseY: moonObj.baseY, baseZ: moonObj.baseZ, ampY: 0.012, ampZ: 0.008, speed: 1.3, phase: 0.9 });

      const bellsObj = this._addProp(bellsTex, layers.props.bells, 0.095, { castShadow: true, metalness: 0.28, roughness: 0.5, renderOrder: 5 });
      if (bellsObj) this._pendulums.push({ pivot: bellsObj.pivot, amp: 0.052, speed: 1.75, phase: 0.4 });

      this._addProp(ribbonTex, layers.props.ribbon, 0.088, { castShadow: true, renderOrder: 5 });
      const starObj = this._addProp(starTex, layers.props.star, 0.092, { castShadow: true, metalness: 0.45, roughness: 0.38, renderOrder: 5 });
      if (starObj) this._floaters.push({ pivot: starObj.pivot, baseY: starObj.baseY, baseZ: starObj.baseZ, ampY: 0.010, ampZ: 0.010, speed: 1.9, phase: 1.7 });

      // 5 flickering flame halos + rising starry embers
      [-0.17, -0.085, 0.0, 0.085, 0.17].forEach((cx, i) => {
        this._addGlow(cx, 0.18 + (i === 2 ? 0.04 : 0), 0.052, 0.34, 0.76, 0xffd984, 8 + i * 1.3, i * 1.4);
      });
      for (let i = 0; i < 24; i++) {
        this._addParticle({
          x: (Math.random() - 0.5) * 1.45,
          y: -0.35 + Math.random() * 1.65,
          z: 0.042 + Math.random() * 0.08,
          size: 0.07 + Math.random() * 0.09,
          vx: (Math.random() - 0.5) * 0.06,
          vy: 0.15 + Math.random() * 0.18,
          rotSpeed: (Math.random() - 0.5) * 1.5,
          baseOpacity: 0.55 + Math.random() * 0.4,
          type: i % 3 === 0 ? 'glow' : 'star',
          minX: -0.78,
          maxX: 0.78,
          minY: -0.45,
          maxY: 1.35,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (templateId === 'garden-tea') {
      const [tableTex, lanternTex, wreathTex, envTex, ribTex] = await Promise.all([
        loadThreeTexture(layers.props.table.url, { srgb: true }),
        loadThreeTexture(layers.props.lantern.url, { srgb: true }),
        loadThreeTexture(layers.props.wreath.url, { srgb: true }),
        loadThreeTexture(layers.props.envelope.url, { srgb: true }),
        loadThreeTexture(layers.props.ribbon.url, { srgb: true }),
      ]);
      if (version !== this._buildVersion) return;

      // Animated diagonal 3D volumetric sunbeam shafts inside garden arch
      const beamTex = getSharedTextures().beam;
      for (let i = 0; i < 3; i++) {
        const bGeom = new THREE.PlaneGeometry(0.45 + i * 0.12, 1.85);
        const bMat = new THREE.MeshBasicMaterial({
          map: beamTex,
          transparent: true,
          opacity: 0.24,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const bMesh = new THREE.Mesh(bGeom, bMat);
        bMesh.position.set(-0.22 + i * 0.28, 0.52, 0.025 + i * 0.004);
        bMesh.rotation.z = -0.48;
        bMesh.renderOrder = 2;
        this.dioramaGroup.add(bMesh);
        this._disposables.push(bGeom, bMat);
        this._beams.push({ mat: bMat, baseOp: 0.24 - i * 0.03, speed: 1.4 + i * 0.4, phase: i * 1.3 });
      }

      // Mid-arch berry cake & tea table
      this._addProp(tableTex, layers.props.table, 0.042, { castShadow: true, renderOrder: 3 });

      // Pendulum-swinging antique gold lantern in front of arch
      const lanternObj = this._addProp(lanternTex, layers.props.lantern, 0.098, { castShadow: true, metalness: 0.3, roughness: 0.48, renderOrder: 6 });
      if (lanternObj) this._pendulums.push({ pivot: lanternObj.pivot, amp: 0.048, speed: 1.35, phase: 0.0 });

      // Foreground ribbon, envelope, and lower floral wreath
      this._addProp(ribTex, layers.props.ribbon, 0.088, { castShadow: true, renderOrder: 5 });
      const envObj = this._addProp(envTex, layers.props.envelope, 0.095, { castShadow: true, renderOrder: 6 });
      if (envObj) this._floaters.push({ pivot: envObj.pivot, baseY: envObj.baseY, baseZ: envObj.baseZ, ampY: 0.010, ampZ: 0.006, speed: 1.5, phase: 1.1 });
      this._addProp(wreathTex, layers.props.wreath, 0.088, { castShadow: true, renderOrder: 5 });

      this._addGlow(0.60, 0.66, 0.11, 0.46, 0.65, 0xffe096, 6.2, 0.4);
      this._addGlow(-0.04, 0.15, 0.056, 0.28, 0.55, 0xffe3a2, 8.5, 1.8);

      for (let i = 0; i < 22; i++) {
        const isPetal = i % 2 === 0;
        this._addParticle({
          x: (Math.random() - 0.5) * 2.1,
          y: (Math.random() - 0.5) * 2.8,
          z: 0.068 + Math.random() * 0.07,
          size: isPetal ? 0.11 + Math.random() * 0.06 : 0.08 + Math.random() * 0.06,
          vx: 0.06 + Math.random() * 0.08,
          vy: isPetal ? -(0.14 + Math.random() * 0.14) : 0.09 + Math.random() * 0.11,
          rotSpeed: isPetal ? (Math.random() - 0.5) * 2.2 : 0.8,
          baseOpacity: isPetal ? 0.78 : 0.55,
          type: isPetal ? 'petal' : 'glow',
          color: isPetal ? 0xffffff : 0xfff0be,
          minX: -1.15,
          maxX: 1.15,
          minY: -1.55,
          maxY: 1.55,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (templateId === 'patisserie-window') {
      const [cakeTex, sillTex, bowTex, awTex] = await Promise.all([
        loadThreeTexture(layers.props.cake.url, { srgb: true }),
        loadThreeTexture(layers.props.sill.url, { srgb: true }),
        loadThreeTexture(layers.props.bow.url, { srgb: true }),
        loadThreeTexture(layers.awningTex, { srgb: true }),
      ]);
      if (version !== this._buildVersion) return;

      // Cake recessed inside boutique window
      this._addProp(cakeTex, layers.props.cake, 0.036, { castShadow: true, renderOrder: 2 });

      // Glossy transparent boutique window glass reflection pane behind crimson frame
      const glassGeom = new THREE.PlaneGeometry(1.86, 2.08);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xfff6e8,
        transparent: true,
        opacity: 0.12,
        roughness: 0.08,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        depthWrite: false,
      });
      const glassMesh = new THREE.Mesh(glassGeom, glassMat);
      glassMesh.position.set(0, 0.0, 0.052);
      glassMesh.renderOrder = 3;
      this.dioramaGroup.add(glassMesh);
      this._disposables.push(glassGeom, glassMat);

      // REAL 3D Slanted Parisian Awning Canopy projecting outward from the storefront!
      if (awTex) {
        const awWidth = 2.06;
        const slopeLen = 0.34;
        const slopeGeom = new THREE.PlaneGeometry(awWidth, slopeLen);
        const awMat = new THREE.MeshStandardMaterial({
          map: awTex,
          roughness: 0.84,
          metalness: 0.04,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.DoubleSide,
        });
        const slopeMesh = new THREE.Mesh(slopeGeom, awMat);
        // Project from top edge y=+1.35, z=+0.064 downward/outward at 36 deg
        slopeMesh.position.set(0, 1.22, 0.155);
        slopeMesh.rotation.x = -0.96;
        slopeMesh.renderOrder = 6;

        // Vertical scalloped front valance lip
        const valGeom = new THREE.PlaneGeometry(awWidth, 0.12);
        const valMat = awMat.clone();
        const valMesh = new THREE.Mesh(valGeom, valMat);
        valMesh.position.set(0, 1.06, 0.285);
        valMesh.renderOrder = 6;

        this.dioramaGroup.add(slopeMesh, valMesh);
        this._disposables.push(slopeGeom, awMat, valGeom, valMat);
      }

      // Pop-out sill & top bow
      this._addProp(sillTex, layers.props.sill, 0.095, { castShadow: true, renderOrder: 5 });
      this._addProp(bowTex, layers.props.bow, 0.145, { castShadow: true, renderOrder: 7 });

      // 9 warm fairy lights strung physically beneath the 3D awning front lip
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const fx = -0.86 + t * 1.72;
        const fy = 1.01 - Math.sin(t * Math.PI) * 0.05;
        this._addGlow(fx, fy, 0.275, 0.24, 0.74, 0xffe290, 4.2 + (i % 3) * 1.4, i * 0.85);
      }
      [-0.09, 0.0, 0.09].forEach((cx, i) => {
        this._addGlow(cx, 0.02, 0.048, 0.26, 0.68, 0xffda82, 8.2, i * 1.2);
      });
      for (let i = 0; i < 20; i++) {
        this._addParticle({
          x: (Math.random() - 0.5) * 1.7,
          y: -1.15 + Math.random() * 2.1,
          z: 0.075 + Math.random() * 0.09,
          size: 0.07 + Math.random() * 0.08,
          vx: (Math.random() - 0.5) * 0.05,
          vy: 0.12 + Math.random() * 0.16,
          rotSpeed: 1.1,
          baseOpacity: 0.62,
          type: i % 2 === 0 ? 'glow' : 'star',
          minX: -0.95,
          maxX: 0.95,
          minY: -1.25,
          maxY: 1.05,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (templateId === 'sky-balloons') {
      const [pinkTex, goldTex, blueTex, wreathTex, bowTex, starTex] = await Promise.all([
        loadThreeTexture(layers.props.balloonPink.url, { srgb: true }),
        loadThreeTexture(layers.props.balloonGold.url, { srgb: true }),
        loadThreeTexture(layers.props.balloonBlue.url, { srgb: true }),
        loadThreeTexture(layers.props.wreath.url, { srgb: true }),
        loadThreeTexture(layers.props.bow.url, { srgb: true }),
        loadThreeTexture(layers.props.star.url, { srgb: true }),
      ]);
      if (version !== this._buildVersion) return;

      // 3 independently bobbing & gently swaying 3D hot air balloons inside the sky shadowbox!
      const bPink = this._addProp(pinkTex, layers.props.balloonPink, 0.044, { castShadow: true, shadowOpacity: 0.16, renderOrder: 3 });
      const bGold = this._addProp(goldTex, layers.props.balloonGold, 0.030, { castShadow: true, shadowOpacity: 0.14, renderOrder: 2 });
      const bBlue = this._addProp(blueTex, layers.props.balloonBlue, 0.052, { castShadow: true, shadowOpacity: 0.18, renderOrder: 3 });

      if (bPink) this._floaters.push({ pivot: bPink.pivot, baseY: bPink.baseY, baseZ: bPink.baseZ, ampY: 0.042, ampZ: 0.012, rotAmp: 0.035, speed: 1.25, phase: 0.2 });
      if (bGold) this._floaters.push({ pivot: bGold.pivot, baseY: bGold.baseY, baseZ: bGold.baseZ, ampY: 0.038, ampZ: 0.010, rotAmp: 0.030, speed: 1.05, phase: 2.1 });
      if (bBlue) this._floaters.push({ pivot: bBlue.pivot, baseY: bBlue.baseY, baseZ: bBlue.baseZ, ampY: 0.045, ampZ: 0.014, rotAmp: 0.040, speed: 1.38, phase: 4.0 });

      // Raised circular floral wreath + satin bow + bottom star
      this._addProp(wreathTex, layers.props.wreath, 0.088, { castShadow: true, renderOrder: 5 });
      this._addProp(bowTex, layers.props.bow, 0.118, { castShadow: true, renderOrder: 6 });
      const starObj = this._addProp(starTex, layers.props.star, 0.092, { castShadow: true, metalness: 0.42, roughness: 0.4, renderOrder: 5 });
      if (starObj) this._floaters.push({ pivot: starObj.pivot, baseY: starObj.baseY, baseZ: starObj.baseZ, ampY: 0.010, ampZ: 0.008, speed: 1.8, phase: 1.2 });

      [0.24, 0.36, 0.48].forEach((lx, i) => {
        this._addGlow(lx, -0.22, 0.046, 0.22, 0.62, 0xffe49c, 5.2, i * 1.1);
      });
      for (let i = 0; i < 24; i++) {
        this._addParticle({
          x: (Math.random() - 0.5) * 2.0,
          y: (Math.random() - 0.5) * 2.6,
          z: 0.072 + Math.random() * 0.08,
          size: 0.07 + Math.random() * 0.08,
          vx: 0.05 + Math.random() * 0.07,
          vy: 0.07 + Math.random() * 0.11,
          rotSpeed: 0.9,
          baseOpacity: 0.6,
          type: i % 2 === 0 ? 'star' : 'glow',
          minX: -1.12,
          maxX: 1.12,
          minY: -1.45,
          maxY: 1.45,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  update(dt, elapsed, openAmount = 0, enabled = true) {
    const vis = enabled ? Math.max(0, 1 - openAmount * 2.8) : 0;
    this.group.visible = vis > 0.01;
    if (!this.group.visible) return;

    // Flatten Z depth gracefully right as the card starts opening
    this.dioramaGroup.scale.z = Math.max(0.05, vis);
    this.fxGroup.visible = vis > 0.25;

    for (const f of this._flames) {
      const flicker = 0.86 + 0.18 * Math.sin(elapsed * f.speed + f.phase) + 0.08 * Math.cos(elapsed * 13.7 + f.phase);
      f.sp.scale.setScalar(f.baseSize * flicker);
      f.mat.opacity = Math.min(1, f.baseOpacity * (0.85 + 0.2 * flicker) * vis);
      f.sp.position.y = f.baseY + Math.sin(elapsed * 4.2 + f.phase) * 0.008;
    }

    for (const p of this._particles) {
      let nx = p.sp.position.x + (p.vx + Math.sin(elapsed * 1.4 + p.phase) * 0.03) * dt;
      let ny = p.sp.position.y + p.vy * dt;
      if (nx > p.maxX) nx = p.minX;
      if (nx < p.minX) nx = p.maxX;
      if (ny > p.maxY) ny = p.minY;
      if (ny < p.minY) ny = p.maxY;
      p.sp.position.x = nx;
      p.sp.position.y = ny;

      const pulse = 0.72 + 0.28 * Math.sin(elapsed * 3.1 + p.phase);
      p.sp.scale.setScalar(p.baseSize * (0.88 + 0.16 * pulse));
      p.mat.rotation += p.rotSpeed * dt;
      p.mat.opacity = p.baseOpacity * pulse * vis;
    }

    for (const pd of this._pendulums) {
      pd.pivot.rotation.z = Math.sin(elapsed * pd.speed + pd.phase) * pd.amp;
    }

    for (const fl of this._floaters) {
      fl.pivot.position.y = fl.baseY + Math.sin(elapsed * fl.speed + fl.phase) * fl.ampY;
      fl.pivot.position.z = fl.baseZ + Math.cos(elapsed * (fl.speed * 0.8) + fl.phase) * fl.ampZ;
      if (fl.rotAmp) {
        fl.pivot.rotation.z = Math.sin(elapsed * (fl.speed * 0.75) + fl.phase) * fl.rotAmp;
      }
    }

    for (const bm of this._beams) {
      bm.mat.opacity = bm.baseOp * (0.72 + 0.28 * Math.sin(elapsed * bm.speed + bm.phase)) * vis;
    }
  }
}

return { CoverEffects3D };
})();

__APP_MODS__['js/three/sceneManager.js'] = (function() {
const THREE = __APP_MODS__['three'];

function createSparkleTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 1, 32, 32, 30);
  g.addColorStop(0, 'rgba(232, 184, 92, 1)');
  g.addColorStop(0.35, 'rgba(222, 166, 68, 0.72)');
  g.addColorStop(1, 'rgba(222, 166, 68, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CONFETTI_COLORS = [0xe5be67, 0xf8eed9, 0xe8aab0, 0xd8a64e, 0xf5d68a];
const CONFETTI_COUNT = 64;
class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 80);
    this.camera.position.set(0, 0, 10.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this._pointerBiasX = 0;
    this._pointerBiasY = 0;

    this._setupLights();
    this._setupSparkles();
    this._setupConfettiBurst();

    this._frameCallbacks = new Set();
    this._rafId = null;
    this._lastTime = performance.now();
    this._sparkleTargetOpacity = 0;

    this._resizeObserver = new ResizeObserver(() => this.resize());
    this._resizeObserver.observe(container);

    this._loop = this._loop.bind(this);
    this._rafId = requestAnimationFrame(this._loop);
  }

  _setupLights() {
    const ambient = new THREE.AmbientLight(0xfffaf4, 1.48);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff6ec, 1.45);
    key.position.set(-3.8, 5.2, 7.5);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xf4f7fd, 0.75);
    fill.position.set(4.5, -1.5, 5.5);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffebd0, 0.42);
    rim.position.set(0, 4.5, -6.0);
    this.scene.add(rim);

    // Warm specular glint light for gold foil & glossy red wax seal
    const glint = new THREE.PointLight(0xffdf9a, 1.55, 22, 1.2);
    glint.position.set(2.4, 2.8, 6.0);
    this.scene.add(glint);
    this.glintLight = glint;
  }

  _setupSparkles() {
    const count = 96;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6.4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.4 + 0.55;
      speeds[i] = 0.14 + Math.random() * 0.24;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._sparklePhases = phases;
    this._sparkleSpeeds = speeds;

    this._sparkleMat = new THREE.PointsMaterial({
      size: 0.115,
      map: createSparkleTexture(),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.sparkles = new THREE.Points(geom, this._sparkleMat);
    this.sparkles.renderOrder = 5;
    this.scene.add(this.sparkles);
  }

  _setupConfettiBurst() {
    const geom = new THREE.PlaneGeometry(0.085, 0.045);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.65,
      side: THREE.DoubleSide,
    });
    this._confettiMesh = new THREE.InstancedMesh(geom, mat, CONFETTI_COUNT);
    this._confettiMesh.visible = false;
    this._confettiMesh.renderOrder = 8;

    const color = new THREE.Color();
    this._confettiData = [];
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      color.setHex(CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
      this._confettiMesh.setColorAt(i, color);
      this._confettiData.push({
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        rot: new THREE.Euler(),
        rotVel: new THREE.Vector3(),
      });
    }
    this._confettiMesh.instanceColor.needsUpdate = true;
    this._confettiDummy = new THREE.Object3D();
    this._burstActive = false;
    this._burstAge = 0;
    this.scene.add(this._confettiMesh);
  }

  triggerCelebrationBurst(originX = 0, originY = 0.15, originZ = 0.55) {
    this._burstActive = true;
    this._burstAge = 0;
    this._confettiMesh.visible = true;

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const p = this._confettiData[i];
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.random() * 2.4;
      p.pos.set(
        originX + (Math.random() - 0.5) * 0.4,
        originY + (Math.random() - 0.5) * 0.3,
        originZ
      );
      p.vel.set(
        Math.cos(angle) * speed * 0.9,
        1.2 + Math.random() * 2.3,
        (Math.random() - 0.3) * 1.4
      );
      p.rot.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      p.rotVel.set(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 9
      );
    }
  }

  setPointerBias(nx = 0, ny = 0) {
    this._pointerBiasX = Math.max(-1, Math.min(1, nx));
    this._pointerBiasY = Math.max(-1, Math.min(1, ny));
  }

  setSparklesVisible(visible) {
    this._sparkleTargetOpacity = visible ? 0.72 : 0;
  }

  onFrame(fn) {
    this._frameCallbacks.add(fn);
    return () => this._frameCallbacks.delete(fn);
  }

  resize() {
    if (!this.container || !this.renderer) return;
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
  }

  _loop(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - this._lastTime) / 1000));
    this._lastTime = now;
    const elapsed = now * 0.001;

    // Gentle figure-8 specular glint sweep + live pointer sheen
    this.glintLight.position.set(
      Math.sin(elapsed * 0.85) * 2.4 + this._pointerBiasX * 2.6,
      1.45 + Math.sin(elapsed * 1.35) * 0.95 + this._pointerBiasY * 1.8,
      5.8
    );

    // Gentle drift of golden sparkles
    const curOp = this._sparkleMat.opacity;
    this._sparkleMat.opacity += (this._sparkleTargetOpacity - curOp) * Math.min(1, dt * 6);
    if (this._sparkleMat.opacity > 0.005) {
      this.sparkles.visible = true;
      const pos = this.sparkles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + this._sparkleSpeeds[i] * dt * 0.45;
        const x = pos.getX(i) + Math.sin(elapsed * 0.8 + this._sparklePhases[i]) * dt * 0.08;
        if (y > 2.6) y = -2.6;
        pos.setXY(i, x, y);
      }
      pos.needsUpdate = true;
    } else {
      this.sparkles.visible = false;
    }

    // Confetti fountain animation
    if (this._burstActive) {
      this._burstAge += dt;
      const duration = 2.5;
      const scaleOut = this._burstAge > 1.7 ? Math.max(0, 1 - (this._burstAge - 1.7) / 0.8) : 1;
      for (let i = 0; i < CONFETTI_COUNT; i++) {
        const p = this._confettiData[i];
        p.vel.y -= 3.2 * dt;
        p.vel.multiplyScalar(Math.max(0.86, 1 - dt * 1.2));
        p.pos.addScaledVector(p.vel, dt);
        p.rot.x += p.rotVel.x * dt;
        p.rot.y += p.rotVel.y * dt;
        p.rot.z += p.rotVel.z * dt;

        this._confettiDummy.position.copy(p.pos);
        this._confettiDummy.rotation.copy(p.rot);
        this._confettiDummy.scale.setScalar(scaleOut);
        this._confettiDummy.updateMatrix();
        this._confettiMesh.setMatrixAt(i, this._confettiDummy.matrix);
      }
      this._confettiMesh.instanceMatrix.needsUpdate = true;
      if (this._burstAge >= duration) {
        this._burstActive = false;
        this._confettiMesh.visible = false;
      }
    }

    for (const cb of this._frameCallbacks) {
      cb(dt, elapsed);
    }

    this.renderer.render(this.scene, this.camera);
    this._rafId = requestAnimationFrame(this._loop);
  }

  getNdc(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
  }

  dispose() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._resizeObserver.disconnect();
    this._frameCallbacks.clear();
    this._confettiMesh.geometry.dispose();
    this._confettiMesh.material.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

return { SceneManager };
})();

__APP_MODS__['js/three/card3d.js'] = (function() {
const THREE = __APP_MODS__['three'];
const {getPaper,getTemplate} = __APP_MODS__['js/config.js'];
const {CoverEffects3D} = __APP_MODS__['js/three/coverEffects3d.js'];
const {getTextSlotBounds,INSIDE_H,INSIDE_W,loadFoilMaps,loadThreeTexture,renderBackCoverCanvas,renderInsideLeftCanvas,renderInsideRightCanvas} = __APP_MODS__['js/three/textures.js'];
const PAGE_W = 2.6;
const PAGE_H = 3.6;
const CARD_THICK = 0.022;

function createContactShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 24, 128, 128, 124);
  g.addColorStop(0, 'rgba(28, 22, 16, 0.22)');
  g.addColorStop(0.55, 'rgba(28, 22, 16, 0.09)');
  g.addColorStop(1, 'rgba(28, 22, 16, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
class BiFoldCard3D {
  constructor(initialState = {}) {
    this.state = {
      templateId: initialState.templateId || 'candlelight-wish',
      paper: initialState.paper || 'watercolor',
      font: initialState.font || 'english',
      greeting: initialState.greeting || '',
      body: initialState.body || '',
      signature: initialState.signature || '',
      stickers: initialState.stickers || [],
      showcase: Boolean(initialState.showcase),
      effects3d: initialState.effects3d !== false,
      redPacket: initialState.redPacket || { enabled: false },
      redPacketClaimed: Boolean(initialState.redPacketClaimed),
    };

    this.group = new THREE.Group();
    this.pivot = new THREE.Group();
    this.group.add(this.pivot);

    // Animation targets
    this.openAmount = 0;
    this.targetOpen = 0;
    this.orbitYaw = 0;
    this.targetYaw = 0;
    this.orbitPitch = 0;
    this.targetPitch = 0;
    this.floatOffset = 0;
    this.inEnvelope = false;

    this._insideLeftCanvas = document.createElement('canvas');
    this._insideLeftCanvas.width = INSIDE_W;
    this._insideLeftCanvas.height = INSIDE_H;
    this._insideLeftCanvas.getContext('2d').fillStyle = '#f4f0ea';
    this._insideLeftCanvas.getContext('2d').fillRect(0, 0, INSIDE_W, INSIDE_H);

    this._insideRightCanvas = document.createElement('canvas');
    this._insideRightCanvas.width = INSIDE_W;
    this._insideRightCanvas.height = INSIDE_H;
    this._insideRightCanvas.getContext('2d').fillStyle = '#f4f0ea';
    this._insideRightCanvas.getContext('2d').fillRect(0, 0, INSIDE_W, INSIDE_H);

    this._backCoverCanvas = document.createElement('canvas');
    this._backCoverCanvas.width = 512;
    this._backCoverCanvas.height = 709;
    this._backCoverCanvas.getContext('2d').fillStyle = '#f3ede2';
    this._backCoverCanvas.getContext('2d').fillRect(0, 0, 512, 709);

    this._insideLeftTex = new THREE.CanvasTexture(this._insideLeftCanvas);
    this._insideLeftTex.colorSpace = THREE.SRGBColorSpace;
    this._insideLeftTex.anisotropy = 8;

    this._insideRightTex = new THREE.CanvasTexture(this._insideRightCanvas);
    this._insideRightTex.colorSpace = THREE.SRGBColorSpace;
    this._insideRightTex.anisotropy = 8;

    this._backCoverTex = new THREE.CanvasTexture(this._backCoverCanvas);
    this._backCoverTex.colorSpace = THREE.SRGBColorSpace;
    this._backCoverTex.anisotropy = 4;

    this._buildGeometry();
    this._renderId = 0;
    this.refreshAll();
  }

  _buildGeometry() {
    this._edgeMat = new THREE.MeshStandardMaterial({
      color: 0xe8e2d8,
      roughness: 0.9,
      metalness: 0.0,
    });

    this._frontCoverMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.65,
      normalScale: new THREE.Vector2(0.45, 0.45),
    });

    this._insideLeftMat = new THREE.MeshStandardMaterial({
      map: this._insideLeftTex,
      roughness: 0.88,
      metalness: 0.0,
      normalScale: new THREE.Vector2(0.55, 0.55),
    });

    this._insideRightMat = new THREE.MeshStandardMaterial({
      map: this._insideRightTex,
      roughness: 0.88,
      metalness: 0.0,
      normalScale: new THREE.Vector2(0.55, 0.55),
    });

    this._backCoverMat = new THREE.MeshStandardMaterial({
      map: this._backCoverTex,
      roughness: 0.9,
      metalness: 0.0,
      normalScale: new THREE.Vector2(0.45, 0.45),
    });

    // Back wing (Right inside page + Back cover): x in [0, PAGE_W], z in [-THICK/2, +THICK/2]
    const backGeom = new THREE.BoxGeometry(PAGE_W, PAGE_H, CARD_THICK);
    this.backWing = new THREE.Mesh(backGeom, [
      this._edgeMat,
      this._edgeMat,
      this._edgeMat,
      this._edgeMat,
      this._insideRightMat, // +Z
      this._backCoverMat,   // -Z
    ]);
    this.backWing.position.set(PAGE_W * 0.5, 0, 0);
    this.pivot.add(this.backWing);

    // Front cover hinge at spine x = 0, z = +THICK * 0.55
    this.frontHinge = new THREE.Group();
    this.frontHinge.position.set(0, 0, CARD_THICK * 0.55);
    this.pivot.add(this.frontHinge);

    const frontGeom = new THREE.BoxGeometry(PAGE_W, PAGE_H, CARD_THICK);
    this.frontWing = new THREE.Mesh(frontGeom, [
      this._edgeMat,
      this._edgeMat,
      this._edgeMat,
      this._edgeMat,
      this._frontCoverMat, // +Z
      this._insideLeftMat, // -Z
    ]);
    this.frontWing.position.set(PAGE_W * 0.5, 0, CARD_THICK * 0.55);
    this.frontHinge.add(this.frontWing);

    // Per-template dynamic 3D cover particles & parallax depth charms
    this.coverFx = new CoverEffects3D();
    this.frontWing.add(this.coverFx.group);

    // Subtle studio drop shadow behind card
    const shadowGeom = new THREE.PlaneGeometry(PAGE_W * 1.35, PAGE_H * 1.15);
    this._shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    this.shadowMesh = new THREE.Mesh(shadowGeom, this._shadowMat);
    this.shadowMesh.position.set(0, -0.14, -0.35);
    this.group.add(this.shadowMesh);
  }

  setState(patch) {
    const prevTpl = this.state.templateId;
    const prevPaper = this.state.paper;
    const prevFx = this.state.effects3d;
    Object.assign(this.state, patch);

    if (this.state.templateId !== prevTpl || this.state.paper !== prevPaper || this.state.effects3d !== prevFx) {
      return this.refreshAll();
    }
    return this.refreshInside();
  }

  async refreshAll() {
    const myId = ++this._renderId;
    const tpl = getTemplate(this.state.templateId);
    const paper = getPaper(this.state.paper);

    // Edge tint
    this._edgeMat.color.set(paper.edgeColor);

    const [coverTex, foilMaps, reliefNormal, paperNormal, paperRough, wcNormal] = await Promise.all([
      loadThreeTexture(tpl.coverUrl, { srgb: true }),
      loadFoilMaps(tpl.foilUrl),
      loadThreeTexture(tpl.reliefUrl, { srgb: false }),
      loadThreeTexture(paper.normalUrl, { srgb: false, repeat: true }),
      loadThreeTexture(paper.roughUrl, { srgb: false, repeat: true }),
      loadThreeTexture('/assets/textures/watercolor-normal.png', { srgb: false, repeat: true }),
    ]);
    if (myId !== this._renderId) return;

    const use3d = this.state.effects3d !== false;
    if (coverTex) {
      this._frontCoverMat.map = use3d ? null : coverTex;
      this._frontCoverMat.color.set(use3d ? tpl.backColor : '#ffffff');
      this._frontCoverMat.normalMap = reliefNormal || wcNormal;
      this._frontCoverMat.roughnessMap = use3d ? null : foilMaps.roughTex;
      this._frontCoverMat.metalnessMap = use3d ? null : foilMaps.metalTex;
      this._frontCoverMat.metalness = use3d ? 0.0 : 0.65;
      this._frontCoverMat.needsUpdate = true;
    }

    for (const mat of [this._insideLeftMat, this._insideRightMat]) {
      mat.normalMap = paperNormal;
      mat.roughnessMap = paperRough;
      mat.roughness = paper.roughness;
      mat.metalness = paper.metalness;
      mat.normalScale.set(paper.normalScale, paper.normalScale);
      mat.needsUpdate = true;
    }

    renderBackCoverCanvas(this._backCoverCanvas, this.state.templateId);
    this._backCoverTex.needsUpdate = true;
    this._backCoverMat.normalMap = wcNormal;
    this._backCoverMat.needsUpdate = true;

    this.coverFx.setTemplate(this.state.templateId);

    await this.refreshInside(myId);
  }

  async refreshInside(expectedId = null) {
    const myId = expectedId ?? ++this._renderId;
    await Promise.all([
      renderInsideLeftCanvas(this._insideLeftCanvas, this.state),
      renderInsideRightCanvas(this._insideRightCanvas, this.state),
    ]);
    if (myId !== this._renderId) return;
    this._insideLeftTex.needsUpdate = true;
    this._insideRightTex.needsUpdate = true;
  }

  setOpen(open, immediate = false) {
    this.targetOpen = open ? 1 : 0;
    if (immediate) {
      this.openAmount = this.targetOpen;
      this._applyPose();
    }
  }

  setOrbit(yaw, pitch, immediate = false) {
    this.targetYaw = yaw;
    this.targetPitch = pitch;
    if (immediate) {
      this.orbitYaw = yaw;
      this.orbitPitch = pitch;
      this._applyPose();
    }
  }

  _applyPose() {
    // Hinge opens left (-0.92 * PI)
    this.frontHinge.rotation.y = -this.openAmount * Math.PI * 0.92;
    // Smoothly shift spine from -PAGE_W/2 (closed center) to 0 (open spread center)
    this.pivot.position.x = -PAGE_W * 0.5 * (1 - this.openAmount);
    this.group.rotation.y = this.orbitYaw;
    this.group.rotation.x = this.orbitPitch;
    // Shadow widens cleanly when opened
    this.shadowMesh.scale.x = 1 + this.openAmount * 0.85;
  }

  update(dt, elapsed = 0, idleFloat = false) {
    const k = Math.min(1, dt * 8.5);
    this.openAmount += (this.targetOpen - this.openAmount) * k;
    this.orbitYaw += (this.targetYaw - this.orbitYaw) * Math.min(1, dt * 10);
    this.orbitPitch += (this.targetPitch - this.orbitPitch) * Math.min(1, dt * 10);

    if (idleFloat) {
      this.floatOffset = Math.sin(elapsed * 1.45) * 0.035;
      this.pivot.position.y = this.floatOffset;
    } else {
      this.pivot.position.y *= Math.max(0, 1 - dt * 10);
    }

    this._applyPose();
    if (this.inEnvelope) {
      this.coverFx.dioramaGroup.scale.z = 0.06;
      this.coverFx.fxGroup.visible = false;
      this.coverFx.group.visible = this.state.effects3d !== false;
    } else {
      this.coverFx.update(dt, elapsed, this.openAmount, this.state.effects3d !== false);
    }
  }

  setInEnvelope(flag) {
    this.inEnvelope = Boolean(flag);
    this._shadowMat.opacity = this.inEnvelope ? 0.0 : 0.55;
  }

  /**
   * Raycast pointer NDC against front cover or inside left/right pages.
   * Returns { hit: 'front' | 'left' | 'right', u, v } or null.
   */
  raycast(ndc, camera) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects([this.frontWing, this.backWing], false);
    if (!hits.length) return null;

    const first = hits[0];
    const matIdx = first.face?.materialIndex;
    if (!first.uv) return null;

    // uv.y is bottom=0..top=1 in Three.js -> convert to canvas top=0..bottom=1
    const u = first.uv.x;
    const v = 1 - first.uv.y;

    if (first.object === this.frontWing) {
      if (matIdx === 4) return { hit: 'front', u, v };
      if (matIdx === 5) return { hit: 'left', u, v };
    }
    if (first.object === this.backWing && matIdx === 4) {
      return { hit: 'right', u, v };
    }
    return null;
  }

  /**
   * Map inside-right/left UV coordinates (top-left origin 0..1) into screen CSS pixels relative to container.
   */
  projectUvToScreen(side, u, v, camera, rect) {
    const localX = (u - 0.5) * PAGE_W;
    const localY = (0.5 - v) * PAGE_H;
    const targetMesh = side === 'left' ? this.frontWing : this.backWing;
    const localZ = side === 'left' ? -CARD_THICK * 0.52 : CARD_THICK * 0.52;
    // Note: on -Z face (left), u=0 is +X and u=1 is -X
    const adjX = side === 'left' ? (0.5 - u) * PAGE_W : localX;

    const worldPt = new THREE.Vector3(adjX, localY, localZ);
    targetMesh.updateMatrixWorld(true);
    worldPt.applyMatrix4(targetMesh.matrixWorld);
    worldPt.project(camera);

    return {
      x: (worldPt.x * 0.5 + 0.5) * rect.width,
      y: (-worldPt.y * 0.5 + 0.5) * rect.height,
    };
  }

  getSlotScreenBox(slotName, camera, rect) {
    const b = getTextSlotBounds(Boolean(this.state.redPacket?.enabled))[slotName];
    if (!b) return null;
    const tl = this.projectUvToScreen('right', b.x, b.y, camera, rect);
    const br = this.projectUvToScreen('right', b.x + b.w, b.y + b.h, camera, rect);
    return {
      left: Math.min(tl.x, br.x),
      top: Math.min(tl.y, br.y),
      width: Math.abs(br.x - tl.x),
      height: Math.abs(br.y - tl.y),
    };
  }
}

return { PAGE_W, PAGE_H, CARD_THICK, BiFoldCard3D };
})();

__APP_MODS__['js/three/envelope3d.js'] = (function() {
const THREE = __APP_MODS__['three'];
const {loadThreeTexture} = __APP_MODS__['js/three/textures.js'];
const ENV_W = 2.98;
const ENV_H = 3.94;
const FLAP_DROP = 1.88;

function createEnvelopeFrontTexture() {
  const w = 1024;
  const h = 1354;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');

  // Warm ivory cotton paper
  ctx.fillStyle = '#f4ede0';
  ctx.fillRect(0, 0, w, h);

  // Subtle paper vignette
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 90, w * 0.5, h * 0.5, w * 0.88);
  grad.addColorStop(0, 'rgba(255, 253, 248, 0.28)');
  grad.addColorStop(1, 'rgba(176, 158, 134, 0.18)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 4-flap classic stationery back seams (left & right wing edges + overlapping bottom triangular flap)
  const vDipY = Math.round(h * 0.48); // Deep V pocket apex matching ShapeGeometry
  const bottomApexY = Math.round(h * 0.44); // Bottom flap overlaps smoothly

  // Left side wing subtle shading
  const leftGrad = ctx.createLinearGradient(0, h * 0.5, w * 0.5, h * 0.5);
  leftGrad.addColorStop(0, 'rgba(255, 252, 246, 0.08)');
  leftGrad.addColorStop(1, 'rgba(148, 128, 102, 0.14)');
  ctx.fillStyle = leftGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w * 0.5, vDipY);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Right side wing subtle shading
  const rightGrad = ctx.createLinearGradient(w, h * 0.5, w * 0.5, h * 0.5);
  rightGrad.addColorStop(0, 'rgba(255, 252, 246, 0.08)');
  rightGrad.addColorStop(1, 'rgba(148, 128, 102, 0.14)');
  ctx.fillStyle = rightGrad;
  ctx.beginPath();
  ctx.moveTo(w, 0);
  ctx.lineTo(w * 0.5, vDipY);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Bottom triangular flap rising up over left/right wings
  const botGrad = ctx.createLinearGradient(0, bottomApexY, 0, h);
  botGrad.addColorStop(0, '#f3ecde');
  botGrad.addColorStop(0.25, '#f0e8d9');
  botGrad.addColorStop(1, '#ebe2d1');
  ctx.fillStyle = botGrad;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w * 0.5, bottomApexY);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Soft fold shadow & crease stroke along bottom triangle edges
  ctx.save();
  ctx.shadowColor = 'rgba(72, 54, 34, 0.18)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = -2;
  ctx.strokeStyle = 'rgba(132, 112, 88, 0.28)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w * 0.5, bottomApexY);
  ctx.lineTo(w, h);
  ctx.stroke();
  ctx.restore();

  // Subtle crease edge along upper V-notch
  ctx.strokeStyle = 'rgba(132, 112, 88, 0.20)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w * 0.5, vDipY);
  ctx.lineTo(w, 0);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createFlapOuterTexture() {
  const w = 1024;
  const h = 680;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#f5efe2';
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(255, 253, 248, 0.25)');
  grad.addColorStop(0.75, 'rgba(205, 188, 165, 0.14)');
  grad.addColorStop(1, 'rgba(150, 130, 108, 0.24)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createEnvelopeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 28, 128, 128, 124);
  g.addColorStop(0, 'rgba(30, 22, 16, 0.22)');
  g.addColorStop(0.6, 'rgba(30, 22, 16, 0.08)');
  g.addColorStop(1, 'rgba(30, 22, 16, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildRoundedFlapShape() {
  const hw = ENV_W * 0.5;
  const s = new THREE.Shape();
  s.moveTo(-hw, 0);
  s.lineTo(hw, 0);
  // Graceful rounded oval-pointed tongue matching reference envelope flap
  s.bezierCurveTo(hw * 0.88, -FLAP_DROP * 0.42, hw * 0.42, -FLAP_DROP * 0.94, 0, -FLAP_DROP);
  s.bezierCurveTo(-hw * 0.42, -FLAP_DROP * 0.94, -hw * 0.88, -FLAP_DROP * 0.42, -hw, 0);
  return s;
}

function buildPocketShape() {
  const hw = ENV_W * 0.5;
  const hh = ENV_H * 0.5;
  // Deep V opening down to y = +0.08 so the tucked card front cover shows dramatically
  const dip = 0.08;
  const s = new THREE.Shape();
  s.moveTo(-hw, hh);
  s.lineTo(0, dip);
  s.lineTo(hw, hh);
  s.lineTo(hw, -hh);
  s.lineTo(-hw, -hh);
  s.closePath();
  return s;
}

function normalizeShapeUVs(geom, minX, maxX, minY, maxY) {
  const pos = geom.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const w = maxX - minX;
  const h = maxY - minY;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uv[i * 2] = (x - minX) / w;
    uv[i * 2 + 1] = (y - minY) / h;
  }
  geom.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

function createWaxHalfShape(side) {
  const s = new THREE.Shape();
  const steps = 32;
  const baseR = 0.35;
  // Slightly jagged fracture line down the center so cracked halves look organic
  const seamPts = [
    [0, baseR],
    [side * 0.012, baseR * 0.55],
    [-side * 0.015, baseR * 0.12],
    [side * 0.018, -baseR * 0.28],
    [-side * 0.01, -baseR * 0.65],
    [0, -baseR],
  ];
  s.moveTo(seamPts[0][0], seamPts[0][1]);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = Math.PI * 0.5 + (side === -1 ? t * Math.PI : -t * Math.PI);
    const wave =
      Math.sin(ang * 5 + 0.7) * 0.026 +
      Math.cos(ang * 3 - 0.5) * 0.020 +
      Math.sin(ang * 9) * 0.009;
    const r = baseR + wave;
    s.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
  }
  for (let k = seamPts.length - 1; k >= 0; k--) {
    s.lineTo(seamPts[k][0], seamPts[k][1]);
  }
  return s;
}

function createHalfStarCrestShape(side) {
  // Split 8-point star crest cleanly into left (x <= 0) or right (x >= 0) half
  const s = new THREE.Shape();
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const ang = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 4 === 0 ? 0.145 : i % 4 === 2 ? 0.095 : 0.036;
    pts.push([Math.cos(ang) * r, Math.sin(ang) * r]);
  }
  const filtered = pts.filter(([x]) => (side === -1 ? x <= 0.004 : x >= -0.004));
  s.moveTo(0, 0.145);
  for (const [x, y] of filtered) {
    s.lineTo(x, y);
  }
  s.lineTo(0, -0.145);
  s.closePath();
  return s;
}

class WaxSeal3D {
  constructor() {
    this.group = new THREE.Group();
    this.waxMat = new THREE.MeshPhysicalMaterial({
      color: 0xae1f16,
      roughness: 0.21,
      metalness: 0.05,
      clearcoat: 0.92,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 1,
    });
    this.recessMat = new THREE.MeshPhysicalMaterial({
      color: 0x921611,
      roughness: 0.30,
      metalness: 0.04,
      clearcoat: 0.72,
      clearcoatRoughness: 0.18,
      transparent: true,
      opacity: 1,
    });

    this.leftHalf = this._buildHalf(-1);
    this.rightHalf = this._buildHalf(1);
    this.group.add(this.leftHalf, this.rightHalf);

    this.crackAmount = 0;
    this.targetCrack = 0;
  }

  _buildHalf(side) {
    const half = new THREE.Group();
    const waxGeom = new THREE.ExtrudeGeometry(createWaxHalfShape(side), {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.024,
      bevelSegments: 4,
    });
    const waxMesh = new THREE.Mesh(waxGeom, this.waxMat);
    half.add(waxMesh);

    const ringGeom = new THREE.RingGeometry(0.185, 0.228, 28, 1, side === -1 ? Math.PI * 0.5 : -Math.PI * 0.5, Math.PI);
    const ringMesh = new THREE.Mesh(ringGeom, this.recessMat);
    ringMesh.position.z = 0.068;
    half.add(ringMesh);

    const starGeom = new THREE.ExtrudeGeometry(createHalfStarCrestShape(side), {
      depth: 0.015,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
    });
    const starMesh = new THREE.Mesh(starGeom, this.waxMat);
    starMesh.position.z = 0.064;
    half.add(starMesh);

    return half;
  }

  setOpacity(op) {
    this.waxMat.opacity = op;
    this.recessMat.opacity = op;
  }

  reset() {
    this.crackAmount = 0;
    this.targetCrack = 0;
    this.setOpacity(1);
    this.leftHalf.position.set(0, 0, 0);
    this.leftHalf.rotation.set(0, 0, 0);
    this.rightHalf.position.set(0, 0, 0);
    this.rightHalf.rotation.set(0, 0, 0);
    this.group.scale.setScalar(1);
  }

  update(dt) {
    this.crackAmount += (this.targetCrack - this.crackAmount) * Math.min(1, dt * 11);
    if (this.crackAmount > 0.002) {
      const t = this.crackAmount;
      this.leftHalf.position.set(-0.085 * t, -0.025 * t, 0.02 * t);
      this.leftHalf.rotation.set(0, -0.14 * t, 0.16 * t);
      this.rightHalf.position.set(0.085 * t, 0.020 * t, 0.02 * t);
      this.rightHalf.rotation.set(0, 0.14 * t, -0.16 * t);
    }
  }
}
class Envelope3D {
  constructor() {
    this.group = new THREE.Group();
    this.flapAmount = 0; // 0 = closed, 1 = open wide behind card
    this.targetFlap = 0;
    this.sealStampAnim = 0;

    this._buildMeshes();
    this._loadTextures();
  }

  _buildMeshes() {
    const frontTex = createEnvelopeFrontTexture();
    const flapTex = createFlapOuterTexture();

    this._paperOuterMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.9,
      metalness: 0.0,
      normalScale: new THREE.Vector2(1.15, 1.15),
    });

    this._flapOuterMat = new THREE.MeshStandardMaterial({
      map: flapTex,
      roughness: 0.9,
      metalness: 0.0,
      normalScale: new THREE.Vector2(1.15, 1.15),
      side: THREE.FrontSide,
    });

    this._liningMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.85,
      metalness: 0.12,
      side: THREE.FrontSide,
    });

    // Subtle soft shadow behind envelope
    const shadowGeom = new THREE.PlaneGeometry(ENV_W * 1.38, ENV_H * 1.24);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createEnvelopeShadowTexture(),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    this.shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    this.shadowMesh.position.set(0, -0.12, -0.14);
    this.group.add(this.shadowMesh);

    // 1. Back wall (crimson lining faces +Z inside pocket; ivory faces -Z)
    const backGeom = new THREE.PlaneGeometry(ENV_W, ENV_H);
    this.backLining = new THREE.Mesh(backGeom, this._liningMat);
    this.backLining.position.set(0, 0, -0.065);
    this.group.add(this.backLining);

    const backExterior = new THREE.Mesh(backGeom, this._paperOuterMat);
    backExterior.position.set(0, 0, -0.068);
    backExterior.rotation.y = Math.PI;
    this.group.add(backExterior);

    // 2. Front pocket wall with deep V-notch opening (sits at z = +0.072, card slides at z = -0.012)
    const pocketShape = buildPocketShape();
    const pocketGeom = new THREE.ShapeGeometry(pocketShape);
    normalizeShapeUVs(pocketGeom, -ENV_W * 0.5, ENV_W * 0.5, -ENV_H * 0.5, ENV_H * 0.5);
    this.frontPocket = new THREE.Mesh(pocketGeom, this._paperOuterMat);
    this.frontPocket.position.set(0, 0, 0.072);
    this.group.add(this.frontPocket);

    const pocketInner = new THREE.Mesh(pocketGeom, this._liningMat);
    pocketInner.position.set(0, 0, 0.068);
    pocketInner.rotation.y = Math.PI;
    this.group.add(pocketInner);

    // 3. Top sealing flap hinged at top edge (y = +ENV_H / 2)
    this.flapHinge = new THREE.Group();
    this.flapHinge.position.set(0, ENV_H * 0.5, 0.082);
    this.group.add(this.flapHinge);

    const flapShape = buildRoundedFlapShape();
    const flapOuterGeom = new THREE.ShapeGeometry(flapShape, 28);
    normalizeShapeUVs(flapOuterGeom, -ENV_W * 0.5, ENV_W * 0.5, -FLAP_DROP, 0);
    this.flapOuter = new THREE.Mesh(flapOuterGeom, this._flapOuterMat);
    this.flapHinge.add(this.flapOuter);

    const flapInnerGeom = flapOuterGeom.clone();
    this.flapInner = new THREE.Mesh(flapInnerGeom, this._liningMat);
    this.flapInner.position.z = -0.004;
    this.flapInner.rotation.y = Math.PI;
    this.flapHinge.add(this.flapInner);

    // 4. Wax seal positioned cleanly near curved flap tip (y = +0.08)
    this.waxSeal = new WaxSeal3D();
    this.waxSeal.group.position.set(0, 0.08, 0.094);
    this.group.add(this.waxSeal.group);
  }

  async _loadTextures() {
    const [wcNormal, liningTex] = await Promise.all([
      loadThreeTexture('/assets/textures/watercolor-normal.png', { srgb: false, repeat: true }),
      loadThreeTexture('/assets/textures/lining-crimson-stars.png', { srgb: true, repeat: true }),
    ]);

    if (wcNormal) {
      this._paperOuterMat.normalMap = wcNormal;
      this._paperOuterMat.needsUpdate = true;
      this._flapOuterMat.normalMap = wcNormal;
      this._flapOuterMat.needsUpdate = true;
    }

    if (liningTex) {
      liningTex.repeat.set(1.8, 2.4);
      this._liningMat.map = liningTex;
      this._liningMat.needsUpdate = true;
    }
  }

  setFlapOpen(open, immediate = false) {
    this.targetFlap = open ? 1 : 0;
    if (immediate) {
      this.flapAmount = this.targetFlap;
      this._applyFlap();
    }
  }

  setSealVisible(visible) {
    this.waxSeal.group.visible = visible;
  }

  triggerStampAnimation() {
    this.waxSeal.reset();
    this.waxSeal.group.visible = true;
    this.sealStampAnim = 1;
  }

  crackSeal() {
    this.waxSeal.targetCrack = 1;
  }

  _applyFlap() {
    // Rotate flap cleanly forward & up (-PI) while smoothly transitioning Z behind the card when open!
    this.flapHinge.rotation.x = -this.flapAmount * Math.PI;
    this.flapHinge.position.z = 0.082 - this.flapAmount * 0.136;
  }

  update(dt) {
    this.flapAmount += (this.targetFlap - this.flapAmount) * Math.min(1, dt * 6.5);
    this._applyFlap();

    if (this.sealStampAnim > 0) {
      this.sealStampAnim = Math.max(0, this.sealStampAnim - dt * 3.2);
      const t = 1 - this.sealStampAnim;
      const s = 1 + Math.sin(t * Math.PI) * 0.32 * (1 - t);
      this.waxSeal.group.scale.setScalar(s);
      this.waxSeal.group.position.z = 0.094 + Math.sin((1 - t) * Math.PI * 0.5) * 0.16;
    } else {
      this.waxSeal.group.scale.setScalar(1);
      this.waxSeal.group.position.z = 0.094;
    }

    this.waxSeal.update(dt);
  }

  getSealScreenPos(camera, rect) {
    const pt = new THREE.Vector3(0, 0.08, 0.112);
    this.group.updateMatrixWorld(true);
    pt.applyMatrix4(this.group.matrixWorld);
    pt.project(camera);
    return {
      x: (pt.x * 0.5 + 0.5) * rect.width,
      y: (-pt.y * 0.5 + 0.5) * rect.height,
    };
  }

  raycastWaxSeal(ndc, camera) {
    if (!this.waxSeal.group.visible) return false;
    const rc = new THREE.Raycaster();
    rc.setFromCamera(ndc, camera);
    const hits = rc.intersectObject(this.waxSeal.group, true);
    return hits.length > 0;
  }
}

return { ENV_W, ENV_H, Envelope3D };
})();

__APP_MODS__['js/views/homeView.js'] = (function() {
const THREE = __APP_MODS__['three'];
const {TEMPLATES,resolveAssetUrl} = __APP_MODS__['js/config.js'];
const {getStoredOutboxId} = __APP_MODS__['js/api.js'];
const {audioEngine} = __APP_MODS__['js/audio.js'];
const {SceneManager} = __APP_MODS__['js/three/sceneManager.js'];
const {BiFoldCard3D} = __APP_MODS__['js/three/card3d.js'];

const ICONS = {
  bookOpen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  pen: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  up: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  down: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  closeup: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6M8 11h6"/></svg>`,
};
function mountHomeView(root, { navigate }) {
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

return { mountHomeView };
})();

__APP_MODS__['js/views/editorView.js'] = (function() {
const THREE = __APP_MODS__['three'];
const {FONTS,PAPERS,PRESET_MUSIC,PRESET_WISHES,RED_PACKET_AMOUNTS,STICKERS,TEMPLATES,createDefaultRedPacket,getFont,getStickerMeta,getTemplate,resolveAssetUrl} = __APP_MODS__['js/config.js'];
const {buildShareUrl,createLetter,fetchLetter,getStoredOutboxId,uploadAudio} = __APP_MODS__['js/api.js'];
const {audioEngine} = __APP_MODS__['js/audio.js'];
const {openRedPacketModal} = __APP_MODS__['js/components/redPacketModal.js'];
const {SceneManager} = __APP_MODS__['js/three/sceneManager.js'];
const {BiFoldCard3D,PAGE_H,PAGE_W} = __APP_MODS__['js/three/card3d.js'];
const {Envelope3D} = __APP_MODS__['js/three/envelope3d.js'];
const {RED_PACKET_SLOT,getTextSlotBounds} = __APP_MODS__['js/three/textures.js'];

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
function mountEditorView(root, { navigate, showToast, query }) {
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

return { mountEditorView };
})();

__APP_MODS__['js/views/letterView.js'] = (function() {
const {PRESET_MUSIC,getTemplate,resolveAssetUrl} = __APP_MODS__['js/config.js'];
const {fetchLetter,markLetterOpened} = __APP_MODS__['js/api.js'];
const {audioEngine} = __APP_MODS__['js/audio.js'];
const {openRedPacketModal} = __APP_MODS__['js/components/redPacketModal.js'];
const {SceneManager} = __APP_MODS__['js/three/sceneManager.js'];
const {BiFoldCard3D} = __APP_MODS__['js/three/card3d.js'];
const {Envelope3D} = __APP_MODS__['js/three/envelope3d.js'];
const {RED_PACKET_SLOT} = __APP_MODS__['js/three/textures.js'];

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
function mountLetterView(root, { letterId, sharedPayload = null, navigate, showToast }) {
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

return { mountLetterView };
})();

__APP_MODS__['js/views/outboxView.js'] = (function() {
const {getTemplate,resolveAssetUrl} = __APP_MODS__['js/config.js'];
const {buildShareUrl,fetchOutbox} = __APP_MODS__['js/api.js'];

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
function mountOutboxView(root, { outboxId, navigate, showToast }) {
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

return { mountOutboxView };
})();

__APP_MODS__['js/main.js'] = (function() {
const {resolveAssetUrl} = __APP_MODS__['js/config.js'];
const {decodeSharePayload,isStandaloneMode} = __APP_MODS__['js/api.js'];
const {mountHomeView} = __APP_MODS__['js/views/homeView.js'];
const {mountEditorView} = __APP_MODS__['js/views/editorView.js'];
const {mountLetterView} = __APP_MODS__['js/views/letterView.js'];
const {mountOutboxView} = __APP_MODS__['js/views/outboxView.js'];

const appEl = document.getElementById('app');
const loadingEl = document.getElementById('site-loading');
const toastContainer = document.getElementById('toast-container');

let currentCleanup = null;
function showToast(message) {
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
function navigate(url) {
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

return { showToast, navigate };
})();
