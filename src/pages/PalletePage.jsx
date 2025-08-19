import React, { useRef, useState, useEffect } from "react";
import ColorThief from "colorthief";

// Detects skin type using average brightness of RGB
const detectSkinType = ([r, g, b]) => {
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  if (brightness > 230) return "I"; // Very fair
  if (brightness > 200) return "II"; // Fair
  if (brightness > 170) return "III"; // Medium fair
  if (brightness > 130) return "IV"; // Medium
  if (brightness > 90) return "V"; // Dark
  return "VI"; // Very dark
};

// Static palettes for each skin type
const palettes = {
  I: ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#DDA0DD", "#FF69B4"],
  II: ["#E9967A", "#F08080", "#87CEEB", "#20B2AA", "#FFDEAD", "#B0C4DE"],
  III: ["#FF8C00", "#6B8E23", "#40E0D0", "#CD5C5C", "#DAA520", "#5F9EA0"],
  IV: ["#DC143C", "#A0522D", "#556B2F", "#FFA07A", "#D2B48C", "#B22222"],
  V: ["#8B4513", "#2E8B57", "#A52A2A", "#F4A460", "#8FBC8F", "#BC8F8F"],
  VI: ["#000000", "#708090", "#9932CC", "#FF6347", "#A9A9A9", "#D2691E"],
};

// Utility: Generate complementary colors dynamically
const generateComplementary = ([r, g, b]) => {
  const comp = [255 - r, 255 - g, 255 - b];
  return `rgb(${comp[0]}, ${comp[1]}, ${comp[2]})`;
};

