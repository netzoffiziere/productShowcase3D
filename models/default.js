export const model = {
  geometry: new THREE.BoxGeometry(),
  material: new THREE.MeshStandardMaterial({ 
    color: 0xaaaaaa,
    metalness: 0.8,
    roughness: 0.2
  }),
  features: [
    {
      geometry: new THREE.PlaneGeometry(1, 1),
      material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide }),
      position: [0, 0, 0.5] // Vorderseite
    },
    {
      geometry: new THREE.PlaneGeometry(1, 1),
      material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide }),
      position: [0, 0, -0.5] // Rückseite
    },
    {
      geometry: new THREE.PlaneGeometry(1, 1),
      material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide }),
      position: [0, 0.5, 0] // Oben
    },
    {
      geometry: new THREE.PlaneGeometry(1, 1),
      material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide }),
      position: [0, -0.5, 0] // Unten
    },
    {
      geometry: new THREE.PlaneGeometry(1, 1),
      material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide }),
      position: [0.5, 0, 0] // Rechts
    },
    {
      geometry: new THREE.PlaneGeometry(1, 1),
      material: new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide }),
      position: [-0.5, 0, 0] // Links
    }
  ]
};
