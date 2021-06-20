import * as THREE from 'https://threejs.org/build/three.module.js';
export function init(){
  var scene,camera;
  scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  /* CAMERA STUFF*/
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

  camera.position.y = 0;
  camera.position.z = 50;
  
  const light = new THREE.PointLight( 0xffffff, 4, 200 );
  light.position.set(0, 100, 0);
  const light1 = new THREE.PointLight( 0xffffff, 4, 200 );
  light1.position.set(0, -50, 0);
  scene.add(light);
  scene.add(light1);
  
  return [scene,camera];
}