// src/components/ProgressTracker.jsx
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ProgressTracker({ reps }) {
  const [dailyGoal, setDailyGoal] = useState(50);
  const [progress, setProgress] = useState(0);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setProgress(Math.min((reps / dailyGoal) * 100, 100));
    
    // Check for achievements
    if (reps > 0 && reps % 10 === 0) {
      setAchievements(prev => [
        ...prev,
        `🏆 ${reps} reps completed!`
      ]);
    }
  }, [reps, dailyGoal]);

  return (
    <div className="progress-tracker">
      <div className="progress-circle">
        <CircularProgressbar
          value={progress}
          text={`${Math.round(progress)}%`}
          styles={buildStyles({
            pathColor: `rgba(76, 175, 80, ${progress / 100})`,
            textColor: '#fff',
            trailColor: '#2c3e50',
          })}
        />
        <div className="goal-text">Daily Goal: {dailyGoal} reps</div>
      </div>
      
      <div className="achievements-list">
        <h3>Recent Achievements</h3>
        {achievements.slice(-3).map((ach, index) => (
          <div key={index} className="achievement-badge">
            {ach}
          </div>
        ))}
      </div>
    </div>
  );
}