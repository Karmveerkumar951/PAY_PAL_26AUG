import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Hand, Scan, Shield, Smartphone, ArrowRight, CheckCircle, Zap, Lock,
  Eye, Mic, CreditCard, AlertTriangle, Key, Sparkles, Volume2, Fingerprint,
  Brain, Unlock, Users, Calendar, FileText, Camera
} from "lucide-react";

// Feature Card Component
const FeatureCard = ({ icon, title, subtitle, description, functionality, delay }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  functionality: string;
  delay: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border border-border/30 hover:border-cyber-cyan/50 transition-all duration-500 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Icon */}
        <div className="relative z-10 mb-6">
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="text-sm text-cyber-cyan font-medium mb-2">{subtitle}</div>
          <h3 className="text-xl font-bold mb-4 group-hover:text-cyber-cyan transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-dark-slate-900/50 border border-cyber-cyan/20">
            <Zap className="w-4 h-4 text-cyber-cyan mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <span className="text-cyber-cyan font-medium">Core Tech: </span>
              {functionality}
            </div>
          </div>
        </div>

        {/* Hover effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 right-4 w-2 h-2 bg-cyber-cyan rounded-full"
        />
      </div>
    </motion.div>
  );
};

// Animated Feature Icons
const BiometricIcon = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 rounded-xl flex items-center justify-center">
      <Eye className="w-8 h-8 text-cyber-cyan" />
    </div>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 border-2 border-cyber-cyan/30 border-dashed rounded-xl"
    />
  </div>
);

const PaymentIcon = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 rounded-xl flex items-center justify-center">
      <Volume2 className="w-8 h-8 text-cyber-cyan" />
    </div>
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute inset-2 border border-cyber-cyan/50 rounded-lg"
    />
  </div>
);

const VaultIcon = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 rounded-xl flex items-center justify-center">
      <CreditCard className="w-8 h-8 text-cyber-cyan" />
    </div>
    <motion.div
      animate={{ y: [-2, 2, -2] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute inset-0"
    />
  </div>
);

const SOSIcon = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
      <AlertTriangle className="w-8 h-8 text-red-400" />
    </div>
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute inset-0 bg-red-500/10 rounded-xl"
    />
  </div>
);

const AccessIcon = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 rounded-xl flex items-center justify-center">
      <Key className="w-8 h-8 text-cyber-cyan" />
    </div>
    <motion.div
      animate={{ rotate: [0, 15, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute inset-0"
    />
  </div>
);

const AIIcon = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
      <Brain className="w-8 h-8 text-purple-400" />
    </div>
    <motion.div
      animate={{ boxShadow: ["0 0 0 0 rgba(168, 85, 247, 0.4)", "0 0 0 10px rgba(168, 85, 247, 0)"] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute inset-0 rounded-xl"
    />
  </div>
);

export default function Index() {
  const [isScanning, setIsScanning] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <Hand className="w-8 h-8 text-cyber-cyan" />
            <div className="absolute inset-0 w-8 h-8 text-cyber-cyan animate-pulse-glow rounded-full" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyber-cyan to-blue-400 bg-clip-text text-transparent">
            PalmPay Secure
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex items-center space-x-6"
        >
          <Link to="/payment" className="text-muted-foreground hover:text-cyber-cyan transition-colors">Payment</Link>
          <Link to="/document-locker" className="text-muted-foreground hover:text-cyber-cyan transition-colors">Vault</Link>
          <Link to="/accessibility" className="text-muted-foreground hover:text-cyber-cyan transition-colors">Settings</Link>
          <Link to="/palmistry" className="text-muted-foreground hover:text-cyber-cyan transition-colors">Palmistry</Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-8 lg:px-16 py-12 lg:py-20"
      >
        {/* Left Content */}
        <div className="flex-1 max-w-2xl mb-12 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              The Future of
              <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-cyan bg-clip-text text-transparent block">
                Identity & Payment
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Revolutionary biometric authentication that makes your palm your password. 
              Secure, instant, and completely cardless - experience the future of digital payments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/biometric-setup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all w-full sm:w-auto"
                >
                  <Scan className="w-5 h-5" />
                  <span>Start Biometric Setup</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startScan}
                className="border border-cyber-cyan/30 text-cyber-cyan px-8 py-4 rounded-xl font-semibold hover:bg-cyber-cyan/10 transition-all flex items-center justify-center space-x-2"
              >
                <Hand className="w-5 h-5" />
                <span>Demo Palm Scan</span>
              </motion.button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Zap, text: "< 7 seconds", desc: "Authentication" },
                { icon: Shield, text: "Bank-grade", desc: "Security" },
                { icon: Smartphone, text: "100% Digital", desc: "Wallet" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30"
                >
                  <item.icon className="w-6 h-6 text-cyber-cyan" />
                  <div>
                    <div className="font-semibold text-sm">{item.text}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Content - Interactive Palm Scanner */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Palm Scanner Interface */}
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-cyber-cyan/30 animate-pulse-glow" />
              
              {/* Scanner grid */}
              <div className="absolute inset-8 rounded-full border border-cyber-cyan/20 flex items-center justify-center">
                <motion.div
                  animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 2, ease: "linear", repeat: isScanning ? Infinity : 0 }}
                  className="relative w-48 h-48 md:w-56 md:h-56"
                >
                  {/* Hand silhouette */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Hand className="w-24 h-24 md:w-32 md:h-32 text-cyber-cyan/60" />
                  </div>
                  
                  {/* Scanning line */}
                  {isScanning && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 200, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
                    />
                  )}
                  
                  {/* Corner brackets */}
                  {[
                    "top-0 left-0",
                    "top-0 right-0 rotate-90",
                    "bottom-0 right-0 rotate-180",
                    "bottom-0 left-0 -rotate-90"
                  ].map((position, index) => (
                    <div
                      key={index}
                      className={`absolute ${position} w-8 h-8 border-l-2 border-t-2 border-cyber-cyan`}
                    />
                  ))}
                </motion.div>
              </div>
              
              {/* Status indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2"
              >
                {isScanning ? (
                  <>
                    <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
                    <span className="text-cyber-cyan text-sm font-medium">Scanning...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Ready to scan</span>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Core Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-6 md:px-8 lg:px-16 py-20"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Where Technology Feels Like
            <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-cyan bg-clip-text text-transparent block">
              Pure Magic
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Every feature is crafted to be visually stunning, intuitively simple, and fundamentally secure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Feature 1: Biometric Onboarding */}
          <FeatureCard
            icon={<BiometricIcon />}
            title="Cinematic Biometric Onboarding"
            subtitle="The Seamless Welcome"
            description="Your first interaction isn't a login form; it's a cinematic experience. Neural network lines converge and trace your unique print in real-time with ethereal neon glow."
            functionality="Multi-Modal AI Palm & Face Authentication; Liveness Detection"
            delay={0}
          />

          {/* Feature 2: Voice & Gesture Payments */}
          <FeatureCard
            icon={<PaymentIcon />}
            title="Voice & Gesture Payments"
            subtitle="The Intuitive Transaction"
            description="Simply show your palm and speak the amount. Your secret gesture confirms with a beautiful ripple effect that washes the screen in calming green."
            functionality="Voice-activated Payment Initiation; Gesture-based Confirmation PIN"
            delay={0.1}
          />

          {/* Feature 3: Digital Vault */}
          <FeatureCard
            icon={<VaultIcon />}
            title="Crystalline Card Locker"
            subtitle="The Digital Vault"
            description="Your documents are presented as beautiful, glass-morphic digital cards with parallax effects. Each card glows on hover and flips with stunning 3D animation."
            functionality="Secure, Encrypted Storage for Digital IDs and Cards; OCR Data Extraction"
            delay={0.2}
          />

          {/* Feature 4: SOS Mode */}
          <FeatureCard
            icon={<SOSIcon />}
            title="Discreet SOS Mode"
            subtitle="The Guardian Angel"
            description="Emergency gesture triggers the same green ripple as normal payments. Only a tiny icon pulse confirms your silent alert - completely inconspicuous protection."
            functionality="Duress Gesture Recognition; Silent SOS Alert with Geolocation"
            delay={0.3}
          />

          {/* Feature 5: Access Control */}
          <FeatureCard
            icon={<AccessIcon />}
            title="Seamless Access Control"
            subtitle="The Universal Key"
            description="Approaching smart locks or gates, simply raise your palm. Watch the lock icon elegantly rotate and unlock with swift, satisfying confirmation."
            functionality="API for Third-Party Integration with Smart Locks and Access Systems"
            delay={0.4}
          />

          {/* Feature 6: AI Engagement */}
          <FeatureCard
            icon={<AIIcon />}
            title="AI-Powered Engagement"
            subtitle="The Personal Touch"
            description="Personalized greetings on special occasions and interactive palmistry with 3D hand models where corresponding lines light up dynamically."
            functionality="Personalized Greetings; Interactive AI Chatbot"
            delay={0.5}
          />
        </div>
      </motion.section>

      {/* Quick Access Navigation */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-6 md:px-8 lg:px-16 py-20"
      >
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Experience PalmPay
            <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-cyan bg-clip-text text-transparent block">
              Right Now
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Jump into any feature and explore the future of digital payments and identity management.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Biometric Setup",
              description: "Complete your palm and face authentication setup",
              icon: Fingerprint,
              link: "/biometric-setup",
              color: "from-green-500/20 to-emerald-500/20 border-green-400/30",
              buttonColor: "from-green-500 to-emerald-500"
            },
            {
              title: "Make Payment",
              description: "Experience voice-activated secure payments",
              icon: Zap,
              link: "/payment",
              color: "from-cyber-cyan/20 to-blue-500/20 border-cyber-cyan/30",
              buttonColor: "from-cyber-cyan to-blue-500"
            },
            {
              title: "Secure Vault",
              description: "Store and manage your digital documents",
              icon: Shield,
              link: "/document-locker",
              color: "from-purple-500/20 to-violet-500/20 border-purple-400/30",
              buttonColor: "from-purple-500 to-violet-500"
            },
            {
              title: "QR Scanner",
              description: "Universal payment compatibility",
              icon: Camera,
              link: "/qr-scanner",
              color: "from-orange-500/20 to-red-500/20 border-orange-400/30",
              buttonColor: "from-orange-500 to-red-500"
            },
            {
              title: "Accessibility",
              description: "Multi-language and accessibility settings",
              icon: Users,
              link: "/accessibility",
              color: "from-blue-500/20 to-indigo-500/20 border-blue-400/30",
              buttonColor: "from-blue-500 to-indigo-500"
            },
            {
              title: "AI Palmistry",
              description: "Fun palm reading entertainment",
              icon: Sparkles,
              link: "/palmistry",
              color: "from-pink-500/20 to-purple-500/20 border-pink-400/30",
              buttonColor: "from-pink-500 to-purple-500"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={item.link}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-6 rounded-xl bg-gradient-to-br ${item.color} backdrop-blur-sm border cursor-pointer hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-card/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-cyber-cyan" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`inline-flex items-center space-x-2 bg-gradient-to-r ${item.buttonColor} text-white px-4 py-2 rounded-lg font-medium text-sm group-hover:shadow-lg transition-all`}
                  >
                    <span>Try Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="px-6 md:px-8 lg:px-16 pb-12"
      >
        <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span className="text-sm">End-to-end encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Federated learning</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">GDPR compliant</span>
          </div>
        </div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyber-cyan/30 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
