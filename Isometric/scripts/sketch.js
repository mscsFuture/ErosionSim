/////GLOBALS, CLASSES, AND VARIABLES/////
const TILE_HEIGHT = 50;
const TILE_WIDTH = 100;
let MAX_TILE_HEIGHT = 79;
const GRID_SIZE = 8;
let GRID_ORIENTATION = 1; //1 = EAST, 2 = NORTH, 3 = WEST, 4 = SOUTH
const CANVAS_HEIGHT = 500;
let CANVAS_WIDTH = 900;

let x_start;
let y_start;

//cursor
let customCursor;
let customClick;
let isClicking = false;
let shiftHeld = false;
//rotate button
let btn_rotate_image;
let btn_rotate_pressed_image;
let btn_rotate_isPressed = false;
//pause button
let btn_pause_image;
let btn_pause_pressed_image;
let btn_pause_isPressed = false;
let isPaused = false;
//play button
let btn_play_image;
let btn_play_pressed_image;
let btn_play_isPressed = false;

//tiles
class TileType {
  constructor(name, natural = 0, drain = 0, retain = 0, permeate = 0) {
    this.name = name;
    this.image1 = null;
    this.image2 = null;
    this.image3 = null;
    this.image4 = null;
    this.nature = natural;
    this.drainage = drain; //output
    this.retention = retain; //capacity
    this.permeability = permeate; //throughput
    this.growth_factor = 0;
  }
}

const grass = new TileType("Grass", 3,2);
const silt = new TileType("Silt", 1,1);
const stone = new TileType("Stone", 0,0);
const sand = new TileType("Sand", 2,0);
const clay = new TileType("Clay",1,0,5)
const water = new TileType("Water", 0,0);

// Tile class
class Tile {
  constructor(type, elevation) {
    this.type = type;
    this.elevation = elevation;
    this.water_content = 0;
    this.surface_water = 0;
    this.flooded = false;
  }

  getImage() {
    switch (this.elevation) {
      case 0: return this.type.image1;
      case 1: return this.type.image2;
      case 2: return this.type.image3;
      case 3: return this.type.image4;
      default: return null;
    }
  }

  }

let grid = [
  [new Tile(grass, 0), new Tile(grass, 0), new Tile(grass, 0), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1)],
  [new Tile(grass, 1), new Tile(grass, 0), new Tile(grass, 0), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1)],
  [new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1)],
  [new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 0), new Tile(grass, 0), new Tile(grass, 1), new Tile(grass, 1), new Tile(water, 0), new Tile(grass, 1)],
  [new Tile(clay, 3), new Tile(stone, 3), new Tile(stone, 3), new Tile(silt, 0), new Tile(grass, 1), new Tile(grass, 1), new Tile(water, 0), new Tile(grass, 1)],
  [new Tile(clay, 3), new Tile(clay, 3), new Tile(water, 0), new Tile(silt, 0), new Tile(sand, 0), new Tile(sand, 0), new Tile(water, 0), new Tile(water, 0)],
  [new Tile(grass, 2), new Tile(silt, 3), new Tile(water, 0), new Tile(water, 0), new Tile(water, 0), new Tile(water, 0), new Tile(sand, 0), new Tile(water, 0)],
  [new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(grass, 1), new Tile(water, 0), new Tile(grass, 1), new Tile(grass, 1)]
];


