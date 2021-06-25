import * as THREE from 'https://threejs.org/build/three.module.js';

export function spreadingObj(nObject, objectMesh, noPlayingField){
  var objectsArray = [];
  // Create an array of syringes
  for(var i = 0; i<nObject; i++){
    objectsArray.push(objectMesh.clone());
  }

  // Spread syringes giving different coordinates looking at the forbidden ones
  for(var i = 0; i<nObject; ){
    var max = 500; //500 because the outsider room is 1000x1000
    var min = -500;
    var x = Math.random() * (max - min) + min;
    var z = Math.random() * (max - min) + min;
    var values_ok;
    for(var j = 0; j<noPlayingField.length; j++){
      var x_in = noPlayingField[j]['x_min'] <= x && x <= noPlayingField[j]['x_max'];  //x coordinates inside the obstacle
      var z_in = noPlayingField[j]['z_min'] <= z && z <= noPlayingField[j]['z_max'];  //z coordinates inside the obstacle
      if(!(x_in && z_in)){  //x and z outside the obstacle
        values_ok = true;// DEVO CONTROLLARE SE è ANCHE FUORI AGLI ALTRI OSTACOLI
      }
      else{
        values_ok = false;
        break;
      }
    }
    if(values_ok){  //vuol dire che è fuori a tutti gli ostacoli
      objectsArray[i].position.set(x,55,z); //accetto questi valori e inserisco una siringa li
      objectsArray[i].rotation.set(Math.PI/6,0,Math.PI/6);
      i++; //passo alla siringa successiva
    }
    else{
      //vuol dire che ho trovato un ostacolo in cui cadrebbe la siringa e quindi non posso accettare quei valori
      //devo rigenerare altri due valori per inserire la siringa
    }
  }
  return objectsArray;
}

export function interactionPlayerObject(objectsArray, playerX, playerZ, aliveObjects){
  var maxDistance = 20;
  for(var i = 0; i<objectsArray.length; i++){
    if(objectsArray[i].visible == true){
      var distance = (playerX-objectsArray[i].position.x)**2 + (playerZ-objectsArray[i].position.z)**2; //I compute the distance squared because it is slightly more efficient to calculate.
      if(distance<maxDistance*maxDistance){
        objectsArray[i].visible = false;
        aliveObjects = aliveObjects-1;
        //console.log("Remaining syringes: ",aliveObjects);
      }
    }
  }
  return aliveObjects;
}

export function spinObjects(Array){
  for (let x=0;x<Array.length;x++){
    let rotationEuler = new THREE.Euler( 0, Math.PI/25, 0, 'XYZ' );
    let rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromEuler(rotationEuler);
    Array[x].applyQuaternion(rotationQuaternion);
  }
}