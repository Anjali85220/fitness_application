import { motion, AnimatePresence } from 'framer-motion';

export default function ExerciseDemo({ exercise, onClose }) {
  const demos = {
    squats: {
      title: "Perfect Squat Form",
      tips: [
        "Keep feet shoulder-width apart",
        "Lower hips back and down",
        "Keep knees behind toes",
        "Maintain straight back"
      ],
      video: "/videos/squats.mp4",
      fallback: "/images/squat-fallback.jpg"
    },
    pushups: {
      title: "Proper Push-up Technique",
      tips: [
        "Hands slightly wider than shoulders",
        "Keep body in straight line",
        "Lower chest to floor",
        "Elbows at 45 degree angle"
      ],
      video: "/videos/pushups.mp4",
      fallback: "/images/pushup-fallback.jpg"
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="demo-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="demo-content"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>{demos[exercise].title}</h2>
          
          <div className="video-container">
            <video 
              src={demos[exercise].video} 
              controls 
              autoPlay 
              loop
              poster={demos[exercise].fallback}
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = document.createElement('img');
                fallback.src = demos[exercise].fallback;
                fallback.alt = `${exercise} demonstration`;
                fallback.className = 'video-fallback';
                e.target.parentNode.appendChild(fallback);
              }}
            />
          </div>

          <div className="demo-tips">
            <h3>Key Points:</h3>
            <ul>
              {demos[exercise].tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
          <button className="close-button" onClick={onClose}>
            Got It!
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}