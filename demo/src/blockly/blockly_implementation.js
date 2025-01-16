/** FILE DESC: blockly_implmentation.js **************************************
*   
*   Logic for blockly blocks
*
*******************************************************************************/

async function goLeft() {
  console.log("In goLeft()...");
  moveCharacter("left");
}

async function goRight() {
  console.log("In goRight()...");
  moveCharacter("right");
}

async function goUp() {
  console.log("In goUp()...");
  moveCharacter("up");
}

async function goDown() {
  console.log("In goDown()...");
  moveCharacter("down");
}







// function borderCollisionProtocol() {
//   console.log("Player crashed into a border!");
//   gameFinished = true;
//   showPlayerConfusedAnimation();
// }

// function objectCollisionProtocol() {
//   console.log("Player crashed into a playground object!");
//   gameFinished = true;
//   showPlayerConfusedAnimation();
// }

// function badInteractionProtocol() {
//   console.log("Player interacted with empty tile!");
//   gameFinished = true;
//   showPlayerConfusedAnimation();
// }

// function gameFinishedProtocol() {
//   console.log("Game is finished, do nothing...");
// }

// function gameWonProtocol() {
//   console.log("Congrats! You won!");
//   gameFinished = true;
//   showPlayerWinAnimation();
// }

