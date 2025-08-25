import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  Hand, Mic, CheckCircle, ArrowLeft, AlertTriangle, 
  Volume2, Shield, CreditCard, MapPin, Clock, VolumeX
} from "lucide-react";
import { Link } from "react-router-dom";

type PaymentStep = 'scan' | 'voice' | 'confirm' | 'gesture' | 'processing' | 'success' | 'sos';

interface PaymentData {
  amount: string;
  merchant: string;
  userName: string;
}

export default function Payment() {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: '',
    merchant: 'Coffee Corner Cafe',
    userName: 'Rakesh'
  });
  const [transcript, setTranscript] = useState('');
  const [gestureMode, setGestureMode] = useState<'normal' | 'sos'>('normal');
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        
        // Parse payment amount from voice
        const amountMatch = result.match(/(\d+)\s*(rupees?|dollars?|rs\.?)/i);
        if (amountMatch) {
          setPaymentData(prev => ({ ...prev, amount: amountMatch[1] }));
          setTimeout(() => {
            setIsListening(false);
            setCurrentStep('confirm');
          }, 1000);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
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

  // Palm scan simulation
  const startPalmScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setTimeout(() => setCurrentStep('voice'), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 50);
  };

  // Voice recognition
  const startVoiceRecognition = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript('');
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
  const confirmWithGesture = (type: 'normal' | 'sos' = 'normal') => {
    setGestureMode(type);
    setCurrentStep('gesture');
    
    // Simulate gesture recognition
    setTimeout(() => {
      if (type === 'sos') {
        setCurrentStep('sos');
        // In real implementation, this would send SOS alert
        setTimeout(() => {
          // Show normal payment success to maintain disguise
          setCurrentStep('success');
        }, 2000);
      } else {
        setCurrentStep('processing');
        setTimeout(() => setCurrentStep('success'), 2000);
      }
    }, 2000);
  };

  // Text-to-speech for confirmations
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (currentStep === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [currentStep]);

  // Auto-speak confirmations
  useEffect(() => {
    if (currentStep === 'voice') {
      speak(`Welcome, ${paymentData.userName}! How much would you like to pay to ${paymentData.merchant}?`);
    } else if (currentStep === 'confirm' && paymentData.amount) {
      speak(`${paymentData.userName}, paying ${paymentData.amount} rupees to ${paymentData.merchant}. Please confirm with your gesture.`);
    } else if (currentStep === 'success') {
      speak('Payment successful!');
    }
  }, [currentStep, paymentData]);

  const renderStep = () => {
    switch (currentStep) {
      case 'scan':
        return (
          <PalmScanStep 
            isScanning={isScanning}
            scanProgress={scanProgress}
            onScan={startPalmScan}
            videoRef={videoRef}
            userName={paymentData.userName}
          />
        );
      
      case 'voice':
        return (
          <VoiceStep 
            isListening={isListening}
            transcript={transcript}
            onStartListening={startVoiceRecognition}
            onStopListening={stopVoiceRecognition}
            paymentData={paymentData}
          />
        );
      
      case 'confirm':
        return (
          <ConfirmStep 
            paymentData={paymentData}
            onConfirm={() => confirmWithGesture('normal')}
            onSOS={() => confirmWithGesture('sos')}
          />
        );
      
      case 'gesture':
        return <GestureStep gestureMode={gestureMode} />;
      
      case 'processing':
        return <ProcessingStep />;
      
      case 'success':
        return <SuccessStep paymentData={paymentData} gestureMode={gestureMode} />;
      
      case 'sos':
        return <SOSStep />;
      
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
            Secure Payment Terminal
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
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
const PalmScanStep = ({ 
  isScanning, 
  scanProgress, 
  onScan, 
  videoRef,
  userName 
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
    className="text-center"
  >
    <h1 className="text-4xl font-bold mb-4">
      Palm Authentication
    </h1>
    <p className="text-lg text-muted-foreground mb-8">
      Place your registered palm in front of the scanner to begin payment
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
              transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
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
          <p className="text-sm text-cyber-cyan mt-2">Authenticating... {scanProgress}%</p>
        </div>
      )}
    </div>

    {!isScanning && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onScan}
        className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
      >
        <Hand className="w-5 h-5" />
        <span>Scan Palm</span>
      </motion.button>
    )}
  </motion.div>
);

const VoiceStep = ({ 
  isListening, 
  transcript, 
  onStartListening, 
  onStopListening,
  paymentData 
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
    className="text-center"
  >
    <div className="mb-6">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full flex items-center justify-center"
      >
        <CheckCircle className="w-8 h-8 text-green-400" />
      </motion.div>
      <h2 className="text-3xl font-bold mb-2 text-green-400">
        Welcome, {paymentData.userName}!
      </h2>
      <p className="text-muted-foreground">
        How much would you like to pay to {paymentData.merchant}?
      </p>
    </div>

    <div className="relative max-w-md mx-auto mb-8">
      <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 flex items-center justify-center relative">
        <motion.div
          animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.8, repeat: isListening ? Infinity : 0 }}
          className="w-32 h-32 rounded-full bg-cyber-cyan/30 flex items-center justify-center"
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <Mic className="w-16 h-16 text-cyber-cyan" />
            </motion.div>
          ) : (
            <Volume2 className="w-16 h-16 text-cyber-cyan" />
          )}
        </motion.div>
        
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 2], opacity: [0.7, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-cyber-cyan"
            />
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="absolute inset-0 rounded-full border-2 border-cyber-cyan"
            />
          </>
        )}
      </div>

      {/* Transcript Display */}
      <div className="mt-6 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30 min-h-[60px] flex items-center justify-center">
        {transcript ? (
          <p className="text-cyber-cyan font-medium">"{transcript}"</p>
        ) : isListening ? (
          <p className="text-muted-foreground">Listening for payment amount...</p>
        ) : (
          <p className="text-muted-foreground">
            Say: "Pay [amount] rupees" or tap to start
          </p>
        )}
      </div>
    </div>

    <div className="flex gap-4 justify-center">
      {!isListening ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartListening}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
        >
          <Mic className="w-5 h-5" />
          <span>Start Voice Input</span>
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStopListening}
          className="bg-red-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-red-500/25 transition-all"
        >
          <VolumeX className="w-5 h-5" />
          <span>Stop Listening</span>
        </motion.button>
      )}
    </div>
  </motion.div>
);

