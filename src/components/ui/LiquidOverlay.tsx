import { useEffect, useRef } from "react";
import { UseTheme } from "../../contexts/ThemeContext";
import { UseWidth } from "../../contexts/WidthContext";

// ── Shaders ───────────────────────────────────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform vec2  u_mouse_prev;
uniform float u_time;
uniform vec3  u_color1;
uniform vec3  u_color2;

vec2 hash2(vec2 p) {
    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
    return mix(
        mix(dot(hash2(i),f), dot(hash2(i+vec2(1,0)),f-vec2(1,0)), u.x),
        mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)), dot(hash2(i+vec2(1,1)),f-vec2(1,1)), u.x),
    u.y);
}
float fbm(vec2 p) {
    float v=0.0, a=0.5, fr=1.0;
    for(int i=0;i<4;i++){v+=a*noise(p*fr);fr*=2.1;a*=0.5;}
    return v;
}

void main() {
    vec2 uv  = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    vec2 st  = vec2(uv.x*asp, uv.y);

    // mouse in same aspect space
    vec2 m     = vec2(u_mouse.x*asp,      u_mouse.y);
    vec2 mprev = vec2(u_mouse_prev.x*asp, u_mouse_prev.y);

    // ── velocity of mouse movement ──────────────────────────
    vec2  vel     = m - mprev;
    float speed   = length(vel) * 18.0;          // how hard the push is
    vec2  velDir  = length(vel) > 0.0001 ? normalize(vel) : vec2(0.0);

    // ── distance and direction from cursor ──────────────────
    float dist    = length(st - m);
    vec2  toPoint = st - m;
    vec2  normPt  = dist > 0.0001 ? toPoint / dist : vec2(0.0);

    // ── push displacement — water pushed away from cursor ───
    // The cursor pushes water outward, strongest just behind movement direction
    float push = dot(normPt, -velDir);       // -1 = directly in front of cursor
    float pushShape = exp(-dist * 5.5)       // falls off with distance
                    * exp(-push * 2.0)       // strongest perpendicular trail
                    * speed;                 // scales with mouse velocity

    // ── wake trail — ripples left behind as cursor moves ────
    // These travel outward from where the cursor WAS
    float trailDist = length(st - mprev);
    float wake = sin(trailDist * 22.0 - u_time * 6.0)
               * exp(-trailDist * 4.5)
               * exp(-u_time * 0.0)         // doesn't fade (loop handles it)
               * clamp(speed * 0.6, 0.0, 1.0);

    // ── ambient liquid motion (very subtle background) ──────
    float t = u_time * 0.12;
    vec2 q = vec2(fbm(st + t), fbm(st + vec2(5.2, 1.3) + t * 0.8));
    float ambient = fbm(st + 3.5 * q + t * 0.5) * 0.5 + 0.5;

    // ── combine ──────────────────────────────────────────────
    float liquid = clamp(ambient * 0.3 + pushShape * 0.5 + wake * 0.35, 0.0, 1.0);

    // ── surface normal from displacement field ───────────────
    float eps = 0.012;
    float lx  = clamp(ambient * 0.3 + exp(-length(st+vec2(eps,0)-m)*5.5)*pushShape*0.5, 0.0, 1.0);
    float ly  = clamp(ambient * 0.3 + exp(-length(st+vec2(0,eps)-m)*5.5)*pushShape*0.5, 0.0, 1.0);
    vec2  grad = vec2(lx - liquid, ly - liquid) * 5.0;
    vec3  N    = normalize(vec3(-grad.x, -grad.y, 1.0));

    // ── natural light: comes slightly from above-left ────────
    vec3  lightPos = vec3(m + vec2(-0.2, 0.3), 1.2);
    vec3  lightDir = normalize(lightPos - vec3(st, 0.0));
    float diff     = max(dot(N, lightDir), 0.0);

    // specular — sharp natural reflection, warm white
    vec3  viewDir = vec3(0.0, 0.0, 1.0);
    vec3  halfDir = normalize(lightDir + viewDir);
    float spec    = pow(max(dot(N, halfDir), 0.0), 64.0)
                  * exp(-dist * 2.5);        // only near cursor

    // ── color ────────────────────────────────────────────────
    vec3 baseCol  = mix(u_color1, u_color2, ambient);
    vec3 col = baseCol * (0.2 + diff * 0.8)
             + vec3(1.0, 0.97, 0.92) * spec * 0.3;

    // ── alpha — mostly invisible, spikes where cursor pushes ─
    float alpha = clamp(
        liquid * 0.28
        + pushShape * 0.35
        + spec * 0.10
        + wake * 0.2,
        0.0, 0.75
    );

    gl_FragColor = vec4(col, alpha);
}`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function hex2rgb(hex: string): [number,number,number] {
    const n = parseInt(hex.replace("#",""), 16);
    return [(n>>16&255)/255, (n>>8&255)/255, (n&255)/255];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error("Shader compile error: " + gl.getShaderInfoLog(s));
    return s;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LiquidOverlay() {
    const { theme } = UseTheme();
    const { width } = UseWidth()
    const isDark    = theme !== "light";

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef  = useRef<{
        gl:   WebGLRenderingContext;
        prog: WebGLProgram;
        u:    Record<string, WebGLUniformLocation | null>;
    } | null>(null);
    const mouseRef  = useRef({ x: 0.5, y: 0.5 });
    const lerpRef     = useRef({ x: 0.5, y: 0.5 });
    const prevLerpRef = useRef({ x: 0.5, y: 0.5 });
    const rafRef    = useRef(0);
    const t0Ref     = useRef(performance.now());

    // ── Init WebGL once ───────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Size canvas to viewport
        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            stateRef.current?.gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener("resize", resize);

        // WebGL context
        const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
        if (!gl) { console.error("[LiquidOverlay] WebGL not available"); return; }

        // Compile & link
        let prog: WebGLProgram;
        try {
            prog = gl.createProgram()!;
            gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER,   VERT));
            gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
                throw new Error(gl.getProgramInfoLog(prog) ?? "link failed");
        } catch(e) {
            console.error("[LiquidOverlay] Shader error:", e);
            return;
        }

        gl.useProgram(prog);

        // Fullscreen quad
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
        const a = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(a);
        gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

        // Uniform locations
        const u: Record<string, WebGLUniformLocation | null> = {};
        ["u_res","u_mouse","u_mouse_prev","u_time","u_color1","u_color2"].forEach(n => {
            u[n] = gl.getUniformLocation(prog, n);
        });

        // Blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        stateRef.current = { gl, prog, u };

        // Mouse
        const onMouse = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX / window.innerWidth;
            mouseRef.current.y = 1 - e.clientY / window.innerHeight;
        };
        window.addEventListener("mousemove", onMouse);

        console.log("[LiquidOverlay] WebGL initialized ✓");

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouse);
        };
    }, []);

    // ── Render loop — restarts on theme change ────────────────────────────────
    useEffect(() => {
        const s = stateRef.current;
        const canvas = canvasRef.current;
        if (!s || !canvas) return;

        const { gl, u } = s;
        const c1 = isDark ? hex2rgb("#8e2de2") : hex2rgb("#0062FF");
        const c2 = isDark ? hex2rgb("#4a00e0") : hex2rgb("#0080ff");

        cancelAnimationFrame(rafRef.current);

        const loop = () => {
            // lerp mouse
            // store previous smoothed mouse position
            prevLerpRef.current.x = lerpRef.current.x;
            prevLerpRef.current.y = lerpRef.current.y;
            // lerp toward actual mouse
            lerpRef.current.x += (mouseRef.current.x - lerpRef.current.x) * 0.14;
            lerpRef.current.y += (mouseRef.current.y - lerpRef.current.y) * 0.14;

            const t = (performance.now() - t0Ref.current) / 1000;

            gl.uniform2f(u["u_res"],    canvas.width, canvas.height);
            gl.uniform2f(u["u_mouse"],      lerpRef.current.x, lerpRef.current.y);
            gl.uniform2f(u["u_mouse_prev"], prevLerpRef.current.x, prevLerpRef.current.y);
            gl.uniform1f(u["u_time"],   t);
            gl.uniform3fv(u["u_color1"], c1);
            gl.uniform3fv(u["u_color2"], c2);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            rafRef.current = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(rafRef.current);
    }, [isDark]);

    if (width <= 768) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position:      "fixed",
                top:           0,
                left:          0,
                width:         "100vw",
                height:        "100vh",
                zIndex:        9998,
                pointerEvents: "none",
                display:       "block",
                mixBlendMode:  "screen",
            }}
            aria-hidden="true"
        />
    );
}