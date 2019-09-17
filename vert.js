var vertCode =
  `attribute vec2 coordinates;

  varying vec2 coord;

  void main(void) {
    gl_Position = vec4(coordinates,0.0, 1);

    coord = coordinates;
  }`;