import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import * as virus from "./function/virus.js";
import * as menu from "./function/menu.js";
import * as main_game from "./function/main_game.js";
import * as room from "./function/room.js";
import * as syringe from "./function/syringe.js";


var camera, scene, renderer, controls;
var scene_menu,camera_menu;
var stato;
var pointer;

init();

function init() {
  stato=1;

  pointer = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

/*---------------------------MAIN MENU STUFF---------------------------*/
  var temp = menu.init();
  scene_menu = temp[0];
  camera_menu = temp [1];

/*---------------------------MAIN SCENE STUFF---------------------------*/
  temp = main_game.init();
  scene = temp[0];
  camera = temp [1];

/*--------------------------------CONTROL-------------------------------*/
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(4.5, 0, 4.5);
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableDamping = true;

  var virusMesh;
  var virusMeshPromise = virus.getVirusMesh();
  virusMeshPromise.then(
  function (resolve) {
    virusMesh=resolve;
    scene.add(virusMesh);
  },
  function (error) {
    console.log( 'An error happened:',error );
  });

  var roomTexture;
  var room1;
  var roomTexturePromise = room.getTexture();
  roomTexturePromise.then(
  function (resolve) {
    roomTexture=resolve;
    room1=room.getLevel(roomTexture);
    scene.add(room1);
  },
  function (error) {
    console.log( 'An error happened:',error );
  });

  var syringe1;
  var syringeloaderPromise = syringe.getSyringeMesh();
  syringeloaderPromise.then(
  function (resolve) {
    syringe1=resolve;
    scene.add(syringe1);
  },
  function (error) {
    console.log( 'An error happened:',error );
  });

  window.requestAnimationFrame(animate);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  requestAnimationFrame( animate );
  render();
  update();
}

function render(){
  switch(stato) {
    case 0:
      renderer.render( scene_menu, camera_menu );
      break;
    case 1:
      renderer.render( scene, camera );
      break;
    default:
      console.log("pippo");
  }
}

function update(){
  switch(stato) {
    case 0:
      renderer.render( scene_menu, camera_menu );
      break;
    case 1:
      renderer.render( scene, camera );
      break;
    default:
      console.log("pippo");
  }
}

window.addEventListener('resize', onWindowResize);

