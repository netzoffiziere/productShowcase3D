import { updateCameraPosition, updateCameraRotation } from './camera.js'; 
let isEditing = false;

function handleFocus() {
  isEditing = true;
  restrictToNumbersAndClearInput(event);
}

function handleBlur(event, camera, axis) {
 console.log('handleBlur');
  const value = parseFloat(event.target.innerText);
  isEditing = false;
  updateCameraPosition(camera, axis, value);
}
function restrictToNumbersAndClearInput(event) {
  if (event.type === 'input') {
    event.target.innerText = event.target.innerText.replace(/[^0-9.-]/g, '');
  } else if (event.type === 'focus') {
    event.target.innerText = '';
  }
}

export function updateInfoPanel(camera) {
  ['x', 'y', 'z'].forEach(axis => {
    const posElement = document.getElementById(`camera-pos-${axis}`);
    const rotElement = document.getElementById(`camera-rot-${axis}`);

    posElement.addEventListener('input', restrictToNumbersAndClearInput);
    posElement.addEventListener('focus', handleFocus);
    posElement.addEventListener('blur', function(event) { handleBlur(event, camera, axis)});

    rotElement.addEventListener('input', restrictToNumbersAndClearInput);
    rotElement.addEventListener('focus', handleFocus);
    rotElement.addEventListener('blur', handleBlur);
  });
  if(isEditing) return;
  const pos = camera.position;
  const rot = camera.rotation;

  document.getElementById('camera-pos-x').textContent = pos.x.toFixed(2);
  document.getElementById('camera-pos-y').textContent = pos.y.toFixed(2);
  document.getElementById('camera-pos-z').textContent = pos.z.toFixed(2);

  document.getElementById('camera-rot-x').textContent = THREE.MathUtils.radToDeg(rot.x).toFixed(2);
  document.getElementById('camera-rot-y').textContent = THREE.MathUtils.radToDeg(rot.y).toFixed(2);
  document.getElementById('camera-rot-z').textContent = THREE.MathUtils.radToDeg(rot.z).toFixed(2);

}
