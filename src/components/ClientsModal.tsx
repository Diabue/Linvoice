import React, { useState } from 'react';
import { Users, Plus, Trash2, Search } from 'lucide-react';
import type { Client } from '../types';
import { fetchGusData } from '../services/storage';

interface ClientsModalProps {
  isOpen: boolean;
  clients: Client[];
  onClose: () => void;
  onSaveClients: (clients: Client[]) => void;
}

export const ClientsModal: React.FC<ClientsModalProps> = ({
  isOpen,
  clients,
  onClose,
  onSaveClients,
}) => {
  const [list, setList] = useState<Client[]>(clients);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [search, setSearch] = useState('');
  const [isSearchingGus, setIsSearchingGus] = useState(false);

  if (!isOpen) return null;

  const handleGusFetch = async () => {
    if (!nip) return;
    setIsSearchingGus(true);
    try {
      const found = await fetchGusData(nip);
      setIsSearchingGus(false);
      if (found) {
        setName(found.name || '');
        setAddress(found.address || '');
        if (found.email) setEmail(found.email);
        if (found.phone) setPhone(found.phone);
      }
    } catch (e) {
      setIsSearchingGus(false);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newClient: Client = {
      id: 'cli-' + Date.now(),
      name: name.trim(),
      nip: nip.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
    };

    const updated = [newClient, ...list];
    setList(updated);
    onSaveClients(updated);

    setName('');
    setNip('');
    setPhone('');
    setEmail('');
    setAddress('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = list.filter((c) => c.id !== id);
    setList(updated);
    onSaveClients(updated);
  };

  const filtered = list.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.nip && c.nip.includes(search)) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} />
            <span className="modal-title">Baza Klientów</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Klientów w bazie: <b>{list.length}</b>
            </span>
            <button
              className="btn-accent"
              style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setIsAdding(!isAdding)}
            >
              <Plus size={16} />
              <span>Dodaj Klienta</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Szukaj klienta po nazwie lub NIP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Add New Client Form */}
          {isAdding && (
            <form onSubmit={handleAdd} style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="NIP Klienta (opcjonalnie)"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                />
                <button type="button" className="btn-secondary" onClick={handleGusFetch} disabled={isSearchingGus} style={{ whiteSpace: 'nowrap' }}>
                  {isSearchingGus ? 'Pobieranie...' : 'Zaciągnij z GUS'}
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Nazwa Klienta / Firma</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="np. Jan Kowalski lub Firma Budowlana Sp. z o.o."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Telefon (+48...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <input
                type="text"
                className="form-input"
                placeholder="Adres i miasto"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>Anuluj</button>
                <button type="submit" className="btn-accent">Zapisz Klienta</button>
              </div>
            </form>
          )}

          {/* List of Clients */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map((client) => (
              <div key={client.id} style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{client.name}</div>
                  {client.nip && <div style={{ fontSize: '12px', color: '#64748b' }}>NIP: {client.nip}</div>}
                  {client.phone && <div style={{ fontSize: '12px', color: '#64748b' }}>Tel: {client.phone}</div>}
                </div>
                <button
                  onClick={() => handleDelete(client.id)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Zamknij</button>
        </div>
      </div>
    </div>
  );
};
