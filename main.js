import * as THREE from 'three';
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from './node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { config, initializeConfig, getConfig, loadModules, loadResources, finalizeSetup } from './init.js';
import { addDynamicLight } from './utils/lights.js';
import { lightTypes } from './config/lights.js';
import { debugLog } from './utils/debug.js';
import 'jquery';
import 'bootstrap';
import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const bodyElement = document.querySelector('body');
initializeConfig(bodyElement);
const { DEBUG, currentProduct, modelExists } = getConfig();

window.THREE = THREE;
let version = 0.4;
if(DEBUG) {
  version = new Date().getTime();
}
let renderer, scene, camera;
let updateInfoPanel, initEventListeners;
let setupEventListeners;
let controls;

loadModules(version).then(() => {
	debugLog('Imports erfolgreich');
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	scene = new THREE.Scene();
	camera = config.setupCamera(THREE);
        
	const orbitControls = new OrbitControls(camera, renderer.domElement);

        controls = config.setupPointerLockControls(camera, renderer);
	scene.add(controls.getObject());
	
	const gui = new dat.GUI();
	const lightFolder = gui.addFolder('Lichtquellen');
	const objFolder = gui.addFolder('Objekte');
	
	const initialHemiLight = config.addLight(gui, lightFolder, scene, 'HemisphereLight', { lightName: 'Hemisphere', intensity: 0.1 });
	const initialPointLight1 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:2,y:2,z:0}, color: '0xFFD700', intensity: 1.0, distance: 10, decay: 2, castShadow: true });
	const initialPointLight2 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:0,y:2,z:2}, color: '0x00D7FF', intensity: 1.0, distance: 10, decay: 2 });
	const initialPointLight3 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:-2,y:1,z:0}, color: '0xD75555', intensity: 1.0, distance: 10, decay: 2 });
	const initialSpot = config.addLight(gui, lightFolder, scene, 'SpotLight', { position: {x:0,y:2,z:0}, color: '0xAAAAAA', intensity: 0.5, distance: 30, decay: 2 });
	loadResources(scene, camera, renderer);
	config.setupEventListeners(camera, scene, gui, lightFolder, addDynamicLight);
	config.initEventListeners(camera);

	lightFolder.open();

// Sonne
const sunGeometry = new THREE.SphereGeometry(10000, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

const light = new THREE.PointLight(0xffffff);
light.position.set(0, 0, 0);
sun.add(light);

// Erde und Raum
const earthGroup = new THREE.Group();
const earthGeometry = new THREE.SphereGeometry(1000, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.position.set(72000,72000,72000);
earthGroup.add(earth);

const roomGeometry = new THREE.BoxGeometry(10, 10, 10);
const roomMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const room = new THREE.Mesh(roomGeometry, roomMaterial);
room.position.set(0, 0, 1000);
earthGroup.add(room);

const sunGroup = new THREE.Group();
sunGroup.add(sun);
sunGroup.add(earthGroup);

scene.add(sunGroup);
console.log('sun added');

        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.MeshStandardMaterial({color: 0xA0AAA0, side: THREE.DoubleSide});
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = Math.PI / 2;
        scene.add(floor);

	const loader = new FontLoader();
	loader.load('./node_modules/three/examples/fonts/optimer_regular.typeface.json', function (font) {
		for (let i = -10; i <= 10; i++) {
			// Für die X-Achse
			const textGeomX = new TextGeometry(String(i), {
				font: font,
				size: 0.5,
				height: 0.1
			});
			const textMeshX = new THREE.Mesh(textGeomX, new THREE.MeshBasicMaterial({ color: 0xffffff }));
			textMeshX.position.set(i, 0, -10.5);
			scene.add(textMeshX);
	
			// Für die Z-Achse
			const textGeomZ = new TextGeometry(String(i), {
				font: font,
				size: 0.5,
				height: 0.1
			});
			const textMeshZ = new THREE.Mesh(textGeomZ, new THREE.MeshBasicMaterial({ color: 0xffffff }));
			textMeshZ.position.set(-10.5, 0, i);
			scene.add(textMeshZ);
		}
	});

	const gridSize = 10;
	const gridDivisions = 10;
	const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);

	scene.add(gridHelper);

	rendering(renderer, scene, camera);
});

function rendering(renderer, scene, camera) {
  requestAnimationFrame(() => rendering(renderer, scene, camera));
  config.updatePointerLockControls(controls);
  config.updateInfoPanel(camera);  
  renderer.render(scene, camera);
}
