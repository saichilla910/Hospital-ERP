/**
 * Audio Notification Utility for OPD Token & Queue Calling
 * Provides Web Audio API synthesized chime sound and Web Speech voice announcements.
 */

// Web Audio API Synthesizer Chime Sound
export const playHospitalChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // High Tone (880 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.6);

    // Second Tone (659.25 Hz - E5) after 0.25s
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.25);
    gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.95);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.25);
    osc2.stop(ctx.currentTime + 0.95);
  } catch (err) {
    console.warn('Web Audio API chime error:', err);
  }
};

// Web Speech Voice Callout Announcement
export const announceTokenVoice = (tokenNumber, patientName, roomName, doctorName) => {
  try {
    if (!('speechSynthesis' in window)) return;

    // First play chime sound
    playHospitalChime();

    // Cancel active speech before starting new callout
    window.speechSynthesis.cancel();

    const cleanToken = (tokenNumber || '').replace('-', ' ');
    const text = `Token ${cleanToken}. Patient ${patientName}. Please proceed to ${roomName} for ${doctorName}.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clear hospital announcement
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Pick English female voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 400);
  } catch (err) {
    console.warn('Speech synthesis callout error:', err);
  }
};
