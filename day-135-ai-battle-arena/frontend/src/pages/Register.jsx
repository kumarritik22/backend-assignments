import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Shield, Swords, User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (successMsg && email) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/auth/check-status?email=${encodeURIComponent(email)}`);
          if (res.data.verified) {
            clearInterval(interval);
            navigate('/login?verified=true');
          }
        } catch (err) {
          console.error("Error checking verification status", err);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [successMsg, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Verify Code does not match Access Code");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        setSuccessMsg({ text: res.data.message });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ backgroundColor: 'var(--accent-surface)', opacity: 0.15 }}></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[100px]" style={{ backgroundColor: 'var(--accent)', opacity: 0.08 }}></div>
      
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
      
      <main className="w-full max-w-sm flex flex-col mt-12 mb-10 z-10 sm:px-0">
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
          <h2 className="text-3xl font-extrabold tracking-tight mb-2 leading-tight" style={{ color: 'var(--text-primary)' }}>Join the Arena</h2>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Create your commander profile to begin.</p>
        </div>
        
        {error && (
          <div 
            className="w-full mb-6 p-4 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', border: `1px solid var(--error-border)` }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div 
            className="w-full mb-6 p-4 rounded-xl text-sm font-medium text-center"
            style={{ backgroundColor: 'var(--info-bg)', color: 'var(--text-primary)', border: `1px solid var(--info-border)` }}
          >
            <p className="mb-2">{successMsg.text}</p>
          </div>
        )}
        
        {/* Registration Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--sidebar-label)' }}>Commander Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors" style={{ color: 'var(--text-secondary)' }}>
                <User className="w-5 h-5" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 border-0 rounded-xl focus:outline-none transition-all" 
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                placeholder="e.g. John 'The Blade' Smith" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--sidebar-label)' }}>Data Stream Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors" style={{ color: 'var(--text-secondary)' }}>
                <Mail className="w-5 h-5" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 border-0 rounded-xl focus:outline-none transition-all" 
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                placeholder="commander@gmail.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--sidebar-label)' }}>PASSWORD</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors" style={{ color: 'var(--text-secondary)' }}>
                <Lock className="w-5 h-5" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 border-0 rounded-xl focus:outline-none transition-all" 
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                placeholder="••••••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--sidebar-label)' }}>Verify Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors" style={{ color: 'var(--text-secondary)' }}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 border-0 rounded-xl focus:outline-none transition-all" 
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                placeholder="••••••••••••" 
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="pt-4 flex flex-col gap-4">
            <button 
              className={`w-full h-14 rounded-full flex items-center justify-center gap-3 transition-transform ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
              style={{ 
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-surface) 100%)', 
                color: 'var(--accent-text)' 
              }}
              type="submit"
              disabled={loading}
            >
              <span className="font-extrabold tracking-tight">{loading ? 'Initializing...' : 'Initialize Account'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-grow" style={{ backgroundColor: 'var(--border)', opacity: 0.5 }}></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>Deployment Protocol</span>
              <div className="h-[1px] flex-grow" style={{ backgroundColor: 'var(--border)', opacity: 0.5 }}></div>
            </div>
            
            <div className="flex justify-center">
              <Link className="text-sm font-medium transition-colors group" style={{ color: 'var(--text-secondary)' }} to="/login">
                Already a commander? <span className="font-bold ml-1" style={{ color: 'var(--accent)' }}>Log In</span>
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