const ConfirmStep = ({ 
  paymentData, 
  onConfirm, 
  onSOS 
}: {
  paymentData: PaymentData;
  onConfirm: () => void;
  onSOS: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="text-center"
  >
    <h2 className="text-3xl font-bold mb-6">
      Confirm Payment
    </h2>

    {/* Payment Details */}
    <div className="max-w-md mx-auto mb-8 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">Amount:</span>
        <span className="text-2xl font-bold text-cyber-cyan">₹{paymentData.amount}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">To:</span>
        <span className="font-medium">{paymentData.merchant}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">From:</span>
        <span className="font-medium">{paymentData.userName}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Time:</span>
        <span className="text-sm">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>

    <div className="mb-8">
      <p className="text-lg text-muted-foreground mb-4">
        Please confirm with your gesture PIN
      </p>
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Shield className="w-4 h-4" />
        <span>Secure gesture authentication required</span>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onConfirm}
        className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-green-500/25 transition-all"
      >
        <CheckCircle className="w-5 h-5" />
        <span>Confirm Payment</span>
      </motion.button>
      
      {/* Hidden SOS button (in real app, this would be disguised) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSOS}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all opacity-30 hover:opacity-100"
        title="Emergency SOS (normally hidden)"
      >
        <AlertTriangle className="w-5 h-5" />
        <span>Emergency</span>
      </motion.button>
    </div>
  </motion.div>
);

const GestureStep = ({ gestureMode }: { gestureMode: 'normal' | 'sos' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="text-center"
  >
    <h2 className="text-3xl font-bold mb-6">
      {gestureMode === 'sos' ? 'Processing...' : 'Perform Your Gesture'}
    </h2>

    <div className="relative max-w-md mx-auto mb-8">
      <div className="w-80 h-60 mx-auto rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400/30 flex items-center justify-center">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Hand className={`w-24 h-24 ${gestureMode === 'sos' ? 'text-orange-400' : 'text-purple-400'}`} />
        </motion.div>
      </div>

      <p className={`font-medium mt-4 ${gestureMode === 'sos' ? 'text-orange-400' : 'text-purple-400'}`}>
        {gestureMode === 'sos' ? 'Processing your request...' : 'Recognizing your gesture...'}
      </p>
    </div>
  </motion.div>
);

const ProcessingStep = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="text-center"
  >
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 rounded-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <CreditCard className="w-12 h-12 text-cyber-cyan" />
      </motion.div>
    </div>
    
    <h2 className="text-3xl font-bold mb-4">Processing Payment</h2>
    <p className="text-muted-foreground">
      Securely processing your transaction...
    </p>
  </motion.div>
);

const SuccessStep = ({ 
  paymentData, 
  gestureMode 
}: { 
  paymentData: PaymentData; 
  gestureMode: 'normal' | 'sos';
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full flex items-center justify-center"
    >
      <CheckCircle className="w-12 h-12 text-green-400" />
    </motion.div>
    
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-4xl font-bold mb-4 text-green-400"
    >
      Payment Successful!
    </motion.h1>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="max-w-md mx-auto mb-8 p-6 rounded-xl bg-green-500/10 border border-green-500/30"
    >
      <div className="text-3xl font-bold text-green-400 mb-2">₹{paymentData.amount}</div>
      <div className="text-muted-foreground">paid to {paymentData.merchant}</div>
      <div className="text-sm text-muted-foreground mt-2">
        Transaction ID: TXN{Date.now().toString().slice(-8)}
      </div>
    </motion.div>

    {gestureMode === 'sos' && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 right-4 w-3 h-3 bg-orange-500 rounded-full animate-pulse"
        title="SOS alert sent discretely"
      />
    )}

    <div className="flex gap-4 justify-center">
      <Link to="/payment">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
        >
          <span>New Payment</span>
        </motion.button>
      </Link>
      
      <Link to="/dashboard">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border border-cyber-cyan/30 text-cyber-cyan px-8 py-4 rounded-xl font-semibold hover:bg-cyber-cyan/10 transition-all"
        >
          <span>Dashboard</span>
        </motion.button>
      </Link>
    </div>
  </motion.div>
);

const SOSStep = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center"
  >
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <AlertTriangle className="w-12 h-12 text-orange-400" />
      </motion.div>
    </div>
    
    <h2 className="text-3xl font-bold mb-4 text-orange-400">
      Emergency Alert Sent
    </h2>
    
    <div className="max-w-md mx-auto mb-8 p-6 rounded-xl bg-orange-500/10 border border-orange-500/30">
      <p className="text-muted-foreground mb-4">
        Your emergency contacts have been notified with your current location.
      </p>
      <div className="flex items-center justify-center space-x-2 text-sm text-orange-400">
        <MapPin className="w-4 h-4" />
        <span>Location shared</span>
        <Clock className="w-4 h-4 ml-4" />
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>

    <p className="text-sm text-muted-foreground mb-6">
      The app will now show a normal payment success screen for your safety.
    </p>

    <motion.div
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-xs text-orange-400"
    >
      Help is on the way. Stay safe.
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
