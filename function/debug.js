import * as THREE from 'https://threejs.org/build/three.module.js';

export function drawRay(number,scene,player,RayCasterArray){
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

  const points = [];
  points.push( player.position);
  let punto = new THREE.Vector3();
  punto.copy(RayCasterArray[number].ray.direction);
  punto.multiplyScalar(15);
  punto.add(player.position);
  points.push(punto);

  const geometry = new THREE.BufferGeometry().setFromPoints( points );

  let line = new THREE.Line( geometry, material );
  scene.add( line );
  return line;
}

export function updateRay(line,player){
  //console.log(player.position,line.position);
  line.position.copy(player.position);
  line.position.y=0;
}