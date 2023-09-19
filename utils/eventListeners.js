import { lightTypes } from '../config/lights.js';
let selectedLightType = 'PointLight'; 

function setupKeyboardListeners(camera, moveSpeed, rotateSpeed, scene) {
  /*window.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    switch (key) {
      case 'arrowup':
      case 'w':
        move('forward', camera);
        break;
      case 'arrowdown':
      case 's':
        move('back', camera);
        break;
      case 'arrowleft':
      case 'a':
        move('left', camera);
        break;
      case 'arrowright':
      case 'd':
        move('right', camera);
        break;
      case 'e':
        rotate('right', camera);
        break;
      case 'q':
        rotate('left', camera);
        break;
      case 'r':
        move('up', camera);
        break;
      case 'f':
        move('down', camera);
        break;
      case 'x':
        move('down', camera);
        break;
    }
  });
  */
}
function setupMouseListeners(camera, moveSpeed, rotateSpeed, scene) {
/*
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0,
  };
  document.addEventListener('wheel', (event) => {

    const delta = -event.deltaY * 0.05;
    camera.fov += delta;
    camera.fov = Math.min(179, Math.max(0, camera.fov));
    camera.updateProjectionMatrix();
  });

  document.getElementById('move-up').addEventListener('click', () => move('up', camera));
  document.getElementById('move-down').addEventListener('click', () => move('down', camera));
  document.getElementById('focusButton').addEventListener('click', () => focusCamera(camera));
  document.getElementById('rotate-left').addEventListener('click', () => rotate('left', camera));
  document.getElementById('move-forward').addEventListener('click', () => move('forward', camera));
  document.getElementById('rotate-right').addEventListener('click', () => rotate('right', camera));
  document.getElementById('move-left').addEventListener('click', () => move('left', camera));
  document.getElementById('move-back').addEventListener('click', () => move('back', camera));
  document.getElementById('move-right').addEventListener('click', () => move('right', camera));
  document.addEventListener('mousedown', (event) => {
    if (event.button === 1) {
      focusCamera(camera);
    }
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  });
  document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };
    const sensitivity = 0.002; 
    rotate('left', camera, deltaMove.x * sensitivity);
    rotate('up', camera, deltaMove.y * sensitivity);
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
*/
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
      //moveObject(object, object.getWorldDirection(new THREE.Vector3()).multiplyScalar(moveSpeed));
      break;
    case 'back':
      object.position.x += object.getWorldDirection(new THREE.Vector3()).x * -moveSpeed;
      object.position.z += object.getWorldDirection(new THREE.Vector3()).z * -moveSpeed;
      //moveObject(object, object.getWorldDirection(new THREE.Vector3()).multiplyScalar(-moveSpeed));
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
export function setupEventListeners(camera, scene, gui, parentFolder, addDynamicLight) {
  const lightTypeController = gui.add({ type: selectedLightType }, 'type', Object.keys(lightTypes));
  lightTypeController.name('Lichtart auswählen');
  lightTypeController.onChange(function(value) {
    selectedLightType = value;
  });
  const defaultOptions = lightTypes[selectedLightType];   
  const addLightButton = gui.add({ addLightButton: function() { 
    const currentSelectedType = lightTypeController.getValue();
    const defaultOptions = lightTypes[currentSelectedType];	
    console.log(currentSelectedType); 
    console.log(gui); 
    console.log(scene); 
    addDynamicLight(gui, parentFolder, scene, currentSelectedType, defaultOptions) }
    }, 
    'addLightButton'
  );
  addLightButton.name('Licht hinzufügen');

  const moveSpeed = 0.1;
  const rotateSpeed = 0.02;
/*  document.getElementById('addLight').addEventListener('click', function() {
    addDynamicLight(gui, parentFolder, scene, selectedLightType, defaultOptions);
  });*/
  setupKeyboardListeners(camera, moveSpeed, rotateSpeed, scene);
  setupMouseListeners(camera, moveSpeed, rotateSpeed, scene);
}
