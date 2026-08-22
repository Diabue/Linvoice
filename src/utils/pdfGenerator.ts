import { jsPDF } from 'jspdf';
import type { Invoice, UserCompanyProfile } from '../types';

export const generateInvoicePDF = (invoice: Invoice, seller: UserCompanyProfile) => {
  const doc = new jsPDF();
  
  // Color palette
  const primaryColor = [15, 23, 42]; // Slate 900
  const secondaryColor = [71, 85, 105]; // Slate 600

  // Header Title
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  const docTypeLabel = invoice.type === 'FAKTURA' ? 'FAKTURA VAT' : 'OFERTA / WYCENA';
  doc.text(docTypeLabel, 15, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nr: ${invoice.number}`, 210 - 15, 18, { align: 'right' });

  // Dates & Info Box
  let y = 38;
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.text(`Data wystawienia: ${invoice.issueDate}`, 15, y);
  doc.text(`Termin płatności: ${invoice.dueDate}`, 105, y);
  doc.text(`Forma płatności: ${invoice.paymentMethod}`, 15, y + 6);
  doc.text(`Status: ${invoice.status === 'PAID' ? 'OPŁACONA' : invoice.status === 'ACCEPTED' ? 'ZAAKCEPTOWANA' : 'OCZEKUJĄCA'}`, 105, y + 6);

  y += 18;

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, 195, y);
  y += 10;

  // Seller / Buyer Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('SPRZEDAWCA / WYKONAWCA:', 15, y);
  doc.text('NABYWCA / ZLECENIODAWCA:', 110, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  // Seller Details
  doc.setFont('helvetica', 'bold');
  doc.text(seller.name, 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP: ${seller.nip}`, 15, y + 5);
  doc.text(`${seller.address}, ${seller.postalCode} ${seller.city}`, 15, y + 10);
  doc.text(`Tel: ${seller.phone} | Email: ${seller.email}`, 15, y + 15);
  if (seller.bankAccount) {
    doc.text(`Konto Bankowe: ${seller.bankAccount}`, 15, y + 20);
  }

  // Buyer Details
  const client = invoice.client;
  doc.setFont('helvetica', 'bold');
  doc.text(client.name, 110, y);
  doc.setFont('helvetica', 'normal');
  if (client.nip) doc.text(`NIP: ${client.nip}`, 110, y + 5);
  if (client.address) doc.text(`${client.address}, ${client.postalCode || ''} ${client.city || ''}`, 110, y + 10);
  if (client.phone) doc.text(`Tel: ${client.phone}`, 110, y + 15);
  if (client.email) doc.text(`Email: ${client.email}`, 110, y + 20);

  y += 32;

  // Items Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 180, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Lp.', 18, y + 5.5);
  doc.text('Nazwa usługi / materiału', 30, y + 5.5);
  doc.text('Ilość', 115, y + 5.5, { align: 'center' });
  doc.text('Cena netto', 140, y + 5.5, { align: 'right' });
  doc.text('VAT', 160, y + 5.5, { align: 'center' });
  doc.text('Wartość brutto', 190, y + 5.5, { align: 'right' });

  y += 10;

  // Items Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  invoice.items.forEach((item, index) => {
    const vatFactor = 1 + item.vatRate / 100;
    const itemNetTotal = item.priceNet * item.quantity;
    const itemGrossTotal = itemNetTotal * vatFactor;

    doc.text(`${index + 1}`, 18, y);
    
    const serviceName = item.name.length > 45 ? item.name.substring(0, 43) + '...' : item.name;
    doc.text(serviceName, 30, y);
    
    doc.text(`${item.quantity} ${item.unit}`, 115, y, { align: 'center' });
    doc.text(`${item.priceNet.toFixed(2)} PLN`, 140, y, { align: 'right' });
    doc.text(`${item.vatRate}%`, 160, y, { align: 'center' });
    doc.text(`${itemGrossTotal.toFixed(2)} PLN`, 190, y, { align: 'right' });

    y += 7;
  });

  y += 4;
  doc.line(15, y, 195, y);
  y += 8;

  // Totals Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Suma Netto:', 125, y);
  doc.text(`${invoice.totalNet.toFixed(2)} PLN`, 190, y, { align: 'right' });

  y += 6;
  doc.text('Suma VAT:', 125, y);
  doc.text(`${invoice.totalVat.toFixed(2)} PLN`, 190, y, { align: 'right' });

  y += 8;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(120, y - 5, 75, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('DO ZAPŁATY:', 125, y + 1.5);
  doc.text(`${invoice.totalGross.toFixed(2)} PLN`, 190, y + 1.5, { align: 'right' });

  y += 18;

  // Payment Note & Quick Pay QR Simulation
  if (seller.blikPhone || seller.bankAccount) {
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Szybka płatność na miejscu:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

    if (invoice.paymentMethod === 'BLIK' && seller.blikPhone) {
      doc.text(`Przelew na telefon BLIK: +48 ${seller.blikPhone}`, 15, y + 5);
      doc.text(`Tytuł płatności: ${invoice.number}`, 15, y + 10);
    } else {
      doc.text(`Przelew tradycyjny IBAN: ${seller.bankAccount}`, 15, y + 5);
      doc.text(`Tytuł płatności: ${invoice.number}`, 15, y + 10);
    }
  }

  if (invoice.notes) {
    y += 20;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text(`Uwagi: ${invoice.notes}`, 15, y);
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Wygenerowano automatycznie w aplikacji linvoice - Szybkie Faktury i Oferty dla Fachowców', 105, 285, { align: 'center' });

  // Save PDF
  const filename = `${invoice.number.replace(/\//g, '_')}.pdf`;
  doc.save(filename);
};
