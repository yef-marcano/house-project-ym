var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var create, crateTexture, crateNormalMap, crateBumpMap;

var textureLoader, gltfLoader;


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

let piso = 1

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



  //cielo
	var pre = "src/img/TropicalSunnyDay/";
	var directions  = ["Left", "Right", "Up", "Down", "Front", "Back"];
	var suf = "2048.jpg";
	skyboxMats = [];
	for(var j = 0; j < directions.length; j++){
		if(j == 3){
			skyboxMats.push(new THREE.MeshBasicMaterial());
		}
		else{
			skyboxMats.push(
				new THREE.MeshBasicMaterial({
					map: new THREE.TextureLoader().load(pre+directions[j]+suf), 
					side: THREE.BackSide, 
					transparent: true})
			);
		}
	}
	var skyGeometry = new THREE.CubeGeometry( 448, 448, 448 );
	skybox = new THREE.Mesh( skyGeometry, skyboxMats );
	skybox.position.y = 20;
	scene.add( skybox );


/*
  let granoSuelo = 10;



	var cespedTex = new THREE.TextureLoader().load("src/img/floor0.jpg");
	cespedTex.wrapS = THREE.RepeatWrapping;
	cespedTex.wrapT = THREE.RepeatWrapping;
	cespedTex.repeat.set(granoSuelo,granoSuelo);
	for(var centrox = -141; centrox <= 141; centrox += 141){
		for(var centroy = -141; centroy <= 141; centroy += 141){
			if(centrox != 0 || centroy != 0){
				var cw = new THREE.MeshLambertMaterial({map:cespedTex, side: THREE.DoubleSide});		
				var cG = new THREE.PlaneGeometry( 40, 40, 10, 10);
				var c = new THREE.Mesh( cG, cw );
				c.rotation.set( 40, 0, 0);
				//c.position.set(centrox, 0, centroy);
				c.receiveShadow = true;
				scene.add(c);
			}
		}
	}*/



  //calle
	/*var roadTex = new THREE.TextureLoader().load("src/img/road.jpg");
	roadTex.wrapS = THREE.RepeatWrapping;
	roadTex.wrapT = THREE.RepeatWrapping;
	roadTex.repeat.set(1,25);
	var pos = 211.5;


	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 1; j++){
			var mroad = new THREE.MeshLambertMaterial({map:roadTex});		
			var rG = new THREE.PlaneGeometry(1, 150,30, 10);
			var r = new THREE.Mesh( rG, mroad, 2 );
			r.rotation.set(pos*0.2, 0.1, pos*0.2);
			r.receiveShadow = true;
			scene.add(r);
		}
	}	*/




  // Posicion de la camara cuando carga
  // posiion en 10
  //camera.position.set(0, player.height, -10);
  camera.position.set(0, player.height, -20);

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
  piso = 1
}


function verArriba() {
  camera.position.set(0, 6, 1);
  piso = 2
}

function movimientoWSAD() {
  spacemax();
  if (piso == 2) return;
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
    "src/texture/Polished_Concrete_Old.jpg"
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

var target = { x: 2, y: 1, z: 2 };
var camera_offset = { x: 15, y: 9, z: 19 };
var camera_speed = 0.5;
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
