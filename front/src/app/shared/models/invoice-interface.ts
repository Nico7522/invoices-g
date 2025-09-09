import { CarPart } from './cart-part-interface';

export interface Invoice {
  id: string;
  totalExclTax: number;
  createdAt: string;
  totalInclTax: number;
}

export interface InvoiceDetails extends Invoice {
  clientInfo: {
    name: string;
    surname: string;
    phoneNumber: number;
  };
  clientId: string;
  taxAmount: number;
  taxRate: number;
  laborCostExclTax: number;
  otherFeesExclTax: number | null;
  updatedAt: string;
  carPartsInvoice: CarPartInvoice[];
}

export interface CarPartInvoice extends CarPart {
  totalPriceExclTax: number;
  quantity: number;
}
