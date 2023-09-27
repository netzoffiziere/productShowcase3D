import * as THREE from 'three';
import * as BufferGeometryUtils from '../../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js';
let wallGroupCounter = 0;

export function createMyModel(scene) {
	const hausGroup = new THREE.Group();
	hausGroup.name = 'Gruppe: Haus';
	const wallData = [
		{ x: -10, y: 8, x2: 10, y2: 10, type: 'wall' },
		{ x: -10, y: 0, x2: -6, y2: 8, type: 'wall' },
		{ x: -6, y: 0, x2: -3, y2: 8, type: 'window' },
		{ x: -3, y: 0, x2: -1.5, y2: 8, type: 'wall' },
		{ x: -1.5, y: 0, x2: 1.5, y2: 8, type: 'window' },
		{ x: 1.5, y: 0, x2: 3, y2: 8, type: 'wall' },
		{ x: 3, y: 0, x2: 6, y2: 8, type: 'window' },
		{ x: 6, y: 0, x2: 10, y2: 8, type: 'wall' }
	];

	createRoof(hausGroup);
	createWall(hausGroup, -10, 0, wallData);
	createWall(hausGroup, 10, 0, wallData);
	createWall(hausGroup, 10, Math.PI / 2, wallData);
	createWall(hausGroup, -10, Math.PI / 2, wallData);

	const floorGroup = new THREE.Group();
	createFloor(floorGroup, 20, 20);
	hausGroup.add(floorGroup);
	hausGroup.scale.set(0.1, 0.1, 0.1);
	hausGroup.position.set(0, -0.05, 0);
	scene.add(hausGroup);
}

function createWall(group, zPosition, rotationY, wallData) {
    const wallGroup = new THREE.Group();
    wallGroup.name = 'Gruppe: Wände '+wallGroupCounter;
    wallGroupCounter++;
    const concreteMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2
    });
    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x8888ff,
        transparent: true,
        opacity: 0.5,
        depthTest: true,
        alphaTest: 0.5
    });
    let fNr = 0;
    let wNr = 0;
    wallData.forEach(data => {
        const { x, y, x2, y2, type } = data;
        const w = x2 - x;
        const h = y2 - y;
        const material = type === 'wall' ? concreteMaterial : windowMaterial;
        const geometry = new THREE.BoxGeometry(w, h, 1);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((x + x2) / 2, (y + y2) / 2, zPosition);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
	if (type === 'window') {
		mesh.name = 'Fenster '+fNr;
		fNr++;
		mesh.renderOrder = 1;
	} else {
		mesh.name = 'Wand '+wNr;
		wNr++;
		mesh.renderOrder = 0;
	}
        wallGroup.add(mesh);
    });

    wallGroup.rotation.y = rotationY;
    group.add(wallGroup);
}
function createRoof(group) {
	const concreteMaterial = new THREE.MeshStandardMaterial({
		color: 0x808080,
		roughness: 0.8,
		metalness: 0.2
	});
	const roofGeometry = new THREE.BoxGeometry(20, 1, 20);
	const roof = new THREE.Mesh(roofGeometry, concreteMaterial);
	roof.position.set(0, 10, 0); 
	roof.castShadow = true;
	roof.receiveShadow = true;
	roof.name = 'Dach';
	group.add(roof);
}
function createFloor(group, width, depth) {
    const tileWidth = 1;
    const tileHeight = 1;
    const tileMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });

    const tileGeometries = [];

    for (let x = 0; x < width; x++) {
        for (let z = 0; z < depth; z++) {
            const tileGeometry = new THREE.BoxGeometry(tileWidth, 0.1, tileHeight);
            const mesh = new THREE.Mesh(tileGeometry);
            mesh.position.set(x - width / 2, 0, z - depth / 2);
            mesh.scale.set(0.99, 0.99, 0.99);
            mesh.updateMatrix();
            tileGeometries.push(tileGeometry.clone().applyMatrix4(mesh.matrix));
        }
    }

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(tileGeometries);
    const floor = new THREE.Mesh(mergedGeometry, tileMaterial);
    floor.receiveShadow = true;
    floor.name = 'Boden';
    group.add(floor);
}
function createTile() {
	const tileWidth = 1;
	const tileHeight = 1;
	const tileMaterial = new THREE.MeshStandardMaterial({
		color: 0x333333,
		roughness: 0.8,
		metalness: 0.2
	});
	const tileGeometry = new THREE.BoxGeometry(tileWidth, 0.1, tileHeight);
	const tile = new THREE.Mesh(tileGeometry, tileMaterial);
	tile.scale.set(0.99,0.99,0.99);
	tile.receiveShadow = true;
	return tile;
}

function createFloorWithTiles(group, width, depth) {
	for (let x = 0; x < width; x++) {
		for (let z = 0; z < depth; z++) {
			const tile = createTile();
			tile.position.set(x, 0, z);
			group.add(tile);
		}
	}
	group.position.set(-width/2, 0, -depth/2);
}


