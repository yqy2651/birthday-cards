import * as THREE from 'three';
import { CARD_LAYERS, getTemplate } from '../config.js';
import { loadFoilMaps, loadThreeTexture } from './textures.js';

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

export class CoverEffects3D {
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
