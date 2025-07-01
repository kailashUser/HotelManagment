import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerLayoutComponent } from './shared/customer-layout.component';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, RouterModule, CustomerLayoutComponent],
  template: `
    <app-customer-layout>
      <router-outlet></router-outlet>
    </app-customer-layout>
  `,
  styles: []
})
export class CustomerComponent {
  constructor() {}
} 