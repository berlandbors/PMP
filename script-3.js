// ===== BANJO SAMPLER - AUDIO SAMPLE PLAYBACK =====
class BanjoSampler {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.samples = new Map(); // MIDI note -> {forte: AudioBuffer, piano: AudioBuffer}
        this.isLoaded = false;
        
        // Note mapping: note name to chromatic offset
        this.NOTE_MAP = {
            'C': 0, 'Cs': 1, 'D': 2, 'Ds': 3, 'E': 4, 'F': 5,
            'Fs': 6, 'G': 7, 'Gs': 8, 'A': 9, 'As': 10, 'B': 11
        };
    }

    // Parse filename to extract note info
    parseFileName(filename) {
        // Format: banjo_C3_very-long_forte_normal.mp3
        const match = filename.match(/banjo_([A-G]s?)(\d)_very-long_(forte|piano)_normal\.mp3/);
        if (!match) return null;
        
        const [, noteName, octave, dynamic] = match;
        // Formula: MIDI = (octave + 1) * 12 + NOTE_MAP[note]
        const midiNote = (parseInt(octave) + 1) * 12 + this.NOTE_MAP[noteName];
        
        return { midiNote, dynamic };
    }

    async loadSamples() {
        console.log('🎵 Начинается загрузка сэмплов банджо...');
        
        try {
            // Get list of sample files
            const files = [
                'banjo_C3_very-long_forte_normal.mp3', 'banjo_C3_very-long_piano_normal.mp3',
                'banjo_Cs3_very-long_forte_normal.mp3', 'banjo_Cs3_very-long_piano_normal.mp3',
                'banjo_D3_very-long_forte_normal.mp3', 'banjo_D3_very-long_piano_normal.mp3',
                'banjo_Ds3_very-long_forte_normal.mp3', 'banjo_Ds3_very-long_piano_normal.mp3',
                'banjo_E3_very-long_forte_normal.mp3', 'banjo_E3_very-long_piano_normal.mp3',
                'banjo_F3_very-long_forte_normal.mp3', 'banjo_F3_very-long_piano_normal.mp3',
                'banjo_Fs3_very-long_forte_normal.mp3', 'banjo_Fs3_very-long_piano_normal.mp3',
                'banjo_G3_very-long_forte_normal.mp3', 'banjo_G3_very-long_piano_normal.mp3',
                'banjo_Gs3_very-long_forte_normal.mp3', 'banjo_Gs3_very-long_piano_normal.mp3',
                'banjo_A3_very-long_forte_normal.mp3', 'banjo_A3_very-long_piano_normal.mp3',
                'banjo_As3_very-long_forte_normal.mp3', 'banjo_As3_very-long_piano_normal.mp3',
                'banjo_B3_very-long_forte_normal.mp3', 'banjo_B3_very-long_piano_normal.mp3',
                'banjo_C4_very-long_forte_normal.mp3', 'banjo_C4_very-long_piano_normal.mp3',
                'banjo_Cs4_very-long_forte_normal.mp3', 'banjo_Cs4_very-long_piano_normal.mp3',
                'banjo_D4_very-long_forte_normal.mp3', 'banjo_D4_very-long_piano_normal.mp3',
                'banjo_Ds4_very-long_forte_normal.mp3', 'banjo_Ds4_very-long_piano_normal.mp3',
                'banjo_E4_very-long_forte_normal.mp3', 'banjo_E4_very-long_piano_normal.mp3',
                'banjo_F4_very-long_forte_normal.mp3', 'banjo_F4_very-long_piano_normal.mp3',
                'banjo_Fs4_very-long_forte_normal.mp3', 'banjo_Fs4_very-long_piano_normal.mp3',
                'banjo_G4_very-long_piano_normal.mp3',
                'banjo_Gs4_very-long_forte_normal.mp3', 'banjo_Gs4_very-long_piano_normal.mp3',
                'banjo_A4_very-long_forte_normal.mp3', 'banjo_A4_very-long_piano_normal.mp3',
                'banjo_As4_very-long_forte_normal.mp3', 'banjo_As4_very-long_piano_normal.mp3',
                'banjo_B4_very-long_forte_normal.mp3', 'banjo_B4_very-long_piano_normal.mp3',
                'banjo_C5_very-long_forte_normal.mp3', 'banjo_C5_very-long_piano_normal.mp3',
                'banjo_Cs5_very-long_forte_normal.mp3',
                'banjo_D5_very-long_forte_normal.mp3', 'banjo_D5_very-long_piano_normal.mp3',
                'banjo_Ds5_very-long_forte_normal.mp3', 'banjo_Ds5_very-long_piano_normal.mp3',
                'banjo_E5_very-long_forte_normal.mp3', 'banjo_E5_very-long_piano_normal.mp3',
                'banjo_F5_very-long_forte_normal.mp3', 'banjo_F5_very-long_piano_normal.mp3',
                'banjo_Fs5_very-long_forte_normal.mp3', 'banjo_Fs5_very-long_piano_normal.mp3',
                'banjo_G5_very-long_forte_normal.mp3', 'banjo_G5_very-long_piano_normal.mp3',
                'banjo_Gs5_very-long_piano_normal.mp3',
                'banjo_A5_very-long_forte_normal.mp3', 'banjo_A5_very-long_piano_normal.mp3',
                'banjo_As5_very-long_forte_normal.mp3', 'banjo_As5_very-long_piano_normal.mp3',
                'banjo_B5_very-long_forte_normal.mp3', 'banjo_B5_very-long_piano_normal.mp3',
                'banjo_C6_very-long_forte_normal.mp3',
                'banjo_Cs6_very-long_forte_normal.mp3',
                'banjo_D6_very-long_forte_normal.mp3',
                'banjo_Ds6_very-long_forte_normal.mp3',
                'banjo_E6_very-long_forte_normal.mp3'
            ];
            
            // Load all samples
            const loadPromises = files.map(async (filename) => {
                try {
                    const response = await fetch(`Piano/${filename}`);
                    if (!response.ok) {
                        console.warn(`⚠️ Файл не найден: ${filename}`);
                        return;
                    }
                    
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                    
                    const info = this.parseFileName(filename);
                    if (info) {
                        if (!this.samples.has(info.midiNote)) {
                            this.samples.set(info.midiNote, {});
                        }
                        this.samples.get(info.midiNote)[info.dynamic] = audioBuffer;
                    }
                } catch (error) {
                    console.warn(`⚠️ Ошибка загрузки ${filename}:`, error);
                }
            });
            
            await Promise.all(loadPromises);
            this.isLoaded = true;
            console.log(`✅ Загружено ${this.samples.size} нот`);
            
        } catch (error) {
            console.error('❌ Ошибка загрузки сэмплов:', error);
            throw error;
        }
    }

    // Find nearest available sample
    findNearestSample(targetNote, dynamic) {
        // Try exact match first
        if (this.samples.has(targetNote)) {
            const sample = this.samples.get(targetNote);
            if (sample[dynamic]) {
                return { note: targetNote, buffer: sample[dynamic] };
            }
            // Try opposite dynamic if requested not available
            const oppositeDynamic = dynamic === 'forte' ? 'piano' : 'forte';
            if (sample[oppositeDynamic]) {
                return { note: targetNote, buffer: sample[oppositeDynamic] };
            }
        }
        
        // Find nearest note
        let nearestNote = targetNote;
        let minDistance = Infinity;
        
        for (const [note, sample] of this.samples.entries()) {
            const distance = Math.abs(note - targetNote);
            if (distance < minDistance) {
                if (sample[dynamic] || sample['forte'] || sample['piano']) {
                    minDistance = distance;
                    nearestNote = note;
                }
            }
        }
        
        const sample = this.samples.get(nearestNote);
        const buffer = sample[dynamic] || sample['forte'] || sample['piano'];
        
        return { note: nearestNote, buffer };
    }

    play(note, velocity, duration, time) {
        if (!this.isLoaded) {
            console.warn('⚠️ Сэмплы еще не загружены');
            return null;
        }
        
        try {
            // Choose dynamic layer based on velocity
            const dynamic = velocity > 64 ? 'forte' : 'piano';
            
            // Find appropriate sample
            const { note: sourceNote, buffer } = this.findNearestSample(note, dynamic);
            
            if (!buffer) {
                console.warn(`⚠️ Не найден сэмпл для ноты ${note}`);
                return null;
            }
            
            // Create buffer source
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            
            // Apply pitch shifting if needed
            if (sourceNote !== note) {
                const semitonesDiff = note - sourceNote;
                source.playbackRate.value = Math.pow(2, semitonesDiff / 12);
            }
            
            // Start playback
            source.start(time);
            source.stop(time + duration + 0.1);
            
            return source;
            
        } catch (error) {
            console.error('❌ Ошибка воспроизведения ноты:', error);
            return null;
        }
    }
}

