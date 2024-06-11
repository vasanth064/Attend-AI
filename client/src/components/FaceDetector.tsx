import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';
import { useToast } from './ui/use-toast';
interface FaceDetectorProps {
  onFaceDetected: (imageUrl: string) => void;
  attendanceMode: boolean;
}

function FaceDetector({
  onFaceDetected,
  attendanceMode = false,
}: FaceDetectorProps) {
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [captureVideo, setCaptureVideo] = useState<boolean>(true);

  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => setModelsLoaded(true));
    };
    loadModels();
  }, []);
  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  const startVideo = async () => {
    try {
      setCaptureVideo(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300 },
      });
      const video = videoRef.current;

      if (video) {
        video.srcObject = stream;
        video.play();
      }
    } catch (err) {
      console.log('error:', err);
    }
  };
  const handleVideoOnPlay = async () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current && videoRef.current) {
        const faceApiCanvas = faceapi?.createCanvas(videoRef.current);
        canvasRef.current.innerHTML = faceApiCanvas.innerHTML;
        const displaySize = {
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();
        if (detections.length > 1) {
          toast({
            title: 'Multiple faces detected',
            description: 'Please try again',
          });
          console.log('more than one face detected');
          return;
        }
        if (detections.length === 0) {
          return;
        }
        if (attendanceMode) {
          const prevFace = sessionStorage.getItem('prevFace');
          if (prevFace) {
            const faceMatch = new faceapi.FaceMatcher(
              detections[0].descriptor,
              0.5
            );
            const floatArray = new Float32Array(JSON.parse(prevFace));

            const faceDistance = faceMatch.findBestMatch(floatArray);

            if (faceDistance.distance < 0.5) {
              return toast({
                title: 'Attendance Request Already Received',
                description: 'Duplicate Attendance Request',
              });
            }
          } else {
            const desArray = Array.from(detections[0].descriptor);
            sessionStorage.setItem('prevFace', JSON.stringify(desArray));
          }
        }
        if (!(detections[0].expressions.happy > 0.4)) {
          return toast({
            title: 'Smile Please !!',
            description: 'Please smile to take a picture',
          });
        }
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        if (resizedDetections.length > 0) {
          if (!videoRef.current) {
            console.log('video not ready');
          } else {
            const score = resizedDetections[0].detection.score;
            if (score > 0.3) {
              const canvas = canvasRef.current;
              const context = canvas.getContext('2d');
              context?.drawImage(
                videoRef.current,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
              const imageUrl = canvas.toDataURL('image/jpeg', 0.5);
              if (onFaceDetected) {
                onFaceDetected(imageUrl);
                const desArray = Array.from(detections[0].descriptor);
                sessionStorage.setItem('prevFace', JSON.stringify(desArray));
              }
            }
          }
        }
      }
    }, 1500);
  };

  return (
    <div>
      {captureVideo && modelsLoaded && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '10px',
            }}>
            <>
              <video
                ref={videoRef}
                height={videoHeight}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
                style={{ borderRadius: '10px' }}
              />
              <canvas ref={canvasRef} style={{ position: 'absolute' }} />
            </>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaceDetector;
