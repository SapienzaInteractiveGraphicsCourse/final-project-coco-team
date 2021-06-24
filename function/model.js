import * as THREE from 'https://threejs.org/build/three.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejs.org/examples/jsm/loaders/MTLLoader.js';

export function getSyringeMesh () {
  const myPromise = new Promise((resolve, reject) => {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.load('./resources/models/materials.mtl',
    function(mtl) {
      mtl.preload();
      objLoader.setMaterials(mtl);
      objLoader.load('./resources/models/Syringe.obj',
      function (root){
        root.scale.x=200;
        root.scale.y=200;
        root.scale.z=200;
        resolve(root);
      },
      function ( xhr ) {
      },
      function ( error ) {
        reject(error);
      });
    },
    function ( xhr ) {
    },
    function ( error ) {
      reject(error);
    });
  });
  return myPromise;
}

export function getVirusMesh () {
  const myPromise = new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./resources/models/virus.glb',
    function ( gltf ) {
      const virusMesh = gltf.scene.children.find((child) => child.name === "virus");
      virusMesh.scale.set(virusMesh.scale.x * 0.4, virusMesh.scale.y * 0.4, virusMesh.scale.z * 0.4);
      var textureLoader = new THREE.TextureLoader();
      textureLoader.load( "./resources/models/Texture.png", function ( map ) {
          virusMesh.material.map = map;
          virusMesh.material.map.encoding = THREE.sRGBEncoding;
          virusMesh.material.map.flipY = false;
          virusMesh.material.needsUpdate = true;
      });
      virusMesh.position.y = virusMesh.scale.y;
      virusMesh.rotation.y = Math.PI/2;

      virusMesh.geometry.computeBoundingBox();
      resolve(virusMesh);
    },
    function ( xhr ) {
    },
    function ( error ) {
      console.log( 'An error happened' );
      reject(error);
    });
  });
  return myPromise;
}

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

export function getFont (){
  const myPromise = new Promise((resolve, reject) => {
    var fontLoader = new THREE.FontLoader();
    fontLoader.load( 'https://threejs.org/examples/fonts/gentilis_regular.typeface.json',
    function (font) {
      resolve(font);
    },
    function ( xhr ) {
    },
    function ( error ) {
      reject(error);
    });
  });
  return myPromise;
}

export function getVirusMesh2 () {
  const myPromise = new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./resources/improved_models/Virus.gltf',
    function ( gltf ) {
      const virusMesh = gltf.scene.children.find((child) => child.name === "Body");
      virusMesh.scale.set(virusMesh.scale.x * 0.4, virusMesh.scale.y * 0.4, virusMesh.scale.z * 0.4);
      virusMesh.position.y = 60;
      virusMesh.rotation.y = Math.PI/2;
      resolve(virusMesh);
    },
    function ( xhr ) {
    },
    function ( error ) {
      console.log( 'An error happened' );
      reject(error);
    });
  });
  return myPromise;
}