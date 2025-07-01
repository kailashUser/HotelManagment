import { Component } from '@angular/core';
import { CustomerSidebarComponent } from './customer-sidebar.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CustomerSidebarComponent],
  template: `
    <div class="customer-layout d-flex flex-column min-vh-100">
      <div class="main-container flex-grow-1 d-flex">
        <app-customer-sidebar></app-customer-sidebar>
        <main class="content flex-grow-1">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .customer-layout {
      min-height: 100vh;
    }
    .main-container {
      display: flex;
      flex: 1;
    }
    .content {
      flex: 1;
      padding: 20px;
      background-color: #f8f9fa;
    }
  `]
})
export class CustomerLayoutComponent {} 