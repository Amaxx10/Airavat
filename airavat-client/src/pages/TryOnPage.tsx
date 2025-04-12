import { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function TryOnPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play(); // <- important for iOS
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    }
  };

  // const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setImagePreview(url);
  //   }
  // };


  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setSelectedFile(file); // <- store file for upload
    }
  };

  
// const handleUpload = async () => {
//   if (!selectedFile) {
//     console.error("No file selected to upload.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append('image', selectedFile);

//   try {
//     const res = await axios.post('http://localhost:3000/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     console.log('Image uploaded:', res.data);
//   } catch (err) {
//     console.error('Error uploading image:', err);
//   }
// };


const handleUpload = async () => {
  if (!selectedFile) {
    console.error("No file selected to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("image", new File([selectedFile], "upload.jpg", {
    type: selectedFile.type || "image/jpeg",
  }));
  formData.append("description", "Fashion try-on submission");
  formData.append("location", JSON.stringify({ lat: 0, lng: 0 })); // Replace with real location if needed
  formData.append(
    "question",
    "Describe the image as if someone is reporting a problem to an authority. Focus on the key issue being reported. Be concise and avoid any introductory or concluding remarks. Do not include any JSON data or preamble/postamble. Do not mention the image itself or that you are describing it. Just state the problem as a report."
  );

  try {
    const res = await axios.post(
      "https://0cf6-103-104-226-58.ngrok-free.app/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Image uploaded:", res.data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};


  return (
    <div className="animate-fadeIn flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Virtual Try-On</h2>

      <div className="bg-gray-200 rounded-xl w-full aspect-[3/4] mb-6 flex items-center justify-center overflow-hidden">
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : imagePreview ? (
          <img src={imagePreview} alt="captured" className="w-full h-full object-cover" />
        ) : (
          <>
            <label htmlFor="camera-file-input" className="cursor-pointer flex flex-col items-center justify-center">
              <Camera size={40} className="text-gray-500" />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                id="camera-file-input"
                onChange={handleCapture}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {/* <button 
        onClick={isCameraActive ? stopCamera : startCamera}
        className="w-full bg-indigo-500 text-white rounded-lg py-3 font-medium shadow-md mb-4 flex items-center justify-center gap-2"
      >
        <Camera size={18} />
        <span>{isCameraActive ? 'Stop Camera' : 'Open Camera'}</span>
      </button> */}

      <button
        onClick={handleUpload}
        className="w-full bg-pink-500 text-white rounded-lg py-3 font-semibold shadow-lg mb-4 flex items-center justify-center gap-2 hover:bg-pink-600 transition"
      >
        <Camera size={18} />
        <span>Upload Your Look ✨</span>
      </button>


      <button 
        onClick={() => navigate('/styling')}
        className="w-full bg-white border border-indigo-300 text-indigo-600 rounded-lg py-3 font-medium shadow-sm flex items-center justify-center gap-2"
      >
        <Sparkles size={18} />
        <span>Go to AI Styling</span>
      </button>

      <div className="mt-6 w-full">
        <h3 className="font-medium text-gray-700 mb-3">Recent Try-Ons</h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 rounded-lg aspect-square"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
