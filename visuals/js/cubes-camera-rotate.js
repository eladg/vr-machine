var container, stats;

var camera, scene, renderer;

var geometry, group;

var mouse = new THREE.Vector2(), INTERSECTED;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var user = false;

init();
animate();

function randomColor() {
  var shade = Math.random().toString(16).slice(2, 4)
  return "#" + shade + shade + shade;
}

function init() {

  container = document.createElement('div');
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 500;

  scene = new THREE.Scene();

  // boxes
  var geometry = new THREE.BoxGeometry( 100, 100, 100 );

  group = new THREE.Group();

  for ( var i = 0; i < 300; i ++ ) {

    var material = new THREE.MeshBasicMaterial({ color: randomColor(), wireframe: true } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = Math.random() * 2000 - 1000;
    mesh.position.y = Math.random() * 2000 - 1000;
    mesh.position.z = Math.random() * 2000 - 1000;

    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;

    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    group.add( mesh );

  }

  scene.add( group );

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0x000000 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;

  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function rotate() {
  
}

function animate() {

  rotate();

  requestAnimationFrame( animate );
  render();
}

function render() {

  var time = Date.now() * 0.001;
  var rx = Math.sin( time * 0.7 ) * 0.5;
  var ry = Math.sin( time * 0.3 ) * 0.5;
  var rz = Math.sin( time * 0.2 ) * 0.5;

  camera.lookAt( scene.position );

  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;

  renderer.render( scene, camera );
}
