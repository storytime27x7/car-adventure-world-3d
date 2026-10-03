// ============================================================================
// CAR ADVENTURE WORLD 3D - CAR MODELS & PROCEDURAL 3D BUILDERS
// ============================================================================

window.CAR_CONFIGS = [
  {
    id: 'beetle',
    name: 'Bumblebug Compact',
    type: 'Classic Compact',
    desc: 'Agile, friendly, and handles tight city corners with ease.',
    price: 0, // Unlocked by default
    baseColor: '#ffcc00',
    stats: {
      speed: 22,
      accel: 18,
      handling: 2.8,
      nitro: 2.0,
      suspension: 2.2
    },
    maxStats: {
      speed: 34,
      accel: 30,
      handling: 3.8,
      nitro: 3.6,
      suspension: 3.5
    },
    scale: 1.0
  },
  {
    id: 'roadster',
    name: 'Speedy Fox Roadster',
    type: 'Sport Convertible',
    desc: 'High aerodynamic speed with an open cockpit and roaring twin exhausts.',
    price: 350,
    baseColor: '#ff3b30',
    stats: {
      speed: 28,
      accel: 24,
      handling: 2.5,
      nitro: 2.5,
      suspension: 2.0
    },
    maxStats: {
      speed: 40,
      accel: 36,
      handling: 3.5,
      nitro: 4.2,
      suspension: 3.2
    },
    scale: 1.05
  },
  {
    id: 'monster',
    name: 'Giga 4x4 Crusher',
    type: 'Off-Road Monster',
    desc: 'Huge suspension travel and massive tires that shrug off rocks and speed bumps.',
    price: 750,
    baseColor: '#34c759',
    stats: {
      speed: 20,
      accel: 22,
      handling: 2.2,
      nitro: 2.2,
      suspension: 4.0
    },
    maxStats: {
      speed: 32,
      accel: 34,
      handling: 3.2,
      nitro: 3.8,
      suspension: 5.0
    },
    scale: 1.2
  },
  {
    id: 'muscle',
    name: 'Thunder V8 Muscle',
    type: 'Retro Muscle',
    desc: 'Raw horsepower with a hood supercharger and thunderous straight-line speed.',
    price: 1200,
    baseColor: '#ff9500',
    stats: {
      speed: 30,
      accel: 26,
      handling: 2.3,
      nitro: 3.0,
      suspension: 2.3
    },
    maxStats: {
      speed: 44,
      accel: 38,
      handling: 3.3,
      nitro: 4.6,
      suspension: 3.6
    },
    scale: 1.1
  },
  {
    id: 'cyber',
    name: 'Neon Phantom Cyber',
    type: 'Hyper Racer',
    desc: 'Futuristic hypercar equipped with ultra-boost nitro and precision steering.',
    price: 2000,
    baseColor: '#af52de',
    stats: {
      speed: 34,
      accel: 30,
      handling: 3.2,
      nitro: 4.0,
      suspension: 2.5
    },
    maxStats: {
      speed: 48,
      accel: 42,
      handling: 4.0,
      nitro: 5.0,
      suspension: 3.8
    },
    scale: 1.08
  },
  {
    id: 'camper',
    name: 'Adventure Van',
    type: 'Expedition Cruiser',
    desc: 'Sturdy van equipped for long mountain treks, bridges, and passenger pickups.',
    price: 1600,
    baseColor: '#00c7be',
    stats: {
      speed: 24,
      accel: 20,
      handling: 2.4,
      nitro: 2.8,
      suspension: 3.4
    },
    maxStats: {
      speed: 36,
      accel: 32,
      handling: 3.4,
      nitro: 4.0,
      suspension: 4.4
    },
    scale: 1.15
  }
];

window.AVAILABLE_PAINTS = [
  { name: 'Sunburst Yellow', hex: '#ffcc00' },
  { name: 'Hot Rod Red', hex: '#ff3b30' },
  { name: 'Viper Green', hex: '#34c759' },
  { name: 'Ocean Blue', hex: '#007aff' },
  { name: 'Neon Purple', hex: '#af52de' },
  { name: 'Sunset Orange', hex: '#ff9500' },
  { name: 'Cyan Teal', hex: '#00c7be' },
  { name: 'Candy Pink', hex: '#ff2d55' },
  { name: 'Midnight Dark', hex: '#1c1c1e' },
  { name: 'Arctic White', hex: '#f2f2f7' }
];

// Helper to create glossy cartoon car materials
function createCarMaterial(colorHex, roughness = 0.35, metalness = 0.2) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: roughness,
    metalness: metalness
  });
}

