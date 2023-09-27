import * as THREE from 'three';
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from './node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { debugLog } from './utils/debug.js';
import 'jquery';
import 'bootstrap';
import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { initializeConfig, getConfig, loadModules, loadResources, finalizeSetup, addObjectsToGuiFolder, createObjectsFromConfig, setupCSM } from './init.js';
const bodyElement = document.querySelector('body');
const { DEBUG, currentProduct, modelExists } = getConfig();
initializeConfig(bodyElement);

const worldName = new URLSearchParams(window.location.search).get('world') || 'default';
let worldObj = require(`./welten/${worldName}.json`);

let orbitControls;
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { lightTypes } from './config/lights.js';
import { skyMaterial } from './utils/materials.js';


window.THREE = THREE;
let version = 0.1;

const specificDate = new Date('2023-09-20T15:19:00Z');
const startTime = specificDate.getTime(); 
if(DEBUG) {
  version = new Date().getTime();
}
let updateInfopanel, infopanelEventListeners;
let setupEventListeners;
let controls;
let sunGroup;
let initialSunlight;
let earthGroup;

async function init() {
	await loadModules(worldObj);
	console.log('ready loadModules(worldObj)');
	worldObj.scene = new THREE.Scene();

// GUI -> to be exported!	
	const gui = new dat.GUI();
	document.querySelector('.dg').style.zIndex = '1040'; 
	const lightFolder = gui.addFolder('Lichtquellen');
	const objFolder = gui.addFolder('Objekte');
	lightFolder.open();
	worldObj.setupEventListeners(gui, lightFolder);

	if(worldObj.controls.type.toLowerCase() === 'pointerlockcontrols') {
		controls = worldObj.setupPointerLockControls(worldObj);
		worldObj.scene.add(controls.getObject());
	}

	worldObj.infopanelEventListeners();

	//createLightsFromConfig(scene, worldConfig.lights);


	worldObj.csm = setupCSM(worldObj);
	createObjectsFromConfig(worldObj.scene, worldObj.objects);
	await loadResources(worldObj);
	
	const initialPointLight1 = worldObj.addLight(gui, lightFolder, 'PointLight', { position: {x:0, y:0, z:0}, color: '0xFFD700', intensity: 1, distance: 0, decay: 1, castShadow: true });
	const initialPointLight2 = worldObj.addLight(gui, lightFolder, 'PointLight', { position: {x:0,y:0.2,z:0.2}, color: '0x00D7FF', intensity: 1, distance: 1, decay: 1, castShadow: false });
	const initialPointLight3 = worldObj.addLight(gui, lightFolder, 'PointLight', { position: {x:-0.2,y:0.1,z:0}, color: '0xD75555', intensity: 1, distance: 1, decay: 1,castShadow: false });
	const initialSpot = worldObj.addLight(gui, lightFolder, 'SpotLight', { position: {x:0,y:0.14,z:0}, color: '0xAAAAAA', intensity: 1, distance: 3, decay: 1, castShadow: true, angle: 1, penumbra: 0.1 });
	initialSpot.shadow.camera.near = 0.1;
	objFolder.__controllers.forEach(controller => {
		controller.updateDisplay();
	});
	rendering();
	addObjectsToGuiFolder(objFolder, worldObj.scene.children);
}
init();

const dayDuration = 3600000; 
const yearDuration = 36 * dayDuration;
const radius = 32000; 
const tiltAngle = 27.5 * (Math.PI / 180);
let earthCounter=0;

function updateOrbit(object, center, radius, angleSpeed, time) {
	if (!object || !object.position) {
		console.error('updateOrbit: Ungültiges Objekt oder Position', object);
		return;
	}
	if (!(object.position instanceof THREE.Vector3)) {
		object.position = new THREE.Vector3(object.position.x, object.position.y, object.position.z);
	}
	let angle = time * angleSpeed;
	let x = center.x + radius * Math.cos(angle);
	let y = center.y;
	let z = center.z + radius * Math.sin(angle);
	object.position.set(x, y, z);
}

function rendering() {
	requestAnimationFrame(() => rendering());
	let elapsed = Date.now() - startTime;
/*
	let dayProgress = (elapsed % dayDuration) / dayDuration;
	let yearProgress = (elapsed % yearDuration) / yearDuration;
	let angle = dayProgress * Math.PI * 2;
	let y = radius * Math.cos(angle);
	let z = radius * Math.sin(angle);
	let x = radius * Math.sin(tiltAngle * Math.sin(yearProgress * Math.PI * 2));
*/
	const sunGroup = worldObj.scene.getObjectByName('Gruppe: Sonne');
	if (sunGroup) {
		sunGroup.position.set(0, 0, 0);  // Sonne bleibt im Zentrum
	}
	worldObj.objects.forEach(group => {
		if (group.name.startsWith('Gruppe:')) {
			let planet = group.children.find(child => child.name.startsWith('Planet:'));
			if (planet) {
				let pos = group.position;
				let radiusPlanet = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z **2);
				// Aktualisiere die Position des Planeten
				updateOrbit(planet, sunGroup.position, radiusPlanet, 0.001, elapsed);
				// Aktualisiere die Position der Monde
				group.children.forEach(moon => {
					if (moon.name.startsWith('Mond:')) {
						pos = moon.position;
						let radiusMoon = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z **2);
						updateOrbit(moon, planet.position, radiusMoon, 0.01, elapsed);
					}
				});
			}
		}
	});
	let cameraPos = worldObj.camera.position;
    	worldObj.csm.lightDirection.set(
	        cameraPos.x - 0, 
	        cameraPos.y - 0, 
	        cameraPos.z - 0
	).normalize();
	worldObj.csm.update(worldObj.camera.matrix);
	skyMaterial.uniforms.sunDirection.value = worldObj.csm.lightDirection; 
	
	worldObj.updatePointerLockControls(controls);
	const targetPosition = new THREE.Vector3(); // oder ein bestehendes Vector3-Objekt
	targetPosition.copy(worldObj.camera.position).add(new THREE.Vector3(0, 0, 0)); // Beispiel-Offset
	if(orbitControls) {
		orbitControls.target.copy(targetPosition);
		orbitControls.update();
	}
	worldObj.updateInfopanel();  
	worldObj.renderer.render(worldObj.scene,worldObj.camera);
}
