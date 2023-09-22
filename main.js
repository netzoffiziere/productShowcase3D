import * as THREE from 'three';
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from './node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { config, initializeConfig, getConfig, loadModules, loadResources, finalizeSetup } from './init.js';
import { lightTypes } from './config/lights.js';
import { addLight } from './utils/lights.js';
import { concreteMaterial, sunMaterial } from './utils/materials.js';
import { debugLog } from './utils/debug.js';
import 'jquery';
import 'bootstrap';
import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { CSM } from './node_modules/three/examples/jsm/csm/CSM';
//THREE.CSM = CSM;
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
let skyMaterial;

loadModules(version).then(() => {
	debugLog('Imports erfolgreich');
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.useLegacyLights = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	scene = new THREE.Scene();
	camera = config.setupCamera(THREE);
       

	let csm = new CSM({
		maxFar: 1000,
		near: 0.01,
		lightNear: 0.01,
		mode: 'practical',
		fade: false,
		cascades: 8,
		shadowMapSize: 4096,
		lightDirection: new THREE.Vector3(0,-2,0).normalize(),
		camera: camera,
		shadowBias: 0,
		lightIntensity: 1,
		parent: scene
	}); 
	csm.update();
	const orbitControls = new OrbitControls(camera, renderer.domElement);
	orbitControls.minPolarAngle = 0; // 0 Grad
	orbitControls.maxPolarAngle = Math.PI / 2; 
        orbitControls.minDistance = 0.15;  // Minimaler Abstand zur Mitte
	orbitControls.maxDistance = 0.95;
	controls = config.setupPointerLockControls(camera, renderer);
	scene.add(controls.getObject());
	
	const gui = new dat.GUI();
	document.querySelector('.dg').style.zIndex = '1040'; 
	const lightFolder = gui.addFolder('Lichtquellen');
	const objFolder = gui.addFolder('Objekte');
	lightFolder.open();
	
	config.setupEventListeners(camera, scene, gui, lightFolder, addLight);
	config.initEventListeners(camera);

	// Sonne
	const sunGeometry = new THREE.SphereGeometry(4096, 32, 32);
	const sun = new THREE.Mesh(sunGeometry, sunMaterial);
	sun.name = 'Sonne';

	sunGroup = new THREE.Group();
	sunGroup.name = 'Gruppe: Sonne';
	sunGroup.position.set(0,32768,0);
	sunGroup.add(sun);

	earthGroup = new THREE.Group();
 	earthGroup.name = 'Gruppe: Erde';
	earthGroup.position.set(0,-0.05,0);
	
	const earthGeometry = new THREE.SphereGeometry(512, 32, 32);
	const earthMaterial = new THREE.MeshPhongMaterial({
		color: 0x1565C0,  
		specular: 0x111111,
		shininess: 30, 
	});
	csm.setupMaterial(earthMaterial);
	const earth = new THREE.Mesh(earthGeometry, earthMaterial);
	earth.name = 'Erde';
	earth.receiveShadow = true;
	earth.castShadow = true;
	earth.position.set(0,-512,0);
	earthGroup.add(earth);
	const skyGeometry = new THREE.SphereGeometry(544, 32, 32);
//	const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide, transparent: true, opacity:0.5 }); // Himmelblau
	skyMaterial = new THREE.ShaderMaterial({
		uniforms: {
			sunDirection: { value: new THREE.Vector3() }  
		},
		vertexShader: `
			varying vec3 vWorldPosition;
			void main() {
				vec4 worldPosition = modelMatrix * vec4(position, 1.0);
				vWorldPosition = worldPosition.xyz;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform vec3 sunDirection;
			varying vec3 vWorldPosition;
			void main() {
				float intensity = dot(-normalize(vWorldPosition), sunDirection);
				vec3 color = mix(vec3(0.0, 0.0, 0.1), vec3(0.5, 0.7, 1.0), intensity * 0.5 + 0.5);
				gl_FragColor = vec4(color, 0.8);  
			}
		`,
		side: THREE.BackSide,
		transparent: true,
		opacity: 0.8
	});
	const sky = new THREE.Mesh(skyGeometry, skyMaterial);
	sky.name = 'Himmel';
	sky.position.y = -528;
	earthGroup.add(sky);

	csm.setupMaterial(concreteMaterial);
	csm.update();
	
	loadResources(scene, camera, renderer);
/*
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
*/
//	const gridSize = 22;
//	const gridDivisions = 111;
//	const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
//	scene.add(gridHelper);
/*
	const gridHelperY = new THREE.GridHelper(gridSize, gridDivisions);
	gridHelperY.rotation.x = Math.PI / 2;
	scene.add(gridHelperY);
	const gridHelperZ = new THREE.GridHelper(gridSize, gridDivisions);
	gridHelperZ.rotation.z = Math.PI / 2;
	scene.add(gridHelperZ);
*/
	scene.add(earthGroup);
	scene.add(sunGroup);

	const initialPointLight1 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:0.2,y:0.2,z:0}, color: '0xFFD700', intensity: 1, distance: 1, decay: 1, castShadow: false });
	const initialPointLight2 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:0,y:0.2,z:0.2}, color: '0x00D7FF', intensity: 1, distance: 1, decay: 1, castShadow: false });
	const initialPointLight3 = config.addLight(gui, lightFolder, scene, 'PointLight', { position: {x:-0.2,y:0.1,z:0}, color: '0xD75555', intensity: 1, distance: 1, decay: 1,castShadow: false });
	const initialSpot = config.addLight(gui, lightFolder, scene, 'SpotLight', { position: {x:0,y:0.14,z:0}, color: '0xAAAAAA', intensity: 1, distance: 3, decay: 1, castShadow: true, angle: 1, penumbra: 0.1 });
	initialSpot.shadow.camera.near = 0.1;

	addObjectsToGuiFolder(objFolder, scene.children);
	rendering(renderer, scene, camera, csm);
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
			if ('castShadow' in obj) {
				objFolder.add(obj, 'castShadow').name('Schatten werfen').onChange((value) => {
					obj.castShadow = value;
				});
			}
			if ('receiveShadow' in obj) {
				objFolder.add(obj, 'receiveShadow').name('Schatten empfangen').onChange((value) => {
					obj.receiveShadow = value;
				});
			}
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
			if (obj.material && obj.material.color) {
				objFolder.addColor(obj.material, 'color').name('Farbe');
			}
			objFolder.add(obj.material, 'wireframe').name('Drahtgitter');
			objFolder.add(obj.material, 'transparent').name('Transparenz');
			objFolder.add(obj.material, 'opacity', 0, 1).name('Deckkraft').step(0.1);
			objFolder.add(obj, 'name').name('Name');
		}
	});
}

const dayDuration = 360000; 
const yearDuration = 36 * dayDuration;
const radius = 32000; 
const tiltAngle = 43.5 * (Math.PI / 180);

function rendering(renderer, scene, camera, csm) {
	requestAnimationFrame(() => rendering(renderer, scene, camera, csm));
	let elapsed = Date.now() - startTime;
	let dayProgress = (elapsed % dayDuration) / dayDuration;
	let yearProgress = (elapsed % yearDuration) / yearDuration;
	let angle = dayProgress * Math.PI * 2;
	let y = radius * Math.cos(angle);
	let z = radius * Math.sin(angle);
	let x = radius * Math.sin(tiltAngle * Math.sin(yearProgress * Math.PI * 2));
	if (sunGroup) {
		sunGroup.position.set(x, y, z);
	}
	csm.lightDirection.set(-x, -y, -z).normalize();
	csm.update(camera.matrix);
	skyMaterial.uniforms.sunDirection.value = csm.lightDirection; 
	
	config.updatePointerLockControls(controls);
	config.updateInfoPanel(camera);  
	renderer.render(scene, camera);
}
