import { useState, useRef, useEffect } from "react";
import { X, Camera, RotateCcw, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ARTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ARTryOn({ isOpen, onClose, product }: ARTryOnProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShade, setSelectedShade] = useState(0);
  const [intensity, setIntensity] = useState([70]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Mock shades for the product
  const productShades = [
    { name: "Natural Rose", color: "#E8A598" },
    { name: "Berry Blush", color: "#D67B7B" },
    { name: "Coral Sunset", color: "#FF7F7F" },
    { name: "Deep Berry", color: "#A0546A" },
    { name: "Classic Red", color: "#DC143C" },
  ];

  useEffect(() => {
    if (isOpen && hasPermission === null) {
      requestCameraPermission();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  const requestCameraPermission = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      
      toast({
        title: "Camera access granted",
        description: "You can now try on the product virtually!",
      });
    } catch (error) {
      setHasPermission(false);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use the AR try-on feature.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame
      context.drawImage(video, 0, 0);
      
      // Simulate AR overlay (in a real implementation, this would use face detection)
      const selectedColor = productShades[selectedShade].color;
      context.fillStyle = selectedColor;
      context.globalAlpha = intensity[0] / 100;
      
      // Mock lip area (in real AR, this would be detected via face landmarks)
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.65;
      const lipWidth = 60;
      const lipHeight = 20;
      
      context.beginPath();
      context.ellipse(centerX, centerY, lipWidth, lipHeight, 0, 0, 2 * Math.PI);
      context.fill();
      
      context.globalAlpha = 1;
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      toast({
        title: "Photo captured!",
        description: "Your AR try-on photo has been saved.",
      });
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.download = `ecoglow-ar-tryon-${product.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = capturedImage;
    link.click();
  };

  const shareImage = async () => {
    if (!capturedImage) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'ar-tryon.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `AR Try-On: ${product.name}`,
          text: `Check out how I look with ${product.name} from EcoGlow!`,
          files: [file],
        });
      } else {
        // Fallback: copy image to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast({
          title: "Image copied",
          description: "AR try-on image copied to clipboard!",
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to share the image. Please try downloading instead.",
        variant: "destructive",
      });
    }
  };

  const resetTryOn = () => {
    setCapturedImage(null);
    setSelectedShade(0);
    setIntensity([70]);
  };

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCapturedImage(null);
    setHasPermission(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-serif text-[var(--dark-green)]">
              AR Try-On: {product.name}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera Permission / Loading State */}
          {hasPermission === null || isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-[var(--sage-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">
                {isLoading ? "Accessing camera..." : "Setting up AR..."}
              </h3>
              <p className="text-gray-600">
                Please allow camera access to use the virtual try-on feature
              </p>
            </div>
          ) : hasPermission === false ? (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
              <p className="text-gray-600 mb-6">
                To use the AR try-on feature, we need access to your camera. 
                Your privacy is protected - video is not recorded or stored.
              </p>
              <Button 
                onClick={requestCameraPermission}
                className="bg-[var(--forest-green)] hover:bg-[var(--dark-green)]"
              >
                <Camera className="h-4 w-4 mr-2" />
                Enable Camera
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Camera/Preview Area */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {capturedImage ? (
                        <img
                          src={capturedImage}
                          alt="AR Try-on capture"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-x-[-1]"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          
                          {/* AR Overlay Instructions */}
                          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
                            Position your face in the center
                          </div>
                          
                          {/* Live AR Preview */}
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `radial-gradient(ellipse 60px 20px at center 65%, ${productShades[selectedShade].color}${Math.floor(intensity[0] * 2.55).toString(16).padStart(2, '0')} 0%, transparent 100%)`
                            }}
                          />
                        </>
                      )}
                    </div>
                    
                    {/* Camera Controls */}
                    <div className="flex justify-center gap-2 mt-4">
                      {capturedImage ? (
                        <>
                          <Button onClick={resetTryOn} variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Try Again
                          </Button>
                          <Button onClick={downloadImage} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button onClick={shareImage} className="bg-[var(--forest-green)]">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={capturePhoto}
                          size="lg"
                          className="bg-[var(--berry-red)] hover:bg-red-700"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Capture Photo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls Panel */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Choose Your Shade</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {productShades.map((shade, index) => (
                        <button
                          key={shade.name}
                          onClick={() => setSelectedShade(index)}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            selectedShade === index 
                              ? "border-[var(--forest-green)] bg-[var(--sage-green)]/10" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: shade.color }}
                          />
                          <span className="text-sm font-medium">{shade.name}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Label>Intensity: {intensity[0]}%</Label>
                      <Slider
                        value={intensity}
                        onValueChange={setIntensity}
                        max={100}
                        min={20}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Product Info</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span> {product.name}
                      </div>
                      <div>
                        <span className="text-gray-600">Price:</span> ${product.price}
                      </div>
                      <div>
                        <span className="text-gray-600">Rating:</span> {product.rating}/5
                      </div>
                      {product.isVegan && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-[var(--forest-green)] rounded-full"></span>
                          <span className="text-[var(--forest-green)]">Vegan</span>
                        </div>
                      )}
                      {product.isCrueltyFree && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-[var(--forest-green)] rounded-full"></span>
                          <span className="text-[var(--forest-green)]">Cruelty-Free</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <span>🔒 Your privacy is protected</span>
                  <br />
                  Video is processed locally and not stored
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
