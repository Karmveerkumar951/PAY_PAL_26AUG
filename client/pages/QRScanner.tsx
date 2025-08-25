import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  QrCode, Hand, ArrowLeft, CheckCircle, AlertCircle, 
  Camera, Flashlight, RotateCcw, CreditCard, Smartphone
} from "lucide-react";
import { Link } from "react-router-dom";

interface QRData {
  type: 'payment' | 'unknown';
  merchant?: string;
  amount?: string;
  upiId?: string;
  raw: string;
}

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [error, setError] = useState<string>('');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  // Start camera
  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        },
        audio: false 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsScanning(true);
      startQRDetection();
    } catch (error) {
      console.error('Camera access denied:', error);
      setError('Camera access required for QR scanning');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsScanning(false);
  };

  // Toggle flashlight (if supported)
  const toggleFlash = async () => {
    if (stream && stream.getVideoTracks().length > 0) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any]
          });
          setFlashEnabled(!flashEnabled);
        } catch (error) {
          console.error('Flash toggle failed:', error);
        }
      }
    }
  };

  // Simulate QR code detection
  const startQRDetection = () => {
    // In a real implementation, this would use a QR code detection library
    // For demo purposes, we'll simulate detection after a delay
    const detectQR = () => {
      if (isScanning && Math.random() > 0.85) { // Random detection simulation
        const mockQRData = generateMockQRData();
        parseQRData(mockQRData);
        return;
      }
      
      if (isScanning) {
        animationFrameRef.current = requestAnimationFrame(detectQR);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(detectQR);
  };

  // Generate mock QR data for demo
  const generateMockQRData = (): string => {
    const mockData = [
      'upi://pay?pa=merchant@upi&pn=Coffee%20Corner&am=150&cu=INR',
      'upi://pay?pa=store@paytm&pn=Tech%20Store&am=999&cu=INR',
      'upi://pay?pa=restaurant@gpay&pn=Spice%20Garden&am=450&cu=INR',
      'https://example.com/invalid-qr'
    ];
    return mockData[Math.floor(Math.random() * mockData.length)];
  };

  // Parse QR code data
  const parseQRData = (rawData: string) => {
    stopCamera();
    
    try {
      if (rawData.startsWith('upi://pay')) {
        const url = new URL(rawData);
        const merchant = url.searchParams.get('pn') || 'Unknown Merchant';
        const amount = url.searchParams.get('am') || '';
        const upiId = url.searchParams.get('pa') || '';
        
        setQrData({
          type: 'payment',
          merchant: decodeURIComponent(merchant),
          amount,
          upiId,
          raw: rawData
        });
        setScanResult('success');
      } else {
        setQrData({
          type: 'unknown',
          raw: rawData
        });
        setScanResult('error');
        setError('Invalid payment QR code');
      }
    } catch (error) {
      setScanResult('error');
      setError('Failed to parse QR code');
    }
  };

  // Reset scanner
  const resetScanner = () => {
    setQrData(null);
    setScanResult(null);
    setError('');
  };

  // Proceed with payment
  const proceedToPayment = () => {
    if (qrData && qrData.type === 'payment') {
      // In real app, this would navigate to payment confirmation
      alert(`Proceeding to pay ${qrData.amount ? `₹${qrData.amount} to ` : ''}${qrData.merchant}`);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Header */}
      <header className="relative z-50 flex justify-between items-center p-6 md:p-8">
        <Link to="/" className="flex items-center space-x-3">
          <Hand className="w-8 h-8 text-cyber-cyan" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyber-cyan to-blue-400 bg-clip-text text-transparent">
            PalmPay Secure
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/payment" className="text-muted-foreground hover:text-cyber-cyan transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="max-w-2xl w-full">
          {!qrData ? (
            <ScannerView 
              isScanning={isScanning}
              error={error}
              flashEnabled={flashEnabled}
              onStartScan={startCamera}
              onStopScan={stopCamera}
              onToggleFlash={toggleFlash}
              onReset={resetScanner}
              videoRef={videoRef}
              canvasRef={canvasRef}
            />
          ) : (
            <ResultView 
              qrData={qrData}
              scanResult={scanResult}
              error={error}
              onReset={resetScanner}
              onProceed={proceedToPayment}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Scanner View Component
const ScannerView = ({
  isScanning,
  error,
  flashEnabled,
  onStartScan,
  onStopScan,
  onToggleFlash,
  onReset,
  videoRef,
  canvasRef
}: {
  isScanning: boolean;
  error: string;
  flashEnabled: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  onToggleFlash: () => void;
  onReset: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <div className="mb-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
        <QrCode className="w-8 h-8 text-purple-400" />
      </div>
      <h1 className="text-4xl font-bold mb-4">
        QR Code Scanner
      </h1>
      <p className="text-lg text-muted-foreground">
        Backup payment method for universal compatibility
      </p>
    </div>

    {/* Camera View */}
    <div className="relative max-w-md mx-auto mb-8">
      <div className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden bg-dark-slate-800 border-2 border-purple-400/30">
        {isScanning ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: 'none' }}
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0">
              {/* Corner brackets */}
              {[
                "top-4 left-4",
                "top-4 right-4 rotate-90",
                "bottom-4 right-4 rotate-180",
                "bottom-4 left-4 -rotate-90"
              ].map((position, index) => (
                <div
                  key={index}
                  className={`absolute ${position} w-8 h-8 border-l-2 border-t-2 border-purple-400`}
                />
              ))}
              
              {/* Scanning line */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: 320 }}
                transition={{ 
                  duration: 2, 
                  ease: "linear", 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              />
              
              {/* Center target */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-purple-400/50 border-dashed rounded-lg flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-purple-400/70" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-cyan-500/10">
            <div className="text-center">
              <QrCode className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <p className="text-purple-400/70">Tap to start scanning</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
        <p className="text-sm text-muted-foreground">
          {isScanning 
            ? "Point camera at a payment QR code" 
            : "Start camera to scan payment QR codes"
          }
        </p>
      </div>
    </div>

    {/* Error Message */}
    {error && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center space-x-2"
      >
        <AlertCircle className="w-5 h-5 text-red-400" />
        <span className="text-red-400">{error}</span>
      </motion.div>
    )}

    {/* Controls */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {!isScanning ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartScan}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <Camera className="w-5 h-5" />
          <span>Start Scanner</span>
        </motion.button>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStopScan}
            className="border border-red-400/30 text-red-400 px-8 py-4 rounded-xl font-semibold hover:bg-red-400/10 transition-all flex items-center justify-center space-x-2"
          >
            <span>Stop Scanner</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFlash}
            className={`border border-cyber-cyan/30 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
              flashEnabled 
                ? 'bg-cyber-cyan/20 text-cyber-cyan' 
                : 'text-cyber-cyan hover:bg-cyber-cyan/10'
            }`}
          >
            <Flashlight className="w-5 h-5" />
          </motion.button>
        </>
      )}
    </div>

    {/* Alternative Options */}
    <div className="mt-8 pt-6 border-t border-border/30">
      <p className="text-sm text-muted-foreground mb-4">
        Prefer biometric payment?
      </p>
      <Link to="/payment">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border border-cyber-cyan/30 text-cyber-cyan px-6 py-3 rounded-lg hover:bg-cyber-cyan/10 transition-all flex items-center justify-center space-x-2 mx-auto"
        >
          <Hand className="w-4 h-4" />
          <span>Use Palm Payment</span>
        </motion.button>
      </Link>
    </div>
  </motion.div>
);

// Result View Component
const ResultView = ({
  qrData,
  scanResult,
  error,
  onReset,
  onProceed
}: {
  qrData: QRData;
  scanResult: 'success' | 'error' | null;
  error: string;
  onReset: () => void;
  onProceed: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center"
  >
    <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
      scanResult === 'success' 
        ? 'bg-gradient-to-br from-green-500/20 to-cyan-500/20' 
        : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
    }`}>
      {scanResult === 'success' ? (
        <CheckCircle className="w-8 h-8 text-green-400" />
      ) : (
        <AlertCircle className="w-8 h-8 text-red-400" />
      )}
    </div>

    <h2 className={`text-3xl font-bold mb-6 ${
      scanResult === 'success' ? 'text-green-400' : 'text-red-400'
    }`}>
      {scanResult === 'success' ? 'QR Code Detected!' : 'Invalid QR Code'}
    </h2>

    {scanResult === 'success' && qrData.type === 'payment' ? (
      <div className="max-w-md mx-auto mb-8">
        {/* Payment Details */}
        <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 mb-6">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-green-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Merchant:</span>
              <span className="font-medium">{qrData.merchant}</span>
            </div>
            
            {qrData.amount && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount:</span>
                <span className="text-2xl font-bold text-green-400">₹{qrData.amount}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">UPI ID:</span>
              <span className="text-sm font-mono">{qrData.upiId}</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">
          Proceed to complete payment using your biometric authentication
        </p>
      </div>
    ) : (
      <div className="max-w-md mx-auto mb-8 p-6 rounded-xl bg-red-500/10 border border-red-500/30">
        <p className="text-red-400 mb-4">{error}</p>
        <div className="text-xs text-muted-foreground font-mono break-all">
          Raw data: {qrData.raw}
        </div>
      </div>
    )}

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {scanResult === 'success' && qrData.type === 'payment' ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onProceed}
          className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-green-500/25 transition-all"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Proceed to Payment</span>
        </motion.button>
      ) : null}
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="border border-cyber-cyan/30 text-cyber-cyan px-8 py-4 rounded-xl font-semibold hover:bg-cyber-cyan/10 transition-all flex items-center justify-center space-x-2"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Scan Again</span>
      </motion.button>
    </div>

    {/* Manual Entry Option */}
    <div className="mt-8 pt-6 border-t border-border/30">
      <p className="text-sm text-muted-foreground mb-4">
        Having trouble scanning?
      </p>
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm border border-border/30 text-muted-foreground px-4 py-2 rounded-lg hover:bg-card/30 transition-all"
        >
          <Smartphone className="w-4 h-4 inline mr-2" />
          Manual Entry
        </motion.button>
        
        <Link to="/payment">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm border border-cyber-cyan/30 text-cyber-cyan px-4 py-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
          >
            <Hand className="w-4 h-4 inline mr-2" />
            Use Palm Pay
          </motion.button>
        </Link>
      </div>
    </div>
  </motion.div>
);
