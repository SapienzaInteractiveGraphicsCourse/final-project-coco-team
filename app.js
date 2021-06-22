import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import * as MODEL from "./function/model.js";
import * as menu from "./function/menu.js";
import * as main_game from "./function/main_game.js";
import * as room from "./function/room.js";

//resource that has to be loaded
var virusMesh,roomTexture,syringeMesh,font;

var camera, scene, renderer, controls;
var scene_menu,camera_menu;

var stato;
var pointer,raycaster,INTERSECTED;

var ButtonArrayId;

var player;
var cameraTranslation;
var enabled;

var RayCasterArray;

var line;

loader();

/*-----------------------LOADING MODEL WITH PROMISES-------------------------*/
function loader(){
  var virusMeshPromise = MODEL.getVirusMesh();
  var roomTexturePromise = MODEL.getTexture();
  var syringePromise = MODEL.getSyringeMesh();
  var fontPromise = MODEL.getFont();
  Promise.all([virusMeshPromise, roomTexturePromise,syringePromise,fontPromise]).then(
    data => {
    virusMesh = data[0];
    roomTexture = data[1];
    syringeMesh=data[2];
    font=data[3];
    init();
  },error => {
    console.log( 'An error happened:',error );
  });
}

/*-----------------------INITIALIZING THE SCENES-------------------------*/
function init() {
  stato=1;
  enabled={
    "q":false,
    "w":false,
    "e":false,
    "a":false,
    "s":false,
    "d":false,
  };

  pointer = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.body.appendChild(renderer.domElement);

/*---------------------------MAIN MENU STUFF---------------------------*/
  var temp = menu.init(font,roomTexture);
  scene_menu = temp[0];
  camera_menu = temp [1];
  ButtonArrayId = temp [2];

/*---------------------------MAIN SCENE STUFF---------------------------*/
  temp = main_game.init(roomTexture);
  scene = temp[0];
  camera = temp [1];
  player = temp[2];
  cameraTranslation = temp[3];
  console.log(cameraTranslation);

/*---------------------------MENU RAYCASTER---------------------------*/
  raycaster=new THREE.Raycaster();

/*---------------------------PLAYER RAYCASTER---------------------------*/
  RayCasterArray = [];
  for (let x=0;x<9;x++){
    let angle= -x*(Math.PI/4);
    let rotationEuler = new THREE.Euler( 0, angle, 0, 'XYZ' );
    let rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromEuler(rotationEuler);
    let RayDirection = new THREE.Vector3( 1, 0, 0 );
    RayDirection.applyQuaternion(rotationQuaternion);
    let RayCasterElement = new THREE.Raycaster(player.position,RayDirection);
    RayCasterArray.push(RayCasterElement);
  }

/*---------------------------EVENT LISTENER---------------------------*/
  document.addEventListener( 'mousemove', onPointerMove );
  document.addEventListener( 'click', onMouseClick );
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keydown', keypressedAgent, false);
  window.addEventListener('keyup', keyreleasedAgent, false);

/*---------------------------ANIMATION LOOP---------------------------*/
  window.requestAnimationFrame(animate);
}

function keypressedAgent(event) {
  switch(event.key) {
    case 'q':
      enabled[event.key]=true;
      break;
    case 'w':
      enabled[event.key]=true;
      break;
    case 'e':
      enabled[event.key]=true;
      break;
    case 'a':
      enabled[event.key]=true;
      break;
    case 's':
      enabled[event.key]=true;
      break;
    case 'd':
      enabled[event.key]=true;
      break;
    case 'l':
      console.log(player.position)
      console.log(RayCasterArray[0]);
      break;
  }
}

