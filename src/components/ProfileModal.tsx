import React, { useState } from 'react';
import type { UserCompanyProfile } from '../types';
import { Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  profile: UserCompanyProfile;
  onClose: () => void;
  onSaveProfile: (profile: UserCompanyProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile,
}) => {
  const [form, setForm] = useState<UserCompanyProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Dane Twojej Firmy i Konto</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Nazwa Twojej Firmy / Imię i Nazwisko</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">NIP Firmy</label>
            <input
              type="text"
              className="form-input"
              value={form.nip}
              onChange={(e) => setForm({ ...form, nip: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="form-group">
              <label className="form-label">Ulica i numer</label>
              <input
                type="text"
                className="form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Miasto i Kod</label>
              <input
                type="text"
                className="form-input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="form-group">
              <label className="form-label">Telefon firmowy</label>
              <input
                type="text"
                className="form-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail do faktur</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Numer Konta Bankowego (IBAN)</label>
            <input
              type="text"
              className="form-input"
              value={form.bankAccount}
              onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
            />
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Plan Subskrypcji</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              {form.subscriptionPlan}
            </div>
          </div>

          <button type="submit" className="btn-primary-action" style={{ marginTop: '12px' }}>
            <Save size={18} />
            <span>Zapisz dane firmy</span>
          </button>
        </form>
      </div>
    </div>
  );
};
