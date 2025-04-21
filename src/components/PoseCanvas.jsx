import React, { useEffect, useRef } from 'react'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { POSE_CONNECTIONS } from '@mediapipe/pose'
import { evaluatePose } from '../hooks/useExerciseRules'

function PoseCanvas({ poseResults, exercise, setFeedback }) {
  const canvasRef = useRef(null)
  const repCountRef = useRef(0)
  const lastPhaseRef = useRef(null)

  useEffect(() => {
    if (!poseResults || !canvasRef.current || !exercise) return

    const canvasCtx = canvasRef.current.getContext('2d')
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    canvasCtx.drawImage(
      poseResults.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )

    // Evaluate pose and get feedback
    const { feedback, landmarksToColor, phase } = evaluatePose(
      poseResults.poseLandmarks,
      exercise
    )

    // Check for rep completion
    if (phase === 'bottom' && lastPhaseRef.current === 'descending') {
      repCountRef.current += 1
      setFeedback(`Good rep! Total: ${repCountRef.current}`)
    }
    lastPhaseRef.current = phase

    // Draw landmarks with color coding
    if (landmarksToColor) {
      const coloredLandmarks = poseResults.poseLandmarks.map((landmark, i) => ({
        ...landmark,
        visibility: landmark.visibility,
        color: landmarksToColor[i] || '#FFFFFF'
      }))

      drawConnectors(canvasCtx, coloredLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
      })
      drawLandmarks(canvasCtx, coloredLandmarks, {
        color: '#FF0000',
        lineWidth: 1,
        radius: (data) => {
          return 3 * data.from.z + 3
        }
      })
    }
  }, [poseResults, exercise])

  return (
    <div className="pose-canvas">
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: 'none' }} // We'll show the processed canvas in CameraFeed
      />
    </div>
  )
}

export default PoseCanvas