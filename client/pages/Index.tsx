import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Hand, Scan, Shield, Smartphone, ArrowRight, CheckCircle, Zap, Lock } from "lucide-react";

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
          className="hidden md:flex items-center space-x-8"
        >
          <a href="#features" className="text-muted-foreground hover:text-cyber-cyan transition-colors">Features</a>
          <a href="#security" className="text-muted-foreground hover:text-cyber-cyan transition-colors">Security</a>
          <a href="#contact" className="text-muted-foreground hover:text-cyber-cyan transition-colors">Contact</a>
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startScan}
                className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
              >
                <Scan className="w-5 h-5" />
                <span>Start Biometric Setup</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-cyber-cyan/30 text-cyber-cyan px-8 py-4 rounded-xl font-semibold hover:bg-cyber-cyan/10 transition-all flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>Learn More</span>
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
