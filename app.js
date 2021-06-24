import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import * as MODEL from "./function/model.js";
import * as menu from "./function/menu.js";
import * as main_game from "./function/main_game.js";
import * as room from "./function/room.js";
import * as debug from "./function/debug.js";

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
var collision;

var RayCasterArray;

var CameraRayCast;

var full_room;
var only_room;

var linesArray;

var noPlayingField;
var syringes = [];
var countSyringesAlive;

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
    "l":false
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
  full_room = temp[4]
  only_room = temp[5];
  noPlayingField = temp[6];



  //syringeMesh.userData.tag = 'syringe';
  var nSyringes = 20;
  spreadSyringes(nSyringes); // calcola le posizioni delle siringhe e le aggiunge alla scena

/*---------------------------MENU RAYCASTER---------------------------*/
  raycaster=new THREE.Raycaster();

/*---------------------------PLAYER RAYCASTER---------------------------*/
  RayCasterArray = [];
  let rayNumbers = 8
  for (let x=0;x<rayNumbers;x++){
    let angle= -x*(Math.PI*2/rayNumbers);
    let rotationEuler = new THREE.Euler( 0, angle, 0, 'XYZ' );
    let rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromEuler(rotationEuler);
    let RayDirection = new THREE.Vector3( 1, 0, 0 );
    RayDirection.applyQuaternion(rotationQuaternion);
    let RayCasterElement = new THREE.Raycaster(player.position,RayDirection);
    RayCasterArray.push(RayCasterElement);
  }

  collision=[];
  var collision_type={
    "isColliding": false,
    "distance":20,
    "normal": new THREE.Vector3(0,0,0)
  };
  for (let x=0;x<RayCasterArray.length;x++){
    collision.push(JSON.parse(JSON.stringify(collision_type)));
  }

  linesArray=[];
  for (let x=0;x<rayNumbers;x++){
    linesArray.push(debug.drawRay(x,scene,player,RayCasterArray));
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
      enabled[event.key]=true;
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
    case 'l':
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
      var oldCameraPosition = new THREE.Vector3().copy(cameraTranslation);
      var cameraPosition = checkCameraCollision(oldCameraPosition);
      var camera_Incline = new THREE.Euler( -Math.atan((cameraPosition.y)/cameraPosition.z), 0, 0, 'XYZ' );
      var cameraVerticalRotation = new THREE.Quaternion().setFromEuler(camera_Incline);

      var isRotating,isMoving;

/*---------------------------PLAYER ROTATION---------------------------*/
      var rotation = 0;
      if (enabled.q){
        rotation += Math.PI/60;
      }
      if (enabled.e){
        rotation -= Math.PI/60;
      }

      isRotating=rotation!=0;
      if (isRotating){
        //player rotation
        player.rotation.y += rotation;

        for (let x=0;x<RayCasterArray.length;x++){
          let rotationEuler = new THREE.Euler( 0, rotation, 0, 'XYZ' );
          let rotationQuaternion = new THREE.Quaternion();
          rotationQuaternion.setFromEuler(rotationEuler);
          RayCasterArray[x].ray.direction.applyQuaternion(rotationQuaternion);
        }

      }
/*---------------------------PLAYER MOVEMENT---------------------------*/
      var dirZ = new THREE.Vector3(0,0,2);
      var dirX = new THREE.Vector3(2,0,0);

      dirZ.applyQuaternion(player.quaternion);
      dirX.applyQuaternion(player.quaternion);

      var direction = new THREE.Vector3(0,0,0);
      var movingDirection;

      if (enabled.w){
        direction.sub(dirZ);
      }
      if (enabled.a){
        direction.sub(dirX);
      }
      if (enabled.s){
        direction.add(dirZ);
      }
      if (enabled.d){
        direction.add(dirX);
      }

      isMoving=!direction.equals(new THREE.Vector3(0,0,0));

      if (isMoving){
        movingDirection=checkCollision(direction);
        player.position.add(movingDirection);
        //translating ray with player
        for (let x=0;x<RayCasterArray.length;x++){
          RayCasterArray[x].ray.origin=player.position;
        }
      }
/*---------------------------CAMERA TRANSLATION---------------------------*/
      //cameraTranslation
      if (isRotating||isMoving){
        //camera rotation
        camera.quaternion.copy(player.quaternion);
        camera.quaternion.multiply(cameraVerticalRotation);
        //computing new camera location
        cameraPosition.applyQuaternion(player.quaternion);
        camera.position.copy(player.position);
        camera.position.add(cameraPosition);
      }
/*---------------------------UPDATING RAY VISUALIZATION---------------------------*/
      for (let x=0; x<linesArray.length;x++){
        debug.updateRay(linesArray[x],player);
      }
      break;
    default:
      console.log("pippo");
  }
  interactionPlayerSyringe();
   if(countSyringesAlive == 19){
     scene.add(only_room);
     scene.remove(scene.children.find((child) => child.name === "full_room"));
     full_room = only_room;
   }
}

