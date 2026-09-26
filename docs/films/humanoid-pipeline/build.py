"""Builds the humanoid-pipeline explainer: index.html, compositions/captions.html, compositions/frames/*.html.
Inputs: SCRIPT.md, assets/voice/NN.wav, capture/words/NN.json (Groq whisper word timestamps).
Captions keep the script's spelling; timings come from whisper, aligned with difflib.
Scene content stays above y=880 (the caption band is 900-1080). All motion is seek-safe (no randomness at runtime)."""
import json, re, difflib, wave, random, html

LINES = [l.strip() for l in re.split(r'\n## \d+ — [^\n]+\n', open('SCRIPT.md').read())[1:]]
XF = 0.5  # crossfade
def wav_dur(f):
    with wave.open(f) as w: return w.getnframes() / w.getframerate()
DUR = [wav_dur(f'assets/voice/{i:02d}.wav') for i in range(1, 7)]
START = [round(sum(DUR[:i]), 3) for i in range(6)]
TOTAL = round(sum(DUR), 3)

# ---- align script words to whisper words
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
WORDS = []  # per line: list of (script_word, start, end) local to the line
for i, text in enumerate(LINES, 1):
    sw = text.split()
    ww = json.load(open(f'capture/words/{i:02d}.json'))['words']
    a = [norm(w) for w in sw]; b = [norm(w['word']) for w in ww]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    t = [None] * len(sw)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1): t[i1 + k] = (ww[j1 + k]['start'], ww[j1 + k]['end'])
        elif j2 > j1:  # replace: spread the whisper span over the script words
            s0, e0 = ww[j1]['start'], ww[j2 - 1]['end']; n = i2 - i1
            for k in range(n): t[i1 + k] = (s0 + (e0 - s0) * k / n, s0 + (e0 - s0) * (k + 1) / n)
    for k in range(len(t)):  # fill any gaps from neighbours
        if t[k] is None:
            prev = t[k - 1][1] if k and t[k - 1] else 0.0
            t[k] = (prev, prev + 0.25)
    WORDS.append([(w, round(s, 3), round(e, 3)) for w, (s, e) in zip(sw, t)])

def cue(line, needle, nth=0):
    """Local time (s) of the start of the script word containing `needle` in line `line` (1-based)."""
    hits = [s for w, s, e in WORDS[line - 1] if needle.lower() in w.lower()]
    assert len(hits) > nth, (line, needle)
    return round(hits[nth], 2)

# ---- captions: 2-4 words, break after punctuation
groups = []
for li, ws in enumerate(WORDS):
    cur = []
    for k, (w, s, e) in enumerate(ws):
        cur.append((w, s + START[li], e + START[li]))
        if len(cur) >= 4 or re.search(r'[.,!?;:]$', w) or k == len(ws) - 1 or (len(cur) >= 3 and len(w) > 9):
            groups.append(cur); cur = []
G = []
for gi, g in enumerate(groups):
    G.append({'id': f'caption-group-{gi}', 'frame': 0, 'start': round(g[0][1], 3), 'end': round(g[-1][2], 3), 'text': ' '.join(w for w, _, _ in g),
              'words': [{'id': f'caption-word-{gi}-{k}', 'text': w, 'start': round(s, 3), 'end': round(e, 3)} for k, (w, s, e) in enumerate(g)]})
for a, b in zip(G, G[1:]):  # a group holds until the next begins (no flicker), capped at 1.2 s of silence
    a['end'] = round(min(b['start'], a['end'] + 1.2), 3)
cap = open('compositions/captions.html').read()
cap = re.sub(r'var GROUPS = \[.*?\];', 'var GROUPS = ' + json.dumps(G, separators=(',', ':')) + ';', cap, flags=re.S)
cap = re.sub(r'data-duration="[\d.]+"', f'data-duration="{TOTAL}"', cap)
open('compositions/captions.html', 'w').write(cap)
vtt = ['WEBVTT', '']
fmt = lambda t: f'{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{t % 60:06.3f}'
for g in G: vtt += [f"{fmt(g['start'])} --> {fmt(g['end'])}", g['text'], '']
open('deepgrid-humanoid-pipeline.vtt', 'w').write('\n'.join(vtt))

