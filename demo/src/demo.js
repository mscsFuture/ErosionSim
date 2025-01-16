////////////////////////////////////////////////////////////////////////
//  
//    This file exists for rapid protyping demo purposes only. 
//
//	  These functions execute the animation and reset buttons that
//    are used in the demo.
//
////////////////////////////////////////////////////////////////////////


var codeHasExecuted = 0;

function playAnimation() {
	console.log("In playAnimation()...");
	// console.log("Hello", url("assets/demo/example1anim.gif"));
	const anim = document.getElementById("animation");

	if(!codeHasExecuted) {
		setTimeout(() => {
			const animURL = "assets/demo/emptySimAnim1x500.gif";
			const cacheBypassURL = `${animURL}?t=${new Date().getTime()}`; //this is necessary to prevent cache
			anim.style.backgroundImage = `url(${cacheBypassURL})`;
		}, 50);
	}
	else {
		setTimeout(() => {
			const animURL = "assets/demo/postCodeSimAnim1.gif";
			const cacheBypassURL = `${animURL}?t=${new Date().getTime()}`; //this is necessary to prevent cache
			anim.style.backgroundImage = `url(${cacheBypassURL})`;
		}, 50);
	}

	console.log("...leaving playAnimation()");
}

function resetAnimation() {
	console.log("In resetAnimation()...");
	// var resetBtn = document.getElementById("resetBtn");
	// resetBtn.style.backgroundImage = `url(assets/UI/btn_reset_pressed.png)`;
	
	
	var anim = document.getElementById("animation");
	if(!codeHasExecuted) {
		anim.style.backgroundImage = "url(assets/demo/emptySimAnim1-Frame1x500.png)";
	}
	else {
		anim.style.backgroundImage = "url(assets/demo/codeAnim1-FrameFinalx500.png)";
	}

	//restore button asset after timeout
	// setTimeout(() => {
	// 	resetBtn.style.backgroundImage = `url(assets/UI/btn-reset.png)`;
	// }, 350);
	
	console.log("...leaving resetAnimation()");
}

function runCode() {
	codeHasExecuted = 1;
	console.log("In runCode()...");
	var anim = document.getElementById("animation");
	setTimeout(() => {
		const animURL = "assets/demo/codeAnim1x500.gif";
		const cacheBypassURL = `${animURL}?t=${new Date().getTime()}`; //this is necessary to prevent cache
		anim.style.backgroundImage = `url(${cacheBypassURL})`;
	}, 50);
	console.log("...leaving runCode()");
}

function restoreEnvironment() {
	var restoreBtn = document.getElementById("restoreBtn");
	restoreBtn.style.backgroundImage = `url(assets/demo/btn-restore-pressedx500.png)`;
	
	codeHasExecuted = 0;
	var anim = document.getElementById("animation");
	anim.style.backgroundImage = "url(assets/demo/emptySimAnim1-Frame1x500.png)";

	//restore button asset after timeout
	setTimeout(() => {
		restoreBtn.style.backgroundImage = `url(assets/demo/btn-restorex500.png)`;
	}, 350);
	console.log("...leaving runCode()");
	
}