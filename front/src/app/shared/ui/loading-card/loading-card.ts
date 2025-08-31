import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-loading-card',
  imports: [CardModule],
  templateUrl: './loading-card.html',
  styleUrl: './loading-card.scss',
})
export class LoadingCard {
  message = input.required<string>();
}
