/*** CONTROLS ***/
let step = 200;
let interval = 400;

//set to true for colors
let colour = 0;

//set to true for second Matrix
let secondMatrix = 0;


//Initialization
let elapsedTime = 0;
let k = 0;
let z = 0;
let gridEl;
let grid = [];
let standard = false;
let count = 0;

//Init 2
let step2 = step/2;
let gridEl2;
let grid2 = [];

let coloursArray = ["blue", "red", "black", "blue", "red"];

function colourSettingChanged() {
  if (colourCheckbox.checked()) {
    colour = 1;
  } else {
    colour = 0;
  }
}

function secondMatrixSettingChanged() {
  if (secondMatrixCheckbox.checked()) {
    secondMatrix = 1;
  } else {
    secondMatrix = 0;
  }
}

function playSynth() {
  userStartAudio();

  let note;
  if (colour){
    note = random(['Fb4', 'G3', 'A4', 'B4']);
  } else{
    note = random(['Fb2', 'G3', 'A4']);
  }
  
  // note velocity (volume, from 0 to 1)
  let velocity = 0.5;
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = random([1/12, 1/4, 1/8]);

  monoSynth.play(note, velocity, time, dur);
}

function setup() {
  let cnv = createCanvas(400, 400);
  cnv.mousePressed(playSynth);
  colourCheckbox = createCheckbox('color', false);
  colourCheckbox.changed(colourSettingChanged);
  
  secondMatrixCheckbox = createCheckbox('second Layer', false);
  secondMatrixCheckbox.changed(secondMatrixSettingChanged);
  
  monoSynth = new p5.MonoSynth();
  
  //Build matrix
  for (let i = 0; i*step <= width; i += 1) {
    grid.push([]);
    for (let j = 0; j*step <= height; j += 1) {
      gridEl = new GridElement(i*step,j*step,step, random() < 0.5, "big");
      grid[i].push(gridEl);
    }
  }
  
  //Build matrix 2
    for (let i = 0; i*step2 <= width; i += 1) {
      grid2.push([]);
      for (let j = 0; j*step2 <= height; j += 1) {
        gridEl2 = new GridElement(i*step2,j*step2,step2, random() < 0.5, "small", "grey");
        grid2[i].push(gridEl2);
      }
    }
}

function draw() {
  background(0);
  
  elapsedTime += deltaTime;
  
  if (elapsedTime >= interval) {
    
    if(standard){
      playSynth() 
      for (let i = 0; i*step <= width; i += 1) {
        for (let j = 0; j*step <= height; j += 1) {
          
          if (random() >= 0.5){
          grid[i][j].fromLeftToRight = true;
          } else {
          grid[i][j].fromLeftToRight = false;
          }
        }
      }
      if (secondMatrix){
        for (let i = 0; i*step2 <= width; i += 1) {
          for (let j = 0; j*step2 <= height; j += 1) {

            if (random() >= 0.5){
            grid2[i][j].fromLeftToRight = true;
            } else {
            grid2[i][j].fromLeftToRight = false;
            }
          }
        }
      }
      
      count++;
      if (count == 5){
        count = 0;
        standard = false;
        interval = 200;
      }
    } else {
      playSynth() 
      grid[k][z].fromLeftToRight = !grid[k][z].fromLeftToRight
      if (colour){
        grid[k][z].colour = random(coloursArray)
        } else {
          grid[k][z].colour = "white";
        }
      if ((k+1)*step < width){k+=1}else{k = 0; z+=1}
      if(z*step >= height){
        z = 0;
        backToStandard();}
    }
    
    elapsedTime = 0;
  }
  
  //draw lines
  if(secondMatrix){
    for (let i = 0; i*step2 <= width; i += 1) {
    for (let j = 0; j*step2 <= height; j += 1) {
      grid2[i][j].drawLine();
    }
  }
  }
  
  for (let i = 0; i*step <= width; i += 1) {
    for (let j = 0; j*step <= height; j += 1) {
      grid[i][j].drawLine();
    }
  }
  
}

function backToStandard(){
  interval = 800;
  standard = true;
}

class GridElement {
 
  constructor(x, y, step, LR, size, colour = "white") {
    this.x = x;
    this.y = y;
    this.step = step;
    this.fromLeftToRight = LR;
    this.colour = colour;
    this.size = size;
  }
  
  drawLine(){
    
    //Line color
    if (this.colour == "white"){
        stroke(255,255,255);
      } else if (this.colour == "red"){
        stroke(255,0,0);
      }else if (this.colour == "blue"){
        stroke(0,0,255);
      }else if (this.colour == "black"){
        stroke(0,0,0,0);
      } else if (this.colour == "grey"){
        stroke(120,120,120);
      } 
    
    //Line type
    if (this.fromLeftToRight == true){
      if (this.size == "small"){
        strokeWeight(1)
      } else strokeWeight(2)
        line(this.x,this.y ,this.x + this.step ,this.y + this.step);
    } else {
        if (this.size == "small"){
        strokeWeight(1)
      } else strokeWeight(2)
        line(this.x, this.y+ this.step, this.x + this.step, this.y)
    }
  }
}