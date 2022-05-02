// HINT: Don't forget to define the uniforms here after you pass them in in A3.js
uniform vec3 toonColor;
uniform vec3 toonColor2;
uniform float ticks;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 vertexPosition;

void main() {

    vec3 newV = vertexPosition+vec3(ticks,ticks,ticks);

    vec3 modPos = vec3(mod(newV.x, 0.15), mod(newV.y, 0.15), mod(newV.z, 0.15));

    // HINT: Compute the light intensity the current fragment by determining
    // the cosine angle between the surface normal and the light vector.
    float intensity;
    intensity = dot(interpolatedNormal,lightDirection);

    // HINT: Pick any two colors and blend them based on light intensity
    // to give the 3D model some color and depth.
    vec3 out_Stripe = mix(toonColor,toonColor2,intensity);

    if(modPos.x<0.05 || modPos.y<0.05 || modPos.z<0.05)   discard; 
 
    gl_FragColor = vec4(out_Stripe, 1.0);
}
