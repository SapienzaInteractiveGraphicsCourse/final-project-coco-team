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
    veinTex.wrapS = THREE.MirroredRepeatWrapping;
    veinTex.wrapT = THREE.MirroredRepeatWrapping;
    var pippo=veinTex.clone();
    pippo.needsUpdate = true;
    var pluto=veinTex.clone(true);
    pluto.needsUpdate = true;
    var paperino=veinTex.clone(true);
    paperino.needsUpdate = true;
    
    pippo.repeat.set(width/width*20,depth/width*20);
    pluto.repeat.set(depth/height*20,height/height*20);
    paperino.repeat.set(width/height*20,height/height*20);
    
    console.log(width,depth);

    const material_base = new THREE.MeshPhongMaterial( { color: 0x800000, map: pippo, bumpMap: pippo } );
    const material_1 = new THREE.MeshPhongMaterial( { color: 0x800000, map: pluto, bumpMap: pluto } );
    const material_2 = new THREE.MeshPhongMaterial( { color: 0x800000, map: paperino, bumpMap: paperino } );

    var base_width = width; //100.0;
    var base_height = 5.0;
    var base_depth = depth; //100.0;
    const geometry_1 = new THREE.BoxGeometry(base_width, base_height, base_depth);


    const base = new THREE.Mesh( geometry_1, material_base);
    base.position.set(0.0, 0.0, 0.0);

    var wall_width = base_height;
    var wall_height =  height; //base_width - 20.0;
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

export function getLevel(veinTex){
  //var veinTex1 = veinTex.clone();
  var room = new THREE.Group();
  var temp = getRoom(1000.0, 700.0, 1000.0, veinTex);
  room.add(temp);
  temp = getRoom(20.0, 700.0, 30.0, veinTex);
  temp.translateX(20.0);
  room.add(temp)
  return(room);
}