# ---- shared frame chrome
FONTS = """
@font-face{font-family:"DG Serif";src:url("assets/fonts/georgia.ttf") format("truetype");font-weight:400;font-style:normal}
@font-face{font-family:"DG Serif";src:url("assets/fonts/georgiai.ttf") format("truetype");font-weight:400;font-style:italic}
@font-face{font-family:"DG Sans";src:url("assets/fonts/arial.ttf") format("truetype");font-weight:400}
@font-face{font-family:"DG Sans";src:url("assets/fonts/arialbd.ttf") format("truetype");font-weight:700}
@font-face{font-family:"DG Mono";src:url("assets/fonts/cour.ttf") format("truetype");font-weight:400}
"""
C = dict(bg='#101212', surf='#191d1b', ink='#eeeae2', mute='#a7b09f', line='#3d453b', cu='#d4a36e', hw='#bf7f3b', teal='#2f9e8c')
def base_css(p):
    return f"""
#root{{position:absolute;inset:0;color:{C['ink']};font-family:"DG Sans",sans-serif;overflow:hidden}}
#{p}-bg{{position:absolute;inset:0;background:{C['bg']}}}
#{p}-grid{{position:absolute;inset:0;opacity:.35;background-image:linear-gradient(#3d453b22 1px,transparent 1px),linear-gradient(90deg,#3d453b22 1px,transparent 1px);background-size:80px 80px}}
.{p}-kicker{{position:absolute;left:120px;top:92px;font-family:"DG Mono",monospace;font-size:24px;letter-spacing:4px;color:{C['cu']};text-transform:uppercase}}
.{p}-title{{position:absolute;left:120px;top:132px;font-family:"DG Serif",serif;font-size:76px;line-height:1.05;letter-spacing:-1.5px;color:{C['ink']};margin:0}}
.{p}-title em{{font-style:italic;color:#c5c2b3}}
.{p}-lbl{{position:absolute;font-family:"DG Mono",monospace;font-size:22px;letter-spacing:3px;color:{C['mute']};text-transform:uppercase;white-space:nowrap}}
.{p}-chip{{position:absolute;padding:14px 22px;border:2px solid {C['line']};border-radius:10px;background:{C['surf']};font-family:"DG Mono",monospace;font-size:24px;letter-spacing:3px;color:{C['ink']};text-transform:uppercase;white-space:nowrap}}
.{p}-chip.on{{border-color:{C['cu']};color:{C['cu']}}}
"""
def frame(fid, p, dur, css, body, tl):
    return f"""<template>
<style>
{FONTS}
{base_css(p)}
{css}
</style>
<div id="root" data-composition-id="{fid}" data-width="1920" data-height="1080">
  <div id="{p}-bg" class="clip" data-start="0" data-duration="{dur}" data-track-index="0"></div>
  <div id="{p}-grid" class="clip" data-start="0" data-duration="{dur}" data-track-index="1"></div>
  <div id="{p}-stage" class="clip" data-start="0" data-duration="{dur}" data-track-index="2">
{body}
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
(function(){{
  const tl = gsap.timeline({{ paused: true }});
  const E = "power3.out";
{tl}
  tl.to({{}}, {{ duration: {dur} }}, 0);
  window.__timelines["{fid}"] = tl;
}})();
</script>
</template>
"""
def head(p, kicker, title):
    return (f'    <div class="{p}-kicker" id="{p}-k">{kicker}</div>\n    <h1 class="{p}-title" id="{p}-t">{title}</h1>\n',
            f'  tl.from("#{p}-k",{{opacity:0,y:12,duration:.6,ease:E}},0.1);\n  tl.from("#{p}-t",{{opacity:0,y:24,duration:.8,ease:E}},0.2);\n')

