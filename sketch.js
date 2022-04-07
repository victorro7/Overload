let backgroundLayer1, backgroundLayer2, backgroundLayer3, backgroundLayer4, backgroundLayer5;
let counter = 0;
let hit = 0;
let x = 100;
let y = 245;
let b1x = 100;
let b2x = 0;
let b1y = 20;
let b2y = 80;
let bird_y = 32;
let ground = 245;
const p1Width = 48;
const p1Height = 48;
let IdleFramex = 0;
let runFramex = 0;
let jumpFramex = 0;
let gameFrame = 0; 
let atk1Frame = 0;
let atk2Frame = 0;
let atk3Frame = 0;
let runAtkFrame = 0;
let animalFrame = 0;
let deadFrame = 0;
let tankFrame = 0;
let tankWidth = 48;
let tankHeight = 48;
let bulletx = 350;
let frameSpeed = 5; // Increase to slow down sprite
let skillFrameSpeed = 5;
var grassSound;

function setup() {
  createCanvas(400, 400);
}

function preload(){
  playerOneImages()
  nightBackground()
  tileImages()
  animaImages()
  enemyImages()
  sounds()
  
  function playerOneImages(){
    player1Run = loadImage('assets/Cyborg_run.png');
    player1Idle = loadImage('assets/Cyborg_idle.png');
    player1Jump = loadImage('assets/Cyborg_jump.png');
    player1Atk1 = loadImage('assets/Cyborg_attack1.png');
    player1Atk2 = loadImage('assets/Cyborg_attack2.png');
    player1Atk3 = loadImage('assets/Cyborg_attack3.png');
    player1RunAtk = loadImage('assets/Cyborg_run_attack.png');
    player1Runback = loadImage('assets/Cyborg_runback.png');
    player1Hit = loadImage('assets/Cyborg_hurt.png');
    player1Dead = loadImage('assets/Cyborg_death.png');
  }
  function nightBackground(){
    backgroundLayer1 = loadImage('nightbg/1.png');
    backgroundLayer2 = loadImage('nightbg/2.png');
    backgroundLayer3 = loadImage('nightbg/3.png');
    backgroundLayer4 = loadImage('nightbg/4.png');
    backgroundLayer5 = loadImage('nightbg/5.png');
  }
  function tileImages(){
    tile7 = loadImage('tiles/Tile_07.png');
    tile10 = loadImage('tiles/Tile_10.png');
    tile11 = loadImage('tiles/Tile_11.png');
    tile33 = loadImage('tiles/Tile_33.png');
    tile34 = loadImage('tiles/Tile_34.png');
  }
  function animaImages(){
    bird1 = loadImage('animals/bOneWalk.png');
    bird2 = loadImage('animals/bOneWalk.png');
  }
  function enemyImages(){
    tank = loadImage('objects/tankAtk.png');
    ball1 = loadImage('objects/Ball1.png');
    ball2 = loadImage('objects/Ball2.png');
  }
  
  function sounds(){
    soundFormats('mp3', 'ogg', 'wav');
    grassSound = loadSound('sounds/running.mp3');
    grassSound2 = loadSound('sounds/running2.wav');
  }
  
}

//Background animation
class Layer {
  constructor(image, speedMod) {
    this.x = 0;
    this.y = 0;
    this.width = 576;
    this.height = 324;
    this.x2 = this.width;
    this.image = image;
    this.speedMod = speedMod;
    this.speed = frameSpeed * this.speedMod;
  }
  //Move layers horizontally, changing x,x2
  update(){
    this.speed = frameSpeed * this.speedMod;
    if (this.x <= -(this.width)){
        this.x = this.width + this.x2 - this.speed;//no gap between images
    }
    if (this.x2 <= -(this.width)){
        this.x2 = this.width + this.x - this.speed;//no gap between images
    }
    this.x = Math.floor(this.x - this.speed);
    this.x2 = Math.floor(this.x2 - this.speed);
  }
  animdraw(){
    image(backgroundLayer1, this.x, this.y, this.width, this.height);
    image(backgroundLayer1, this.x2, this.y, this.width, this.height);
    
    image(backgroundLayer2, this.x, this.y, this.width, this.height);
    image(backgroundLayer2, this.x2, this.y, this.width, this.height);
    
    image(backgroundLayer3, this.x, this.y, this.width, this.height);
    image(backgroundLayer3, this.x2, this.y, this.width, this.height);
    
    image(backgroundLayer4, this.x, this.y, this.width, this.height);
    image(backgroundLayer4, this.x2, this.y, this.width, this.height);
    
    image(backgroundLayer5, this.x, this.y, this.width, this.height);
    image(backgroundLayer5, this.x2, this.y, this.width, this.height);
  }
  
}
let background = new Layer(backgroundLayer1, 0.5);

function animate(){
  clear(0,0, width, height);
  background.update();
  background.animdraw();
}


