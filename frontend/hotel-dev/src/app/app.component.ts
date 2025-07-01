import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
<main>
  <router-outlet></router-outlet>
</main>

  `,
  styles: [],
})
export class AppComponent {
  title = 'frontend';
}
