// ============================================================================
// CAR ADVENTURE WORLD 3D - MASTER GAME ENGINE & THREE.JS CONTROLLER
// ============================================================================

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // AUDIO SYNTHESIZER (Pure Web Audio API - Zero External Dependencies)
  // --------------------------------------------------------------------------
  class SoundSystem {
    constructor() {
      this.ctx = null;
      this.engineOsc = null;
      this.engineGain = null;
      this.engineFilter = null;
      this.engineVol = 0.7;
      this.sfxVol = 0.8;
      this.isPlayingEngine = false;
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      } catch (e) {
        console.warn('Web Audio not supported');
      }
    }

    startEngine() {
      if (!this.ctx || this.isPlayingEngine) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      try {
        this.engineOsc = this.ctx.createOscillator();
        this.engineOsc.type = 'sawtooth';
        this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

        this.engineFilter = this.ctx.createBiquadFilter();
        this.engineFilter.type = 'lowpass';
        this.engineFilter.frequency.setValueAtTime(260, this.ctx.currentTime);

        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.setValueAtTime(0.08 * this.engineVol, this.ctx.currentTime);

        this.engineOsc.connect(this.engineFilter);
        this.engineFilter.connect(this.engineGain);
        this.engineGain.connect(this.ctx.destination);

        this.engineOsc.start();
        this.isPlayingEngine = true;
      } catch (e) {
        console.warn('Engine sound error', e);
      }
    }

    stopEngine() {
      if (!this.isPlayingEngine) return;
      try {
        if (this.engineOsc) {
          this.engineOsc.stop();
          this.engineOsc.disconnect();
          this.engineOsc = null;
        }
        this.isPlayingEngine = false;
      } catch (e) {}
    }

    updateEngine(speedKmH, maxSpeed, isAccelerating) {
      if (!this.ctx || !this.isPlayingEngine || !this.engineOsc) return;
      const ratio = Math.min(1.0, Math.max(0.0, Math.abs(speedKmH) / maxSpeed));
      const targetFreq = 42 + ratio * 140 + (isAccelerating ? 25 : 0);
      const targetFilter = 220 + ratio * 600 + (isAccelerating ? 150 : 0);
      const targetVol = (0.05 + ratio * 0.12 + (isAccelerating ? 0.05 : 0)) * this.engineVol;

      const now = this.ctx.currentTime;
      this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
      this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.08);
      this.engineGain.gain.setTargetAtTime(targetVol, now, 0.08);
    }

    playCoinChime() {
      if (!this.ctx || this.sfxVol <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.2 * this.sfxVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } catch (e) {}
    }

    playHorn() {
      if (!this.ctx || this.sfxVol <= 0) return;
      try {
        const now = this.ctx.currentTime;
        [440, 554.37].forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.25 * this.sfxVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        });
      } catch (e) {}
    }

    playNitroBlast() {
      if (!this.ctx || this.sfxVol <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.4);
        gain.gain.setValueAtTime(0.22 * this.sfxVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
      } catch (e) {}
    }

    playCrash() {
      if (!this.ctx || this.sfxVol <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.35 * this.sfxVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } catch (e) {}
    }

    playVictory() {
      if (!this.ctx || this.sfxVol <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.2 * this.sfxVol, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.42);
        });
      } catch (e) {}
    }
  }

  // --------------------------------------------------------------------------
  // PERSISTENT STORAGE MANAGER (localStorage)
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'car_adventure_world_3d_save_v1';

  class StorageManager {
    static getDefaultData() {
      return {
        coins: 100,
        unlockedCars: ['beetle'],
        selectedCar: 'beetle',
        carPaints: {
          beetle: '#ffcc00',
          roadster: '#ff3b30',
          monster: '#34c759',
          muscle: '#ff9500',
          cyber: '#af52de',
          camper: '#00c7be'
        },
        carUpgrades: {
          beetle: { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 },
          roadster: { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 },
          monster: { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 },
          muscle: { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 },
          cyber: { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 },
          camper: { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 }
        },
        levelStars: { 1: 0 },
        highestUnlockedLevel: 1,
        engineVol: 70,
        sfxVol: 80,
        graphicsQuality: 'medium'
      };
    }

    static load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return StorageManager.getDefaultData();
        const parsed = JSON.parse(raw);
        return Object.assign(StorageManager.getDefaultData(), parsed);
      } catch (e) {
        console.warn('Failed to load localStorage', e);
        return StorageManager.getDefaultData();
      }
    }

    static save(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        if (window.AndroidFirebase && typeof window.AndroidFirebase.saveProgress === 'function') {
          window.AndroidFirebase.saveProgress(JSON.stringify(data));
        }
      } catch (e) {
        console.warn('Failed to save localStorage', e);
      }
    }
  }

  // --------------------------------------------------------------------------
  // INPUT CONTROLLER (Desktop Keyboard + Mobile Touch)
  // --------------------------------------------------------------------------
  class InputController {
    constructor() {
      this.gas = false;
      this.brake = false;
      this.steerLeft = false;
      this.steerRight = false;
      this.nitro = false;
      this.horn = false;
      this.steerValue = 0; // -1 (left) to +1 (right)

      this.setupKeyboard();
      this.setupTouch();
    }

    setupKeyboard() {
      window.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        switch (e.code) {
          case 'KeyW':
          case 'ArrowUp':
            this.gas = true;
            break;
          case 'KeyS':
          case 'ArrowDown':
            this.brake = true;
            break;
          case 'KeyA':
          case 'ArrowLeft':
            this.steerLeft = true;
            break;
          case 'KeyD':
          case 'ArrowRight':
            this.steerRight = true;
            break;
          case 'ShiftLeft':
          case 'ShiftRight':
          case 'KeyN':
            this.nitro = true;
            break;
          case 'KeyH':
            this.horn = true;
            if (window.gameInstance) window.gameInstance.sound.playHorn();
            break;
          case 'KeyC':
            if (window.gameInstance) window.gameInstance.cycleCamera();
            break;
          case 'KeyL':
            if (window.gameInstance) window.gameInstance.toggleLights();
            break;
          case 'KeyP':
          case 'Escape':
            if (window.gameInstance) window.gameInstance.togglePause();
            break;
          case 'KeyR':
            if (window.gameInstance && window.gameInstance.isPlaying) window.gameInstance.respawnCar();
            break;
        }
      });

      window.addEventListener('keyup', (e) => {
        switch (e.code) {
          case 'KeyW':
          case 'ArrowUp':
            this.gas = false;
            break;
          case 'KeyS':
          case 'ArrowDown':
            this.brake = false;
            break;
          case 'KeyA':
          case 'ArrowLeft':
            this.steerLeft = false;
            break;
          case 'KeyD':
          case 'ArrowRight':
            this.steerRight = false;
            break;
          case 'ShiftLeft':
          case 'ShiftRight':
          case 'KeyN':
            this.nitro = false;
            break;
          case 'KeyH':
            this.horn = false;
            break;
        }
      });
    }

    setupTouch() {
      const bindBtn = (id, onDown, onUp) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        const start = (e) => {
          e.preventDefault();
          btn.classList.add('active');
          if (window.gameInstance && window.gameInstance.sound) {
            window.gameInstance.sound.init();
          }
          onDown();
        };

        const end = (e) => {
          e.preventDefault();
          btn.classList.remove('active');
          onUp();
        };

        btn.addEventListener('touchstart', start, { passive: false });
        btn.addEventListener('touchend', end, { passive: false });
        btn.addEventListener('touchcancel', end, { passive: false });
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
        btn.addEventListener('mouseleave', end);
      };

      bindBtn('btn-steer-left', () => { this.steerLeft = true; }, () => { this.steerLeft = false; });
      bindBtn('btn-steer-right', () => { this.steerRight = true; }, () => { this.steerRight = false; });
      bindBtn('btn-gas', () => { this.gas = true; }, () => { this.gas = false; });
      bindBtn('btn-brake', () => { this.brake = true; }, () => { this.brake = false; });
      bindBtn('btn-nitro', () => { this.nitro = true; }, () => { this.nitro = false; });
      bindBtn('btn-horn', () => {
        this.horn = true;
        if (window.gameInstance) window.gameInstance.sound.playHorn();
      }, () => { this.horn = false; });
    }

    update(delta) {
      let targetSteer = 0;
      if (this.steerLeft) targetSteer -= 1;
      if (this.steerRight) targetSteer += 1;

      // Smooth steering interpolation for responsiveness
      const steerSpeed = 6.0;
      this.steerValue += (targetSteer - this.steerValue) * Math.min(1.0, delta * steerSpeed);
    }
  }

  // --------------------------------------------------------------------------
  // MAIN GAME CLASS
  // --------------------------------------------------------------------------
  class CarAdventureGame {
    constructor() {
      this.data = StorageManager.load();
      this.sound = new SoundSystem();
      this.sound.engineVol = this.data.engineVol / 100;
      this.sound.sfxVol = this.data.sfxVol / 100;
      this.input = new InputController();

      this.container = document.getElementById('game-container');
      this.canvas = document.getElementById('three-canvas');

      // State flags
      this.isPlaying = false;
      this.isPaused = false;
      this.currentLevelIndex = this.data.highestUnlockedLevel || 1;
      this.currentLevel = null;
      this.cameraMode = 0; // 0: 3rd person, 1: Cockpit/1st person, 2: Top-down

      // Gameplay variables
      this.playerPos = new THREE.Vector3(0, 0, 0);
      this.playerRot = 0; // Heading in radians
      this.playerSpeed = 0; // Current speed (m/s)
      this.playerMaxSpeed = 24;
      this.playerAccel = 18;
      this.playerHandling = 2.8;
      this.playerNitroMult = 1.45;
      this.nitroLevel = 100;
      this.health = 100;
      this.coinsCollectedThisRun = 0;
      this.timeRemaining = 60;
      this.passengerPickedUp = false;
      this.passengerDroppedOff = false;
      this.fuelRemaining = 100;
      this.racePosition = 1;

      // Suspension & dynamics simulation
      this.suspensionPitch = 0;
      this.suspensionRoll = 0;
      this.suspensionBounce = 0;
      this.verticalVelocity = 0;
      this.isGrounded = true;

      // Three.js Core
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.sunLight = null;
      this.ambientLight = null;
      this.carInstance = null;

      // Track & Objects
      this.trackWaypoints = [];
      this.trackLength = 500;
      this.trackMeshes = [];
      this.coins = [];
      this.obstacles = [];
      this.trafficCars = [];
      this.rivalCars = [];
      this.animatedAnimals = [];
      this.props = [];
      this.passengerObject = null;
      this.passengerStopMesh = null;
      this.dropoffMesh = null;

      // Garage Turntable Scene
      this.garageScene = null;
      this.garageCamera = null;
      this.garageRenderer = null;
      this.garageCarGroup = null;
      this.garageCarConfigIndex = 0;

      // Clock
      this.clock = new THREE.Clock();

      this.initThree();
      this.initUI();
      this.initGarageScene();

      window.gameInstance = this;

      // Start render loop
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    // ------------------------------------------------------------------------
    // THREE.JS SETUP
    // ------------------------------------------------------------------------
    initThree() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87ceeb);
      this.scene.fog = new THREE.FogExp2(0xb0e0e6, 0.0035);

      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(62, aspect, 0.2, 800);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: this.data.graphicsQuality !== 'low',
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.05;

      if (this.data.graphicsQuality === 'high') {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      // Lights
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
      this.scene.add(this.ambientLight);

      this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.2);
      this.sunLight.position.set(60, 100, 60);
      if (this.data.graphicsQuality === 'high') {
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 1024;
        this.sunLight.shadow.mapSize.height = 1024;
        this.sunLight.shadow.camera.near = 10;
        this.sunLight.shadow.camera.far = 250;
        const d = 45;
        this.sunLight.shadow.camera.left = -d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = -d;
      }
      this.scene.add(this.sunLight);

      window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      });
    }

    // ------------------------------------------------------------------------
    // UI BINDINGS & SCREEN MANAGEMENT
    // ------------------------------------------------------------------------
    initUI() {
      // Main Menu Buttons
      document.getElementById('btn-menu-play').addEventListener('click', () => {
        this.sound.init();
        this.startLevel(this.data.highestUnlockedLevel || 1);
      });

      document.getElementById('btn-menu-garage').addEventListener('click', () => {
        this.sound.init();
        this.openGarage();
      });

      document.getElementById('btn-menu-levels').addEventListener('click', () => {
        this.sound.init();
        this.openLevelSelect();
      });

      document.getElementById('btn-menu-settings').addEventListener('click', () => {
        this.sound.init();
        this.openSettings();
      });

      // Quick in-game buttons
      document.getElementById('btn-camera').addEventListener('click', () => this.cycleCamera());
      document.getElementById('btn-lights').addEventListener('click', () => this.toggleLights());
      document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
      document.getElementById('btn-fullscreen').addEventListener('click', () => this.toggleFullscreen());

      // Pause Menu Buttons
      document.getElementById('btn-pause-resume').addEventListener('click', () => this.togglePause());
      document.getElementById('btn-pause-restart').addEventListener('click', () => {
        this.hideAllModals();
        this.startLevel(this.currentLevelIndex);
      });
      document.getElementById('btn-pause-levels').addEventListener('click', () => {
        this.hideAllModals();
        this.openLevelSelect();
      });
      document.getElementById('btn-pause-garage').addEventListener('click', () => {
        this.hideAllModals();
        this.openGarage();
      });
      document.getElementById('btn-pause-menu').addEventListener('click', () => {
        this.hideAllModals();
        this.openMainMenu();
      });

      // Victory Buttons
      document.getElementById('btn-vic-next').addEventListener('click', () => {
        this.hideAllModals();
        const next = Math.min(100, this.currentLevelIndex + 1);
        this.startLevel(next);
      });
      document.getElementById('btn-vic-replay').addEventListener('click', () => {
        this.hideAllModals();
        this.startLevel(this.currentLevelIndex);
      });
      document.getElementById('btn-vic-garage').addEventListener('click', () => {
        this.hideAllModals();
        this.openGarage();
      });

      // Fail Buttons
      document.getElementById('btn-fail-retry').addEventListener('click', () => {
        this.hideAllModals();
        this.startLevel(this.currentLevelIndex);
      });
      document.getElementById('btn-fail-garage').addEventListener('click', () => {
        this.hideAllModals();
        this.openGarage();
      });
      document.getElementById('btn-fail-menu').addEventListener('click', () => {
        this.hideAllModals();
        this.openMainMenu();
      });

      // Dialog Close Buttons
      document.getElementById('btn-close-levels').addEventListener('click', () => {
        this.hideAllModals();
        if (!this.isPlaying) this.openMainMenu();
      });
      document.getElementById('btn-close-garage').addEventListener('click', () => {
        this.hideAllModals();
        if (!this.isPlaying) this.openMainMenu();
      });
      document.getElementById('btn-close-settings').addEventListener('click', () => {
        this.hideAllModals();
        if (!this.isPlaying) this.openMainMenu();
      });

      // Settings sliders
      document.getElementById('setting-engine-vol').addEventListener('input', (e) => {
        this.data.engineVol = parseInt(e.target.value);
        this.sound.engineVol = this.data.engineVol / 100;
        StorageManager.save(this.data);
      });

      document.getElementById('setting-sfx-vol').addEventListener('input', (e) => {
        this.data.sfxVol = parseInt(e.target.value);
        this.sound.sfxVol = this.data.sfxVol / 100;
        StorageManager.save(this.data);
      });

      document.getElementById('setting-graphics').addEventListener('change', (e) => {
        this.data.graphicsQuality = e.target.value;
        StorageManager.save(this.data);
      });

      document.getElementById('btn-reset-save').addEventListener('click', () => {
        if (confirm('Reset all car adventure progress?')) {
          localStorage.removeItem(STORAGE_KEY);
          this.data = StorageManager.getDefaultData();
          StorageManager.save(this.data);
          this.updateMenuHUD();
          alert('Progress reset!');
        }
      });

      this.updateMenuHUD();
    }

    updateMenuHUD() {
      document.getElementById('menu-play-text').textContent = `PLAY LEVEL ${this.data.highestUnlockedLevel || 1}`;
      document.getElementById('menu-coin-count').textContent = this.data.coins;
      let totalStars = 0;
      Object.values(this.data.levelStars || {}).forEach((s) => { totalStars += (s || 0); });
      document.getElementById('menu-star-count').textContent = `${totalStars} / 300`;
    }

    hideAllModals() {
      document.querySelectorAll('.modal-screen').forEach((m) => m.classList.remove('active'));
    }

    openMainMenu() {
      this.isPlaying = false;
      this.sound.stopEngine();
      this.hideAllModals();
      document.getElementById('hud-overlay').classList.remove('active');
      document.getElementById('modal-main-menu').classList.add('active');
      this.updateMenuHUD();
    }

    openLevelSelect() {
      this.hideAllModals();
      document.getElementById('modal-level-select').classList.add('active');
      this.renderLevelSelectPage(1); // Page 1: 1-20
    }

    renderLevelSelectPage(pageIndex) {
      const tabsWrap = document.getElementById('level-pagination-tabs');
      tabsWrap.innerHTML = '';
      const totalPages = 5;

      for (let p = 1; p <= totalPages; p++) {
        const startLvl = (p - 1) * 20 + 1;
        const endLvl = p * 20;
        const tabBtn = document.createElement('button');
        tabBtn.className = `page-tab-btn ${p === pageIndex ? 'active' : ''}`;
        tabBtn.textContent = `Levels ${startLvl}-${endLvl}`;
        tabBtn.addEventListener('click', () => this.renderLevelSelectPage(p));
        tabsWrap.appendChild(tabBtn);
      }

      const gridWrap = document.getElementById('levels-grid-container');
      gridWrap.innerHTML = '';

      const startIdx = (pageIndex - 1) * 20 + 1;
      const endIdx = pageIndex * 20;

      for (let i = startIdx; i <= endIdx; i++) {
        const levelData = window.getLevel(i);
        const isUnlocked = i <= (this.data.highestUnlockedLevel || 1);
        const stars = this.data.levelStars[i] || 0;
        const envInfo = window.ENVIRONMENTS[levelData.environment];
        const missionInfo = window.MISSION_TYPES[levelData.missionType];

        const card = document.createElement('div');
        card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'}`;

        let starsHTML = '';
        for (let s = 1; s <= 3; s++) {
          starsHTML += `<span class="${s <= stars ? 'star-filled' : ''}">★</span>`;
        }

        card.innerHTML = `
          <div class="level-card-num">${isUnlocked ? `Level ${i}` : `🔒 ${i}`}</div>
          <div class="level-card-env">${envInfo ? envInfo.name.split(' ')[0] : 'Road'}</div>
          <div class="level-card-mission">${missionInfo ? missionInfo.icon + ' ' + missionInfo.name : 'Race'}</div>
          <div class="level-stars">${starsHTML}</div>
        `;

        if (isUnlocked) {
          card.addEventListener('click', () => {
            this.hideAllModals();
            this.startLevel(i);
          });
        }

        gridWrap.appendChild(card);
      }
    }

    openSettings() {
      this.hideAllModals();
      document.getElementById('modal-settings').classList.add('active');
      document.getElementById('setting-engine-vol').value = this.data.engineVol;
      document.getElementById('setting-sfx-vol').value = this.data.sfxVol;
      document.getElementById('setting-graphics').value = this.data.graphicsQuality;
    }

    togglePause() {
      if (!this.isPlaying) return;
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.sound.stopEngine();
        document.getElementById('modal-pause').classList.add('active');
      } else {
        this.sound.startEngine();
        document.getElementById('modal-pause').classList.remove('active');
      }
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }

    cycleCamera() {
      this.cameraMode = (this.cameraMode + 1) % 3;
    }

    toggleLights() {
      if (!this.carInstance || !this.carInstance.headlights) return;
      this.carInstance.headlights.forEach((l) => {
        l.visible = !l.visible;
      });
    }

    // ------------------------------------------------------------------------
    // GARAGE & TUNING TURNTABLE
    // ------------------------------------------------------------------------
    initGarageScene() {
      const gCanvas = document.getElementById('garage-canvas');
      this.garageScene = new THREE.Scene();
      this.garageScene.background = new THREE.Color(0x0f172a);

      const aspect = 1.3;
      this.garageCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      this.garageCamera.position.set(0, 2.5, 6.2);
      this.garageCamera.lookAt(0, 0.4, 0);

      this.garageRenderer = new THREE.WebGLRenderer({
        canvas: gCanvas,
        antialias: true
      });
      this.garageRenderer.setSize(480, 360);
      this.garageRenderer.toneMapping = THREE.ACESFilmicToneMapping;

      // Garage Lights
      const gAmb = new THREE.AmbientLight(0xffffff, 0.85);
      this.garageScene.add(gAmb);

      const gDir = new THREE.DirectionalLight(0xfffaed, 1.4);
      gDir.position.set(4, 8, 4);
      this.garageScene.add(gDir);

      const gRim = new THREE.DirectionalLight(0x00e5ff, 0.8);
      gRim.position.set(-5, 4, -4);
      this.garageScene.add(gRim);

      // Pedestal / Turntable Platform
      const platformGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.2, 32);
      const platformMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.3
      });
      const platform = new THREE.Mesh(platformGeo, platformMat);
      platform.position.y = -0.1;
      this.garageScene.add(platform);

      // Neon Ring on turntable
      const neonRingGeo = new THREE.TorusGeometry(2.45, 0.04, 8, 36);
      neonRingGeo.rotateX(Math.PI / 2);
      const neonRingMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
      const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
      neonRing.position.y = 0.02;
      this.garageScene.add(neonRing);

      this.garageCarGroup = new THREE.Group();
      this.garageScene.add(this.garageCarGroup);

      // Garage UI bindings
      document.getElementById('garage-prev-car').addEventListener('click', () => {
        this.garageCarConfigIndex = (this.garageCarConfigIndex - 1 + window.CAR_CONFIGS.length) % window.CAR_CONFIGS.length;
        this.updateGarageView();
      });

      document.getElementById('garage-next-car').addEventListener('click', () => {
        this.garageCarConfigIndex = (this.garageCarConfigIndex + 1) % window.CAR_CONFIGS.length;
        this.updateGarageView();
      });

      // Upgrades Buttons
      ['speed', 'accel', 'handling', 'nitro', 'susp'].forEach((statKey) => {
        document.getElementById(`btn-upgrade-${statKey}`).addEventListener('click', () => {
          this.upgradeCurrentCarStat(statKey);
        });
      });

      // Unlock Button
      document.getElementById('garage-unlock-btn').addEventListener('click', () => {
        this.unlockCurrentCar();
      });
    }

    openGarage() {
      this.hideAllModals();
      document.getElementById('modal-garage').classList.add('active');

      // Select active car in garage
      const currentId = this.data.selectedCar || 'beetle';
      const foundIdx = window.CAR_CONFIGS.findIndex((c) => c.id === currentId);
      this.garageCarConfigIndex = foundIdx >= 0 ? foundIdx : 0;

      this.updateGarageView();
    }

    updateGarageView() {
      document.getElementById('garage-coins-val').textContent = this.data.coins;
      const config = window.CAR_CONFIGS[this.garageCarConfigIndex];
      const isUnlocked = this.data.unlockedCars.includes(config.id);

      document.getElementById('garage-car-name').textContent = config.name;
      document.getElementById('garage-car-type').textContent = config.type;
      document.getElementById('garage-car-desc').textContent = config.desc;

      const unlockBtn = document.getElementById('garage-unlock-btn');
      if (!isUnlocked) {
        unlockBtn.style.display = 'block';
        unlockBtn.textContent = `UNLOCK FOR ${config.price} 🪙`;
      } else {
        unlockBtn.style.display = 'none';
        // Auto select car if unlocked
        this.data.selectedCar = config.id;
        StorageManager.save(this.data);
      }

      // Rebuild 3D preview model on turntable
      while (this.garageCarGroup.children.length > 0) {
        this.garageCarGroup.remove(this.garageCarGroup.children[0]);
      }

      const paintColor = this.data.carPaints[config.id] || config.baseColor;
      const previewCar = window.buildCarModel(config, paintColor);
      this.garageCarGroup.add(previewCar.root);

      // Update stat bars & upgrade buttons
      const currentUpgrades = this.data.carUpgrades[config.id] || { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 };

      const updateStatBar = (statKey, currentLvl, baseVal, maxVal) => {
        const lvlEl = document.getElementById(`stat-${statKey}-lvl`);
        const fillEl = document.getElementById(`stat-${statKey}-fill`);
        const btnEl = document.getElementById(`btn-upgrade-${statKey}`);

        lvlEl.textContent = `LVL ${currentLvl} / 5`;
        const percent = Math.min(100, Math.round(((currentLvl - 1) / 4) * 70 + 30));
        fillEl.style.width = `${percent}%`;

        const cost = 70 + currentLvl * 45;
        if (currentLvl >= 5) {
          btnEl.textContent = 'MAX LEVEL';
          btnEl.disabled = true;
          btnEl.style.opacity = '0.5';
        } else {
          btnEl.textContent = `UPGRADE (${cost} 🪙)`;
          btnEl.disabled = !isUnlocked || this.data.coins < cost;
          btnEl.style.opacity = isUnlocked && this.data.coins >= cost ? '1.0' : '0.6';
        }
      };

      updateStatBar('speed', currentUpgrades.speed, config.stats.speed, config.maxStats.speed);
      updateStatBar('accel', currentUpgrades.accel, config.stats.accel, config.maxStats.accel);
      updateStatBar('handling', currentUpgrades.handling, config.stats.handling, config.maxStats.handling);
      updateStatBar('nitro', currentUpgrades.nitro, config.stats.nitro, config.maxStats.nitro);
      updateStatBar('susp', currentUpgrades.susp, config.stats.suspension, config.maxStats.suspension);

      // Render paint swatches
      const swatchesWrap = document.getElementById('garage-paint-swatches');
      swatchesWrap.innerHTML = '';
      window.AVAILABLE_PAINTS.forEach((paint) => {
        const swatch = document.createElement('div');
        swatch.className = `paint-swatch ${paint.hex === paintColor ? 'active' : ''}`;
        swatch.style.backgroundColor = paint.hex;
        swatch.title = paint.name;
        swatch.addEventListener('click', () => {
          this.data.carPaints[config.id] = paint.hex;
          StorageManager.save(this.data);
          this.updateGarageView();
        });
        swatchesWrap.appendChild(swatch);
      });
    }

    unlockCurrentCar() {
      const config = window.CAR_CONFIGS[this.garageCarConfigIndex];
      if (this.data.coins >= config.price) {
        this.data.coins -= config.price;
        this.data.unlockedCars.push(config.id);
        this.data.selectedCar = config.id;
        StorageManager.save(this.data);
        this.sound.playVictory();
        this.updateGarageView();
      } else {
        alert('Not enough coins! Play adventure levels to earn more coins.');
      }
    }

    upgradeCurrentCarStat(statKey) {
      const config = window.CAR_CONFIGS[this.garageCarConfigIndex];
      const upgrades = this.data.carUpgrades[config.id] || { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 };
      const currentLvl = upgrades[statKey] || 1;
      const cost = 70 + currentLvl * 45;

      if (currentLvl < 5 && this.data.coins >= cost) {
        this.data.coins -= cost;
        upgrades[statKey] = currentLvl + 1;
        this.data.carUpgrades[config.id] = upgrades;
        StorageManager.save(this.data);
        this.sound.playCoinChime();
        this.updateGarageView();
      }
    }

    // ------------------------------------------------------------------------
    // LEVEL GENERATION & STARTING
    // ------------------------------------------------------------------------
    startLevel(levelNum) {
      this.currentLevelIndex = levelNum;
      this.currentLevel = window.getLevel(levelNum);

      this.hideAllModals();
      document.getElementById('hud-overlay').classList.add('active');

      // Clear past track entities
      this.clearTrackEntities();

      // Configure Environment Atmosphere
      const envInfo = window.ENVIRONMENTS[this.currentLevel.environment] || window.ENVIRONMENTS.city;
      this.scene.background.setHex(envInfo.skyColor);
      this.scene.fog.color.setHex(envInfo.fogColor);
      this.scene.fog.density = envInfo.fogDensity;

      this.ambientLight.color.setHex(envInfo.ambientLight);
      this.ambientLight.intensity = envInfo.ambientIntensity;
      this.sunLight.color.setHex(envInfo.sunLight);
      this.sunLight.intensity = envInfo.sunIntensity;
      this.sunLight.position.set(...envInfo.sunPos);

      // Build Road Waypoints & 3D Meshes
      this.buildRoadNetwork(this.currentLevel, envInfo);

      // Setup Player Car
      this.setupPlayerCar();

      // Reset Player State
      this.playerPos.set(0, 0, 0);
      this.playerRot = 0;
      this.playerSpeed = 0;
      this.nitroLevel = 100;
      this.health = 100;
      this.coinsCollectedThisRun = 0;
      this.timeRemaining = this.currentLevel.timeLimit;
      this.passengerPickedUp = false;
      this.passengerDroppedOff = false;
      this.fuelRemaining = 100;
      this.racePosition = 1;

      // Spawn Mission Entities & Obstacles
      this.spawnMissionEntities(this.currentLevel, envInfo);
      this.spawnObstaclesAndTraffic(this.currentLevel, envInfo);

      // Start gameplay
      this.isPlaying = true;
      this.isPaused = false;
      this.sound.startEngine();

      this.updateHUD(0);
    }

    clearTrackEntities() {
      const removeList = (list) => {
        list.forEach((item) => {
          const mesh = item.mesh || item;
          if (mesh && mesh.parent) mesh.parent.remove(mesh);
        });
        list.length = 0;
      };

      removeList(this.trackMeshes);
      removeList(this.coins);
      removeList(this.obstacles);
      removeList(this.trafficCars);
      removeList(this.rivalCars);
      removeList(this.animatedAnimals);
      removeList(this.props);

      if (this.carInstance && this.carInstance.root) {
        this.scene.remove(this.carInstance.root);
        this.carInstance = null;
      }
    }

    setupPlayerCar() {
      const selectedId = this.data.selectedCar || 'beetle';
      const config = window.CAR_CONFIGS.find((c) => c.id === selectedId) || window.CAR_CONFIGS[0];
      const paintColor = this.data.carPaints[selectedId] || config.baseColor;
      const upgrades = this.data.carUpgrades[selectedId] || { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 };

      // Calculate tuned stats
      const calcStat = (base, max, lvl) => base + (max - base) * ((lvl - 1) / 4);
      this.playerMaxSpeed = calcStat(config.stats.speed, config.maxStats.speed, upgrades.speed);
      this.playerAccel = calcStat(config.stats.accel, config.maxStats.accel, upgrades.accel);
      this.playerHandling = calcStat(config.stats.handling, config.maxStats.handling, upgrades.handling);
      this.playerNitroMult = 1.35 + (upgrades.nitro / 5) * 0.45;

      this.carInstance = window.buildCarModel(config, paintColor);
      this.scene.add(this.carInstance.root);
    }

    // ------------------------------------------------------------------------
    // PROCEDURAL ROAD & ENVIRONMENT GENERATION
    // ------------------------------------------------------------------------
    buildRoadNetwork(level, envInfo) {
      this.trackWaypoints = [];
      const totalLen = level.roadLength;
      this.trackLength = totalLen;
      const step = 15; // Point spacing
      const count = Math.ceil(totalLen / step);

      let currentX = 0;
      let currentZ = 0;
      let currentY = 0;

      // Seeded random for road curving
      let s = level.seed;
      const rng = () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };

      for (let i = 0; i <= count; i++) {
        const progress = i / count;
        // Winding curve math
        const curvePhase = progress * Math.PI * 6 * level.curvatureScale;
        const curveOffset = Math.sin(curvePhase) * (18 * level.curvatureScale) + Math.cos(progress * Math.PI * 3) * 12;

        // Elevation hills
        let hillY = 0;
        if (envInfo.isElevated) {
          hillY = 8; // Elevated flyover
        } else if (envInfo.isBridge) {
          hillY = Math.sin(progress * Math.PI) * 12 + 6;
        } else {
          hillY = Math.sin(progress * Math.PI * 4 * level.hillScale) * (6 * level.hillScale);
        }

        currentX = curveOffset;
        currentZ = i * step;
        currentY = hillY;

        this.trackWaypoints.push(new THREE.Vector3(currentX, currentY, currentZ));
      }

      // Generate Road Strip Ribbons
      const roadWidth = 9.0;
      const roadGeo = new THREE.BufferGeometry();
      const positions = [];
      const normals = [];
      const uvs = [];

      for (let i = 0; i < this.trackWaypoints.length - 1; i++) {
        const p1 = this.trackWaypoints[i];
        const p2 = this.trackWaypoints[i + 1];

        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        const side = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

        const halfW = roadWidth / 2;
        // 4 vertices of road quad
        const v1 = new THREE.Vector3().copy(p1).addScaledVector(side, -halfW);
        const v2 = new THREE.Vector3().copy(p1).addScaledVector(side, halfW);
        const v3 = new THREE.Vector3().copy(p2).addScaledVector(side, -halfW);
        const v4 = new THREE.Vector3().copy(p2).addScaledVector(side, halfW);

        // Two triangles (v1, v2, v3) and (v2, v4, v3)
        [v1, v2, v3, v2, v4, v3].forEach((v) => {
          positions.push(v.x, v.y + 0.04, v.z);
          normals.push(0, 1, 0);
        });

        uvs.push(0, i, 1, i, 0, i + 1, 1, i, 1, i + 1, 0, i + 1);
      }

      roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      roadGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

      const roadMat = new THREE.MeshStandardMaterial({
        color: envInfo.roadColor,
        roughness: 0.8,
        metalness: 0.1
      });
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.receiveShadow = true;
      this.scene.add(roadMesh);
      this.trackMeshes.push(roadMesh);

      // Dashed White Road Centerline
      for (let i = 0; i < this.trackWaypoints.length - 1; i += 2) {
        const p1 = this.trackWaypoints[i];
        const p2 = this.trackWaypoints[i + 1];
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();

        const stripeGeo = new THREE.BoxGeometry(0.35, 0.05, 5.0);
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(mid.x, mid.y + 0.08, mid.z);
        stripe.lookAt(p2.x, p2.y + 0.08, p2.z);
        this.scene.add(stripe);
        this.trackMeshes.push(stripe);
      }

      // Ground Terrain Base
      const terrainGeo = new THREE.PlaneGeometry(600, totalLen + 200, 32, 64);
      terrainGeo.rotateX(-Math.PI / 2);
      const terrainMat = new THREE.MeshStandardMaterial({
        color: envInfo.groundColor,
        roughness: 0.95,
        metalness: 0.05
      });
      const terrain = new THREE.Mesh(terrainGeo, terrainMat);
      terrain.position.set(0, -0.2, totalLen / 2);
      terrain.receiveShadow = true;
      this.scene.add(terrain);
      this.trackMeshes.push(terrain);

      // Water Plane if River / Bridge environment
      if (envInfo.hasWater) {
        const waterGeo = new THREE.PlaneGeometry(500, totalLen + 200);
        waterGeo.rotateX(-Math.PI / 2);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x00bcd4,
          transparent: true,
          opacity: 0.75,
          roughness: 0.1,
          metalness: 0.5
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.position.set(0, -0.8, totalLen / 2);
        this.scene.add(water);
        this.trackMeshes.push(water);
      }

      // Finish Line Gate at track end
      const finishPt = this.trackWaypoints[this.trackWaypoints.length - 1];
      const gateGroup = new THREE.Group();
      gateGroup.position.copy(finishPt);

      // Arch Posts
      [-5.2, 5.2].forEach((x) => {
        const postGeo = new THREE.CylinderGeometry(0.25, 0.25, 6, 8);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(x, 3, 0);
        gateGroup.add(post);
      });

      // Overhead Checkered Banner
      const bannerGeo = new THREE.BoxGeometry(11, 1.4, 0.3);
      const bannerMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
      const banner = new THREE.Mesh(bannerGeo, bannerMat);
      banner.position.set(0, 5.8, 0);
      gateGroup.add(banner);

      this.scene.add(gateGroup);
      this.trackMeshes.push(gateGroup);

      // Spawn Environment Props along track
      this.spawnEnvironmentProps(level, envInfo);
    }

    spawnEnvironmentProps(level, envInfo) {
      const propTypes = envInfo.props || [];
      const count = Math.floor(level.roadLength / 22);

      for (let i = 0; i < count; i++) {
        const wpIdx = Math.floor((i / count) * (this.trackWaypoints.length - 2)) + 1;
        const pt = this.trackWaypoints[wpIdx];
        const sideSign = i % 2 === 0 ? 1 : -1;
        const distFromRoad = 8 + (i % 5) * 4;
        const propType = propTypes[i % propTypes.length];

        const propMesh = this.createPropMesh(propType, envInfo);
        if (propMesh) {
          propMesh.position.set(pt.x + sideSign * distFromRoad, pt.y, pt.z + (i % 3) * 2);
          this.scene.add(propMesh);
          this.props.push(propMesh);
        }
      }
    }

    createPropMesh(type, envInfo) {
      const g = new THREE.Group();
      if (type === 'skyscraper') {
        const h = 25 + Math.random() * 35;
        const w = 10 + Math.random() * 8;
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, w),
          new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.3 })
        );
        b.position.y = h / 2;
        g.add(b);
      } else if (type === 'pine_tree' || type === 'snow_pine') {
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.4, 2.5, 6),
          new THREE.MeshStandardMaterial({ color: 0x5d4037 })
        );
        trunk.position.y = 1.25;
        g.add(trunk);

        const leavesMat = new THREE.MeshStandardMaterial({
          color: type === 'snow_pine' ? 0xe0f2f1 : 0x2e7d32
        });
        [3.0, 2.4, 1.8].forEach((r, idx) => {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(r, 2.2, 7), leavesMat);
          cone.position.y = 2.4 + idx * 1.5;
          g.add(cone);
        });
      } else if (type === 'saguaro_cactus') {
        const green = new THREE.MeshStandardMaterial({ color: 0x43a047 });
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 6, 8), green);
        stem.position.y = 3;
        g.add(stem);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.35), green);
        arm.position.set(0.5, 4.0, 0);
        g.add(arm);
      } else if (type === 'cottage') {
        const base = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), new THREE.MeshStandardMaterial({ color: 0xfff9c4 }));
        base.position.y = 2;
        g.add(base);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(4.8, 3, 4), new THREE.MeshStandardMaterial({ color: 0xb71c1c }));
        roof.rotation.y = Math.PI / 4;
        roof.position.y = 5.2;
        g.add(roof);
      } else {
        // Fallback friendly boulder/rock
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.6 + Math.random() * 1.2),
          new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.85 })
        );
        rock.position.y = 1.2;
        g.add(rock);
      }
      return g;
    }

    // ------------------------------------------------------------------------
    // MISSIONS & OBJECTIVES SETUP
    // ------------------------------------------------------------------------
    spawnMissionEntities(level, envInfo) {
      // 1. Coins Collection
      const totalCoins = level.totalCoins;
      const coinGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.14, 14);
      coinGeo.rotateZ(Math.PI / 2);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 0.35,
        metalness: 0.85,
        roughness: 0.2
      });

      for (let i = 0; i < totalCoins; i++) {
        const wpIdx = Math.floor((i / totalCoins) * (this.trackWaypoints.length - 2)) + 1;
        const pt = this.trackWaypoints[wpIdx];
        const laneOffset = ((i % 3) - 1) * 2.2; // -2.2, 0, +2.2

        const coin = new THREE.Mesh(coinGeo, coinMat);
        coin.position.set(pt.x + laneOffset, pt.y + 0.75, pt.z);
        this.scene.add(coin);
        this.coins.push({
          mesh: coin,
          collected: false,
          baseY: pt.y + 0.75,
          laneOffset: laneOffset,
          trackZ: pt.z
        });
      }

      // 2. Passenger Pickup Stop (for passenger_pickup missions)
      if (level.missionType === 'passenger_pickup') {
        const stopZ = level.passengerStopDist;
        const stopWp = this.getPointAtDistance(stopZ);

        // Highlight Stop Zone
        const zoneGeo = new THREE.BoxGeometry(8, 0.08, 12);
        const zoneMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b, transparent: true, opacity: 0.45 });
        this.passengerStopMesh = new THREE.Mesh(zoneGeo, zoneMat);
        this.passengerStopMesh.position.set(stopWp.x, stopWp.y + 0.05, stopWp.z);
        this.scene.add(this.passengerStopMesh);
        this.trackMeshes.push(this.passengerStopMesh);

        // Passenger Character standing on roadside waiting
        this.passengerObject = buildCartoonPassenger();
        this.passengerObject.position.set(stopWp.x + 3.8, stopWp.y + 0.1, stopWp.z);
        this.scene.add(this.passengerObject);
      }

      // 3. Rival Racers for Mountain Race
      if (level.missionType === 'mountain_race') {
        const rivalColors = ['#ff3b30', '#007aff', '#af52de'];
        for (let r = 0; r < level.rivalCount; r++) {
          const rivalConfig = window.CAR_CONFIGS[(r + 1) % window.CAR_CONFIGS.length];
          const rivalCar = window.buildCarModel(rivalConfig, rivalColors[r]);
          rivalCar.root.position.set(((r % 2 === 0 ? 1 : -1) * 2.2), 0, 8 + r * 10);
          this.scene.add(rivalCar.root);

          this.rivalCars.push({
            carData: rivalCar,
            speed: this.playerMaxSpeed * (0.82 + r * 0.06),
            dist: 8 + r * 10,
            lane: (r % 2 === 0 ? 1 : -1) * 2.0
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // OBSTACLES: Speed Breakers, Potholes, Rocks, Traffic, Animals
    // ------------------------------------------------------------------------
    spawnObstaclesAndTraffic(level, envInfo) {
      // 1. Speed Breakers (Raised striped bumps)
      for (let i = 0; i < level.speedBreakersCount; i++) {
        const dist = 60 + i * (level.roadLength / (level.speedBreakersCount + 1));
        const pt = this.getPointAtDistance(dist);

        const bumpGeo = new THREE.CylinderGeometry(0.35, 0.35, 8.4, 12);
        bumpGeo.rotateZ(Math.PI / 2);
        const bumpMat = new THREE.MeshStandardMaterial({
          color: 0xffd600,
          roughness: 0.5
        });
        const bump = new THREE.Mesh(bumpGeo, bumpMat);
        bump.position.set(pt.x, pt.y + 0.15, pt.z);
        this.scene.add(bump);
        this.obstacles.push({
          type: 'speed_breaker',
          mesh: bump,
          pos: pt,
          radius: 1.5,
          z: pt.z
        });
      }

      // 2. Potholes (Depressions)
      for (let i = 0; i < level.potholesCount; i++) {
        const dist = 90 + i * (level.roadLength / (level.potholesCount + 1));
        const pt = this.getPointAtDistance(dist);
        const laneOffset = ((i % 2 === 0 ? 1 : -1) * 2.2);

        const holeGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 14);
        const holeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.set(pt.x + laneOffset, pt.y + 0.06, pt.z);
        this.scene.add(hole);
        this.obstacles.push({
          type: 'pothole',
          mesh: hole,
          pos: new THREE.Vector3(pt.x + laneOffset, pt.y, pt.z),
          radius: 1.2,
          z: pt.z
        });
      }

      // 3. Rocks / Boulders
      for (let i = 0; i < level.rocksCount; i++) {
        const dist = 75 + i * (level.roadLength / (level.rocksCount + 1));
        const pt = this.getPointAtDistance(dist);
        const laneOffset = ((i % 3 - 1) * 2.5);

        const rockGeo = new THREE.DodecahedronGeometry(0.85);
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x757575, roughness: 0.9 });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(pt.x + laneOffset, pt.y + 0.65, pt.z);
        this.scene.add(rock);
        this.obstacles.push({
          type: 'rock',
          mesh: rock,
          pos: new THREE.Vector3(pt.x + laneOffset, pt.y, pt.z),
          radius: 1.1,
          z: pt.z
        });
      }

      // 4. Moving Traffic Vehicles
      for (let i = 0; i < level.trafficCount; i++) {
        const dist = 80 + i * (level.roadLength / (level.trafficCount + 1));
        const trafficConfig = window.CAR_CONFIGS[i % window.CAR_CONFIGS.length];
        const trafficCar = window.buildCarModel(trafficConfig, '#78909c');
        this.scene.add(trafficCar.root);

        const lane = (i % 2 === 0 ? 1 : -1) * 2.2;
        const dir = i % 2 === 0 ? 1 : -1; // 1 = with player, -1 = oncoming traffic!

        this.trafficCars.push({
          carData: trafficCar,
          dist: dist,
          speed: 12 + (i % 4) * 3,
          lane: lane,
          dir: dir
        });
      }

      // 5. Cartoon Animals (Sheep, Cows, Chickens)
      for (let i = 0; i < level.animalsCount; i++) {
        const dist = 110 + i * (level.roadLength / (level.animalsCount + 1));
        const pt = this.getPointAtDistance(dist);
        const animalMesh = this.buildCartoonAnimal(i % 3);
        animalMesh.position.set(pt.x + (i % 2 === 0 ? 3.2 : -3.2), pt.y, pt.z);
        this.scene.add(animalMesh);

        this.animatedAnimals.push({
          mesh: animalMesh,
          baseX: pt.x,
          baseZ: pt.z,
          timeOffset: i * 1.5,
          laneDir: i % 2 === 0 ? 1 : -1
        });
      }
    }

    buildCartoonAnimal(type) {
      const group = new THREE.Group();
      if (type === 0) {
        // Cute Sheep
        const woolMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
        const skinMat = new THREE.MeshStandardMaterial({ color: 0x212121 });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), woolMat);
        body.position.y = 0.7;
        group.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), skinMat);
        head.position.set(0, 0.95, 0.6);
        group.add(head);
      } else {
        // Brown Cow
        const cowMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 1.4), cowMat);
        body.position.y = 0.85;
        group.add(body);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.6), cowMat);
        head.position.set(0, 1.2, 0.7);
        group.add(head);
      }
      return group;
    }

    getPointAtDistance(targetZ) {
      const idx = Math.min(this.trackWaypoints.length - 1, Math.max(0, Math.floor(targetZ / 15)));
      return this.trackWaypoints[idx] || new THREE.Vector3(0, 0, targetZ);
    }

    // ------------------------------------------------------------------------
    // PHYSICS & GAMEPLAY LOOP
    // ------------------------------------------------------------------------
    update(delta) {
      if (!this.isPlaying || this.isPaused) return;

      this.input.update(delta);

      // Handle Acceleration & Braking
      const isNitro = this.input.nitro && this.nitroLevel > 5;
      const accelFactor = (isNitro ? this.playerAccel * 1.6 : this.playerAccel);
      const topSpeed = isNitro ? this.playerMaxSpeed * this.playerNitroMult : this.playerMaxSpeed;

      if (isNitro) {
        this.nitroLevel = Math.max(0, this.nitroLevel - delta * 28);
      } else {
        this.nitroLevel = Math.min(100, this.nitroLevel + delta * 8);
      }

      if (this.input.gas) {
        this.playerSpeed += accelFactor * delta;
        if (this.playerSpeed > topSpeed) this.playerSpeed = topSpeed;
      } else if (this.input.brake) {
        this.playerSpeed -= this.playerAccel * 1.8 * delta;
        if (this.playerSpeed < -8) this.playerSpeed = -8; // Reverse cap
      } else {
        // Natural road rolling friction
        if (this.playerSpeed > 0) {
          this.playerSpeed = Math.max(0, this.playerSpeed - 9 * delta);
        } else if (this.playerSpeed < 0) {
          this.playerSpeed = Math.min(0, this.playerSpeed + 9 * delta);
        }
      }

      // Steering & Turn dynamics
      const turnRate = this.playerHandling * (this.playerSpeed >= 0 ? 1 : -1);
      const speedSteerScaling = Math.min(1.0, Math.abs(this.playerSpeed) / 10);
      this.playerRot += -this.input.steerValue * turnRate * speedSteerScaling * delta;

      // Update Car Position
      const moveX = -Math.sin(this.playerRot) * this.playerSpeed * delta;
      const moveZ = Math.cos(this.playerRot) * this.playerSpeed * delta;
      this.playerPos.x += moveX;
      this.playerPos.z += moveZ;

      // Road boundary / terrain elevation adherence
      const currentTrackPt = this.getPointAtDistance(this.playerPos.z);
      const targetGroundY = currentTrackPt.y;

      // Suspension Vertical Physics & Bouncing
      if (!this.isGrounded) {
        this.verticalVelocity -= 25 * delta; // Gravity
        this.playerPos.y += this.verticalVelocity * delta;
        if (this.playerPos.y <= targetGroundY) {
          this.playerPos.y = targetGroundY;
          this.verticalVelocity = 0;
          this.isGrounded = true;
          this.suspensionBounce = 0.3; // Landing squash
        }
      } else {
        this.playerPos.y = targetGroundY;
      }

      // Suspension G-forces Simulation (Pitch & Roll)
      const targetPitch = (this.input.gas ? -0.06 : 0) + (this.input.brake ? 0.12 : 0) + (isNitro ? -0.1 : 0);
      const targetRoll = this.input.steerValue * 0.12 * (this.playerSpeed / this.playerMaxSpeed);
      this.suspensionPitch += (targetPitch - this.suspensionPitch) * Math.min(1.0, delta * 10);
      this.suspensionRoll += (targetRoll - this.suspensionRoll) * Math.min(1.0, delta * 8);
      this.suspensionBounce = Math.max(0, this.suspensionBounce - delta * 2.5);

      // Sync 3D Car Root
      if (this.carInstance) {
        this.carInstance.root.position.copy(this.playerPos);
        this.carInstance.root.rotation.y = this.playerRot;

        // Apply chassis pitch, roll, and suspension bounce
        this.carInstance.chassis.rotation.x = this.suspensionPitch;
        this.carInstance.chassis.rotation.z = this.suspensionRoll;
        this.carInstance.chassis.position.y = -Math.sin(this.suspensionBounce * Math.PI) * 0.15;

        // Front wheels steering yaw angle
        const wheelSteerAngle = -this.input.steerValue * 0.45;
        this.carInstance.frontWheelPivots.forEach((p) => {
          p.rotation.y = wheelSteerAngle;
        });

        // Wheel Rotation with ground velocity
        const wheelSpin = (this.playerSpeed / 0.42) * delta;
        this.carInstance.wheels.forEach((w) => {
          w.mesh.rotation.x += wheelSpin;
        });

        // Brake lights emission
        if (this.carInstance.brakelightMaterial) {
          const isBraking = this.input.brake || this.playerSpeed < 0;
          this.carInstance.brakelightMaterial.emissiveIntensity = isBraking ? 2.5 : 0.4;
        }

        // Nitro exhaust flames visibility
        this.carInstance.nitroFlames.forEach((flame) => {
          flame.visible = isNitro;
          if (isNitro) {
            flame.scale.set(1 + Math.random() * 0.4, 1 + Math.random() * 0.5, 1);
          }
        });

        // Driver Reactions inside car!
        if (this.carInstance.driver) {
          const driverHead = this.carInstance.driver.head;
          const steeringWheel = this.carInstance.driver.steeringWheel;

          // Driver turns head towards turn direction
          const targetHeadYaw = -this.input.steerValue * 0.45;
          driverHead.rotation.y += (targetHeadYaw - driverHead.rotation.y) * Math.min(1.0, delta * 12);

          // Driver tilts back on nitro, leans forward on braking
          driverHead.rotation.x = this.suspensionPitch * 1.5;

          // Steering wheel turns synchronously!
          steeringWheel.rotation.z = -this.input.steerValue * 1.2;
        }
      }

      // Check Mission & Obstacle Collisions
      this.checkCollisions(delta);

      // Update Rivals and Traffic
      this.updateTrafficAndRivals(delta);

      // Audio engine pitch
      const speedKmH = Math.round(Math.abs(this.playerSpeed) * 3.6);
      this.sound.updateEngine(speedKmH, this.playerMaxSpeed * 3.6, this.input.gas || isNitro);

      // Timer countdown
      this.timeRemaining -= delta;
      if (this.timeRemaining <= 0) {
        this.handleGameOver('Time Expired!');
        return;
      }

      // Check Finish Line
      if (this.playerPos.z >= this.trackLength) {
        this.handleLevelCompleted();
        return;
      }

      // Camera follow update
      this.updateCamera(delta, isNitro);

      // UI HUD update
      this.updateHUD(speedKmH);
    }

    // ------------------------------------------------------------------------
    // COLLISION & INTERACTION CHECKS
    // ------------------------------------------------------------------------
    checkCollisions(delta) {
      const carPos = this.playerPos;

      // 1. Coin Pickups
      this.coins.forEach((c) => {
        if (!c.collected && Math.abs(c.mesh.position.z - carPos.z) < 1.8) {
          const dist = carPos.distanceTo(c.mesh.position);
          if (dist < 2.2) {
            c.collected = true;
            c.mesh.visible = false;
            this.coinsCollectedThisRun++;
            this.data.coins += 1;
            this.sound.playCoinChime();
          }
        }
      });

      // 2. Obstacles (Speed Breakers, Potholes, Rocks)
      this.obstacles.forEach((obs) => {
        if (Math.abs(obs.z - carPos.z) < 2.0) {
          const d = carPos.distanceTo(obs.pos);
          if (d < obs.radius + 1.2) {
            if (obs.type === 'speed_breaker') {
              // Bounce car over bump!
              if (this.isGrounded && Math.abs(this.playerSpeed) > 8) {
                this.verticalVelocity = Math.min(8.0, Math.abs(this.playerSpeed) * 0.35);
                this.isGrounded = false;
                this.suspensionBounce = 0.4;
              }
            } else if (obs.type === 'pothole') {
              // Slow car and shake
              this.playerSpeed *= 0.85;
              this.suspensionBounce = 0.25;
            } else if (obs.type === 'rock') {
              // Damage car and recoil
              this.takeDamage(18);
              this.playerSpeed *= -0.3;
              obs.pos.x += 10; // Knocked away
              obs.mesh.position.x += 10;
              this.sound.playCrash();
            }
          }
        }
      });

      // 3. Passenger Pickup & Dropoff
      if (this.currentLevel.missionType === 'passenger_pickup' && !this.passengerPickedUp) {
        const stopZ = this.currentLevel.passengerStopDist;
        if (Math.abs(carPos.z - stopZ) < 5.0) {
          // Check if car slowed down sufficiently to pick up
          if (Math.abs(this.playerSpeed) < 3.0) {
            this.passengerPickedUp = true;
            this.sound.playVictory();
            // Attach passenger into passenger seat inside car!
            if (this.passengerObject && this.carInstance && this.carInstance.passengerSeat) {
              this.scene.remove(this.passengerObject);
              this.passengerObject.position.set(0, 0, 0);
              this.passengerObject.scale.set(0.85, 0.85, 0.85);
              this.carInstance.passengerSeat.add(this.passengerObject);
            }
            if (this.passengerStopMesh) this.passengerStopMesh.visible = false;
          }
        }
      }
    }

    takeDamage(amount) {
      this.health = Math.max(0, this.health - amount);
      if (this.health <= 0) {
        this.handleGameOver('Car Wrecked!');
      }
    }

    updateTrafficAndRivals(delta) {
      // Traffic
      this.trafficCars.forEach((t) => {
        t.dist += t.speed * t.dir * delta;
        const pt = this.getPointAtDistance(t.dist);
        t.carData.root.position.set(pt.x + t.lane, pt.y, t.dist);
        t.carData.root.rotation.y = t.dir > 0 ? 0 : Math.PI;

        // Collision with player
        if (Math.abs(t.dist - this.playerPos.z) < 2.4) {
          const d = this.playerPos.distanceTo(t.carData.root.position);
          if (d < 2.0) {
            this.takeDamage(22);
            this.playerSpeed *= 0.2;
            this.sound.playCrash();
          }
        }
      });

      // Rivals
      if (this.currentLevel.missionType === 'mountain_race') {
        let currentPos = 1;
        this.rivalCars.forEach((r) => {
          r.dist += r.speed * delta;
          const pt = this.getPointAtDistance(r.dist);
          r.carData.root.position.set(pt.x + r.lane, pt.y, r.dist);

          if (r.dist > this.playerPos.z) {
            currentPos++;
          }
        });
        this.racePosition = currentPos;
      }

      // Animals Wiggle & Walk
      this.animatedAnimals.forEach((anim) => {
        const time = this.clock.getElapsedTime() + anim.timeOffset;
        anim.mesh.position.y = Math.abs(Math.sin(time * 6)) * 0.15;
      });
    }

    // ------------------------------------------------------------------------
    // CAMERA CONTROLLER
    // ------------------------------------------------------------------------
    updateCamera(delta, isNitro) {
      const carPos = this.playerPos;
      const carRot = this.playerRot;

      if (this.cameraMode === 0) {
        // 3RD PERSON CHASE CAMERA
        const fovTarget = isNitro ? 74 : 62;
        this.camera.fov += (fovTarget - this.camera.fov) * Math.min(1.0, delta * 6);
        this.camera.updateProjectionMatrix();

        const camDist = 6.8 + (Math.abs(this.playerSpeed) / this.playerMaxSpeed) * 1.5;
        const camHeight = 3.2;

        const targetCamX = carPos.x + Math.sin(carRot) * camDist;
        const targetCamZ = carPos.z - Math.cos(carRot) * camDist;
        const targetCamY = carPos.y + camHeight;

        this.camera.position.x += (targetCamX - this.camera.position.x) * Math.min(1.0, delta * 9);
        this.camera.position.y += (targetCamY - this.camera.position.y) * Math.min(1.0, delta * 8);
        this.camera.position.z += (targetCamZ - this.camera.position.z) * Math.min(1.0, delta * 9);

        const lookAtPt = new THREE.Vector3(
          carPos.x - Math.sin(carRot) * 4,
          carPos.y + 1.2,
          carPos.z + Math.cos(carRot) * 4
        );
        this.camera.lookAt(lookAtPt);

      } else if (this.cameraMode === 1) {
        // 1ST PERSON / COCKPIT CAMERA
        this.camera.fov = 75;
        this.camera.updateProjectionMatrix();

        // Positioned right at driver eye line inside car
        const eyeOffset = new THREE.Vector3(-0.35, 1.25, 0.2);
        eyeOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRot);
        this.camera.position.copy(carPos).add(eyeOffset);

        const lookAtPt = new THREE.Vector3(
          carPos.x - Math.sin(carRot) * 20,
          carPos.y + 1.1,
          carPos.z + Math.cos(carRot) * 20
        );
        this.camera.lookAt(lookAtPt);

      } else {
        // TOP-DOWN ISOMETRIC CAMERA
        this.camera.fov = 55;
        this.camera.updateProjectionMatrix();

        this.camera.position.set(carPos.x, carPos.y + 24, carPos.z - 8);
        this.camera.lookAt(carPos.x, carPos.y, carPos.z + 10);
      }
    }

    // ------------------------------------------------------------------------
    // HUD REFRESH
    // ------------------------------------------------------------------------
    updateHUD(speedKmH) {
      document.getElementById('hud-speed').textContent = speedKmH;
      document.getElementById('hud-nitro-val').textContent = `${Math.round(this.nitroLevel)}%`;
      document.getElementById('hud-nitro-fill').style.width = `${Math.round(this.nitroLevel)}%`;
      document.getElementById('hud-health-val').textContent = `${Math.round(this.health)}%`;
      document.getElementById('hud-health-fill').style.width = `${Math.round(this.health)}%`;
      document.getElementById('hud-coins').textContent = this.data.coins;

      // Timer
      const mins = Math.floor(Math.max(0, this.timeRemaining) / 60);
      const secs = Math.floor(Math.max(0, this.timeRemaining) % 60);
      const timerEl = document.getElementById('hud-timer');
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (this.timeRemaining < 10) {
        timerEl.classList.add('urgent');
      } else {
        timerEl.classList.remove('urgent');
      }

      // Track progress
      const progressRatio = Math.min(1.0, Math.max(0.0, this.playerPos.z / this.trackLength));
      document.getElementById('hud-progress-fill').style.width = `${progressRatio * 100}%`;
      document.getElementById('hud-progress-car').style.left = `${progressRatio * 100}%`;
      const remMeters = Math.max(0, Math.round(this.trackLength - this.playerPos.z));
      document.getElementById('hud-dist-remaining').textContent = `${remMeters}m`;
      document.getElementById('hud-level-title').textContent = this.currentLevel.title.split(':')[0];

      // Mission Banner
      const missionType = this.currentLevel.missionType;
      const missionTypeEl = document.getElementById('hud-mission-type');
      const missionTextEl = document.getElementById('hud-mission-text');

      if (missionType === 'coin_collection') {
        missionTypeEl.textContent = '🪙 Coin Rush';
        missionTextEl.textContent = `Collect: ${this.coinsCollectedThisRun} / ${this.currentLevel.targetCoins}`;
      } else if (missionType === 'passenger_pickup') {
        missionTypeEl.textContent = '🚕 Taxi Hero';
        missionTextEl.textContent = this.passengerPickedUp ? 'Passenger Onboard! Deliver to Finish' : 'Stop at Passenger Zone Ahead!';
      } else if (missionType === 'mountain_race') {
        missionTypeEl.textContent = '🏁 Mountain Race';
        missionTextEl.textContent = `Position: ${this.racePosition}${['st', 'nd', 'rd', 'th'][this.racePosition - 1] || 'th'} / ${this.currentLevel.rivalCount + 1}`;
      } else if (missionType === 'time_challenge') {
        missionTypeEl.textContent = '⏱️ Time Challenge';
        missionTextEl.textContent = `Beat the Clock! (${Math.round(this.timeRemaining)}s)`;
      } else {
        missionTypeEl.textContent = '🚗 Adventure Cruise';
        missionTextEl.textContent = `Finish Line: ${remMeters}m`;
      }
    }

    // ------------------------------------------------------------------------
    // LEVEL WIN & GAME OVER
    // ------------------------------------------------------------------------
    handleLevelCompleted() {
      this.isPlaying = false;
      this.sound.stopEngine();
      this.sound.playVictory();

      // Calculate Stars (1 to 3)
      let stars = 1;
      const th = this.currentLevel.starsThresholds;
      const timeTaken = this.currentLevel.timeLimit - this.timeRemaining;

      if (timeTaken <= th.threeStarTime) stars++;
      if (this.coinsCollectedThisRun >= (this.currentLevel.targetCoins || 10)) stars++;
      stars = Math.min(3, Math.max(1, stars));

      // Save stars and unlock next level
      const prevStars = this.data.levelStars[this.currentLevelIndex] || 0;
      if (stars > prevStars) {
        this.data.levelStars[this.currentLevelIndex] = stars;
      }
      if (this.currentLevelIndex >= (this.data.highestUnlockedLevel || 1)) {
        this.data.highestUnlockedLevel = Math.min(100, this.currentLevelIndex + 1);
      }

      const reward = this.currentLevel.coinReward + this.coinsCollectedThisRun * 2;
      this.data.coins += reward;
      StorageManager.save(this.data);

      if (window.AndroidFirebase && typeof window.AndroidFirebase.submitScore === 'function') {
        window.AndroidFirebase.submitScore(this.currentLevelIndex, timeTaken, stars);
      }

      // Show Victory Modal
      document.getElementById('hud-overlay').classList.remove('active');
      document.getElementById('modal-victory').classList.add('active');

      // Populate victory card
      for (let s = 1; s <= 3; s++) {
        const starEl = document.getElementById(`vic-star-${s}`);
        starEl.style.opacity = s <= stars ? '1.0' : '0.2';
      }

      const m = Math.floor(timeTaken / 60);
      const sec = Math.floor(timeTaken % 60);
      document.getElementById('vic-time-val').textContent = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      document.getElementById('vic-coins-val').textContent = `+${reward} 🪙`;
      document.getElementById('vic-balance-val').textContent = `${this.data.coins} 🪙`;
    }

    handleGameOver(reason) {
      this.isPlaying = false;
      this.sound.stopEngine();
      this.sound.playCrash();

      document.getElementById('hud-overlay').classList.remove('active');
      document.getElementById('modal-game-over').classList.add('active');
      document.getElementById('fail-title').textContent = reason.toUpperCase();
      document.getElementById('fail-reason').textContent = reason === 'Car Wrecked!' ? 'Your car suffered heavy obstacle impact damage.' : 'Time ran out before reaching the destination.';
    }

    respawnCar() {
      this.playerSpeed = 0;
      this.playerPos.x = 0;
      this.playerRot = 0;
      this.health = Math.min(100, this.health + 20);
    }

    // ------------------------------------------------------------------------
    // MAIN RENDER LOOP
    // ------------------------------------------------------------------------
    animate() {
      requestAnimationFrame(this.animate);
      const delta = Math.min(0.08, this.clock.getDelta());

      if (this.isPlaying && !this.isPaused) {
        this.update(delta);
        this.renderer.render(this.scene, this.camera);
      }

      // Rotate garage turntable if garage open
      const garageModal = document.getElementById('modal-garage');
      if (garageModal && garageModal.classList.contains('active')) {
        if (this.garageCarGroup) {
          this.garageCarGroup.rotation.y += delta * 0.8;
        }
        if (this.garageRenderer && this.garageScene && this.garageCamera) {
          this.garageRenderer.render(this.garageScene, this.garageCamera);
        }
      }
    }
  }

  // Initialize on page load
  window.addEventListener('DOMContentLoaded', () => {
    new CarAdventureGame();
  });
})();
