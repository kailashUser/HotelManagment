import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagerSidebarComponent } from './manager-sidebar.component';

@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [RouterOutlet, ManagerSidebarComponent],
  template: `
    <div class="manager-layout">
      <app-manager-sidebar></app-manager-sidebar>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .manager-layout {
      display: flex;
      min-height: 100vh;
    }
    .content {
      flex: 1;
      padding: 20px;
      background-color: #f8f9fa;
    }
  `]
})
export class ManagerLayoutComponent { } 