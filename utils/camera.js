import * as THREE from 'three';
export function setupCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5120000);
  return camera;
}

export function updateCameraPosition(axis, value, worldObj) {
  worldObj.camera.position[axis] = value;
}

export function updateCameraRotation(axis, value, worldObj) {
  worldObj.camera.rotation[axis] = THREE.MathUtils.degToRad(value);
}
