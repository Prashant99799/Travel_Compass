import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Loader2 } from 'lucide-react';

/**
 * Legacy Verify Email Page - Redirects to home
 * With Clerk, email verification is handled automatically
 */
export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clerk handles email verification automatically
    // Redirect to home page
    navigate('/', { replace: true });
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Compass className="w-7 h-7 text-white" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-600" />
        <p className="mt-4 text-slate-600">Redirecting...</p>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
