import { lightTypes } from '../config/lights.js';
import * as THREE from 'three'; 
let lightCounter = 0;
let lightNamesCounter = {};
const lightSymbolMeshes = {};

function updateLightSymbol(light) {
	const lightSymbolMesh = lightSymbolMeshes[light.lightName];
	if (lightSymbolMesh) {
		lightSymbolMesh.position.set(light.position.x, light.position.y, light.position.z);
		light.position.copy(lightSymbolMesh.position);
	}
}

function createLightSymbol(scene, light, geometry) {
console.log('CreateLightSymbol');
console.log(scene);
console.log(light);
	const material = new THREE.MeshBasicMaterial({ color: light.color });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.copy(light.position);
	mesh.name = light.lightName;
	scene.add(mesh);
	lightSymbolMeshes[light.lightName] = mesh;
}

export function addLight(gui, parentFolder, type = 'PointLight', options = { position: {x:5,y:5,z:5}}) {
console.log('addLight:'+type);
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
        //console.log(key+' : '+options[key]);
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
  this.scene.add(light);
 console.log('light added to scene'); 
  const folder = parentFolder.addFolder(light.lightName);
  if(light.lightName=='Sonne') {
    folder.add(light, 'intensity', 0, 100000);
  } else { 
    folder.add(light, 'intensity', 0, 10);
  }
  if(type=='SpotLight') {
    
  }
  if (light.color && light.color.isColor) {
    if(options.color) {
 	light.color.setHex(options.color);
    }
  console.log('colorHex:' +light.color);
  const colorHex = '#' + light.color.getHexString();
  console.log(colorHex);
    folder.addColor({ color: colorHex }, 'color').onChange((color) => {
  console.log(colorHex);
      light.color.set(color);
      const lightSymbolMesh = lightSymbolMeshes[light.lightName];
        if (lightSymbolMesh) {
console.log('lightSymbolMesh');
console.log(lightSymbolMesh);
          lightSymbolMesh.material.color.set(color);
        }
    });
  }
  if(light.position) {
console.log(light.position + ' :: ' +type);
	switch(type) {
		case 'PointLight':
			if (light.lightName == 'Sonne') {
				createLightSymbol(this.scene, light, new THREE.SphereGeometry(4000, 32, 32));
			} else {
				createLightSymbol(this.scene, light, new THREE.SphereGeometry(0.002, 32, 32));
			}
			break;
		case 'SpotLight':
			createLightSymbol(this.scene, light, new THREE.ConeGeometry(0.001, 0.002, 32));
			break;
		default:
			break;
	}
  }

  if(light.position && (type !== 'AmbientLight' && type !== 'HemisphereLight')) {
	folder.add(light.position, 'x', -50, 50).onChange(() => updateLightSymbol(light));
	folder.add(light.position, 'y', -50, 50).onChange(() => updateLightSymbol(light));
	folder.add(light.position, 'z', -50, 50).onChange(() => updateLightSymbol(light));
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
	let maxDistance = 100;
	if(light.lightName=='Sonne') {
		maxDistance = 100000;
	}
	folder.add(light, 'distance', 0, maxDistance).name('Distance').onChange((value) => {
		light.distance = value;
	});
  }
  if(light.decay) {
    folder.add(light, 'decay', 0, 2).name('Decay').onChange((value) => {
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
  if(light instanceof THREE.PointLight) {
    folder.add(light, 'castShadow').name('Schatten werfen').onChange((value) => {
      light.castShadow = value;
  /*    if (value) {
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 72500;
      }
    */
//      light.shadow.map.dispose();
  //    light.shadow.map = null;
    });
  }
  folder.add(light, 'receiveShadow').name('Schatten empfangen').onChange((value) => {
    light.receiveShadow = value;
  });

  folder.add({ remove: () => removeLightFromGUIAndScene(gui, this.scene, light) }, 'remove');
  return light;
}

export function removeLightFromGUIAndScene(gui, scene, light) {
  scene.remove(light);

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

