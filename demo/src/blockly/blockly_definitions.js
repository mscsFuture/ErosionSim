/*******************************************************************************
 *    blockly_definitions.js
 * 
 *    This file dictates the appearance and some behaviors of the blockly blocks.
 *    
 *    https://blockly-demo.appspot.com/static/demos/blockfactory/index.html is
 *    a helpful tool for generating new custom blocks.
 *
 *******************************************************************************/


/* START BLOCK  */
Blockly.Blocks['start_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Start");
    this.appendStatementInput('DO')   //allows for multiple statements to be added within start block
        .setCheck(null);        
    this.setDeletable(false);         //cannot be deleted from workspace
    this.setMovable(false);           //cannot be moved within workspace
    this.setPreviousStatement(false); //no connector node for a block before start block
    this.setNextStatement(false);     //no connector node for a block after start block
    this.setColour(265);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};


/* MOVE NORTH BLOCK  */
Blockly.Blocks['north'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("move north");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("move north");
 this.setHelpUrl("");
  }
};

/* MOVE RIGHT BLOCK  */
Blockly.Blocks['south'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("move south");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("move south");
 this.setHelpUrl("");
  }
};

/* MOVE UP BLOCK  */
Blockly.Blocks['east'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("move east");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("move east");
 this.setHelpUrl("");
  }
};

/* MOVE DOWN BLOCK  */
Blockly.Blocks['west'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("move west");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("move west");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['loop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Do")
        .appendField(new Blockly.FieldNumber(3, 1, Infinity, 1), 'TIMES')
        .appendField("times");
    this.appendStatementInput('DO')
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

const treeURL = "assets/block-icons/blockly-tree-icon.png";
// const 
Blockly.Blocks['place_object'] = {
  init: function() {
    var input = this.appendDummyInput()
        .appendField('place object');
    var options = [
        ['none', 'NONE'],
        [{'src': treeURL, 'width': 96, 'height': 48, 'alt': 'Trees'}, 'Tree'],
        // [{'src': 'mexico.png', 'width': 50, 'height': 25, 'alt': 'Mexico'}, 'MEXICO']
    ];
    input.appendField(new Blockly.FieldDropdown(options), 'OBJECT');
    this.setColour(140);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

const grassURL = "assets/block-icons/blockly-grass-icon.png";
Blockly.Blocks['throw'] = {
  init: function() {
    var input = this.appendDummyInput()
        .appendField('throw seeds');
    var options = [
        ['none', 'NONE'],
        [{'src': grassURL, 'width': 96, 'height': 48, 'alt': 'Grass'}, 'Grass'],
        // [{'src': 'mexico.png', 'width': 50, 'height': 25, 'alt': 'Mexico'}, 'MEXICO']
    ];
    input.appendField(new Blockly.FieldDropdown(options), 'OBJECT');
    this.setColour(140);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};
