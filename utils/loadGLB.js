import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
export const loadGLB = async (scene, finalizeSetup, currentProduct) => {
  const url = `./assets/models/${currentProduct}.glb`;
  
  let response;
  try {
    response = await fetch(url, { method: 'HEAD' });
  } catch(err) {
    console.log('GLB: Netzwerkfehler oder CORS-Problem.');
    return Promise.resolve(false);
  }
  if (response.status !== 200) {
    console.log('GLB: Datei nicht gefunden, ignoriert');
    return Promise.resolve(false);
  }
  return new Promise((resolve, reject) => {
  const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
   gltf.scene.traverse(setReceiveShadow);
    gltf.scene.traverse(setSpecificShadows);
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.y = -0.04;
    scene.add(gltf.scene);
    console.log("Modell zur Szene hinzugefügt.");
    resolve(true);
      },
      undefined,
      (err) => {
        console.error(`GLB: Konnte ${currentProduct}.glb nicht laden: ${err}`);
        reject(false);
      }
    );
  });
};
function setSpecificShadows(object) {
  const targetNames = ["Stamm_-_Teil_2", "Stamm_-_Teil_3", "Stamm_-_Teil_6"];
  if (object.isMesh && targetNames.includes(object.name)) {
    object.castShadow = true;
    object.receiveShadow = true;
  }
  object.children.forEach(setSpecificShadows);
}
function setReceiveShadow(object) {
	if (object.isMesh) {
    		object.castShadow = true;
		object.receiveShadow = true;
	}
	object.children.forEach(setReceiveShadow);
}

