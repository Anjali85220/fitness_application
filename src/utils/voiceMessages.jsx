export function speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }
  
  export const squatMessages = {
    backStraight: 'Keep your back straight',
    kneesOverToes: 'Avoid knees going over toes',
    goodRep: 'Good squat!',
    notLowEnough: 'Go deeper, thighs parallel to ground'
  }
  
  export const pushupMessages = {
    bodyStraight: 'Keep your body in a straight line',
    elbows45: 'Maintain 45 degree elbow angle',
    chestToGround: 'Lower your chest to the ground',
    goodRep: 'Perfect pushup!'
  }