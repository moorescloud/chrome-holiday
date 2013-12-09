/* Do some fun stuff with Javascript via UDP
   Eventually we will implement the SecretAPI here.  Eventually. */

// Constructor method for the holiday using SecretAPI
// Requires a string 'address' (i.e. IP address 192.168.0.20) or resolvable name (i.e. 'light.local')
//
function Holiday(address) {
  this.address = address;
  console.log("Address set to ", this.address)
  
  this.NUM_GLOBES = 50;
  this.FRAME_SIZE = 160;      // Secret API rame size
  this.FRAME_IGNORE = 10;     // Ignore the first 10 bytes of frame

  this.setglobe = setglobe;
  this.getglobe = getglobe;
  this.render = render;

  var globes = new Uint8Array(160);
  this.globes = globes;
  console.log('Array created');

  // Fill the header of the array with zeroes
  for (i=0; i < this.FRAME_IGNORE; i++) {
    this.globes[i] = 0x00;
  }

  /*[ [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ],
  [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ], [ 0x00, 0x00, 0x00 ] ];*/
 
  function setglobe(globenum, r, g, b) {
    // Sets a globe's color
    if ((globenum < 0) || (globenum >= this.NUM_GLOBES)) {
      return;
    }

    baseptr = this.FRAME_IGNORE + 3*globenum;
    globes[baseptr] = r;
    globes[baseptr+1] = g;
    globes[baseptr+2] = b; 

    return;
  }

  function getglobe() {
    // Sets a globe's color
    if ((globenum < 0) || (globenum >= this.NUM_GLOBES)) {
      return;
    }

    baseptr = this.FRAME_IGNORE + 3*globenum;
    r = globes[baseptr];
    g = globes[baseptr+1];
    b = globes[baseptr+2];
    return [r,g,b];
  }


  function render() {
    console.log("Holiday.render");
    var locaddr = this.address;
    chrome.socket.create('udp', {},
     function(socketInfo) {
       // The socket is created, now we want to connect to the service
       var socketId = socketInfo.socketId;
       chrome.socket.connect(socketId, locaddr, 9988, function(result) {
         // We are now connected to the socket so send it some data
         chrome.socket.write(socketId, globes.buffer,
           function(sendInfo) {
             console.log("wrote " + sendInfo.bytesWritten);
           }
         );
       });
     }
    );
  }

}

// OK, instance the Holiday
var hol = new Holiday("192.168.0.119");
var counter = null;

function randcv() { 
  return Math.floor((Math.random()*255)+1); 
}

function allcolors() {
  var c = [0, 0, 0];
  for (var j = 0; j < hol.NUM_GLOBES; j++ ) {
    c[0] = randcv();
    c[1] = randcv();
    c[2] = randcv();
    var index = Math.floor((Math.random()*2)+1);
    c[index] = 0;
    hol.setglobe(j, c[0], c[1], c[2]);
  }
  hol.render();
}

// Start Demo 
function demoStart() {
  
  console.log("demoStart");
  counter = setInterval(allcolors, 500); // run every 500 msec
  return;

}
  
// Stop Demo 
function demoStop() {
  
  //
  // Insert IoTAS Code
  //
  console.log("demoStop");
  clearInterval(counter);
  counter = null;
  return;
  
}

demoStart();