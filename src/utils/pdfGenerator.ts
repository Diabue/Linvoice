import { jsPDF } from 'jspdf';
import type { Invoice, UserCompanyProfile } from '../types';

export const generateInvoicePDF = (invoice: Invoice, seller: UserCompanyProfile) => {
  const doc = new jsPDF();

  // Typography & Color Palette
  const textColorDark = [15, 23, 42]; // Slate 900
  const textColorMuted = [71, 85, 105]; // Slate 600
  const borderLineColor = [30, 41, 59]; // Dark line accent matching Payt template
  const accentRed = [225, 29, 72]; // Red logo badge accent

  let y = 18;

  // 1. BRAND LOGO BADGE (Top Left)
  // Draw [V] Red badge + Payt style linvoice typography
  doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
  doc.roundedRect(15, y - 5, 10, 10, 2, 2, 'F');
  
  // Checkmark in badge
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.2);
  doc.line(17.5, y, 19.5, y + 2.5);
  doc.line(19.5, y + 2.5, 22.5, y - 2);

  // Logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text('linvoice', 28, y + 2.5);

  y += 18;

  // 2. TWO-COLUMN CLIENT (To) & SELLER (From) ADDRESS BLOCK
  // Column 1: TO (Nabywca) at x=15
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  doc.text('Do (Nabywca):', 15, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text(invoice.client.name, 15, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  
  let clientY = y + 11;
  if (invoice.client.address) {
    doc.text(invoice.client.address, 15, clientY);
    clientY += 5;
  }
  if (invoice.client.postalCode || invoice.client.city) {
    doc.text(`${invoice.client.postalCode || ''} ${invoice.client.city || ''}`, 15, clientY);
    clientY += 5;
  }
  if (invoice.client.nip) {
    doc.text(`NIP: ${invoice.client.nip}`, 15, clientY);
    clientY += 5;
  }
  if (invoice.client.phone) {
    doc.text(`Tel: ${invoice.client.phone}`, 15, clientY);
  }

  // Column 2: FROM (Sprzedawca) at x=120
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  doc.text('Od (Sprzedawca):', 120, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text(seller.name, 120, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  
  let sellerY = y + 11;
  doc.text(`${seller.address}`, 120, sellerY);
  sellerY += 4.5;
  doc.text(`${seller.postalCode} ${seller.city}`, 120, sellerY);
  sellerY += 4.5;
  doc.text(`NIP: ${seller.nip}`, 120, sellerY);
  sellerY += 4.5;
  if (seller.bankAccount) {
    doc.text(`IBAN: ${seller.bankAccount}`, 120, sellerY);
    sellerY += 4.5;
  }
  doc.text(`Tel: ${seller.phone}`, 120, sellerY);
  sellerY += 4.5;
  doc.text(`Email: ${seller.email}`, 120, sellerY);

  y = Math.max(clientY, sellerY) + 12;

  // 3. DOCUMENT TITLE & META BLOCK
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  const titleText = invoice.type === 'FAKTURA' ? 'Faktura VAT' : 'Oferta / Wycena';
  doc.text(titleText, 15, y);

  y += 10;
  doc.setFontSize(9.5);
  
  // Meta keys table
  const metaItems = [
    { label: 'Numer dokumentu:', val: invoice.number },
    { label: 'Data wystawienia:', val: invoice.issueDate },
    { label: 'Termin płatności:', val: invoice.dueDate },
    { label: 'Forma płatności:', val: invoice.paymentMethod === 'BLIK' ? 'Płatność BLIK' : 'Przelew bankowy' },
  ];

  metaItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
    doc.text(item.label, 15, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
    doc.text(item.val, 55, y);
    y += 5.5;
  });

  y += 6;

  // 4. PAYT-STYLE ITEMIZED TABLE HEADER (Thick Border Line top & bottom)
  doc.setDrawColor(borderLineColor[0], borderLineColor[1], borderLineColor[2]);
  doc.setLineWidth(1.0);
  doc.line(15, y, 195, y); // Top table border line

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text('Lp.', 15, y);
  doc.text('Opis usługi / towaru', 25, y);
  doc.text('Ilość', 110, y, { align: 'right' });
  doc.text('Cena netto', 145, y, { align: 'right' });
  doc.text('VAT', 165, y, { align: 'right' });
  doc.text('Wartość brutto', 195, y, { align: 'right' });

  y += 3;
  doc.setLineWidth(0.6);
  doc.line(15, y, 195, y); // Header bottom line

  y += 7;

  // Table items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);

  invoice.items.forEach((item, idx) => {
    const vatFactor = 1 + item.vatRate / 100;
    const itemNetTotal = item.priceNet * item.quantity;
    const itemGrossTotal = itemNetTotal * vatFactor;

    doc.text(`${idx + 1}`, 15, y);
    const serviceName = item.name.length > 42 ? item.name.substring(0, 40) + '...' : item.name;
    doc.text(serviceName, 25, y);
    doc.text(`${item.quantity} ${item.unit}`, 110, y, { align: 'right' });
    doc.text(`${item.priceNet.toFixed(2)} PLN`, 145, y, { align: 'right' });
    doc.text(`${item.vatRate}%`, 165, y, { align: 'right' });
    doc.text(`${itemGrossTotal.toFixed(2)} PLN`, 195, y, { align: 'right' });

    y += 7.5;
  });

  y += 2;
  doc.setLineWidth(0.6);
  doc.line(15, y, 195, y); // End of table line

  y += 8;

  // 5. SUMMARY TOTALS SECTION (Payt minimal lines)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  doc.text('Suma netto (excl. VAT):', 120, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text(`${invoice.totalNet.toFixed(2)} PLN`, 195, y, { align: 'right' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  doc.text('Suma VAT:', 120, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text(`${invoice.totalVat.toFixed(2)} PLN`, 195, y, { align: 'right' });

  y += 4;
  doc.setLineWidth(0.6);
  doc.line(120, y, 195, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text('Do zapłaty (Amount due):', 120, y);
  doc.setFontSize(14);
  doc.text(`${invoice.totalGross.toFixed(2)} PLN`, 195, y, { align: 'right' });

  y += 4;
  doc.setLineWidth(1.0);
  doc.line(120, y, 195, y);

  // 6. PAYMENT INSTRUCTIONS & FOOTER NOTE (Matching Payt footer)
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text('Instrukcja płatności:', 15, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);

  if (invoice.paymentMethod === 'BLIK' && seller.blikPhone) {
    doc.text(`• Przelew na telefon BLIK: +48 ${seller.blikPhone}`, 15, y);
    doc.text(`• Tytuł przelewu: ${invoice.number}`, 15, y + 5);
    y += 12;
  } else {
    doc.text(`• Przelew na konto IBAN: ${seller.bankAccount || 'Brak danych'}`, 15, y);
    doc.text(`• Tytuł przelewu: ${invoice.number}`, 15, y + 5);
    y += 12;
  }

  if (invoice.notes) {
    doc.text(`Uwagi: ${invoice.notes}`, 15, y);
    y += 10;
  }

  // Legal footer at bottom matching Payt sample
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Dziękujemy za współpracę! Prosimy o uregulowanie płatności w terminie ${invoice.dueDate} podając numer dokumentu.`,
    15,
    275
  );
  doc.text('Wygenerowano automatycznie w aplikacji linvoice — Szybkie Wyceny i Faktury dla Fachowców', 15, 280);

  // Save PDF file
  const filename = `${invoice.number.replace(/\//g, '_')}.pdf`;
  doc.save(filename);
};