// ===== MIDI ПАРСЕР (УЛУЧШЕННЫЙ) =====
class MIDIParser {
    constructor(arrayBuffer) {
        this.data = new DataView(arrayBuffer);
        this.pos = 0;
    }

    readString(length) {
        let str = '';
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode(this.data.getUint8(this.pos++));
        }
        return str;
    }

    readUInt32() {
        const val = this.data.getUint32(this.pos);
        this.pos += 4;
        return val;
    }

    readUInt24() {
        const val = (this.data.getUint8(this.pos) << 16) |
                   (this.data.getUint8(this.pos + 1) << 8) |
                    this.data.getUint8(this.pos + 2);
        this.pos += 3;
        return val;
    }

    readUInt16() {
        const val = this.data.getUint16(this.pos);
        this.pos += 2;
        return val;
    }

    readUInt8() {
        return this.data.getUint8(this.pos++);
    }

    readVarLen() {
        let value = 0;
        let byte;
        do {
            byte = this.readUInt8();
            value = (value << 7) | (byte & 0x7f);
        } while (byte & 0x80);
        return value;
    }

    parse() {
        const header = this.readString(4);
        if (header !== 'MThd') {
            throw new Error('Неверный MIDI файл');
        }

        const headerLength = this.readUInt32();
        const format = this.readUInt16();
        const trackCount = this.readUInt16();
        const timeDivision = this.readUInt16();

        let ticksPerBeat = timeDivision;
        let isSMPTE = false;
        let framesPerSecond = 0;
        let ticksPerFrame = 0;

        if (timeDivision & 0x8000) {
            isSMPTE = true;
            framesPerSecond = -(timeDivision >> 8);
            ticksPerFrame = timeDivision & 0xFF;
            ticksPerBeat = framesPerSecond * ticksPerFrame;
        }

        const tracks = [];
        const tempoMap = [];

        for (let i = 0; i < trackCount; i++) {
            const track = this.parseTrack(tempoMap);
            if (track.events.length > 0) {
                tracks.push(track);
            }
        }

        return { 
            format, 
            trackCount, 
            timeDivision,
            ticksPerBeat,
            isSMPTE,
            framesPerSecond,
            ticksPerFrame,
            tempoMap,
            tracks 
        };
    }

    parseTrack(tempoMap) {
        const header = this.readString(4);
        if (header !== 'MTrk') {
            throw new Error('Неверный трек');
        }

        const trackLength = this.readUInt32();
        const trackEnd = this.pos + trackLength;
        const events = [];
        let runningStatus = 0;
        let absoluteTime = 0;

        while (this.pos < trackEnd) {
            const deltaTime = this.readVarLen();
            absoluteTime += deltaTime;

            let status = this.data.getUint8(this.pos);

            if (status < 0x80) {
                status = runningStatus;
            } else {
                this.pos++;
                if (status >= 0x80 && status < 0xF0) {
                    runningStatus = status;
                }
            }

            const eventType = status >> 4;
            const channel = status & 0x0F;

            if (eventType === 0x9) {
                const note = this.readUInt8();
                const velocity = this.readUInt8();
                if (velocity > 0) {
                    events.push({ type: 'noteOn', time: absoluteTime, note, velocity, channel });
                } else {
                    events.push({ type: 'noteOff', time: absoluteTime, note, channel });
                }
            }
            else if (eventType === 0x8) {
                const note = this.readUInt8();
                const velocity = this.readUInt8();
                events.push({ type: 'noteOff', time: absoluteTime, note, channel });
            }
            else if (eventType === 0xE) {
                const lsb = this.readUInt8();
                const msb = this.readUInt8();
                const value = (msb << 7) | lsb;
                events.push({ type: 'pitchBend', time: absoluteTime, value, channel });
            }
            else if (eventType === 0xC) {
                const program = this.readUInt8();
                events.push({ type: 'programChange', time: absoluteTime, program, channel });
            }
            else if (eventType === 0xB) {
                const controller = this.readUInt8();
                const value = this.readUInt8();
                events.push({ type: 'controlChange', time: absoluteTime, controller, value, channel });
            }
            else if (eventType === 0xD) {
                const pressure = this.readUInt8();
                events.push({ type: 'channelPressure', time: absoluteTime, pressure, channel });
            }
            else if (eventType === 0xA) {
                const note = this.readUInt8();
                const pressure = this.readUInt8();
                events.push({ type: 'polyPressure', time: absoluteTime, note, pressure, channel });
            }
            else if (status === 0xFF || status === 0xF0 || status === 0xF7) {
                if (status === 0xFF) {
                    const metaType = this.readUInt8();
                    const length = this.readVarLen();
                    
                    if (metaType === 0x51 && length === 3) {
                        const microsecondsPerBeat = this.readUInt24();
                        const bpm = 60000000 / microsecondsPerBeat;
                        tempoMap.push({
                            time: absoluteTime,
                            microsecondsPerBeat,
                            bpm
                        });
                        events.push({ 
                            type: 'tempo', 
                            time: absoluteTime, 
                            microsecondsPerBeat,
                            bpm
                        });
                    } else {
                        this.pos += length;
                    }
                } else {
                    const length = this.readVarLen();
                    this.pos += length;
                }
            }
        }

        return { events };
    }
}

