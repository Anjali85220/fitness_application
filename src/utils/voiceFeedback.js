// src/utils/voiceFeedback.js
export function provideVoiceFeedback(feedback, reps) {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.cancel(); // Cancel any ongoing speech
      
      const messages = [];
      if (reps > 0 && reps % 5 === 0) {
        messages.push(`Great job! You've completed ${reps} repetitions.`);
      }
      
      if (feedback) {
        messages.push(feedback);
      }
      
      messages.forEach(text => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        synth.speak(utterance);
      });
    }
  }