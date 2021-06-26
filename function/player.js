import * as THREE from 'https://threejs.org/build/three.module.js';

export function updatePlayerPosition(player,enabled){
  
}

export function updatePlayerRotation(){
  
}

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
  console.log(normalArray);
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
    var RayCasterElement = new THREE.Raycaster(new THREE.Vector3( 0, 20, 0 ),RayDirection);
    RayCasterArray.push(RayCasterElement);
  }
  return RayCasterArray;
}
export function updatePlayerRayPosition(player,RayCasterArray){
  for (let x=0;x<RayCasterArray.length;x++){
    RayCasterArray[x].ray.origin=player.position;
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
  return RayCasterArray
}
/*

      var oldCameraPosition = new THREE.Vector3().copy(cameraTranslation);
      //var cameraPosition = checkCameraCollision(oldCameraPosition);
      var cameraPosition = oldCameraPosition
      var camera_Incline = new THREE.Euler( -Math.atan((cameraTranslation.y-40)/camera.position.z), 0, 0, 'XYZ' );
      var cameraVerticalRotation = new THREE.Quaternion().setFromEuler(camera_Incline);

      var isRotating,isMoving;

/*---------------------------PLAYER ROTATION---------------------------
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
/*---------------------------PLAYER MOVEMENT---------------------------
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
        
      }
/*---------------------------CAMERA TRANSLATION---------------------------
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
/*---------------------------UPDATING RAY VISUALIZATION---------------------------
      for (let x=0; x<linesArray.length;x++){
        debug.updateRay(linesArray[x],player);
      }
*/