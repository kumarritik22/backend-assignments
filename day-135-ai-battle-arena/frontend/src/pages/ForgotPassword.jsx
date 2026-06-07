import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Swords, Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Reset Password
          </h1>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Enter your email and we'll send you a secure reset link.
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
              className="w-full mb-8 p-5 rounded-xl text-sm"
              style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)' }}
            >
              <p className="font-bold text-base mb-2">Check your inbox!</p>
              <p>
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Also check your spam folder.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        ) : (
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <input
                  id="forgot-email"
                  className="w-full h-14 pl-12 pr-4 border-none rounded-xl focus:outline-none transition-all duration-300"
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  placeholder="commander@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              id="send-reset-link-btn"
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-surface) 100%)',
                color: 'var(--accent-text)',
                boxShadow: loading ? 'none' : '0 8px 24px var(--accent-glow)',
              }}
            >
              <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
              {!loading && <Send className="w-5 h-5" />}
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

export default ForgotPassword;
