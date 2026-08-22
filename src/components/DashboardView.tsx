import React, { useState } from 'react';
import { Plus, Search, ArrowRight, FileText, Crown, Clock } from 'lucide-react';
import type { Invoice, AppStats, UserCompanyProfile } from '../types';

interface DashboardViewProps {
  stats: AppStats;
  invoices: Invoice[];
  profile: UserCompanyProfile;
  trialDaysLeft: number;
  onNewInvoice: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onOpenPaywall: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  invoices,
  profile,
  trialDaysLeft,
  onNewInvoice,
  onSelectInvoice,
  onOpenPaywall,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'OFERTA' | 'FAKTURA'>('ALL');

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchType = filterType === 'ALL' || inv.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="main-content">
      {/* Welcome Header */}
      <div className="welcome-header">
        <h1 className="welcome-title">Witaj, Linvoice!</h1>
        <p className="welcome-subtitle">Oto podsumowanie Twojej dzisiejszej pracy.</p>
      </div>

      {/* Trial Countdown Alert Banner if not subscribed */}
      {!profile.isSubscribed && (
        <div
          onClick={onOpenPaywall}
          style={{
            background: trialDaysLeft > 0 ? '#fffbeb' : '#fef2f2',
            border: trialDaysLeft > 0 ? '1px solid #fde68a' : '1px solid #fecaca',
            padding: '12px 16px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color={trialDaysLeft > 0 ? '#b45309' : '#dc2626'} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '13px', color: trialDaysLeft > 0 ? '#92400e' : '#991b1b' }}>
                {trialDaysLeft > 0 ? `Darmowy okres próbny: Pozostały ${trialDaysLeft} dni` : 'Darmowy okres próbny wygasł'}
              </div>
              <div style={{ fontSize: '11px', color: trialDaysLeft > 0 ? '#b45309' : '#b91c1c' }}>
                {trialDaysLeft > 0 ? 'Kliknij, aby przejść na nielimitowany plan PRO' : 'Odblokuj dostęp, aby generować nowe wyceny'}
              </div>
            </div>
          </div>
          <Crown size={18} color={trialDaysLeft > 0 ? '#b45309' : '#dc2626'} />
        </div>
      )}

      {/* Primary Action Button matching image */}
      <button className="btn-primary-action" onClick={onNewInvoice}>
        <Plus size={20} />
        <span>Nowa wycena</span>
      </button>

      {/* KPI Cards section matching exact layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* KPI Card 1 */}
        <div className="stat-card">
          <div className="stat-title">Wygenerowane oferty</div>
          <div className="stat-row">
            <span className="stat-value">{stats.totalOffers}</span>
            <span className="stat-badge-green">+{stats.weeklyGrowthOffers} w tym tyg.</span>
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="stat-card">
          <div className="stat-title">Akceptacja ofert</div>
          <div className="stat-row">
            <span className="stat-value">{stats.acceptanceRate}%</span>
            <span className="stat-badge-green">+{stats.acceptanceGrowth}% wzrostu</span>
          </div>
        </div>

        {/* KPI Card 3 */}
        <div className="stat-card">
          <div className="stat-title">Subskrypcja</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
            {profile.isSubscribed ? 'Plan PRO (Aktywny)' : `Plan PRO (${trialDaysLeft} dni trialu)`}
          </div>
          <div className="stat-link" onClick={onOpenPaywall}>
            <span>Zarządzaj planem</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Recent Invoices / Offers Section */}
      <div style={{ marginTop: '12px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Ostatnie oferty</h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  background: filterType === 'ALL' ? '#0f172a' : '#f1f5f9',
                  color: filterType === 'ALL' ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                }}
                onClick={() => setFilterType('ALL')}
              >
                Wszystkie
              </button>
              <button
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  background: filterType === 'OFERTA' ? '#0f172a' : '#f1f5f9',
                  color: filterType === 'OFERTA' ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                }}
                onClick={() => setFilterType('OFERTA')}
              >
                Oferty
              </button>
              <button
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  background: filterType === 'FAKTURA' ? '#0f172a' : '#f1f5f9',
                  color: filterType === 'FAKTURA' ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                }}
                onClick={() => setFilterType('FAKTURA')}
              >
                Faktury
              </button>
            </div>
          </div>

          {/* Search bar matching screenshot */}
          <div className="search-container" style={{ marginTop: '12px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Szukaj po nazwie firmy, imieniu lub ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Invoice List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredInvoices.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
              Brak dokumentów spełniających kryteria wyszukiwania.
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="invoice-card"
                style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
                onClick={() => onSelectInvoice(inv)}
              >
                <div className="invoice-left">
                  <div className="icon-avatar">
                    <FileText size={20} />
                  </div>
                  <div className="invoice-info">
                    <span className="client-name">{inv.client.name}</span>
                    <span className="invoice-meta">
                      {inv.number} • {inv.issueDate}
                    </span>
                  </div>
                </div>

                <div className="invoice-right">
                  <span className="invoice-amount">{inv.totalGross.toFixed(2)} PLN</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      className={`status-badge ${
                        inv.status === 'PAID'
                          ? 'status-paid'
                          : inv.status === 'ACCEPTED'
                          ? 'status-accepted'
                          : 'status-pending'
                      }`}
                    >
                      {inv.status === 'PAID'
                        ? 'Opłacona'
                        : inv.status === 'ACCEPTED'
                        ? 'Zaakceptowana'
                        : 'Oczekująca'}
                    </span>
                    <ArrowRight size={16} color="#94a3b8" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
