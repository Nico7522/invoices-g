import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';

import { Invoice } from '../shared/models/invoice-interface';
import { HomeService } from './services/home-service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    ProgressBarModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly #homeService = inject(HomeService);

  // Data signals
  invoices = this.#homeService.lastInvoices;
  clients = this.#homeService.lastClients;

  // Computed statistics
  totalInvoices = computed(() => {
    if (this.invoices.hasValue()) {
      return this.invoices.value().length;
    }
    return 0;
  });
  totalClients = computed(() => {
    if (this.clients.hasValue()) {
      return this.clients.value().length;
    }
    return 0;
  });

  totalRevenue = computed(() => {
    if (this.invoices.hasValue()) {
      return this.invoices.value().reduce((sum, invoice) => sum + invoice.totalInclTax, 0);
    }
    return 0;
  });

  totalRevenueExclTax = computed(() => {
    if (this.invoices.hasValue()) {
      return this.invoices.value().reduce((sum, invoice) => sum + invoice.totalExclTax, 0);
    }
    return 0;
  });

  averageInvoiceValue = computed(() => {
    const total = this.totalInvoices();
    return total > 0 ? this.totalRevenue() / total : 0;
  });

  // Recent invoices (last 5)
  recentInvoices = computed(() => {
    if (this.invoices.hasValue()) {
      this.invoices
        .value()
        ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    }
    return [];
  });

  // Recent clients (last 5)
  recentClients = computed(() => {
    if (this.clients.hasValue()) {
      return this.clients.value().slice(0, 5);
    }
    return [];
  });

  // Monthly revenue trend (last 6 months)
  monthlyRevenue = computed(() => {
    const invoices = this.invoices.value() ?? [];
    const monthlyData = new Map<string, number>();

    invoices.forEach((invoice) => {
      const date = new Date(invoice.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + invoice.totalInclTax);
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, revenue]) => ({ month, revenue }));
  });

  // Helper methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  getInvoiceStatus(invoice: Invoice): string {
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(invoice.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreation <= 7) return 'Récent';
    if (daysSinceCreation <= 30) return 'En cours';
    return 'Ancien';
  }

  getInvoiceSeverity(invoice: Invoice): 'success' | 'warning' | 'info' {
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(invoice.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreation <= 7) return 'success';
    if (daysSinceCreation <= 30) return 'warning';
    return 'info';
  }

  getBarHeight(revenue: number): number {
    const maxRevenue = Math.max(...this.monthlyRevenue().map((m) => m.revenue));
    return maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
  }

  formatMonth(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
  }
}
