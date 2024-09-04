/* EROSION SIMULATOR*/

function simulation(){
/*
1. Select weather condition
    0 == Cloudy
        No unique weather conditions
    1 == Sunny
        Evaporation intensifies water removal from system
    2 == Windy
        Wind intensifies some tile erosion under specific conditions
    3 == Rainy
        Light rain adds water into the system
    4 == Stormy
        Heavy rain greatly adds water into the system
*/
weather_sim(weather);

/*
2. Simulating waterflow.
*/
waterflow_sim();

/*
3. Simulate tile transformations
*/
transformation_sim(weather);

}

function weather_sim(weather){
    let rainfall;
    let variance;
    switch (weather) {
        case 0:
            console.log('Cloudy weather.');
            break;
        case 1:
            console.log('Sunny weather.');
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    //Remove all stagnant surface water
                    grid[row][col].surface_water = 0;
                    
                    //Remove [0,30]% of retention from each tiles water_content
                    let evaporate = Math.ceil(Math.random() * 0.30 * grid[row][col].type.retention);

                    evaporate = Math.min(evaporate, grid[row][col].water_content);
                    grid[row][col].water_content -= evaporate;
                }
            }
            break;
        case 2:
            console.log('Windy weather.');
            break;
        case 3:
            console.log('Rainy weather.');

            rainfall = getRandomInt(25);
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    variance = getRandomInt(5);

                    //Add [0,25] + [0,5] rainfall to surface of each tile. 
                    grid[row][col].surface_water += rainfall+variance;
                }
            }
            break;
        case 4:
            console.log('Stormy weather.');
            rainfall = getRandomInt(10)+25;
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    variance = getRandomInt(10);

                    //Add [25,35] + [0,10] rainfall to surface of each tile. 
                    grid[row][col].surface_water += rainfall+variance;
                }
            }
            break;
        default:
            console.log('WARNING: "weather" variable outside of domain ('+weather+'). Defaulting to 0.');
            weather = 0;
            break;
    }   
}

function waterflow_sim(){
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

function transformation_sim(weather){
    let chance;
    for(let row = 0; row < GRID_SIZE; row++){
        for(let col = 0; col < GRID_SIZE; col++){
            switch(grid[row][col].type.name){
                case "Stone":
                    console.log('('+row+','+col+'): Stone');
                    
                    //20% chance to convert to clay with stagnant water
                    if(grid[row][col].surface_water > 0){
                        if (Math.random() < 0.2) {
                            grid[row][col].type = clay;
                        }
                    }
                    //low chance to collapse with nearby water
                    else if(countAdjacentWater(row,col) > 0){
                        //check if windy or stormy
                        if(weather == 2 || weather == 4){
                            if(Math.random() < 0.1*countAdjacentWater(row,col) + .2){
                                if(grid[col][row].elevation <= 1){
                                    grid[col][row].type = water;
                                }
                                else{
                                    grid[col][row].elevation -= 1;
                                    chance = Math.random();
                                    if(chance < .3){
                                        grid[col][row].type = clay;
                                    }
                                }
                            }
                        }
                        else{
                            if(Math.random() < 0.1*countAdjacentWater(row,col)){
                                if(grid[col][row].elevation <= 1){
                                    grid[col][row].type = water;
                                }
                                else{
                                    grid[col][row].elevation -= 1;
                                    chance = Math.random();
                                    if(chance < .2){
                                        grid[col][row].type = clay;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case "Silt":
                    console.log('('+row+','+col+'): Silt');
                    

                    //check flooded
                        //chance to become clay
                    //check windy
                        //check dry
                            //chance to become sand
                    //check adjacent grass
                        //check saturated
                            //chance to become 
                    //check adjacent water
                        //chance to collapse

                    break;
                case "Sand":
                    console.log('('+row+','+col+'): Sand');

                    //check flooded
                    //check windy
                    //check adjacent water
                    //check adjacent grass

                    break;
                case "Clay":
                    console.log('('+row+','+col+'): Clay');

                    //check flooded
                    //check windy
                    //check adjacent water
                    //check adjacent grass

                    break;
                case "Grass":
                    console.log('('+row+','+col+'): Grass');

                    //check flooded
                    //check adjacent water

                    break;
                case "Compost":
                    console.log('('+row+','+col+'): Compost');

                    //check flooded
                    //check adjacent water
                    //check windy

                    break;
                case "Water":
                    console.log('('+row+','+col+'): Water');
                    break;
            }
        }  
    }
}
/*
for each tile...

Tiles can make transformations in certain conditions...
    - sand, silt, and clay are three soil types
        - perhaps a transformation is appropriate
    - compost, grass are adjacent to soil types
        - a transformation between these and other soils is appropriate
    - stone is a mineral, can turn into soil in very rare conditions
    - water is a liquid, some sort of silt buildup should revert to soil?


    - moisture level is relevant for transforming types
    - flooding is relevant for erosion
    - being adjacent to water is relevant
    - entropy is relevant
        - wind or storm can increase enthalpy/entropy
        - partly random
    - having vegetation is relevant
    - elevation / cliffsides is relevant.

*/




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
  
  function countAdjacentWater(x,y){
    let adjacentTiles = getAdjacentTiles(row, col);
    let count = 0;
    for(let [x,y] of adjacentTiles){
      if(grid[x][y].type.name == "Water"){
        count++;
      }
    }
    return count;
  }

  function countAdjacentGrass(x,y){
    let adjacentTiles = getAdjacentTiles(row, col);
    let count = 0;
    for(let [x,y] of adjacentTiles){
      if(grid[x][y].type.name == "Grass"){
        count++;
      }
    }
    return count;
  }