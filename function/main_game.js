import * as THREE from 'https://threejs.org/build/three.module.js';
import * as room from "./room.js";

export function init(roomTexture){


  var scene,camera;
  //,camera2;
  scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  /* CAMERA STUFF*/
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

  camera.position.set(0,40,50);
  //camera.rotation.x=-Math.atan((camera.position.y-40)/camera.position.z);

  //camera2 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  //camera2.position.copy(camera.position);

  const light = new THREE.PointLight( 0xffffff, 4, 1500 );
  light.position.set(0, 1000, 0);
  const light1 = new THREE.PointLight( 0xffffff, 4, 200 );
  light1.position.set(0, -50, 0);
  scene.add(light);
  scene.add(light1);

  var room_mesh = room.getMaze(roomTexture);
  scene.add(room_mesh);

  const geometry = new THREE.BoxGeometry(20, 80, 20);
  const material_0 = new THREE.MeshPhongMaterial( { color: 0x00f0f0 });
  var cubeMesh = new THREE.Mesh( geometry, material_0);
  cubeMesh.position.y=geometry.parameters.height/2;
  scene.add(cubeMesh);

  return [scene,camera,cubeMesh];
  //return [scene,camera,cubeMesh,camera2];
}
