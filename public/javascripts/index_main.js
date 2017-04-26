var gl;

function initGL(canvas) {
	try {
		gl = canvas.getContext("webgl2");
		console.log(gl);
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

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPos");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
	shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");

}

var mMatrix = mat4.create();
var vMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
}

var triangleArray;
var squareArray;

function initVertexArrays() {
	// Triangle Array
	triangleArray = gl.createVertexArray();
	gl.bindVertexArray(triangleArray);

	var positions = new Float32Array([
		0.0, 1.0, 0.0,
		-1.0, -1.0, 0.0,
		1.0, -1.0, 0.0

	]);

	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(0);

	var colors = new Float32Array([
		1.0, 0.0, 0.0,1.0,
		0.0, 1.0, 0.0,1.0,
		0.0, 0.0, 1.0,1.0
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
		1.0,1.0,0.0,
		-1.0,1.0,0.0,
		1.0,-1.0,0.0,
		-1.0,-1.0,0.0
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


}

function drawScene(){
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Initialize MVP Matrices
	mat4.perspective(pMatrix,45,gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	mat4.identity(vMatrix);
	mat4.identity(mMatrix);

	mat4.translate(mMatrix,mMatrix,[-1.5, 0.0, -7.0]);
	gl.bindVertexArray(triangleArray);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	gl.bindVertexArray(null);

	mat4.translate(mMatrix, mMatrix,[3.0,0.0,0.0]);
	gl.bindVertexArray(squareArray);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	gl.bindVertexArray(null);


}

function start() {
	// Initialize canvas context as WebGL
	var canvas = document.getElementById("screen");
	initGL(canvas);

	initShaders();
	initVertexArrays();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	drawScene();

}