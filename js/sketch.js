// Data variable
var dataSource, times;
var totalRegister = 0;
var data = {}

// sound
var _play = true;
var sounds = null;
var measure_index = 0;

// ========================================
// data
// ========================================

function getUniqueTimes(timeColumn) {
  var u = {}, a = [];
  for(var i = 0, l = timeColumn.length; i < l; ++i){
    if(u.hasOwnProperty(timeColumn[i])) {continue}
    a.push(timeColumn[i]);
    u[timeColumn[i]] = 1;
  }
  return a;
}

// ========================================
// music
// =========================================

function playControl() {
  return _play;
}

// ========================================
// p5
// ========================================
function preload() {
  var url = 'data/router-data.csv';
  dataSource = loadTable(url, "csv", "header");

  // setup audio
  Tone.Transport.bpm.value = 120;  
  Tone.Transport.start();

  sounds = new Tone.PolySynth(4, Tone.Sampler, {
    "hh"   : "assets/sounds/hh.mp3",
    "hho"  : "assets/sounds/hho.mp3",
    "Drums1"  : "assets/sounds/1xDrums.mp3",
    "Status1" : "assets/sounds/1xStatus01.mp3",
    "Status2" : "assets/sounds/1xStatus02.mp3",
    "Status3" : "assets/sounds/1xStatus03.mp3",
    "Status4" : "assets/sounds/1xStatus04.mp3",
  }, {
    "volume" : -10,
  }).toMaster();
}

function playMeasure(argument) {

  measure_index = Tone.Transport.position.split(":")[0]

  _data = dataSource.getRow(measure_index);
  var statusRequests     = _data.getNum("statusRequests");
  var registerRequests   = _data.getNum("registerRequests");
  var okResponse         = _data.getNum("okResponse");
  var rejectedResponse   = _data.getNum("rejectedResponse");
  var accessDenyResponse = _data.getNum("accessDenyResponse");
  var processTime        = _data.getNum("processTime");
  console.log(measure_index + ": " + statusRequests + ", " + registerRequests + ", " + okResponse + ", " + rejectedResponse + ", " + accessDenyResponse + ", " + processTime)

  sounds.triggerAttackRelease(["Drums1"], "1m", "@1m");

  switch(measure_index % 4) {
    case 0:
      sounds.triggerAttackRelease(["Status1"], "1m", "@1m");
      break;
    case 1:
      sounds.triggerAttackRelease(["Status2"], "1m", "@1m");
      break;
    case 2:
      sounds.triggerAttackRelease(["Status3"], "1m", "@1m");
      break;
    case 3:
      sounds.triggerAttackRelease(["Status4"], "1m", "@1m");
      break;
  }
}

function setup() {  
}

function draw() {
  // If we are playControling and it's time for the next note
  if (playControl()) {
    Tone.Transport.scheduleRepeat(playMeasure, 2);
    _play = false;

    measure_index++;

  // We're at the end, stop playControling.
  } else {
  }
}