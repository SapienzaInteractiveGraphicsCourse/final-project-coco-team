export function init(){
  var enabled={
    "q":false,
    "w":false,
    "e":false,
    "a":false,
    "s":false,
    "d":false,
    "esc":false,
    "r":0,
    "l":false
  };
  return enabled;
}
export function keypressedAgent(event,enabled) {
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
      if (enabled[event.key]) stato=2;
      else {
        stato=1;
        end_time= new Date().getTime() + time_remaining;
      }
      break;
    case 'r':
      enabled[event.key]++;
      if (enabled[event.key]==3) enabled[event.key] = 0;
      break;
    case 'l':
      enabled[event.key]=true;
      break;
  }
  return enabled;
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
  }
  return enabled;
}