// ===== MIDI WRITER =====
class MIDIWriter {
    constructor() {
        this.data = [];
    }

    writeString(str) {
        for (let i = 0; i < str.length; i++) {
            this.data.push(str.charCodeAt(i));
        }
    }

    writeUInt32(value) {
        this.data.push((value >> 24) & 0xFF);
        this.data.push((value >> 16) & 0xFF);
        this.data.push((value >> 8) & 0xFF);
        this.data.push(value & 0xFF);
    }

    writeUInt16(value) {
        this.data.push((value >> 8) & 0xFF);
        this.data.push(value & 0xFF);
    }

    writeUInt8(value) {
        this.data.push(value & 0xFF);
    }

    writeVarLen(value) {
        const bytes = [];
        bytes.push(value & 0x7F);
        value >>= 7;
        while (value > 0) {
            bytes.push((value & 0x7F) | 0x80);
            value >>= 7;
        }
        for (let i = bytes.length - 1; i >= 0; i--) {
            this.data.push(bytes[i]);
        }
    }

    createMIDI(jsonData) {
        this.data = [];
        
        this.writeString('MThd');
        this.writeUInt32(6);
        this.writeUInt16(1);
        this.writeUInt16(jsonData.tracks.length);
        this.writeUInt16(480);

        jsonData.tracks.forEach(track => {
            this.writeTrack(track);
        });

        return new Uint8Array(this.data);
    }

    writeTrack(track) {
        const tempWriter = new MIDIWriter();
        
        const notes = [...track.notes].sort((a, b) => a.time - b.time);
        
        const events = [];
        notes.forEach(note => {
            const startTime = Math.round(note.time * 480);
            const endTime = Math.round((note.time + note.duration) * 480);
            
            events.push({
                time: startTime,
                type: 'noteOn',
                note: note.note,
                velocity: note.velocity || 100
            });
            
            events.push({
                time: endTime,
                type: 'noteOff',
                note: note.note
            });
        });
        
        events.sort((a, b) => a.time - b.time);
        
        let currentTime = 0;
        events.forEach(event => {
            const deltaTime = event.time - currentTime;
            tempWriter.writeVarLen(deltaTime);
            
            if (event.type === 'noteOn') {
                tempWriter.writeUInt8(0x90);
                tempWriter.writeUInt8(event.note);
                tempWriter.writeUInt8(event.velocity);
            } else {
                tempWriter.writeUInt8(0x80);
                tempWriter.writeUInt8(event.note);
                tempWriter.writeUInt8(0);
            }
            
            currentTime = event.time;
        });
        
        tempWriter.writeVarLen(0);
        tempWriter.writeUInt8(0xFF);
        tempWriter.writeUInt8(0x2F);
        tempWriter.writeUInt8(0x00);
        
        this.writeString('MTrk');
        this.writeUInt32(tempWriter.data.length);
        this.data.push(...tempWriter.data);
    }
}

