import React, { useState } from 'react';
import { Activity, Lock, Mail, TrendingUp, BarChart2, Shield } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Account created! You can now sign in.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: BarChart2, text: 'Real-time portfolio tracking' },
    { icon: TrendingUp, text: 'Performance vs S&P 500' },
    { icon: Shield, text: 'Risk metrics & insights' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-main)' }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12"
        style={{
          background: 'linear-gradient(145deg, #0f1729 0%, #0B0F17 60%, #111827 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg">
            <Activity size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">QuantFolio</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Institutional-grade<br />
            <span style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              portfolio analytics
            </span>
          </h1>
          <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Track, analyze, and optimize your investments with professional-grade tools.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <Icon size={16} className="text-brand-blue" />
                </div>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          © 2025 QuantFolio · Advanced Wealth Analytics
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>QuantFolio</span>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            <div className="mb-7">
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {isLogin ? 'Sign in' : 'Create account'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {isLogin
                  ? 'Welcome back. Access your portfolio.'
                  : 'Start tracking your investments today.'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2" size={15} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    className="input-base pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2" size={15} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    className="input-base pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-5 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
