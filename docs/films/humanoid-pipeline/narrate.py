"""Narrate SCRIPT.md with local Kokoro (bm_george, Holt profile). Per-line speeds in speeds.json.
Writes assets/voice/NN.wav and voice-report.json (duration, spoken wpm, median F0)."""
import json, re, subprocess, pathlib
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
M = '/home/sheke/.cache/hyperframes/tts/models/kokoro-v1.0.onnx'; V = '/home/sheke/.cache/hyperframes/tts/voices/voices-v1.0.bin'
LEX = [('Deepgrid', 'Deep grid'), ('AI', 'A I'), ('—', ', ')]
k = Kokoro(M, V)
lines = [l.strip() for l in re.split(r'\n## \d+ — [^\n]+\n', open('SCRIPT.md').read())[1:]]
sp = json.load(open('speeds.json')) if pathlib.Path('speeds.json').exists() else {}
report = []
for i, text in enumerate(lines, 1):
    said = text
    for a, b in LEX: said = said.replace(a, b)
    s = float(sp.get(str(i), 1.0)); parts = []
    for sent in re.split(r'(?<=[.!?])\s+', said):
        a, sr = k.create(sent, voice='bm_george', speed=s, lang='en-gb'); parts += [a, np.zeros(int(0.55 * sr), dtype=a.dtype)]
    audio = np.concatenate([np.zeros(int(0.15 * sr), dtype=parts[0].dtype)] + parts[:-1] + [np.zeros(int(0.3 * sr), dtype=parts[0].dtype)])
    f = f'assets/voice/{i:02d}.wav'; sf.write(f, audio, sr)
    out = subprocess.run(['ffmpeg', '-i', f, '-af', 'silencedetect=n=-40dB:d=0.2', '-f', 'null', '-'], capture_output=True, text=True).stderr
    sil = sum(float(x) for x in re.findall(r'silence_duration: ([\d.]+)', out)); dur = len(audio) / sr
    words = len(said.replace('-', ' ').split()); wpm = words / (dur - sil) * 60
    report.append({'line': i, 'speed': s, 'duration': round(dur, 3), 'spoken_wpm': round(wpm, 1), 'text': text})
    print(i, 'speed', s, 'dur', round(dur, 2), 'wpm', round(wpm, 1))
json.dump(report, open('voice-report.json', 'w'), indent=1)