def humanoid(gid, x, y, s=1.0, stroke=None):
    """A hairline humanoid, facing right, feet at (x, y). Joints are circles with ids gid-jN."""
    st = stroke or C['mute']
    def P(px, py): return f'{x + px * s:.1f},{y + py * s:.1f}'
    joints = {'j1': (-38, -318), 'j2': (-52, -250), 'j3': (-58, -190), 'j4': (38, -318), 'j5': (70, -262), 'j6': (104, -214), 'j7': (122, -200)}
    parts = [
        f'<rect x="{x - 34 * s:.1f}" y="{y - 420 * s:.1f}" width="{68 * s:.1f}" height="{78 * s:.1f}" rx="{22 * s:.1f}" fill="{C["surf"]}" stroke="{st}" stroke-width="2.5"/>',
        f'<rect x="{x - 2 * s:.1f}" y="{y - 398 * s:.1f}" width="{30 * s:.1f}" height="{14 * s:.1f}" rx="{7 * s:.1f}" fill="{C["cu"]}" opacity=".85" id="{gid}-visor"/>',
        f'<polygon points="{P(-44,-330)} {P(44,-330)} {P(34,-170)} {P(-34,-170)}" fill="{C["surf"]}" stroke="{st}" stroke-width="2.5"/>',
        f'<polyline points="{P(-38,-318)} {P(-52,-250)} {P(-58,-190)}" fill="none" stroke="{st}" stroke-width="5" stroke-linecap="round"/>',
        f'<polyline points="{P(38,-318)} {P(70,-262)} {P(104,-214)} {P(122,-200)}" fill="none" stroke="{st}" stroke-width="5" stroke-linecap="round" id="{gid}-arm"/>',
        f'<polyline points="{P(-18,-170)} {P(-26,-86)} {P(-22,0)}" fill="none" stroke="{st}" stroke-width="6" stroke-linecap="round"/>',
        f'<polyline points="{P(18,-170)} {P(30,-86)} {P(36,0)}" fill="none" stroke="{st}" stroke-width="6" stroke-linecap="round"/>',
        f'<line x1="{x - 50 * s:.1f}" y1="{y + 2:.1f}" x2="{x + 70 * s:.1f}" y2="{y + 2:.1f}" stroke="{C["line"]}" stroke-width="3" id="{gid}-floor"/>',
    ]
    for j, (jx, jy) in joints.items():
        parts.append(f'<circle id="{gid}-{j}" cx="{x + jx * s:.1f}" cy="{y + jy * s:.1f}" r="{7 * s:.1f}" fill="{C["bg"]}" stroke="{st}" stroke-width="2.5"/>')
    return f'<g id="{gid}">' + ''.join(parts) + '</g>'

FR = []
rng = random.Random(7)

# ---------------------------------------------------------------- 1 one loop
p = 'h1'; d = round(DUR[0] + XF, 3)
hd, htl = head(p, 'Use case · Humanoid robotics', 'One <em>loop</em>')
nodes = [('see', 'SEE', 1290, 320), ('decide', 'DECIDE', 1498, 680), ('move', 'MOVE', 1082, 680)]  # on a circle r=240 about (1290, 560)
node_svg = ''.join(f'<g id="{p}-n-{k}"><circle cx="{x}" cy="{y}" r="92" fill="{C["surf"]}" stroke="{C["line"]}" stroke-width="3" id="{p}-c-{k}"/>'
                   f'<text x="{x}" y="{y + 10}" text-anchor="middle" font-family="DG Mono" font-size="30" letter-spacing="4" fill="{C["ink"]}">{t}</text></g>' for k, t, x, y in nodes)
body = hd + f'''    <svg style="position:absolute;left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">
      {humanoid(p + "-bot", 470, 800, 1.25)}
      <path id="{p}-loop" d="M 1290 320 A 240 240 0 1 1 1289.9 320" fill="none" stroke="{C["cu"]}" stroke-width="4" stroke-dasharray="1600" stroke-dashoffset="1600" opacity=".8"/>
      {node_svg}
    </svg>
    <div class="{p}-chip" id="{p}-plat" style="left:1120px;top:140px">Deepgrid humanoid platform</div>
'''
tl = htl + f'''  tl.from("#{p}-bot",{{opacity:0,y:30,duration:1,ease:E}},0.3);
  tl.from("#{p}-n-see,#{p}-n-decide,#{p}-n-move",{{opacity:0,scale:.8,transformOrigin:"50% 50%",duration:.6,stagger:.15,ease:E}},0.6);
  tl.to("#{p}-c-see",{{stroke:"{C['cu']}",duration:.3}},{cue(1, "see")});
  tl.to("#{p}-c-decide",{{stroke:"{C['cu']}",duration:.3}},{cue(1, "decide")});
  tl.to("#{p}-c-move",{{stroke:"{C['cu']}",duration:.3}},{cue(1, "move")});
  tl.to("#{p}-loop",{{strokeDashoffset:0,duration:2.2,ease:"power1.inOut"}},{cue(1, "continuous")});
  tl.to("#{p}-bot-visor",{{opacity:.3,duration:.4,yoyo:true,repeat:5}},{cue(1, "beside")});
  tl.from("#{p}-plat",{{opacity:0,y:16,duration:.6,ease:E}},{cue(1, "humanoid", 1)});
'''
FR.append(('01-one-loop', p, d, '', body, tl))

