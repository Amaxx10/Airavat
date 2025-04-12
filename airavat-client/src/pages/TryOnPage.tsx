import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Sparkles, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ngrokURL } from '../config/backendURL';

export function TryOnPage() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        streamRef.current = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setIsCameraActive(false)
    }
  }

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setSelectedFile(file)
    }
  }


  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected to upload.")
      return
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append("image", new File([selectedFile], "upload.jpg", {
      type: selectedFile.type || "image/jpeg",
    }))
    formData.append("description", "Fashion try-on submission")
    formData.append("location", JSON.stringify({ lat: 0, lng: 0 }))
    formData.append(
      "question",
      "Describe the image as if someone is reporting a problem to an authority. Focus on the key issue being reported. Be concise and avoid any introductory or concluding remarks. Do not include any JSON data or preamble/postamble. Do not mention the image itself or that you are describing it. Just state the problem as a report."
    )

    try {
      const res = await axios.post(`${ngrokURL}/closet/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Image uploaded:", res.data)
      navigate("/styling")
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }
  // const handleUpload = async () => {
  //   if (!selectedFile) {
  //     console.error("No file selected to upload.")
  //     return
  //   }
  //
  //   setIsUploading(true)
  //
  //   const formData = new FormData()
  //   formData.append(
  //     "image",
  //     new File([selectedFile], "upload.jpg", {
  //       type: selectedFile.type || "image/jpeg",
  //     }),
  //   )
  //   formData.append("description", "Fashion try-on submission")
  //
  //   try {
  //     // Simulating upload delay
  //     await new Promise((resolve) => setTimeout(resolve, 1500))
  //     setIsUploading(false)
  //
  //     // Show success message or navigate
  //     navigate("/styling")
  //   } catch (error) {
  //     console.error("Upload failed:", error)
  //     setIsUploading(false)
  //   }
  // }

  return (
    <div className="animate-fadeIn flex flex-col items-center space-y-6 pb-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-serif font-medium ghibli-gradient-text mb-2">Magical Mirror</h2>
        <p className="text-ghibli-night opacity-70 font-serif">See how the spirits transform your style</p>
      </div>

      <div className="ghibli-card w-full aspect-[3/4] mb-2 flex items-center justify-center overflow-hidden relative">
        {isCameraActive ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : imagePreview ? (
          <>
            <img src={imagePreview || "/placeholder.svg"} alt="captured" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-30"></div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-ghibli-meadow bg-opacity-30 flex items-center justify-center mb-4 animate-float">
              <Camera size={32} className="text-ghibli-forest" />
            </div>
            <p className="font-serif text-ghibli-night opacity-80 mb-6">
              Capture your outfit to receive magical style suggestions
            </p>
            <label
              htmlFor="camera-file-input"
              className="bg-gradient-to-r from-ghibli-forest to-ghibli-sky text-white rounded-xl px-6 py-3 flex items-center gap-2 shadow-ghibli hover:shadow-ghibli-lg transition-all hover:-translate-y-1 cursor-pointer font-serif"
            >
              <Camera size={18} />
              <span>Take a Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                id="camera-file-input"
                onChange={handleCapture}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {imagePreview && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-gradient-to-r from-ghibli-blossom to-ghibli-sunset text-white rounded-xl py-3 font-serif shadow-ghibli hover:shadow-ghibli-lg transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:transform-none"
        >
          <div className="flex items-center justify-center gap-2">
            {isUploading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Enchanting Your Look...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Transform Your Look ✨</span>
              </>
            )}
          </div>
        </button>
      )}

      {!imagePreview && !isCameraActive && (
        <button
          onClick={() => navigate("/styling")}
          className="w-full ghibli-card py-3 font-serif flex items-center justify-center gap-2 hover:shadow-ghibli transition-shadow"
        >
          <Sparkles size={18} className="text-ghibli-forest" />
          <span className="text-ghibli-night">Go to Spirit Styling</span>
        </button>
      )}

      <div className="w-full mt-4">
        <h3 className="font-serif text-ghibli-night mb-3">Recent Enchantments</h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ghibli-card aspect-square overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-ghibli-cloud to-ghibli-sky opacity-30"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

