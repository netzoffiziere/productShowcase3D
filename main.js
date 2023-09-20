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
const specificDate = new Date('2023-09-20T15:19:00Z');
const startTime = specificDate.getTime(); 
if(DEBUG) {
  version = new Date().getTime();
}
let renderer, scene, camera;
let updateInfoPanel, initEventListeners;
let setupEventListeners;
let controls;
let sunGroup;
let initialSunlight;
let earthGroup;
loadModules(version).then(() => {
	debugLog('Imports erfolgreich');
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	scene = new THREE.Scene();
	camera = config.setupCamera(THREE);
        
	const orbitControls = new OrbitControls(camera, renderer.domElement);
	orbitControls.minPolarAngle = 0; // 0 Grad
	orbitControls.maxPolarAngle = Math.PI / 2; 
        controls = config.setupPointerLockControls(camera, renderer);
	scene.add(controls.getObject());
	
	const gui = new dat.GUI();
	const lightFolder = gui.addFolder('Lichtquellen');
	const objFolder = gui.addFolder('Objekte');
	
	// Sonne
	const sunGeometry = new THREE.SphereGeometry(10000, 32, 32);
	const sunMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
	const sun = new THREE.Mesh(sunGeometry, sunMaterial);
	sun.name = 'Sonne';
	initialSunlight = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:0,y:0,z:72000}, lightName: 'Sonne', intensity: 10, decay: 0.1});
	initialSunlight.castShadow = true;
	/*	const initialHemiLight = config.addLight(gui, lightFolder, scene, 'HemisphereLight', { lightName: 'Hemisphere', intensity: 0.1 });
	*/
	const initialPointLight1 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:2,y:2,z:0}, color: '0xFFD700', intensity: 2.0, distance: 10, decay: 2, castShadow: true });
	const initialPointLight2 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:0,y:2,z:2}, color: '0x00D7FF', intensity: 1.0, distance: 10, decay: 2 });
	const initialPointLight3 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:-2,y:1,z:0}, color: '0xD75555', intensity: 1.0, distance: 10, decay: 2 });
	const initialSpot = config.addLight(gui, lightFolder, scene, 'SpotLight', { position: {x:0,y:2,z:0}, color: '0xAAAAAA', intensity: 0.5, distance: 30, decay: 2 });
	loadResources(scene, camera, renderer);
	config.setupEventListeners(camera, scene, gui, lightFolder, addDynamicLight);
	config.initEventListeners(camera);

	lightFolder.open();


// Erde und Raum
	earthGroup = new THREE.Group();
 	earthGroup.name = 'Gruppe: Erde';
	const earthGeometry = new THREE.SphereGeometry(1000, 32, 32);

//const earthMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
	const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x1565C0,      // Grundfarbe (Ozeanblau)
  specular: 0x111111,   // Spiegelungsfarbe
  shininess: 30,        // Glanzgrad
});
	const earth = new THREE.Mesh(earthGeometry, earthMaterial);
	earth.name = 'Erde';
	earthGroup.position.set(0,-1000,0);
	earthGroup.add(earth);

const roomGeometry = new THREE.BoxGeometry(15, 15, 5);
const roomMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const room = new THREE.Mesh(roomGeometry, roomMaterial);
room.name = 'Grüner Raum';
room.position.set(0, 0, 0);
earthGroup.add(room);

sunGroup = new THREE.Group();
sunGroup.name = 'Gruppe: Sonne';
sunGroup.add(initialSunlight);
sunGroup.position.set(0,0,72000);
sunGroup.add(sun);
//sunGroup.add(earthGroup);

scene.add(sunGroup);
scene.add(earthGroup);
console.log('sun added');

        const geometry = new THREE.BoxGeometry(20, 20, 2);
        const material = new THREE.MeshStandardMaterial({color: 0xA0AAA0, side: THREE.DoubleSide});
        const floor = new THREE.Mesh(geometry, material);
        floor.name = 'Bodenplatte';
	floor.rotation.x = Math.PI / 2;
        floor.position.set(0,999, 0);
        //scene.add(floor);
	earthGroup.add(floor);

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
/*	const gridHelperY = new THREE.GridHelper(gridSize, gridDivisions);
	gridHelperY.rotation.x = Math.PI / 2;
	scene.add(gridHelperY);
	const gridHelperZ = new THREE.GridHelper(gridSize, gridDivisions);
	gridHelperZ.rotation.z = Math.PI / 2;
	scene.add(gridHelperZ);
*/
	addObjectsToGuiFolder(objFolder, scene.children);
	rendering(renderer, scene, camera);
});
function addObjectsToGuiFolder(folder, objects, parentIndex ='') {
	objects.forEach((obj, index) => {
		let objFolder;
		const uniqueIndex = `${parentIndex}${index}`;
		if (obj.type === 'Group') {
			const subFolder = folder.addFolder(obj.name || `Gruppe ${uniqueIndex}`);
			addObjectsToGuiFolder(subFolder, obj.children);
		} else if (obj.type === 'Mesh') {
			const objFolder = folder.addFolder(obj.name || `Objekt ${uniqueIndex}`);
			objFolder.add({ type: obj.geometry.type }, 'type').name('Art').listen();
			objFolder.add(obj.position, 'x').name('X-Position');
			objFolder.add(obj.position, 'y').name('Y-Position');
			objFolder.add(obj.position, 'z').name('Z-Position');
			objFolder.add(obj.rotation, 'x').name('X-Rotation').min(-Math.PI).max(Math.PI).step(0.01);
			objFolder.add(obj.rotation, 'y').name('Y-Rotation').min(-Math.PI).max(Math.PI).step(0.01);
			objFolder.add(obj.rotation, 'z').name('Z-Rotation').min(-Math.PI).max(Math.PI).step(0.01);
			objFolder.add(obj.scale, 'x').name('X-Skalierung').min(0.1).max(3).step(0.1);
			objFolder.add(obj.scale, 'y').name('Y-Skalierung').min(0.1).max(3).step(0.1);
			objFolder.add(obj.scale, 'z').name('Z-Skalierung').min(0.1).max(3).step(0.1);
			objFolder.add(obj, 'visible').name('Sichtbar');
			objFolder.addColor(obj.material, 'color').name('Farbe');
			objFolder.add(obj.material, 'wireframe').name('Drahtgitter');
			objFolder.add(obj.material, 'transparent').name('Transparenz');
			objFolder.add(obj.material, 'opacity', 0, 1).name('Deckkraft').step(0.1);
			objFolder.add(obj, 'name').name('Name');
		}
	});
}


function rendering(renderer, scene, camera) {
	requestAnimationFrame(() => rendering(renderer, scene, camera));
	let currentTime = Date.now();
	let elapsedTime = (currentTime - startTime) / 3600000;
  	let angle = 2 * Math.PI * elapsedTime;
	sunGroup.position.x = 72000 * Math.cos(angle);
	initialSunlight.position.x = 72000 * Math.cos(angle);
	sunGroup.position.y = 72000 * Math.sin(angle);;
	initialSunlight.position.y = 72000 * Math.sin(angle);;
	config.updatePointerLockControls(controls);
	config.updateInfoPanel(camera);  
	renderer.render(scene, camera);
}
