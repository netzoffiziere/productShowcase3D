export function addLights(scene, cameraposition) {
  const light = new THREE.PointLight(0xFFFFFF, 1, 100);
  light.position.set(5, 5, 5);
  scene.add(light);
 
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  hemiLight.position.copy(cameraposition);
  scene.add(hemiLight);

}
