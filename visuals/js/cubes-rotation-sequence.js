var user = false;

var camera, scene, renderer;
var effect;
var mobile = false;
var object
var group

init();
animate();

function init() {

  // setup
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000)
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(1, 1, 5);
  camera.focalLength = camera.position.distanceTo(scene.position);
  camera.lookAt(scene.position);

  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = false;
  controls.enablePan = false;

  // central object
  var material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide, 
    color: 0x000000,
    wireframe: true
  });

  var geometry = new THREE.SphereGeometry(3, 30, 30)
  object = new THREE.Mesh(geometry, material);
  scene.add(object);

  // events
  window.addEventListener('deviceorientation', setOrientationControls, true);
  window.addEventListener('resize', onWindowResize, false);

}

function rotate() {
  // object.rotateX(0.0001);
  object.rotateY(0.02);
  // object.rotateZ(0.001);

  // object.translateX(0.01)
}

function animate() {

  rotate();

  requestAnimationFrame(animate);
  render();
}

function render() {

  if (mobile) {
    camera.position.set(0, 0, 0)
    camera.translateZ(5);
  }
  renderer.render(scene, camera);

}