function checkCollision(direction){
  let Collision_Distance = 15;
  for (let x=0;x<collision.length;x++){
    collision[x].isColliding=false;
    collision[x].distance=Collision_Distance+10;
  }
  for (var rayIndex = 0; rayIndex < RayCasterArray.length; rayIndex++) {
    var collisionResults = RayCasterArray[rayIndex].intersectObjects(full_room.children);
    if(collisionResults.length > 0) {
      if(collisionResults[0].distance < Collision_Distance) {
          var axesCollision = collisionResults[0].face.normal.clone();
          collision[rayIndex].isColliding=true;
          collision[rayIndex].normal=axesCollision;
      }
    collision[rayIndex].distance=collisionResults[0].distance;
    }
  }
  var results=direction.clone();
  var final_normal=new THREE.Vector3();
  var normalArray = [];
  for (let x=0;x<collision.length;x++){
    if (collision[x].isColliding){
      if(!normalArray.includes(collision[x].normal))
        normalArray.push(collision[x].normal);
    }
  }
  for (let x=0;x<normalArray.length;x++){
    if(direction.clone().dot(normalArray[x])<0)
      results=results.sub(normalArray[x].multiplyScalar(direction.clone().dot(normalArray[x])));
  }
  return results;
}
function checkCameraCollision(cameraPosition){
  let Collision_Distance = cameraPosition.z;
  var collisionResultsObstacles = RayCasterArray[2].intersectObjects(full_room.children);
  if(collisionResultsObstacles.length > 0) {
    if(collisionResultsObstacles[0].distance < Collision_Distance) {
      let newCameraPositionObstacles = new THREE.Vector3().copy(cameraPosition);
      newCameraPositionObstacles.z=collisionResultsObstacles[0].distance-1;
      return newCameraPositionObstacles;
    }
    else{
      return cameraPosition;
    }
  }
}
function interactionPlayerSyringe(){
  var maxDistance = 20;
  for(var i = 0; i<syringes.length; i++){
    if(syringes[i].visible == true){
      var distance = (player.position.x-syringes[i].position.x)**2 + (player.position.z-syringes[i].position.z)**2; //I compute the distance squared because it is slightly more efficient to calculate.
      if(distance<maxDistance*maxDistance){
        syringes[i].visible = false;
        countSyringesAlive = countSyringesAlive-1;
        console.log("Remaining syringes: ",countSyringesAlive);
      }
    }
  }
}
function spreadSyringes(nSyringes){
  // Create an array of syringes
  for(var i = 0; i<nSyringes; i++){
    syringes.push(syringeMesh.clone());
  }

  // Spread syringes giving different coordinates looking at the forbidden ones
  for(var i = 0; i<nSyringes; ){
    var max = 500; //500 because the outsider room is 1000x1000
    var min = -500;
    var x = Math.random() * (max - min) + min;
    var z = Math.random() * (max - min) + min;
    var values_ok;
    for(var j = 0; j<noPlayingField.length; j++){
      var x_in = noPlayingField[j]['x_min'] <= x && x <= noPlayingField[j]['x_max'];  //x coordinates inside the obstacle
      var z_in = noPlayingField[j]['z_min'] <= z && z <= noPlayingField[j]['z_max'];  //z coordinates inside the obstacle
      if(!(x_in && z_in)){  //x and z outside the obstacle
        values_ok = true;// DEVO CONTROLLARE SE è ANCHE FUORI AGLI ALTRI OSTACOLI
      }
      else{
        values_ok = false;
        break;
      }
    }


    if(values_ok){  //vuol dire che è fuori a tutti gli ostacoli
      syringes[i].position.set(x,0,z); //accetto questi valori e inserisco una siringa li
      // console.log("ho analizzato: ",j);
      //console.log("ho aggiunto: ",i);
      i++; //passo alla siringa successiva

    }
    else{
      // console.log("mi sono fermata a: ",j);
      //vuol dire che ho trovato un ostacolo in cui cadrebbe la siringa e quindi non posso accettare quei valori
      //devo rigenerare altri due valori per inserire la siringa
    }
  }
  countSyringesAlive = syringes.length;

  for(var i = 0; i<nSyringes; i++){
      scene.add(syringes[i]);
  }

  //le seguenti righe sono per il debugging
  // console.log(noPlayingField);
  // var positionSyringes = [];
  // for(var i = 0; i<nSyringes; i++){
  //     positionSyringes.push(syringes[i].position);
  // }
  // console.log(positionSyringes);
}
