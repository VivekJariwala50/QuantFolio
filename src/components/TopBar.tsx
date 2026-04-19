import React from 'react';
import { LogOut, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../contexts/ThemeContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const initials = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20"
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Menu size={20} />
        </button>
        <div className="hidden py-4 sm:block">
          <h2 className="text-sm font-bold m-0" style={{ color: 'var(--text-primary)' }}>
            QuantFolio
          </h2>
          <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>Advanced Portfolio Analytics</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="relative p-2.5 rounded-xl transition-all duration-200"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark'
            ? <Sun size={16} className="text-status-warning" />
            : <Moon size={16} className="text-brand-blue" />
          }
        </button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl transition-all duration-200"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-status-profit rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: 'var(--border-color)' }}></div>

        {/* Avatar + Email */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
          >
            {initials}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold truncate max-w-[140px]" style={{ color: 'var(--text-primary)' }}>
              {user.email}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Free Plan</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={signOut}
          className="p-2.5 rounded-xl transition-all duration-200"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
