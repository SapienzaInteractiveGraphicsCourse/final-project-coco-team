import * as THREE from 'https://threejs.org/build/three.module.js';
import * as MODEL from "./function/model.js";
import * as menu from "./function/menu.js";
import * as main_game from "./function/main_game.js";
import * as room from "./function/room.js";
import * as timer from "./function/timer.js";
import * as interaction from "./function/interactionObj.js";
import * as controls from "./function/controls.js";
import * as animation from "./function/animation.js";
import * as animationVirus from "./function/animationVirus.js";
import * as player_func from "./function/player.js";
import * as camera_func from "./function/camera.js";

//resource that has to be loaded
var virusMesh,roomTexture,vaccineMesh,font,sound,playerMesh,maskMesh,gelMesh,syringeFullMesh,syringeEmptyMesh,HeartBeat;

var camera, scene, renderer;
var scene_menu,camera_menu;

var stato;
var pointer,raycaster,INTERSECTED;

var ButtonArrayId;

var player;
var cameraTranslation;
var enabled;

var RayCasterArray,RayCasterCameraArray;

var CameraRayCast;

var full_room;
var only_room;
var using_only_room = false;

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

var general_time,end_time;

var mixer,clock;
var remainingLive = 100;

var AnimationAction;

var timerGel, time_remainingGel;
var timerMask, time_remainingMask;
var activatedMask=false;
var activatedGel=false;

var mixerVirus,clockVirus;
var AnimationActionVirus;
var foundVirus=false;

var AmbientSound;


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
  var audioPromise = MODEL.getAudioFile();
  Promise.all([virusMeshPromise,roomTexturePromise,vaccinePromise,fontPromise,playerMeshPromise,maskPromise,gelPromise,syringeFullPromise,syringeEmptyPromise,audioPromise]).then(
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
    HeartBeat=data[9];
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

  countMasksAlive = 10;
  temp = interaction.spreadingObj(countMasksAlive, maskMesh, noPlayingField, scene);
  masks = temp[0];
  noPlayingField = temp[1];

  countGelsAlive = 10;
  temp = interaction.spreadingObj(countGelsAlive, gelMesh, noPlayingField, scene);
  gels = temp[0];
  noPlayingField = temp[1];

  countVaccinesAlive = 40;
  temp  = interaction.spreadingObj(countVaccinesAlive, vaccineMesh, noPlayingField, scene);
  vaccines = temp[0];
  noPlayingField = temp[1];

  var t = animation.walkingPlayer(player,mixer,clock);
  mixer = t[0];
  clock = t[1];
  AnimationAction = t[2];

  // instantiate a listener
  const audioListener = new THREE.AudioListener();

  AmbientSound = new THREE.Audio( audioListener );

  camera.add( audioListener );
  scene.add( AmbientSound );

  AmbientSound.setBuffer( HeartBeat );
  AmbientSound.setLoop(true);


/*---------------------------MENU RAYCASTER---------------------------*/
  raycaster=new THREE.Raycaster();

/*---------------------------PLAYER RAYCASTER---------------------------*/
  RayCasterArray = player_func.initPlayerRay();

/*---------------------------EVENT LISTENER---------------------------*/
  document.addEventListener( 'mousemove', onPointerMove );
  document.addEventListener( 'click', onMouseClick );
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keydown',function(event){
    temp=controls.keypressedAgent(event,enabled,stato,end_time,general_time,virus,player.position.x,player.position.z,countVirusAlive,countVaccinesAlive,vaccines,remainingLive,countMasksAlive,masks);
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
          end_time=timer.setTimer(1,00);
          AmbientSound.play();
          timer.generalTimerHTMLUpdater(timer.timerUpdate(end_time));
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
      if(foundVirus) mixerVirus.update(clockVirus.getDelta());
      break;
    case 2:
      renderer.render( scene, camera );
      mixer.update(clock.getDelta());
      if(foundVirus) mixerVirus.update(clockVirus.getDelta());
      break;
    case 3:
      renderer.render( scene, camera );
      break;
    default:
      console.log("error you should not be here");
  }
}

