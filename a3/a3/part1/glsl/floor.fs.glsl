// Textures are passed in as uniforms

      in vec2 texCoord;
      uniform sampler2D colorMap;

void main() {

    gl_FragColor = texture(colorMap,texCoord);
}