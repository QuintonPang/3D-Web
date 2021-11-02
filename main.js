import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 1. Scene
const scene = new THREE.Scene();

// 2. Camera ( field of view, aspect ratio, view frustum)
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

// 3. Renderer
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30); // the higher the value, the more further away the camera

// geometry object
const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color:0xFF6347}); // with lighting
//const material = new THREE.MeshBasicMaterial({color:0xFF6347,wireframe:true}); // without lighting
const torus = new THREE.Mesh(geometry,material);

scene.add(torus);

// lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff); // lights up everything in the scene

scene.add(pointLight,ambientLight); // all objects can be added in one line, no parameter limit

// shows position of light source
const lightHelper = new THREE.PointLightHelper(pointLight);
// draw grid along scene
const gridHelper = new THREE.GridHelper(200,50); // (size,number of divisions)
scene.add(lightHelper,gridHelper);

// add control to scene
const controls = new OrbitControls(camera,renderer.domElement);

// randomly add stars function
const addStar = ()=>{
  const geometry = new THREE.SphereGeometry(0.25,4,4); // (radius, width segment, height segment)
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geometry,material);

  // generate random position with numbers from -50 to 50
  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(50));

  star.position.set(x,y,z)
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// load backgroundtexture with callback
const spaceTexture = new THREE.TextureLoader().load('space.jpg',()=>console.log("Done loading background!"));
scene.background = spaceTexture;

// texture mapping
const cubeTexture  = new THREE.TextureLoader().load('space.jpg');
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3), // (width, height, depth)
  new THREE.MeshBasicMaterial({map:cubeTexture})
);
scene.add(cube);

// moon
const normalTexture = new THREE.TextureLoader().load('normal.jpg',()=>console.log("Done loading normal texture!")); // for bump effect of moon
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32), // (radius, width segment, height segment)
  new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('moon.jpg'),normalMap:normalTexture,})
)
// no difference between assigning values with = and setters
moon.position.z=30;
moon.position.setX-(-10);
scene.add(moon);

// loop
const animate = () =>{
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01; // rotate on x-axis
  torus.rotation.y += 0.005; // rotate on y-axis
  torus.rotation.z += 0.01; // rotate on z-axis
  controls.update();
  renderer.render(scene,camera);
}

const moveCamera = () =>{
  const t = document.body.getBoundingClientRect().top; // get how far from top of webpage
  moon.rotateX(0.05);
  moon.rotateY(0.075);
  moon.rotateZ(0.05);

  cube.rotateY(0.01);
  cube.rotateZ(0.01);

  // t is always negative
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.002;
  camera.position.y = t * -0.002;
}

// call function when scrolling
document.body.onscroll = moveCamera;

animate();