import * as THREE from 'https://threejs.org/build/three.module.js';

export function getRoom (width, height, depth) {
  const myPromise = new Promise((resolve, reject) => {
    var mesh = new THREE.Mesh();
    var room = new THREE.Group();
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load( "./resources/texture/surfaces.jpg", function ( map ) {
        var veinTex = map;
        const material = new THREE.MeshPhongMaterial( { color: 0x800000, map: veinTex } );
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
        const wall3 = new THREE.Mesh( geometry_3, material );
        const wall4 = new THREE.Mesh( geometry_3, material );
        wall3.position.set(0.0, wall_height/2 + base_height/2, -(wall_depth/2 - base_depth/2));
        wall4.position.set(0.0, wall_height/2 + base_height/2, (wall_depth/2 - base_depth/2));

        room.add(base, wall1, wall2, wall3, wall4);
        //room.translateX(100)
        room.translateY(-25);
        resolve(room);
    });
  });
  return myPromise;
}
