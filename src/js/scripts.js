var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var create, crateTexture, crateNormalMap, crateBumpMap;

const width = window.innerWidth;
const height = window.innerHeight;

const clock = new THREE.Clock();
var time = 0;

var keyboard = {};
// Persona height altura del personaje, velocidad en la que camina
const player = {
  //2 original
  height: 2,
  speed: 0.2,
  turnSpeed: Math.PI * 0.02,
};

var USE_WIREFRAME = false;

scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer();

camera = new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 1000);

function init() {
  // Elimino el scroll, no me gusta la visual
  document.body.style.overflow = "hidden";

  //Perspectiva de la camara
  //luz de la casa
  ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  light = new THREE.PointLight(0xffffff, 0, 28);
  light.position.set(-3, 10, -3);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 30;
  scene.add(light);

  // Model/material caga de casa!
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("src/models/");
  mtlLoader.load("House1.mtl", function (materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("src/models/");
    objLoader.load("House1.obj", function (mesh) {
      mesh.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      scene.add(mesh);
      mesh.position.set(4.5, 0.3, -1, -0.4);
      mesh.rotation.y = -Math.PI / 1;
    });

    /*objLoader.load("CUERPORANABLENDERLOGRADO.obj", function (mesh) {
      mesh.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      scene.add(mesh);
      mesh.position.set(2, 3, -5, -0.4);
      mesh.rotation.y = -Math.PI / 1;
    });*/


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

function spacemax() {}

function verAbajo() {
  camera.position.set(0, player.height, -10);
}
function verArriba() {
  camera.position.set(0, 4, 1);
}

function movimientoWSAD() {
  spacemax();

  /* mejorar */
  if (keyboard[87] && camera.position.y < 50) {
    // W key
	
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;

  }
  if (keyboard[83] && camera.position.y > -50) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[65] && camera.position.x < 50) {
    // A key
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if (keyboard[68] && camera.position.x > -50) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
	  console.log(camera.position.x)
  }
}

function createGrass() {
  const geometry = new THREE.PlaneGeometry(100, 100);

  const texture = new THREE.TextureLoader().load(
    "/src/texture/Polished_Concrete_Old.jpg"
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);

  const grassMaterial = new THREE.MeshBasicMaterial({
    map: texture,
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
  if (keyboard[37]) {
    // left arrow key
    camera.rotation.y -= player.turnSpeed;
  }
  if (keyboard[39]) {
    // right arrow key
    camera.rotation.y += player.turnSpeed;
  }

  renderer.render(scene, camera);
}

const geometry = new THREE.SphereGeometry(1, 10, 16);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  vertexColors: true,
});
const sphere = new THREE.Mesh(geometry, material);
//scene.add( sphere );

var target = { x: 2, y: 2, z: 2 };
var camera_offset = { x: 10, y: 10, z: 10 };
var camera_speed = 0.1;
/*
function loop(){


	requestAnimationFrame(loop);
	
	
	clock.getDelta();
	time=clock.elapsedTime.toFixed(2);
	
	
	//sphere.position.x=5+(2*(Math.cos(time*2)));
	//sphere.position.y=2+(5*Math.abs(Math.sin(time*2)));
	target.x=sphere.position.x;
	//target.y=sphere.position.y
	target.z=sphere.position.z;
	camera.position.x=target.x+camera_offset.x*(Math.sin(time*camera_speed));
	camera.position.z=target.z+camera_offset.z*(Math.cos(time*camera_speed));
	camera.position.y=target.y+camera_offset.y;
	camera.lookAt(target.x,target.y,target.z);
	
	
	renderer.render(scene,camera);
	
	
};
	
	
loop();
*/

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onload = init;
