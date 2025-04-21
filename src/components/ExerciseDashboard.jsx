// src/components/ExerciseDashboard.jsx
import { motion } from 'framer-motion';

export default function ExerciseDashboard({ exercise, reps, calories }) {
  return (
    <div className="dashboard">
      <motion.div 
        className="exercise-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="exercise-header">
          <h2>{exercise ? `${exercise} Mode` : 'Select Exercise'}</h2>
          <div className="exercise-badge">
            {exercise || 'None'}
          </div>
        </div>
        
        <div className="stats-grid">
          <StatCard 
            icon="🔄" 
            value={reps} 
            label="Reps" 
            color="#4CAF50"
          />
          <StatCard 
            icon="🔥" 
            value={calories} 
            label="Calories" 
            color="#FF5722"
          />
          <StatCard 
            icon="⏱️" 
            value="00:00" 
            label="Time" 
            color="#2196F3"
          />
          <StatCard 
            icon="💪" 
            value="Beginner" 
            label="Level" 
            color="#9C27B0"
          />
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}