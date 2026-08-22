import React, { useState } from 'react';
import { Crown, Check, ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaywallModalProps {
  isOpen: boolean;
  trialDaysLeft: number;
  isExpired: boolean;
  isSubscribed: boolean;
  onClose: () => void;
  onSubscribeSuccess: () => void;
  onCancelSubscription: () => void;
  onSimulateExpireTrial: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  trialDaysLeft,
  isExpired,
  isSubscribed,
  onClose,
  onSubscribeSuccess,
  onCancelSubscription,
  onSimulateExpireTrial,
}) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      onSubscribeSuccess();
    }, 800);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    onCancelSubscription();
  };

  return (
    <div className="modal-overlay" onClick={isExpired ? undefined : onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header" style={{ background: '#0f172a', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-badge" style={{ background: '#38bdf8', color: '#0f172a' }}>PRO</div>
            <span className="modal-title" style={{ color: '#ffffff' }}>
              {isSubscribed
                ? 'Zarządzaj Subskrypcją linvoice PRO'
                : isExpired
                ? '🔒 Okres testowy minął'
                : 'Subskrypcja linvoice PRO'}
            </span>
          </div>
          {!isExpired && <button className="close-btn" style={{ color: '#ffffff' }} onClick={onClose}>✕</button>}
        </div>

        <div className="modal-body">
          {/* Active Subscription View */}
          {isSubscribed ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857' }}>STATUS SUBSKRYPCJI</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', marginTop: '2px' }}>
                    Plan PRO (Aktywny)
                  </div>
                  <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>
                    Rozliczenie: 39 PLN / mies (odnawiane automatycznie)
                  </div>
                </div>
                <Crown size={32} color="#10b981" />
              </div>

              {!showCancelConfirm ? (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Zarządzanie płatnościami</div>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Twoja subskrypcja jest aktywna. W każdej chwili możesz zrezygnować z automatycznego odnawiania.
                  </p>
                  
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(true)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <XCircle size={16} />
                    <span>Anuluj Subskrypcję PRO</span>
                  </button>
                </div>
              ) : (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: 800, fontSize: '15px' }}>
                    <AlertTriangle size={20} />
                    <span>Czy na pewno chcesz anulować subskrypcję?</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#9f1239' }}>
                    Stracisz dostęp do nielimitowanego pobierania firm z GUS po NIP, kodów QR płatności BLIK na budowie i szybkiego wystawiania faktur.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowCancelConfirm(false)}>
                      Zostaję w PRO
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCancel}
                      style={{ padding: '10px 16px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Tak, anuluj subskrypcję
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Status Alert Banner */}
              {isExpired ? (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: '14px', color: '#991b1b', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>Twój 3-dniowy darmowy trial dobiegł końca</div>
                  <div style={{ fontSize: '13px', marginTop: '2px' }}>
                    Aby dalej generować wyceny i faktury u klientów na budowie, aktywuj subskrypcję PRO.
                  </div>
                </div>
              ) : (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px 16px', borderRadius: '14px', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>Darmowy okres próbny aktywny</div>
                    <div style={{ fontSize: '12px', marginTop: '2px' }}>
                      Pozostało: <b>{trialDaysLeft} {trialDaysLeft === 1 ? 'dzień' : 'dni'} darmowych testów</b>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ fontSize: '11px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', color: '#475569', fontWeight: 600 }}
                    onClick={onSimulateExpireTrial}
                    title="Przetestuj wygląd blokady po 3 dniach"
                  >
                    Simulate Expire
                  </button>
                </div>
              )}

              {/* Billing Switcher */}
              <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  type="button"
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    background: billingCycle === 'YEARLY' ? '#0f172a' : 'transparent',
                    color: billingCycle === 'YEARLY' ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                  }}
                  onClick={() => setBillingCycle('YEARLY')}
                >
                  Rocznie (-25% Taniej)
                </button>

                <button
                  type="button"
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    background: billingCycle === 'MONTHLY' ? '#0f172a' : 'transparent',
                    color: billingCycle === 'MONTHLY' ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                  }}
                  onClick={() => setBillingCycle('MONTHLY')}
                >
                  Miesięcznie
                </button>
              </div>

              {/* Pricing Highlight Box */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#ffffff', padding: '24px', borderRadius: '20px', textAlign: 'center', position: 'relative' }}>
                {billingCycle === 'YEARLY' && (
                  <span style={{ position: 'absolute', top: '-12px', right: '20px', background: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                    Najczęściej wybierany
                  </span>
                )}
                
                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Plan Linvoice PRO</div>
                <div style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', marginTop: '4px', letterSpacing: '-1px' }}>
                  {billingCycle === 'YEARLY' ? '39 PLN' : '49 PLN'}
                  <span style={{ fontSize: '16px', color: '#cbd5e1', fontWeight: 500 }}> / miesiąc</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {billingCycle === 'YEARLY' ? 'Rozliczane rocznie (468 PLN netto/rok)' : 'Możliwość rezygnacji w dowolnym momencie'}
                </div>
              </div>

              {/* Benefits Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                  <div style={{ background: '#ecfdf5', color: '#047857', padding: '4px', borderRadius: '50%' }}>
                    <Check size={16} />
                  </div>
                  <span>Nielimitowane faktury i wyceny bez żadnych limitów</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                  <div style={{ background: '#ecfdf5', color: '#047857', padding: '4px', borderRadius: '50%' }}>
                    <Check size={16} />
                  </div>
                  <span>Automatyczne pobieranie firm z GUS po NIP w 0.5 sekundy</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                  <div style={{ background: '#ecfdf5', color: '#047857', padding: '4px', borderRadius: '50%' }}>
                    <Check size={16} />
                  </div>
                  <span>Kody QR BLIK do natychmiastowych płatności na budowie</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                  <div style={{ background: '#ecfdf5', color: '#047857', padding: '4px', borderRadius: '50%' }}>
                    <Check size={16} />
                  </div>
                  <span>Generowanie eleganckich plików PDF i wysyłka SMS/WhatsApp</span>
                </div>
              </div>

              {/* Payment CTA Button */}
              <button
                type="button"
                className="btn-primary-action"
                onClick={handleSubscribe}
                disabled={isProcessing}
                style={{ marginTop: '12px', padding: '16px', fontSize: '16px' }}
              >
                <Crown size={20} />
                <span>{isProcessing ? 'Przetwarzanie płatności...' : 'Aktywuj Subskrypcję PRO'}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Bezpieczna płatność BLIK / Karta Kredytowa</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
