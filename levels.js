// ============================================================================
// CAR ADVENTURE WORLD 3D - 100 UNIQUE LEVELS & ENVIRONMENT GENERATOR
// ============================================================================

window.ENVIRONMENTS = {
  city: {
    id: 'city',
    name: 'Metro Skyline',
    skyColor: 0x87ceeb,
    fogColor: 0xb0e0e6,
    fogDensity: 0.0035,
    groundColor: 0x546e7a,
    roadColor: 0x263238,
    curbColor: 0xeeeeee,
    ambientLight: 0xffffff,
    ambientIntensity: 0.65,
    sunLight: 0xfffaed,
    sunIntensity: 1.1,
    sunPos: [80, 120, 60],
    props: ['skyscraper', 'streetlight', 'hydrant', 'crosswalk'],
    description: 'Bustling downtown avenues with towering glass skyscrapers and high-speed avenues.'
  },
  village: {
    id: 'village',
    name: 'Sunny Farmstead',
    skyColor: 0x64b5f6,
    fogColor: 0xb3e5fc,
    fogDensity: 0.003,
    groundColor: 0x7cb342,
    roadColor: 0x4e342e,
    curbColor: 0x8d6e63,
    ambientLight: 0xfff9c4,
    ambientIntensity: 0.7,
    sunLight: 0xfff176,
    sunIntensity: 1.2,
    sunPos: [60, 100, 80],
    props: ['cottage', 'windmill', 'fence', 'haystack', 'apple_tree'],
    description: 'Peaceful rolling country meadows, quaint cottages, and rustic wooden fences.'
  },
  mountains: {
    id: 'mountains',
    name: 'Alpine Peak Highway',
    skyColor: 0x4fc3f7,
    fogColor: 0xcfe8fc,
    fogDensity: 0.003,
    groundColor: 0x5d4037,
    roadColor: 0x37474f,
    curbColor: 0x90a4ae,
    ambientLight: 0xffffff,
    ambientIntensity: 0.65,
    sunLight: 0xfff8e1,
    sunIntensity: 1.15,
    sunPos: [100, 140, 50],
    props: ['rock_boulder', 'pine_tree', 'cliff_wall', 'guardrail'],
    description: 'Steep serpentine climbs, dramatic rocky cliff drop-offs, and crisp alpine air.'
  },
  river: {
    id: 'river',
    name: 'Blue Rapids Valley',
    skyColor: 0x81d4fa,
    fogColor: 0xb3e5fc,
    fogDensity: 0.004,
    groundColor: 0x43a047,
    roadColor: 0x2e383f,
    curbColor: 0x80cbc4,
    ambientLight: 0xe0f7fa,
    ambientIntensity: 0.7,
    sunLight: 0xffecb3,
    sunIntensity: 1.2,
    sunPos: [50, 110, 90],
    hasWater: true,
    props: ['water_river', 'willow_tree', 'river_pier', 'reed_bush'],
    description: 'A scenic highway hugging roaring turquoise riverbanks and riverside vistas.'
  },
  bridge: {
    id: 'bridge',
    name: 'Grand Suspension Skybridge',
    skyColor: 0xf39c12,
    fogColor: 0xf5b041,
    fogDensity: 0.003,
    groundColor: 0x1a5276,
    roadColor: 0x212f3d,
    curbColor: 0xc0392b,
    ambientLight: 0xfed330,
    ambientIntensity: 0.6,
    sunLight: 0xf39c12,
    sunIntensity: 1.3,
    sunPos: [-70, 60, -90],
    isBridge: true,
    hasWater: true,
    props: ['bridge_tower', 'suspension_cables', 'steel_railing', 'water_below'],
    description: 'Magnificent golden suspension bridges soaring hundreds of meters above ocean waves.'
  },
  flyover: {
    id: 'flyover',
    name: 'Elevated Metro Express',
    skyColor: 0x1a237e,
    fogColor: 0x283593,
    fogDensity: 0.004,
    groundColor: 0x102027,
    roadColor: 0x1c2833,
    curbColor: 0x00e5ff,
    ambientLight: 0x7986cb,
    ambientIntensity: 0.6,
    sunLight: 0x80d8ff,
    sunIntensity: 1.0,
    sunPos: [30, 90, 70],
    isElevated: true,
    props: ['concrete_pillar', 'highway_sign', 'light_gantry', 'city_backdrop'],
    description: 'High-speed elevated skyway weaving between towering downtown skyscrapers.'
  },
  tunnel: {
    id: 'tunnel',
    name: 'Echo Mountain Cavern',
    skyColor: 0x0d1117,
    fogColor: 0x161b22,
    fogDensity: 0.008,
    groundColor: 0x212529,
    roadColor: 0x1a1a1a,
    curbColor: 0xffd600,
    ambientLight: 0x37474f,
    ambientIntensity: 0.4,
    sunLight: 0xffab00,
    sunIntensity: 0.4,
    sunPos: [0, 50, 0],
    isTunnel: true,
    props: ['tunnel_arch', 'tube_light', 'emergency_box', 'rocky_ceiling'],
    description: 'Subterranean dual-arch mountain tunnels with glowing neon tubes and roaring echoes.'
  },
  snow: {
    id: 'snow',
    name: 'Frosty Glacier Run',
    skyColor: 0xb0bec5,
    fogColor: 0xdce775,
    fogDensity: 0.005,
    groundColor: 0xf5f5f5,
    roadColor: 0x90a4ae,
    curbColor: 0x4fc3f7,
    ambientLight: 0xe1f5fe,
    ambientIntensity: 0.75,
    sunLight: 0xffffff,
    sunIntensity: 1.1,
    sunPos: [90, 110, 40],
    props: ['snow_pine', 'snowman', 'ice_drift', 'snow_bank'],
    description: 'Sub-zero snowy roads with slippery ice patches and frosty evergreen forests.'
  },
  desert: {
    id: 'desert',
    name: 'Canyon Dune Mirage',
    skyColor: 0xffb74d,
    fogColor: 0xffcc80,
    fogDensity: 0.0035,
    groundColor: 0xd7ccc8,
    roadColor: 0x6d4c41,
    curbColor: 0xffe082,
    ambientLight: 0xffe0b2,
    ambientIntensity: 0.7,
    sunLight: 0xff9800,
    sunIntensity: 1.35,
    sunPos: [80, 140, 30],
    props: ['saguaro_cactus', 'sand_dune', 'desert_rock', 'skull_rock'],
    description: 'Blazing desert dunes, towering saguaro cacti, and red-rock canyon narrows.'
  },
  forest: {
    id: 'forest',
    name: 'Enchanted Redwood Woods',
    skyColor: 0x4db6ac,
    fogColor: 0x80cbc4,
    fogDensity: 0.0045,
    groundColor: 0x2e7d32,
    roadColor: 0x3e2723,
    curbColor: 0xaed581,
    ambientLight: 0xc8e6c9,
    ambientIntensity: 0.65,
    sunLight: 0xfff59d,
    sunIntensity: 1.0,
    sunPos: [40, 100, 60],
    props: ['redwood_tree', 'giant_mushroom', 'fallen_log', 'mossy_rock'],
    description: 'Dense ancient redwood groves with dappled sunlight filtering through green canopies.'
  }
};

