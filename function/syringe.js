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