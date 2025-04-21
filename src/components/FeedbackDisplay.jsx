import { useEffect } from 'react'
import { speak } from '../utils/voiceMessages'

function FeedbackDisplay({ feedback }) {
  useEffect(() => {
    if (feedback) {
      speak(feedback)
    }
  }, [feedback])

  return (
    <div className="feedback-display">
      {feedback && <p>{feedback}</p>}
    </div>
  )
}

export default FeedbackDisplay