window.MISSION_TYPES = {
  coin_collection: {
    id: 'coin_collection',
    name: 'Coin Rush',
    icon: '🪙',
    desc: 'Collect required gold coins before reaching the finish line!'
  },
  passenger_pickup: {
    id: 'passenger_pickup',
    name: 'Passenger Taxi',
    icon: '🚕',
    desc: 'Stop at the passenger stop to pick up the traveler, then deliver them safely!'
  },
  fuel_delivery: {
    id: 'fuel_delivery',
    name: 'Fuel Delivery',
    icon: '⛽',
    desc: 'Deliver fuel canisters to the destination before your tank runs dry!'
  },
  mountain_race: {
    id: 'mountain_race',
    name: 'Mountain Race',
    icon: '🏁',
    desc: 'Race against rival cartoon cars! Overtake them and finish 1st!'
  },
  bridge_crossing: {
    id: 'bridge_crossing',
    name: 'Bridge Crossing',
    icon: '🌉',
    desc: 'Cross the elevated bridge avoiding heavy oncoming traffic and speed breakers!'
  },
  time_challenge: {
    id: 'time_challenge',
    name: 'Time Challenge',
    icon: '⏱️',
    desc: 'Beat the aggressive clock by hitting boost pads and nitro rings!'
  }
};

