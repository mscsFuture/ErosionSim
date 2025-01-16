/** FILE DESC: blockly_code_generator.js **************************************
*   
*   This file dictate the code that is generated when blockly blocks are placed
*   within the workspace.
*   
*   timeInterval and animationTimeInterval are global variables defined
*   in time.js.
*
*******************************************************************************/


/** START BLOCK Code Generation ************************************************
  - generated code from blocks within the start block are put into the
    statements_code variable.

*******************************************************************************/
javascript.javascriptGenerator.forBlock['start_block'] = function(block, generator) {
  //console.log("Generating program code... ");
  var do_statements = javascript.javascriptGenerator.statementToCode(block, 'DO');
  var code = `\n${do_statements}\n`;

  return code;
};

/** MOVEMENT BLOCK Code Generation **/
javascript.javascriptGenerator.forBlock['north'] = function(block, generator) {
    var code = 'if (gameIsActive) { await sleep(timeInterval); goRight(); } \n';
    return code;
}

javascript.javascriptGenerator.forBlock['south'] = function(block, generator) {
  var code = 'if (gameIsActive) { await sleep(timeInterval); goLeft(); } \n';
  return code;
};


javascript.javascriptGenerator.forBlock['east'] = function(block, generator) {
  var code = 'if (gameIsActive) { await sleep(timeInterval); goUp(); } \n';
  return code;
};

javascript.javascriptGenerator.forBlock['west'] = function(block, generator) {
  var code = 'if (gameIsActive) { await sleep(timeInterval); goDown(); } \n';
  return code;
};

/** LOOP BLOCK Code Generation **/

javascript.javascriptGenerator.forBlock['loop'] = function(block, generator) {
  var loopTimes = block.getFieldValue('TIMES');
  var do_statements = Blockly.JavaScript.statementToCode(block, 'DO');
  var code = `if (gameIsActive) { for (let i = 0; i < ${loopTimes}; i++) { \n ${do_statements} \n} } \n`;
  return code;
};

javascript.javascriptGenerator.forBlock['place_object'] = function(block, generator) {
  var code = '\n';
  return code;
};

javascript.javascriptGenerator.forBlock['throw'] = function(block, generator) {
  var code = '\n';
  return code;
};