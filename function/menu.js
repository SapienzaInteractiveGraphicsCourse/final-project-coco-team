import * as THREE from 'https://threejs.org/build/three.module.js';
export function init(){
  var scene,camera;
  scene = new THREE.Scene();
  scene.background = new THREE.Color('black');


  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

  camera.position.y = 0;
  camera.position.z = 50;
  return [scene,camera];
}