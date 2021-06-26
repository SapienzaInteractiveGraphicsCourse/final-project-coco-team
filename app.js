import * as THREE from 'https://threejs.org/build/three.module.js';
import * as MODEL from "./function/model.js";
import * as menu from "./function/menu.js";
import * as main_game from "./function/main_game.js";
import * as room from "./function/room.js";
import * as debug from "./function/debug.js";
import * as timer from "./function/timer.js";
import * as interaction from "./function/interactionObj.js";
import * as controls from "./function/controls.js"
import * as animation from "./function/animation.js"

//resource that has to be loaded
var virusMesh,roomTexture,vaccineMesh,font,playerMesh,maskMesh,gelMesh,syringeFullMesh,syringeEmptyMesh;

var camera, scene, renderer;
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
var using_only_room = false;

var linesArray;

var noPlayingField;

var syringesFull = [];
var countSyringesFullAlive;
var syringesEmpty = [];
var countSyringesEmptyAlive;
var virus = [];
var countVirusAlive;
var masks = [];
var countMasksAlive;
var gels = [];
var countGelsAlive;
var vaccines = [];
var countVaccinesAlive;

var end_time,time_remaining;

var mixer,clock;
var remainingLive = 100;

loader();

/*-----------------------LOADING MODEL WITH PROMISES-------------------------*/
function loader(){
  var virusMeshPromise = MODEL.getVirusMesh();
  var playerMeshPromise = MODEL.getPlayerMesh();
  var roomTexturePromise = MODEL.getTexture();
  var vaccinePromise = MODEL.getVaccineMesh();
  var maskPromise = MODEL.getMaskMesh();
  var gelPromise = MODEL.getGelMesh();
  var syringeEmptyPromise = MODEL.getSyringeEmptyMesh();
  var syringeFullPromise = MODEL.getSyringeFullMesh();
  var fontPromise = MODEL.getFont();
  Promise.all([virusMeshPromise,roomTexturePromise,vaccinePromise,fontPromise,playerMeshPromise,maskPromise,gelPromise,syringeFullPromise,syringeEmptyPromise]).then(
    data => {
    virusMesh = data[0];
    roomTexture = data[1];
    vaccineMesh=data[2];
    font=data[3];
    playerMesh=data[4];
    maskMesh=data[5];
    gelMesh=data[6];
    syringeFullMesh=data[7];
    syringeEmptyMesh=data[8];
    init();
  },error => {
    console.log( 'An error happened:',error );
  });
}

/*-----------------------INITIALIZING THE SCENES-------------------------*/
function init() {
  stato=0;
  enabled=controls.init();

  pointer = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.body.appendChild(renderer.domElement);

/*---------------------------MAIN MENU STUFF---------------------------*/
  var temp = menu.init(font,roomTexture,playerMesh);
  scene_menu = temp[0];
  camera_menu = temp [1];
  ButtonArrayId = temp [2];

/*---------------------------MAIN SCENE STUFF---------------------------*/
  temp = main_game.init(roomTexture,playerMesh);
  scene = temp[0];
  camera = temp [1];
  player = temp[2];
  cameraTranslation = temp[3];
  full_room = temp[4];
  only_room = temp[5];
  noPlayingField = temp[6];

  syringeFullMesh.userData.tag = 'syringeFull';
  syringeEmptyMesh.userData.tag = 'syringeEmpty';
  virusMesh.userData.tag = 'virus';
  vaccineMesh.userData.tag = 'vaccine';
  maskMesh.userData.tag = 'mask';
  gelMesh.userData.tag = 'gel';

  noPlayingField = interaction.removePlayerPosition(player, noPlayingField);

  countMasksAlive = 20;
  var temp = interaction.spreadingObj(countMasksAlive, maskMesh, noPlayingField, scene);
  masks = temp[0];
  noPlayingField = temp[1];

  countGelsAlive = 20;
  temp = interaction.spreadingObj(countGelsAlive, gelMesh, noPlayingField, scene);
  gels = temp[0];
  noPlayingField = temp[1];

  /*countSyringesFullAlive = 20;
  temp = interaction.spreadingObj(countSyringesFullAlive, syringeFullMesh, noPlayingField, scene);
  syringesFull = temp[0];
  noPlayingField = temp[1];

  countSyringesEmptyAlive = 20;
  temp = interaction.spreadingObj(countSyringesEmptyAlive, syringeEmptyMesh, noPlayingField, scene);
  syringesEmpty = temp[0];
  noPlayingField = temp[1];

  countVirusAlive = 20;
  temp = interaction.spreadingObj(countVirusAlive, virusMesh, noPlayingField, scene);
  virus = temp[0];
  noPlayingField = temp[1];*/

  countVaccinesAlive = 20;
  temp  = interaction.spreadingObj(countVaccinesAlive, vaccineMesh, noPlayingField, scene);
  vaccines = temp[0];
  noPlayingField = temp[1];

  //console.log(player);
  var t = animation.walkingPlayer(player,mixer,clock);
  mixer = t[0];
  clock = t[1];

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
    "distance":40,
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
  window.addEventListener('keydown',function(event){
    temp=controls.keypressedAgent(event,enabled,stato,end_time,time_remaining,virus,player.position.x,player.position.z,countVirusAlive,countVaccinesAlive,vaccines,remainingLive,countMasksAlive,masks);
    enabled=temp[0];
    stato=temp[1];
    end_time=temp[2];
    countVirusAlive=temp[3];
    countVaccinesAlive=temp[4];
    countMasksAlive=temp[5];
  }, false);
  window.addEventListener('keyup',function(event){enabled=controls.keyreleasedAgent(event,enabled);}, false);

/*---------------------------ANIMATION LOOP---------------------------*/
  window.requestAnimationFrame(animate);
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
        if (INTERSECTED.uuid == ButtonArrayId[0]){
          stato=1;
          end_time=timer.setTimer(1,0);
        }
        if (INTERSECTED.uuid == ButtonArrayId[1])
          console.log("Option");
      }
      break;
  }
}