/////MAJOR FUNCTIONS/////
//loads the images prior to setup
function preload() {
  grass.image1 = loadImage("./assets/tiles/grass1.png");
  grass.image2 = loadImage("./assets/tiles/grass2.png");
  grass.image3 = loadImage("./assets/tiles/grass3.png");
  grass.image4 = loadImage("./assets/tiles/grass4.png");

  silt.image1 = loadImage("./assets/tiles/silt1.png");
  silt.image2 = loadImage("./assets/tiles/silt2.png");
  silt.image3 = loadImage("./assets/tiles/silt3.png");
  silt.image4 = loadImage("./assets/tiles/silt4.png");

  clay.image1 = loadImage("./assets/tiles/clay1.png");
  clay.image2 = loadImage("./assets/tiles/clay2.png");
  clay.image3 = loadImage("./assets/tiles/clay3.png");
  clay.image4 = loadImage("./assets/tiles/clay4.png");

  sand.image1 = loadImage("./assets/tiles/sand1.png");
  sand.image2 = loadImage("./assets/tiles/sand2.png");
  sand.image3 = loadImage("./assets/tiles/sand3.png");
  sand.image4 = loadImage("./assets/tiles/sand4.png");

  stone.image1 = loadImage("./assets/tiles/stone1.png");
  stone.image2 = loadImage("./assets/tiles/stone2.png");
  stone.image3 = loadImage("./assets/tiles/stone3.png");
  stone.image4 = loadImage("./assets/tiles/stone4.png");

  water.image1 = loadImage("./assets/tiles/water1.png");
  water.image2 = loadImage("./assets/tiles/water2.png");
  water.image3 = loadImage("./assets/tiles/water3.png");
  water.image4 = loadImage("./assets/tiles/water4.png");

  btn_rotate_image = loadImage("./assets/UI/btn_rotate.png");
  btn_rotate_pressed_image = loadImage("./assets/UI/btn_rotate_pressed.png");
  btn_pause_image = loadImage("./assets/UI/btn_pause.png");
  btn_pause_pressed_image = loadImage("./assets/UI/btn_pause_pressed.png");
  btn_play_image = loadImage("./assets/UI/btn_play.png");
  btn_play_pressed_image = loadImage("./assets/UI/btn_play_pressed.png");

  customCursor = loadImage("./assets/UI/cursorHand_grey.png");
  customClick = loadImage("./assets/UI/cursorPressed_grey.png");
}

//sets up the gamespace, ran once on initialization
function setup() {
  //initializes start coordinates of topmost tile
  CANVAS_WIDTH = windowWidth;
  x_start = CANVAS_WIDTH / 2;
  y_start = 50;

  //creates the gamespace
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT); 
  pg = createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT); //graphics buffer

  noCursor(); // Hide the default cursor
}
// Adjust canvas size when the window is resized
function windowResized() {
  CANVAS_WIDTH = windowWidth;
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  pg.resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT); // Resize the off-screen graphics buffer

  x_start = width / 2; // Recalculate x_start based on new width
}
//draws the gamespace 60 fps
function draw() {
  background("#FFE4C4");
  
  if(!isPaused){
    draw_game();
  }
  else{
    draw_pause();
  }

  draw_btn_pause();
  draw_custom_mouse();
}

function draw_game(){
  draw_grid();
  highlight_tile();
  if(shiftHeld){
    highlight_all();
    //debug_drawnodes();
  }

  draw_btn_rotate();
  draw_btn_play();
}

function draw_custom_mouse(){
  if(!isClicking)
    image(customCursor, mouseX, mouseY);
  else
    image(customClick, mouseX, mouseY);
}

function draw_pause(){
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Paused', width / 2, height / 2);
}


/////MINOR FUNCTIONS/////
//draws the grid
function draw_grid() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
        draw_tile(grid[i][j], i, j,mouse_on_tile(i, j));
    }
  }
}
//highlights a tile that is hovered
function highlight_tile() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (mouse_on_tile(i, j)) {
        let pos = iso_coords(i, j);
        let z_offset =  TILE_HEIGHT / 2;

        // Calculate the four vertices of the diamond
        let v1 = createVector(pos.x, pos.y - z_offset);
        let v2 = createVector(pos.x + TILE_WIDTH / 2, pos.y + TILE_HEIGHT / 2 - z_offset);
        let v3 = createVector(pos.x, pos.y + TILE_HEIGHT - z_offset);
        let v4 = createVector(pos.x - TILE_WIDTH / 2, pos.y + TILE_HEIGHT / 2 - z_offset);
        
        stroke("#FFCA00");
        strokeWeight(2);
        noFill();
        beginShape();
        vertex(v1.x, v1.y);
        vertex(v2.x, v2.y);
        vertex(v3.x, v3.y);
        vertex(v4.x, v4.y);
        endShape(CLOSE);
      }
    }
  }
}
//highlights all tiles
function highlight_all(){
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let pos = iso_coords(i, j);
        let z_offset =  TILE_HEIGHT / 2;

        // Calculate the four vertices of the diamond
        let v1 = createVector(pos.x, pos.y - z_offset);
        let v2 = createVector(pos.x + TILE_WIDTH / 2, pos.y + TILE_HEIGHT / 2 - z_offset);
        let v3 = createVector(pos.x, pos.y + TILE_HEIGHT - z_offset);
        let v4 = createVector(pos.x - TILE_WIDTH / 2, pos.y + TILE_HEIGHT / 2 - z_offset);
        
        stroke("#FFCA00");
        strokeWeight(2);
        noFill();
        beginShape();
        vertex(v1.x, v1.y);
        vertex(v2.x, v2.y);
        vertex(v3.x, v3.y);
        vertex(v4.x, v4.y);
        endShape(CLOSE);
    }
  }
}
//rotate the grid -90 degrees
function rotate_grid_counterclockwise() {
  let newGrid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    newGrid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      newGrid[i][j] = grid[GRID_SIZE - j - 1][i];
    }
  }
  grid = newGrid;

  GRID_ORIENTATION++; 
  if (GRID_ORIENTATION == 5)
    GRID_ORIENTATION = 1;

}
// Rotate the grid 90 degrees clockwise
function rotate_grid_clockwise() {
  let newGrid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    newGrid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      newGrid[i][j] = grid[j][GRID_SIZE - i - 1];
    }
  }
  grid = newGrid;

  GRID_ORIENTATION--; 
  if (GRID_ORIENTATION == 0)
    GRID_ORIENTATION = 4;
}

