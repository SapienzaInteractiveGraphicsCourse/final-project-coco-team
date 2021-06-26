import * as THREE from 'https://threejs.org/build/three.module.js';

export function walkingPlayer(player,mixer,clock){
  /*var times = [0, 2, 4];
  var values = [0,0,player.position.z, 0,0,player.position.z, 0,0,player.position.z];
  var posBody = new THREE.VectorKeyframeTrack('Body.position', times, values);*/

  var times = [0, 2, 4, 6];
  var values = [0,0,player.position.z+2, 0,0,player.position.z-2, 0,0,player.position.z+2];
  var posRightLeg = new THREE.VectorKeyframeTrack('UpperLeftLeg.position', times, values);

  let rotationEuler = new THREE.Euler( Math.PI/10, 0, 0, 'XYZ' );
  let r = new THREE.Quaternion().setFromEuler(rotationEuler);

  let rotationEuler1 = new THREE.Euler( -Math.PI/20, 0, 0, 'XYZ' );
  let r1 = new THREE.Quaternion().setFromEuler(rotationEuler1);

  let rotationEuler2 = new THREE.Euler( 0, 0, 0, 'XYZ' );
  let r2 = new THREE.Quaternion().setFromEuler(rotationEuler2);

  values = [  r.x,r.y,r.z,r.w, r2.x,r2.y,r2.z,r2.w, r1.x,r1.y,r1.z,r1.w, r2.x,r2.y,r2.z,r2.w];
  var inclinationLeft = new THREE.QuaternionKeyframeTrack( 'UpperLeftLeg.quaternion', times, values);
  values = [  r1.x,r1.y,r1.z,r1.w, r2.x,r2.y,r2.z,r2.w, r.x,r.y,r.z,r.w, r2.x,r2.y,r2.z,r2.w ];
  var inclinationRight = new THREE.QuaternionKeyframeTrack( 'UpperRightLeg.quaternion',times,values);

  var duration = 6;

  var clip = new THREE.AnimationClip("walk", duration, [inclinationRight, inclinationLeft]);
  mixer = new THREE.AnimationMixer(player);

  var AnimationAction = mixer.clipAction(clip);
  AnimationAction.clampWhenFinished=true;
  AnimationAction.timeScale = duration;

  clock = new THREE.Clock();
  return [mixer,clock,AnimationAction];
}