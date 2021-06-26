import * as THREE from 'https://threejs.org/build/three.module.js';

export function walkingPlayer(player,mixer,clock){
  /*var times = [0, 2, 4];
  var values = [0,0,player.position.z, 0,0,player.position.z, 0,0,player.position.z];
  var posBody = new THREE.VectorKeyframeTrack('Body.position', times, values);*/
  var values;
  var times = [0, 2, 4, 6];
  var duration = 12;
  //var values = [0,0,player.position.z+2, 0,0,player.position.z-2, 0,0,player.position.z+2];
  //var posRightLeg = new THREE.VectorKeyframeTrack('UpperLeftLeg.position', times, values);

  let rotationEuler = new THREE.Euler( Math.PI/10, 0, 0, 'XYZ' );
  let r = new THREE.Quaternion().setFromEuler(rotationEuler);

  let rotationEuler1 = new THREE.Euler( -Math.PI/20, 0, 0, 'XYZ' );
  let r1 = new THREE.Quaternion().setFromEuler(rotationEuler1);

  let rotationEuler2 = new THREE.Euler( 0, 0, 0, 'XYZ' );
  let r2 = new THREE.Quaternion().setFromEuler(rotationEuler2);

  let rotationEuler3 = new THREE.Euler(-Math.PI/10, 0, 0, 'XYZ' );
  let r3 = new THREE.Quaternion().setFromEuler(rotationEuler3);

  let rotationEuler4 = new THREE.Euler( Math.PI/20, 0, 0, 'XYZ' );
  let r4 = new THREE.Quaternion().setFromEuler(rotationEuler4);

  values = [0,0,player.position.z+2, 0,0,player.position.z-2, 0,0,player.position.z+2];
  var posBody = new THREE.VectorKeyframeTrack('Body.position', times, values);

  times = [0, 4, 6, 8, 12];
  values = [  r.x,r.y,r.z,r.w, r2.x,r2.y,r2.z,r2.w, r1.x,r1.y,r1.z,r1.w, r2.x,r2.y,r2.z,r2.w, r.x,r.y,r.z,r.w,];
  var rotationUpperLeft = new THREE.QuaternionKeyframeTrack( 'UpperLeftLeg.quaternion', times, values);

  times = [0, 4, 6, 8, 12];
  values = [  r3.x,r3.y,r3.z,r3.w, r2.x,r2.y,r2.z,r2.w, r4.x,r4.y,r4.z,r4.w, r2.x,r2.y,r2.z,r2.w, r3.x,r3.y,r3.z,r3.w];
  var rotationLowerLeft = new THREE.QuaternionKeyframeTrack( 'LowerLeftLeg.quaternion', times, values);

  times = [0, 2, 6, 10, 12];
  values = [  r1.x,r1.y,r1.z,r1.w, r2.x,r2.y,r2.z,r2.w, r.x,r.y,r.z,r.w, r2.x,r2.y,r2.z,r2.w, r1.x,r1.y,r1.z,r1.w];
  var rotationUpperRight = new THREE.QuaternionKeyframeTrack( 'UpperRightLeg.quaternion',times,values);

  times = [0, 2, 6, 10, 12];
  values = [  r4.x,r4.y,r4.z,r4.w, r2.x,r2.y,r2.z,r2.w, r3.x,r3.y,r3.z,r3.w, r2.x,r2.y,r2.z,r2.w, r4.x,r4.y,r4.z,r4.w ];
  var rotationLowerRight = new THREE.QuaternionKeyframeTrack( 'LowerRightLeg.quaternion',times,values);

  var clip = new THREE.AnimationClip("walk", duration, [rotationUpperLeft, rotationUpperRight, rotationLowerLeft, rotationLowerRight]);
  mixer = new THREE.AnimationMixer(player);

  var AnimationAction = mixer.clipAction(clip);
  AnimationAction.clampWhenFinished=true;
  AnimationAction.timeScale = duration;

  clock = new THREE.Clock();
  return [mixer,clock,AnimationAction];
}