import * as THREE from 'three';
import { debugLog } from './utils/debug.js';
import { CSM } from './node_modules/three/examples/jsm/csm/CSM.js';
import { concreteMaterial, sunMaterial, skyMaterial } from './utils/materials.js';
let DEBUG = false;
let currentProduct = "";
let glbExists = false;
let modelExists = false;
export function initializeConfig(bodyElement) {
  DEBUG = bodyElement.hasAttribute('data-debug');
  currentProduct = bodyElement.getAttribute('data-current-product');
  glbExists = bodyElement.getAttribute('data-glb-exists') === 'true';
  modelExists = bodyElement.getAttribute('data-model-exists') === 'true';
}

export function getConfig() {
  return { DEBUG, currentProduct, glbExists, modelExists };
}

export async function loadModules(worldObj) {
	let cameraModule, lightsModule;
	try {
 		lightsModule = await import(`./utils/lights.js`);
	} catch (error) {
		console.log('error beim Laden von lightsModule', error);
	}
	try {
		cameraModule = await import(`./utils/camera.js`);
	} catch (error) {
		console.log('error beim Laden von cameraModule', error);
	}
	try {
		worldObj.camera = cameraModule.setupCamera();
	} catch (error) {
		console.error('Fehler beim Laden aufruf von setupCamera', error);
	}
	try {
		worldObj.renderer = new THREE.WebGLRenderer({ antialias: true });
		document.getElementById('canvas').appendChild(worldObj.renderer.domElement);
		worldObj.renderer.useLegacyLights = true;
		worldObj.renderer.setSize( window.innerWidth, window.innerHeight );
		worldObj.renderer.shadowMap.enabled = true;
		worldObj.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	} catch (error) {
		console.error('Fehler beim Initialisieren des Renderer ', error);
	}
	try {
		if (worldObj.controls.type.toLowerCase() === 'orbitcontrols') {
		        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
			worldObj.orbitControls = new OrbitControls(worldObj.camera, worldObj.renderer.domElement);
			worldObj.orbitControls.minPolarAngle = 0; // 0 Grad
			worldObj.orbitControls.maxPolarAngle = Math.PI / 2;
			worldObj.orbitControls.minDistance = 0.15;  // Minimaler Abstand zur Mitte
			worldObj.orbitControls.maxDistance = 0.95;
			console.log('orbitControls initiated');
		}
	} catch (error) {
		console.error('Fehler beim Initialisieren der OribtCOntrols ', error);
	}
	try {
		if(worldObj.controls.type.toLowerCase() === 'pointerlockcontrols') {
			const { PointerLockControls } = await import('three/addons/controls/PointerLockControls.js');
			worldObj.pointerLockControls = new PointerLockControls(worldObj.camera, worldObj.renderer.domElement);
//			worldObj.pointerLockControls.minPolarAngle = -Math.PI / 2;
//			worldObj.pointerLockControls.maxPolarAngle = Math.PI / 2;

			const controlsModule = await import(`./utils/pointerLockControls.js`);
			worldObj.setupPointerLockControls = controlsModule.setupPointerLockControls;
			worldObj.updatePointerLockControls = controlsModule.updatePointerLockControls;
		}
	} catch (error) {
		console.error('Fehler beim Initialisieren der PointerLockControls ', error);
	}
	try {
		const loadGLBModule = await import(`./utils/loadGLB.js`);
		window.loadGLB = loadGLBModule.loadGLB;
		worldObj.updateCameraPosition = cameraModule.updateCameraPosition;
		worldObj.updateCameraRotation = cameraModule.updateCameraRotation;
		worldObj.addLight = lightsModule.addLight;
		const infopanelModule = await import(`./utils/infopanel.js`);
		worldObj.infopanelEventListeners = infopanelModule.infopanelEventListeners;
		worldObj.updateInfopanel = infopanelModule.updateInfopanel;
		worldObj.initEventListeners = infopanelModule.initEventListeners;
		const eventListenersModule = await import(`./utils/eventListeners.js`);
		worldObj.setupEventListeners = eventListenersModule.setupEventListeners;
	} catch (error) {
		console.error('Fehler beim Laden eines weiteren Moduls:', error);
	}
}

export async function loadResources(worldObj) {
	let model = null;
	try {
		if (glbExists) {
			const glbResult = await window.loadGLB(finalizeSetup, currentProduct);
		} else {
			debugLog('Kein glb!');
		}
		if (modelExists) {
       			const module = await import(`./welten/models/${currentProduct}.js`);
		        const createMyModel = module.createMyModel;
			if (module && typeof module.createMyModel === 'function') {
				let myObj = module.createMyModel(worldObj.scene);
			} else {
				console.error('createMyModel ist keine Funktion');
			}
		}
		finalizeSetup(worldObj, model = null);
	} catch (err) {
		console.error(`Fehler: ${err}`);
	}
}

