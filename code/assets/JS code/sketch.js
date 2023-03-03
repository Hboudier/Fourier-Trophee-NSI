// La fonciton pour changer l'ordre des épicycles ne fonctionne pas 


const USER = 0;
const FOURIER = 1;
let state = -1;

let list_x = [];
let list_y = [];
let x = [];
let points2 = [];
let fourierX;
let canvas;
let points;
const skip = 10;

let drawing3 = []
let time = 0;
let path = [];
let slider;
let sel;
let user_drawing = false

let style = 'Rainbow';


function setup() {
  canvas = createCanvas(800, 600);

  // Le programme ne prend en compte qu'une coordonnée sur 10
  // Effectue la tranformation de Fourier sur les coordonnées du fichier "codingtrain.js"
  x_max = drawing[0].x
  x_min = drawing[0].x
  y_max = drawing[0].y
  y_min = drawing[0].y
  for (let i = 0; i < drawing.length; i += skip){
    // const c = new Complex(drawing2[i][0], drawing2[i][1]);
    const c = new Complex(drawing[i].x, drawing[i].y);
    x.push(c);
    // if(drawing[i].x > x_max){ x_max = drawing[i].x}
    // if(drawing[i].x < x_min){ x_min = drawing[i].x}
    // if(drawing[i].y > y_max){ y_max = drawing[i].y}
    // if(drawing[i].y < y_min){ y_min = drawing[i].y}
  }
  

  // console.log(x_max);
  // console.log(x_min);
  // console.log(y_max);
  // console.log(y_min);

  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp);


  // Crée un slider qui permet de modifier la quantité d'épicycles
  slider = createSlider(1,1000,250);
  slider.input(updateValue);
  updateValue();
  slider.style('width', '40%');
  slider.style('position', 'absolute');
  slider.style('left', '50%');
  slider.style('top', '73%');
  slider.style('transform', 'translateX(-50%)');

  // Crée un menu déroulant qui permet de modifier le style de l'animation
  sel = createSelect();
  sel.style('width', '20%');
  sel.style('position', 'absolute');
  sel.style('left', '40%');
  sel.style('top', '80%');
  sel.style('transform', 'translateX(-50%)');
  sel.option('Finish');
  sel.option('Follow');
  sel.option('Stay');
  sel.option('Rainbow');
  sel.selected('Rainbow');
  sel.changed(change_anim);

  forme = createSelect();
  forme.style('width', '19%');
  forme.style('position', 'absolute');
  forme.style('left', '60%');
  forme.style('top', '80%');
  forme.style('transform', 'translateX(-50%)');
  forme.option('Custom');
  forme.option('Train');
  forme.selected('Train');
  forme.changed(change_shape)
}

// Fonction qui permet de changer le style d'animation lorsque la sélection du menu déroulant est modifié
function change_anim(){
  style = sel.value();
}

function change_shape(){

  if (forme.value() == 'Train'){
    x = []
    time = 0
    // user_drawing = false
    for (let i = 0; i < drawing.length; i += skip){
      // const c = new Complex(drawing2[i][0], drawing2[i][1]);
      const c = new Complex(drawing[i].x, drawing[i].y);
      x.push(c);

    }
    fourierX = dft(x);
    fourierX.sort((a,b) => b.amp - a.amp);
  }

  if (forme.value() == 'Custom'){
		background(51);
		user_drawing = true;
	}
  // console.log(user_drawing)
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

    strokeWeight(2)
    colorMode(RGB)
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
  if (state == USER && user_drawing == true) {
    let point = createVector(mouseX - width / 2, mouseY - height / 2);
    drawing3.push(point);
    console.log(drawing3)
    stroke(255);
    noFill();
    beginShape();
    for (let v of drawing3) {
      vertex(v.x + width / 2, v.y + height / 2);
    }
    endShape();
  } else if (state == FOURIER && user_drawing == true) {
    let vx = epiCycles(width / 2, 100, 0, fourierX);
    let vy = epiCycles(100, height / 2, HALF_PI, fourierY);
    let v = createVector(vx.x, vy.y);
    path.unshift(v);
    line(vx.x, vx.y, v.x, v.y);
    line(vy.x, vy.y, v.x, v.y);

    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();
  }


  if (!user_drawing) {
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

function updateValue(){
  document.getElementById("sliderValue").innerHTML = slider.value();
}

function mousePressed() {
  if (user_drawing == true){
    state = USER;
    drawing3 = [];
    x = [];
    y = [];
    time = 0;
    path = [];
  }
}

function mouseReleased() {
  if (user_drawing == true){
    state = FOURIER;
    const skip = 1;
    for (let i = 0; i < drawing3.length; i += skip) {
      const c = new Complex(drawing3[i].x, drawing3[i].y);
      x.push(c);
    }
    fourierX = dft(x);
    console.log(fourierX)
    fourierX.sort((a, b) => b.amp - a.amp);
  }
}









// function mousePressed() {
// 	if ((forme.value() == 'Custom') && ((mouseX < width) && (mouseY < height))) {
// 		background(51);
// 		user_drawing = true;
// 		points = [];
// 	}
// }


// function mouseDragged() {
// 	if ((forme.value() == 'Custom') && ((mouseX < width) && (mouseY < height))) {
// 		noFill();
// 		stroke(255, 0, 0);
// 		strokeWeight(4);
// 		line(pmouseX, pmouseY, mouseX, mouseY);
// 	  points.unshift([mouseX - width/2, mouseY - height/2]);
//     // points.unshift([mouseX, mouseY]);
// 	}
// }


// function mouseReleased() {
//   points2 = []
// 	if ((forme.value() == 'Custom') && ((mouseX < width) && (mouseY < height))) {
//     for (let i = 0; i < points.length; i += skip){
//       const c = new Complex(points[i][0], drawing[i][1]);
//       points2.push(c);
//     }
// 		user_drawing = false;
// 		path = [];
// 		fourierX = dft(points2);
//     console.log(dft(points2))
//     fourierX.sort((a,b) => b.amp - a.amp);
// 		time = 0;
//     console.log(fourierX)
// 	}

