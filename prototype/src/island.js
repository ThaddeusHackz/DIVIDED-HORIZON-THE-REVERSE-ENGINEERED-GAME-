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
scene.background = new T.Color(0x87b5d6);
scene.fog = new T.Fog(0x87b5d6, 120, 320);

const camera = new T.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 500);
camera.position.set(120, 90, 120);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

const hemi = new T.HemisphereLight(0xbfe3ff, 0x2a4a2a, 1.6);
scene.add(hemi);
const sun = new T.DirectionalLight(0xffe6c2, 2.4);
sun.position.set(80, 100, 60);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

// Ocean
const ocean = new T.Mesh(new T.PlaneGeometry(600, 600), new T.MeshStandardMaterial({ color: 0x1f6f8b, roughness: 0.3, metalness: 0.2 }));
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -2;
scene.add(ocean);

// Island terrain (simple displaced plane)
const size = 120, seg = 60;
const geo = new T.PlaneGeometry(size, size, seg, seg);
const pos = geo.attributes.position;
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i), z = pos.getY(i);
  const r = Math.sqrt(x * x + z * z);
  const h = Math.max(0, (1 - r / (size / 2)) * 28 + Math.sin(x * 0.1) * 4 + Math.cos(z * 0.12) * 3);
  pos.setZ(i, r > size / 2 - 4 ? 0 : h);
}
geo.computeVertexNormals();
const terrainMat = new T.MeshStandardMaterial({ color: 0x3a6b3a, roughness: 0.9 });
const terrain = new T.Mesh(geo, terrainMat);
terrain.rotation.x = -Math.PI / 2;
terrain.receiveShadow = true;
terrain.castShadow = true;
scene.add(terrain);

// Trees
const trunkMat = new T.MeshStandardMaterial({ color: 0x4a3320 });
const leafMat = new T.MeshStandardMaterial({ color: 0x2d5a2d });
for (let i = 0; i < 300; i++) {
  const x = (Math.random() - 0.5) * size * 0.8;
  const z = (Math.random() - 0.5) * size * 0.8;
  if (Math.sqrt(x * x + z * z) > size / 2 - 8) continue;
  const h = 4 + Math.random() * 6;
  const trunk = new T.Mesh(new T.CylinderGeometry(0.3, 0.4, h), trunkMat);
  trunk.position.set(x, h / 2, z);
  scene.add(trunk);
  const leaves = new T.Mesh(new T.ConeGeometry(2 + Math.random() * 2, 5 + Math.random() * 4, 6), leafMat);
  leaves.position.set(x, h + 2, z);
  leaves.castShadow = true;
  scene.add(leaves);
}

// Outpost
const bunkerMat = new T.MeshStandardMaterial({ color: 0x6b6b5a });
const bunker = new T.Mesh(new T.BoxGeometry(18, 6, 12), bunkerMat);
bunker.position.set(20, 3, 10);
bunker.castShadow = true;
scene.add(bunker);
const tower = new T.Mesh(new T.CylinderGeometry(1, 1, 18), bunkerMat);
tower.position.set(30, 9, 10);
tower.castShadow = true;
scene.add(tower);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
