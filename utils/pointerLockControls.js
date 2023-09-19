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
  
  document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW':
        moveForward = true;
        break;
      case 'KeyS':
        moveBackward = true;
        break;
      case 'KeyA':
        moveLeft = true;
        break;
      case 'KeyD':
        moveRight = true;
        break;
      case 'KeyE':
        moveUp = true;
        break;
      case 'KeyQ':
        moveDown = true;
        break;
/*
      case 'KeyY':
        rotateLeft = true;
        break;
      case 'KeyC':
        rotateRight = true;
        break;
*/
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyW':
        moveForward = false;
        break;
      case 'KeyS':
        moveBackward = false;
        break;
      case 'KeyA':
        moveLeft = false;
        break;
      case 'KeyD':
        moveRight = false;
        break;
      case 'KeyE':
        moveUp = false;
        break;
      case 'KeyQ':
        moveDown = false;
        break;
  /*
    case 'KeyY':
        rotateLeft = false;
        break;
      case 'KeyC':
        rotateRight = false;
        break;
*/
    }
  });

  return controls;
}

export function updatePointerLockControls(controls) {
//  if (controls.isLocked) {
    const speed = 0.1;
    const rotationSpeed = 0.02;
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

