import * as THREE from 'https://threejs.org/build/three.module.js';


export function animationTest(scene, mixer, clock){
  const geometry1 = new THREE.BoxGeometry( 5, 32, 32 );
  const geometry2 = new THREE.BoxGeometry( 5, 10, 32 );
  const material1 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );

  const geometryS = new THREE.SphereGeometry( 5, 32, 32 );
  const materialS = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  const mesh3 = new THREE.Mesh( geometryS, materialS );

  const mesh1 = new THREE.Mesh( geometry1, material1 );
  const mesh2 = new THREE.Mesh( geometry2, material2 );

  var group = new THREE.Group();

  mesh1.name = "Box1"; //Name of mesh model 1
  mesh2.name = "Box2"; //Mesh model 2 naming
  mesh3.name = "Sphere";
  group.add(mesh1); //The mesh model is added to the group
  group.add(mesh2); //The mesh model is added to the group
  group.add(mesh3);
  scene.add(group);

  /**
   * Edit the frame animation data of group sub-object mesh models mesh1 and mesh2
   */
  // Create keyframe data named Box object
  var times = [0, 10]; //Key frame time array, discrete time point sequence
  var values = [0, 0, 0, 150, 0, 0]; //An array of values ​​corresponding to the time point (0,0,0) and (150,0,0)

  // Create a position key frame object: 0 time corresponds to position (0, 0, 0) 10 time corresponds to position (150, 0, 0)
  var posTrack = new THREE.VectorKeyframeTrack('Box1.position', times, values);

  // Create a color key frame object: 10 time corresponds to the color (1, 0, 0) 20 corresponds to the color (0, 0, 1)
  var colorKF = new THREE.ColorKeyframeTrack('Box1.material.color', [10, 20], [1, 0, 0, 0, 0, 1]);

  times = [0, 1, 2, 3, 4];
  values = [0, 1, 0, 1, 0];
  var opacity = new THREE.NumberKeyframeTrack('Box2.material.opacity', times, values);
  // Create a key frame data named Sphere object From 0-20 time period, the size scale is zoomed 3 times
  var scaleTrack = new THREE.VectorKeyframeTrack('Sphere.scale', [0, 20], [1, 1, 1, 3, 3, 3]);

  // duration determines the default playback time, generally the maximum time of all frame animations
  // The duration is too small, and the frame animation data cannot be played. If it is too large, the frame animation will continue to play empty
  var duration = 20;
  // Multiple frame animations are used as elements to create a clip object, named "default", duration 20
  var clip = new THREE.AnimationClip("default", duration, [posTrack, colorKF, opacity, scaleTrack]);

  /**
   * Play edited key frame data
   */
  // group as a parameter of the mixer, can play the frame animation of all sub-objects in the group
  mixer = new THREE.AnimationMixer(group);
  // Clip clip as a parameter, and return an operation object AnimationAction through the clipAction method of the mixer
  var AnimationAction = mixer.clipAction(clip);
  //Set the playback mode by operating Action
  AnimationAction.timeScale = 20;//The default is 1, you can adjust the playback speed
  // AnimationAction.loop = THREE.LoopOnce; //Do not loop
  AnimationAction.play();//Start playing

  // Create a clock object Clock
  clock = new THREE.Clock();

  return [mixer,clock];

}

export function walkingPlayer(player,mixer,clock){
  /*var times = [0, 2, 4];
  var values = [0,0,player.position.z, 0,0,player.position.z, 0,0,player.position.z];
  var posBody = new THREE.VectorKeyframeTrack('Body.position', times, values);*/

  var times = [0, 2, 4];
  var values = [0,0,player.position.z+2, 0,0,player.position.z-2, 0,0,player.position.z+2];
  var posRightLeg = new THREE.VectorKeyframeTrack('UpperLeftLeg.position', times, values);
  let rotationEuler = new THREE.Euler( Math.PI/10, 0, 0, 'XYZ' );
  let r = new THREE.Quaternion();
  r.setFromEuler(rotationEuler);
  let rotationEuler1 = new THREE.Euler( -Math.PI/10, 0, 0, 'XYZ' );
  let r1 = new THREE.Quaternion();
  r1.setFromEuler(rotationEuler1);
  let rotationEuler2 = new THREE.Euler( 0, 0, 0, 'XYZ' );
  let r2 = new THREE.Quaternion();
  r2.setFromEuler(rotationEuler1);
  //console.log(rotationQuaternion1);
  const inclinationRight = new THREE.QuaternionKeyframeTrack( 'UpperLeftLeg.quaternion', [ 0, 2, 4 ], [  r.x, r.y, r.z, r.w, r1.x, r1.y, r1.z, r1.w, r.x, r.y, r.z, r.w ] );

  times = [0, 2, 4];
  values = [0,0,player.position.z-2, 0,0,player.position.z+2, 0,0,player.position.z-2];
  var posLeftLeg = new THREE.VectorKeyframeTrack('UpperRightLeg.position', times, values);
  const inclinationLeft = new THREE.QuaternionKeyframeTrack( 'UpperRightLeg.quaternion', [ 0, 2, 4 ], [ r1.x, r1.y, r1.z, r1.w, r.x, r.y, r.z, r.w, r1.x, r1.y, r1.z, r1.w] );

  var duration = 4;

  var clip = new THREE.AnimationClip("walk", duration, [/*posBody,*/ /*posRightLeg,*/ inclinationRight, /*posLeftLeg,*/ inclinationLeft]);
  mixer = new THREE.AnimationMixer(player);

  var AnimationAction = mixer.clipAction(clip);
  AnimationAction.timeScale = 4;
  AnimationAction.play();

  clock = new THREE.Clock();
  return [mixer,clock];
}

// function render() {
//   renderer.render(scene, camera); //Perform rendering operations
//   requestAnimationFrame(render); //Request to execute the render function render again to render the next frame
//
//   //clock.getDelta() method to get the time interval between two frames
//   // Update the relevant time of the mixer
//   mixer.update(clock.getDelta());
// }
