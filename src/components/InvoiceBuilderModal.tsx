import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  FileCheck,
  Zap,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import type { Invoice, ServiceItem, Client, InvoiceLineItem, InvoiceType, PaymentMethod } from '../types';
import { fetchGusData } from '../services/storage';
import confetti from 'canvas-confetti';

interface InvoiceBuilderModalProps {
  isOpen: boolean;
  servicesCatalog: ServiceItem[];
  clientsList: Client[];
  onClose: () => void;
  onSaveInvoice: (invoice: Invoice) => void;
}

export const InvoiceBuilderModal: React.FC<InvoiceBuilderModalProps> = ({
  isOpen,
  servicesCatalog,
  clientsList,
  onClose,
  onSaveInvoice,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [docType, setDocType] = useState<InvoiceType>('OFERTA');

  // Step 1: Client state with ALL fields
  const [clientForm, setClientForm] = useState<Client>({
    id: 'cli-new',
    name: clientsList[0]?.name || 'Jan Kowalski (Budownictwo)',
    nip: clientsList[0]?.nip || '9512489012',
    phone: clientsList[0]?.phone || '+48 501 222 333',
    email: clientsList[0]?.email || 'biuro@firma.pl',
    address: clientsList[0]?.address || 'ul. Grzybowska 45',
    city: clientsList[0]?.city || 'Warszawa',
    postalCode: clientsList[0]?.postalCode || '00-844',
  });

  const [nipInput, setNipInput] = useState('');
  const [isGusSearching, setIsGusSearching] = useState(false);
  const [gusMessage, setGusMessage] = useState('');

  // Step 2: Line items
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item-1',
      serviceId: servicesCatalog[0]?.id || 'srv-1',
      name: servicesCatalog[0]?.name || 'Montaż punktu elektrycznego',
      quantity: 1,
      unit: 'szt.',
      priceNet: servicesCatalog[0]?.priceNet || 150,
      vatRate: 23,
    },
  ]);

  // Step 3: Payment details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER');
  const [notes, setNotes] = useState('Wycena obejmuje komplet materiałów oraz gwarancję na wykonane prace.');

  if (!isOpen) return null;

  // GUS NIP Lookup helper - Updates ALL client fields live
  const handleGusSearch = async () => {
    const targetNip = nipInput.trim() || clientForm.nip || '';
    if (!targetNip) {
      setGusMessage('Wpisz NIP firmy');
      return;
    }

    setIsGusSearching(true);
    setGusMessage('');

    try {
      const found = await fetchGusData(targetNip);
      setIsGusSearching(false);
      if (found) {
        setClientForm({
          id: 'cli-' + Date.now(),
          name: found.name || clientForm.name,
          nip: found.nip || targetNip,
          address: found.address || clientForm.address,
          city: found.city || 'Warszawa',
          postalCode: found.postalCode || '00-100',
          email: found.email || clientForm.email,
          phone: found.phone || clientForm.phone,
        });
        setNipInput(found.nip || targetNip);
        setGusMessage('✅ Zaciągnięto kompletne dane z GUS / MF!');
      } else {
        setGusMessage('Nie znaleziono firmy o podanym NIP w bazie.');
      }
    } catch (e) {
      setIsGusSearching(false);
      setGusMessage('Błąd połączenia z serwerem GUS.');
    }
  };

  // Add catalog service item
  const handleAddFromCatalog = (service: ServiceItem) => {
    const existingIndex = items.findIndex((i) => i.serviceId === service.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          id: 'item-' + Date.now(),
          serviceId: service.id,
          name: service.name,
          quantity: 1,
          unit: service.unit,
          priceNet: service.priceNet,
          vatRate: service.vatRate,
        },
      ]);
    }
  };

  const handleUpdateItemQuantity = (index: number, delta: number) => {
    const updated = [...items];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleAddCustomItem = () => {
    setItems([
      ...items,
      {
        id: 'item-' + Date.now(),
        name: 'Dodatkowa usługa / materiał',
        quantity: 1,
        unit: 'szt.',
        priceNet: 100,
        vatRate: 23,
      },
    ]);
  };

  // Math calculations
  const totalNet = items.reduce((sum, item) => sum + item.priceNet * item.quantity, 0);
  const totalVat = items.reduce((sum, item) => sum + item.priceNet * item.quantity * (item.vatRate / 100), 0);
  const totalGross = totalNet + totalVat;

  const handleComplete = () => {
    const randomId = 'cmt' + Math.random().toString(36).substring(2, 11) + 'rr0o8';
    const numberPrefix = docType === 'FAKTURA' ? 'FV' : 'OF';
    const dateStr = new Date().toISOString().split('T')[0];

    const newInvoice: Invoice = {
      id: randomId,
      number: `${numberPrefix}/2026/08/${Math.floor(Math.random() * 80 + 10)}`,
      type: docType,
      status: 'PENDING',
      issueDate: dateStr,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      client: clientForm,
      items,
      paymentMethod,
      notes,
      totalNet,
      totalVat,
      totalGross,
      createdAt: new Date().toISOString(),
    };

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    onSaveInvoice(newInvoice);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Krok {step} z 3
            </div>
            <div className="modal-title">
              {step === 1 ? 'Typ dokumentu i Dane Klienta' : step === 2 ? 'Zaznacz wykonane usługi' : 'Podsumowanie i Płatność'}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Wizard Steps Content */}
        <div className="modal-body">
          {/* Step 1: Doc type & Client */}
          {step === 1 && (
            <>
              {/* Type Switcher */}
              <div className="form-group">
                <label className="form-label">Rodzaj dokumentu</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '14px',
                      border: docType === 'OFERTA' ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      background: docType === 'OFERTA' ? '#0f172a' : '#ffffff',
                      color: docType === 'OFERTA' ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                    onClick={() => setDocType('OFERTA')}
                  >
                    Wycena / Oferta
                  </button>

                  <button
                    type="button"
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '14px',
                      border: docType === 'FAKTURA' ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      background: docType === 'FAKTURA' ? '#0f172a' : '#ffffff',
                      color: docType === 'FAKTURA' ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                    onClick={() => setDocType('FAKTURA')}
                  >
                    Faktura VAT
                  </button>
                </div>
              </div>

              {/* Instant GUS NIP Lookup */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  <Zap size={16} color="#f59e0b" />
                  <span>Szybkie automatyczne zaciąganie z GUS po NIP</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Wpisz NIP klienta (np. 9512489012 lub 5261040567)"
                    value={nipInput}
                    onChange={(e) => setNipInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-accent"
                    onClick={handleGusSearch}
                    disabled={isGusSearching}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isGusSearching ? 'Pobieranie...' : 'Pobierz dane'}
                  </button>
                </div>
                {gusMessage && (
                  <div style={{ fontSize: '12px', marginTop: '6px', color: gusMessage.includes('Zaciągnięto') ? '#047857' : '#dc2626', fontWeight: 700 }}>
                    {gusMessage}
                  </div>
                )}
              </div>

              {/* Saved Clients Selector */}
              <div className="form-group">
                <label className="form-label">Lub wybierz klienta z bazy</label>
                <select
                  className="form-input"
                  onChange={(e) => {
                    const found = clientsList.find((c) => c.id === e.target.value);
                    if (found) {
                      setClientForm(found);
                      if (found.nip) setNipInput(found.nip);
                    }
                  }}
                >
                  <option value="">-- Wybierz klienta z listy --</option>
                  {clientsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.nip ? `(NIP: ${c.nip})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Details Preview - ALL FIELDS VISIBLE AND EDITABLE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  PEŁNE DANE KLIENTA NA FAKTURZE / WYCENIE
                </div>

                <div className="form-group">
                  <label className="form-label">Nazwa Firmy / Imię i Nazwisko</label>
                  <input
                    type="text"
                    className="form-input"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="form-group">
                    <label className="form-label">NIP</label>
                    <input
                      type="text"
                      className="form-input"
                      value={clientForm.nip || ''}
                      onChange={(e) => setClientForm({ ...clientForm, nip: e.target.value })}
                      placeholder="brak (osoba prywatna)"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefon kontaktowy</label>
                    <input
                      type="text"
                      className="form-input"
                      value={clientForm.phone || ''}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                      placeholder="+48 600..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Adres ulica i numer</label>
                  <input
                    type="text"
                    className="form-input"
                    value={clientForm.address || ''}
                    onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                    placeholder="ul. Budowlanych 12 m. 4"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="form-group">
                    <label className="form-label">Kod pocztowy</label>
                    <input
                      type="text"
                      className="form-input"
                      value={clientForm.postalCode || ''}
                      onChange={(e) => setClientForm({ ...clientForm, postalCode: e.target.value })}
                      placeholder="00-844"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Miasto</label>
                    <input
                      type="text"
                      className="form-input"
                      value={clientForm.city || ''}
                      onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                      placeholder="Warszawa"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail do wysyłki faktury</label>
                  <input
                    type="email"
                    className="form-input"
                    value={clientForm.email || ''}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="biuro@klient.pl"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Pick from Service Catalog */}
          {step === 2 && (
            <>
              <div style={{ background: '#eff6ff', padding: '12px 14px', borderRadius: '12px', color: '#1e40af', fontSize: '13px', fontWeight: 600 }}>
                💡 Klikaj przyciski <b>+</b> przy usługach, aby dodać je do faktury. Możesz dostosować ilości na żywo na budowie.
              </div>

              <label className="form-label">Szybki Katalog Twoich Usług</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                {servicesCatalog.map((srv) => (
                  <div key={srv.id} className="catalog-item-row">
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{srv.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {srv.priceNet.toFixed(2)} PLN netto / {srv.unit} (VAT {srv.vatRate}%)
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-accent"
                      style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleAddFromCatalog(srv)}
                    >
                      <Plus size={14} />
                      <span>Dodaj</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Added Line Items Table */}
              <div style={{ marginTop: '12px' }}>
                <label className="form-label">Pozycje na dokumencie ({items.length})</label>
                {items.length === 0 ? (
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    Brak dodanych pozycji. Wybierz usługę z katalogu powyżej.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    {items.map((item, index) => (
                      <div key={item.id} style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[index].name = e.target.value;
                              setItems(updated);
                            }}
                            style={{ fontWeight: 700, padding: '6px 10px' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              className="counter-btn"
                              onClick={() => handleUpdateItemQuantity(index, -1)}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 800, fontSize: '14px', width: '28px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="counter-btn"
                              onClick={() => handleUpdateItemQuantity(index, 1)}
                            >
                              +
                            </button>
                            <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>{item.unit}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Cena netto:</span>
                            <input
                              type="number"
                              className="form-input"
                              value={item.priceNet}
                              onChange={(e) => {
                                const updated = [...items];
                                updated[index].priceNet = parseFloat(e.target.value) || 0;
                                setItems(updated);
                              }}
                              style={{ width: '90px', padding: '4px 8px', textAlign: 'right', fontWeight: 700 }}
                            />
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>PLN</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddCustomItem}
                  style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Plus size={16} />
                  <span>Wpisz niestandardową pozycję</span>
                </button>
              </div>
            </>
          )}

          {/* Step 3: Summary & Payment */}
          {step === 3 && (
            <>
              {/* Calculations Box */}
              <div style={{ background: '#0f172a', color: '#ffffff', padding: '20px', borderRadius: '16px' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Razem do zapłaty (Brutto):</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginTop: '4px', letterSpacing: '-0.5px' }}>
                  {totalGross.toFixed(2)} PLN
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#cbd5e1', marginTop: '8px', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                  <span>Suma Netto: <b>{totalNet.toFixed(2)} PLN</b></span>
                  <span>Suma VAT: <b>{totalVat.toFixed(2)} PLN</b></span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="form-group">
                <label className="form-label">Sposób płatności</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    style={{
                      padding: '12px 6px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      border: paymentMethod === 'TRANSFER' ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      background: paymentMethod === 'TRANSFER' ? '#0f172a' : '#ffffff',
                      color: paymentMethod === 'TRANSFER' ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                    onClick={() => setPaymentMethod('TRANSFER')}
                  >
                    <span>🏦 Przelew</span>
                  </button>

                  <button
                    type="button"
                    style={{
                      padding: '12px 6px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      border: paymentMethod === 'CASH' ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      background: paymentMethod === 'CASH' ? '#0f172a' : '#ffffff',
                      color: paymentMethod === 'CASH' ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                    onClick={() => setPaymentMethod('CASH')}
                  >
                    <span>💵 Gotówka</span>
                  </button>

                  <button
                    type="button"
                    style={{
                      padding: '12px 6px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      border: paymentMethod === 'CARD' ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      background: paymentMethod === 'CARD' ? '#0f172a' : '#ffffff',
                      color: paymentMethod === 'CARD' ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                    onClick={() => setPaymentMethod('CARD')}
                  >
                    <span>💳 Karta</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">Uwagi na dokument (np. termin ważności / gwarancja)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer">
          {step > 1 && (
            <button className="btn-secondary" onClick={() => setStep((prev) => (prev - 1) as any)}>
              <ChevronLeft size={16} />
              <span>Wstecz</span>
            </button>
          )}

          {step < 3 ? (
            <button
              className="btn-accent"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              disabled={items.length === 0}
            >
              <span>Dalej</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn-primary-action" onClick={handleComplete} style={{ width: 'auto' }}>
              <FileCheck size={18} />
              <span>Wygeneruj {docType === 'FAKTURA' ? 'Fakturę' : 'Ofertę'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
