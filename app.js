import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import * as MODEL from "./function/model.js";
import * as menu from "./function/menu.js";
import * as main_game from "./function/main_game.js";
import * as room from "./function/room.js";

//resource that has to be loaded
var virusMesh,roomTexture,syringeMesh,font;

var camera, scene, renderer, controls, camera2;
var scene_menu,camera_menu;

var stato;
var pointer,raycaster,INTERSECTED;

var ButtonArrayId;

var player;
var insetWidth, insetHeight;

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
  camera2 = temp[3];

/*--------------------------------CONTROL-------------------------------*/
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(4.5, 0, 4.5);
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableDamping = true;

  raycaster=new THREE.Raycaster();

  document.addEventListener( 'mousemove', onPointerMove );
  document.addEventListener( 'click', onMouseClick );
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keydown', moveAgent, false);

  window.requestAnimationFrame(animate);
}

function moveAgent(e) {

  var dirZ = new THREE.Vector3( 0, 0, -1 );
  var dirX = new THREE.Vector3( -1, 0, 0 );
  dirZ.applyQuaternion( player.quaternion );
  dirX.applyQuaternion( player.quaternion );

  // var y_axis = new THREE.Vector3( 0, 1, 0 );
  // var quaternion = new THREE.Quaternion;

	switch(e.key) {

  	case 'w':
    	player.position.add( dirZ );
      camera.position.add( dirZ );
      controls.target.copy( player.position );
      break;

    case 's':
    	player.position.sub( dirZ );
      camera.position.sub( dirZ );
      controls.target.copy( player.position );
      break;

    case 'a':
      player.position.add( dirX );
      camera.position.add( dirX );
      controls.target.copy( player.position );
      break;

    case 'd':
      player.position.sub( dirX );
      camera.position.sub( dirX );
      controls.target.copy( player.position );
      break;

    case 'l':
      player.rotation.y += Math.PI/30;
      //camera.rotation.y = player.rotation.y;
      //camera.quaternion.rotateTowards(player.quaternion, 0.5*Math.PI/30);
      break;

    case 'r':
      player.rotation.y -= Math.PI/30;
      //camera.rotation.y = player.rotation.y;
      break;



  }

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  camera_menu.aspect = window.innerWidth / window.innerHeight;
  camera_menu.updateProjectionMatrix();

  insetWidth = window.innerHeight / 4; // square
  insetHeight = window.innerHeight / 4;

  camera2.aspect = insetWidth / insetHeight;
  camera2.updateProjectionMatrix();

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
// QUESTA FUNZIONE animate E' SOSTITUTIVA A QUELLA CHE AVEVI SCRITTO TU (CHE E' COMMENTATA SOTTO)
// STA FUNZIONE HA DEI COMANDI ESSENZIALI PERCHE' HO PROVATO A COMMENTARLI MA POI
// SI ROMPE IL FATTO CHE LA CAMERA SEGUE IL PLAYER CHE SI MUOVE
function animate() {

  requestAnimationFrame(animate);

  // main scene
	renderer.setClearColor( 0x000000, 0 );
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

	// inset scene
  renderer.clearDepth(); // important!
  renderer.setScissorTest(true);
  renderer.setScissor(20, 20, insetWidth, insetHeight);
  renderer.setViewport(20, 20, insetWidth, insetHeight);
  renderer.setClearColor( 0x222222, 1 );

  camera2.position.copy( player.position );
  camera2.quaternion.copy( player.quaternion );

  renderer.render(scene, camera2);

  renderer.setScissorTest(false);

}

// function animate() {
//   requestAnimationFrame( animate );
//   //setupKeyControls();
//   render();
//   update();
// }


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
      break;
    default:
      console.log("pippo");
  }
}
