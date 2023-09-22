import * as THREE from 'three';
export function createModel(scene) {
    const hausGroup = new THREE.Group();
	hausGroup.name = 'Gruppe: Haus';

	createWall(hausGroup, 10, 0);
	createWall(hausGroup, -10, 0);
	createWall(hausGroup, 10, Math.PI / 2);
	createWall(hausGroup, -10, Math.PI / 2);
	createRoof(hausGroup);
	const floorGroup = new THREE.Group();
	createFloor(floorGroup, 20, 20);
	hausGroup.add(floorGroup);
	hausGroup.scale.set(0.1, 0.1, 0.1);
	scene.add(hausGroup);
}

function createWall(group, zPosition, rotationY) {
    const wallGroup = new THREE.Group();
    const concreteMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2
    });

    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x8888ff, transparent: true, opacity: 0.2, depthTest: false, alphaTest: 0.5 });
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);

    let wall = [
        [0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

	for (let y = 0; y < wall.length; y++) {
		for (let x = 0; x < wall[y].length; x++) {
			let material = wall[y][x] === 1 ? windowMaterial : concreteMaterial;
			const block = new THREE.Mesh(blockGeometry, material);
			block.position.set(x - 10, y, zPosition);  // x-9 zentriert die Wand
			if (wall[y][x] !== 1) {
				block.castShadow = true;
				block.receiveShadow = true;
			}
			wallGroup.add(block);
		}
	}

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
	group.add(roof);
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

function createFloor(group, width, depth) {
	for (let x = 0; x < width; x++) {
		for (let z = 0; z < depth; z++) {
			const tile = createTile();
			tile.position.set(x, 0, z);
			group.add(tile);
		}
	}
	group.position.set(-width/2, -0.5, -depth/2);
}


