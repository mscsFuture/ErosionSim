////////////////////////////////////////////////////////////////////////
//  
//  
//    This file exists for rapid protyping demo purposes only. 
//
//    This file contains xml code that translates to the hardcoded
//    blockly blocks that will appear in the demo blockly workspace.
//
//
////////////////////////////////////////////////////////////////////////

function getXML(){
	var xml = `
          <block type="start_block" x="10" y="10">
          <statement name="DO">
            <!-- "do 4 times" { "north" } -->
            <block type="loop">
              <field name="TIMES">4</field>
              <statement name="DO">
                <block type="north"></block>
              </statement>
              <next>
                <!-- "east" -->
                <block type="east">
                  <next>
                    <!-- "south" -->
                    <block type="south">
                      <next>
                        <!-- "place object" with "Tree" -->
                        <block type="place_object">
                          <field name="OBJECT">Tree</field>
                          <next>
                            <!-- "east" -->
                            <block type="east">
                              <next>
                                <!-- "place object" with "Tree" -->
                                <block type="place_object">
                                  <field name="OBJECT">Tree</field>
                                  <next>
                                    <!-- "do 3 times" { "north", "east" } -->
                                    <block type="loop">
                                      <field name="TIMES">3</field>
                                      <statement name="DO">
                                        <block type="north">
                                          <next>
                                            <block type="east"></block>
                                          </next>
                                        </block>
                                      </statement>
                                      <next>
                                        <!-- "east" -->
                                        <block type="east">
                                          <next>
                                            <!-- "place object" with "Tree" -->
                                            <block type="place_object">
                                              <field name="OBJECT">Tree</field>
                                              <next>
                                                <!-- "east" -->
                                                <block type="east">
                                                  <next>
                                                    <!-- "place object" with "Tree" -->
                                                    <block type="place_object">
                                                      <field name="OBJECT">Tree</field>
                                                      <next>
                                                        <!-- "do 4 times" { "west" }, "north", "west", "throw: Grass" -->
                                                        <block type="loop">
                                                          <field name="TIMES">4</field>
                                                          <statement name="DO">
                                                            <block type="west"></block>
                                                          </statement>
                                                          <next>
                                                            <block type="north">
                                                              <next>
                                                                <block type="west">
                                                                  <next>
                                                                    <block type="throw">
                                                                      <field name="OBJECT">Grass</field>
                                                                    </block>
                                                                  </next>
                                                                </block>
                                                              </next>
                                                            </block>
                                                          </next>
                                                        </block>
                                                      </next>
                                                    </block>
                                                  </next>
                                                </block>
                                              </next>
                                            </block>
                                          </next>
                                        </block>
                                      </next>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
    `;

	return xml;
}

