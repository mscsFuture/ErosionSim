// Stuff for timing

// delay function used in the blockly conversions
//
// call it with `await sleep(ms)`
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// Time interval in milliseconds
//
// var because it should be customizable (maybe)
var timeInterval = 500;


  
const animationTimeInterval = 4000;
const animationSleepInterval = 5000;
function sleepForAnimation() {
	return new Promise(resolve => setTimeout(resolve, animationSleepInterval));
}