# ---------------------------------------------------------------- 2 perception
p = 'h2'; d = round(DUR[1] + XF, 3)
hd, htl = head(p, 'Step 1', 'Perception')
def cloud(cx, cy, w, h, n, cls):
    pts = ''.join(f'<circle class="{cls}" cx="{cx + rng.uniform(-w / 2, w / 2):.1f}" cy="{cy + rng.uniform(-h / 2, h / 2):.1f}" r="{rng.choice([2.2, 2.8, 3.4])}" fill="{C["mute"]}"/>' for _ in range(n))
    return pts
objs = [('table', 'TABLE', 1180, 640, 360, 70), ('cup', 'CUP', 1120, 575, 50, 56), ('person', 'PERSON', 1560, 520, 110, 330)]
body_pts = cloud(1180, 640, 360, 70, 120, f'{p}-pt-table') + cloud(1120, 575, 50, 56, 40, f'{p}-pt-cup') + cloud(1560, 520, 110, 330, 160, f'{p}-pt-person') + cloud(1300, 790, 900, 30, 110, f'{p}-pt-floor')
boxes = ''.join(f'<g id="{p}-bx-{k}" opacity="0"><rect x="{x - w / 2 - 14}" y="{y - h / 2 - 14}" width="{w + 28}" height="{h + 28}" fill="none" stroke="{C["cu"]}" stroke-width="2.5" stroke-dasharray="10 6"/>'
                f'<text x="{x - w / 2 - 14}" y="{y - h / 2 - 26}" font-family="DG Mono" font-size="22" letter-spacing="3" fill="#e2b886">{t}</text></g>' for k, t, x, y, w, h in objs)
body = hd + f'''    <svg style="position:absolute;left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs><linearGradient id="{p}-cone" x1="0" x2="1"><stop offset="0" stop-color="{C['cu']}" stop-opacity=".35"/><stop offset="1" stop-color="{C['cu']}" stop-opacity="0"/></linearGradient></defs>
      <polygon id="{p}-cone1" points="330,395 1700,250 1700,820" fill="url(#{p}-cone)" opacity="0"/>
      <polygon id="{p}-cone2" points="330,395 1700,420 1700,860" fill="url(#{p}-cone)" opacity="0"/>
      {humanoid(p + "-bot", 300, 800, 1.0)}
      {body_pts}
      {boxes}
    </svg>
    <div class="{p}-lbl" id="{p}-l1" style="left:120px;top:300px">Camera + depth</div>
    <div class="{p}-chip" id="{p}-fuse" style="left:640px;top:300px">Multi-sensor fusion</div>
    <div class="{p}-chip" id="{p}-fps" style="left:1380px;top:120px">Depth · <span id="{p}-n">0</span> fps</div>
'''
tl = htl + f'''  tl.from("#{p}-bot",{{opacity:0,duration:.8,ease:E}},0.2);
  tl.from("#{p}-l1",{{opacity:0,duration:.5}},0.6);
  tl.to("#{p}-cone1",{{opacity:1,duration:.8}},{cue(2, "sensors")});
  tl.to("#{p}-cone2",{{opacity:1,duration:.8}},{cue(2, "sensors") + 0.3});
  tl.from("#{p}-fuse",{{opacity:0,y:14,duration:.6,ease:E}},{cue(2, "fused")});
  tl.from(".{p}-pt-floor,.{p}-pt-table,.{p}-pt-cup,.{p}-pt-person",{{opacity:0,scale:0,transformOrigin:"50% 50%",duration:.35,stagger:{{each:.006,from:"start"}},ease:E}},{cue(2, "three-dimensional")});
  tl.to("#{p}-bx-table",{{opacity:1,duration:.4}},{cue(2, "recognised")});
  tl.to("#{p}-bx-cup",{{opacity:1,duration:.4}},{cue(2, "recognised") + 0.3});
  tl.to("#{p}-bx-person",{{opacity:1,duration:.4}},{cue(2, "recognised") + 0.6});
  tl.from("#{p}-fps",{{opacity:0,y:14,duration:.5,ease:E}},{cue(2, "depth")});
  const n = {{v:0}}; tl.to(n,{{v:30,duration:1.4,ease:"power2.out",onUpdate:()=>{{document.getElementById("{p}-n").textContent=Math.round(n.v)}}}},{cue(2, "thirty")});
  tl.to(".{p}-pt-person",{{fill:"{C['cu']}",duration:.4,stagger:.002}},{cue(2, "second")});
'''
FR.append(('02-perception', p, d, '', body, tl))

