export function setupCamera(THREE) {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000000);
  return camera;
}

export function updateCameraPosition(camera, axis, value) {
  camera.position[axis] = value;
}

export function updateCameraRotation(camera, axis, value) {
  camera.rotation[axis] = THREE.MathUtils.degToRad(value);
}
