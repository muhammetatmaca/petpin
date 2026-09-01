import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CosmicBackgroundProps {
  children?: React.ReactNode;
  core?: boolean;
  coreColor?: string;
  midColor?: string;
  accentColor?: string;
  outerColor?: string;
  detail?: number;
  brightness?: number;
  speed?: number;
  rotation?: number;
}

/**
 * 100% Full-Detail Originkit Cosmic BG — WebGL Rosette Nebula Shader Engine
 * Full 7-octave FBM fractal noise, highp float precision, and maximum gas filaments
 */
export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  children,
  core = true,
  coreColor = '#6823C3',
  midColor = '#007BFF',
  accentColor = '#9900FF',
  outerColor = '#F9F9F9',
  detail = 20,
  brightness = 32,
  speed = 30,
  rotation = 15,
}) => {
  const htmlContent = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
              background-color: #040914;
            }
            #glCanvas {
              width: 100%;
              height: 100%;
              display: block;
            }
          </style>
        </head>
        <body>
          <canvas id="glCanvas"></canvas>
          <script>
            // Official Originkit WebGL GLSL Shader Code (100% Full 7-Octave Detail)
            const VERT = \`
              attribute vec4 a_pos;
              void main() {
                gl_Position = a_pos;
              }
            \`;

            const FRAG = \`
              precision highp float;
              uniform float u_time;
              uniform vec2 u_res;
              uniform vec3 u_core;
              uniform bool u_showCore;
              uniform vec3 u_mid;
              uniform vec3 u_accent;
              uniform vec3 u_outer;
              uniform float u_complexity;
              uniform float u_bright;
              uniform float u_rotSpeed;

              mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

              float hash(vec2 p) {
                p = fract(p * vec2(123.34, 456.21));
                p += dot(p, p + 45.32);
                return fract(p.x * p.y);
              }

              float noise(vec2 p) {
                vec2 i = floor(p); vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
                           mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
              }

              // Full 7-Octave Fractal Brownian Motion (Maximum Filament Detail)
              float fbm(vec2 p) {
                float v = 0.0, a = 0.5;
                for (int i = 0; i < 7; i++) {
                  v += a * noise(p); p *= rot(0.5); p *= 2.1; a *= 0.5;
                }
                return v;
              }

              void main() {
                vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.y, u_res.x);
                float t = u_time * 0.1;

                p *= rot(u_time * u_rotSpeed * 0.05);

                float dist = length(p);
                float angleNoise = fbm(p * 3.0 + t * 0.5) * 0.3;
                float distortedDist = dist + angleNoise * smoothstep(0.5, 0.0, dist);

                vec2 nebP = p * u_complexity;
                vec2 q = vec2(fbm(nebP + vec2(cos(t), sin(t))), fbm(nebP + 1.2));
                vec2 r = vec2(fbm(nebP + 4.0 * q + t), fbm(nebP + 4.0 * q + 2.8));
                float f = fbm(nebP + 4.0 * r);

                float coreMask = smoothstep(0.8, 0.0, distortedDist) * (0.5 + 0.5 * smoothstep(0.1, 0.9, f));
                float coreGlow = exp(-3.0 * distortedDist);

                vec3 colCore = u_showCore ? u_core * (coreMask * 2.0 + coreGlow * 1.5) : vec3(0.0);

                float ring = smoothstep(0.05, 0.35, dist) * smoothstep(0.9, 0.3, dist);
                float filament = pow(f, 1.2);

                vec3 colMix = mix(u_mid, u_accent, smoothstep(0.2, 0.6, f));
                colMix = mix(colMix, u_outer, smoothstep(0.4, 0.9, f));
                vec3 colOuter = colMix * ring * filament * 2.0;

                float dust = smoothstep(0.3, 0.9, fbm(nebP * 1.5 + r));
                dust = mix(1.0, dust, smoothstep(0.0, 0.3, dist));

                vec3 finalCol = (colCore + colOuter) * dust * u_bright;
                finalCol += u_showCore ? u_mid * coreMask * ring * 0.8 : vec3(0.0);

                float lum = max(finalCol.r, max(finalCol.g, finalCol.b));
                gl_FragColor = vec4(finalCol, clamp(lum, 0.0, 1.0));
              }
            \`;

            function rgbOf(hexStr) {
              const hex = hexStr.replace('#', '');
              return [
                parseInt(hex.slice(0, 2), 16) / 255,
                parseInt(hex.slice(2, 4), 16) / 255,
                parseInt(hex.slice(4, 6), 16) / 255
              ];
            }

            const canvas = document.getElementById('glCanvas');
            const gl = canvas.getContext('webgl', {
              antialias: true,
              alpha: true,
              depth: false,
              premultipliedAlpha: true
            });

            function compile(gl, type, src) {
              const s = gl.createShader(type);
              if (!s) return null;
              gl.shaderSource(s, src);
              gl.compileShader(s);
              return s;
            }

            const vs = compile(gl, gl.VERTEX_SHADER, VERT);
            const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
            const program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);

            const u = {
              time: gl.getUniformLocation(program, "u_time"),
              res: gl.getUniformLocation(program, "u_res"),
              core: gl.getUniformLocation(program, "u_core"),
              showCore: gl.getUniformLocation(program, "u_showCore"),
              mid: gl.getUniformLocation(program, "u_mid"),
              accent: gl.getUniformLocation(program, "u_accent"),
              outer: gl.getUniformLocation(program, "u_outer"),
              complexity: gl.getUniformLocation(program, "u_complexity"),
              bright: gl.getUniformLocation(program, "u_bright"),
              rotSpeed: gl.getUniformLocation(program, "u_rotSpeed")
            };
            const aPos = gl.getAttribLocation(program, "a_pos");

            const quadBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);

            function resize() {
              const dpr = Math.min(2, window.devicePixelRatio || 1);
              const w = Math.round(window.innerWidth * dpr);
              const h = Math.round(window.innerHeight * dpr);
              if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
              }
            }

            const coreRGB = rgbOf("${coreColor}");
            const midRGB = rgbOf("${midColor}");
            const accentRGB = rgbOf("${accentColor}");
            const outerRGB = rgbOf("${outerColor}");

            const complexityVal = 1.0 + (${detail} / 20.0) * 4.0;
            const brightVal = (${brightness} / 100.0) * 3.0;
            const speedVal = ${speed} / 10.0;
            const rotVal = ${rotation} / 20.0;

            const start = performance.now();
            function render() {
              resize();
              const elapsed = (performance.now() - start) / 1000.0;
              gl.viewport(0, 0, canvas.width, canvas.height);
              gl.clearColor(0, 0, 0, 0);
              gl.clear(gl.COLOR_BUFFER_BIT);
              gl.useProgram(program);

              gl.uniform1f(u.time, elapsed * speedVal);
              gl.uniform2f(u.res, canvas.width, canvas.height);
              gl.uniform3fv(u.core, coreRGB);
              gl.uniform1i(u.showCore, ${core ? 1 : 0});
              gl.uniform3fv(u.mid, midRGB);
              gl.uniform3fv(u.accent, accentRGB);
              gl.uniform3fv(u.outer, outerRGB);
              gl.uniform1f(u.complexity, complexityVal);
              gl.uniform1f(u.bright, brightVal);
              gl.uniform1f(u.rotSpeed, rotVal);

              gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
              gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
              gl.enableVertexAttribArray(aPos);
              gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

              requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
          </script>
        </body>
      </html>
    `;
  }, [core, coreColor, midColor, accentColor, outerColor, detail, brightness, speed, rotation]);

  return (
    <View style={styles.container}>
      {/* 100% Full-Detail Originkit WebGL GLSL Shader Layer */}
      <View style={styles.webglLayer} pointerEvents="none">
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webView}
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          androidLayerType="hardware"
        />
      </View>

      {/* Onboarding Interactive Content Layer */}
      {children && <View style={styles.contentOverlay}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#040914',
    overflow: 'hidden',
  },
  webglLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  webView: {
    backgroundColor: '#040914',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  contentOverlay: {
    flex: 1,
    zIndex: 10,
  },
});
