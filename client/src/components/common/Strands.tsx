import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import "./Strands.css";

const MAX_STRANDS = 12;
const MAX_COLORS = 8;

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;
out vec4 fragColor;
const float PI = 3.14159265;
vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int index = int(floor(scaled));
  float blend = fract(scaled);
  int nextIndex = index + 1;
  if (nextIndex >= uColorCount) nextIndex = 0;
  return mix(uColors[index], uColors[nextIndex], blend);
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);
  float energy = 0.06 + uIntensity * 0.94;
  float envelope = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);
  vec3 color = vec3(0.0);
  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;
    float strand = float(i);
    float phase = strand * 1.7 * uSpread;
    float frequency = (2.0 + strand * 0.35) * uWaviness;
    float velocity = 1.4 + strand * 1.2;
    float time = uTime * uSpeed;
    float wave = sin(uv.x * frequency + time * velocity + phase) * 0.60
      + sin(uv.x * frequency * 1.1 - time * velocity * 0.7 + phase * 1.7) * 0.40;
    float y = wave * (0.1 + 0.02 * energy) * envelope * uAmplitude;
    float distanceToStrand = abs(uv.y - y);
    float strandThickness = (0.001 + 0.05 * energy) * (0.35 + envelope) * uThickness;
    float glow = strandThickness / (distanceToStrand + strandThickness * 0.45);
    glow *= glow;
    color += samplePalette(strand / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04) * glow * envelope;
  }
  color *= 0.45 + 0.7 * energy;
  color = 1.0 - exp(-color * uGlow);
  float grayscale = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = max(mix(vec3(grayscale), color, uSaturation), 0.0);
  float alpha = clamp(max(max(color.r, color.g), color.b), 0.0, 1.0) * uOpacity;
  fragColor = vec4(color * uOpacity, alpha);
}
`;

export interface StrandsProps {
  colors: string[];
  count: number;
  speed: number;
  amplitude: number;
  waviness: number;
  thickness: number;
  glow: number;
  taper: number;
  spread: number;
  intensity: number;
  saturation: number;
  opacity: number;
  scale: number;
  reducedMotion?: boolean;
  className?: string;
}

function buildPalette(colors: string[]) {
  const palette = colors.length ? colors : ["#ffffff"];
  return Array.from({ length: MAX_COLORS }, (_, index) => {
    const color = new Color(palette[index] ?? palette[palette.length - 1]);
    return [color.r, color.g, color.b];
  });
}

/** A deliberately low-cost adaptation of the supplied React Bits OGL Strands effect. */
export function Strands({ className = "", reducedMotion = false, ...props }: StrandsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 1.25), webgl: 2 });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const geometry = new Triangle(gl);
    delete geometry.attributes.uv;
    const program = new Program(gl, {
      vertex: VERTEX_SHADER, fragment: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 }, uResolution: { value: [1, 1] }, uColors: { value: buildPalette(props.colors) },
        uColorCount: { value: Math.min(props.colors.length, MAX_COLORS) }, uStrandCount: { value: Math.min(props.count, MAX_STRANDS) },
        uSpeed: { value: props.speed }, uAmplitude: { value: props.amplitude }, uWaviness: { value: props.waviness }, uThickness: { value: props.thickness },
        uGlow: { value: props.glow }, uTaper: { value: props.taper }, uSpread: { value: props.spread }, uIntensity: { value: props.intensity },
        uOpacity: { value: props.opacity }, uScale: { value: props.scale }, uSaturation: { value: props.saturation },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    let frameId = 0;
    const render = (time: number) => {
      const current = propsRef.current;
      program.uniforms.uTime.value = reducedMotion ? 0 : time * 0.001;
      program.uniforms.uColors.value = buildPalette(current.colors);
      program.uniforms.uColorCount.value = Math.min(current.colors.length, MAX_COLORS);
      program.uniforms.uStrandCount.value = Math.min(Math.max(Math.round(current.count), 1), MAX_STRANDS);
      program.uniforms.uSpeed.value = current.speed;
      program.uniforms.uAmplitude.value = current.amplitude;
      program.uniforms.uWaviness.value = current.waviness;
      program.uniforms.uThickness.value = current.thickness;
      program.uniforms.uGlow.value = current.glow;
      program.uniforms.uTaper.value = current.taper;
      program.uniforms.uSpread.value = current.spread;
      program.uniforms.uIntensity.value = current.intensity;
      program.uniforms.uOpacity.value = current.opacity;
      program.uniforms.uScale.value = current.scale;
      program.uniforms.uSaturation.value = current.saturation;
      renderer.render({ scene: mesh });
      if (!reducedMotion) frameId = requestAnimationFrame(render);
    };
    render(0);
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reducedMotion]);

  return <div ref={containerRef} aria-hidden="true" className={`strands-container ${className}`} />;
}
