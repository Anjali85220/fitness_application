// src/hooks/usePoseDetection.js
import { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

export const usePoseDetection = (webcamRef, canvasRef, exerciseType) => {
  const [poseResults, setPoseResults] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [repCount, setRepCount] = useState(0);
  const poseRef = useRef(null);
  const lastPhaseRef = useRef(null);
  const previousHipYRef = useRef(null);

  // Initialize pose detection
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      setPoseResults(results);

      if (canvasRef.current && results.image) {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        if (results.poseLandmarks) {
          const { feedback, landmarksToColor } = evaluatePose(results.poseLandmarks, exerciseType);
          setFeedback(feedback);

          const drawFn = landmarksToColor
            ? () => {
                const coloredLandmarks = results.poseLandmarks.map((landmark, i) => ({
                  ...landmark,
                  color: landmarksToColor[i] || '#00FF00',
                }));
                drawConnectors(canvasCtx, coloredLandmarks, POSE_CONNECTIONS, {
                  color: '#00FF00',
                  lineWidth: 2,
                });
                drawLandmarks(canvasCtx, coloredLandmarks, {
                  color: '#FF0000',
                  radius: (data) => 3 * data.from.z + 3,
                });
              }
            : () => {
                drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
                  color: '#00FF00',
                  lineWidth: 2,
                });
                drawLandmarks(canvasCtx, results.poseLandmarks, {
                  color: '#FF0000',
                  radius: (data) => 3 * data.from.z + 3,
                });
              };

          drawFn();
        }

        canvasCtx.restore();
      }
    });

    poseRef.current = pose;

    return () => {
      pose.close();
    };
  }, [exerciseType, canvasRef]);

  // Setup camera
  useEffect(() => {
    if (webcamRef.current && webcamRef.current.video) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current && webcamRef.current.video && poseRef.current) {
            await poseRef.current.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();

      return () => {
        camera.stop();
      };
    }
  }, [webcamRef]);

  // Evaluate pose logic
  const evaluatePose = (landmarks, exercise) => {
    if (!landmarks || !exercise) return { feedback: '', landmarksToColor: null };

    const feedbackMessages = [];
    const landmarksToColor = Array(33).fill('#00FF00');
    let phase = '';

    if (exercise === 'squats') {
      const leftHip = landmarks[23], rightHip = landmarks[24];
      const leftKnee = landmarks[25], rightKnee = landmarks[26];
      const leftAnkle = landmarks[27], rightAnkle = landmarks[28];
      const nose = landmarks[0];
      const leftShoulder = landmarks[11], rightShoulder = landmarks[12];

      const hipMidY = (leftHip.y + rightHip.y) / 2;
      const kneeMidY = (leftKnee.y + rightKnee.y) / 2;
      const previousHipY = previousHipYRef.current ?? hipMidY;
      previousHipYRef.current = hipMidY;

      if (hipMidY < kneeMidY) {
        phase = 'top';
      } else if (hipMidY > kneeMidY && hipMidY > previousHipY) {
        phase = 'ascending';
      } else if (hipMidY > kneeMidY && hipMidY <= previousHipY) {
        phase = 'descending';
      } else {
        phase = 'bottom';
      }

      const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
      const hipMidX = (leftHip.x + rightHip.x) / 2;
      const backAngle = Math.abs(shoulderMidX - hipMidX) / Math.abs(nose.y - hipMidY);

      if (backAngle > 0.3) {
        feedbackMessages.push('Keep your back straight!');
        [11, 12, 23, 24].forEach(idx => landmarksToColor[idx] = '#FF0000');
      }

      const leftKneeOverToe = (leftKnee.x - leftAnkle.x) / (leftHip.x - leftAnkle.x);
      const rightKneeOverToe = (rightKnee.x - rightAnkle.x) / (rightHip.x - rightAnkle.x);

      if (leftKneeOverToe > 1.2 || rightKneeOverToe > 1.2) {
        feedbackMessages.push("Don't let your knees go past your toes!");
        [25, 26, 27, 28].forEach(idx => landmarksToColor[idx] = '#FF0000');
      }

      if (phase === 'bottom' && lastPhaseRef.current === 'descending') {
        setRepCount(prev => prev + 1);
      }

      lastPhaseRef.current = phase;

    } else if (exercise === 'pushups') {
      const leftShoulder = landmarks[11], rightShoulder = landmarks[12];
      const leftElbow = landmarks[13], rightElbow = landmarks[14];
      const leftWrist = landmarks[15], rightWrist = landmarks[16];

      const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
      const wristMidY = (leftWrist.y + rightWrist.y) / 2;

      const previousShoulderY = previousHipYRef.current ?? shoulderMidY;
      previousHipYRef.current = shoulderMidY;

      if (shoulderMidY < wristMidY) {
        phase = 'up';
      } else if (shoulderMidY > wristMidY && shoulderMidY > previousShoulderY) {
        phase = 'descending';
      } else if (shoulderMidY > wristMidY && shoulderMidY <= previousShoulderY) {
        phase = 'ascending';
      } else {
        phase = 'down';
      }

      const elbowDiff = Math.abs(leftElbow.y - leftShoulder.y) + Math.abs(rightElbow.y - rightShoulder.y);
      if (elbowDiff > 0.2) {
        feedbackMessages.push("Keep your elbows tucked in!");
        [13, 14].forEach(idx => landmarksToColor[idx] = '#FF0000');
      }

      if (phase === 'up' && lastPhaseRef.current === 'ascending') {
        setRepCount(prev => prev + 1);
      }

      lastPhaseRef.current = phase;
    }

    return {
      feedback: feedbackMessages.join(' '),
      landmarksToColor
    };
  };

  return { poseResults, feedback, repCount };
};
