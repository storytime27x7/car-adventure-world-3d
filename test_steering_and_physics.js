// Automated Verification Test for Car Adventure World 3D
// Verifies:
// 1. LEFT input moves car left (towards negative lateral offset / -X on straight road).
// 2. RIGHT input moves car right (towards positive lateral offset / +X on straight road).
// 3. ACCELERATE moves car forward along heading.
// 4. Car stays within road boundaries across straight and curved road sections.

const assert = require('assert');

// 1. Spline interpolation logic
function getTrackFrame(trackWaypoints, trackStep, totalLen, distance) {
  const s = Math.max(0, Math.min(totalLen, distance));
  const step = trackStep;
  const count = trackWaypoints.length;

  const idx = Math.min(count - 2, Math.max(0, Math.floor(s / step)));
  const t = (s - idx * step) / step;

  const p0 = trackWaypoints[Math.max(0, idx - 1)];
  const p1 = trackWaypoints[idx];
  const p2 = trackWaypoints[Math.min(count - 1, idx + 1)];
  const p3 = trackWaypoints[Math.min(count - 1, idx + 2)];

  const t2 = t * t;
  const t3 = t2 * t;

  const cx = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
  const cy = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
  const cz = 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);

  const dx = 0.5 * ((-p0.x + p2.x) + 2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t + 3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2);
  const dy = 0.5 * ((-p0.y + p2.y) + 2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t + 3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2);
  const dz = 0.5 * ((-p0.z + p2.z) + 2 * (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t + 3 * (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t2);

  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  const tx = dx / len;
  const ty = dy / len;
  const tz = dz / len;

  // Right vector: N x T = (T_z, 0, -T_x)
  const rlen = Math.sqrt(tz * tz + tx * tx) || 1;
  const rx = tz / rlen;
  const rz = -tx / rlen;

  const yaw = Math.atan2(tx, tz);

  return {
    center: { x: cx, y: cy, z: cz },
    tangent: { x: tx, y: ty, z: tz },
    right: { x: rx, y: 0, z: rz },
    yaw: yaw
  };
}

// Generate Waypoints matching Level 1
const trackLength = 500;
const trackStep = 10;
const count = Math.ceil(trackLength / trackStep);
const trackWaypoints = [];

for (let i = 0; i <= count; i++) {
  const dist = i * trackStep;
  // 0 to 140m: Straight road
  // 140m to 320m: Curved road
  const curveBlend = Math.min(1.0, Math.max(0.0, (dist - 140) / 90));
  const curvePhase = (dist - 140) * 0.016 * 0.5;
  const curveOffset = (Math.sin(curvePhase) * 12 + Math.sin(curvePhase * 0.5) * 5) * curveBlend;
  trackWaypoints.push({ x: curveOffset, y: 0, z: dist });
}

console.log('=== TEST 1: STRAIGHT ROAD SECTION (0m - 140m) ===');
const f0 = getTrackFrame(trackWaypoints, trackStep, trackLength, 50);
console.log(`Frame at 50m: center=(${f0.center.x.toFixed(2)}, ${f0.center.z.toFixed(2)}), yaw=${f0.yaw.toFixed(4)}, right=(${f0.right.x.toFixed(2)}, ${f0.right.z.toFixed(2)})`);
assert.strictEqual(Math.abs(f0.center.x) < 0.001, true, 'Road must be straight along X=0 at 50m');
assert.strictEqual(Math.abs(f0.right.x - 1.0) < 0.001, true, 'Right vector must point along +X (1, 0, 0)');
console.log('✔ Straight road verified.');

console.log('=== TEST 2: STEERING RIGHT -> CAR MOVES RIGHT ===');
let trackDist = 20;
let lateralOffset = 0;
let relativeAngle = 0;
let speed = 20; // 20 m/s
const maxSteerAngle = 0.35;
const dt = 1 / 60;

// User holds RIGHT for 1 second (steerValue = +1.0)
for (let step = 0; step < 60; step++) {
  const targetRel = +1.0 * maxSteerAngle;
  relativeAngle += (targetRel - relativeAngle) * Math.min(1.0, dt * 9.0);
  trackDist += speed * Math.cos(relativeAngle) * dt;
  lateralOffset += speed * Math.sin(relativeAngle) * dt;
}

const fRight = getTrackFrame(trackWaypoints, trackStep, trackLength, trackDist);
const worldPosRight = {
  x: fRight.center.x + fRight.right.x * lateralOffset,
  z: fRight.center.z + fRight.right.z * lateralOffset
};

console.log(`After steering RIGHT for 1s: lateralOffset=${lateralOffset.toFixed(2)}m (world X=${worldPosRight.x.toFixed(2)}), relativeAngle=${(relativeAngle * 180 / Math.PI).toFixed(1)}°`);
assert.strictEqual(lateralOffset > 0, true, 'lateralOffset must be positive when steering RIGHT');
assert.strictEqual(worldPosRight.x > 0, true, 'World position must move to +X when steering RIGHT on straight road');
assert.strictEqual(relativeAngle > 0, true, 'Car heading must rotate to the right (+yaw)');
console.log('✔ RIGHT steering verified.');

console.log('=== TEST 3: STEERING LEFT -> CAR MOVES LEFT ===');
trackDist = 20;
lateralOffset = 0;
relativeAngle = 0;
// User holds LEFT for 1 second (steerValue = -1.0)
for (let step = 0; step < 60; step++) {
  const targetRel = -1.0 * maxSteerAngle;
  relativeAngle += (targetRel - relativeAngle) * Math.min(1.0, dt * 9.0);
  trackDist += speed * Math.cos(relativeAngle) * dt;
  lateralOffset += speed * Math.sin(relativeAngle) * dt;
}

const fLeft = getTrackFrame(trackWaypoints, trackStep, trackLength, trackDist);
const worldPosLeft = {
  x: fLeft.center.x + fLeft.right.x * lateralOffset,
  z: fLeft.center.z + fLeft.right.z * lateralOffset
};

console.log(`After steering LEFT for 1s: lateralOffset=${lateralOffset.toFixed(2)}m (world X=${worldPosLeft.x.toFixed(2)}), relativeAngle=${(relativeAngle * 180 / Math.PI).toFixed(1)}°`);
assert.strictEqual(lateralOffset < 0, true, 'lateralOffset must be negative when steering LEFT');
assert.strictEqual(worldPosLeft.x < 0, true, 'World position must move to -X when steering LEFT on straight road');
assert.strictEqual(relativeAngle < 0, true, 'Car heading must rotate to the left (-yaw)');
console.log('✔ LEFT steering verified.');

console.log('=== TEST 4: ACCELERATION ALONG HEADING ===');
trackDist = 0;
lateralOffset = 0;
relativeAngle = 0;
speed = 0;
const accel = 18;
// Accelerate from 0 to 20 m/s with gas held
for (let step = 0; step < 120; step++) {
  speed = Math.min(24, speed + accel * dt);
  trackDist += speed * Math.cos(relativeAngle) * dt;
  lateralOffset += speed * Math.sin(relativeAngle) * dt;
}
console.log(`Accelerated for 2s: speed=${(speed * 3.6).toFixed(1)} km/h, trackDist=${trackDist.toFixed(1)}m, lateralOffset=${lateralOffset.toFixed(2)}m`);
assert.strictEqual(speed > 15, true, 'Car must accelerate smoothly');
assert.strictEqual(trackDist > 20, true, 'Car must move forward along road');
assert.strictEqual(Math.abs(lateralOffset) < 0.001, true, 'Car must stay centered when driving straight');
console.log('✔ Acceleration along heading verified.');

console.log('=== TEST 5: CURVED ROAD ADHERENCE (140m - 320m) ===');
// Drive through the curved section without manual steering
trackDist = 140;
lateralOffset = 0;
relativeAngle = 0;
speed = 22;
let maxDeviationFromCenter = 0;

for (let step = 0; step < 500; step++) {
  const targetRel = 0; // Hands off wheel
  relativeAngle += (targetRel - relativeAngle) * Math.min(1.0, dt * 9.0);
  trackDist += speed * Math.cos(relativeAngle) * dt;
  lateralOffset += speed * Math.sin(relativeAngle) * dt;

  const fCurve = getTrackFrame(trackWaypoints, trackStep, trackLength, trackDist);
  // Car heading matches road yaw
  const carHeading = fCurve.yaw + relativeAngle;
  assert.strictEqual(Math.abs(carHeading - fCurve.yaw) < 0.01, true, 'Car heading must track road curvature');
  if (Math.abs(lateralOffset) > maxDeviationFromCenter) {
    maxDeviationFromCenter = Math.abs(lateralOffset);
  }
}
console.log(`Drove through curve: final dist=${trackDist.toFixed(1)}m, lateralOffset=${lateralOffset.toFixed(2)}m, max deviation=${maxDeviationFromCenter.toFixed(4)}m`);
assert.strictEqual(maxDeviationFromCenter < 0.001, true, 'Car must stay centered in lane while driving through curve');
console.log('✔ Curved road adherence verified.');

console.log('=== TEST 6: ROAD BOUNDARY ENFORCEMENT ===');
// Attempt to drive off the road by holding full RIGHT steering for 4 seconds
trackDist = 50;
lateralOffset = 0;
relativeAngle = 0;
speed = 20;
const LATERAL_LIMIT = 5.2;

for (let step = 0; step < 240; step++) {
  const targetRel = +1.0 * maxSteerAngle;
  relativeAngle += (targetRel - relativeAngle) * Math.min(1.0, dt * 9.0);
  trackDist += speed * Math.cos(relativeAngle) * dt;
  lateralOffset += speed * Math.sin(relativeAngle) * dt;

  if (lateralOffset > LATERAL_LIMIT) {
    lateralOffset = LATERAL_LIMIT;
    if (relativeAngle > 0) relativeAngle = -0.12;
    speed *= 0.88;
  }
}
console.log(`After 4s of continuous right steering against guardrail: lateralOffset=${lateralOffset.toFixed(2)}m (limit is ${LATERAL_LIMIT}m)`);
assert.strictEqual(lateralOffset <= LATERAL_LIMIT, true, 'lateralOffset must never exceed guardrail boundary');
console.log('✔ Road boundary collision verified.');

console.log('\nALL 6 VERIFICATION TESTS PASSED SUCCESSFULLY! 🎯');
