// Data variable
var albums;

// The midi notes of a scale
var notes = [ 60, 62, 64, 65, 67, 69, 71];

// For automatically playing the song
var index = 0;
var song = [ 
  { note: 4, duration: 400, display: "D" },  
  { note: 0, duration: 200, display: "G" },  
  { note: 1, duration: 200, display: "A" },  
  { note: 2, duration: 200, display: "B" }, 
  { note: 3, duration: 200, display: "C" },  
  { note: 4, duration: 400, display: "D" },  
  { note: 0, duration: 400, display: "G" },  
  { note: 0, duration: 400, display: "G" }
];

var trigger = 0;
var autoplay = true;
var osc;

function preload() {
  var url = 'data/prince_albums.csv';
  albums = loadTable(url, "csv", "header");
}

function setup() {
  console.log(albums);
  
  //count the columns
  print(albums.getRowCount() + " total rows in table");
  print(albums.getColumnCount() + " total columns in table");

  print(albums.getColumn("name"));

  // US chart positions: 163 -> 1
  
  //cycle through the table
  for (var r = 0; r < albums.getRowCount(); r++)
    for (var c = 0; c < albums.getColumnCount(); c++) {
      print(albums.getString(r, c));
    }
    
  // A triangle oscillator
  osc = new p5.TriOsc();
  // Start silent
  osc.start();
  osc.amp(0);
    
}

// A function to play a note
function playNote(note, duration) {
  osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5,0.2);
  
  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0,0.2);
    }, duration-50);
  }
}


function draw() {
  // If we are autoplaying and it's time for the next note
  if (autoplay && millis() > trigger){
    //playNote(notes[albums[index].note], albums[index].duration);
    
    playNote(notes[index % 7], 400);

    trigger = millis() + 400// albums[index].duration;
    // Move to the next note
    index++;
  // We're at the end, stop autoplaying.
  } else if (index >= albums.getRowCount()) {
    autoplay = false;
    osc.start()
  }
}