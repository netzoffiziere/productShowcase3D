console.log('NEOF: productShowcase3D.js');

const bodyElement = document.querySelector('body');
const DEBUG = bodyElement.hasAttribute('data-debug');
const currentProduct = bodyElement.getAttribute('data-current-product');
const glbExists = bodyElement.getAttribute('data-glb-exists') === 'true';
const modelExists = bodyElement.getAttribute('data-model-exists') === 'true';
function debugLog(message) {
  if (DEBUG) {
    console.log(message);
  }
}
import * as THREE from '../node_modules/three/build/three.module.js';
window.THREE = THREE;
import { loadGLB } from './utils/loadGLB.js';
import { setupCamera } from './utils/camera.js';
import { addLights } from './utils/lights.js';
import { updateInfoPanel } from './utils/infoPanel.js';
import { setupEventListeners } from './utils/eventListeners.js';
debugLog('Imports erfolgreich');

//let currentProduct = 'waermepumpe';

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = setupCamera();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

const horizontalGridSize = 10;
const horizontalGridDivisions = 10;
const horizontalGridHelper = new THREE.GridHelper(horizontalGridSize, horizontalGridDivisions);
scene.add(horizontalGridHelper);

const verticalGridSize = 10;
const verticalGridDivisions = 10;
const verticalGridHelper = new THREE.GridHelper(verticalGridSize, verticalGridDivisions);
verticalGridHelper.rotation.x = Math.PI / 2; // Rotiere das Gitter um 90 Grad um die x-Achse
scene.add(verticalGridHelper);

debugLog('Variablen initialisiert');


function finalizeSetup(model = null) {
  debugLog('Start: finalizeSetup');
  if (model) {
    const mainObject = new THREE.Mesh(model.geometry, model.material);
    scene.add(mainObject);
  }  
  camera.position.set(-5, 2, 0);
  camera.lookAt(0, 0, 0);
  addLights(scene, camera.position);
  renderer.setClearColor(0x0a0a0a);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvas').appendChild(renderer.domElement);
  setupEventListeners(camera, scene);
  rendering(renderer, scene, camera);
  debugLog('Ende: finalizeSetup');
}

function rendering(renderer, scene, camera) {
  requestAnimationFrame(() => rendering(renderer, scene, camera));
  updateInfoPanel(camera);  
  renderer.render(scene, camera);
}

debugLog('Funktionen definiert');

async function loadResources() {
  let model = null;
  try {
    if (glbExists) {
      const glbResult = await loadGLB(scene, finalizeSetup, currentProduct);
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
  } catch (err) {
    console.error(`Fehler: ${err}`);
  }
}

loadResources();
debugLog('Ende: productShowcase3D.js');
