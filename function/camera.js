import * as THREE from 'https://threejs.org/build/three.module.js';

const cameradisplacement = [new THREE.Vector3(0,0,0),new THREE.Vector3(0,20,50),new THREE.Vector3(0,20,-50)];

export function cameraUpdatePosition(player,camera,enabled){
  cameraPromisedDisplacement=cameradisplacement[enabled.r];
  if (isRotating||isMoving){
    cameraPosition.applyQuaternion(player.quaternion);
    camera.position.copy(player.position);
    camera.position.add(cameraPosition);
  }
}

export function cameraUpdateRotation(player,camera){
  camera.quaternion.copy(player.quaternion);
}

export function checkCameraCollision (player,camera,enabled,room,raycast) {
    let Collision_Distance = cameraPosition.z;
    var collisionResultsObstacles = raycast.intersectObjects(room.children);
    if(collisionResultsObstacles.length > 0) {
      if(collisionResultsObstacles[0].distance < Collision_Distance) {
        let newCameraPositionObstacles = new THREE.Vector3().copy(cameraPosition);
        newCameraPositionObstacles.z=collisionResultsObstacles[0].distance-1;
        return newCameraPositionObstacles;
      }
      else{
        return cameraPosition;
      }
    }
}
export function initCameraRay(){
  
}

export function updateCameraRayRotation(){
  
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
        for (let x=0;x<RayCasterArray.length;x++){
          RayCasterArray[x].ray.origin=player.position;
        }
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