// ----------------------------------------------------------------------------
// DRIVER CHARACTER GENERATOR
// ----------------------------------------------------------------------------
function buildCartoonDriver() {
  const driverGroup = new THREE.Group();
  driverGroup.name = 'driver';

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.6 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.5 });
  const capMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.5 });
  const visorMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.4 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 });
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  // Body / Torso
  const torsoGeo = new THREE.BoxGeometry(0.52, 0.45, 0.35);
  const torso = new THREE.Mesh(torsoGeo, shirtMat);
  torso.position.set(0, 0.22, 0);
  torso.castShadow = true;
  driverGroup.add(torso);

  // Seat belt strap across chest
  const strapGeo = new THREE.BoxGeometry(0.54, 0.08, 0.37);
  const strapMat = new THREE.MeshStandardMaterial({ color: 0x212121 });
  const strap = new THREE.Mesh(strapGeo, strapMat);
  strap.rotation.z = 0.45;
  strap.position.set(0, 0.22, 0);
  driverGroup.add(strap);

  // Driver Head Pivot (for turning head when steering!)
  const headPivot = new THREE.Group();
  headPivot.name = 'driverHead';
  headPivot.position.set(0, 0.52, 0.02);

  // Head
  const headGeo = new THREE.SphereGeometry(0.24, 16, 14);
  headGeo.scale(1.0, 1.08, 0.95);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.castShadow = true;
  headPivot.add(head);

  // Hair rim
  const hairGeo = new THREE.SphereGeometry(0.25, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.rotation.x = -0.3;
  hair.position.set(0, 0.02, -0.02);
  headPivot.add(hair);

  // Baseball Cap
  const capGeo = new THREE.SphereGeometry(0.255, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.set(0, 0.05, 0);
  headPivot.add(cap);

  // Cap Visor (pointing forward)
  const visorGeo = new THREE.BoxGeometry(0.28, 0.035, 0.24);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 0.12, 0.22);
  visor.rotation.x = -0.15;
  headPivot.add(visor);

  // Eyes (Big expressive cartoon eyes)
  [-0.085, 0.085].forEach((x) => {
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), eyeWhiteMat);
    eyeWhite.position.set(x, 0.03, 0.19);
    eyeWhite.scale.set(1, 1.2, 0.4);
    headPivot.add(eyeWhite);

    const eyePupil = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 6), eyePupilMat);
    eyePupil.position.set(x, 0.03, 0.22);
    eyePupil.scale.set(1, 1, 0.25);
    headPivot.add(eyePupil);
  });

  // Cute cartoon nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), skinMat);
  nose.position.set(0, -0.03, 0.22);
  headPivot.add(nose);

  driverGroup.add(headPivot);

  // Left Arm and Hand on Steering Wheel
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.32), shirtMat);
  leftArm.position.set(-0.24, 0.28, 0.16);
  leftArm.rotation.set(Math.PI / 4, 0, -Math.PI / 6);
  driverGroup.add(leftArm);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
  leftHand.position.set(-0.16, 0.28, 0.32);
  driverGroup.add(leftHand);

  // Right Arm and Hand
  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.32), shirtMat);
  rightArm.position.set(0.24, 0.28, 0.16);
  rightArm.rotation.set(Math.PI / 4, 0, Math.PI / 6);
  driverGroup.add(rightArm);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
  rightHand.position.set(0.16, 0.28, 0.32);
  driverGroup.add(rightHand);

  // Steering Wheel
  const steeringWheelGroup = new THREE.Group();
  steeringWheelGroup.name = 'steeringWheel';
  steeringWheelGroup.position.set(0, 0.28, 0.34);

  const ringGeo = new THREE.TorusGeometry(0.18, 0.028, 8, 20);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
  const wheelRing = new THREE.Mesh(ringGeo, ringMat);
  steeringWheelGroup.add(wheelRing);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12), ringMat);
  hub.rotation.x = Math.PI / 2;
  steeringWheelGroup.add(hub);

  const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.025, 0.02), ringMat);
  steeringWheelGroup.add(spoke1);

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), ringMat);
  column.rotation.x = Math.PI / 4;
  column.position.set(0, -0.1, -0.1);
  steeringWheelGroup.add(column);

  driverGroup.add(steeringWheelGroup);

  return {
    group: driverGroup,
    head: headPivot,
    steeringWheel: steeringWheelGroup,
    leftHand: leftHand,
    rightHand: rightHand
  };
}

