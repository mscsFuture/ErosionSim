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
  constructor(name, natural, drain = 0, retain = 0) {
    this.name = name;
    this.image1 = null;
    this.image2 = null;
    this.image3 = null;
    this.image4 = null;
    this.nature = natural;
    this.drainage = drain; //output
    this.retention = retain; //capacity
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
    this.flooding = 0;
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

  getFloodRisk(){
    let risk = this.flooding-(this.elevation*3);
    if (risk < -1) risk = -1; //no flooding
    if (risk > 3) risk = 3; //excess flooding

    return risk;
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
    draw_grid();
    highlight_tile();
    display_tile_info();
    draw_btn_rotate();
    draw_btn_play();
  }
  else{
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Paused', width / 2, height / 2);
  }

  draw_btn_pause();
  if(!isClicking)
    image(customCursor, mouseX, mouseY);
  else
    image(customClick, mouseX, mouseY);
  //debug_drawnodes();
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
        text(grid[i][j].flooding, width - 10, 50);
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
  pg.fill(color); // Blue color with no opacity
  pg.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  image(pg, 0, 0);
}


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Helper function to get adjacent tiles (up, down, left, right)
function getAdjacentTiles(x, y) {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];
  let neighbors = [];

  for (let [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;

    if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
      neighbors.push([nx, ny]);
    }
  }

  return neighbors;
}

function changeTileType(i, j, newType) {
  grid[i][j].type = newType;
  grid[i][j].flooding = 0; // Remove flooding when changing type
}