// ----------------------------------------------------------------------------
// 100 LEVEL PROCEDURAL GENERATION
// ----------------------------------------------------------------------------
const envKeys = Object.keys(window.ENVIRONMENTS);
const missionKeys = Object.keys(window.MISSION_TYPES);

// Seeded pseudo-random generator for 100% reproducible levels
function createSeededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const LEVEL_TITLES = [
  'City Awakening', 'Meadow Morning', 'Alpine First Steps', 'River Breeze',
  'Skyline Highway', 'High Suspension', 'Cavern Passage', 'Frosty Foothills',
  'Red Sand Cruise', 'Redwood Trails', 'Downtown Rush', 'Windmill Ridge',
  'Cliffhanger Curves', 'Waterfront Run', 'Golden Overpass', 'Echo Depths',
  'Glacier Drift', 'Canyon Crossing', 'Canopy Sprint', 'Metro Expressway',
  'Orchard Valley', 'Mountain Slopes', 'Rapid Waters', 'High Bridge Rush',
  'Tunnel of Lights', 'Snowy Serpentines', 'Dune Runner', 'Deep Timber',
  'Skyscraper Climb', 'Farmstead Hurdles', 'Summit Pass', 'Emerald River',
  'Arch Bridge Dash', 'Skyway Flyover', 'Subterranean Chasm', 'Blizzard Peak',
  'Mirage Canyon', 'Mossy Redwood', 'Neon Boulevard', 'Country Byway',
  'Rocky Ridge', 'Riverbend Drift', 'Suspension Gale', 'Metro Flyover',
  'Granite Tunnel', 'Frozen Lake Run', 'Dust Devil Road', 'Forest Glade',
  'Central City Loop', 'Harvest Meadows', 'Alpine Apex', 'Cascading Waters',
  'Harbor Bridge', 'Elevated Express', 'Stalactite Pass', 'Winter Crest',
  'Scorching Sands', 'Ancient Pines', 'Midnight City', 'Cottage Country',
  'Twin Peaks', 'River Gorge', 'Golden Span', 'Skyway Interchange',
  'Dark Cavern Run', 'Snowstorm Valley', 'Desert Monolith', 'Whispering Woods',
  'Grand City Sprint', 'Country Fairway', 'Eagle Ridge', 'Blue Lagoon Road',
  'Grand Suspension', 'Elevated Circuit', 'Crystal Tunnel', 'Frostbite Highway',
  'Oasis Run', 'Redwood Sanctuary', 'Cyber City Metro', 'Valley Crossing',
  'Highland Crest', 'Rapids Overlook', 'Mega Bridge', 'Skyway Overpass',
  'Magma Cavern', 'Arctic Passage', 'Canyon Crucible', 'Ancient Grove',
  'Metropolis Grand', 'Farmfield Finale', 'Apex Mountain', 'River Delta',
  'Titan Bridge', 'High Altitude Flyover', 'The Great Cavern', 'Glacier Gauntlet',
  'Sahara Sprint', 'Enchanted Timberland', 'Ultimate Adventure World Cup'
];

window.LEVELS = [];

