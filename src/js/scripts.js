var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var create, crateTexture, crateNormalMap, crateBumpMap;

const width = window.innerWidth;
const height = window.innerHeight;

var keyboard = {};
// Persona height altura del personaje, velocidad en la que camina
const player = {
	height: 2,
	speed: 0.2,
	turnSpeed: Math.PI * 0.02
};

var USE_WIREFRAME = false;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer();

function init() {

	// Elimino el scroll, no me gusta la visual
	document.body.style.overflow = 'hidden';

	//Perspectiva de la camara
	camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);
	//luz de la casa
	ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 0, 18);
	light.position.set(-3, 10, -3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 30;
	scene.add(light);


	// Model/material caga de casa!
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('src/models/');
	mtlLoader.load("House1.mtl", function (materials) {

		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('src/models/');

		objLoader.load("House1.obj", function (mesh) {

			mesh.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});

			scene.add(mesh);
			mesh.position.set(4.5, 0.3,-1, -0.4);
			mesh.rotation.y = -Math.PI /1;
		});

	});


	// Posicion de la camara cuando carga
	// posiion en 10
	camera.position.set(0, player.height, -10);
	
	camera.lookAt(new THREE.Vector3(0, player.height, 0));

	// El set del maximo de la pantalla
	renderer.setSize(width, height);
	renderer.setClearColor(0xcce0ff, 0.9);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild(renderer.domElement);

	animate();

}

function spacemax(){
}

function verAbajo(){
	camera.position.set(0, player.height, -10);
}
function verArriba(){
	camera.position.set(0, 4, 1);
}

function movimientoWSAD() {

	spacemax();
	if (keyboard[87]) { // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if (keyboard[83]) { // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if (keyboard[65]) { // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
	}
	if (keyboard[68]) { // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
	}


}

function createGrass() {
	const geometry = new THREE.PlaneGeometry(1000, 1000);

	const texture = new THREE.TextureLoader().load('/src/texture/Polished_Concrete_Old.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(100, 100);

	const grassMaterial = new THREE.MeshBasicMaterial({
		map: texture
	});

	const grass = new THREE.Mesh(geometry, grassMaterial);

	grass.rotation.x = -0.5 * Math.PI;

	scene.add(grass);
}

function create() {
	createGrass();
}

create();

function animate() {
	requestAnimationFrame(animate);
	movimientoWSAD();
	if (keyboard[37]) { // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if (keyboard[39]) { // right arrow key
		camera.rotation.y += player.turnSpeed;
	}

	renderer.render(scene, camera);

}

function keyDown(event) {
	keyboard[event.keyCode] = true;
}

function keyUp(event) {
	keyboard[event.keyCode] = false;
}


window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;