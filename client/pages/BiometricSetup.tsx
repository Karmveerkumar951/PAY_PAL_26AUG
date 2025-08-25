import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  Hand, Eye, CheckCircle, ArrowRight, ArrowLeft, Camera, 
  Mic, Shield, AlertCircle, RefreshCw, MicIcon
} from "lucide-react";
import { Link } from "react-router-dom";

type SetupStep = 'intro' | 'palm' | 'face' | 'voice' | 'gesture' | 'complete';

export default function BiometricSetup() {
  const [currentStep, setCurrentStep] = useState<SetupStep>('intro');
  const [palmScanned, setPalmScanned] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [gestureSet, setGestureSet] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Camera setup
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Simulate biometric scanning
  const simulatePalmScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setPalmScanned(true);
          setTimeout(() => setCurrentStep('face'), 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const simulateFaceScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setFaceScanned(true);
          setTimeout(() => setCurrentStep('voice'), 1000);
          return 100;
        }
        return prev + 3;
      });
    }, 50);
  };

  // Voice recognition simulation
  const startVoiceRecording = () => {
    setIsListening(true);
    // Simulate voice recording
    setTimeout(() => {
      setIsListening(false);
      setVoiceRecorded(true);
      setTimeout(() => setCurrentStep('gesture'), 1000);
    }, 3000);
  };

  // Gesture recording simulation
  const recordGesture = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setGestureSet(true);
      setTimeout(() => setCurrentStep('complete'), 1000);
    }, 2000);
  };

  useEffect(() => {
    if (currentStep === 'palm' || currentStep === 'face') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return <IntroStep onNext={() => setCurrentStep('palm')} />;
      
      case 'palm':
        return (
          <PalmScanStep 
            isScanning={isScanning}
            scanProgress={scanProgress}
            palmScanned={palmScanned}
            onScan={simulatePalmScan}
            videoRef={videoRef}
          />
        );
      
      case 'face':
        return (
          <FaceScanStep 
            isScanning={isScanning}
            scanProgress={scanProgress}
            faceScanned={faceScanned}
            onScan={simulateFaceScan}
            videoRef={videoRef}
          />
        );
      
      case 'voice':
        return (
          <VoiceStep 
            isListening={isListening}
            voiceRecorded={voiceRecorded}
            onRecord={startVoiceRecording}
          />
        );
      
      case 'gesture':
        return (
          <GestureStep 
            isScanning={isScanning}
            gestureSet={gestureSet}
            onRecord={recordGesture}
          />
        );
      
      case 'complete':
        return <CompleteStep />;
      
      default:
        return null;
    }
  };

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
          <div className="text-sm text-muted-foreground">
            Setting up your biometric profile...
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Step Components
const IntroStep = ({ onNext }: { onNext: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="text-center"
  >
    <div className="mb-8">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 rounded-full flex items-center justify-center">
        <Shield className="w-12 h-12 text-cyber-cyan" />
      </div>
      <h1 className="text-4xl font-bold mb-4">
        Welcome to the Future of
        <span className="block bg-gradient-to-r from-cyber-cyan to-blue-400 bg-clip-text text-transparent">
          Secure Authentication
        </span>
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Let's set up your unique biometric profile. This process takes less than 2 minutes 
        and creates an ultra-secure identity that only you can access.
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { icon: Hand, label: "Palm Scan", desc: "Unique palm patterns" },
        { icon: Eye, label: "Face Recognition", desc: "Facial authentication" },
        { icon: Mic, label: "Voice Print", desc: "Voice verification" },
        { icon: RefreshCw, label: "Gesture PIN", desc: "Secret hand gesture" }
      ].map((item, index) => (
        <div key={index} className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30 text-center">
          <item.icon className="w-8 h-8 text-cyber-cyan mx-auto mb-2" />
          <div className="font-medium text-sm">{item.label}</div>
          <div className="text-xs text-muted-foreground">{item.desc}</div>
        </div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onNext}
      className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
    >
      <span>Begin Setup</span>
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  </motion.div>
);

const PalmScanStep = ({ 
  isScanning, 
  scanProgress, 
  palmScanned, 
  onScan, 
  videoRef 
}: {
  isScanning: boolean;
  scanProgress: number;
  palmScanned: boolean;
  onScan: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="text-center"
  >
    <h2 className="text-3xl font-bold mb-4">
      <span className="text-cyber-cyan">Step 1:</span> Palm Recognition
    </h2>
    <p className="text-muted-foreground mb-8">
      Place your palm in front of the camera. We'll analyze your unique palm patterns.
    </p>

    <div className="relative max-w-md mx-auto mb-8">
      {/* Camera Feed */}
      <div className="relative w-80 h-60 mx-auto rounded-xl overflow-hidden bg-dark-slate-800 border-2 border-cyber-cyan/30">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Scanning Overlay */}
        {isScanning && (
          <>
            <div className="absolute inset-0 bg-cyber-cyan/10" />
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 240 }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
            />
          </>
        )}
        
        {/* Palm Guide Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-40 border-2 border-cyber-cyan/50 border-dashed rounded-lg flex items-center justify-center">
            <Hand className="w-16 h-16 text-cyber-cyan/70" />
          </div>
        </div>
      </div>

      {/* Progress */}
      {isScanning && (
        <div className="mt-4">
          <div className="w-full bg-dark-slate-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyber-cyan to-blue-500 h-2 rounded-full"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <p className="text-sm text-cyber-cyan mt-2">Analyzing palm patterns... {scanProgress}%</p>
        </div>
      )}

      {/* Success */}
      {palmScanned && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex items-center justify-center space-x-2 text-green-400"
        >
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Palm scan complete!</span>
        </motion.div>
      )}
    </div>

    {!palmScanned && !isScanning && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onScan}
        className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
      >
        <Camera className="w-5 h-5" />
        <span>Start Palm Scan</span>
      </motion.button>
    )}
  </motion.div>
);

