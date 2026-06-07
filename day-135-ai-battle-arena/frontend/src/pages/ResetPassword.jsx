import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Swords, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  // Guard: if no token in URL, show an error immediately
  if (!token) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-8"
        style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
      >
        <div className="max-w-md w-full text-center">
          <div
            className="p-5 rounded-xl text-sm font-medium mb-6"
            style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}
          >
            <p className="font-bold text-base mb-1">Invalid Reset Link</p>
            <p>This password reset link is invalid or missing a token.</p>
          </div>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            Request a new reset link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Header */}
      <header className="w-full flex items-center fixed top-0 left-0 px-6 py-4 z-50">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: 'var(--accent-surface)', color: 'var(--accent)' }}
          >
            <Swords size={20} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            AI Battle <span className="font-medium" style={{ color: 'var(--accent)' }}>Arena</span>
          </h1>
        </div>
      </header>

      <main className="relative w-full max-w-md px-8 py-12 flex flex-col items-center z-10">
        {/* Background Ambient */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'var(--accent)', opacity: 0.08 }}></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'var(--accent-surface)', opacity: 0.12 }}></div>

        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)', opacity: 0.2 }}></div>
            <div
              className="absolute inset-2 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-elevated)', boxShadow: '0 16px 32px var(--shadow-heavy)' }}
            >
              <Swords className="w-10 h-10" strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            New Password
          </h1>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Choose a strong new password for your account.
          </p>
        </div>

        {error && (
          <div
            className="w-full mb-6 p-4 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}
          >
            {error}
          </div>
        )}

        {success ? (
          <div className="w-full text-center">
            <div
              className="w-full mb-6 p-5 rounded-xl text-sm"
              style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)' }}
            >
              <p className="font-bold text-base mb-2">Password Reset Successful!</p>
              <p>Your password has been updated. Redirecting you to login in a moment...</p>
            </div>
          </div>
        ) : (
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <input
                  id="new-password"
                  className="w-full h-14 pl-12 pr-12 border-none rounded-xl focus:outline-none transition-all duration-300"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <ShieldCheck className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <input
                  id="confirm-new-password"
                  className="w-full h-14 pl-12 pr-4 border-none rounded-xl focus:outline-none transition-all duration-300"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              id="reset-password-btn"
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-surface) 100%)',
                color: 'var(--accent-text)',
                boxShadow: loading ? 'none' : '0 8px 24px var(--accent-glow)',
              }}
            >
              <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
              {!loading && <ShieldCheck className="w-5 h-5" />}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default ResetPassword;
