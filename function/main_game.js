import * as THREE from 'https://threejs.org/build/three.module.js';
import * as room from "./room.js";

export function init(roomTexture){
  var scene,camera;
  scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  /* CAMERA STUFF*/
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

  camera.position.y = 0;
  camera.position.z = 50;

  const light = new THREE.PointLight( 0xffffff, 4, 1500 );
  light.position.set(0, 1000, 0);
  const light1 = new THREE.PointLight( 0xffffff, 4, 200 );
  light1.position.set(0, -50, 0);
  scene.add(light);
  scene.add(light1);

  var room_mesh=room.getMaze(roomTexture);
  scene.add(room_mesh);

  return [scene,camera];
}