function draw() {
  animate();
  tiles();
  animals();
  enemies();
  scoreBd();
  
  /*Movement and Attacks(z,x,c,q)*/
  if ((keyIsPressed == true) && (key == 'z')) {
    pOneAtk1();
    //frameSpeed = 5;
  } else if ((keyIsPressed == true) && (key == 'x')) {
    pOneAtk2();
    //frameSpeed = 5;
  } else if ((keyIsPressed == true) && (key == 'c')) {
    pOneAtk3();
    //x +=1;
    //frameSpeed = 5;
  } else if ((keyIsPressed == true) && (key == 'q') && keyIsDown(RIGHT_ARROW)) {
    pOneRunAtk();
    x +=1;
    frameSpeed = 5;
  } else if (keyIsDown(32) && keyIsDown(RIGHT_ARROW)) {
    //"32" keycode for space bar
    pOneJump(); 
    x += 3;
    frameSpeed = 5;
  } else if (keyIsDown(UP_ARROW) && keyIsDown(RIGHT_ARROW)) {
    pOneJump(); 
    x += 3;
    frameSpeed = 5;
  } else if (keyIsDown(32)) {
    pOneJump();
    //frameSpeed = 5;
  } else if (keyIsDown(RIGHT_ARROW))  {
    pOneRun();
    //grassSound.play();
    x += 1;//Comment out for run in place
    frameSpeed = 5;
  } else if (keyIsDown(LEFT_ARROW))  {
    pOneRunBack();   
    x -= 1;//Comment out for run in place
    frameSpeed = 5;
  } else {
    
    pOneIdle();
    frameSpeed = 0;
  }
   
  /*Hurt*/
  if (bulletx < 0){// bullet off screen
    bulletx = 350; // reset position
    image(ball1, bulletx, 273);
    counter++; //adds point if bullet reaches 0
  } else if(bulletx == x){
    pOneHurt();
    hit++;
    counter = 0; //counter resets to 0
    bulletx = 350;
  }
  
  //resets player position to 0 when off screen
  if (width < x || x < 0) {
    x = 0;
    y = ground;
  }
  
}

function scoreBd(){
  textSize(20);
  text('Score: '+ counter, 20, 20);
  text('Hit:' + hit , 320, 20);
}

/*Player States*/
function pOneIdle(){
  image(player1Idle, x, y, p1Width, p1Height, IdleFramex * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % 9 == 0) {
    if (IdleFramex < 3) IdleFramex++;
    else IdleFramex = 0;
  }
  
  gameFrame++;
  
}
function pOneRun(){
  image(player1Run, x, y, p1Width, p1Height, runFramex * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % frameSpeed == 0) {
    if (runFramex < 5) runFramex++;
    else runFramex = 0;
  }
  
  gameFrame++;
  
}
function pOneHurt(){
  image(player1Hit, x, y, p1Width, p1Height, 1 * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % 9 == 0) {
    if (IdleFramex < 2) IdleFramex++;
    else IdleFramex = 0;
  }
  
  gameFrame++;
}
function pOneRunBack(){
  image(player1Runback, x, y, p1Width, p1Height, runFramex * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % frameSpeed == 0) {
    if (runFramex < 5) runFramex++;
    else runFramex = 0;
  }
  
  gameFrame++;
  
}
function pOneJump(){
  image(player1Jump, x, y-30, p1Width, p1Height, jumpFramex * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % skillFrameSpeed == 0) {
    if (jumpFramex < 3) jumpFramex++;
    else jumpFramex = 0;
  }
  
  gameFrame++;
}
function pOneDead(){
  image(player1Dead, 222, y, p1Width, p1Height, deadFrame * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % frameSpeed == 0) {
    if (deadFrame < 5) deadFrame++;
    else deadFrame = 0;
  }
  
  gameFrame++;
}

/*Player One Attacks*/
function pOneAtk1(){
  image(player1Atk1, x, y, p1Width, p1Height, atk1Frame * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % skillFrameSpeed == 0) {
    if (atk1Frame < 5) atk1Frame++;
    else atk1Frame = 0;
  }
  
  gameFrame++;
}
function pOneAtk2(){
  image(player1Atk2, x, y, p1Width, p1Height, atk2Frame * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % skillFrameSpeed == 0) {
    if (atk2Frame < 7) atk2Frame++;
    else atk2Frame = 0;
  }
  
  gameFrame++;
}
function pOneAtk3(){
  image(player1Atk3, x, y, p1Width, p1Height, atk3Frame * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % skillFrameSpeed == 0) {
    if (atk3Frame < 7) atk3Frame++;
    else atk3Frame = 0;
  }
  
  gameFrame++;
}
function pOneRunAtk(){
  image(player1RunAtk, x, y, p1Width, p1Height, runAtkFrame * p1Width, 0, p1Width, p1Height);
  
  if (gameFrame % frameSpeed == 0) {
    if (runAtkFrame < 5) runAtkFrame++;
    else runAtkFrame = 0;
  }
  
  gameFrame++;
}

/*tiles*/
function tiles(){
  ground1 = [
  image(tile34, 0, 290),
  image(tile33, 32, 290),
  image(tile34, 64, 290),
  image(tile10, 96, 290),
  image(tile11, 128, 290),
  image(tile33, 160, 290),
  image(tile7, 192, 290),
  image(tile7, 224, 290),
  image(tile7, 256, 290),
  image(tile34,288, 290),
  image(tile11,320, 290),
  image(tile34,352, 290),
  image(tile33,384, 290)
  ]
}

/*Moving animals*/
function animals(){
  
  image(bird1, b1x, b1y, bird_y, bird_y, animalFrame * bird_y, 0, bird_y, bird_y);
  
  image(bird2, b2x, b2y, bird_y, bird_y, animalFrame * bird_y, 0, bird_y, bird_y);
  
  if (gameFrame % 5 == 0) {
    if (animalFrame < 5) animalFrame++;
    else animalFrame = 0;
  }
  
  b1x++;
  b2x +=1.5;
  
  if (b1x >= 500){
    b1x = 0;
  } 
  
  if (b2x >= 450){
    b2x = 0;
  } 
  
}

//enemies
function enemies(){
  image(tank, 350, y, tankWidth, tankHeight, tankFrame * tankWidth, 0, tankWidth, tankHeight);
  
  if (gameFrame % 19 == 0) {
    if (tankFrame < 3) tankFrame++;
    else tankFrame = 0;
  }

  image(ball1, bulletx, 273);
  bulletx -= 2;
  
  gameFrame++;
}
