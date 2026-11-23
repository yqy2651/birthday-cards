const OUTBOX_KEY = 'birthday_cards_outbox_id';
const LOCAL_LETTERS_KEY = 'birthday_cards_local_letters';

export function isStandaloneMode() {
  return (
    typeof window !== 'undefined' &&
    (window.location.protocol === 'file:' || Boolean(window.__STANDALONE_BUNDLE__))
  );
}

export function getStoredOutboxId() {
  try {
    return localStorage.getItem(OUTBOX_KEY) || null;
  } catch {
    return null;
  }
}

export function setStoredOutboxId(id) {
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

export function encodeSharePayload(record) {
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

export function decodeSharePayload(token) {
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

export function buildShareUrl(result) {
  if (!result) return '';
  if (isStandaloneMode() || result.offline) {
    const base = window.location.href.split('#')[0];
    const token = result.payload ? encodeSharePayload(result.payload) : '';
    return token ? `${base}#/share/${token}` : `${base}#/letter/${result.id}`;
  }
  return `${window.location.origin}/letter/${result.id}`;
}

export async function createLetter(payload) {
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

export async function fetchLetter(id) {
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

export async function markLetterOpened(id) {
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

export async function fetchOutbox(outboxId) {
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

export async function uploadAudio(file) {
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
