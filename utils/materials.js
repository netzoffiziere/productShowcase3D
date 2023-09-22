import * as THREE from 'three';

export const concreteMaterial = new THREE.MeshStandardMaterial({
	color: 0x808080,
	roughness: 0.8,
	metalness: 0.2
});
export const sunMaterial = new THREE.MeshBasicMaterial({
	color: new THREE.Color('yellow'),
	emissive: new THREE.Color('orange')
});
