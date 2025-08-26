import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  Hand,
  Eye,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Camera,
  Mic,
  Shield,
  AlertCircle,
  RefreshCw,
  MicIcon,
  Sparkles,
  Zap,
  Star,
  Globe,
  Target,
  Fingerprint,
  Lock,
  Brain,
} from "lucide-react";
import { Link } from "react-router-dom";

type SetupStep = "intro" | "palm" | "face" | "voice" | "gesture" | "complete";

// Floating particles component
const FloatingParticles = ({ count = 20 }: { count?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gradient-to-r from-cyber-cyan to-blue-400 rounded-full opacity-40"
        animate={{
          x: [0, Math.random() * 150 - 75],
          y: [0, Math.random() * 150 - 75],
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 4 + 3,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}
  </div>
);

// Progress indicator component
const ProgressIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <motion.div
    className="flex items-center justify-center space-x-3 mb-12"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {[...Array(totalSteps)].map((_, i) => (
      <motion.div
        key={i}
        className={`w-3 h-3 rounded-full ${
          i < currentStep
            ? "bg-green-400 shadow-lg shadow-green-400/50"
            : i === currentStep
              ? "bg-cyber-cyan shadow-lg shadow-cyber-cyan/50"
              : "bg-dark-slate-700"
        }`}
        animate={
          i === currentStep
            ? {
                scale: [1, 1.3, 1],
                boxShadow: [
                  "0 0 10px rgba(0, 255, 255, 0.5)",
                  "0 0 20px rgba(0, 255, 255, 0.8)",
                  "0 0 10px rgba(0, 255, 255, 0.5)",
                ],
              }
            : {}
        }
        transition={{ duration: 1.5, repeat: i === currentStep ? Infinity : 0 }}
      />
    ))}
    <span className="text-sm text-muted-foreground ml-4">
      Step {currentStep + 1} of {totalSteps}
    </span>
  </motion.div>
);

export default function BiometricSetup() {
  const [currentStep, setCurrentStep] = useState<SetupStep>("intro");
  const [palmScanned, setPalmScanned] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [gestureSet, setGestureSet] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stepMap = {
    intro: 0,
    palm: 1,
    face: 2,
    voice: 3,
    gesture: 4,
    complete: 5,
  };
  const currentStepIndex = stepMap[currentStep];

  // Camera setup
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Simulate biometric scanning with enhanced progress
  const simulatePalmScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setPalmScanned(true);
          setTimeout(() => setCurrentStep("face"), 1200);
          return 100;
        }
        return prev + 2.5;
      });
    }, 80);
  };

  const simulateFaceScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setFaceScanned(true);
          setTimeout(() => setCurrentStep("voice"), 1200);
          return 100;
        }
        return prev + 3.5;
      });
    }, 70);
  };

  // Voice recognition simulation
  const startVoiceRecording = () => {
    setIsListening(true);
    // Simulate voice recording with progress
    setTimeout(() => {
      setIsListening(false);
      setVoiceRecorded(true);
      setTimeout(() => setCurrentStep("gesture"), 1200);
    }, 4000);
  };

  // Gesture recording simulation
  const recordGesture = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setGestureSet(true);
      setTimeout(() => setCurrentStep("complete"), 1200);
    }, 3000);
  };

  useEffect(() => {
    if (currentStep === "palm" || currentStep === "face") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case "intro":
        return <IntroStep onNext={() => setCurrentStep("palm")} />;

      case "palm":
        return (
          <PalmScanStep
            isScanning={isScanning}
            scanProgress={scanProgress}
            palmScanned={palmScanned}
            onScan={simulatePalmScan}
            videoRef={videoRef}
          />
        );

      case "face":
        return (
          <FaceScanStep
            isScanning={isScanning}
            scanProgress={scanProgress}
            faceScanned={faceScanned}
            onScan={simulateFaceScan}
            videoRef={videoRef}
          />
        );

      case "voice":
        return (
          <VoiceStep
            isListening={isListening}
            voiceRecorded={voiceRecorded}
            onRecord={startVoiceRecording}
          />
        );

      case "gesture":
        return (
          <GestureStep
            isScanning={isScanning}
            gestureSet={gestureSet}
            onRecord={recordGesture}
          />
        );

      case "complete":
        return <CompleteStep />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating particles */}
      <FloatingParticles count={25} />

      {/* Enhanced Header */}
      <motion.header
        className="relative z-50 flex justify-between items-center p-6 md:p-8 backdrop-blur-md bg-card/10 border-b border-border/20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="flex items-center space-x-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Hand className="w-10 h-10 text-cyber-cyan drop-shadow-lg" />
            <motion.div
              className="absolute inset-0 w-10 h-10 text-cyber-cyan rounded-full"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 255, 255, 0.3)",
                  "0 0 40px rgba(0, 255, 255, 0.6)",
                  "0 0 20px rgba(0, 255, 255, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-cyan bg-clip-text text-transparent">
              PalmPay Secure
            </span>
            <div className="text-xs text-muted-foreground">Biometric Setup</div>
          </div>
        </Link>

        <div className="flex items-center space-x-6">
          <div className="text-sm text-muted-foreground">
            Setting up your biometric profile...
          </div>
          <motion.div
            className="w-3 h-3 bg-cyber-cyan rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.header>

      {/* Progress indicator */}
      {currentStep !== "intro" && currentStep !== "complete" && (
        <div className="relative z-40 pt-8">
          <ProgressIndicator
            currentStep={currentStepIndex - 1}
            totalSteps={4}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Enhanced Step Components
const IntroStep = ({ onNext }: { onNext: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-12"
    >
      <motion.div
        className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-cyber-cyan/30 to-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyber-cyan/40"
        animate={{
          boxShadow: [
            "0 0 30px rgba(0, 255, 255, 0.3)",
            "0 0 60px rgba(0, 255, 255, 0.6)",
            "0 0 30px rgba(0, 255, 255, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="w-16 h-16 text-cyber-cyan" />
        </motion.div>
      </motion.div>

      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        Welcome to the Future of
        <span className="block bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Secure Authentication
        </span>
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
        Let's set up your unique biometric profile. This process takes less than
        2 minutes and creates an{" "}
        <span className="text-cyber-cyan font-medium">
          ultra-secure identity
        </span>{" "}
        that only you can access.
      </p>
    </motion.div>

    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {[
        {
          icon: Hand,
          label: "Palm Scan",
          desc: "Unique palm patterns",
          color: "from-green-500/20 to-emerald-500/20 border-green-400/30",
        },
        {
          icon: Eye,
          label: "Face Recognition",
          desc: "Facial authentication",
          color: "from-blue-500/20 to-cyan-500/20 border-blue-400/30",
        },
        {
          icon: Mic,
          label: "Voice Print",
          desc: "Voice verification",
          color: "from-purple-500/20 to-violet-500/20 border-purple-400/30",
        },
        {
          icon: RefreshCw,
          label: "Gesture PIN",
          desc: "Secret hand gesture",
          color: "from-orange-500/20 to-red-500/20 border-orange-400/30",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} backdrop-blur-sm border text-center relative overflow-hidden group`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            style={{ transform: "skewX(-20deg)" }}
          />

          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
          >
            <item.icon className="w-10 h-10 text-cyber-cyan mx-auto mb-3" />
          </motion.div>
          <div className="font-bold text-lg mb-2">{item.label}</div>
          <div className="text-sm text-muted-foreground">{item.desc}</div>
        </motion.div>
      ))}
    </motion.div>

    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onNext}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 mx-auto hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 text-lg"
    >
      <span>Begin Setup</span>
      <ArrowRight className="w-6 h-6" />
      <Sparkles className="w-6 h-6" />
    </motion.button>
  </motion.div>
);

const PalmScanStep = ({
  isScanning,
  scanProgress,
  palmScanned,
  onScan,
  videoRef,
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
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.h2
      className="text-4xl md:text-5xl font-bold mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-cyber-cyan">Step 1:</span>{" "}
      <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Palm Recognition
      </span>
    </motion.h2>

    <motion.p
      className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      Place your palm in front of the camera. We'll analyze your unique palm
      patterns and create a secure biometric template.
    </motion.p>

    <motion.div
      className="relative max-w-2xl mx-auto mb-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Enhanced Camera Feed */}
      <div className="relative w-96 h-72 mx-auto rounded-3xl overflow-hidden bg-dark-slate-800/50 border-2 border-cyber-cyan/40 backdrop-blur-sm">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />

        {/* Advanced Scanning Overlay */}
        {isScanning && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Multiple scan lines */}
            <motion.div
              initial={{ y: -40 }}
              animate={{ y: 320 }}
              transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-lg shadow-cyber-cyan/50"
            />

            <motion.div
              initial={{ y: -40 }}
              animate={{ y: 320 }}
              transition={{
                duration: 2.5,
                ease: "linear",
                repeat: Infinity,
                delay: 0.8,
              }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
            />

            {/* Pulse rings during scan */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-3xl border border-cyber-cyan/30"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              />
            ))}
          </>
        )}

        {/* Enhanced Palm Guide Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-44 h-52 border-2 border-cyber-cyan/60 border-dashed rounded-3xl flex items-center justify-center backdrop-blur-sm bg-cyber-cyan/5"
            animate={isScanning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0 }}
          >
            <motion.div
              animate={
                isScanning
                  ? {
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }
                  : { scale: 1, opacity: 0.7 }
              }
              transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0 }}
            >
              <Hand className="w-24 h-24 text-cyber-cyan/80 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        </div>

        {/* Corner brackets */}
        {[
          { position: "top-4 left-4", rotation: 0 },
          { position: "top-4 right-4", rotation: 90 },
          { position: "bottom-4 right-4", rotation: 180 },
          { position: "bottom-4 left-4", rotation: 270 },
        ].map((bracket, index) => (
          <motion.div
            key={index}
            className={`absolute ${bracket.position} w-10 h-10 border-l-3 border-t-3 border-cyber-cyan`}
            style={{ rotate: bracket.rotation }}
            animate={
              isScanning
                ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }
                : { scale: 1, opacity: 0.7 }
            }
            transition={{
              duration: 2,
              repeat: isScanning ? Infinity : 0,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Progress */}
      {isScanning && (
        <motion.div
          className="mt-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-full bg-dark-slate-700/50 rounded-full h-4 backdrop-blur-sm border border-border/30">
            <motion.div
              className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-green-400 h-4 rounded-full shadow-lg shadow-cyber-cyan/30 relative overflow-hidden"
              style={{ width: `${scanProgress}%` }}
            >
              {/* Shimmer effect on progress bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-cyber-cyan font-medium text-lg">
              Analyzing palm patterns...
            </p>
            <span className="text-cyber-cyan font-bold text-xl">
              {scanProgress}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Success */}
      {palmScanned && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex items-center justify-center space-x-3 text-green-400 bg-green-400/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <CheckCircle className="w-8 h-8" />
          </motion.div>
          <span className="font-bold text-xl">Palm scan complete!</span>
        </motion.div>
      )}
    </motion.div>

    {!palmScanned && !isScanning && (
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onScan}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 mx-auto hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 text-lg"
      >
        <Camera className="w-6 h-6" />
        <span>Start Palm Scan</span>
        <Zap className="w-6 h-6" />
      </motion.button>
    )}
  </motion.div>
);

const FaceScanStep = ({
  isScanning,
  scanProgress,
  faceScanned,
  onScan,
  videoRef,
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
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.h2
      className="text-4xl md:text-5xl font-bold mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-cyber-cyan">Step 2:</span>{" "}
      <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
        Face Recognition
      </span>
    </motion.h2>

    <motion.p
      className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      Look directly at the camera for facial authentication setup. Our AI will
      map your unique facial features.
    </motion.p>

    <motion.div
      className="relative max-w-2xl mx-auto mb-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="relative w-96 h-72 mx-auto rounded-3xl overflow-hidden bg-dark-slate-800/50 border-2 border-blue-400/40 backdrop-blur-sm">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />

        {/* Face Detection Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-48 h-56 border-2 border-blue-400/60 rounded-full flex items-center justify-center backdrop-blur-sm bg-blue-400/5"
            animate={isScanning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0 }}
          >
            <motion.div
              animate={
                isScanning
                  ? {
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }
                  : { scale: 1, opacity: 0.7 }
              }
              transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0 }}
            >
              <Eye className="w-16 h-16 text-blue-400/80 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        </div>

        {/* Face scanning grid */}
        {isScanning && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Scanning rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              className="absolute inset-0 border-4 border-transparent border-t-blue-400 rounded-full"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              className="absolute inset-8 border-2 border-transparent border-t-cyan-400 rounded-full"
            />

            {/* Detection points */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  left: `${20 + (i % 4) * 20}%`,
                  top: `${30 + Math.floor(i / 4) * 30}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Enhanced Progress */}
      {isScanning && (
        <motion.div
          className="mt-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-full bg-dark-slate-700/50 rounded-full h-4 backdrop-blur-sm border border-border/30">
            <motion.div
              className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 h-4 rounded-full shadow-lg shadow-blue-400/30 relative overflow-hidden"
              style={{ width: `${scanProgress}%` }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-blue-400 font-medium text-lg">
              Analyzing facial features...
            </p>
            <span className="text-blue-400 font-bold text-xl">
              {scanProgress}%
            </span>
          </div>
        </motion.div>
      )}

      {faceScanned && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex items-center justify-center space-x-3 text-green-400 bg-green-400/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <CheckCircle className="w-8 h-8" />
          </motion.div>
          <span className="font-bold text-xl">Face scan complete!</span>
        </motion.div>
      )}
    </motion.div>

    {!faceScanned && !isScanning && (
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onScan}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-400 to-cyan-500 text-dark-slate-950 px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 mx-auto hover:shadow-2xl hover:shadow-blue-400/30 transition-all duration-300 text-lg"
      >
        <Eye className="w-6 h-6" />
        <span>Start Face Scan</span>
        <Target className="w-6 h-6" />
      </motion.button>
    )}
  </motion.div>
);

const VoiceStep = ({
  isListening,
  voiceRecorded,
  onRecord,
}: {
  isListening: boolean;
  voiceRecorded: boolean;
  onRecord: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.h2
      className="text-4xl md:text-5xl font-bold mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-cyber-cyan">Step 3:</span>{" "}
      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
        Voice Authentication
      </span>
    </motion.h2>

    <motion.p
      className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      Say{" "}
      <span className="text-purple-400 font-medium">
        "PalmPay Secure is my voice"
      </span>{" "}
      to create your unique voice print for authentication.
    </motion.p>

    <motion.div
      className="relative max-w-lg mx-auto mb-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative backdrop-blur-sm border border-purple-400/30">
        <motion.div
          animate={isListening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
          className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            animate={
              isListening
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
          >
            <MicIcon className="w-20 h-20 text-purple-400 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {isListening && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-purple-400/30"
                animate={{
                  scale: [1, 2.5, 4],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}

            {/* Sound waves */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-purple-400/20 rounded-full"
                style={{
                  width: `${20 + i * 10}px`,
                  height: `${4 + i * 2}px`,
                  left: `${50 - (10 + i * 5)}%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                animate={
                  isListening
                    ? {
                        scaleY: [1, 2, 1],
                        opacity: [0.3, 1, 0.3],
                      }
                    : { scaleY: 1, opacity: 0.3 }
                }
                transition={{
                  duration: 0.5,
                  repeat: isListening ? Infinity : 0,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}
      </div>

      {isListening && (
        <motion.p
          className="text-purple-400 font-medium mt-6 text-lg"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Listening... Speak now!
        </motion.p>
      )}

      {voiceRecorded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex items-center justify-center space-x-3 text-green-400 bg-green-400/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <CheckCircle className="w-8 h-8" />
          </motion.div>
          <span className="font-bold text-xl">Voice print recorded!</span>
        </motion.div>
      )}
    </motion.div>

    {!voiceRecorded && !isListening && (
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRecord}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 mx-auto hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 text-lg"
      >
        <Mic className="w-6 h-6" />
        <span>Record Voice</span>
        <Sparkles className="w-6 h-6" />
      </motion.button>
    )}
  </motion.div>
);

const GestureStep = ({
  isScanning,
  gestureSet,
  onRecord,
}: {
  isScanning: boolean;
  gestureSet: boolean;
  onRecord: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.h2
      className="text-4xl md:text-5xl font-bold mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-cyber-cyan">Step 4:</span>{" "}
      <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
        Gesture PIN
      </span>
    </motion.h2>

    <motion.p
      className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      Create a unique hand gesture that will serve as your payment confirmation
      PIN. This adds an extra layer of security.
    </motion.p>

    <motion.div
      className="relative max-w-2xl mx-auto mb-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="w-96 h-72 mx-auto rounded-3xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400/40 flex items-center justify-center backdrop-blur-sm relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <motion.div
          animate={
            isScanning
              ? {
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1],
                }
              : { rotate: 0, scale: 1 }
          }
          transition={{
            duration: 1,
            repeat: isScanning ? Infinity : 0,
            repeatType: "reverse",
          }}
        >
          <Hand className="w-32 h-32 text-orange-400 drop-shadow-lg" />
        </motion.div>

        {/* Gesture tracking points */}
        {isScanning && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-orange-400 rounded-full"
                style={{
                  left: `${30 + i * 10}%`,
                  top: `${40 + (i % 2) * 20}%`,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}

            {/* Scanning rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-3xl border border-orange-400/30"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              />
            ))}
          </>
        )}
      </div>

      {isScanning && (
        <motion.p
          className="text-orange-400 font-medium mt-6 text-lg"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Recording your gesture... Hold the position!
        </motion.p>
      )}

      {gestureSet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex items-center justify-center space-x-3 text-green-400 bg-green-400/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <CheckCircle className="w-8 h-8" />
          </motion.div>
          <span className="font-bold text-xl">Gesture PIN set!</span>
        </motion.div>
      )}
    </motion.div>

    {!gestureSet && !isScanning && (
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRecord}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 mx-auto hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 text-lg"
      >
        <Hand className="w-6 h-6" />
        <span>Record Gesture</span>
        <Fingerprint className="w-6 h-6" />
      </motion.button>
    )}
  </motion.div>
);

const CompleteStep = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.div
      className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-500/30 to-cyan-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-400/40"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 30px rgba(34, 197, 94, 0.3)",
            "0 0 60px rgba(34, 197, 94, 0.6)",
            "0 0 30px rgba(34, 197, 94, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <CheckCircle className="w-16 h-16 text-green-400" />
      </motion.div>
    </motion.div>

    <motion.h1
      className="text-5xl md:text-6xl font-bold mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
        Welcome to PalmPay Secure!
      </span>
    </motion.h1>

    <motion.p
      className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      Your biometric profile is now complete. You can now make secure payments
      with just your palm!
      <span className="text-green-400 font-medium">
        {" "}
        Experience the future of contactless transactions.
      </span>
    </motion.p>

    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {[
        { icon: Hand, label: "Palm Secured", color: "green" },
        { icon: Eye, label: "Face Verified", color: "blue" },
        { icon: Mic, label: "Voice Recorded", color: "purple" },
        { icon: RefreshCw, label: "Gesture Set", color: "orange" },
      ].map((item, index) => (
        <motion.div
          key={index}
          className={`p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/40 backdrop-blur-sm relative overflow-hidden group`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
          >
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
          </motion.div>
          <div className="font-bold text-lg">{item.label}</div>
        </motion.div>
      ))}
    </motion.div>

    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      <Link to="/payment">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 text-lg"
        >
          <span>Start First Payment</span>
          <ArrowRight className="w-6 h-6" />
          <Zap className="w-6 h-6" />
        </motion.button>
      </Link>

      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="border-2 border-cyber-cyan/40 text-cyber-cyan px-12 py-5 rounded-2xl font-bold hover:bg-cyber-cyan/10 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm text-lg"
        >
          <span>Go to Dashboard</span>
          <Star className="w-6 h-6" />
        </motion.button>
      </Link>
    </div>

    {/* Security badges */}
    <motion.div
      className="flex justify-center items-center space-x-8 mt-12 text-muted-foreground"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.7 }}
    >
      {[
        { icon: Lock, text: "Bank-grade encryption" },
        { icon: Shield, text: "Biometric security" },
        { icon: Globe, text: "Privacy protected" },
      ].map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <item.icon className="w-4 h-4 text-green-400" />
          <span className="text-sm">{item.text}</span>
        </div>
      ))}
    </motion.div>
  </motion.div>
);
