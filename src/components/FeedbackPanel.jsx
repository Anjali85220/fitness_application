// src/components/FeedbackPanel.jsx
import { useEffect, useState } from 'react';

export default function FeedbackPanel({ feedback, reps }) {
  const [tips, setTips] = useState([]);
  
  useEffect(() => {
    if (feedback) {
      setTips(prev => [...prev, { 
        text: feedback, 
        id: Date.now(),
        type: feedback.includes('Good') ? 'success' : 'error'
      }]);
      
      // Auto-remove tips after 5 seconds
      const timer = setTimeout(() => {
        setTips(prev => prev.slice(1));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <div className="feedback-panel">
      <div className="rep-counter">
        <div className="rep-circle">
          <span>{reps}</span>
        </div>
        <p>REPS COMPLETED</p>
      </div>
    </div>
  );
}
