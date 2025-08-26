import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Hand,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  Key,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

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

// Enhanced input component
const FormInput = ({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  success,
}: {
  icon: any;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`relative flex items-center p-4 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
          error
            ? "border-red-400/50 bg-red-500/10"
            : success
              ? "border-green-400/50 bg-green-500/10"
              : isFocused
                ? "border-cyber-cyan/60 bg-cyber-cyan/5"
                : "border-border/40 bg-card/20"
        }`}
      >
        <Icon
          className={`w-5 h-5 mr-3 transition-colors ${
            error
              ? "text-red-400"
              : success
                ? "text-green-400"
                : isFocused
                  ? "text-cyber-cyan"
                  : "text-muted-foreground"
          }`}
        />

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-lg"
        />

        {success && <CheckCircle className="w-5 h-5 ml-2 text-green-400" />}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 mt-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "sent" | "reset">("email");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("sent");
    }, 2000);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError("");
  };

  if (step === "sent") {
    return <EmailSentStep email={email} onReset={() => setStep("email")} />;
  }

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
              Password Recovery
            </div>
          </div>
        </Link>

        <Link
          to="/signin"
          className="flex items-center space-x-2 text-muted-foreground hover:text-cyber-cyan transition-all duration-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6 py-12">
        <motion.div
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-orange-400/40"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(249, 115, 22, 0.3)",
                  "0 0 60px rgba(249, 115, 22, 0.6)",
                  "0 0 30px rgba(249, 115, 22, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Key className="w-10 h-10 text-orange-400" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
                Forgot Password?
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              No worries! Enter your email address and we'll send you a secure
              reset link.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-card/20 backdrop-blur-xl border border-border/40 rounded-3xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                icon={Mail}
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                error={error}
                success={!error && email.length > 0 && validateEmail(email)}
              />

              <motion.button
                type="submit"
                disabled={isLoading || !email.trim()}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-6 h-6" />
                    <Mail className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Additional Options */}
            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card/20 text-muted-foreground">
                    Or try these options
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Link to="/biometric-setup">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl border border-border/40 bg-card/10 backdrop-blur-sm hover:bg-card/20 transition-all duration-300"
                  >
                    <Shield className="w-5 h-5 text-cyber-cyan" />
                    <span>Use Biometric Login</span>
                  </motion.button>
                </Link>

                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl border border-border/40 bg-card/10 backdrop-blur-sm hover:bg-card/20 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span>Create New Account</span>
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Security note */}
            <motion.div
              className="mt-8 p-4 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-cyber-cyan mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-cyber-cyan font-semibold mb-1">
                    Security Notice
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Reset links expire in 15 minutes for your security. If you
                    don't receive an email, check your spam folder.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer links */}
          <motion.div
            className="text-center mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <Link
                to="/signin"
                className="hover:text-cyber-cyan transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hover:text-cyber-cyan transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/privacy"
                className="hover:text-cyber-cyan transition-colors"
              >
                Privacy
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Email Sent Step Component
const EmailSentStep = ({
  email,
  onReset,
}: {
  email: string;
  onReset: () => void;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden flex items-center justify-center px-6">
    <FloatingParticles count={15} />

    <motion.div
      className="max-w-lg w-full text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-500/30 to-cyan-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-400/40"
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
          <CheckCircle className="w-12 h-12 text-green-400" />
        </motion.div>
      </motion.div>

      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
          Check Your Email
        </span>
      </h2>

      <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
        We've sent a password reset link to
      </p>
      <p className="text-cyber-cyan font-medium text-lg mb-8">{email}</p>

      <p className="text-muted-foreground mb-12">
        Click the link in the email to reset your password. The link will expire
        in 15 minutes.
      </p>

      <div className="space-y-4">
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300"
        >
          <span>Send Another Email</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <Link to="/signin">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full border-2 border-cyber-cyan/40 text-cyber-cyan py-4 rounded-2xl font-bold hover:bg-cyber-cyan/10 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Sign In</span>
          </motion.button>
        </Link>
      </div>

      <p className="text-muted-foreground text-sm mt-8">
        Didn't receive the email? Check your spam folder or contact support.
      </p>
    </motion.div>
  </div>
);
