var container, stats;

var camera, scene, controls, renderer, objectLoader;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var user = false;

// objects
var robot, _robot;

init();
animate();


function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 100);
  camera.focalLength = camera.position.distanceTo(scene.position);
  camera.lookAt(scene.position);

  // controls
  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = false;
  controls.enablePan = false;

  var ambient = new THREE.AmbientLight( 0x444444 );
  scene.add(ambient);

  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 100 );
  scene.add( directionalLight );

  // robot object
  robot = robot();
  _robot = robot;
  scene.add(robot);

  // the rest
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function robot() {
  var robot = new THREE.Object3D();               // <----- robot Object3D
  var material = new THREE.MeshPhongMaterial( {
    color: 0x00ffff,
    wireframe: true,
  });

  var geometry = new THREE.BoxGeometry( 10, 10, 10 );
  var head = new THREE.Mesh( geometry, material );
  head.name = "head"
  head.position.set(0, 16, 0)

  var geometry = new THREE.BoxGeometry( 10, 20, 10 );
  var body = new THREE.Mesh( geometry, material );
  body.name = "body"
  body.position.set(0, 0, 0)

  var geometry = new THREE.BoxGeometry( 2, 10, 2 );
  var handL = new THREE.Mesh( geometry, material );
  handL.name = "hand-left"
  handL.position.set(7, 3, 0)

  var geometry = new THREE.BoxGeometry( 2, 10, 2 );
  var handR = new THREE.Mesh( geometry, material );
  handR.name = "hand-right"
  handR.position.set(-7, 3, 0)

  var geometry = new THREE.BoxGeometry( 2, 2, 8 );
  var legL = new THREE.Mesh( geometry, material );
  legL.name = "leg-left"
  legL.position.set(-3, -11, 0)

  var geometry = new THREE.BoxGeometry( 2, 2, 8 );
  var legR = new THREE.Mesh( geometry, material );
  legR.name = "leg-right"
  legR.position.set(3, -11, 0)

  robot.add(head);
  robot.add(body);
  robot.add(handL);
  robot.add(handR);
  robot.add(legL);
  robot.add(legR);

  return robot;
}

function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
}

function floatInRange(float, original, range) {
  if (float + range > original) {
    return float*-1;
  }
  // console.log("returning " + float)
  return float;
}

function robotShake(mod, relative) {
  for (var i = 0; i < robot.children.length; i++) {
    mesh = robot.children[i];
    original_mesh = robot.children[i];
    for (var j = 0; j < mesh.geometry.vertices.length; j++) {

      var v  = mesh.geometry.vertices[j];
      var _v = original_mesh.geometry.vertices[j];
      var rand = (Math.random()*0.1) + v.x;
      
      if (rand + 10 > _v.x) {mod *= -1;}

      v.x = floatInRange(rand*mod, _v.x, 10);
      mesh.geometry.verticesNeedUpdate = true;
    }
  }
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  robotShake(1)
  controls.update();

  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}
