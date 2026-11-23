import * as THREE from 'three';

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

export class SceneManager {
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
