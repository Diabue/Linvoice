import React, { useState } from 'react';
import { Plus, Trash2, Wrench } from 'lucide-react';
import type { ServiceItem } from '../types';

interface ServiceCatalogModalProps {
  isOpen: boolean;
  services: ServiceItem[];
  onClose: () => void;
  onSaveServices: (services: ServiceItem[]) => void;
}

export const ServiceCatalogModal: React.FC<ServiceCatalogModalProps> = ({
  isOpen,
  services,
  onClose,
  onSaveServices,
}) => {
  const [list, setList] = useState<ServiceItem[]>(services);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Hydraulika' | 'Elektryka' | 'HVAC' | 'Drobne Naprawy' | 'Inne'>('Hydraulika');
  const [newUnit, setNewUnit] = useState<'szt.' | 'godz.' | 'usługa' | 'm' | 'kpl.'>('usługa');
  const [newPrice, setNewPrice] = useState('200');
  const [newVat, setNewVat] = useState('23');

  if (!isOpen) return null;

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newService: ServiceItem = {
      id: 'srv-' + Date.now(),
      name: newName.trim(),
      category: newCategory,
      unit: newUnit,
      priceNet: parseFloat(newPrice) || 100,
      vatRate: parseInt(newVat, 10) || 23,
    };

    const updated = [newService, ...list];
    setList(updated);
    onSaveServices(updated);
    setNewName('');
    setIsAddingNew(false);
  };

  const handleDeleteService = (id: string) => {
    const updated = list.filter((s) => s.id !== id);
    setList(updated);
    onSaveServices(updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={20} />
            <span className="modal-title">Twój Katalog Usług & Cennik</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Zapisane usługi: <b>{list.length}</b>
            </span>
            <button
              className="btn-accent"
              style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setIsAddingNew(!isAddingNew)}
            >
              <Plus size={16} />
              <span>Dodaj nową usługę</span>
            </button>
          </div>

          {/* New Service Form */}
          {isAddingNew && (
            <form onSubmit={handleAddService} style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Nazwa usługi / czynności</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="np. Wymiana bezpiecznika w rozdzielnicy"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Kategoria</label>
                  <select
                    className="form-input"
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                  >
                    <option value="Hydraulika">Hydraulika</option>
                    <option value="Elektryka">Elektryka</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Drobne Naprawy">Drobne Naprawy</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Jednostka</label>
                  <select
                    className="form-input"
                    value={newUnit}
                    onChange={(e: any) => setNewUnit(e.target.value)}
                  >
                    <option value="szt.">szt.</option>
                    <option value="usługa">usługa</option>
                    <option value="godz.">godz.</option>
                    <option value="kpl.">kpl.</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Cena netto (PLN)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stawka VAT %</label>
                  <select
                    className="form-input"
                    value={newVat}
                    onChange={(e) => setNewVat(e.target.value)}
                  >
                    <option value="23">23%</option>
                    <option value="8">8%</option>
                    <option value="0">0% (zw.)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsAddingNew(false)}>
                  Anuluj
                </button>
                <button type="submit" className="btn-accent">
                  Zapisz usługę
                </button>
              </div>
            </form>
          )}

          {/* List of Catalog Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {list.map((srv) => (
              <div key={srv.id} className="catalog-item-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: '#e2e8f0',
                        color: '#334155',
                        marginRight: '6px',
                      }}
                    >
                      {srv.category}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{srv.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                  <span>Cena netto: <b>{srv.priceNet.toFixed(2)} PLN / {srv.unit}</b></span>
                  <span>Brutto (VAT {srv.vatRate}%): <b>{(srv.priceNet * (1 + srv.vatRate / 100)).toFixed(2)} PLN</b></span>
                </div>
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
