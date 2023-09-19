import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { config, initializeConfig, getConfig, loadModules, loadResources, finalizeSetup } from './init.js';
import { debugLog } from './utils/debug.js';
const bodyElement = document.querySelector('body');
initializeConfig(bodyElement);
const { DEBUG, currentProduct, modelExists } = getConfig();

window.THREE = THREE;
let version = 0.3;
if(DEBUG) {
  version = new Date().getTime();
}
let renderer, scene, camera;
let addLight, addLightToDOMList, createLightPopup;
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
	const initialPointLight = config.addLight(scene, 'PointLight', { x: -5, y: 2, z: 0, lightName: 'Spot' });
	config.addLightToDOMList(scene, initialPointLight);
	const initialHemiLight = config.addLight(scene, 'HemisphereLight', { position: {x:0, y: -10, z:0} });
	config.addLightToDOMList(scene, initialHemiLight);
	config.rendering = rendering,
	loadResources(scene, camera, renderer);
	config.initEventListeners(camera)
	rendering(renderer, scene, camera);
});

function rendering(renderer, scene, camera) {
  requestAnimationFrame(() => rendering(renderer, scene, camera));
  config.updatePointerLockControls(controls);
  config.updateInfoPanel(camera);  
  renderer.render(scene, camera);
}

