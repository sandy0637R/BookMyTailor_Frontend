import React, { useRef, useState, useEffect } from "react";
import ColorThief from "colorthief";
import TailorProfile from "../components/TailorProfile";
const detectSkinType = ([r, g, b]) => {
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  if (brightness > 230) return "I";
  if (brightness > 200) return "II";
  if (brightness > 170) return "III";
  if (brightness > 130) return "IV";
  if (brightness > 90) return "V";
  return "VI";
};

const palettes = {
  I: ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#DDA0DD", "#FF69B4"],
  II: ["#E9967A", "#F08080", "#87CEEB", "#20B2AA", "#FFDEAD", "#B0C4DE"],
  III: ["#FF8C00", "#6B8E23", "#40E0D0", "#CD5C5C", "#DAA520", "#5F9EA0"],
  IV: ["#DC143C", "#A0522D", "#556B2F", "#FFA07A", "#D2B48C", "#B22222"],
  V: ["#8B4513", "#2E8B57", "#A52A2A", "#F4A460", "#8FBC8F", "#BC8F8F"],
  VI: ["#000000", "#708090", "#9932CC", "#FF6347", "#A9A9A9", "#D2691E"],
};

const PalletePage = () => {
  const [palette, setPalette] = useState([]);
  const [skinType, setSkinType] = useState("");
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const imgRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef(null);

  // Load from localStorage on first load
  useEffect(() => {
    const storedImage = localStorage.getItem("image");
    const storedSkinType = localStorage.getItem("skinType");
    const storedPalette = JSON.parse(localStorage.getItem("palette"));

    if (storedImage) setImage(storedImage);
    if (storedSkinType) setSkinType(storedSkinType);
    if (storedPalette) setPalette(storedPalette);
  }, []);

  // Handle camera access
  useEffect(() => {
    if (isCapturing) {
      const getCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      };
      getCamera();
    } else {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCapturing]);

  // Capture from camera
  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const capturedImage = canvasRef.current.toDataURL("image/png");
    setImage(capturedImage);
    localStorage.setItem("image", capturedImage);
    setSkinType("");
    localStorage.removeItem("skinType");
    setPalette([]);
    localStorage.removeItem("palette");
    setIsCapturing(false);
  };

  // Upload from file
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      localStorage.setItem("image", reader.result);
      setSkinType("");
      localStorage.removeItem("skinType");
      setPalette([]);
      localStorage.removeItem("palette");
    };
    reader.readAsDataURL(file);
  };

  // On image load, extract skin type and palette
  const handleImageLoad = () => {
    try {
      const colorThief = new ColorThief();
      const dominant = colorThief.getColor(imgRef.current);
      const type = detectSkinType(dominant);
      const colors = palettes[type];

      setSkinType(type);
      localStorage.setItem("skinType", type);

      setPalette(colors);
      localStorage.setItem("palette", JSON.stringify(colors));
    } catch (err) {
      console.error("Image error:", err);
    }
  };

  // Clear all
  const removeImage = () => {
    setImage(null);
    setSkinType("");
    setPalette([]);
    localStorage.removeItem("image");
    localStorage.removeItem("skinType");
    localStorage.removeItem("palette");
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Skin Tone Palette Detector</h2>

      {!image && (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="w-full mt-1 border rounded p-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Capture from Camera</span>
            <div className="relative">
              <button
                onClick={() => setIsCapturing(!isCapturing)}
                className="px-4 py-2 text-white bg-indigo-600 rounded"
              >
                {isCapturing ? "Stop Camera" : "Start Camera"}
              </button>
              {isCapturing && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-40 object-cover rounded-md mt-2"
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" width="640" height="480" />
                  <button
                    onClick={handleCapture}
                    className="absolute bottom-4 left-4 px-4 py-2 text-white bg-indigo-600 rounded"
                  >
                    Capture
                  </button>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      {image && (
        <div className="text-center">
          <img
            src={image}
            ref={imgRef}
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
            alt="uploaded"
            className="w-40 h-40 object-cover rounded-full mx-auto"
          />
          <button
            onClick={removeImage}
            className="mt-2 text-red-500 hover:underline text-sm"
          >
            Remove Image
          </button>
        </div>
      )}

      {palette.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Detected Skin Type: <span className="text-indigo-600">Type {skinType}</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {palette.map((color, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded shadow border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
      <TailorProfile/>
    </div>
  );
};

export default PalletePage;
