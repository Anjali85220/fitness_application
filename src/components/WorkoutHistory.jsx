// src/components/WorkoutHistory.jsx
export default function WorkoutHistory({ workouts }) {
    return (
      <div className="workout-history">
        <h2>Your Workout Journey</h2>
        <div className="timeline">
          {workouts.map((workout, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-date">
                {new Date(workout.date).toLocaleDateString()}
              </div>
              <div className="timeline-content">
                <h3>{workout.exercise}</h3>
                <div className="workout-stats">
                  <span>Reps: {workout.reps}</span>
                  <span>Duration: {workout.duration}</span>
                </div>
                {workout.achievements && (
                  <div className="achievements">
                    {workout.achievements.map((ach, i) => (
                      <span key={i} className="achievement-badge">{ach}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }