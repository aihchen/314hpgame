varying vec3 interpolatedNormal;
varying vec3 interpolatedPosition;
varying vec3 eyeVector;

//uniform variables are constants pulled from JS
uniform vec3 lightPosition; //L diffuse dot product
uniform vec3 litColor; 
uniform vec3 unLitColor;
uniform vec3 outlineColor;
uniform vec3 lightColor; //I_light
uniform float toneBalance;


// Source 1 : Section 10.3.2, Fundamentals of Computer Graphics (Marschner/Shirley)
void main() {
	
	// l = lightPosition - fragmentPosition
	vec3 lightVector = normalize(lightPosition - interpolatedPosition);
	// n dot l
	float ctwShadingDot = max(dot(interpolatedNormal, lightVector), 0.0);
	// warmth constant = (1 + (n dot l)) / 2
	float kWarmth = (1.0+ctwShadingDot)/2.0;
	// color = (warmth constant)*warm color + (1 - warmth constant)*cool color
	vec3 ctwColor = vec3(kWarmth * litColor + (1.0-kWarmth) * unLitColor);

	//v = eye - vertexPosition
	vec3 viewVector = normalize(eyeVector - interpolatedPosition);
	// v dot n
	float silhouetteDot = dot(viewVector, interpolatedNormal);
	vec3 highlightColor = vec3(ctwColor*1.5);
	vec3 lessHighlightColor = vec3(ctwColor*1.25);
	vec3 shadowColor = vec3(ctwColor/1.25);
	vec3 moreShadowColor = vec3(ctwColor/1.5);

	if (silhouetteDot <= 0.25) {
		gl_FragColor = vec4(moreShadowColor, 0.0);
	} else if (silhouetteDot <= 0.5) {
		gl_FragColor = vec4(shadowColor, 0.0);
	} else if (silhouetteDot >= 0.95) {
		gl_FragColor = vec4(highlightColor, 0.0);
	} else if (silhouetteDot >= 0.85) {
		gl_FragColor = vec4(lessHighlightColor, 0.0);
	} else {
		gl_FragColor = vec4(ctwColor, 1.0);
	}

}
