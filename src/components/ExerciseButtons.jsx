// src/components/ExerciseButtons.jsx
import { motion } from 'framer-motion';

export default function ExerciseButtons({ setExercise, disabled }) {
  const exercises = [
    { name: 'squats', label: 'START SQUATS', icon: '🏋️' },
    { name: 'pushups', label: 'START PUSH-UPS', icon: '💪' }
  ];

  return (
    <div className="exercise-buttons-container">
      {exercises.map((ex) => (
        <motion.button
          key={ex.name}
          className={`exercise-button ${ex.name}`}
          onClick={() => setExercise(ex.name)}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="exercise-icon">{ex.icon}</span>
          {ex.label}
        </motion.button>
      ))}
    </div>
  );
}