# ---------------------------------------------------------------- 3 interpretation
p = 'h3'; d = round(DUR[2] + XF, 3)
hd, htl = head(p, 'Step 2', 'Interpretation')
bars = ''.join(f'<rect class="{p}-bar" x="{150 + i * 22}" y="{560 - (h := [20, 46, 70, 38, 88, 60, 30, 76, 52, 24, 64, 40, 18][i % 13]) / 2}" width="12" height="{h}" rx="6" fill="{C["cu"]}"/>' for i in range(20))
ctx = [('Cup on table', 820, 330), ('Person nearby', 820, 450), ('Path is clear', 820, 570)]
ctx_html = ''.join(f'    <div class="{p}-chip {p}-ctx" style="left:{x}px;top:{y}px">{t}</div>\n' for t, x, y in ctx)
body = hd + f'''    <svg style="position:absolute;left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">
      <rect x="120" y="470" width="500" height="180" rx="16" fill="{C['surf']}" stroke="{C['line']}" stroke-width="2.5" id="{p}-voice"/>
      {bars}
      <path id="{p}-a1" d="M 640 560 C 720 560 740 470 800 470" fill="none" stroke="{C['cu']}" stroke-width="3" stroke-dasharray="300" stroke-dashoffset="300"/>
      <path id="{p}-a2" d="M 1180 470 C 1260 470 1280 560 1360 560" fill="none" stroke="{C['cu']}" stroke-width="3" stroke-dasharray="300" stroke-dashoffset="300"/>
    </svg>
    <div class="{p}-lbl" id="{p}-vl" style="left:120px;top:430px">Voice command</div>
    <div id="{p}-quote" style="position:absolute;left:150px;top:680px;font-family:'DG Serif',serif;font-style:italic;font-size:40px;color:{C['ink']}">&ldquo;Bring me the cup.&rdquo;</div>
    <div class="{p}-lbl" id="{p}-cl" style="left:820px;top:290px">Context</div>
{ctx_html}    <div id="{p}-task" style="position:absolute;left:1380px;top:430px;width:420px;padding:30px;border:2px solid {C['cu']};border-radius:14px;background:{C['surf']}">
      <div style="font-family:'DG Mono',monospace;font-size:22px;letter-spacing:3px;color:{C['cu']}">DECISION</div>
      <div style="font-family:'DG Serif',serif;font-size:44px;margin-top:12px">Fetch the cup</div>
      <div style="font-family:'DG Mono',monospace;font-size:20px;letter-spacing:2px;color:{C['mute']};margin-top:14px">GIVE WAY TO THE PERSON</div>
    </div>
'''
tl = htl + f'''  tl.from(".{p}-ctx",{{opacity:0,x:-20,duration:.5,stagger:.35,ease:E}},{cue(3, "picture")});
  tl.from("#{p}-cl",{{opacity:0,duration:.4}},{cue(3, "picture")});
  tl.to("#{p}-a2",{{strokeDashoffset:0,duration:.7}},{cue(3, "decides")});
  tl.from("#{p}-task",{{opacity:0,x:30,duration:.7,ease:E}},{cue(3, "decides") + 0.3});
  tl.from("#{p}-voice,#{p}-vl",{{opacity:0,duration:.5}},{cue(3, "understands") - 0.6});
  tl.from(".{p}-bar",{{scaleY:.1,transformOrigin:"50% 50%",duration:.3,stagger:.04,ease:E}},{cue(3, "command")});
  tl.to(".{p}-bar",{{scaleY:.45,transformOrigin:"50% 50%",duration:.22,stagger:{{each:.03,repeat:3,yoyo:true}}}},{cue(3, "command") + 0.9});
  tl.from("#{p}-quote",{{opacity:0,y:10,duration:.5,ease:E}},{cue(3, "spoken")});
  tl.to("#{p}-a1",{{strokeDashoffset:0,duration:.7}},{cue(3, "plain")});
'''
FR.append(('03-interpretation', p, d, '', body, tl))

