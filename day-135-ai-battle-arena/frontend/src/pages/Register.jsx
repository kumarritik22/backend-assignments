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
    <div className="bg-[#060e20] text-[#dee5ff] min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#002867]/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#004c69]/10 rounded-full blur-[100px]"></div>
      
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
      
      <main className="w-full max-w-sm flex flex-col mt-12 mb-10 z-10 w-full sm:px-0">
        {/* Hero Branding Section */}
        <div className="mb-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-[#7bd0ff]/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-[#00225a] rounded-full flex items-center justify-center shadow-[0_16px_32px_rgba(0,0,0,0.4)]">
              <Swords className="text-[#7bd0ff] w-10 h-10" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#dee5ff] mb-2 leading-tight">Join the Arena</h2>
          <p className="text-[#939eb5] text-sm font-medium">Create your commander profile to begin.</p>
        </div>
        
        {error && (
          <div className="w-full mb-6 p-4 rounded-xl bg-[#7f2927] text-[#ff9993] text-sm font-medium border border-[#bb5551]/30">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="w-full mb-6 p-4 rounded-xl bg-[#004c69] text-[#dee5ff] text-sm font-medium border border-[#7bd0ff]/30 text-center">
            <p className="mb-2">{successMsg.text}</p>
          </div>
        )}
        
        {/* Registration Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#91aaeb] uppercase tracking-widest ml-1">Commander Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#939eb5] group-focus-within:text-[#7bd0ff] transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 bg-[#06122d] border-0 rounded-xl text-[#dee5ff] placeholder-[#939eb5]/40 focus:ring-2 focus:ring-[#7bd0ff]/40 focus:bg-[#00225a] transition-all outline-none" 
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
            <label className="text-[11px] font-bold text-[#91aaeb] uppercase tracking-widest ml-1">Data Stream Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#939eb5] group-focus-within:text-[#7bd0ff] transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 bg-[#06122d] border-0 rounded-xl text-[#dee5ff] placeholder-[#939eb5]/40 focus:ring-2 focus:ring-[#7bd0ff]/40 focus:bg-[#00225a] transition-all outline-none" 
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
            <label className="text-[11px] font-bold text-[#91aaeb] uppercase tracking-widest ml-1">PASSWORD</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#939eb5] group-focus-within:text-[#7bd0ff] transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 bg-[#06122d] border-0 rounded-xl text-[#dee5ff] placeholder-[#939eb5]/40 focus:ring-2 focus:ring-[#7bd0ff]/40 focus:bg-[#00225a] transition-all outline-none" 
                placeholder="••••••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-[#939eb5]/60 hover:text-[#7bd0ff] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#91aaeb] uppercase tracking-widest ml-1">Verify Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#939eb5] group-focus-within:text-[#7bd0ff] transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 bg-[#06122d] border-0 rounded-xl text-[#dee5ff] placeholder-[#939eb5]/40 focus:ring-2 focus:ring-[#7bd0ff]/40 focus:bg-[#00225a] transition-all outline-none" 
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
              className={`w-full h-14 rounded-full flex items-center justify-center gap-3 transition-transform \${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
              style={{ background: 'linear-gradient(135deg, #7bd0ff 0%, #004c69 100%)' }}
              type="submit"
              disabled={loading}
            >
              <span className="text-[#004560] font-extrabold tracking-tight">{loading ? 'Initializing...' : 'Initialize Account'}</span>
              {!loading && <ArrowRight className="text-[#004560] w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-grow bg-[#2b4680]/30"></div>
              <span className="text-[10px] text-[#939eb5] font-bold uppercase tracking-[0.2em]">Deployment Protocol</span>
              <div className="h-[1px] flex-grow bg-[#2b4680]/30"></div>
            </div>
            
            <div className="flex justify-center">
              <Link className="text-[#939eb5] text-sm font-medium hover:text-[#7bd0ff] transition-colors group" to="/login">
                Already a commander? <span className="text-[#dee5ff] group-hover:text-[#7bd0ff] font-bold ml-1">Log In</span>
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
