import { motion } from "framer-motion";
import { Hand, Shield, Lock, Eye, Database, Globe, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Floating particles component
const FloatingParticles = ({ count = 10 }: { count?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gradient-to-r from-cyber-cyan to-blue-400 rounded-full opacity-30"
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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Floating particles */}
      <FloatingParticles count={15} />
      
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
            <div className="text-xs text-muted-foreground">Privacy Policy</div>
          </div>
        </Link>
        
        <Link 
          to="/signup" 
          className="flex items-center space-x-2 text-muted-foreground hover:text-cyber-cyan transition-all duration-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign Up</span>
        </Link>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-cyber-cyan/30 to-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyber-cyan/40"
              animate={{ 
                boxShadow: [
                  "0 0 30px rgba(0, 255, 255, 0.3)",
                  "0 0 60px rgba(0, 255, 255, 0.6)",
                  "0 0 30px rgba(0, 255, 255, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-10 h-10 text-cyber-cyan" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your privacy and security are our top priorities. Learn how we protect your biometric data and personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            className="bg-card/20 backdrop-blur-xl border border-border/40 rounded-3xl p-8 md:p-12 space-y-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Section 1: Information We Collect */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-6 h-6 text-cyber-cyan" />
                <h2 className="text-2xl font-bold text-cyber-cyan">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Biometric Data:</strong> We collect palm print patterns, facial recognition data, and voice prints solely for authentication purposes. This data is encrypted and stored locally on your device using federated learning technology.
                </p>
                <p>
                  <strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, and payment preferences to facilitate secure transactions and account management.
                </p>
                <p>
                  <strong className="text-foreground">Transaction Data:</strong> Payment history, merchant information, and transaction amounts for security monitoring and fraud prevention.
                </p>
                <p>
                  <strong className="text-foreground">Device Information:</strong> Device identifiers, operating system, and security features to ensure compatibility and enhance security.
                </p>
              </div>
            </section>

            {/* Section 2: How We Use Your Information */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Authentication:</strong> Biometric data is used exclusively for user authentication and access control to your account and payment services.
                </p>
                <p>
                  <strong className="text-foreground">Transaction Processing:</strong> Personal and transaction data facilitates secure payment processing and merchant communications.
                </p>
                <p>
                  <strong className="text-foreground">Security & Fraud Prevention:</strong> We analyze patterns to detect and prevent unauthorized access and fraudulent activities.
                </p>
                <p>
                  <strong className="text-foreground">Service Improvement:</strong> Aggregated, anonymized data helps us enhance our services and develop new security features.
                </p>
              </div>
            </section>

            {/* Section 3: Data Protection */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-400">Data Protection & Security</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Federated Learning:</strong> Your biometric templates never leave your device. Only encrypted model updates are shared for system improvements.
                </p>
                <p>
                  <strong className="text-foreground">End-to-End Encryption:</strong> All data transmissions use bank-grade AES-256 encryption with perfect forward secrecy.
                </p>
                <p>
                  <strong className="text-foreground">Zero-Knowledge Architecture:</strong> We cannot access your raw biometric data, even with administrative privileges.
                </p>
                <p>
                  <strong className="text-foreground">Secure Storage:</strong> Personal data is encrypted at rest using industry-standard security protocols and stored in certified secure facilities.
                </p>
              </div>
            </section>

            {/* Section 4: Data Sharing */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-orange-400">Data Sharing & Disclosure</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">We Never Sell Your Data:</strong> Your personal information and biometric data are never sold, rented, or shared with third parties for marketing purposes.
                </p>
                <p>
                  <strong className="text-foreground">Payment Processing:</strong> Minimal transaction data is shared with payment processors and banks as required for transaction completion.
                </p>
                <p>
                  <strong className="text-foreground">Legal Compliance:</strong> We may disclose information when required by law, court order, or to protect our users' safety and security.
                </p>
                <p>
                  <strong className="text-foreground">Emergency Situations:</strong> In case of SOS activation, location and emergency contact information may be shared with authorities.
                </p>
              </div>
            </section>

            {/* Section 5: Your Rights */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-blue-400">Your Privacy Rights</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Access & Portability:</strong> Request copies of your personal data in a machine-readable format.
                </p>
                <p>
                  <strong className="text-foreground">Correction & Updates:</strong> Update or correct your personal information at any time through your account settings.
                </p>
                <p>
                  <strong className="text-foreground">Deletion:</strong> Request deletion of your account and associated data. Biometric templates are automatically deleted from your device.
                </p>
                <p>
                  <strong className="text-foreground">Consent Withdrawal:</strong> Withdraw consent for data processing at any time, though this may limit service functionality.
                </p>
              </div>
            </section>

            {/* Section 6: Contact */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Hand className="w-6 h-6 text-cyber-cyan" />
                <h2 className="text-2xl font-bold text-cyber-cyan">Contact Us</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  For privacy-related questions, concerns, or requests, please contact our Data Protection Officer:
                </p>
                <div className="bg-card/30 rounded-2xl p-6 border border-border/40">
                  <div className="space-y-2">
                    <p><strong className="text-foreground">Email:</strong> privacy@palmpaysecure.com</p>
                    <p><strong className="text-foreground">Address:</strong> PalmPay Secure, Inc.<br />
                    123 Biometric Avenue<br />
                    Future City, FC 12345</p>
                    <p><strong className="text-foreground">Response Time:</strong> We respond to all privacy requests within 30 days.</p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-cyber-cyan transition-colors">Terms of Service</Link>
              <Link to="/signup" className="hover:text-cyber-cyan transition-colors">Back to Sign Up</Link>
              <Link to="/" className="hover:text-cyber-cyan transition-colors">Home</Link>
            </div>
            
            <p className="text-xs text-muted-foreground">
              © 2024 PalmPay Secure. All rights reserved. Built with privacy by design.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
