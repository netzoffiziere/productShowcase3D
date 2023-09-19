export const lightTypes = {
  'PointLight': { color: 0xFFFFFF, intensity: 1, distance: 100 },
  'HemisphereLight': { color: 0xFFFFFF, groundColor: 0x000000, intensity: 1 },
  'AmbientLight': { color: 0xFFFFFF, intensity: 1 },
  'DirectionalLight': { color: 0xFFFFFF, intensity: 1 },
  'SpotLight': { color: 0xFFFFFF, intensity: 1, distance: 100, angle: Math.PI / 4 },
  'RectAreaLight': { color: 0xFFFFFF, intensity: 1, width: 10, height: 10 }
};
