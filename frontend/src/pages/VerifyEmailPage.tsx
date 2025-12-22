import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Compass, ArrowRight, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { useAuth, getVerificationToken } from '../context';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, isLoading, isAuthenticated } = useAuth();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [demoToken, setDemoToken] = useState<string | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Check for demo token
  useEffect(() => {
    const pendingEmail = localStorage.getItem('compass_pending_verification');
    if (pendingEmail) {
      const token = getVerificationToken(pendingEmail);
      setDemoToken(token);
    }
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const chars = value.slice(0, 6).split('');
      const newCode = [...code];
      chars.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    
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
  
  const handleVerify = async () => {
    setError('');
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter the complete verification code');
      return;
    }
    
    const result = await verifyEmail(fullCode);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } else {
      setError(result.message);
    }
  };
  
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    const result = await resendVerification();
    
    if (result.success) {
      setResendCooldown(60);
      // Update demo token
      const pendingEmail = localStorage.getItem('compass_pending_verification');
      if (pendingEmail) {
        const token = getVerificationToken(pendingEmail);
        setDemoToken(token);
      }
    }
  };
  
  const fillDemoToken = () => {
    if (demoToken) {
      const chars = demoToken.slice(0, 6).split('');
      setCode(chars.concat(Array(6 - chars.length).fill('')));
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h1>
          <p className="text-slate-600 mb-6">Redirecting you to the app...</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Compass className="w-7 h-7 text-white" />
            </div>
          </Link>
        </div>
        
        <Card padding="lg" className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-slate-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
          <p className="text-slate-600 mb-8">
            We sent a verification code to your email. Enter it below to verify your account.
          </p>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 text-left">{error}</p>
            </motion.div>
          )}
          
          {/* Code Input */}
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
              />
            ))}
          </div>
          
          <Button 
            onClick={handleVerify}
            className="w-full mb-4" 
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Verify Email
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <span>Didn't receive the code?</span>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`font-semibold ${
                resendCooldown > 0 
                  ? 'text-slate-400 cursor-not-allowed' 
                  : 'text-slate-900 hover:underline'
              }`}
            >
              {resendCooldown > 0 ? (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {resendCooldown}s
                </span>
              ) : (
                'Resend'
              )}
            </button>
          </div>
          
          {/* Demo Helper */}
          {demoToken && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">Demo Mode: Your verification code is</p>
              <button
                onClick={fillDemoToken}
                className="font-mono text-lg font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {demoToken.slice(0, 6)}
              </button>
              <p className="text-xs text-slate-400 mt-2">Click to auto-fill</p>
            </div>
          )}
        </Card>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-slate-900 hover:underline">
            ← Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
