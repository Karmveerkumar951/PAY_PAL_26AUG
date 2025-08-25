import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  Hand, Sparkles, MessageCircle, Camera, RefreshCw, 
  Star, Heart, Zap, Crown, Send, Bot, User,
  PlayCircle, PauseCircle, Volume2, Share, Download
} from "lucide-react";
import { Link } from "react-router-dom";

interface PalmReading {
  id: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  color: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  readings?: PalmReading[];
}

const palmReadings: PalmReading[] = [
  {
    id: '1',
    category: 'Life Line',
    title: 'Long and Vibrant Journey',
    description: 'Your life line suggests a long, healthy, and adventurous life ahead. You have the energy and vitality to pursue your dreams with passion.',
    confidence: 85,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: '2', 
    category: 'Heart Line',
    title: 'Deep Emotional Connection',
    description: 'Your heart line indicates a person who loves deeply and forms meaningful relationships. You have a generous heart and strong intuition.',
    confidence: 92,
    color: 'from-pink-500 to-red-600'
  },
  {
    id: '3',
    category: 'Head Line',
    title: 'Sharp Analytical Mind',
    description: 'Your head line reveals exceptional analytical abilities and creative problem-solving skills. You approach challenges with both logic and intuition.',
    confidence: 78,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: '4',
    category: 'Fate Line',
    title: 'Destined for Success',
    description: 'Your fate line suggests that success will come through your own determination and hard work. Major positive changes are on the horizon.',
    confidence: 88,
    color: 'from-purple-500 to-violet-600'
  }
];

