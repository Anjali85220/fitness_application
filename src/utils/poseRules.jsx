export const squatRules = {
    phases: {
      top: [],
      descending: [
        {
          check: (landmarks) => {
            // Check back angle
            const leftShoulder = landmarks[11]
            const rightShoulder = landmarks[12]
            const leftHip = landmarks[23]
            const rightHip = landmarks[24]
            const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2
            const hipMidX = (leftHip.x + rightHip.x) / 2
            return Math.abs(shoulderMidX - hipMidX) > 0.2
          },
          message: 'Keep your back straight!',
          affectedLandmarks: [11, 12, 23, 24]
        },
        {
          check: (landmarks) => {
            // Check knee position
            const leftKnee = landmarks[25]
            const leftAnkle = landmarks[27]
            const rightKnee = landmarks[26]
            const rightAnkle = landmarks[28]
            return (
              (leftKnee.x - leftAnkle.x) / (leftHip.x - leftAnkle.x) > 1.2 ||
              (rightKnee.x - rightAnkle.x) / (rightHip.x - rightAnkle.x) > 1.2
            )
          },
          message: 'Don\'t let your knees go past your toes!',
          affectedLandmarks: [25, 26, 27, 28]
        }
      ],
      bottom: [
        {
          check: (landmarks) => {
            // Check depth
            const leftHip = landmarks[23]
            const rightHip = landmarks[24]
            const leftKnee = landmarks[25]
            const rightKnee = landmarks[26]
            return (
              (leftHip.y < leftKnee.y) ||
              (rightHip.y < rightKnee.y)
            )
          },
          message: 'Go deeper! Thighs should be parallel to the ground',
          affectedLandmarks: [23, 24, 25, 26]
        }
      ],
      ascending: []
    }
  }
  
  export const pushupRules = {
    phases: {
      top: [],
      descending: [
        {
          check: (landmarks) => {
            // Check back alignment
            const leftShoulder = landmarks[11]
            const rightShoulder = landmarks[12]
            const leftHip = landmarks[23]
            const rightHip = landmarks[24]
            const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2
            const hipMidY = (leftHip.y + rightHip.y) / 2
            return Math.abs(shoulderMidY - hipMidY) > 0.15
          },
          message: 'Keep your body straight!',
          affectedLandmarks: [11, 12, 23, 24]
        },
        {
          check: (landmarks) => {
            // Check elbow angle
            const leftElbow = this.calculateAngle(
              landmarks[11],
              landmarks[13],
              landmarks[15]
            )
            const rightElbow = this.calculateAngle(
              landmarks[12],
              landmarks[14],
              landmarks[16]
            )
            return leftElbow < 45 || rightElbow < 45
          },
          message: 'Keep your elbows at 45 degrees',
          affectedLandmarks: [13, 14, 15, 16]
        }
      ],
      bottom: [
        {
          check: (landmarks) => {
            // Check chest to ground distance
            const nose = landmarks[0]
            const leftShoulder = landmarks[11]
            const rightShoulder = landmarks[12]
            const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2
            return (nose.y - shoulderMidY) < 0.1
          },
          message: 'Lower your chest to the ground',
          affectedLandmarks: [0, 11, 12]
        }
      ],
      ascending: []
    },
    calculateAngle(a, b, c) {
      const ab = { x: b.x - a.x, y: b.y - a.y }
      const cb = { x: b.x - c.x, y: b.y - c.y }
      
      const dot = (ab.x * cb.x + ab.y * cb.y)
      const cross = (ab.x * cb.y - ab.y * cb.x)
      
      return Math.abs(Math.atan2(cross, dot) * (180 / Math.PI))
    }
  }