// ----------------------------------------------------------------------------
// PASSENGER CHARACTER BUILDER (for Passenger Pickup Missions!)
// ----------------------------------------------------------------------------
function buildCartoonPassenger() {
  const passengerGroup = new THREE.Group();
  passengerGroup.name = 'passenger';

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5cda7, roughness: 0.6 });
  const dressMat = new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.5 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.7 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.42, 0.32), dressMat);
  torso.position.set(0, 0.21, 0);
  passengerGroup.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), skinMat);
  head.position.set(0, 0.5, 0);
  passengerGroup.add(head);

  // Ponytail hair
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.23, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat);
  hair.position.set(0, 0.55, -0.04);
  passengerGroup.add(hair);

  const ponytail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 8), hairMat);
  ponytail.rotation.x = -Math.PI / 2.5;
  ponytail.position.set(0, 0.52, -0.22);
  passengerGroup.add(ponytail);

  // Cute suitcase
  const suitcaseMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
  const suitcase = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.42), suitcaseMat);
  suitcase.position.set(0.35, 0.16, 0);
  passengerGroup.add(suitcase);

  return passengerGroup;
}

// ----------------------------------------------------------------------------
// PROCEDURAL WHEEL BUILDER
// ----------------------------------------------------------------------------
function buildWheel(radius = 0.42, width = 0.32, isMonster = false) {
  const wheelGroup = new THREE.Group();

  // Tire rubber
  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 18);
  tireGeo.rotateZ(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1f2022,
    roughness: 0.85,
    metalness: 0.1
  });
  const tire = new THREE.Mesh(tireGeo, tireMat);
  tire.castShadow = true;
  wheelGroup.add(tire);

  // Tire treads if monster
  if (isMonster) {
    const treadMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const tread = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.08, 0.08), treadMat);
      tread.position.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
      tread.rotation.x = angle;
      wheelGroup.add(tread);
    }
  }

  // Wheel Rim
  const rimRadius = radius * (isMonster ? 0.55 : 0.65);
  const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, width * 1.02, 14);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({
    color: isMonster ? 0xffcc00 : 0xe0e0e0,
    roughness: 0.3,
    metalness: 0.7
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  wheelGroup.add(rim);

  // Center Cap & Lug Nuts
  const capGeo = new THREE.CylinderGeometry(rimRadius * 0.35, rimRadius * 0.35, width * 1.08, 10);
  capGeo.rotateZ(Math.PI / 2);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.4, metalness: 0.6 });
  const centerCap = new THREE.Mesh(capGeo, capMat);
  wheelGroup.add(centerCap);

  return wheelGroup;
}

