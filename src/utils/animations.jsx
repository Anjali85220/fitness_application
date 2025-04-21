export function createRepAnimation(repCount) {
    // This would be more complex in a real implementation
    return {
      duration: 1000,
      keyframes: [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.8, transform: 'scale(1.2)' },
        { opacity: 1, transform: 'scale(1)' }
      ]
    }
  }
  
  export function createFeedbackAnimation() {
    return {
      duration: 500,
      keyframes: [
        { color: 'red', offset: 0 },
        { color: 'white', offset: 0.5 },
        { color: 'red', offset: 1 }
      ]
    }
  }