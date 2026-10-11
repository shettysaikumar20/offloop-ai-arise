import React from 'react';
import { useSystem } from '../../context/SystemContext.jsx';
import { Sparkles, Trophy, Skull, Users, Info, X, Zap } from 'lucide-react';

export default function SystemNotification() {
  const { notifications, dismissNotification } = useSystem();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="system-toasts-container">
      {notifications.map(notif => {
        let Icon = Info;
        let iconColor = '#38bdf8';

        if (notif.type === 'levelup') {
          Icon = Sparkles;
          iconColor = '#facc15';
        } else if (notif.type === 'rankup') {
          Icon = Zap;
          iconColor = '#c084fc';
        } else if (notif.type === 'achievement') {
          Icon = Trophy;
          iconColor = '#f59e0b';
        } else if (notif.type === 'shadow') {
          Icon = Users;
          iconColor = '#38bdf8';
        } else if (notif.type === 'quest') {
          Icon = Zap;
          iconColor = '#10b981';
        } else if (notif.type === 'warning') {
          Icon = Skull;
          iconColor = '#f43f5e';
        }

        return (
          <div
            key={notif.id}
            className={`system-toast-card toast-${notif.type}`}
          >
            <div style={{ marginTop: 2 }}>
              <Icon size={18} color={iconColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                <span className="font-system" style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.06em' }}>
                  {notif.title}
                </span>
                <span className="font-sub" style={{ fontSize: 11, color: '#64748b' }}>
                  {notif.timestamp}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
