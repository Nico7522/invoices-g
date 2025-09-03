import { InvoiceDetails } from '../../invoice/models/invoice-interface';

/**
 * Generate the HTML content for the PDF
 * @param invoice - The invoice details
 * @returns The HTML content for the PDF
 */
export const generatePdfHtml = (invoice: InvoiceDetails): string => {
  const subtotal = invoice.carPartsInvoice.reduce((sum, item) => sum + item.totalPriceExclTax, 0);

  const tableRows = invoice.carPartsInvoice
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${item.price.toFixed(2)} €</td>
        <td style="text-align: right; font-weight: 600;">${item.totalPriceExclTax.toFixed(2)} €</td>
      </tr>
    `
    )
    .join('');

  return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture #${invoice.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            background: #fff;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #4caf50;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .invoice-title h1 {
            color: #4caf50;
            font-size: 32px;
            font-weight: bold;
          }
          
          .invoice-date {
            background: #f0f7f1;
            color: #4caf50;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
          }
          
          .section {
            margin: 30px 0;
          }
          
          .section-title {
            color: #333;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .client-info {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
          }
          
          .info-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          
          .items-table thead {
            background: #4caf50;
            color: white;
          }
          
          .items-table th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .items-table tbody tr {
            border-bottom: 1px solid #e0e0e0;
          }
          
          .items-table tbody tr:hover {
            background: #f5f5f5;
          }
          
          .items-table td {
            padding: 12px;
            font-size: 14px;
          }
          
          .cost-breakdown {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
          }
          
          .cost-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          
          .cost-row.subtotal {
            border-top: 2px solid #4caf50;
            border-bottom: none;
            margin-top: 10px;
            padding-top: 15px;
            font-weight: 600;
            color: #4caf50;
          }
          
          .tax-total-section {
            background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
            padding: 25px;
            border-radius: 8px;
            border: 2px solid #4caf50;
            margin: 30px 0;
          }
          
          .tax-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #4caf50;
            margin-top: 15px;
            padding-top: 15px;
          }
          
          .total-label {
            font-size: 20px;
            font-weight: bold;
            color: #4caf50;
            text-transform: uppercase;
          }
          
          .total-amount {
            font-size: 28px;
            font-weight: bold;
            color: #333;
          }
          
          .invoice-footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          
          .company-info {
            margin-top: 40px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
            text-align: center;
          }
          
          .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #4caf50;
            margin-bottom: 10px;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .invoice-container {
              max-width: 100%;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="invoice-title">
              <h1>Facture #${invoice.id}</h1>
            </div>
            <div class="invoice-date">
              ${
                invoice.createdAt
                  ? new Date(invoice.createdAt).toLocaleDateString('fr-FR')
                  : 'Date non disponible'
              }
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Informations Client</h2>
            <div class="client-info">
              <div class="info-item">
                <span class="info-label">Nom</span>
                <span class="info-value">${invoice.clientInfo.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Prénom</span>
                <span class="info-value">${invoice.clientInfo.surname}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Téléphone</span>
                <span class="info-value">${invoice.clientInfo.phoneNumber}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Pièces et Main d'œuvre</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: center;">Quantité</th>
                  <th style="text-align: right;">Prix Unit.</th>
                  <th style="text-align: right;">Total HT</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
          
          <div class="cost-breakdown">
            <div class="cost-row">
              <span>Sous-total pièces</span>
              <span>${subtotal.toFixed(2)} €</span>
            </div>
            <div class="cost-row">
              <span>Main d'œuvre HT</span>
              <span>${(invoice.laborCostExclTax || 0).toFixed(2)} €</span>
            </div>
            ${
              invoice.otherFeesExclTax
                ? `
              <div class="cost-row">
                <span>Autres frais HT</span>
                <span>${invoice.otherFeesExclTax.toFixed(2)} €</span>
              </div>
            `
                : ''
            }
            <div class="cost-row subtotal">
              <span>Sous-total HT</span>
              <span>${invoice.totalExclTax.toFixed(2)} €</span>
            </div>
          </div>
          
          <div class="tax-total-section">
            <div class="tax-row">
              <span>Taux de TVA</span>
              <span>${invoice.taxRate}%</span>
            </div>
            <div class="tax-row">
              <span>Montant TVA</span>
              <span>${invoice.taxAmount.toFixed(2)} €</span>
            </div>
            <div class="total-row">
              <span class="total-label">TOTAL TTC</span>
              <span class="total-amount">${invoice.totalInclTax.toFixed(2)} €</span>
            </div>
          </div>
          
          <div class="invoice-footer">
            <p>Cette facture a été générée automatiquement le ${new Date().toLocaleDateString(
              'fr-FR'
            )}</p>
            <p>Merci de votre confiance</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
