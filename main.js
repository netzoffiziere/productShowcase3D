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
	
	const initialHemiLight = config.addLight(gui, lightFolder, scene, 'HemisphereLight', { lightName: 'Hemisphere', intensity: 0.1 });
	const initialPointLight1 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:2,y:2,z:0}, color: '0xFFD700', intensity: 1.0, distance: 10, decay: 2, castShadow: true });
	const initialPointLight2 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:0,y:2,z:2}, color: '0x00D7FF', intensity: 1.0, distance: 10, decay: 2 });
	const initialPointLight3 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:-2,y:1,z:0}, color: '0xD75555', intensity: 1.0, distance: 10, decay: 2 });
	const initialSpot = config.addLight(gui, lightFolder, scene, 'SpotLight', { position: {x:0,y:2,z:0}, color: '0xAAAAAA', intensity: 0.5, distance: 30, decay: 2 });
	loadResources(scene, camera, renderer);
	config.setupEventListeners(camera, scene, gui, lightFolder, addDynamicLight);
	config.initEventListeners(camera);

	lightFolder.open();

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