function display_tile_info(){
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (mouse_on_tile(i, j)){
        fill(0);
        noStroke();
        textSize(16);
        textAlign(RIGHT, TOP);
        text(grid[i][j].type.name, width - 10, 10);
        fill("#24b538");
        text(grid[i][j].type.nature, width - 10, 30);
        fill("#000aff");
        text(grid[i][j].water_content, width - 10, 50);
        fill("#ff2200");
        text(grid[i][j].getFloodRisk(), width - 10, 70);
        fill("#000000");
      }
    }
  }
}


/////SUBFUNCTIONS/////
//calculates the screen coordinates (isoX,isoY) of the center of a tile at grid coordinates (x,y)
function iso_coords(x, y) {
  let isoX = x_start + (x - y) * TILE_WIDTH / 2;
  let isoY = y_start + (x + y) * TILE_HEIGHT / 2;
  return createVector(isoX, isoY);
}

//draws a tile in grid coordinates (x, y)
function draw_tile(tile, x, y, mouseon = false) {
  let pos = iso_coords(x, y);
  let tileImage = tile.getImage(); // Get the image based on elevation

  // Calculate the z offset
  let z_offset = mouseon 
                 ? MAX_TILE_HEIGHT - MAX_TILE_HEIGHT 
                 : MAX_TILE_HEIGHT - tileImage.height;

  // Draw the tile's image at the calculated position
  image(tileImage, pos.x - TILE_WIDTH / 2, pos.y - TILE_HEIGHT / 2 + z_offset);
}

//debug function, draws mouse position and centers of each tile.
function debug_drawnodes(){
  fill(255,255,255);
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let pos = iso_coords(i, j);
      ellipse(pos.x, pos.y, 10);
    }
  }
  fill("#333873");
  ellipse(mouseX, mouseY, 10);
}

//used to determine if point p is inside polygon formed from points v1,v2,v3,v4
function point_in_poly(p, v1, v2, v3, v4) {
  let t1 = tri_sign_area(p, v1, v2);
  let t2 = tri_sign_area(p, v2, v3);
  let t3 = tri_sign_area(p, v3, v4);
  let t4 = tri_sign_area(p, v4, v1);

  let has_neg = (t1 < 0) || (t2 < 0) || (t3 < 0) || (t4 < 0);
  let has_pos = (t1 > 0) || (t2 > 0) || (t3 > 0) || (t4 > 0);

  return !(has_neg && has_pos);
}