# ---------------------------------------------------------------- 4 planning
p = 'h4'; d = round(DUR[3] + XF, 3)
hd, htl = head(p, 'Step 3', 'Planning')
steps = ['Walk', 'Reach', 'Grasp', 'Return']
step_html = ''.join(f'    <div class="{p}-chip {p}-st" id="{p}-s{i}" style="left:{120 + i * 300}px;top:300px">{i + 1} · {t}</div>\n' for i, t in enumerate(steps))
jdots = ''.join(f'<circle class="{p}-jd" cx="{1330 + i * 62}" cy="760" r="16" fill="{C["bg"]}" stroke="{C["mute"]}" stroke-width="3"/>' for i in range(7))
body = hd + step_html + f'''    <svg style="position:absolute;left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">
      <rect x="120" y="400" width="1080" height="420" rx="14" fill="{C['surf']}" stroke="{C['line']}" stroke-width="2.5"/>
      <rect x="880" y="470" width="220" height="120" rx="8" fill="none" stroke="{C['mute']}" stroke-width="2.5"/>
      <circle cx="990" cy="530" r="16" fill="{C['cu']}" id="{p}-cup"/>
      <circle cx="640" cy="560" r="30" fill="none" stroke="{C['mute']}" stroke-width="2.5"/><text x="640" y="620" text-anchor="middle" font-family="DG Mono" font-size="20" letter-spacing="3" fill="{C['mute']}">PERSON</text>
      <circle cx="250" cy="720" r="26" fill="{C['bg']}" stroke="{C['cu']}" stroke-width="3" id="{p}-bot"/><text x="250" y="780" text-anchor="middle" font-family="DG Mono" font-size="20" letter-spacing="3" fill="{C['cu']}">ROBOT</text>
      <path id="{p}-path" d="M 276 712 C 420 700 470 740 560 700 C 700 640 760 700 850 610 L 880 590" fill="none" stroke="{C['cu']}" stroke-width="4" stroke-dasharray="14 10" opacity="0"/>
      {jdots}
    </svg>
    <div class="{p}-lbl" id="{p}-jl" style="left:1330px;top:680px">7 joints · on hold</div>
'''
tl = htl + f'''  tl.from(".{p}-st",{{opacity:0,y:16,duration:.5,stagger:.25,ease:E}},{cue(4, "broken")});
  tl.to("#{p}-s0",{{borderColor:"{C['cu']}",color:"{C['cu']}",duration:.3}},{cue(4, "steps")});
  tl.to("#{p}-path",{{opacity:1,duration:.3}},{cue(4, "motion")});
  tl.from("#{p}-path",{{strokeDashoffset:900,duration:1.8,ease:"power1.inOut"}},{cue(4, "motion")});
  tl.from(".{p}-jd,#{p}-jl",{{opacity:0,duration:.4,stagger:.06}},{cue(4, "single")});
  tl.to(".{p}-st",{{borderColor:"{C['cu']}",color:"{C['cu']}",duration:.3,stagger:.3}},{cue(4, "joint")});
'''
FR.append(('04-planning', p, d, '', body, tl))

