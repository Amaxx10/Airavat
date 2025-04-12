import { useEffect, useRef, useState } from 'react';

interface CameraModalProps {
  onClose: () => void;
  onCapture: (imageUrl: string) => void;
}

export function CameraModal({ onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          streamRef.current = stream;
          setIsCameraReady(true);
        }
      } catch (err) {
        console.error('Camera error:', err);
        onClose();
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [onClose]);

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/jpeg');
      onCapture(imageUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-sm">
        <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden mb-4">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md">Cancel</button>
          <button
            onClick={captureImage}
            disabled={!isCameraReady}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md disabled:opacity-50"
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}