const FaceScanStep = ({ 
  isScanning, 
  scanProgress, 
  faceScanned, 
  onScan, 
  videoRef 
}: {
  isScanning: boolean;
  scanProgress: number;
  faceScanned: boolean;
  onScan: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="text-center"
  >
    <h2 className="text-3xl font-bold mb-4">
      <span className="text-cyber-cyan">Step 2:</span> Face Recognition
    </h2>
    <p className="text-muted-foreground mb-8">
      Look directly at the camera for facial authentication setup.
    </p>

    <div className="relative max-w-md mx-auto mb-8">
      <div className="relative w-80 h-60 mx-auto rounded-xl overflow-hidden bg-dark-slate-800 border-2 border-cyber-cyan/30">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Face Detection Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-48 border-2 border-cyber-cyan/50 rounded-full flex items-center justify-center">
            <Eye className="w-12 h-12 text-cyber-cyan/70" />
          </div>
        </div>

        {/* Scanning Effect */}
        {isScanning && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 border-4 border-transparent border-t-cyber-cyan rounded-full"
          />
        )}
      </div>

      {isScanning && (
        <div className="mt-4">
          <div className="w-full bg-dark-slate-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyber-cyan to-blue-500 h-2 rounded-full"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <p className="text-sm text-cyber-cyan mt-2">Analyzing facial features... {scanProgress}%</p>
        </div>
      )}

      {faceScanned && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex items-center justify-center space-x-2 text-green-400"
        >
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Face scan complete!</span>
        </motion.div>
      )}
    </div>

    {!faceScanned && !isScanning && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onScan}
        className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
      >
        <Eye className="w-5 h-5" />
        <span>Start Face Scan</span>
      </motion.button>
    )}
  </motion.div>
);

const VoiceStep = ({ 
  isListening, 
  voiceRecorded, 
  onRecord 
}: {
  isListening: boolean;
  voiceRecorded: boolean;
  onRecord: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="text-center"
  >
    <h2 className="text-3xl font-bold mb-4">
      <span className="text-cyber-cyan">Step 3:</span> Voice Authentication
    </h2>
    <p className="text-muted-foreground mb-8">
      Say "PalmPay Secure is my voice" to create your unique voice print.
    </p>

    <div className="relative max-w-md mx-auto mb-8">
      <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 flex items-center justify-center relative">
        <motion.div
          animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
          className="w-32 h-32 rounded-full bg-cyber-cyan/30 flex items-center justify-center"
        >
          <MicIcon className="w-16 h-16 text-cyber-cyan" />
        </motion.div>
        
        {isListening && (
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.7, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-cyber-cyan"
          />
        )}
      </div>

      {isListening && (
        <p className="text-cyber-cyan font-medium">Listening... Speak now!</p>
      )}

      {voiceRecorded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center space-x-2 text-green-400"
        >
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Voice print recorded!</span>
        </motion.div>
      )}
    </div>

    {!voiceRecorded && !isListening && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRecord}
        className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
      >
        <Mic className="w-5 h-5" />
        <span>Record Voice</span>
      </motion.button>
    )}
  </motion.div>
);

const GestureStep = ({ 
  isScanning, 
  gestureSet, 
  onRecord 
}: {
  isScanning: boolean;
  gestureSet: boolean;
  onRecord: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="text-center"
  >
    <h2 className="text-3xl font-bold mb-4">
      <span className="text-cyber-cyan">Step 4:</span> Gesture PIN
    </h2>
    <p className="text-muted-foreground mb-8">
      Create a unique hand gesture that will serve as your payment confirmation PIN.
    </p>

    <div className="relative max-w-md mx-auto mb-8">
      <div className="w-80 h-60 mx-auto rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400/30 flex items-center justify-center">
        <motion.div
          animate={isScanning ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5, repeat: isScanning ? Infinity : 0 }}
        >
          <Hand className="w-24 h-24 text-purple-400" />
        </motion.div>
      </div>

      {isScanning && (
        <p className="text-purple-400 font-medium mt-4">Recording your gesture...</p>
      )}

      {gestureSet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex items-center justify-center space-x-2 text-green-400"
        >
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium">Gesture PIN set!</span>
        </motion.div>
      )}
    </div>

    {!gestureSet && !isScanning && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRecord}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto hover:shadow-lg hover:shadow-purple-500/25 transition-all"
      >
        <Hand className="w-5 h-5" />
        <span>Record Gesture</span>
      </motion.button>
    )}
  </motion.div>
);

const CompleteStep = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center"
  >
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
      <CheckCircle className="w-12 h-12 text-green-400" />
    </div>
    
    <h1 className="text-4xl font-bold mb-4">
      Welcome to PalmPay Secure!
    </h1>
    <p className="text-lg text-muted-foreground mb-8">
      Your biometric profile is now complete. You can now make secure payments with just your palm!
    </p>

    <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <div className="text-sm font-medium">Palm Secured</div>
      </div>
      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <div className="text-sm font-medium">Face Verified</div>
      </div>
      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <div className="text-sm font-medium">Voice Recorded</div>
      </div>
      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <div className="text-sm font-medium">Gesture Set</div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/payment">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
        >
          <span>Start First Payment</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </Link>
      
      <Link to="/dashboard">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border border-cyber-cyan/30 text-cyber-cyan px-8 py-4 rounded-xl font-semibold hover:bg-cyber-cyan/10 transition-all flex items-center justify-center space-x-2"
        >
          <span>Go to Dashboard</span>
        </motion.button>
      </Link>
    </div>
  </motion.div>
);
