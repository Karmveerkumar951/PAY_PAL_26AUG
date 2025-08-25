import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Languages, Mic, Volume2, Eye, Hand, Settings, 
  CheckCircle, Users, Calendar, Sparkles, Heart,
  VolumeX, MicOff, RotateCcw, Play, Pause
} from "lucide-react";
import { Link } from "react-router-dom";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  available: boolean;
}

interface ISLGesture {
  id: string;
  name: string;
  command: string;
  description: string;
  videoDemo: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', available: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', available: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', available: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', available: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', available: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', available: false },
];

const islGestures: ISLGesture[] = [
  {
    id: '1',
    name: 'Pay',
    command: 'PAYMENT',
    description: 'Open palm, move forward',
    videoDemo: '/api/placeholder/isl-pay'
  },
  {
    id: '2', 
    name: 'Help',
    command: 'HELP',
    description: 'Raise hand with index finger up',
    videoDemo: '/api/placeholder/isl-help'
  },
  {
    id: '3',
    name: 'Cancel',
    command: 'CANCEL', 
    description: 'Cross arms in X shape',
    videoDemo: '/api/placeholder/isl-cancel'
  },
  {
    id: '4',
    name: 'OK/Confirm',
    command: 'CONFIRM',
    description: 'Thumbs up gesture',
    videoDemo: '/api/placeholder/isl-ok'
  }
];

type AccessibilityMode = 'overview' | 'language' | 'voice' | 'isl' | 'personalization';

