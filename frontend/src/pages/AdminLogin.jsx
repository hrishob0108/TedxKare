import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useApi } from '../hooks/useApi';
import { adminAPI } from '../utils/api';
import { storage } from '../utils/helpers';

// ==================== ADMIN LOGIN PAGE ====================
const AdminLogin = () => {
  const navigate = useNavigate();
  const { loading, error, request, clearError } = useApi();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = async (values) => {
    try {
      const response = await request(() => adminAPI.login(values.email, values.password));

      // Save token and admin info
      storage.setAdminToken(response.token);
      storage.setAdminInfo(response.admin);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const form = useForm(initialValues, onSubmit);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ted-red/10 via-transparent to-ted-red/5 opacity-30"></div>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-ted-red hover:text-red-600 font-semibold flex items-center gap-2 transition-colors"
      >
        ← Back to Home
      </button>

      {/* Login Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">
            TEDx<span className="text-ted-red">KARE</span>
          </h1>
          <p className="text-gray-400">Admin Dashboard</p>
        </motion.div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-sm">Login Failed</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-200 font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Login Form */}
        <motion.form
          variants={itemVariants}
          onSubmit={form.handleSubmit}
          className="card space-y-6"
        >
          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="admin@tedxkare.com"
              className="input-field"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={loading}
              required
              autoComplete="email"
            />
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                className="input-field pr-12"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={loading}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ted-red transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </motion.div>

          {/* Remember Me */}
          <motion.div variants={itemVariants} className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-400 cursor-pointer">
              Remember me
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Logging in...' : 'Login to Dashboard'}
          </motion.button>
        </motion.form>

        {/* Demo Credentials */}
        <motion.div variants={itemVariants} className="mt-8 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-2 font-semibold">Demo Credentials:</p>
          <p className="text-xs text-gray-500">
            Email: <span className="text-gray-300">admin@tedxkare.com</span>
          </p>
          <p className="text-xs text-gray-500">
            Password: <span className="text-gray-300">use the one you set up</span>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p variants={itemVariants} className="text-center text-gray-400 text-xs mt-8">
          This dashboard is for authorized TEDxKARE team members only.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
