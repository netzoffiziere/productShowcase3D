import { debugLog } from './utils/debug.js';
let DEBUG = false;
let currentProduct = "";
let glbExists = false;
let modelExists = false;
export const config = {};
export function initializeConfig(bodyElement) {
  DEBUG = bodyElement.hasAttribute('data-debug');
  currentProduct = bodyElement.getAttribute('data-current-product');
  glbExists = bodyElement.getAttribute('data-glb-exists') === 'true';
  modelExists = bodyElement.getAttribute('data-model-exists') === 'true';
}

export function getConfig() {
  return { DEBUG, currentProduct, glbExists, modelExists };
}

export async function loadModules(version) {
	try {
		const loadGLBModule = await import(`./utils/loadGLB.js?version=${version}`);
		window.loadGLB = loadGLBModule.loadGLB;
		const cameraModule = await import(`./utils/camera.js?${version}`);
		config.setupCamera = cameraModule.setupCamera;
		config.updateCameraPosition = cameraModule.updateCameraPosition;
		config.updateCameraRotation = cameraModule.updateCameraRotation;
 		const lightsModule = await import(`./utils/lights.js?${version}`);
		config.addLight = lightsModule.addLight;
		const infoPanelModule = await import(`./utils/infoPanel.js?${version}`);
		config.updateInfoPanel = infoPanelModule.updateInfoPanel;
		config.initEventListeners = infoPanelModule.initEventListeners;
		const eventListenersModule = await import(`./utils/eventListeners.js?${version}`);
		config.setupEventListeners = eventListenersModule.setupEventListeners;
		const controlsModule = await import(`./utils/pointerLockControls.js?${version}`);
		config.setupPointerLockControls = controlsModule.setupPointerLockControls;
		config.updatePointerLockControls = controlsModule.updatePointerLockControls;
	} catch (error) {
		console.error('Fehler beim Laden des Moduls:', error);
	}
}

export async function loadResources(scene, camera, renderer) {
	let model = null;
	try {
		if (glbExists) {
			const glbResult = await window.loadGLB(scene, finalizeSetup, currentProduct);
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
		finalizeSetup(scene, camera, renderer, model = null);
	} catch (err) {
		console.error(`Fehler: ${err}`);
	}
}

export function finalizeSetup(scene, camera, renderer, model = null) {
	if (model) {
		const mainObject = new THREE.Mesh(model.geometry, model.material);
		scene.add(mainObject);
	}
	camera.position.set(-5, 2, 0);
	camera.lookAt(0, 0, 0);
	renderer.setClearColor(0x0a0a0a);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('canvas').appendChild(renderer.domElement);
}

