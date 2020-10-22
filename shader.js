const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  dimensions:[1024,1024],
  animate: true
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float time;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');
  void main () {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float alpha = smoothstep(0.25, 0.2475, dist);
    // vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(1.0, 2.0, 4.0));
    float n = noise(vec3(center * 1.5,time*0.2));
    vec3 color = hsl2rgb(
      0.7 + n * 0.3,
      0.5,
      0.5
    );
    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor:'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time
    }
  });
};

canvasSketch(sketch, settings);