// ----------------------------------------------------------------------------
// FULL 3D CAR PROCEDURAL ASSEMBLER
// ----------------------------------------------------------------------------
window.buildCarModel = function (carConfig, paintColorHex) {
  const root = new THREE.Group();
  root.name = 'carRoot_' + carConfig.id;

  const bodyMat = createCarMaterial(paintColorHex || carConfig.baseColor);
  const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.6 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.2, metalness: 0.8 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x81d4fa,
    transparent: true,
    opacity: 0.42,
    roughness: 0.1,
    transmission: 0.6,
    thickness: 0.2
  });

  // Emissive Lights Materials
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfff4cc,
    emissiveIntensity: 1.0,
    roughness: 0.1
  });
  const brakelightMat = new THREE.MeshStandardMaterial({
    color: 0xff1744,
    emissive: 0x7a0000,
    emissiveIntensity: 0.5,
    roughness: 0.2
  });

  // Chassis Group (Pitches, rolls and bobs with suspension & G-forces!)
  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'chassis';
  root.add(chassisGroup);

  // Store references for dynamic gameplay animation
  const carRefs = {
    root: root,
    chassis: chassisGroup,
    bodyMaterial: bodyMat,
    brakelightMaterial: brakelightMat,
    headlightMaterial: headlightMat,
    wheels: [],
    frontWheelPivots: [],
    headlights: [],
    nitroFlames: [],
    driver: null,
    passengerSeat: null
  };

  const id = carConfig.id;

  // -------------------------------------------------------------
  // CAR BODY MESHES BY MODEL
  // -------------------------------------------------------------
  if (id === 'beetle') {
    // Cute rounded compact beetle
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 3.4), bodyMat);
    lowerBody.position.set(0, 0.45, 0);
    lowerBody.castShadow = true;
    chassisGroup.add(lowerBody);

    // Rounded Cabin
    const cabin = new THREE.Mesh(new THREE.SphereGeometry(1.05, 16, 12), bodyMat);
    cabin.scale.set(0.85, 0.72, 1.25);
    cabin.position.set(0, 0.85, -0.15);
    cabin.castShadow = true;
    chassisGroup.add(cabin);

    // Front curved hood
    const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.88, 1.1, 14), bodyMat);
    hood.rotation.x = Math.PI / 2;
    hood.scale.set(1.0, 0.5, 0.9);
    hood.position.set(0, 0.48, 1.2);
    chassisGroup.add(hood);

    // Windshield & Windows
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 0.08), glassMat);
    windshield.position.set(0, 0.95, 0.55);
    windshield.rotation.x = -0.55;
    chassisGroup.add(windshield);

    const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 0.08), glassMat);
    rearWindow.position.set(0, 0.92, -0.85);
    rearWindow.rotation.x = 0.55;
    chassisGroup.add(rearWindow);

    // Chrome Bumpers
    const frontBumper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.9, 8), chromeMat);
    frontBumper.rotation.z = Math.PI / 2;
    frontBumper.position.set(0, 0.28, 1.75);
    chassisGroup.add(frontBumper);

    const rearBumper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.9, 8), chromeMat);
    rearBumper.rotation.z = Math.PI / 2;
    rearBumper.position.set(0, 0.28, -1.75);
    chassisGroup.add(rearBumper);

  } else if (id === 'roadster') {
    // Sleek low-slung convertible sports car
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.48, 3.8), bodyMat);
    mainBody.position.set(0, 0.4, 0);
    mainBody.castShadow = true;
    chassisGroup.add(mainBody);

    // Slanted Hood
    const hoodWedge = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.22, 1.5), bodyMat);
    hoodWedge.position.set(0, 0.54, 1.05);
    hoodWedge.rotation.x = -0.08;
    chassisGroup.add(hoodWedge);

    // Low aerodynamic windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.42, 0.06), glassMat);
    windshield.position.set(0, 0.8, 0.4);
    windshield.rotation.x = -0.7;
    chassisGroup.add(windshield);

    // Roll Bar / Headrest Pods
    [-0.38, 0.38].forEach((x) => {
      const rollBar = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 14, Math.PI), chromeMat);
      rollBar.position.set(x, 0.78, -0.45);
      chassisGroup.add(rollBar);
    });

    // Rear Spoiler
    const spoilerWing = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 0.35), darkTrimMat);
    spoilerWing.position.set(0, 0.82, -1.8);
    chassisGroup.add(spoilerWing);

    [-0.55, 0.55].forEach((x) => {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.12), darkTrimMat);
      stand.position.set(x, 0.7, -1.8);
      chassisGroup.add(stand);
    });

  } else if (id === 'monster') {
    // High-riding 4x4 Truck with giant roll cage and roof lightbar
    const truckBed = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.75, 3.7), bodyMat);
    truckBed.position.set(0, 0.85, 0);
    truckBed.castShadow = true;
    chassisGroup.add(truckBed);

    // Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1.8), bodyMat);
    cab.position.set(0, 1.5, 0.1);
    chassisGroup.add(cab);

    // Cab Windows
    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.58, 0.06), glassMat);
    frontWindshield.position.set(0, 1.55, 1.02);
    frontWindshield.rotation.x = -0.28;
    chassisGroup.add(frontWindshield);

    // Giant Front Bullbar
    const bullBar = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 16, Math.PI), darkTrimMat);
    bullBar.rotation.x = Math.PI / 2;
    bullBar.position.set(0, 0.65, 1.95);
    chassisGroup.add(bullBar);

    // Roof Light Bar (4 glowing round foglamps)
    [-0.5, -0.16, 0.16, 0.5].forEach((x) => {
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 10), headlightMat);
      lamp.rotation.x = Math.PI / 2;
      lamp.position.set(x, 1.98, 0.4);
      chassisGroup.add(lamp);
    });

  } else if (id === 'muscle') {
    // Classic aggressive boxy muscle car with giant hood blower
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.58, 4.0), bodyMat);
    lowerBody.position.set(0, 0.48, 0);
    chassisGroup.add(lowerBody);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.52, 1.9), bodyMat);
    roof.position.set(0, 0.98, -0.25);
    chassisGroup.add(roof);

    // Windows
    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.06), glassMat);
    frontWindshield.position.set(0, 0.95, 0.75);
    frontWindshield.rotation.x = -0.52;
    chassisGroup.add(frontWindshield);

    // Hood Supercharger / Blower Scoop!
    const blowerBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.6), chromeMat);
    blowerBase.position.set(0, 0.85, 1.1);
    chassisGroup.add(blowerBase);

    // Triple intake butterflies
    [-0.12, 0, 0.12].forEach((x) => {
      const intake = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8), darkTrimMat);
      intake.rotation.x = Math.PI / 2;
      intake.position.set(x, 0.94, 1.42);
      chassisGroup.add(intake);
    });

    // Dual racing stripes on hood
    [-0.22, 0.22].forEach((x) => {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 3.8), darkTrimMat);
      stripe.position.set(x, 0.78, 0);
      chassisGroup.add(stripe);
    });

  } else if (id === 'cyber') {
    // Futuristic hypercar with sharp geometric angles and neon accents
    const bodyWedge = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 4.2, 5), bodyMat);
    bodyWedge.rotation.y = Math.PI / 5;
    bodyWedge.rotation.z = Math.PI / 2;
    bodyWedge.scale.set(0.45, 1.0, 0.95);
    bodyWedge.position.set(0, 0.45, 0);
    chassisGroup.add(bodyWedge);

    // Panoramic Dome Cockpit
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 12), glassMat);
    dome.scale.set(0.8, 0.55, 1.4);
    dome.position.set(0, 0.72, -0.1);
    chassisGroup.add(dome);

    // Neon Edge Ribbons
    const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    [-0.85, 0.85].forEach((x) => {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 3.2), neonMat);
      blade.position.set(x, 0.35, 0);
      chassisGroup.add(blade);
    });

    // Twin Cyber Fins
    [-0.7, 0.7].forEach((x) => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 0.8), darkTrimMat);
      fin.position.set(x, 0.82, -1.6);
      fin.rotation.z = (x > 0 ? -1 : 1) * 0.2;
      chassisGroup.add(fin);
    });

  } else if (id === 'camper') {
    // Retro adventure van with luggage rack and surfboard
    const vanBody = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.35, 3.8), bodyMat);
    vanBody.position.set(0, 0.95, 0);
    chassisGroup.add(vanBody);

    // Two-tone white roof
    const roofWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.4 });
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.35, 3.82), roofWhiteMat);
    roof.position.set(0, 1.7, 0);
    chassisGroup.add(roof);

    // Large Front Windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.65, 0.08), glassMat);
    windshield.position.set(0, 1.25, 1.92);
    chassisGroup.add(windshield);

    // Side Windows
    [-0.96, 0.96].forEach((x) => {
      const sideWin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.48, 2.6), glassMat);
      sideWin.position.set(x, 1.25, -0.2);
      chassisGroup.add(sideWin);
    });

    // Roof Luggage Rack
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x455a64 });
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 2.2), rackMat);
    rack.position.set(0, 1.94, -0.4);
    chassisGroup.add(rack);

    // Colorful Surfboard on top
    const surfboardMat = new THREE.MeshStandardMaterial({ color: 0xff5722, roughness: 0.3 });
    const surfboard = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 2.4, 8), surfboardMat);
    surfboard.scale.set(1.0, 0.15, 1.0);
    surfboard.rotation.x = Math.PI / 2;
    surfboard.position.set(0.3, 2.05, -0.4);
    chassisGroup.add(surfboard);
  }

  // -------------------------------------------------------------
  // HEADLIGHTS & BRAKE LIGHTS
  // -------------------------------------------------------------
  const headlightZ = id === 'muscle' || id === 'cyber' ? 2.0 : id === 'van' ? 1.92 : 1.72;
  const headlightY = id === 'monster' ? 0.9 : 0.48;
  const headlightSpacing = id === 'monster' ? 0.72 : 0.65;

  [-headlightSpacing, headlightSpacing].forEach((x) => {
    // Casing
    const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 12), darkTrimMat);
    casing.rotation.x = Math.PI / 2;
    casing.position.set(x, headlightY, headlightZ);
    chassisGroup.add(casing);

    // Glowing Lens
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.14, 12), headlightMat);
    lens.position.set(x, headlightY, headlightZ + 0.07);
    chassisGroup.add(lens);

    // Spot light beam casting forward
    const spotLight = new THREE.SpotLight(0xfff8e7, 1.5, 32, Math.PI / 6, 0.4);
    spotLight.position.set(x, headlightY, headlightZ + 0.1);
    const targetObj = new THREE.Object3D();
    targetObj.position.set(x, 0, headlightZ + 15);
    chassisGroup.add(targetObj);
    spotLight.target = targetObj;
    chassisGroup.add(spotLight);
    carRefs.headlights.push(spotLight);
  });

  // Brake Lights at the rear
  const rearZ = id === 'muscle' || id === 'cyber' ? -2.0 : -1.75;
  const rearY = id === 'monster' ? 0.9 : 0.48;

  [-0.68, 0.68].forEach((x) => {
    const rearLens = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.08), brakelightMat);
    rearLens.position.set(x, rearY, rearZ);
    chassisGroup.add(rearLens);
  });

  // Dual Exhaust Pipes & Nitro Emitters
  [-0.45, 0.45].forEach((x) => {
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.25, 10), chromeMat);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(x, 0.25, rearZ - 0.08);
    chassisGroup.add(exhaust);

    // Nitro Flame Cone Mesh (hidden until nitro active)
    const flameGeo = new THREE.ConeGeometry(0.12, 0.75, 8);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.9
    });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(x, 0.25, rearZ - 0.48);
    flame.visible = false;
    chassisGroup.add(flame);
    carRefs.nitroFlames.push(flame);
  });

  // -------------------------------------------------------------
  // DRIVER CHARACTER PLACEMENT (Visible inside car cabin!)
  // -------------------------------------------------------------
  const driverData = buildCartoonDriver();
  const driverY = id === 'monster' ? 1.05 : id === 'camper' ? 0.65 : 0.35;
  const driverZ = id === 'roadster' ? -0.1 : id === 'camper' ? 0.55 : 0.0;
  // Left-hand drive seat
  driverData.group.position.set(-0.38, driverY, driverZ);
  driverData.group.scale.set(0.9, 0.9, 0.9);
  chassisGroup.add(driverData.group);
  carRefs.driver = driverData;

  // Passenger Seat Node (ready for Passenger missions)
  const passengerSeat = new THREE.Group();
  passengerSeat.name = 'passengerSeat';
  passengerSeat.position.set(0.38, driverY, driverZ);
  chassisGroup.add(passengerSeat);
  carRefs.passengerSeat = passengerSeat;

  // -------------------------------------------------------------
  // WHEELS & SUSPENSION SETUP
  // -------------------------------------------------------------
  const isMonster = id === 'monster';
  const wheelRadius = isMonster ? 0.62 : 0.42;
  const wheelWidth = isMonster ? 0.48 : 0.32;
  const halfTrackWidth = isMonster ? 1.15 : 0.96;
  const wheelbaseFrontZ = isMonster ? 1.35 : 1.15;
  const wheelbaseRearZ = isMonster ? -1.35 : -1.15;
  const wheelHubY = wheelRadius;

  // Wheel positions: FrontLeft, FrontRight, RearLeft, RearRight
  const wheelDefs = [
    { x: -halfTrackWidth, y: wheelHubY, z: wheelbaseFrontZ, isFront: true, isLeft: true },
    { x: halfTrackWidth, y: wheelHubY, z: wheelbaseFrontZ, isFront: true, isLeft: false },
    { x: -halfTrackWidth, y: wheelHubY, z: wheelbaseRearZ, isFront: false, isLeft: true },
    { x: halfTrackWidth, y: wheelHubY, z: wheelbaseRearZ, isFront: false, isLeft: false }
  ];

  wheelDefs.forEach((wDef) => {
    // Suspension Mount Anchor on Root
    const suspensionPivot = new THREE.Group();
    suspensionPivot.position.set(wDef.x, wDef.y, wDef.z);
    root.add(suspensionPivot);

    let steerPivot = suspensionPivot;
    if (wDef.isFront) {
      // Front wheel steers left/right on Y axis
      const steeringPivot = new THREE.Group();
      steeringPivot.name = wDef.isLeft ? 'steerPivot_FL' : 'steerPivot_FR';
      suspensionPivot.add(steeringPivot);
      carRefs.frontWheelPivots.push(steeringPivot);
      steerPivot = steeringPivot;
    }

    // Wheel Mesh that rotates on X axis with velocity
    const wheelMesh = buildWheel(wheelRadius, wheelWidth, isMonster);
    if (!wDef.isLeft) {
      wheelMesh.rotation.y = Math.PI; // Face outwards
    }
    steerPivot.add(wheelMesh);

    carRefs.wheels.push({
      mesh: wheelMesh,
      pivot: suspensionPivot,
      isFront: wDef.isFront,
      baseY: wheelHubY,
      targetY: wheelHubY,
      currentY: wheelHubY
    });
  });

  return carRefs;
};
