import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Pose } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

export default function CameraFeed({ exercise, setRepCount, setFeedback }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const repCountRef = useRef(0);
  const lastPhaseRef = useRef('');

  const calculateAngle = (a, b, c) => {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const cb = { x: b.x - c.x, y: b.y - c.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const cross = ab.x * cb.y - ab.y * cb.x;
    return Math.abs(Math.atan2(cross, dot) * (180 / Math.PI));
  };

  const evaluateSquat = (landmarks) => {
    const feedback = [];
    const landmarksToColor = Array(33).fill('#00FF00');
    let phase = '';

    const [lh, lk, la] = [landmarks[23], landmarks[25], landmarks[27]];
    const [rh, rk, ra] = [landmarks[24], landmarks[26], landmarks[28]];
    const [ls, rs] = [landmarks[11], landmarks[12]];

    const hipY = (lh.y + rh.y) / 2;
    const kneeY = (lk.y + rk.y) / 2;

    const prevHipY = window.prevHipY || hipY;
    window.prevHipY = hipY;

    if (hipY < kneeY) phase = 'top';
    else if (hipY > kneeY && hipY > prevHipY) phase = 'ascending';
    else if (hipY > kneeY && hipY <= prevHipY) phase = 'descending';
    else phase = 'bottom';

    const shoulderX = (ls.x + rs.x) / 2;
    const hipX = (lh.x + rh.x) / 2;
    const backAngle = Math.abs(shoulderX - hipX);

    if (backAngle > 0.2) {
      feedback.push('Keep your back straight!');
      [11, 12, 23, 24].forEach(i => (landmarksToColor[i] = '#FF0000'));
    }

    const leftKneeRatio = Math.abs((lk.x - la.x) / (lh.x - la.x));
    const rightKneeRatio = Math.abs((rk.x - ra.x) / (rh.x - ra.x));

    if (leftKneeRatio > 1.2 || rightKneeRatio > 1.2) {
      feedback.push('Keep knees behind toes!');
      [25, 26, 27, 28].forEach(i => (landmarksToColor[i] = '#FF0000'));
    }

    if (phase === 'bottom' && hipY < kneeY * 1.1) {
      feedback.push('Go deeper!');
      [23, 24, 25, 26].forEach(i => (landmarksToColor[i] = '#FF0000'));
    }

    return { feedback: feedback.join(' '), landmarksToColor, phase };
  };

  const evaluatePushup = (landmarks) => {
    const feedback = [];
    const landmarksToColor = Array(33).fill('#00FF00');
    let phase = '';

    const [ls, rs] = [landmarks[11], landmarks[12]];
    const [le, re] = [landmarks[13], landmarks[14]];
    const [lw, rw] = [landmarks[15], landmarks[16]];
    const [lh, rh] = [landmarks[23], landmarks[24]];

    const wristY = (lw.y + rw.y) / 2;
    const shoulderY = (ls.y + rs.y) / 2;
    const hipY = (lh.y + rh.y) / 2;

    const prevWristY = window.prevWristY || wristY;
    window.prevWristY = wristY;

    if (wristY > shoulderY) phase = 'top';
    else if (wristY < shoulderY && wristY < prevWristY) phase = 'descending';
    else if (wristY < shoulderY && wristY >= prevWristY) phase = 'ascending';
    else phase = 'bottom';

    if (Math.abs(shoulderY - hipY) > 0.15) {
      feedback.push('Keep your body straight!');
      [11, 12, 23, 24].forEach(i => (landmarksToColor[i] = '#FF0000'));
    }

    const leftAngle = calculateAngle(ls, le, lw);
    const rightAngle = calculateAngle(rs, re, rw);

    if (leftAngle < 45 || rightAngle < 45) {
      feedback.push('Keep elbows at 45 degrees');
      [13, 14, 15, 16].forEach(i => (landmarksToColor[i] = '#FF0000'));
    }

    if (phase === 'bottom' && wristY < shoulderY * 1.2) {
      feedback.push('Lower your chest!');
      [11, 12, 15, 16].forEach(i => (landmarksToColor[i] = '#FF0000'));
    }

    return { feedback: feedback.join(' '), landmarksToColor, phase };
  };

  useEffect(() => {
    let camera = null;
    let pose = null;

    const setupCameraAndPose = async () => {
      if (!webcamRef.current || !canvasRef.current) return;

      pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults((results) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = webcamRef.current.videoWidth;
        canvas.height = webcamRef.current.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.poseLandmarks) {
          let evalResult;

          if (exercise === 'squats') {
            evalResult = evaluateSquat(results.poseLandmarks);
          } else if (exercise === 'pushups') {
            evalResult = evaluatePushup(results.poseLandmarks);
          }

          if (evalResult) {
            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
              color: '#00FF00',
              lineWidth: 4,
            });

            drawLandmarks(ctx, results.poseLandmarks, {
              color: '#FF0000',
              lineWidth: 2,
            });

            // **Rep counting logic**
            if (
              evalResult.phase === 'bottom' &&
              lastPhaseRef.current === 'descending'
            ) {
              repCountRef.current += 1;
              setRepCount(repCountRef.current);
            }

            lastPhaseRef.current = evalResult.phase;
            setFeedback(evalResult.feedback);
          }
        }
      });

      camera = new Camera(webcamRef.current, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current });
        },
        width: 640,
        height: 480,
      });

      camera.start().catch((err) => {
        setCameraError('Failed to start camera: ' + err.message);
        console.error(err);
      });
    };

    setupCameraAndPose();

    return () => {
      if (camera) camera.stop();
    };
  }, [exercise, setRepCount, setFeedback]);

  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      {cameraError && <div style={{ color: 'red' }}>{cameraError}</div>}
      <video ref={webcamRef} style={{ display: 'none' }} playsInline />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
}
