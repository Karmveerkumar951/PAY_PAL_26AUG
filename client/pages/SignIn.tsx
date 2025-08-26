import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Hand, Eye, EyeOff, Mail, Lock, ArrowRight, 
  Shield, CheckCircle, AlertCircle, Sparkles, Zap,
  Fingerprint, UserCheck, Globe
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

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'biometric'>('password');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (loginMethod === 'password' && !formData.password) {
      newErrors.password = 'Password is required';
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
      // Redirect to dashboard or wherever appropriate
      window.location.href = '/';
    }, 2000);
  };

  const handleBiometricLogin = () => {
    setIsLoading(true);
    // Simulate biometric authentication
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/';
    }, 3000);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
            <div className="text-xs text-muted-foreground">Welcome Back</div>
          </div>
        </Link>
        
        <Link 
          to="/signup" 
          className="text-muted-foreground hover:text-cyber-cyan transition-all duration-300 font-medium"
        >
          New here? <span className="text-cyber-cyan">Create Account</span>
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Access your secure digital wallet with biometric authentication.
            </p>
          </motion.div>

          {/* Login Method Toggle */}
          <motion.div 
            className="flex bg-card/20 backdrop-blur-sm border border-border/40 rounded-2xl p-2 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                loginMethod === 'password' 
                  ? 'bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </motion.button>
            
            <motion.button
              onClick={() => setLoginMethod('biometric')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                loginMethod === 'biometric' 
                  ? 'bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Fingerprint className="w-4 h-4" />
              <span>Biometric</span>
            </motion.button>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-card/20 backdrop-blur-xl border border-border/40 rounded-3xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {loginMethod === 'password' ? (
                <motion.form 
                  key="password-form"
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
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
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(value) => updateFormData('password', value)}
                    error={errors.password}
                    success={!errors.password && formData.password.length > 0}
                  />

                  {/* Remember me & Forgot password */}
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                      >
                        <input
                          type="checkbox"
                          id="remember"
                          checked={formData.rememberMe}
                          onChange={(e) => updateFormData('rememberMe', e.target.checked)}
                          className="sr-only"
                        />
                        <motion.div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                            formData.rememberMe 
                              ? 'border-cyber-cyan bg-cyber-cyan' 
                              : 'border-border/40 bg-card/20'
                          }`}
                          onClick={() => updateFormData('rememberMe', !formData.rememberMe)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {formData.rememberMe && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CheckCircle className="w-3 h-3 text-dark-slate-950" />
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                      
                      <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        Remember me
                      </label>
                    </motion.div>

                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-cyber-cyan hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

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
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-6 h-6" />
                        <UserCheck className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div 
                  key="biometric-form"
                  className="text-center space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Biometric Scanner */}
                  <motion.div 
                    className="relative max-w-sm mx-auto"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 flex items-center justify-center relative backdrop-blur-sm border border-cyber-cyan/30">
                      <motion.div
                        animate={isLoading ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                        transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-cyber-cyan/40 to-blue-500/40 flex items-center justify-center backdrop-blur-sm"
                      >
                        <motion.div
                          animate={isLoading ? { 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          } : { scale: 1, rotate: 0 }}
                          transition={{ duration: 0.5, repeat: isLoading ? Infinity : 0 }}
                        >
                          <Fingerprint className="w-16 h-16 text-cyber-cyan drop-shadow-lg" />
                        </motion.div>
                      </motion.div>
                      
                      {isLoading && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute inset-0 rounded-full border border-cyber-cyan/30"
                              animate={{ 
                                scale: [1, 2.5, 4],
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
                    </div>

                    {isLoading ? (
                      <motion.p 
                        className="text-cyber-cyan font-medium mt-6 text-lg"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Authenticating biometrics...
                      </motion.p>
                    ) : (
                      <p className="text-muted-foreground mt-6 text-lg">
                        Place your palm on the scanner
                      </p>
                    )}
                  </motion.div>

                  {/* Biometric login button */}
                  <motion.button
                    onClick={handleBiometricLogin}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Biometric Scan</span>
                        <Fingerprint className="w-6 h-6" />
                        <Sparkles className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-muted-foreground text-sm">
                    Don't have biometrics set up?{' '}
                    <Link to="/biometric-setup" className="text-cyber-cyan hover:underline font-medium">
                      Set up now
                    </Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card/20 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social login options */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-border/40 bg-card/10 backdrop-blur-sm hover:bg-card/20 transition-all duration-300"
              >
                <Globe className="w-5 h-5 text-blue-500" />
                <span>Google</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-border/40 bg-card/10 backdrop-blur-sm hover:bg-card/20 transition-all duration-300"
              >
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Microsoft</span>
              </motion.button>
            </div>

            {/* Security badges */}
            <motion.div
              className="flex justify-center items-center space-x-8 mt-8 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Shield, text: "Secure login" },
                { icon: Lock, text: "Encrypted" },
                { icon: CheckCircle, text: "Verified" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Sign up link */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-cyber-cyan hover:underline font-medium">
                Create one now
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
