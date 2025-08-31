import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-error-card',
  imports: [CardModule],
  templateUrl: './error-card.html',
  styleUrl: './error-card.scss',
})
export class ErrorCard {
  message = input.required<string>();
}