function update(){
  switch(stato) {

    //MAIN MENU
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

    //PUZZLE PART
    case 1:

      general_time=timer.timerUpdate(end_time);
      timer.generalTimerHTMLUpdater(general_time);

      //Get player movement
      var direction = player_func.getPlayerMovement(player,camera,enabled,RayCasterArray,full_room);

      /*---------------------------KEYFRAME ANIMATION---------------------------*/
      if (direction.equals(new THREE.Vector3(0,0,0))){
        AnimationAction.stop();
      }
      else{
        AnimationAction.play();
      }

      /*---------------------------OBJECT SPINNING ANIMATION---------------------------*/
      animation.spinObjects(vaccines);
      animation.spinObjects(masks);
      animation.spinObjects(gels);

      /*---------------------------INTERACTION OBJECTS---------------------------*/
      countVaccinesAlive = interaction.interactionPlayerObject(vaccines, player.position.x, player.position.z, countVaccinesAlive, 20);
      countMasksAlive = interaction.interactionPlayerObject(masks, player.position.x, player.position.z, countMasksAlive, 20);
      countGelsAlive = interaction.interactionPlayerObject(gels, player.position.x, player.position.z, countGelsAlive, 20);


      //END OF MAZE PART TRIGGER
      if(timer.timerCheckDistance(general_time)){
        //CHANGE TIMER TO VIRUS INFECTION
        timer.generalTimerChange();

        //SWAP ROOM
        scene.add(only_room);
        scene.remove(scene.children.find((child) => child.name === "full_room"));

        //REMOVE ALL THE OBJECTS
        interaction.disappearObject(vaccines);
        interaction.disappearObject(masks);
        interaction.disappearObject(gels);

        noPlayingField = interaction.removePlayerPosition(player, []);
        countVirusAlive = 10;
        var temp = interaction.spreadingObj(countVirusAlive, virusMesh, noPlayingField, scene);
        virus = temp[0];
        noPlayingField = temp[1];

        using_only_room = true;

        document.getElementById("contact").innerHTML = "&#128156 " + remainingLive + "%";

        stato = 2;
        AmbientSound.playbackRate=5;
      }

      break;
    //VIRUS FIGHT
    case 2:

      //Get player movement
      direction = player_func.getPlayerMovement(player,camera,enabled,RayCasterArray,only_room);

      /*---------------------------KEYFRAME ANIMATION---------------------------*/
      if (direction.equals(new THREE.Vector3(0,0,0))){
        AnimationAction.stop();
      }
      else{
        AnimationAction.play();
      }

      /*---------------------------VIRUS LOGIC---------------------------*/
      var idx = animationVirus.nearestVirus(player.position.x, player.position.z, virus);
      if(idx != virus.length+1){
        var t = animationVirus.chasePlayer(player,virus[idx],mixerVirus,clockVirus);
        mixerVirus = t[0];
        clockVirus = t[1];
        AnimationActionVirus = t[2];
        foundVirus = true;
      }

      if(foundVirus && !activatedGel) AnimationActionVirus.play();
      if(foundVirus && activatedGel){
         AnimationActionVirus.stop();
         foundVirus = false;
      }

      if(enabled.x && (masks.length-countMasksAlive) > 0){
        countMasksAlive = interaction.maskVirus(masks,countMasksAlive);
        timerMask=timer.setTimer(0,5);
        activatedMask = true;
      }

      if(activatedMask) time_remainingMask=timer.timerUpdate(timerMask);

      if (enabled.c && (gels.length-countGelsAlive) > 0){
        dirZ = dirZ.multiplyScalar(6);
        dirX = dirX.multiplyScalar(6);
        countGelsAlive = interaction.gelVirus(gels,countGelsAlive);
        timerGel=timer.setTimer(0,5);
        activatedGel = true;
      }

      if(activatedGel){
        time_remainingGel=timer.timerUpdate(timerGel);
        if(time_remainingGel > 0){
          dirZ = dirZ.multiplyScalar(6);
          dirX = dirX.multiplyScalar(6);
        }
        else{
          activatedGel = false;
        }
      }

      if(!activatedMask || time_remainingMask <= 0){
        activatedMask = false;
        remainingLive = interaction.contactWithVirus(virus, remainingLive, player.position.x, player.position.z);
      }

      break;
    //PAUSE NOTHING HAPPENS HERE
    case 3:
      break;
    default:
      console.log("ERROR");
  }
}

