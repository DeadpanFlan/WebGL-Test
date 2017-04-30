#version 300 es
precision highp float;

in vec2 vTexCoord;

uniform sampler2D tex;

out vec4 FragColor;

void main(){
	FragColor = vec4(texture(tex, vTexCoord).rgb, 1.0);
}