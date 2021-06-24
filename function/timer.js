export function setTimer(minutes, seconds){
  var countDownDate = new Date().getTime() + minutes*60*1000 + seconds*1000;
  var the_end = false;
  // Update the count down every 1 second
  var x = setInterval(function() {

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for minutes and seconds
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      document.getElementById("timer").innerHTML = "Remaining time: <br /><br />" + minutes + "m " + seconds + "s ";

      // If the count down is over, write some text
      if (distance < 0) {
        //clearInterval(x);
        document.getElementById("timer").innerHTML = "VIRUS INFECTION BEGUN!!";
        //the_end = true;
      }
  }, 1000);
  return the_end;
}
