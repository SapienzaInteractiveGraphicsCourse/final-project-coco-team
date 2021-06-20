import * as THREE from 'https://threejs.org/build/three.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejs.org/examples/jsm/loaders/MTLLoader.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';


var camera, scene, renderer, controls;
let mesh;

function init() {
  scene = new THREE.Scene();
  scene.bacground = new THREE.Color('white');

  const light = new THREE.PointLight( 0xffffff, 50, 200 );
  light.position.set(0, 200, 0);
  const light1 = new THREE.PointLight( 0xffffff, 4, 200 );
  light1.position.set(0, -50, 0);
  scene.add(light);
  scene.add(light1);

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('./model/virus.glb',
  function ( gltf ) {
    const virusMesh = gltf.scene.children.find((child) => child.name === "virus");
    virusMesh.scale.set(virusMesh.scale.x * 0.4, virusMesh.scale.y * 0.4, virusMesh.scale.z * 0.4);
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load( "./model/Texture.png", function ( map ) {
        virusMesh.material.map = map;
        virusMesh.material.map.encoding = THREE.sRGBEncoding;
        virusMesh.material.map.flipY = false;
        virusMesh.material.needsUpdate = true;
    });
    virusMesh.position.y = virusMesh.scale.y;
    virusMesh.rotation.y = -80;

    virusMesh.geometry.computeBoundingBox();
    console.log(virusMesh.geometry.boundingBox);

    scene.add(virusMesh);
  },
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  function ( error ) {
    console.log( 'An error happened' );
  });

  const mtlLoader = new MTLLoader();
  const objLoader = new OBJLoader();
  mtlLoader.load('./model/materials.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('./model/Syringe.obj', (root) => {
      console.log(root.scale.x);
      root.scale.x=200;
      root.scale.y=200;
      root.scale.z=200;
      scene.add(root);
    });
  });

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  /* CAMERA STUFF - Make function*/
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

  camera.position.y = 0;
  camera.position.z = 50;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(4.5, 0, 4.5);
  controls.enablePan = true;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableDamping = true;

  window.requestAnimationFrame(animate);
  //window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  //mesh.rotation.x += 0.005;
  //mesh.rotation.y += 0.01;

  renderer.render( scene, camera );

}
window.addEventListener('load',init);
window.addEventListener('resize', onWindowResize);

