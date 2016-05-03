// globals
var camera, scene, renderer, effect;
var mobile = false;
var user = false;

// objects
var background;
var material, comments, commentsGeom, comments3d;
var frame = 1;

function initScene() {

  // setup
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0)
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);
  camera.focalLength = camera.position.distanceTo(scene.position);
  camera.lookAt(scene.position);

  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = true;
  controls.enablePan = false;

  // Background
  var cubeMap = getCubeMap(9)
  var cubeShader = THREE.ShaderLib['cube'];
  cubeShader.uniforms['tCube'].value = cubeMap;

  var skyBoxMaterial = new THREE.ShaderMaterial({
    fragmentShader: cubeShader.fragmentShader,
    vertexShader: cubeShader.vertexShader,
    uniforms: cubeShader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });

  var skyBox = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), skyBoxMaterial);
  scene.add(skyBox);

  // comments
  material = new THREE.MeshPhongMaterial({
    side: THREE.BackSide, 
    envMap: getCubeMap(9), 
    color: 0xFFFFFF, 
    shading: THREE.FlatShading
  });

  comments3d = new THREE.Object3D();
  for (var _x = -1; _x <= 1; _x++) {
    for (var _y = -1; _y <= 1; _y++) {
      for (var _z = -1; _z <= 1; _z++) {
        var geo = new THREE.BoxGeometry(.1, .1, .1, 1, 1, 1)
        var mesh = new THREE.Mesh(geo, material)
        mesh.position.set(_x, _y, _z)
        comments3d.add(mesh);
      }
    }
  }

  // merge into one big object
  commentsGeom = new THREE.Geometry()
  for (var i = 0; i < comments3d.children.length; i++) {
    comments3d.children[i].updateMatrix();
    commentsGeom.merge(comments3d.children[i].geometry, comments3d.children[i].matrix);
  }

  comments = new THREE.Mesh(commentsGeom, material);
  scene.add(comments)

  // light
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-1, 1.5, 0.5);
  scene.add(light);

  // events
  window.addEventListener('deviceorientation', setOrientationControls, true);
  window.addEventListener('resize', onWindowResize, false);

}

function animateComments(mod) {
  // commentsGeom.verticesNeedUpdate = true;
}

function moveComments(position) {
  mod = 0.01
  for (var i = 0; i < comments3d.children.length; i++) {
    _x = comments3d.children[i].x + position * mod
    _y = comments3d.children[i].y + position * mod
    _z = comments3d.children[i].z + position * mod
    comments3d.children[i].position.set(_x, _y, _z)
    comments3d.children[i].updateMatrix();
  }
  commentsGeom.verticesNeedUpdate = true;
  
}

function animateScene() {
  animateComments(0.01);
  moveComments(frame % 100)

  requestAnimationFrame(animateScene);
  render();
}

function render() {
  controls.update();
  if (mobile) {
    camera.position.set(0, 0, 0)
    camera.translateZ(5);
  }
  frame = frame + 1;
  renderer.render(scene, camera);
}


initScene();
animateScene();