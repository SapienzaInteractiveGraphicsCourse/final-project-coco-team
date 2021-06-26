import * as THREE from 'https://threejs.org/build/three.module.js';
import * as room from "./room.js";

export function init(roomTexture,playerMesh){
  var scene,camera;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x800000);

  //scene.fog=new THREE.Fog(0x800000,60,1000);

  const light_global = new THREE.PointLight( 0xffffff, 4, 1500 );
  light_global.position.set(0, 1000, 0);
  scene.add(light_global);

  for (let x=-600;x<=600;x+=200){
    for (let y=-600;y<=600;y+=200){
      const light = new THREE.PointLight( 0x800000, 4, 200 );
      light.position.set(x, -50, y);
      scene.add(light);
    }
  }

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
