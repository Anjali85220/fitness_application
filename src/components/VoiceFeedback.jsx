import React, { useEffect } from 'react'
import { speak } from '../utils/voiceMessages'

function VoiceFeedback({ feedback }) {
  useEffect(() => {
    if (feedback) {
      speak(feedback)
    }
  }, [feedback])

  return (
    <div className="voice-feedback">
      {feedback && <p>{feedback}</p>}
    </div>
  )
}

export default VoiceFeedback