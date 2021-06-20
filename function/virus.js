import * as THREE from 'https://threejs.org/build/three.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

export function getVirusMesh () {
  const myPromise = new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./model/virus.glb',
    function ( gltf ) {
      const virusMesh = gltf.scene.children.find((child) => child.name === "virus");
      virusMesh.scale.set(virusMesh.scale.x * 0.4, virusMesh.scale.y * 0.4, virusMesh.scale.z * 0.4);
      var textureLoader = new THREE.TextureLoader();
      textureLoader.load( "./model/Texture.png", function ( map ) {
          virusMesh.material.map = map;
          virusMesh.material.map.encoding = THREE.sRGBEncoding;
          virusMesh.material.map.flipY = false;
          virusMesh.material.needsUpdate = true;
      });
      virusMesh.position.y = virusMesh.scale.y;
      virusMesh.rotation.y = -80;

      virusMesh.geometry.computeBoundingBox();
      console.log(virusMesh.geometry.boundingBox);
      resolve(virusMesh);
    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
      console.log( 'An error happened' );
      reject(error);
    });
  });
  return myPromise;
}