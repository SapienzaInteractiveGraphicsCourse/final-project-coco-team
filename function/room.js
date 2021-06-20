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

    const material = new THREE.MeshPhongMaterial( { color: 0x800000, map: veinTex, bumpMap: veinTex } );
    var base_width = width; //100.0;
    var base_height = 5.0;
    var base_depth = depth; //100.0;
    const geometry_1 = new THREE.BoxGeometry(base_width, base_height, base_depth);



    const base = new THREE.Mesh( geometry_1, material);
    base.position.set(0.0, 0.0, 0.0);

    var wall_width = base_height;
    var wall_height =  height; //base_width - 20.0;
    var wall_depth = base_depth;
    const geometry_2 = new THREE.BoxGeometry(wall_width, wall_height, wall_depth);
    const wall1 = new THREE.Mesh( geometry_2, material );
    const wall2 = new THREE.Mesh( geometry_2, material );
    wall1.position.set(-(base_width/2 - wall_width/2), (wall_height/2 + base_height/2), 0.0);
    wall2.position.set((base_width/2 - wall_width/2), (wall_height/2 + base_height/2), 0.0);

    wall_width = base_width;
    wall_depth = base_height;
    const geometry_3 = new THREE.BoxGeometry(wall_width, wall_height, wall_depth);

    // min =
    // var uvAttribute = geometry_3.attributes.uv;
    // for ( var i = 0; i < uvAttribute.count; i ++ ) {
    //     var u = uvAttribute.getX( i );
    //     var v = uvAttribute.getY( i );
    //     // do something with uv
    //     u = u + Math.random() * Math.random();
    //     v = v + Math.random() * Math.random();
    //     // write values back to attribute
    //     uvAttribute.setXY( i, u, v );
    // }
    // uvAttribute.needsUpdate = true;

    const wall3 = new THREE.Mesh( geometry_3, material );
    const wall4 = new THREE.Mesh( geometry_3, material );
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
  // veinTex1.wrapS = THREE.MirroredRepeatWrapping;
  // veinTex1.wrapT = THREE.MirroredRepeatWrapping;
  // veinTex1.repeat.set(0.1,1);
  temp = getRoom(20.0, 700.0, 30.0, veinTex);
  temp.translateX(20.0);
  room.add(temp)
  return(room);
}
