#version 300 es
layout (location = 0) in vec3 position;
layout (location = 1) in vec2 uv;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

out vec2 vTexCoord;

void main(){
	gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(position, 1.0);
	vTexCoord = uv;
}