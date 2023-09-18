import { updateCameraPosition, updateCameraRotation } from './camera.js'; 
let isEditing = false;

console.log('start updateInfoPanel');
function handleFocus() {
console.log('handleFocus');
  isEditing = true;
  document.execCommand('selectAll', false, null);
}

function handleBlur(event, camera, axis, type) {
  let value = parseFloat(event.target.innerText.replace(/[^0-9.-]/g, ''));
  if (isNaN(value)) { value = 0; event.target.innerText = value; }
  switch(type) {
    case 'rotation':
      updateCameraRotation(camera, axis, value);
      break;
    case 'position':
      updateCameraPosition(camera, axis, value);
      break;
  }
  isEditing = false;
}

function handleFovBlur(event, camera) {
  let value = parseFloat(event.target.innerText.replace(/[^0-9.-]/g, ''));
  if (isNaN(value)) { value = 75; event.target.innerText = value; }
  camera.fov = value;
  camera.updateProjectionMatrix();
  isEditing = false;
}

export function initEventListeners(camera) {
  document.getElementById('camera-fov').addEventListener('focus', handleFocus);
  document.getElementById('camera-fov').addEventListener('blur', function(event) { handleFovBlur(event, camera)});
  ['x', 'y', 'z'].forEach(axis => {
    const posElement = document.getElementById(`camera-pos-${axis}`);
    const rotElement = document.getElementById(`camera-rot-${axis}`);
    posElement.addEventListener('focus', handleFocus);
    posElement.addEventListener('blur', function(event) { handleBlur(event, camera, axis, 'position')});
    rotElement.addEventListener('focus', handleFocus);
    rotElement.addEventListener('blur', function(event) { handleBlur(event, camera, axis, 'rotation')});
  });
}

export function updateInfoPanel(camera) {
  if(isEditing) return;
  const pos = camera.position;
  const rot = camera.rotation;
  document.getElementById('camera-pos-x').textContent = pos.x.toFixed(2);
  document.getElementById('camera-pos-y').textContent = pos.y.toFixed(2);
  document.getElementById('camera-pos-z').textContent = pos.z.toFixed(2);
  document.getElementById('camera-rot-x').textContent = THREE.MathUtils.radToDeg(rot.x).toFixed(2);
  document.getElementById('camera-rot-y').textContent = THREE.MathUtils.radToDeg(rot.y).toFixed(2);
  document.getElementById('camera-rot-z').textContent = THREE.MathUtils.radToDeg(rot.z).toFixed(2);
  document.getElementById('camera-fov').textContent = camera.fov.toFixed(2);
}
