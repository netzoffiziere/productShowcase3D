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
export const skyMaterial = new THREE.ShaderMaterial({
	uniforms: {
		sunDirection: { value: new THREE.Vector3() }
	},
	vertexShader: `
		varying vec3 vWorldPosition;
		void main() {
			vec4 worldPosition = modelMatrix * vec4(position, 1.0);
			vWorldPosition = worldPosition.xyz;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
	fragmentShader: `
		uniform vec3 sunDirection;
		varying vec3 vWorldPosition;
		void main() {
			float intensity = dot(-normalize(vWorldPosition), sunDirection);
			vec3 color = mix(vec3(0.0, 0.0, 0.1), vec3(0.5, 0.7, 1.0), intensity * 0.5 + 0.5);
			gl_FragColor = vec4(color, 0.8);
		}
	`,
	side: THREE.BackSide,
	transparent: true,
	opacity: 0.8
});