function keyreleasedAgent(event) {
  switch(event.key) {
    case 'q':
      enabled[event.key]=false;
      break;
    case 'w':
      enabled[event.key]=false;
      break;
    case 'e':
      enabled[event.key]=false;
      break;
    case 'a':
      enabled[event.key]=false;
      break;
    case 's':
      enabled[event.key]=false;
      break;
    case 'd':
      enabled[event.key]=false;
      break;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  camera_menu.aspect = window.innerWidth / window.innerHeight;
  camera_menu.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  window.requestAnimationFrame(animate);
}

function onPointerMove( event ) {

  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onMouseClick( event ) {
  switch(stato) {
    case 0:
      if(INTERSECTED!=null){
        if (INTERSECTED.uuid == ButtonArrayId[0])
          stato=1;
        if (INTERSECTED.uuid == ButtonArrayId[1])
          console.log("Option");
      }
      break;
    case 1:
      renderer.render( scene, camera );
      break;
    default:
      console.log("pippo");
  }
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
      console.log("error you should not be here");
  }
}

function update(){
  switch(stato) {
    case 0:
      raycaster.setFromCamera( pointer, camera_menu );
      const intersects = raycaster.intersectObjects( scene_menu.children);

      if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object && ButtonArrayId.includes(intersects[ 0 ].object.uuid)) {
          if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
          INTERSECTED = intersects[ 0 ].object;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
      }

      else {
        if ( INTERSECTED ) {
          INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        }
        INTERSECTED = null;
      }

      break;
    case 1:

      /*
      const material = new THREE.LineBasicMaterial({
        color: 0x0000ff
      });

      const points = [];
      points.push( player.position);
      let punto = new THREE.Vector3();
      punto.copy(RayCasterArray[0].ray.direction);
      punto.multiplyScalar(30);
      punto.add(player.position);
      points.push(punto);

      const geometry = new THREE.BufferGeometry().setFromPoints( points );

      line = new THREE.Line( geometry, material );
      scene.add( line );
      */

      var dirZ = new THREE.Vector3( 0, 0, -2 );
      var dirX = new THREE.Vector3( -2, 0, 0 );
      var cameraPosition = new THREE.Vector3( 0, 0, 0 );
      cameraPosition.copy(cameraTranslation);
      var camera_Incline = new THREE.Euler( -Math.atan((cameraPosition.y)/cameraPosition.z), 0, 0, 'XYZ' );
      var quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(camera_Incline);

      //rotazione movimenti
      dirZ.applyQuaternion( player.quaternion );
      dirX.applyQuaternion( player.quaternion );
      if (enabled.q){
        //player rotation
        player.rotation.y += Math.PI/60;
        //camera rotation
        camera.quaternion.copy(player.quaternion);
        camera.quaternion.multiply(quaternion);
        //camera translation
        cameraPosition.applyQuaternion(player.quaternion);
        camera.position.copy(player.position);
        camera.position.add(cameraPosition);
        //ray rotation
        for (let x=0;x<9;x++){
          let angle= Math.PI/60;
          let rotationEuler = new THREE.Euler( 0, angle, 0, 'XYZ' );
          let rotationQuaternion = new THREE.Quaternion();
          rotationQuaternion.setFromEuler(rotationEuler);
          RayCasterArray[x].ray.direction.applyQuaternion(rotationQuaternion);
        }
      }
      if (enabled.w){
        //player translation
        player.position.add( dirZ );
        //camera translation
        camera.position.add( dirZ );
        //Raycasting translation
        for (let x=0;x<9;x++){
          RayCasterArray[x].ray.origin=player.position;
        }
      }
      if (enabled.e){
        //player rotation
        player.rotation.y -= Math.PI/60;
        //camera rotation
        camera.quaternion.copy(player.quaternion);
        camera.quaternion.multiply(quaternion);
        //camera translation
        cameraPosition.applyQuaternion(player.quaternion);
        camera.position.copy(player.position);
        camera.position.add(cameraPosition);
        //ray rotation
        for (let x=0;x<9;x++){
          let angle= -Math.PI/60;
          let rotationEuler = new THREE.Euler( 0, angle, 0, 'XYZ' );
          let rotationQuaternion = new THREE.Quaternion();
          rotationQuaternion.setFromEuler(rotationEuler);
          RayCasterArray[x].ray.direction.applyQuaternion(rotationQuaternion);
        }
      }
      if (enabled.a){
        //player translation
        player.position.add( dirX );
        //camera translation
        camera.position.add( dirX );
        //Raycasting translation
        for (let x=0;x<9;x++){
          RayCasterArray[x].ray.origin=player.position;
        }
      }
      if (enabled.s){
        //player translation
        player.position.sub( dirZ );
        //camera translation
        camera.position.sub( dirZ );
        //Raycasting translation
        for (let x=0;x<9;x++){
          RayCasterArray[x].ray.origin=player.position;
        }
      }
      if (enabled.d){
        //player translation
        player.position.sub( dirX );
        //camera translation
        camera.position.sub( dirX );
        //Raycasting translation
        for (let x=0;x<9;x++){
          RayCasterArray[x].ray.origin=player.position;
        }
      }
      break;
    default:
      console.log("pippo");
  }
}
