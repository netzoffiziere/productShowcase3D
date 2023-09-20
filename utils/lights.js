import { lightTypes } from '../config/lights.js';
import * as THREE from 'three'; 

let lightCounter = 0;
let lightNamesCounter = {};

export function addDynamicLight(gui, parentFolder, scene, type='PointLight', options={ x: 0, y: 0, z: 0 }) { 
  addLight(gui, parentFolder, scene, type, options);
}

export function addLight(gui, parentFolder, scene, type = 'PointLight', options = {}) {
  const defaultOptions = lightTypes[type];
  options = { ...defaultOptions, ...options };
  const light = new THREE[type](options);
  if (!light) return null;
  Object.keys(options).forEach((key) => {
    switch(key) {
      case 'position':
        if (key === 'position' && typeof options.position === 'object') {
          light.position.set(options.position.x, options.position.y, options.position.z);
        } 
	break;
      case 'color':
        console.log(key+' : '+options[key]);
        break;
      default:
        light[key] = options[key];
        break;
    }
  });
  if (!lightNamesCounter[type]) {
    lightNamesCounter[type] = 1;
  } else {
    lightNamesCounter[type]++;
  }
  light.lightName = options.lightName || `${type}-${lightNamesCounter[type] || 1}`;
  scene.add(light);
  const folder = parentFolder.addFolder(light.lightName);
  folder.add(light, 'intensity', 0, 10);
  if(type=='SpotLight') {
    
  }
  if (light.color && light.color.isColor) {
    if(options.color) {
 	light.color.setHex(options.color);
    }
    const colorHex = '#' + light.color.getHexString();
    folder.addColor({ color: colorHex }, 'color').onChange((color) => {
      light.color.set(color);
    });
  }
  if(light.position && type == 'PointLight') {
    const lightSymbolGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    console.log(light.color);
    const lightSymbolMaterial = new THREE.MeshBasicMaterial({ color: light.color });
    const lightSymbolMesh = new THREE.Mesh(lightSymbolGeometry, lightSymbolMaterial);
    lightSymbolMesh.position.copy(light.position);
    scene.add(lightSymbolMesh);
  }
  if(light.position && (type !== 'AmbientLight' && type !== 'HemisphereLight')) {
    folder.add(light.position, 'x', -50, 50);
    folder.add(light.position, 'y', -50, 50);
    folder.add(light.position, 'z', -50, 50);
  }
  if (light.groundColor && light.groundColor.isColor) {
    if(options.groundColor) {
 	light.groundColor.setHex(options.groundColor);
    }
    const groundColorHex = '#' + light.groundColor.getHexString();
    folder.addColor({ groundColor: groundColorHex }, 'groundColor').onChange((groundColor) => {
      light.groundColor.set(groundColor);
    });
  }
  if(light.distance) {
    folder.add(light, 'distance', 0, 100).name('Distance').onChange((value) => {
      light.distance = value;
    });
  }
  if(light.decay) {
    folder.add(light, 'decay', 0, 10).name('Decay').onChange((value) => {
      light.decay = value;
    });
  }
  if (light instanceof THREE.DirectionalLight) {
    folder.add(light.target.position, 'x', -50, 50).name('X des Ziels');
    folder.add(light.target.position, 'y', -50, 50).name('Y des Ziels');
    folder.add(light.target.position, 'z', -50, 50).name('Z des Ziels');
  } 
  if (light instanceof THREE.SpotLight) {
    folder.add(light, 'angle', 0, Math.PI/2).name('Angle').onChange((value) => {
      light.angle = value;
    });
    folder.add(light, 'penumbra', 0, 1).step(0.01).name('Penumbra').onChange((value) => {
      light.penumbra = value;
    });
  } 
  if(light.castShadow&&!light.castShadow) {
console.log(light.castShadow);
    folder.add(light, 'castShadow').name('Schatten werfen').onChange((value) => {
console.log(value);
      light.castShadow = value;
      if (value) {
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;
      }
      light.shadow.map.dispose();
      light.shadow.map = null;
    });
  }

  folder.add({ remove: () => removeLightFromGUIAndScene(gui, scene, light) }, 'remove');
  return light;
}

export function removeLightFromGUIAndScene(gui, scene, light) {
  scene.remove(light);
  console.log('removeLight'+light);
  console.log(scene);

  const parentFolder = gui.__folders['Lichtquellen'];
  if (parentFolder) {
    const folder = parentFolder.__folders[light.lightName];
    if (folder) {
      folder.close();
      folder.domElement.parentNode.removeChild(folder.domElement);
      delete parentFolder.__folders[light.lightName];
    }
  }
/*
  const folder = gui.__folders[light.lightName];
  if (folder) {
    folder.close();
    folder.domElement.parentNode.removeChild(folder.domElement);
    delete gui.__folders[light.lightName];
  }
*/
}

