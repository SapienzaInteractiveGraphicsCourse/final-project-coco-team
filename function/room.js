import * as THREE from 'https://threejs.org/build/three.module.js';
export function getTexture (){
  const myPromise = new Promise((resolve, reject) => {
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load( "./resources/texture/surfaces.jpg", function ( map ) {
      resolve(map);
    },function ( xhr ) {
    },
    function ( error ) {
      reject(error);
    });
  });
  return myPromise;
}
export function getRoom (width, height, depth, veinTex) {
    var mesh = new THREE.Mesh();
    var room = new THREE.Group();
    veinTex.wrapS = THREE.RepeatWrapping;
    veinTex.wrapT = THREE.RepeatWrapping;
    var tex_base=veinTex.clone();
    tex_base.needsUpdate = true;
    var tex_wall12=veinTex.clone(true);
    tex_wall12.needsUpdate = true;
    var tex_wall34=veinTex.clone(true);
    tex_wall34.needsUpdate = true;

    tex_base.repeat.set(width/width*5,depth/width*5);
    tex_wall12.repeat.set(depth/height*3,height/height*3);
    tex_wall34.repeat.set(width/height*3,height/height*3);

    const material_base = new THREE.MeshPhongMaterial( { color: 0x800000, map: tex_base, bumpMap: tex_base } );
    const material_1 = new THREE.MeshPhongMaterial( { color: 0x800000, map: tex_wall12, bumpMap: tex_wall12 } );
    const material_2 = new THREE.MeshPhongMaterial( { color: 0x800000, map: tex_wall34, bumpMap: tex_wall34 } );

    var base_width = width;
    var base_height = 0.1;
    var base_depth = depth;
    const geometry_1 = new THREE.BoxGeometry(base_width, base_height, base_depth);


    const base = new THREE.Mesh( geometry_1, material_base);
    base.position.set(0.0, 0.0, 0.0);

    var wall_width = base_height;
    var wall_height =  height;
    var wall_depth = base_depth;
    const geometry_2 = new THREE.BoxGeometry(wall_width, wall_height, wall_depth);
    const wall1 = new THREE.Mesh( geometry_2, material_1);
    const wall2 = new THREE.Mesh( geometry_2, material_1);
    wall1.position.set(-(base_width/2 - wall_width/2), (wall_height/2 + base_height/2), 0.0);
    wall2.position.set((base_width/2 - wall_width/2), (wall_height/2 + base_height/2), 0.0);

    wall_width = base_width;
    wall_depth = base_height;
    const geometry_3 = new THREE.BoxGeometry(wall_width, wall_height, wall_depth);
    const wall3 = new THREE.Mesh( geometry_3, material_2);
    const wall4 = new THREE.Mesh( geometry_3, material_2);
    wall3.position.set(0.0, wall_height/2 + base_height/2, -(wall_depth/2 - base_depth/2));
    wall4.position.set(0.0, wall_height/2 + base_height/2, (wall_depth/2 - base_depth/2));

    room.add(base, wall1, wall2, wall3, wall4);
    //room.translateX(100)
    room.translateY(-25);
    return(room);
}

export function getObstacle (width, height, depth, veinTex) {
    veinTex.wrapS = THREE.RepeatWrapping;
    veinTex.wrapT = THREE.RepeatWrapping;

    var tex_0=veinTex.clone();
    tex_0.needsUpdate = true;
    var tex_1=veinTex.clone(true);
    tex_1.needsUpdate = true;
    var tex_2=veinTex.clone(true);
    tex_2.needsUpdate = true;

    tex_0.repeat.set(width/height*5,depth/height*5);
    tex_1.repeat.set(depth/height*3,height/height*3);
    tex_2.repeat.set(width/height*3,height/height*3);

    const material_0 = new THREE.MeshPhongMaterial( { color: 0x800000, map: tex_0, bumpMap: tex_0 } );
    const material_1 = new THREE.MeshPhongMaterial( { color: 0x800000, map: tex_1, bumpMap: tex_1 } );
    const material_2 = new THREE.MeshPhongMaterial( { color: 0x800000, map: tex_2, bumpMap: tex_2 } );

    var material=[material_1,material_1,material_0,material_0,material_2,material_2];

    const geometry = new THREE.BoxGeometry(width, height, depth);

    const obstacle = new THREE.Mesh( geometry, material);
    obstacle.position.y=height/2;

    obstacle.translateY(-25);
    return(obstacle);
}