// ===== VISUALIZER (УЛУЧШЕННЫЙ) =====
class Visualizer {
    constructor(canvas, debugEl) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', {
            alpha: false,
            desynchronized: true
        });
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.debugEl = debugEl;
        this.mode = 'bars';
        this.activeNotes = new Map();
        this.bars = new Array(88).fill(0);
        this.smoothedBars = new Array(88).fill(0);
        this.noteCount = 0;
        this.isActive = false;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fpsTime = 0;
        this.fps = 0;
        this.gradientCache = new Map();
        this.maxCacheSize = 50;
        this.TARGET_FRAME_TIME = 16.67;
        this.animationFrame = null;
        this.resize();
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        this.width = rect.width;
        this.height = rect.height;
        
        this.gradientCache.clear();
    }

    setMode(mode) {
        this.mode = mode;
        this.gradientCache.clear();
    }
    
    getOrCreateGradient(key, createFn) {
        if (!this.gradientCache.has(key)) {
            if (this.gradientCache.size >= this.maxCacheSize) {
                const firstKey = this.gradientCache.keys().next().value;
                this.gradientCache.delete(firstKey);
            }
            this.gradientCache.set(key, createFn());
        }
        return this.gradientCache.get(key);
    }

    addNote(note, velocity) {
        const index = note - 21;
        if (index >= 0 && index < 88) {
            this.activeNotes.set(note, { 
                velocity, 
                time: performance.now(),
                decaying: false
            });
            this.bars[index] = velocity;
            this.noteCount++;
            this.updateDebug();
        }
    }

    removeNote(note) {
        const noteData = this.activeNotes.get(note);
        if (noteData) {
            noteData.decaying = true;
            setTimeout(() => {
                this.activeNotes.delete(note);
                this.updateDebug();
            }, 200);
        }
    }

    updateDebug() {
        if (this.debugEl) {
            this.debugEl.textContent = `Активных: ${this.activeNotes.size} | Всего: ${this.noteCount} | FPS: ${this.fps}`;
        }
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.lastTime = performance.now();
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.activeNotes.clear();
        this.bars.fill(0);
        this.smoothedBars.fill(0);
        this.noteCount = 0;
        this.updateDebug();
        this.clear();
    }

    clear() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    animate() {
        if (!this.isActive) return;

        const now = performance.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        this.frameCount++;
        this.fpsTime += deltaTime;
        if (this.fpsTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / this.fpsTime);
            this.frameCount = 0;
            this.fpsTime = 0;
        }

        this.update(deltaTime);
        this.draw(now);
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    update(deltaTime) {
        const decayRate = 0.95;
        const decayFactor = Math.pow(decayRate, deltaTime / this.TARGET_FRAME_TIME);
        const smoothingFactor = 0.15;
        
        for (let i = 0; i < this.bars.length; i++) {
            this.smoothedBars[i] += (this.bars[i] - this.smoothedBars[i]) * smoothingFactor;
            this.bars[i] *= decayFactor;
            if (this.bars[i] < 0.5) this.bars[i] = 0;
        }
        
        this.updateDebug();
    }

    draw(currentTime) {
        const { width, height } = this;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, width, height);

        switch(this.mode) {
            case 'bars':
                this.drawBars();
                break;
            case 'wave':
                this.drawWave(currentTime);
                break;
            case 'circle':
                this.drawCircle();
                break;
        }
    }

    drawBars() {
        const { width, height } = this;
        const barCount = 88;
        const barWidth = width / barCount;
        
        // Рисуем сетку
        this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const y = (height / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        // Рисуем столбцы
        for (let i = 0; i < barCount; i++) {
            const barHeight = (this.smoothedBars[i] / 127) * height * 0.9;
            
            if (barHeight > 1) {
                const hue = (i / barCount) * 280;
                
                // Тень
                this.ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.15)`;
                this.ctx.fillRect(i * barWidth + 1, height - barHeight + 3, barWidth - 2, barHeight);
                
                // Основной градиент
                const gradientKey = `bar-${Math.floor(barHeight / 10)}-${hue}`;
                const gradient = this.getOrCreateGradient(gradientKey, () => {
                    const g = this.ctx.createLinearGradient(0, height - barHeight, 0, height);
                    g.addColorStop(0, `hsl(${hue}, 85%, 65%)`);
                    g.addColorStop(1, `hsl(${hue}, 75%, 55%)`);
                    return g;
                });
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(i * barWidth + 1, height - barHeight, barWidth - 2, barHeight);
                
                // Блик сверху
                this.ctx.fillStyle = `hsla(${hue}, 100%, 85%, 0.8)`;
                this.ctx.fillRect(i * barWidth + 1, height - barHeight, barWidth - 2, 3);
            }
        }

        // Индикаторы активных нот
        this.activeNotes.forEach((data, note) => {
            const barIndex = note - 21;
            if (barIndex >= 0 && barIndex < barCount) {
                const x = barIndex * barWidth + barWidth / 2;
                const hue = (barIndex / barCount) * 280;
                
                this.ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${data.decaying ? 0.3 : 0.9})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(x, height);
                this.ctx.lineTo(x, 10);
                this.ctx.stroke();
                
                this.ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                this.ctx.beginPath();
                this.ctx.arc(x, 10, 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    drawWave(currentTime) {
        const { width, height } = this;
        const centerY = height / 2;
        
        // Центральная линия
        this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();
        
        // Расчет амплитуды
        let totalVelocity = 0;
        this.activeNotes.forEach(data => {
            totalVelocity += data.velocity;
        });
        const avgVelocity = this.activeNotes.size > 0 ? totalVelocity / this.activeNotes.size : 0;
        const amplitude = (avgVelocity / 127) * height * 0.35;

        this.ctx.beginPath();
        this.ctx.lineWidth = 4;
        
        const strokeGradient = this.getOrCreateGradient('wave-stroke', () => {
            const g = this.ctx.createLinearGradient(0, 0, width, 0);
            g.addColorStop(0, '#667eea');
            g.addColorStop(0.5, '#764ba2');
            g.addColorStop(1, '#f093fb');
            return g;
        });
        this.ctx.strokeStyle = strokeGradient;

        const points = 150;
        const step = width / points;
        const time = currentTime * 0.002;
        
        for (let i = 0; i <= points; i++) {
            const x = i * step;
            const barIndex = Math.floor((i / points) * this.smoothedBars.length);
            const barValue = this.smoothedBars[barIndex] / 127;
            
            const wave1 = Math.sin(i * 0.05 + time) * amplitude * 0.6;
            const wave2 = Math.sin(i * 0.1 - time * 1.5) * amplitude * 0.4;
            const barInfluence = barValue * height * 0.25;
            
            const y = centerY + wave1 + wave2 + barInfluence;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();
        
        // Заливка под волной
        this.ctx.lineTo(width, height);
        this.ctx.lineTo(0, height);
        this.ctx.closePath();
        
        const fillGradientKey = `wave-fill-${Math.floor(amplitude / 10)}`;
        const fillGradient = this.getOrCreateGradient(fillGradientKey, () => {
            const g = this.ctx.createLinearGradient(0, centerY - amplitude, 0, height);
            g.addColorStop(0, 'rgba(102, 126, 234, 0.4)');
            g.addColorStop(1, 'rgba(118, 75, 162, 0.1)');
            return g;
        });
        this.ctx.fillStyle = fillGradient;
        this.ctx.fill();

        // Частицы активных нот
        this.activeNotes.forEach((data, note) => {
            const x = ((note - 21) / 88) * width;
            const y = centerY + Math.sin(currentTime * 0.005 + note) * amplitude;
            const hue = ((note - 21) / 88) * 280;
            
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, data.decaying ? 3 : 6, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(${hue}, 90%, 60%)`;
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
        });
    }

    drawCircle() {
        const { width, height } = this;
        const centerX = width / 2;
        const centerY = height / 2;
        const minRadius = 30;
        const maxRadius = Math.max(Math.min(width, height) / 2 - 20, minRadius + 10);

        // Концентрические круги
        const layers = 4;
        for (let layer = 0; layer < layers; layer++) {
            const radius = minRadius + (maxRadius - minRadius) * ((layer + 1) / layers);
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(102, 126, 234, ${0.15 + layer * 0.05})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }

        // Лучи активных нот
        this.activeNotes.forEach((data, note) => {
            const angle = ((note - 21) / 88) * Math.PI * 2 - Math.PI / 2;
            const radius = minRadius + (data.velocity / 127) * (maxRadius - minRadius);
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const hue = ((note - 21) / 88) * 280;
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = `hsla(${hue}, 85%, 55%, ${data.decaying ? 0.3 : 0.7})`;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            this.ctx.shadowBlur = data.decaying ? 5 : 20;
            this.ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, data.decaying ? 4 : 8, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(${hue}, 90%, 60%)`;
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
        });

        // Центральный круг
        const centerRadius = Math.max(25 + (this.activeNotes.size / 8) * 10, 15);
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
        
        const centerGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius);
        centerGradient.addColorStop(0, '#764ba2');
        centerGradient.addColorStop(1, '#667eea');
        this.ctx.fillStyle = centerGradient;
        this.ctx.fill();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Счетчик нот
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.activeNotes.size, centerX, centerY);
    }
}

// ===== MIDI PLAYER =====
class MIDIPlayer {
    constructor(visualizer) {
        this.midiData = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.duration = 0;
        this.scheduledEvents = [];
        this.audioContext = null;
        this.volume = 30;
        this.tempo = 100;
        this.sampler = null;
        this.visualizer = visualizer;
        this.updateInterval = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordingDestination = null;
    }

    async init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        // Initialize and load banjo sampler
        if (!this.sampler) {
            this.sampler = new BanjoSampler(this.audioContext);
            await this.sampler.loadSamples();
        }
    }

    loadMIDI(arrayBuffer) {
        try {
            const parser = new MIDIParser(arrayBuffer);
            this.midiData = parser.parse();
            this.calculateDuration();
            return this.midiData;
        } catch (error) {
            throw new Error('Ошибка парсинга MIDI: ' + error.message);
        }
    }

    calculateDuration() {
        if (!this.midiData) return;

        let maxTime = 0;
        const ticksPerBeat = this.midiData.ticksPerBeat;
        
        let currentTempo = 500000;
        const tempoChanges = [];

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    tempoChanges.push({
                        tick: event.time,
                        microsecondsPerBeat: event.microsecondsPerBeat
                    });
                }
            });
        });

        tempoChanges.sort((a, b) => a.tick - b.tick);

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                const time = this.ticksToSeconds(event.time, ticksPerBeat, tempoChanges);
                if (time > maxTime) {
                    maxTime = time;
                }
            });
        });

        this.duration = maxTime;
    }

    ticksToSeconds(ticks, ticksPerBeat, tempoChanges) {
        let seconds = 0;
        let currentTick = 0;
        let currentTempo = 500000;

        for (let i = 0; i < tempoChanges.length; i++) {
            const change = tempoChanges[i];
            if (change.tick >= ticks) break;

            const deltaTicks = change.tick - currentTick;
            seconds += (deltaTicks / ticksPerBeat) * (currentTempo / 1000000);
            
            currentTick = change.tick;
            currentTempo = change.microsecondsPerBeat;
        }

        const deltaTicks = ticks - currentTick;
        seconds += (deltaTicks / ticksPerBeat) * (currentTempo / 1000000);

        return seconds;
    }

    async play(startTime = 0) {
        if (!this.midiData) return;

        await this.init();
        
        this.isPlaying = true;
        this.isPaused = false;
        this.currentTime = startTime;
        this.visualizer.start();

        this.scheduleNotes(startTime);
        this.startTimeUpdate();
    }

    scheduleNotes(startTime) {
        const ticksPerBeat = this.midiData.ticksPerBeat;
        const tempoChanges = [];

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    tempoChanges.push({
                        tick: event.time,
                        microsecondsPerBeat: event.microsecondsPerBeat
                    });
                }
            });
        });

        tempoChanges.sort((a, b) => a.tick - b.tick);

        const noteMap = new Map();

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                const eventTime = this.ticksToSeconds(event.time, ticksPerBeat, tempoChanges);
                const adjustedTime = eventTime / (this.tempo / 100);

                if (adjustedTime < startTime) return;

                if (event.type === 'noteOn') {
                    noteMap.set(event.note + '_' + event.channel, {
                        note: event.note,
                        velocity: event.velocity,
                        startTime: adjustedTime,
                        channel: event.channel
                    });
                } else if (event.type === 'noteOff') {
                    const noteOn = noteMap.get(event.note + '_' + event.channel);
                    if (noteOn) {
                        const duration = adjustedTime - noteOn.startTime;
                        const delay = (noteOn.startTime - startTime) * 1000;

                        const timeoutId = setTimeout(() => {
                            if (this.isPlaying) {
                                this.playNote(noteOn.note, noteOn.velocity, duration);
                            }
                        }, delay);

                        this.scheduledEvents.push(timeoutId);
                        noteMap.delete(event.note + '_' + event.channel);
                    }
                }
            });
        });
    }

    playNote(note, velocity, duration) {
        if (!this.audioContext || !this.sampler || !this.sampler.isLoaded) return;

        try {
            const time = this.audioContext.currentTime;
            const sourceNode = this.sampler.play(note, velocity, duration, time);
            
            if (!sourceNode) return;
            
            const masterGain = this.audioContext.createGain();
            const volumeMultiplier = (this.volume / 100);
            
            masterGain.gain.setValueAtTime(volumeMultiplier, time);
            masterGain.gain.exponentialRampToValueAtTime(0.01, time + duration);
            
            sourceNode.connect(masterGain);
            masterGain.connect(this.audioContext.destination);
            
            if (this.mediaRecorder && this.isRecording && this.recordingDestination) {
                masterGain.connect(this.recordingDestination);
            }
            
            this.visualizer.addNote(note, velocity);
            
            setTimeout(() => {
                this.visualizer.removeNote(note);
            }, duration * 1000);
            
        } catch (error) {
            console.error('Ошибка воспроизведения ноты:', error);
        }
    }

    pause() {
        this.isPlaying = false;
        this.isPaused = true;
        this.clearScheduledEvents();
        this.stopTimeUpdate();
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.clearScheduledEvents();
        this.stopTimeUpdate();
        this.visualizer.stop();
    }

    clearScheduledEvents() {
        this.scheduledEvents.forEach(id => clearTimeout(id));
        this.scheduledEvents = [];
    }

    startTimeUpdate() {
        const startTime = Date.now();
        const initialTime = this.currentTime;

        this.updateInterval = setInterval(() => {
            if (this.isPlaying) {
                const elapsed = (Date.now() - startTime) / 1000;
                this.currentTime = initialTime + elapsed * (this.tempo / 100);

                if (this.currentTime >= this.duration) {
                    this.stop();
                }
            }
        }, 100);
    }

    stopTimeUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    setVolume(volume) {
        this.volume = volume;
    }

    setTempo(tempo) {
        const wasPlaying = this.isPlaying;
        const currentTime = this.currentTime;

        if (wasPlaying) {
            this.stop();
        }

        this.tempo = tempo;

        if (wasPlaying) {
            this.play(currentTime);
        }
    }


    seek(time) {
        const wasPlaying = this.isPlaying;
        this.stop();
        this.currentTime = time;
        
        if (wasPlaying) {
            this.play(time);
        }
    }

    async startRecording() {
        await this.init();
        
        this.recordingDestination = this.audioContext.createMediaStreamDestination();
        this.mediaRecorder = new MediaRecorder(this.recordingDestination.stream);
        this.recordedChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };

        this.mediaRecorder.start();
        this.isRecording = true;
    }

    stopRecording() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) {
                resolve(null);
                return;
            }

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                this.isRecording = false;
                this.mediaRecorder = null;
                this.recordingDestination = null;
                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    exportToJSON() {
        if (!this.midiData) return null;

        const ticksPerBeat = this.midiData.ticksPerBeat;
        const tempoChanges = [];

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    tempoChanges.push({
                        tick: event.time,
                        microsecondsPerBeat: event.microsecondsPerBeat
                    });
                }
            });
        });

        tempoChanges.sort((a, b) => a.tick - b.tick);

        const tracks = this.midiData.tracks.map(track => {
            const noteMap = new Map();
            const notes = [];

            track.events.forEach(event => {
                const eventTime = this.ticksToSeconds(event.time, ticksPerBeat, tempoChanges);

                if (event.type === 'noteOn') {
                    noteMap.set(event.note, {
                        note: event.note,
                        velocity: event.velocity,
                        time: eventTime
                    });
                } else if (event.type === 'noteOff') {
                    const noteOn = noteMap.get(event.note);
                    if (noteOn) {
                        notes.push({
                            note: noteOn.note,
                            time: noteOn.time,
                            duration: eventTime - noteOn.time,
                            velocity: noteOn.velocity
                        });
                        noteMap.delete(event.note);
                    }
                }
            });

            return { notes };
        });

        return { tracks };
    }

    // ===== ЭКСПОРТ В WAV =====
    async exportToWAV() {
        if (!this.midiData || !this.sampler || !this.sampler.isLoaded) return null;

        const duration = this.duration;
        const sampleRate = 44100;
        const numberOfChannels = 2;

        // Создаём offline context для рендеринга
        const offlineContext = new OfflineAudioContext(
            numberOfChannels, 
            Math.ceil(sampleRate * duration), 
            sampleRate
        );
        
        // Create offline sampler with samples from main sampler
        const offlineSampler = new BanjoSampler(offlineContext);
        offlineSampler.samples = this.sampler.samples;
        offlineSampler.isLoaded = true;
        
        const offlineGain = offlineContext.createGain();
        offlineGain.gain.value = this.volume / 100;
        offlineGain.connect(offlineContext.destination);

        const ticksPerBeat = this.midiData.ticksPerBeat;
        const tempoChanges = [];

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    tempoChanges.push({
                        tick: event.time,
                        microsecondsPerBeat: event.microsecondsPerBeat
                    });
                }
            });
        });

        tempoChanges.sort((a, b) => a.tick - b.tick);

        // Планируем все ноты для offline рендеринга
        this.midiData.tracks.forEach(track => {
            const noteMap = new Map();
            
            track.events.forEach(event => {
                const eventTime = this.ticksToSeconds(event.time, ticksPerBeat, tempoChanges) / (this.tempo / 100);

                if (event.type === 'noteOn') {
                    noteMap.set(event.note + '_' + event.channel, {
                        note: event.note,
                        velocity: event.velocity,
                        startTime: eventTime,
                        channel: event.channel
                    });
                } else if (event.type === 'noteOff') {
                    const noteOn = noteMap.get(event.note + '_' + event.channel);
                    if (noteOn) {
                        const noteDuration = eventTime - noteOn.startTime;
                        
                        // Use sampler to play note
                        const sourceNode = offlineSampler.play(
                            noteOn.note, 
                            noteOn.velocity, 
                            noteDuration, 
                            noteOn.startTime
                        );
                        
                        if (sourceNode) {
                            const noteGain = offlineContext.createGain();
                            noteGain.gain.setValueAtTime(1.0, noteOn.startTime);
                            noteGain.gain.exponentialRampToValueAtTime(0.01, noteOn.startTime + noteDuration);
                            
                            sourceNode.connect(noteGain);
                            noteGain.connect(offlineGain);
                        }
                        
                        noteMap.delete(event.note + '_' + event.channel);
                    }
                }
            });
        });

        // Рендерим audio
        try {
            const renderedBuffer = await offlineContext.startRendering();
            
            // Конвертируем в WAV
            const wavBlob = this.audioBufferToWav(renderedBuffer);
            return wavBlob;
        } catch (error) {
            console.error('Ошибка рендеринга:', error);
            throw error;
        }
    }

    audioBufferToWav(buffer) {
        const numberOfChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;

        const bytesPerSample = bitDepth / 8;
        const blockAlign = numberOfChannels * bytesPerSample;

        // Интерлейсим каналы
        const data = [];
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                // Клампим значения
                const clampedSample = Math.max(-1, Math.min(1, sample));
                // Конвертируем в 16-bit integer
                const intSample = clampedSample < 0 
                    ? clampedSample * 0x8000 
                    : clampedSample * 0x7FFF;
                data.push(Math.round(intSample));
            }
        }

        const dataLength = data.length * bytesPerSample;
        const arrayBuffer = new ArrayBuffer(44 + dataLength);
        const view = new DataView(arrayBuffer);

        // WAV header
        this.writeStringToView(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        this.writeStringToView(view, 8, 'WAVE');
        this.writeStringToView(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // Subchunk1Size (16 для PCM)
        view.setUint16(20, format, true); // AudioFormat (1 = PCM)
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        this.writeStringToView(view, 36, 'data');
        view.setUint32(40, dataLength, true);

        // Аудио данные
        let offset = 44;
        for (let i = 0; i < data.length; i++) {
            view.setInt16(offset, data[i], true);
            offset += 2;
        }

        return new Blob([arrayBuffer], { type: 'audio/wav' });
    }

    writeStringToView(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}

// ===== UI ЛОГИКА =====
let player;
let visualizer;
let currentFileName = '';

document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('canvas');
    const vizDebug = document.getElementById('vizDebug');
    visualizer = new Visualizer(canvas, vizDebug);
    player = new MIDIPlayer(visualizer);

    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const midiInfo = document.getElementById('midiInfo');
    const tempoInfo = document.getElementById('tempoInfo');
    const visualizerEl = document.getElementById('visualizer');
    const visualizationMode = document.getElementById('visualizationMode');
    const volumeControl = document.getElementById('volumeControl');
    const tempoControl = document.getElementById('tempoControl');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const status = document.getElementById('status');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const tempoSlider = document.getElementById('tempoSlider');
    const tempoValue = document.getElementById('tempoValue');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Lazy initialization on first user interaction
    let isInitialized = false;
    async function ensureInitialized() {
        if (isInitialized) return;
        
        loadingIndicator.style.display = 'block';
        try {
            await player.init();
            loadingIndicator.style.display = 'none';
            isInitialized = true;
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            loadingIndicator.innerHTML = '<div class="loading-text">❌ Ошибка загрузки сэмплов</div>';
        }
    }

    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    async function handleFile(file) {
        await ensureInitialized();
        
        currentFileName = file.name;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const midiData = player.loadMIDI(e.target.result);
                
                fileName.textContent = file.name;
                fileInfo.classList.add('active');
                
                let infoText = `Формат: ${midiData.format}, Треков: ${midiData.trackCount}, `;
                infoText += `Разрешение: ${midiData.ticksPerBeat} ticks/beat`;
                
                if (midiData.isSMPTE) {
                    infoText += ` (SMPTE: ${midiData.framesPerSecond} fps)`;
                }
                
                midiInfo.textContent = infoText;
                
                if (midiData.tempoMap && midiData.tempoMap.length > 0) {
                    const firstTempo = midiData.tempoMap[0];
                    tempoInfo.textContent = `Темп: ${firstTempo.bpm.toFixed(2)} BPM (${firstTempo.microsecondsPerBeat} мкс/beat)`;
                    tempoInfo.style.display = 'block';
                }
                
                visualizerEl.classList.add('active');
                visualizationMode.classList.add('active');
                volumeControl.classList.add('active');
                tempoControl.classList.add('active');
                progressContainer.classList.add('active');
                
                totalTimeEl.textContent = formatTime(player.duration);
                
                playBtn.disabled = false;
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                
                document.getElementById('exportJsonBtn').disabled = false;
                document.getElementById('exportWavBtn').disabled = false;
                document.getElementById('startRecordBtn').disabled = false;
                
                status.textContent = 'Файл загружен. Готов к воспроизведению.';
                
            } catch (error) {
                status.textContent = 'Ошибка: ' + error.message;
                console.error(error);
            }
        };
        
        reader.readAsArrayBuffer(file);
    }

    const vizBtns = document.querySelectorAll('.viz-btn');
    vizBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            vizBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            visualizer.setMode(btn.getAttribute('data-mode'));
        });
    });

    playBtn.addEventListener('click', async () => {
        await ensureInitialized();
        await player.play(player.currentTime);
        status.textContent = 'Воспроизведение...';
    });

    pauseBtn.addEventListener('click', () => {
        player.pause();
        status.textContent = 'Пауза';
    });

    stopBtn.addEventListener('click', () => {
        player.stop();
        currentTimeEl.textContent = '0:00';
        progressFill.style.width = '0%';
        status.textContent = 'Остановлено';
    });

    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        volumeValue.textContent = value + '%';
        player.setVolume(parseInt(value));
    });

    tempoSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        tempoValue.textContent = value + '%';
        player.setTempo(parseInt(value));
    });

    setInterval(() => {
        if (player.isPlaying) {
            const progress = (player.currentTime / player.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeEl.textContent = formatTime(player.currentTime);
        }
    }, 100);

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const time = percentage * player.duration;
        player.seek(time);
        progressFill.style.width = (percentage * 100) + '%';
        currentTimeEl.textContent = formatTime(time);
    });

    // ЭКСПОРТ JSON
    document.getElementById('exportJsonBtn').addEventListener('click', () => {
        const jsonData = player.exportToJSON();
        if (jsonData) {
            const jsonStr = JSON.stringify(jsonData, null, 2);
            document.getElementById('jsonOutput').value = jsonStr;
            document.getElementById('downloadJsonBtn').disabled = false;
        }
    });

    document.getElementById('downloadJsonBtn').addEventListener('click', () => {
        const jsonStr = document.getElementById('jsonOutput').value;
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFileName.replace(/\.(mid|midi)$/i, '.json');
        a.click();
        URL.revokeObjectURL(url);
    });

    // ЭКСПОРТ WAV
    document.getElementById('exportWavBtn').addEventListener('click', async () => {
        const exportWavBtn = document.getElementById('exportWavBtn');
        const originalText = exportWavBtn.innerHTML;
        
        exportWavBtn.disabled = true;
        exportWavBtn.innerHTML = '<span>⏳</span> Рендеринг...';
        status.textContent = 'Рендеринг WAV файла...';
        
        try {
            const wavBlob = await player.exportToWAV();
            
            if (wavBlob) {
                const url = URL.createObjectURL(wavBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = currentFileName.replace(/\.(mid|midi)$/i, '.wav');
                a.click();
                URL.revokeObjectURL(url);
                
                status.textContent = '✅ WAV файл экспортирован успешно!';
            }
        } catch (error) {
            status.textContent = '❌ Ошибка экспорта: ' + error.message;
            console.error('Ошибка экспорта WAV:', error);
        } finally {
            exportWavBtn.disabled = false;
            exportWavBtn.innerHTML = originalText;
        }
    });

    // ЗАГРУЗКА JSON
    const jsonUploadArea = document.getElementById('jsonUploadArea');
    const jsonFileInput = document.getElementById('jsonFileInput');

    jsonUploadArea.addEventListener('click', () => jsonFileInput.click());

    jsonUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        jsonUploadArea.classList.add('dragover');
    });

    jsonUploadArea.addEventListener('dragleave', () => {
        jsonUploadArea.classList.remove('dragover');
    });

    jsonUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        jsonUploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            handleJSONFile(file);
        }
    });

    jsonFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleJSONFile(file);
    });

    function handleJSONFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('jsonInput').value = e.target.result;
        };
        reader.readAsText(file);
    }

    // СОЗДАНИЕ MIDI
    document.getElementById('createMidiBtn').addEventListener('click', () => {
        try {
            const jsonStr = document.getElementById('jsonInput').value;
            const jsonData = JSON.parse(jsonStr);
            
            const writer = new MIDIWriter();
            const midiBytes = writer.createMIDI(jsonData);
            
            const blob = new Blob([midiBytes], { type: 'audio/midi' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'created.mid';
            a.click();
            URL.revokeObjectURL(url);
            
            document.getElementById('importStatus').textContent = '✅ MIDI файл создан и скачан!';
        } catch (error) {
            document.getElementById('importStatus').textContent = '❌ Ошибка: ' + error.message;
        }
    });

    document.getElementById('previewMidiBtn').addEventListener('click', () => {
        try {
            const jsonStr = document.getElementById('jsonInput').value;
            const jsonData = JSON.parse(jsonStr);
            
            const writer = new MIDIWriter();
            const midiBytes = writer.createMIDI(jsonData);
            
            player.loadMIDI(midiBytes.buffer);
            
            tabs[0].click();
            
            fileName.textContent = 'Предпросмотр созданного MIDI';
            fileInfo.classList.add('active');
            midiInfo.textContent = `Треков: ${jsonData.tracks.length}`;
            
            visualizerEl.classList.add('active');
            visualizationMode.classList.add('active');
            volumeControl.classList.add('active');
            tempoControl.classList.add('active');
            progressContainer.classList.add('active');
            
            totalTimeEl.textContent = formatTime(player.duration);
            
            playBtn.disabled = false;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            
            document.getElementById('importStatus').textContent = '✅ Предпросмотр готов!';
        } catch (error) {
            document.getElementById('importStatus').textContent = '❌ Ошибка: ' + error.message;
        }
    });

    // ЗАПИСЬ
    document.getElementById('startRecordBtn').addEventListener('click', async () => {
        await player.startRecording();
        document.getElementById('recordingIndicator').classList.add('active');
        document.getElementById('stopRecordBtn').disabled = false;
        document.getElementById('startRecordBtn').disabled = true;
        document.getElementById('recordStatus').textContent = 'Запись началась. Нажмите "Играть" для воспроизведения.';
    });

    document.getElementById('stopRecordBtn').addEventListener('click', async () => {
        const audioBlob = await player.stopRecording();
        if (audioBlob) {
            document.getElementById('recordingIndicator').classList.remove('active');
            document.getElementById('downloadAudioBtn').disabled = false;
            document.getElementById('stopRecordBtn').disabled = true;
            document.getElementById('startRecordBtn').disabled = false;
            
            document.getElementById('downloadAudioBtn').onclick = () => {
                const url = URL.createObjectURL(audioBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = currentFileName.replace(/\.(mid|midi)$/i, '.webm');
                a.click();
                URL.revokeObjectURL(url);
            };
            
            document.getElementById('recordStatus').textContent = '✅ Запись завершена. Нажмите "Скачать аудио".';
        }
    });

    window.addEventListener('resize', () => {
        visualizer.resize();
    });
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}