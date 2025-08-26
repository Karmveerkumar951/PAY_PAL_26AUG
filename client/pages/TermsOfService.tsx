import { motion } from "framer-motion";
import { Hand, Shield, Scale, FileText, Users, AlertTriangle, ArrowLeft, CheckCircle } from "lucide-react";
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

export default function TermsOfService() {
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
            <div className="text-xs text-muted-foreground">Terms of Service</div>
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
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-400/40"
              animate={{ 
                boxShadow: [
                  "0 0 30px rgba(168, 85, 247, 0.3)",
                  "0 0 60px rgba(168, 85, 247, 0.6)",
                  "0 0 30px rgba(168, 85, 247, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Scale className="w-10 h-10 text-purple-400" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Welcome to PalmPay Secure. These terms govern your use of our biometric payment platform and services.
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
            {/* Section 1: Acceptance of Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  By accessing or using PalmPay Secure ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>
                <p>
                  <strong className="text-foreground">Age Requirement:</strong> You must be at least 18 years old to use PalmPay Secure. By using the Service, you represent and warrant that you meet this age requirement.
                </p>
                <p>
                  <strong className="text-foreground">Account Registration:</strong> To use our services, you must create an account and provide accurate, complete information. You are responsible for maintaining the security of your account.
                </p>
              </div>
            </section>

            {/* Section 2: Service Description */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Hand className="w-6 h-6 text-cyber-cyan" />
                <h2 className="text-2xl font-bold text-cyber-cyan">Service Description</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Biometric Authentication:</strong> PalmPay Secure provides contactless payment services using palm print, facial recognition, and voice authentication technologies.
                </p>
                <p>
                  <strong className="text-foreground">Payment Processing:</strong> We facilitate secure transactions between users and merchants through our biometric authentication platform.
                </p>
                <p>
                  <strong className="text-foreground">Digital Wallet:</strong> The Service includes secure storage and management of digital documents and payment methods.
                </p>
                <p>
                  <strong className="text-foreground">Emergency Features:</strong> Our platform includes SOS functionality for user safety in emergency situations.
                </p>
              </div>
            </section>

            {/* Section 3: User Responsibilities */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-blue-400">User Responsibilities</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Accurate Information:</strong> You must provide and maintain accurate, current information in your account and for all transactions.
                </p>
                <p>
                  <strong className="text-foreground">Authorized Use:</strong> You may only use the Service for lawful purposes and in accordance with these Terms.
                </p>
                <p>
                  <strong className="text-foreground">Device Security:</strong> You are responsible for maintaining the security of devices used to access the Service.
                </p>
                <p>
                  <strong className="text-foreground">Biometric Data:</strong> You consent to the collection and use of your biometric data as described in our Privacy Policy.
                </p>
                <div className="bg-orange-500/10 border border-orange-400/30 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-orange-400 font-semibold mb-2">Important Security Notice:</p>
                      <p className="text-sm">Never share your account credentials or attempt to bypass biometric authentication measures. Report any suspicious activity immediately.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Payment Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-400">Payment Terms</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Transaction Authorization:</strong> By completing a biometric authentication, you authorize the requested payment transaction.
                </p>
                <p>
                  <strong className="text-foreground">Fees:</strong> PalmPay Secure may charge fees for certain services. All applicable fees will be clearly disclosed before transaction completion.
                </p>
                <p>
                  <strong className="text-foreground">Disputes:</strong> For transaction disputes, contact us within 60 days of the transaction. We will investigate and resolve disputes according to applicable payment network rules.
                </p>
                <p>
                  <strong className="text-foreground">Refunds:</strong> Refunds are processed according to merchant policies and payment network rules. We do not guarantee refunds for completed transactions.
                </p>
              </div>
            </section>

            {/* Section 5: Privacy and Data */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">Privacy and Data Protection</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Privacy Policy:</strong> Your privacy is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  <strong className="text-foreground">Biometric Data Security:</strong> We employ federated learning and end-to-end encryption to protect your biometric information.
                </p>
                <p>
                  <strong className="text-foreground">Data Retention:</strong> We retain your data only as long as necessary for service provision and legal compliance.
                </p>
                <p>
                  <strong className="text-foreground">Third-Party Integration:</strong> We may integrate with trusted third-party services for payment processing and security enhancement.
                </p>
              </div>
            </section>

            {/* Section 6: Limitations and Disclaimers */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-orange-400">Limitations and Disclaimers</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee uninterrupted service availability.
                </p>
                <p>
                  <strong className="text-foreground">Biometric Accuracy:</strong> While our biometric systems are highly accurate, we cannot guarantee 100% accuracy in all conditions.
                </p>
                <p>
                  <strong className="text-foreground">Limitation of Liability:</strong> Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages.
                </p>
                <p>
                  <strong className="text-foreground">Force Majeure:</strong> We are not responsible for delays or failures due to circumstances beyond our control.
                </p>
              </div>
            </section>

            {/* Section 7: Termination */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-red-400">Termination</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Account Termination:</strong> You may terminate your account at any time through your account settings or by contacting support.
                </p>
                <p>
                  <strong className="text-foreground">Service Termination:</strong> We may terminate or suspend accounts that violate these Terms or for business reasons with appropriate notice.
                </p>
                <p>
                  <strong className="text-foreground">Data Deletion:</strong> Upon termination, your account data will be deleted according to our data retention policies and legal requirements.
                </p>
                <p>
                  <strong className="text-foreground">Survival:</strong> Certain provisions of these Terms will survive termination, including privacy obligations and limitation of liability.
                </p>
              </div>
            </section>

            {/* Section 8: Contact Information */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <Hand className="w-6 h-6 text-cyber-cyan" />
                <h2 className="text-2xl font-bold text-cyber-cyan">Contact Information</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  For questions about these Terms of Service or our services, please contact us:
                </p>
                <div className="bg-card/30 rounded-2xl p-6 border border-border/40">
                  <div className="space-y-2">
                    <p><strong className="text-foreground">Email:</strong> legal@palmpaysecure.com</p>
                    <p><strong className="text-foreground">Support:</strong> support@palmpaysecure.com</p>
                    <p><strong className="text-foreground">Address:</strong> PalmPay Secure, Inc.<br />
                    123 Biometric Avenue<br />
                    Future City, FC 12345</p>
                    <p><strong className="text-foreground">Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (PST)</p>
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
              <Link to="/privacy" className="hover:text-cyber-cyan transition-colors">Privacy Policy</Link>
              <Link to="/signup" className="hover:text-cyber-cyan transition-colors">Back to Sign Up</Link>
              <Link to="/" className="hover:text-cyber-cyan transition-colors">Home</Link>
            </div>
            
            <p className="text-xs text-muted-foreground">
              © 2024 PalmPay Secure. All rights reserved. Your security is our commitment.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
