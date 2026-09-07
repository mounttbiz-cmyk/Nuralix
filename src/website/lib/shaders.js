/* ============================================================================
   SHADERS — shared by every layer of the neural field.
   ========================================================================== */

export const MORPH_GLSL = /* glsl */`
attribute vec3 aP1, aP2, aP3, aP4, aP5, aP6;
uniform float uMorph;
vec3 morphPos () {
  float m = uMorph;
  vec3 p = position;
  p = mix(p, aP1, smoothstep(0.0, 1.0, clamp(m,       0.0, 1.0)));
  p = mix(p, aP2, smoothstep(0.0, 1.0, clamp(m - 1.0, 0.0, 1.0)));
  p = mix(p, aP3, smoothstep(0.0, 1.0, clamp(m - 2.0, 0.0, 1.0)));
  p = mix(p, aP4, smoothstep(0.0, 1.0, clamp(m - 3.0, 0.0, 1.0)));
  p = mix(p, aP5, smoothstep(0.0, 1.0, clamp(m - 4.0, 0.0, 1.0)));
  p = mix(p, aP6, smoothstep(0.0, 1.0, clamp(m - 5.0, 0.0, 1.0)));
  return p;
}`;

export const POINT_VERT = /* glsl */`
${MORPH_GLSL}
attribute float aSize, aRand, aPhase;
uniform float uTime, uSize, uDrift, uEnergy, uPR;
varying float vRand, vA, vD;
void main () {
  vec3 p = morphPos();
  float t = uTime + aPhase * 6.2831853;
  p += vec3(sin(t * 0.33 + p.y * 0.045), cos(t * 0.29 + p.x * 0.045), sin(t * 0.24 + p.z * 0.045))
       * uDrift * (0.6 + aRand * 1.4);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = -mv.z;
  float pulse = 0.68 + 0.32 * sin(t * 1.25 + aRand * 4.0);
  vD = d; vRand = aRand;
  vA = pulse * (1.0 + uEnergy * 0.85);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uSize * uPR * (250.0 / max(d, 1.0)) * (0.75 + 0.45 * pulse);
}`;

export const POINT_FRAG = /* glsl */`
precision highp float;
uniform vec3 uColA, uColB; uniform float uOpacity, uFogN, uFogF;
varying float vRand, vA, vD;
void main () {
  vec2 uv = gl_PointCoord - 0.5;
  float d = dot(uv, uv);
  if (d > 0.25) discard;
  float core = 1.0 - smoothstep(0.0, 0.25, d);
  float glow = pow(core, 2.6);
  vec3 col = mix(uColA, uColB, vRand);
  col = mix(col, vec3(1.0), pow(core, 8.0) * 0.55);
  float fog = 1.0 - smoothstep(uFogN, uFogF, vD);
  float a = glow * vA * uOpacity * fog * 0.55;
  if (a < 0.002) discard;
  gl_FragColor = vec4(col, a);
}`;

export const LINE_VERT = /* glsl */`
${MORPH_GLSL}
attribute float aRand, aPhase, aLen;
uniform float uTime, uDrift, uEnergy;
varying float vRand, vD, vA;
void main () {
  vec3 p = morphPos();
  float t = uTime + aPhase * 6.2831853;
  p += vec3(sin(t * 0.33 + p.y * 0.045), cos(t * 0.29 + p.x * 0.045), sin(t * 0.24 + p.z * 0.045))
       * uDrift * (0.6 + aRand * 1.4);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vD = -mv.z; vRand = aRand;
  float flick = 0.55 + 0.45 * sin(t * 0.9 + aLen * 2.0);
  vA = mix(1.0, flick, 0.55) * (1.0 + uEnergy * 1.2) * (1.0 - aLen * 0.45);
  gl_Position = projectionMatrix * mv;
}`;

export const LINE_FRAG = /* glsl */`
precision highp float;
uniform vec3 uColA, uColB; uniform float uOpacity, uFogN, uFogF;
varying float vRand, vD, vA;
void main () {
  float fog = 1.0 - smoothstep(uFogN, uFogF, vD);
  float a = vA * uOpacity * fog;
  if (a < 0.002) discard;
  gl_FragColor = vec4(mix(uColA, uColB, vRand), a);
}`;

export const BG_VERT = /* glsl */`
varying vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }`;

export const BG_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform vec3 uTop, uBot, uGlow;
uniform vec2 uGlowPos, uRes;
uniform float uTime, uStr;

float hash (vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise (vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm (vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main () {
  vec2 uv = vUv;
  float ar = uRes.x / max(uRes.y, 1.0);
  vec3 col = mix(uBot, uTop, smoothstep(0.0, 1.0, pow(uv.y, 0.85)));

  vec2 gp = (uv - uGlowPos) * vec2(ar, 1.0);
  float g = exp(-dot(gp, gp) * 3.6);
  col += uGlow * g * uStr * 0.50;

  vec2 gp2 = (uv - vec2(uGlowPos.x * 0.4 + 0.3, uGlowPos.y * 0.3 + 0.75)) * vec2(ar, 1.0);
  col += uGlow * exp(-dot(gp2, gp2) * 9.0) * uStr * 0.16;

  float n = fbm(uv * vec2(ar, 1.0) * 3.2 + vec2(uTime * 0.012, uTime * 0.008));
  col += uGlow * (n - 0.5) * 0.11 * uStr;
  col *= 1.0 + (fbm(uv * 9.0 - uTime * 0.02) - 0.5) * 0.10;

  float vig = smoothstep(1.25, 0.28, length((uv - 0.5) * vec2(ar, 1.0)));
  col *= mix(0.38, 1.0, vig);

  col += (hash(uv * uRes + uTime) - 0.5) / 190.0;   // dither: kills banding
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`;

export const GLOW_VERT = /* glsl */`
varying vec2 vUv;
uniform float uScale;
void main () {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  mv.xy += position.xy * uScale;
  gl_Position = projectionMatrix * mv;
}`;

export const GLOW_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform vec3 uColA, uColB; uniform float uOpacity, uTime;
void main () {
  vec2 p = vUv - 0.5;
  float d = length(p) * 2.0;
  if (d > 1.0) discard;
  float core = pow(1.0 - d, 3.0);
  float halo = pow(1.0 - d, 1.25) * 0.55;
  float ray = 0.5 + 0.5 * sin(atan(p.y, p.x) * 6.0 + uTime * 0.55);
  vec3 col = mix(uColB, uColA, core);
  col = mix(col, vec3(1.0), pow(core, 2.2) * 0.9);
  float a = (core * 1.35 + halo * (0.75 + 0.25 * ray)) * uOpacity;
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}`;
