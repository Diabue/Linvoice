import { jsPDF } from 'jspdf';
import type { Invoice, UserCompanyProfile } from '../types';

// Helper to strip Polish diacritics for standard jsPDF Helvetica font rendering
const latinize = (str: string | undefined | null): string => {
  if (!str) return '';
  const polMap: Record<string, string> = {
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
    Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ó: 'O', Ś: 'S', Ź: 'Z', Ż: 'Z',
  };
  return str.replace(/[ąćęłnósźżĄĆĘŁŃÓŚŹŻ]/g, (m) => polMap[m] || m);
};

export const generateInvoicePDF = (invoice: Invoice, seller: UserCompanyProfile) => {
  const doc = new jsPDF();

  // Typography & Color Palette
  const textColorDark = [15, 23, 42]; // Slate 900
  const textColorMuted = [71, 85, 105]; // Slate 600
  const borderLineColor = [30, 41, 59]; // Dark line accent matching Payt template
  const accentRed = [225, 29, 72]; // Red logo badge accent

  let y = 18;

  // 1. BRAND LOGO / CUSTOM COMPANY LOGO (Top Left)
  if (seller.logoUrl) {
    try {
      // Determine format from base64 string
      const format = seller.logoUrl.includes('image/png') ? 'PNG' : 'JPEG';
      doc.addImage(seller.logoUrl, format, 15, y - 6, 40, 16);
    } catch (err) {
      // Fallback if image format fails
      doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
      doc.roundedRect(15, y - 5, 10, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
      doc.text('linvoice', 28, y + 2.5);
    }
  } else {
    // Default logo badge
    doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.roundedRect(15, y - 5, 10, 10, 2, 2, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1.2);
    doc.line(17.5, y, 19.5, y + 2.5);
    doc.line(19.5, y + 2.5, 22.5, y - 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
    doc.text('linvoice', 28, y + 2.5);
  }

  y += 20;

  // 2. TWO-COLUMN CLIENT (To) & SELLER (From) ADDRESS BLOCK
  // Column 1: TO (Nabywca) at x=15
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  doc.text('Do (Nabywca):', 15, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text(latinize(invoice.client.name), 15, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  
  let clientY = y + 11;
  if (invoice.client.address) {
    doc.text(latinize(invoice.client.address), 15, clientY);
    clientY += 5;
  }
  if (invoice.client.postalCode || invoice.client.city) {
    doc.text(latinize(`${invoice.client.postalCode || ''} ${invoice.client.city || ''}`), 15, clientY);
    clientY += 5;
  }
  if (invoice.client.nip) {
    doc.text(`NIP: ${invoice.client.nip}`, 15, clientY);
    clientY += 5;
  }
  if (invoice.client.phone) {
    doc.text(`Tel: ${invoice.client.phone}`, 15, clientY);
  }

  // Column 2: FROM (Sprzedawca) at x=115
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  doc.text('Od (Sprzedawca):', 115, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text(latinize(seller.name), 115, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
  
  let sellerY = y + 11;
  doc.text(latinize(seller.address), 115, sellerY);
  sellerY += 4.5;
  doc.text(latinize(`${seller.postalCode} ${seller.city}`), 115, sellerY);
  sellerY += 4.5;
  doc.text(`NIP: ${seller.nip}`, 115, sellerY);
  sellerY += 4.5;
  if (seller.bankAccount) {
    doc.text(`IBAN: ${seller.bankAccount}`, 115, sellerY);
    sellerY += 4.5;
  }
  doc.text(`Tel: ${seller.phone}`, 115, sellerY);
  sellerY += 4.5;
  doc.text(`Email: ${seller.email}`, 115, sellerY);

  y = Math.max(clientY, sellerY) + 12;

  // 3. DOCUMENT TITLE & META BLOCK
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  const titleText = invoice.type === 'FAKTURA' ? 'Faktura VAT' : 'Oferta / Wycena';
  doc.text(titleText, 15, y);

  y += 10;
  doc.setFontSize(9.5);
  
  // Meta keys table - FIXED X-OFFSET AT 65mm TO PREVENT TEXT OVERLAP
  const paymentLabel =
    invoice.paymentMethod === 'TRANSFER'
      ? 'Przelew bankowy'
      : invoice.paymentMethod === 'CASH'
      ? 'Gotowka na miejscu'
      : 'Karta platnicza';

  const metaItems = [
    { label: 'Numer dokumentu:', val: invoice.number },
    { label: 'Data wystawienia:', val: invoice.issueDate },
    { label: 'Termin platnosci:', val: invoice.dueDate },
    { label: 'Forma platnosci:', val: paymentLabel },
  ];

  metaItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
    doc.text(item.label, 15, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
    doc.text(item.val, 65, y);
    y += 5.5;
  });

  y += 6;

  // 4. ITEMIZED TABLE HEADER (Clean lines with wide column gaps)
  doc.setDrawColor(borderLineColor[0], borderLineColor[1], borderLineColor[2]);
  doc.setLineWidth(1.0);
  doc.line(15, y, 195, y); // Top table border line

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text('Lp.', 15, y);
  doc.text('Opis uslugi / towaru', 25, y);
  doc.text('Ilosc', 115, y, { align: 'right' });
  doc.text('Cena netto', 145, y, { align: 'right' });
  doc.text('VAT', 165, y, { align: 'right' });
  doc.text('Wartosc brutto', 195, y, { align: 'right' });

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
    const serviceName = latinize(item.name.length > 40 ? item.name.substring(0, 38) + '...' : item.name);
    doc.text(serviceName, 25, y);
    doc.text(`${item.quantity} ${latinize(item.unit)}`, 115, y, { align: 'right' });
    doc.text(`${item.priceNet.toFixed(2)} PLN`, 145, y, { align: 'right' });
    doc.text(`${item.vatRate}%`, 165, y, { align: 'right' });
    doc.text(`${itemGrossTotal.toFixed(2)} PLN`, 195, y, { align: 'right' });

    y += 7.5;
  });

  y += 2;
  doc.setLineWidth(0.6);
  doc.line(15, y, 195, y); // End of table line

  y += 8;

  // 5. SUMMARY TOTALS SECTION (Payt minimal lines with fixed label width)
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
  doc.text('Do zaplaty:', 120, y);
  doc.setFontSize(14);
  doc.text(`${invoice.totalGross.toFixed(2)} PLN`, 195, y, { align: 'right' });

  y += 4;
  doc.setLineWidth(1.0);
  doc.line(120, y, 195, y);

  // 6. PAYMENT INSTRUCTIONS & FOOTER NOTE
  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
  doc.text('Instrukcja platnosci:', 15, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);

  if (invoice.paymentMethod === 'TRANSFER') {
    doc.text(`• Przelew na konto IBAN: ${seller.bankAccount || 'Brak danych'}`, 15, y);
    doc.text(`• Tytul przelewu: ${invoice.number}`, 15, y + 5);
    y += 12;
  } else if (invoice.paymentMethod === 'CASH') {
    doc.text('• Rozliczenie gotowkowe na miejscu u klienta.', 15, y);
    y += 8;
  } else {
    doc.text('• Platnosc karta platnicza.', 15, y);
    y += 8;
  }

  if (invoice.notes) {
    doc.text(latinize(`Uwagi: ${invoice.notes}`), 15, y);
    y += 10;
  }

  // Legal footer at bottom
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Dziekujemy za wspólprace! Prosimy o uregulowanie platnosci w terminie ${invoice.dueDate} podajac numer dokumentu.`,
    15,
    275
  );
  doc.text('Wygenerowano automatycznie w aplikacji linvoice — Szybkie Wyceny i Faktury dla Fachowców', 15, 280);

  // 7. DIRECT NATIVE jsPDF SAVE WITH CLEAN FILENAME
  const cleanNumber = (invoice.number || 'Dokument').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${invoice.type}_${cleanNumber}.pdf`;

  doc.save(filename);
};
