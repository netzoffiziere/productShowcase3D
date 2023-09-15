import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

export const loadGLB = async (scene, finalizeSetup, currentProduct) => {
  const url = `./assets/models/${currentProduct}.glb`;
  
  // Überprüfen, ob die Datei existiert
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


/*

export const loadGLB = (scene, finalizeSetup, currentProduct) => {
  console.log('Start: loadGLB');
  const url = `./assets/models/${currentProduct}.glb`;

  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      `./assets/models/${currentProduct}.glb`, 
      (gltf) => {
        scene.add(gltf.scene);
        resolve(true);
      }, 
      undefined, 
      (err) => {
        console.error(`Konnte ${currentProduct}.glb nicht laden: ${err}`);
        reject(false);
       }
    );
  });
};
*/
