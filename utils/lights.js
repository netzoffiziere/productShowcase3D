let lightCounter = 0;
let lightNamesCounter = {};
let currentPreviewLight = null;

export function addLightToDOMList(scene, light) {
  const lightElement = document.createElement('li');
  lightElement.id = light.myId;
  lightElement.setAttribute('data-light-intensity', light.intensity);
  lightElement.className = 'list-group-item d-flex justify-content-between align-items-center';
  lightElement.innerHTML = `
    <span class="flex-grow-1">${light.lightName}</span>
    <button class="btn btn-danger btn-xs m-1 remove-light"><i class="fa fa-trash fa-xs"></i></button>
    <button class="btn btn-primary btn-xs m-1 toggle-light" data-light-id="${light.myId}"><i class="fa fa-xs fa-lightbulb"></i></button>
  `;
  document.getElementById('light-list').appendChild(lightElement);

  lightElement.querySelector('.remove-light').addEventListener('click', () => {
    scene.remove(light);
    lightElement.remove();
  });
  lightElement.querySelector('.toggle-light').addEventListener('click', () => {
    const lightIntensity = lightElement.getAttribute('data-light-intensity');
    if (lightIntensity !== null) {
        if (parseFloat(lightIntensity) !== light.intensity) {
            light.intensity = parseFloat(lightIntensity);
        } else {
            light.intensity = 0;
        }
    } else {
      light.intensity = (light.intensity !== 0) ? 0 : 1;
    }
  });
}

export function addLight(scene, type = 'PointLight', options = {}) {
  let light;
  let lightPreview;
  switch (type) {
    case 'PointLight':
      light = new THREE.PointLight(options.color || 0xFFFFFF, options.intensity || 1, options.distance || 100);
      light.position.set(options.x || 5, options.y || 5, options.z || 5);
      lightPreview = new THREE.PointLight(options.color || 0xFFFFFF, options.intensity || 1, options.distance || 100);
    break;
    case 'HemisphereLight':
      light = new THREE.HemisphereLight(options.color || 0xFFFFFF, options.groundColor || 0x000000, options.intensity || 1);
      lightPreview = new THREE.HemisphereLight(options.color || 0xFFFFFF, options.groundColor || 0x000000, options.intensity || 1);
      light.position.copy(options.position);
      break;
    case 'AmbientLight':
      light = new THREE.AmbientLight(options.color || 0xFFFFFF, options.intensity || 1);
      lightPreview = new THREE.AmbientLight(options.color || 0xFFFFFF, options.intensity || 1);
      break;
    default:
      return null;
  }
  light.myId = `light-${lightCounter++}`;
  if (options.lightName) {
    light.lightName = options.lightName;
  } else {
    if (!lightNamesCounter[type]) {
      lightNamesCounter[type] = 1;
    } else {
      lightNamesCounter[type]++;
    }
    light.lightName = `${type}-${lightNamesCounter[type]}`;
  }

  scene.add(light);
  return light;
}
export function addPreviewLight(scene, type, options) {
  if (currentPreviewLight) {
    scene.remove(currentPreviewLight);
  }
  return currentPreviewLight = addLight(scene, type, options);
}

export function removePreviewLight(scene) {
  if (currentPreviewLight) {
    scene.remove(currentPreviewLight);
    currentPreviewLight = null;
  }
}


