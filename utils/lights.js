import { lightTypes } from '../config/lights.js'; 
let lightCounter = 0;
let lightNamesCounter = {};
let currentPreviewLight = null;
let currentScene = null;
let currentModal = null;

const saveButton = document.getElementById('addLightBtn');
saveButton.addEventListener('click', function() {
  if(currentScene && currentModal) {
    let time = Date.now(); // Millisekunden
    let timeInSeconds = Math.floor(Date.now() / 1000);
    console.log('save light: '+timeInSeconds);
    const type = document.getElementById('lightType').value;
    const name = document.getElementById('lightName').value;
    let light = addLight(currentScene, type, { lightName: name });
    console.log('save light:'+light);
    addLightToDOMList(currentScene, light);
    console.log('remove preview');
    removePreviewLight(currentScene);
    console.log('modal hide');
    currentModal.hide();
    console.log('modal geschlossen?');
  }
});

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

export function addLight(scene, type = 'PointLight', options = {}, incrementCounter = true) {
  let light;
  let lightPreview;
  const defaultOptions = lightTypes[type];
  if (!defaultOptions) return null;
  const finalOptions = { ...defaultOptions, ...options };
  light = new THREE[type](...Object.values(finalOptions));
  if(!light) return null;
  if(incrementCounter) {
    console.log('++'+lightCounter);
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
  } else { 
    light.lightName = 'preview'; 
  }
  scene.add(light);
  return light;
}
export function addPreviewLight(scene, type, options) {
  if (currentPreviewLight) {
    scene.remove(currentPreviewLight);
  }
  return currentPreviewLight = addLight(scene, type, options, false);
}

export function removePreviewLight(scene) {
  if (currentPreviewLight) {
    scene.remove(currentPreviewLight);
    currentPreviewLight = null;
  }
}
export function createLightPopup(scene, event) {
  const form = document.getElementById('lightForm');
  const windowHeight = window.innerHeight;
  const modalElement = document.getElementById('lightModal');
  const modal = new bootstrap.Modal(document.getElementById('lightModal'));
  currentScene = scene;
  currentModal = modal;

  form.innerHTML = `
    <div class="mb-3">
      <label for="lightType" class="form-label">Type</label>
      <select class="form-select" id="lightType">
        <option value="PointLight">PointLight</option>
        <option value="HemisphereLight">HemisphereLight</option>
        <option value="AmbientLight">AmbientLight</option>
      </select>
    </div>
    <div class="mb-3">
      <label for="lightName" class="form-label">Name</label>
      <input type="text" class="form-control" id="lightName">
    </div>
    <div class="mb-3">
      <label for="lightPosition" class="form-label">Position</label>
      <input type="text" class="form-control" id="lightPosition">
    </div>
    <div class="mb-3">
      <label for="lightDirection" class="form-label">Fokus/Richtung</label>
      <input type="text" class="form-control" id="lightDirection">
    </div>
    <div class="mb-3">
      <label for="lightIntensity" class="form-label">Intensität</label>
      <input type="text" class="form-control" id="lightIntensity">
    </div>
    <div class="mb-3">
      <label for="lightColor" class="form-label">Farbe</label>
      <input type="text" class="form-control" id="lightColor">
    </div>
  `;
/*  modalElement.addEventListener('shown.bs.modal', () => {
    const modalDialog = document.querySelector('.modal-dialog');
    modalDialog.style.position = 'fixed';
    modalDialog.style.left = `${event.clientX}px`;
    modalDialog.style.top = `${event.clientY}px`;
    const modalHeight = modalDialog.offsetHeight;
    if ((event.clientY + modalHeight) > windowHeight) {
      modalDialog.style.top = `${windowHeight - modalHeight - 50}px`;
    }
  });
*/
  let currentPreviewLight = addPreviewLight(scene, 'PointLight', { x: 5, y: 0, z: 5 }, null);
  modal.show();

  document.getElementById('closeLightBtn').addEventListener('click', () => {
    console.log('close');
    removePreviewLight(scene);
    modal.hide();
  });
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', (event) => {
      const type = document.querySelector('#lightType').value;
      const options = {
        lightName: document.querySelector('#lightName').value,
        x: parseFloat(document.querySelector('#lightPosition').value.split(',')[0]),
        y: parseFloat(document.querySelector('#lightPosition').value.split(',')[1]),
        z: parseFloat(document.querySelector('#lightPosition').value.split(',')[2]),
        direction: document.querySelector('#lightDirection').value,  // Für spätere Verwendung
        intensity: parseFloat(document.querySelector('#lightIntensity').value),
        color: document.querySelector('#lightColor').value
      };
      currentPreviewLight = onPopupInputChange(scene, type, options);
    });
  });
}
function onPopupInputChange(scene, type, options) {
  return addPreviewLight(scene, type, options);
}
function onPopupClose() {
  removePreviewLight(scene);
}