//subfunction of point_in_poly, used to calculate signed area of a triangle
function tri_sign_area(p1, p2, p3) {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

//used to determine if mouse is hovering on tile at grid coordinates (x,y)
function mouse_on_tile(x, y) {
  let pos = iso_coords(x, y);
  let mousePos = createVector(mouseX, mouseY);
  let z_offset = TILE_HEIGHT / 2;

  // Calculate the four vertices of the diamond
  let v1 = createVector(pos.x, pos.y - z_offset);
  let v2 = createVector(pos.x + TILE_WIDTH / 2, pos.y + TILE_HEIGHT / 2 - z_offset);
  let v3 = createVector(pos.x, pos.y + TILE_HEIGHT - z_offset);
  let v4 = createVector(pos.x - TILE_WIDTH / 2, pos.y + TILE_HEIGHT / 2 - z_offset);
  
  return point_in_poly(mousePos, v1, v2, v3, v4);
}

function draw_btn_rotate(){
  let btnX = 150;
  let btnY = 10;
  let btnSize = 15;
  if(btn_rotate_isPressed){
    image(btn_rotate_pressed_image, btnX, btnY+3,btn_rotate_pressed_image.width+btnSize,btn_rotate_pressed_image.height+btnSize);
  }
  else{
    image(btn_rotate_image, btnX, btnY,btn_rotate_image.width+btnSize,btn_rotate_image.height+btnSize);
  }
}

function draw_btn_pause(){
  let btnX = 10;
  let btnY = 10;
  let btnSize = 15;
  if(btn_pause_isPressed){
    image(btn_pause_pressed_image, btnX, btnY+3,btn_rotate_pressed_image.width+btnSize,btn_rotate_pressed_image.height+btnSize);
  }
  else{
    image(btn_pause_image, btnX, btnY,btn_pause_image.width+btnSize,btn_pause_image.height+btnSize);
  }
}

function draw_btn_play(){
  let btnX = 80;
  let btnY = 10;
  let btnSize = 15;
  if(btn_play_isPressed){
    image(btn_play_pressed_image, btnX, btnY+3,btn_rotate_pressed_image.width+btnSize,btn_play_pressed_image.height+btnSize);
  }
  else{
    image(btn_play_image, btnX, btnY,btn_pause_image.width+btnSize,btn_play_image.height+btnSize);
  }
}

function mousePressed() {
  isClicking = true;
  let buttonX = 10;
  let buttonY = 10;
  let buttonSize = btn_rotate_image.width + 15;

  if (mouseX > buttonX && mouseX < buttonX + buttonSize &&
    mouseY > buttonY && mouseY < buttonY + buttonSize) {
      btn_pause_isPressed = true;
      togglePause();
  }

  buttonX = 150;
  
  if (mouseX > buttonX && mouseX < buttonX + buttonSize &&
      mouseY > buttonY && mouseY < buttonY + buttonSize && !isPaused) {
        btn_rotate_isPressed = true;
    rotate_grid_counterclockwise();
  }

  buttonX = 80;
  if (mouseX > buttonX && mouseX < buttonX + buttonSize &&
    mouseY > buttonY && mouseY < buttonY + buttonSize && !isPaused) {
      btn_play_isPressed = true;
      simulation();
      //rotate_grid_clockwise();
  
}

}

function mouseReleased() {
  isClicking = false;
  btn_rotate_isPressed = false;
  btn_pause_isPressed = false;
  btn_play_isPressed = false;
}

function togglePause(){
  isPaused = !isPaused;
}

function draw_overlay(color){
  pg.clear();
  pg.fill(color); 
  pg.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  image(pg, 0, 0);
}

function keyPressed() {
  if (keyCode === SHIFT) {
    shiftHeld = true;
    console.log("SHIFT Held");
  }
}

function keyReleased() {
  if (keyCode === SHIFT) {
    shiftHeld = false;
    console.log("SHIFT Released");
  }
}



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function changeTileType(i, j, newType) {
  grid[i][j].type = newType;
  grid[i][j].flooded = false; // Remove flooding when changing type
  grid[i][j].water_content = 0;
  grid[i][j].surface_water = 0;
}

function simulation() {
  //Step 1: Randomly select weather condition
  let weather = getRandomInt(6);
  sim_weather(weather);

  //Step 2: Permeability and runoff simulation
    //Iterate through elevation i=3, i==0, i--
      //Tile increases water content by min(surface_water, permeability, retention-water_content)
      //If surface_water > 0 
        //Flag tile as flooded
        //Runoff 
          //flows to nearby water source if avaliable
          //flows to lowest elevation adjacent tile 
          //flows right or down (if either doesn't have a greater elevation)


  //Step 3: Tile transformation simulation
  sim_transformation();
  
  //Step 4: Water merge simulation
   
}

function sim_weather(weather){
  //Storm [20-55 rain falls on each tile]
  if(weather == 0){
    console.log("Storm");
    let inches = (getRandomInt(4) + 2) * 10;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        grid[row][col].surface_water += getRandomInt(5) + inches;
      }
    }
  }
  //Rain [0-25 rain falls on each tile]
  else if (weather == 1){
    console.log("Rain");
    let inches = (getRandomInt(3)) * 10;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        grid[row][col].surface_water += getRandomInt(5) + inches;
      }
    }
  }
  //Windy
  else if(weather == 2){
    console.log("Windy");
  }
  //Sunny
  else if(weather == 3){
    console.log("Sunny");
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        grid[row][col].surface_water += 0;
      }
    }
  }
  else if(weather == 4){
    console.log("Cloudy");
  }
}

