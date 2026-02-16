#!/usr/bin/env python3
import struct

def write_variable_length(value):
    """Convert integer to MIDI variable length format"""
    bytes_list = []
    bytes_list.append(value & 0x7F)
    value >>= 7
    while value > 0:
        bytes_list.append((value & 0x7F) | 0x80)
        value >>= 7
    return bytes(reversed(bytes_list))

def create_simple_midi():
    """Create a simple MIDI file with a C major scale"""
    # MIDI Header
    header = b'MThd'  # Header chunk type
    header += struct.pack('>I', 6)  # Header length
    header += struct.pack('>H', 0)  # Format 0
    header += struct.pack('>H', 1)  # Number of tracks
    header += struct.pack('>H', 480)  # Ticks per beat
    
    # Track data
    track_data = b''
    
    # Set tempo (500000 microseconds per beat = 120 BPM)
    track_data += write_variable_length(0)  # Delta time
    track_data += b'\xFF\x51\x03'  # Meta event: Set Tempo
    track_data += struct.pack('>I', 500000)[1:]  # 500000 microseconds (3 bytes)
    
    # Play C major scale: C4, D4, E4, F4, G4, A4, B4, C5
    notes = [60, 62, 64, 65, 67, 69, 71, 72]  # MIDI note numbers
    
    for note in notes:
        # Note On
        track_data += write_variable_length(0)  # Delta time
        track_data += bytes([0x90, note, 80])  # Note On, channel 0, velocity 80
        
        # Note Off (after 480 ticks = 1 beat)
        track_data += write_variable_length(480)
        track_data += bytes([0x80, note, 0])  # Note Off
    
    # End of track
    track_data += write_variable_length(0)
    track_data += b'\xFF\x2F\x00'
    
    # Track chunk
    track = b'MTrk'  # Track chunk type
    track += struct.pack('>I', len(track_data))  # Track length
    track += track_data
    
    # Combine header and track
    midi_file = header + track
    
    return midi_file

# Create and save the MIDI file
midi_data = create_simple_midi()
with open('test_scale.mid', 'wb') as f:
    f.write(midi_data)

print("Created test_scale.mid with C major scale")
