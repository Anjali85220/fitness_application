import { useEffect, useState } from 'react'
import { squatRules, pushupRules } from '../utils/poseRules'

export function evaluatePose(landmarks, exercise) {
  if (!landmarks || !exercise) return { feedback: '', landmarksToColor: null }

  const rules = exercise === 'squats' ? squatRules : pushupRules
  const feedback = []
  const landmarksToColor = Array(33).fill('#00FF00') // Green by default
  const annotations = []
  let phase = ''

  // Implement exercise-specific rules
  if (exercise === 'squats') {
    // Calculate angles and positions for squats
    const leftHip = landmarks[23]
    const leftKnee = landmarks[25]
    const leftAnkle = landmarks[27]
    const rightHip = landmarks[24]
    const rightKnee = landmarks[26]
    const rightAnkle = landmarks[28]
    const nose = landmarks[0]
    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]

    // Determine phase
    const hipY = (leftHip.y + rightHip.y) / 2
    const kneeY = (leftKnee.y + rightKnee.y) / 2
    const previousHipY = window.previousHipY || hipY
    window.previousHipY = hipY

    if (hipY < kneeY) {
      phase = 'top'
    } else if (hipY > kneeY && hipY > previousHipY) {
      phase = 'ascending'
    } else if (hipY > kneeY && hipY <= previousHipY) {
      phase = 'descending'
    } else {
      phase = 'bottom'
    }

    // Check back angle (simple check)
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2
    const hipMidX = (leftHip.x + rightHip.x) / 2
    const backAngle = Math.abs(shoulderMidX - hipMidX) / Math.abs(nose.y - hipMidY)

    if (backAngle > 0.3) {
      feedback.push('Keep your back straight!')
      landmarksToColor[11] = '#FF0000' // Left shoulder
      landmarksToColor[12] = '#FF0000' // Right shoulder
      landmarksToColor[23] = '#FF0000' // Left hip
      landmarksToColor[24] = '#FF0000' // Right hip
      
      annotations.push({
        type: 'arrow',
        position: [shoulderMidX * 10, -hipMidY * 10, 0],
        direction: [0, -1, 0],
        length: 2,
        color: 0xff0000
      })
    }

    // Check knee position
    const kneeOverToe = (kneeX - ankleX) / (hipX - ankleX)
    if (kneeOverToe > 1.2) {
      feedback.push('Don\'t let your knees go past your toes!')
      landmarksToColor[25] = '#FF0000' // Left knee
      landmarksToColor[26] = '#FF0000' // Right knee
    }

  } else if (exercise === 'pushups') {
    // Similar implementation for pushups
    // ... pushup-specific rules ...
  }

  return {
    feedback: feedback.join(' '),
    landmarksToColor: feedback.length > 0 ? landmarksToColor : null,
    annotations,
    phase
  }
}

export function useExerciseRules() {
  return { evaluatePose }
}