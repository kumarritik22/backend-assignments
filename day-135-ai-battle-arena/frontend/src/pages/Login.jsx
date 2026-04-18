import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
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
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
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
    <div className="bg-[#060e20] text-[#dee5ff] min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Header / Brand Logo */}
      <header className="w-full flex justify-between items-center fixed top-0 left-0 px-6 py-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#004c69] flex items-center justify-center text-[#7bd0ff] shadow-md">
            <Swords size={20} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tighter text-[#dee5ff]">
            AI Battle <span className="font-medium text-[#7bd0ff]">Arena</span>
          </h1>
        </div>
      </header>

      <main className="relative w-full max-w-md px-8 py-12 flex flex-col items-center z-10">
        {/* Background Ambient Element */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#7bd0ff]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#002867]/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Hero Branding Section */}
        <div className="mb-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-[#7bd0ff]/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-[#00225a] rounded-full flex items-center justify-center shadow-[0_16px_32px_rgba(0,0,0,0.4)]">
              <Swords className="text-[#7bd0ff] w-10 h-10" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-[#dee5ff] text-4xl font-extrabold tracking-tight mb-3">Welcome Back</h1>
          <p className="text-[#939eb5] text-sm font-medium leading-relaxed">Enter your credentials to enter the arena.</p>
        </div>
        
        {error && (
          <div className="w-full mb-6 p-4 rounded-xl bg-[#7f2927] text-[#ff9993] text-sm font-medium border border-[#bb5551]/30">
            {error}
          </div>
        )}
        
        {isVerified && (
          <div className="w-full mb-6 p-4 rounded-xl bg-[#004c69] text-[#97d8ff] text-sm font-medium border border-[#7bd0ff]/30">
            Email verified successfully! You can now log in.
          </div>
        )}
        
        {/* Form Section */}
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-[#939eb5] text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="text-[#5b74b1] w-5 h-5 group-focus-within:text-[#7bd0ff] transition-colors" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 bg-[#00225a] border-none rounded-xl text-[#dee5ff] placeholder:text-[#939eb5]/40 focus:ring-2 focus:ring-[#7bd0ff]/20 focus:outline-none transition-all duration-300" 
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
            <label className="block text-[#939eb5] text-[10px] font-bold uppercase tracking-widest ml-1">PASSWORD</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="text-[#5b74b1] w-5 h-5 group-focus-within:text-[#7bd0ff] transition-colors" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 bg-[#00225a] border-none rounded-xl text-[#dee5ff] placeholder:text-[#939eb5]/40 focus:ring-2 focus:ring-[#7bd0ff]/20 focus:outline-none transition-all duration-300" 
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
              >
                {showPassword ? (
                  <EyeOff className="text-[#939eb5]/60 hover:text-[#7bd0ff] w-5 h-5 transition-colors" />
                ) : (
                  <Eye className="text-[#939eb5]/60 hover:text-[#7bd0ff] w-5 h-5 transition-colors" />
                )}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <Link className="text-[#7bd0ff]/70 text-xs font-semibold hover:text-[#7bd0ff] transition-colors" to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
          
          {/* Primary Action */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-xl text-[#004560] font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 mt-4 \${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-[0_8px_24px_rgba(123,208,255,0.25)] hover:shadow-[0_12px_32px_rgba(123,208,255,0.35)] active:scale-[0.98]'}`}
            style={{ background: 'linear-gradient(135deg, #7bd0ff 0%, #004c69 100%)' }}
          >
            <span>{loading ? 'Authenticating...' : 'Log In'}</span>
            {!loading && <LogIn className="w-5 h-5" />}
          </button>
        </form>
        
        {/* Secondary Action */}
        <div className="mt-10 text-center">
          <p className="text-[#939eb5] text-sm">
            Don't have an account? 
            <Link className="text-[#7bd0ff] font-bold hover:underline decoration-2 underline-offset-4 ml-1" to="/register">Sign up</Link>
          </p>
        </div>
        
      </main>
    </div>
  );
};

export default Login;