export default function Palmistry() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [palmScanned, setPalmScanned] = useState(false);
  const [currentReading, setCurrentReading] = useState<PalmReading | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start camera for palm scanning
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

  // Simulate palm scan and reading generation
  const startPalmScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setPalmScanned(true);
          generateReading();
          return 100;
        }
        return prev + 3;
      });
    }, 80);
  };

  // Generate palm reading
  const generateReading = () => {
    const randomReading = palmReadings[Math.floor(Math.random() * palmReadings.length)];
    setCurrentReading(randomReading);
    
    // Add initial bot message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: `✨ Greetings! I've analyzed your palm and discovered some fascinating insights. Your ${randomReading.category.toLowerCase()} is particularly interesting!`,
      timestamp: new Date(),
      readings: [randomReading]
    };
    
    setMessages([welcomeMessage]);
    setShowChat(true);
    stopCamera();
  };

  // Send chat message
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a wonderful question! Based on your palm patterns, I see great potential in your future endeavors.",
        "Interesting perspective! Your palm lines suggest you have excellent intuition about these matters.",
        "Your curiosity shows in your palm reading! The universe has exciting plans for you.",
        "I can see why you'd ask that - your wisdom line indicates deep thoughtfulness.",
        "According to ancient palmistry traditions, your question reveals your caring nature."
      ];

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  // Reset for new reading
  const startNewReading = () => {
    setPalmScanned(false);
    setCurrentReading(null);
    setShowChat(false);
    setMessages([]);
    setScanProgress(0);
    startCamera();
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!palmScanned) {
      startCamera();
    }
    return () => stopCamera();
  }, [palmScanned]);

  if (!palmScanned) {
    return <ScanningView 
      isScanning={isScanning}
      scanProgress={scanProgress}
      onStartScan={startPalmScan}
      videoRef={videoRef}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Header */}
      <header className="relative z-50 flex justify-between items-center p-6 md:p-8">
        <Link to="/" className="flex items-center space-x-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Palmist
          </span>
        </Link>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startNewReading}
          className="flex items-center space-x-2 px-4 py-2 border border-purple-400/30 rounded-lg text-purple-400 hover:bg-purple-400/10 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Reading</span>
        </motion.button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-6 md:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Palm Reading Display */}
            <ReadingDisplay reading={currentReading} />
            
            {/* Chat Interface */}
            {showChat && (
              <ChatInterface 
                messages={messages}
                isTyping={isTyping}
                inputMessage={inputMessage}
                onInputChange={setInputMessage}
                onSendMessage={sendMessage}
                chatEndRef={chatEndRef}
              />
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto p-3 rounded-lg bg-orange-500/10 border border-orange-400/30 text-center"
        >
          <p className="text-xs text-orange-400">
            ⚠️ For entertainment purposes only • Not actual fortune telling
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Scanning View Component
const ScanningView = ({ 
  isScanning, 
  scanProgress, 
  onStartScan, 
  videoRef 
}: {
  isScanning: boolean;
  scanProgress: number;
  onStartScan: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-purple-900/20 to-dark-slate-800 text-foreground flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
    
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center z-10 max-w-2xl mx-auto px-6"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-purple-400" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          AI Palmistry Reader
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Discover the mysteries hidden in your palm lines
        </p>
        <p className="text-sm text-orange-400">
          ⚠️ Entertainment purposes only • Ancient art meets modern AI
        </p>
      </div>

      {/* Camera Section */}
      <div className="relative max-w-md mx-auto mb-8">
        <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-4 border-purple-400/30">
          {isScanning ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Mystical scanning overlay */}
              <div className="absolute inset-0">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border-2 border-purple-400/50 border-dashed rounded-full"
                />
                
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-purple-400/10 rounded-full"
                />
                
                {/* Palm guide */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Hand className="w-16 h-16 text-purple-400/70" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Hand className="w-20 h-20 text-purple-400/50 mx-auto mb-4" />
                <p className="text-purple-400/70">Ready for palm reading</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        {isScanning && (
          <div className="mt-6">
            <div className="w-full bg-dark-slate-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-sm text-purple-400 mt-2">
              Reading your palm... {scanProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      {!isScanning && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartScan}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <Camera className="w-5 h-5" />
          <span>Begin Palm Reading</span>
        </motion.button>
      )}

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Star, title: "Life Insights", desc: "Discover your life path" },
          { icon: Heart, title: "Love & Relationships", desc: "Explore your heart line" },
          { icon: Zap, title: "Career & Success", desc: "Understand your potential" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30"
          >
            <feature.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

// Reading Display Component
const ReadingDisplay = ({ reading }: { reading: PalmReading | null }) => {
  if (!reading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-4">Your Palm Reading</h2>
        <p className="text-muted-foreground">
          Based on the ancient art of palmistry, enhanced by AI analysis
        </p>
      </div>

      {/* Interactive Palm Diagram */}
      <div className="relative">
        <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30 p-8">
          <PalmDiagram activeReading={reading} />
        </div>
      </div>

      {/* Reading Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl bg-gradient-to-r ${reading.color} bg-opacity-10 border-2 border-purple-400/30`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm text-purple-400 font-medium">{reading.category}</span>
            <h3 className="text-xl font-bold">{reading.title}</h3>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(reading.confidence / 20) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">{reading.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-purple-400">
            Confidence: {reading.confidence}%
          </span>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              <Share className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Palm Diagram Component
const PalmDiagram = ({ activeReading }: { activeReading: PalmReading }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 250" className="w-full h-full">
      {/* Palm outline */}
      <path
        d="M100 240 C80 235, 60 220, 50 200 L45 180 C40 160, 45 140, 55 120 L65 100 C70 80, 80 60, 90 45 L95 35 C100 25, 110 20, 120 25 L130 30 C140 35, 150 45, 155 55 L160 70 C165 85, 160 100, 155 115 L150 130 C145 145, 140 160, 145 175 L150 190 C155 205, 145 220, 130 230 L115 235 Z"
        fill="none"
        stroke="rgba(168, 85, 247, 0.3)"
        strokeWidth="2"
      />
      
      {/* Palm lines */}
      {/* Life line */}
      <motion.path
        d="M75 80 Q85 120, 90 160 Q95 200, 100 230"
        fill="none"
        stroke={activeReading.category === 'Life Line' ? '#a855f7' : 'rgba(168, 85, 247, 0.5)'}
        strokeWidth={activeReading.category === 'Life Line' ? 3 : 2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      
      {/* Heart line */}
      <motion.path
        d="M60 100 Q90 95, 120 100 Q140 105, 155 110"
        fill="none"
        stroke={activeReading.category === 'Heart Line' ? '#ec4899' : 'rgba(236, 72, 153, 0.5)'}
        strokeWidth={activeReading.category === 'Heart Line' ? 3 : 2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />
      
      {/* Head line */}
      <motion.path
        d="M65 115 Q95 120, 125 118 Q145 116, 160 120"
        fill="none"
        stroke={activeReading.category === 'Head Line' ? '#3b82f6' : 'rgba(59, 130, 246, 0.5)'}
        strokeWidth={activeReading.category === 'Head Line' ? 3 : 2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      />
      
      {/* Fate line */}
      <motion.path
        d="M100 140 Q102 110, 105 80 Q108 50, 110 30"
        fill="none"
        stroke={activeReading.category === 'Fate Line' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.5)'}
        strokeWidth={activeReading.category === 'Fate Line' ? 3 : 2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 2 }}
      />
      
      {/* Glowing effect for active line */}
      {activeReading.category === 'Life Line' && (
        <motion.circle
          cx="85"
          cy="120"
          r="5"
          fill="#a855f7"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </svg>
  </div>
);

// Chat Interface Component
const ChatInterface = ({ 
  messages, 
  isTyping, 
  inputMessage, 
  onInputChange, 
  onSendMessage,
  chatEndRef 
}: any) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex flex-col h-[600px] bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl"
  >
    {/* Chat Header */}
    <div className="p-4 border-b border-border/30">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">AI Palmist</h3>
          <p className="text-xs text-muted-foreground">Your mystical guide</p>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message: ChatMessage) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[80%] p-3 rounded-lg ${
            message.type === 'user'
              ? 'bg-cyber-cyan text-dark-slate-950'
              : 'bg-purple-500/20 text-foreground'
          }`}>
            <div className="flex items-center space-x-2 mb-1">
              {message.type === 'bot' ? (
                <Bot className="w-4 h-4 text-purple-400" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm">{message.content}</p>
            
            {/* Display readings in chat */}
            {message.readings && (
              <div className="mt-3 space-y-2">
                {message.readings.map((reading) => (
                  <div key={reading.id} className="p-2 rounded bg-purple-500/10 border border-purple-400/30">
                    <div className="text-xs font-medium text-purple-400">{reading.category}</div>
                    <div className="text-sm font-semibold">{reading.title}</div>
                    <div className="text-xs text-muted-foreground">{reading.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-purple-500/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>

    {/* Input */}
    <div className="p-4 border-t border-border/30">
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Ask about your palm reading..."
          className="flex-1 px-3 py-2 bg-card/50 border border-border/30 rounded-lg focus:outline-none focus:border-purple-400/50 text-foreground"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSendMessage}
          className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);
