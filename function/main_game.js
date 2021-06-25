import * as THREE from 'https://threejs.org/build/three.module.js';
import * as room from "./room.js";

export function init(roomTexture,playerMesh){
  var scene,camera;
  scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  const light = new THREE.PointLight( 0xffffff, 4, 1500 );
  light.position.set(0, 1000, 0);
  const light1 = new THREE.PointLight( 0xffffff, 4, 200 );
  light1.position.set(0, -50, 20);
  scene.add(light);
  scene.add(light1);

  var maze = room.getMaze(roomTexture);
  var full_room = maze[0];
  var only_room = maze[1];
  var noPlayingField = maze[2];
  full_room.name = "full_room";
  scene.add(full_room);

  scene.add(playerMesh);

  /* CAMERA STUFF*/
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

  var cameraTranslation = new THREE.Vector3( 0, 60, 60 );
  camera.position.set(0,cameraTranslation.y,cameraTranslation.z);
  camera.rotation.x=-Math.atan((cameraTranslation.y-40)/camera.position.z);

  return [scene, camera, playerMesh, cameraTranslation, full_room, only_room, noPlayingField];
}