const PalletePage = () => {
  const [palette, setPalette] = useState([]);
  const [skinType, setSkinType] = useState("");
  const [image, setImage] = useState(null);
  const [dominantColor, setDominantColor] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const imgRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const storedImage = localStorage.getItem("image");
    const storedSkinType = localStorage.getItem("skinType");
    const storedPalette = JSON.parse(localStorage.getItem("palette"));
    const storedDominant = JSON.parse(localStorage.getItem("dominant"));

    if (storedImage) setImage(storedImage);
    if (storedSkinType) setSkinType(storedSkinType);
    if (storedPalette) setPalette(storedPalette);
    if (storedDominant) setDominantColor(storedDominant);
  }, []);

  // Handle camera access
  useEffect(() => {
    if (isCapturing) {
      const getCamera = async () => {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === "videoinput");

          const laptopCam =
            videoDevices.find((d) =>
              d.label.toLowerCase().includes("integrated")
            ) || videoDevices[0];

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: laptopCam.deviceId },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            streamRef.current = stream;
          }
        } catch (err) {
          console.error("Camera error:", err);
          setIsCapturing(false);
        }
      };
      getCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCapturing]);

  // Capture from camera
  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const capturedImage = canvasRef.current.toDataURL("image/png");
    setImage(capturedImage);
    localStorage.setItem("image", capturedImage);
    resetAnalysis();
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
      resetAnalysis();
    };
    reader.readAsDataURL(file);
  };

  // Reset stored results
  const resetAnalysis = () => {
    setSkinType("");
    localStorage.removeItem("skinType");
    setPalette([]);
    localStorage.removeItem("palette");
    setDominantColor(null);
    localStorage.removeItem("dominant");
  };

  // On image load → extract colors
  const handleImageLoad = () => {
    try {
      const colorThief = new ColorThief();
      const dominant = colorThief.getColor(imgRef.current);
      const paletteSample = colorThief.getPalette(imgRef.current, 6);

      const avg = paletteSample
        .reduce(
          (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
          [0, 0, 0]
        )
        .map((v) => Math.round(v / paletteSample.length));

      const type = detectSkinType(avg);
      const basePalette = palettes[type];
      const complementary = generateComplementary(dominant);

      setSkinType(type);
      localStorage.setItem("skinType", type);

      setDominantColor(dominant);
      localStorage.setItem("dominant", JSON.stringify(dominant));

      const finalPalette = [...basePalette, complementary];
      setPalette(finalPalette);
      localStorage.setItem("palette", JSON.stringify(finalPalette));
    } catch (err) {
      console.error("Image error:", err);
    }
  };

  // Clear all
  const removeImage = () => {
    setImage(null);
    resetAnalysis();
    localStorage.removeItem("image");
  };

  return (
    <div className="min-h-screen w-full bg-neutral-primary text-brown-primary px-4 py-8">
      <div className="w-full bg-neutral-primary p-8 space-y-6">
        <h2 className="text-2xl font-bold text-brown-secondary text-center">
          🎨 Advanced Skin Tone Palette Detector
        </h2>

        {/* Upload / Capture */}
        {!image && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-brown-secondary">
                Upload Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full mt-2 border-2 border-yellow-tertiary rounded-lg p-2 text-brown-secondary bg-yellow-primary/40 focus:ring-2 focus:ring-yellow-tertiary"
              />
            </label>

            <div className="block">
              <span className="text-sm font-medium text-brown-secondary">
                Capture from Camera
              </span>
              <div className="relative mt-2">
                <button
                  onClick={() => setIsCapturing(!isCapturing)}
                  className="px-5 py-2 text-white bg-yellow-tertiary hover:bg-yellow-premium rounded-lg shadow transition"
                >
                  {isCapturing ? "Stop Camera" : "Start Camera"}
                </button>
                {isCapturing && (
                  <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover"
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      className="hidden"
                      width="640"
                      height="480"
                    />
                    {/* Controls */}
                    <div className="absolute bottom-8 flex gap-4">
                      <button
                        onClick={handleCapture}
                        className="px-6 py-3 text-white bg-brown-primary hover:bg-brown-secondary rounded-full shadow-lg"
                      >
                        📸 Capture
                      </button>
                      <button
                        onClick={() => setIsCapturing(false)}
                        className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg"
                      >
                        ✖ Stop Camera
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {image && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              {/* Profile Image */}
              <img
                src={image}
                ref={imgRef}
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
                alt="uploaded"
                className="w-48 h-48 object-cover rounded-full border-4 border-yellow-tertiary 
                 shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-in-out"
              />

              {/* Glow Ring */}
              <div
                className="absolute inset-0 rounded-full border-4 border-yellow-tertiary 
                    animate-pulse opacity-40 group-hover:opacity-70 transition-opacity"
              ></div>

              {/* Remove Button */}
              <button
                onClick={removeImage}
                className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-700 
                 hover:from-red-600 hover:to-red-800 text-white w-9 h-9 rounded-full 
                 flex items-center justify-center shadow-lg transform hover:scale-110 
                 transition-all duration-300"
                title="Remove Image"
              >
                ✖
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {palette.length > 0 && (
          <div className="mt-8 space-y-6 text-center">
            <h3 className="text-2xl font-bold text-brown-secondary tracking-wide relative inline-block">
              ✨ Your Skin Type:{" "}
              <span
                className="text-yellow-tertiary font-extrabold px-3 py-1 rounded-lg bg-yellow-100 shadow-inner 
                     hover:bg-yellow-200 transition-all duration-300 ease-in-out"
              >
                Type {skinType}
              </span>
              {/* underline effect */}
              <span
                className="absolute left-0 -bottom-1 w-full h-1 bg-yellow-tertiary rounded-full 
                     scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              ></span>
            </h3>

            {/* Primary Detected Tone */}
            {dominantColor && (
              <div className="bg-neutral-primary/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border-3 border-brown-secondary/50 flex flex-col items-center space-y-4">
                <p className="text-xl font-semibold text-brown-primary mb-2 tracking-wide">
                  🎯 Primary Detected Tone
                </p>

                <div
                  className="relative w-28 h-28 rounded-full shadow-lg border-2 border-brown-secondary 
                 transition-transform transform hover:scale-110 hover:rotate-6 overflow-hidden"
                  style={{
                    backgroundColor: `rgb(${dominantColor[0]},${dominantColor[1]},${dominantColor[2]})`,
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 hover:opacity-100 transition duration-500" />
                </div>

                {/* RGB label */}
                <p className="text-sm text-brown-tertiary opacity-70 hover:opacity-100 transition">
                  rgb({dominantColor[0]}, {dominantColor[1]}, {dominantColor[2]}
                  )
                </p>

                {/* Copy button */}
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
                    )
                  }
                  className="px-3 py-1 text-xs rounded-lg bg-brown-secondary text-neutral-primary opacity-70 
                 hover:opacity-100 transition duration-300 hover:bg-brown-primary"
                >
                  Copy
                </button>
              </div>
            )}

            {/* Recommended Palette */}
            <div className="bg-neutral-primary/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border-3 border-brown-secondary/50 mt-6">
              <p className="text-xl font-semibold text-brown-primary mb-6 text-center tracking-wide">
                🎨 Recommended Palette
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 justify-center">
                {palette.map((color, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center group space-y-2"
                  >
                    <div
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-md border border-brown-secondary 
                     transition-all transform hover:scale-110 hover:rotate-3 hover:shadow-2xl overflow-hidden"
                      style={{ backgroundColor: color }}
                    >
                      {/* Shine effect */}
                      <div
                        className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 
                         group-hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>

                    {/* Hex / RGB label */}
                    <p className="text-sm text-brown-tertiary opacity-70 group-hover:opacity-100 transition">
                      {color}
                    </p>

                    {/* Copy button */}
                    <button
                      onClick={() => navigator.clipboard.writeText(color)}
                      className="text-xs px-2 py-1 rounded-lg bg-brown-secondary text-neutral-primary opacity-0
                     group-hover:opacity-100 transition duration-300 hover:bg-brown-primary"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PalletePage;
