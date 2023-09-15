import * as THREE from 'three';

export function updateInfoPanel(camera) {
  const pos = camera.position;
  const rot = camera.rotation;

  document.getElementById('camera-position').textContent = `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`;
  document.getElementById('camera-rotation').textContent = `${THREE.MathUtils.radToDeg(rot.x).toFixed(2)}°, ${THREE.MathUtils.radToDeg(rot.y).toFixed(2)}°, ${THREE.MathUtils.radToDeg(rot.z).toFixed(2)}°`;
}

