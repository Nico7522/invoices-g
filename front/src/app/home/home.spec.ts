import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';

import { Home } from './home';
import { InvoiceService } from '../invoice/services/invoice-service';
import { GetClientService } from '../shared/services/client/get-client-service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let mockInvoiceService: jasmine.SpyObj<InvoiceService>;
  let mockClientService: jasmine.SpyObj<GetClientService>;

  beforeEach(async () => {
    const invoiceServiceSpy = jasmine.createSpyObj('InvoiceService', ['getInvoices']);
    const clientServiceSpy = jasmine.createSpyObj('GetClientService', [], {
      clients: jasmine.createSpyObj('clients', ['value']),
    });

    await TestBed.configureTestingModule({
      imports: [Home, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: InvoiceService, useValue: invoiceServiceSpy },
        { provide: GetClientService, useValue: clientServiceSpy },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    mockInvoiceService = TestBed.inject(InvoiceService) as jasmine.SpyObj<InvoiceService>;
    mockClientService = TestBed.inject(GetClientService) as jasmine.SpyObj<GetClientService>;

    // Mock the services to return empty arrays by default
    mockInvoiceService.getInvoices.and.returnValue({
      value: () => [],
    } as any);
    mockClientService.clients = {
      value: () => [],
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data', () => {
    expect(component.totalInvoices()).toBe(0);
    expect(component.totalClients()).toBe(0);
    expect(component.totalRevenue()).toBe(0);
    expect(component.averageInvoiceValue()).toBe(0);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1234.56);
    expect(formatted).toContain('1 234,56');
    expect(formatted).toContain('€');
  });

  it('should format date correctly', () => {
    const testDate = '2024-01-15T10:30:00Z';
    const formatted = component.formatDate(testDate);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('should format month correctly', () => {
    const formatted = component.formatMonth('2024-01');
    expect(formatted).toMatch(/janv\.\s*24/);
  });

  it('should calculate bar height correctly', () => {
    // Mock monthly revenue data
    spyOn(component, 'monthlyRevenue').and.returnValue([
      { month: '2024-01', revenue: 1000 },
      { month: '2024-02', revenue: 2000 },
    ]);

    const height = component.getBarHeight(1000);
    expect(height).toBe(50); // 1000 / 2000 * 100
  });

  it('should return correct invoice status', () => {
    const recentInvoice = {
      id: '1',
      totalExclTax: 100,
      totalInclTax: 120,
      createdAt: new Date().toISOString(),
    };

    const status = component.getInvoiceStatus(recentInvoice as any);
    expect(status).toBe('Récent');
  });

  it('should return correct invoice severity', () => {
    const recentInvoice = {
      id: '1',
      totalExclTax: 100,
      totalInclTax: 120,
      createdAt: new Date().toISOString(),
    };

    const severity = component.getInvoiceSeverity(recentInvoice as any);
    expect(severity).toBe('success');
  });
});