export default function Accessibility() {
  const [currentMode, setCurrentMode] = useState<AccessibilityMode>('overview');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [voiceSettings, setVoiceSettings] = useState({
    enabled: true,
    volume: 80,
    speed: 1.0,
    voiceType: 'female'
  });
  const [islEnabled, setIslEnabled] = useState(false);
  const [personalizedGreetings, setPersonalizedGreetings] = useState(true);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [festivalGreeting, setFestivalGreeting] = useState('');

  // Generate greeting based on current festival/time
  const generateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth();
    const day = now.getDate();
    
    // Festival greetings (simplified examples)
    if (month === 10 && day >= 12 && day <= 16) { // Diwali period
      return "Happy Diwali! 🪔 May your day be filled with light and prosperity!";
    } else if (month === 2 && day >= 13 && day <= 15) { // Holi period
      return "Happy Holi! 🌈 Wishing you a colorful and joyous celebration!";
    } else if (hour < 12) {
      return "Good morning! ☀️ Ready to make some secure payments today?";
    } else if (hour < 17) {
      return "Good afternoon! Hope you're having a wonderful day!";
    } else {
      return "Good evening! 🌙 Your secure payment companion is here!";
    }
  };

  // Text-to-speech testing
  const testVoice = (text: string, lang: string = selectedLanguage) => {
    if ('speechSynthesis' in window && voiceSettings.enabled) {
      setIsTestingVoice(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = voiceSettings.speed;
      utterance.volume = voiceSettings.volume / 100;
      
      utterance.onend = () => setIsTestingVoice(false);
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    setFestivalGreeting(generateGreeting());
  }, []);

  const renderMode = () => {
    switch (currentMode) {
      case 'overview':
        return <OverviewMode onModeChange={setCurrentMode} />;
      case 'language':
        return (
          <LanguageMode 
            languages={languages}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            onTestVoice={testVoice}
            isTestingVoice={isTestingVoice}
          />
        );
      case 'voice':
        return (
          <VoiceMode 
            settings={voiceSettings}
            onSettingsChange={setVoiceSettings}
            onTestVoice={testVoice}
            isTestingVoice={isTestingVoice}
            selectedLanguage={selectedLanguage}
          />
        );
      case 'isl':
        return (
          <ISLMode 
            gestures={islGestures}
            enabled={islEnabled}
            onToggle={setIslEnabled}
          />
        );
      case 'personalization':
        return (
          <PersonalizationMode 
            enabled={personalizedGreetings}
            onToggle={setPersonalizedGreetings}
            greeting={festivalGreeting}
            onTestGreeting={() => testVoice(festivalGreeting)}
            isTestingVoice={isTestingVoice}
          />
        );
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
            Accessibility Settings
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-6 md:px-8 pb-8">
        <AnimatePresence mode="wait">
          {renderMode()}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Overview Mode
const OverviewMode = ({ onModeChange }: { onModeChange: (mode: AccessibilityMode) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-4xl mx-auto"
  >
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">
        Accessibility & 
        <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent block">
          Personalization
        </span>
      </h1>
      <p className="text-lg text-muted-foreground">
        Make PalmPay Secure work perfectly for you with customizable accessibility features
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Language Support */}
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={() => onModeChange('language')}
        className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Languages className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Multi-Language Support</h3>
            <p className="text-sm text-muted-foreground">English, Hindi, Tamil & more</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">
          Use PalmPay in your preferred language with full voice support and localized interface.
        </p>
        <div className="flex space-x-2">
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Voice Commands</span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">UI Translation</span>
        </div>
      </motion.div>

      {/* Voice Settings */}
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={() => onModeChange('voice')}
        className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Voice Customization</h3>
            <p className="text-sm text-muted-foreground">Personalized audio experience</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">
          Adjust voice speed, volume, and type to match your preferences and hearing needs.
        </p>
        <div className="flex space-x-2">
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Volume Control</span>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Speed Adjustment</span>
        </div>
      </motion.div>

      {/* ISL Recognition */}
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={() => onModeChange('isl')}
        className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm border border-purple-400/30 cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Hand className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Indian Sign Language</h3>
            <p className="text-sm text-muted-foreground">ISL gesture recognition</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">
          Use basic ISL gestures for key commands like pay, help, cancel, and confirm.
        </p>
        <div className="flex space-x-2">
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">4 Commands</span>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Real-time Recognition</span>
        </div>
      </motion.div>

      {/* Personalization */}
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={() => onModeChange('personalization')}
        className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Smart Greetings</h3>
            <p className="text-sm text-muted-foreground">Festival & time-based AI</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">
          Receive personalized greetings for festivals like Diwali, Holi, and special occasions.
        </p>
        <div className="flex space-x-2">
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">Festival Aware</span>
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">Time Sensitive</span>
        </div>
      </motion.div>
    </div>

    {/* Quick Stats */}
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
        <div className="text-3xl font-bold text-cyber-cyan mb-2">3</div>
        <div className="text-sm text-muted-foreground">Supported Languages</div>
      </div>
      <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
        <div className="text-3xl font-bold text-green-400 mb-2">4</div>
        <div className="text-sm text-muted-foreground">ISL Commands</div>
      </div>
      <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
        <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
        <div className="text-sm text-muted-foreground">Personalized Experience</div>
      </div>
    </div>
  </motion.div>
);

// Language Mode
const LanguageMode = ({ 
  languages, 
  selectedLanguage, 
  onLanguageChange, 
  onTestVoice,
  isTestingVoice 
}: any) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="max-w-3xl mx-auto"
  >
    <h2 className="text-3xl font-bold mb-6">Language Settings</h2>
    <p className="text-muted-foreground mb-8">
      Choose your preferred language for voice commands, interface, and audio feedback.
    </p>

    <div className="space-y-4">
      {languages.map((lang) => (
        <motion.div
          key={lang.code}
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-xl border cursor-pointer transition-all ${
            selectedLanguage === lang.code
              ? 'bg-cyber-cyan/10 border-cyber-cyan/50'
              : 'bg-card/30 border-border/30 hover:border-cyber-cyan/30'
          } ${!lang.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => lang.available && onLanguageChange(lang.code)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <h3 className="font-semibold">{lang.name}</h3>
                <p className="text-sm text-muted-foreground">{lang.nativeName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lang.available ? (
                <>
                  {selectedLanguage === lang.code && (
                    <CheckCircle className="w-6 h-6 text-cyber-cyan" />
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const testText = lang.code === 'hi' ? 'नमस्ते! पेमेंट के लिए तैयार हैं?' :
                                     lang.code === 'ta' ? 'வணக்கம்! பணம் செலுத்த தயாரா?' :
                                     'Hello! Ready to make a payment?';
                      onTestVoice(testText, lang.code);
                    }}
                    disabled={isTestingVoice}
                    className="p-2 rounded-lg bg-cyber-cyan/20 text-cyber-cyan hover:bg-cyber-cyan/30 transition-colors disabled:opacity-50"
                  >
                    {isTestingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </motion.button>
                </>
              ) : (
                <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-8 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
      <h4 className="font-semibold mb-2 flex items-center space-x-2">
        <Mic className="w-5 h-5 text-blue-400" />
        <span>Voice Command Examples</span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <strong>English:</strong><br />
          "Pay 100 rupees"
        </div>
        <div>
          <strong>Hindi:</strong><br />
          "सौ रुपये दें"
        </div>
        <div>
          <strong>Tamil:</strong><br />
          "நூறு ரூபாய் கொடு"
        </div>
      </div>
    </div>
  </motion.div>
);

// Voice Mode
const VoiceMode = ({ 
  settings, 
  onSettingsChange, 
  onTestVoice, 
  isTestingVoice,
  selectedLanguage 
}: any) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="max-w-3xl mx-auto"
  >
    <h2 className="text-3xl font-bold mb-6">Voice Settings</h2>
    <p className="text-muted-foreground mb-8">
      Customize the voice output to match your preferences and accessibility needs.
    </p>

    <div className="space-y-8">
      {/* Voice Enable/Disable */}
      <div className="p-6 rounded-xl bg-card/30 border border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Voice Output</h3>
            <p className="text-sm text-muted-foreground">Enable or disable voice feedback</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSettingsChange({ ...settings, enabled: !settings.enabled })}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.enabled ? 'bg-cyber-cyan' : 'bg-muted'
            }`}
          >
            <motion.div
              animate={{ x: settings.enabled ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-6 h-6 bg-white rounded-full shadow-md"
            />
          </motion.button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="p-6 rounded-xl bg-card/30 border border-border/30">
        <h3 className="font-semibold mb-4">Volume</h3>
        <div className="flex items-center space-x-4">
          <VolumeX className="w-5 h-5 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(e) => onSettingsChange({ ...settings, volume: parseInt(e.target.value) })}
            className="flex-1 accent-cyber-cyan"
            disabled={!settings.enabled}
          />
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm w-12 text-right">{settings.volume}%</span>
        </div>
      </div>

      {/* Speed Control */}
      <div className="p-6 rounded-xl bg-card/30 border border-border/30">
        <h3 className="font-semibold mb-4">Speech Speed</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Slow</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.speed}
            onChange={(e) => onSettingsChange({ ...settings, speed: parseFloat(e.target.value) })}
            className="flex-1 accent-cyber-cyan"
            disabled={!settings.enabled}
          />
          <span className="text-sm">Fast</span>
          <span className="text-sm w-12 text-right">{settings.speed}x</span>
        </div>
      </div>

      {/* Voice Type */}
      <div className="p-6 rounded-xl bg-card/30 border border-border/30">
        <h3 className="font-semibold mb-4">Voice Type</h3>
        <div className="grid grid-cols-2 gap-4">
          {['female', 'male'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSettingsChange({ ...settings, voiceType: type })}
              className={`p-4 rounded-lg border transition-all capitalize ${
                settings.voiceType === type
                  ? 'bg-cyber-cyan/10 border-cyber-cyan/50 text-cyber-cyan'
                  : 'bg-card/50 border-border/30 hover:border-cyber-cyan/30'
              }`}
              disabled={!settings.enabled}
            >
              {type} Voice
            </motion.button>
          ))}
        </div>
      </div>

      {/* Test Voice */}
      <div className="p-6 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30">
        <h3 className="font-semibold mb-4">Test Voice Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click to hear how your voice settings sound
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTestVoice("Welcome to PalmPay Secure! Your payment is being processed.")}
          disabled={!settings.enabled || isTestingVoice}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all disabled:opacity-50"
        >
          {isTestingVoice ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isTestingVoice ? 'Playing...' : 'Test Voice'}</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// ISL Mode
const ISLMode = ({ gestures, enabled, onToggle }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="max-w-4xl mx-auto"
  >
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Indian Sign Language</h2>
        <p className="text-muted-foreground">
          Use ISL gestures for key commands. Camera will recognize these gestures in real-time.
        </p>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`w-16 h-8 rounded-full transition-colors ${
          enabled ? 'bg-cyber-cyan' : 'bg-muted'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-8 h-8 bg-white rounded-full shadow-md"
        />
      </motion.button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {gestures.map((gesture: ISLGesture, index: number) => (
        <motion.div
          key={gesture.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`p-6 rounded-xl border transition-all ${
            enabled 
              ? 'bg-purple-500/10 border-purple-400/30' 
              : 'bg-card/30 border-border/30 opacity-50'
          }`}
        >
          <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg mb-4 flex items-center justify-center">
            <Hand className="w-16 h-16 text-purple-400" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{gesture.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{gesture.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-mono">
              {gesture.command}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
              disabled={!enabled}
            >
              Practice →
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>

    {enabled && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 rounded-xl bg-green-500/10 border border-green-500/30"
      >
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="font-semibold text-green-400">ISL Recognition Active</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Camera will now recognize the above ISL gestures. Make sure you're in good lighting for best results.
        </p>
      </motion.div>
    )}
  </motion.div>
);

// Personalization Mode  
const PersonalizationMode = ({ 
  enabled, 
  onToggle, 
  greeting, 
  onTestGreeting,
  isTestingVoice 
}: any) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="max-w-3xl mx-auto"
  >
    <h2 className="text-3xl font-bold mb-6">Personalized Experience</h2>
    <p className="text-muted-foreground mb-8">
      Let PalmPay know you personally with context-aware greetings and smart interactions.
    </p>

    <div className="space-y-8">
      {/* Toggle Personalization */}
      <div className="p-6 rounded-xl bg-card/30 border border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Smart Greetings</h3>
            <p className="text-sm text-muted-foreground">Festival and time-aware AI greetings</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className={`w-12 h-6 rounded-full transition-colors ${
              enabled ? 'bg-cyber-cyan' : 'bg-muted'
            }`}
          >
            <motion.div
              animate={{ x: enabled ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-6 h-6 bg-white rounded-full shadow-md"
            />
          </motion.button>
        </div>
      </div>

      {/* Current Greeting Preview */}
      {enabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-400/30"
        >
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span>Today's Greeting</span>
          </h3>
          
          <div className="p-4 rounded-lg bg-card/50 border border-border/30 mb-4">
            <p className="text-lg">{greeting}</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTestGreeting}
            disabled={isTestingVoice}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
          >
            {isTestingVoice ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{isTestingVoice ? 'Playing...' : 'Hear Greeting'}</span>
          </motion.button>
        </motion.div>
      )}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30">
          <Calendar className="w-8 h-8 text-blue-400 mb-4" />
          <h4 className="font-semibold mb-2">Festival Awareness</h4>
          <p className="text-sm text-muted-foreground">
            Special greetings for Diwali, Holi, Eid, Christmas, and regional festivals
          </p>
        </div>
        
        <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30">
          <Users className="w-8 h-8 text-green-400 mb-4" />
          <h4 className="font-semibold mb-2">Contextual Responses</h4>
          <p className="text-sm text-muted-foreground">
            Time-of-day greetings and location-aware interactions
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);