function sim_waterflow(){
  for(let row = 0; row < GRID_SIZE; row++){
    for(let col = 0; col < GRID_SIZE; col++){
      for(let level = 3; level > 0; level--){
        if (grid[row][col].elevation == level){
          let minValue = Math.min(
            grid[row][col].surface_water, 
            grid[row][col].retention - grid[row][col].water_content, 
            grid[row][col].permeability
          );

            grid[row][col].water_content+= minValue;
            grid[row][col].surface_water-= minValue;
            
            if(grid[row][col].surface_water > 0){
              grid[row][col].flooded = true;
            }
            else{
              grid[row][col].flooded = false;
            }

            if(grid[row][col].type.name != "Water"){
              //flow excess water to adjacent water
              if(grid[row][col].surface_water > 0){
                let adjacentTiles = getAdjacentTiles(row, col);
                for(let [x,y] of adjacentTiles){
                  if(grid[x][y].type.name == "Water"){
                    grid[x][y].surface_water += grid[row][col].surface_water;
                    grid[row][col].surface_water = 0;
                  }
                }
              }
              //flow excess water to lowest adjacent
              if(grid[row][col].surface_water > 0){
                let lowestTile = grid[row][col].elevation;
                let lower = false;
                for (let [x, y] of adjacentTiles) {
                  if (grid[x][y].elevation < lowestTile.elevation) {
                    lowestTile = { x, y };
                    lower = true;
                  }
                }
                if(lower){
                  grid[lowestTile.x][lowestTile.y].surface_water += grid[row][col].surface_water;
                  grid[row][col].surface_water = 0;
                }
              }
              //flow excess water rightwards or downwards
              if(grid[row][col].surface_water > 0){
                if(col + 1 < GRID_SIZE && grid[row][col+1].elevation == level){
                  grid[row][col+1].surface_water += grid[row][col].surface_water;
                  grid[row][col].surface_water = 0;
                }
                else if(row+1<GRID_SIZE && grid[row+1][col].elevation == level){
                  grid[row+1][col].surface_water += grid[row][col].surface_water;
                  grid[row][col].surface_water = 0;
                }
              }
          }
        }
      }
    }
  }

}

function sim_transformation(){
  //All tiles bordering water have a chance to become water or lower elevation
    //increased chance if flooding
    //increased chance if windy for granular terrains
    //decreased chance if vegetated
  

  //STONE
    //very low chance clay with resting water
  //CLAY
    //soft when over saturated
    //brittle when dry
    //low fertile when saturated
  //SILT
    //fertile when saturated
    //high erosion when dry + windy
    //high erosion when flooded
  //SAND
    //very low fertile when saturated
    //low erosion when dry + windy
  //GRASS
    //lose vegetation when dry
    //lose vegetation when flooded
  //COMPOST
    //high fertile when saturated
    //erodes to other soil when flooded or dry + windy
  //WATER


  //Weird states...
  //DUST
    //transition state between soils when dry + windy???
    //higher chance to collapse
  //MUD
    //transition state between soils when flooded???
    //higher chance to become water
  //SEDIMENT WATER
    //water with a probability of becoming soil???






  //STONE
  //excess surface water
    //low chance --> clay

  //SAND
  //dry (20%- retention)
    //windy
      //very low chance --> silt

  //CLAY
  //dry (20%- retention)
    //windy
      //low chance --> dust
  //flooded
    //low chance --> mud
  //over saturated (80%+ saturation)
    //very low chance --> mud
  //saturated (40%+ saturation)
    //bordering grass
      //very low chance --> grass

  //SILT
  //dry (20%- retention)
    //windy
      //low chance --> dust
  //flooded
    //medium chance --> mud
  //saturated (40%+ retention)
    //bordering grass
      //medium chance --> grass
  
  //COMPOST
  //dry (20%- retention)
    //medium chance --> silt
  //flooded
    //medium chance --> mud
  //bordering grass
    //high chance --> grass

  //GRASS
  //dry (20%- retention)
    //medium chance --> silt
  //flooded
    //medium chance --> silt
    //low chance --> clay or mud
  

}