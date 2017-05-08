var gl;

function initGL(canvas) {
	try {
		// WebGL2 Allows VAOs and use of GLSL 3.0
		gl = canvas.getContext("webgl2");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function getShader(gl, id) {
	var script = document.getElementById(id);
	
	if(!script){
		return null;
	}

	var str = "";
	var k = script.firstChild;
	while(k){
		if(k.nodeType == 3){
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (script.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (script.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

var shaderProgram;
var textureShader;
// var depthShader;

function initShaders() {
	var frag = getShader(gl, 'shader-fs');
	var vert = getShader(gl, 'shader-vs');

	shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, frag);
	gl.attachShader(shaderProgram, vert);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	// Initialize uniforms and attributes
	gl.useProgram(shaderProgram);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
	shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");

	// Texture Shader
	var frag_tex = getShader(gl, 'shader-tex-fs');
	var vert_tex = getShader(gl, 'shader-tex-vs');

	textureShader = gl.createProgram();

	gl.attachShader(textureShader, frag_tex);
	gl.attachShader(textureShader, vert_tex);

	gl.linkProgram(textureShader);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise Texture shader");
	}

	textureShader.pMatrixUniform = gl.getUniformLocation(textureShader, "uPMatrix");
	textureShader.vMatrixUniform = gl.getUniformLocation(textureShader, "uVMatrix");
	textureShader.mMatrixUniform = gl.getUniformLocation(textureShader, "uMMatrix");
	textureShader.texSampUniform = gl.getUniformLocation(textureShader, "tex");

}



var mMatrix = mat4.create();
var vMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms(shader) {

	gl.uniformMatrix4fv(shader.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shader.vMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shader.mMatrixUniform, false, mMatrix);
	// if(shader.texSampUniform != undefined){
	// 	// console.log(shader)
	// 	gl.activeTexture(gl.TEXTURE0);
	// 	// gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
	// 	gl.uniform1i(shader.texSampUniform, 0);
	// }

}

var triangleArray;
var squareArray;
var cubeArray;
// var cubeTexArray;

function initVertexArrays() {
	// Triangle Array
		triangleArray = gl.createVertexArray();
		gl.bindVertexArray(triangleArray);

		var positions = new Float32Array([
			 0.0, 1.0, 0.0,
			-1.0,-1.0, 0.0,
			 1.0,-1.0, 0.0

		]);

		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(0);

		var colors = new Float32Array([
			 1.0, 0.0, 0.0, 1.0,
			 0.0, 1.0, 0.0, 1.0,
			 0.0, 0.0, 1.0, 1.0
		]);

		var colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
		gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(1);
		gl.bindVertexArray(null);
	// Square array
		squareArray = gl.createVertexArray();
		gl.bindVertexArray(squareArray);

		var squarePos = new Float32Array([
			 1.0, 1.0, 0.0,
			-1.0, 1.0, 0.0,
			 1.0,-1.0, 0.0,
			-1.0,-1.0, 0.0
		]);

		var sqPosBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sqPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, squarePos, gl.STATIC_DRAW);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(0);

		var sqcolors = new Float32Array([
			0.5, 0.5, 1.0, 1.0,
			0.5, 0.5, 1.0, 1.0,
			0.5, 0.5, 1.0, 1.0,
			0.5, 0.5, 1.0, 1.0
		]);

		var sqcolorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sqcolorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, sqcolors, gl.STATIC_DRAW);
		gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(1);
		gl.bindVertexArray(null);
	// Cube Array
		cubeArray = gl.createVertexArray();
		gl.bindVertexArray(cubeArray);

		var cubePos = new Float32Array([
				//front
				-1.0,-1.0,1.0,
				 1.0,-1.0,1.0,
				-1.0, 1.0,1.0,
				-1.0, 1.0,1.0,
				 1.0,-1.0,1.0,
				 1.0, 1.0,1.0,

				//right
				 1.0,-1.0, 1.0,
				 1.0,-1.0,-1.0,
				 1.0, 1.0, 1.0,
				 1.0, 1.0, 1.0,
				 1.0,-1.0,-1.0,
				 1.0, 1.0,-1.0,

				//back
				 1.0,-1.0,-1.0,
				-1.0,-1.0,-1.0,
				 1.0, 1.0,-1.0,
				 1.0, 1.0,-1.0,
				-1.0,-1.0,-1.0,
				-1.0, 1.0,-1.0,

				//left
				-1.0,-1.0,-1.0,
				-1.0,-1.0, 1.0,
				-1.0, 1.0,-1.0,
				-1.0, 1.0,-1.0,
				-1.0,-1.0, 1.0,
				-1.0, 1.0, 1.0,

				//top
				-1.0, 1.0, 1.0,
				 1.0, 1.0, 1.0,
				-1.0, 1.0,-1.0,
				-1.0, 1.0,-1.0,
				 1.0, 1.0, 1.0,
				 1.0, 1.0,-1.0,

				//bottom
				-1.0,-1.0,-1.0,
				 1.0,-1.0,-1.0,
				-1.0,-1.0, 1.0,
				-1.0,-1.0, 1.0,
				 1.0,-1.0,-1.0,
				 1.0,-1.0, 1.0
		])

		var cubePosBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubePosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, cubePos, gl.STATIC_DRAW);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(0);


		var cubeColors = [
				new Float32Array([1.0, 0.0, 0.0, 1.0]), // Front face
				new Float32Array([1.0, 1.0, 0.0, 1.0]), // Back face
				new Float32Array([0.0, 1.0, 0.0, 1.0]), // Top face
				new Float32Array([1.0, 0.5, 0.5, 1.0]), // Bottom face
				new Float32Array([1.0, 0.0, 1.0, 1.0]), // Right face
				new Float32Array([0.0, 0.0, 1.0, 1.0])  // Left face
			];
		var unpackedColors = new Float32Array([]);



		for (var i in cubeColors) {
			var color = cubeColors[i];
			for (var j=0; j < 6; j++) {
				unpackedColors = unpackedColors.concat(color);
			}
		}

		var cubeColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, unpackedColors, gl.STATIC_DRAW);

		gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(1);
		gl.bindVertexArray(null);
	// Cube Textured
		// cubeTexArray = gl.createVertexArray();
		// gl.bindVertexArray(cubeTexArray);

		// var cubeTexPosBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexPosBuffer);
		// gl.bufferData(gl.ARRAY_BUFFER, cubePos, gl.STATIC_DRAW);

		// gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		// gl.enableVertexAttribArray(0);

		// var cubeUVs = new Float32Array([
		// 	//front
		// 	0, 0,
		// 	1, 0,
		// 	0, 1,
		// 	0, 1,
		// 	1, 0,
		// 	1, 1,

		// 	//right
		// 	0, 0,
		// 	1, 0,
		// 	0, 1,
		// 	0, 1,
		// 	1, 0,
		// 	1, 1,

		// 	//back
		// 	0, 0,
		// 	1, 0,
		// 	0, 1,
		// 	0, 1,
		// 	1, 0,
		// 	1, 1,

		// 	//left
		// 	0, 0,
		// 	1, 0,
		// 	0, 1,
		// 	0, 1,
		// 	1, 0,
		// 	1, 1,

		// 	//top
		// 	0, 0,
		// 	1, 0,
		// 	0, 1,
		// 	0, 1,
		// 	1, 0,
		// 	1, 1,

		// 	//bottom
		// 	0, 0,
		// 	1, 0,
		// 	0, 1,
		// 	0, 1,
		// 	1, 0,
		// 	1, 1
		// ]);

		// var cubeTexUVBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexUVBuffer);
		// gl.bufferData(gl.ARRAY_BUFFER, cubeUVs, gl.STATIC_DRAW);

		// gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
		// gl.enableVertexAttribArray(1);
		// // gl.bindVertexArray(null);

		// gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
		// gl.bufferData(gl.ARRAY_BUFFER, unpackedColors, gl.STATIC_DRAW);

		// gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0);
		// gl.enableVertexAttribArray(2);
		// gl.bindVertexArray(null);
}

var cam = new Camera([0,2,0]);

function drawScene(){
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Initialize MVP Matrices
	mat4.perspective(pMatrix,45,gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	mat4.identity(vMatrix);
	mat4.identity(mMatrix);

	// View Matrix is given by the Camera
	vMatrix = cam.getViewMatrix();

	mat4.translate(mMatrix,mMatrix,[-1.5, 0.0, -7.0]);

	gl.bindVertexArray(cubeArray);
	gl.useProgram(shaderProgram);
	setMatrixUniforms(shaderProgram);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	gl.bindVertexArray(null);

	// gl.bindVertexArray(cubeTexArray);
	// gl.useProgram(textureShader);
	// setMatrixUniforms(textureShader);
	// gl.drawArrays(gl.TRIANGLES, 0, 36);
	// gl.bindVertexArray(null);


	mat4.translate(mMatrix, mMatrix,[3.0,0.0,0.0]);

	gl.bindVertexArray(triangleArray);
	gl.useProgram(shaderProgram);
	setMatrixUniforms(shaderProgram);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	gl.bindVertexArray(null);

}


function updatePosition(e) {
	cam.processMouseMovement(e.movementX, -e.movementY);
}

var keys = [];
document.onkeydown = function(e){
	if(isFocussed && !e.repeat){
		var x = e.keyCode || e.which;
		switch(x){
			// Left
			case 65:
				keys["L"] = new Date().getTime();
				break;
			// right
			case 68:
				keys["R"] = new Date().getTime();
				break;
			// Back
			case 83:
				keys["B"] = new Date().getTime();
				break;
			// Forward
			case 87:
				keys["F"] = new Date().getTime();
				break;
		}
	}
}

document.onkeyup = function(e){
	if(isFocussed){
		var x = e.keyCode || e.which;
		switch(x){
			// Left
			case 65:
				keys["L"] = undefined;
				break;
			// right
			case 68:
				keys["R"] = undefined;
				break;
			// Back
			case 83:
				keys["B"] = undefined;
				break;
			// Forward
			case 87:
				keys["F"] = undefined;
				break;
		}
	}
}

// Function for each frame Tick
function frameTick(){
	requestAnimationFrame(frameTick);
	drawScene();
	animate();
}

var lastTime = 0;

function animate() {
	var timeNow = new Date().getTime();
	if(lastTime != 0){
		for(var key in keys){
			// console.log(keys[key]);
			if(keys[key]){
				cam.processKeyboard(key,new Date().getTime()-keys[key]);
				keys[key] = new Date().getTime();
			}
		}
	}
	lastTime = timeNow;

}

function handleLoadedTexture(texture) {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	// gl.bindTexture(gl.TEXTURE_2D, null);
}


var texture;

// function initTexture(callback) {
// 	texture = gl.createTexture();
// 	texture.image = new Image();
// 	texture.image.onload = callback;
// 	// texture.image.src = "/images/khronos_webgl.png"
// 	texture.image.src = "/images/wood.jpg"
// }


var canvas;
function start() {
	canvas = document.getElementById("screen");

	initGL(canvas);
	initPointerLock(canvas);
	initShaders();
	initVertexArrays();

	// var iTex = new Promise(
	// 	(resolve, reject) => {
	// 		texture = gl.createTexture();
	// 		texture.image = new Image();
	// 		texture.image.onload = callback;
	// 		// texture.image.src = "/images/khronos_webgl.png"
	// 		texture.image.src = "/images/wood.jpg"
	// 	}
	// );

	// initTexture(function () {
	// 	handleLoadedTexture(texture)
	// 	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// 	gl.enable(gl.DEPTH_TEST);
		
	// 	gl.enable(gl.CULL_FACE);
	// 	gl.cullFace(gl.BACK);
		
	// 	frameTick();
	// });

	objMesh("/objects/cube/cube.obj");


	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	frameTick();

}