export function finalizeSetup(worldObj, model = null) {
	if (model) {
		const mainObject = new THREE.Mesh(model.geometry, model.material);
		worldObj.scene.add(mainObject);
	}
	worldObj.camera.position.set(worldObj.cameraSettings.position.x, worldObj.cameraSettings.position.y, worldObj.cameraSettings.position.z);
	worldObj.camera.lookAt(worldObj.cameraSettings.lookAt.x, worldObj.cameraSettings.lookAt.y, worldObj.cameraSettings.lookAt.z);
	worldObj.renderer.setClearColor(0x0a0a0a);
	worldObj.renderer.setSize(window.innerWidth, window.innerHeight);
}
export function setupCSM(worldObj) {
        let csm = new CSM({
                maxFar: worldObj.csm.maxFar,
                near: worldObj.csm.near,
                lightNear: worldObj.csm.lightNear,
                mode: worldObj.csm.mode,
                fade: worldObj.csm.fade,
                cascades: worldObj.csm.cascades,
                shadowMapSize: worldObj.csm.shadowMapSize,
                lightDirection: new THREE.Vector3(...worldObj.csm.lightDirection).normalize(),
                camera: worldObj.camera,
                shadowBias:worldObj.csm.shadowBias,
                lightIntensity: worldObj.csm.lightIntensity,
                parent: worldObj.scene
        });
        csm.update();
        return csm;
}
export function createObjectsFromConfig(scene, objectsConfig, parentGroup = null) {
  objectsConfig.forEach(objConfig => {
    let geometry, material, mesh, light, group;
    switch (objConfig.type) {
      case 'Sphere':
        geometry = new THREE.SphereGeometry(
          objConfig.geometry.radius,
          objConfig.geometry.widthSegments,
          objConfig.geometry.heightSegments
        );
        if (objConfig.material.type === "ShaderMaterial") {
                material = skyMaterial;
        } else if (objConfig.material.type==="sunMaterial" ) {
                material = sunMaterial;
        } else {
                material = new THREE[objConfig.material.type]({
                color: new THREE.Color(parseInt(objConfig.material.color, 16)),
                specular: new THREE.Color(objConfig.material.specular),
                shininess: objConfig.material.shininess
          });
        }
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(objConfig.position.x, objConfig.position.y, objConfig.position.z);
        mesh.name = objConfig.name || 'Unbenanntes Mesh';
        mesh.receiveShadow = objConfig.receiveShadow !== undefined ? objConfig.receiveShadow : false;
        mesh.castShadow = objConfig.castShadow !== undefined ? objConfig.castShadow : false;
        break;
      case 'Group':
        group = new THREE.Group();
        group.name = objConfig.name || 'Unbenannte Gruppe';
        group.position.set(objConfig.position.x, objConfig.position.y, objConfig.position.z);
        if (objConfig.children) {
          createObjectsFromConfig(scene, objConfig.children, group);
        }
        break;
      default:
        console.warn(`Unbekannter Objekttyp: ${objConfig.type}`);
    }

    const objectToAdd = mesh || light || group;
    if (objectToAdd) {
      if (parentGroup) {
        parentGroup.add(objectToAdd);
      } else {
        scene.add(objectToAdd);
      }
    }
  });
}
export function addObjectsToGuiFolder(folder, objects, parentIndex ='') {
        objects.forEach((obj, index) => {
                let objFolder;
                const uniqueIndex = `${parentIndex}${index}`;
                if (obj.type === 'Group') {
                        const subFolder = folder.addFolder(obj.name || `Gruppe ${uniqueIndex}`);
                        addObjectsToGuiFolder(subFolder, obj.children);
                } else if (obj.type === 'Mesh') {
                        const objFolder = folder.addFolder(obj.name || `Objekt ${uniqueIndex}`);
                        objFolder.add({ type: obj.geometry.type }, 'type').name('Art').listen();
                        if ('castShadow' in obj) {
                                objFolder.add(obj, 'castShadow').name('Schatten werfen');
                        }
                        if ('receiveShadow' in obj) {
                                objFolder.add(obj, 'receiveShadow').name('Schatten empfangen');
                        }
                        if (obj.position) {
                                if ('x' in obj.position && obj.position.x !== undefined) objFolder.add(obj.position, 'x').name('X-Position');
                                if ('y' in obj.position && obj.position.y !== undefined) objFolder.add(obj.position, 'y').name('Y-Position');
                                if ('z' in obj.position && obj.position.z !== undefined) objFolder.add(obj.position, 'z').name('Z-Position');
                        }
                        if (obj.rotation) {
                                if ('x' in obj.rotation && obj.rotation.x !== undefined) objFolder.add(obj.rotation, 'x').name('X-Rotation').min(-Math.PI).max(Math.PI).step(0.01);
                                if ('y' in obj.rotation && obj.rotation.y !== undefined) objFolder.add(obj.rotation, 'y').name('Y-Rotation').min(-Math.PI).max(Math.PI).step(0.01);
                                if ('z' in obj.rotation && obj.rotation.z !== undefined) objFolder.add(obj.rotation, 'z').name('Z-Rotation').min(-Math.PI).max(Math.PI).step(0.01);
                        }
                        if (obj.scale) {
                                if ('x' in obj.scale && obj.scale.x !== undefined) objFolder.add(obj.scale, 'x').name('X-Skalierung').min(0.1).max(3).step(0.1);
                                if ('y' in obj.scale && obj.scale.y !== undefined) objFolder.add(obj.scale, 'y').name('Y-Skalierung').min(0.1).max(3).step(0.1);
                                if ('z' in obj.scale && obj.scale.z !== undefined) objFolder.add(obj.scale, 'z').name('Z-Skalierung').min(0.1).max(3).step(0.1);
                        }
                        if ('visible' in obj) {
                                objFolder.add(obj, 'visible').name('Sichtbar');
                        }
                        if (obj.material) {
                                if (obj.material.color && obj.material.color.isColor) {
                                        objFolder.addColor(obj.material, 'color').name('Farbe');
                                }
                                if ('wireframe' in obj.material) {
                                        objFolder.add(obj.material, 'wireframe').name('Drahtgitter');
                                }
                                if ('transparent' in obj.material) {
                                        objFolder.add(obj.material, 'transparent').name('Transparenz');
                                }
                                if ('opacity' in obj.material && obj.material.opacity !== undefined) {
                                        objFolder.add(obj.material, 'opacity', 0, 1).name('Deckkraft').step(0.1);
                                }
                        }
                        if ('name' in obj) {
                                objFolder.add(obj, 'name').name('Name');
                        }
                }
        });
}

