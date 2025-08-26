import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  Hand,
  Mic,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Volume2,
  Shield,
  CreditCard,
  MapPin,
  Clock,
  VolumeX,
  Zap,
  Sparkles,
  Wifi,
  Target,
  Globe,
  Eye,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

type PaymentStep =
  | "scan"
  | "voice"
  | "confirm"
  | "gesture"
  | "processing"
  | "success"
  | "sos";

interface PaymentData {
  amount: string;
  merchant: string;
  userName: string;
}

// Floating particles component
const FloatingParticles = ({ count = 15 }: { count?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gradient-to-r from-cyber-cyan to-blue-400 rounded-full opacity-40"
        animate={{
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
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

export default function Payment() {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("scan");
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: "",
    merchant: "Coffee Corner Cafe",
    userName: "Rakesh",
  });
  const [transcript, setTranscript] = useState("");
  const [gestureMode, setGestureMode] = useState<"normal" | "sos">("normal");
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);

        // Parse payment amount from voice
        const amountMatch = result.match(/(\d+)\s*(rupees?|dollars?|rs\.?)/i);
        if (amountMatch) {
          setPaymentData((prev) => ({ ...prev, amount: amountMatch[1] }));
          setTimeout(() => {
            setIsListening(false);
            setCurrentStep("confirm");
          }, 1000);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

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

  // Palm scan simulation
  const startPalmScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setTimeout(() => setCurrentStep("voice"), 800);
          return 100;
        }
        return prev + 3;
      });
    }, 60);
  };

  // Voice recognition
  const startVoiceRecognition = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript("");
      recognition.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Gesture confirmation
  const confirmWithGesture = (type: "normal" | "sos" = "normal") => {
    setGestureMode(type);
    setCurrentStep("gesture");

    // Simulate gesture recognition
    setTimeout(() => {
      if (type === "sos") {
        setCurrentStep("sos");
        // In real implementation, this would send SOS alert
        setTimeout(() => {
          // Show normal payment success to maintain disguise
          setCurrentStep("success");
        }, 3000);
      } else {
        setCurrentStep("processing");
        setTimeout(() => setCurrentStep("success"), 2500);
      }
    }, 2500);
  };

  // Text-to-speech for confirmations
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (currentStep === "scan") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [currentStep]);

  // Auto-speak confirmations
  useEffect(() => {
    if (currentStep === "voice") {
      speak(
        `Welcome, ${paymentData.userName}! How much would you like to pay to ${paymentData.merchant}?`,
      );
    } else if (currentStep === "confirm" && paymentData.amount) {
      speak(
        `${paymentData.userName}, paying ${paymentData.amount} rupees to ${paymentData.merchant}. Please confirm with your gesture.`,
      );
    } else if (currentStep === "success") {
      speak("Payment successful!");
    }
  }, [currentStep, paymentData]);

  const renderStep = () => {
    switch (currentStep) {
      case "scan":
        return (
          <PalmScanStep
            isScanning={isScanning}
            scanProgress={scanProgress}
            onScan={startPalmScan}
            videoRef={videoRef}
            userName={paymentData.userName}
          />
        );

      case "voice":
        return (
          <VoiceStep
            isListening={isListening}
            transcript={transcript}
            onStartListening={startVoiceRecognition}
            onStopListening={stopVoiceRecognition}
            paymentData={paymentData}
          />
        );

      case "confirm":
        return (
          <ConfirmStep
            paymentData={paymentData}
            onConfirm={() => confirmWithGesture("normal")}
            onSOS={() => confirmWithGesture("sos")}
          />
        );

      case "gesture":
        return <GestureStep gestureMode={gestureMode} />;

      case "processing":
        return <ProcessingStep />;

      case "success":
        return (
          <SuccessStep paymentData={paymentData} gestureMode={gestureMode} />
        );

      case "sos":
        return <SOSStep />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating particles */}
      <FloatingParticles count={20} />

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
            <div className="text-xs text-muted-foreground">
              Secure Payment Terminal
            </div>
          </div>
        </Link>

        <div className="flex items-center space-x-6">
          <div className="text-sm text-muted-foreground">
            Payment Session Active
          </div>
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="max-w-3xl w-full">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Enhanced Step Components
const PalmScanStep = ({
  isScanning,
  scanProgress,
  onScan,
  videoRef,
  userName,
}: {
  isScanning: boolean;
  scanProgress: number;
  onScan: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  userName: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h1 className="text-5xl font-bold mb-4">
        <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Palm Authentication
        </span>
      </h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
        Place your registered palm in front of the scanner to begin secure
        payment processing
      </p>
    </motion.div>

    <motion.div
      className="relative max-w-lg mx-auto mb-12"
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
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-lg shadow-cyber-cyan/50"
            />

            <motion.div
              initial={{ y: -40 }}
              animate={{ y: 320 }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
                delay: 0.5,
              }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
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
            className="w-40 h-48 border-2 border-cyber-cyan/60 border-dashed rounded-2xl flex items-center justify-center backdrop-blur-sm bg-cyber-cyan/5"
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
              <Hand className="w-20 h-20 text-cyber-cyan/80 drop-shadow-lg" />
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
            className={`absolute ${bracket.position} w-8 h-8 border-l-2 border-t-2 border-cyber-cyan`}
            style={{ rotate: bracket.rotation }}
            animate={
              isScanning
                ? {
                    scale: [1, 1.2, 1],
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
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-full bg-dark-slate-700/50 rounded-full h-3 backdrop-blur-sm border border-border/30">
            <motion.div
              className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 h-3 rounded-full shadow-lg shadow-cyber-cyan/30"
              style={{ width: `${scanProgress}%` }}
              animate={{
                boxShadow: [
                  "0 0 10px rgba(0, 255, 255, 0.3)",
                  "0 0 20px rgba(0, 255, 255, 0.6)",
                  "0 0 10px rgba(0, 255, 255, 0.3)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <p className="text-cyber-cyan mt-4 font-medium text-lg">
            Analyzing biometric patterns... {scanProgress}%
          </p>
        </motion.div>
      )}
    </motion.div>

    {!isScanning && (
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onScan}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 mx-auto hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 text-lg"
      >
        <Hand className="w-6 h-6" />
        <span>Begin Palm Scan</span>
        <Sparkles className="w-6 h-6" />
      </motion.button>
    )}
  </motion.div>
);

const VoiceStep = ({
  isListening,
  transcript,
  onStartListening,
  onStopListening,
  paymentData,
}: {
  isListening: boolean;
  transcript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  paymentData: PaymentData;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <motion.div
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500/30 to-cyan-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-400/30"
        animate={{
          boxShadow: [
            "0 0 20px rgba(34, 197, 94, 0.3)",
            "0 0 40px rgba(34, 197, 94, 0.6)",
            "0 0 20px rgba(34, 197, 94, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <CheckCircle className="w-10 h-10 text-green-400" />
      </motion.div>

      <h2 className="text-4xl font-bold mb-4">
        <span className="text-green-400">Welcome, {paymentData.userName}!</span>
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Authentication successful! How much would you like to pay to{" "}
        <span className="text-cyber-cyan font-medium">
          {paymentData.merchant}
        </span>
        ?
      </p>
    </motion.div>

    <motion.div
      className="relative max-w-lg mx-auto mb-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 flex items-center justify-center relative backdrop-blur-sm border border-cyber-cyan/30">
        <motion.div
          animate={isListening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
          className="w-40 h-40 rounded-full bg-gradient-to-br from-cyber-cyan/40 to-blue-500/40 flex items-center justify-center backdrop-blur-sm"
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Mic className="w-20 h-20 text-cyber-cyan drop-shadow-lg" />
            </motion.div>
          ) : (
            <Volume2 className="w-20 h-20 text-cyber-cyan drop-shadow-lg" />
          )}
        </motion.div>

        {isListening && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-cyber-cyan/30"
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
          </>
        )}
      </div>

      {/* Enhanced Transcript Display */}
      <motion.div
        className="mt-8 p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/40 min-h-[80px] flex items-center justify-center"
        animate={
          transcript
            ? {
                borderColor: "rgba(0, 255, 255, 0.6)",
                boxShadow: "0 0 30px rgba(0, 255, 255, 0.2)",
              }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        {transcript ? (
          <motion.p
            className="text-cyber-cyan font-medium text-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            "{transcript}"
          </motion.p>
        ) : isListening ? (
          <motion.p
            className="text-muted-foreground text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Listening for payment amount...
          </motion.p>
        ) : (
          <p className="text-muted-foreground text-lg">
            Say: "Pay [amount] rupees" or tap to start
          </p>
        )}
      </motion.div>
    </motion.div>

    <div className="flex gap-6 justify-center">
      {!isListening ? (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartListening}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 text-lg"
        >
          <Mic className="w-6 h-6" />
          <span>Start Voice Input</span>
          <Zap className="w-6 h-6" />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStopListening}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 text-lg"
        >
          <VolumeX className="w-6 h-6" />
          <span>Stop Listening</span>
        </motion.button>
      )}
    </div>
  </motion.div>
);

const ConfirmStep = ({
  paymentData,
  onConfirm,
  onSOS,
}: {
  paymentData: PaymentData;
  onConfirm: () => void;
  onSOS: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.h2
      className="text-4xl font-bold mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">
        Confirm Payment
      </span>
    </motion.h2>

    {/* Enhanced Payment Details */}
    <motion.div
      className="max-w-lg mx-auto mb-12 p-8 rounded-3xl bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-xl border border-border/40"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-lg">Amount:</span>
          <motion.span
            className="text-4xl font-bold text-cyber-cyan"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ₹{paymentData.amount}
          </motion.span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">To:</span>
          <span className="font-medium text-xl">{paymentData.merchant}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">From:</span>
          <span className="font-medium text-xl">{paymentData.userName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Time:</span>
          <span className="text-sm">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>

    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <p className="text-xl text-muted-foreground mb-6">
        Please confirm with your gesture PIN
      </p>
      <div className="flex items-center justify-center space-x-3 text-cyber-cyan">
        <Shield className="w-5 h-5" />
        <span className="font-medium">
          Secure gesture authentication required
        </span>
        <Star className="w-5 h-5" />
      </div>
    </motion.div>

    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onConfirm}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 text-lg"
      >
        <CheckCircle className="w-6 h-6" />
        <span>Confirm Payment</span>
        <Zap className="w-6 h-6" />
      </motion.button>

      {/* Hidden SOS button (in real app, this would be disguised) */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSOS}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 opacity-40 hover:opacity-100 text-lg"
        title="Emergency SOS (normally hidden)"
      >
        <AlertTriangle className="w-6 h-6" />
        <span>Emergency</span>
      </motion.button>
    </div>
  </motion.div>
);

const GestureStep = ({ gestureMode }: { gestureMode: "normal" | "sos" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.h2
      className="text-4xl font-bold mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {gestureMode === "sos" ? (
        <span className="text-orange-400">Processing Request...</span>
      ) : (
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Perform Your Gesture
        </span>
      )}
    </motion.h2>

    <motion.div
      className="relative max-w-lg mx-auto mb-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div
        className={`w-96 h-72 mx-auto rounded-3xl bg-gradient-to-br ${
          gestureMode === "sos"
            ? "from-orange-500/20 to-red-500/20 border-orange-400/40"
            : "from-purple-500/20 to-blue-500/20 border-purple-400/40"
        } border-2 flex items-center justify-center backdrop-blur-sm relative overflow-hidden`}
      >
        {/* Animated background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${
            gestureMode === "sos"
              ? "from-orange-500/10 to-red-500/10"
              : "from-purple-500/10 to-blue-500/10"
          }`}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Hand
            className={`w-32 h-32 ${
              gestureMode === "sos" ? "text-orange-400" : "text-purple-400"
            } drop-shadow-lg`}
          />
        </motion.div>

        {/* Scanning rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 rounded-3xl border ${
              gestureMode === "sos"
                ? "border-orange-400/30"
                : "border-purple-400/30"
            }`}
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
      </div>

      <motion.p
        className={`font-medium mt-6 text-lg ${
          gestureMode === "sos" ? "text-orange-400" : "text-purple-400"
        }`}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {gestureMode === "sos"
          ? "Processing your request safely..."
          : "Recognizing your gesture PIN..."}
      </motion.p>
    </motion.div>
  </motion.div>
);

const ProcessingStep = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.8 }}
    className="text-center"
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
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <CreditCard className="w-16 h-16 text-cyber-cyan drop-shadow-lg" />
      </motion.div>
    </motion.div>

    <motion.h2
      className="text-4xl font-bold mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">
        Processing Payment
      </span>
    </motion.h2>

    <motion.p
      className="text-xl text-muted-foreground"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      Securely processing your transaction...
    </motion.p>

    {/* Progress indicators */}
    <div className="flex justify-center space-x-2 mt-8">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-cyber-cyan rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  </motion.div>
);

const SuccessStep = ({
  paymentData,
  gestureMode,
}: {
  paymentData: PaymentData;
  gestureMode: "normal" | "sos";
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-500/30 to-cyan-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-400/40"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 20px rgba(34, 197, 94, 0.3)",
            "0 0 40px rgba(34, 197, 94, 0.6)",
            "0 0 20px rgba(34, 197, 94, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <CheckCircle className="w-16 h-16 text-green-400" />
      </motion.div>
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-5xl font-bold mb-6"
    >
      <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
        Payment Successful!
      </span>
    </motion.h1>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="max-w-lg mx-auto mb-12 p-8 rounded-3xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/40 backdrop-blur-xl"
    >
      <motion.div
        className="text-5xl font-bold text-green-400 mb-4"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ₹{paymentData.amount}
      </motion.div>
      <div className="text-xl text-muted-foreground mb-2">
        paid to {paymentData.merchant}
      </div>
      <div className="text-sm text-muted-foreground mb-4">
        Transaction ID: TXN{Date.now().toString().slice(-8)}
      </div>
      <div className="flex items-center justify-center space-x-2 text-green-400">
        <Shield className="w-4 h-4" />
        <span className="text-sm">Secured by PalmPay biometrics</span>
      </div>
    </motion.div>

    {gestureMode === "sos" && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 w-4 h-4 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"
        title="SOS alert sent discretely"
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-orange-500 rounded-full opacity-75"
        />
      </motion.div>
    )}

    <div className="flex gap-6 justify-center">
      <Link to="/payment">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 text-lg"
        >
          <CreditCard className="w-6 h-6" />
          <span>New Payment</span>
        </motion.button>
      </Link>

      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="border-2 border-cyber-cyan/40 text-cyber-cyan px-12 py-5 rounded-2xl font-bold hover:bg-cyber-cyan/10 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm text-lg"
        >
          <span>Dashboard</span>
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
      </Link>
    </div>
  </motion.div>
);

const SOSStep = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <motion.div
      className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-orange-400/40"
      animate={{
        boxShadow: [
          "0 0 30px rgba(249, 115, 22, 0.4)",
          "0 0 60px rgba(249, 115, 22, 0.7)",
          "0 0 30px rgba(249, 115, 22, 0.4)",
        ],
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <AlertTriangle className="w-16 h-16 text-orange-400" />
      </motion.div>
    </motion.div>

    <motion.h2
      className="text-4xl font-bold mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
        Emergency Alert Sent
      </span>
    </motion.h2>

    <motion.div
      className="max-w-lg mx-auto mb-12 p-8 rounded-3xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 backdrop-blur-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
        Your emergency contacts have been notified with your current location
        and situation details.
      </p>
      <div className="flex items-center justify-center space-x-6 text-orange-400">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span className="font-medium">Location shared</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>

    <motion.p
      className="text-lg text-muted-foreground mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      The app will now show a normal payment success screen for your safety.
    </motion.p>

    <motion.div
      animate={{ opacity: [1, 0.6, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-orange-400 font-medium text-lg"
    >
      <div className="flex items-center justify-center space-x-2">
        <Shield className="w-5 h-5" />
        <span>Help is on the way. Stay safe.</span>
      </div>
    </motion.div>
  </motion.div>
);

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
