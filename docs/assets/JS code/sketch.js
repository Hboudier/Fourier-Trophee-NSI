const USER = 0;
const FOURIER = 1;
const PRESET = -1

let drawing3 = [];
let state = PRESET;

let x = [];
let points2 = [];
let fourierX;
let canvas;
let points;

// Le programme ne prend en compte qu'une coordonnée sur 10
const skip = 10;

let time = 0;
let path = [];
let slider;
let sel;
let button;
let user_drawing = false

let style = 'Rainbow';

// Valeur de décalage vertical pour les menu de selection 
let decal = "1150px"


function setup() {
  canvas = createCanvas(800, 600);
  canvas.parent('sketch-holder');


  x = [];
  time = 0;
  path = [];
  user_drawing = false;
  state = PRESET;

  for (let i = 0; i < pi.length; i += skip){
    const c = new Complex(pi[i][0] - 305, pi[i][1] - 296.5);
    x.push(c);
  }
  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp);


  // Crée un slider qui permet de modifier la quantité d'épicycles
  slider = createSlider(1,1000,(400));
  slider.input(updateValue);
  updateValue();
  slider.style('width', '40%');
  slider.style('position', 'absolute');
  slider.style('left', '50%');
  slider.style('top', '1100px');
  slider.style('transform', 'translateX(-50%)');

  // Crée un menu déroulant qui permet de modifier le style de l'animation
  sel = createSelect();
  sel.style('width', '11%');
  sel.style('position', 'absolute');
  sel.style('left', '38%');
  sel.style('top', decal);
  sel.style('transform', 'translateX(-50%)');
  sel.option('Finish');
  sel.option('Follow');
  sel.option('Stay');
  sel.option('Rainbow');
  sel.selected('Rainbow');
  sel.changed(change_anim);

  forme = createSelect();
  forme.style('width', '11%');
  forme.style('position', 'absolute');
  forme.style('left', '50%');
  forme.style('top', decal);
  forme.style('transform', 'translateX(-50%)');
  forme.option('Path.js file');
  forme.option('Pikachu');
  forme.option('Lfb');
  forme.option('Dove');
  forme.option('Star');
  forme.option('Serie Fourier');
  forme.option('Pi');
  forme.option('Fourier');
  forme.option('User Input');
  forme.selected('Pi'); 
  forme.changed(change_shape)

  button = createButton('Réinitialiser Chemin');
  button.style('width', '11%');
  button.style('height', '3%');
  button.mousePressed(clear_path);
  button.style('position', 'absolute');
  button.style('left', '60%');
  button.style('top', decal);

}

// Fonction qui permet de changer le style d'animation lorsque la sélection du menu déroulant est modifié
function change_anim(){
  style = sel.value();
}

// fonction qui permet de cahnger la forme
function change_shape(){

  if (forme.value() == 'Path.js file'){
    x = [];
    time = 0;
    path = [];
    user_drawing = false;
    state = PRESET;


    x_max = drawing2[0][0]
    x_min = drawing2[0][0]
    y_max = drawing2[0][1]
    y_min = drawing2[0][1]

    for (let i = 1; i < drawing2.length; i += skip){

      if(drawing2[i][0] > x_max){ x_max = drawing2[i][0]}
      if(drawing2[i][0] < x_min){ x_min = drawing2[i][0]}
      if(drawing2[i][1] > y_max){ y_max = drawing2[i][1]}
      if(drawing2[i][1] < y_min){ y_min = drawing2[i][1]}
    }


  for (let i = 0; i < drawing2.length; i += skip){
    const c = new Complex(drawing2[i][0] - ((x_max - x_min) / 2), drawing2[i][1] - ((y_max - y_min) / 2));
    x.push(c);
  }
  console.log((x_max - x_min) / 2)
  console.log((y_max - y_min) / 2)


  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp); 
  slider.elt.max = fourierX.length;
  slider.value(fourierX.length); 
  document.getElementById("sliderValue").innerHTML = slider.value();
	}

  else if (forme.value() == 'User Input'){
    x = []
    time = 0
    path = [];
    user_drawing = true
    background(51);
  }
  
  
  else if (forme.value() == 'Star'){
    x = []
    time = 0
    path = [];
    user_drawing = false;
    state = PRESET;
    for (let i = 0; i < star.length; i += skip){
      const c = new Complex((star[i].x - 50) * 1.5, (star[i].y - 50) * 1.5);
      x.push(c);
    }

    fourierX = dft(x);
    fourierX.sort((a,b) => b.amp - a.amp);
    slider.elt.max = fourierX.length;
    slider.value(fourierX.length);
    document.getElementById("sliderValue").innerHTML = slider.value(); 
}


else if (forme.value() == 'Pi'){
  x = [];
  time = 0;
  path = [];
  user_drawing = false;
  state = PRESET;

  for (let i = 0; i < pi.length; i += skip){
    const c = new Complex(pi[i][0] - 305, pi[i][1] - 296.5);
    x.push(c);
  }
  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp);
  slider.elt.max = fourierX.length;
  slider.value(fourierX.length); 
  document.getElementById("sliderValue").innerHTML = slider.value();
}


else if (forme.value() == 'Pikachu'){
  x = [];
  time = 0;
  path = [];
  user_drawing = false;
  state = PRESET;

  for (let i = 0; i < pikachu.length; i += skip){
    const c = new Complex(pikachu[i][0] - 246.5, pikachu[i][1] - 287);
    x.push(c);
  }

  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp); 
  slider.elt.max = fourierX.length;
  slider.value(fourierX.length);
  document.getElementById("sliderValue").innerHTML = slider.value();
}

