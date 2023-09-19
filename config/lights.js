/*
export const lightTypes = {
  'HemisphereLight': { position: { x: 10, y: -10, z: 10 }, lightName: 'Hemisphere', intensity: 1, skyColor: 0x0000FF, groundColor: 0x00FF00 },
  'AmbientLight': { position: { x: -5, y: 5, z: 0 }, intensity: 1 },
  'DirectionalLight': { position: { x: -5, y: 5, z: 0 }, intensity: 1, color: 0xFFFFFF },
  'SpotLight': { position: { x: -5, y: 5, z: 0 }, intensity: 1, angle: Math.PI / 4, penumbra: 0.1 },
  'RectAreaLight': { position: { x: -5, y: 5, z: 0 }, intensity: 1, width: 10, height: 10, color: 0xFFFF00 }
};
*/
export const lightTypes = {
  'PointLight': { },
  'SpotLight': { penumbra: 0.2, angle: Math.PI/4 },
  'DirectionalLight': { },
  'AmbientLight': { },
  'RectAreaLight': { },
  'HemisphereLight': { }
};
