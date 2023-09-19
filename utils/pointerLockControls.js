import { PointerLockControls } from '../node_modules/three/examples/jsm/controls/PointerLockControls.js';

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let rotateLeft = false;
let rotateRight = false;

export function setupPointerLockControls(camera, renderer) {
	const controls = new PointerLockControls(camera, renderer.domElement);
	document.getElementById('move-up').addEventListener('mousedown', () => { moveUp = true; });
	document.getElementById('move-up').addEventListener('mouseup', () => { moveUp = false; });
	document.getElementById('move-down').addEventListener('mousedown', () => { moveDown = true; });
	document.getElementById('move-down').addEventListener('mouseup', () => { moveDown = false; });
	document.getElementById('move-right').addEventListener('mousedown', () => { moveRight = true; });
	document.getElementById('move-right').addEventListener('mouseup', () => { moveRight = false; });
	document.getElementById('move-left').addEventListener('mousedown', () => { moveLeft = true; });
	document.getElementById('move-left').addEventListener('mouseup', () => { moveLeft = false; });
	document.getElementById('move-forward').addEventListener('mousedown', () => { moveForward = true; });
	document.getElementById('move-forward').addEventListener('mouseup', () => { moveForward = false; });
	document.getElementById('move-back').addEventListener('mousedown', () => { moveBackward = true; });
	document.getElementById('move-back').addEventListener('mouseup', () => { moveBackward = false; });
	document.addEventListener('keydown', (event) => {
		switch (event.code) {
			case 'KeyW':
			case 'ArrowUp':
				moveForward = true;
				break;
			case 'KeyS':
 			case 'ArrowDown':
				moveBackward = true;
				break;
			case 'KeyA':
			case 'ArrowLeft':
				moveLeft = true;
				break;
			case 'KeyD':
			case 'ArrowRight':
				moveRight = true;
				break;
			case 'KeyZ':
				moveUp = true;
				break;
			case 'KeyC':
				moveDown = true;
				break;
/*			case 'KeyQ':
				rotateLeft = true;
				break;
			case 'KeyE':
				rotateRight = true;
				break;
*/		}
	});
	document.addEventListener('keyup', (event) => {
		switch (event.code) {
			case 'KeyW':
			case 'ArrowUp':
				moveForward = false;
				break;
			case 'KeyS':
			case 'ArrowDown':
				moveBackward = false;
				break;
			case 'KeyA':
			case 'ArrowLeft':
				moveLeft = false;
				break;
			case 'KeyD':
			case 'ArrowRight':
				moveRight = false;
				break;
			case 'KeyZ':
				moveUp = false;
				break;
			case 'KeyC':
				moveDown = false;
				break;
/*			case 'KeyQ':
				rotateLeft = false;
				break;
			case 'KeyE':
				rotateRight = false;
				break;
*/
		}
	});
	return controls;
}

export function updatePointerLockControls(controls) {
//  if (controls.isLocked) {
    const speed = 0.02;

    const rotationSpeed = 0.005;
    if (moveForward) controls.getObject().translateZ(-speed);
    if (moveBackward) controls.getObject().translateZ(speed);
    if (moveLeft) controls.getObject().translateX(-speed);
    if (moveRight) controls.getObject().translateX(speed);
    if (moveUp) controls.getObject().position.y += speed;
    if (moveDown) controls.getObject().position.y -= speed;
//    if (rotateLeft) controls.getObject().rotation.y += rotationSpeed;
//    if (rotateRight) controls.getObject().rotation.y -= rotationSpeed;
// }
}

