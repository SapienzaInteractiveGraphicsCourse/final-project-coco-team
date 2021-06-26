import * as THREE from 'https://threejs.org/build/three.module.js';

export function checkPlayerCollision(direction,raycasterArray,room){
  var Collision_Distance = 17;

  var normalArray=[];
  var collisionResults;
  for (let rayIndex = 0; rayIndex < raycasterArray.length; rayIndex++) {
    collisionResults = raycasterArray[rayIndex].intersectObjects(room.children);
    if(collisionResults.length > 0) {
      if(collisionResults[0].distance < Collision_Distance) {
        if(!normalArray.includes(collisionResults[0].face.normal))
          normalArray.push(collisionResults[0].face.normal.clone());
      }
    }
  }
  var results=direction.clone();
  var final_normal=new THREE.Vector3();
  for (let x=0;x<normalArray.length;x++){
    if(direction.clone().dot(normalArray[x])<0)
      results=results.sub(normalArray[x].multiplyScalar(direction.clone().dot(normalArray[x])));
  }
  return results;
}

export function initPlayerRay(){
  var RayCasterArray=[];
  let rayNumbers = 8;
  for (let x=0;x<rayNumbers;x++){
    let angle= -x*(Math.PI*2/rayNumbers);
    let rotationEuler = new THREE.Euler( 0, angle, 0, 'XYZ' );
    let rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromEuler(rotationEuler);
    let RayDirection = new THREE.Vector3( 1, 0, 0 );
    RayDirection.applyQuaternion(rotationQuaternion);
    var RayCasterElement = new THREE.Raycaster(new THREE.Vector3( 0, 40, 0 ),RayDirection);
    RayCasterArray.push(RayCasterElement);
  }
  return RayCasterArray;
}
export function updatePlayerRayPosition(player,RayCasterArray){
  for (let x=0;x<RayCasterArray.length;x++){
    RayCasterArray[x].ray.origin=player.position.clone();
    RayCasterArray[x].ray.origin.y=40;
  }
  return RayCasterArray;
}

export function updatePlayerRayRotation(rotation,RayCasterArray){
  for (let x=0;x<RayCasterArray.length;x++){
    let rotationEuler = new THREE.Euler( 0, rotation, 0, 'XYZ' );
    let rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromEuler(rotationEuler);
    RayCasterArray[x].ray.direction.applyQuaternion(rotationQuaternion);
  }
  return RayCasterArray;
}

export function updatePlayerRunningRotation(direction,player){
  if (direction.equals(new THREE.Vector3(1,0,0))){
    player.children[0].rotation.y=-Math.PI/2;
  }
  if (direction.equals(new THREE.Vector3(1,0,1))){
    player.children[0].rotation.y=-Math.PI*3/4;
  }
  if (direction.equals(new THREE.Vector3(1,0,-1))){
    player.children[0].rotation.y=-Math.PI/4;
  }
  if (direction.equals(new THREE.Vector3(0,0,1))){
    player.children[0].rotation.y=Math.PI;
  }
  if (direction.equals(new THREE.Vector3(0,0,-1))){
    player.children[0].rotation.y=0;
  }
  if (direction.equals(new THREE.Vector3(-1,0,1))){
    player.children[0].rotation.y=Math.PI*3/4;
  }
  if (direction.equals(new THREE.Vector3(-1,0,0))){
    player.children[0].rotation.y=Math.PI/2;
  }
  if (direction.equals(new THREE.Vector3(-1,0,-1))){
    player.children[0].rotation.y=Math.PI/4;
  }
  if (direction.equals(new THREE.Vector3(0,0,0))){
    player.children[0].rotation.y=0;
  }
  
}