import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, LogIn, Swords } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const isVerified = searchParams.get('verified') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Header / Brand Logo */}
      <header className="w-full flex justify-between items-center fixed top-0 left-0 px-6 py-4 z-50">
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
        {/* Background Ambient Element */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'var(--accent)', opacity: 0.08 }}></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'var(--accent-surface)', opacity: 0.12 }}></div>
        
        {/* Hero Branding Section */}
        <div className="mb-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)', opacity: 0.2 }}></div>
            <div 
              className="absolute inset-2 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-elevated)', boxShadow: `0 16px 32px var(--shadow-heavy)` }}
            >
              <Swords className="w-10 h-10" strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>Welcome Back</h1>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Enter your credentials to enter the arena.</p>
        </div>
        
        {error && (
          <div 
            className="w-full mb-6 p-4 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', border: `1px solid var(--error-border)` }}
          >
            {error}
          </div>
        )}
        
        {isVerified && (
          <div 
            className="w-full mb-6 p-4 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info-text)', border: `1px solid var(--info-border)` }}
          >
            Email verified successfully! You can now log in.
          </div>
        )}
        
        {/* Form Section */}
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 transition-colors" style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 border-none rounded-xl focus:outline-none transition-all duration-300" 
                style={{ 
                  backgroundColor: 'var(--bg-input)', 
                  color: 'var(--text-primary)',
                  boxShadow: 'none'
                }}
                placeholder="commander@gmail.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>PASSWORD</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 transition-colors" style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 border-none rounded-xl focus:outline-none transition-all duration-300" 
                style={{ 
                  backgroundColor: 'var(--bg-input)', 
                  color: 'var(--text-primary)'
                }}
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 transition-colors" />
                ) : (
                  <Eye className="w-5 h-5 transition-colors" />
                )}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <Link className="text-xs font-semibold transition-colors" style={{ color: 'var(--accent)', opacity: 0.7 }} to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
          
          {/* Primary Action */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
            style={{ 
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-surface) 100%)', 
              color: 'var(--accent-text)',
              boxShadow: loading ? 'none' : `0 8px 24px var(--accent-glow)` 
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Log In'}</span>
            {!loading && <LogIn className="w-5 h-5" />}
          </button>
        </form>
        
        {/* Secondary Action */}
        <div className="mt-10 text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account? 
            <Link className="font-bold hover:underline decoration-2 underline-offset-4 ml-1" style={{ color: 'var(--accent)' }} to="/register">Sign up</Link>
          </p>
        </div>
        
      </main>
    </div>
  );
};

export default Login;
