console.log('NEOF: productShowcase3D.js');
const bodyElement = document.querySelector('body');
const DEBUG = bodyElement.hasAttribute('data-debug');
const currentProduct = bodyElement.getAttribute('data-current-product');
const glbExists = bodyElement.getAttribute('data-glb-exists') === 'true';
const modelExists = bodyElement.getAttribute('data-model-exists') === 'true';
import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
//import { PointerLockControls } from '../node_modules/three/examples/jsm/controls/PointerLockControls.js';
import { setupPointerLockControls, updatePointerLockControls } from './utils/pointerLockControls.js';


window.THREE = THREE;
let version = 0.1;
if(DEBUG) {
  version = new Date().getTime();
}
let renderer, scene, camera;
let setupCamera, updateCameraPosition, updateCameraRotation;
let addLight, addLightToDOMList;
let updateInfoPanel, initEventListeners;
let setupEventListeners;
let controls;

async function loadModules(version) {
  try {
    const loadGLBModule = await import(`./utils/loadGLB.js?version=${version}`);
    window.loadGLB = loadGLBModule.loadGLB;

    const cameraModule = await import(`./utils/camera.js?${version}`);
    ({ setupCamera, updateCameraPosition, updateCameraRotation } = cameraModule);

    const lightsModule = await import(`./utils/lights.js?${version}`);
    ({ addLight, addLightToDOMList } = lightsModule);

    const infoPanelModule = await import(`./utils/infoPanel.js?${version}`);
    ({ updateInfoPanel, initEventListeners } = infoPanelModule);

    const eventListenersModule = await import(`./utils/eventListeners.js?${version}`);
    ({ setupEventListeners } = eventListenersModule);
  } catch (error) {
    console.error('Fehler beim Laden des Moduls:', error);
  }
}
loadModules(version).then(() => {
	debugLog('Imports erfolgreich');
	renderer = new THREE.WebGLRenderer({ antialias: true });
	scene = new THREE.Scene();
	camera = setupCamera(THREE);
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        controls = setupPointerLockControls(camera, renderer);
	scene.add(controls.getObject());
	/*
	const axesHelper = new THREE.AxesHelper(500);
	scene.add(axesHelper);
	const cameraHelper = new THREE.CameraHelper(camera);
	scene.add(cameraHelper);
	*/
	// Horizontal Grid (X, Y)
/*
	const horizontalGridSize = 10;
	const horizontalGridDivisions = 100;
	const horizontalGridHelper = new THREE.GridHelper(horizontalGridSize, horizontalGridDivisions);
	scene.add(horizontalGridHelper);
*/
	// Vertical Grid (X, Z)
/*
	const verticalGridSize = 10;
	const verticalGridDivisions = 100;
	const verticalGridHelper = new THREE.GridHelper(verticalGridSize, verticalGridDivisions);
	verticalGridHelper.rotation.x = Math.PI / 2;
	scene.add(verticalGridHelper);
*/
	// Depth Grid (Y, Z)
/*
	const depthGridSize = 10;
	const depthGridDivisions = 100;
	const depthGridHelper = new THREE.GridHelper(depthGridSize, depthGridDivisions);
	depthGridHelper.rotation.z = Math.PI / 2;
	scene.add(depthGridHelper);
*/
	const initialPointLight = addLight(scene, 'PointLight', { x: -5, y: 2, z: 0, lightName: 'Spot' });
	addLightToDOMList(scene, initialPointLight);
	const initialHemiLight = addLight(scene, 'HemisphereLight', { position: {x:0, y: -10, z:0} });
	addLightToDOMList(scene, initialHemiLight);
	async function loadResources(camera) {
		let model = null;
		try {
			if (glbExists) {
				const glbResult = await loadGLB(scene, finalizeSetup, currentProduct);
			} else {
				debugLog('Kein glb!');  
			}
			if (modelExists) {
				const module = await import(`./models/${currentProduct}.js`);
				({ model } = module);
				model.features.forEach(feature => {
					const featureMesh = new THREE.Mesh(feature.geometry, feature.material);
					featureMesh.position.set(...feature.position);
					scene.add(featureMesh);
				});    
			}
			finalizeSetup(model);
			initEventListeners(camera)
		} catch (err) {
			console.error(`Fehler: ${err}`);
		}
	}
	loadResources(camera);
});

function debugLog(message) {
  if (DEBUG) {
    console.log(message);
  }
}

function finalizeSetup(model = null) {
  debugLog('Start: finalizeSetup');
  if (model) {
    const mainObject = new THREE.Mesh(model.geometry, model.material);
    scene.add(mainObject);
  }  
  camera.position.set(-5, 2, 0);
  camera.lookAt(0, 0, 0);
  renderer.setClearColor(0x0a0a0a);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvas').appendChild(renderer.domElement);
  setupEventListeners(camera, scene);
  rendering(renderer, scene, camera);
  debugLog('Ende: finalizeSetup');
}

function rendering(renderer, scene, camera) {
  requestAnimationFrame(() => rendering(renderer, scene, camera));
  updatePointerLockControls(controls);
  updateInfoPanel(camera);  
  renderer.render(scene, camera);
}

