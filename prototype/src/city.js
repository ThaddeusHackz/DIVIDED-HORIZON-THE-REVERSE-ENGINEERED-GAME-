import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const viewport = document.getElementById('viewport');
const renderer = new T.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.toneMapping = T.ACESFilmicToneMapping;
viewport.appendChild(renderer.domElement);

const scene = new T.Scene();
scene.background = new T.Color(0x0b1020);
scene.fog = new T.Fog(0x0b1020, 80, 260);

const camera = new T.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 500);
camera.position.set(90, 70, 90);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

const hemi = new T.HemisphereLight(0x6aa8ff, 0x1a1f2e, 1.4);
scene.add(hemi);
const sun = new T.DirectionalLight(0xffe6c2, 2.2);
sun.position.set(60, 90, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

// Ground
const ground = new T.Mesh(new T.PlaneGeometry(400, 400), new T.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Roads
const roadMat = new T.MeshStandardMaterial({ color: 0x0f1320, roughness: 0.9 });
for (let i = -5; i <= 5; i++) {
  const h = new T.Mesh(new T.PlaneGeometry(400, 12), roadMat);
  h.rotation.x = -Math.PI / 2; h.position.set(0, 0.02, i * 36); scene.add(h);
  const v = new T.Mesh(new T.PlaneGeometry(12, 400), roadMat);
  v.rotation.x = -Math.PI / 2; v.position.set(i * 36, 0.02, 0); scene.add(v);
}

// Buildings
const buildingMat = new T.MeshStandardMaterial({ color: 0x2a3350, roughness: 0.7, metalness: 0.2 });
const windowMat = new T.MeshStandardMaterial({ color: 0x6aa8ff, emissive: 0x6aa8ff, emissiveIntensity: 1.2 });
let buildingCount = 0;
for (let x = -180; x <= 180; x += 24) {
  for (let z = -180; z <= 180; z += 24) {
    if (Math.abs(x) < 18 && Math.abs(z) < 18) continue;
    if (Math.random() < 0.35) continue;
    const w = 10 + Math.random() * 12;
    const d = 10 + Math.random() * 12;
    const h = 15 + Math.random() * 90;
    const b = new T.Mesh(new T.BoxGeometry(w, h, d), buildingMat);
    b.position.set(x + (Math.random() - 0.5) * 6, h / 2, z + (Math.random() - 0.5) * 6);
    b.castShadow = true; b.receiveShadow = true;
    scene.add(b);
    buildingCount++;
    // windows
    const win = new T.Mesh(new T.PlaneGeometry(w * 0.6, h * 0.7), windowMat);
    win.position.set(b.position.x, b.position.y, b.position.z + d / 2 + 0.1);
    scene.add(win);
  }
}

// Cars
const carMat = new T.MeshStandardMaterial({ color: 0xd94a3a, metalness: 0.6, roughness: 0.3 });
const cars = [];
const playerCar = new T.Mesh(new T.BoxGeometry(4, 1.4, 2), new T.MeshStandardMaterial({ color: 0x3a7bd9, metalness: 0.6, roughness: 0.3 }));
playerCar.position.set(0, 0.7, 0);
playerCar.castShadow = true;
scene.add(playerCar);
const player = { mesh: playerCar, speed: 0, angle: 0, maxSpeed: 40 };
const keys = new Set();
addEventListener('keydown', (e) => keys.add(e.code));
addEventListener('keyup', (e) => keys.delete(e.code));
for (let i = 0; i < 39; i++) {
  const car = new T.Mesh(new T.BoxGeometry(4, 1.4, 2), carMat);
  car.position.set((Math.random() - 0.5) * 300, 0.7, (Math.random() - 0.5) * 300);
  car.castShadow = true;
  scene.add(car);
  cars.push({ mesh: car, speed: 20 + Math.random() * 30, axis: Math.random() > 0.5 ? 'x' : 'z', dir: Math.random() > 0.5 ? 1 : -1 });
}

// Street lights
const lightMat = new T.MeshStandardMaterial({ color: 0xffd27f, emissive: 0xffd27f, emissiveIntensity: 2 });
for (let i = -5; i <= 5; i++) {
  for (let j = -5; j <= 5; j++) {
    if (i === 0 && j === 0) continue;
    const pole = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 12), new T.MeshStandardMaterial({ color: 0x444 }));
    pole.position.set(i * 36, 6, j * 36);
    scene.add(pole);
    const lamp = new T.Mesh(new T.SphereGeometry(0.8, 8, 6), lightMat);
    lamp.position.set(i * 36, 12, j * 36);
    scene.add(lamp);
  }
}

const stats = document.getElementById('stats');
stats.textContent = `${buildingCount} buildings · ${cars.length + 1} vehicles · WASD to drive the blue car`;

function animate() {
  requestAnimationFrame(animate);
  for (const c of cars) {
    if (c.axis === 'x') { c.mesh.position.x += c.speed * c.dir * 0.016; if (Math.abs(c.mesh.position.x) > 190) c.dir *= -1; }
    else { c.mesh.position.z += c.speed * c.dir * 0.016; if (Math.abs(c.mesh.position.z) > 190) c.dir *= -1; }
  }
  // player car
  if (keys.has('KeyW')) player.speed = Math.min(player.maxSpeed, player.speed + 0.8);
  else if (keys.has('KeyS')) player.speed = Math.max(-player.maxSpeed * 0.5, player.speed - 0.8);
  else player.speed *= 0.96;
  if (keys.has('KeyA')) player.angle += 0.03 * (Math.abs(player.speed) / player.maxSpeed + 0.3);
  if (keys.has('KeyD')) player.angle -= 0.03 * (Math.abs(player.speed) / player.maxSpeed + 0.3);
  player.mesh.position.x += Math.sin(player.angle) * player.speed * 0.016;
  player.mesh.position.z += Math.cos(player.angle) * player.speed * 0.016;
  player.mesh.rotation.y = player.angle;
  camera.position.x = player.mesh.position.x - Math.sin(player.angle) * 18;
  camera.position.z = player.mesh.position.z - Math.cos(player.angle) * 18;
  camera.position.y = 12;
  camera.lookAt(player.mesh.position);
  controls.target.copy(player.mesh.position);
  controls.update();
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
