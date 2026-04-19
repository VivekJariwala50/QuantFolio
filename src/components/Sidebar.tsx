import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, Activity, X, TrendingUp, Zap } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/simulator', icon: Calculator, label: 'Simulator' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-40 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        style={{
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-app-content-primary tracking-tight">QuantFolio</span>
              <div className="text-[10px] text-app-content-secondary font-medium tracking-wider uppercase">Analytics</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-app-secondary transition-colors text-app-content-secondary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Navigation
          </div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 group
                ${isActive
                  ? 'bg-brand-blue text-white shadow-lg'
                  : 'text-app-content-secondary hover:text-app-content-primary hover:bg-app-secondary'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? 'text-white' : 'group-hover:text-brand-blue transition-colors'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Pro upgrade card */}
        <div className="p-4 m-3 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1a1f35 100%)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <div className="absolute top-0 right-0 opacity-10">
            <Zap size={80} className="text-brand-blue" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-brand-blue" />
              <span className="text-xs font-bold text-white">Pro Analytics</span>
            </div>
            <p className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>Unlock institutional-grade tools & real-time data</p>
            <button className="w-full text-xs font-bold py-2 rounded-lg text-white transition-all" style={{ background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.4)' }}>
              Upgrade Plan →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
