// class movementTile {

// }



function randomTileGeneration() {
	tilesAcross = 8;
	var grid = [];

	for(var i = 0; i < tilesAcross; i++) {
		grid[i] = [];
	}

	for(var i = 0; i < tilesAcross; i++) {
		for(var j = 3; j < tilesAcross-2; j++) {
			grid[i][j] = new Tile(stone, 3)
		}
	}
}s