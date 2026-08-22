import React from 'react';
import {
  Download,
  Send,
  Building2,
} from 'lucide-react';
import type { Invoice, UserCompanyProfile } from '../types';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  profile: UserCompanyProfile;
  onClose: () => void;
  onUpdateInvoiceStatus: (id: string, newStatus: any) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  profile,
  onClose,
  onUpdateInvoiceStatus,
}) => {
  if (!invoice) return null;

  const handleDownloadPDF = () => {
    generateInvoicePDF(invoice, profile);
  };

  const handleMarkPaid = () => {
    confetti({ particleCount: 70, spread: 50 });
    onUpdateInvoiceStatus(invoice.id, 'PAID');
  };

  const handleSendWhatsApp = () => {
    const text = `Cześć ${invoice.client.name}, przesyłam ${invoice.type === 'FAKTURA' ? 'fakturę' : 'ofertę'} nr ${invoice.number} na kwotę ${invoice.totalGross.toFixed(2)} PLN. Prośba o przelew na konto: ${profile.bankAccount}. Dziękuję!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              ID: {invoice.id}
            </div>
            <div className="modal-title">{invoice.number}</div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Status Header */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background:
                invoice.status === 'PAID'
                  ? '#ecfdf5'
                  : invoice.status === 'ACCEPTED'
                  ? '#eff6ff'
                  : '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>STATUS DOKUMENTU</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {invoice.status === 'PAID'
                  ? '✅ OPŁACONA'
                  : invoice.status === 'ACCEPTED'
                  ? '🤝 ZAAKCEPTOWANA'
                  : '⏳ OCZEKUJE NA PŁATNOŚĆ'}
              </div>
            </div>

            {invoice.status !== 'PAID' && (
              <button
                className="btn-accent"
                onClick={handleMarkPaid}
                style={{ background: '#10b981', padding: '8px 14px', fontSize: '13px' }}
              >
                Oznacz jako opłaconą
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button className="btn-primary-action" onClick={handleDownloadPDF} style={{ padding: '12px' }}>
              <Download size={18} />
              <span>Pobierz PDF</span>
            </button>

            <button className="btn-secondary" onClick={handleSendWhatsApp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Send size={18} color="#25D366" />
              <span>Wyślij SMS / WhatsApp</span>
            </button>
          </div>

          {/* Client Info */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>NABYWCA</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {invoice.client.name}
            </div>
            {invoice.client.nip && <div style={{ fontSize: '13px', color: '#475569' }}>NIP: {invoice.client.nip}</div>}
            {invoice.client.phone && <div style={{ fontSize: '13px', color: '#475569' }}>Tel: {invoice.client.phone}</div>}
          </div>

          {/* Items Table */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Pozycje na fakturze ({invoice.items.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {invoice.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#ffffff', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {item.quantity} {item.unit} x {item.priceNet.toFixed(2)} PLN netto (VAT {item.vatRate}%)
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                    {(item.priceNet * item.quantity * (1 + item.vatRate / 100)).toFixed(2)} PLN
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div style={{ background: '#0f172a', color: '#ffffff', padding: '16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Do zapłaty łącznie</div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{invoice.totalGross.toFixed(2)} PLN</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#cbd5e1' }}>
              <div>Netto: {invoice.totalNet.toFixed(2)} PLN</div>
              <div>VAT: {invoice.totalVat.toFixed(2)} PLN</div>
            </div>
          </div>

          {/* Bank Transfer Details */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>
              <Building2 size={16} />
              <span>Dane do przelewu bankowego</span>
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
              Numer konta: <b>{profile.bankAccount}</b>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Tytuł przelewu: <b>{invoice.number}</b>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Zamknij</button>
        </div>
      </div>
    </div>
  );
};
