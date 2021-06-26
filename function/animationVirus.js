import * as THREE from 'https://threejs.org/build/three.module.js';

export function nearestVirus(playerX, playerZ, virus){
  var idx = virus.length+1;
  var maxDistance = 60;
  var min_distance = (playerX-virus[0].position.x)**2 + (playerZ-virus[0].position.z)**2;
  for(var i = 1; i<virus.length; i++){
      if(virus[i].visible == true){
          var distance = (playerX-virus[i].position.x)**2 + (playerZ-virus[i].position.z)**2;
          if(distance<maxDistance*maxDistance && distance<min_distance){
            min_distance = distance;
            idx = i;
          }
      }
    }
  return idx;
}

export function chasePlayer(player,virus,mixer,clock){
  //var idxNearest = nearestVirus(player.position.x, player.position.z, virus);

  //if(idxNearest != virus.length+1){
    var times = [0, 2, 4, 6, 8, 10, 12, 14];
    var duration = 14;
    var values = [virus.position.x,     virus.position.y, virus.position.z,
                  player.position.x+2,  virus.position.y, player.position.z+2,
                  player.position.x+4,  virus.position.y, player.position.z+4,
                  player.position.x+6,  virus.position.y, player.position.z+6,
                  player.position.x+8,  virus.position.y, player.position.z+8,
                  player.position.x+10, virus.position.y, player.position.z+10,
                  player.position.x+12, virus.position.y, player.position.z+12,
                  player.position.x+14, virus.position.y, player.position.z+14];
    var posBody = new THREE.VectorKeyframeTrack('Body.position', times, values);

    var clip = new THREE.AnimationClip("chase", duration, [posBody]);
    mixer = new THREE.AnimationMixer(virus);

    var AnimationAction = mixer.clipAction(clip);
    AnimationAction.clampWhenFinished=true;
    AnimationAction.timeScale = duration;
    clock = new THREE.Clock();
    return [mixer,clock,AnimationAction];
  //}
}
