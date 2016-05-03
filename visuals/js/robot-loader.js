var container, stats;

var camera, scene, controls, renderer, objectLoader;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


init();
animate();


function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.x = 4;
  camera.position.y = 4;
  camera.position.z = 4;

  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 8;
  controls.enablePan = false;

  // scene
  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight( 0x444444 );
  scene.add( ambient );

  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 ).normalize();
  scene.add( directionalLight );

  // BEGIN Clara.io JSON loader code
  objectLoader = new THREE.ObjectLoader();
  objectLoader.load("../assets/models3d/robot-json/robot.json", function ( obj ) {
    scene.add( obj );
  } );
  // END Clara.io JSON loader code

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
}

//

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  controls.update();
  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}
