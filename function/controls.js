import * as interaction from "./interactionObj.js";

export function init(){
  var enabled={
    "q":false,
    "w":false,
    "e":false,
    "a":false,
    "s":false,
    "d":false,
    "escape":false,
    "r":1,
    "l":false,
    "z":false,
    "old":1,
    "scale":2,
    "stato":0
  };
  return enabled;
}
export function keypressedAgent(event,enabled,end_time,time_remaining,virus,playerX,playerZ,countVirusAlive,countVaccinesAlive,vaccines,remainingLive,countMasksAlive,masks,AmbientSound) {
  switch(event.key) {
    case 'q':
      enabled[event.key]=true;
      break;
    case 'w':
      enabled[event.key]=true;
      break;
    case 'e':
      enabled[event.key]=true;
      break;
    case 'a':
      enabled[event.key]=true;
      break;
    case 's':
      enabled[event.key]=true;
      break;
    case 'd':
      enabled[event.key]=true;
      break;
    case 'Escape':
      enabled[event.key]=!enabled[event.key];
      if (enabled[event.key]) {
        AmbientSound.pause();
        enabled.old=enabled.stato;
        enabled.stato=3;
      }
      else {
        AmbientSound.play();
         enabled.stato=enabled.old;
        end_time= new Date().getTime() + time_remaining;
      }
      break;
    case 'r':
      enabled[event.key]++;
      if (enabled[event.key]==2) enabled[event.key] = 0;
      break;
    case 'l':
      enabled[event.key]=true;
      break;
    case 'z':
      enabled[event.key]=true;
      if(vaccines.length - countVaccinesAlive > 0){
        //console.log("sono qui");
        countVirusAlive = interaction.interactionPlayerObject(virus, playerX, playerZ, countVirusAlive,70);
        countVaccinesAlive = interaction.vaccineVirus(countVaccinesAlive, vaccines);
      }
      break;
    case 'x':
      enabled[event.key]=true;
      break;
    case 'c':
      enabled[event.key]=true;
      break;
  }
  return [enabled,end_time,countVirusAlive,countVaccinesAlive,countMasksAlive,remainingLive];
}

export function keyreleasedAgent(event,enabled) {
  switch(event.key) {
    case 'q':
      enabled[event.key]=false;
      break;
    case 'w':
      enabled[event.key]=false;
      break;
    case 'e':
      enabled[event.key]=false;
      break;
    case 'a':
      enabled[event.key]=false;
      break;
    case 's':
      enabled[event.key]=false;
      break;
    case 'd':
      enabled[event.key]=false;
      break;
    case 'l':
      enabled[event.key]=false;
      break;
    case 'z':
      enabled[event.key]=false;
      break;
    case 'x':
      enabled[event.key]=false;
      break;
    case 'c':
      enabled[event.key]=false;
      break;
  }
  return enabled;
}
