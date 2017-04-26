#version 300 es
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec4 aColor;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

out vec4 vColor;

void main() {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPos, 1.0);
    vColor = aColor;
}