else if (forme.value() == 'Serie Fourier'){
  x = [];
  time = 0;
  path = [];
  user_drawing = false;
  state = PRESET;

  for (let i = 0; i < serie_fourier.length; i += skip){
    const c = new Complex(serie_fourier[i][0] - 393, serie_fourier[i][1] - 119);
    x.push(c);
  }

  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp); 
  slider.elt.max = fourierX.length;
  slider.value(fourierX.length);
  document.getElementById("sliderValue").innerHTML = slider.value();
}

else if (forme.value() == 'Lfb'){
  x = [];
  time = 0;
  path = [];
  user_drawing = false;
  state = PRESET;

  for (let i = 0; i < lfb.length; i += skip){
    const c = new Complex(lfb[i][0] - 399.5, lfb[i][1] - 253.5);
    x.push(c);
  }


  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp); 
  slider.elt.max = fourierX.length;
  slider.value(fourierX.length);
  document.getElementById("sliderValue").innerHTML = slider.value();
}

else if (forme.value() == 'Fourier'){
  x = [];
  time = 0;
  path = [];
  user_drawing = false;
  state = PRESET;


for (let i = 0; i < fourier.length; i += skip){
  const c = new Complex(fourier[i][0] - 219.5, fourier[i][1] - 284.5);
  x.push(c);
}

fourierX = dft(x);
fourierX.sort((a,b) => b.amp - a.amp); 
slider.elt.max = fourierX.length;
slider.value(fourierX.length); 
document.getElementById("sliderValue").innerHTML = slider.value();
}

if (forme.value() == 'Dove'){
  x = [];
  time = 0;
  path = [];
  user_drawing = false;
  state = PRESET;

for (let i = 0; i < dove.length; i += skip){
  const c = new Complex(dove[i][0] - 234.5, dove[i][1] - 270);
  x.push(c);
}


fourierX = dft(x);
fourierX.sort((a,b) => b.amp - a.amp); 
slider.elt.max = fourierX.length;
slider.value(fourierX.length); 
document.getElementById("sliderValue").innerHTML = slider.value();
}




}

// Fonction qui permet de réinitialiser le chemin
function clear_path() {
  time = 0;
  path = [];
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



    // afin d'éviter d'utiliser trop de puissance de calcul lors du tracé 
    // le nombre d'épicycle tracé sur la canvas est limité à 80 
    // Le chemin tracé ne suit pas cette limite donc monter au dela de 80 épicycles améliore la qualité de l'image
    if(i <=80){
    strokeWeight(2)
    colorMode(RGB)
    stroke(255, 0, 255, 255);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255, 0, 255, 255);
    line(prevx,prevy,x,y);
    }
  } 
  return createVector(x, y);
  
}
// Draw avec la bobliothèque p5 est une boucle qui se répète
function draw() {
  if (state == USER && user_drawing) {
    background(51);
      let point = createVector(mouseX - width / 2, mouseY - height / 2);
      drawing3.push(point);
      stroke(255);
      noFill();
      beginShape();
      for (let v of drawing3) {
        vertex(v.x + width / 2, v.y + height / 2);
      }
      endShape();
    }


  if (state != USER ) {
  background(0);
  // Utilise la fonction épicycles pour tracer les épicycles nécessaires
  let v = epicycles(width / 2, height / 2, 0, fourierX);
  if (slider.elt.max != fourierX.length){
    slider.elt.max = fourierX.length
  }

  path.unshift(v);
  // Trace le chemin parcouru qui change de couleur si 'Rainbow' est choisi 
  strokeWeight(2)
  if (style == 'Rainbow'){
    let hu = 0;
    beginShape();
    colorMode(HSB);
    noFill();
  
    for(let i = 0; i <path.length; i++){
      stroke(hu, 255, 255);
      vertex(path[i].x, path[i].y);
      hu +=  1;
      if (hu > 255) {
        hu = 0;
      }
    }
    endShape();
  }
  // Trace le chemin parcouru en Blanc si 'Rainbow' n'est pas choisi
  else {
    beginShape();
    colorMode(RGB);
    noFill();
  
    for(let i = 0; i <path.length; i++){
      stroke(255);
      vertex(path[i].x, path[i].y);
    }
    endShape();
  }
  // Fait avancer le "temps"
  const dt = TWO_PI / fourierX.length;
  time += dt;
  
// Réinitialise le dessin quand il est fini
if (style == 'Finish' ){
  if (time > TWO_PI) {
    time = 0;
    path = [];
  }
}


if (style == 'Rainbow' ){
  if (path.length > fourierX.length * 1.1) {
    path.pop();
  }
}


if (style == 'Stay' ){
  if (path.length > fourierX.length * 1.1) {
    path.pop();
  }
}

if (style == 'Follow' ){
  if (time > TWO_PI) {
    time = 0;
    while (path.length > fourierX.length * 0.97){
      path.pop()
    }
  }
  if (path.length > fourierX.length * 0.97) {
    path.pop();
  }
}

}

}

function mousePressed() {
  if (user_drawing && keyIsDown(SHIFT)){
    
    state = USER;
    drawing3 = [];
    x = [];
    time = 0;
    path = [];
  }
}

function mouseReleased() {
  if (user_drawing && state == USER){
  state = FOURIER;
  for (let i = 0; i < drawing3.length; i ++) {
    x.push(new Complex(drawing3[i].x, drawing3[i].y));
  }
  fourierX = dft(x);
  fourierX.sort((a, b) => b.amp - a.amp);
  slider.elt.max = fourierX.length
  slider.value(fourierX.length);
  updateValue()
  }
}



function updateValue(){
  document.getElementById("sliderValue").innerHTML = slider.value();
}

