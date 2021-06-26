import * as THREE from 'https://threejs.org/build/three.module.js';

const cameradisplacement = [new THREE.Vector3(0,20,0),new THREE.Vector3(0,20,50)];
const camera_pointy = new THREE.Vector3(0,50,0);

export function checkCameraCollision (player,camera,enabled,room,raycast) {
  player.children[0].visible=false;
  //rotate to player direction
  if (enabled.r==0) {
    player.children[0].visible=false;
    player.children[0].children[0].visible=false;
    player.children[0].children[3].visible=false;
    player.children[0].children[4].visible=false;
    camera.quaternion.copy(player.quaternion);
    camera.position.copy(player.position);
    camera.position.add(cameradisplacement[enabled.r]);
    camera.position.add(camera_pointy);
    let camera_Incline = new THREE.Euler( -Math.atan(20/50), 0, 0, 'XYZ' );
    let cameraVerticalRotation = new THREE.Quaternion().setFromEuler(camera_Incline);
    camera.quaternion.multiply(cameraVerticalRotation);
  }
  else{
    player.children[0].visible=true;
    player.children[0].children[0].visible=true;
    player.children[0].children[3].visible=true;
    player.children[0].children[4].visible=true;
    camera.quaternion.copy(player.quaternion);
    //check the distance
    let Collision_Distance = 50;
    let Colliding_Distance = Collision_Distance+=10;

    let collisionResultsObstacles = raycast.intersectObjects(room.children);
    if(collisionResultsObstacles.length > 0) {
      if(collisionResultsObstacles[0].distance < Collision_Distance) {
        Colliding_Distance=collisionResultsObstacles[0].distance;
      }
    }

    var cameraPromisedDisplacement=new THREE.Vector3()
    cameraPromisedDisplacement.copy(cameradisplacement[enabled.r]);
    if (enabled.r==1&&Colliding_Distance<50) {
        cameraPromisedDisplacement.z=Colliding_Distance-5;
    }
    if (enabled.r==2&&Colliding_Distance<50) {
        cameraPromisedDisplacement.z=-Colliding_Distance+5;
    }
    //camera x incline
    let camera_Incline = new THREE.Euler( -Math.atan(cameraPromisedDisplacement.y/cameraPromisedDisplacement.z), 0, 0, 'XYZ' );
    let cameraVerticalRotation = new THREE.Quaternion().setFromEuler(camera_Incline);
    cameraPromisedDisplacement.applyQuaternion(player.quaternion);
    camera.position.copy(player.position);
    camera.position.add(camera_pointy);
    camera.position.add(cameraPromisedDisplacement);
    camera.quaternion.multiply(cameraVerticalRotation);
  }

}