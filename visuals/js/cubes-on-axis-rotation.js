var container, stats;
var camera, scene, renderer, controls;
var group, globalGroup;

var mouse = new THREE.Vector2(), INTERSECTED;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var user = false;

init();
animate();

function randomColor() {
  number = Math.random() - 0.1;
  var shade = number.toString(16).slice(2, 4)
  return "#" + shade + "aa" + shade;
}

function init() {
  container = document.createElement('div');
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 500;

  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = false;
  controls.enablePan = false;

  scene = new THREE.Scene();

  // boxes
  var geometry = new THREE.BoxGeometry( 100, 100, 100 );
  globalGroup = new THREE.Group();

  for (var i=0; i < 1; i++) {

    posX = Math.random() * 2 * Math.PI;
    posY = Math.random() * 2 * Math.PI;
    group = new THREE.Group();

    for ( var j = 0; j < 1; j++ ) {

      var material = new THREE.MeshBasicMaterial({ color: randomColor(), wireframe: true } );
      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = Math.random() * 2000 - 1000;
      mesh.position.y = Math.random() * 2000 - 1000;
      mesh.position.z = Math.random() * 2000 - 1000;
      mesh.rotation.x = posX;
      mesh.rotation.y = posY;

      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();

      group.add( mesh );

    }

    globalGroup.add(group)
  }

  scene.add(globalGroup)

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

function rotate(mod) {
  for ( var i=0 ; i<globalGroup.children.length ; i++) {
    var g = globalGroup.children[i];

    // switch(i % 3) {
    //   case 0:
    //     g.rotateX(1 * mod)
    //     break;
    //   case 1:
    //     g.rotateY(1 * mod)
    //     break;
    //   case 2:
    //     g.rotateZ(1 * mod)
    //     break;
    // }
    
    g.rotateY(0.01)
  }
}

function animate() {

  // rotate(0.01);

  requestAnimationFrame( animate );
  render();
}

function render() {
  controls.update();

  // var time = Date.now() * 0.001;
  // var rx = Math.sin( time * 0.7 ) * 0.5;
  // var ry = Math.sin( time * 0.3 ) * 0.5;
  // var rz = Math.sin( time * 0.2 ) * 0.5;

  // group.rotation.x = rx;
  // group.rotation.y = ry;
  // group.rotation.z = rz;

  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}
