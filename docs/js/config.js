export function resolveAssetUrl(url) {
  if (!url) return url;
  if (typeof window !== 'undefined' && window.__INLINE_ASSETS__ && window.__INLINE_ASSETS__[url]) {
    return window.__INLINE_ASSETS__[url];
  }
  return url;
}

export const CARD_LAYERS = {
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

export const TEMPLATES = [
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

export const PAPERS = {
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

export const STICKERS = [
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

export const FONTS = [
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

export const PRESET_WISHES = [
  '生日快乐，愿你永远被温柔与星光包围。',
  'Happy Birthday! Wishing you warmth, joy, and bright surprises.',
  '岁岁常欢愉，万事皆胜意，祝你生日快乐！',
  '愿这一岁的每一天，都闪耀着你喜欢的模样。',
];

export const PRESET_MUSIC = [
  { id: 'musicbox-birthday', name: '八音盒 · 生日快乐' },
  { id: 'piano-starlight', name: '轻柔八音盒 · 星光许愿' },
];

export const RED_PACKET_AMOUNTS = ['66.66', '88.88', '188.00', '520.00'];

export function createDefaultRedPacket() {
  return {
    enabled: false,
    wish: '生日快乐，大吉大利！',
    amount: '88.88',
    claimCode: '',
  };
}

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

export function getPaper(id) {
  return PAPERS[id] || PAPERS.watercolor;
}

export function getFont(id) {
  return FONTS.find((f) => f.id === id) || FONTS[1];
}

export function getStickerMeta(id) {
  return STICKERS.find((s) => s.id === id) || STICKERS[0];
}
