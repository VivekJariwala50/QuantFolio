import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Bell, Sun, Moon, Menu, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../contexts/ThemeContext';
import { useNotificationStore } from '../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl transition-all duration-200"
            style={{ color: 'var(--text-secondary)', background: showNotifications ? 'var(--bg-main)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-profit rounded-full border-2" style={{ borderColor: 'var(--bg-card)' }}></span>
            )}
          </button>

          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-xl overflow-hidden z-50 border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={() => markAllAsRead()} className="text-xs font-semibold" style={{ color: '#3B82F6' }}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className="p-4 border-b last:border-0 cursor-pointer transition-colors flex gap-3"
                      style={{ 
                        borderColor: 'var(--border-color)',
                        background: notif.read ? 'transparent' : 'rgba(59,130,246,0.05)'
                      }}
                    >
                      <div className="shrink-0 mt-0.5">
                        {notif.type === 'success' && <CheckCircle2 size={16} style={{ color: '#22C55E' }} />}
                        {notif.type === 'error' && <AlertTriangle size={16} style={{ color: '#EF4444' }} />}
                        {notif.type === 'warning' && <AlertTriangle size={16} style={{ color: '#F59E0B' }} />}
                        {notif.type === 'info' && <Info size={16} style={{ color: '#3B82F6' }} />}
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{notif.title}</h4>
                          <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
