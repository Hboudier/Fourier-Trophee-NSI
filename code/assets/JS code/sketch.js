let x = [];
let fourierX;
let canvas;

let time = 0;
let path = [];
let slider;

function setup() {
  canvas = createCanvas(800, 600);
  // Le programme ne prend en compte qu'une coordonnée sur 10
  const skip = 10;
  // Effectue la tranformation de Fourier sur les coordonnées du fichier "codingtrain.js"
  for (let i = 0; i < drawing.length; i += skip){
    // const c = new Complex(drawing2[i][0], drawing2[i][1]);
    const c = new Complex(drawing[i].x, drawing[i].y);
    x.push(c);
  }
  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp);
  slider = createSlider(1,1000,250);
  slider.input(updateValue);
  updateValue();
  slider.style('width', '40%');
  slider.style('position', 'absolute');
  slider.style('left', '70.5%');
  slider.style('top', '73%');
  slider.style('transform', 'translateX(-50%)');

  
}
// Fonction qui créer les épicicles à partir des valeurs données par la transformation de fourier
function epicycles(x, y, rotation, fourier) {
  for (let i = 0; i< slider.value() && i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
    line(prevx,prevy,x,y);
  } 
  return createVector(x, y);
  
}
// Draw avec la bobliothèque p5 est une boucle qui se répète
function draw() {
  background(0);
  // Utilise la fonction épicycles pour tracer les épicycles nécessaires
  let v = epicycles(width / 2, height / 2, 0, fourierX);
  if (slider.elt.max != fourierX.length){
    slider.elt.max = fourierX.length
  }

  path.unshift(v);
  // Trace le chemin parcouru
  beginShape();
  noFill();
  for(let i = 0; i <path.length; i++){
    vertex(path[i].x, path[i].y);
  }
  endShape();
  // Fait avancer le "temps"
  const dt = TWO_PI / fourierX.length;
  time += dt;
  
  if (path.length > fourierX.length * 0.95) {
      path.pop();
  }
  
}

function updateValue(){
  document.getElementById("sliderValue").innerHTML = slider.value();
}