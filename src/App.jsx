import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import ExerciseDashboard from './components/ExerciseDashboard';
import ExerciseButtons from './components/ExerciseButtons';
import CameraFeed from './components/CameraFeed';
import FeedbackPanel from './components/FeedbackPanel';
import ProgressTracker from './components/ProgressTracker';
import ExerciseDemo from './components/ExerciseDemo';
import { provideVoiceFeedback } from './utils/voiceFeedback';
import './styles.css';

export default function App() {
  const [exercise, setExercise] = useState(null);
  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [showSplash, setShowSplash] = useState(true);

  // Calculate estimated calories (very rough estimate)
  const calories = Math.floor(reps * (exercise === 'squats' ? 0.5 : 0.3));

  useEffect(() => {
    if (exercise) {
      setShowDemo(true);
    }
  }, [exercise]);

  useEffect(() => {
    provideVoiceFeedback(feedback, reps);
  }, [feedback, reps]);

  const endWorkout = () => {
    if (reps > 0) {
      setWorkouts(prev => [...prev, {
        date: new Date().toISOString(),
        exercise,
        reps,
        calories,
        duration: '5:30' // You would calculate this
      }]);
    }
    setExercise(null);
    setReps(0);
  };

  // Render SplashScreen if showSplash is true
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Original app return
  return (
    <div className="app-container">
      <ExerciseDashboard 
        exercise={exercise} 
        reps={reps} 
        calories={calories} 
      />
      
      {!exercise ? (
        <ExerciseButtons setExercise={setExercise} />
      ) : (
        <>
          <button className="end-workout-button" onClick={endWorkout}>
            End Workout
          </button>
          <CameraFeed 
            exercise={exercise} 
            setReps={setReps} 
            setFeedback={setFeedback} 
          />
        </>
      )}
      
      <FeedbackPanel feedback={feedback} reps={reps} />
      <ProgressTracker reps={reps} />
      
      {exercise && showDemo && (
        <ExerciseDemo 
          exercise={exercise} 
          onClose={() => setShowDemo(false)} 
        />
      )}
      
      {workouts.length > 0 && (
        <WorkoutHistory workouts={workouts} />
      )}
    </div>
  );
}