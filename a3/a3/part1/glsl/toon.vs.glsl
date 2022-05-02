// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 spherePosition;

// The shared variable is initialized in the vertex shader and attached to the current vertex being processed,
// such that each vertex is given a shared variable and when passed to the fragment shader,
// these values are interpolated between vertices and across fragments,
// below we can see the shared variable is initialized in the vertex shader using the 'out' classifier
out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 viewPosition;
out float fresnel;

void main() {
    // Compute the vertex position in VCS
    viewPosition = vec3(viewMatrix * modelMatrix * vec4(position, 1.0));

    // Compute the light direction in VCS
    lightDirection = normalize(vec3(viewMatrix * vec4(spherePosition, 1.0)) - viewPosition);

    // Interpolate the normal
    interpolatedNormal = normalize(normalMatrix * normal);

    // HINT: Use the surface normal in VCS and the eye direction to determine
    // if the current vertex lies on the silhouette edge of the model, i.e. calculate the fresnel value
    vec3 viewDirection;                           // Point at camera/eye      
    vec3 viewNormal;                              // HINT: Needs to be in VCS

    viewDirection = normalize(viewPosition);
    viewNormal = normalize(vec3(viewMatrix*vec4(interpolatedNormal,0.0)));
    
    fresnel = max(0.0, dot(viewNormal, -viewDirection));
    

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
