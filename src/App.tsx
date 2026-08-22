import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarDrawer } from './components/SidebarDrawer';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { InvoiceBuilderModal } from './components/InvoiceBuilderModal';
import { ServiceCatalogModal } from './components/ServiceCatalogModal';
import { ClientsModal } from './components/ClientsModal';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { PaywallModal } from './components/PaywallModal';
import { storage } from './services/storage';
import type { Invoice, ServiceItem, Client, UserCompanyProfile, AppStats } from './types';

export function App() {
  // State
  const [profile, setProfile] = useState<UserCompanyProfile>(storage.getProfile());
  const [services, setServices] = useState<ServiceItem[]>(storage.getServices());
  const [clients, setClients] = useState<Client[]>(storage.getClients());
  const [invoices, setInvoices] = useState<Invoice[]>(storage.getInvoices());
  const [stats, setStats] = useState<AppStats>(storage.getStats());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(storage.isLoggedIn() || true);

  // Trial state
  const trialDaysLeft = storage.getTrialDaysRemaining(profile);
  const isTrialExpired = !profile.isSubscribed && trialDaysLeft <= 0;

  // Navigation & Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isInvoiceBuilderOpen, setIsInvoiceBuilderOpen] = useState(false);
  const [isServiceCatalogOpen, setIsServiceCatalogOpen] = useState(false);
  const [isClientsOpen, setIsClientsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Synchronize stats when invoices change
  useEffect(() => {
    const offers = invoices.filter((i) => i.type === 'OFERTA');
    const totalCount = offers.length || invoices.length;
    const acceptedCount = invoices.filter((i) => i.status === 'ACCEPTED' || i.status === 'PAID').length;
    const rate = Math.round((acceptedCount / (invoices.length || 1)) * 100);

    const updatedStats: AppStats = {
      ...stats,
      totalOffers: totalCount,
      acceptanceRate: rate > 0 ? rate : 85,
    };
    setStats(updatedStats);
    storage.saveStats(updatedStats);
  }, [invoices]);

  // Handlers
  const handleSaveProfile = (newProfile: UserCompanyProfile) => {
    setProfile(newProfile);
    storage.saveProfile(newProfile);
  };

  const handleSaveServices = (newServices: ServiceItem[]) => {
    setServices(newServices);
    storage.saveServices(newServices);
  };

  const handleSaveClients = (newClients: Client[]) => {
    setClients(newClients);
    storage.saveClients(newClients);
  };

  const handleSaveInvoice = (newInvoice: Invoice) => {
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    storage.saveInvoices(updated);
    setIsInvoiceBuilderOpen(false);
    setSelectedInvoice(newInvoice);
  };

  const handleUpdateInvoiceStatus = (id: string, newStatus: any) => {
    const updated = invoices.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv));
    setInvoices(updated);
    storage.saveInvoices(updated);
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice({ ...selectedInvoice, status: newStatus });
    }
  };

  const handleCreateInvoiceClick = () => {
    if (isTrialExpired) {
      setIsPaywallOpen(true);
    } else {
      setIsInvoiceBuilderOpen(true);
    }
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'new-invoice') {
      handleCreateInvoiceClick();
    } else if (sectionId === 'services') {
      setIsServiceCatalogOpen(true);
    } else if (sectionId === 'clients') {
      setIsClientsOpen(true);
    } else if (sectionId === 'profile') {
      setIsProfileOpen(true);
    } else if (sectionId === 'auth') {
      setIsAuthOpen(true);
    }
  };

  const handleSubscribeSuccess = () => {
    const updatedProfile: UserCompanyProfile = {
      ...profile,
      isSubscribed: true,
      subscriptionPlan: 'Plan PRO (Aktywny)',
    };
    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
    setIsPaywallOpen(false);
  };

  const handleCancelSubscription = () => {
    const updatedProfile: UserCompanyProfile = {
      ...profile,
      isSubscribed: false,
      subscriptionPlan: 'Plan PRO (Anulowany)',
    };
    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
    setIsPaywallOpen(false);
  };

  const handleSimulateExpireTrial = () => {
    const pastDate = new Date(Date.now() - 4 * 86400000).toISOString();
    const updatedProfile: UserCompanyProfile = {
      ...profile,
      trialStartDate: pastDate,
      isSubscribed: false,
      subscriptionPlan: 'Plan PRO (Wygasł)',
    };
    setProfile(updatedProfile);
    storage.saveProfile(updatedProfile);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    storage.setLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    storage.setLoggedIn(true);
    setIsAuthOpen(false);
  };

  return (
    <div className="app-container">
      {/* Top App Header */}
      <Header
        profile={profile}
        isLoggedIn={isLoggedIn}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Side Menu Drawer */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        activeSection={activeSection}
        profile={profile}
        trialDaysLeft={trialDaysLeft}
        isLoggedIn={isLoggedIn}
        onClose={() => setIsDrawerOpen(false)}
        onSelectSection={handleSelectSection}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Dashboard View */}
      <DashboardView
        stats={stats}
        invoices={invoices}
        profile={profile}
        trialDaysLeft={trialDaysLeft}
        onNewInvoice={handleCreateInvoiceClick}
        onSelectInvoice={(inv) => setSelectedInvoice(inv)}
        onOpenPaywall={() => setIsPaywallOpen(true)}
      />

      {/* Modals & Dialog Views */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <InvoiceBuilderModal
        isOpen={isInvoiceBuilderOpen}
        servicesCatalog={services}
        clientsList={clients}
        onClose={() => setIsInvoiceBuilderOpen(false)}
        onSaveInvoice={handleSaveInvoice}
      />

      <ServiceCatalogModal
        isOpen={isServiceCatalogOpen}
        services={services}
        onClose={() => setIsServiceCatalogOpen(false)}
        onSaveServices={handleSaveServices}
      />

      <ClientsModal
        isOpen={isClientsOpen}
        clients={clients}
        onClose={() => setIsClientsOpen(false)}
        onSaveClients={handleSaveClients}
      />

      <InvoiceDetailModal
        invoice={selectedInvoice}
        profile={profile}
        onClose={() => setSelectedInvoice(null)}
        onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        profile={profile}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      <PaywallModal
        isOpen={isPaywallOpen || isTrialExpired}
        trialDaysLeft={trialDaysLeft}
        isExpired={isTrialExpired}
        isSubscribed={profile.isSubscribed}
        onClose={() => setIsPaywallOpen(false)}
        onSubscribeSuccess={handleSubscribeSuccess}
        onCancelSubscription={handleCancelSubscription}
        onSimulateExpireTrial={handleSimulateExpireTrial}
      />
    </div>
  );
}

export default App;
