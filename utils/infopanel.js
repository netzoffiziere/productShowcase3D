import { updateCameraPosition, updateCameraRotation } from './camera.js'; 
let isEditing = false;

function handleFocus() {
  isEditing = true;
  document.execCommand('selectAll', false, null);
}

function handleBlur(worldObj, event, axis, type) {
  let value = parseFloat(event.target.innerText.replace(/[^0-9.-]/g, ''));
  if (isNaN(value)) { value = 0; event.target.innerText = value; }
  switch(type) {
    case 'rotation':
      updateCameraRotation(axis, value, worldObj);
      break;
    case 'position':
      updateCameraPosition(axis, value, worldObj);
      break;
  }
  isEditing = false;
}

function handleFovBlur(worldObj, event) {
  let value = parseFloat(event.target.innerText.replace(/[^0-9.-]/g, ''));
  if (isNaN(value)) { value = 75; event.target.innerText = value; }
  worldObj.camera.fov = value;
  worldObj.camera.updateProjectionMatrix();
  isEditing = false;
}

export function infopanelEventListeners() {
  const self = this;
  ['x', 'y', 'z'].forEach(axis => {
    const fovElement = document.getElementById(`camera-fov`);
    const posElement = document.getElementById(`camera-pos-${axis}`);
    const rotElement = document.getElementById(`camera-rot-${axis}`);
    fovElement.addEventListener('focus', handleFocus);
    fovElement.addEventListener('blur', function(event) { handleFovBlur(self, event)});
    posElement.addEventListener('focus', handleFocus);
    posElement.addEventListener('blur', function(event) { handleBlur(self, event, axis, 'position')});
    rotElement.addEventListener('focus', handleFocus);
    rotElement.addEventListener('blur', function(event) { handleBlur(self, event, axis, 'rotation')});
  });
}

export function updateInfopanel() {
  if(isEditing) return;
  const pos = this.camera.position;
  const rot = this.camera.rotation;
  document.getElementById('camera-pos-x').textContent = pos.x.toFixed(2);
  document.getElementById('camera-pos-y').textContent = pos.y.toFixed(2);
  document.getElementById('camera-pos-z').textContent = pos.z.toFixed(2);
  document.getElementById('camera-rot-x').textContent = THREE.MathUtils.radToDeg(rot.x).toFixed(2);
  document.getElementById('camera-rot-y').textContent = THREE.MathUtils.radToDeg(rot.y).toFixed(2);
  document.getElementById('camera-rot-z').textContent = THREE.MathUtils.radToDeg(rot.z).toFixed(2);
  document.getElementById('camera-fov').textContent = this.camera.fov.toFixed(2);
}
