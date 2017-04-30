// ------------------------ //
// ------Pointer Lock------ //
// ------------------------ //

var isFocussed;

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
	  document.mozPointerLockElement === canvas) {
	console.log('The pointer lock status is now locked');
	document.addEventListener("mousemove", updatePosition, false);
	isFocussed = true;
  } else {
	console.log('The pointer lock status is now unlocked');  
	document.removeEventListener("mousemove", updatePosition, false);
	isFocussed = false;
  }
}

function initPointerLock(canvas) {
	canvas.requestPointerLock = canvas.requestPointerLock ||
								canvas.mozRequestPointerLock;

	document.exitPointerLock = 	document.exitPointerLock ||
								document.mozExitPointerLock;

	canvas.onclick = function() {
	  canvas.requestPointerLock();
	};

	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
}
// ------------------------- //
// Float Array Concatanation //
// ------------------------- //

Float32Array.prototype.concat = function() {
	var bytesPerIndex = 4,
		buffers = Array.prototype.slice.call(arguments);
	
	// add self
	buffers.unshift(this);

	buffers = buffers.map(function (item) {
		if (item instanceof Float32Array) {
			return item.buffer;
		} else if (item instanceof ArrayBuffer) {
			if (item.byteLength / bytesPerIndex % 1 !== 0) {
				throw new Error('One of the ArrayBuffers is not from a Float32Array');	
			}
			return item;
		} else {
			throw new Error('You can only concat Float32Array, or ArrayBuffers');
		}
	});

	var concatenatedByteLength = buffers
		.map(function (a) {return a.byteLength;})
		.reduce(function (a,b) {return a + b;}, 0);

	var concatenatedArray = new Float32Array(concatenatedByteLength / bytesPerIndex);

	var offset = 0;
	buffers.forEach(function (buffer, index) {
		concatenatedArray.set(new Float32Array(buffer), offset);
		offset += buffer.byteLength / bytesPerIndex;
	});

	return concatenatedArray;
};
// ------------------------ //
// ----Window Animation---- //
// ------------------------ //

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/30);
         };
})();