# ---------------------------------------------------------------- 5 action
p = 'h5'; d = round(DUR[4] + XF, 3)
hd, htl = head(p, 'Step 4', 'Action')
# a large 7-joint arm
J = [(250, 780), (330, 640), (470, 560), (620, 600), (740, 520), (820, 440), (880, 400)]
arm = f'<polyline points="{" ".join(f"{x},{y}" for x, y in J)}" fill="none" stroke="{C["mute"]}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'
arm += ''.join(f'<g class="{p}-joint" id="{p}-j{i}"><circle cx="{x}" cy="{y}" r="20" fill="{C["bg"]}" stroke="{C["mute"]}" stroke-width="4"/><text x="{x}" y="{y - 34}" text-anchor="middle" font-family="DG Mono" font-size="20" fill="{C["mute"]}">J{i + 1}</text></g>' for i, (x, y) in enumerate(J))
arm += f'<path d="M 880 400 l 40 -10 m -40 10 l 34 26" stroke="{C["cu"]}" stroke-width="6" stroke-linecap="round" fill="none" id="{p}-grip"/>'
body = hd + f'''    <svg style="position:absolute;left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">
      <rect x="200" y="780" width="110" height="40" rx="6" fill="{C['surf']}" stroke="{C['line']}" stroke-width="2.5"/>
      {arm}
      <g id="{p}-bal">{humanoid(p + "-walk", 1040, 820, .62)}<line x1="1040" y1="560" x2="1040" y2="822" stroke="{C['cu']}" stroke-width="2" stroke-dasharray="6 6" id="{p}-com"/></g>
      <g id="{p}-tele"><rect x="1560" y="300" width="130" height="220" rx="18" fill="{C['surf']}" stroke="{C['mute']}" stroke-width="3"/><rect x="1578" y="330" width="94" height="150" rx="4" fill="{C['bg']}"/>
        <path class="{p}-wave" d="M 1520 400 q -24 30 0 60" fill="none" stroke="{C['cu']}" stroke-width="3"/><path class="{p}-wave" d="M 1498 385 q -34 45 0 90" fill="none" stroke="{C['cu']}" stroke-width="3"/></g>
      <g id="{p}-film">{''.join(f'<rect class="{p}-fr" x="{1340 + i * 76}" y="640" width="64" height="44" rx="4" fill="{C["surf"]}" stroke="{C["mute"]}" stroke-width="2"/>' for i in range(5))}</g>
    </svg>
    <div class="{p}-chip" id="{p}-dof" style="left:120px;top:300px">7 DOF · sub-millimetre</div>
    <div class="{p}-lbl" id="{p}-bl" style="left:900px;top:500px">Balance · locomotion</div>
    <div class="{p}-lbl" id="{p}-tl" style="left:1500px;top:250px">Mobile teleoperation</div>
    <div class="{p}-lbl" id="{p}-fl" style="left:1340px;top:710px">Learning from real-world video</div>
'''
tl = htl + f'''  tl.from(".{p}-joint",{{opacity:0,scale:.6,transformOrigin:"50% 50%",duration:.4,stagger:.12,ease:E}},{cue(5, "Motor")});
  tl.from("#{p}-dof",{{opacity:0,y:14,duration:.5,ease:E}},{cue(5, "seven")});
  tl.to(".{p}-joint circle",{{stroke:"{C['cu']}",duration:.25,stagger:.18}},{cue(5, "degrees")});
  tl.to("#{p}-grip",{{rotation:-12,transformOrigin:"0% 50%",duration:.3,yoyo:true,repeat:3}},{cue(5, "precision")});
  tl.from("#{p}-bal,#{p}-bl",{{opacity:0,duration:.5}},{cue(5, "motion-control")});
  tl.to("#{p}-walk",{{rotation:4,transformOrigin:"1040px 820px",duration:.5,yoyo:true,repeat:5,ease:"sine.inOut"}},{cue(5, "balanced")});
  tl.to("#{p}-com",{{stroke:"{C['teal']}",duration:.3}},{cue(5, "walks")});
  tl.from("#{p}-tele,#{p}-tl",{{opacity:0,y:14,duration:.5,ease:E}},{cue(5, "operator")});
  tl.from(".{p}-wave",{{opacity:0,duration:.3,stagger:.2,repeat:2,yoyo:true}},{cue(5, "remotely")});
  tl.from(".{p}-fr,#{p}-fl",{{opacity:0,x:-30,duration:.4,stagger:.1,ease:E}},{cue(5, "learning")});
  tl.to(".{p}-fr",{{stroke:"{C['cu']}",duration:.25,stagger:.1}},{cue(5, "video")});
'''
FR.append(('05-action', p, d, '', body, tl))