function simulation() {
  // Step 1: Add random flooding values (0 to 4 inclusive)
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].flooding += getRandomInt(5); // 0 to 4 inclusive
    }
  }

  // Step 2: Subtract drainage
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].flooding -= grid[i][j].type.drainage;
      if (grid[i][j].flooding < 0) grid[i][j].flooding = 0;
    }
  }

  // Step 3: Tile transformation based on behavior


  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let tile = grid[i][j];
      let floodRisk = tile.getFloodRisk();
      let neighbors = getAdjacentTiles(i, j);

      if (tile.type === sand) {
        let hasWaterNeighbor = neighbors.some(([x, y]) => grid[x][y].type === water);
        if (hasWaterNeighbor && Math.random() < 0.25 * floodRisk) {
          changeTileType(i, j, water);
        } else if (!hasWaterNeighbor && floodRisk <= 1 && Math.random() < 0.25) {
          changeTileType(i, j, silt);
        }
      } else if (tile.type === silt) {
        if (Math.random() < 0.25 * floodRisk) {
          changeTileType(i, j, sand);
        } else if (floodRisk <= 1) {
          let hasGrassNeighbor = neighbors.some(([x, y]) => grid[x][y].type === grass);
          if (hasGrassNeighbor && Math.random() < 0.5) {
            changeTileType(i, j, grass);
          }
        }
      } else if (tile.type === grass) {
        if (Math.random() < 0.25 * floodRisk) {
          changeTileType(i, j, silt);
        }
      } else if (tile.type === stone) {
        if (Math.random() < 0.05 * floodRisk) {
          changeTileType(i, j, clay);
        }
      } else if (tile.type === clay) {
        let hasWaterNeighbor = neighbors.some(([x, y]) => grid[x][y].type === water);
        if (hasWaterNeighbor && Math.random() < 0.05 * floodRisk) {
          changeTileType(i, j, water);
        }
      }
    }
  }

  // Step 4: Elevation changes
  function adjustElevation(x, y, amount) {
    grid[x][y].elevation += amount;
    grid[x][y].flooding = 0; // Remove flooding when elevation changes
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let tile = grid[i][j];
      let neighbors = getAdjacentTiles(i, j);
      let lowerWaterNeighbors = neighbors.filter(([x, y]) => grid[x][y].type === water && grid[x][y].elevation < tile.elevation);

      if (tile.type === water) {
        let floodRisk = tile.getFloodRisk();
        let allWaterFloodRiskAbove3 = neighbors.every(([x, y]) => grid[x][y].type === water && grid[x][y].getFloodRisk() > 3);
        let allNeighborsHigherElevation = neighbors.every(([x, y]) => grid[x][y].elevation > tile.elevation);

        if (allWaterFloodRiskAbove3 && allNeighborsHigherElevation) {
          adjustElevation(i, j, 1);
        }
      } else if (tile.type === sand) {
        if (lowerWaterNeighbors.length > 0 && Math.random() < 0.25) {
          adjustElevation(i, j, -1);
          let newType = [sand, silt, clay, stone][getRandomInt(4)];
          changeTileType(i, j, newType);
        }
      } else if (tile.type === silt) {
        if (lowerWaterNeighbors.length > 0 && Math.random() < 0.20) {
          adjustElevation(i, j, -1);
        }
      } else if (tile.type === grass) {
        if (lowerWaterNeighbors.length > 0 && Math.random() < 0.10) {
          adjustElevation(i, j, -1);
          changeTileType(i, j, silt);
        }
      } else if (tile.type === clay) {
        if (lowerWaterNeighbors.length > 0 && Math.random() < 0.10) {
          adjustElevation(i, j, -1);
          let newType = [clay, sand, stone][getRandomInt(3)];
          changeTileType(i, j, newType);
        }
      } else if (tile.type === stone) {
        if (lowerWaterNeighbors.length > 0 && Math.random() < 0.05) {
          adjustElevation(i, j, -1);
          let newType = Math.random() < 0.5 ? clay : stone;
          changeTileType(i, j, newType);
        }
      }
    }
  }

  // Step 5: Flooding equalization
  let newFlooding = grid.map(row => row.map(tile => tile.flooding));

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let tile = grid[i][j];
      let neighbors = getAdjacentTiles(i, j);
      let equalNeighbors = neighbors.filter(([x, y]) => grid[x][y].elevation === tile.elevation);
      let lowerNeighbors = neighbors.filter(([x, y]) => grid[x][y].elevation < tile.elevation);

      if (equalNeighbors.length > 0) {
        let totalFlooding = tile.flooding;
        let count = 1;

        equalNeighbors.forEach(([x, y]) => {
          totalFlooding += grid[x][y].flooding;
          count++;
        });

        let averageFlooding = Math.floor(totalFlooding / count);
        newFlooding[i][j] = averageFlooding;
        equalNeighbors.forEach(([x, y]) => {
          newFlooding[x][y] = averageFlooding;
        });
      }

      if (lowerNeighbors.length > 0) {
        lowerNeighbors.forEach(([x, y]) => {
          let floodingDifference = tile.flooding - grid[x][y].flooding;
          if (floodingDifference > 0) {
            let flowAmount = Math.floor(floodingDifference / 2);
            newFlooding[i][j] -= flowAmount;
            newFlooding[x][y] += flowAmount;
          }
        });
      }
    }
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].flooding = newFlooding[i][j];
    }
  }
}


