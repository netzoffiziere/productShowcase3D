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
  console.log('GLTF promise1');
  const loader = new GLTFLoader();
  console.log('GLTF promise2');
    loader.load(
      url,
      (gltf) => {
        scene.add(gltf.scene);
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

