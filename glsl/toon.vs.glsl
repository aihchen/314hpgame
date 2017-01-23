varying vec3 interpolatedNormal;
varying vec3 interpolatedPosition;
varying vec3 eyeVector;

void main() {
    
    //normalized interpolated vertex normal ("n")
	interpolatedNormal = normalize(normalMatrix * normal);
	//fragment position
	interpolatedPosition = position;
	//eye vector
	eyeVector = -vec3(modelViewMatrix * vec4(position, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}