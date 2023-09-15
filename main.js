console.log('netzoffiziere.de');
import * as THREE from '../node_modules/three/build/three.module.js';
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js';

var scrollY;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
camera.position.z = 500;
camera.position.x = 0;
camera.position.y = 0;
camera.lookAt(0,0,0);

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#c0c0c0");
renderer.setSize(window.innerWidth, window.innerHeight);
canvas.appendChild(renderer.domElement);
window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})
window.addEventListener('scroll', () => {
	scrollY = window.scrollY;
	if(scrollY>=300) {
		$('#logo').addClass('small');
	} else {
		$('#logo').removeClass('small');
	}
	console.log(window.scrollY + ': ' + camera.position.z);
})
const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);
const fontloader = new FontLoader();
fontloader.load(
	'./node_modules/three/examples/fonts/gentilis_regular.typeface.json', 
	function ( font ) {
		const textGeometry = new TextGeometry(
			'Hello three.js!', 
			{
				font: font,
				size: 30,
				height: 1,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 1,
				bevelSize: 1,
				bevelOffset: 0,
				bevelSegments: 5
			} 
		);
		const textMaterial = new THREE.MeshStandardMaterial({color: 0x000000});
		const textMesh = new THREE.Mesh(textGeometry, textMaterial);
		textMesh.position.set(0,0,0);
		scene.add(textMesh);
	} 
);

const lights = [];
const lightValues = [
    {colour: 0x14D14A, intensity: 8, dist: 12, x: 1, y: 0, z: 8},
    {colour: 0xBE61CF, intensity: 6, dist: 12, x: -2, y: 1, z: -10},
    {colour: 0x00FFFF, intensity: 3, dist: 10, x: 0, y: 10, z: 1},
    {colour: 0x00FF00, intensity: 6, dist: 12, x: 0, y: -10, z: -1},
    {colour: 0x16A7F5, intensity: 6, dist: 12, x: 10, y: 3, z: 0},
    {colour: 0x90F615, intensity: 6, dist: 12, x: -10, y: -1, z: 0}
];
for (let i=0; i<6; i++) {
    lights[i] = new THREE.PointLight(
        lightValues[i]['colour'],
        lightValues[i]['intensity'],
        lightValues[i]['dist']);
    lights[i].position.set(
        lightValues[i]['x'],
        lightValues[i]['y'],
        lightValues[i]['z']);
    scene.add(lights[i]);
}
const rendering = function() {
	requestAnimationFrame(rendering);
	//scene.rotation.z -= 0.005;
	//scene.rotation.x -= 0.01;
	renderer.render(scene, camera);
}
rendering();