export function getMaze(veinTex){      
  var room = new THREE.Group();
  var temp = getRoom(1000.0, 700.0, 1000.0, veinTex);
  room.add(temp);

  temp = getObstacle(200.0, 700.0, 200.0, veinTex);
  temp.translateX(400.0);
  temp.translateZ(400.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 100.0, veinTex);
  temp.translateX(200.0);
  temp.translateZ(200.0);
  room.add(temp);

  temp = getObstacle(250.0, 700.0, 250.0, veinTex);
  temp.translateX(-375.0);
  temp.translateZ(375.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 100.0, veinTex);
  temp.translateX(-250.0);
  temp.translateZ(200.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 200.0, veinTex);
  temp.translateX(-150.0);
  temp.translateZ(300.0);
  room.add(temp);

  temp = getObstacle(400.0, 700.0, 200.0, veinTex);
  temp.translateX(-300.0);
  temp.translateZ(-400.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 100.0, veinTex);
  temp.translateX(-50.0);
  temp.translateZ(-450.0);
  room.add(temp);

  temp = getObstacle(200.0, 700.0, 50.0, veinTex);
  temp.translateX(-5.0);
  temp.translateZ(-350.0);
  room.add(temp);

  temp = getObstacle(200.0, 700.0, 200.0, veinTex);
  temp.translateX(250.0);
  temp.translateZ(-350.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 100.0, veinTex);
  temp.translateX(250.0);
  temp.translateZ(-250.0);
  room.add(temp);

  temp = getObstacle(200.0, 700.0, 50.0, veinTex);
  temp.translateX(340.0);
  temp.translateZ(-370.0);
  room.add(temp);

  temp = getObstacle(200.0, 700.0, 200.0, veinTex);
  temp.translateX(-200.0);
  temp.translateZ(-50.0);
  room.add(temp);

  temp = getObstacle(200.0, 700.0, 200.0, veinTex);
  temp.translateX(270.0);
  temp.translateZ(80.0);
  room.add(temp);

  temp = getObstacle(50.0, 700.0, 200.0, veinTex);
  temp.translateX(230.0);
  temp.translateZ(-5.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 400.0, veinTex);
  temp.translateX(50.0);
  temp.translateZ(300.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 100.0, veinTex);
  temp.translateX(-50.0);
  temp.translateZ(-75.0);
  room.add(temp);

  temp = getObstacle(20.0, 700.0, 140.0, veinTex);
  temp.translateX(160.0); //200
  temp.translateZ(400.0);
  room.add(temp);

  temp = getObstacle(20.0, 700.0, 140.0, veinTex);
  temp.translateX(240.0); //280
  temp.translateZ(400.0);
  room.add(temp);

  temp = getObstacle(80.0, 700.0, 20.0, veinTex);
  temp.translateX(200.0);
  temp.translateZ(340.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 20.0, veinTex);
  temp.translateX(450.0);
  temp.translateZ(-150.0);
  room.add(temp);

  temp = getObstacle(20.0, 700.0, 350.0, veinTex);
  temp.translateX(400.0);
  temp.translateZ(-65.0);
  room.add(temp);

  temp = getObstacle(20.0, 700.0, 200.0, veinTex);
  temp.translateX(-450.0);
  temp.translateZ(-240.0);
  room.add(temp);

  temp = getObstacle(150.0, 700.0, 20.0, veinTex);
  temp.translateX(-380.0);
  temp.translateZ(-270.0);
  room.add(temp);

  temp = getObstacle(20.0, 700.0, 100.0, veinTex);
  temp.translateX(-330.0);
  temp.translateZ(-220.0);
  room.add(temp);

  temp = getObstacle(100.0, 700.0, 20.0, veinTex);
  temp.translateX(-450.0);
  temp.translateZ(-50.0);
  room.add(temp);

  temp = getObstacle(20.0, 700.0, 150.0, veinTex);
  temp.translateX(-410.0);
  temp.translateZ(-90.0);
  room.add(temp);

  temp = getObstacle(400.0, 700.0, 20.0, veinTex);
  temp.translateX(-300.0);
  temp.translateZ(100.0);
  room.add(temp);

  return(room);
}
