import * as THREE from 'three';
import { getPaper, getTemplate } from '../config.js';
import { CoverEffects3D } from './coverEffects3d.js';
import {
  getTextSlotBounds,
  INSIDE_H,
  INSIDE_W,
  loadFoilMaps,
  loadThreeTexture,
  renderBackCoverCanvas,
  renderInsideLeftCanvas,
  renderInsideRightCanvas,
} from './textures.js';

export const PAGE_W = 2.6;
export const PAGE_H = 3.6;
export const CARD_THICK = 0.022;

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

export class BiFoldCard3D {
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