function animate() {
   setTimeout( function() {

       requestAnimationFrame( animate );
       render();
       update();

   }, 1000 / 60 );
 }

function render(){
  switch(stato) {
    case 0:
      renderer.render( scene_menu, camera_menu );
      break;
    case 1:
      renderer.render( scene, camera );
      mixer.update(clock.getDelta());
      break;
    case 2:
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
      time_remaining=timer.timerUpdate(end_time);

      var oldCameraPosition = new THREE.Vector3().copy(cameraTranslation);
      //var cameraPosition = checkCameraCollision(oldCameraPosition);
      var cameraPosition = oldCameraPosition
      var camera_Incline = new THREE.Euler( -Math.atan((cameraTranslation.y-40)/camera.position.z), 0, 0, 'XYZ' );
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
        //camera.quaternion.multiply(cameraVerticalRotation);
        //computing new camera location
        cameraPosition.applyQuaternion(player.quaternion);
        camera.position.copy(player.position);
        camera.position.add(cameraPosition);
      }
/*---------------------------UPDATING RAY VISUALIZATION---------------------------*/
      for (let x=0; x<linesArray.length;x++){
        debug.updateRay(linesArray[x],player);
      }

/*---------------------------INTERACTION OBJECTS---------------------------*/
      if(!using_only_room){
        interaction.spinObjects(vaccines);
        countVaccinesAlive = interaction.interactionPlayerObject(vaccines, player.position.x, player.position.z, countVaccinesAlive);

        interaction.spinObjects(masks);
        countMasksAlive = interaction.interactionPlayerObject(masks, player.position.x, player.position.z, countMasksAlive);

        interaction.spinObjects(gels);
        countGelsAlive = interaction.interactionPlayerObject(gels, player.position.x, player.position.z, countGelsAlive);
      }
      // if(using_only_room){
      //   if(/*STO IN UN INTORNO DEL VIRUS E NON VIENE NESSUN EVENTO LEGATO ALLA MASCHERINA*/){
      //     remainingLive-=5;
      //     document.getElementById("contact").innerHTML = "&#128156 " + remainingLive + "%";
      //   }
      // }

      if(document.getElementById("timer").innerHTML == "VIRUS INFECTION BEGUN!!" && !using_only_room){
          scene.add(only_room);
          scene.remove(scene.children.find((child) => child.name === "full_room"));
          interaction.disappearObject(vaccines);
          interaction.disappearObject(masks);
          interaction.disappearObject(gels);

          noPlayingField = interaction.removePlayerPosition(player, noPlayingField);
          countVirusAlive = 20;
          var temp = interaction.spreadingObj(countVirusAlive, virusMesh, noPlayingField, scene);
          virus = temp[0];
          noPlayingField = temp[1];

          using_only_room = true;

          document.getElementById("contact").innerHTML = "&#128156 " + remainingLive + "%";
        }

      break;
    case 2:
      break;
    default:
      console.log("ERROR");
  }
}

function checkCollision(direction){
  let Collision_Distance = 17;
  for (let x=0;x<collision.length;x++){
    collision[x].isColliding=false;
    collision[x].distance=Collision_Distance+10;
  }
  var collisionResults;
  for (var rayIndex = 0; rayIndex < RayCasterArray.length; rayIndex++) {
    if (using_only_room){
      collisionResults = RayCasterArray[rayIndex].intersectObjects(only_room.children);
    }
    else{
      collisionResults = RayCasterArray[rayIndex].intersectObjects(full_room.children);
    }
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
  var collisionResultsObstacles;
  if(using_only_room){
    collisionResultsObstacles = RayCasterArray[2].intersectObjects(only_room.children);
  }
  else{
    collisionResultsObstacles = RayCasterArray[2].intersectObjects(full_room.children);
  }
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
