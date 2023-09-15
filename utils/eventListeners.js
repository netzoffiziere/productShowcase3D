import * as THREE from 'three';

function setupKeyboardListeners(camera, moveSpeed, rotateSpeed) {
  window.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    switch (key) {
      case 'arrowup':
      case 'w':
        move('forward');
        break;
      case 'arrowdown':
      case 's':
        move('back');
        break;
      case 'arrowleft':
      case 'a':
        move('left');
        break;
      case 'arrowright':
      case 'd':
        move('right');
        break;
      case 'e':
        rotate('right');
        break;
      case 'q':
        rotate('left');
        break;
    }
  });
}
function setupMouseListeners(camera, moveSpeed, rotateSpeed) {
  document.getElementById('rotate-left').addEventListener('click', () => rotate('left'));
  document.getElementById('move-forward').addEventListener('click', () => move('forward'));
  document.getElementById('rotate-right').addEventListener('click', () => rotate('right'));
  document.getElementById('move-left').addEventListener('click', () => move('left'));
  document.getElementById('move-back').addEventListener('click', () => move('back'));
  document.getElementById('move-right').addEventListener('click', () => move('right'));
}

function rotate(direction) {
  const rotateSpeed = 0.02;

  switch (direction) {
    case 'left':
      rotateCamera(camera, -rotateSpeed);
      break;
    case 'right':
      rotateCamera(camera, rotateSpeed);
      break;
  }
}

function move(direction) {
  const moveSpeed = 0.1;
  const rightVector = getRightVector(camera).normalize().multiplyScalar(moveSpeed);

  switch (direction) {
    case 'forward':
      moveCamera(camera, camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(moveSpeed));
      break;
    case 'back':
      moveCamera(camera, camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-moveSpeed));
      break;
    case 'left':
      moveCamera(camera, rightVector.clone().multiplyScalar(-1));
      break;
    case 'right':
      moveCamera(camera, rightVector);
      break;
  }
}

function moveCamera(camera, direction) {
  camera.position.add(direction);
}

function rotateCamera(camera, angle) {
  camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
}

function getRightVector(camera) {
  const rightVector = new THREE.Vector3();
  camera.getWorldDirection(rightVector).cross(camera.up);
  return rightVector;
}

/*
function setupKeyboardListeners(camera, moveSpeed, rotateSpeed) {
  window.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    const rightVector = new THREE.Vector3();
    camera.getWorldDirection(rightVector).cross(camera.up).normalize().multiplyScalar(moveSpeed);
    switch(key) {
      case 'arrowup':
      case 'w':
        camera.position.x += camera.getWorldDirection(new THREE.Vector3()).x * moveSpeed;
        camera.position.z += camera.getWorldDirection(new THREE.Vector3()).z * moveSpeed;
        break;
      case 'arrowdown':
      case 's':
        camera.position.x -= camera.getWorldDirection(new THREE.Vector3()).x * moveSpeed;
        camera.position.z -= camera.getWorldDirection(new THREE.Vector3()).z * moveSpeed;
        break;
      case 'arrowleft':
      case 'a':
        camera.position.sub(rightVector);
        break;
      case 'arrowright':
      case 'd':
        camera.position.add(rightVector);
        break;
      case 'e':
        camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -rotateSpeed);
        break;
      case 'q':
        camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotateSpeed);
        break;
    }
  });
}

function setupMouseListeners(camera, moveSpeed, rotateSpeed) {
  document.getElementById('rotate-left').addEventListener('click', () => {
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -rotateSpeed);
  });
  document.getElementById('move-forward').addEventListener('click', () => {
    camera.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(moveSpeed));
  });
  document.getElementById('rotate-right').addEventListener('click', () => {
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotateSpeed);
  });
  document.getElementById('move-left').addEventListener('click', () => {
    const rightVector = new THREE.Vector3();
    camera.getWorldDirection(rightVector).cross(camera.up).normalize().multiplyScalar(moveSpeed);
    camera.position.sub(rightVector);
  });
  document.getElementById('move-back').addEventListener('click', () => {
    camera.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-moveSpeed));
  });
  document.getElementById('move-right').addEventListener('click', () => {
    const rightVector = new THREE.Vector3();
    camera.getWorldDirection(rightVector).cross(camera.up).normalize().multiplyScalar(moveSpeed);
    camera.position.add(rightVector);
  });
}
*/

export function setupEventListeners(camera) {
  const moveSpeed = 0.1;
  const rotateSpeed = 0.02;

  setupKeyboardListeners(camera, moveSpeed, rotateSpeed);
  setupMouseListeners(camera, moveSpeed, rotateSpeed);
}

