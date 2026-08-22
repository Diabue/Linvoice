import React, { useState } from 'react';
import { Lock, Mail, CheckCircle2, UserCheck, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('jan.kowalski@instalacje-kowalski.pl');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pin) {
      setError('Wpisz e-mail oraz PIN');
      return;
    }
    setError('');
    onLoginSuccess();
  };

  const handleDemoLogin = () => {
    setEmail('jan.kowalski@instalacje-kowalski.pl');
    setPin('1234');
    onLoginSuccess();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-badge">INV</div>
            <span className="modal-title">Zaloguj do Linvoice</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                marginBottom: '10px',
              }}
            >
              <KeyRound size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Konto Wykonawcy</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Wprowadź e-mail oraz 4-cyfrowy kod PIN do szybkiego logowania na telefonie
            </p>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: '#fef2f2', color: '#dc2626', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Adres E-mail</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj-email@firma.pl"
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Szybki Kod PIN (4 cyfry)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                maxLength={4}
                className="form-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                style={{ paddingLeft: '38px', letterSpacing: '4px', fontSize: '18px', fontWeight: 700 }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary-action" style={{ marginTop: '8px' }}>
            <UserCheck size={18} />
            <span>Zaloguj do aplikacji</span>
          </button>

          <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
            <div style={{ height: '1px', background: '#e2e8f0' }} />
            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#ffffff', padding: '0 8px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
              lub
            </span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleDemoLogin}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
          >
            <CheckCircle2 size={18} color="#10b981" />
            <span>Zaloguj od razu (Konto Testowe: Jan Kowalski)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
