import React, { useState } from 'react';
import type { UserCompanyProfile } from '../types';
import { Save, Upload, Trash2, Image } from 'lucide-react';

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setForm({ ...form, logoUrl: base64Url });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setForm({ ...form, logoUrl: undefined });
  };

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
          {/* Logo Upload Section */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <Image size={16} color="#0f172a" />
              <span>Logo Twojej Firmy (wyświetlane na fakturach PDF)</span>
            </label>

            {form.logoUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
                <div style={{ width: '80px', height: '50px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={form.logoUrl} alt="Logo podgląd" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} />
                  <span>Usuń logo</span>
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '8px' }}>
                <label
                  htmlFor="logo-file-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={16} />
                  <span>Wybierz plik graficzny logo (PNG/JPG)</span>
                </label>
                <input
                  id="logo-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Zalecany przezroczysty plik PNG lub kwadratowy/prostokątny plik JPG.
                </div>
              </div>
            )}
          </div>

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
