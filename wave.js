
const canvas = document.getElementById("canvas");

canvas.width = 1000;
canvas.height = 300;

let ctx_canvas = canvas.getContext("2d");

ctx_canvas.clearRect(0, 0, canvas.width, canvas.height);



window.AudioContext = window.AudioContext || window.webkitAudioContext;


let freq =440;
let vol = 0.1;
var ctx = new AudioContext();
var play_ = false;
let now;
let first = true;

var osc = ctx.createOscillator();
var osc_fake = ctx.createOscillator()
var vca_fake = ctx.createGain();
var analyser = ctx.createAnalyser();
var vca = ctx.createGain();

osc.frequency.value = freq;
osc.type = "sine";
vca.gain.value = vol;


osc_fake.frequency.value = freq;
osc_fake.type = "sine";
vca_fake.gain.value = vol*2;

osc_fake.connect(vca_fake);

osc.connect(vca);





vca_fake.connect(analyser);
vca.connect(ctx.destination);


analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount; 
var dataArray = new Uint8Array(bufferLength);



function draw() {

let drawVisual = requestAnimationFrame(draw);
analyser.getByteTimeDomainData(dataArray);
ctx_canvas.fillStyle = 'rgb(200, 200, 200)';
ctx_canvas.fillRect(0,0, canvas.width, canvas.height);






ctx_canvas.lineWidth = 2;
    ctx_canvas.strokeStyle = 'rgb(0, 0, 0)';

   ctx_canvas.beginPath();

   var sliceWidth = canvas.width * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
   
   var v = dataArray[i] / 128.0;


   var y = v * canvas.height/2;


   if(i === 0) {
     ctx_canvas.moveTo(x, y);
   } else {
     ctx_canvas.lineTo(x, y);
   }

   x += sliceWidth;
 };


 
      ctx_canvas.stroke();
     ctx_canvas.fillStyle="black"

      ctx_canvas.font = '28px serif';
 if(play_) ctx_canvas.fillText(freq_txt + " Hz", 20, 30);

}

draw();

function playOsc(){

    play_ = !play_;
    now = ctx.currentTime;
    if(play_){
if(first){ osc.start(now); osc_fake.start(now); first = false;}
else{vca.gain.setValueAtTime(vol, now); vca_fake.gain.setValueAtTime(vol*2, now)}
document.getElementById('play').innerText ="Stop";
}
else{
    now = ctx.currentTime;
vca.gain.setValueAtTime(0, now);
vca_fake.gain.setValueAtTime(0,now);
document.getElementById('play').innerText ="Play";
}

}

var freq_txt =440 ;

function changeFreq(val){

   now = ctx.currentTime;

   console.log(val)

   osc.frequency.setValueAtTime(val, now)
   osc_fake.frequency.setValueAtTime(val,now);
   freq_txt = val;
}


function changeVol(val){

    now = ctx.currentTime;
vol = val/100;

if(vol ==0) vol = 0.000001;


console.log(vol);
vca_fake.gain.setValueAtTime(vol*2,now);
vca.gain.linearRampToValueAtTime(vol, now);


}


function changeWave(val){
    osc.type = val;
    osc_fake.type = val;

    console.log(val)
}




