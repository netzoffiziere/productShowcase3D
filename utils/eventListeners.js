import { lightTypes } from '../config/lights.js';
let selectedLightType = 'PointLight'; 

function setupKeyboardListeners(moveSpeed, rotateSpeed) {
}
function setupMouseListeners(moveSpeed, rotateSpeed, camera) {
  document.getElementById('focusButton').addEventListener('click', () => focusCamera(camera));
  document.addEventListener('wheel', (event) => {

    const delta = -event.deltaY * 0.05;
    camera.fov += delta;
    camera.fov = Math.min(179, Math.max(0, camera.fov));
    camera.updateProjectionMatrix();
  });
}
function focusCamera(camera) {
  camera.lookAt(0,0,0);
}

function rotate(direction, object, rotateSpeed=0.02) {
  switch (direction) {
    case 'left':
      rotateObject(object, rotateSpeed);
      break;
    case 'right':
      rotateObject(object, -rotateSpeed);
      break;
    case 'up':
      rotateObjectY(object, rotateSpeed);
      break;

  }
}

function move(direction, object) {
  const moveSpeed = 0.1;
  const rightVector = getRightVector(object).normalize().multiplyScalar(moveSpeed);

  switch (direction) {
    case 'up':
      object.position.y += object.getWorldDirection(new THREE.Vector3()).x * moveSpeed;
      break;
    case 'down':
      object.position.y += object.getWorldDirection(new THREE.Vector3()).x * -moveSpeed;
      break;
    case 'forward':
      object.position.x += object.getWorldDirection(new THREE.Vector3()).x * moveSpeed;
      object.position.z += object.getWorldDirection(new THREE.Vector3()).z * moveSpeed;
      break;
    case 'back':
      object.position.x += object.getWorldDirection(new THREE.Vector3()).x * -moveSpeed;
      object.position.z += object.getWorldDirection(new THREE.Vector3()).z * -moveSpeed;
      break;
    case 'left':
      moveObject(object, rightVector.clone().multiplyScalar(-1));
      break;
    case 'right':
      moveObject(object, rightVector);
      break;
  }
}

function moveObject(object, direction) {
  object.position.add(direction);
}

function getRightVector(object) {
  const rightVector = new THREE.Vector3();
  object.getWorldDirection(rightVector).cross(object.up);
  return rightVector;
}

function rotateObject(object, angle) {
  object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
}
function rotateObjectY(object, angle) {
  object.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), angle);
}
export function setupEventListeners(gui, parentFolder) {
console.log('setupEventListeners');
console.log(this.addLight);
  const self = this;
  const lightTypeController = parentFolder.add({ type: selectedLightType }, 'type', Object.keys(lightTypes));
  lightTypeController.name('Lichtart auswählen');
  lightTypeController.onChange(function(value) {
    selectedLightType = value;
  });
  const defaultOptions = lightTypes[selectedLightType];   
  const addLightButton = parentFolder.add({ addLightButton: function() { 
    const currentSelectedType = lightTypeController.getValue();
    const defaultOptions = lightTypes[currentSelectedType];	
    self.addLight(gui, parentFolder, currentSelectedType, defaultOptions) }
    }, 
    'addLightButton'
  );
  addLightButton.name('Licht hinzufügen');

  const moveSpeed = 0.1;
  const rotateSpeed = 0.02;
  setupKeyboardListeners(moveSpeed, rotateSpeed);
  setupMouseListeners(moveSpeed, rotateSpeed, this.camera);
}
