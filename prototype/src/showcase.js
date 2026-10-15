import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
scene.fog = new T.Fog(0x0b1020, 20, 60);

const camera = new T.PerspectiveCamera(45, innerWidth / innerHeight, 0.01, 100);
camera.position.set(4, 3, 6);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const hemi = new T.HemisphereLight(0xffffff, 0x222233, 1.5);
scene.add(hemi);
const sun = new T.DirectionalLight(0xffffff, 2);
sun.position.set(5, 8, 5);
sun.castShadow = true;
scene.add(sun);

const ground = new T.Mesh(new T.PlaneGeometry(20, 20), new T.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const loader = new GLTFLoader();
const models = ['DamagedHelmet.glb', 'Buggy.glb', 'CesiumMilkTruck.glb'];
const names = ['Damaged Helmet', 'Buggy', 'Cesium Milk Truck'];
let current = null;

function loadModel(i) {
  if (current) scene.remove(current);
  current = null;
  document.getElementById('name').textContent = 'Loading…';
  loader.load(`/assets/showcase/${models[i]}`, (gltf) => {
    current = gltf.scene;
    const box = new T.Box3().setFromObject(current);
    const size = box.getSize(new T.Vector3());
    const center = box.getCenter(new T.Vector3());
    const scale = 2.5 / Math.max(size.x, size.y, size.z);
    current.scale.setScalar(scale);
    current.position.sub(center.multiplyScalar(scale));
    current.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    scene.add(current);
    document.getElementById('name').textContent = names[i];
  });
}

document.querySelectorAll('#controls button').forEach((btn, idx) => {
  btn.addEventListener('click', () => loadModel(idx));
});

loadModel(0);

function animate() {
  requestAnimationFrame(animate);
  if (current) current.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