for (let i = 1; i <= 100; i++) {
  const rng = createSeededRandom(i * 997 + 1337);

  // Cycle through environments and mission types systematically
  const envIndex = (i - 1) % envKeys.length;
  const envKey = envKeys[envIndex];

  // Specific missions mapping
  let missionKey = missionKeys[(i - 1) % missionKeys.length];
  // If bridge env, high chance of bridge_crossing
  if (envKey === 'bridge' && i % 2 === 0) missionKey = 'bridge_crossing';
  if (envKey === 'mountains' && i % 3 === 0) missionKey = 'mountain_race';

  // Long tracks: length scales progressively from 500m to 1600m
  const baseLength = 500 + Math.floor((i / 100) * 900) + Math.floor(rng() * 200);
  const roadLength = Math.min(1600, baseLength);

  // Road curves and hills
  const curvatureScale = 0.5 + (i / 100) * 0.9;
  const hillScale = 0.4 + (i / 100) * 0.8;

  // Obstacle counts scale with level
  const speedBreakersCount = Math.floor(3 + (i / 100) * 8 + rng() * 3);
  const potholesCount = Math.floor(2 + (i / 100) * 7 + rng() * 3);
  const rocksCount = Math.floor(2 + (i / 100) * 9 + rng() * 4);
  const trafficCount = Math.floor(3 + (i / 100) * 12 + rng() * 4);
  const animalsCount = Math.floor(2 + (i / 100) * 6 + rng() * 3);

  // Coins along the track
  const totalCoinsAvailable = Math.floor(roadLength / 18);
  const targetCoins = Math.max(10, Math.floor(totalCoinsAvailable * (0.45 + rng() * 0.25)));

  // Target completion time (generous enough for fun, tight for 3 stars)
  const averageSpeed = 24; // meters per second approx
  const estimatedTimeSec = Math.round(roadLength / averageSpeed) + 12;
  const timeLimit = missionKey === 'time_challenge' ? Math.round(estimatedTimeSec * 1.05) : Math.round(estimatedTimeSec * 1.4);

  // Rivals for mountain race
  const rivalCount = missionKey === 'mountain_race' ? Math.min(3, 2 + (i > 30 ? 1 : 0)) : 0;

  // Passenger stop location (e.g. at 35% of track)
  const passengerStopDist = Math.round(roadLength * (0.3 + rng() * 0.15));

  // Fuel capacity / pickup count
  const fuelPickupsCount = missionKey === 'fuel_delivery' ? Math.floor(roadLength / 220) : 0;

  // 3-Star threshold targets
  const starsThresholds = {
    threeStarTime: Math.round(estimatedTimeSec * 0.95),
    twoStarTime: Math.round(estimatedTimeSec * 1.15),
    minCoinsForBonusStar: Math.floor(totalCoinsAvailable * 0.65),
    maxDamageForBonusStar: 20
  };

  const levelObj = {
    levelNumber: i,
    title: `Level ${i}: ${LEVEL_TITLES[i - 1] || 'Great Adventure'}`,
    environment: envKey,
    missionType: missionKey,
    roadLength: roadLength,
    timeLimit: timeLimit,
    curvatureScale: curvatureScale,
    hillScale: hillScale,
    speedBreakersCount: speedBreakersCount,
    potholesCount: potholesCount,
    rocksCount: rocksCount,
    trafficCount: trafficCount,
    animalsCount: animalsCount,
    totalCoins: totalCoinsAvailable,
    targetCoins: targetCoins,
    rivalCount: rivalCount,
    passengerStopDist: passengerStopDist,
    fuelPickupsCount: fuelPickupsCount,
    starsThresholds: starsThresholds,
    coinReward: 80 + i * 25,
    seed: i * 997 + 1337
  };

  window.LEVELS.push(levelObj);
}

// Function to fetch level by 1-indexed number
window.getLevel = function (levelNum) {
  const index = Math.max(1, Math.min(100, levelNum)) - 1;
  return window.LEVELS[index];
};
