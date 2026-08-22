import React from 'react';
import { Bell, Menu, ChevronDown, User } from 'lucide-react';
import type { UserCompanyProfile } from '../types';

interface HeaderProps {
  profile: UserCompanyProfile;
  isLoggedIn: boolean;
  onOpenDrawer: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isLoggedIn,
  onOpenDrawer,
  onOpenProfile,
  onOpenAuth,
}) => {
  const getInitials = (name: string) => {
    if (!name) return 'LI';
    const words = name.split(' ').filter(Boolean);
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="top-header">
      <div className="brand-section">
        <button className="menu-btn" onClick={onOpenDrawer} title="Otwórz menu">
          <Menu size={22} />
        </button>

        <div className="logo-badge">INV</div>
        <span className="brand-name">linvoice</span>
      </div>

      <div className="header-actions">
        <div className="lang-selector" title="Zmień język">
          <span style={{ fontSize: '15px' }}>🌐</span>
          <span className="lang-text">Polski</span>
          <ChevronDown size={14} />
        </div>

        <button className="menu-btn" style={{ position: 'relative' }} title="Powiadomienia">
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
            }}
          />
        </button>

        {isLoggedIn ? (
          <div
            className="avatar-badge"
            onClick={onOpenProfile}
            title={`${profile.name} - Kliknij, aby edytować profil`}
          >
            {getInitials(profile.name)}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-accent"
            style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <User size={15} />
            <span>Zaloguj</span>
          </button>
        )}
      </div>
    </header>
  );
};
