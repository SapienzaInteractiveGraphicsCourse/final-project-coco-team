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

export function getVirusMesh () {
  const myPromise = new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./resources/improved_models/Virus.gltf',
    function ( gltf ) {
      let scale=0.4;
      const virusMesh = gltf.scene.children.find((child) => child.name === "Body");
      virusMesh.scale.set(virusMesh.scale.x * scale, virusMesh.scale.y * scale, virusMesh.scale.z * scale);
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

export function getPlayerMesh () {
  const myPromise = new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./resources/improved_models/Player.gltf',
    function ( gltf ) {
      let scale=1.5;
      const playerMesh = gltf.scene.children.find((child) => child.name === "Body");
      playerMesh.scale.set(playerMesh.scale.x * scale, playerMesh.scale.y * scale, playerMesh.scale.z * scale);
      playerMesh.position.y += 15*scale;
      resolve(playerMesh);
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

export function getVaccineMesh () {
  const myPromise = new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./resources/improved_models/Vaccine.gltf',
    function ( gltf ) {
      let scale=1.5;
      const VaccineMesh = gltf.scene;
      VaccineMesh.scale.set(VaccineMesh.scale.x * scale, VaccineMesh.scale.y * scale, VaccineMesh.scale.z * scale);
      VaccineMesh.position.y += 40;
      resolve(VaccineMesh);
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