# ---------------------------------------------------------------- 6 close
p = 'h6'; d = round(DUR[5], 3)
words = ['Perception', 'Interpretation', 'Planning', 'Action']
wx = [120, 530, 1010, 1400]
row = ''.join(f'    <div class="{p}-chip {p}-w" id="{p}-w{i}" style="left:{x}px;top:360px">{w}</div>\n' for i, (w, x) in enumerate(zip(words, wx)))
arrows = ''.join(f'<path d="M {x0} 392 L {x1} 392" stroke="{C["line"]}" stroke-width="3" marker-end="url(#{p}-ah)" class="{p}-ar"/>' for x0, x1 in [(460, 515), (935, 995), (1320, 1385)])
body = f'''    <svg style="position:absolute;left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs><marker id="{p}-ah" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{C['cu']}"/></marker></defs>
      {arrows}
    </svg>
{row}    <img id="{p}-logo" src="assets/img/d.png" style="position:absolute;left:120px;top:540px;width:72px;height:72px" alt=""/>
    <div id="{p}-tag" style="position:absolute;left:220px;top:540px;font-family:'DG Serif',serif;font-size:64px;line-height:1.1">From silicon <em style="color:#c5c2b3">to motion.</em></div>
    <div class="{p}-lbl" id="{p}-note" style="left:120px;top:760px;color:{C['cu']}">Illustration of the pipeline · not recorded footage</div>
    <div class="{p}-lbl" id="{p}-src" style="left:120px;top:800px;font-size:18px">Source: deepgridsemi.com/use-cases/humanoids</div>
'''
tl = ''.join(f'  tl.from("#{p}-w{i}",{{opacity:0,y:16,duration:.45,ease:E}},{cue(6, w.lower())});\n  tl.to("#{p}-w{i}",{{borderColor:"{C["cu"]}",color:"{C["cu"]}",duration:.3}},{cue(6, w.lower()) + 0.2});\n' for i, w in enumerate(words))
tl += f'''  tl.from(".{p}-ar",{{opacity:0,duration:.4,stagger:.3}},{cue(6, "interpretation")});
  tl.from("#{p}-logo,#{p}-tag",{{opacity:0,y:20,duration:.8,ease:E}},{cue(6, "silicon")});
  tl.from("#{p}-note,#{p}-src",{{opacity:0,duration:.6}},{cue(6, "illustration")});
'''
FR.append(('06-close', p, d, '', body, tl))

for fid, p, dur, css, body, tl in FR:
    open(f'compositions/frames/{fid}.html', 'w').write(frame(fid, p, dur, css, body, tl))

# ---- index.html
clips, trans = [], []
for i, (fid, p, dur, *_ ) in enumerate(FR):
    clips.append(f'''      <div id="el-{fid}" class="scene" data-composition-id="{fid}" data-composition-src="compositions/frames/{fid}.html" data-start="{round(START[i], 3)}" data-duration="{dur}" data-track-index="{i % 2}"></div>
      <audio id="el-{fid}-voice" src="assets/voice/{i + 1:02d}.wav" data-start="{round(START[i], 3)}" data-duration="{round((START[i + 1] if i < 5 else sum(DUR)) - START[i] - 0.002, 3)}" data-track-index="10" data-volume="1"></audio>''')
    if i:
        a = FR[i - 1][0]; t = round(START[i], 3)
        trans.append(f'        tl.to("#el-{a}", {{ opacity: 0, duration: {XF}, ease: "power2.inOut" }}, {t});\n        tl.fromTo("#el-{fid}", {{ opacity: 0 }}, {{ opacity: 1, duration: {XF}, ease: "power2.inOut" }}, {t});\n        tl.addLabel("hf:transition:{a}:{fid}:crossfade", {t});')
idx = open('../dg32-fault-path-explained/index.html').read()
head_html = idx.split('<body>')[0]
open('index.html', 'w').write(head_html + f'''<body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1920" data-height="1080">
{chr(10).join(clips)}
      <div id="el-captions" data-track-kind="captions" class="scene" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{TOTAL}" data-track-index="2"></div>
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
      (function () {{ var tl = window.__timelines["main"];
{chr(10).join(trans)}
        tl.to({{}}, {{ duration: {TOTAL} }}, 0);
      }})();
    </script>
  </body>
</html>
''')
print('total', TOTAL, 'frames', [round(x, 2) for x in DUR], 'caption groups', len(G))
