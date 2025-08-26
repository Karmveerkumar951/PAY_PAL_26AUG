import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { 
  Hand, Eye, EyeOff, Mail, User, Lock, ArrowRight, 
  Shield, CheckCircle, AlertCircle, Sparkles, Zap,
  Phone, Calendar, MapPin, Globe
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

// Enhanced input component
const FormInput = ({ 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error,
  success 
}: {
  icon: any;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`relative flex items-center p-4 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
        error 
          ? 'border-red-400/50 bg-red-500/10' 
          : success 
          ? 'border-green-400/50 bg-green-500/10'
          : isFocused 
          ? 'border-cyber-cyan/60 bg-cyber-cyan/5' 
          : 'border-border/40 bg-card/20'
      }`}>
        <Icon className={`w-5 h-5 mr-3 transition-colors ${
          error 
            ? 'text-red-400' 
            : success 
            ? 'text-green-400'
            : isFocused 
            ? 'text-cyber-cyan' 
            : 'text-muted-foreground'
        }`} />
        
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-lg"
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-muted-foreground hover:text-cyber-cyan transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {success && (
          <CheckCircle className="w-5 h-5 ml-2 text-green-400" />
        )}
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

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('verification');
    }, 2000);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (step === 'verification') {
    return <VerificationStep onSuccess={() => setStep('success')} email={formData.email} />;
  }

  if (step === 'success') {
    return <SuccessStep />;
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
            <div className="text-xs text-muted-foreground">Join the Future</div>
          </div>
        </Link>
        
        <Link 
          to="/signin" 
          className="text-muted-foreground hover:text-cyber-cyan transition-all duration-300 font-medium"
        >
          Already have an account? <span className="text-cyber-cyan">Sign In</span>
        </Link>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6 py-12">
        <motion.div 
          className="max-w-2xl w-full"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Create Account
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join the future of secure, contactless payments. Your palm is your password.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-card/20 backdrop-blur-xl border border-border/40 rounded-3xl p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  icon={User}
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(value) => updateFormData('firstName', value)}
                  error={errors.firstName}
                  success={!errors.firstName && formData.firstName.length > 0}
                />
                
                <FormInput
                  icon={User}
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(value) => updateFormData('lastName', value)}
                  error={errors.lastName}
                  success={!errors.lastName && formData.lastName.length > 0}
                />
              </div>

              {/* Contact fields */}
              <FormInput
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(value) => updateFormData('email', value)}
                error={errors.email}
                success={!errors.email && formData.email.length > 0}
              />

              <FormInput
                icon={Phone}
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(value) => updateFormData('phone', value)}
                error={errors.phone}
                success={!errors.phone && formData.phone.length > 0}
              />

              {/* Password fields */}
              <FormInput
                icon={Lock}
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(value) => updateFormData('password', value)}
                error={errors.password}
                success={!errors.password && formData.password.length >= 8}
              />

              <FormInput
                icon={Lock}
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(value) => updateFormData('confirmPassword', value)}
                error={errors.confirmPassword}
                success={!errors.confirmPassword && formData.confirmPassword === formData.password}
              />

              {/* Terms checkbox */}
              <motion.div 
                className="flex items-start space-x-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                    className="sr-only"
                  />
                  <motion.div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                      formData.agreeToTerms 
                        ? 'border-cyber-cyan bg-cyber-cyan' 
                        : 'border-border/40 bg-card/20'
                    }`}
                    onClick={() => updateFormData('agreeToTerms', !formData.agreeToTerms)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {formData.agreeToTerms && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className="w-4 h-4 text-dark-slate-950" />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
                
                <label htmlFor="terms" className="text-muted-foreground text-sm leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-cyber-cyan hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-cyber-cyan hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>

              {errors.agreeToTerms && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.agreeToTerms}</span>
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-dark-slate-950 border-t-transparent rounded-full"
                    />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-6 h-6" />
                    <Sparkles className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Security badges */}
            <motion.div
              className="flex justify-center items-center space-x-8 mt-8 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Shield, text: "Bank-grade security" },
                { icon: Lock, text: "Encrypted data" },
                { icon: Globe, text: "GDPR compliant" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Verification Step Component
const VerificationStep = ({ onSuccess, email }: { onSuccess: () => void; email: string }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden flex items-center justify-center px-6">
      <FloatingParticles count={15} />
      
      <motion.div 
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-cyber-cyan/30 to-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyber-cyan/40"
          animate={{ 
            boxShadow: [
              "0 0 30px rgba(0, 255, 255, 0.3)",
              "0 0 60px rgba(0, 255, 255, 0.6)",
              "0 0 30px rgba(0, 255, 255, 0.3)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Mail className="w-12 h-12 text-cyber-cyan" />
        </motion.div>

        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Check Your Email
          </span>
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          We've sent a verification code to <span className="text-cyber-cyan font-medium">{email}</span>
        </p>

        {/* Code input */}
        <div className="flex justify-center space-x-3 mb-8">
          {code.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-bold bg-card/20 backdrop-blur-sm border border-border/40 rounded-2xl focus:border-cyber-cyan focus:outline-none transition-all"
              whileFocus={{ scale: 1.05 }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleVerify}
          disabled={code.join('').length !== 6 || isLoading}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-dark-slate-950 border-t-transparent rounded-full"
              />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Verify Account</span>
              <CheckCircle className="w-5 h-5" />
            </>
          )}
        </motion.button>

        <p className="text-muted-foreground text-sm mt-6">
          Didn't receive the code?{' '}
          <button className="text-cyber-cyan hover:underline font-medium">
            Resend Code
          </button>
        </p>
      </motion.div>
    </div>
  );
};

// Success Step Component
const SuccessStep = () => (
  <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden flex items-center justify-center px-6">
    <FloatingParticles count={20} />
    
    <motion.div 
      className="max-w-2xl w-full text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-500/30 to-cyan-500/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-400/40"
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
              "0 0 30px rgba(34, 197, 94, 0.3)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <CheckCircle className="w-16 h-16 text-green-400" />
        </motion.div>
      </motion.div>

      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
          Account Created!
        </span>
      </h1>
      
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
        Welcome to the future of secure payments. Let's set up your biometric profile to complete your registration.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link to="/biometric-setup">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-12 py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-cyber-cyan/30 transition-all duration-300 text-lg"
          >
            <span>Set Up Biometrics</span>
            <ArrowRight className="w-6 h-6" />
            <Zap className="w-6 h-6" />
          </motion.button>
        </Link>
        
        <Link to="/signin">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-cyber-cyan/40 text-cyber-cyan px-12 py-5 rounded-2xl font-bold hover:bg-cyber-cyan/10 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm text-lg"
          >
            <span>Sign In Instead</span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  </div>
);