/*
function simulation() {
  // Step 1: Add random flooding values
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].flooding += getRandomInt(4); // 0 to 3 inclusive
    }
  }

  // Step 2: Subtract drainage
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].flooding -= grid[i][j].type.drainage;
      if (grid[i][j].flooding < 0) grid[i][j].flooding = 0;
      if (grid[i][j].flooding > 9) grid[i][j].flooding = 9;
    }
  }

  // Step 3: Flow to lowest elevation
  /*
  let minElevation = Math.min(...grid.flat().map(tile => tile.elevation));
  let newFlooding = grid.map(row => row.map(tile => tile.flooding));

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].elevation === minElevation) {
        let neighbors = getAdjacentTiles(i, j);
        let totalFlooding = grid[i][j].flooding;
        let count = 1;

        neighbors.forEach(([x, y]) => {
          if (grid[x][y].elevation === minElevation) {
            totalFlooding += grid[x][y].flooding;
            count++;
          }
        });

        let averageFlooding = totalFlooding / count;
        newFlooding[i][j] = averageFlooding;
        neighbors.forEach(([x, y]) => {
          if (grid[x][y].elevation === minElevation) {
            newFlooding[x][y] = averageFlooding;
          }
        });
      }
    }
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].flooding = newFlooding[i][j];
    }
  }

  


  // Step 4: Increase water tile elevation if flood risk is 3 and elevation conditions are met
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].type === water) {
        let neighbors = getAdjacentTiles(i, j);
        let canIncreaseElevation = true;

        neighbors.forEach(([x, y]) => {
          if (grid[x][y].elevation <= grid[i][j].elevation && grid[x][y].type !== water) {
            canIncreaseElevation = false;
          }
        });

        if (canIncreaseElevation && grid[i][j].getFloodRisk() === 3 && grid[i][j].elevation == minElevation) {
          grid[i][j].elevation += 1;
        }

        let maxFlooding = grid[i][j].elevation * 3 + 3;
        if (grid[i][j].flooding > maxFlooding) {
          grid[i][j].flooding = maxFlooding;
        }
      }
    }
  }

  // Step 5: Remove flooding from tiles that change type
  function changeTileType(i, j, newType) {
    grid[i][j].type = newType;
    grid[i][j].flooding = 0;
  }

  // Step 6: Sand to water transformation
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].type === sand) {
        let chance = 0.25 * grid[i][j].getFloodRisk();
        if (Math.random() < chance) {
          changeTileType(i, j, water);
        }
      }
    }
  }

  // Step 7: silt to sand transformation
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].type === silt) {
        let chance = 0.25 * grid[i][j].getFloodRisk();
        if (Math.random() < chance) {
          changeTileType(i, j, sand);
        }
      }
    }
  }

  // Step 8: silt to grass transformation
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].type === silt && grid[i][j].getFloodRisk() <= 1) {
        let neighbors = getAdjacentTiles(i, j);
        let hasGrassNeighbor = neighbors.some(([x, y]) => grid[x][y].type === grass);
        if (hasGrassNeighbor && Math.random() < 0.5) {
          changeTileType(i, j, grass);
        }
      }
    }
  }

  // Step 9: Grass to silt transformation
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].type === grass) {
        let chance = 0.25 * grid[i][j].getFloodRisk();
        if (Math.random() < chance) {
          changeTileType(i, j, silt);
        }
      }
    }
  }

  // Step 10: Adjacent tile elevation lowering and water flooding removal
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].type === water) {
        let neighbors = getAdjacentTiles(i, j);
        neighbors.forEach(([x, y]) => {
          if (Math.random() < 0.1 && grid[x][y].elevation > 0 && grid[x][y].type != water) {
            grid[x][y].elevation -= 1;
            grid[i][j].flooding = 0; // Remove flooding from the water tile
          }
        });
      }
    }
  }
}


/*
function simulation() {
  // Step 1: Add random flooding values
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].flooding += getRandomInt(3);
    }
  }

  // Step 2: Subtract drainage
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].flooding -= grid[i][j].type.drainage;
      if (grid[i][j].flooding < 0) grid[i][j].flooding = 0;
      if (grid[i][j].flooding > 9) grid[i][j].flooding = 9;
    }
  }

  // Step 3: Update tiles based on flood risk
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let risk = grid[i][j].getFloodRisk(); 

      // Update tile type based on flood risk and adjacency
      if (grid[i][j].type == sand) {
        if (Math.random() < risk * 0.25) {
          grid[i][j].type = water;
        }
      } else if (grid[i][j].type == grass) {
        if (Math.random() < risk * 0.25) {
          grid[i][j].type = silt;
        }
      } else if (grid[i][j].type == silt) {
        if (Math.random() < risk * 0.25) {
          grid[i][j].type = sand;
        }
        if (risk == 0) {
          grid[i][j].type = grass;
        }
      }
    }
  }
}
*/