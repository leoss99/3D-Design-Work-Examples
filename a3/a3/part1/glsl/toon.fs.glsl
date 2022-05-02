// HINT: Don't forget to define the uniforms here after you pass them in in A3.js
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform float kAmbient;

uniform vec3 diffuseColor;
uniform float kDiffuse;

uniform vec3 toonColor;
uniform vec3 toonColor2;
uniform vec3 outlineColor;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 viewPosition;
in float fresnel;

void main() {
    // HINT: Compute the light intensity the current fragment by determining
    // the cosine angle between the surface normal and the light vector
    float intensity = 1.0;

  //AMBIENT
  vec3 light_AMB =  kAmbient * ambientColor;
  
  //DIFFUSE
  float l_dot_n = dot(lightDirection, interpolatedNormal);
  vec3 light_DFF = vec3(max(0.0, l_dot_n)) * kDiffuse ;

  //TOTAL
  vec3 TOTAL = light_AMB + light_DFF;

  intensity = length(TOTAL);


    // HINT: Define ranges of light intensity values to shade. GLSL has a
    // built-in `ceil` function that you could use to determine the nearest
    // light intensity range.

    
    // HINT: You should use two tones of colors here; `toonColor` is a cyan
    // color for brighter areas and `toonColor2` is a blue for darker areas.
    // Use the light intensity to blend the two colors, there should be 3 distinct
    // colour regions 

  vec4 resultingColor = vec4(0.0,0.0,0.0,0.0);
	
	if (intensity > 0.75){
		resultingColor = vec4(mix(toonColor,toonColor2,0.9), 1.0);
	}
	else if (intensity > 0.5){
		resultingColor = vec4(mix(toonColor,toonColor2,0.6), 1.0);
	} 
	else if (intensity > 0.25){
		resultingColor = vec4(mix(toonColor,toonColor2,0.35), 1.0);
	}
	else{
		resultingColor = vec4(mix(toonColor,toonColor2,0.1), 1.0);
	}

    if(fresnel<0.2) {                 
      resultingColor = vec4(0.0, 0.0 , 0.0, 1.0);
    }


    gl_FragColor = resultingColor;
}
