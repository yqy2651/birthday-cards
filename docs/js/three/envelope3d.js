import * as THREE from 'three';
import { loadThreeTexture } from './textures.js';

export const ENV_W = 2.98;
export const ENV_H = 3.94;
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

export class Envelope3D {
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
