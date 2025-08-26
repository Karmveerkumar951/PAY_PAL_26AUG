import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Hand, Scan, Shield, Smartphone, ArrowRight, CheckCircle, Zap, Lock,
  Eye, Mic, CreditCard, AlertTriangle, Key, Sparkles, Volume2, Fingerprint,
  Brain, Unlock, Users, Calendar, FileText, Camera, Wifi, Target, Globe,
  Star, ChevronDown, Play, Pause
} from "lucide-react";

// Enhanced Feature Card Component with advanced animations
const FeatureCard = ({ icon, title, subtitle, description, functionality, delay }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  functionality: string;
  delay: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: 0.7, 
          delay,
          type: "spring",
          stiffness: 100
        }
      }}
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3 }
      }}
      viewport={{ once: true, margin: "-100px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-xl border border-border/40 hover:border-cyber-cyan/60 transition-all duration-700 overflow-hidden">
        {/* Dynamic background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 via-blue-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.7 }}
        />

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl border border-cyber-cyan/30 opacity-0 group-hover:opacity-100"
          animate={isHovered ? { 
            boxShadow: "0 0 40px rgba(0, 255, 255, 0.2), inset 0 0 40px rgba(0, 255, 255, 0.1)" 
          } : {}}
          transition={{ duration: 0.7 }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          style={{ transform: "skewX(-20deg)" }}
        />

        {/* Enhanced icon with floating animation */}
        <div className="relative z-10 mb-8">
          <motion.div
            animate={isHovered ? { 
              scale: 1.15, 
              rotate: [0, 5, -5, 0],
              y: [-2, 2, -2]
            } : { 
              scale: 1, 
              rotate: 0,
              y: 0
            }}
            transition={{ 
              duration: 0.6,
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Enhanced content with staggered animations */}
        <div className="relative z-10">
          <motion.div 
            className="text-sm text-cyber-cyan font-medium mb-3 tracking-wide uppercase"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {subtitle}
          </motion.div>
          
          <motion.h3 
            className="text-xl font-bold mb-6 group-hover:text-cyber-cyan transition-colors duration-300"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-muted-foreground mb-8 leading-relaxed"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className="flex items-start space-x-3 p-5 rounded-xl bg-dark-slate-900/60 border border-cyber-cyan/30 backdrop-blur-sm"
            animate={isHovered ? { x: 5, scale: 1.02 } : { x: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <motion.div
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1 }}
            >
              <Zap className="w-5 h-5 text-cyber-cyan mt-0.5 flex-shrink-0" />
            </motion.div>
            <div className="text-sm text-muted-foreground">
              <span className="text-cyber-cyan font-medium">Core Tech: </span>
              {functionality}
            </div>
          </motion.div>
        </div>

        {/* Floating indicator dots */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-6 right-6 w-3 h-3 bg-cyber-cyan rounded-full shadow-lg shadow-cyber-cyan/50"
        />

        {/* Corner accent */}
        <motion.div
          className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-cyber-cyan/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// Enhanced Animated Feature Icons with more sophisticated animations
const BiometricIcon = () => (
  <div className="relative w-18 h-18">
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/30 to-blue-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm"
      animate={{ 
        boxShadow: [
          "0 0 20px rgba(0, 255, 255, 0.3)",
          "0 0 40px rgba(0, 255, 255, 0.5)",
          "0 0 20px rgba(0, 255, 255, 0.3)"
        ]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <Eye className="w-10 h-10 text-cyber-cyan drop-shadow-lg" />
    </motion.div>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute inset-1 border-2 border-cyber-cyan/40 border-dashed rounded-2xl"
    />
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute inset-3 border border-cyber-cyan/20 rounded-xl"
    />
  </div>
);

const PaymentIcon = () => (
  <div className="relative w-18 h-18">
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm"
      animate={{ 
        boxShadow: [
          "0 0 20px rgba(34, 197, 94, 0.3)",
          "0 0 40px rgba(34, 197, 94, 0.5)",
          "0 0 20px rgba(34, 197, 94, 0.3)"
        ]
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <Volume2 className="w-10 h-10 text-green-400 drop-shadow-lg" />
    </motion.div>
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute inset-2 border border-green-400/50 rounded-xl"
    />
  </div>
);

const VaultIcon = () => (
  <div className="relative w-18 h-18">
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm"
      animate={{ 
        rotateY: [0, 10, 0, -10, 0],
        boxShadow: [
          "0 0 20px rgba(168, 85, 247, 0.3)",
          "0 0 40px rgba(168, 85, 247, 0.5)",
          "0 0 20px rgba(168, 85, 247, 0.3)"
        ]
      }}
      transition={{ 
        rotateY: { duration: 4, repeat: Infinity },
        boxShadow: { duration: 3, repeat: Infinity }
      }}
    >
      <CreditCard className="w-10 h-10 text-purple-400 drop-shadow-lg" />
    </motion.div>
    <motion.div
      animate={{ y: [-2, 2, -2] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute inset-0"
    />
  </div>
);

const SOSIcon = () => (
  <div className="relative w-18 h-18">
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm"
      animate={{ 
        boxShadow: [
          "0 0 20px rgba(239, 68, 68, 0.3)",
          "0 0 40px rgba(239, 68, 68, 0.6)",
          "0 0 20px rgba(239, 68, 68, 0.3)"
        ]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <AlertTriangle className="w-10 h-10 text-red-400 drop-shadow-lg" />
    </motion.div>
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute inset-0 bg-red-500/20 rounded-2xl"
    />
  </div>
);

const AccessIcon = () => (
  <div className="relative w-18 h-18">
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm"
      animate={{ 
        boxShadow: [
          "0 0 20px rgba(59, 130, 246, 0.3)",
          "0 0 40px rgba(59, 130, 246, 0.5)",
          "0 0 20px rgba(59, 130, 246, 0.3)"
        ]
      }}
      transition={{ duration: 3.5, repeat: Infinity }}
    >
      <Key className="w-10 h-10 text-blue-400 drop-shadow-lg" />
    </motion.div>
    <motion.div
      animate={{ rotate: [0, 15, 0, -15, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute inset-0"
    />
  </div>
);

const AIIcon = () => (
  <div className="relative w-18 h-18">
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm"
      animate={{ 
        boxShadow: [
          "0 0 20px rgba(236, 72, 153, 0.3)",
          "0 0 40px rgba(236, 72, 153, 0.5)",
          "0 0 20px rgba(236, 72, 153, 0.3)"
        ]
      }}
      transition={{ duration: 2.8, repeat: Infinity }}
    >
      <Brain className="w-10 h-10 text-pink-400 drop-shadow-lg" />
    </motion.div>
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute inset-2 border border-pink-400/40 rounded-xl"
    />
  </div>
);

// Enhanced floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-cyber-cyan to-blue-400 rounded-full opacity-60"
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced palm scanner with better visual feedback
const PalmScanner = ({ isScanning }: { isScanning: boolean }) => {
  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      {/* Outer glow ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border-2 border-cyber-cyan/40"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.6, 1, 0.6],
          boxShadow: [
            "0 0 30px rgba(0, 255, 255, 0.3)",
            "0 0 60px rgba(0, 255, 255, 0.6)",
            "0 0 30px rgba(0, 255, 255, 0.3)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Scanner interface */}
      <div className="absolute inset-8 rounded-full border border-cyber-cyan/30 flex items-center justify-center backdrop-blur-sm bg-dark-slate-900/20">
        <motion.div
          animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 3, ease: "linear", repeat: isScanning ? Infinity : 0 }}
          className="relative w-48 h-48 md:w-56 md:h-56"
        >
          {/* Central hand silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={isScanning ? { 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              } : { scale: 1, opacity: 0.7 }}
              transition={{ duration: 2, repeat: isScanning ? Infinity : 0 }}
            >
              <Hand className="w-24 h-24 md:w-32 md:h-32 text-cyber-cyan/80 drop-shadow-lg" />
            </motion.div>
          </div>
          
          {/* Dynamic scanning grid */}
          {isScanning && (
            <>
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 250, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-lg shadow-cyber-cyan/50"
              />
              
              {/* Pulse rings during scan */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-cyber-cyan/30"
                  animate={{ 
                    scale: [1, 2, 3],
                    opacity: [0.8, 0.4, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7
                  }}
                />
              ))}
            </>
          )}
          
          {/* Enhanced corner brackets */}
          {[
            { position: "top-0 left-0", rotation: 0 },
            { position: "top-0 right-0", rotation: 90 },
            { position: "bottom-0 right-0", rotation: 180 },
            { position: "bottom-0 left-0", rotation: 270 }
          ].map((bracket, index) => (
            <motion.div
              key={index}
              className={`absolute ${bracket.position} w-12 h-12 border-l-3 border-t-3 border-cyber-cyan`}
              style={{ rotate: bracket.rotation }}
              animate={isScanning ? { 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              } : { scale: 1, opacity: 0.7 }}
              transition={{ 
                duration: 2, 
                repeat: isScanning ? Infinity : 0,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Enhanced status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/40"
      >
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <motion.div 
                className="w-2 h-2 bg-cyber-cyan rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-cyber-cyan text-sm font-medium">Analyzing biometrics...</span>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Ready for scan</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default function Index() {
  const [isScanning, setIsScanning] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    const updateScrollY = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', updateScrollY);
    return () => window.removeEventListener('scroll', updateScrollY);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground overflow-hidden relative">
      {/* Dynamic animated background */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
        style={{ y: backgroundY }}
      />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Enhanced Navigation */}
      <motion.nav 
        className="relative z-50 flex justify-between items-center p-6 md:p-8 backdrop-blur-md bg-card/10 border-b border-border/20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center space-x-4"
        >
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
                  "0 0 20px rgba(0, 255, 255, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-cyan bg-clip-text text-transparent">
              PalmPay Secure
            </span>
            <div className="text-xs text-muted-foreground">Future of Identity</div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:flex items-center space-x-8"
        >
          {[
            { to: "/payment", label: "Payment" },
            { to: "/document-locker", label: "Vault" },
            { to: "/accessibility", label: "Settings" },
            { to: "/palmistry", label: "Palmistry" }
          ].map((link, index) => (
            <motion.div key={link.to} whileHover={{ y: -2 }}>
              <Link
                to={link.to}
                className="text-muted-foreground hover:text-cyber-cyan transition-all duration-300 font-medium relative group"
              >
                {link.label}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyber-cyan opacity-0 group-hover:opacity-100"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}

          {/* Authentication Links */}
          <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-border/30">
            <motion.div whileHover={{ y: -2 }}>
              <Link
                to="/signin"
                className="text-muted-foreground hover:text-cyber-cyan transition-all duration-300 font-medium"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2, scale: 1.05 }}>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all duration-300"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Enhanced Hero Section */}
      <motion.div
        ref={heroRef}
        className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-8 lg:px-16 py-16 lg:py-24 relative"
        style={{ y: textY }}
      >
        {/* Left Content */}
        <div className="flex-1 max-w-3xl mb-16 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center space-x-3 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border-2 border-cyber-cyan border-dashed rounded-full"
              />
              <span className="text-cyber-cyan font-medium text-sm tracking-wider uppercase">Revolutionary Biometric Technology</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block"
              >
                The Future of
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent block relative"
              >
                Identity & Payment
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 opacity-20 blur-xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Revolutionary biometric authentication that makes your palm your password. 
              <span className="text-cyber-cyan font-medium"> Secure, instant, and completely cardless</span> - 
              experience the future of digital identity.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Link to="/biometric-setup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-10 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 w-full sm:w-auto text-lg"
                >
                  <Scan className="w-6 h-6" />
                  <span>Start Biometric Setup</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={startScan}
                className="border-2 border-cyber-cyan/40 text-cyber-cyan px-10 py-5 rounded-2xl font-bold hover:bg-cyber-cyan/10 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm w-full sm:w-auto text-lg"
              >
                <Hand className="w-6 h-6" />
                <span>Demo Palm Scan</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-cyber-cyan rounded-full"
                />
              </motion.button>
            </motion.div>

            {/* Enhanced feature highlights */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              {[
                { icon: Zap, text: "< 7 seconds", desc: "Authentication", color: "text-yellow-400" },
                { icon: Shield, text: "Bank-grade", desc: "Security", color: "text-green-400" },
                { icon: Smartphone, text: "100% Digital", desc: "Wallet", color: "text-blue-400" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center space-x-4 p-5 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/40 hover:border-cyber-cyan/50 transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className={`${item.color}`}
                  >
                    <item.icon className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <div className="font-bold text-lg">{item.text}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Content - Enhanced Interactive Palm Scanner */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative"
          >
            <PalmScanner isScanning={isScanning} />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Core Features Section */}
      <motion.section
        id="features"
        className="px-6 md:px-8 lg:px-16 py-24 relative"
      >
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border-2 border-cyber-cyan border-dashed rounded-full"
            />
            <span className="text-cyber-cyan font-medium text-sm tracking-wider uppercase">Core Features</span>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border-2 border-cyber-cyan border-dashed rounded-full"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            Where Technology Feels Like
            <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Pure Magic
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          >
            Every feature is crafted to be visually stunning, intuitively simple, and fundamentally secure.
            Experience the seamless integration of cutting-edge biometrics with everyday convenience.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-8xl mx-auto">
          <FeatureCard
            icon={<BiometricIcon />}
            title="Cinematic Biometric Onboarding"
            subtitle="The Seamless Welcome"
            description="Your first interaction isn't a login form; it's a cinematic experience. Neural network lines converge and trace your unique print in real-time with ethereal neon glow, creating an authentication experience that feels like science fiction."
            functionality="Multi-Modal AI Palm & Face Authentication with Real-time Liveness Detection"
            delay={0}
          />

          <FeatureCard
            icon={<PaymentIcon />}
            title="Voice & Gesture Payments"
            subtitle="The Intuitive Transaction"
            description="Simply show your palm and speak the amount. Your secret gesture confirms with a beautiful ripple effect that washes the screen in calming green. No cards, no codes, just natural human interaction."
            functionality="Voice-activated Payment Initiation with Gesture-based Confirmation PIN"
            delay={0.1}
          />

          <FeatureCard
            icon={<VaultIcon />}
            title="Crystalline Digital Vault"
            subtitle="The Secure Repository"
            description="Your documents are presented as beautiful, glass-morphic digital cards with parallax effects. Each card glows on hover and flips with stunning 3D animation, making document management a delightful experience."
            functionality="Secure, Encrypted Storage for Digital IDs and Cards with OCR Data Extraction"
            delay={0.2}
          />

          <FeatureCard
            icon={<SOSIcon />}
            title="Discreet SOS Mode"
            subtitle="The Guardian Angel"
            description="Emergency gesture triggers the same green ripple as normal payments. Only a tiny icon pulse confirms your silent alert - completely inconspicuous protection that could save your life."
            functionality="Duress Gesture Recognition with Silent SOS Alert and Real-time Geolocation"
            delay={0.3}
          />

          <FeatureCard
            icon={<AccessIcon />}
            title="Universal Access Control"
            subtitle="The Digital Key"
            description="Approaching smart locks or gates, simply raise your palm. Watch the lock icon elegantly rotate and unlock with swift, satisfying confirmation. Your hand becomes your universal key."
            functionality="API Integration with Third-Party Smart Locks and Access Control Systems"
            delay={0.4}
          />

          <FeatureCard
            icon={<AIIcon />}
            title="AI-Powered Personalization"
            subtitle="The Personal Touch"
            description="Personalized greetings on special occasions and interactive palmistry with 3D hand models where corresponding lines light up dynamically. Technology that understands and celebrates you."
            functionality="Personalized Greetings Engine with Interactive AI Chatbot and Palm Analysis"
            delay={0.5}
          />
        </div>
      </motion.section>

      {/* Enhanced Quick Access Navigation */}
      <motion.section
        className="px-6 md:px-8 lg:px-16 py-24 relative"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Experience PalmPay
            <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Right Now
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Jump into any feature and explore the future of digital payments and identity management.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Biometric Setup",
              description: "Complete your palm and face authentication setup with guided assistance",
              icon: Fingerprint,
              link: "/biometric-setup",
              gradient: "from-green-500/30 to-emerald-500/30",
              border: "border-green-400/40",
              buttonGradient: "from-green-500 to-emerald-500",
              glow: "shadow-green-500/20"
            },
            {
              title: "Make Payment",
              description: "Experience voice-activated secure payments with gesture confirmation",
              icon: Zap,
              link: "/payment",
              gradient: "from-cyber-cyan/30 to-blue-500/30",
              border: "border-cyber-cyan/40",
              buttonGradient: "from-cyber-cyan to-blue-500",
              glow: "shadow-cyber-cyan/20"
            },
            {
              title: "Secure Vault",
              description: "Store and manage your digital documents with military-grade encryption",
              icon: Shield,
              link: "/document-locker",
              gradient: "from-purple-500/30 to-violet-500/30",
              border: "border-purple-400/40",
              buttonGradient: "from-purple-500 to-violet-500",
              glow: "shadow-purple-500/20"
            },
            {
              title: "QR Scanner",
              description: "Universal payment compatibility with enhanced security features",
              icon: Camera,
              link: "/qr-scanner",
              gradient: "from-orange-500/30 to-red-500/30",
              border: "border-orange-400/40",
              buttonGradient: "from-orange-500 to-red-500",
              glow: "shadow-orange-500/20"
            },
            {
              title: "Accessibility",
              description: "Multi-language support and accessibility settings for everyone",
              icon: Users,
              link: "/accessibility",
              gradient: "from-blue-500/30 to-indigo-500/30",
              border: "border-blue-400/40",
              buttonGradient: "from-blue-500 to-indigo-500",
              glow: "shadow-blue-500/20"
            },
            {
              title: "AI Palmistry",
              description: "Fun palm reading entertainment with advanced AI analysis",
              icon: Sparkles,
              link: "/palmistry",
              gradient: "from-pink-500/30 to-purple-500/30",
              border: "border-pink-400/40",
              buttonGradient: "from-pink-500 to-purple-500",
              glow: "shadow-pink-500/20"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={item.link}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-8 rounded-3xl bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} cursor-pointer hover:shadow-2xl ${item.glow} transition-all duration-500 relative overflow-hidden`}
                >
                  {/* Hover shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{ transform: "skewX(-20deg)" }}
                  />

                  <div className="flex items-center space-x-5 mb-6 relative z-10">
                    <motion.div 
                      className="w-16 h-16 bg-card/60 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-border/40"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className="w-8 h-8 text-cyber-cyan" />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-cyber-cyan to-blue-400 rounded-full" />
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-8 leading-relaxed relative z-10">
                    {item.description}
                  </p>

                  <motion.div
                    whileHover={{ x: 8 }}
                    className={`inline-flex items-center space-x-3 bg-gradient-to-r ${item.buttonGradient} text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all relative z-10`}
                  >
                    <span>Explore Feature</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Enhanced Trust indicators */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-6 md:px-8 lg:px-16 pb-16"
      >
        <div className="flex flex-wrap justify-center items-center gap-12 text-muted-foreground bg-card/20 backdrop-blur-sm rounded-2xl p-8 border border-border/30">
          {[
            { icon: Lock, text: "End-to-end encrypted" },
            { icon: Shield, text: "Federated learning" },
            { icon: CheckCircle, text: "GDPR compliant" },
            { icon: Globe, text: "Global accessibility" },
            { icon: Star, text: "5-star security rating" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.8 }}
              >
                <item.icon className="w-5 h-5 text-cyber-cyan" />
              </motion.div>
              <span className="text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollY > 100 ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2 text-cyber-cyan"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </div>
  );
}
