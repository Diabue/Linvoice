import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Wrench,
  Users,
  Settings,
  LogOut,
  X,
  Crown,
  Sparkles,
} from 'lucide-react';
import type { UserCompanyProfile } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  activeSection: string;
  profile: UserCompanyProfile;
  trialDaysLeft: number;
  isLoggedIn: boolean;
  onClose: () => void;
  onSelectSection: (section: string) => void;
  onOpenPaywall: () => void;
  onLogout: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  activeSection,
  profile,
  trialDaysLeft,
  isLoggedIn,
  onClose,
  onSelectSection,
  onOpenPaywall,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Pulpit i Historia', icon: LayoutDashboard },
    { id: 'new-invoice', label: '+ Nowa Wycena / Faktura', icon: PlusCircle, isHighlight: true },
    { id: 'services', label: 'Katalog Usług & Cennik', icon: Wrench },
    { id: 'clients', label: 'Baza Klientów', icon: Users },
    { id: 'profile', label: 'Dane Firmy i Ustawienia', icon: Settings },
  ];

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-badge">INV</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>linvoice</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Wersja mobilna dla firm</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile.name}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            NIP: {profile.nip}
          </div>
          
          <div
            onClick={onOpenPaywall}
            style={{
              marginTop: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: profile.isSubscribed ? '#ecfdf5' : '#fffbeb',
              color: profile.isSubscribed ? '#047857' : '#b45309',
              border: profile.isSubscribed ? '1px solid #a7f3d0' : '1px solid #fde68a',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <Crown size={12} />
            <span>
              {profile.isSubscribed
                ? 'Plan PRO (Aktywny)'
                : trialDaysLeft > 0
                ? `Trial PRO: ${trialDaysLeft} dni testu`
                : 'Trial wygasł (Aktywuj PRO)'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="drawer-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={
                  item.isHighlight
                    ? {
                        background: isActive ? '#0f172a' : '#eff6ff',
                        color: isActive ? '#ffffff' : '#1d4ed8',
                        fontWeight: 700,
                      }
                    : {}
                }
                onClick={() => {
                  onSelectSection(item.id);
                  onClose();
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Pro Banner */}
        <div
          onClick={onOpenPaywall}
          style={{ padding: '16px', margin: '12px', background: 'linear-gradient(135deg, #0f172a, #334155)', borderRadius: '16px', color: '#ffffff', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '13px', color: '#38bdf8' }}>
              <Sparkles size={14} />
              <span>Linvoice PRO</span>
            </div>
            <span style={{ fontSize: '10px', background: '#38bdf8', color: '#0f172a', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
              AKTYWACJA
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px' }}>
            {profile.isSubscribed
              ? 'Wszystkie funkcje PRO są odblokowane.'
              : `Darmowy trial: ${trialDaysLeft} dni. Kliknij, aby przejść na plan PRO.`}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          {isLoggedIn ? (
            <button
              className="nav-item"
              style={{ color: '#ef4444' }}
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <LogOut size={18} />
              <span>Wyloguj z konta</span>
            </button>
          ) : (
            <button
              className="btn-accent"
              style={{ width: '100%' }}
              onClick={() => {
                onSelectSection('auth');
                onClose();
              }}
            >
              Zaloguj się
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
