// ============================================================================
// CAR ADVENTURE WORLD 3D - MASTER GAME ENGINE & THREE.JS CONTROLLER
// Complete Overhaul: Road-Aligned Driving, Realistic Grip, Sequential Checkpoints,
// Clear Mission HUD, 3D Waypoint Compass, Start Briefing, and Separated Controls.
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
        console.warn('Web Audio not supported', e);
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
      const ratio = Math.min(1.0, Math.max(0.0, Math.abs(speedKmH) / (maxSpeed * 3.6)));
      const targetFreq = 42 + ratio * 150 + (isAccelerating ? 30 : 0);
      const targetFilter = 220 + ratio * 700 + (isAccelerating ? 180 : 0);
      const targetVol = (0.05 + ratio * 0.14 + (isAccelerating ? 0.06 : 0)) * this.engineVol;

      const now = this.ctx.currentTime;
      this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
      this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.08);
      this.engineGain.gain.setTargetAtTime(targetVol, now, 0.08);
    }

    playCheckpointChime() {
      if (!this.ctx || this.sfxVol <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [587.33, 880.00, 1174.66]; // D5, A5, D6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.22 * this.sfxVol, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.36);
        });
      } catch (e) {}
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

    playBarrierScrape() {
      if (!this.ctx || this.sfxVol <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.16);
        gain.gain.setValueAtTime(0.22 * this.sfxVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } catch (e) {}
    }

    playCrash() {
      if (!this.ctx || this.sfxVol <= 0) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
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
  // PERSISTENT STORAGE MANAGER (localStorage & Cloud Sync Bridge)
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
  // INPUT CONTROLLER (Pointer Events with Pointer Capture & Keyboard)
  // Cleanly separated:
  // - Gas: Accelerate forward
  // - Brake: Decelerate smoothly to 0; holding when stopped switches to Reverse
  // - Steer Left / Right: Smooth continuous response with spring return
  // - Space: Dedicated Brake / Handbrake
  // --------------------------------------------------------------------------
  class InputController {
    constructor() {
      this.gas = false;
      this.brake = false;
      this.steerLeft = false;
      this.steerRight = false;
      this.nitro = false;
      this.horn = false;
      this.handbrake = false;

      // Filtered steering value: -1.0 (Full Left) to +1.0 (Full Right)
      this.steerValue = 0.0;

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
          case 'Space':
            this.handbrake = true;
            this.brake = true;
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
            if (window.gameInstance && window.gameInstance.isPlaying) window.gameInstance.restartCurrentLevel();
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
          case 'Space':
            this.handbrake = false;
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
      const bindPointerBtn = (id, onDown, onUp) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          try {
            btn.setPointerCapture(e.pointerId);
          } catch (err) {}
          btn.classList.add('active');
          if (window.gameInstance && window.gameInstance.sound) {
            window.gameInstance.sound.init();
          }
          onDown();
        }, { passive: false });

        const handleRelease = (e) => {
          e.preventDefault();
          btn.classList.remove('active');
          try {
            if (btn.hasPointerCapture && btn.hasPointerCapture(e.pointerId)) {
              btn.releasePointerCapture(e.pointerId);
            }
          } catch (err) {}
          onUp();
        };

        btn.addEventListener('pointerup', handleRelease, { passive: false });
        btn.addEventListener('pointercancel', handleRelease, { passive: false });
        btn.addEventListener('lostpointercapture', handleRelease, { passive: false });
      };

      bindPointerBtn('btn-steer-left', () => { this.steerLeft = true; }, () => { this.steerLeft = false; });
      bindPointerBtn('btn-steer-right', () => { this.steerRight = true; }, () => { this.steerRight = false; });
      bindPointerBtn('btn-gas', () => { this.gas = true; }, () => { this.gas = false; });
      bindPointerBtn('btn-brake', () => { this.brake = true; }, () => { this.brake = false; });
      bindPointerBtn('btn-nitro', () => { this.nitro = true; }, () => { this.nitro = false; });
      bindPointerBtn('btn-horn', () => {
        this.horn = true;
        if (window.gameInstance) window.gameInstance.sound.playHorn();
      }, () => { this.horn = false; });
    }

    update(dt) {
      let target = 0.0;
      if (this.steerLeft) target -= 1.0;
      if (this.steerRight) target += 1.0;

      // Fast response when pressed, smooth centering spring when released
      const rate = target !== 0 ? 12.0 : 8.0;
      this.steerValue += (target - this.steerValue) * Math.min(1.0, dt * rate);
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
      this.cameraMode = 0; // 0: 3rd person chase, 1: Cockpit, 2: Top-down

      // Fixed-timestep physics accumulator (60Hz)
      this.physicsAccumulator = 0;
      this.FIXED_DT = 1 / 60;

      // Road Geometry Dimensions
      this.ROAD_WIDTH = 13.0; // 13 meters wide (3 highway lanes + shoulders)
      this.LATERAL_LIMIT = 4.8; // Safe drivable boundary inside curbs (-4.8m to +4.8m)

      // Physical Vehicle State relative to Road Path:
      this.trackDist = 0; // Distance along road centerline (meters)
      this.lateralOffset = 0; // Cross-track position (-4.8m left to +4.8m right)
      this.lateralVel = 0; // Lateral velocity (m/s)
      this.relativeAngle = 0; // Visual/physical yaw angle relative to road tangent (radians)
      this.speed = 0; // Forward velocity (m/s)
      this.gear = 'D'; // 'D' (Drive), 'R' (Reverse), 'N' (Neutral)
      this.reverseHoldTime = 0;

      // Performance stats from car config + upgrades
      this.playerMaxSpeed = 24;
      this.playerAccel = 18;
      this.playerHandling = 2.8;
      this.playerNitroMult = 1.45;
      this.nitroLevel = 100;
      this.health = 100;
      this.coinsCollectedThisRun = 0;
      this.timeRemaining = 60;
      this.passengerPickedUp = false;
      this.racePosition = 1;

      // Dynamic suspension simulation
      this.suspensionPitch = 0;
      this.suspensionRoll = 0;
      this.suspensionBounce = 0;

      // Smooth camera vectors
      this.camPos = new THREE.Vector3(0, 5, -10);
      this.camLookTarget = new THREE.Vector3(0, 1, 10);

      // Objective & Checkpoint Sequence
      this.objectives = [];
      this.currentObjectiveIndex = 0;
      this.checkpoints = [];

      // Three.js Core
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.sunLight = null;
      this.ambientLight = null;
      this.carInstance = null;

      // Track & World Entities
      this.trackWaypoints = [];
      this.trackStep = 10.0;
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

      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(this.ambientLight);

      this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.25);
      this.sunLight.position.set(60, 100, 60);
      if (this.data.graphicsQuality === 'high') {
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 1024;
        this.sunLight.shadow.mapSize.height = 1024;
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
      document.getElementById('btn-menu-play').addEventListener('click', () => {
        this.sound.init();
        this.openMissionBriefing(this.data.highestUnlockedLevel || 1);
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

      // Quick in-game actions
      document.getElementById('btn-quick-restart').addEventListener('click', () => this.restartCurrentLevel());
      document.getElementById('btn-camera').addEventListener('click', () => this.cycleCamera());
      document.getElementById('btn-lights').addEventListener('click', () => this.toggleLights());
      document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
      document.getElementById('btn-fullscreen').addEventListener('click', () => this.toggleFullscreen());

      // Start Mission button from Briefing
      document.getElementById('btn-start-mission').addEventListener('click', () => {
        this.hideAllModals();
        this.startLevelGameplay(this.currentLevelIndex);
      });

      // Pause menu
      document.getElementById('btn-pause-resume').addEventListener('click', () => this.togglePause());
      document.getElementById('btn-pause-restart').addEventListener('click', () => {
        this.hideAllModals();
        this.openMissionBriefing(this.currentLevelIndex);
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

      // Victory actions
      document.getElementById('btn-vic-next').addEventListener('click', () => {
        this.hideAllModals();
        const next = Math.min(100, this.currentLevelIndex + 1);
        this.openMissionBriefing(next);
      });
      document.getElementById('btn-vic-replay').addEventListener('click', () => {
        this.hideAllModals();
        this.openMissionBriefing(this.currentLevelIndex);
      });
      document.getElementById('btn-vic-garage').addEventListener('click', () => {
        this.hideAllModals();
        this.openGarage();
      });

      // Fail actions
      document.getElementById('btn-fail-retry').addEventListener('click', () => {
        this.hideAllModals();
        this.openMissionBriefing(this.currentLevelIndex);
      });
      document.getElementById('btn-fail-garage').addEventListener('click', () => {
        this.hideAllModals();
        this.openGarage();
      });
      document.getElementById('btn-fail-menu').addEventListener('click', () => {
        this.hideAllModals();
        this.openMainMenu();
      });

      // Dialog close buttons
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
      document.getElementById('menu-play-text').textContent = `PLAY MISSION ${this.data.highestUnlockedLevel || 1}`;
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
      this.renderLevelSelectPage(1);
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
        tabBtn.textContent = `Missions ${startLvl}-${endLvl}`;
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
          <div class="level-card-num">${isUnlocked ? `Mission ${i}` : `🔒 ${i}`}</div>
          <div class="level-card-env">${envInfo ? envInfo.name.split(' ')[0] : 'Road'}</div>
          <div class="level-card-mission">${missionInfo ? missionInfo.icon + ' ' + missionInfo.name : 'Race'}</div>
          <div class="level-stars">${starsHTML}</div>
        `;

        if (isUnlocked) {
          card.addEventListener('click', () => {
            this.hideAllModals();
            this.openMissionBriefing(i);
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

    restartCurrentLevel() {
      this.hideAllModals();
      this.startLevelGameplay(this.currentLevelIndex);
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
    // GARAGE TURNTABLE & TUNING
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

      const gAmb = new THREE.AmbientLight(0xffffff, 0.85);
      this.garageScene.add(gAmb);

      const gDir = new THREE.DirectionalLight(0xfffaed, 1.4);
      gDir.position.set(4, 8, 4);
      this.garageScene.add(gDir);

      const platformGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.2, 32);
      const platformMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.3
      });
      const platform = new THREE.Mesh(platformGeo, platformMat);
      platform.position.y = -0.1;
      this.garageScene.add(platform);

      const neonRingGeo = new THREE.TorusGeometry(2.45, 0.04, 8, 36);
      neonRingGeo.rotateX(Math.PI / 2);
      const neonRingMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
      const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
      neonRing.position.y = 0.02;
      this.garageScene.add(neonRing);

      this.garageCarGroup = new THREE.Group();
      this.garageScene.add(this.garageCarGroup);

      document.getElementById('garage-prev-car').addEventListener('click', () => {
        this.garageCarConfigIndex = (this.garageCarConfigIndex - 1 + window.CAR_CONFIGS.length) % window.CAR_CONFIGS.length;
        this.updateGarageView();
      });

      document.getElementById('garage-next-car').addEventListener('click', () => {
        this.garageCarConfigIndex = (this.garageCarConfigIndex + 1) % window.CAR_CONFIGS.length;
        this.updateGarageView();
      });

      ['speed', 'accel', 'handling', 'nitro', 'susp'].forEach((statKey) => {
        document.getElementById(`btn-upgrade-${statKey}`).addEventListener('click', () => {
          this.upgradeCurrentCarStat(statKey);
        });
      });

      document.getElementById('garage-unlock-btn').addEventListener('click', () => {
        this.unlockCurrentCar();
      });
    }

    openGarage() {
      this.hideAllModals();
      document.getElementById('modal-garage').classList.add('active');

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
        this.data.selectedCar = config.id;
        StorageManager.save(this.data);
      }

      while (this.garageCarGroup.children.length > 0) {
        this.garageCarGroup.remove(this.garageCarGroup.children[0]);
      }

      const paintColor = this.data.carPaints[config.id] || config.baseColor;
      const previewCar = window.buildCarModel(config, paintColor);
      this.garageCarGroup.add(previewCar.root);

      const currentUpgrades = this.data.carUpgrades[config.id] || { speed: 1, accel: 1, handling: 1, nitro: 1, susp: 1 };

      const updateStatBar = (statKey, currentLvl) => {
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

      updateStatBar('speed', currentUpgrades.speed);
      updateStatBar('accel', currentUpgrades.accel);
      updateStatBar('handling', currentUpgrades.handling);
      updateStatBar('nitro', currentUpgrades.nitro);
      updateStatBar('susp', currentUpgrades.susp);

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
        alert('Not enough coins! Complete missions to earn more coins.');
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
    // HIGH-PRECISION ROAD SPLINE (Catmull-Rom Mathematical Interpolation)
    // ------------------------------------------------------------------------
    getTrackFrame(distance) {
      const s = Math.max(0, Math.min(this.trackLength, distance));
      const step = this.trackStep;
      const count = this.trackWaypoints.length;
      if (count < 2) {
        return {
          center: new THREE.Vector3(0, 0, s),
          tangent: new THREE.Vector3(0, 0, 1),
          normal: new THREE.Vector3(0, 1, 0),
          right: new THREE.Vector3(1, 0, 0),
          yaw: 0,
          pitch: 0
        };
      }

      const idx = Math.min(count - 2, Math.max(0, Math.floor(s / step)));
      const t = (s - idx * step) / step;

      const p0 = this.trackWaypoints[Math.max(0, idx - 1)];
      const p1 = this.trackWaypoints[idx];
      const p2 = this.trackWaypoints[Math.min(count - 1, idx + 1)];
      const p3 = this.trackWaypoints[Math.min(count - 1, idx + 2)];

      const t2 = t * t;
      const t3 = t2 * t;

      const cx = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const cy = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      const cz = 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);

      const dx = 0.5 * ((-p0.x + p2.x) + 2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t + 3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2);
      const dy = 0.5 * ((-p0.y + p2.y) + 2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t + 3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2);
      const dz = 0.5 * ((-p0.z + p2.z) + 2 * (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t + 3 * (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t2);

      const tangent = new THREE.Vector3(dx, dy, dz).normalize();
      const normal = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize();

      const yaw = Math.atan2(tangent.x, tangent.z);
      const pitch = Math.asin(Math.max(-1, Math.min(1, tangent.y)));

      return {
        center: new THREE.Vector3(cx, cy, cz),
        tangent: tangent,
        normal: normal,
        right: right,
        yaw: yaw,
        pitch: pitch
      };
    }

    // ------------------------------------------------------------------------
    // MISSION BRIEFING & GAME FLOW
    // ------------------------------------------------------------------------
    openMissionBriefing(levelNum) {
      this.currentLevelIndex = levelNum;
      this.currentLevel = window.getLevel(levelNum);

      this.hideAllModals();

      document.getElementById('briefing-mission-num').textContent = `MISSION ${levelNum}`;
      document.getElementById('briefing-mission-title').textContent = this.currentLevel.title.toUpperCase();

      const mType = this.currentLevel.missionType;
      let goalText = 'Drive through all checkpoints and reach the finish line.';
      if (mType === 'passenger_pickup') {
        goalText = 'Pick up the passenger at the yellow taxi zone and deliver them to the destination.';
      } else if (mType === 'coin_collection') {
        goalText = `Collect gold coins along the road and pass all checkpoints to reach the finish.`;
      } else if (mType === 'mountain_race') {
        goalText = 'Overtake rivals through alpine curves and finish in 1st position!';
      } else if (mType === 'time_challenge') {
        goalText = `Beat the speed clock (${this.currentLevel.timeLimit}s) and reach the destination.`;
      }

      document.getElementById('briefing-goal-text').textContent = goalText;
      document.getElementById('modal-mission-briefing').classList.add('active');
    }

    startLevelGameplay(levelNum) {
      this.currentLevelIndex = levelNum;
      this.currentLevel = window.getLevel(levelNum);

      this.hideAllModals();
      document.getElementById('hud-overlay').classList.add('active');

      this.clearTrackEntities();

      const envInfo = window.ENVIRONMENTS[this.currentLevel.environment] || window.ENVIRONMENTS.city;
      this.scene.background.setHex(envInfo.skyColor);
      this.scene.fog.color.setHex(envInfo.fogColor);
      this.scene.fog.density = envInfo.fogDensity;

      this.ambientLight.color.setHex(envInfo.ambientLight);
      this.ambientLight.intensity = envInfo.ambientIntensity;
      this.sunLight.color.setHex(envInfo.sunLight);
      this.sunLight.intensity = envInfo.sunIntensity;
      this.sunLight.position.set(...envInfo.sunPos);

      // Build Road with Test Straight Section (0-140m) & Curved Sections
      this.buildRoadNetwork(this.currentLevel, envInfo);

      // Setup Player Car
      this.setupPlayerCar();

      // Reset Player Dynamic State
      this.trackDist = 0;
      this.lateralOffset = 0; // Starts in Center Lane
      this.lateralVel = 0;
      this.relativeAngle = 0;
      this.speed = 0;
      this.gear = 'D';
      this.reverseHoldTime = 0;
      this.suspensionPitch = 0;
      this.suspensionRoll = 0;
      this.suspensionBounce = 0;
      this.nitroLevel = 100;
      this.health = 100;
      this.coinsCollectedThisRun = 0;
      this.timeRemaining = this.currentLevel.timeLimit;
      this.passengerPickedUp = false;
      this.racePosition = 1;
      this.physicsAccumulator = 0;

      // Position camera initially directly behind car
      const initFrame = this.getTrackFrame(0);
      this.camPos.copy(initFrame.center).addScaledVector(initFrame.tangent, -7.0).add(new THREE.Vector3(0, 3.2, 0));
      this.camLookTarget.copy(initFrame.center).addScaledVector(initFrame.tangent, 15.0);
      this.camera.position.copy(this.camPos);
      this.camera.lookAt(this.camLookTarget);

      // Setup Checkpoints & Objectives
      this.setupObjectives(this.currentLevel);

      // Spawn World Entities
      this.spawnMissionEntities(this.currentLevel);
      this.spawnSmartTraffic(this.currentLevel);
      this.spawnObstacles(this.currentLevel);

      this.isPlaying = true;
      this.isPaused = false;
      this.sound.startEngine();

      this.updateHUD(0);
    }

    clearTrackEntities() {
      const removeList = (list) => {
        list.forEach((item) => {
          const mesh = item.mesh || item.root || item;
          if (mesh && mesh.parent) mesh.parent.remove(mesh);
        });
        list.length = 0;
      };

      removeList(this.trackMeshes);
      removeList(this.checkpoints);
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

      const calcStat = (base, max, lvl) => base + (max - base) * ((lvl - 1) / 4);
      this.playerMaxSpeed = calcStat(config.stats.speed, config.maxStats.speed, upgrades.speed);
      this.playerAccel = calcStat(config.stats.accel, config.maxStats.accel, upgrades.accel);
      this.playerHandling = calcStat(config.stats.handling, config.maxStats.handling, upgrades.handling);
      this.playerNitroMult = 1.35 + (upgrades.nitro / 5) * 0.45;

      this.carInstance = window.buildCarModel(config, paintColor);
      this.scene.add(this.carInstance.root);
    }

    // ------------------------------------------------------------------------
    // OBJECTIVES & VISIBLE 3D CHECKPOINTS
    // ------------------------------------------------------------------------
    setupObjectives(level) {
      this.objectives = [];
      this.currentObjectiveIndex = 0;
      this.checkpoints = [];

      const totalLen = level.roadLength;

      // Define 3 sequential milestones
      const cp1Dist = Math.round(totalLen * 0.32);
      const cp2Dist = level.missionType === 'passenger_pickup'
        ? level.passengerStopDist
        : Math.round(totalLen * 0.68);
      const finishDist = totalLen;

      // Build 3D Holographic Checkpoint Arches & Vertical Light Beacons
      const createCheckpointMesh = (dist, colorHex, label) => {
        const frame = this.getTrackFrame(dist);
        const group = new THREE.Group();
        group.position.copy(frame.center);
        group.rotation.y = frame.yaw;

        // Glowing Arch Frame
        const archMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.8,
          roughness: 0.2
        });
        const colGeo = new THREE.CylinderGeometry(0.2, 0.2, 5.5, 12);
        [-6.0, 6.0].forEach((x) => {
          const col = new THREE.Mesh(colGeo, archMat);
          col.position.set(x, 2.75, 0);
          group.add(col);
        });

        const crossbeam = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.4, 0.4), archMat);
        crossbeam.position.set(0, 5.5, 0);
        group.add(crossbeam);

        // Rotating Holographic Diamond
        const diamondGeo = new THREE.OctahedronGeometry(0.9, 0);
        const diamondMat = new THREE.MeshBasicMaterial({ color: colorHex, wireframe: true });
        const diamond = new THREE.Mesh(diamondGeo, diamondMat);
        diamond.position.set(0, 3.2, 0);
        group.add(diamond);

        // Ground Target Ring
        const ringGeo = new THREE.RingGeometry(1.6, 2.2, 24);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(0, 0.08, 0);
        group.add(ring);

        // Vertical Sky Light Beacon (Visible from afar!)
        const beaconGeo = new THREE.CylinderGeometry(0.12, 0.12, 35, 8);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.45
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(0, 17.5, 0);
        group.add(beacon);

        this.scene.add(group);

        return {
          group: group,
          dist: dist,
          diamond: diamond,
          colorHex: colorHex,
          label: label,
          reached: false
        };
      };

      const cp1 = createCheckpointMesh(cp1Dist, 0x00e5ff, 'Blue Checkpoint');
      const cp2 = createCheckpointMesh(cp2Dist, level.missionType === 'passenger_pickup' ? 0xffeb3b : 0x34c759, level.missionType === 'passenger_pickup' ? 'Taxi Pickup Zone' : 'Green Checkpoint');

      this.checkpoints.push(cp1, cp2);

      // Sequential Objectives List
      this.objectives = [
        {
          title: 'Drive to the blue checkpoint',
          dist: cp1Dist,
          progressText: '0 / 3 Complete',
          cpRef: cp1
        },
        {
          title: level.missionType === 'passenger_pickup'
            ? 'Stop at Taxi Zone & Pick Up Passenger'
            : 'Drive to the green checkpoint',
          dist: cp2Dist,
          progressText: '1 / 3 Complete',
          cpRef: cp2
        },
        {
          title: 'Reach the finish line',
          dist: finishDist,
          progressText: '2 / 3 Complete',
          cpRef: null
        }
      ];

      this.updateObjectiveUI();
    }

    triggerObjectiveComplete(nextDesc) {
      this.sound.playCheckpointChime();
      const toast = document.getElementById('hud-objective-toast');
      const toastDesc = document.getElementById('toast-objective-desc');
      if (toast && toastDesc) {
        toastDesc.textContent = nextDesc || 'Drive to the next destination!';
        toast.classList.add('active');
        setTimeout(() => {
          toast.classList.remove('active');
        }, 2400);
      }
    }

    updateObjectiveUI() {
      const obj = this.objectives[this.currentObjectiveIndex];
      if (!obj) return;

      document.getElementById('hud-mission-badge').textContent = `MISSION ${this.currentLevelIndex}`;
      document.getElementById('hud-mission-objective').textContent = obj.title;
      document.getElementById('hud-mission-progress').textContent = obj.progressText;
    }

    // ------------------------------------------------------------------------
    // HIGHWAY GENERATION: Clean Road, Lanes, Curbs & Guardrails
    // ------------------------------------------------------------------------
    buildRoadNetwork(level, envInfo) {
      this.trackWaypoints = [];
      const totalLen = level.roadLength;
      this.trackLength = totalLen;
      const step = this.trackStep;
      const count = Math.ceil(totalLen / step);

      for (let i = 0; i <= count; i++) {
        const dist = i * step;

        // Straight test road for first 140m, then smooth curve transition
        const curveBlend = Math.min(1.0, Math.max(0.0, (dist - 140) / 90));
        const curvePhase = (dist - 140) * 0.016 * Math.min(0.7, level.curvatureScale);
        const curveOffset = (Math.sin(curvePhase) * (24 * level.curvatureScale) + Math.sin(curvePhase * 0.5) * 10) * curveBlend;

        let hillY = 0;
        if (envInfo.isElevated) {
          hillY = 8;
        } else if (envInfo.isBridge) {
          hillY = Math.sin((dist / totalLen) * Math.PI) * 10 + 6;
        } else {
          const hillBlend = Math.min(1.0, Math.max(0.0, (dist - 160) / 100));
          hillY = Math.sin((dist / totalLen) * Math.PI * 3 * Math.min(0.6, level.hillScale)) * (5 * level.hillScale) * hillBlend;
        }

        this.trackWaypoints.push(new THREE.Vector3(curveOffset, hillY, dist));
      }

      const roadWidth = this.ROAD_WIDTH;
      const halfW = roadWidth / 2;

      // 1. Asphalt Highway Surface
      const roadGeo = new THREE.BufferGeometry();
      const pos = [];
      const normals = [];
      const uvs = [];

      for (let i = 0; i < this.trackWaypoints.length - 1; i++) {
        const p1 = this.trackWaypoints[i];
        const p2 = this.trackWaypoints[i + 1];

        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        const rightVec = new THREE.Vector3(dir.z, 0, -dir.x).normalize();

        const v1 = new THREE.Vector3().copy(p1).addScaledVector(rightVec, -halfW);
        const v2 = new THREE.Vector3().copy(p1).addScaledVector(rightVec, halfW);
        const v3 = new THREE.Vector3().copy(p2).addScaledVector(rightVec, -halfW);
        const v4 = new THREE.Vector3().copy(p2).addScaledVector(rightVec, halfW);

        [v1, v2, v3, v2, v4, v3].forEach((v) => {
          pos.push(v.x, v.y + 0.04, v.z);
          normals.push(0, 1, 0);
        });
        uvs.push(0, i, 1, i, 0, i + 1, 1, i, 1, i + 1, 0, i + 1);
      }

      roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      roadGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

      const roadMat = new THREE.MeshStandardMaterial({
        color: 0x181c20,
        roughness: 0.8,
        metalness: 0.15
      });
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.receiveShadow = true;
      this.scene.add(roadMesh);
      this.trackMeshes.push(roadMesh);

      // 2. Clear Lane Divider Markings
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const yellowMat = new THREE.MeshBasicMaterial({ color: 0xffd600 });

      for (let s = 10; s < totalLen - 15; s += 8) {
        const frame = this.getTrackFrame(s);

        // Dashed lines between lanes at lateral offsets -2.15m and +2.15m
        [-2.15, 2.15].forEach((offset) => {
          const dash = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 4.2), whiteMat);
          dash.position.copy(frame.center).addScaledVector(frame.right, offset);
          dash.position.y += 0.08;
          dash.rotation.y = frame.yaw;
          this.scene.add(dash);
          this.trackMeshes.push(dash);
        });

        // Double yellow center stripe
        [-0.18, 0.18].forEach((offset) => {
          const centerStripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 5.0), yellowMat);
          centerStripe.position.copy(frame.center).addScaledVector(frame.right, offset);
          centerStripe.position.y += 0.08;
          centerStripe.rotation.y = frame.yaw;
          this.scene.add(centerStripe);
          this.trackMeshes.push(centerStripe);
        });
      }

      // 3. 3D Steel Crash Barriers / Guardrails with Red & White Reflectors
      const railMat = new THREE.MeshStandardMaterial({
        color: 0xd6d8db,
        metalness: 0.7,
        roughness: 0.3
      });
      const postMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.6 });

      const guardrailOffsets = [-halfW + 0.3, halfW - 0.3];
      for (let s = 5; s < totalLen - 5; s += 10) {
        const frame1 = this.getTrackFrame(s);
        const frame2 = this.getTrackFrame(s + 10);

        guardrailOffsets.forEach((sideOffset) => {
          const pA = frame1.center.clone().addScaledVector(frame1.right, sideOffset);
          const pB = frame2.center.clone().addScaledVector(frame2.right, sideOffset);
          pA.y += 0.55;
          pB.y += 0.55;

          const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
          const dist = pA.distanceTo(pB);

          const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, dist + 0.2), railMat);
          rail.position.copy(mid);
          rail.lookAt(pB);
          this.scene.add(rail);
          this.trackMeshes.push(rail);

          const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.75, 0.16), postMat);
          post.position.set(pA.x, pA.y - 0.25, pA.z);
          this.scene.add(post);
          this.trackMeshes.push(post);

          const reflector = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.1, 0.08),
            sideOffset < 0 ? yellowMat : whiteMat
          );
          reflector.position.set(pA.x, pA.y + 0.05, pA.z);
          this.scene.add(reflector);
          this.trackMeshes.push(reflector);
        });
      }

      // 4. Ground Terrain Plane
      const terrainGeo = new THREE.PlaneGeometry(600, totalLen + 300, 32, 64);
      terrainGeo.rotateX(-Math.PI / 2);
      const terrainMat = new THREE.MeshStandardMaterial({
        color: envInfo.groundColor,
        roughness: 0.95
      });
      const terrain = new THREE.Mesh(terrainGeo, terrainMat);
      terrain.position.set(0, -0.3, totalLen / 2);
      terrain.receiveShadow = true;
      this.scene.add(terrain);
      this.trackMeshes.push(terrain);

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
        water.position.set(0, -1.0, totalLen / 2);
        this.scene.add(water);
        this.trackMeshes.push(water);
      }

      // 5. Checkered Finish Line Arch
      const finishFrame = this.getTrackFrame(totalLen);
      const gateGroup = new THREE.Group();
      gateGroup.position.copy(finishFrame.center);
      gateGroup.rotation.y = finishFrame.yaw;

      [-halfW - 0.2, halfW + 0.2].forEach((x) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 7, 8), postMat);
        post.position.set(x, 3.5, 0);
        gateGroup.add(post);
      });

      const banner = new THREE.Mesh(new THREE.BoxGeometry(roadWidth + 1.2, 1.4, 0.4), new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
      banner.position.set(0, 6.2, 0);
      gateGroup.add(banner);

      this.scene.add(gateGroup);
      this.trackMeshes.push(gateGroup);

      // 6. Overhead Highway Signage Gantries every 180m
      for (let s = 140; s < totalLen - 80; s += 180) {
        const gFrame = this.getTrackFrame(s);
        const gantry = new THREE.Group();
        gantry.position.copy(gFrame.center);
        gantry.rotation.y = gFrame.yaw;

        [-halfW - 0.2, halfW + 0.2].forEach((x) => {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 6.5, 8), postMat);
          col.position.set(x, 3.25, 0);
          gantry.add(col);
        });

        const signBox = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.8, 0.25), new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.4 }));
        signBox.position.set(0, 5.5, 0);
        gantry.add(signBox);

        this.scene.add(gantry);
        this.trackMeshes.push(gantry);
      }

      this.spawnEnvironmentProps(level, envInfo);
    }

    spawnEnvironmentProps(level, envInfo) {
      const propTypes = envInfo.props || ['pine_tree'];
      const count = Math.floor(level.roadLength / 18);

      for (let i = 0; i < count; i++) {
        const s = 15 + i * (level.roadLength / (count + 1));
        const frame = this.getTrackFrame(s);
        const sideSign = i % 2 === 0 ? 1 : -1;
        const distFromRoad = (this.ROAD_WIDTH / 2) + 4.0 + (i % 4) * 3;
        const propType = propTypes[i % propTypes.length];

        const propMesh = this.createPropMesh(propType);
        if (propMesh) {
          propMesh.position.copy(frame.center).addScaledVector(frame.right, sideSign * distFromRoad);
          propMesh.position.y = frame.center.y;
          this.scene.add(propMesh);
          this.props.push(propMesh);
        }
      }
    }

    createPropMesh(type) {
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
    // MISSIONS, COINS & INTERACTABLES
    // ------------------------------------------------------------------------
    spawnMissionEntities(level) {
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

      const lanes = [-3.4, 0, 3.4];
      for (let i = 0; i < totalCoins; i++) {
        const s = 25 + i * (level.roadLength / totalCoins);
        const laneOffset = lanes[i % lanes.length];
        const frame = this.getTrackFrame(s);

        const coin = new THREE.Mesh(coinGeo, coinMat);
        coin.position.copy(frame.center).addScaledVector(frame.right, laneOffset);
        coin.position.y += 0.85;
        this.scene.add(coin);

        this.coins.push({
          mesh: coin,
          collected: false,
          trackDist: s,
          lateralOffset: laneOffset
        });
      }

      if (level.missionType === 'passenger_pickup') {
        const stopDist = level.passengerStopDist;
        const stopFrame = this.getTrackFrame(stopDist);

        const zoneGeo = new THREE.BoxGeometry(4.5, 0.08, 14);
        const zoneMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b, transparent: true, opacity: 0.5 });
        this.passengerStopMesh = new THREE.Mesh(zoneGeo, zoneMat);
        this.passengerStopMesh.position.copy(stopFrame.center).addScaledVector(stopFrame.right, 3.4);
        this.passengerStopMesh.position.y += 0.06;
        this.passengerStopMesh.rotation.y = stopFrame.yaw;
        this.scene.add(this.passengerStopMesh);
        this.trackMeshes.push(this.passengerStopMesh);

        this.passengerObject = buildCartoonPassenger();
        this.passengerObject.position.copy(stopFrame.center).addScaledVector(stopFrame.right, 5.2);
        this.passengerObject.position.y += 0.1;
        this.passengerObject.rotation.y = stopFrame.yaw - Math.PI / 2;
        this.scene.add(this.passengerObject);
      }

      if (level.missionType === 'mountain_race') {
        const rivalColors = ['#ff3b30', '#007aff', '#af52de'];
        const rivalLanes = [-3.4, 3.4, 0.0];
        for (let r = 0; r < level.rivalCount; r++) {
          const rivalConfig = window.CAR_CONFIGS[(r + 1) % window.CAR_CONFIGS.length];
          const rivalCar = window.buildCarModel(rivalConfig, rivalColors[r]);
          this.scene.add(rivalCar.root);

          this.rivalCars.push({
            carData: rivalCar,
            speed: this.playerMaxSpeed * (0.84 + r * 0.05),
            dist: 15 + r * 12,
            lane: rivalLanes[r % rivalLanes.length]
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // SMART MULTI-LANE TRAFFIC SYSTEM
    // ------------------------------------------------------------------------
    spawnSmartTraffic(level) {
      const laneConfigs = [
        { offset: -3.4, dir: -1, baseSpeed: 14 },
        { offset: 0.0, dir: 1, baseSpeed: 16 },
        { offset: 3.4, dir: 1, baseSpeed: 19 }
      ];

      const trafficColors = ['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa', '#546e7a'];
      const totalVehicles = Math.min(18, Math.max(4, level.trafficCount));

      for (let i = 0; i < totalVehicles; i++) {
        const laneCfg = laneConfigs[i % laneConfigs.length];
        const carConfig = window.CAR_CONFIGS[(i + 1) % window.CAR_CONFIGS.length];
        const color = trafficColors[i % trafficColors.length];
        const trafficCar = window.buildCarModel(carConfig, color);
        this.scene.add(trafficCar.root);

        const dist = 70 + i * (level.roadLength / (totalVehicles + 1));
        const speed = laneCfg.baseSpeed + ((i % 3) - 1) * 2;

        this.trafficCars.push({
          carData: trafficCar,
          dist: dist,
          speed: speed,
          lane: laneCfg.offset,
          dir: laneCfg.dir
        });
      }
    }

    spawnObstacles(level) {
      for (let i = 0; i < level.speedBreakersCount; i++) {
        const dist = 70 + i * (level.roadLength / (level.speedBreakersCount + 1));
        const frame = this.getTrackFrame(dist);

        const bumpGeo = new THREE.CylinderGeometry(0.32, 0.32, this.ROAD_WIDTH - 2.0, 12);
        bumpGeo.rotateZ(Math.PI / 2);
        const bumpMat = new THREE.MeshStandardMaterial({ color: 0xffd600, roughness: 0.4 });
        const bump = new THREE.Mesh(bumpGeo, bumpMat);
        bump.position.copy(frame.center);
        bump.position.y += 0.16;
        bump.rotation.y = frame.yaw;
        this.scene.add(bump);

        this.obstacles.push({
          type: 'speed_breaker',
          mesh: bump,
          trackDist: dist,
          radius: 1.8
        });
      }

      for (let i = 0; i < level.potholesCount; i++) {
        const dist = 95 + i * (level.roadLength / (level.potholesCount + 1));
        const laneOffset = ((i % 3) - 1) * 3.4;
        const frame = this.getTrackFrame(dist);

        const holeGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 14);
        const holeMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.95 });
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.copy(frame.center).addScaledVector(frame.right, laneOffset);
        hole.position.y += 0.06;
        this.scene.add(hole);

        this.obstacles.push({
          type: 'pothole',
          mesh: hole,
          trackDist: dist,
          lateralOffset: laneOffset,
          radius: 1.3
        });
      }

      for (let i = 0; i < level.rocksCount; i++) {
        const dist = 85 + i * (level.roadLength / (level.rocksCount + 1));
        const laneOffset = ((i % 3) - 1) * 3.4;
        const frame = this.getTrackFrame(dist);

        const rockGeo = new THREE.DodecahedronGeometry(0.85);
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x616161, roughness: 0.9 });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.copy(frame.center).addScaledVector(frame.right, laneOffset);
        rock.position.y += 0.65;
        this.scene.add(rock);

        this.obstacles.push({
          type: 'rock',
          mesh: rock,
          trackDist: dist,
          lateralOffset: laneOffset,
          radius: 1.2
        });
      }

      for (let i = 0; i < level.animalsCount; i++) {
        const dist = 110 + i * (level.roadLength / (level.animalsCount + 1));
        const frame = this.getTrackFrame(dist);
        const animalMesh = this.buildCartoonAnimal(i % 2);
        const sideSign = i % 2 === 0 ? 1 : -1;
        animalMesh.position.copy(frame.center).addScaledVector(frame.right, sideSign * 4.6);
        this.scene.add(animalMesh);

        this.animatedAnimals.push({
          mesh: animalMesh,
          trackDist: dist,
          baseOffset: sideSign * 4.6,
          timeOffset: i * 1.5
        });
      }
    }

    buildCartoonAnimal(type) {
      const group = new THREE.Group();
      if (type === 0) {
        const woolMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
        const skinMat = new THREE.MeshStandardMaterial({ color: 0x212121 });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), woolMat);
        body.position.y = 0.7;
        group.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), skinMat);
        head.position.set(0, 0.95, 0.6);
        group.add(head);
      } else {
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

    // ------------------------------------------------------------------------
    // FIXED-TIMESTEP PHYSICS UPDATE (Guarantees Frame-rate Independence & Real Grip)
    // ------------------------------------------------------------------------
    physicsStep(dt) {
      this.input.update(dt);

      const isNitro = this.input.nitro && this.nitroLevel > 5;
      const topSpeed = isNitro ? this.playerMaxSpeed * this.playerNitroMult : this.playerMaxSpeed;
      const accelPower = isNitro ? this.playerAccel * 1.5 : this.playerAccel;

      if (isNitro) {
        this.nitroLevel = Math.max(0, this.nitroLevel - dt * 26);
      } else {
        this.nitroLevel = Math.min(100, this.nitroLevel + dt * 7);
      }

      // 1. Acceleration / Braking with Clear Forward & Reverse Separation
      if (this.input.gas) {
        this.gear = 'D';
        this.reverseHoldTime = 0;
        if (this.speed < 0) {
          // Brake out of reverse quickly
          this.speed += this.playerAccel * 3.2 * dt;
        } else {
          // Smooth progressive acceleration
          const speedRatio = Math.min(1.0, this.speed / topSpeed);
          const currentTorque = accelPower * (1.0 - speedRatio * 0.75);
          this.speed = Math.min(topSpeed, this.speed + currentTorque * dt);
        }
      } else if (this.input.brake) {
        if (this.speed > 0.3) {
          // Clean braking to complete stop
          this.speed = Math.max(0, this.speed - this.playerAccel * 2.8 * dt);
          this.reverseHoldTime = 0;
        } else {
          // When stopped, holding brake shifts to Reverse
          this.reverseHoldTime += dt;
          if (this.reverseHoldTime > 0.12) {
            this.gear = 'R';
            this.speed = Math.max(-7.0, this.speed - this.playerAccel * 0.8 * dt);
          } else {
            this.speed = 0;
            this.gear = 'N';
          }
        }
      } else {
        this.reverseHoldTime = 0;
        // Natural rolling resistance and aerodynamic drag
        if (this.speed > 0) {
          const drag = 8.0 + (this.speed / topSpeed) * 4.0;
          this.speed = Math.max(0, this.speed - drag * dt);
          this.gear = this.speed > 0.2 ? 'D' : 'N';
        } else if (this.speed < 0) {
          this.speed = Math.min(0, this.speed + 10.0 * dt);
          this.gear = this.speed < -0.2 ? 'R' : 'N';
        } else {
          this.gear = 'N';
        }
      }

      // 2. Controlled Steering & Real Lateral Gripping (No Sliding Ice Feel!)
      // Controlled lateral movement rate across lanes: 3.6 m/s
      const speedGripFactor = Math.min(1.0, Math.abs(this.speed) / 5.0);
      const driveDir = this.speed >= 0 ? 1.0 : -1.0;
      const targetLateralVel = this.input.steerValue * 3.6 * speedGripFactor * driveDir;

      // Tight lateral damping
      this.lateralVel += (targetLateralVel - this.lateralVel) * Math.min(1.0, dt * 10.0);

      // Advance along road track and across lanes
      this.trackDist += this.speed * dt;
      this.lateralOffset += this.lateralVel * dt;

      // 3. Visual Tilt Angle: Tilts naturally into turn with steering
      const targetRelAngle = (this.lateralVel / 3.6) * 0.22;
      this.relativeAngle += (targetRelAngle - this.relativeAngle) * Math.min(1.0, dt * 8.0);

      // 4. Strict Road Boundaries & Curbs Collision
      if (this.lateralOffset > this.LATERAL_LIMIT) {
        this.lateralOffset = this.LATERAL_LIMIT;
        this.lateralVel = -Math.abs(this.lateralVel) * 0.35;
        this.speed *= 0.9;
        this.suspensionBounce = 0.25;
        this.sound.playBarrierScrape();
      } else if (this.lateralOffset < -this.LATERAL_LIMIT) {
        this.lateralOffset = -this.LATERAL_LIMIT;
        this.lateralVel = Math.abs(this.lateralVel) * 0.35;
        this.speed *= 0.9;
        this.suspensionBounce = 0.25;
        this.sound.playBarrierScrape();
      }

      this.trackDist = Math.max(0, this.trackDist);

      // 5. Suspension Dynamics (Pitch on braking/gas, roll on steering)
      const targetPitch = (this.input.gas ? -0.05 : 0) + (this.input.brake ? 0.1 : 0) + (isNitro ? -0.08 : 0);
      const targetRoll = this.relativeAngle * 0.3;
      this.suspensionPitch += (targetPitch - this.suspensionPitch) * Math.min(1.0, dt * 10);
      this.suspensionRoll += (targetRoll - this.suspensionRoll) * Math.min(1.0, dt * 10);
      this.suspensionBounce = Math.max(0, this.suspensionBounce - dt * 3.5);

      // 6. Update 3D Car Position & Orientation
      const frame = this.getTrackFrame(this.trackDist);
      if (this.carInstance) {
        const carWorldPos = frame.center.clone().addScaledVector(frame.right, this.lateralOffset);
        carWorldPos.y += frame.normal.y * 0.05;
        this.carInstance.root.position.copy(carWorldPos);

        // Visual Heading = Road Tangent + Visual Turn Angle
        const carHeading = frame.yaw + this.relativeAngle;
        this.carInstance.root.rotation.y = carHeading;

        this.carInstance.chassis.rotation.x = this.suspensionPitch;
        this.carInstance.chassis.rotation.z = -this.suspensionRoll;
        this.carInstance.chassis.position.y = Math.sin(this.suspensionBounce * Math.PI) * 0.2;

        // Front wheels steering
        const wheelAngle = this.input.steerValue * 0.42;
        this.carInstance.frontWheelPivots.forEach((p) => {
          p.rotation.y = wheelAngle;
        });

        // Wheel Rotation with ground velocity
        const wheelSpin = (this.speed / 0.42) * dt;
        this.carInstance.wheels.forEach((w) => {
          w.mesh.rotation.x += wheelSpin;
        });

        // Brake lights
        if (this.carInstance.brakelightMaterial) {
          const isBraking = this.input.brake || this.speed < 0;
          this.carInstance.brakelightMaterial.emissiveIntensity = isBraking ? 2.8 : 0.4;
        }

        // Nitro flames
        this.carInstance.nitroFlames.forEach((flame) => {
          flame.visible = isNitro;
          if (isNitro) {
            flame.scale.set(1 + Math.random() * 0.4, 1 + Math.random() * 0.5, 1);
          }
        });

        // Driver reactions
        if (this.carInstance.driver) {
          const driverHead = this.carInstance.driver.head;
          const steeringWheel = this.carInstance.driver.steeringWheel;

          driverHead.rotation.y += (this.input.steerValue * 0.4 - driverHead.rotation.y) * Math.min(1.0, dt * 14);
          driverHead.rotation.x = this.suspensionPitch * 1.5;
          steeringWheel.rotation.z = -this.input.steerValue * 1.4;
        }
      }

      // Check Checkpoints & Objectives
      this.checkCheckpointsAndObjectives(dt);

      // Check Collisions & Traffic
      this.checkCollisions(dt);
      this.updateTrafficAndRivals(dt);

      // Countdown Timer
      this.timeRemaining -= dt;
      if (this.timeRemaining <= 0) {
        this.handleGameOver('Time Expired!');
        return;
      }

      // Check Finish Line
      if (this.trackDist >= this.trackLength) {
        this.handleLevelCompleted();
      }
    }

    // ------------------------------------------------------------------------
    // CHECKPOINTS & OBJECTIVE SEQUENCE CHECK
    // ------------------------------------------------------------------------
    checkCheckpointsAndObjectives(dt) {
      // Rotate Checkpoint Diamonds
      this.checkpoints.forEach((cp) => {
        if (cp.diamond) cp.diamond.rotation.y += dt * 2.5;
      });

      const currentObj = this.objectives[this.currentObjectiveIndex];
      if (!currentObj) return;

      // Distance to active checkpoint
      const distRemainingToObj = currentObj.dist - this.trackDist;

      // Reached Checkpoint condition
      if (distRemainingToObj <= 4.0 && distRemainingToObj >= -6.0) {
        if (currentObj.cpRef && !currentObj.cpRef.reached) {
          currentObj.cpRef.reached = true;
          // Trigger milestone completion!
          this.currentObjectiveIndex++;
          const nextObj = this.objectives[this.currentObjectiveIndex];
          if (nextObj) {
            this.triggerObjectiveComplete(nextObj.title);
            this.updateObjectiveUI();
          }
        }
      }
    }

    // ------------------------------------------------------------------------
    // COLLISION DETECTION & MISSIONS
    // ------------------------------------------------------------------------
    checkCollisions(dt) {
      // 1. Coins Collection
      this.coins.forEach((c) => {
        if (!c.collected && Math.abs(c.trackDist - this.trackDist) < 2.2) {
          if (Math.abs(c.lateralOffset - this.lateralOffset) < 1.8) {
            c.collected = true;
            c.mesh.visible = false;
            this.coinsCollectedThisRun++;
            this.data.coins += 1;
            this.sound.playCoinChime();
          }
        }
      });

      // 2. Obstacles
      this.obstacles.forEach((obs) => {
        if (Math.abs(obs.trackDist - this.trackDist) < 1.6) {
          if (obs.type === 'speed_breaker') {
            if (Math.abs(this.speed) > 6) {
              this.suspensionBounce = 0.45;
              this.speed *= 0.85;
              this.sound.playBarrierScrape();
            }
          } else if (obs.type === 'pothole') {
            if (Math.abs(obs.lateralOffset - this.lateralOffset) < 1.4) {
              this.speed *= 0.8;
              this.suspensionBounce = 0.3;
              this.takeDamage(6);
            }
          } else if (obs.type === 'rock') {
            if (Math.abs(obs.lateralOffset - this.lateralOffset) < 1.6) {
              this.takeDamage(18);
              this.speed *= -0.3;
              obs.lateralOffset += 20;
              obs.mesh.visible = false;
              this.sound.playCrash();
            }
          }
        }
      });

      // 3. Passenger Pickup
      if (this.currentLevel.missionType === 'passenger_pickup' && !this.passengerPickedUp) {
        const stopDist = this.currentLevel.passengerStopDist;
        if (Math.abs(this.trackDist - stopDist) < 6.0) {
          if (Math.abs(this.speed) < 3.0) {
            this.passengerPickedUp = true;
            this.triggerObjectiveComplete('Passenger Onboard! Deliver to Destination');
            if (this.currentObjectiveIndex === 1) {
              this.currentObjectiveIndex++;
              this.updateObjectiveUI();
            }
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

    // ------------------------------------------------------------------------
    // SMART TRAFFIC & RIVALS UPDATE
    // ------------------------------------------------------------------------
    updateTrafficAndRivals(dt) {
      this.trafficCars.forEach((t) => {
        t.dist += t.speed * t.dir * dt;

        if (t.dir > 0 && t.dist < this.trackDist - 60) {
          t.dist = this.trackDist + 100 + Math.random() * 80;
        } else if (t.dir < 0 && t.dist < this.trackDist - 40) {
          t.dist = this.trackDist + 120 + Math.random() * 90;
        }

        t.dist = Math.max(5, Math.min(this.trackLength - 10, t.dist));

        const tFrame = this.getTrackFrame(t.dist);
        t.carData.root.position.copy(tFrame.center).addScaledVector(tFrame.right, t.lane);
        t.carData.root.rotation.y = t.dir > 0 ? tFrame.yaw : tFrame.yaw + Math.PI;

        const tWheelSpin = (t.speed / 0.42) * dt * t.dir;
        t.carData.wheels.forEach((w) => { w.mesh.rotation.x += tWheelSpin; });

        if (Math.abs(t.dist - this.trackDist) < 3.2) {
          if (Math.abs(t.lane - this.lateralOffset) < 1.9) {
            this.lateralOffset += Math.sign(this.lateralOffset - t.lane) * 0.45;
            this.speed *= 0.55;
            this.takeDamage(16);
            this.sound.playCrash();
          }
        }
      });

      if (this.currentLevel.missionType === 'mountain_race') {
        let currentPos = 1;
        this.rivalCars.forEach((r) => {
          r.dist += r.speed * dt;
          r.dist = Math.min(this.trackLength, r.dist);

          const rFrame = this.getTrackFrame(r.dist);
          r.carData.root.position.copy(rFrame.center).addScaledVector(rFrame.right, r.lane);
          r.carData.root.rotation.y = rFrame.yaw;

          const rWheelSpin = (r.speed / 0.42) * dt;
          r.carData.wheels.forEach((w) => { w.mesh.rotation.x += rWheelSpin; });

          if (r.dist > this.trackDist) {
            currentPos++;
          }
        });
        this.racePosition = currentPos;
      }

      this.animatedAnimals.forEach((anim) => {
        const time = this.clock.getElapsedTime() + anim.timeOffset;
        anim.mesh.position.y = Math.abs(Math.sin(time * 5)) * 0.12;
      });
    }

    // ------------------------------------------------------------------------
    // SMOOTH CHASE CAMERA (Centered & Stable)
    // ------------------------------------------------------------------------
    updateCamera(dt, isNitro) {
      const frame = this.getTrackFrame(this.trackDist);
      const carWorldPos = frame.center.clone().addScaledVector(frame.right, this.lateralOffset);

      if (this.cameraMode === 0) {
        // 3RD PERSON CHASE CAMERA
        const fovTarget = isNitro ? 74 : 62;
        this.camera.fov += (fovTarget - this.camera.fov) * Math.min(1.0, dt * 6);
        this.camera.updateProjectionMatrix();

        const camDist = 6.4 + (Math.abs(this.speed) / this.playerMaxSpeed) * 1.5;
        const camHeight = 3.0;

        // Position camera directly behind car along road tangent with subtle lateral offset
        const targetCamPos = carWorldPos.clone()
          .addScaledVector(frame.tangent, -camDist)
          .add(new THREE.Vector3(0, camHeight, 0))
          .addScaledVector(frame.right, this.lateralOffset * 0.25);

        const camSmooth = 1.0 - Math.exp(-10.0 * dt);
        this.camPos.lerp(targetCamPos, camSmooth);
        this.camera.position.copy(this.camPos);

        // Look at point ahead on the highway
        const targetLookAt = carWorldPos.clone()
          .addScaledVector(frame.tangent, 14.0)
          .add(new THREE.Vector3(0, 1.2, 0));

        const lookSmooth = 1.0 - Math.exp(-12.0 * dt);
        this.camLookTarget.lerp(targetLookAt, lookSmooth);
        this.camera.lookAt(this.camLookTarget);

      } else if (this.cameraMode === 1) {
        // 1ST PERSON / COCKPIT CAMERA
        this.camera.fov = 76;
        this.camera.updateProjectionMatrix();

        const cockpitPos = carWorldPos.clone()
          .add(new THREE.Vector3(0, 1.2, 0))
          .addScaledVector(frame.right, -0.35);

        this.camera.position.copy(cockpitPos);

        const lookAtPt = cockpitPos.clone().addScaledVector(frame.tangent, 25);
        this.camera.lookAt(lookAtPt);

      } else {
        // TOP-DOWN ISOMETRIC CAMERA
        this.camera.fov = 54;
        this.camera.updateProjectionMatrix();

        const topPos = carWorldPos.clone()
          .addScaledVector(frame.tangent, -8)
          .add(new THREE.Vector3(0, 24, 0));

        this.camera.position.copy(topPos);
        this.camera.lookAt(carWorldPos.clone().addScaledVector(frame.tangent, 12));
      }
    }

    // ------------------------------------------------------------------------
    // HUD REFRESH & 3D WAYPOINT COMPASS
    // ------------------------------------------------------------------------
    updateHUD(speedKmH) {
      document.getElementById('hud-speed').textContent = speedKmH;
      document.getElementById('hud-speed-gear').textContent = this.gear;

      document.getElementById('hud-nitro-val').textContent = `${Math.round(this.nitroLevel)}%`;
      document.getElementById('hud-nitro-fill').style.width = `${Math.round(this.nitroLevel)}%`;
      document.getElementById('hud-health-val').textContent = `${Math.round(this.health)}%`;
      document.getElementById('hud-health-fill').style.width = `${Math.round(this.health)}%`;
      document.getElementById('hud-coins').textContent = this.data.coins;

      const mins = Math.floor(Math.max(0, this.timeRemaining) / 60);
      const secs = Math.floor(Math.max(0, this.timeRemaining) % 60);
      const timerEl = document.getElementById('hud-timer');
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (this.timeRemaining < 10) {
        timerEl.classList.add('urgent');
      } else {
        timerEl.classList.remove('urgent');
      }

      // Active Objective & Waypoint Arrow Pointer
      const currentObj = this.objectives[this.currentObjectiveIndex];
      if (currentObj) {
        const distRemaining = Math.max(0, Math.round(currentObj.dist - this.trackDist));
        document.getElementById('hud-mission-distance').textContent = `${distRemaining}m`;
        document.getElementById('hud-waypoint-text').textContent = `${distRemaining}m`;

        const arrowEl = document.getElementById('hud-waypoint-arrow');
        if (arrowEl && this.carInstance) {
          const targetPos = currentObj.cpRef ? currentObj.cpRef.group.position : this.getTrackFrame(currentObj.dist).center;
          const carPos = this.carInstance.root.position;
          const dx = targetPos.x - carPos.x;
          const dz = targetPos.z - carPos.z;
          const worldAngle = Math.atan2(dx, dz);
          let relAngle = worldAngle - this.carInstance.root.rotation.y;
          while (relAngle > Math.PI) relAngle -= Math.PI * 2;
          while (relAngle < -Math.PI) relAngle += Math.PI * 2;
          const deg = Math.round(relAngle * 180 / Math.PI);
          arrowEl.style.transform = `rotate(${deg}deg)`;
        }
      }
    }

    // ------------------------------------------------------------------------
    // LEVEL WIN & GAME OVER
    // ------------------------------------------------------------------------
    handleLevelCompleted() {
      this.isPlaying = false;
      this.sound.stopEngine();
      this.sound.playVictory();

      let stars = 1;
      const th = this.currentLevel.starsThresholds;
      const timeTaken = this.currentLevel.timeLimit - this.timeRemaining;

      if (timeTaken <= th.threeStarTime) stars++;
      if (this.coinsCollectedThisRun >= (this.currentLevel.targetCoins || 10)) stars++;
      stars = Math.min(3, Math.max(1, stars));

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

      document.getElementById('hud-overlay').classList.remove('active');
      document.getElementById('modal-victory').classList.add('active');

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
      document.getElementById('fail-reason').textContent = reason === 'Car Wrecked!' ? 'Your car suffered critical collision damage.' : 'Time ran out before reaching the destination.';
    }

    // ------------------------------------------------------------------------
    // MAIN ANIMATION LOOP
    // ------------------------------------------------------------------------
    animate() {
      requestAnimationFrame(this.animate);
      const rawDelta = Math.min(0.08, this.clock.getDelta());

      if (this.isPlaying && !this.isPaused) {
        this.physicsAccumulator += rawDelta;
        let steps = 0;
        while (this.physicsAccumulator >= this.FIXED_DT && steps < 5) {
          this.physicsStep(this.FIXED_DT);
          this.physicsAccumulator -= this.FIXED_DT;
          steps++;
        }

        const isNitro = this.input.nitro && this.nitroLevel > 5;
        this.updateCamera(rawDelta, isNitro);

        const speedKmH = Math.round(Math.abs(this.speed) * 3.6);
        this.sound.updateEngine(speedKmH, this.playerMaxSpeed * 3.6, this.input.gas || isNitro);
        this.updateHUD(speedKmH);

        this.renderer.render(this.scene, this.camera);
      }

      const garageModal = document.getElementById('modal-garage');
      if (garageModal && garageModal.classList.contains('active')) {
        if (this.garageCarGroup) {
          this.garageCarGroup.rotation.y += rawDelta * 0.7;
        }
        if (this.garageRenderer && this.garageScene && this.garageCamera) {
          this.garageRenderer.render(this.garageScene, this.garageCamera);
        }
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    new CarAdventureGame();
  });
})();
